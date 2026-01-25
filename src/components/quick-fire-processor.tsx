'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { retrieveQuickFireData, clearQuickFireData } from '@/lib/quick-fire-storage';
import { Sparkles } from 'lucide-react';

/**
 * QuickFireProcessor
 *
 * This component checks for pending Quick Fire data after login/signup
 * and processes it to create an Idea + Proposal.
 *
 * It should be rendered on the dashboard or a post-auth page.
 */
export function QuickFireProcessor() {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function processQuickFireData() {
      const data = retrieveQuickFireData();

      if (!data) {
        // No Quick Fire data to process
        return;
      }

      setIsProcessing(true);
      setStatus('Creating your idea...');

      try {
        const response = await fetch('/api/ideas/from-quick-fire', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            oneLiner: data.oneLiner,
            score: data.score,
            keyObjection: data.keyObjection,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to process Quick Fire data');
        }

        const result = await response.json();

        // Clear the stored data
        clearQuickFireData();

        setStatus('Redirecting to your proposal...');

        // Redirect to the proposal page
        if (result.redirectUrl) {
          router.push(result.redirectUrl);
        } else if (result.idea) {
          router.push(`/ideas/${result.idea.id}`);
        } else {
          router.push('/dashboard');
        }
      } catch (err) {
        console.error('Failed to process Quick Fire data:', err);
        setError(err instanceof Error ? err.message : 'Something went wrong');
        // Clear the data to prevent repeated failures
        clearQuickFireData();
        setIsProcessing(false);
      }
    }

    processQuickFireData();
  }, [router]);

  if (!isProcessing && !error) {
    return null;
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-gray-950/90 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-gray-900 border border-gray-700 rounded-xl p-8 max-w-md mx-4 text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl text-red-400">!</span>
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Processing Error</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => {
              setError(null);
              router.push('/dashboard');
            }}
            className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-950/90 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-8 max-w-md mx-4 text-center">
        <div className="relative w-16 h-16 mx-auto mb-4">
          <div className="absolute inset-0 w-16 h-16 border-4 border-orange-500/30 rounded-full" />
          <div className="absolute inset-0 w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-orange-400" />
        </div>
        <h2 className="text-xl font-semibold text-white mb-2">Setting Up Your Idea</h2>
        <p className="text-gray-400">{status}</p>
      </div>
    </div>
  );
}
