'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, Loader2 } from 'lucide-react';

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Auto-redirect to dashboard after countdown
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push('/dashboard');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Success Icon */}
        <div className="flex justify-center">
          <div className="rounded-full bg-emerald-500/10 p-4">
            <CheckCircle2 className="h-16 w-16 text-emerald-500" />
          </div>
        </div>

        {/* Success Message */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-white">
            Welcome to PlebTest!
          </h1>
          <p className="text-zinc-400">
            Your subscription is now active. Time to validate some ideas.
          </p>
        </div>

        {/* What's Next */}
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6 text-left space-y-4">
          <h2 className="font-semibold text-white">What&apos;s next?</h2>
          <ul className="space-y-3 text-sm text-zinc-300">
            <li className="flex items-start gap-3">
              <span className="font-mono text-emerald-500">1.</span>
              <span>Create your first idea to validate</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="font-mono text-emerald-500">2.</span>
              <span>Define your proposal and target customer</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="font-mono text-emerald-500">3.</span>
              <span>Run a PlebTest and get real feedback</span>
            </li>
          </ul>
        </div>

        {/* Redirect Notice */}
        <div className="flex items-center justify-center gap-2 text-sm text-zinc-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Redirecting to dashboard in {countdown}s...</span>
        </div>

        {/* Manual Link */}
        <Link
          href="/dashboard"
          className="inline-block text-sm text-emerald-500 hover:text-emerald-400 transition-colors"
        >
          Go to dashboard now
        </Link>

        {/* Session ID for debugging (hidden in production) */}
        {process.env.NODE_ENV === 'development' && sessionId && (
          <p className="text-xs text-zinc-600 font-mono">
            Session: {sessionId}
          </p>
        )}
      </div>
    </div>
  );
}
