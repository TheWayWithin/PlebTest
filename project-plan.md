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
| 0 | Landing Page | not_started |
| 1 | Core Loop MVP | not_started |
| 2 | Full MVP & Launch | not_started |
| 3 | Scale | not_started |

---

## Phase 0: Landing Page

**Status:** not_started
**Theme:** Start capturing demand before MVP exists

### Objectives
- [ ] Launch marketing presence before product is ready
- [ ] Begin building waitlist for launch
- [ ] Establish brand positioning
- [ ] Show product credibility with demo assets

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

- [ ] **task-0.2.4** Set up PostHog analytics
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

- [ ] **task-0.2.5** Define event taxonomy v1
  - Agent: developer
  - Priority: p1
  - Acceptance Criteria:
    - Documented event names + properties for:
      - `waitlist_signup`
      - `quick_fire_submitted`
      - `quick_fire_result_viewed`
    - Event naming conventions established
  - Dependencies: task-0.2.4

- [ ] **task-0.2.6** Create demo walkthrough
  - Agent: designer
  - Priority: p0
  - Acceptance Criteria:
    - 90-second video OR interactive Figma prototype
    - Shows Quick Fire → Full Validation → Verdict flow
    - Demonstrates anti-sycophancy (persona pushing back)
    - Shows Kill/Pivot/Build outcome examples
  - Dependencies: task-0.2.1

- [ ] **task-0.2.7** Create sample verdict assets
  - Agent: designer
  - Priority: p1
  - Acceptance Criteria:
    - 3 sample reports created (Kill / Pivot / Build)
    - Screenshots or mockups for landing page
    - Shows credibility before product exists
  - Dependencies: task-0.2.6

- [ ] **task-0.2.8** Create privacy policy and terms of service
  - Agent: operator
  - Priority: p0
  - Acceptance Criteria:
    - Privacy policy page (/privacy)
    - Terms of service page (/terms)
    - Cookie consent banner (if required)
    - GDPR-compliant language
  - Dependencies: task-0.2.2

#### 0.3 Launch
- [ ] **task-0.3.1** Deploy to production
  - Agent: operator
  - Priority: p0
  - Acceptance Criteria:
    - Landing page live at plebtest.com
    - SSL working
    - No console errors
    - Analytics firing
  - Dependencies: task-0.2.3, task-0.2.4, task-0.2.8

- [ ] **task-0.3.2** Announce on social channels
  - Agent: marketer
  - Priority: p1
  - Acceptance Criteria:
    - Twitter/X post with link
    - Indie Hackers post (optional)
    - Initial waitlist signups tracked
  - Dependencies: task-0.3.1

### Quality Gates
- [ ] Build passes (`npm run build`)
- [ ] Lighthouse score ≥90 (Performance)
- [ ] Mobile responsive verified
- [ ] Privacy policy and terms live

### Deliverables
- [ ] Live landing page at plebtest.com
- [ ] Working waitlist capture
- [ ] Analytics tracking active
- [ ] Demo walkthrough visible
- [ ] Privacy policy and terms published

---

## Phase 1: Core Loop MVP

**Status:** not_started
**Theme:** Core validation loop working - private testing only

### Objectives
- [ ] Quick Fire Mode as primary entry hook
- [ ] Full validation flow (Interactive + Spectator modes)
- [ ] Anti-Sycophancy Engine active and verified
- [ ] Shareable reports for virality
- [ ] Billing integration ready

### Tasks

#### 1.1 Database & Infrastructure
- [ ] **task-1.1.1** Set up Supabase projects (staging + production)
  - Agent: operator
  - Priority: p0
  - Acceptance Criteria:
    - Supabase staging project created
    - Supabase production project created
    - Connection strings documented
  - Dependencies: none

- [ ] **task-1.1.2** Initialize local Supabase for development
  - Agent: developer
  - Priority: p0
  - Acceptance Criteria:
    - `supabase init` completed
    - `supabase start` works
    - Local Postgres accessible
  - Dependencies: task-1.1.1

- [ ] **task-1.1.3** Create database schema
  - Agent: developer
  - Priority: p0
  - Acceptance Criteria:
    - All tables from architecture.md created
    - All ENUMs defined
    - Foreign keys and indexes in place
    - Migration files created
  - Dependencies: task-1.1.2

- [ ] **task-1.1.4** Implement Row Level Security policies
  - Agent: developer
  - Priority: p0
  - Acceptance Criteria:
    - RLS enabled on all tables
    - Explicit SELECT/INSERT/UPDATE/DELETE policies
    - All policies chain to user_id
    - Tested with multiple users
  - Dependencies: task-1.1.3

- [ ] **task-1.1.5** Set up Supabase clients
  - Agent: developer
  - Priority: p0
  - Acceptance Criteria:
    - Browser client (lib/supabase/client.ts)
    - Server client (lib/supabase/server.ts)
    - Admin client (lib/supabase/admin.ts)
    - TypeScript types generated
  - Dependencies: task-1.1.3

- [ ] **task-1.1.6** Configure environment variables
  - Agent: operator
  - Priority: p0
  - Acceptance Criteria:
    - All env vars from architecture.md documented
    - Staging env vars configured in Railway
    - Production env vars configured in Railway
    - Local .env.local template created
  - Dependencies: task-0.1.3, task-1.1.1

#### 1.2 Authentication
- [ ] **task-1.2.1** Configure Supabase Auth providers
  - Agent: developer
  - Priority: p0
  - Acceptance Criteria:
    - Google OAuth configured
    - GitHub OAuth configured
    - Email/Password enabled
    - Redirect URLs set for all environments
  - Dependencies: task-1.1.1

- [ ] **task-1.2.2** Implement registration flow (F-001)
  - Agent: developer
  - Priority: p0
  - Acceptance Criteria:
    - Tier selection UI
    - OAuth buttons (Google, GitHub)
    - Email/Password form
    - Terms & Privacy consent
    - Creates user record in users table
  - Dependencies: task-1.2.1, task-1.1.4

- [ ] **task-1.2.3** Implement login flow (F-002)
  - Agent: developer
  - Priority: p0
  - Acceptance Criteria:
    - OAuth login working
    - Email/Password login working
    - "Remember me" option
    - Redirect to dashboard after login
  - Dependencies: task-1.2.1

- [ ] **task-1.2.4** Implement logout (F-003)
  - Agent: developer
  - Priority: p0
  - Acceptance Criteria:
    - Logout button in header/settings
    - Clears session
    - Redirects to home
  - Dependencies: task-1.2.3

- [ ] **task-1.2.5** Implement profile management (F-004)
  - Agent: developer
  - Priority: p1
  - Acceptance Criteria:
    - View profile page
    - Edit name, email
    - Country selection
    - VAT ID field (optional)
  - Dependencies: task-1.2.3

- [ ] **task-1.2.6** Implement auth middleware
  - Agent: developer
  - Priority: p0
  - Acceptance Criteria:
    - Protected routes redirect to login
    - Session validation on each request
    - Rate limiting on auth endpoints (5/15min)
  - Dependencies: task-1.2.3

#### 1.3 Quick Fire Mode
- [ ] **task-1.3.1** Design Quick Fire UI
  - Agent: designer
  - Priority: p0
  - Acceptance Criteria:
    - Single input field ("Describe your idea in one sentence")
    - Submit button
    - Risk Score gauge display
    - Key objection display
    - "Go Deeper" CTA
  - Dependencies: task-0.2.2

- [ ] **task-1.3.2** Implement Quick Fire API endpoint
  - Agent: developer
  - Priority: p0
  - Acceptance Criteria:
    - POST /api/quick-fire
    - Input validation (10-200 chars)
    - Per-IP rate limit (10/hour via Upstash)
    - Per-fingerprint limit (20/day)
    - CAPTCHA required after 3 requests/hour from same IP
    - OpenRouter integration
    - Returns score (1-100) + key objection
    - Token budget enforced (max_tokens: 150)
    - No database writes until user signs up
  - Dependencies: task-1.1.5, task-1.15.1

- [ ] **task-1.3.3** Implement Quick Fire UI (F-029)
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

- [ ] **task-1.3.4** Implement Data Carry-Over (F-030)
  - Agent: developer
  - Priority: p0
  - Acceptance Criteria:
    - After signup, creates Idea with quick_fire_score
    - Auto-generates Proposal from one-liner (AI assist)
    - Redirects to proposal editor
  - Dependencies: task-1.3.3, task-1.2.2

#### 1.4 Idea Management
- [ ] **task-1.4.1** Implement Create Idea (F-006)
  - Agent: developer
  - Priority: p0
  - Acceptance Criteria:
    - Create idea form (name field)
    - Tier limit enforcement
    - Saves to database
    - Redirects to idea detail
  - Dependencies: task-1.1.4

- [ ] **task-1.4.2** Implement Ideas List (F-007)
  - Agent: developer
  - Priority: p0
  - Acceptance Criteria:
    - List all user's ideas
    - Shows quick_fire_score if exists
    - Links to idea detail
    - Empty state
  - Dependencies: task-1.4.1

- [ ] **task-1.4.3** Implement Idea Detail (F-008)
  - Agent: developer
  - Priority: p0
  - Acceptance Criteria:
    - Shows idea name
    - Lists all proposals
    - Create proposal button
    - Edit idea button
  - Dependencies: task-1.4.2

- [ ] **task-1.4.4** Implement Edit Idea (F-009)
  - Agent: developer
  - Priority: p1
  - Acceptance Criteria:
    - Edit idea name
    - Save changes
  - Dependencies: task-1.4.3

#### 1.5 Proposal & ICP Management
- [ ] **task-1.5.1** Implement Create Proposal (F-010)
  - Agent: developer
  - Priority: p0
  - Acceptance Criteria:
    - Form with all proposal fields (problem, solution, hypotheses, etc.)
    - Zod validation
    - Saves to database
    - Links to idea
  - Dependencies: task-1.4.3

- [ ] **task-1.5.2** Implement View/Edit Proposal (F-011, F-012)
  - Agent: developer
  - Priority: p0
  - Acceptance Criteria:
    - View proposal details
    - Edit all fields
    - Status display
    - Save changes
  - Dependencies: task-1.5.1

- [ ] **task-1.5.3** Implement Archive/Delete Proposal (F-013)
  - Agent: developer
  - Priority: p1
  - Acceptance Criteria:
    - Archive button (soft delete)
    - Delete button with confirmation
  - Dependencies: task-1.5.2

- [ ] **task-1.5.4** Implement Create ICP (F-014)
  - Agent: developer
  - Priority: p0
  - Acceptance Criteria:
    - ICP creation form
    - All fields from schema (demographics, psychographics, etc.)
    - Links to proposal
  - Dependencies: task-1.5.1

- [ ] **task-1.5.5** Implement View/Edit ICP (F-015, F-016)
  - Agent: developer
  - Priority: p0
  - Acceptance Criteria:
    - View ICP details
    - Edit all fields
    - Save changes
  - Dependencies: task-1.5.4

- [ ] **task-1.5.6** Implement Delete ICP (F-017)
  - Agent: developer
  - Priority: p1
  - Acceptance Criteria:
    - Delete button with confirmation
    - Cannot delete if used in active test
  - Dependencies: task-1.5.5

#### 1.6 Persona Generation
- [ ] **task-1.6.1** Implement persona generation service
  - Agent: developer
  - Priority: p0
  - Acceptance Criteria:
    - Takes ICP as input
    - Generates N personas with trait variations
    - Big Five personality traits assigned
    - Skepticism level distribution (40% high, 40% medium, 20% low)
    - Saves to personas table
  - Dependencies: task-1.5.4

#### 1.7 Validation Tests & Workers
- [ ] **task-1.7.1** Implement test configuration UI (F-018)
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

- [ ] **task-1.7.2** Set up pg-boss for background jobs
  - Agent: developer
  - Priority: p0
  - Acceptance Criteria:
    - pg-boss initialized
    - Worker process configured
    - Job types defined
  - Dependencies: task-1.1.3

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

- [ ] **task-1.7.5** Implement job retry policy + dead letter handling + idempotency
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

- [ ] **task-1.7.6** Implement test runner job
  - Agent: developer
  - Priority: p0
  - Acceptance Criteria:
    - Creates validation_test record
    - Generates personas from ICPs
    - Creates session records
    - Updates test status
  - Dependencies: task-1.7.1, task-1.7.2

#### 1.8 Interactive Sessions
- [ ] **task-1.8.1** Build Anti-Sycophancy prompt system
  - Agent: developer
  - Priority: p0
  - Acceptance Criteria:
    - Pushback preset prompts (Cheerleader/Pragmatist/Critic)
    - Skepticism level modifiers
    - Mom Test principles embedded
    - Minimum objections enforcement (≥2)
  - Dependencies: task-1.6.1

- [ ] **task-1.8.2** Implement SSE streaming endpoint
  - Agent: developer
  - Priority: p0
  - Acceptance Criteria:
    - POST /api/sessions/[id]/stream
    - Streams tokens from OpenRouter
    - Saves complete messages to database
    - Handles disconnect gracefully (partial save)
    - Checkpoint saves every 50 tokens
  - Dependencies: task-1.7.6, task-1.8.1

- [ ] **task-1.8.3** Implement Interactive Session UI (F-020)
  - Agent: developer
  - Priority: p0
  - Acceptance Criteria:
    - Chat interface
    - Real-time token streaming
    - Persona info display
    - Message history
    - End session button
  - Dependencies: task-1.8.2

- [ ] **task-1.8.4** Implement session completion logic
  - Agent: developer
  - Priority: p0
  - Acceptance Criteria:
    - Marks session complete
    - Extracts key_objections
    - Calculates need_validated, solution_resonated
    - Tracks anti_sycophancy_triggers
  - Dependencies: task-1.8.3

#### 1.9 Spectator Sessions
- [ ] **task-1.9.1** Implement Spectator Mode worker
  - Agent: developer
  - Priority: p0
  - Acceptance Criteria:
    - AI Interviewer asks questions
    - AI Persona responds
    - Conversation streamed to UI
    - Session auto-progresses
  - Dependencies: task-1.7.6, task-1.8.1

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
- [ ] **task-1.15.1** Set up Upstash Redis
  - Agent: operator
  - Priority: p0
  - Acceptance Criteria:
    - Upstash account created
    - Redis instance provisioned
    - Credentials in Railway env vars
  - Dependencies: none

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
