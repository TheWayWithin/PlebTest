'use client';

import { Button } from '@/components/ui/button';
import { AlertCircle, Clock, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

type ErrorType = 'rate_limit' | 'validation' | 'server_error';

interface QuickFireErrorProps {
  type: ErrorType;
  message?: string;
  retryAfter?: number;
  onRetry: () => void;
  className?: string;
}

const errorConfig: Record<ErrorType, { icon: typeof AlertCircle; title: string; defaultMessage: string }> = {
  rate_limit: {
    icon: Clock,
    title: 'Slow down there!',
    defaultMessage: 'You\'ve reached the limit for quick tests. Please wait a moment before trying again.',
  },
  validation: {
    icon: AlertCircle,
    title: 'Invalid input',
    defaultMessage: 'Please check your idea and try again.',
  },
  server_error: {
    icon: AlertCircle,
    title: 'Something went wrong',
    defaultMessage: 'Our servers are having a moment. Please try again.',
  },
};

export function QuickFireError({
  type,
  message,
  retryAfter,
  onRetry,
  className,
}: QuickFireErrorProps) {
  const config = errorConfig[type];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-8 px-4 text-center',
        className
      )}
    >
      <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-rose-600" />
      </div>

      <h3 className="text-xl font-semibold text-slate-900 mb-2">{config.title}</h3>
      <p className="text-slate-600 mb-6 max-w-sm">
        {message || config.defaultMessage}
      </p>

      {retryAfter && type === 'rate_limit' && (
        <p className="text-sm text-slate-500 mb-4">
          Try again in {retryAfter} seconds
        </p>
      )}

      <Button
        onClick={onRetry}
        variant="outline"
        className="border-slate-300 hover:bg-slate-50"
        disabled={type === 'rate_limit' && retryAfter !== undefined && retryAfter > 0}
      >
        <RefreshCw className="w-4 h-4 mr-2" />
        Try Again
      </Button>
    </div>
  );
}
