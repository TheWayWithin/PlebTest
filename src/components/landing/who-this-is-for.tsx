import { SectionLabel } from "@/components/ui/section-label"
import { Code, MessageCircleOff, Clock } from "lucide-react"

const personas = [
  {
    icon: Code,
    title: "Founders who would rather code than cold-call",
    description:
      "You have the skills to build anything — but picking up the phone to talk to strangers? That's the hard part.",
  },
  {
    icon: MessageCircleOff,
    title: "Anxious first-timers who dread \"Do you have 15 minutes to chat?\"",
    description:
      "The thought of cold outreach makes your stomach turn. You'd rather validate quietly before going public.",
  },
  {
    icon: Clock,
    title: "Side-hustlers who need to sanity-check ideas before burning evenings and savings",
    description:
      "You can't afford to waste months on a dud. You need honest feedback fast, not cheerleading.",
  },
]

export function WhoThisIsFor() {
  return (
    <section className="bg-slate-50 py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center">
          <SectionLabel>Who This Is For</SectionLabel>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Built for founders who&apos;d rather ship than schmooze
          </h2>
        </div>

        {/* Persona Cards */}
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {personas.map((persona) => (
            <div
              key={persona.title}
              className="relative rounded-2xl bg-white p-8 shadow-sm border border-slate-200 hover:shadow-md transition-shadow"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100">
                <persona.icon className="h-6 w-6 text-indigo-600" aria-hidden="true" />
              </div>
              <h3 className="mt-6 text-lg font-semibold text-slate-900">
                {persona.title}
              </h3>
              <p className="mt-2 text-slate-600">{persona.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
