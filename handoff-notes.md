# PlebTest Handoff Notes

> **Purpose**: Context for the next agent/session. Updated after each task completion.
> **Last Updated**: 2026-01-24 18:55 (Data Carry-Over implemented)

---

## Current State

**Phase**: 1 - Core Loop MVP
**Status**: In Progress
**Last Completed**: task-1.3.4 - Implement Data Carry-Over (F-030) ✅
**Next Task**: task-1.2.5 - Implement Profile Management (F-004) OR task-1.4.1 - Implement Create Idea (F-006)

### Data Carry-Over (task-1.3.4) ✅
**Implementation**: Complete Quick Fire → Signup → Proposal flow

**New Files**:
- `src/lib/quick-fire-storage.ts` - localStorage persistence (30min expiry)
- `src/components/quick-fire-processor.tsx` - Post-auth processing component
- `src/app/api/ideas/from-quick-fire/route.ts` - API for creating Idea + Proposal
- `src/app/(protected)/ideas/[ideaId]/page.tsx` - Idea detail page
- `src/app/(protected)/ideas/[ideaId]/proposals/[proposalId]/` - Proposal pages

**Modified Files**:
- `quick-fire.tsx` - Passes idea text to result
- `quick-fire-result.tsx` - Stores data before redirect
- `openrouter.ts` - Added `generateProposalFromIdea()`
- `dashboard/page.tsx` - Added QuickFireProcessor, shows ideas

**Flow**:
1. User enters idea in Quick Fire
2. Gets score + objection
3. Clicks "Go Deeper" → stores in localStorage → redirect to /signup
4. Completes OAuth
5. QuickFireProcessor on dashboard detects data
6. Creates Idea (with score, objection) and Proposal (AI-generated)
7. Redirects to proposal view page

### Quick Fire UI (task-1.3.3) ✅
**Location**: `src/components/quick-fire/`
**Files**: 8 components (quick-fire.tsx, input, loading, result, error, gauge, badge, index)
**Integrated**: Hero section of landing page

**Features**:
- State machine: input → loading → result/error
- Animated SVG gauge with score counter
- Color-coded risk levels (emerald/amber/rose)
- Error handling (rate_limit, validation, server_error)
- "Go Deeper" → stores data, redirects to /signup
- "Test Another" → reset

### Quick Fire API (task-1.3.2) ✅
**Endpoint**: POST /api/quick-fire
**Files**:
- `src/lib/ratelimit.ts` - Upstash rate limiter (10/hour per IP)
- `src/lib/openrouter.ts` - AI integration (claude-3-haiku)
- `src/app/api/quick-fire/route.ts` - API endpoint

**Response Format**:
```json
{ "riskScore": 73, "riskLevel": "HIGH", "keyObjection": "Crowded market..." }
```

### Upstash Redis Configuration (task-1.15.1) ✅
**Database**: plebtest-redis
**Endpoint**: https://fitting-grouper-34390.upstash.io
**Region**: us-east-1 (matches Railway)

**Environment Variables**:
- `UPSTASH_REDIS_REST_URL` - Set in staging ✅, production ✅
- `UPSTASH_REDIS_REST_TOKEN` - Set in staging ✅, production ✅
- `OPENROUTER_API_KEY` - Set in staging ✅, production ✅
**Previous Phase**: 0 - Landing Page ✅ COMPLETE (2026-01-24)
**Production URL**: https://plebtest.com ✅

### Supabase Configuration
| Environment | Project | ID |
|-------------|---------|-----|
| Staging | plebtest-staging | (existing) |
| Production | PlebTest | wemszisfzevffudenqzi |

### Railway Deployment Fix Applied
- Builder: nixpacks (not Railpack)
- Node.js: 20 (via .node-version and railway.toml)
- Supabase client: lazy initialization

### Local Development Setup
- **Local Supabase**: `supabase start` (Docker required)
- **Studio**: http://127.0.0.1:54323
- **API**: http://127.0.0.1:54321
- **Database**: postgresql://postgres:postgres@127.0.0.1:54322/postgres
- **Env file**: `.env.local` contains local credentials
- **Note**: Run `supabase stop` when done, `supabase start` to resume

### Quick Fire UI Design (task-1.3.1)
**Design Spec**: `/docs/design/quick-fire-ui-spec.md` (16KB)

**Component Structure**:
```
QuickFire/
├── QuickFire.tsx (main + state management)
├── QuickFireInput.tsx
├── QuickFireLoading.tsx
├── QuickFireResult.tsx
├── QuickFireError.tsx
├── RiskScoreGauge.tsx (SVG animation)
├── RiskLevelBadge.tsx
└── ObjectionBox.tsx
```

**Key Design Decisions**:
- Semi-circular gauge for Risk Score (visual impact)
- Color-coded: Rose (High 71-100), Amber (Medium 31-70), Emerald (Low 0-30)
- Staggered animations: gauge → badge → objection → CTA
- Placement: Hero section recommended

**API Contract**:
```typescript
POST /api/quick-fire { idea: string } // 10-200 chars
Response: { riskScore: number, riskLevel: 'LOW'|'MEDIUM'|'HIGH', keyObjection: string }
```

**BLOCKED**: Implementation requires task-1.15.1 (Upstash Redis) for rate limiting

### Logout Implementation (task-1.2.4)
**Components**:
- `LogoutButton` (`src/components/auth/logout-button.tsx`) - Client component with loading state
  - Variants: default, ghost, link
  - Calls signOut server action, then router.push('/') + router.refresh()
- `Header` (`src/components/layout/header.tsx`) - Server component
  - Checks auth state, shows different nav for auth'd vs unauth'd users
  - Includes LogoutButton for authenticated users

**Pages with Logout Access**:
- `/dashboard` - Header with logout button
- `/settings` - Header + dedicated logout section

### Auth Pages (task-1.2.2, task-1.2.3)
**Routes**:
- `/signup` - Two-step: tier selection (Solo/Growth) → OAuth/email form
- `/login` - OAuth buttons + email/password form

**Components**:
- `src/components/auth/oauth-buttons.tsx` - Google/GitHub OAuth
- `src/components/auth/signup-form.tsx` - Email/password + terms consent

**Server Actions** (`src/lib/auth/actions.ts`):
- `signUpWithEmail(formData)` - Creates auth user + users record
- `signInWithEmail(formData)` - Password login
- `signOut()` - Signs out user

**Database Tiers**: solo, growth, scale, pro (NOT 'studio' or 'free')

### Authentication Setup (task-1.2.1)
**Routes**:
- `/auth/callback` - OAuth callback handler
- `/auth/error` - Auth error display page

**Middleware** (`src/middleware.ts`):
- Refreshes session on every request
- Protects: `/dashboard`, `/account`, `/settings`
- Redirects auth'd users from: `/login`, `/signup`

**OAuth Setup Guide**: `docs/auth-setup.md`
- Manual steps required in Supabase dashboard
- Google + GitHub OAuth instructions included

**Redirect URLs to configure in Supabase**:
```
http://localhost:3000/auth/callback
https://plebteststaging-staging.up.railway.app/auth/callback
https://plebtest.com/auth/callback
```

### Supabase Clients (task-1.1.5)
**Location**: `src/lib/supabase/`
- `client.ts` - Browser client (use in Client Components)
- `server.ts` - Server client (use in Server Components, Route Handlers, Server Actions)
- `admin.ts` - Admin client (bypasses RLS, server-only)
- `index.ts` - Barrel exports: `createClient`, `createServerClient`, `createAdminClient`

**Types**: `src/types/database.types.ts` (964 lines, auto-generated)

**Usage**:
```typescript
// Client Component
import { createClient } from "@/lib/supabase";
const supabase = createClient();

// Server Component
import { createServerClient } from "@/lib/supabase";
const supabase = await createServerClient();

// Admin operations (server-only)
import { createAdminClient } from "@/lib/supabase";
const admin = createAdminClient();
```

### Database Schema (task-1.1.3, task-1.1.4)
**Migration File**: `supabase/migrations/20260124000001_create_core_schema.sql`
- **13 Tables**: users, ideas, proposals, assumptions, icps, personas, validation_tests, sessions, reports, iterations, webhook_events, usage_tracking, waitlist
- **17 ENUMs**: All from architecture.md (subscription_tier, verdict, etc.)
- **43 RLS Policies**: Full CRUD for all tables with ownership chains
- **10 Indexes**: Performance indexes on FKs and common queries
- **4 Triggers**: updated_at auto-update on users, ideas, proposals, icps
- **Verified**: `supabase db reset` applies both migrations successfully

---

## Mission Objectives

1. ✅ Launch marketing presence before MVP is ready
2. ✅ Begin building waitlist for launch
3. ✅ Establish brand positioning
4. ✅ Show product credibility with demo assets

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
- **task-0.2.6**: Demo preview placeholder ✅ 2026-01-23 09:35
  - Browser-chrome mockup at `src/components/landing/demo-preview.tsx`
  - 3-stage flow visualization (Quick Fire → Full Validation → Verdict)
- **task-0.2.7**: Sample verdict cards ✅ 2026-01-23 09:35
  - 3 example verdicts at `src/components/landing/sample-verdicts.tsx`
  - Kill (Uber for Dog Walking), Pivot (AI Recipe Generator), Build (B2B Invoice Automation)
- **task-0.2.8**: Privacy & Terms pages ✅ 2026-01-23 09:35
  - /privacy (GDPR-compliant, cookieless analytics explained)
  - /terms (14 sections, AI disclaimer highlighted)
- **task-0.3.1**: Production deployment ✅ 2026-01-23 14:40
  - PR #2 merged to main
  - Railway auto-deploying from main branch
  - plebtest.com returning HTTP 200

### Sprint 0.5 (Final Polish) - ✅ ALL COMPLETE

| Task | Description | Priority | Status |
|------|-------------|----------|--------|
| 0.5.1 | Replace pricing features with actual Phase 1 features | p0 | ✅ |
| 0.5.2 | Add early access pricing line | p1 | ✅ |
| 0.5.3 | Rewrite Problem section (shorter, no uncited stats) | p0 | ✅ |
| 0.5.4 | Add simulated persona disclaimer | p1 | ✅ |
| 0.5.5 | Update CTA to "Join Waitlist for Early Access" | p0 | ✅ |
| 0.5.6 | Remove "View Full Report" buttons | p0 | ✅ |
| 0.5.7 | Update Risk Score format (High/Medium/Low) | p1 | ✅ |
| 0.5.8 | Deploy final polish to production | p0 | ✅ |

**Changes Implemented:**
- Pricing features → actual Phase 1 capabilities (interviews, products, shareable reports)
- Early access pricing line: "Early access pricing from $7.95/mo + free credits"
- Problem section → shorter, emotional barrier focus, no uncited stats
- CTAs → "Join Waitlist for Early Access" (urgency)
- Disclaimers → "Sample outputs from simulated persona interviews"
- Risk Score format → "High (87)" instead of "87/100"
- View Full Report buttons removed from verdict cards
- PR #5 merged to main, production deployed

### What Needs to Happen Next

**Phase 0 Complete! Next Steps:**
1. **task-0.3.2**: Announce on social channels (marketer)
2. **Phase 1**: Core Loop MVP - Start with task-1.1.1

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
| Production | plebtest.com | Live ✅ Sprint 0.5 deployed |

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

## Files Changed This Session (Sprint 0.5)

- `src/components/landing/pricing-preview.tsx` - Updated features to Phase 1 capabilities, added early access line
- `src/components/landing/problem-section.tsx` - Rewritten (shorter, emotional barrier framing)
- `src/components/landing/sample-verdicts.tsx` - Risk Score format, removed View Full Report buttons, added disclaimer
- `src/components/landing/hero.tsx` - CTA updated to "Join Waitlist for Early Access"
- `src/components/landing/demo-preview.tsx` - CTA updated
- `src/components/landing/waitlist-cta.tsx` - CTA updated
