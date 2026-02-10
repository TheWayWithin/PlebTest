'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Invisible client component that auto-refreshes the page
 * while a test is in an active state (pending/in_progress).
 * Uses router.refresh() to re-render server components with fresh data.
 */
export function TestAutoRefresh({ isActive }: { isActive: boolean }) {
  const router = useRouter();

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      router.refresh();
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, [isActive, router]);

  return null;
}
