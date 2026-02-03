/**
 * Proration Preview API
 *
 * Uses Stripe's invoices.createPreview() to show exactly what will be charged
 * when switching plans. This accounts for coupons, partial periods, and Stripe's
 * internal rounding — ensuring the preview matches the actual charge.
 *
 * - Upgrades: proration_behavior 'always_invoice' (charges immediately)
 * - Downgrades: proration_behavior 'create_prorations' (credit on next invoice)
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

    // Get the new price details and determine direction
    const newPrice = await stripe.prices.retrieve(newPriceId);
    const newAmount = newPrice.unit_amount || 0;
    const newInterval = newPrice.recurring?.interval || 'month';
    const currentAmount = currentItem.price.unit_amount || 0;

    // Determine if this is an upgrade or downgrade based on price
    const isUpgrade = newAmount > currentAmount;
    const prorationBehavior = isUpgrade ? 'always_invoice' : 'create_prorations';

    // Use Stripe's preview API for accurate proration (accounts for coupons, etc.)
    const prorationDate = Math.floor(Date.now() / 1000);

    const previewInvoice = await stripe.invoices.createPreview({
      customer: userData.stripe_customer_id,
      subscription: subscription.id,
      subscription_details: {
        items: [
          {
            id: currentItem.id,
            price: newPriceId,
          },
        ],
        proration_behavior: prorationBehavior,
        proration_date: prorationDate,
      },
    });

    // Extract proration amounts from the preview invoice
    // Proration lines are identified by parent.subscription_item_details.proration
    // or by checking if the period doesn't match the full billing cycle
    let creditCents = 0;
    let chargeCents = 0;

    for (const line of previewInvoice.lines.data) {
      // Check for proration flag in the newer Stripe SDK structure
      const isProration = line.parent?.subscription_item_details?.proration ?? false;

      if (isProration) {
        if (line.amount < 0) {
          creditCents += Math.abs(line.amount); // negative = credit for old plan
        } else {
          chargeCents += line.amount; // positive = charge for new plan
        }
      }
    }

    const proratedDiffCents = chargeCents - creditCents;

    // Calculate days remaining for UI messaging
    const periodEnd = currentItem.current_period_end;
    const periodStart = currentItem.current_period_start;
    const totalSeconds = periodEnd - periodStart;
    const remainingSeconds = Math.max(periodEnd - prorationDate, 0);
    const daysRemaining = Math.ceil(remainingSeconds / 86400);
    const totalDays = Math.ceil(totalSeconds / 86400);

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
      isUpgrade,
      immediateCharge: isUpgrade, // upgrades charge now, downgrades credit at next invoice
      prorationDate, // pass back so change-plan uses same timestamp
    });
  } catch (error) {
    console.error('[Preview Proration] Error:', error);

    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ error: 'Failed to preview proration' }, { status: 500 });
  }
}
