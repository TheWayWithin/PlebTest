# PlebTest Handoff Notes

> **Purpose**: Context for the next agent/session. Updated after each task completion.
> **Last Updated**: 2026-01-26 22:30 UTC
>
---

## Current State

**Phase**: 1 - Core Loop MVP
**Status**: In Progress
**Last Completed**: task-1.13.3 - Checkout flow ✅
**Next Task**: task-1.13.4 - View Subscription (F-025)

---

## ✅ STRIPE SETUP COMPLETE (task-1.13.1 + task-1.13.2)

### Products Created in Stripe (Test Mode)
| Tier | Monthly | Annual | Price IDs |
|------|---------|--------|-----------|
| Solo | $9.95 | $99.50 | price_1StugtEUDiqujf4gMEKh5EOD (mo), price_1StugtEUDiqujf4gEUE8zemN (yr) |
| Growth | $19.95 | $199.50 | price_1StulXEUDiqujf4gqqrM4ztN (mo), price_1StulXEUDiqujf4g6zbc7eyV (yr) |
| Scale | $29.95 | $299.50 | price_1Stv8ZEUDiqujf4gJZ4hn7fA (mo), price_1Stv8ZEUDiqujf4gimLTHPAJ (yr) |
| Pro | $49.95 | $499.50 | price_1StvBUEUDiqujf4gJ7aeqdmp (mo), price_1StvBUEUDiqujf4gjglvOdPz (yr) |

### Coupons Created
- FIRST_YEAR_20: 20% off first year (for annual plans)
- FIRST_MONTH_20: 20% off first month (for monthly plans)

### Webhook Handler
- Location: `src/app/api/webhooks/stripe/route.ts`
- Endpoint: POST /api/webhooks/stripe
- Events handled:
  - checkout.session.completed
  - customer.subscription.created/updated
  - customer.subscription.deleted
  - invoice.payment_succeeded
  - invoice.payment_failed
- Uses webhook_events table for idempotency

### Environment Variables (Added to Railway Staging)
```
STRIPE_SECRET_KEY=sk_test_51SttBs...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51SttBs...
STRIPE_WEBHOOK_SECRET=whsec_F164bGchOaO6eiuZpRUSnTL1cAoXKdQd
STRIPE_PRICE_SOLO_MONTHLY=price_1StugtEUDiqujf4gMEKh5EOD
STRIPE_PRICE_SOLO_ANNUAL=price_1StugtEUDiqujf4gEUE8zemN
STRIPE_PRICE_GROWTH_MONTHLY=price_1StulXEUDiqujf4gqqrM4ztN
STRIPE_PRICE_GROWTH_ANNUAL=price_1StulXEUDiqujf4g6zbc7eyV
STRIPE_PRICE_SCALE_MONTHLY=price_1Stv8ZEUDiqujf4gJZ4hn7fA
STRIPE_PRICE_SCALE_ANNUAL=price_1Stv8ZEUDiqujf4gimLTHPAJ
STRIPE_PRICE_PRO_MONTHLY=price_1StvBUEUDiqujf4gJ7aeqdmp
STRIPE_PRICE_PRO_ANNUAL=price_1StvBUEUDiqujf4gjglvOdPz
STRIPE_COUPON_FIRST_YEAR=FIRST_YEAR_20
STRIPE_COUPON_FIRST_MONTH=FIRST_MONTH_20
```

---

## ✅ CHECKOUT FLOW COMPLETE (task-1.13.3)

### Files Created
- `src/app/api/checkout/route.ts` - POST endpoint creates Stripe checkout session
- `src/app/checkout/success/page.tsx` - Success page with auto-redirect
- `src/app/checkout/cancel/page.tsx` - Cancel page
- `src/app/pricing/page.tsx` - Pricing page (server component)
- `src/app/pricing/pricing-client.tsx` - Pricing UI (client component)

### Features
- Monthly/annual billing toggle
- 20% promotional coupons auto-applied
- Shows current plan if user already subscribed
- Redirects to signup if not logged in
- All 4 tiers with feature lists

---

## Next: task-1.13.4 - View Subscription (F-025)

### Acceptance Criteria
- Shows current plan
- Shows usage (ideas, tests)
- Shows billing date
- Shows payment method (last 4 digits)

### Implementation Approach
1. Add subscription section to Settings page
2. Fetch from Stripe Customer API for payment method
3. Calculate usage from database
4. Show next billing date from subscription.current_period_end

---

## Database Migrations Applied to Staging

All migrations from `supabase/migrations/` have been applied to staging Supabase (erkvlsaegregxdwfjxgv):
- 20260123000000_create_waitlist.sql
- 20260124000001_create_core_schema.sql (includes users, sessions, webhook_events tables)
- 20260125000001_create_messages_table.sql

---

## Staging Infrastructure

- **Railway Staging**: Deployed from `develop` branch
- **Main App**: plebteststaging-staging.up.railway.app (with /health endpoint)
- **Worker**: Running, processing jobs
- **Supabase Staging**: erkvlsaegregxdwfjxgv

---

## Critical Files Reference

- Stripe webhook: `src/app/api/webhooks/stripe/route.ts`
- Stripe setup guide: `docs/stripe-setup-guide.md`
- Pricing config: `.context/structured/pricing.yaml`
- Core schema: `supabase/migrations/20260124000001_create_core_schema.sql`
