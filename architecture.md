# PlebTest Architecture

> **Generated:** 2026-01-19
> **Updated:** 2026-01-22 (6-LLM QA Review Round 2)
> **Mode:** Engaged (8 interactive decisions)
> **Status:** Ready for Implementation
> **QA Score:** 8.5/10 → 9.5/10 → 9.8/10 (24 improvements from 6-LLM consensus)

---

## Executive Summary

PlebTest is an AI-powered idea validation platform for founders who avoid cold calls. The architecture prioritizes:

- **Solo founder maintainability** - One person can understand and operate everything
- **Speed to MVP** - Launch February 2026
- **Build for growth** - Patterns that scale without rewrite

### Technology Stack

| Layer | Technology | Why |
|-------|------------|-----|
| Frontend | Next.js 15 (App Router) | Modern React, SSR, Turbopack |
| Styling | Tailwind CSS + shadcn/ui | Fast iteration, accessible components |
| Backend | Next.js API Routes + pg-boss | Unified codebase, reliable job processing |
| Database | Supabase (PostgreSQL) | Managed Postgres, RLS, Realtime |
| Auth | Supabase Auth | Integrated with database, OAuth support |
| LLM | OpenRouter → Claude 4.5 Sonnet | Best for persona consistency, reduced hallucinations |
| Payments | Stripe | Industry standard |
| Email | Resend | Simple API, great DX |
| Analytics | PostHog | Product analytics + session replay |
| Error Tracking | Sentry | Frontend + backend error capture |
| Rate Limiting | Upstash Redis | Distributed, survives restarts |
| Hosting | Railway | No timeouts, horizontal scaling |
| Web Scraping | Jina AI Reader | Free tier, handles JS rendering |

---

## System Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            PLEBTEST ARCHITECTURE                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│    Users (Browsers)                                                         │
│          │                                                                  │
│          ▼                                                                  │
│    ┌─────────────────────────────────────────────────────────┐              │
│    │                    Railway                              │              │
│    │  ┌───────────────────────────────────────────────────┐  │              │
│    │  │              Next.js 15 Application               │  │              │
│    │  │                                                   │  │              │
│    │  │  ┌─────────────┐  ┌─────────────┐  ┌───────────┐  │  │              │
│    │  │  │   Pages     │  │ API Routes  │  │  pg-boss  │  │  │              │
│    │  │  │  (React +   │  │  (Business  │  │  Workers  │  │  │              │
│    │  │  │  shadcn/ui) │  │   Logic)    │  │           │  │  │              │
│    │  │  └─────────────┘  └─────────────┘  └───────────┘  │  │              │
│    │  └───────────────────────────────────────────────────┘  │              │
│    └─────────────────────────────────────────────────────────┘              │
│          │                                                                  │
│          ├──────────────┬──────────────┬──────────────┬────────────────┐    │
│          ▼              ▼              ▼              ▼                ▼    │
│    ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│    │ Supabase │  │OpenRouter│  │  Stripe  │  │  Resend  │  │ Upstash  │    │
│    │          │  │          │  │          │  │          │  │  Redis   │    │
│    │ - Auth   │  │ - Claude │  │ - Billing│  │ - Email  │  │ - Rate   │    │
│    │ - Postgres│ │   4.5    │  │ - Webhooks│ │          │  │   Limits │    │
│    │ - Realtime│ │ - Sonnet │  │          │  │          │  │          │    │
│    └──────────┘  └──────────┘  └──────────┘  └──────────┘  └──────────┘    │
│                                                                             │
│    ┌──────────┐  ┌──────────┐  ┌──────────┐                                 │
│    │  Sentry  │  │ PostHog  │  │ Jina AI  │                                 │
│    │ - Errors │  │-Analytics│  │ - Scrape │                                 │
│    └──────────┘  └──────────┘  └──────────┘                                 │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Infrastructure Architecture

### Environments

| Environment | Branch | Railway Service | Supabase Project | Domain |
|-------------|--------|-----------------|------------------|--------|
| Development | local | Local dev server | **Local Supabase** (`supabase start`) | localhost:3000 |
| Staging | `develop` | plebtest-staging | plebtest-staging | staging.plebtest.com |
| Production | `main` | plebtest-production | plebtest-production | plebtest.com |

> **Note:** Development uses local Supabase (via Docker) to prevent pollution of staging data. Run `supabase start` to spin up local Postgres, Auth, and API. This is free, fully isolated, and can be reset anytime with `supabase db reset`.

### Railway Process Model

Railway runs two separate processes from the same codebase:

| Service | Command | Purpose |
|---------|---------|---------|
| **web** | `npm run start` | Next.js application (pages + API routes) |
| **worker** | `npm run worker` | pg-boss job processing + cron schedules |

```json
// package.json scripts
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "worker": "tsx workers/index.ts"
  }
}
```

Both services connect to the same Supabase database. Workers are scaled independently (start with 1 worker instance for MVP).

### Deployment Flow

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   develop   │ ───► │   Staging   │      │             │
│   branch    │      │  (Railway)  │      │             │
└─────────────┘      └─────────────┘      │             │
                                          │  Production │
┌─────────────┐      ┌─────────────┐      │  (Railway)  │
│    main     │ ───► │   Merge PR  │ ───► │             │
│   branch    │      │             │      │             │
└─────────────┘      └─────────────┘      └─────────────┘
```

**CI/CD:** Railway auto-deploy from GitHub (no GitHub Actions needed for MVP)

### Domain Configuration

| Domain | Target | SSL |
|--------|--------|-----|
| plebtest.com | Railway Production | Auto (Railway) |
| staging.plebtest.com | Railway Staging | Auto (Railway) |

---

## Application Architecture

### Pattern: Monolith

Single Next.js application containing:
- React pages with Server Components
- API routes for business logic
- pg-boss workers for background jobs

**Rationale:** Solo founder, MVP timeline, maintainability. Can extract services later if needed.

### Directory Structure

```
plebtest/
├── app/                          # Next.js App Router
│   ├── (public)/                 # Public routes (no auth)
│   │   ├── page.tsx              # Landing page
│   │   ├── pricing/
│   │   ├── login/
│   │   ├── register/
│   │   └── r/[token]/            # Public shared reports (token-gated)
│   │
│   ├── (authenticated)/          # Protected routes
│   │   ├── dashboard/
│   │   ├── onboarding/
│   │   ├── quick-fire/
│   │   ├── ideas/
│   │   │   ├── page.tsx          # Ideas list
│   │   │   └── [id]/
│   │   │       ├── page.tsx      # Idea detail
│   │   │       └── icps/
│   │   ├── proposals/
│   │   │   └── [id]/
│   │   │       ├── page.tsx      # Proposal editor
│   │   │       ├── assumptions/
│   │   │       ├── test/
│   │   │       └── history/
│   │   ├── tests/[id]/
│   │   ├── sessions/[id]/
│   │   ├── reports/[id]/
│   │   └── settings/
│   │       ├── page.tsx
│   │       ├── billing/
│   │       └── referrals/
│   │
│   ├── api/                      # API routes
│   │   ├── auth/
│   │   ├── ideas/
│   │   ├── proposals/
│   │   ├── icps/
│   │   ├── tests/
│   │   ├── sessions/
│   │   │   └── [id]/
│   │   │       └── stream/       # SSE streaming endpoint
│   │   ├── reports/
│   │   │   └── [token]/          # Public report access (validated)
│   │   ├── quick-fire/
│   │   ├── billing/
│   │   ├── user/
│   │   │   └── export/           # GDPR data export
│   │   └── webhooks/
│   │       └── stripe/
│   │
│   ├── layout.tsx
│   └── globals.css
│
├── components/
│   ├── ui/                       # shadcn/ui components
│   └── features/                 # Feature-specific components
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts             # Browser client
│   │   ├── server.ts             # Server client
│   │   └── admin.ts              # Service role client
│   ├── stripe/
│   ├── openrouter/
│   ├── resend/
│   ├── jina/                     # Web scraping client
│   ├── anti-sycophancy/          # Prompt engineering for pushback
│   ├── tier-limits/              # Usage enforcement
│   ├── jobs/                     # pg-boss job definitions
│   └── utils/
│
├── schemas/                      # Zod validation schemas
│
├── types/                        # TypeScript types
│
└── workers/                      # pg-boss worker processes
    ├── index.ts                  # Worker entrypoint
    ├── session-runner.ts         # Runs AI sessions
    ├── report-generator.ts       # Generates reports
    ├── data-export.ts            # GDPR exports
    └── notifications.ts          # Email notifications
```

---

## Quick Fire Mode Flow

Quick Fire is the primary onboarding hook. **Target: Risk Score in ≤60 seconds.**

```
┌─────────────────────────────────────────────────────────────────┐
│  QUICK FIRE FLOW (No auth required for steps 1-3)               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. Landing Page                                                │
│     └─► "Describe your idea in one sentence" input              │
│                                                                 │
│  2. Submit (no login)                                           │
│     └─► POST /api/quick-fire                                    │
│     └─► Call OpenRouter with quick evaluation prompt            │
│     └─► Return Risk Score (1-100) + Key Objection               │
│                                                                 │
│  3. Show Results                                                │
│     └─► Risk Score gauge                                        │
│     └─► Primary objection                                       │
│     └─► CTA: "Go Deeper" (requires signup)                      │
│                                                                 │
│  4. Signup (if "Go Deeper")                                     │
│     └─► Create account                                          │
│     └─► Create Idea with quick_fire_score + quick_fire_objection│
│     └─► Auto-generate Proposal from one-liner (AI assist)       │
│     └─► Redirect to full validation flow                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Performance Target:**
- Steps 1-3 must complete in ≤60 seconds
- OpenRouter call should use optimized prompt (not full persona simulation)
- No database writes until user signs up (stateless until conversion)

### Quick Fire Abuse Controls

Since Quick Fire is a public endpoint calling a paid API, abuse controls are critical:

| Control | Implementation |
|---------|----------------|
| **Per-IP rate limit** | 10 requests/hour via Upstash |
| **Per-fingerprint limit** | 20 requests/day (browser fingerprint hash) |
| **CAPTCHA threshold** | Show hCaptcha after 3 requests/hour from same IP |
| **Token budget** | `max_tokens: 150` — enough for score + one objection |
| **Prompt budget** | System prompt ≤500 tokens, user input ≤200 chars |
| **Input validation** | Reject <10 chars or >200 chars, block obvious spam patterns |

```typescript
// app/api/quick-fire/route.ts
export async function POST(request: Request) {
  // 1. Rate limit check (IP + fingerprint)
  const ip = request.headers.get('x-forwarded-for') ?? 'unknown';
  const fingerprint = request.headers.get('x-fingerprint') ?? ip;
  
  const ipLimit = await rateLimit(request, 'quick-fire-ip', ip);
  if (!ipLimit.success) {
    return Response.json({ error: 'rate_limit', captcha_required: true }, { status: 429 });
  }
  
  // 2. Input validation
  const { idea } = await request.json();
  if (!idea || idea.length < 10 || idea.length > 200) {
    return Response.json({ error: 'invalid_input' }, { status: 400 });
  }
  
  // 3. Call OpenRouter with strict token budget
  const response = await chat([
    { role: 'system', content: QUICK_FIRE_PROMPT }, // ≤500 tokens
    { role: 'user', content: idea }
  ], { maxTokens: 150 }); // Hard cap
  
  // ... return score + objection
}
```

---

## Interactive Session Transport (SSE Streaming)

All interactive sessions use Server-Sent Events (SSE) for real-time AI response streaming:

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   Browser   │         │  Next.js    │         │ OpenRouter  │
└──────┬──────┘         └──────┬──────┘         └──────┬──────┘
       │                       │                       │
       │ 1. POST message       │                       │
       │──────────────────────►│                       │
       │                       │ 2. Save user msg      │
       │                       │    to DB              │
       │                       │                       │
       │ 3. Open SSE stream    │                       │
       │──────────────────────►│                       │
       │                       │ 4. Call OpenRouter    │
       │                       │    stream: true       │
       │                       │──────────────────────►│
       │                       │                       │
       │                       │◄─ 5. Token stream ────│
       │◄─ 6. Stream tokens ───│                       │
       │    (real-time)        │                       │
       │                       │                       │
       │◄─ 7. Complete ────────│ 8. Save AI msg to DB  │
       │                       │                       │
```

**Implementation:**

```typescript
// app/api/sessions/[id]/stream/route.ts
export async function POST(request: Request) {
  // ... auth, validation ...
  
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      // Call OpenRouter with streaming
      const response = await fetch(OPENROUTER_URL, {
        method: 'POST',
        headers: { /* ... */ },
        body: JSON.stringify({
          model: 'anthropic/claude-4.5-sonnet',
          messages: conversation,
          stream: true,
        }),
      });

      const reader = response.body?.getReader();
      let fullResponse = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        // Parse SSE chunks from OpenRouter
        const chunk = new TextDecoder().decode(value);
        const content = parseSSEChunk(chunk);
        fullResponse += content;
        
        // Forward to browser
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
      }

      // Save complete message to DB
      await saveMessage(sessionId, 'assistant', fullResponse);
      controller.enqueue(encoder.encode('data: [DONE]\n\n'));
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
```

**Why SSE over Supabase Realtime:**
- Real-time token streaming (like ChatGPT) — better UX
- Users see progress immediately, not 10-second wait
- Works for both Interactive and Spectator modes

### Disconnect Handling & Partial Save Strategy

If a connection drops mid-stream, we need to avoid data loss:

```typescript
// Enhanced stream handler with disconnect handling
async start(controller) {
  const abortController = new AbortController();
  let fullResponse = '';
  let lastSavePoint = '';
  
  // Handle client disconnect
  request.signal.addEventListener('abort', async () => {
    // Save partial response if we have content
    if (fullResponse.length > lastSavePoint.length) {
      await saveMessage(sessionId, 'assistant', fullResponse, { partial: true });
    }
    abortController.abort();
  });
  
  try {
    const response = await fetch(OPENROUTER_URL, {
      // ... config
      signal: abortController.signal,
    });
    
    const reader = response.body?.getReader();
    let tokenCount = 0;
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      const content = parseSSEChunk(new TextDecoder().decode(value));
      fullResponse += content;
      tokenCount++;
      
      // Checkpoint save every 50 tokens
      if (tokenCount % 50 === 0) {
        await savePartialResponse(sessionId, fullResponse);
        lastSavePoint = fullResponse;
      }
      
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
    }
    
    // Final save (marks as complete, removes partial flag)
    await saveMessage(sessionId, 'assistant', fullResponse, { partial: false });
    
  } catch (error) {
    if (error.name === 'AbortError') {
      // Client disconnected — partial already saved above
      return;
    }
    throw error;
  }
}
```

**Retry Prevention:** Use `session_id + message_index` as idempotency key to prevent double-writes on reconnect.

---

## Anti-Sycophancy Implementation

The Anti-Sycophancy Engine is PlebTest's core differentiator. It ensures AI personas challenge ideas rather than confirm them.

### Pushback Presets

| Preset | Behavior | System Prompt Modifier |
|--------|----------|------------------------|
| **Cheerleader** | Supportive but honest | "Be encouraging but still voice concerns. Find silver linings, but don't hide problems." |
| **Pragmatist** | Balanced skepticism | "Challenge claims with 'show me the evidence.' Ask about specifics. Be fair but not easy." |
| **Critic** | Deep skepticism | "You are deeply skeptical. Challenge every claim. Ask 'why would anyone pay for this?' Find at least 3 objections before showing interest." |

### Skepticism Level Modifiers

Applied on top of pushback preset:

| Level | Distribution | Prompt Addition |
|-------|--------------|-----------------|
| **Low** | 20% of personas | "You're open to new ideas and give benefit of the doubt." |
| **Medium** | 40% of personas | "You need convincing. Ask probing questions before committing." |
| **High** | 40% of personas | "Express doubt early. Use phrases like 'I'm not convinced...' and 'That sounds like what everyone says...'" |

**Default:** Skeptic-Heavy distribution (40% High / 40% Medium / 20% Low)

### Quality Thresholds

Track `anti_sycophancy_triggers` in the sessions table:

| Metric | Target | How to Measure |
|--------|--------|----------------|
| Objections per session | ≥2 | Count objection patterns in AI responses |
| "Too easy" flag rate | <10% | User feedback after session |
| Flip rate | >30% | Sessions where user changed position |

**Minimum Objections Rule:** Session runner enforces `min_objections: 2` — if AI response contains <2 objections, prompt is re-run with "You haven't challenged this enough. What are you skeptical about?" This prevents sycophantic "happy path" conversations.

### Implementation

```typescript
// lib/anti-sycophancy/prompts.ts
export function buildPersonaPrompt(
  persona: Persona,
  pushbackPreset: PushbackPreset,
  skepticismLevel: SkepticismLevel
): string {
  const basePrompt = `You are ${persona.name}, a ${persona.demographics.role}.
Your personality: ${JSON.stringify(persona.psychographics)}
Big Five traits: O:${persona.openness} C:${persona.conscientiousness} E:${persona.extraversion} A:${persona.agreeableness} N:${persona.neuroticism}`;

  const presetPrompt = PUSHBACK_PROMPTS[pushbackPreset];
  const skepticismPrompt = SKEPTICISM_PROMPTS[skepticismLevel];

  return `${basePrompt}

${presetPrompt}

${skepticismPrompt}

CRITICAL RULES:
- Never say "that's a great idea" without first raising concerns
- Ask "who specifically would pay for this?" early in conversation
- Challenge vague claims with "can you give me a specific example?"
- If the founder gets defensive, probe deeper
- Your job is to help them find weaknesses, not feel good`;
}
```

---

## Spectator Mode & Nudge Buttons

In Spectator Mode, users watch an AI Interviewer conduct the validation interview with AI Personas. Users can intervene without typing.

### Spectator Mode Flow

```
┌─────────────────────────────────────────────────────────────────┐
│  SPECTATOR MODE FLOW                                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. User starts Spectator Mode test                             │
│     └─► validation_mode = 'spectator'                           │
│     └─► Background job queued via pg-boss                       │
│                                                                 │
│  2. Worker runs sessions                                        │
│     └─► AI Interviewer asks Mom Test questions                  │
│     └─► AI Persona responds                                     │
│     └─► Each exchange saved to sessions.conversation            │
│     └─► SSE streams updates to browser                          │
│                                                                 │
│  3. User can intervene via Nudge Buttons                        │
│     └─► "Pause" → Worker pauses, waits for resume               │
│     └─► "Dig Deeper" → Worker injects follow-up prompt          │
│     └─► "Move On" → Worker skips to next topic/persona          │
│                                                                 │
│  4. Session completes → Report generated                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Nudge Button Implementation

```typescript
// Nudge buttons trigger updates to session state
// Worker checks for nudges between conversation turns

interface NudgeState {
  type: 'pause' | 'dig_deeper' | 'move_on' | null;
  triggered_at: string;
}

// Worker loop checks for nudges
async function runSpectatorSession(sessionId: string) {
  while (!sessionComplete) {
    // Check for nudge
    const { data: session } = await supabase
      .from('sessions')
      .select('nudge_state')
      .eq('id', sessionId)
      .single();
    
    if (session.nudge_state?.type === 'pause') {
      await waitForResume(sessionId);
    } else if (session.nudge_state?.type === 'dig_deeper') {
      await injectFollowUp(sessionId, 'Can you elaborate on that objection?');
      await clearNudge(sessionId);
    } else if (session.nudge_state?.type === 'move_on') {
      break; // Exit current topic
    }
    
    // Continue conversation...
  }
}
```

---

## Data Architecture

### Database: Supabase PostgreSQL

**Security:** Row Level Security (RLS) enabled on all tables. Users can only access their own data.

### Entity Relationship Diagram

```
┌─────────────┐
│    User     │
└──────┬──────┘
       │ 1:N
       ▼
┌─────────────┐
│    Idea     │
└──────┬──────┘
       │ 1:N
       ▼
┌─────────────┐       ┌─────────────┐
│  Proposal   │◄──────│  Iteration  │
└──────┬──────┘  1:N  └─────────────┘
       │
       ├─────────────────────────────┐
       │ 1:N                    1:N  │
       ▼                             ▼
┌─────────────┐               ┌─────────────┐
│ Assumption  │               │     ICP     │
└─────────────┘               └──────┬──────┘
                                     │ 1:N
                                     ▼
                              ┌─────────────┐
                              │   Persona   │
                              └─────────────┘
       │
       │ 1:N
       ▼
┌─────────────┐
│Validation   │
│   Test      │
└──────┬──────┘
       │
       ├─────────────────────────────┐
       │ 1:N                    1:1  │
       ▼                             ▼
┌─────────────┐               ┌─────────────┐
│   Session   │               │   Report    │
└─────────────┘               └─────────────┘
```

### Schema Definition

```sql
-- =================================================================
-- ENUMS (snake_case for code compatibility)
-- =================================================================

CREATE TYPE subscription_tier AS ENUM ('solo', 'growth', 'scale', 'pro');

CREATE TYPE proposal_status AS ENUM (
  'draft', 'submitted', 'testing', 'tested', 'cancelled', 'archived'
);

CREATE TYPE validation_test_status AS ENUM (
  'pending', 'in_progress', 'completed', 'cancelled', 'failed'
);

CREATE TYPE session_status AS ENUM (
  'pending', 'active', 'completed', 'abandoned', 'expired'
);

CREATE TYPE session_mode AS ENUM ('interactive', 'spectator');

CREATE TYPE test_mode AS ENUM ('quick', 'standard', 'deep');

CREATE TYPE validation_mode AS ENUM ('interactive', 'spectator', 'pre_mortem');

CREATE TYPE pushback_preset AS ENUM ('cheerleader', 'pragmatist', 'critic');

CREATE TYPE verdict AS ENUM ('kill', 'pivot', 'build');

CREATE TYPE confidence_level AS ENUM ('high', 'medium', 'low');

CREATE TYPE subscription_status AS ENUM (
  'trial', 'active', 'past_due', 'cancelled', 'expired'
);

CREATE TYPE report_status AS ENUM ('generating', 'ready', 'public', 'archived');

CREATE TYPE pain_intensity AS ENUM ('annoying', 'costly', 'blocking');

CREATE TYPE decision_role AS ENUM ('decision_maker', 'influencer', 'end_user', 'blocker');

CREATE TYPE adoption_tendency AS ENUM ('early_adopter', 'early_majority', 'late_majority', 'laggard');

CREATE TYPE skepticism_level AS ENUM ('low', 'medium', 'high');

CREATE TYPE assumption_action AS ENUM ('validate', 'pivot', 'kill', 'explore');

-- =================================================================
-- TABLES
-- =================================================================

-- Users (extends Supabase auth.users)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT,
  country TEXT,
  subscription_tier subscription_tier DEFAULT 'solo',
  subscription_status subscription_status DEFAULT 'trial',
  stripe_customer_id TEXT,
  vat_id TEXT,
  trial_ends_at TIMESTAMPTZ,
  billing_cycle_anchor TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ideas
CREATE TABLE ideas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  quick_fire_score INTEGER,
  quick_fire_objection TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Proposals
CREATE TABLE proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id UUID NOT NULL REFERENCES ideas(id) ON DELETE CASCADE,
  status proposal_status DEFAULT 'draft',
  problem TEXT,
  current_workarounds TEXT,
  solution TEXT,
  hypotheses TEXT,
  pricing_assumption TEXT,
  competitors TEXT,
  external_context TEXT,
  external_source_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Assumptions
CREATE TABLE assumptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id UUID NOT NULL REFERENCES proposals(id) ON DELETE CASCADE,
  statement TEXT NOT NULL,
  priority INTEGER CHECK (priority >= 1 AND priority <= 5),
  confidence_score DECIMAL(5,2) CHECK (confidence_score >= 0 AND confidence_score <= 100),
  evidence_level INTEGER CHECK (evidence_level >= 1 AND evidence_level <= 4), -- Evidence Ladder: 1=Objections, 2=Workflows, 3=Budget, 4=Pricing
  evidence_for JSONB,
  evidence_against JSONB,
  recommended_action assumption_action,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ICPs (Ideal Customer Profiles)
CREATE TABLE icps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id UUID NOT NULL REFERENCES proposals(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  demographics JSONB,  -- Structured for filtering/prompts
  psychographics JSONB, -- Structured for filtering/prompts
  context TEXT,
  pain_intensity pain_intensity,
  current_solutions TEXT,
  decision_role decision_role,
  adoption_tendency adoption_tendency,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Personas (generated from ICPs)
CREATE TABLE personas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  icp_id UUID NOT NULL REFERENCES icps(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  demographics JSONB,
  psychographics JSONB,
  openness INTEGER CHECK (openness >= 1 AND openness <= 100),
  conscientiousness INTEGER CHECK (conscientiousness >= 1 AND conscientiousness <= 100),
  extraversion INTEGER CHECK (extraversion >= 1 AND extraversion <= 100),
  agreeableness INTEGER CHECK (agreeableness >= 1 AND agreeableness <= 100),
  neuroticism INTEGER CHECK (neuroticism >= 1 AND neuroticism <= 100),
  skepticism_level skepticism_level,
  generated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Validation Tests
CREATE TABLE validation_tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id UUID NOT NULL REFERENCES proposals(id) ON DELETE CASCADE,
  parent_test_id UUID REFERENCES validation_tests(id),
  version INTEGER DEFAULT 1,
  test_mode test_mode DEFAULT 'standard',
  validation_mode validation_mode DEFAULT 'interactive',
  pushback_preset pushback_preset DEFAULT 'pragmatist',
  icp_ids UUID[] NOT NULL,
  persona_count INTEGER NOT NULL,
  status validation_test_status DEFAULT 'pending',
  report_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
);

-- Sessions
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  validation_test_id UUID NOT NULL REFERENCES validation_tests(id) ON DELETE CASCADE,
  persona_id UUID NOT NULL REFERENCES personas(id),
  status session_status DEFAULT 'pending',
  mode session_mode DEFAULT 'interactive',
  conversation JSONB DEFAULT '[]',
  message_count INTEGER DEFAULT 0,
  user_message_count INTEGER DEFAULT 0,
  nudge_count INTEGER DEFAULT 0,
  avg_response_time_seconds INTEGER,
  need_validated BOOLEAN,
  solution_resonated BOOLEAN,
  key_objections JSONB,
  anti_sycophancy_triggers INTEGER DEFAULT 0,
  score DECIMAL(5,2),
  prompt_tokens INTEGER,      -- Cost tracking
  completion_tokens INTEGER,  -- Cost tracking
  llm_model_version TEXT,
  prompt_version TEXT,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  last_activity_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reports
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  validation_test_id UUID NOT NULL REFERENCES validation_tests(id) ON DELETE CASCADE,
  status report_status DEFAULT 'generating',
  verdict verdict,
  confidence_level confidence_level, -- Renamed from confidence_score for clarity
  need_validation_summary TEXT,
  solution_validation_summary TEXT,
  assumption_board JSONB,
  reality_check_plan JSONB,
  strongest_signals JSONB,
  key_objections JSONB,
  risk_factors JSONB,
  next_steps JSONB,
  pivot_suggestions TEXT,
  pre_mortem_findings JSONB,
  share_token TEXT UNIQUE,
  is_public BOOLEAN DEFAULT FALSE,
  hide_proposal_details BOOLEAN DEFAULT FALSE,
  share_expires_at TIMESTAMPTZ,
  user_rating INTEGER CHECK (user_rating >= 1 AND user_rating <= 5),
  generation_version TEXT,
  generated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add foreign key from validation_tests to reports
ALTER TABLE validation_tests
  ADD CONSTRAINT fk_report
  FOREIGN KEY (report_id) REFERENCES reports(id);

-- Iterations
CREATE TABLE iterations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id UUID NOT NULL REFERENCES proposals(id) ON DELETE CASCADE,
  iteration_number INTEGER NOT NULL,
  changes_summary TEXT,
  previous_verdict verdict,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT max_iterations CHECK (iteration_number <= 10)
);

-- =================================================================
-- PRODUCTION READINESS TABLES
-- =================================================================

-- Webhook Events (idempotency)
CREATE TABLE webhook_events (
  id TEXT PRIMARY KEY,  -- Stripe event ID
  event_type TEXT NOT NULL,
  status TEXT DEFAULT 'processing',
  processed_at TIMESTAMPTZ,
  error TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Usage Tracking (tier limits)
CREATE TABLE usage_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  billing_period_start TIMESTAMPTZ NOT NULL,
  billing_period_end TIMESTAMPTZ NOT NULL,
  tests_used INTEGER DEFAULT 0,
  ideas_count INTEGER DEFAULT 0,

  UNIQUE(user_id, billing_period_start)
);

-- =================================================================
-- ROW LEVEL SECURITY (Explicit policies per operation)
-- =================================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE assumptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE icps ENABLE ROW LEVEL SECURITY;
ALTER TABLE personas ENABLE ROW LEVEL SECURITY;
ALTER TABLE validation_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE iterations ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_tracking ENABLE ROW LEVEL SECURITY;

-- Users: explicit policies
CREATE POLICY "Users can select own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Ideas: explicit policies for each operation
CREATE POLICY "Users can select own ideas" ON ideas
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own ideas" ON ideas
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own ideas" ON ideas
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own ideas" ON ideas
  FOR DELETE USING (auth.uid() = user_id);

-- Proposals: through idea ownership
CREATE POLICY "Users can select proposals through ideas" ON proposals
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM ideas
      WHERE ideas.id = proposals.idea_id
      AND ideas.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert proposals through ideas" ON proposals
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM ideas
      WHERE ideas.id = proposals.idea_id
      AND ideas.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update proposals through ideas" ON proposals
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM ideas
      WHERE ideas.id = proposals.idea_id
      AND ideas.user_id = auth.uid()
    )
  ) WITH CHECK (
    EXISTS (
      SELECT 1 FROM ideas
      WHERE ideas.id = proposals.idea_id
      AND ideas.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete proposals through ideas" ON proposals
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM ideas
      WHERE ideas.id = proposals.idea_id
      AND ideas.user_id = auth.uid()
    )
  );

-- Similar pattern for all other tables...
-- (Each table needs SELECT, INSERT, UPDATE, DELETE policies)

-- ⚠️ IMPLEMENTATION TASK: Complete RLS policies for ALL tables before any UI work:
-- - assumptions (via proposal → idea → user)
-- - icps (via proposal → idea → user)
-- - personas (via icp → proposal → idea → user)
-- - validation_tests (via proposal → idea → user)
-- - sessions (via validation_test → proposal → idea → user)
-- - reports (owner access via validation_test chain; public via server route)
-- - iterations (via proposal → idea → user)
-- - usage_tracking (direct user_id)
-- This is a common slip point — policies must be complete before launch.

-- Reports: NO permissive public policy
-- Public reports accessed via server route that validates token
-- See "Public Report Sharing" section below

-- =================================================================
-- INDEXES
-- =================================================================

CREATE INDEX idx_ideas_user_id ON ideas(user_id);
CREATE INDEX idx_proposals_idea_id ON proposals(idea_id);
CREATE INDEX idx_proposals_status ON proposals(status);
CREATE INDEX idx_validation_tests_proposal_id ON validation_tests(proposal_id);
CREATE INDEX idx_validation_tests_status ON validation_tests(status);
CREATE INDEX idx_sessions_validation_test_id ON sessions(validation_test_id);
CREATE INDEX idx_sessions_status ON sessions(status);
CREATE INDEX idx_sessions_last_activity ON sessions(last_activity_at);
CREATE INDEX idx_reports_share_token ON reports(share_token);
CREATE INDEX idx_usage_tracking_user_period ON usage_tracking(user_id, billing_period_start);

-- =================================================================
-- TRIGGERS
-- =================================================================

-- Auto-update updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER ideas_updated_at BEFORE UPDATE ON ideas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER proposals_updated_at BEFORE UPDATE ON proposals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER icps_updated_at BEFORE UPDATE ON icps
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

---

## State Machines

### State Machine: Subscription

```
                    ┌─────────────┐
         ┌─────────►│    Trial    │◄─────────┐
         │          └──────┬──────┘          │
         │                 │                 │
         │     Payment     │    No Payment   │
         │     Success     │    (Day 8)      │
         │                 ▼                 │
         │          ┌─────────────┐          │
         │          │   Active    │          │
         │          └──────┬──────┘          │
         │                 │                 │
    Resubscribe    ┌───────┴───────┐         │
    (within 30d)   │               │         │
         │         ▼               ▼         │
         │  ┌─────────────┐ ┌─────────────┐  │
         │  │  Past Due   │ │  Cancelled  │  │
         │  └──────┬──────┘ └──────┬──────┘  │
         │         │               │         │
         │    Payment       Period Ends      │
         │    Succeeds            │          │
         │         │               ▼         │
         │         │        ┌─────────────┐  │
         └─────────┴───────►│   Expired   │──┘
                            └─────────────┘
```

### State Machine: Validation Test

```
┌─────────────┐
│   Pending   │
└──────┬──────┘
       │
       ├──────────────────────┐
       │ Start Test           │ User Cancels
       ▼                      ▼
┌─────────────┐        ┌─────────────┐
│ In Progress │───────►│  Cancelled  │
└──────┬──────┘        └─────────────┘
       │
       ├──────────────────────┐
       │ All Sessions Done    │ Error Occurs
       ▼                      ▼
┌─────────────┐        ┌─────────────┐
│  Completed  │        │   Failed    │
└─────────────┘        └──────┬──────┘
                              │
                              │ Retry
                              ▼
                       ┌─────────────┐
                       │   Pending   │
                       └─────────────┘
```

### State Machine: Session

```
┌─────────────┐
│   Pending   │
└──────┬──────┘
       │
       ├──────────────────────┐
       │ User/AI Starts       │ 30min timeout
       ▼                      ▼
┌─────────────┐        ┌─────────────┐
│   Active    │───────►│   Expired   │
└──────┬──────┘        └─────────────┘
       │
       ├─────────────────┬────────────────┐
       │ Conversation    │ User Leaves    │ 30min timeout
       │ Complete        │                │
       ▼                 ▼                │
┌─────────────┐   ┌─────────────┐         │
│  Completed  │   │  Abandoned  │         │
└─────────────┘   └─────────────┘         │
                                          ▼
                                   ┌─────────────┐
                                   │   Expired   │
                                   └─────────────┘
```

---

## Tier Limit Enforcement

Tier limits are enforced at the API layer before creating resources.

### Tier Limits (from PRD)

| Tier | Ideas | Tests/Month | Price |
|------|-------|-------------|-------|
| Solo | 1 | 10 | $9.95 |
| Growth | 3 | 30 | $19.95 |
| Scale | 10 | 100 | $29.95 |
| Pro | 20 | 200 | $49.95 |

### Enforcement Pattern

```typescript
// lib/tier-limits/check.ts
export interface TierCheckResult {
  allowed: boolean;
  current: number;
  limit: number;
  message?: string;
}

const TIER_LIMITS = {
  solo: { ideas: 1, tests: 10 },
  growth: { ideas: 3, tests: 30 },
  scale: { ideas: 10, tests: 100 },
  pro: { ideas: 20, tests: 200 },
};

export async function checkTierLimit(
  userId: string,
  resource: 'ideas' | 'tests'
): Promise<TierCheckResult> {
  const supabase = createServerClient();
  
  // 1. Get user's tier
  const { data: user } = await supabase
    .from('users')
    .select('subscription_tier')
    .eq('id', userId)
    .single();
  
  const tier = user?.subscription_tier ?? 'solo';
  const limit = TIER_LIMITS[tier][resource];
  
  // 2. Get current usage
  const { data: usage } = await supabase
    .from('usage_tracking')
    .select('ideas_count, tests_used')
    .eq('user_id', userId)
    .order('billing_period_start', { ascending: false })
    .limit(1)
    .single();
  
  const current = resource === 'ideas' 
    ? (usage?.ideas_count ?? 0)
    : (usage?.tests_used ?? 0);
  
  return {
    allowed: current < limit,
    current,
    limit,
    message: current >= limit 
      ? `You've used all ${limit} ${resource}. Upgrade for more.`
      : undefined,
  };
}
```

### Usage in API Routes

```typescript
// app/api/ideas/route.ts
export async function POST(request: Request) {
  const { user } = await getUser();
  
  const check = await checkTierLimit(user.id, 'ideas');
  if (!check.allowed) {
    return Response.json({
      error: 'limit_reached',
      message: check.message,
      upgrade_url: '/settings/billing'
    }, { status: 403 });
  }
  
  // ... create idea
}
```

### Enforcement Points

- `POST /api/ideas` — check ideas limit
- `POST /api/tests` — check tests/month limit

### Reset Rules

- Tests reset on billing anniversary (not calendar month)
- Track via `usage_tracking.billing_period_start`

---

## Billing Lock States

When payment fails, access is progressively restricted.

### Soft Lock (Past Due, days 1-3)

| Can Do | Cannot Do |
|--------|-----------|
| View dashboard | Create new ideas |
| View existing ideas/proposals | Start new tests |
| View existing reports | — |
| Download reports | — |
| Update payment method | — |

**UI:** Yellow banner "Payment failed. Update your card to continue validating."

### Hard Lock (Past Due, day 4+)

| Can Do | Cannot Do |
|--------|-----------|
| View payment screen | Everything else |
| Update payment method | — |
| Export data (GDPR) | — |

**UI:** Full-screen payment modal, no navigation to other routes.

### Retry Schedule

| Time | Action |
|------|--------|
| Day 8 (charge fails) | Enter soft lock, email user |
| Day 9 (24h) | Auto-retry, email if fails |
| Day 10 (48h) | Auto-retry, email if fails |
| Day 11 (72h) | Auto-retry, if fails → hard lock, final email |

> **Implementation Note:** Lock state transitions should be driven by Stripe webhook events (`invoice.payment_failed`, `invoice.paid`) rather than hardcoded day numbers. This ensures accuracy regardless of trial length changes or billing cycle variations.

### Implementation

```typescript
// middleware.ts
export async function middleware(request: NextRequest) {
  const { user } = await getSession();
  if (!user) return NextResponse.next();
  
  const lockState = await getBillingLockState(user.id);
  
  if (lockState === 'hard_lock') {
    // Only allow billing and export routes
    const allowedPaths = ['/settings/billing', '/api/user/export'];
    if (!allowedPaths.some(p => request.nextUrl.pathname.startsWith(p))) {
      return NextResponse.redirect(new URL('/settings/billing', request.url));
    }
  }
  
  if (lockState === 'soft_lock') {
    // Block POST to creation endpoints
    const blockedPaths = ['/api/ideas', '/api/tests'];
    if (request.method === 'POST' && blockedPaths.some(p => request.nextUrl.pathname.startsWith(p))) {
      return Response.json({ error: 'payment_required' }, { status: 402 });
    }
  }
  
  return NextResponse.next();
}
```

---

## Public Report Sharing (Token-Gated)

Public reports are accessed via a server-validated token, not permissive RLS.

### Flow

```
Browser → GET /r/[token] → Server validates:
  1. Token exists in reports table
  2. is_public = true
  3. share_expires_at is null OR > now
  4. Honor hide_proposal_details flag
  
→ Return sanitized report (no RLS bypass)
```

### Implementation

```typescript
// app/api/reports/[token]/route.ts
export async function GET(
  request: Request,
  { params }: { params: { token: string } }
) {
  const supabase = createAdminClient(); // Service role
  
  const { data: report, error } = await supabase
    .from('reports')
    .select(`
      *,
      validation_test:validation_tests(
        proposal:proposals(problem, solution)
      )
    `)
    .eq('share_token', params.token)
    .eq('is_public', true)
    .single();
  
  if (!report) {
    return Response.json({ error: 'Report not found' }, { status: 404 });
  }
  
  // Check expiry
  if (report.share_expires_at && new Date(report.share_expires_at) < new Date()) {
    return Response.json({ error: 'Link expired' }, { status: 410 });
  }
  
  // Sanitize based on flags
  const sanitized = {
    verdict: report.verdict,
    confidence_score: report.confidence_score,
    assumption_board: report.assumption_board,
    reality_check_plan: report.reality_check_plan,
    key_objections: report.key_objections,
    // Only include proposal details if not hidden
    ...(report.hide_proposal_details ? {} : {
      problem: report.validation_test.proposal.problem,
      solution: report.validation_test.proposal.solution,
    }),
  };
  
  return Response.json(sanitized, {
    headers: {
      'X-Robots-Tag': 'noindex, nofollow',
    },
  });
}
```

### Page Route

```typescript
// app/(public)/r/[token]/page.tsx
export async function generateMetadata({ params }) {
  return {
    robots: { index: false, follow: false },
  };
}

export default async function PublicReport({ params }) {
  const report = await fetch(`/api/reports/${params.token}`);
  // ... render report
}
```

---

## External Injection (Web Scraping)

External Injection (F-031, Phase 2) allows users to ground personas with real-world context.

### Service: Jina AI Reader

| Feature | Details |
|---------|---------|
| API | `GET https://r.jina.ai/{url}` |
| Cost | Free tier: 1M tokens/month |
| Output | Clean markdown |
| JS Rendering | Yes |

### Implementation

```typescript
// lib/jina/client.ts
export async function scrapeUrl(url: string): Promise<string | null> {
  try {
    const response = await fetch(`https://r.jina.ai/${encodeURIComponent(url)}`, {
      headers: {
        'Accept': 'text/plain',
      },
    });
    
    if (!response.ok) {
      console.error(`Jina scrape failed: ${response.status}`);
      return null;
    }
    
    const content = await response.text();
    
    // Truncate to max length
    const MAX_CHARS = 10000;
    return content.length > MAX_CHARS 
      ? content.slice(0, MAX_CHARS) + '\n\n[Content truncated...]'
      : content;
      
  } catch (error) {
    console.error('Jina scrape error:', error);
    return null;
  }
}
```

### Usage Flow

1. User provides URL (e.g., Reddit thread, competitor page)
2. Backend calls Jina AI Reader
3. Returns clean markdown content
4. Content stored in `proposals.external_context`
5. Content injected into persona system prompts

### Fallback

- If URL fetch fails, user can paste raw text manually
- Text stored in `external_context` with `external_source_url = null`

### Limits

- Max content length: 10,000 characters (truncate if longer)
- Rate limit: 10 URLs per hour per user (via Upstash)

### Source Quality Policy

| Aspect | Policy |
|--------|--------|
| **Storage** | Raw markdown stored in `proposals.external_context`, source URL in `external_source_url` |
| **Labeling** | Distinguish "source-derived claims" (from scraped content) vs "persona-inferred claims" (AI interpretation) in reports |
| **Multi-source rule** | For high-stakes verdicts (Kill/Pivot), require context from ≥2 different sources to avoid overfitting to one thread |
| **Trust level** | Flag sources as "verified" (official sites) vs "community" (Reddit, forums) — weight accordingly |

---

## GDPR Data Export

Users can request a full export of their data (GDPR Article 20).

### Trigger

- User clicks "Export my data" in `/settings`
- `POST /api/user/export` → queues background job

### Data Included

| Entity | Fields |
|--------|--------|
| User | email, name, country, created_at |
| Ideas | All fields |
| Proposals | All fields |
| ICPs | All fields |
| Assumptions | All fields |
| Validation Tests | All fields |
| Sessions | All fields including conversation |
| Reports | All fields |

### Excluded

- Personas (generated, not user data)
- Internal metadata (stripe_customer_id, etc.)

### Format

- JSON file with nested structure
- Optional PDF summary (human-readable)

### Delivery

1. Background job generates export
2. Stored temporarily in Supabase Storage (signed URL)
3. Email sent with download link
4. Link expires after 7 days
5. File deleted after download or expiry

### Implementation

```typescript
// workers/data-export.ts
import { getBoss } from '@/lib/jobs/boss';
import { createAdminClient } from '@/lib/supabase/admin';
import { sendDataExportReady } from '@/lib/resend/client';

interface ExportJob {
  userId: string;
  email: string;
}

export async function startDataExportWorker() {
  const boss = await getBoss();
  
  await boss.work<ExportJob>('generate-data-export', async (job) => {
    const { userId, email } = job.data;
    const supabase = createAdminClient();
    
    // 1. Query all user data (admin client bypasses RLS)
    const [user, ideas, proposals, ...rest] = await Promise.all([
      supabase.from('users').select('email, name, country, created_at').eq('id', userId).single(),
      supabase.from('ideas').select('*').eq('user_id', userId),
      // ... all other entities
    ]);
    
    // 2. Structure as JSON
    const exportData = {
      exported_at: new Date().toISOString(),
      user: user.data,
      ideas: ideas.data,
      proposals: proposals.data,
      // ... nest related entities
    };
    
    // 3. Upload to Supabase Storage
    const fileName = `exports/${userId}/${Date.now()}.json`;
    await supabase.storage
      .from('user-exports')
      .upload(fileName, JSON.stringify(exportData, null, 2));
    
    // 4. Generate signed URL (7 day expiry)
    const { data: urlData } = await supabase.storage
      .from('user-exports')
      .createSignedUrl(fileName, 60 * 60 * 24 * 7);
    
    // 5. Send email
    await sendDataExportReady(email, urlData.signedUrl);
  });
}
```

---

## Integration Architecture

### Supabase

**Client Types:**
1. **Browser Client** - Uses anon key, respects RLS
2. **Server Client** - Uses anon key + user session, respects RLS
3. **Admin Client** - Uses service role key, bypasses RLS (webhooks, background jobs)

> **Security Rule:** Service role key is only available to worker + server routes, never to client code. CI checks should prevent accidental exposure (e.g., lint rule blocking `SUPABASE_SERVICE_ROLE_KEY` in `app/` files).

```typescript
// lib/supabase/client.ts (Browser)
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// lib/supabase/server.ts (Server Components/API Routes)
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export function createClient() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return cookieStore.get(name)?.value; },
        set(name: string, value: string, options) { cookieStore.set({ name, value, ...options }); },
        remove(name: string, options) { cookieStore.set({ name, value: '', ...options }); },
      },
    }
  );
}

// lib/supabase/admin.ts (Background Jobs/Webhooks)
import { createClient } from '@supabase/supabase-js';

export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}
```

### OpenRouter (LLM)

```typescript
// lib/openrouter/client.ts
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

// Base chat function
async function chatInternal(messages: ChatMessage[], options?: {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
}) {
  const response = await fetch(OPENROUTER_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://plebtest.com',
      'X-Title': 'PlebTest',
    },
    body: JSON.stringify({
      model: options?.model ?? 'anthropic/claude-4.5-sonnet',
      messages,
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.maxTokens ?? 1024,
      stream: options?.stream ?? false,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenRouter error: ${response.status}`);
  }

  return options?.stream ? response : response.json();
}

// Chat with retry logic (exponential backoff)
export async function chat(
  messages: ChatMessage[],
  options?: Parameters<typeof chatInternal>[1],
  retries = 3
) {
  for (let i = 0; i < retries; i++) {
    try {
      return await chatInternal(messages, options);
    } catch (error) {
      if (i === retries - 1) throw error;
      
      // Exponential backoff: 1s, 2s, 4s
      const delay = 1000 * Math.pow(2, i);
      console.warn(`OpenRouter retry ${i + 1}/${retries} after ${delay}ms`, error);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}
```

> **Note:** `llm_model_version` on sessions supports future multi-LLM testing (e.g., comparing Claude 4.5 vs GPT-4o for specific personas).

### Stripe

**Webhook Events to Handle:**

| Event | Action |
|-------|--------|
| `checkout.session.completed` | Activate subscription, update user tier |
| `customer.subscription.updated` | Sync tier/status changes |
| `customer.subscription.deleted` | Move to Cancelled status |
| `invoice.payment_failed` | Move to Past Due, trigger soft lock, send notification |

```typescript
// app/api/webhooks/stripe/route.ts
import Stripe from 'stripe';
import { headers } from 'next/headers';
import { createAdminClient } from '@/lib/supabase/admin';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  const body = await request.text();
  const signature = headers().get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return Response.json({ error: 'Invalid signature' }, { status: 400 });
  }

  // Idempotency check
  const supabase = createAdminClient();
  const { data: existing } = await supabase
    .from('webhook_events')
    .select('id')
    .eq('id', event.id)
    .single();

  if (existing) {
    return Response.json({ received: true, status: 'already_processed' });
  }

  // Mark as processing
  await supabase.from('webhook_events').insert({
    id: event.id,
    event_type: event.type,
    status: 'processing',
  });

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutComplete(event.data.object);
        break;
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object);
        break;
    }

    await supabase.from('webhook_events')
      .update({ status: 'completed', processed_at: new Date().toISOString() })
      .eq('id', event.id);

  } catch (error) {
    await supabase.from('webhook_events')
      .update({ status: 'failed', error: String(error) })
      .eq('id', event.id);
    throw error;
  }

  return Response.json({ received: true });
}
```

### Resend (Email)

```typescript
// lib/resend/client.ts
import { Resend } from 'resend';

export const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendTrialReminder(email: string, daysLeft: number) {
  await resend.emails.send({
    from: 'PlebTest <noreply@plebtest.com>',
    to: email,
    subject: `${daysLeft} days left in your PlebTest trial`,
    html: `...`, // Use React Email for templates
  });
}

export async function sendReportReady(email: string, reportUrl: string) {
  await resend.emails.send({
    from: 'PlebTest <noreply@plebtest.com>',
    to: email,
    subject: 'Your validation report is ready',
    html: `...`,
  });
}

export async function sendDataExportReady(email: string, downloadUrl: string) {
  await resend.emails.send({
    from: 'PlebTest <noreply@plebtest.com>',
    to: email,
    subject: 'Your data export is ready',
    html: `Your data export is ready for download. This link expires in 7 days: ${downloadUrl}`,
  });
}
```

### Upstash Redis (Rate Limiting)

```typescript
// lib/rate-limit.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const limiters = {
  'api-general': new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(100, '1 m'),
    prefix: 'ratelimit:api',
  }),
  'create-idea': new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, '1 m'),
    prefix: 'ratelimit:create-idea',
  }),
  'start-test': new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, '1 m'),
    prefix: 'ratelimit:start-test',
  }),
  'scrape-url': new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, '1 h'),
    prefix: 'ratelimit:scrape',
  }),
  'auth-attempt': new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, '15 m'),
    prefix: 'ratelimit:auth',
  }),
};

export async function rateLimit(
  request: Request,
  operation: keyof typeof limiters,
  identifier?: string
) {
  const limiter = limiters[operation];
  const ip = request.headers.get('x-forwarded-for') ?? 'unknown';
  const key = identifier ?? ip;

  return limiter.limit(key);
}
```

---

## Background Jobs (pg-boss)

### Setup

```typescript
// lib/jobs/boss.ts
import PgBoss from 'pg-boss';

let boss: PgBoss;

export async function getBoss() {
  if (!boss) {
    boss = new PgBoss(process.env.DATABASE_URL!);
    await boss.start();
  }
  return boss;
}

export const JobTypes = {
  RUN_SESSION: 'run-session',
  GENERATE_REPORT: 'generate-report',
  SEND_EMAIL: 'send-email',
  CHECK_SESSION_TIMEOUT: 'check-session-timeout',
  TRIAL_REMINDER: 'trial-reminder',
  DATA_EXPORT: 'generate-data-export',
} as const;
```

### Worker Entrypoint

```typescript
// workers/index.ts
import { getBoss } from '@/lib/jobs/boss';
import { startSessionWorker } from './session-runner';
import { startReportWorker } from './report-generator';
import { startDataExportWorker } from './data-export';
import { setupCronJobs } from './cron';

async function main() {
  console.log('Starting workers...');
  
  await getBoss();
  
  await Promise.all([
    startSessionWorker(),
    startReportWorker(),
    startDataExportWorker(),
    setupCronJobs(),
  ]);
  
  console.log('All workers started');
}

main().catch(console.error);
```

> **Token Budgeting (Future):** Session runner should enforce per-session limits:
> - Max conversation turns: 20 (Interactive), 15 (Spectator)
> - Max tokens per session: ~8,000 (tracked via `prompt_tokens` + `completion_tokens`)
> - For cost optimization, consider using cheaper models (e.g., Claude Haiku) for "low-fi" surveys in Phase 2

### Cron Jobs

```typescript
// workers/cron.ts
import { getBoss } from '@/lib/jobs/boss';
import { createAdminClient } from '@/lib/supabase/admin';

export async function setupCronJobs() {
  const boss = await getBoss();

  // Check for expired sessions every 5 minutes
  await boss.schedule('check-session-timeouts', '*/5 * * * *', {});

  await boss.work('check-session-timeouts', async () => {
    const supabase = createAdminClient();
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString();

    await supabase
      .from('sessions')
      .update({ status: 'expired' })
      .eq('status', 'active')
      .lt('last_activity_at', thirtyMinutesAgo);
  });

  // Trial reminders daily at 9am
  await boss.schedule('trial-reminders', '0 9 * * *', {});

  await boss.work('trial-reminders', async () => {
    // Find users with trials ending in 2 days or 1 day
    // Send reminder emails
  });
}
```

---

## Security Architecture

### Authentication Flow

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│     Browser     │      │   Next.js API   │      │    Supabase     │
└────────┬────────┘      └────────┬────────┘      └────────┬────────┘
         │                        │                        │
         │  1. Login Request      │                        │
         │───────────────────────►│                        │
         │                        │  2. Auth with Supabase │
         │                        │───────────────────────►│
         │                        │                        │
         │                        │  3. JWT Token          │
         │                        │◄───────────────────────│
         │  4. Set httpOnly Cookie│                        │
         │◄───────────────────────│                        │
         │                        │                        │
         │  5. Subsequent Request │                        │
         │───────────────────────►│                        │
         │       (with cookie)    │  6. Verify JWT         │
         │                        │───────────────────────►│
         │                        │                        │
         │                        │  7. User Data (RLS)    │
         │  8. Response           │◄───────────────────────│
         │◄───────────────────────│                        │
```

### API Security Checklist

- [x] **Authentication** - Supabase Auth with JWT
- [x] **Authorization** - RLS policies on all tables (explicit per-operation)
- [x] **Rate Limiting** - Upstash Redis per-IP and per-user
- [x] **Input Validation** - Zod schemas on all endpoints
- [x] **CORS** - Locked to plebtest.com domains only (+ staging.plebtest.com and localhost:3000 in non-prod)
- [x] **HTTPS** - Enforced by Railway
- [x] **Secrets** - Environment variables, never in code
- [x] **Public Reports** - Token-gated, server-validated (no permissive RLS)

### Data Security

| Data Type | Classification | Storage | Encryption |
|-----------|---------------|---------|------------|
| Email, Name | PII | Supabase | At rest (AES-256) |
| Proposals, Conversations | User Content | Supabase | At rest (AES-256) |
| Payment Details | Sensitive | Stripe only | Never stored |
| Session Tokens | Auth | httpOnly cookies | In transit (TLS) |

---

## Observability

### Error Tracking (Sentry)

```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});
```

### Analytics (PostHog)

Key events to track:

| Event | Properties | Purpose |
|-------|------------|---------|
| `quick_fire_started` | - | Measure hook engagement |
| `quick_fire_completed` | `score` | Measure completion rate |
| `idea_created` | - | Track idea creation |
| `test_started` | `mode`, `persona_count` | Track test usage |
| `test_completed` | `verdict`, `duration` | Track completion |
| `report_shared` | - | Track virality |
| `subscription_started` | `tier`, `billing_cycle` | Track conversions |
| `subscription_cancelled` | `reason` | Track churn |

> **GDPR Note:** Session replay is disabled by default. Enable only after explicit user consent via cookie banner. For EU users, respect "Do Not Track" headers. PostHog can be configured for EU data residency if needed.

### Performance Benchmarks

| Operation | Target | Alert Threshold |
|-----------|--------|-----------------|
| Quick Fire response | <5 seconds | >10 seconds |
| SSE first token | 200-500ms | >2 seconds |
| Report generation | <30 seconds (10 personas) | >60 seconds |
| Page load (LCP) | <2.5 seconds | >4 seconds |
| API response (p95) | <500ms | >1 second |

### Monitoring Alerts

Configure in Sentry/PostHog:

| Alert | Threshold | Action |
|-------|-----------|--------|
| Quick Fire failure rate | >10% | Page on-call |
| Session timeout rate | >20% | Investigate UX |
| Report generation failure | >5% | Page on-call |
| OpenRouter error rate | >5% | Check status page, consider failover |
| Stripe webhook failure | Any | Page on-call immediately |

### Logging

Railway captures stdout/stderr automatically. Use structured logging:

```typescript
// lib/logger.ts
export function log(level: 'info' | 'warn' | 'error', message: string, meta?: object) {
  console.log(JSON.stringify({
    timestamp: new Date().toISOString(),
    level,
    message,
    ...meta,
  }));
}

// Usage
log('info', 'Test started', { testId, userId, mode: 'interactive' });
log('error', 'OpenRouter failed', { error: err.message, testId });
```

---

## Decision Log

| # | Decision | Choice | Rationale |
|---|----------|--------|-----------|
| 1 | Architecture | Monolith | Solo founder, MVP speed, maintainability |
| 2 | Frontend | Next.js 15 + Tailwind + shadcn/ui | Modern stack, great DX, Turbopack |
| 3 | Hosting | Railway | No timeouts, horizontal scaling, background workers |
| 4 | Database | Supabase PostgreSQL + RLS | Managed Postgres, integrated auth, realtime |
| 5 | Auth | Supabase Auth | Integrated with DB, OAuth support, RLS integration |
| 6 | LLM | OpenRouter → Claude 4.5 Sonnet | Best for persona consistency, reduced hallucinations |
| 7 | Payments | Stripe | Industry standard, webhook reliability |
| 8 | Email | Resend | Simple API, great DX, generous free tier |
| 9 | Analytics | PostHog | Product analytics + replay, GDPR-friendly |
| 10 | Error Tracking | Sentry | Industry standard, Next.js integration |
| 11 | Rate Limiting | Upstash Redis | Distributed, survives restarts, cheap |
| 12 | Background Jobs | pg-boss | Uses existing Postgres, reliable, simple |
| 13 | Input Validation | Zod | TypeScript-native, most popular in ecosystem |
| 14 | CI/CD | Railway auto-deploy | Simple for MVP, no extra config |
| 15 | Session Transport | SSE Streaming | Real-time token display, ChatGPT-like UX |
| 16 | Web Scraping | Jina AI Reader | Free tier, handles JS, simple API |
| 17 | Dev Environment | Local Supabase | Isolated from staging, free, resettable |
| 18 | Multi-LLM | Single model for MVP | `llm_model_version` column supports future A/B testing (Claude vs GPT-4o) |

---

## Cost Projections

Estimated monthly costs at different user scales:

| Component | Development | MVP (<100 users) | Growth (1K users) | Scale (5K users) |
|-----------|-------------|------------------|-------------------|------------------|
| Railway (web + worker) | $0 | $10-20 | $30-50 | $75-150 |
| Supabase | $0 (local) | $0 (free tier) | $25 | $75 |
| OpenRouter (Claude 4.5) | ~$5 (testing) | $20-50 | $150-300 | $500-1000 |
| Upstash Redis | $0 | $0 (free tier) | $10 | $20 |
| Resend | $0 | $0 (free tier) | $20 | $40 |
| Sentry | $0 | $0 (free tier) | $26 | $26 |
| PostHog | $0 | $0 (free tier) | $0 | $450+ |
| **Total** | **~$5** | **$30-70** | **$260-440** | **$1,200-1,800** |

**LLM Cost Breakdown (per test):**
- Quick Fire: ~$0.01 (150 tokens max)
- Standard Test (5 personas): ~$0.50
- Deep Test (10 personas): ~$1.00

**Target:** Keep total costs under $100/month until 1K users (self-sustaining at ~100 paying users on Solo tier).

---

## Environment Variables

```bash
# .env.local (development)
# .env.staging (staging)
# .env.production (production)

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Database (for pg-boss)
DATABASE_URL=

# OpenRouter
OPENROUTER_API_KEY=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# Resend
RESEND_API_KEY=

# Upstash Redis
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# Sentry
NEXT_PUBLIC_SENTRY_DSN=
SENTRY_AUTH_TOKEN=

# PostHog
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=

# App
NEXT_PUBLIC_APP_URL=https://plebtest.com
```

---

## Open Questions (Phase 2)

| Question | Context | Decision By |
|----------|---------|-------------|
| PDF generation | Report download feature | Phase 2 start |
| PDF CDN | Storage/delivery for exports | Phase 2 start |
| Input Quality Gates | Validation for vague ICPs or biased inputs | Phase 2 |
| Validation Debt Counter | UI indicator showing assumption confidence gaps | Phase 2 |
| Trial reminder cron | Daily job for trial ending emails | Post-MVP (nice to have) |
| Referral tracking | Analytics for viral growth | Post-MVP |

---

## Next Steps

1. **Run `/bootstrap`** to generate project-plan.md with implementation tasks
2. **Set up Local Supabase** (`supabase init` + `supabase start`)
3. **Set up Supabase cloud projects** (staging + production)
4. **Set up Railway projects** (staging + production, with web + worker services)
5. **Configure environment variables** in Railway
6. **Begin Phase 1 implementation**

---

*Architecture designed for PlebTest - Kill duds. Find winners.*
*QA reviewed by 6-LLM consensus: Claude, Manus, Gemini, ChatGPT, Grok, Perplexity, DeepSeek*
*24 improvements applied from Round 2 review*
