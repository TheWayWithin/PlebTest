import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import {
  checkRateLimit,
  getClientIP,
  type RateLimitCategory,
} from '@/lib/ratelimit'

/**
 * Determine the rate limit category for an API route
 */
function getApiRateLimitCategory(
  pathname: string,
  isAuthenticated: boolean
): RateLimitCategory | null {
  // Quick Fire has its own built-in rate limiting
  if (pathname === '/api/quick-fire') {
    return null // Handled in route itself
  }

  // Waitlist signups
  if (pathname === '/api/waitlist') {
    return 'waitlist'
  }

  // AI-heavy operations (sessions, report generation, persona generation)
  const aiOperations = [
    '/api/sessions',
    '/generate-report',
    '/generate-personas',
  ]
  const isAiOperation = aiOperations.some(
    (op) => pathname.includes(op)
  )

  if (isAiOperation) {
    return isAuthenticated ? 'ai_auth' : 'ai_anon'
  }

  // General API operations
  if (pathname.startsWith('/api/')) {
    return isAuthenticated ? 'api_auth' : 'api_anon'
  }

  return null
}

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: Do not write any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Rate limiting for API routes
  const pathname = request.nextUrl.pathname
  const rateLimitCategory = getApiRateLimitCategory(pathname, !!user)

  if (rateLimitCategory) {
    try {
      // Use user ID for authenticated users, IP for anonymous
      const identifier = user?.id || getClientIP(request)
      const result = await checkRateLimit(rateLimitCategory, identifier)

      if (!result.success) {
        const retryAfter = Math.ceil((result.reset - Date.now()) / 1000)
        return NextResponse.json(
          {
            error: 'rate_limit',
            message: 'Too many requests. Please try again later.',
            retryAfter,
          },
          {
            status: 429,
            headers: {
              'Retry-After': retryAfter.toString(),
              'X-RateLimit-Limit': result.limit.toString(),
              'X-RateLimit-Remaining': '0',
              'X-RateLimit-Reset': result.reset.toString(),
            },
          }
        )
      }

      // Add rate limit headers to successful responses
      supabaseResponse.headers.set('X-RateLimit-Limit', result.limit.toString())
      supabaseResponse.headers.set(
        'X-RateLimit-Remaining',
        result.remaining.toString()
      )
      supabaseResponse.headers.set('X-RateLimit-Reset', result.reset.toString())
    } catch (rateLimitError) {
      // Log but don't block requests if rate limiting fails
      console.error('Rate limiting error:', rateLimitError)
    }
  }

  // Protected routes - require authentication
  const protectedPaths = ['/dashboard', '/account', '/settings', '/ideas', '/sessions']
  const isProtectedPath = protectedPaths.some(path =>
    request.nextUrl.pathname.startsWith(path)
  )

  if (isProtectedPath && !user) {
    // Redirect unauthenticated users to login
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('next', request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  // Auth pages - redirect authenticated users to dashboard
  const authPaths = ['/login', '/signup']
  const isAuthPath = authPaths.some(path =>
    request.nextUrl.pathname.startsWith(path)
  )

  if (isAuthPath && user) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  // IMPORTANT: Return the supabaseResponse to maintain session cookies
  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes that don't need auth
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
