import { createClient } from '@/lib/supabase/server';
import { PricingClient, type PriceConfig } from './pricing-client';

// Build price config from environment variables (server-side only)
function getPriceConfig(): PriceConfig {
  return {
    solo: {
      monthly: process.env.STRIPE_PRICE_SOLO_MONTHLY!,
      annual: process.env.STRIPE_PRICE_SOLO_ANNUAL!,
    },
    growth: {
      monthly: process.env.STRIPE_PRICE_GROWTH_MONTHLY!,
      annual: process.env.STRIPE_PRICE_GROWTH_ANNUAL!,
    },
    scale: {
      monthly: process.env.STRIPE_PRICE_SCALE_MONTHLY!,
      annual: process.env.STRIPE_PRICE_SCALE_ANNUAL!,
    },
    pro: {
      monthly: process.env.STRIPE_PRICE_PRO_MONTHLY!,
      annual: process.env.STRIPE_PRICE_PRO_ANNUAL!,
    },
  };
}

export default async function PricingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Get user's current subscription if logged in
  let currentTier: string | null = null;
  let subscriptionStatus: string | null = null;

  if (user) {
    const { data: userData } = await supabase
      .from('users')
      .select('subscription_tier, subscription_status')
      .eq('id', user.id)
      .single();

    currentTier = userData?.subscription_tier || null;
    subscriptionStatus = userData?.subscription_status || null;
  }

  return (
    <PricingClient
      isLoggedIn={!!user}
      currentTier={currentTier}
      subscriptionStatus={subscriptionStatus}
      priceConfig={getPriceConfig()}
    />
  );
}
