'use client';

import { useState, useEffect, useCallback } from 'react';
import { X, Check, Loader2, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PriceConfig {
  solo: { monthly: string; annual: string };
  growth: { monthly: string; annual: string };
  scale: { monthly: string; annual: string };
  pro: { monthly: string; annual: string };
}

interface ChangePlanDialogProps {
  open: boolean;
  onClose: () => void;
  currentTier: string;
  currentInterval: 'month' | 'year' | null;
  priceConfig: PriceConfig;
}

interface ProrationPreview {
  currentPriceAmount: number;
  newPriceAmount: number;
  newInterval: string;
  credit: number;
  charge: number;
  proratedDiff: number;
  daysRemaining: number;
  totalDays: number;
  currentPeriodEnd: string;
  currency: string;
  isUpgrade: boolean;
  immediateCharge: boolean;
  prorationDate: number;
}

const TIERS = ['solo', 'growth', 'scale', 'pro'] as const;
type Tier = typeof TIERS[number];

const TIER_INFO: Record<Tier, { name: string; monthlyPrice: number; annualPrice: number; ideas: number; tests: number }> = {
  solo: { name: 'Solo', monthlyPrice: 9.95, annualPrice: 99.50, ideas: 1, tests: 10 },
  growth: { name: 'Growth', monthlyPrice: 19.95, annualPrice: 199.50, ideas: 3, tests: 30 },
  scale: { name: 'Scale', monthlyPrice: 29.95, annualPrice: 299.50, ideas: 10, tests: 100 },
  pro: { name: 'Pro', monthlyPrice: 49.95, annualPrice: 499.50, ideas: 20, tests: 200 },
};

function getDirection(currentTier: string, newTier: string): 'upgrade' | 'downgrade' | 'same' {
  const currentIdx = TIERS.indexOf(currentTier as Tier);
  const newIdx = TIERS.indexOf(newTier as Tier);
  if (newIdx > currentIdx) return 'upgrade';
  if (newIdx < currentIdx) return 'downgrade';
  return 'same';
}

function formatMoney(amount: number): string {
  return `$${Math.abs(amount).toFixed(2)}`;
}

export function ChangePlanDialog({
  open,
  onClose,
  currentTier,
  currentInterval,
  priceConfig,
}: ChangePlanDialogProps) {
  const [selectedTier, setSelectedTier] = useState<Tier | null>(null);
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'annual'>(
    currentInterval === 'year' ? 'annual' : 'monthly'
  );
  const [preview, setPreview] = useState<ProrationPreview | null>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      setSelectedTier(null);
      setPreview(null);
      setError(null);
      setSuccess(false);
      setConfirming(false);
      setBillingInterval(currentInterval === 'year' ? 'annual' : 'monthly');
    }
  }, [open, currentInterval]);

  // Fetch proration preview when selection changes
  const fetchPreview = useCallback(async (tier: Tier, interval: 'monthly' | 'annual') => {
    const tierPrices = priceConfig[tier];
    const newPriceId = interval === 'monthly' ? tierPrices.monthly : tierPrices.annual;

    setLoadingPreview(true);
    setError(null);
    setPreview(null);

    try {
      const res = await fetch('/api/subscription/preview-proration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPriceId }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to preview');
        return;
      }

      setPreview(data);
    } catch {
      setError('Failed to load proration preview');
    } finally {
      setLoadingPreview(false);
    }
  }, [priceConfig]);

  const handleSelectTier = (tier: Tier) => {
    if (tier === currentTier && billingInterval === (currentInterval === 'year' ? 'annual' : 'monthly')) {
      return;
    }
    setSelectedTier(tier);
    setSuccess(false);
    fetchPreview(tier, billingInterval);
  };

  const handleIntervalChange = (interval: 'monthly' | 'annual') => {
    setBillingInterval(interval);
    if (selectedTier) {
      setSuccess(false);
      fetchPreview(selectedTier, interval);
    }
  };

  const handleConfirm = async () => {
    if (!selectedTier) return;

    const tierPrices = priceConfig[selectedTier];
    const newPriceId = billingInterval === 'monthly' ? tierPrices.monthly : tierPrices.annual;

    setConfirming(true);
    setError(null);

    try {
      const res = await fetch('/api/subscription/change-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          newPriceId,
          prorationDate: preview?.prorationDate, // Use same timestamp as preview for consistency
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to change plan');
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch {
      setError('Failed to change plan');
    } finally {
      setConfirming(false);
    }
  };

  if (!open) return null;

  const isCurrentSelection = (tier: Tier) => {
    return tier === currentTier && billingInterval === (currentInterval === 'year' ? 'annual' : 'monthly');
  };

  const isUpgrade = selectedTier ? getDirection(currentTier, selectedTier) === 'upgrade' : false;
  const isDowngrade = selectedTier ? getDirection(currentTier, selectedTier) === 'downgrade' : false;
  const intervalChanged = selectedTier && selectedTier === currentTier; // same tier, different interval

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Dialog */}
      <div className="relative mx-4 w-full max-w-2xl rounded-xl border border-zinc-800 bg-zinc-900 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-4">
          <h2 className="text-lg font-semibold text-white">Change Plan</h2>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Billing interval toggle */}
          <div className="flex justify-center">
            <div className="inline-flex items-center rounded-full bg-zinc-800 p-1">
              <button
                onClick={() => handleIntervalChange('monthly')}
                className={cn(
                  'px-4 py-1.5 text-sm font-medium rounded-full transition-colors',
                  billingInterval === 'monthly'
                    ? 'bg-emerald-600 text-white'
                    : 'text-zinc-400 hover:text-white'
                )}
              >
                Monthly
              </button>
              <button
                onClick={() => handleIntervalChange('annual')}
                className={cn(
                  'px-4 py-1.5 text-sm font-medium rounded-full transition-colors',
                  billingInterval === 'annual'
                    ? 'bg-emerald-600 text-white'
                    : 'text-zinc-400 hover:text-white'
                )}
              >
                Annual (20% off)
              </button>
            </div>
          </div>

          {/* Plan grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {TIERS.map((tier) => {
              const info = TIER_INFO[tier];
              const isCurrent = isCurrentSelection(tier);
              const isSelected = selectedTier === tier && !isCurrent;
              const direction = getDirection(currentTier, tier);
              const price = billingInterval === 'monthly' ? info.monthlyPrice : info.annualPrice / 12;

              return (
                <button
                  key={tier}
                  onClick={() => handleSelectTier(tier)}
                  disabled={isCurrent}
                  className={cn(
                    'relative rounded-lg border p-3 text-left transition-all',
                    isCurrent
                      ? 'border-zinc-700 bg-zinc-800/50 cursor-default'
                      : isSelected
                      ? 'border-emerald-500 bg-emerald-500/5 ring-1 ring-emerald-500'
                      : 'border-zinc-800 bg-zinc-800/30 hover:border-zinc-600 cursor-pointer'
                  )}
                >
                  {isCurrent && (
                    <span className="absolute -top-2 right-2 bg-zinc-700 text-zinc-300 text-[10px] font-medium px-2 py-0.5 rounded-full">
                      Current
                    </span>
                  )}
                  {isSelected && direction !== 'same' && (
                    <span className={cn(
                      'absolute -top-2 right-2 text-[10px] font-medium px-2 py-0.5 rounded-full',
                      direction === 'upgrade'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-amber-500/20 text-amber-400'
                    )}>
                      {direction === 'upgrade' ? 'Upgrade' : 'Downgrade'}
                    </span>
                  )}
                  <div className="text-sm font-semibold text-white">{info.name}</div>
                  <div className="mt-1 text-lg font-bold text-white">
                    ${price.toFixed(2)}
                    <span className="text-xs font-normal text-zinc-400">/mo</span>
                  </div>
                  <div className="mt-1.5 text-xs text-zinc-400">
                    {info.ideas} idea{info.ideas > 1 ? 's' : ''} &middot; {info.tests} tests/mo
                  </div>
                </button>
              );
            })}
          </div>

          {/* Proration preview */}
          {loadingPreview && (
            <div className="flex items-center justify-center gap-2 py-4 text-sm text-zinc-400">
              <Loader2 className="h-4 w-4 animate-spin" />
              Calculating...
            </div>
          )}

          {preview && selectedTier && !loadingPreview && (
            <div className="rounded-lg border border-zinc-800 bg-zinc-800/30 p-4 space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-white">
                {isUpgrade ? (
                  <ArrowUp className="h-4 w-4 text-emerald-400" />
                ) : isDowngrade ? (
                  <ArrowDown className="h-4 w-4 text-amber-400" />
                ) : (
                  <Minus className="h-4 w-4 text-zinc-400" />
                )}
                Switching to {TIER_INFO[selectedTier].name} ({billingInterval})
              </div>

              <div className="space-y-1.5 text-sm">
                {/* Price comparison */}
                <div className="flex justify-between">
                  <span className="text-zinc-400">Current price</span>
                  <span className="text-zinc-300">
                    {formatMoney(preview.currentPriceAmount)}/{preview.newInterval === 'year' ? 'yr' : 'mo'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">New price</span>
                  <span className="text-white">
                    {formatMoney(preview.newPriceAmount)}/{preview.newInterval === 'year' ? 'yr' : 'mo'}
                  </span>
                </div>

                {/* Proration breakdown */}
                <div className="border-t border-zinc-700 pt-1.5 mt-1.5">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">
                      Prorated for {preview.daysRemaining} day{preview.daysRemaining !== 1 ? 's' : ''} remaining
                    </span>
                    <span className={cn(
                      'font-medium',
                      preview.proratedDiff > 0 ? 'text-white' : 'text-emerald-400'
                    )}>
                      {preview.proratedDiff >= 0
                        ? `+${formatMoney(preview.proratedDiff)}`
                        : `-${formatMoney(preview.proratedDiff)} credit`
                      }
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    {preview.immediateCharge
                      ? preview.proratedDiff >= 0
                        ? 'Charged to your payment method now'
                        : 'Refunded to your payment method'
                      : preview.proratedDiff >= 0
                        ? 'Added to your next invoice'
                        : 'Credit applied to your next invoice'
                    }
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3 text-sm text-emerald-400 flex items-center gap-2">
              <Check className="h-4 w-4" />
              Plan changed successfully! Refreshing...
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-zinc-800 px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedTier || !preview || confirming || success || loadingPreview}
            className={cn(
              'rounded-lg px-4 py-2 text-sm font-medium transition-colors flex items-center gap-2',
              !selectedTier || !preview || confirming || success || loadingPreview
                ? 'bg-zinc-700 text-zinc-500 cursor-not-allowed'
                : 'bg-emerald-600 text-white hover:bg-emerald-500'
            )}
          >
            {confirming ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {preview?.immediateCharge ? 'Processing Payment...' : 'Confirming...'}
              </>
            ) : preview?.immediateCharge && preview.proratedDiff > 0 ? (
              `Pay ${formatMoney(preview.proratedDiff)} & Upgrade`
            ) : (
              'Confirm Change'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
