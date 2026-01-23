import { SectionLabel } from "@/components/ui/section-label"
import { VerdictCard } from "@/components/ui/verdict-card"

const verdicts = [
  {
    verdict: "kill" as const,
    title: "Kill",
    description:
      "Personas rejected your value proposition. Better to know now than after months of building.",
  },
  {
    verdict: "pivot" as const,
    title: "Pivot",
    description:
      "Interest exists, but personas raised concerns about pricing, positioning, or differentiation.",
  },
  {
    verdict: "build" as const,
    title: "Build",
    description:
      "Personas validated the pain point and showed willingness to pay. Time to build.",
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
              AI Personas That Challenge, Not Validate
            </h2>
            <p className="mt-6 text-lg text-slate-600">
              PlebTest generates skeptical AI personas based on your target customer. They push back, raise objections, and challenge your assumptions — so you know what to test in the real world.
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
