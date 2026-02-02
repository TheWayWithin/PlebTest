/**
 * Change Plan API
 *
 * Updates the user's Stripe subscription to a new price/plan.
 * POST /api/subscription/change-plan
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

    // Update the subscription with proration
    const updatedSubscription = await stripe.subscriptions.update(subscription.id, {
      items: [
        {
          id: currentItem.id,
          price: newPriceId,
        },
      ],
      proration_behavior: 'create_prorations',
    });

    // The webhook (customer.subscription.updated) will handle updating the
    // user's tier and status in our database, but we return the new state
    // for immediate UI feedback
    const newPriceIdFromSub = updatedSubscription.items.data[0]?.price.id;

    return NextResponse.json({
      success: true,
      subscriptionId: updatedSubscription.id,
      newPriceId: newPriceIdFromSub,
      status: updatedSubscription.status,
    });
  } catch (error) {
    console.error('[Change Plan] Error:', error);

    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ error: 'Failed to change plan' }, { status: 500 });
  }
}
