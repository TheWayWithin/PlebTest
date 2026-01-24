/**
 * Rate Limiting Configuration
 *
 * Uses Upstash Redis for serverless-compatible rate limiting.
 * Quick Fire: 10 requests per hour per IP address.
 */

import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

// Initialize Redis client (lazy - only throws on actual use if missing)
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

/**
 * Quick Fire rate limiter
 *
 * Limits: 10 requests per hour per IP address
 * Algorithm: Sliding window for fair distribution
 * Analytics: Enabled for monitoring
 */
export const quickFireRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "1 h"),
  analytics: true,
  prefix: "plebtest:quickfire",
})

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
