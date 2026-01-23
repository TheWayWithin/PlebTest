"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { posthog } from "@/lib/posthog"

type SubmitStatus = "idle" | "loading" | "success" | "error"

export function WaitlistCTA() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<SubmitStatus>("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setStatus("loading")
    setErrorMessage("")

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        setStatus("error")
        setErrorMessage(data.error || "Something went wrong")
        return
      }

      setStatus("success")
      setEmail("")

      // Track successful signup
      posthog.capture("waitlist_signup", {
        source: "landing_page_cta",
      })
    } catch {
      setStatus("error")
      setErrorMessage("Failed to connect. Please try again.")
    }
  }

  return (
    <section id="waitlist" className="bg-gradient-to-br from-indigo-600 to-purple-700 py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Be First to Know When PlebTest Launches
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-indigo-100">
            Get early access, founder pricing, and exclusive updates before public launch.
          </p>

          {/* Form */}
          {status === "success" ? (
            <div className="mt-10">
              <div className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-6 py-4 text-white">
                <svg
                  className="h-5 w-5 text-emerald-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="font-medium">You&apos;re on the list! I&apos;ll be in touch soon.</span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-10">
              <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <label htmlFor="email-input" className="sr-only">
                  Email address
                </label>
                <Input
                  id="email-input"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={status === "loading"}
                  className="w-full max-w-md bg-white border-0 px-4 py-3 h-auto text-slate-900 placeholder:text-slate-400 sm:w-80 disabled:opacity-50"
                />
                <Button
                  type="submit"
                  size="lg"
                  disabled={status === "loading"}
                  className="w-full bg-white text-indigo-600 hover:bg-indigo-50 px-8 py-3 h-auto rounded-lg font-semibold sm:w-auto disabled:opacity-50"
                >
                  {status === "loading" ? "Joining..." : "Join Waitlist for Early Access"}
                </Button>
              </div>

              {/* Error message */}
              {status === "error" && errorMessage && (
                <p className="mt-4 text-sm text-red-200">
                  {errorMessage}
                </p>
              )}
            </form>
          )}

          <p className="mt-4 text-sm text-indigo-200">
            No spam, ever. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  )
}
