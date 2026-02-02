/**
 * Proration Preview API
 *
 * Returns a preview of what the customer will be charged when switching plans.
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

    // Create an invoice preview to show proration
    const preview = await stripe.invoices.createPreview({
      customer: userData.stripe_customer_id,
      subscription: subscription.id,
      subscription_details: {
        items: [
          {
            id: currentItem.id,
            price: newPriceId,
          },
        ],
        proration_behavior: 'create_prorations',
      },
    });

    // Separate proration line items from the regular subscription charge.
    // The preview invoice contains both proration adjustments AND the next
    // billing cycle charge. We only want to show the proration cost.
    //
    // Proration lines have a period that falls WITHIN the current billing cycle.
    // The next subscription charge has a period that starts AT the current period end.
    const periodEnd = currentItem.current_period_end;
    let prorationTotal = 0;
    let recurringTotal = 0;
    const currency = preview.currency;

    // Debug: log line items to understand structure
    const debugLines = preview.lines.data.map((line) => ({
      amount: line.amount,
      description: line.description,
      periodStart: line.period.start,
      periodEnd: line.period.end,
      subscriptionPeriodEnd: periodEnd,
      isBeforePeriodEnd: line.period.start < periodEnd,
    }));
    console.log('[Preview Proration] Line items:', JSON.stringify(debugLines, null, 2));

    for (const line of preview.lines.data) {
      // Lines whose period starts BEFORE the current period end are prorations
      // (adjustments for the remainder of the current billing cycle).
      // Lines whose period starts AT or AFTER the current period end are
      // the regular next-cycle subscription charge.
      if (line.period.start < periodEnd) {
        prorationTotal += line.amount;
      } else {
        recurringTotal += line.amount;
      }
    }

    // Get the new price details
    const newPrice = await stripe.prices.retrieve(newPriceId);
    const newAmount = newPrice.unit_amount || 0;
    const newInterval = newPrice.recurring?.interval || 'month';

    return NextResponse.json({
      prorationAmount: prorationTotal / 100,
      recurringAmount: recurringTotal / 100,
      immediateAmount: preview.amount_due / 100,
      newPriceAmount: newAmount / 100,
      newInterval,
      currency,
      currentPeriodEnd: new Date(periodEnd * 1000).toISOString(),
      _debug: debugLines,
    });
  } catch (error) {
    console.error('[Preview Proration] Error:', error);

    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ error: 'Failed to preview proration' }, { status: 500 });
  }
}
