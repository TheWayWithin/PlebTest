import Link from 'next/link';
import { CreditCard, Calendar, Zap, AlertTriangle, ArrowUpRight } from 'lucide-react';

const TIER_PRICES: Record<string, { monthly: number; annual: number }> = {
  solo: { monthly: 9.95, annual: 99.50 },
  growth: { monthly: 19.95, annual: 199.50 },
  scale: { monthly: 29.95, annual: 299.50 },
  pro: { monthly: 49.95, annual: 499.50 },
};

interface SubscriptionCardProps {
  tier: string;
  status: string;
  ideasUsed: number;
  ideasLimit: number;
  trialEndsAt: string | null;
  nextBillingDate: Date | null;
  paymentMethodLast4: string | null;
  paymentMethodBrand: string | null;
  cancelAtPeriodEnd: boolean;
  interval: 'month' | 'year' | null;
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; classes: string }> = {
    active: { label: 'Active', classes: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
    trial: { label: 'Free Trial', classes: 'bg-zinc-500/10 text-zinc-300 border-zinc-500/20' },
    past_due: { label: 'Past Due', classes: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
    cancelled: { label: 'Cancelled', classes: 'bg-red-500/10 text-red-400 border-red-500/20' },
    expired: { label: 'Expired', classes: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20' },
  };

  const { label, classes } = config[status] || config.expired;

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${classes}`}>
      {label}
    </span>
  );
}

function formatDate(date: Date | string | null): string {
  if (!date) return 'N/A';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function capitalise(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function SubscriptionCard({
  tier,
  status,
  ideasUsed,
  ideasLimit,
  trialEndsAt,
  nextBillingDate,
  paymentMethodLast4,
  paymentMethodBrand,
  cancelAtPeriodEnd,
  interval,
}: SubscriptionCardProps) {
  const tierPrices = TIER_PRICES[tier];
  const usagePercent = ideasLimit > 0 ? Math.min((ideasUsed / ideasLimit) * 100, 100) : 0;
  const isFreeTier = status === 'trial' || status === 'expired' || (status === 'cancelled' && !nextBillingDate);
  const showUpgradeCta = isFreeTier || tier === 'solo';

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Subscription</h2>
        <StatusBadge status={status} />
      </div>

      {/* Alert banners */}
      {status === 'past_due' && (
        <div className="mt-4 flex items-start gap-3 rounded-md border border-amber-500/20 bg-amber-500/5 p-3">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
          <p className="text-sm text-amber-300">
            Your last payment failed. Please update your payment method to keep your subscription active.
          </p>
        </div>
      )}

      {cancelAtPeriodEnd && status === 'active' && (
        <div className="mt-4 flex items-start gap-3 rounded-md border border-red-500/20 bg-red-500/5 p-3">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
          <p className="text-sm text-red-300">
            Your subscription is set to cancel on {formatDate(nextBillingDate)}. You&apos;ll retain access until then.
          </p>
        </div>
      )}

      {/* Info grid */}
      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        {/* Current Plan */}
        <div>
          <div className="flex items-center gap-2 text-sm font-medium text-zinc-400">
            <Zap className="h-4 w-4" />
            Current Plan
          </div>
          <p className="mt-1 text-lg font-semibold text-white">
            {capitalise(tier)}
          </p>
          {tierPrices && !isFreeTier && interval && (
            <p className="text-sm text-zinc-400">
              ${interval === 'year' ? tierPrices.annual.toFixed(2) : tierPrices.monthly.toFixed(2)}/{interval === 'year' ? 'year' : 'month'}
            </p>
          )}
          {isFreeTier && (
            <p className="text-sm text-zinc-400">Free</p>
          )}
        </div>

        {/* Usage */}
        <div>
          <div className="flex items-center gap-2 text-sm font-medium text-zinc-400">
            <Zap className="h-4 w-4" />
            Ideas Used
          </div>
          <p className="mt-1 text-lg font-semibold text-white">
            {ideasUsed} <span className="text-sm font-normal text-zinc-400">of {ideasLimit}</span>
          </p>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-zinc-800">
            <div
              className={`h-full rounded-full transition-all ${
                usagePercent >= 100 ? 'bg-red-500' : usagePercent >= 75 ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${usagePercent}%` }}
            />
          </div>
        </div>

        {/* Billing Date */}
        <div>
          <div className="flex items-center gap-2 text-sm font-medium text-zinc-400">
            <Calendar className="h-4 w-4" />
            {status === 'trial' ? 'Trial Ends' : cancelAtPeriodEnd ? 'Access Until' : 'Next Billing Date'}
          </div>
          <p className="mt-1 text-white">
            {status === 'trial' && trialEndsAt
              ? formatDate(trialEndsAt)
              : nextBillingDate
                ? formatDate(nextBillingDate)
                : 'N/A'}
          </p>
        </div>

        {/* Payment Method */}
        {status !== 'cancelled' && status !== 'expired' && (
          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-zinc-400">
              <CreditCard className="h-4 w-4" />
              Payment Method
            </div>
            <p className="mt-1 text-white">
              {paymentMethodLast4
                ? `${capitalise(paymentMethodBrand || 'Card')} ending in ${paymentMethodLast4}`
                : 'Not set up'}
            </p>
          </div>
        )}
      </div>

      {/* Upgrade CTA */}
      {showUpgradeCta && (
        <div className="mt-6 border-t border-zinc-800 pt-4">
          <Link
            href="/pricing"
            className="inline-flex items-center gap-1 text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            {isFreeTier ? 'Upgrade your plan' : 'View plans'}
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}
    </div>
  );
}
