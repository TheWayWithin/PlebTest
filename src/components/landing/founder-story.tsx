import { SectionLabel } from "@/components/ui/section-label"
import { Quote } from "lucide-react"

export function FounderStory() {
  return (
    <section className="bg-white py-20 lg:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <SectionLabel>Why I Built This</SectionLabel>
        </div>

        <div className="mt-12 relative">
          {/* Quote marks decoration */}
          <Quote className="absolute -top-4 -left-4 w-12 h-12 text-indigo-100 rotate-180 hidden sm:block" aria-hidden="true" />

          <div className="bg-gradient-to-br from-slate-50 to-indigo-50/30 rounded-2xl p-8 sm:p-12 border border-slate-200">
            <div className="space-y-6 text-lg text-slate-600 leading-relaxed">
              <p>
                Customer discovery is emotionally hard for many founders. I know because I&apos;m one of them.
              </p>
              <p>
                The thought of cold-calling strangers, asking for &ldquo;15 minutes of your time,&rdquo; and facing rejection? It made me want to skip validation entirely and just start building.
              </p>
              <p>
                But I&apos;ve seen too many founders (including myself) waste months on ideas that real customers would have killed in the first conversation — <em>if we&apos;d had the courage to have that conversation</em>.
              </p>
              <p>
                So I built PlebTest. A way to get the brutal honesty of customer interviews without the awkward conversations. AI personas that challenge your assumptions, push back on your ideas, and tell you what you need to hear — not what you want to hear.
              </p>
              <p className="font-medium text-slate-900">
                Now I&apos;m sharing it with founders like me.
              </p>
            </div>

            {/* Signature */}
            <div className="mt-8 flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                J
              </div>
              <div>
                <p className="font-semibold text-slate-900">Jamie</p>
                <p className="text-sm text-slate-500">Founder, PlebTest</p>
              </div>
            </div>
          </div>

          <Quote className="absolute -bottom-4 -right-4 w-12 h-12 text-indigo-100 hidden sm:block" aria-hidden="true" />
        </div>
      </div>
    </section>
  )
}
