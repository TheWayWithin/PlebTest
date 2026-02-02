/**
 * Proration Preview API
 *
 * Calculates what the customer will owe when switching plans, using the
 * subscription's own period and price data rather than trying to parse
 * Stripe's opaque preview-invoice line items.
 *
 * POST /api/subscription/preview-proration
 * Body: { newPriceId: string }
 */

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/lib/supabase/server';
import { getStripe } from '@/lib/stripe';

const VALID_PRICE_IDS = new Set([
  process.env.STRIPE_PRICE_SOLO_MONTHLY,
  process.env.STRIPE_PRICE_SOLO_ANNUAL,
  process.env.STRIPE_PRICE_GROWTH_MONTHLY,
  process.env.STRIPE_PRICE_GROWTH_ANNUAL,
  process.env.STRIPE_PRICE_SCALE_MONTHLY,
  process.env.STRIPE_PRICE_SCALE_ANNUAL,
  process.env.STRIPE_PRICE_PRO_MONTHLY,
  process.env.STRIPE_PRICE_PRO_ANNUAL,
]);

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { newPriceId } = await request.json();

    if (!newPriceId || !VALID_PRICE_IDS.has(newPriceId)) {
      return NextResponse.json({ error: 'Invalid price ID' }, { status: 400 });
    }

    // Get user's Stripe customer ID
    const { data: userData } = await supabase
      .from('users')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single();

    if (!userData?.stripe_customer_id) {
      return NextResponse.json({ error: 'No active subscription found' }, { status: 400 });
    }

    const stripe = getStripe();

    // Get current subscription
    const subscriptions = await stripe.subscriptions.list({
      customer: userData.stripe_customer_id,
      status: 'active',
      limit: 1,
    });

    const subscription = subscriptions.data[0];
    if (!subscription) {
      return NextResponse.json({ error: 'No active subscription found' }, { status: 400 });
    }

    const currentItem = subscription.items.data[0];
    if (!currentItem) {
      return NextResponse.json({ error: 'Subscription has no items' }, { status: 400 });
    }

    // If same price, no change needed
    if (currentItem.price.id === newPriceId) {
      return NextResponse.json({ error: 'Already on this plan' }, { status: 400 });
    }

    // Get the new price details
    const newPrice = await stripe.prices.retrieve(newPriceId);
    const newAmount = newPrice.unit_amount || 0; // cents
    const newInterval = newPrice.recurring?.interval || 'month';

    // Calculate proration from subscription data directly.
    //
    // This is transparent math the user can verify:
    //   remaining_ratio  = (period_end - now) / (period_end - period_start)
    //   credit           = current_price × remaining_ratio
    //   charge           = new_price     × remaining_ratio
    //   prorated_diff    = charge - credit
    //
    const currentAmount = currentItem.price.unit_amount || 0; // cents
    const periodStart = currentItem.current_period_start;
    const periodEnd = currentItem.current_period_end;
    const now = Math.floor(Date.now() / 1000);

    const totalSeconds = periodEnd - periodStart;
    const remainingSeconds = Math.max(periodEnd - now, 0);
    const remainingRatio = totalSeconds > 0 ? remainingSeconds / totalSeconds : 0;

    const daysRemaining = Math.ceil(remainingSeconds / 86400);
    const totalDays = Math.ceil(totalSeconds / 86400);

    const creditCents = Math.round(currentAmount * remainingRatio);
    const chargeCents = Math.round(newAmount * remainingRatio);
    const proratedDiffCents = chargeCents - creditCents;

    return NextResponse.json({
      currentPriceAmount: currentAmount / 100,
      newPriceAmount: newAmount / 100,
      newInterval,
      credit: creditCents / 100,
      charge: chargeCents / 100,
      proratedDiff: proratedDiffCents / 100,
      daysRemaining,
      totalDays,
      currentPeriodEnd: new Date(periodEnd * 1000).toISOString(),
      currency: currentItem.price.currency || 'usd',
    });
  } catch (error) {
    console.error('[Preview Proration] Error:', error);

    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ error: 'Failed to preview proration' }, { status: 500 });
  }
}
