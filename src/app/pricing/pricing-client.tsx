'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Check, Loader2, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

// Price config passed from server component
export interface PriceConfig {
  solo: { monthly: string; annual: string };
  growth: { monthly: string; annual: string };
  scale: { monthly: string; annual: string };
  pro: { monthly: string; annual: string };
}

interface PricingClientProps {
  isLoggedIn: boolean;
  currentTier: string | null;
  subscriptionStatus: string | null;
  priceConfig: PriceConfig;
}

// Pricing configuration - from pricing.yaml
const TIER_DATA = [
  {
    name: 'Solo',
    description: 'Validate your one big idea',
    monthlyPrice: 9.95,
    annualPrice: 99.50,
    features: [
      '1 product to validate',
      '10 tests per month',
      'Full test reports',
      'Anti-sycophancy feedback',
    ],
    highlight: false,
    tier: 'solo' as const,
  },
  {
    name: 'Growth',
    description: 'Compare ideas head-to-head',
    monthlyPrice: 19.95,
    annualPrice: 199.50,
    features: [
      '3 products to validate',
      '30 tests per month',
      'Full test reports',
      'Anti-sycophancy feedback',
      'Compare ideas side-by-side',
    ],
    highlight: true,
    tier: 'growth' as const,
  },
  {
    name: 'Scale',
    description: 'Rapid-fire validation',
    monthlyPrice: 29.95,
    annualPrice: 299.50,
    features: [
      '10 products to validate',
      '100 tests per month',
      'Full test reports',
      'Anti-sycophancy feedback',
      'Priority processing',
    ],
    highlight: false,
    tier: 'scale' as const,
  },
  {
    name: 'Pro',
    description: 'Validate at agency scale',
    monthlyPrice: 49.95,
    annualPrice: 499.50,
    features: [
      '20 products to validate',
      '200 tests per month',
      'Full test reports',
      'Anti-sycophancy feedback',
      'Priority processing',
      'Client-ready reports',
    ],
    highlight: false,
    tier: 'pro' as const,
  },
];

export function PricingClient({ isLoggedIn, currentTier, subscriptionStatus, priceConfig }: PricingClientProps) {
  const router = useRouter();
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'annual'>('monthly');
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubscribe = async (tier: typeof TIER_DATA[0]) => {
    // If not logged in, redirect to signup
    if (!isLoggedIn) {
      router.push('/signup?redirect=/pricing');
      return;
    }

    // If already subscribed to this tier, do nothing
    if (currentTier === tier.tier && subscriptionStatus === 'active') {
      return;
    }

    setLoading(tier.tier);
    setError(null);

    try {
      const tierPrices = priceConfig[tier.tier];
      const priceId = billingInterval === 'monthly' ? tierPrices.monthly : tierPrices.annual;

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          billingInterval,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setLoading(null);
    }
  };

  const isCurrentPlan = (tier: string) => {
    return currentTier === tier && subscriptionStatus === 'active';
  };

  return (
    <div className="min-h-screen bg-zinc-950 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Back link */}
        <Link
          href={isLoggedIn ? '/dashboard' : '/'}
          className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          {isLoggedIn ? 'Back to Dashboard' : 'Back to Home'}
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Choose Your Plan
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            Kill the duds. Pivot the rough diamonds. Build the winners.
            <br />
            Start validating ideas in minutes, not months.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex items-center rounded-full bg-zinc-900 p-1 border border-zinc-800">
            <button
              onClick={() => setBillingInterval('monthly')}
              className={cn(
                'px-6 py-2 text-sm font-medium rounded-full transition-colors',
                billingInterval === 'monthly'
                  ? 'bg-emerald-600 text-white'
                  : 'text-zinc-400 hover:text-white'
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingInterval('annual')}
              className={cn(
                'px-6 py-2 text-sm font-medium rounded-full transition-colors relative',
                billingInterval === 'annual'
                  ? 'bg-emerald-600 text-white'
                  : 'text-zinc-400 hover:text-white'
              )}
            >
              Annual
              <span className="absolute -top-2 -right-2 bg-amber-500 text-amber-950 text-xs font-bold px-2 py-0.5 rounded-full">
                20% off
              </span>
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-md mx-auto mb-8 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TIER_DATA.map((tier) => (
            <div
              key={tier.name}
              className={cn(
                'relative rounded-2xl border p-6 flex flex-col',
                tier.highlight
                  ? 'border-emerald-500 bg-zinc-900'
                  : 'border-zinc-800 bg-zinc-900/50',
                isCurrentPlan(tier.tier) && 'ring-2 ring-emerald-500'
              )}
            >
              {/* Popular Badge */}
              {tier.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Current Plan Badge */}
              {isCurrentPlan(tier.tier) && (
                <div className="absolute -top-3 right-4">
                  <span className="bg-zinc-700 text-zinc-300 text-xs font-medium px-3 py-1 rounded-full">
                    Current Plan
                  </span>
                </div>
              )}

              {/* Tier Info */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white">{tier.name}</h3>
                <p className="text-sm text-zinc-400 mt-1">{tier.description}</p>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-white">
                    ${billingInterval === 'monthly' ? tier.monthlyPrice : tier.annualPrice}
                  </span>
                  <span className="text-zinc-400">
                    /{billingInterval === 'monthly' ? 'mo' : 'yr'}
                  </span>
                </div>
                {billingInterval === 'annual' && (
                  <p className="text-sm text-emerald-400 mt-1">
                    Save ${((tier.monthlyPrice * 12) - tier.annualPrice).toFixed(2)}/year
                  </p>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8 flex-grow">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <Check className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                    <span className="text-zinc-300">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <button
                onClick={() => handleSubscribe(tier)}
                disabled={loading !== null || isCurrentPlan(tier.tier)}
                className={cn(
                  'w-full py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2',
                  isCurrentPlan(tier.tier)
                    ? 'bg-zinc-700 text-zinc-400 cursor-not-allowed'
                    : tier.highlight
                    ? 'bg-emerald-600 text-white hover:bg-emerald-500'
                    : 'bg-zinc-800 text-white hover:bg-zinc-700 border border-zinc-700',
                  loading === tier.tier && 'opacity-50 cursor-not-allowed'
                )}
              >
                {loading === tier.tier ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : isCurrentPlan(tier.tier) ? (
                  'Current Plan'
                ) : !isLoggedIn ? (
                  'Get Started'
                ) : (
                  'Subscribe'
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-sm text-zinc-500">
            All plans include a 7-day money-back guarantee. Cancel anytime.
          </p>
          <p className="text-sm text-zinc-600 mt-2">
            Questions?{' '}
            <a href="mailto:support@plebtest.com" className="text-emerald-500 hover:text-emerald-400">
              support@plebtest.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
