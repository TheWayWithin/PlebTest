# PlebTest Handoff Notes

> **Purpose**: Context for the next agent/session. Updated after each task completion.
> **Last Updated**: 2026-01-26 18:40 UTC
>
---

## Current State

**Phase**: 1 - Core Loop MVP
**Status**: In Progress
**Last Completed**: task-1.16.2 - Build anti-sycophancy scorecard ✅
**Next Task**: task-1.16.3 - Add prompt regression tests (P1, depends on 1.16.2 ✅)

### ✅ STAGING WORKER: RUNNING WITH HEALTH CHECKS
The staging worker is fully operational on Railway (develop branch) with:
- Health check endpoint: GET /health on port 8080
- Restart policy: ON_FAILURE (max 3 retries)
- Health check timeout: 30 seconds

### ⏳ PRODUCTION WORKER: PENDING (Pre-Launch Task)
Production worker cannot be set up until `develop` is merged to `main`.
See **PRODUCTION WORKER SETUP GUIDE** section below for complete instructions.

### ✅ Worker Health Checks (task-1.7.4)
**Implementation Complete**:
- `workers/health.ts` - HTTP server with GET /health endpoint
- `workers/index.ts` - Starts health server before pg-boss, graceful shutdown
- `railway.toml` - Restart policy (ON_FAILURE, 3 retries), health check config
- `docs/worker-operations.md` - Comprehensive operations guide

**Health Check Response**:
```json
// Healthy
{"status":"healthy","boss":"connected","timestamp":"..."}

// Unhealthy
{"status":"unhealthy","boss":"not_connected","timestamp":"..."}

// Shutting down
{"status":"shutting_down","boss":"disconnecting","timestamp":"..."}
```

### ✅ Share Report Feature (task-1.11.5)
**Implementation Complete**:
- `src/components/report/ShareReportSection.tsx` - Client component with toggle and copy link
- `src/app/api/.../report/share/route.ts` - PATCH API for is_public, hide_proposal_details
- `src/app/r/[token]/page.tsx` - Public report page (token-validated, uses admin client)
- `src/app/r/[token]/not-found.tsx` - 404 for invalid tokens
- `src/components/ui/switch.tsx` - New Switch UI component

**Features**:
- 22-character URL-safe share tokens (crypto.randomBytes)
- Option to hide proposal details in shared view
- Dark theme matching existing report page
- Copy to clipboard with visual feedback

### ✅ Rate Limiting (task-1.15.2)
**Implementation Complete**:
- `src/lib/ratelimit.ts` - 6 rate limit categories with configurable limits
- `src/middleware.ts` - Middleware-level enforcement for all API routes

**Rate Limits**:
| Category | Limit | Window | Identifier |
|----------|-------|--------|------------|
| quickfire | 10 | 1 hr | IP |
| api_auth | 100 | 1 min | User ID |
| api_anon | 20 | 1 min | IP |
| ai_auth | 30 | 1 min | User ID |
| ai_anon | 5 | 1 min | IP |
| waitlist | 3 | 1 hr | IP |

### ✅ Zod Validation Schemas (task-1.15.5)
**Implementation Complete**:
- `src/lib/validations/index.ts` - Central exports
- Schema files: idea.ts, session.ts, waitlist.ts, report.ts (+ existing proposal.ts, icp.ts, test.ts)
- `src/lib/validations/utils.ts` - Validation utilities

**Usage Pattern**:
```typescript
import { shareReportSchema, validateBody, isValidationError } from '@/lib/validations';

const validated = validateBody(shareReportSchema, body);
if (isValidationError(validated)) return validated;
// validated is now typed as ShareReportInput
```

### ✅ Anti-Sycophancy Scorecard (task-1.16.2)
**Implementation Complete**:
- `src/lib/services/anti-sycophancy-scorecard.ts` - 16KB service

**Metrics Analyzed**:
1. Objection Count - Pushback patterns detection
2. Compliment Ratio - Flags sycophantic praise (>30%)
3. Evidence Requests - Data/proof requests
4. Pricing Probes - Cost/value discussions

**Key Functions**:
```typescript
import { generateScorecard, checkAntiSycophancy } from '@/lib/services/anti-sycophancy-scorecard';

// Full scorecard
const scorecard = generateScorecard(messages, 'pragmatist');
// { metrics, results, overallPassed, antiSycophancyScore, recommendations }

// Quick check
const { passed, score } = checkAntiSycophancy(messages, 'critic');
```

**Preset Thresholds**: Different strictness levels per pushback preset
- Cheerleader: 2 objections, 35% max compliments, 3/4 pass required
- Pragmatist: 2 objections, 30% max compliments, 3/4 pass required
- Critic: 3 objections, 20% max compliments, 4/4 pass required

### ✅ Anti-Sycophancy Golden Test Set (task-1.16.1)
**Implementation Complete**:
- `src/__tests__/fixtures/anti-sycophancy.fixtures.ts` - 25KB comprehensive test set

**Test Cases**: 12 golden test cases covering:
- 3 strong idea cases (meeting scheduler, customer feedback)
- 3 weak idea cases (social fitness, AI resume, grocery planning)
- 4 terrible idea cases (blockchain food, uber for dogs, crypto tipping, AI therapist)
- 2 cross-preset variations

**Personas**: 4 fully-specified personas:
- Sarah Chen (SMB owner, high skepticism)
- Marcus Johnson (SaaS PM, medium skepticism)
- Jordan Taylor (E-com founder, low skepticism)
- Robert Williams (Enterprise IT, high skepticism)

**Expected Pushback Patterns**:
- Per-preset objection counts and types
- Anti-sycophancy score ranges by idea quality
- shouldRejectIdea flags for terrible ideas
- ObjectionTypes: feasibility, competition, adoption, cost_value, trust, timing, market_size, execution, differentiation, unit_economics, regulatory, technical

**Helper Functions**:
- `getTestCasesByQuality()` - Filter by strong/weak/terrible
- `getExpectedObjectionsForPreset()` - Get expected pushback
- `validateSignals()` - Validate extracted signals

### COMPLETED SINCE LAST HANDOFF UPDATE

**Phase 1 Progress Summary (as of 2026-01-25):**

✅ **Database & Infrastructure (1.1.x)** - COMPLETE
✅ **Authentication (1.2.x)** - Core complete (profile mgmt p1, rate limiting pending)
✅ **Quick Fire Mode (1.3.x)** - COMPLETE (landing page integration working)
✅ **Idea Management (1.4.x)** - COMPLETE (tier limits enforced)
✅ **Proposal & ICP Management (1.5.x)** - COMPLETE (all CRUD operations)
✅ **Persona Generation (1.6.x)** - COMPLETE (AI generation with Big Five traits)
⏳ **Validation Tests & Workers (1.7.x)** - 1.7.1, 1.7.2, 1.7.5, 1.7.6 complete. **1.7.3, 1.7.4 BLOCKING**
✅ **Interactive Sessions (1.8.x)** - COMPLETE (SSE streaming, completion logic)
✅ **Spectator Sessions (1.9.x)** - COMPLETE (AI-to-AI conversation, UI)
✅ **Active Test View (1.10.x)** - COMPLETE (sessions list, progress)
✅ **Reports (1.11.x)** - 1.11.1, 1.11.2, 1.11.3, 1.11.5 complete. Download (1.11.4 - P1) pending.

---

## 🚀 PRODUCTION WORKER SETUP GUIDE (Pre-Launch Task)

**When to do this**: After merging `develop` → `main` for production launch.

**Prerequisite**: The `main` branch must have the worker code (workers/, src/lib/jobs/, package.json with start:auto script).

### Step 1: Railway Dashboard Setup
1. Go to https://railway.app → PlebTest project
2. Create new "Empty Service"
3. Name it: `worker-prod`
4. Connect to GitHub: `TheWayWithin/PlebTest`
5. **Branch**: `main`

### Step 2: Environment Variables
Add these variables to the production worker:

| Variable | Value |
|----------|-------|
| `SERVICE_TYPE` | `worker` |
| `DATABASE_URL` | `postgresql://postgres.wemszisfzevffudenqzi:kab%40jyr0atf4dgv3BJD@aws-1-us-east-1.pooler.supabase.com:5432/postgres` |
| `NEXT_PUBLIC_SUPABASE_URL` | Copy from PlebTest production web service |
| `SUPABASE_SERVICE_ROLE_KEY` | Copy from PlebTest production web service |
| `OPENROUTER_API_KEY` | Copy from PlebTest production web service |
| `UPSTASH_REDIS_REST_URL` | Copy from PlebTest production web service |
| `UPSTASH_REDIS_REST_TOKEN` | Copy from PlebTest production web service |
| `NODE_ENV` | `production` |
| `NIXPACKS_NODE_VERSION` | `20` |

**⚠️ IMPORTANT**: The DATABASE_URL uses:
- **Session Pooler** (port 5432, NOT 6543)
- **Region**: `aws-1-us-east-1` (production Supabase region)
- **Password**: URL-encoded (`@` → `%40`)

### Step 3: Verify Deployment
Check deploy logs for:
```
✅ pg-boss connected
✅ All workers started successfully
👀 Waiting for jobs...

📋 Active job handlers:
   - run-test
   - generate-personas
   - run-session
   - generate-report
   - check-session-timeout (cron)
```

### Troubleshooting
- **"Tenant or user not found"**: Wrong region in DATABASE_URL
- **"Connection timeout"**: Wrong port (use 5432, not 6543)
- **"Queue not found"**: Old code without createQueue() calls - ensure main has latest worker code

---

### ✅ STAGING WORKER COMPLETE (task-1.7.3)

**Railway Service**: `worker` (on develop branch)
**Status**: Running ✅

**DATABASE_URL**:
```
postgresql://postgres.erkvlsaegregxdwfjxgv:kab%40jyr0atf4dgv3BJD@aws-1-us-east-2.pooler.supabase.com:5432/postgres
```

**Key fixes applied (2026-01-26)**:
1. Added `start:auto` script to package.json (checks SERVICE_TYPE env var)
2. Updated railway.toml to use `npm run start:auto`
3. Added explicit `createQueue()` calls for pg-boss v10+
4. Used Session Pooler (port 5432) instead of Transaction Pooler (port 6543)

**Then task-1.7.4** needs:
- Health check endpoint for worker
- Worker logs visible in Railway
- Restart policy configured

### Recent Deliverables (task-1.7.1 through task-1.11.3)

**Test Configuration UI (task-1.7.1)** ✅
- Full test config form at `/test/new`
- ICP selection, persona count, modes, pushback presets
- Tier limit enforcement

**pg-boss Background Jobs (task-1.7.2)** ✅
- `src/lib/jobs/boss.ts` - Job queue singleton
- `workers/index.ts` - Worker entrypoint
- Job types: RUN_TEST, GENERATE_PERSONAS, RUN_SESSION, GENERATE_REPORT

**Job Retry + Idempotency (task-1.7.5)** ✅
- Exponential backoff (1s, 2s, 4s)
- queueUniqueJob for idempotency
- Dead letter handling

**Test Runner Job (task-1.7.6)** ✅
- RUN_TEST → GENERATE_PERSONAS → RUN_SESSION flow
- Persona generation with admin client
- Session records created automatically

**Anti-Sycophancy Prompts (task-1.8.1)** ✅
- Pushback presets (Cheerleader/Pragmatist/Critic)
- Skepticism modifiers
- Mom Test principles embedded

**SSE Streaming (task-1.8.2)** ✅
- POST `/api/sessions/[sessionId]/stream`
- Checkpoint saves every 50 tokens
- Messages table with RLS

**Interactive Session UI (task-1.8.3)** ✅
- Chat interface with real-time streaming
- Persona panel with badges
- Session tips sidebar

**Session Completion (task-1.8.4)** ✅
- Signal extraction via Claude 3.5 Haiku
- Scoring algorithm (0-100)
- Auto-updates test status

**Spectator Mode Worker (task-1.9.1)** ✅
- AI-to-AI conversation loop
- Natural ending detection
- Messages saved for polling

**Spectator Session UI (task-1.9.2)** ✅
- Read-only view with polling
- Pause/Resume controls
- Progress indicator

**Active Test View (task-1.10.1)** ✅
- Sessions list with status icons
- Progress bar
- Generate Report button

**Risk Score Rubric (task-1.11.1)** ✅
- Weighted scoring (Need 35%, Solution 30%, Commitment 25%, Anti-sycophancy 10%)
- Verdict thresholds (Kill/Pivot/Build)
- Confidence drivers

**Report Generation (task-1.11.2)** ✅
- Aggregates session data
- Generates summaries and next steps
- Creates share_token

**View Report UI (task-1.11.3)** ✅
- Prominent verdict card
- Signals/objections columns
- Disclaimer box

### Persona Generation Service (task-1.6.1) ✅
**Implementation**: Complete persona generation with AI and Big Five traits

**Files Created**:
- `src/types/persona.ts` - TypeScript types (PersonaDemographics, PersonaPsychographics, BigFiveTraits, SkepticismLevel)
- `src/lib/services/persona-generator.ts` - Main service

**Files Modified**:
- `src/lib/openrouter.ts` - Added generic `callOpenRouter()` function

**Key Functions**:
- `generatePersonas(icpId, count)` - Main entry point
- `getPersonasForICP(icpId)` - Fetch existing
- `deletePersonasForICP(icpId)` - Clear for regeneration
- `getPersonaById(personaId)` - Single lookup

**Skepticism Distribution**: 40% high, 40% medium, 20% low
**AI Model**: openai/gpt-4o-mini (cost-effective)

**Usage Example**:
```typescript
import { generatePersonas } from '@/lib/services/persona-generator';
const personas = await generatePersonas(icpId, 5); // Generate 5 personas
```

### Delete ICP Safeguard (task-1.5.6) ✅
**Implementation**: Active test check before ICP deletion

**Files Modified**:
- `src/app/api/ideas/[ideaId]/proposals/[proposalId]/icps/[icpId]/route.ts` - Added active test check to DELETE handler
- `src/app/(protected)/ideas/[ideaId]/proposals/[proposalId]/icps/[icpId]/icp-view.tsx` - Added 409 error handling

**Features**:
- Before deletion, queries `validation_tests` for tests using this ICP
- Checks `icp_ids` array contains the ICP ID AND status is 'pending' or 'in_progress'
- Returns 409 Conflict with descriptive message if ICP is blocked
- Frontend displays error in delete confirmation dialog
- User can dismiss error and try again later

### View/Edit ICP (task-1.5.5) ✅
**Implementation**: Full ICP view page with edit dialog and delete functionality

**Files Created**:
- `src/app/api/ideas/[ideaId]/proposals/[proposalId]/icps/[icpId]/route.ts` - GET/PUT/DELETE API endpoints
- `src/components/icps/edit-icp-dialog.tsx` - Edit dialog with all ICP fields
- `src/app/(protected)/ideas/[ideaId]/proposals/[proposalId]/icps/[icpId]/page.tsx` - ICP view page
- `src/app/(protected)/ideas/[ideaId]/proposals/[proposalId]/icps/[icpId]/icp-view.tsx` - ICP view component

**Files Updated**:
- `src/app/(protected)/ideas/[ideaId]/proposals/[proposalId]/page.tsx` - Fetches ICPs and passes to ProposalView
- `src/app/(protected)/ideas/[ideaId]/proposals/[proposalId]/proposal-view.tsx` - Added ICPs section with list and badges

**Features**:
- Full ICP detail view with all fields displayed
- Behavior Profile section with Pain Intensity, Decision Role, Adoption Tendency
- Edit button opens dialog with all fields
- Delete button with confirmation dialog
- ICPs list on proposal view page with clickable cards
- Add ICP button on proposal page
- Color-coded pain intensity badges

### Create ICP (task-1.5.4) ✅
**Implementation**: Full ICP creation form with all schema fields

**Files Created**:
- `src/lib/validations/icp.ts` - Zod validation with typed enums
- `src/app/api/ideas/[ideaId]/proposals/[proposalId]/icps/route.ts` - GET/POST API endpoints
- `src/components/icps/create-icp-form.tsx` - Full form component
- `src/app/(protected)/ideas/[ideaId]/proposals/[proposalId]/icps/new/page.tsx` - New ICP page

**Features**:
- Name field (required)
- Demographics and Psychographics (text, stored as JSONB)
- Context and Current Solutions (text)
- Pain Intensity: annoying, costly, blocking
- Decision Role: decision_maker, influencer, end_user, blocker
- Adoption Tendency: early_adopter, early_majority, late_majority, laggard
- Linked to proposal via proposal_id

**Note**: ICP list display on proposal view page not yet implemented (task-1.5.5)

### Archive/Delete Proposal (task-1.5.3) ✅
**Implementation**: Archive and delete functionality with confirmation

**Files Updated**:
- `src/app/api/ideas/[ideaId]/proposals/[proposalId]/route.ts` - Added PATCH (archive/unarchive) and DELETE endpoints
- `src/app/(protected)/ideas/[ideaId]/proposals/[proposalId]/proposal-view.tsx` - Added archive/delete buttons

**Files Added**:
- `src/components/ui/alert-dialog.tsx` - shadcn AlertDialog component

**Features**:
- Archive button sets status to 'archived'
- Restore button sets status back to 'draft'
- Archived banner shown when proposal is archived
- Edit button hidden for archived proposals
- Delete button with confirmation dialog
- Redirects to idea page after deletion

### View/Edit Proposal (task-1.5.2) ✅
**Implementation**: Full proposal view with edit dialog

**Files Created**:
- `src/app/api/ideas/[ideaId]/proposals/[proposalId]/route.ts` - GET/PUT API endpoints
- `src/components/proposals/edit-proposal-dialog.tsx` - Edit dialog with all fields

**Files Updated**:
- `src/app/(protected)/ideas/[ideaId]/proposals/[proposalId]/proposal-view.tsx` - Enhanced view with all fields

**Features**:
- View all proposal fields with proper sections
- Edit button opens full edit dialog
- Status badges: Draft, Active, Validated, Invalidated, Archived
- Optimistic UI updates after edit
- Back link to idea detail page
- External URL displayed as clickable link

### Create Proposal (task-1.5.1) ✅
**Implementation**: Full proposal creation form with Zod validation

**Files Created**:
- `src/lib/validations/proposal.ts` - Zod validation schema for proposals
- `src/app/api/ideas/[ideaId]/proposals/route.ts` - GET/POST API endpoints
- `src/components/proposals/create-proposal-form.tsx` - Full form component

**Files Updated**:
- `src/app/(protected)/ideas/[ideaId]/proposals/new/page.tsx` - Replaced placeholder with real form

**Features**:
- 8 form fields: problem, solution, hypotheses, workarounds, pricing, competitors, external URL, external context
- Required fields: problem, solution (min 10 chars, max 2000)
- Help tooltips on each field
- Quick Fire context display if available
- Redirects to proposal view on success
- Field-level error display from Zod validation

### Idea Detail (task-1.4.3) ✅
**Implementation**: Complete idea detail page with edit and new proposal

**Files Created**:
- `src/app/api/ideas/[ideaId]/route.ts` - GET/PUT for single idea
- `src/components/ideas/edit-idea-dialog.tsx` - Edit modal
- `src/app/(protected)/ideas/[ideaId]/proposals/new/page.tsx` - Placeholder

**Features**:
- Edit idea name via modal dialog
- "New Proposal" button wired to /ideas/[id]/proposals/new
- Placeholder for full Create Proposal form (task-1.5.1)

### Create Idea (task-1.4.1) ✅
**Implementation**: Create Idea with tier limit enforcement

**Files Created**:
- `src/app/api/ideas/route.ts` - POST/GET endpoints with tier limits
- `src/components/ideas/create-idea-dialog.tsx` - Dialog component
- `src/app/dashboard/dashboard-client.tsx` - Client component

**Features**:
- Modal dialog for creating ideas
- Tier limit enforcement (solo=1, growth=3, scale=10, pro=20)
- Usage display ("1 of 3 ideas used")
- Redirects to idea detail page after creation
- Upgrade prompt when at limit

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
