/**
 * Subscription Sync API (TEMPORARY diagnostic tool)
 *
 * POST /api/sync-subscription
 * Reads the user's Stripe subscription and updates the database to match.
 * Requires authentication.
 */

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getStripe } from '@/lib/stripe';

const PRICE_TO_TIER: Record<string, 'solo' | 'growth' | 'scale' | 'pro'> = {
  [process.env.STRIPE_PRICE_SOLO_MONTHLY!]: 'solo',
  [process.env.STRIPE_PRICE_SOLO_ANNUAL!]: 'solo',
  [process.env.STRIPE_PRICE_GROWTH_MONTHLY!]: 'growth',
  [process.env.STRIPE_PRICE_GROWTH_ANNUAL!]: 'growth',
  [process.env.STRIPE_PRICE_SCALE_MONTHLY!]: 'scale',
  [process.env.STRIPE_PRICE_SCALE_ANNUAL!]: 'scale',
  [process.env.STRIPE_PRICE_PRO_MONTHLY!]: 'pro',
  [process.env.STRIPE_PRICE_PRO_ANNUAL!]: 'pro',
};

export async function POST() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const admin = createAdminClient();

    // Get user record, create if missing
    let { data: userData, error: userError } = await admin
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (userError?.code === 'PGRST116' || !userData) {
      // User row doesn't exist yet - create it
      const { data: newUser, error: insertError } = await admin
        .from('users')
        .insert({
          id: user.id,
          email: user.email || '',
          subscription_tier: 'solo',
          subscription_status: 'trial',
        })
        .select()
        .single();

      if (insertError || !newUser) {
        return NextResponse.json({ error: 'Failed to create user record', details: insertError }, { status: 500 });
      }
      userData = newUser;
    } else if (userError) {
      return NextResponse.json({ error: 'User lookup failed', details: userError }, { status: 500 });
    }

    // If no stripe_customer_id, check Stripe by email
    let customerId = userData.stripe_customer_id;
    if (!customerId) {
      const stripe = getStripe();
      const customers = await stripe.customers.list({ email: user.email!, limit: 1 });
      if (customers.data.length > 0) {
        customerId = customers.data[0].id;
      }
    }

    if (!customerId) {
      return NextResponse.json({
        message: 'No Stripe customer found',
        user: {
          id: user.id,
          email: user.email,
          tier: userData.subscription_tier,
          status: userData.subscription_status,
          stripe_customer_id: null,
        },
      });
    }

    // Get subscriptions from Stripe
    const stripe = getStripe();
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      limit: 1,
      expand: ['data.default_payment_method'],
    });

    const subscription = subscriptions.data[0];

    if (!subscription) {
      return NextResponse.json({
        message: 'No active subscription in Stripe',
        customer_id: customerId,
        user: {
          tier: userData.subscription_tier,
          status: userData.subscription_status,
        },
      });
    }

    // Determine tier from price
    const item = subscription.items.data[0];
    const priceId = item?.price.id;
    const tier = priceId ? PRICE_TO_TIER[priceId] : 'solo';
    const periodStart = item?.current_period_start;
    const periodEnd = item?.current_period_end;

    // Build update
    const updateData: Record<string, unknown> = {
      stripe_customer_id: customerId,
      subscription_tier: tier || 'solo',
      subscription_status: subscription.status === 'active' ? 'active' : subscription.status === 'trialing' ? 'trial' : 'active',
      updated_at: new Date().toISOString(),
    };

    if (periodStart) {
      updateData.billing_cycle_anchor = new Date(periodStart * 1000).toISOString();
    }

    if (subscription.trial_end) {
      updateData.trial_ends_at = new Date(subscription.trial_end * 1000).toISOString();
    } else {
      updateData.trial_ends_at = null;
    }

    // Update user record
    const { error: updateError } = await admin
      .from('users')
      .update(updateData)
      .eq('id', user.id);

    if (updateError) {
      return NextResponse.json({ error: 'Failed to update user', details: updateError }, { status: 500 });
    }

    return NextResponse.json({
      message: 'Subscription synced successfully',
      before: {
        tier: userData.subscription_tier,
        status: userData.subscription_status,
        stripe_customer_id: userData.stripe_customer_id,
      },
      after: updateData,
      stripe_subscription: {
        id: subscription.id,
        status: subscription.status,
        price_id: priceId,
        period_end: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
      },
    });
  } catch (error) {
    console.error('[Sync] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
