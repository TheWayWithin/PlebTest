import posthog from "posthog-js"

export const initPostHog = () => {
  if (typeof window === "undefined") return

  const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY
  const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com"

  if (!posthogKey) {
    console.warn("PostHog key not configured")
    return
  }

  posthog.init(posthogKey, {
    api_host: posthogHost,

    // Cookieless mode - no cookie banner needed
    persistence: "memory",

    // IP anonymization for privacy
    ip: false,

    // Capture page views automatically
    capture_pageview: true,

    // Capture page leaves for session duration
    capture_pageleave: true,

    // Disable session recording (can enable later if needed)
    disable_session_recording: true,

    // Don't track users across subdomains
    cross_subdomain_cookie: false,

    // Load only in production or when explicitly enabled
    loaded: (posthog) => {
      if (process.env.NODE_ENV === "development") {
        // Optionally disable in development
        // posthog.opt_out_capturing()
      }
    },
  })
}

export { posthog }
