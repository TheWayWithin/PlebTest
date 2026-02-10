'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RetryTestButtonProps {
  ideaId: string;
  proposalId: string;
  testId: string;
}

/**
 * Button to re-queue a stuck test job.
 * Shown when the test has been pending for too long (job likely expired).
 */
export function RetryTestButton({ ideaId, proposalId, testId }: RetryTestButtonProps) {
  const [isRetrying, setIsRetrying] = useState(false);
  const [retried, setRetried] = useState(false);
  const router = useRouter();

  async function handleRetry() {
    setIsRetrying(true);
    try {
      const response = await fetch(
        `/api/ideas/${ideaId}/proposals/${proposalId}/tests/${testId}/retry`,
        { method: 'POST' }
      );

      if (response.ok) {
        setRetried(true);
        router.refresh();
      } else {
        const data = await response.json();
        console.error('Retry failed:', data.error);
      }
    } catch (error) {
      console.error('Retry error:', error);
    } finally {
      setIsRetrying(false);
    }
  }

  if (retried) {
    return (
      <p className="text-sm text-green-400">
        Test re-queued! It should start processing shortly.
      </p>
    );
  }

  return (
    <Button
      onClick={handleRetry}
      disabled={isRetrying}
      variant="outline"
      className="border-orange-500/50 text-orange-400 hover:bg-orange-500/10"
    >
      <RefreshCw className={`w-4 h-4 mr-2 ${isRetrying ? 'animate-spin' : ''}`} />
      {isRetrying ? 'Re-queuing...' : 'Retry Test'}
    </Button>
  );
}
