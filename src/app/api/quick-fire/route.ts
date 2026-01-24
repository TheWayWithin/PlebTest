/**
 * Quick Fire API Endpoint
 *
 * POST /api/quick-fire
 *
 * Analyzes a startup idea and returns a risk assessment.
 * This is a pre-signup feature - no authentication required.
 *
 * Rate limited: 10 requests per hour per IP address.
 */

import { NextRequest, NextResponse } from "next/server"
import { quickFireRatelimit, getClientIP } from "@/lib/ratelimit"
import { analyzeIdea, QuickFireAnalysis } from "@/lib/openrouter"

// Input validation constants
const MIN_IDEA_LENGTH = 10
const MAX_IDEA_LENGTH = 200

interface QuickFireRequest {
  idea: string
}

interface SuccessResponse extends QuickFireAnalysis {
  // Inherits: riskScore, riskLevel, keyObjection
}

interface ErrorResponse {
  error: "rate_limit" | "validation" | "server_error"
  message?: string
  retryAfter?: number
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<SuccessResponse | ErrorResponse>> {
  try {
    // 0. Validate environment configuration
    const missingEnvVars: string[] = []
    if (!process.env.UPSTASH_REDIS_REST_URL) missingEnvVars.push("UPSTASH_REDIS_REST_URL")
    if (!process.env.UPSTASH_REDIS_REST_TOKEN) missingEnvVars.push("UPSTASH_REDIS_REST_TOKEN")
    if (!process.env.OPENROUTER_API_KEY) missingEnvVars.push("OPENROUTER_API_KEY")

    if (missingEnvVars.length > 0) {
      console.error("Quick Fire: Missing environment variables:", missingEnvVars)
      return NextResponse.json(
        {
          error: "server_error" as const,
          message: "Service configuration error",
        },
        { status: 503 }
      )
    }

    // 1. Rate limiting check
    const clientIP = getClientIP(request)
    const { success, reset } = await quickFireRatelimit.limit(clientIP)

    if (!success) {
      const retryAfter = Math.ceil((reset - Date.now()) / 1000)
      return NextResponse.json(
        {
          error: "rate_limit" as const,
          retryAfter,
        },
        {
          status: 429,
          headers: {
            "Retry-After": retryAfter.toString(),
          },
        }
      )
    }

    // 2. Parse and validate request body
    let body: QuickFireRequest
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        {
          error: "validation" as const,
          message: "Invalid JSON in request body",
        },
        { status: 400 }
      )
    }

    // 3. Validate idea field
    if (!body.idea || typeof body.idea !== "string") {
      return NextResponse.json(
        {
          error: "validation" as const,
          message: "Missing or invalid 'idea' field",
        },
        { status: 400 }
      )
    }

    const idea = body.idea.trim()

    if (idea.length < MIN_IDEA_LENGTH) {
      return NextResponse.json(
        {
          error: "validation" as const,
          message: `Idea must be at least ${MIN_IDEA_LENGTH} characters`,
        },
        { status: 400 }
      )
    }

    if (idea.length > MAX_IDEA_LENGTH) {
      return NextResponse.json(
        {
          error: "validation" as const,
          message: `Idea must be no more than ${MAX_IDEA_LENGTH} characters`,
        },
        { status: 400 }
      )
    }

    // 4. Analyze the idea with AI
    const analysis = await analyzeIdea(idea)

    // 5. Return success response (no database write for Quick Fire)
    return NextResponse.json(analysis, { status: 200 })
  } catch (error) {
    // Log detailed error for debugging
    console.error("Quick Fire API error:", {
      name: error instanceof Error ? error.name : "Unknown",
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    })

    // Check for specific error types
    if (error instanceof Error) {
      // Environment configuration errors
      if (error.message.includes("environment variable")) {
        return NextResponse.json(
          {
            error: "server_error" as const,
            message: "Service configuration error",
          },
          { status: 503 }
        )
      }

      // AI service errors
      if (error.message.includes("OpenRouter")) {
        return NextResponse.json(
          {
            error: "server_error" as const,
            message: "AI analysis service unavailable",
          },
          { status: 503 }
        )
      }

      // Upstash Redis errors
      if (error.message.includes("Upstash") || error.message.includes("Redis") || error.message.includes("UNAUTHORIZED")) {
        console.error("Upstash Redis error - check credentials")
        return NextResponse.json(
          {
            error: "server_error" as const,
            message: "Rate limiting service error",
          },
          { status: 503 }
        )
      }
    }

    // Generic server error
    return NextResponse.json(
      {
        error: "server_error" as const,
        message: "An unexpected error occurred",
      },
      { status: 500 }
    )
  }
}

// Reject other HTTP methods
export async function GET() {
  return NextResponse.json(
    { error: "validation" as const, message: "Method not allowed" },
    { status: 405 }
  )
}

export async function PUT() {
  return NextResponse.json(
    { error: "validation" as const, message: "Method not allowed" },
    { status: 405 }
  )
}

export async function DELETE() {
  return NextResponse.json(
    { error: "validation" as const, message: "Method not allowed" },
    { status: 405 }
  )
}
