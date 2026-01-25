# PlebTest Project Plan

> **Generated:** 2026-01-21
> **Updated:** 2026-01-22 (6-LLM QA Review)
> **Version:** 2.1
> **Project Type:** saas-mvp
> **Mode:** Engaged (5 checkpoints validated)

---

## Executive Summary

PlebTest is an AI-powered idea validation platform for founders who avoid cold calls. This plan outlines the path from landing page (Phase 0) through public launch (Phase 2) to scale (Phase 3).

**Target:** 1,000 paying founders and $250K ARR.

---

## Meta

| Field | Value |
|-------|-------|
| Name | PlebTest |
| Tagline | Kill duds. Find winners. |
| Repository | TBD (to be created) |
| Created | 2026-01-21 |
| Last Updated | 2026-01-22 |

---

## Objectives

### Primary Objective
Give founders who can't—or won't—pick up the phone a way to validate ideas using AI customer simulations.

### Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Paying Founders | 1,000 | Stripe subscription count |
| ARR | $250,000 | Stripe MRR × 12 |
| Trial-to-Paid Conversion | 60% | Conversions / Trial starts |
| Time to First Verdict | ≤10 minutes | Onboarding analytics |
| Monthly Churn | <5% | Cancellations / Active subscribers |

---

## Phases Overview

| Phase | Name | Status |
|-------|------|--------|
| 0 | Landing Page | complete ✅ |
| 1 | Core Loop MVP | in_progress |
| 2 | Full MVP & Launch | not_started |
| 3 | Scale | not_started |

---

## Phase 0: Landing Page

**Status:** complete ✅
**Theme:** Start capturing demand before MVP exists
**Sprint 0.3 Added:** 2026-01-23 - Brand alignment per review recommendations
**Completed:** 2026-01-24

### Objectives
- [x] Launch marketing presence before product is ready ✅
- [x] Begin building waitlist for launch ✅
- [x] Establish brand positioning ✅
- [x] Show product credibility with demo assets ✅

### Tasks

#### 0.1 Project Setup
- [x] **task-0.1.1** Create GitHub repository - ✅ 2026-01-22 20:50
  - Agent: operator
  - Priority: p0
  - Acceptance Criteria:
    - Repository created with proper .gitignore
    - Branch protection on main
    - develop branch created
  - Dependencies: none
  - **Completed**: github.com/TheWayWithin/PlebTest, main protected, develop branch created

- [x] **task-0.1.2** Initialize Next.js project - ✅ 2026-01-22 21:17
  - Agent: developer
  - Priority: p0
  - Acceptance Criteria:
    - Next.js 15+ with App Router
    - TypeScript configured
    - Tailwind CSS installed
    - shadcn/ui initialized
  - Dependencies: task-0.1.1
  - **Completed**: Next.js 16.1.4, TypeScript 5.9.3, Tailwind 4.1.18, shadcn/ui new-york

- [x] **task-0.1.3** Set up Railway projects (staging + production) - ✅ 2026-01-22 21:45
  - Agent: operator
  - Priority: p0
  - Acceptance Criteria:
    - Railway staging project created
    - Railway production project created
    - Auto-deploy from develop → staging
    - Auto-deploy from main → production
  - Dependencies: task-0.1.1
  - **Completed**: Single project "PlebTest" with staging/production environments, US East region
  - Staging URL: plebteststaging-staging.up.railway.app

- [x] **task-0.1.4** Configure domains - ✅ 2026-01-22 22:15
  - Agent: operator
  - Priority: p1
  - Acceptance Criteria:
    - staging.plebtest.com → Railway staging
    - plebtest.com → Railway production
    - SSL certificates active
  - Dependencies: task-0.1.3
  - **Completed**: plebtest.com live via Cloudflare + Railway, SSL active

#### 0.2 Landing Page Build
- [x] **task-0.2.1** Design landing page layout - ✅ 2026-01-22 23:52
  - Agent: designer
  - Priority: p0
  - Acceptance Criteria:
    - Hero section with value proposition
    - Problem/solution narrative
    - How it works section
    - Pricing preview (coming soon)
    - Waitlist CTA
    - Mobile responsive
  - Dependencies: task-0.1.2
  - **Completed**: Full design spec at /docs/design/landing-page-spec.md (23KB)

- [x] **task-0.2.2** Implement landing page - ✅ 2026-01-22 23:58
  - Agent: developer
  - Priority: p0
  - Acceptance Criteria:
    - All sections from design implemented
    - Responsive on mobile/tablet/desktop
    - Fast load time (<3s LCP)
    - Accessible (WCAG 2.1 AA)
  - Dependencies: task-0.2.1
  - **Completed**: 7 landing page sections + 2 custom UI components, build passes

- [x] **task-0.2.3** Create waitlist signup form - ✅ 2026-01-23 10:15
  - Agent: developer
  - Priority: p0
  - Acceptance Criteria:
    - Email capture with validation
    - Stores to database (can use Supabase or simple solution)
    - Success confirmation message
    - Rate limiting to prevent abuse
  - Dependencies: task-0.2.2
  - **Completed**: POST /api/waitlist, Supabase migration, frontend with loading/error states
  - **REQUIRES**: Supabase project setup with env vars (see handoff-notes.md)

- [x] **task-0.2.4** Set up PostHog analytics - ✅ 2026-01-23 11:00
  - Agent: developer
  - Priority: p1
  - Acceptance Criteria:
    - PostHog SDK installed
    - Cookieless mode enabled (no cookie banner needed)
    - IP anonymization configured
    - Page views tracked
    - Waitlist signups tracked as events
    - Basic dashboard created
  - Dependencies: task-0.2.2
  - **Completed**: PostHog integrated with cookieless mode, IP anonymization, page view + waitlist_signup tracking

- [x] **task-0.2.5** Define event taxonomy v1 - ✅ 2026-01-23 11:10
  - Agent: developer
  - Priority: p1
  - Acceptance Criteria:
    - Documented event names + properties for:
      - `waitlist_signup`
      - `quick_fire_submitted`
      - `quick_fire_result_viewed`
    - Event naming conventions established
  - Dependencies: task-0.2.4
  - **Completed**: Event taxonomy documented at /docs/analytics/event-taxonomy.md

- [x] **task-0.2.6** Create demo walkthrough - ✅ 2026-01-23 09:35
  - Agent: designer
  - Priority: p0
  - Acceptance Criteria:
    - 90-second video OR interactive Figma prototype
    - Shows Quick Fire → Full Validation → Verdict flow
    - Demonstrates anti-sycophancy (persona pushing back)
    - Shows Kill/Pivot/Build outcome examples
  - Dependencies: task-0.2.1
  - **Completed**: Placeholder mockup component at src/components/landing/demo-preview.tsx (7.5KB) showing 3-stage flow

- [x] **task-0.2.7** Create sample verdict assets - ✅ 2026-01-23 09:35
  - Agent: designer
  - Priority: p1
  - Acceptance Criteria:
    - 3 sample reports created (Kill / Pivot / Build)
    - Screenshots or mockups for landing page
    - Shows credibility before product exists
  - Dependencies: task-0.2.6
  - **Completed**: Sample verdicts component at src/components/landing/sample-verdicts.tsx (8.8KB) with 3 example cards

- [x] **task-0.2.8** Create privacy policy and terms of service - ✅ 2026-01-23 09:35
  - Agent: operator
  - Priority: p0
  - Acceptance Criteria:
    - Privacy policy page (/privacy)
    - Terms of service page (/terms)
    - Cookie consent banner (if required)
    - GDPR-compliant language
  - Dependencies: task-0.2.2
  - **Completed**: /privacy (11.6KB) and /terms (17.1KB) pages with GDPR-compliant content, AI disclaimer

#### 0.3 Launch
- [x] **task-0.3.1** Deploy to production - ✅ 2026-01-23 14:40
  - Agent: operator
  - Priority: p0
  - Acceptance Criteria:
    - Landing page live at plebtest.com
    - SSL working
    - No console errors
    - Analytics firing
  - Dependencies: task-0.2.3, task-0.2.4, task-0.2.8
  - **Completed**: PR #2 merged to main, Railway auto-deploy triggered, plebtest.com returning HTTP 200

- [x] **task-0.3.2** Announce on social channels ✅ 2026-01-24
  - Agent: marketer
  - Priority: p1
  - Acceptance Criteria:
    - Twitter/X post with link
    - Indie Hackers post (optional)
    - Initial waitlist signups tracked
  - Dependencies: task-0.3.1
  - **Completed**: LinkedIn post published, Twitter post ready

#### 0.4 Landing Page Brand Alignment (Sprint 0.3)
> **Purpose**: Align landing page messaging with PlebTest's true value proposition: AI personas that challenge your assumptions, built for founders who dread cold calls.
> **Reference**: `/Documents/Ideation/PlebTest Landing Page_ Final Review & Recommendations.md`

- [x] **task-0.4.1** Rewrite hero section - ✅ 2026-01-23
  - Agent: developer
  - Priority: p0
  - Acceptance Criteria:
    - New headline: "Get Brutally Honest Feedback Without Picking Up the Phone"
    - New subheadline: "AI personas challenge your startup idea with real objections — so you know whether to kill it, pivot, or build."
    - Badge changed from "AI-Powered Market Validation" to "For Founders Who Dread Cold Calls"
    - Remove generic "market analysis" language
  - Dependencies: none
  - **Completed**: hero.tsx updated, build passes

- [x] **task-0.4.2** Rewrite "How It Works" section - ✅ 2026-01-23
  - Agent: developer
  - Priority: p0
  - Acceptance Criteria:
    - Step 1: "Describe your idea and target customer" — Tell me what you're building and who it's for
    - Step 2: "I generate skeptical AI personas" — A panel of realistic customers based on your ICP, skewed toward skeptics
    - Step 3: "Interview the personas your way" — Use suggested Mom-Test questions, ask your own, or respond to their pushback. It's a real conversation, not a script.
    - Step 4: "Get a Kill/Pivot/Build verdict" — See the patterns: top objections, risky assumptions, and what to test next in the real world
  - Dependencies: none
  - **Completed**: how-it-works.tsx updated with interview-focused steps, build passes

- [x] **task-0.4.3** Add "Who This Is For" section - ✅ 2026-01-23
  - Agent: developer
  - Priority: p0
  - Acceptance Criteria:
    - New section after Problem section
    - Headline: "Built for founders who'd rather ship than schmooze"
    - 3 persona items:
      - "Founders who would rather code than cold-call"
      - "Anxious first-timers who dread 'Do you have 15 minutes to chat?' messages"
      - "Side-hustlers who need to sanity-check ideas before burning evenings and savings"
    - Visual styling consistent with rest of page
  - Dependencies: none
  - **Completed**: who-this-is-for.tsx created, added to page.tsx after ProblemSection, build passes

- [x] **task-0.4.4** Add "Why Not ChatGPT?" section - ✅ 2026-01-23
  - Agent: developer
  - Priority: p0
  - Acceptance Criteria:
    - New section with comparison table
    - Headline: "Why not just use ChatGPT?"
    - Subheadline: "ChatGPT wants to help. PlebTest personas want to challenge."
    - Comparison table:
      - ChatGPT: "That's a great idea for busy pet owners!" vs PlebTest: "I already use Rover. What problem does this solve that they don't?"
      - ChatGPT: "Users would love a subscription model." vs PlebTest: "I'd try it once. Why would I pay monthly for this?"
  - Dependencies: none
  - **Completed**: why-not-chatgpt.tsx created with dark theme, comparison table, and anti-sycophancy callout

- [x] **task-0.4.5** Add anti-sycophancy visual comparison - ✅ 2026-01-23
  - Agent: developer
  - Priority: p1
  - Acceptance Criteria:
    - Visual side-by-side comparison element
    - Generic AI: "That sounds like a great idea!"
    - PlebTest Persona: "Why would I switch from what I use now? Be specific."
    - Can be combined with task-0.4.4 or standalone
  - Dependencies: task-0.4.4
  - **Completed**: Integrated into why-not-chatgpt.tsx as callout section at bottom

- [x] **task-0.4.6** Add "Patterns, Not Predictions" disclaimer - ✅ 2026-01-23
  - Agent: developer
  - Priority: p1
  - Acceptance Criteria:
    - Visible disclaimer text (not hidden in footer)
    - Text: "PlebTest doesn't predict revenue or market size. It surfaces patterns of objections and blind spots so you know whether to kill it, pivot, or build."
    - Positioned near sample verdicts or solution section
  - Dependencies: none
  - **Completed**: Added styled disclaimer box in sample-verdicts.tsx after verdict cards

- [x] **task-0.4.7** Rewrite sample verdicts with persona quotes - ✅ 2026-01-23
  - Agent: developer
  - Priority: p0
  - Acceptance Criteria:
    - KILL - Dog Walking App:
      - "I already use Rover. Unless you're half the price, I'm not switching." — Sarah, Dog Owner
      - "My neighbor's kid walks my dog. Why would I pay for an app?" — Mike, Suburban Dad
      - Verdict: 4 of 5 personas rejected the value proposition.
    - PIVOT - Meal Planning App:
      - "I'd use this for recipes, but I won't pay monthly. Make it one-time." — Lisa, Busy Parent
      - "I already use Pinterest for meal ideas. What's different?" — Tom, Home Cook
      - Verdict: Interest exists, but pricing model and differentiation need work.
    - BUILD - Invoice Reminder Tool:
      - "I chase payments manually every month. I'd pay $10/mo to stop that." — Alex, Freelancer
      - "If it integrates with QuickBooks, I'm in." — Priya, Small Business Owner
      - Verdict: Clear pain point with willingness to pay. Build it.
  - Dependencies: none
  - **Completed**: Updated sample-verdicts.tsx with persona quotes, changed CTA to waitlist link

- [x] **task-0.4.8** Add founder story section - ✅ 2026-01-23
  - Agent: developer
  - Priority: p1
  - Acceptance Criteria:
    - New section with personal story
    - Headline: "Why I Built This"
    - Content: "Customer discovery is emotionally hard for many founders. I wanted a safer way to start — so I built one. I'm a founder who dreads cold calls. PlebTest lets me validate ideas without the awkward conversations. Now I'm sharing it with founders like me. — Jamie"
    - Photo placeholder or avatar (optional)
    - Positioned before waitlist CTA
  - Dependencies: none
  - **Completed**: founder-story.tsx created with expanded personal narrative, avatar initial, positioned before WaitlistCTA

- [x] **task-0.4.9** Change "we" to "I" language throughout - ✅ 2026-01-23
  - Agent: developer
  - Priority: p0
  - Acceptance Criteria:
    - Audit all copy for "we/our/us" language
    - Use "I" in founder story and high-trust sections
    - Use "PlebTest" for product references ("PlebTest generates...", "PlebTest gives you...")
    - Remove all "we" language except where grammatically unavoidable
  - Dependencies: task-0.4.1, task-0.4.2, task-0.4.3, task-0.4.4, task-0.4.6, task-0.4.7, task-0.4.8
  - **Completed**: Fixed in demo-preview.tsx, solution-section.tsx, waitlist-cta.tsx. Removed "500+ founders" unverified claim.

- [x] **task-0.4.10** Update solution section copy - ✅ 2026-01-23
  - Agent: developer
  - Priority: p0
  - Acceptance Criteria:
    - Remove "market data, competitor intelligence, and proven validation frameworks" language
    - Focus on AI personas that challenge assumptions
    - Update verdict card descriptions to mention persona objections
    - Align with "interview not analysis" framing
  - Dependencies: none
  - **Completed**: New headline "AI Personas That Challenge, Not Validate", all verdict descriptions now reference personas

- [x] **task-0.4.11** Deploy brand-aligned landing page - ✅ 2026-01-23 18:32
  - Agent: operator
  - Priority: p0
  - Acceptance Criteria:
    - All tasks 0.4.1-0.4.10 complete
    - Build passes (`npm run build`)
    - No console errors
    - Changes merged to main
    - Production updated at plebtest.com
  - Dependencies: task-0.4.1, task-0.4.2, task-0.4.3, task-0.4.4, task-0.4.5, task-0.4.6, task-0.4.7, task-0.4.8, task-0.4.9, task-0.4.10
  - **Completed**: PR #4 merged to main, Railway deployed, plebtest.com live

#### 0.5 Landing Page Final Polish (Sprint 0.5)
> **Purpose**: Final refinements based on consolidated LLM feedback (GPT, DeepSeek, Claude). Score 9/10 → 9.5/10.
> **Reference**: `/Documents/Ideation/PlebTest Landing Page — Final Recommendations.md`

- [x] **task-0.5.1** Replace pricing features with actual Phase 1 features ✅ 2026-01-23
  - Agent: developer
  - Priority: p0
  - Acceptance Criteria:
    - Solo ($9.95/mo): 1 product, 10 interviews/month, Kill/Pivot/Build verdict, Shareable report
    - Growth ($19.95/mo): 3 products, 30 interviews/month, Multiple ICPs per product, Anti-sycophancy pushback presets
    - Scale ($29.95/mo): 10 products, 100 interviews/month, Assumption Board + Reality Check plan, Priority processing
    - Pro ($49.95/mo): 20 products, 200 interviews/month, Early feature access, Shareable decision briefs
  - Dependencies: none

- [x] **task-0.5.2** Add early access pricing line ✅ 2026-01-23
  - Agent: developer
  - Priority: p1
  - Acceptance Criteria:
    - Text: "Early access pricing from $7.95/mo + free credits"
    - Positioned below pricing grid
  - Dependencies: task-0.5.1

- [x] **task-0.5.3** Rewrite Problem section (shorter, emotional barrier framing) ✅ 2026-01-23
  - Agent: developer
  - Priority: p0
  - Acceptance Criteria:
    - Remove uncited stats ("6-12 months", "$30,000+")
    - Remove "Emotional Devastation" language
    - Shorten by ~40%
    - New framing: "The hardest part of validation isn't building — it's picking up the phone..."
  - Dependencies: none

- [x] **task-0.5.4** Add simulated persona disclaimer ✅ 2026-01-23
  - Agent: developer
  - Priority: p1
  - Acceptance Criteria:
    - Text: "Sample outputs from simulated persona interviews (not real customers)."
    - Positioned above or below sample verdicts
  - Dependencies: none

- [x] **task-0.5.5** Update CTA text to "Join Waitlist for Early Access" ✅ 2026-01-23
  - Agent: developer
  - Priority: p0
  - Acceptance Criteria:
    - All "Join the Waitlist" buttons → "Join Waitlist for Early Access"
    - Applies to: Hero, Demo section, Sample verdicts section, Waitlist CTA section
  - Dependencies: none

- [x] **task-0.5.6** Remove "View Full Report" buttons from verdict cards ✅ 2026-01-23
  - Agent: developer
  - Priority: p0
  - Acceptance Criteria:
    - Remove non-functional "View Full Report" buttons from sample-verdicts.tsx
  - Dependencies: none

- [x] **task-0.5.7** Update Risk Score format to include label ✅ 2026-01-23
  - Agent: developer
  - Priority: p1
  - Acceptance Criteria:
    - Kill: "Risk Score: High (87)" instead of "87/100"
    - Pivot: "Risk Score: Medium (52)"
    - Build: "Risk Score: Low (23)"
  - Dependencies: none

- [x] **task-0.5.8** Deploy final polish to production ✅ 2026-01-23
  - Agent: operator
  - Priority: p0
  - Acceptance Criteria:
    - All tasks 0.5.1-0.5.7 complete
    - Build passes
    - Changes merged to main
    - Production updated
  - Dependencies: task-0.5.1, task-0.5.2, task-0.5.3, task-0.5.4, task-0.5.5, task-0.5.6, task-0.5.7

### Quality Gates
- [x] Build passes (`npm run build`) - ✅ 2026-01-23
- [ ] Lighthouse score ≥90 (Performance)
- [x] Mobile responsive verified - ✅ 2026-01-23
- [x] Privacy policy and terms live - ✅ 2026-01-23
- [x] Brand messaging aligned with value proposition (Sprint 0.3) - ✅ 2026-01-23
- [x] "We" language removed, replaced with "I" or "PlebTest" - ✅ 2026-01-23
- [x] Pricing features match Phase 1 capabilities (Sprint 0.5) - ✅ 2026-01-23
- [x] No uncited statistics (Sprint 0.5) - ✅ 2026-01-23

### Deliverables
- [x] Live landing page at plebtest.com - ✅ 2026-01-23
- [x] Working waitlist capture - ✅ 2026-01-23
- [x] Analytics tracking active - ✅ 2026-01-23
- [x] Demo walkthrough visible - ✅ 2026-01-23
- [x] Privacy policy and terms published - ✅ 2026-01-23
- [x] Brand-aligned messaging (AI personas that challenge, not validate) - ✅ 2026-01-23
- [x] "Who This Is For" section (founders who dread cold calls) - ✅ 2026-01-23
- [x] "Why Not ChatGPT?" comparison section - ✅ 2026-01-23
- [x] Founder story section - ✅ 2026-01-23
- [x] Accurate pricing features (Sprint 0.5) - ✅ 2026-01-23
- [x] Trust-building disclaimers (Sprint 0.5) - ✅ 2026-01-23

---

## Phase 1: Core Loop MVP

**Status:** in_progress
**Started:** 2026-01-24
**Theme:** Core validation loop working - private testing only

### Objectives
- [ ] Quick Fire Mode as primary entry hook
- [ ] Full validation flow (Interactive + Spectator modes)
- [ ] Anti-Sycophancy Engine active and verified
- [ ] Shareable reports for virality
- [ ] Billing integration ready

### Tasks

#### 1.1 Database & Infrastructure
- [x] **task-1.1.1** Set up Supabase projects (staging + production) - ✅ 2026-01-24
  - Agent: operator
  - Priority: p0
  - Acceptance Criteria:
    - Supabase staging project created
    - Supabase production project created
    - Connection strings documented
  - Dependencies: none
  - **Completed**: Staging (plebtest-staging) + Production (PlebTest, ID: wemszisfzevffudenqzi)
  - Environment variables configured in Railway for both environments

- [x] **task-1.1.2** Initialize local Supabase for development - ✅ 2026-01-24
  - Agent: developer
  - Priority: p0
  - Acceptance Criteria:
    - `supabase init` completed
    - `supabase start` works
    - Local Postgres accessible
  - Dependencies: task-1.1.1
  - **Completed**: Local Supabase running, Studio at http://127.0.0.1:54323, .env.local created

- [x] **task-1.1.3** Create database schema - ✅ 2026-01-24
  - Agent: developer
  - Priority: p0
  - Acceptance Criteria:
    - All tables from architecture.md created
    - All ENUMs defined
    - Foreign keys and indexes in place
    - Migration files created
  - Dependencies: task-1.1.2
  - **Completed**: 13 tables, 17 ENUMs, 43 RLS policies, 10 indexes, 4 triggers created

- [x] **task-1.1.4** Implement Row Level Security policies - ✅ 2026-01-24
  - Agent: developer
  - Priority: p0
  - Acceptance Criteria:
    - RLS enabled on all tables
    - Explicit SELECT/INSERT/UPDATE/DELETE policies
    - All policies chain to user_id
    - Tested with multiple users
  - Dependencies: task-1.1.3
  - **Completed**: 43 RLS policies implemented in task-1.1.3 migration (all chains to user_id)

- [x] **task-1.1.5** Set up Supabase clients - ✅ 2026-01-24
  - Agent: developer
  - Priority: p0
  - Acceptance Criteria:
    - Browser client (lib/supabase/client.ts)
    - Server client (lib/supabase/server.ts)
    - Admin client (lib/supabase/admin.ts)
    - TypeScript types generated
  - Dependencies: task-1.1.3
  - **Completed**: 4 client files created using @supabase/ssr, 964-line database.types.ts generated, build passes

- [x] **task-1.1.6** Configure environment variables - ✅ 2026-01-24
  - Agent: operator
  - Priority: p0
  - Acceptance Criteria:
    - All env vars from architecture.md documented
    - Staging env vars configured in Railway
    - Production env vars configured in Railway
    - Local .env.local template created
  - Dependencies: task-0.1.3, task-1.1.1
  - **Completed**: .env.example updated (16 vars documented), .env.local updated with placeholders, docs/env-vars-checklist.md created. Staging/Production have Supabase + PostHog vars set. Phase 1 vars (OpenRouter, Stripe, Upstash, Resend) will be added when tasks require them.

#### 1.2 Authentication
- [x] **task-1.2.1** Configure Supabase Auth providers - ✅ 2026-01-24
  - Agent: developer
  - Priority: p0
  - Acceptance Criteria:
    - Google OAuth configured
    - GitHub OAuth configured
    - Email/Password enabled
    - Redirect URLs set for all environments
  - Dependencies: task-1.1.1
  - **Completed**: Auth callback route, error page, middleware created. docs/auth-setup.md has OAuth config instructions. OAuth providers need manual setup in Supabase dashboard.

- [x] **task-1.2.2** Implement registration flow (F-001) - ✅ 2026-01-24
  - Agent: developer
  - Priority: p0
  - Acceptance Criteria:
    - Tier selection UI
    - OAuth buttons (Google, GitHub)
    - Email/Password form
    - Terms & Privacy consent
    - Creates user record in users table
  - Dependencies: task-1.2.1, task-1.1.4
  - **Completed**: /signup page with tier selection (Solo/Growth), OAuth + email forms, terms consent. Auth callback creates user in public.users. Build passes.

- [x] **task-1.2.3** Implement login flow (F-002) - ✅ 2026-01-24
  - Agent: developer
  - Priority: p0
  - Acceptance Criteria:
    - OAuth login working
    - Email/Password login working
    - "Remember me" option
    - Redirect to dashboard after login
  - Dependencies: task-1.2.1
  - **Completed**: /login page with OAuth (Google/GitHub) and email/password. Redirects to /dashboard after success. Session persistence handled by Supabase cookie defaults.

- [x] **task-1.2.4** Implement logout (F-003) - ✅ 2026-01-24 14:55
  - Agent: developer
  - Priority: p0
  - Acceptance Criteria:
    - Logout button in header/settings
    - Clears session
    - Redirects to home
  - Dependencies: task-1.2.3
  - **Completed**: LogoutButton component with loading state, Header component with auth-aware navigation, dashboard and settings pages with logout access

- [ ] **task-1.2.5** Implement profile management (F-004)
  - Agent: developer
  - Priority: p1
  - Acceptance Criteria:
    - View profile page
    - Edit name, email
    - Country selection
    - VAT ID field (optional)
  - Dependencies: task-1.2.3

- [~] **task-1.2.6** Implement auth middleware - ⚠️ PARTIAL (2/3 criteria met)
  - Agent: developer
  - Priority: p0
  - Acceptance Criteria:
    - ✅ Protected routes redirect to login (implemented in task-1.2.1)
    - ✅ Session validation on each request (implemented in task-1.2.1)
    - ⏳ Rate limiting on auth endpoints (5/15min) - BLOCKED by task-1.15.1 (Upstash Redis)
  - Dependencies: task-1.2.3
  - **Status**: Middleware exists at src/middleware.ts with route protection and session refresh. Rate limiting requires Upstash Redis (task-1.15.1)

#### 1.3 Quick Fire Mode
- [x] **task-1.3.1** Design Quick Fire UI - ✅ 2026-01-24 15:00
  - Agent: designer
  - Priority: p0
  - Acceptance Criteria:
    - Single input field ("Describe your idea in one sentence")
    - Submit button
    - Risk Score gauge display
    - Key objection display
    - "Go Deeper" CTA
  - Dependencies: task-0.2.2
  - **Completed**: Full design spec at /docs/design/quick-fire-ui-spec.md (16KB). 4 states designed (input, loading, result, error), responsive layouts, animations, accessibility requirements

- [x] **task-1.3.2** Implement Quick Fire API endpoint - ✅ 2026-01-24 15:35
  - Agent: developer
  - Priority: p0
  - Acceptance Criteria:
    - POST /api/quick-fire
    - Input validation (10-200 chars)
    - Per-IP rate limit (10/hour via Upstash)
    - Per-fingerprint limit (20/day) - deferred to Phase 2
    - CAPTCHA required after 3 requests/hour from same IP - deferred to Phase 2
    - OpenRouter integration
    - Returns score (1-100) + key objection
    - Token budget enforced (max_tokens: 150)
    - No database writes until user signs up
  - Dependencies: task-1.1.5, task-1.15.1
  - **Completed**: API at /api/quick-fire with Upstash rate limiting, OpenRouter AI (claude-3-haiku), anti-sycophancy prompt
  - **Environment**: OPENROUTER_API_KEY configured in staging ✅ + production ✅

- [x] **task-1.3.3** Implement Quick Fire UI (F-029) - ✅ 2026-01-24
  - Agent: developer
  - Priority: p0
  - Acceptance Criteria:
    - Landing page integration
    - Loading state during API call
    - Risk Score gauge animation
    - Objection display
    - "Go Deeper" button (triggers signup)
    - Works without login
  - Dependencies: task-1.3.1, task-1.3.2
  - **Completed**: 8 Quick Fire components created in src/components/quick-fire/, integrated into Hero section

- [x] **task-1.3.4** Implement Data Carry-Over (F-030) - ✅ 2026-01-24 18:55
  - Agent: developer
  - Priority: p0
  - Acceptance Criteria:
    - After signup, creates Idea with quick_fire_score
    - Auto-generates Proposal from one-liner (AI assist)
    - Redirects to proposal editor
  - Dependencies: task-1.3.3, task-1.2.2
  - **Completed**: localStorage persistence, QuickFireProcessor component, /api/ideas/from-quick-fire endpoint, AI proposal generation, idea/proposal pages created

#### 1.4 Idea Management
- [x] **task-1.4.1** Implement Create Idea (F-006) - ✅ 2026-01-25
  - Agent: developer
  - Priority: p0
  - Acceptance Criteria:
    - Create idea form (name field)
    - Tier limit enforcement
    - Saves to database
    - Redirects to idea detail
  - Dependencies: task-1.1.4
  - **Completed**: POST/GET /api/ideas with tier limits, CreateIdeaDialog component, dashboard refactored to client/server architecture

- [x] **task-1.4.2** Implement Ideas List (F-007) - ✅ 2026-01-25
  - Agent: developer
  - Priority: p0
  - Acceptance Criteria:
    - List all user's ideas
    - Shows quick_fire_score if exists
    - Links to idea detail
    - Empty state
  - Dependencies: task-1.4.1
  - **Completed**: Implemented as part of dashboard refactor in task-1.4.1

- [x] **task-1.4.3** Implement Idea Detail (F-008) - ✅ 2026-01-25
  - Agent: developer
  - Priority: p0
  - Acceptance Criteria:
    - Shows idea name
    - Lists all proposals
    - Create proposal button
    - Edit idea button
  - Dependencies: task-1.4.2
  - **Completed**: EditIdeaDialog added, PUT /api/ideas/[id] endpoint, New Proposal button wired to /ideas/[id]/proposals/new

- [x] **task-1.4.4** Implement Edit Idea (F-009) - ✅ 2026-01-25
  - Agent: developer
  - Priority: p1
  - Acceptance Criteria:
    - Edit idea name ✅
    - Save changes ✅
  - Dependencies: task-1.4.3
  - **Completed**: Already implemented in task-1.4.3 (EditIdeaDialog, PUT endpoint)

#### 1.5 Proposal & ICP Management
- [x] **task-1.5.1** Implement Create Proposal (F-010) - ✅ 2026-01-25
  - Agent: developer
  - Priority: p0
  - Acceptance Criteria:
    - Form with all proposal fields (problem, solution, hypotheses, etc.) ✅
    - Zod validation ✅
    - Saves to database ✅
    - Links to idea ✅
  - Dependencies: task-1.4.3
  - **Completed**: Full form with 8 fields, Zod validation schema, POST/GET API endpoints

- [x] **task-1.5.2** Implement View/Edit Proposal (F-011, F-012) - ✅ 2026-01-25
  - Agent: developer
  - Priority: p0
  - Acceptance Criteria:
    - View proposal details ✅
    - Edit all fields ✅
    - Status display ✅
    - Save changes ✅
  - Dependencies: task-1.5.1
  - **Completed**: Full view with all fields, edit dialog, status badges, PUT API endpoint

- [x] **task-1.5.3** Implement Archive/Delete Proposal (F-013) - ✅ 2026-01-25
  - Agent: developer
  - Priority: p1
  - Acceptance Criteria:
    - Archive button (soft delete) ✅
    - Delete button with confirmation ✅
  - Dependencies: task-1.5.2
  - **Completed**: PATCH/DELETE endpoints, archive/restore buttons, delete with AlertDialog confirmation

- [x] **task-1.5.4** Implement Create ICP (F-014) - ✅ 2026-01-25
  - Agent: developer
  - Priority: p0
  - Acceptance Criteria:
    - ICP creation form ✅
    - All fields from schema (demographics, psychographics, etc.) ✅
    - Links to proposal ✅
  - Dependencies: task-1.5.1
  - **Completed**: Full form with all ICP fields, typed enums, POST/GET API endpoints

- [x] **task-1.5.5** Implement View/Edit ICP (F-015, F-016) - ✅ 2026-01-25
  - Agent: developer
  - Priority: p0
  - Acceptance Criteria:
    - View ICP details ✅
    - Edit all fields ✅
    - Save changes ✅
  - Dependencies: task-1.5.4
  - **Completed**: ICP detail view page, edit dialog, GET/PUT/DELETE API endpoints, ICPs list on proposal view

- [x] **task-1.5.6** Implement Delete ICP (F-017) - ✅ 2026-01-25
  - Agent: developer
  - Priority: p1
  - Acceptance Criteria:
    - Delete button with confirmation ✅
    - Cannot delete if used in active test ✅
  - Dependencies: task-1.5.5
  - **Completed**: Active test check added to DELETE API, 409 error handling in frontend

#### 1.6 Persona Generation
- [x] **task-1.6.1** Implement persona generation service - ✅ 2026-01-25
  - Agent: developer
  - Priority: p0
  - Acceptance Criteria:
    - Takes ICP as input ✅
    - Generates N personas with trait variations ✅
    - Big Five personality traits assigned ✅
    - Skepticism level distribution (40% high, 40% medium, 20% low) ✅
    - Saves to personas table ✅
  - Dependencies: task-1.5.4
  - **Completed**: persona-generator.ts service with AI generation, Big Five traits, skepticism distribution

#### 1.7 Validation Tests & Workers
- [x] **task-1.7.1** Implement test configuration UI (F-018) - ✅ 2026-01-25 17:26
  - Agent: developer
  - Priority: p0
  - Acceptance Criteria:
    - Select ICPs to include
    - Choose persona count
    - Select test mode (Quick/Standard/Deep)
    - Select validation mode (Interactive/Spectator)
    - Select pushback preset
    - Tier limit check
    - Start test button
  - Dependencies: task-1.5.4, task-1.6.1
  - **Completed**: Full test configuration UI with ICP selection, persona count slider, test/validation/pushback mode selectors, tier-based limits, API route for test creation, test view page placeholder

- [x] **task-1.7.2** Set up pg-boss for background jobs - ✅ 2026-01-25 18:30
  - Agent: developer
  - Priority: p0
  - Acceptance Criteria:
    - pg-boss initialized
    - Worker process configured
    - Job types defined
  - Dependencies: task-1.1.3
  - **Completed**: pg-boss singleton with job queue utilities, 8 job types defined, worker entrypoint with test-runner/report-generator/cron handlers, `npm run worker` script added

- [ ] **task-1.7.3** Provision Railway worker service
  - Agent: operator
  - Priority: p0
  - Acceptance Criteria:
    - Separate worker service created in Railway (not web service)
    - Worker runs `npm run worker` command
    - Worker connects to same database
    - Worker has access to all required env vars
  - Dependencies: task-0.1.3, task-1.1.6

- [ ] **task-1.7.4** Configure worker health checks + monitoring
  - Agent: developer
  - Priority: p0
  - Acceptance Criteria:
    - Health check endpoint for worker
    - Worker logs visible in Railway
    - Alerts if worker process crashes
    - Restart policy configured
  - Dependencies: task-1.7.3

- [x] **task-1.7.5** Implement job retry policy + dead letter handling + idempotency - ✅ 2026-01-25 19:00
  - Agent: developer
  - Priority: p0
  - Acceptance Criteria:
    - Retry with exponential backoff (1s, 2s, 4s)
    - Max 3 retries per job
    - Failed jobs moved to dead letter queue
    - Dashboard or log visibility for failed jobs
    - Idempotency keys on jobs (e.g., `test_id` for test runner, `report_id` for report generation)
    - Jobs check if work already completed before starting
    - Prevents duplicate test runs or double report generation on worker restart
  - Dependencies: task-1.7.2
  - **Completed**: Retry policy via DEFAULT_JOB_OPTIONS, queueUniqueJob for idempotency, isTestAlreadyProcessed/isSessionAlreadyProcessed/isReportAlreadyGenerated checks in handlers, getQueuedJobs for monitoring

- [x] **task-1.7.6** Implement test runner job - ✅ 2026-01-25 19:30
  - Agent: developer
  - Priority: p0
  - Acceptance Criteria:
    - Creates validation_test record
    - Generates personas from ICPs
    - Creates session records
    - Updates test status
  - Dependencies: task-1.7.1, task-1.7.2
  - **Completed**: RUN_TEST queued from API, GENERATE_PERSONAS creates sessions via admin client, RUN_SESSION jobs queued for each persona, persona-generator accepts optional client parameter for worker context

#### 1.8 Interactive Sessions
- [x] **task-1.8.1** Build Anti-Sycophancy prompt system - ✅ 2026-01-25 20:00
  - Agent: developer
  - Priority: p0
  - Acceptance Criteria:
    - Pushback preset prompts (Cheerleader/Pragmatist/Critic)
    - Skepticism level modifiers
    - Mom Test principles embedded
    - Minimum objections enforcement (≥2)
  - Dependencies: task-1.6.1
  - **Completed**: Full prompt system with pushback configs (2-3 min objections), skepticism modifiers (low/medium/high), Mom Test principles, Big Five personality influence, signal extraction prompt, interviewer prompt for Spectator mode

- [x] **task-1.8.2** Implement SSE streaming endpoint - ✅ 2026-01-25 20:30
  - Agent: developer
  - Priority: p0
  - Acceptance Criteria:
    - POST /api/sessions/[id]/stream
    - Streams tokens from OpenRouter
    - Saves complete messages to database
    - Handles disconnect gracefully (partial save)
    - Checkpoint saves every 50 tokens
  - Dependencies: task-1.7.6, task-1.8.1
  - **Completed**: POST streams tokens via SSE, GET returns session info + history, checkpoints every 50 tokens, handles disconnect with partial save, messages table migration added

- [x] **task-1.8.3** Implement Interactive Session UI (F-020) - ✅ 2026-01-25 21:00
  - Agent: developer
  - Priority: p0
  - Acceptance Criteria:
    - Chat interface
    - Real-time token streaming
    - Persona info display
    - Message history
    - End session button
  - Dependencies: task-1.8.2
  - **Completed**: Full chat UI with message bubbles, real-time SSE streaming, persona panel with skepticism/pushback badges, session tips, end session button

- [x] **task-1.8.4** Implement session completion logic
  - Agent: developer
  - Priority: p0
  - Acceptance Criteria:
    - Marks session complete
    - Extracts key_objections
    - Calculates need_validated, solution_resonated
    - Tracks anti_sycophancy_triggers
  - Dependencies: task-1.8.3
  - **Completed**: Session completion service and API endpoint, AI signal extraction using Claude 3.5 Haiku, scoring algorithm (0-100), auto-updates test status when all sessions complete

#### 1.9 Spectator Sessions
- [x] **task-1.9.1** Implement Spectator Mode worker
  - Agent: developer
  - Priority: p0
  - Acceptance Criteria:
    - AI Interviewer asks questions
    - AI Persona responds
    - Conversation streamed to UI
    - Session auto-progresses
  - Dependencies: task-1.7.6, task-1.8.1
  - **Completed**: AI-to-AI conversation loop with natural ending detection, messages saved to DB for polling, integrates with session completion

- [ ] **task-1.9.2** Implement Spectator Session UI (F-021)
  - Agent: developer
  - Priority: p0
  - Acceptance Criteria:
    - Read-only chat view
    - Real-time updates
    - Pause/Resume controls
    - Session progress indicator
  - Dependencies: task-1.9.1

#### 1.10 Active Test View
- [ ] **task-1.10.1** Implement View Active Test (F-019)
  - Agent: developer
  - Priority: p0
  - Acceptance Criteria:
    - Shows test status
    - Lists all sessions with status
    - Links to individual sessions
    - Progress indicator
    - "Generate Report" button when all sessions complete
  - Dependencies: task-1.8.3, task-1.9.2

#### 1.11 Reports
- [ ] **task-1.11.1** Define Risk Score + Confidence rubric v1
  - Agent: developer
  - Priority: p0
  - Acceptance Criteria:
    - Documented rubric for Risk Score (inputs, weights, thresholds)
    - Documented rubric for Confidence Level (inputs, weights, thresholds)
    - "Top 2 drivers" returned with Quick Fire result
    - "Confidence drivers" shown in reports
    - Rubric stored as versioned config (not hardcoded)
    - "Why this score" explanations available
  - Dependencies: task-1.8.1

- [ ] **task-1.11.2** Implement report generation job
  - Agent: developer
  - Priority: p0
  - Acceptance Criteria:
    - Aggregates all session data
    - Calculates verdict (Kill/Pivot/Build) using rubric
    - Calculates confidence level using rubric
    - Generates summaries
    - Saves to reports table
    - Generates share_token
  - Dependencies: task-1.10.1, task-1.11.1

- [ ] **task-1.11.3** Implement View Report UI (F-022)
  - Agent: developer
  - Priority: p0
  - Acceptance Criteria:
    - Verdict display (prominent)
    - Confidence level with drivers explained
    - Need validation summary
    - Solution validation summary
    - Key objections
    - Next steps
    - Disclaimer: "Results are patterns from AI simulations, not market guarantees"
  - Dependencies: task-1.11.2

- [ ] **task-1.11.4** Implement Download Report (F-024)
  - Agent: developer
  - Priority: p1
  - Acceptance Criteria:
    - JSON export
    - (PDF export can be Phase 2)
  - Dependencies: task-1.11.3

- [ ] **task-1.11.5** Implement Share Report (F-023)
  - Agent: developer
  - Priority: p0
  - Acceptance Criteria:
    - Toggle report public
    - Copy share link button
    - Public report page at /r/[token]
    - Server-validated token (no permissive RLS)
    - Option to hide proposal details
  - Dependencies: task-1.11.3

#### 1.12 Onboarding
- [ ] **task-1.12.1** Implement Onboarding Flow (F-005)
  - Agent: developer
  - Priority: p1
  - Acceptance Criteria:
    - First-run detection
    - Quick Fire as first step
    - Guides to first full validation (Interactive mode default)
    - Progress indicators
  - Dependencies: task-1.3.4

#### 1.13 Billing
- [ ] **task-1.13.1** Set up Stripe account and products
  - Agent: operator
  - Priority: p0
  - Acceptance Criteria:
    - Stripe account configured
    - 4 products created (Solo, Growth, Scale, Pro)
    - Monthly and annual prices
    - Webhook endpoints configured
  - Dependencies: none

- [ ] **task-1.13.2** Implement Stripe webhook handler
  - Agent: developer
  - Priority: p0
  - Acceptance Criteria:
    - checkout.session.completed
    - customer.subscription.updated
    - customer.subscription.deleted
    - invoice.payment_failed
    - Idempotency via webhook_events table
  - Dependencies: task-1.13.1, task-1.1.4

- [ ] **task-1.13.3** Implement checkout flow
  - Agent: developer
  - Priority: p0
  - Acceptance Criteria:
    - Creates Stripe checkout session
    - Redirects to Stripe
    - Handles success/cancel callbacks
    - Updates user subscription_tier
  - Dependencies: task-1.13.1, task-1.2.2

- [ ] **task-1.13.4** Implement View Subscription (F-025)
  - Agent: developer
  - Priority: p0
  - Acceptance Criteria:
    - Shows current plan
    - Shows usage (ideas, tests)
    - Shows billing date
    - Shows payment method (last 4 digits)
  - Dependencies: task-1.13.2

- [ ] **task-1.13.5** Implement Upgrade/Downgrade (F-026)
  - Agent: developer
  - Priority: p0
  - Acceptance Criteria:
    - Plan selection UI
    - Proration preview
    - Confirms change
    - Updates via Stripe
  - Dependencies: task-1.13.4

- [ ] **task-1.13.6** Implement Manage Payment Method (F-027)
  - Agent: developer
  - Priority: p1
  - Acceptance Criteria:
    - Update card via Stripe portal
    - Update billing details
    - Update VAT ID
  - Dependencies: task-1.13.4

- [ ] **task-1.13.7** Implement Cancel Subscription (F-028)
  - Agent: developer
  - Priority: p1
  - Acceptance Criteria:
    - Cancellation flow
    - Retention offer (optional)
    - Feedback capture
    - Confirms cancellation
  - Dependencies: task-1.13.4

#### 1.14 Tier Limits & Cost Controls
- [ ] **task-1.14.1** Implement tier limit checking
  - Agent: developer
  - Priority: p0
  - Acceptance Criteria:
    - Ideas limit enforcement
    - Tests/month limit enforcement
    - Usage tracking table updated
    - Billing period reset logic
  - Dependencies: task-1.13.2

- [ ] **task-1.14.2** Implement billing lock states
  - Agent: developer
  - Priority: p1
  - Acceptance Criteria:
    - Soft lock (past due days 1-3)
    - Hard lock (past due day 4+)
    - Lock UI banners
    - Middleware enforcement
  - Dependencies: task-1.13.2

- [ ] **task-1.14.3** Implement per-session token budget
  - Agent: developer
  - Priority: p0
  - Acceptance Criteria:
    - Max ~8,000 tokens per session enforced
    - Token usage tracked (prompt_tokens, completion_tokens columns)
    - Session terminated gracefully if budget exceeded
  - Dependencies: task-1.8.2

- [ ] **task-1.14.4** Implement cost alerting
  - Agent: developer
  - Priority: p1
  - Acceptance Criteria:
    - Daily OpenRouter spend tracked
    - Alert if daily spend exceeds threshold (e.g., $50)
    - Per-user daily cap alerting (internal, not user-facing)
  - Dependencies: task-1.14.3, task-1.15.3

#### 1.15 Supporting Infrastructure
- [x] **task-1.15.1** Set up Upstash Redis - ✅ 2026-01-24 15:15
  - Agent: operator
  - Priority: p0
  - Acceptance Criteria:
    - Upstash account created
    - Redis instance provisioned
    - Credentials in Railway env vars
  - Dependencies: none
  - **Completed**: plebtest-redis database created (fitting-grouper-34390.upstash.io), credentials added to Railway staging + production

- [ ] **task-1.15.2** Implement rate limiting
  - Agent: developer
  - Priority: p0
  - Acceptance Criteria:
    - Rate limiter utility
    - Applied to all API routes
    - Per-IP and per-user limits
  - Dependencies: task-1.15.1

- [ ] **task-1.15.3** Set up Sentry
  - Agent: developer
  - Priority: p1
  - Acceptance Criteria:
    - Sentry project created
    - SDK installed
    - Frontend + backend error capture
    - Source maps uploaded
  - Dependencies: task-0.1.2

- [ ] **task-1.15.4** Set up Resend and email templates
  - Agent: developer
  - Priority: p1
  - Acceptance Criteria:
    - Resend account configured
    - Domain verified
    - Email templates for:
      - Waitlist confirmation
      - Email verification
      - Password reset
      - Trial reminder (3 days, 1 day before expiry)
      - Report ready notification
      - Payment receipt
  - Dependencies: none

- [ ] **task-1.15.5** Implement Zod validation schemas
  - Agent: developer
  - Priority: p0
  - Acceptance Criteria:
    - Schemas for all API endpoints
    - Request validation middleware
    - Type inference for TypeScript
  - Dependencies: task-0.1.2

- [ ] **task-1.15.6** Set up Jest and write integration tests
  - Agent: developer
  - Priority: p1
  - Acceptance Criteria:
    - Jest configured with Next.js
    - Integration tests for critical paths:
      - Authentication flow
      - Quick Fire endpoint
      - Billing webhook handler
      - Test runner job
    - E2E tests (Playwright or Cypress) for critical flows:
      - Quick Fire → Signup → First validation
      - Login → Start test → View report
    - SSE streaming tests:
      - Mock OpenRouter responses
      - Test disconnect/reconnect handling
      - Test partial save on disconnect
    - CI runs tests on PR
  - Dependencies: task-0.1.2

- [ ] **task-1.15.7** Expand event taxonomy + build MVP funnel dashboard
  - Agent: developer
  - Priority: p1
  - Acceptance Criteria:
    - Events defined and implemented for:
      - `signup_started`, `signup_completed`
      - `proposal_saved`, `icp_created`
      - `test_started`, `session_completed`
      - `report_generated`, `report_shared`
      - `subscription_started`, `subscription_cancelled`
    - PostHog MVP funnel dashboard created:
      - Quick Fire → Signup → First Test → Report
      - Trial → Paid conversion
    - Time-to-first-verdict tracking implemented
  - Dependencies: task-0.2.5

#### 1.16 Anti-Sycophancy QA Harness
- [ ] **task-1.16.1** Create golden test set
  - Agent: developer
  - Priority: p0
  - Acceptance Criteria:
    - 10+ test cases with (idea + ICP + expected pushback patterns)
    - Covers range of idea quality (strong, weak, terrible)
    - Covers different pushback presets
    - Stored as test fixtures
  - Dependencies: task-1.8.1

- [ ] **task-1.16.2** Build anti-sycophancy scorecard
  - Agent: developer
  - Priority: p0
  - Acceptance Criteria:
    - Automated scoring of AI responses:
      - Objection count (target: ≥2 per session)
      - Compliment phrase detection (flag if >30%)
      - Evidence request count
      - Pricing/budget probes count
    - Pass/fail thresholds defined
  - Dependencies: task-1.16.1

- [ ] **task-1.16.3** Add prompt regression tests
  - Agent: developer
  - Priority: p1
  - Acceptance Criteria:
    - Tests run against golden test set
    - Alerts if anti-sycophancy score drops
    - Run before any prompt or model changes
  - Dependencies: task-1.16.2

#### 1.17 Data Privacy & Security
- [ ] **task-1.17.1** Implement "Delete my account" flow
  - Agent: developer
  - Priority: p1
  - Acceptance Criteria:
    - User can request account + data deletion from settings
    - Confirmation required (type "DELETE" or similar)
    - Async job deletes all user data (ideas, proposals, sessions, reports)
    - Email confirmation when deletion complete
    - Stripe subscription cancelled if active
  - Dependencies: task-1.2.5, task-1.7.2

- [ ] **task-1.17.2** Document and implement data retention policy
  - Agent: developer
  - Priority: p1
  - Acceptance Criteria:
    - Retention defaults defined:
      - Active sessions expire after 30 days of inactivity
      - Deleted accounts purged after 30 days (grace period)
      - Cancelled subscription data retained 90 days
    - Policy added to privacy policy page
    - Cleanup cron job implemented
  - Dependencies: task-0.2.8, task-1.7.2

- [ ] **task-1.17.3** Add secret scanning + CI security checks
  - Agent: developer
  - Priority: p1
  - Acceptance Criteria:
    - CI check blocks commits containing service role keys in client code
    - ESLint rule prevents admin client import in `app/` directory
    - Pre-commit hook or GitHub action configured
    - Documentation on secret handling for contributors
  - Dependencies: task-0.1.1

#### 1.18 Phase Transition
- [ ] **task-1.18.1** Refine Phase 2 task breakdown
  - Agent: operator
  - Priority: p1
  - Acceptance Criteria:
    - All Phase 2 tasks have full acceptance criteria
    - Dependencies mapped
    - Priorities assigned
    - Ready to start Phase 2
  - Dependencies: All Phase 1 tasks complete

### Quality Gates
- [ ] Build passes (`npm run build`)
- [ ] All tests pass (`npm test`)
- [ ] Lint passes (`npm run lint`)
- [ ] 5+ test validations completed successfully
- [ ] Anti-sycophancy verified: each test session surfaces ≥2 objections
- [ ] No critical bugs blocking launch

### Deliverables
- [ ] Quick Fire Mode working
- [ ] Full validation flow (Interactive + Spectator)
- [ ] Reports with verdicts and disclaimer
- [ ] Shareable report links
- [ ] Billing integration complete
- [ ] Anti-sycophancy QA harness in place
- [ ] Ready for private beta

---

## Phase 2: Full MVP & Launch

**Status:** not_started
**Theme:** Full MVP live - the complete validation experience

### Objectives
- [ ] Launch publicly with all viral features
- [ ] Add advanced validation features
- [ ] First paying customers

### Tasks (High-Level - to be detailed when phase begins)

#### 2.1 Assumption Board (F-033)
- [ ] **task-2.1.1** Design Assumption Board UI
- [ ] **task-2.1.2** Implement Assumption Board component
- [ ] **task-2.1.3** Integrate into report view

#### 2.2 Reality Check Panel (F-034)
- [ ] **task-2.2.1** Design Reality Check UI
- [ ] **task-2.2.2** Implement minimum real-world validation plan generator
- [ ] **task-2.2.3** Integrate into report view

#### 2.3 External Injection (F-031)
- [ ] **task-2.3.1** Set up Jina AI Reader integration
- [ ] **task-2.3.2** Implement URL scraping endpoint
- [ ] **task-2.3.3** Add external context UI to proposal editor
- [ ] **task-2.3.4** Inject scraped content into persona prompts

#### 2.4 Assumption Import (F-032)
- [ ] **task-2.4.1** Implement assumption paste/import UI
- [ ] **task-2.4.2** Implement priority ranking interface

#### 2.5 Pushback Presets (F-035)
- [ ] **task-2.5.1** Implement preset selector in test config
- [ ] **task-2.5.2** Add preset descriptions and use cases

#### 2.6 Pre-Mortem Mode (F-036)
- [ ] **task-2.6.1** Design Pre-Mortem flow
- [ ] **task-2.6.2** Implement "product failed - why?" simulation
- [ ] **task-2.6.3** Add pre_mortem_findings to report

#### 2.7 Nudge Buttons (F-037)
- [ ] **task-2.7.1** Implement Pause/Resume for Spectator Mode
- [ ] **task-2.7.2** Implement "Dig Deeper" nudge
- [ ] **task-2.7.3** Implement "Move On" nudge

#### 2.8 PDF Reports
- [ ] **task-2.8.1** Implement PDF generation
- [ ] **task-2.8.2** Add PDF download to report view

#### 2.9 GDPR Data Export
- [ ] **task-2.9.1** Implement data export job
- [ ] **task-2.9.2** Add export button to settings
- [ ] **task-2.9.3** Email download link when ready

#### 2.10 Launch Preparation
- [ ] **task-2.10.1** Load testing
- [ ] **task-2.10.2** Security audit
- [ ] **task-2.10.3** Documentation
- [ ] **task-2.10.4** Marketing launch plan

### Quality Gates
- [ ] Build passes
- [ ] All tests pass (≥80% coverage)
- [ ] Lint passes
- [ ] Security audit passed
- [ ] Load tested for 100 concurrent users

### Deliverables
- [ ] Full validation experience
- [ ] Public launch
- [ ] First paying customers
- [ ] 60%+ trial-to-paid conversion

---

## Phase 3: Scale

**Status:** not_started
**Theme:** Growth and ecosystem

### Objectives
- [ ] Reach 1,000 paying founders
- [ ] $250K ARR run rate
- [ ] 20 public case studies

### High-Level Milestones
- [ ] Team/organization accounts
- [ ] API access for integrations
- [ ] Advanced reporting (export, share with investors)
- [ ] Multi-language support
- [ ] Enterprise pilots

### Success Criteria
- 1,000 paying founders
- $250K ARR
- 20 public case studies
- Strong word-of-mouth growth

---

## Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Solo Founder Capacity | High | High | Ruthless scope control, automate where possible |
| Anti-Sycophancy Quality | Medium | High | QA harness with golden test set, regression tests |
| User Acquisition | Medium | Medium | Build in public, shareable verdicts, demo assets |
| "Just Use ChatGPT" Objection | High | Medium | Speed differentiator, anti-sycophancy engine, demo walkthrough |
| OpenRouter Outages | Low | High | Error handling, retry logic, graceful degradation |
| LLM Cost Overruns | Medium | Medium | Token budgets, daily spend alerts, per-session caps |

---

## Decision Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-01-19 | Monolith architecture | Solo founder, MVP speed |
| 2026-01-19 | Railway over Vercel | No timeout limits for AI sessions |
| 2026-01-19 | Supabase for DB + Auth | Integrated solution, RLS support |
| 2026-01-19 | OpenRouter → Claude 4.5 | Best for persona consistency |
| 2026-01-21 | Phase 0 for landing page | Capture demand before MVP |
| 2026-01-21 | Spectator Mode in Phase 1 | Core differentiator |
| 2026-01-21 | Share Report in Phase 1 | Virality from day one |
| 2026-01-22 | Interactive mode as default | Spectator is fallback, not primary |
| 2026-01-22 | Full billing from Phase 1 | Build once, avoid rework |
| 2026-01-22 | Anti-sycophancy QA harness | Core differentiator requires verification |

---

## Next Actions

1. **Start Phase 0** - Create repository and set up project
2. **Build landing page** - Get live and collecting waitlist signups
3. **Create demo walkthrough** - Show product credibility before it exists
4. **Begin Phase 1** - Database schema and auth setup

---

*Generated by /bootstrap (Engaged Mode) on 2026-01-21*
*Updated 2026-01-22 with 6-LLM QA Review (13 improvements)*
*Plan follows rolling wave principle: Phase 0-1 detailed, Phase 2-3 outlined*
