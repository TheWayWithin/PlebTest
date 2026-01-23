"use client";

import { Play, Zap, ClipboardCheck, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function DemoPreview() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 border-indigo-500/50 text-indigo-400">
            See It In Action
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            From Idea to Verdict in Minutes
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Watch how PlebTest validates your startup idea through the 3-stage process
          </p>
        </div>

        {/* Demo Mockup Container */}
        <div className="relative">
          {/* Glow effect */}
          <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500/20 via-violet-500/20 to-indigo-500/20 rounded-3xl blur-2xl" />

          {/* Main demo preview */}
          <div className="relative bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-2xl overflow-hidden">
            {/* Browser chrome mockup */}
            <div className="flex items-center gap-2 px-4 py-3 bg-gray-900 border-b border-gray-800">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
              </div>
              <div className="flex-1 mx-4">
                <div className="bg-gray-800 rounded-md px-3 py-1 text-sm text-gray-500 max-w-md mx-auto text-center">
                  app.plebtest.com/validate
                </div>
              </div>
            </div>

            {/* Demo content area */}
            <div className="p-8 sm:p-12">
              {/* Process flow visualization */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {/* Stage 1: Quick Fire */}
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-xl blur opacity-30 group-hover:opacity-50 transition" />
                  <div className="relative bg-gray-800/90 rounded-xl p-6 border border-gray-700">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                        <Zap className="w-5 h-5 text-indigo-400" />
                      </div>
                      <div>
                        <div className="text-xs text-indigo-400 font-medium">STAGE 1</div>
                        <div className="text-white font-semibold">Quick Fire</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-2 bg-gray-700 rounded-full w-full" />
                      <div className="h-2 bg-gray-700 rounded-full w-4/5" />
                      <div className="h-2 bg-gray-700 rounded-full w-3/5" />
                    </div>
                    <div className="mt-4 text-sm text-gray-500">5 rapid-fire questions</div>
                  </div>
                </div>

                {/* Stage 2: Full Validation */}
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl blur opacity-30 group-hover:opacity-50 transition" />
                  <div className="relative bg-gray-800/90 rounded-xl p-6 border border-gray-700">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center">
                        <ClipboardCheck className="w-5 h-5 text-violet-400" />
                      </div>
                      <div>
                        <div className="text-xs text-violet-400 font-medium">STAGE 2</div>
                        <div className="text-white font-semibold">Full Validation</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-2 bg-gray-700 rounded-full w-full" />
                      <div className="h-2 bg-gray-700 rounded-full w-5/6" />
                      <div className="h-2 bg-gray-700 rounded-full w-2/3" />
                    </div>
                    <div className="mt-4 text-sm text-gray-500">Deep-dive analysis</div>
                  </div>
                </div>

                {/* Stage 3: Verdict */}
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl blur opacity-30 group-hover:opacity-50 transition" />
                  <div className="relative bg-gray-800/90 rounded-xl p-6 border border-gray-700">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                        <Scale className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div>
                        <div className="text-xs text-emerald-400 font-medium">STAGE 3</div>
                        <div className="text-white font-semibold">Your Verdict</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">BUILD</Badge>
                      <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">PIVOT</Badge>
                      <Badge className="bg-rose-500/20 text-rose-400 border-rose-500/30">KILL</Badge>
                    </div>
                    <div className="mt-4 text-sm text-gray-500">Clear recommendation</div>
                  </div>
                </div>
              </div>

              {/* Play button overlay */}
              <div className="flex flex-col items-center justify-center py-8">
                <button
                  disabled
                  className="group relative w-20 h-20 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/25 cursor-not-allowed opacity-75"
                >
                  <Play className="w-8 h-8 text-white ml-1" fill="currentColor" />
                  <div className="absolute inset-0 rounded-full bg-white/10 animate-ping opacity-0 group-hover:opacity-100" />
                </button>
                <p className="mt-4 text-sm text-gray-500">Demo video coming soon</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-10">
          <Button
            size="lg"
            className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white px-8"
          >
            Try It Now - It's Free
          </Button>
        </div>
      </div>
    </section>
  );
}
