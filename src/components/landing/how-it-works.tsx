import { SectionLabel } from "@/components/ui/section-label"

const steps = [
  {
    number: "01",
    title: "Describe Your Idea",
    description:
      "Tell us about your startup concept in plain English. No pitch deck required.",
  },
  {
    number: "02",
    title: "AI Analysis",
    description:
      "Our AI researches your market, competitors, and validates against proven frameworks.",
  },
  {
    number: "03",
    title: "Get Your Verdict",
    description:
      "Receive a clear Kill, Pivot, or Build recommendation with detailed reasoning.",
  },
  {
    number: "04",
    title: "Take Action",
    description:
      "Follow your personalized roadmap with specific next steps for your situation.",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-slate-50 py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center">
          <SectionLabel>How It Works</SectionLabel>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            From Idea to Insight in 4 Steps
          </h2>
        </div>

        {/* Steps */}
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              {/* Connector line (desktop only, not for last item) */}
              {index < steps.length - 1 && (
                <div
                  className="absolute top-8 left-full hidden w-full border-t-2 border-dashed border-slate-300 lg:block"
                  style={{ width: "calc(100% - 2rem)", left: "calc(50% + 1rem)" }}
                  aria-hidden="true"
                />
              )}

              <div className="relative">
                <span className="text-6xl font-bold text-indigo-100" aria-hidden="true">
                  {step.number}
                </span>
                <h3 className="-mt-4 text-lg font-semibold text-slate-900">
                  {step.title}
                </h3>
                <p className="mt-2 text-slate-600">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
