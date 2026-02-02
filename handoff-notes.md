# PlebTest Handoff Notes

> **Purpose**: Context for the next agent/session. Updated after each task completion.
> **Last Updated**: 2026-02-01 22:56 UTC
>
---

## Current State

**Phase**: 1 - Core Loop MVP
**Status**: In Progress
**Last Completed**: task-1.13.5 - Upgrade/Downgrade (F-026) ✅
**Next Task**: task-1.13.6 - Manage Payment Method (F-027) or task-1.13.7 - Cancel Subscription (F-028)

---

## ✅ BILLING FLOW VERIFIED (2026-02-01)

End-to-end testing completed:
1. ✅ Stripe checkout → success page → dashboard
2. ✅ Sync endpoint repairs broken subscription data
3. ✅ Webhook auto-updates plan changes (Scale → Pro confirmed)
4. ✅ Settings page shows correct plan, price, limits, billing date, payment method
5. ✅ Google OAuth login works

**Current test user**: jamie.watters.mail@gmail.com → Pro plan / Active on Stripe

---

## Known Issues / Pending Fixes

1. **Landing page navigation** - User reported "no navigation buttons to sign up/sign in" on the landing page
2. **User record not auto-created on OAuth** - Google OAuth creates auth user but not `users` table row. Sync endpoint and ideas API handle this with PGRST116 fallback, but a proper trigger or middleware would be better.
3. **Webhook idempotency** - Events that initially failed (500) then got retried may be stuck as 'processed' in webhook_events table. Consider re-process logic for 'failed' events.
4. **Temporary diagnostic endpoints** - Remove before production:
   - `/api/stripe-diag` (commit c78c11f)
   - `/api/sync-subscription` (commit dde950f) - or convert to admin-only tool
5. **Stripe SDK version** - Pin version in package.json to prevent future API breakage

### Stripe Webhook Required Events (must match in production)
- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated` ← was missing, added 2026-02-01
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`

---

## ✅ STRIPE SETUP COMPLETE (task-1.13.1 + task-1.13.2)

### Products Created in Stripe (Test Mode)
| Tier | Monthly | Annual | Price IDs |
|------|---------|--------|-----------|
| Solo | $9.95 | $99.50 | price_1StugtEUDiqujf4gMEKh5EOD (mo), price_1StugtEUDiqujf4gEUE8zemN (yr) |
| Growth | $19.95 | $199.50 | price_1StulXEUDiqujf4gqqrM4ztN (mo), price_1StulXEUDiqujf4g6zbc7eyV (yr) |
| Scale | $29.95 | $299.50 | price_1Stv8ZEUDiqujf4gJZ4hn7fA (mo), price_1Stv8ZEUDiqujf4gimLTHPAJ (yr) |
| Pro | $49.95 | $499.50 | price_1StvBUEUDiqujf4gJ7aeqdmp (mo), price_1StvBUEUDiqujf4gjglvOdPz (yr) |

### Coupons (actual Stripe IDs, not names)
- `wRBqhZBg` = FIRST_YEAR_20 (20% off first year)
- `7QNUrlgp` = FIRST_MONTH_20 (20% off first month)

### Webhook Handler
- Location: `src/app/api/webhooks/stripe/route.ts`
- Endpoint: POST /api/webhooks/stripe
- Events handled: checkout.session.completed, customer.subscription.created/updated/deleted, invoice.payment_succeeded/failed
- Uses webhook_events table for idempotency
- **Fixed 2026-01-31**: Period dates now read from `subscription.items.data[0]` (Stripe SDK change)

### Environment Variables (Railway Staging)
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
STRIPE_COUPON_FIRST_YEAR=wRBqhZBg
STRIPE_COUPON_FIRST_MONTH=7QNUrlgp
```

---

## ✅ CHECKOUT FLOW COMPLETE (task-1.13.3)

### Files
- `src/app/api/checkout/route.ts` - POST endpoint (with coupon retry resilience)
- `src/app/checkout/success/page.tsx` - Success page with auto-redirect
- `src/app/checkout/cancel/page.tsx` - Cancel page
- `src/app/pricing/page.tsx` - Pricing page (server component)
- `src/app/pricing/pricing-client.tsx` - Pricing UI (client component)

---

## ✅ UPGRADE/DOWNGRADE COMPLETE (task-1.13.5)

### Files Created
- `src/app/api/subscription/preview-proration/route.ts` - Proration preview using `stripe.invoices.createPreview()`
- `src/app/api/subscription/change-plan/route.ts` - Plan change using `stripe.subscriptions.update()`
- `src/components/settings/change-plan-dialog.tsx` - Plan selection dialog with proration preview

### Files Modified
- `src/components/settings/subscription-card.tsx` - Now `'use client'`, added Change Plan button + dialog
- `src/app/settings/page.tsx` - Passes `priceConfig` to SubscriptionCard for active subscribers

### How It Works
1. Active subscriber clicks "Change plan" in Settings > Subscription
2. Dialog shows 4 tiers with monthly/annual toggle
3. Selecting a different tier fetches real-time proration preview from Stripe
4. User confirms → `stripe.subscriptions.update()` with proration
5. Webhook (`customer.subscription.updated`) syncs tier/status to DB
6. Page reloads to show updated plan

---

## ✅ VIEW SUBSCRIPTION COMPLETE (task-1.13.4)

### Files Created
- `src/lib/stripe/index.ts` - Shared Stripe client (lazy-init singleton)
- `src/lib/stripe/get-subscription-details.ts` - Fetches subscription + payment method
- `src/components/settings/subscription-card.tsx` - Display component with status badges, usage bar, alerts

### Files Modified
- `src/app/settings/page.tsx` - Wired subscription data (Supabase + Stripe) into SubscriptionCard

---

## ✅ GOOGLE OAUTH CONFIGURED (2026-01-31)

- Google Cloud Console project created
- OAuth consent screen (external) + client credentials
- Redirect URI: `https://erkvlsaegregxdwfjxgv.supabase.co/auth/v1/callback`
- Enabled in Supabase staging dashboard

---

## Database Migrations Applied to Staging

All migrations from `supabase/migrations/` have been applied to staging Supabase (erkvlsaegregxdwfjxgv):
- 20260123000000_create_waitlist.sql
- 20260124000001_create_core_schema.sql (includes users, sessions, webhook_events tables)
- 20260125000001_create_messages_table.sql

---

## Staging Infrastructure

- **Railway Staging**: Deployed from `develop` branch
- **Custom Domain**: staging.plebtest.com
- **Worker**: Running, processing jobs
- **Supabase Staging**: erkvlsaegregxdwfjxgv

---

## Critical Files Reference

- Stripe webhook: `src/app/api/webhooks/stripe/route.ts`
- Stripe shared client: `src/lib/stripe/index.ts`
- Subscription details: `src/lib/stripe/get-subscription-details.ts`
- Subscription card: `src/components/settings/subscription-card.tsx`
- Settings page: `src/app/settings/page.tsx`
- Checkout: `src/app/api/checkout/route.ts`
- Pricing: `src/app/pricing/page.tsx`
- Stripe setup guide: `docs/stripe-setup-guide.md`
- Pricing config: `.context/structured/pricing.yaml`
- Core schema: `supabase/migrations/20260124000001_create_core_schema.sql`
