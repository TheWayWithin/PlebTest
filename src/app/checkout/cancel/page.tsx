'use client';

import Link from 'next/link';
import { XCircle, ArrowLeft } from 'lucide-react';

export default function CheckoutCancelPage() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Cancel Icon */}
        <div className="flex justify-center">
          <div className="rounded-full bg-zinc-800 p-4">
            <XCircle className="h-16 w-16 text-zinc-400" />
          </div>
        </div>

        {/* Cancel Message */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-white">
            Checkout Cancelled
          </h1>
          <p className="text-zinc-400">
            No worries - you can always come back when you&apos;re ready.
          </p>
        </div>

        {/* Reassurance */}
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6 text-left space-y-3">
          <p className="text-sm text-zinc-300">
            Your account is still active. You can continue exploring PlebTest or subscribe later to unlock full features.
          </p>
          <p className="text-sm text-zinc-400">
            Questions? Reach out at{' '}
            <a href="mailto:support@plebtest.com" className="text-emerald-500 hover:text-emerald-400">
              support@plebtest.com
            </a>
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/pricing"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-6 py-3 text-sm font-medium text-white hover:bg-emerald-500 transition-colors"
          >
            View Plans
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800 px-6 py-3 text-sm font-medium text-zinc-300 hover:bg-zinc-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
