'use client';

import { useState, useCallback } from 'react';
import { Share2, Copy, Check, Globe, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

interface ShareReportSectionProps {
  reportId: string;
  testId: string;
  proposalId: string;
  ideaId: string;
  initialIsPublic: boolean;
  initialHideProposalDetails: boolean;
  initialShareToken: string | null;
}

export function ShareReportSection({
  reportId,
  testId,
  proposalId,
  ideaId,
  initialIsPublic,
  initialHideProposalDetails,
  initialShareToken,
}: ShareReportSectionProps) {
  const [isPublic, setIsPublic] = useState(initialIsPublic);
  const [hideProposalDetails, setHideProposalDetails] = useState(initialHideProposalDetails);
  const [shareToken, setShareToken] = useState(initialShareToken);
  const [isUpdating, setIsUpdating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const shareUrl = shareToken
    ? `${typeof window !== 'undefined' ? window.location.origin : ''}/r/${shareToken}`
    : null;

  const updateShareSettings = useCallback(async (
    newIsPublic: boolean,
    newHideProposalDetails: boolean
  ) => {
    setIsUpdating(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/ideas/${ideaId}/proposals/${proposalId}/tests/${testId}/report/share`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            is_public: newIsPublic,
            hide_proposal_details: newHideProposalDetails,
          }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update share settings');
      }

      const data = await response.json();
      setIsPublic(data.is_public);
      setHideProposalDetails(data.hide_proposal_details);
      setShareToken(data.share_token);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update');
      // Revert optimistic update
      setIsPublic(initialIsPublic);
      setHideProposalDetails(initialHideProposalDetails);
    } finally {
      setIsUpdating(false);
    }
  }, [ideaId, proposalId, testId, initialIsPublic, initialHideProposalDetails]);

  const handlePublicToggle = async (checked: boolean) => {
    setIsPublic(checked);
    await updateShareSettings(checked, hideProposalDetails);
  };

  const handleHideProposalToggle = async (checked: boolean) => {
    setHideProposalDetails(checked);
    await updateShareSettings(isPublic, checked);
  };

  const copyToClipboard = async () => {
    if (!shareUrl) return;

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError('Failed to copy to clipboard');
    }
  };

  return (
    <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <Share2 className="w-5 h-5 text-orange-400" />
        <h2 className="text-lg font-semibold text-white">Share Report</h2>
      </div>

      <div className="space-y-4">
        {/* Public toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Globe className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-white">Make report public</p>
              <p className="text-xs text-gray-400">Anyone with the link can view</p>
            </div>
          </div>
          <Switch
            checked={isPublic}
            onCheckedChange={handlePublicToggle}
            disabled={isUpdating}
          />
        </div>

        {/* Hide proposal details toggle - only show when public */}
        {isPublic && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <EyeOff className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-white">Hide proposal details</p>
                <p className="text-xs text-gray-400">Don&apos;t show problem/solution in shared report</p>
              </div>
            </div>
            <Switch
              checked={hideProposalDetails}
              onCheckedChange={handleHideProposalToggle}
              disabled={isUpdating}
            />
          </div>
        )}

        {/* Share URL */}
        {isPublic && shareUrl && (
          <div className="mt-4">
            <label className="text-sm text-gray-400 mb-1 block">Share link</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-300 font-mono"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={copyToClipboard}
                className="border-gray-600 text-gray-300 hover:text-white hover:bg-gray-800"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Loading indicator */}
        {isUpdating && (
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Loader2 className="w-4 h-4 animate-spin" />
            Updating share settings...
          </div>
        )}

        {/* Error message */}
        {error && (
          <p className="text-sm text-red-400">{error}</p>
        )}
      </div>
    </div>
  );
}
