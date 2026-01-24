import { Badge } from "@/components/ui/badge"
import { ArrowDown } from "lucide-react"
import { QuickFire } from "@/components/quick-fire"

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
            For Founders Who Dread Cold Calls
          </Badge>

          {/* Headline */}
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Get Brutally Honest Feedback
            </span>
            <br />
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Without Picking Up the Phone
            </span>
          </h1>

          {/* Subheadline */}
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 sm:text-xl">
            AI personas challenge your startup idea with real objections — so you know whether to kill it, pivot, or build.
          </p>

          {/* Quick Fire Section */}
          <div className="mt-12">
            <QuickFire />
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 max-w-md mx-auto my-8">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-slate-500 text-sm">or scroll to learn more</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* See How It Works link */}
          <a
            href="#how-it-works"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-indigo-600 font-medium transition-colors"
          >
            See How It Works
            <ArrowDown className="w-4 h-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  )
}
