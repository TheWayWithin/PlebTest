'use client';

import { useState, useCallback } from 'react';
import { QuickFireInput } from './quick-fire-input';
import { QuickFireLoading } from './quick-fire-loading';
import { QuickFireResult } from './quick-fire-result';
import { QuickFireError } from './quick-fire-error';
import { cn } from '@/lib/utils';

type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';
type ErrorType = 'rate_limit' | 'validation' | 'server_error';
type ViewState = 'input' | 'loading' | 'result' | 'error';

interface QuickFireResponse {
  riskScore: number;
  riskLevel: RiskLevel;
  keyObjection: string;
}

interface QuickFireErrorResponse {
  error: ErrorType;
  message?: string;
  retryAfter?: number;
}

interface QuickFireProps {
  className?: string;
}

export function QuickFire({ className }: QuickFireProps) {
  const [viewState, setViewState] = useState<ViewState>('input');
  const [result, setResult] = useState<QuickFireResponse | null>(null);
  const [error, setError] = useState<QuickFireErrorResponse | null>(null);

  const handleSubmit = useCallback(async (idea: string) => {
    setViewState('loading');
    setError(null);

    try {
      const response = await fetch('/api/quick-fire', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idea }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data as QuickFireErrorResponse);
        setViewState('error');
        return;
      }

      setResult(data as QuickFireResponse);
      setViewState('result');
    } catch (err) {
      console.error('Quick Fire error:', err);
      setError({
        error: 'server_error',
        message: 'Failed to connect. Please check your connection and try again.',
      });
      setViewState('error');
    }
  }, []);

  const handleReset = useCallback(() => {
    setViewState('input');
    setResult(null);
    setError(null);
  }, []);

  return (
    <div className={cn('w-full', className)}>
      {/* Section Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
          Quick Fire Test
        </h2>
        <p className="text-slate-600">
          Get instant feedback on your idea in seconds. No signup required.
        </p>
      </div>

      {/* Content Area */}
      <div className="flex justify-center">
        {viewState === 'input' && (
          <QuickFireInput onSubmit={handleSubmit} />
        )}

        {viewState === 'loading' && (
          <QuickFireLoading />
        )}

        {viewState === 'result' && result && (
          <QuickFireResult
            riskScore={result.riskScore}
            riskLevel={result.riskLevel}
            keyObjection={result.keyObjection}
            onTestAnother={handleReset}
          />
        )}

        {viewState === 'error' && error && (
          <QuickFireError
            type={error.error}
            message={error.message}
            retryAfter={error.retryAfter}
            onRetry={handleReset}
          />
        )}
      </div>
    </div>
  );
}
