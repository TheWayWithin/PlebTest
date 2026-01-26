/**
 * Rate Limiting Configuration
 *
 * Uses Upstash Redis for serverless-compatible rate limiting.
 *
 * Rate Limits by Category:
 * - Quick Fire (anonymous): 10 requests per hour per IP
 * - API General (authenticated): 100 requests per minute per user
 * - API General (anonymous): 20 requests per minute per IP
 * - AI Operations (authenticated): 30 requests per minute per user
 *
 * Uses lazy initialization to avoid issues with env vars at build time.
 */

import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

// Lazy-initialized instances
let redis: Redis | null = null
const rateLimiters: Record<string, Ratelimit> = {}

/**
 * Rate limit result
 */
export interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  reset: number
}

/**
 * Rate limit categories with their configurations
 */
export const RATE_LIMIT_CONFIGS = {
  // Quick Fire - pre-signup feature, strict limit
  quickfire: { requests: 10, window: "1 h" as const },

  // General API - authenticated users get more headroom
  api_auth: { requests: 100, window: "1 m" as const },
  api_anon: { requests: 20, window: "1 m" as const },

  // AI operations - more expensive, stricter limits
  ai_auth: { requests: 30, window: "1 m" as const },
  ai_anon: { requests: 5, window: "1 m" as const },

  // Waitlist signups - prevent abuse
  waitlist: { requests: 3, window: "1 h" as const },
} as const

export type RateLimitCategory = keyof typeof RATE_LIMIT_CONFIGS

/**
 * Get or create the Redis client (lazy initialization)
 */
function getRedis(): Redis {
  if (!redis) {
    const url = process.env.UPSTASH_REDIS_REST_URL
    const token = process.env.UPSTASH_REDIS_REST_TOKEN

    if (!url || !token) {
      throw new Error(
        `Missing Upstash Redis credentials: url=${!!url}, token=${!!token}`
      )
    }

    redis = new Redis({ url, token })
  }
  return redis
}

/**
 * Get or create a rate limiter for a specific category
 */
function getRateLimiter(category: RateLimitCategory): Ratelimit {
  if (!rateLimiters[category]) {
    const config = RATE_LIMIT_CONFIGS[category]
    rateLimiters[category] = new Ratelimit({
      redis: getRedis(),
      limiter: Ratelimit.slidingWindow(config.requests, config.window),
      analytics: true,
      prefix: `plebtest:${category}`,
    })
  }
  return rateLimiters[category]
}

/**
 * Check rate limit for a specific category
 *
 * @param category - The rate limit category
 * @param identifier - Unique identifier (user ID or IP address)
 * @returns Promise with success flag, limits, and reset timestamp
 */
export async function checkRateLimit(
  category: RateLimitCategory,
  identifier: string
): Promise<RateLimitResult> {
  const limiter = getRateLimiter(category)
  const result = await limiter.limit(identifier)
  const config = RATE_LIMIT_CONFIGS[category]

  return {
    success: result.success,
    limit: config.requests,
    remaining: result.remaining,
    reset: result.reset,
  }
}

/**
 * Rate limit check for Quick Fire endpoint (convenience wrapper)
 *
 * @param identifier - Usually client IP address
 * @returns Promise with success flag and reset timestamp
 */
export async function checkQuickFireRateLimit(
  identifier: string
): Promise<{ success: boolean; reset: number }> {
  const result = await checkRateLimit("quickfire", identifier)
  return { success: result.success, reset: result.reset }
}

/**
 * Extract client IP address from request headers
 *
 * Handles various deployment scenarios:
 * - Railway/Vercel: x-forwarded-for
 * - Cloudflare: cf-connecting-ip
 * - Direct: x-real-ip
 * - Fallback: 'anonymous' (development)
 */
export function getClientIP(request: Request): string {
  // x-forwarded-for can contain multiple IPs; first is the client
  const forwardedFor = request.headers.get("x-forwarded-for")
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim()
  }

  // Cloudflare-specific header
  const cfConnectingIP = request.headers.get("cf-connecting-ip")
  if (cfConnectingIP) {
    return cfConnectingIP
  }

  // Direct connection
  const realIP = request.headers.get("x-real-ip")
  if (realIP) {
    return realIP
  }

  // Fallback for development
  return "anonymous"
}
