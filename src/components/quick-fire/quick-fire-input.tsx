'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuickFireInputProps {
  onSubmit: (idea: string) => void;
  isLoading?: boolean;
  className?: string;
}

const MIN_LENGTH = 10;
const MAX_LENGTH = 200;

export function QuickFireInput({ onSubmit, isLoading, className }: QuickFireInputProps) {
  const [idea, setIdea] = useState('');
  const [touched, setTouched] = useState(false);

  const charCount = idea.length;
  const isValid = charCount >= MIN_LENGTH && charCount <= MAX_LENGTH;
  const showError = touched && charCount > 0 && charCount < MIN_LENGTH;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid && !isLoading) {
      onSubmit(idea);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn('w-full max-w-xl', className)}>
      <div className="relative">
        <textarea
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          onBlur={() => setTouched(true)}
          placeholder="Describe your business idea in one sentence..."
          maxLength={MAX_LENGTH}
          disabled={isLoading}
          className={cn(
            'w-full h-24 px-4 py-3 rounded-lg resize-none',
            'bg-white border border-slate-300',
            'text-slate-900 placeholder:text-slate-400',
            'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'transition-all duration-200',
            showError && 'border-rose-500 focus:ring-rose-500'
          )}
        />
        <div className="absolute bottom-2 right-3 flex items-center gap-2">
          <span
            className={cn(
              'text-xs tabular-nums',
              charCount < MIN_LENGTH ? 'text-slate-400' : 'text-slate-500',
              charCount > MAX_LENGTH * 0.9 && 'text-amber-600',
              charCount >= MAX_LENGTH && 'text-rose-600'
            )}
          >
            {charCount}/{MAX_LENGTH}
          </span>
        </div>
      </div>

      {showError && (
        <p className="mt-2 text-sm text-rose-600">
          Please enter at least {MIN_LENGTH} characters
        </p>
      )}

      <Button
        type="submit"
        disabled={!isValid || isLoading}
        className={cn(
          'mt-4 w-full py-6 text-lg font-semibold',
          'bg-indigo-600 hover:bg-indigo-700',
          'disabled:bg-slate-300 disabled:cursor-not-allowed',
          'transition-all duration-200'
        )}
      >
        <Zap className="w-5 h-5 mr-2" />
        Test My Idea
      </Button>
    </form>
  );
}
