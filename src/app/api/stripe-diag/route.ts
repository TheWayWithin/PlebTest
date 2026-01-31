/**
 * Stripe Diagnostic Endpoint (TEMPORARY - remove before production)
 *
 * GET /api/stripe-diag
 * Returns Stripe account info and validates all env vars without exposing secrets.
 */

import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function GET() {
  const results: Record<string, unknown> = {};

  // Check which env vars are set (without exposing values)
  const envVars = [
    'STRIPE_SECRET_KEY',
    'STRIPE_WEBHOOK_SECRET',
    'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
    'STRIPE_PRICE_SOLO_MONTHLY',
    'STRIPE_PRICE_SOLO_ANNUAL',
    'STRIPE_PRICE_GROWTH_MONTHLY',
    'STRIPE_PRICE_GROWTH_ANNUAL',
    'STRIPE_PRICE_SCALE_MONTHLY',
    'STRIPE_PRICE_SCALE_ANNUAL',
    'STRIPE_PRICE_PRO_MONTHLY',
    'STRIPE_PRICE_PRO_ANNUAL',
    'STRIPE_COUPON_FIRST_MONTH',
    'STRIPE_COUPON_FIRST_YEAR',
  ];

  results.env_vars = envVars.reduce((acc, key) => {
    const val = process.env[key];
    if (!val) {
      acc[key] = '❌ NOT SET';
    } else if (key === 'STRIPE_SECRET_KEY') {
      acc[key] = `✅ Set (${val.substring(0, 8)}...${val.slice(-4)})`;
    } else if (key === 'STRIPE_WEBHOOK_SECRET') {
      acc[key] = `✅ Set (${val.substring(0, 8)}...${val.slice(-4)})`;
    } else if (key === 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY') {
      acc[key] = `✅ Set (${val.substring(0, 8)}...${val.slice(-4)})`;
    } else {
      acc[key] = `✅ ${val}`;
    }
    return acc;
  }, {} as Record<string, string>);

  // Try to connect to Stripe and get account info
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    const account = await stripe.accounts.retrieve();
    results.stripe_account = {
      id: account.id,
      business_profile: account.business_profile?.name || 'N/A',
      livemode: account.charges_enabled ? 'Could be live' : 'Test mode likely',
    };
  } catch (err) {
    results.stripe_account = { error: err instanceof Error ? err.message : 'Unknown error' };
  }

  // Validate coupons exist
  const couponIds = [
    { name: 'STRIPE_COUPON_FIRST_MONTH', value: process.env.STRIPE_COUPON_FIRST_MONTH },
    { name: 'STRIPE_COUPON_FIRST_YEAR', value: process.env.STRIPE_COUPON_FIRST_YEAR },
  ];

  results.coupons = {};
  for (const { name, value } of couponIds) {
    if (!value) {
      (results.coupons as Record<string, string>)[name] = '⏭️ Not configured';
      continue;
    }
    try {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
      const coupon = await stripe.coupons.retrieve(value);
      (results.coupons as Record<string, string>)[name] = `✅ Found: ${coupon.name} (${coupon.percent_off}% off, ${coupon.duration})`;
    } catch (err) {
      (results.coupons as Record<string, string>)[name] = `❌ ${err instanceof Error ? err.message : 'Unknown error'}`;
    }
  }

  // List ALL coupons in the account
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    const allCoupons = await stripe.coupons.list({ limit: 20 });
    results.all_coupons_in_account = allCoupons.data.map(c => ({
      id: c.id,
      name: c.name,
      percent_off: c.percent_off,
      valid: c.valid,
      duration: c.duration,
      deleted: (c as Record<string, unknown>).deleted || false,
    }));
  } catch (err) {
    results.all_coupons_in_account = { error: err instanceof Error ? err.message : 'Unknown error' };
  }

  // Validate a sample price exists
  const samplePrice = process.env.STRIPE_PRICE_SOLO_MONTHLY;
  if (samplePrice) {
    try {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
      const price = await stripe.prices.retrieve(samplePrice);
      results.sample_price = `✅ Solo Monthly: ${price.currency} ${price.unit_amount} (${price.active ? 'active' : 'inactive'})`;
    } catch (err) {
      results.sample_price = `❌ ${err instanceof Error ? err.message : 'Unknown error'}`;
    }
  }

  // Stripe SDK version
  results.stripe_sdk_version = Stripe.PACKAGE_VERSION || 'unknown';

  return NextResponse.json(results, { status: 200 });
}
