import { SectionLabel } from "@/components/ui/section-label"

const comparisons = [
  {
    chatgpt: "That's a great idea for busy pet owners!",
    plebtest: "I already use Rover. What problem does this solve that they don't?",
  },
  {
    chatgpt: "Users would love a subscription model.",
    plebtest: "I'd try it once. Why would I pay monthly for this?",
  },
]

export function WhyNotChatGPT() {
  return (
    <section className="bg-slate-900 py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center">
          <SectionLabel className="text-indigo-400 bg-indigo-950 border-indigo-800">
            The Difference
          </SectionLabel>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            &ldquo;Why not just use ChatGPT?&rdquo;
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-400">
            ChatGPT wants to help. PlebTest personas want to challenge.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="mt-16 overflow-hidden rounded-2xl border border-slate-700">
          {/* Header Row */}
          <div className="grid grid-cols-2 bg-slate-800">
            <div className="px-6 py-4 border-r border-slate-700">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20">
                  <span className="text-emerald-400 text-sm font-bold">AI</span>
                </div>
                <span className="font-semibold text-slate-300">ChatGPT</span>
              </div>
            </div>
            <div className="px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/20">
                  <span className="text-indigo-400 text-sm font-bold">P</span>
                </div>
                <span className="font-semibold text-white">PlebTest Persona</span>
              </div>
            </div>
          </div>

          {/* Comparison Rows */}
          {comparisons.map((comparison, index) => (
            <div
              key={index}
              className="grid grid-cols-2 border-t border-slate-700"
            >
              <div className="px-6 py-6 border-r border-slate-700 bg-slate-800/50">
                <p className="text-slate-400 italic">&ldquo;{comparison.chatgpt}&rdquo;</p>
              </div>
              <div className="px-6 py-6 bg-slate-800/30">
                <p className="text-white font-medium">&ldquo;{comparison.plebtest}&rdquo;</p>
              </div>
            </div>
          ))}
        </div>

        {/* Anti-sycophancy callout */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 px-4 py-2 text-sm text-indigo-400 border border-indigo-500/20">
            <span className="font-medium">Generic AI:</span>
            <span className="text-slate-400">&ldquo;That sounds like a great idea!&rdquo;</span>
          </div>
          <div className="mt-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-sm text-white border border-white/10">
              <span className="font-medium text-indigo-400">PlebTest Persona:</span>
              <span>&ldquo;Why would I switch from what I use now? Be specific.&rdquo;</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
