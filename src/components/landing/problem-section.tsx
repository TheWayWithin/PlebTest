import { SectionLabel } from "@/components/ui/section-label"

export function ProblemSection() {
  return (
    <section className="bg-slate-50 py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <SectionLabel>The Problem</SectionLabel>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            The Hardest Part of Validation Isn&apos;t Building
          </h2>
          <p className="mt-6 text-lg text-slate-600 leading-relaxed">
            It&apos;s picking up the phone. Most founders skip customer discovery because it&apos;s
            awkward, time-consuming, and emotionally draining. So they build first and
            validate later — if at all.
          </p>
          <p className="mt-4 text-lg font-semibold text-slate-900">
            That&apos;s why 90% of startups fail: no market need.
          </p>
        </div>
      </div>
    </section>
  )
}
