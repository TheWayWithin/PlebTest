import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowDown } from "lucide-react"

export function Hero() {
  return (
    <section className="relative bg-white py-20 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Badge */}
          <Badge
            variant="secondary"
            className="mb-6 bg-indigo-50 text-indigo-700 px-4 py-1.5 rounded-full text-sm font-medium border-0 hover:bg-indigo-50"
          >
            AI-Powered Market Validation
          </Badge>

          {/* Headline */}
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Stop Wasting Months on Ideas
            </span>
            <br />
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              That Won&apos;t Work
            </span>
          </h1>

          {/* Subheadline */}
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 sm:text-xl">
            Get an AI-powered market analysis in minutes. Know if your startup idea is worth pursuing before you write a single line of code.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button
              size="lg"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 h-auto rounded-lg font-semibold sm:w-auto"
              asChild
            >
              <a href="#waitlist">Join the Waitlist</a>
            </Button>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 text-slate-600 hover:text-indigo-600 font-medium transition-colors"
            >
              See How It Works
              <ArrowDown className="w-4 h-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
