import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Create Supabase client for server-side use
function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Missing Supabase environment variables")
  }

  return createClient(supabaseUrl, supabaseServiceKey)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    // Validate email
    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      )
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      )
    }

    const supabase = getSupabaseClient()

    // Insert email into waitlist table
    // Using upsert to handle duplicates gracefully
    const { error } = await supabase
      .from("waitlist")
      .upsert(
        { email: email.toLowerCase().trim() },
        { onConflict: "email", ignoreDuplicates: true }
      )

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json(
        { error: "Failed to join waitlist" },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: "Successfully joined the waitlist!" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Waitlist API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
