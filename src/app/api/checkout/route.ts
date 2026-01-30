/**
 * Stripe Checkout Session API
 *
 * Creates a Stripe Checkout session for subscription purchases.
 * POST /api/checkout
 * Body: { priceId: string, billingInterval: 'monthly' | 'annual' }
 */

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/lib/supabase/server';

// Lazy-initialize Stripe to avoid build-time errors
let stripeClient: Stripe | null = null;

function getStripe(): Stripe {
  if (!stripeClient) {
    stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY!);
  }
  return stripeClient;
}

// Valid price IDs from environment
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

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'You must be logged in to subscribe' },
        { status: 401 }
      );
    }

    // Get request body
    const body = await request.json();
    const { priceId, billingInterval } = body;

    if (!priceId || typeof priceId !== 'string') {
      return NextResponse.json(
        { error: 'Price ID is required' },
        { status: 400 }
      );
    }

    // Validate price ID
    if (!VALID_PRICE_IDS.has(priceId)) {
      return NextResponse.json(
        { error: 'Invalid price ID' },
        { status: 400 }
      );
    }

    // Get user's current subscription status
    const { data: userData } = await supabase
      .from('users')
      .select('stripe_customer_id, subscription_status')
      .eq('id', user.id)
      .single();

    // Check if user already has active subscription
    if (userData?.subscription_status === 'active') {
      return NextResponse.json(
        { error: 'You already have an active subscription. Please manage your subscription from the settings page.' },
        { status: 400 }
      );
    }

    // Determine which coupon to apply based on billing interval
    const isAnnual = billingInterval === 'annual';
    const couponId = isAnnual
      ? process.env.STRIPE_COUPON_FIRST_YEAR
      : process.env.STRIPE_COUPON_FIRST_MONTH;

    // Build checkout session parameters
    const origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout/cancel`,
      client_reference_id: user.id,
      customer_email: userData?.stripe_customer_id ? undefined : user.email || undefined,
      metadata: {
        user_id: user.id,
        billing_interval: billingInterval || 'monthly',
      },
    };

    // Attach existing customer if they have one
    if (userData?.stripe_customer_id) {
      sessionParams.customer = userData.stripe_customer_id;
    }

    // Apply promotional coupon if available
    if (couponId) {
      sessionParams.discounts = [{ coupon: couponId }];
    } else {
      sessionParams.allow_promotion_codes = true;
    }

    // Create checkout session - retry without coupon if it fails
    let session: Stripe.Checkout.Session;
    try {
      session = await getStripe().checkout.sessions.create(sessionParams);
    } catch (couponError) {
      if (couponError instanceof Stripe.errors.StripeError && couponId && couponError.message.includes('coupon')) {
        console.warn(`[Checkout API] Coupon '${couponId}' failed, proceeding without discount:`, couponError.message);
        delete sessionParams.discounts;
        sessionParams.allow_promotion_codes = true;
        session = await getStripe().checkout.sessions.create(sessionParams);
      } else {
        throw couponError;
      }
    }

    return NextResponse.json({ url: session.url });

  } catch (error) {
    console.error('[Checkout API] Error creating checkout session:', error);

    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
