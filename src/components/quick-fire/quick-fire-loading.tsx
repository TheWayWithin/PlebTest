'use client';

import { cn } from '@/lib/utils';

interface QuickFireLoadingProps {
  className?: string;
}

export function QuickFireLoading({ className }: QuickFireLoadingProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-8', className)}>
      {/* Animated thinking icon */}
      <div className="relative w-20 h-20 mb-6">
        <div className="absolute inset-0 rounded-full bg-indigo-500/20 animate-ping" />
        <div className="absolute inset-2 rounded-full bg-indigo-500/30 animate-pulse" />
        <div className="absolute inset-4 rounded-full bg-indigo-500/50 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-indigo-600 animate-pulse"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
        </div>
      </div>

      {/* Loading text */}
      <p className="text-lg text-slate-700 font-medium mb-2">Analyzing your idea...</p>
      <p className="text-sm text-slate-500">This usually takes 3-5 seconds</p>

      {/* Progress dots */}
      <div className="flex gap-2 mt-4">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce"
            style={{
              animationDelay: `${i * 0.16}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
