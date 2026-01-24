/**
 * Rate Limiting Configuration
 *
 * Uses Upstash Redis for serverless-compatible rate limiting.
 * Quick Fire: 10 requests per hour per IP address.
 *
 * Uses lazy initialization to avoid issues with env vars at build time.
 */

import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

// Lazy-initialized instances
let redis: Redis | null = null
let ratelimit: Ratelimit | null = null

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
 * Get or create the Quick Fire rate limiter (lazy initialization)
 *
 * Limits: 10 requests per hour per IP address
 * Algorithm: Sliding window for fair distribution
 */
function getQuickFireRatelimit(): Ratelimit {
  if (!ratelimit) {
    ratelimit = new Ratelimit({
      redis: getRedis(),
      limiter: Ratelimit.slidingWindow(10, "1 h"),
      analytics: true,
      prefix: "plebtest:quickfire",
    })
  }
  return ratelimit
}

/**
 * Rate limit check for Quick Fire endpoint
 *
 * @param identifier - Usually client IP address
 * @returns Promise with success flag and reset timestamp
 */
export async function checkQuickFireRateLimit(
  identifier: string
): Promise<{ success: boolean; reset: number }> {
  const limiter = getQuickFireRatelimit()
  return limiter.limit(identifier)
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
