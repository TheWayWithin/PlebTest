# PlebTest Agent Context

> **Purpose**: Rolling accumulation of all findings, decisions, and critical information across the mission.
> **Updated By**: Coordinator after each agent task completion.

---

## Mission Overview

**Project**: PlebTest - AI-powered idea validation platform
**Tagline**: Kill duds. Find winners.
**Target**: 1,000 paying founders, $250K ARR

---

## Current Phase: 0 - Landing Page

**Objective**: Establish marketing presence and begin capturing waitlist signups before MVP is ready.

---

## Accumulated Findings

### Technical Decisions (Locked)
| Decision | Choice | Rationale |
|----------|--------|-----------|
| Architecture | Monolith | Solo founder, MVP speed |
| Hosting | Railway | No timeout limits for AI sessions |
| Database | Supabase | Integrated solution, RLS support |
| LLM Provider | OpenRouter → Claude 4.5 | Best for persona consistency |
| Frontend | Next.js 15 + Tailwind + shadcn/ui | Modern, fast, component library |
| Analytics | PostHog (cookieless) | No cookie banner needed |

### Phase-Specific Context

#### Phase 0 Focus
- Keep it simple - marketing page, not the app
- Static generation for fast loads
- Server action for waitlist submission
- No auth required

---

## Known Issues

<!-- Issues discovered during mission - track resolution status -->

---

## Dependencies Identified

### External (Must Exist)
- [ ] GitHub account
- [ ] Railway account
- [ ] Domain plebtest.com
- [ ] PostHog account
- [ ] Supabase account (Phase 1)
- [ ] Stripe account (Phase 1)
- [ ] OpenRouter account (Phase 1)
- [ ] Upstash account (Phase 1)

### Internal (Build Order)
1. GitHub repo → Next.js project
2. Railway projects → Domain configuration
3. Next.js project → Landing page implementation

---

## Agent Contributions

<!-- Track what each agent has contributed -->

### Operator
- Pending: Create GitHub repository (task-0.1.1)

### Developer
- Pending: Initialize Next.js project (task-0.1.2)

### Designer
- Pending: Design landing page layout (task-0.2.1)

---

## Critical Warnings

1. **Security First**: Never compromise security for convenience
2. **File Verification**: Always verify files exist after delegation
3. **Environment Awareness**: Confirm target environment before operations
4. **ADHD Accommodation**: Clear, specific instructions for user

---

## Quick Reference

### Repository
```
Owner: TheWayWithin
Repo: PlebTest
URL: https://github.com/TheWayWithin/PlebTest
Main branch: main (protected)
Dev branch: develop
```

### Key Paths
```
Landing page: app/page.tsx
API routes: app/api/
Components: components/
Styles: app/globals.css
```


---

## Migrated from handoff-notes.md (2026-05-07)

# PlebTest Handoff Notes

> **Purpose**: Context for the next agent/session. Updated after each task completion.
> **Last Updated**: 2026-02-10 13:30 UTC
>
---

## Current State

**Phase**: 1 - Core Loop MVP
**Status**: In Progress (~80% complete)
**Last Completed**: Test flow verified end-to-end on staging + production waitlist fix
**Next Task**: Continue with remaining Phase 1 tasks (billing completion, then lower-priority items)

---

## ✅ Test Flow Verified End-to-End (2026-02-10)

The test execution flow has been **verified working** on staging:

1. Job queued via `queue_pgboss_job` database function
2. Worker picked up the `run-test` job
3. `generate-personas` called OpenRouter, generated 5 personas
4. 5 `run-session` jobs created — all interactive sessions ready for user
5. Test status updated: `pending` → `in_progress`

**Active test on staging**: `e0522d9c` with 5 interactive sessions waiting for user to join.
**Second test**: `91378458` still `pending` — can be used to test the retry button via the UI.

---

## ✅ Production Waitlist Fix (2026-02-10)

**Issue**: `POST /api/waitlist` returned 500 on plebtest.com
**Root Cause**: Zero database migrations had been applied to production Supabase. The `waitlist` table didn't exist. Railway auto-deploys code but Supabase migrations must be pushed manually.
**Fix**: Pushed all migrations to production Supabase (`wemszisfzevffudenqzi`). Verified waitlist returns 200.
**Lesson**: Added "Database Migration Sync Protocol" to CLAUDE.md and migration step to Production Deployment Checklist.

---

## Recent Commits (develop branch, deployed to staging)

| Commit | Description |
|--------|-------------|
| `6177b63` | fix: Clean up intermediate pgboss migrations for production compatibility |
| `0fcac7c` | fix: Correct pg-boss v12 column names in queue_pgboss_job function |
| `2f260f2` | fix: Use direct SQL for test retry to avoid connection exhaustion |
| `f4b1423` | fix: Add auto-refresh polling and retry mechanism for stuck tests |
| `4cbe47d` | fix: Limit pg-boss connection pool to 3 to prevent max connections error |
| `d413185` | fix: Add landing page auth nav, auto-create user on OAuth, remove diag endpoints |

---

## ✅ Fixes Completed (2026-02-09 & 2026-02-10)

### 2026-02-10

1. **pg-boss v12 column name fix** — Original `queue_pgboss_job` function used camelCase column names (`singletonkey`, `retrylimit`, `expirein`) but pg-boss v12 uses snake_case (`singleton_key`, `retry_limit`, `expire_seconds`). Fixed via migration `20260210000004`. Verified by querying `information_schema.columns`.

2. **Production migrations applied** — All 8 migrations pushed to production Supabase. Intermediate migrations (002, 003) cleaned up to be idempotent (DROP + no-op) so they apply cleanly on fresh databases.

3. **Retry endpoint parameter fix** — Updated RPC call to use `p_singleton_key` (matching the function's disambiguated parameter name).

### 2026-02-09

1. Landing page auth navigation
2. OAuth user record auto-creation (trigger + migration)
3. Diagnostic endpoints removed
4. Worker connection pool fix (`max: 3`)
5. Test page auto-refresh (`TestAutoRefresh` component)
6. Stuck test detection + retry mechanism
7. PostHog init guard + disabled duplicate `capture_pageview`

---

## Known Issues / Pending Fixes

1. **React hydration error #418** — "Text content does not match server-rendered HTML" visible in console. Cosmetic issue, likely from PostHogProvider client boundary. Not blocking functionality.
2. **Webhook idempotency** — Events that initially failed (500) then got retried may be stuck as 'processed' in webhook_events table.
3. **Stripe SDK version** — Pin version in package.json to prevent future API breakage.
4. **Test creation endpoint still uses pg-boss SDK** — `POST /api/.../tests/route.ts` still calls `queueUniqueJob()` → `getBoss()`. Should be migrated to `queue_pgboss_job` RPC to prevent connection exhaustion.
5. **Missing favicon** — `/favicon.ico` returns 404 on production.

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
  p_singleton_key: `unique-key`,
});
```

**pg-boss v12 column names** (verified via `information_schema`):
`id`, `name`, `priority`, `data`, `state`, `retry_limit`, `retry_count`, `retry_delay`, `retry_backoff`, `retry_delay_max`, `expire_seconds`, `deletion_seconds`, `singleton_key`, `singleton_on`, `group_id`, `group_tier`, `start_after`, `created_on`, `started_on`, `completed_on`, `keep_until`, `output`, `dead_letter`, `policy`

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

**Priority**: Migrate test creation endpoint to `queue_pgboss_job` RPC, then tackle task-1.13.6 (payment method) and task-1.13.7 (cancel subscription) to complete billing.

---

## Database Migrations

All migrations applied to **both** staging and production:
- 20260123000000_create_waitlist.sql
- 20260124000001_create_core_schema.sql
- 20260125000001_create_messages_table.sql
- 20260209000001_auto_create_user_record.sql
- 20260210000001_add_queue_pgboss_job_function.sql (original, broken camelCase)
- 20260210000002_fix_queue_pgboss_job_columns.sql (DROP only)
- 20260210000003_fix_queue_pgboss_job_v2.sql (no-op)
- 20260210000004_fix_queue_pgboss_job_v3.sql (final correct version with verified column names)

**Supabase CLI is linked to staging** (`erkvlsaegregxdwfjxgv`). To push to production, temporarily link to `wemszisfzevffudenqzi` then relink back.

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

## Infrastructure

### Staging
- **Railway Staging**: Deployed from `develop` branch
- **Custom Domain**: staging.plebtest.com
- **Worker**: Running (pg-boss pool: 3, all handlers registered)
- **Supabase Staging**: erkvlsaegregxdwfjxgv (plebtest-staging)

### Production
- **Railway Production**: Deployed from `main` branch
- **Domain**: plebtest.com
- **Supabase Production**: wemszisfzevffudenqzi (PlebTest)
- **Status**: Landing page + waitlist live. Phase 1 features NOT deployed to production yet.

---

## Critical Files Reference

- Stripe webhook: `src/app/api/webhooks/stripe/route.ts`
- Stripe shared client: `src/lib/stripe/index.ts`
- pg-boss config: `src/lib/jobs/boss.ts` (max: 3 connections)
- Test runner worker: `workers/test-runner.ts`
- Test view page: `src/app/(protected)/ideas/[ideaId]/proposals/[proposalId]/tests/[testId]/page.tsx`
- Test auto-refresh: `src/components/tests/test-auto-refresh.tsx`
- Retry endpoint: `src/app/api/ideas/[ideaId]/proposals/[proposalId]/tests/[testId]/retry/route.ts`
- Queue function migration: `supabase/migrations/20260210000004_fix_queue_pgboss_job_v3.sql` (final version)
- PostHog config: `src/lib/posthog.ts`
- Core schema: `supabase/migrations/20260124000001_create_core_schema.sql`
- Waitlist API: `src/app/api/waitlist/route.ts`
