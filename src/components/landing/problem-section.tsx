import { SectionLabel } from "@/components/ui/section-label"
import { Clock, DollarSign, HeartCrack } from "lucide-react"

const problems = [
  {
    icon: Clock,
    title: "Months of Wasted Time",
    description:
      "Most founders spend 6-12 months building before discovering there's no market. That's time you'll never get back.",
  },
  {
    icon: DollarSign,
    title: "Burned Savings",
    description:
      "The average failed startup costs founders $30,000+ in personal savings. Many go into debt chasing unvalidated ideas.",
  },
  {
    icon: HeartCrack,
    title: "Emotional Devastation",
    description:
      "Startup failure isn't just financial. It affects relationships, mental health, and confidence. Prevention is the best cure.",
  },
]

export function ProblemSection() {
  return (
    <section className="bg-slate-50 py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center">
          <SectionLabel>The Problem</SectionLabel>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Building Startups is Hard.
            <br />
            Building the Wrong One is Harder.
          </h2>
        </div>

        {/* Problem Cards */}
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {problems.map((problem) => (
            <div
              key={problem.title}
              className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50">
                <problem.icon className="h-6 w-6 text-rose-600" aria-hidden="true" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-900">
                {problem.title}
              </h3>
              <p className="mt-2 text-slate-600">{problem.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
