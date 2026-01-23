# PlebTest Handoff Notes

> **Purpose**: Context for the next agent/session. Updated after each task completion.
> **Last Updated**: 2026-01-23 11:15

---

## Current State

**Phase**: 0 - Landing Page
**Status**: In Progress
**Active Task**: task-0.2.6 - Create demo walkthrough

---

## Mission Objectives

1. Launch marketing presence before MVP is ready
2. Begin building waitlist for launch
3. Establish brand positioning
4. Show product credibility with demo assets

---

## Critical Context for Next Agent

### What's Been Done
- Foundation documents extracted to `.context/structured/`
- architecture.md created with full system design
- project-plan.md finalized (v2.1)
- Phase 0 context file created
- **task-0.1.1**: GitHub repo created (github.com/TheWayWithin/PlebTest)
  - main branch with protection enabled
  - develop branch created
- **task-0.1.2**: Next.js project initialized
  - Next.js 16.1.4 with Turbopack
  - TypeScript, Tailwind v4, shadcn/ui
  - Build passes
- **task-0.1.3**: Railway infrastructure set up
  - Single project "PlebTest" with staging/production environments
  - US East region
- **task-0.1.4**: Domain configuration complete
  - plebtest.com live via Cloudflare + Railway
  - SSL active
- **task-0.2.1**: Landing page design complete ✅ 2026-01-22 23:52
  - Full specification at `/docs/design/landing-page-spec.md`
  - 7 sections: Hero, Problem, Solution, How It Works, Pricing Preview, Waitlist CTA, Footer
- **task-0.2.2**: Landing page implementation complete ✅ 2026-01-22 23:58
  - All 7 sections implemented in `src/components/landing/`
  - Custom components: `section-label.tsx`, `verdict-card.tsx`
  - shadcn components added: button, card, input, badge
- **task-0.2.3**: Waitlist API complete ✅ 2026-01-23 10:15
  - POST `/api/waitlist` endpoint
  - Supabase `waitlist` table with RLS
  - Frontend with loading/error/success states
  - **Supabase configured** - staging and production env vars set
- **task-0.2.4**: PostHog analytics complete ✅ 2026-01-23 11:00
  - Cookieless mode (no cookie banner needed)
  - IP anonymization enabled
  - Page views + waitlist_signup events tracked
  - **PostHog configured** - staging and production env vars set
- **task-0.2.5**: Event taxonomy complete ✅ 2026-01-23 11:10
  - Documented at `/docs/analytics/event-taxonomy.md`
  - Naming conventions: snake_case, object_action format

### What Needs to Happen Next
1. **task-0.2.6**: Create demo walkthrough (designer)
   - 90-second video OR interactive Figma prototype
   - Shows Quick Fire → Full Validation → Verdict flow

2. **task-0.2.7**: Create sample verdict assets (designer)
   - 3 sample reports: Kill / Pivot / Build examples
   - Screenshots or mockups for landing page

3. **task-0.2.8**: Create privacy policy and terms of service (operator)
   - /privacy page
   - /terms page

### Known Blockers
- None currently

### Important Decisions Made
- Railway over Vercel (no timeout limits for AI sessions)
- PostHog for analytics (cookieless mode)
- Next.js 16 with App Router
- Supabase new API keys (sb_publishable_, sb_secret_) not legacy JWT keys

---

## Environment Configuration

| Environment | Domain | Status |
|-------------|--------|--------|
| Development | localhost:3000 | Ready |
| Staging | plebteststaging-staging.up.railway.app | Live |
| Production | plebtest.com | Live |

### Environment Variables Set
Both staging and production have:
- `NEXT_PUBLIC_SUPABASE_URL` ✅
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` ✅ (publishable key)
- `SUPABASE_SERVICE_ROLE_KEY` ✅ (secret key)
- `NEXT_PUBLIC_POSTHOG_KEY` ✅

---

## Warnings / Gotchas

- User has ADHD - provide clear, specific step-by-step instructions
- Always verify file operations on filesystem before marking complete
- Never apply schema changes directly to production
- Supabase uses NEW key format (sb_publishable_, sb_secret_), not legacy anon/service_role JWT keys

---

## Files Changed This Session

- `src/components/landing/pricing-preview.tsx` - Updated pricing tiers
- `src/components/landing/footer.tsx` - Updated contact links
- `src/lib/supabase.ts` - Supabase client
- `src/app/api/waitlist/route.ts` - Waitlist API endpoint
- `src/lib/posthog.ts` - PostHog initialization
- `src/components/providers/posthog-provider.tsx` - PostHog provider
- `src/components/landing/waitlist-cta.tsx` - API + event tracking
- `docs/analytics/event-taxonomy.md` - Event documentation
- `supabase/migrations/20260123000000_create_waitlist.sql` - DB migration
