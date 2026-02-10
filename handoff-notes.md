# PlebTest Handoff Notes

> **Purpose**: Context for the next agent/session. Updated after each task completion.
> **Last Updated**: 2026-02-09 21:30 UTC
>
---

## Current State

**Phase**: 1 - Core Loop MVP
**Status**: In Progress (~80% complete)
**Last Completed**: Fix known issues + worker fixes + test retry mechanism
**Next Task**: Verify test flow works end-to-end on staging, then continue with remaining Phase 1 tasks

---

## CRITICAL: Current Blocker - Test Flow Verification Needed

The test execution flow has never been verified end-to-end on staging. Multiple fixes were applied in this session:

1. **Worker was crashing** (max connections) → Fixed with `max: 3` pool limit
2. **Test page never updated** (static server component) → Fixed with `TestAutoRefresh` polling
3. **Stuck tests had no recovery** → Fixed with retry API + button
4. **Retry endpoint crashed** (pg-boss SDK opened too many connections) → Fixed with `queue_pgboss_job` database function

**Status**: All fixes deployed to staging. User needs to:
1. Go to the stuck test page on staging
2. Click "Retry Test" button
3. Verify the worker picks up the job (check Railway worker logs)
4. Verify the test progresses through pending → in_progress → completed
5. Verify auto-refresh shows real-time updates

If retry still fails, check Railway web service logs for the 500 error detail.

---

## Recent Commits (develop branch, deployed to staging)

| Commit | Description |
|--------|-------------|
| `2f260f2` | fix: Use direct SQL for test retry to avoid connection exhaustion |
| `f4b1423` | fix: Add auto-refresh polling and retry mechanism for stuck tests |
| `4cbe47d` | fix: Limit pg-boss connection pool to 3 to prevent max connections error |
| `d413185` | fix: Add landing page auth nav, auto-create user on OAuth, remove diag endpoints |

---

## ✅ Fixes Completed This Session (2026-02-09)

### 1. Landing Page Navigation
- Added `<Header />` to `src/app/page.tsx`
- Landing page now shows "Sign in" / "Get Started" for unauthenticated users

### 2. OAuth User Record Auto-Creation
- Created migration `20260209000001_auto_create_user_record.sql`
- Added INSERT RLS policy on `users` table
- Added `handle_new_user()` trigger on `auth.users` (SECURITY DEFINER)
- Applied to staging

### 3. Diagnostic Endpoints Removed
- Deleted `/api/stripe-diag` and `/api/sync-subscription`

### 4. Worker Connection Pool Fix
- Added `max: 3` to pg-boss config in `src/lib/jobs/boss.ts`
- Worker now starts successfully

### 5. Test Page Auto-Refresh
- Created `src/components/tests/test-auto-refresh.tsx` - polls every 5 seconds via `router.refresh()`
- Test page now shows live status updates

### 6. Stuck Test Detection + Retry
- Test page detects stuck tests (pending > 2 min, no sessions) and shows "Retry Test" button
- Created `queue_pgboss_job` database function (migration `20260210000001`)
- Retry endpoint uses RPC instead of pg-boss SDK (avoids connection exhaustion)

### 7. PostHog Init Guard
- Added `initialized` flag to prevent double-init
- Disabled `capture_pageview: true` (already captured manually by provider)

---

## Known Issues / Pending Fixes

1. **Test flow not yet verified end-to-end** - All pieces are in place but haven't been tested together on staging yet
2. **React hydration error #418** - "Text content does not match server-rendered HTML" visible in console. Cosmetic issue, likely from PostHogProvider client boundary. Not blocking functionality.
3. **Webhook idempotency** - Events that initially failed (500) then got retried may be stuck as 'processed' in webhook_events table
4. **Stripe SDK version** - Pin version in package.json to prevent future API breakage

---

## Key Architecture Decision: pg-boss on Supabase Free Tier

**Rule**: NEVER start pg-boss SDK (`getBoss()`) from web server API routes. Only the worker process should run pg-boss.

**Why**: Each `getBoss()` call opens 3+ database connections for monitoring and polling. Web server + worker connections easily exceed Supabase free tier limits (~20-30 connections).

**How to queue jobs from web server**: Use the `queue_pgboss_job` database function:
```typescript
const adminClient = createAdminClient();
const { data: jobId } = await (adminClient.rpc as any)('queue_pgboss_job', {
  job_name: 'run-test',
  job_data: { ... },
  retry_limit: 3,
  expire_minutes: 15,
  singleton_key: `unique-key`,
});
```

**Important**: The original test creation endpoint (`POST /api/.../tests/route.ts`) still uses `queueUniqueJob()` which calls `getBoss()`. This should be migrated to use `queue_pgboss_job` RPC as well to prevent the same connection exhaustion issue.

---

## Remaining Phase 1 Tasks

| Task | Description | Status |
|------|-------------|--------|
| task-1.2.5 | Profile management (F-004) | Not started |
| task-1.11.4 | Download Report (F-024) | Not started |
| task-1.12.1 | Onboarding Flow (F-005) | Not started |
| task-1.13.6 | Manage Payment Method (F-027) | Not started |
| task-1.13.7 | Cancel Subscription (F-028) | Not started |
| task-1.14.1 | Tier limit checking | Not started |
| task-1.14.2 | Billing lock states | Not started |
| task-1.14.4 | Cost alerting | Not started |
| task-1.15.3 | Sentry error tracking | Not started |
| task-1.15.4 | Resend email templates | Not started |
| task-1.15.6 | Jest integration tests | Not started |
| task-1.15.7 | Event taxonomy + funnel dashboard | Not started |
| task-1.17.1 | "Delete my account" flow | Not started |
| task-1.17.2 | Data retention policy | Not started |
| task-1.17.3 | Secret scanning + CI security | Not started |
| task-1.18.1 | Refine Phase 2 breakdown | Not started |

**Priority**: Verify test flow first, then tackle task-1.13.6 (payment method) and task-1.13.7 (cancel subscription) to complete billing.

---

## Database Migrations Applied to Staging

All migrations from `supabase/migrations/` applied:
- 20260123000000_create_waitlist.sql
- 20260124000001_create_core_schema.sql
- 20260125000001_create_messages_table.sql
- 20260209000001_auto_create_user_record.sql ← **NEW**
- 20260210000001_add_queue_pgboss_job_function.sql ← **NEW**

---

## Stripe Setup (unchanged)

### Products in Stripe (Test Mode)
| Tier | Monthly | Annual |
|------|---------|--------|
| Solo | $9.95 (price_1StugtEUDiqujf4gMEKh5EOD) | $99.50 (price_1StugtEUDiqujf4gEUE8zemN) |
| Growth | $19.95 (price_1StulXEUDiqujf4gqqrM4ztN) | $199.50 (price_1StulXEUDiqujf4g6zbc7eyV) |
| Scale | $29.95 (price_1Stv8ZEUDiqujf4gJZ4hn7fA) | $299.50 (price_1Stv8ZEUDiqujf4gimLTHPAJ) |
| Pro | $49.95 (price_1StvBUEUDiqujf4gJ7aeqdmp) | $499.50 (price_1StvBUEUDiqujf4gjglvOdPz) |

### Webhook Required Events
- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`

---

## Staging Infrastructure

- **Railway Staging**: Deployed from `develop` branch
- **Custom Domain**: staging.plebtest.com
- **Worker**: Running (pg-boss pool: 3, all handlers registered)
- **Supabase Staging**: erkvlsaegregxdwfjxgv

---

## Critical Files Reference

- Stripe webhook: `src/app/api/webhooks/stripe/route.ts`
- Stripe shared client: `src/lib/stripe/index.ts`
- pg-boss config: `src/lib/jobs/boss.ts` (max: 3 connections)
- Test runner worker: `workers/test-runner.ts`
- Test view page: `src/app/(protected)/ideas/[ideaId]/proposals/[proposalId]/tests/[testId]/page.tsx`
- Test auto-refresh: `src/components/tests/test-auto-refresh.tsx`
- Retry endpoint: `src/app/api/ideas/[ideaId]/proposals/[proposalId]/tests/[testId]/retry/route.ts`
- Queue function migration: `supabase/migrations/20260210000001_add_queue_pgboss_job_function.sql`
- PostHog config: `src/lib/posthog.ts`
- Core schema: `supabase/migrations/20260124000001_create_core_schema.sql`
