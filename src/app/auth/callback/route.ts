import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') ?? '/dashboard'
  const error = requestUrl.searchParams.get('error')
  const errorDescription = requestUrl.searchParams.get('error_description')

  // Use the public app URL for redirects (requestUrl.origin resolves to internal Railway port)
  const appOrigin = process.env.NEXT_PUBLIC_APP_URL || requestUrl.origin

  // Handle OAuth errors
  if (error) {
    console.error('OAuth error:', error, errorDescription)
    const redirectUrl = new URL('/auth/error', appOrigin)
    redirectUrl.searchParams.set('error', error)
    if (errorDescription) {
      redirectUrl.searchParams.set('error_description', errorDescription)
    }
    return NextResponse.redirect(redirectUrl)
  }

  if (code) {
    const cookieStore = await cookies()

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch {
              // The `setAll` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing user sessions.
            }
          },
        },
      }
    )

    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

    if (exchangeError) {
      console.error('Code exchange error:', exchangeError.message)
      const redirectUrl = new URL('/auth/error', appOrigin)
      redirectUrl.searchParams.set('error', 'exchange_failed')
      redirectUrl.searchParams.set('error_description', exchangeError.message)
      return NextResponse.redirect(redirectUrl)
    }

    // If we have a session, ensure user record exists in public.users
    if (data.session?.user) {
      const user = data.session.user

      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('id', user.id)
        .single()

      if (!existingUser) {
        // Get tier from user metadata (set during signup)
        const signupTier = user.user_metadata?.signup_tier || 'solo'
        const tierMapping: Record<string, 'solo' | 'growth' | 'scale' | 'pro'> = {
          solo: 'solo',
          growth: 'growth',
          scale: 'scale',
          pro: 'pro',
        }

        // Create user record
        const { error: insertError } = await supabase
          .from('users')
          .insert({
            id: user.id,
            email: user.email!,
            name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'User',
            subscription_tier: tierMapping[signupTier] || 'solo',
          })

        if (insertError) {
          console.error('User creation error:', insertError.message)
          // Continue anyway - user can be created on dashboard load
        }
      }
    }

    // Successful authentication - redirect to intended destination
    return NextResponse.redirect(new URL(next, appOrigin))
  }

  // No code provided - redirect to login
  return NextResponse.redirect(new URL('/login', appOrigin))
}
