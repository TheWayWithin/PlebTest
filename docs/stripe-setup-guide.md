# Stripe Setup Guide for PlebTest

> **Purpose**: Step-by-step guide to configure Stripe for PlebTest billing
> **Task**: task-1.13.1
> **Priority**: P0 (blocks all billing features)

---

## Overview

This guide walks through setting up Stripe with:
- 4 subscription products (Solo, Growth, Scale, Pro)
- Monthly and annual pricing for each tier
- Webhook endpoints for staging and production
- API keys for both environments

**Time estimate**: 30-45 minutes

---

## Prerequisites

- [ ] Stripe account (create at https://stripe.com if needed)
- [ ] Access to Railway dashboard for environment variables
- [ ] PlebTest staging URL: `plebteststaging-staging.up.railway.app`
- [ ] PlebTest production URL: `plebtest.com`

---

## Part 1: Stripe Account Setup

### Step 1.1: Create/Access Stripe Account

1. Go to **https://dashboard.stripe.com**
2. Sign in or create a new account
3. Complete business verification if prompted (can be done later for test mode)

### Step 1.2: Enable Test Mode

1. In the top-right corner, toggle **"Test mode"** ON
2. You should see an orange "TEST" badge in the header
3. All setup will be done in test mode first

> **Important**: Stay in test mode until ready for production launch. Test mode uses fake money and won't charge real cards.

---

## Part 2: Create Products and Prices

### Pricing Reference

| Tier | Monthly | Annual (2 months free) | Products | Tests/Month |
|------|---------|------------------------|----------|-------------|
| Solo | $9.95 | $99.50 | 1 | 10 |
| Growth | $19.95 | $199.50 | 3 | 30 |
| Scale | $29.95 | $299.50 | 10 | 100 |
| Pro | $49.95 | $499.50 | 20 | 200 |

### Step 2.1: Create Solo Product

1. Go to **Products** in the left sidebar (or https://dashboard.stripe.com/test/products)
2. Click **"+ Add product"**
3. Fill in:
   - **Name**: `Solo`
   - **Description**: `1 product, 10 tests/month - For side-hustle builders with one idea to validate`
   - **Image**: (optional, can add later)
4. Under **Pricing**, click **"Add another price"** after the first:

   **Monthly Price**:
   - Pricing model: `Recurring`
   - Price: `$9.95`
   - Billing period: `Monthly`
   - Click **"Add price"**

   **Annual Price**:
   - Click **"Add another price"**
   - Pricing model: `Recurring`
   - Price: `$99.50`
   - Billing period: `Yearly`
   - Click **"Add price"**

5. Click **"Save product"**
6. **Record the Product ID** (starts with `prod_`): `________________`

### Step 2.2: Create Growth Product

1. Click **"+ Add product"**
2. Fill in:
   - **Name**: `Growth`
   - **Description**: `3 products, 30 tests/month - Compare ideas head-to-head, find your winner`
3. Add prices:

   **Monthly**: `$19.95` / month
   **Annual**: `$199.50` / year

4. Click **"Save product"**
5. **Record the Product ID**: `________________`

### Step 2.3: Create Scale Product

1. Click **"+ Add product"**
2. Fill in:
   - **Name**: `Scale`
   - **Description**: `10 products, 100 tests/month - Rapid-fire validation for serial builders`
3. Add prices:

   **Monthly**: `$29.95` / month
   **Annual**: `$299.50` / year

4. Click **"Save product"**
5. **Record the Product ID**: `________________`

### Step 2.4: Create Pro Product

1. Click **"+ Add product"**
2. Fill in:
   - **Name**: `Pro`
   - **Description**: `20 products, 200 tests/month - Agency-scale validation for power users`
3. Add prices:

   **Monthly**: `$49.95` / month
   **Annual**: `$499.50` / year

4. Click **"Save product"**
5. **Record the Product ID**: `________________`

### Step 2.5: Record All Price IDs

Go to each product and expand the prices to get the Price IDs (start with `price_`):

| Tier | Monthly Price ID | Annual Price ID |
|------|------------------|-----------------|
| Solo | `price_` | `price_` |
| Growth | `price_` | `price_` |
| Scale | `price_` | `price_` |
| Pro | `price_` | `price_` |

---

## Part 3: Configure Webhooks

Webhooks allow Stripe to notify PlebTest when payments happen.

### Step 3.1: Create Staging Webhook

1. Go to **Developers** → **Webhooks** (or https://dashboard.stripe.com/test/webhooks)
2. Click **"+ Add endpoint"**
3. Fill in:
   - **Endpoint URL**: `https://plebteststaging-staging.up.railway.app/api/webhooks/stripe`
   - **Description**: `PlebTest Staging`
4. Under **"Select events to listen to"**, click **"Select events"**
5. Add these events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
6. Click **"Add endpoint"**
7. **Record the Webhook Signing Secret** (starts with `whsec_`): `________________`
   - Click on the endpoint, then "Reveal" under Signing secret

### Step 3.2: Create Production Webhook

1. Click **"+ Add endpoint"** again
2. Fill in:
   - **Endpoint URL**: `https://plebtest.com/api/webhooks/stripe`
   - **Description**: `PlebTest Production`
3. Add the same events as staging
4. Click **"Add endpoint"**
5. **Record the Webhook Signing Secret**: `________________`

---

## Part 4: Get API Keys

### Step 4.1: Test Mode Keys

1. Go to **Developers** → **API keys** (or https://dashboard.stripe.com/test/apikeys)
2. Record:
   - **Publishable key** (starts with `pk_test_`): `________________`
   - **Secret key** (starts with `sk_test_`): `________________`
     - Click "Reveal test key" to see it

### Step 4.2: Live Mode Keys (For Production)

> **Note**: Only do this when ready for production launch

1. Toggle **Test mode OFF** (switch to live mode)
2. Go to **Developers** → **API keys**
3. Record:
   - **Publishable key** (starts with `pk_live_`): `________________`
   - **Secret key** (starts with `sk_live_`): `________________`

---

## Part 5: Configure Environment Variables

### Step 5.1: Staging Environment (Railway)

Add these to the **staging** environment in Railway:

```
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_... (staging webhook secret)

STRIPE_PRICE_SOLO_MONTHLY=price_...
STRIPE_PRICE_SOLO_ANNUAL=price_...
STRIPE_PRICE_GROWTH_MONTHLY=price_...
STRIPE_PRICE_GROWTH_ANNUAL=price_...
STRIPE_PRICE_SCALE_MONTHLY=price_...
STRIPE_PRICE_SCALE_ANNUAL=price_...
STRIPE_PRICE_PRO_MONTHLY=price_...
STRIPE_PRICE_PRO_ANNUAL=price_...
```

### Step 5.2: Production Environment (Railway)

Add these to the **production** environment in Railway:

```
STRIPE_PUBLISHABLE_KEY=pk_live_... (or pk_test_ until launch)
STRIPE_SECRET_KEY=sk_live_... (or sk_test_ until launch)
STRIPE_WEBHOOK_SECRET=whsec_... (production webhook secret)

STRIPE_PRICE_SOLO_MONTHLY=price_...
STRIPE_PRICE_SOLO_ANNUAL=price_...
STRIPE_PRICE_GROWTH_MONTHLY=price_...
STRIPE_PRICE_GROWTH_ANNUAL=price_...
STRIPE_PRICE_SCALE_MONTHLY=price_...
STRIPE_PRICE_SCALE_ANNUAL=price_...
STRIPE_PRICE_PRO_MONTHLY=price_...
STRIPE_PRICE_PRO_ANNUAL=price_...
```

> **Note**: Price IDs are the same for test and live mode - they're tied to the product, not the mode.

---

## Part 6: Verification Checklist

### Products Created
- [ ] Solo product with monthly ($9.95) and annual ($99.50) prices
- [ ] Growth product with monthly ($19.95) and annual ($199.50) prices
- [ ] Scale product with monthly ($29.95) and annual ($299.50) prices
- [ ] Pro product with monthly ($49.95) and annual ($499.50) prices

### Webhooks Configured
- [ ] Staging webhook pointing to `plebteststaging-staging.up.railway.app/api/webhooks/stripe`
- [ ] Production webhook pointing to `plebtest.com/api/webhooks/stripe`
- [ ] Both webhooks listening to: checkout.session.completed, customer.subscription.*, invoice.payment_*

### Environment Variables Set
- [ ] STRIPE_PUBLISHABLE_KEY in staging
- [ ] STRIPE_SECRET_KEY in staging
- [ ] STRIPE_WEBHOOK_SECRET in staging
- [ ] All 8 STRIPE_PRICE_* variables in staging
- [ ] Same variables in production (can use test keys until launch)

---

## Part 7: Testing (After Developer Implements Webhooks)

### Test Card Numbers

| Scenario | Card Number | CVC | Expiry |
|----------|-------------|-----|--------|
| Successful payment | 4242 4242 4242 4242 | Any 3 digits | Any future date |
| Declined payment | 4000 0000 0000 0002 | Any 3 digits | Any future date |
| Requires authentication | 4000 0025 0000 3155 | Any 3 digits | Any future date |

### Test Checkout Flow

1. Go to staging signup page
2. Select a tier
3. Complete checkout with test card `4242 4242 4242 4242`
4. Verify:
   - [ ] Redirected to success page
   - [ ] User's `subscription_tier` updated in database
   - [ ] Webhook event received (check Stripe dashboard → Webhooks → Recent events)

---

## Recorded Values Reference

Fill in as you complete each step:

```
# Product IDs
PRODUCT_SOLO=prod_
PRODUCT_GROWTH=prod_
PRODUCT_SCALE=prod_
PRODUCT_PRO=prod_

# Price IDs - Monthly
STRIPE_PRICE_SOLO_MONTHLY=price_
STRIPE_PRICE_GROWTH_MONTHLY=price_
STRIPE_PRICE_SCALE_MONTHLY=price_
STRIPE_PRICE_PRO_MONTHLY=price_

# Price IDs - Annual
STRIPE_PRICE_SOLO_ANNUAL=price_
STRIPE_PRICE_GROWTH_ANNUAL=price_
STRIPE_PRICE_SCALE_ANNUAL=price_
STRIPE_PRICE_PRO_ANNUAL=price_

# API Keys (Test Mode)
STRIPE_PUBLISHABLE_KEY=pk_test_
STRIPE_SECRET_KEY=sk_test_

# Webhook Secrets
STRIPE_WEBHOOK_SECRET_STAGING=whsec_
STRIPE_WEBHOOK_SECRET_PRODUCTION=whsec_
```

---

## Next Steps After Completion

Once all values are recorded and environment variables are set:

1. **Tell Claude**: "Stripe is set up, here are the price IDs: [paste the filled values]"
2. Claude will implement:
   - task-1.13.2: Webhook handler
   - task-1.13.3: Checkout flow
   - task-1.13.4: Subscription management UI

---

## Troubleshooting

### "Webhook signature verification failed"
- Check that `STRIPE_WEBHOOK_SECRET` matches the signing secret for that environment
- Staging and production have different webhook secrets

### "No such price" error
- Verify the price ID exists in Stripe dashboard
- Check you're using the correct mode (test vs live)

### Subscription not updating in database
- Check webhook endpoint is accessible (not blocked by firewall)
- Verify webhook events are being received in Stripe dashboard
- Check server logs for errors

---

*Document created: 2026-01-26*
*Last updated: 2026-01-26*
