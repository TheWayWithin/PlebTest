/**
 * Stripe Webhook Handler
 *
 * Handles Stripe webhook events for subscription management:
 * - checkout.session.completed: New subscription created
 * - customer.subscription.updated: Plan changed or status updated
 * - customer.subscription.deleted: Subscription cancelled
 * - invoice.payment_succeeded: Payment successful
 * - invoice.payment_failed: Payment failed
 *
 * Uses webhook_events table for idempotency to prevent duplicate processing.
 */

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createAdminClient } from '@/lib/supabase/admin';

// Lazy-initialize Stripe to avoid build-time errors
let stripeClient: Stripe | null = null;

function getStripe(): Stripe {
  if (!stripeClient) {
    stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY!);
  }
  return stripeClient;
}

// Map Stripe price IDs to subscription tiers
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

// Map Stripe subscription status to our status
const STATUS_MAP: Record<string, 'trial' | 'active' | 'past_due' | 'cancelled' | 'expired'> = {
  'trialing': 'trial',
  'active': 'active',
  'past_due': 'past_due',
  'canceled': 'cancelled',
  'cancelled': 'cancelled',
  'unpaid': 'past_due',
  'incomplete': 'past_due',
  'incomplete_expired': 'expired',
};

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    console.error('[Stripe Webhook] Missing signature');
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  // Verify webhook signature
  try {
    event = getStripe().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[Stripe Webhook] Signature verification failed:', message);
    return NextResponse.json({ error: `Webhook signature verification failed: ${message}` }, { status: 400 });
  }

  const supabase = createAdminClient();

  // Check idempotency - have we already processed this event?
  const { data: existingEvent } = await supabase
    .from('webhook_events')
    .select('id, status')
    .eq('id', event.id)
    .single();

  if (existingEvent) {
    if (existingEvent.status === 'processed') {
      console.log(`[Stripe Webhook] Event ${event.id} already processed, skipping`);
      return NextResponse.json({ received: true, skipped: true });
    }
    // If status is 'processing' or 'failed', we'll retry
  } else {
    // Record the event as processing
    await supabase.from('webhook_events').insert({
      id: event.id,
      event_type: event.type,
      status: 'processing',
    });
  }

  try {
    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session, supabase);
        break;

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription, supabase);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription, supabase);
        break;

      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice, supabase);
        break;

      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.Invoice, supabase);
        break;

      default:
        console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
    }

    // Mark event as processed
    await supabase
      .from('webhook_events')
      .update({ status: 'processed', processed_at: new Date().toISOString() })
      .eq('id', event.id);

    return NextResponse.json({ received: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[Stripe Webhook] Error processing ${event.type}:`, message);

    // Mark event as failed
    await supabase
      .from('webhook_events')
      .update({ status: 'failed', error: message })
      .eq('id', event.id);

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * Handle checkout.session.completed
 * Called when a customer completes checkout and subscribes
 */
async function handleCheckoutCompleted(
  session: Stripe.Checkout.Session,
  supabase: ReturnType<typeof createAdminClient>
) {
  console.log(`[Stripe Webhook] Checkout completed: ${session.id}`);

  const customerId = session.customer as string;
  const userId = session.client_reference_id; // We set this when creating checkout session
  const subscriptionId = session.subscription as string;

  if (!userId) {
    console.error('[Stripe Webhook] No client_reference_id in checkout session');
    return;
  }

  // Get subscription details to determine tier
  const subscription = await getStripe().subscriptions.retrieve(subscriptionId);
  const item = subscription.items.data[0];
  const priceId = item?.price.id;
  const tier = priceId ? PRICE_TO_TIER[priceId] : 'solo';
  const periodStart = item?.current_period_start;

  // Update user with Stripe customer ID and subscription info
  const updateData: Record<string, unknown> = {
    stripe_customer_id: customerId,
    subscription_tier: tier,
    subscription_status: 'active',
    trial_ends_at: null, // Clear trial since they've subscribed
    updated_at: new Date().toISOString(),
  };

  if (periodStart) {
    updateData.billing_cycle_anchor = new Date(periodStart * 1000).toISOString();
  }

  const { error } = await supabase
    .from('users')
    .update(updateData)
    .eq('id', userId);

  if (error) {
    console.error('[Stripe Webhook] Failed to update user:', error);
    throw error;
  }

  console.log(`[Stripe Webhook] User ${userId} subscribed to ${tier}`);
}

/**
 * Handle customer.subscription.updated
 * Called when subscription changes (upgrade, downgrade, status change)
 */
async function handleSubscriptionUpdated(
  subscription: Stripe.Subscription,
  supabase: ReturnType<typeof createAdminClient>
) {
  console.log(`[Stripe Webhook] Subscription updated: ${subscription.id}`);

  const customerId = subscription.customer as string;
  const priceId = subscription.items.data[0]?.price.id;
  const tier = priceId ? PRICE_TO_TIER[priceId] : null;
  const status = STATUS_MAP[subscription.status] || 'active';

  // Find user by stripe_customer_id
  const { data: user, error: findError } = await supabase
    .from('users')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .single();

  if (findError || !user) {
    console.error('[Stripe Webhook] User not found for customer:', customerId);
    return;
  }

  // Build update object
  const item = subscription.items.data[0];
  const periodStart = item?.current_period_start;
  const updateData: Record<string, unknown> = {
    subscription_status: status,
    updated_at: new Date().toISOString(),
  };

  if (periodStart) {
    updateData.billing_cycle_anchor = new Date(periodStart * 1000).toISOString();
  }

  if (tier) {
    updateData.subscription_tier = tier;
  }

  // Handle trial end
  if (subscription.trial_end) {
    updateData.trial_ends_at = new Date(subscription.trial_end * 1000).toISOString();
  }

  const { error } = await supabase
    .from('users')
    .update(updateData)
    .eq('id', user.id);

  if (error) {
    console.error('[Stripe Webhook] Failed to update subscription:', error);
    throw error;
  }

  console.log(`[Stripe Webhook] Updated user ${user.id} subscription: tier=${tier}, status=${status}`);
}

/**
 * Handle customer.subscription.deleted
 * Called when subscription is cancelled
 */
async function handleSubscriptionDeleted(
  subscription: Stripe.Subscription,
  supabase: ReturnType<typeof createAdminClient>
) {
  console.log(`[Stripe Webhook] Subscription deleted: ${subscription.id}`);

  const customerId = subscription.customer as string;

  // Find user by stripe_customer_id
  const { data: user, error: findError } = await supabase
    .from('users')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .single();

  if (findError || !user) {
    console.error('[Stripe Webhook] User not found for customer:', customerId);
    return;
  }

  // Downgrade to solo tier and mark as cancelled
  const { error } = await supabase
    .from('users')
    .update({
      subscription_tier: 'solo',
      subscription_status: 'cancelled',
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id);

  if (error) {
    console.error('[Stripe Webhook] Failed to cancel subscription:', error);
    throw error;
  }

  console.log(`[Stripe Webhook] Cancelled subscription for user ${user.id}`);
}

/**
 * Handle invoice.payment_succeeded
 * Called when a payment is successful (renewal, etc.)
 */
async function handlePaymentSucceeded(
  invoice: Stripe.Invoice,
  supabase: ReturnType<typeof createAdminClient>
) {
  console.log(`[Stripe Webhook] Payment succeeded: ${invoice.id}`);

  const customerId = invoice.customer as string;

  // Find user by stripe_customer_id
  const { data: user, error: findError } = await supabase
    .from('users')
    .select('id, subscription_status')
    .eq('stripe_customer_id', customerId)
    .single();

  if (findError || !user) {
    console.error('[Stripe Webhook] User not found for customer:', customerId);
    return;
  }

  // If user was past_due, restore to active
  if (user.subscription_status === 'past_due') {
    const { error } = await supabase
      .from('users')
      .update({
        subscription_status: 'active',
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (error) {
      console.error('[Stripe Webhook] Failed to restore subscription:', error);
      throw error;
    }

    console.log(`[Stripe Webhook] Restored user ${user.id} to active`);
  }
}

/**
 * Handle invoice.payment_failed
 * Called when a payment fails
 */
async function handlePaymentFailed(
  invoice: Stripe.Invoice,
  supabase: ReturnType<typeof createAdminClient>
) {
  console.log(`[Stripe Webhook] Payment failed: ${invoice.id}`);

  const customerId = invoice.customer as string;

  // Find user by stripe_customer_id
  const { data: user, error: findError } = await supabase
    .from('users')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .single();

  if (findError || !user) {
    console.error('[Stripe Webhook] User not found for customer:', customerId);
    return;
  }

  // Mark subscription as past_due
  const { error } = await supabase
    .from('users')
    .update({
      subscription_status: 'past_due',
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id);

  if (error) {
    console.error('[Stripe Webhook] Failed to mark payment failed:', error);
    throw error;
  }

  console.log(`[Stripe Webhook] Marked user ${user.id} as past_due`);

  // TODO: Send email notification about failed payment
}
