import { SectionLabel } from "@/components/ui/section-label"
import { VerdictCard } from "@/components/ui/verdict-card"

const verdicts = [
  {
    verdict: "kill" as const,
    title: "Kill",
    description:
      "Save your time and money. This idea has critical flaws that make success unlikely.",
  },
  {
    verdict: "pivot" as const,
    title: "Pivot",
    description:
      "There's potential here, but you need to change direction. We'll show you exactly how.",
  },
  {
    verdict: "build" as const,
    title: "Build",
    description:
      "Green light! Your idea shows strong market signals. Here's your roadmap to launch.",
  },
]

export function SolutionSection() {
  return (
    <section className="bg-white py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">
          {/* Text Content */}
          <div>
            <SectionLabel>The Solution</SectionLabel>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Get Clarity Before You Commit
            </h2>
            <p className="mt-6 text-lg text-slate-600">
              PlebTest analyzes your startup idea against real market data, competitor intelligence, and proven validation frameworks. In minutes, you&apos;ll know exactly where you stand.
            </p>
          </div>

          {/* Verdict Cards */}
          <div className="mt-12 space-y-4 lg:mt-0">
            {verdicts.map((verdict) => (
              <VerdictCard
                key={verdict.verdict}
                verdict={verdict.verdict}
                title={verdict.title}
                description={verdict.description}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
