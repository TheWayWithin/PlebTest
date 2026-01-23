# PlebTest Product Requirements Document

**Version:** 2.0
**Last Updated:** January 18, 2026
**Status:** Complete
**Owner:** Jamie

---

# Section 0: At-a-Glance

| Attribute | Value |
|-----------|-------|
| **Product Name** | PlebTest |
| **Version** | 2.0 |
| **Last Updated** | January 18, 2026 |
| **Status** | Active Development |
| **Owner** | Jamie |

## Elevator Pitch

PlebTest gives founders who can't—or won't—pick up the phone a way to validate ideas using AI customer simulations. Get honest feedback from thousands of AI personas built to challenge your assumptions, not confirm them. Know whether to kill, pivot, or build—in minutes, not months.

## Target Users

Solo founders and side-hustle builders who avoid cold calls but need to validate ideas before wasting months building the wrong thing. Technical builders, time-poor founders, and first-timers with phone anxiety.

## Key Metrics

| Metric | Target | Timeframe |
|--------|--------|-----------|
| **Primary** | 1,000 paying founders | Year 1 (2026) |
| **Secondary** | 60%+ trial-to-paid conversion | Ongoing |
| **Secondary** | $250K ARR | Year 1 (2026) |

## Product Stage

- **Phase 0** (Now): Landing page + waitlist
- **Phase 1** (End January): Core Loop MVP - private testing
- **Phase 2** (February): Public launch - full MVP with virality features

---

# Section 1: Product Foundation

## 1.1 Vision & Mission

**Vision**: "The fear of customer discovery no longer stops anyone. Founders launch knowing, not hoping."

**Mission**: "I give founders who dread picking up the phone—or are simply too time-poor—a way to kill bad ideas fast, so they can finally get to the great one."

## 1.2 Problem Statement

**The Problem:**
Founders skip customer validation because talking to strangers is painful. They build blind, discover too late nobody wants it, and waste months on the wrong idea.

**Evidence:**
- 42% of startups fail from no market need
- Founders avoid cold calls due to phone anxiety, introversion, or time constraints
- ChatGPT/friends give sycophantic feedback that confirms bad ideas

**Impact of Not Solving:**
- 3-6 months wasted building the wrong thing
- Runway burned on features nobody wants
- Winning ideas sit unbuilt while chasing losers

## 1.3 Target Users

### Primary Persona: The Builder (Technical Solo Founder)
| Attribute | Value |
|-----------|-------|
| **Demographics** | Developers, engineers, technical founders. Solo or very early stage (0-2 people). |
| **Goals** | Ship products people actually want. Avoid wasting months building the wrong thing. |
| **Pain Points** | Would rather code than cold-call. Paralyzed by phone anxiety. Fears rejection from strangers. |
| **Tech Savviness** | High |
| **Willingness to Pay** | $10-50/month for validation tools |
| **Where Found** | Twitter/X #buildinpublic, Indie Hackers, Hacker News, Reddit |

### Secondary Persona: The Night-Owl (Side-Hustle Optimizer)
| Attribute | Value |
|-----------|-------|
| **Demographics** | Full-time employed, building on the side. Pre-revenue side project. |
| **Goals** | Validate ideas in evenings/weekends without disrupting day job. |
| **Pain Points** | Can't schedule calls during business hours. Limited time, needs async solutions. |
| **Tech Savviness** | Medium-High |
| **Willingness to Pay** | $10-20/month (cost-conscious) |

### Tertiary Persona: The Expert (Anxious First-Time Founder)
| Attribute | Value |
|-----------|-------|
| **Demographics** | Domain experts starting their first business. Often leaving corporate. |
| **Goals** | Test ideas in a safe environment. Build confidence. |
| **Pain Points** | Strong expertise, weak confidence. Crippling imposter syndrome, fears being "exposed." |
| **Tech Savviness** | Medium |
| **Willingness to Pay** | $10-20/month |

### Anti-Persona (Who We Don't Serve)
- Enjoys networking and cold outreach
- Wants validation theater for investors
- No specific idea yet—just "exploring"
- Defensive about their idea, can't handle truth

## 1.4 Value Proposition

**For** founders who can't—or won't—pick up the phone
**Who** need to validate ideas but dread talking to strangers
**PlebTest** gives your market a voice
**That** tells you which ideas to kill, pivot, or build
**Unlike** building and praying, asking ChatGPT, or forcing yourself through painful cold calls
**Our product** uses AI personas built to challenge your assumptions, not confirm them—so you hear real objections before you build the wrong thing.

## 1.5 Success Metrics

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| **Primary: Paying Founders** | 1,000 | Stripe subscription count |
| **Trial-to-Paid Conversion** | 60%+ | Trial signups → paid conversions |
| **ARR** | $250,000 | Monthly revenue × 12 |
| **Time to First Validation** | < 10 min | Onboarding analytics |
| **Monthly Churn** | < 8% | Subscription cancellations |
| **Public Case Studies** | 20 | Published kill/pivot/build stories |

**Anti-Metrics (What We're NOT Optimizing For):**
- Vanity signups without activation
- Feature count over core value delivery
- Enterprise deals before product-market fit

---

# Section 2: System Skeleton

## 2.1 Glossary

| Term | Definition | Context |
|------|------------|---------|
| **Validation Test** | A single AI simulation session that evaluates an idea against personas | Core user action |
| **Idea** | A business concept the user wants to validate | User creates and manages these |
| **Proposal** | Document with problem, solution, hypotheses, current workarounds. Lifecycle: Draft → Submitted → Testing → Tested → Archived | Key input for personas and questions; can be edited and re-tested |
| **Persona** | An AI-simulated customer defined by a combination of traits | Generated from user's ICP with trait variations |
| **Trait** | A variable dimension of a persona: demographics, psychographics, or personality (Big Five: openness, conscientiousness, extraversion, agreeableness, neuroticism) | Attributes within Persona entity, not a separate entity |
| **ICP** | Ideal Customer Profile - target customer description. One ICP generates multiple Personas with trait variations | Number of personas driven by user/scale of test |
| **Session** | A single conversation instance between user and one persona | Container for the interactive validation experience |
| **Verdict** | Outcome: Kill (need not validated), Pivot (need validated but proposal doesn't resonate), Build (both validated) | Primary deliverable |
| **Confidence Score** | Certainty level based on persona consensus, score variance, and user engagement quality | Displayed as High/Medium/Low alongside Verdict |
| **Report** | Full output document containing Verdict plus reasoning and evidence | Deliverable users receive after validation |
| **Anti-Sycophancy Engine** | System ensuring personas challenge rather than confirm. User-facing: "Honest Feedback" | Core differentiator; internal term |
| **Interactive Mode** | **Default experience** where user actively participates in conversations with personas | Primary validation method |
| **Spectator Mode** | **Optional mode** for users to watch AI-driven validation without participating. Includes Nudge Buttons for intervention | Powerful option for hands-off validation |
| **Iteration** | A version of a proposal after edits post-test, tracking changes and previous verdict | Supports pivot-and-retest workflow |
| **Quick Fire Mode** | Sub-60-second onboarding hook providing a Risk Score from a single sentence input | Fast value demonstration; lead-in to full validation |
| **Assumption Board** | Primary report output showing each assumption, evidence, confidence score, and recommended next step | Core deliverable structure |
| **Reality Check Panel** | Ethical guardrail in report providing "Minimum Real-World Validation Plan" | Ensures users don't over-rely on AI validation |
| **Pushback Presets** | User-facing control with three modes: The Cheerleader, The Pragmatist, The Critic | Controls Anti-Sycophancy intensity |
| **Pre-Mortem Mode** | Simulation asking "The product launched and failed. Why?" | Proactive failure analysis |
| **External Injection** | Feature to ground personas in reality via URL scraping or pasted text | Reality-grounding mechanism |
| **Nudge Buttons** | Spectator Mode controls: Pause, Dig Deeper, Move On | User intervention without typing |

## 2.2 Conceptual Data Model

### Entities

**User**
| Attribute | Type | Description |
|-----------|------|-------------|
| id | UUID | Unique identifier |
| email | String | Login credential |
| name | String | Display name |
| country | String | Tax jurisdiction |
| subscription_tier | Enum | Solo, Growth, Scale, Pro |
| stripe_customer_id | String | Links to Stripe records |
| vat_id | String (optional) | EU B2B tax exemption |
| created_at | Timestamp | Account creation |

**Idea**
| Attribute | Type | Description |
|-----------|------|-------------|
| id | UUID | Unique identifier |
| user_id | UUID | Owner (FK to User) |
| name | String | Working title for the idea |
| quick_fire_score | Integer (nullable) | Risk score from Quick Fire Mode |
| quick_fire_objection | Text (nullable) | Key counter-argument from Quick Fire |
| created_at | Timestamp | When created |

**Proposal**
| Attribute | Type | Description |
|-----------|------|-------------|
| id | UUID | Unique identifier |
| idea_id | UUID | FK to Idea |
| status | Enum | Draft, Submitted, Testing, Tested, Cancelled, Archived |
| problem | Text | What problem, who has it, frequency, cost |
| current_workarounds | Text | What they do today |
| solution | Text | What you're proposing |
| hypotheses | Text | Assumptions to test ("I believe...") |
| pricing_assumption | Text (optional) | Expected price point |
| competitors | Text (optional) | Known alternatives |
| external_context | Text (optional) | Injected context from URL or pasted text |
| external_source_url | String (optional) | Source URL if external injection used |
| created_at | Timestamp | When created |
| updated_at | Timestamp | Last modified |

**Assumption**
| Attribute | Type | Description |
|-----------|------|-------------|
| id | UUID | Unique identifier |
| proposal_id | UUID | FK to Proposal |
| statement | Text | The assumption text ("I believe...") |
| priority | Integer | User-assigned importance (1-5) |
| confidence_score | Decimal (nullable) | Post-test confidence (0-100) |
| evidence_for | JSON (nullable) | Supporting evidence from sessions |
| evidence_against | JSON (nullable) | Counter evidence from sessions |
| recommended_action | Enum (nullable) | Validate, Pivot, Kill, Explore |
| created_at | Timestamp | When created |

**ICP**
| Attribute | Type | Description |
|-----------|------|-------------|
| id | UUID | Unique identifier |
| proposal_id | UUID | FK to Proposal |
| name | String | Label for this ICP |
| demographics | Text | Age, role, industry, company size |
| psychographics | Text | Values, motivations, fears, goals |
| context | Text | Where/when they experience the problem |
| pain_intensity | Enum | Annoying, Costly, Blocking |
| current_solutions | Text | What they do today |
| decision_role | Enum | Decision-maker, Influencer, End-user, Blocker |
| adoption_tendency | Enum | Early Adopter, Early Majority, Late Majority, Laggard |
| created_at | Timestamp | When created |

**Persona**
| Attribute | Type | Description |
|-----------|------|-------------|
| id | UUID | Unique identifier |
| icp_id | UUID | FK to ICP (generated from) |
| name | String | Generated persona name |
| demographics | JSON | Specific demographic traits |
| psychographics | JSON | Specific psychographic traits |
| openness | Integer (1-100) | Open to new ideas vs conventional |
| conscientiousness | Integer (1-100) | Organized/disciplined vs flexible |
| extraversion | Integer (1-100) | Outgoing vs reserved |
| agreeableness | Integer (1-100) | Cooperative vs challenging |
| neuroticism | Integer (1-100) | Emotionally reactive vs stable |
| skepticism_level | Enum | Low, Medium, High | Skeptic-Heavy Default applies here |
| generated_at | Timestamp | When created |

**Validation Test**
| Attribute | Type | Description |
|-----------|------|-------------|
| id | UUID | Unique identifier |
| proposal_id | UUID | FK to Proposal |
| parent_test_id | UUID (nullable) | FK to previous test (for re-tests) |
| version | Integer | Iteration number (default 1) |
| test_mode | Enum | Quick, Standard, Deep |
| validation_mode | Enum | Interactive, Spectator, PreMortem |
| pushback_preset | Enum | Cheerleader, Pragmatist, Critic |
| icp_ids | Array | Which ICPs to use |
| persona_count | Integer | Number of personas generated |
| status | Enum | Pending, In Progress, Completed, Cancelled, Failed |
| report_id | UUID (nullable) | FK to Report (after completion) |
| created_at | Timestamp | When created |
| started_at | Timestamp | When user began |
| completed_at | Timestamp | When finished |

**Session**
| Attribute | Type | Description |
|-----------|------|-------------|
| id | UUID | Unique identifier |
| validation_test_id | UUID | FK to Validation Test |
| persona_id | UUID | FK to Persona |
| status | Enum | Pending, Active, Completed, Abandoned, Expired |
| mode | Enum | Interactive, Spectator |
| conversation | JSON | Full conversation history |
| message_count | Integer | Total messages |
| user_message_count | Integer | User's messages only |
| nudge_count | Integer | Nudge button uses (Spectator) |
| avg_response_time_seconds | Integer | User response speed |
| need_validated | Boolean | Did persona confirm the need? |
| solution_resonated | Boolean | Did proposal resonate? |
| key_objections | JSON | Objections raised |
| anti_sycophancy_triggers | Integer | Pushback count |
| score | Decimal | Session-level validation score |
| llm_model_version | String | AI model used |
| prompt_version | String | Prompts used |
| started_at | Timestamp | When began |
| completed_at | Timestamp | When ended |

**Report**
| Attribute | Type | Description |
|-----------|------|-------------|
| id | UUID | Unique identifier |
| validation_test_id | UUID | FK to Validation Test |
| verdict | Enum | Kill, Pivot, Build |
| confidence_score | Enum | High, Medium, Low |
| need_validation_summary | Text | Evidence for/against the need |
| solution_validation_summary | Text | Evidence for/against the solution |
| assumption_board | JSON | Per-assumption breakdown with scores |
| reality_check_plan | JSON | Minimum real-world validation steps |
| strongest_signals | JSON | Top quotes/moments driving verdict |
| key_objections | JSON | Aggregated objections |
| risk_factors | JSON | What to watch for (even on Build) |
| next_steps | JSON | 1-3 concrete actions |
| pivot_suggestions | Text | What to change if Pivot |
| pre_mortem_findings | JSON (nullable) | If Pre-Mortem mode was used |
| share_token | String | Public URL token |
| is_public | Boolean | User controls visibility |
| user_rating | Integer (nullable) | 1-5 satisfaction |
| generation_version | String | AI model/prompt version |
| generated_at | Timestamp | When created |

**Iteration**
| Attribute | Type | Description |
|-----------|------|-------------|
| id | UUID | Unique identifier |
| proposal_id | UUID | FK to Proposal |
| iteration_number | Integer | 1, 2, 3... |
| changes_summary | Text | What changed from previous |
| previous_verdict | Enum | Kill, Pivot, Build |
| created_at | Timestamp | When iteration created |

### Relationships

| Relationship | Type | Description |
|--------------|------|-------------|
| User → Idea | One-to-Many | A user can have multiple ideas |
| Idea → Proposal | One-to-Many | An idea can have multiple proposal versions |
| Proposal → ICP | One-to-Many | A proposal can target multiple ICPs |
| Proposal → Assumption | One-to-Many | A proposal has multiple assumptions to test |
| Proposal → Iteration | One-to-Many | A proposal can have up to 10 iterations |
| ICP → Persona | One-to-Many | One ICP generates multiple personas |
| Proposal → Validation Test | One-to-Many | A proposal can be tested multiple times |
| Validation Test → Session | One-to-Many | One test has many sessions (one per persona) |
| Validation Test → Report | One-to-One | One test produces one report |
| Session → Persona | Many-to-One | Each session uses one persona |

## 2.3 UI Structure (Sitemap)

### Public Pages

| Route | Page | Description |
|-------|------|-------------|
| `/` | Landing | Marketing page, waitlist capture |
| `/pricing` | Pricing | Plan comparison |
| `/login` | Login | User authentication |
| `/register` | Register | Account creation |
| `/r/:token` | Public Report | Shared report (short URL) |

### Authenticated Pages

| Route | Page | Description |
|-------|------|-------------|
| `/onboarding` | Onboarding | First-run experience (Quick Fire Mode) |
| `/dashboard` | Dashboard | Overview of ideas, recent tests |
| `/quick-fire` | Quick Fire | Fast validation entry point |
| `/ideas` | Ideas List | All user's ideas |
| `/ideas/:id` | Idea Detail | Single idea with proposals |
| `/ideas/:id/icps` | ICPs | ICP management for idea |
| `/icps/:id` | ICP Detail | View/edit ICP |
| `/proposals/:id` | Proposal Editor | Create/edit proposal |
| `/proposals/:id/assumptions` | Assumption Board | Manage and prioritize assumptions |
| `/proposals/:id/test` | Run Test | Configure and run validation |
| `/proposals/:id/history` | Test History | All test iterations |
| `/tests/:id` | Test View | Active test with sessions |
| `/sessions/:id` | Session | Live conversation with persona |
| `/reports/:id` | Report | Full validation report with Assumption Board |
| `/settings` | Settings | Account preferences |
| `/settings/billing` | Billing | Plan, usage, payment |
| `/settings/referrals` | Referrals | Referral program |

## 2.4 Business Rules & State Machines

### State Machines

**Proposal:**
| State | Description | Valid Transitions |
|-------|-------------|-------------------|
| Draft | Being edited | → Submitted |
| Submitted | Ready for testing | → Testing, → Draft |
| Testing | Validation in progress | → Tested, → Cancelled |
| Tested | Has completed test(s) | → Draft, → Archived |
| Cancelled | Test stopped mid-way | → Draft |
| Archived | No longer active | → Draft |

**Validation Test:**
| State | Description | Valid Transitions |
|-------|-------------|-------------------|
| Pending | Configured, not started | → In Progress, → Cancelled |
| In Progress | Sessions running | → Completed, → Cancelled, → Failed |
| Completed | All sessions done, report generated | None |
| Cancelled | User stopped test | None |
| Failed | System error | → Pending (retry) |

**Session:**
| State | Description | Valid Transitions |
|-------|-------------|-------------------|
| Pending | Waiting for user to join | → Active, → Expired |
| Active | Conversation in progress | → Completed, → Abandoned, → Expired |
| Completed | Finished normally | None |
| Abandoned | User left without completing | None |
| Expired | 30-min inactivity timeout | None |

**Subscription:**
| State | Description | Valid Transitions |
|-------|-------------|-------------------|
| Trial | 7-day free trial | → Active, → Expired |
| Active | Paying customer | → Past Due, → Cancelled |
| Past Due | Payment failed | → Active, → Cancelled |
| Cancelled | User cancelled | → Active (resubscribe within 30 days) |
| Expired | Trial ended without payment | → Active |

**Report:**
| State | Description | Valid Transitions |
|-------|-------------|-------------------|
| Generating | Being created after test completes | → Ready |
| Ready | Available to user (private) | → Public, → Archived |
| Public | Shareable link active | → Ready, → Archived |
| Archived | No longer active | None |

### Tier Limits

| Tier | Products | Tests/Month | Price |
|------|----------|-------------|-------|
| Solo | 1 | 10 | $9.95 |
| Growth | 3 | 30 | $19.95 |
| Scale | 10 | 100 | $29.95 |
| Pro | 20 | 200 | $49.95 |

**Enforcement Rules:**
- IF active_ideas ≥ tier limit THEN block new idea creation
- IF tests_this_month ≥ tier limit THEN block new tests
- Tests reset on billing anniversary (not calendar month)
- Upgrade: new limits apply immediately
- Downgrade: takes effect next billing cycle

### Verdict Logic

| need_validation | solution_resonance | Verdict |
|-----------------|-------------------|---------|
| < 40% | Any | Kill |
| 40-69% | Any | Pivot |
| 70%+ | < 60% | Pivot |
| 70%+ | 60%+ | Build |

**Confidence Score:**
| Level | Rule |
|-------|------|
| High | Score variance < 15% across personas AND persona_count ≥ 10 |
| Medium | Variance 15-30% OR persona_count 5-9 |
| Low | Variance > 30% OR persona_count < 5 |

### Iteration Rules

- IF Proposal edited after Test complete THEN create Iteration record
- Iteration tracks: what changed, previous verdict
- Report shows history: "Iteration 3 - Previous verdicts: Kill, Pivot"
- Maximum 10 iterations per proposal

## 2.5 External API Dependencies

| Service | Provider | Purpose | Required | Fallback |
|---------|----------|---------|----------|----------|
| **Payment** | Stripe | Subscriptions, billing | Yes | None |
| **Auth** | Supabase | User authentication (OAuth) | Yes | None |
| **LLM** | OpenRouter | Persona generation, conversations (model-agnostic) | Yes | None |
| **Web Scraping** | TBD | External Injection URL parsing | No | Manual paste fallback |
| **Email** | TBD | Transactional emails, reports | Yes | Queue for retry |
| **Analytics** | TBD | Usage tracking | No | Continue without |

**Note:** LLM model selected dynamically based on best available at runtime.

## 2.6 Data Privacy & Compliance

### Data Classification

| Data Type | Classification | Storage | Retention |
|-----------|---------------|---------|-----------|
| Email | PII | Encrypted | Account lifetime + 90 days |
| Name | PII | Encrypted | Account lifetime + 90 days |
| Country | Personal | Plain | Account lifetime + 90 days |
| Payment details | Sensitive | Stripe only (not stored) | Managed by Stripe |
| VAT ID | Business | Plain | Account lifetime + 90 days |
| Proposals | User content | Encrypted | Account lifetime + 90 days |
| Conversations | User content | Encrypted | Account lifetime + 90 days |
| External Injection URLs | User content | Encrypted | Account lifetime + 90 days |

### Compliance Requirements

| Requirement | Applicability | Implementation |
|-------------|--------------|----------------|
| GDPR | EU users | Data export, deletion on request |
| CCPA | CA users | Opt-out mechanism |
| Cookie consent | All users | Consent banner |

### Consent at Signup

- [ ] Terms of Service acceptance (required)
- [ ] Privacy Policy acceptance (required)
- [ ] Marketing emails (optional)

---

# Section 2.7: Anti-Sycophancy Engine Specification

**Purpose:** The Anti-Sycophancy Engine is PlebTest's core differentiator. It ensures AI personas challenge user assumptions rather than confirming them, providing honest, critical feedback that mimics real customer skepticism.

## 2.7.1 Skeptic-Heavy Default

**Rule:** When generating personas from an ICP, the system skews toward skeptical and neutral personas by default.

| Skepticism Level | Distribution | Persona Behavior |
|------------------|--------------|------------------|
| High | 40% | Actively challenges claims, asks hard questions, expresses doubt |
| Medium | 40% | Balanced but requires proof, probes weak points |
| Low | 20% | More receptive but still questions assumptions |

**Rationale:** Real markets contain more skeptics than enthusiasts. Over-representing skeptics helps founders hear objections early.

## 2.7.2 Pushback Presets

User-facing control allowing adjustment of Anti-Sycophancy intensity:

| Preset | Name | Description | Use Case |
|--------|------|-------------|----------|
| **1** | The Cheerleader | Supportive but honest. Will validate real strengths while noting concerns. | Early confidence building, identifying what works |
| **2** | The Pragmatist | Balanced, real-world perspective. Questions feasibility and value prop. | Standard validation (default) |
| **3** | The Critic | Aggressive devil's advocate. Finds every flaw, challenges everything. | Stress-testing before major investment |

**Default:** The Pragmatist

**Implementation Notes:**
- Preset affects persona system prompts
- Does NOT change the underlying skepticism distribution
- User can override per-test

## 2.7.3 Interviewer Agent Principles

For Spectator Mode, the AI Interviewer follows Mom Test methodology:

| Principle | Implementation |
|-----------|----------------|
| **Ask about their life, not your idea** | Opens with context questions before introducing solution |
| **Ask about specifics in the past** | "Tell me about the last time..." not "Would you..." |
| **Talk less, listen more** | Interviewer speaks < 30% of conversation |
| **Push past compliments** | "That's interesting - what would make you actually switch?" |
| **Seek the truth, not validation** | Probes for negative signals, doesn't accept surface positivity |

## 2.7.4 Quality Criteria

Measurable standards for Anti-Sycophancy effectiveness:

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Objections per session** | ≥ 2 | Count of distinct objections raised |
| **Critical questions asked** | ≥ 3 | Questions challenging core assumptions |
| **Flip rate** | ≥ 15% | Sessions where initial positive flips to concern |
| **No-objection rate** | < 10% | Sessions with zero pushback (indicates failure) |

**Monitoring:** These metrics are tracked per-test and flagged if quality drops.

## 2.7.5 Input Quality Gates

System warnings for inputs that may compromise validation quality:

| Input Issue | Warning | Suggestion |
|-------------|---------|------------|
| **Vague ICP** | "Your ICP is too broad. Results may not be actionable." | "Try specifying: industry, company size, or role" |
| **Leading hypotheses** | "Your hypothesis contains assumption of success." | "Reframe as 'I believe [X] because [Y]'" |
| **Biased source URL** | "This URL appears promotional. Results may skew positive." | "Consider using customer reviews or forum discussions instead" |
| **Missing problem statement** | "No clear problem defined." | "What pain does your customer experience today?" |

---

# Section 3: Features & Requirements

## Feature Groups Overview

| Group | Name | Features | Phase |
|-------|------|----------|-------|
| 1 | Account & Auth | F-001 to F-005 | Phase 1 |
| 2 | Idea Management | F-006 to F-009 | Phase 1 |
| 3 | Proposal Management | F-010 to F-013 | Phase 1 |
| 4 | ICP Management | F-014 to F-017 | Phase 1 |
| 5 | Validation Testing | F-018 to F-021 | Phase 1 |
| 6 | Reporting | F-022 to F-024 | Phase 1/2 |
| 7 | Billing & Subscription | F-025 to F-028 | Phase 1 |
| 8 | Quick Fire & Entry | F-029 to F-030 | Phase 1 |
| 9 | Advanced Validation | F-031 to F-037 | Phase 2 |

---

## Group 1: Account & Auth (Phase 1)

### F-001: User Registration

| Attribute | Value |
|-----------|-------|
| **Description** | New users select tier, authenticate via OAuth OR email/password, capture payment method |
| **Priority** | Must Have (MVP) |
| **Phase** | Phase 1 |

**Signup Offer Hierarchy (presented in this order):**

| Priority | Offer | Incentive |
|----------|-------|-----------|
| 1st | Annual - Pay Now | 20% off first year |
| 2nd | Annual - 7-day Trial | Card upfront, charged day 8 |
| 3rd | Monthly - Pay Now | 20% off first month |
| 4th | Monthly - 7-day Trial | Card upfront, charged day 8 |

**Acceptance Criteria (GWT):**

| # | Given | When | Then |
|---|-------|------|------|
| 1 | User lands on `/register` | Page loads | Growth tier as default, offers shown in priority order |
| 2 | User views any tier | - | Real Reasons to Believe shown (proof points for that tier's value) |
| 3 | User views Growth | - | FoMo: what they're missing by not selecting Pro |
| 4 | User selects Solo | - | FoMo: what they're missing by not staying at Growth |
| 5 | User selects any offer | They proceed | Auth (OAuth or email/password) → Card capture → Account created |
| 6 | User chooses OAuth | They authenticate | Email and name pulled from provider |
| 7 | User chooses email/password | They enter details | Email, name, password required |
| 8 | Card always captured upfront | Trial selected | Charged on day 8 |
| 9 | Card always captured upfront | Pay Now selected | Charged immediately with discount applied |
| 10 | User completes registration | - | Required consent (ToS, Privacy) acknowledged |
| 11 | Email already exists | User tries to register | Error: "Account exists. Log in instead?" |
| 12 | Incomplete signup | User tries protected pages | Redirected to complete signup |
| 13 | User signs up with email/password | Registration complete | Verification email sent, access blocked until verified |
| 14 | Unverified user tries to access app | - | Redirected to "Check your email" screen with resend option |
| 15 | Verification link expires | User clicks it | "Link expired" + option to resend |
| 16 | Card is declined | User submits payment | Specific error shown, retry allowed (max 3 attempts) |
| 17 | 3 failed payment attempts | User tries again | Progress saved, "Return later" option, no access until card succeeds |
| 18 | No valid card on file | User tries to access app | Blocked, redirected to complete payment |
| 19 | User is on day 5 of trial | - | Email sent: charge date, amount, card last 4, one-click cancel link |
| 20 | Day 8 charge fails | User accesses app | Soft lock: can view history, cannot run new validations, "Update Payment" banner |
| 21 | Charge failed | System retries | Auto-retry at 24h, 48h, 72h with email after each failure |
| 22 | 72h passed, all retries failed | User accesses app | Hard lock: payment screen only, data preserved 30 days |
| 23 | User cancels during trial | They click cancel | Immediate cancellation, card deleted, access until day 7, optional exit survey |
| 24 | User tries OAuth | Email matches existing email/password account | Prompt: "Account exists. Verify password to link [Provider] login." |
| 25 | User verifies password | Linking confirmed | OAuth now available as login method for that account |
| 26 | User tries different OAuth provider | Email matches existing OAuth account | Error: "You signed up with [Original Provider]. Please use that to log in." |
| 27 | User abandons signup mid-flow | They return within 7 days | Resume at last completed step, selections preserved |
| 28 | User abandons signup | 24 hours pass | Abandonment email sent: "Complete your signup" with resume link |
| 29 | Incomplete signup | 7 days pass | Progress cleared, must start fresh |

**Auth Options (MVP):** Google, GitHub, Email/Password

---

### F-002: User Login

| Attribute | Value |
|-----------|-------|
| **Description** | Returning users authenticate to access their account |
| **Priority** | Must Have (MVP) |
| **Phase** | Phase 1 |

**Acceptance Criteria (GWT):**

| # | Given | When | Then |
|---|-------|------|------|
| 1 | User is on `/login` | Page loads | OAuth options (Google/GitHub) and email/password form shown |
| 2 | User clicks OAuth provider | Auth succeeds | Redirected to `/dashboard` |
| 3 | User enters email/password | Credentials valid | Redirected to `/dashboard` |
| 4 | User enters email/password | Credentials invalid | Error: "Invalid email or password" |
| 5 | User signed up with OAuth | They try email/password | Shows "You signed up with [Provider]" + direct button to that provider |
| 6 | User signed up with email | They try OAuth | Shows "Account exists with email/password" + link to password form |
| 7 | 5 failed login attempts | User tries again | Rate limited, temporary lockout, CAPTCHA shown |
| 8 | User clicks "Forgot Password" | They enter email | Password reset link sent (if account exists with email/password) |
| 9 | User signed up with OAuth | They try "Forgot Password" | Message: "You signed up with [Google/GitHub]. Please log in with that provider." |
| 10 | User logs in | "Remember Me" unchecked | Session expires after 24 hours |
| 11 | User logs in | "Remember Me" checked | Session expires after 7 days |
| 12 | User logs in | Multiple devices | Simultaneous sessions allowed |

---

### F-003: User Logout

| Attribute | Value |
|-----------|-------|
| **Description** | Users can securely end their session |
| **Priority** | Must Have (MVP) |
| **Phase** | Phase 1 |

**Acceptance Criteria (GWT):**

| # | Given | When | Then |
|---|-------|------|------|
| 1 | User is logged in | They click "Log out" | Session ended, redirected to `/login` |
| 2 | User is logged in | They click "Log out all devices" (in settings) | All sessions terminated |

---

### F-004: Profile Management

| Attribute | Value |
|-----------|-------|
| **Description** | Users can view and update their account details |
| **Priority** | Must Have (MVP) |
| **Phase** | Phase 1 |

**Acceptance Criteria (GWT):**

| # | Given | When | Then |
|---|-------|------|------|
| 1 | User is on `/settings` | Page loads | Profile info shown: name, email, linked auth method |
| 2 | User wants to edit name | They update and save | Name changed |
| 3 | User wants to change email | They submit new email | Verification sent to new email, change applied after verification |
| 4 | User signed up with OAuth | They view email | Email shown as read-only (managed by provider) |
| 5 | User wants to delete account | They click "Delete account" | Confirmation required, data export offered first, then deletion |
| 6 | User confirms deletion | - | All data deleted within 30 days per GDPR, confirmation email sent |
| 7 | User is on `/settings` | Page loads | Current tier shown with usage stats (e.g., "3/10 ideas", "15/30 tests this month") |
| 8 | User wants to manage billing | They click billing link | Redirected to `/settings/billing` |
| 9 | User signed up with email/password | They want to change password | Must enter current password, then new password |
| 10 | Password change succeeds | - | Confirmation email sent, all other sessions optionally logged out |
| 11 | User wants to add/change avatar | They upload image | Image cropped/resized, saved to profile |
| 12 | User signed up with OAuth | Page loads | Avatar pulled from OAuth provider by default (can override) |
| 13 | User requests data export | Export generated | Includes: ideas, proposals, ICPs, validation results, reports |
| 14 | Export ready | User notified | Download available in JSON + PDF summary, link valid for 7 days |
| 15 | User views sessions | `/settings` security section | List of active sessions: device, location, last active |
| 16 | User revokes a session | They click "Sign out" on a session | That session terminated immediately |
| 17 | User confirms account deletion | Has active subscription | Stripe subscription auto-cancelled, no further charges |
| 18 | User changes mind | Within 30-day deletion window | Can cancel deletion request, account restored |

---

### F-005: Onboarding Flow

| Attribute | Value |
|-----------|-------|
| **Description** | First-run experience guiding new users to their first validation via Quick Fire Mode |
| **Priority** | Must Have (MVP) |
| **Phase** | Phase 1 |
| **Target** | First Risk Score in ≤60 seconds, first full verdict in ≤10 minutes |

**Acceptance Criteria (GWT):**

| # | Given | When | Then |
|---|-------|------|------|
| 1 | New user completes registration | First login | Redirected to `/onboarding` with Quick Fire Mode |
| 2 | User is on onboarding | Page loads | Quick Fire Mode: single text input for idea description |
| 3 | User enters idea (1-2 sentences) | They submit | Risk Score generated within 60 seconds |
| 4 | Risk Score generated | - | Shows score (1-100), key counter-argument, and "Go Deeper" CTA |
| 5 | User clicks "Go Deeper" | - | Data carries over to create full Idea + Proposal |
| 6 | User skips onboarding | They click "Skip" | Goes to dashboard, can access Quick Fire from menu |
| 7 | User returns incomplete | Next login | Resumes onboarding where they left off |
| 8 | User completes full validation | They see Kill/Pivot/Build verdict | Onboarding marked complete, redirected to full report |
| 9 | AI generates proposal from Quick Fire | User reviews | Can confirm as-is or edit fields |
| 10 | Proposal confirmed | AI generates ICPs | 3 ICP options presented based on problem |
| 11 | User selects ICP | - | Can use as-is or customize |
| 12 | Progress indicator | Throughout onboarding | Shows current step and estimated time |
| 13 | User triggers validation | Processing starts | Progress states shown: "Generating personas...", "Running conversations...", "Analyzing results..." |
| 14 | Validation processing | - | Estimated wait time displayed |
| 15 | Validation fails | Error occurs | Clear message + "Retry" button + support contact |
| 16 | Verdict is inconclusive | Low confidence result | Suggests: "Add more detail to your ICP" or "Clarify your problem statement" |

---

## Group 2: Idea Management (Phase 1)

### F-006: Create Idea

| Attribute | Value |
|-----------|-------|
| **Description** | Users can create a new idea to validate |
| **Priority** | Must Have (MVP) |
| **Phase** | Phase 1 |

**Acceptance Criteria (GWT):**

| # | Given | When | Then |
|---|-------|------|------|
| 1 | User is on `/dashboard` or `/ideas` | They click "New Idea" | Idea creation form shown |
| 2 | User enters idea name | They submit | Idea created, redirected to idea detail page |
| 3 | User is at tier limit | They try to create new idea | Blocked with message: "Upgrade to add more ideas" + upgrade link |
| 4 | User creates idea | - | Prompted to create first Proposal for this idea |
| 5 | User submits idea | Name is blank or < 3 chars or > 100 chars | Validation error shown, form not submitted |
| 6 | User creates idea | Name matches existing idea | Allowed - duplicate names permitted |
| 7 | User is on create idea form | They click "Cancel" | Returns to previous page, no idea created |
| 8 | User creates idea | Now at tier limit | Notice shown: "You've used all X idea slots. Upgrade for more." |
| 9 | User submits idea | Creation in progress | Loading indicator shown |
| 10 | API error occurs | Creation fails | Toast with error message + retry option, form data preserved |

---

### F-007: View Ideas List

| Attribute | Value |
|-----------|-------|
| **Description** | Users can view all their ideas |
| **Priority** | Must Have (MVP) |
| **Phase** | Phase 1 |

**Acceptance Criteria (GWT):**

| # | Given | When | Then |
|---|-------|------|------|
| 1 | User navigates to `/ideas` | Page loads | List of all user's ideas shown |
| 2 | User has ideas | List displays | Each idea shows: name, created date, Quick Fire score (if any), proposal count, latest verdict (if any) |
| 3 | User has no ideas | List displays | Empty state with "Create your first idea" CTA |
| 4 | User clicks an idea | - | Navigates to idea detail page |
| 5 | User navigates to `/ideas` | Page loading | Loading spinner shown |
| 6 | API fails | Error occurs | Error message with retry button |
| 7 | User is at tier limit | List displays | "New Idea" button disabled or replaced with "Upgrade to add more" |
| 8 | List displays | Default state | Sorted by last updated (descending) |
| 9 | User wants to filter | Filter options shown | Can filter by verdict status (Kill/Pivot/Build/Not tested) |
| 10 | List displays | Each idea shows | Proposal count with status (e.g., "2 tested, 1 pending") |
| 11 | Idea has tested proposals | - | Overall health indicator shown (e.g., all Kill = red, has Build = green) |
| 12 | Idea name > 40 characters | List displays | Name truncated with ellipsis, full name on hover |

---

### F-008: View Idea Detail

| Attribute | Value |
|-----------|-------|
| **Description** | Users can view a single idea with its proposals |
| **Priority** | Must Have (MVP) |
| **Phase** | Phase 1 |

**Acceptance Criteria (GWT):**

| # | Given | When | Then |
|---|-------|------|------|
| 1 | User navigates to `/ideas/:id` | Page loads | Idea name, created date, Quick Fire results (if any), and list of proposals shown |
| 2 | Idea has Quick Fire results | - | Shows Risk Score and key objection from Quick Fire |
| 3 | Idea has proposals | List displays | Each proposal shows: status, latest verdict, last updated |
| 4 | Idea has no proposals | - | Empty state with "Create your first proposal" CTA |
| 5 | User clicks a proposal | - | Navigates to proposal detail page |
| 6 | User clicks "New Proposal" | - | Navigates to proposal creation |
| 7 | User navigates to `/ideas/:id` | Page loading | Loading skeleton shown |
| 8 | Idea not found or no access | - | Redirect to `/ideas` with toast: "Idea not found" |
| 9 | Proposals list displays | Each proposal shows | Summary snippet, iteration count (e.g., "Iteration 3"), status, verdict |
| 10 | User is on `/ideas/:id` | Page displays | Breadcrumb shown: "Ideas > [Idea Name]" |
| 11 | Page displays | Idea has proposals | Shows progress: "X of Y proposals tested" |
| 12 | User clicks actions menu | - | Options shown: Edit name, Archive idea, Delete idea |
| 13 | User clicks "Edit name" | - | Inline edit or modal to update idea name |
| 14 | User clicks "Archive idea" | - | Idea moved to archived state, removed from active list |
| 15 | User clicks "Delete idea" | - | Confirmation required, then idea and all proposals permanently deleted |

---

### F-009: Edit Idea

| Attribute | Value |
|-----------|-------|
| **Description** | Users can update an idea's name |
| **Priority** | Must Have (MVP) |
| **Phase** | Phase 1 |

**Acceptance Criteria (GWT):**

| # | Given | When | Then |
|---|-------|------|------|
| 1 | User clicks "Edit name" on idea | - | Inline edit field or modal shown |
| 2 | User updates name and saves | Valid name | Name updated, success toast shown |
| 3 | User updates name | Invalid (blank or too short/long) | Validation error, save blocked |
| 4 | User cancels edit | - | Original name preserved |

---

## Group 3: Proposal Management (Phase 1)

### F-010: Create Proposal

| Attribute | Value |
|-----------|-------|
| **Description** | Users can create a new proposal for an idea |
| **Priority** | Must Have (MVP) |
| **Phase** | Phase 1 |

**Acceptance Criteria (GWT):**

| # | Given | When | Then |
|---|-------|------|------|
| 1 | User is on idea detail page | They click "New Proposal" | Proposal creation form shown |
| 2 | User fills required fields | They submit | Proposal created in Draft status, redirected to proposal view |
| 3 | Required fields | - | Problem, current_workarounds, solution, hypotheses |
| 4 | Optional fields | - | Pricing_assumption, competitors, supporting context |
| 5 | User submits | Missing required fields | Validation errors shown |
| 6 | User clicks "New Proposal" | - | Two options shown: "Start from scratch" or "Import from document" |
| 7 | Field limits | Problem | 100-1,000 chars |
| 8 | Field limits | Solution | 100-750 chars |
| 9 | Field limits | Hypotheses | 50-1,500 chars (multiple allowed) |
| 10 | Field limits | Current workarounds | 50-750 chars |
| 11 | Field limits | Supporting Context (optional) | Up to 2,000 chars |
| 12 | User selects "Import from document" | - | Upload accepts PDF, DOCX, TXT, MD or paste text |
| 13 | Document uploaded | AI processes | Fields auto-populated, user reviews/edits |
| 14 | Import mode | User chooses | Auto (all at once) or Engaged (field by field) |
| 15 | User enters hypotheses | - | Multiple items, add/remove dynamically |
| 16 | Hypotheses format | - | "I believe [assumption]" - min 1, max 5 hypotheses |
| 17 | User tries to submit | Less than 1 hypothesis | Validation error: "Add at least one hypothesis" |
| 18 | User is editing proposal | Every 30 seconds | Auto-save draft, subtle "Saved" indicator |
| 19 | User wants to save manually | Clicks "Save Draft" | Draft saved, confirmation shown |
| 20 | User navigates away | Unsaved changes exist | Warning: "You have unsaved changes. Leave anyway?" |
| 21 | User is typing | - | Subtle character count shown (e.g., "342 / 1,500") |
| 22 | User leaves a field | Field is empty (required) or over limit | Inline error shown below field |
| 23 | User clicks submit | Validation errors exist | Summary at top, scroll to first error |
| 24 | User creates proposal | Success | Redirect to proposal detail, toast: "Proposal created" (3s) |
| 25 | User lands on proposal detail | ICP exists | Primary CTA: "Run Validation" |
| 26 | User lands on proposal detail | No ICP exists | CTA: "Add ICP to Validate" → quick ICP setup flow |

---

### F-011: View Proposal

| Attribute | Value |
|-----------|-------|
| **Description** | Users can view a proposal's details and status |
| **Priority** | Must Have (MVP) |
| **Phase** | Phase 1 |

**Acceptance Criteria (GWT):**

| # | Given | When | Then |
|---|-------|------|------|
| 1 | User navigates to `/proposals/:id` | Page loads | All proposal fields shown: problem, solution, hypotheses, workarounds, optional fields |
| 2 | Proposal has been tested | - | Latest verdict (Kill/Pivot/Build) and confidence score displayed |
| 3 | Proposal has iterations | - | Iteration history shown with previous verdicts |
| 4 | User views proposal | - | Current status badge shown (Draft, Submitted, Testing, Tested, Archived) |
| 5 | Page displays | - | Breadcrumb: "Ideas > [Idea Name] > [Proposal snippet]" |
| 6 | Proposal is Draft | - | Actions: Edit, Run Validation |
| 7 | Proposal is Tested | - | Actions: Edit, Re-run Validation, View Report |
| 8 | Proposal is Archived | - | Actions: View Report only (editing disabled) |
| 9 | Proposal is Testing | - | Actions disabled, status indicator: "Validation in progress..." |
| 10 | User navigates to `/proposals/:id` | Page loading | Loading skeleton shown |
| 11 | Proposal not found | - | Redirect to `/ideas` with toast: "Proposal not found" |
| 12 | User lacks permission | - | "Access denied" message, link to dashboard |
| 13 | Proposal has no iterations | - | Shows "Version 1" label (no history section) |
| 14 | No ICPs linked | - | Prompt: "Add ICP to validate" with CTA |
| 15 | No validation reports yet | - | Prompt: "Run your first validation" with CTA |
| 16 | Proposal has ICPs | - | ICPs section shows each ICP name, click to expand details |
| 17 | Proposal has validation history | - | Tests listed: date, verdict, confidence, link to full report |
| 18 | User views on mobile | - | Verdict score prominent at top |
| 19 | User views on mobile | - | Iteration history collapsible (accordion) |
| 20 | User views on mobile | - | Actions in sticky footer |

---

### F-012: Edit Proposal

| Attribute | Value |
|-----------|-------|
| **Description** | Users can update a proposal's content |
| **Priority** | Must Have (MVP) |
| **Phase** | Phase 1 |

**Acceptance Criteria (GWT):**

| # | Given | When | Then |
|---|-------|------|------|
| 1 | User clicks "Edit" on proposal | - | Edit form shown with current values |
| 2 | User updates fields and saves | Valid content | Changes saved, success toast |
| 3 | User saves after proposal was tested | - | New iteration created, previous verdict preserved in history |
| 4 | User cancels edit | - | Changes discarded, return to view |
| 5 | Proposal is Archived | User tries to edit | Edit blocked, message: "Unarchive to edit" |
| 6 | Same validation rules as create | - | Character limits, required fields, inline validation |
| 7 | Proposal has 10 iterations | User tries to edit | Blocked, message: "Maximum iterations reached. Archive this proposal and create a new one." |
| 8 | User is editing | Every 30 seconds | Auto-save draft, "Saved" indicator |
| 9 | User returns after crash/close | Unsaved draft exists | Prompt: "Recover unsaved changes?" with Restore/Discard options |
| 10 | User saves after proposal was tested | Before confirming | Summary of changes shown: "You're changing: [field list]" |
| 11 | User views iteration history | - | Each iteration shows diff: "Changed: problem, hypotheses" |
| 12 | User saves | Proposal modified elsewhere since load | Warning: "Proposal was modified elsewhere. Overwrite or reload?" |
| 13 | Proposal has test in progress | User clicks Edit | Warning: "Changes won't affect the test in progress. Edits will apply to next test." |

---

### F-013: Archive/Delete Proposal

| Attribute | Value |
|-----------|-------|
| **Description** | Users can archive or delete proposals |
| **Priority** | Must Have (MVP) |
| **Phase** | Phase 1 |

**Acceptance Criteria (GWT):**

| # | Given | When | Then |
|---|-------|------|------|
| 1 | User clicks "Archive" on proposal | - | Proposal status → Archived, removed from active list |
| 2 | Proposal is Archived | User clicks "Unarchive" | Proposal status → Draft, returned to active list |
| 3 | User clicks "Delete" on proposal | - | Confirmation required: "Delete permanently? This cannot be undone." |
| 4 | User confirms delete | - | Proposal and all iterations/reports permanently deleted |
| 5 | Proposal has test in progress | User tries to archive/delete | Blocked: "Wait for test to complete" |
| 6 | Proposal deleted | Someone visits shared report link | Message: "This report is no longer available" (not generic 404) |
| 7 | User wants to view archived | Filter on Ideas/Proposals list | Options: Active (default), Archived, All |
| 8 | User selects "Archived" filter | - | Shows archived proposals with "Unarchive" option |
| 9 | User wants to archive/delete | - | Single proposal operations only (no bulk selection in MVP) |
| 10 | User clicks delete | Proposal has reports | Confirmation includes: "Download report before deleting" link |
| 11 | User archives proposal | - | Idea slot freed immediately, no refresh required |

---

## Group 4: ICP Management (Phase 1)

### F-014: Create ICP

| Attribute | Value |
|-----------|-------|
| **Description** | Users can create an Ideal Customer Profile for a proposal |
| **Priority** | Must Have (MVP) |
| **Phase** | Phase 1 |

**Acceptance Criteria (GWT):**

| # | Given | When | Then |
|---|-------|------|------|
| 1 | User is on proposal detail | They click "Add ICP" | ICP creation form shown |
| 2 | User fills required fields | They submit | ICP created, linked to proposal |
| 3 | Required fields | - | Name, demographics, psychographics, pain_intensity |
| 4 | Optional fields | - | Context, current_solutions, decision_role, adoption_tendency |
| 5 | User submits | Missing required fields | Validation errors shown |
| 6 | ICP created | - | Redirected to proposal detail, ICP visible in ICPs section |
| 7 | User views form | Demographics field | Inline hint: "Age, role, industry, company size" |
| 8 | User views form | Psychographics field | Inline hint: "Values, motivations, fears, goals" |
| 9 | User wants structure | - | Optional sub-fields for common attributes (expandable) |
| 10 | Proposal has no ICPs | User views proposal | Empty state: "Add your first ICP to start validation" with prominent CTA |
| 11 | User leaves a field | Required field empty or over limit | Inline error below field |
| 12 | Field limits | Demographics, psychographics | 50-500 chars each |
| 13 | Field limits | Context, current_solutions | 50-300 chars each |
| 14 | User creates ICP | Name or demographics similar to existing ICP | Warning: "This looks similar to [existing ICP]. Create anyway?" with Continue/Cancel |
| 15 | ICP created | Success | Toast: "ICP created" then redirect to proposal detail |
| 16 | User clicks Cancel | Form is empty | Return to proposal detail immediately |
| 17 | User clicks Cancel | Form has data | Confirm: "Discard changes?" with Leave/Stay options |

---

### F-015: View ICP

| Attribute | Value |
|-----------|-------|
| **Description** | Users can view an ICP's details |
| **Priority** | Must Have (MVP) |
| **Phase** | Phase 1 |

**Acceptance Criteria (GWT):**

| # | Given | When | Then |
|---|-------|------|------|
| 1 | User clicks ICP on proposal detail | - | ICP details expand inline or open detail view |
| 2 | ICP details shown | - | All fields visible: name, demographics, psychographics, pain_intensity, context, current_solutions, decision_role, adoption_tendency |
| 3 | ICP has been used in tests | - | Shows: "Used in X validations" with links to reports |
| 4 | User views ICP | - | Actions available: Edit, Delete |
| 5 | User clicks ICP name | - | Inline expand showing all fields |
| 6 | User wants full view | Clicks "View Details" | Opens dedicated ICP detail page |
| 7 | ICP expanding/loading | - | Loading skeleton shown |
| 8 | ICP has no validations | - | "No validations yet" with "Run first test" CTA |
| 9 | ICP details display | - | Fields grouped: "Who" (demographics, psychographics), "Problem" (pain_intensity, current_solutions, context), "Behavior" (decision_role, adoption_tendency) |
| 10 | User clicks Delete | ICP used in validations | Confirmation: "This ICP was used in X validations. Reports will remain but ICP details will be removed." Proceed/Cancel |
| 11 | User clicks Delete | ICP never used | Simple confirmation: "Delete this ICP?" |
| 12 | ICP details display | - | Shows "Created [date]" and "Last used [date]" |
| 13 | User is on ICP detail view | - | Breadcrumb: "Proposal > [ICP Name]" |

---

### F-016: Edit ICP

| Attribute | Value |
|-----------|-------|
| **Description** | Users can update an ICP's details |
| **Priority** | Must Have (MVP) |
| **Phase** | Phase 1 |

**Acceptance Criteria (GWT):**

| # | Given | When | Then |
|---|-------|------|------|
| 1 | User clicks "Edit" on ICP | - | Edit form shown with current values |
| 2 | User updates fields and saves | Valid content | Changes saved, success toast |
| 3 | User cancels edit | - | Changes discarded, return to view |
| 4 | Same validation rules as create | - | Character limits, required fields, inline validation |
| 5 | ICP has been used in tests | User edits | Warning: "This ICP was used in previous validations. Edits won't affect past results." |
| 6 | User saves edited ICP | Fields now similar to another ICP | Warning: "This now looks similar to [other ICP]. Save anyway?" |
| 7 | User clicks Cancel | Form has unsaved changes | Confirm: "Discard changes?" with Discard/Keep Editing options |
| 8 | User saves | Save in progress | Loading indicator shown |
| 9 | Save fails | Network/API error | Error toast with retry option, form data preserved |
| 10 | User opens edit form | ICP used in tests | Warning banner at top: "This ICP was used in previous validations. Edits won't affect past results." |

---

### F-017: Delete ICP

| Attribute | Value |
|-----------|-------|
| **Description** | Users can delete an ICP |
| **Priority** | Must Have (MVP) |
| **Phase** | Phase 1 |

**Acceptance Criteria (GWT):**

| # | Given | When | Then |
|---|-------|------|------|
| 1 | User clicks "Delete" on ICP | ICP never used | Simple confirmation: "Delete this ICP?" |
| 2 | User clicks "Delete" on ICP | ICP used in validations | Confirmation with consequences: "Used in X validations. Reports remain but ICP details removed." |
| 3 | User confirms delete | - | ICP deleted, success toast, return to proposal detail |
| 4 | User cancels delete | - | Nothing happens, dialog closes |
| 5 | Proposal has only 1 ICP | User deletes it | Allowed - proposal returns to "no ICP" empty state |
| 6 | User wants to delete | ICP inline expand | Delete icon button available |
| 7 | User wants to delete | ICP detail view | Delete in actions menu |
| 8 | User confirms delete | Deletion in progress | Button disabled, spinner shown |
| 9 | Delete fails | Network/API error | Error toast with retry option, dialog remains open |
| 10 | Report displays | ICP was deleted after validation | Shows original ICP data (snapshot), marked "[ICP since deleted]" |

---

## Feature Group 5: Validation Testing (Phase 1)

### F-018: Configure & Start Validation Test

| Attribute | Value |
|-----------|-------|
| **Description** | Users configure and initiate a validation test for their proposal |
| **Priority** | Must Have (MVP) |
| **Phase** | Phase 1 |

**Acceptance Criteria (GWT):**

| # | Given | When | Then |
|---|-------|------|------|
| 1 | User is on proposal detail (status: Draft or Tested) | They click "Run Validation" | Test configuration screen shown |
| 2 | User is on test config | They see ICP selection | All proposal ICPs shown with checkboxes, all selected by default |
| 3 | User is on test config | No ICPs exist for proposal | Prompt: "Add at least one ICP before running a test" with link to create |
| 4 | User is on test config | They see mode selection | Options: "Interactive" (default, recommended) or "Spectator" with descriptions |
| 5 | User is on test config | They see persona count | Default shown (e.g., 5 personas per ICP), adjustable within tier limits |
| 6 | User is on test config | They click "Start Test" | Personas generated, test created with status "Pending", user redirected to active test view |
| 7 | User starts test | Persona generation begins | Loading state: "Generating personas from your ICPs..." |
| 8 | User starts test | Persona generation completes | Test status changes to "In Progress", sessions created |
| 9 | User starts test | Persona generation fails | Error message with retry option |
| 10 | User is on test config | They click "Cancel" | Return to proposal detail, nothing saved |
| 11 | User has test in progress for this proposal | They try to start another | Blocked: "A test is already in progress" with link to view it |
| 12 | User has used all tests for billing period | They click "Run Validation" | Blocked: "You've used all X tests this month. Upgrade or wait until [date]" with upgrade CTA |
| 13 | User is on test config | They would exceed remaining quota | Warning shown with remaining count; "Start Test" disabled if over limit |
| 14 | User is on test config | They adjust ICP selection or persona count | Live update: "This will use X of Y remaining tests" + estimated duration |
| 15 | Persona generation is in progress | User navigates away | Confirmation modal; generation continues in background |
| 16 | User left during generation | They return to proposal | Banner: "Test preparation in progress" with link to active test |
| 17 | User is on test config | They deselect one or more ICPs | Summary: "Testing with 2 of 3 ICPs" |
| 18 | User is on mobile | They view test config | 44px touch targets; stepper for persona count |
| 19 | User is on test config | They see test identification | Auto-name (e.g., "Test #3 - Jan 17") with optional rename |

---

### F-019: View Active Test

| Attribute | Value |
|-----------|-------|
| **Description** | Users monitor their running validation test and access sessions |
| **Priority** | Must Have (MVP) |
| **Phase** | Phase 1 |

**Acceptance Criteria (GWT):**

| # | Given | When | Then |
|---|-------|------|------|
| 1 | User navigates to `/tests/:id` | Test exists | Test overview shown: name, proposal link, status, start time |
| 2 | Test is in progress | Page loads | List of all sessions with status indicators (Pending, Active, Completed) |
| 3 | Test is in progress | Sessions are pending | "Waiting to start" shown for each pending session |
| 4 | Test is in progress | A session becomes active | Session card highlights, "Join" button appears (Interactive) or "Watch" (Spectator) |
| 5 | User views session list | Each session | Shows persona summary (demographics snippet, key traits) |
| 6 | Test is in progress | User views page | Progress bar: "3 of 10 sessions complete" |
| 7 | Test completes | All sessions done | Status changes to "Completed", "View Report" CTA appears |
| 8 | User clicks "View Report" | Report exists | Redirected to `/reports/:id` |
| 9 | Test is in progress | User clicks "Cancel Test" | Confirmation: "Cancel this test? Completed sessions will be saved." |
| 10 | User confirms cancel | - | Test status → Cancelled, partial results available if any sessions completed |
| 11 | User views completed session | - | Shows verdict for that session (need validated, solution resonated indicators) |
| 12 | Page loads | - | Breadcrumb: "Ideas > [Idea] > [Proposal] > Test #X" |
| 13 | Test is in progress | Page is open | Session statuses update automatically within 5 seconds |
| 14 | User's browser loses connection | Connection restored | Page re-syncs without manual refresh |
| 15 | User was in Interactive session | Returns after closing browser | Banner: "You have an active session" with "Resume" if not expired |
| 16 | User returns to test page | Their session expired while away | Shows "Expired" with explanation: "Timed out after 15 minutes of inactivity" |
| 17 | A session fails (AI error, timeout) | User views session list | Error indicator with "Retry" option |
| 18 | Multiple sessions fail | 3+ failures | Test pauses, user notified: "Test paused due to errors. Resume or cancel?" |
| 19 | Test is in progress | User views page | Estimated time remaining shown |
| 20 | Test is in progress | User views page | Elapsed time shown: "Running for X minutes" |
| 21 | User navigates to `/tests/:id` | Test not found or no access | Error page with link back to Ideas |
| 22 | Test exists | Zero sessions (edge case) | Message: "No sessions configured" with support contact |

---

### F-020: Interactive Session

| Attribute | Value |
|-----------|-------|
| **Description** | User participates in a live conversation with an AI persona (default experience) |
| **Priority** | Must Have (MVP) |
| **Phase** | Phase 1 |

**Acceptance Criteria (GWT):**

| # | Given | When | Then |
|---|-------|------|------|
| 1 | User clicks "Join" on active session | Session loads | Chat interface shown with persona introduction |
| 2 | Session starts | Persona introduces itself | Opening message based on persona traits and ICP context |
| 3 | User is in session | They type a message | Send button enabled; Enter to send |
| 4 | User sends message | AI processes | Typing indicator shown, then persona response appears |
| 5 | User is in session | - | Persona info visible (name, key traits summary) |
| 6 | User is in session | - | Proposal summary visible for reference (collapsible) |
| 7 | Conversation progresses | Persona challenges assumptions | Anti-sycophancy behavior: pushback on weak points |
| 8 | Session nearing end | Enough data gathered | Persona signals wrap-up: "Based on our conversation..." |
| 9 | Session completes | AI finishes | Session status → Completed, summary shown, "Return to Test" button |
| 10 | User clicks "Return to Test" | - | Redirected to `/tests/:id` |
| 11 | User is inactive | 15 minutes pass | Warning: "Session will expire in 2 minutes" |
| 12 | User remains inactive | Timeout reached | Session expires, status → Expired |
| 13 | User is in active session | They click "End Session Early" | Confirmation: "End now? Partial insights will be saved." |
| 14 | User confirms early end | - | Status → Abandoned, partial data saved, redirect to test view with "Incomplete" badge |
| 15 | User sends message | AI fails to respond within 30 seconds | "Response delayed. Retrying..." with auto-retry (max 2) |
| 16 | AI fails after retries | - | "Something went wrong. Your conversation is saved." Options: "Try Again" / "End Session" |
| 17 | User is in session | Network connection lost | Banner: "Connection lost. Reconnecting..." Messages queued locally |
| 18 | Connection restored | - | Queued messages sent automatically, banner dismissed |
| 19 | Connection not restored in 2 min | - | Modal: "Still offline. Session paused - progress saved." |
| 20 | User is in session | Hasn't typed for 60s (first 3 messages) | Subtle prompt: "Try describing the problem you're solving..." |
| 21 | User starts typing | Prompt shown | Prompt fades out |
| 22 | User types message | Exceeds 1,000 chars | Counter turns red, send disabled |
| 23 | User attempts to send | Under 10 chars | Allowed (short responses like "Yes" valid) |
| 24 | User navigates with keyboard | Tab through interface | Focus order: Persona → Proposal toggle → Chat → Input → Send |
| 25 | Screen reader user | New message arrives | Announced via ARIA live region |
| 26 | User is on mobile | Keyboard opens | Chat scrolls to keep input visible |

---

### F-021: Spectator Session (Updated)

| Attribute | Value |
|-----------|-------|
| **Description** | **Optional mode** where user watches AI-driven validation with Nudge Button intervention capability |
| **Priority** | Must Have (MVP) |
| **Phase** | Phase 1 (basic), Phase 2 (Nudge Buttons) |

**Key Update:** Spectator Mode is a powerful option for hands-off validation, not a fallback. Interactive Mode remains the default experience.

**Acceptance Criteria (GWT):**

| # | Given | When | Then |
|---|-------|------|------|
| 1 | User clicks "Watch" on active session | Session loads | Read-only chat interface shown with Nudge Buttons (Phase 2) |
| 2 | Session starts in Spectator mode | - | AI simulates both sides: persona questions + synthesized user responses based on proposal |
| 3 | User is watching | Conversation progresses | Messages appear in real-time with typing indicators |
| 4 | User is watching | - | Persona info visible (name, key traits) |
| 5 | User is watching | - | Proposal summary visible (collapsible) |
| 6 | Spectator session | - | Nudge Buttons shown: **Pause**, **Dig Deeper**, **Move On** (Phase 2) |
| 7 | User clicks "Pause" | - | Conversation pauses, user can review, click "Resume" to continue |
| 8 | User clicks "Dig Deeper" | - | Interviewer asks follow-up probing questions on current topic |
| 9 | User clicks "Move On" | - | Interviewer transitions to next assumption/topic |
| 10 | Session completes | AI finishes | Summary shown, "Return to Test" button |
| 11 | User clicks "Return to Test" | - | Redirected to `/tests/:id` |
| 12 | User is watching | They want to leave early | "Leave Session" button available (no data loss since AI-driven) |
| 13 | User leaves early | - | Conversation continues in background, marked complete when done |
| 14 | User is watching | Messages appear | Persona messages styled distinctly from synthesized responses (different colors, clear labels) |
| 15 | User left session running | They return to test view | "Resume Watching" shown with message count since they left |
| 16 | Spectator session running | AI fails mid-conversation | Session paused, user notified, "Retry" option; partial results preserved |
| 17 | User has multiple tests | They start several Spectator sessions | Sessions run concurrently; dashboard shows progress for each |
| 18 | User left session running | Session completes | In-app badge/toast when user returns; summary accessible from test page |

---

## Feature Group 6: Reporting (Phase 1/2)

### F-022: View Report (Updated with Assumption Board)

| Attribute | Value |
|-----------|-------|
| **Description** | Users view the validation report with verdict, Assumption Board, and Reality Check Panel |
| **Priority** | Must Have (MVP) |
| **Phase** | Phase 1 (basic), Phase 2 (Assumption Board, Reality Check Panel) |

**Acceptance Criteria (GWT):**

| # | Given | When | Then |
|---|-------|------|------|
| 1 | User navigates to `/reports/:id` | Report exists | Report overview shown: verdict (Kill/Pivot/Build), confidence score (High/Medium/Low) |
| 2 | User views report | - | Verdict displayed prominently with color coding (Red/Amber/Green) |
| 3 | User views report | - | **Assumption Board** shown: each assumption with evidence, confidence score, recommended action (Phase 2) |
| 4 | User views report | - | Need validation summary: evidence for/against the problem being real |
| 5 | User views report | - | Solution resonance summary: evidence for/against the solution |
| 6 | User views report | - | Key objections list from all sessions |
| 7 | User views report | - | **Reality Check Panel**: Minimum real-world validation steps (Phase 2) |
| 8 | User views report | - | Recommendations section: AI-generated next steps based on verdict |
| 9 | User views report | - | Session breakdown: individual session results expandable |
| 10 | User expands session | - | Shows persona details, conversation highlights, session-level score |
| 11 | User views report | - | Proposal snapshot shown (version tested, not current) |
| 12 | User views report | - | ICP snapshot shown (as tested, marked if since deleted) |
| 13 | User views report | - | Breadcrumb: "Ideas > [Idea] > [Proposal] > Report" |
| 14 | User views report | Test was cancelled | Partial results shown with "Incomplete" badge |
| 15 | User views report | - | Actions: Share, Download, "Edit Proposal & Retest" |
| 16 | User navigates to report | Still generating | Loading state: "Analyzing session 2 of 5..." |
| 17 | User navigates to report | Generation failed | Error state with retry button and support link |
| 18 | User views report | Proposal tested before | "Compare with previous" link; highlights changes in verdict/confidence |
| 19 | User views report | - | Key quotes section: 2-3 impactful quotes, attributed to persona, individually shareable |
| 20 | User views on mobile | - | Sticky header with verdict + confidence; sections collapsed by default |
| 21 | User views report | - | Metadata: generation timestamp, test duration, sessions completed, proposal version |
| 22 | User views report | No objections raised | Empty state: "No objections - all personas accepted the solution" |
| 23 | User clicks Share | - | Modal: copy link, generate PDF, email; shared view is read-only with branding |
| 24 | User views Assumption Board | - | Each assumption row shows: statement, confidence %, evidence for/against, recommended action |
| 25 | User views Reality Check Panel | - | Shows 3-5 concrete real-world validation steps with estimated effort |

---

### F-023: Share Report

| Attribute | Value |
|-----------|-------|
| **Description** | Users share reports via public links with stakeholders |
| **Priority** | Must Have (MVP) |
| **Phase** | Phase 2 |

**Acceptance Criteria (GWT):**

| # | Given | When | Then |
|---|-------|------|------|
| 1 | User clicks "Share" on report | - | Share modal opens with options |
| 2 | User is in share modal | - | Option: "Copy link" - generates public URL |
| 3 | User copies link | - | Link copied to clipboard, confirmation shown |
| 4 | Anyone visits shared link | Link valid | Read-only report view with PlebTest branding |
| 5 | Shared report view | - | Shows verdict, evidence, recommendations (same content as owner view) |
| 6 | Shared report view | - | No edit actions visible; "Get your own report" CTA |
| 7 | User is in share modal | - | Option: Toggle link on/off (enable/disable sharing) |
| 8 | User disables sharing | Someone visits old link | "This report is no longer shared" message |
| 9 | User is in share modal | - | Shows link status: "Shared" or "Not shared" |
| 10 | User shares report | Proposal/report archived | Shared link still works (historical data) |
| 11 | User is in share modal | - | Option: "Hide proposal details" toggle |
| 12 | Viewer opens shared link | "Hide proposal details" enabled | Proposal text shows "[Details hidden by owner]" |
| 13 | User is in share modal | - | Expiration dropdown: Never, 7 days, 30 days, Custom |
| 14 | Anyone visits shared link | Link expired | "This link has expired" with "Get your own report" CTA |
| 15 | User views share modal | Expiration set | Shows expiration date; option to extend/remove |
| 16 | User opens share modal | Link shared | Shows view count and "Last viewed: [timestamp]" |
| 17 | User clicks "View details" | - | Shows list of view timestamps (anonymous) |
| 18 | Shared report page loads | - | noindex, nofollow meta tags; excluded from sitemap |
| 19 | Search engine crawls | - | Robots.txt blocks /shared/* paths |
| 20 | User on mobile | Opens share modal | "Share via..." opens native OS share sheet |
| 21 | User on desktop | Opens share modal | Quick buttons: "Email" (pre-filled mailto), "Copy link" |

---

### F-024: Download Report

| Attribute | Value |
|-----------|-------|
| **Description** | Users download reports as PDF or JSON for offline use |
| **Priority** | Must Have (MVP) |
| **Phase** | Phase 1 |

**Acceptance Criteria (GWT):**

| # | Given | When | Then |
|---|-------|------|------|
| 1 | User clicks "Download" on report | - | Download options shown |
| 2 | User selects PDF | - | PDF generation begins, progress indicator shown |
| 3 | PDF generates | Success | Browser downloads file: "PlebTest-Report-[IdeaName]-[Date].pdf" |
| 4 | PDF content | - | Includes: verdict, confidence, evidence summaries, key objections, recommendations |
| 5 | PDF content | - | Includes: proposal snapshot, ICP snapshot |
| 6 | PDF content | - | Includes: session breakdown with highlights |
| 7 | PDF content | - | Includes: Assumption Board (Phase 2) |
| 8 | PDF content | - | Includes: Reality Check Panel (Phase 2) |
| 9 | PDF content | - | PlebTest branding/footer with generation timestamp |
| 10 | PDF generation | Fails | Error message with retry option |
| 11 | User on mobile | Clicks Download | PDF opens in new tab (mobile browser behavior) |
| 12 | Report is incomplete | User downloads | PDF marked "INCOMPLETE - Partial Results" |
| 13 | Report has 20+ sessions | PDF generation starts | Async generation: "We'll notify you when ready"; link sent via email |
| 14 | PDF is generated | User prints | Proper page breaks; section headers not orphaned; major sections start new page |
| 15 | User clicks Download | - | Options: PDF (default), JSON (structured data with all metrics) |
| 16 | Generated PDF | Any size | Capped at 10MB; if exceeded, offer "Summary PDF" with highlights only |
| 17 | User wants external sharing | Selects "Privacy mode" | PDF excludes proposal text, ICP specifics; shows "[REDACTED]" |

---

## Feature Group 7: Billing & Subscription (Phase 1)

### F-025: View Subscription

| Attribute | Value |
|-----------|-------|
| **Description** | Users view their current plan, usage, and billing details |
| **Priority** | Must Have (MVP) |
| **Phase** | Phase 1 |

**Acceptance Criteria (GWT):**

| # | Given | When | Then |
|---|-------|------|------|
| 1 | User navigates to `/settings/billing` | - | Subscription overview shown |
| 2 | User views billing | - | Current plan displayed: tier name, price, billing cycle (monthly/annual) |
| 3 | User views billing | - | Usage stats: "X of Y ideas used", "X of Y tests used this period" |
| 4 | User views billing | - | Usage bar visualization (progress toward limits) |
| 5 | User views billing | - | Next billing date and amount shown |
| 6 | User views billing | - | Payment method summary: card type, last 4 digits, expiry |
| 7 | User views billing | Annual plan | Shows annual savings amount vs monthly |
| 8 | User views billing | On trial | Trial end date shown with "X days remaining" |
| 9 | User views billing | - | Billing history: list of past invoices with download links |
| 10 | User clicks invoice | - | PDF invoice downloads or opens in new tab |
| 11 | User views billing | Approaching limit (80%+) | Warning banner with upgrade CTA |
| 12 | User views billing | Soft lock (payment failed, grace active) | Warning: "Payment failed - X days to update card"; prominent "Update Payment" CTA |
| 13 | User views billing | Hard lock (grace expired) | "Subscription suspended"; limited to billing page; "Reactivate" button only |
| 14 | User views billing | Cancelled (active until period end) | Shows "Cancels on [date]", access until then, "Resubscribe" CTA |
| 15 | User views billing | Usage stats shown | Reset date displayed: "Tests reset on [date]" |
| 16 | User views billing | Page loading or Stripe fails | Skeleton loaders; error: "Unable to load billing" with retry |

---

### F-026: Upgrade/Downgrade Plan

| Attribute | Value |
|-----------|-------|
| **Description** | Users change their subscription tier or billing cycle |
| **Priority** | Must Have (MVP) |
| **Phase** | Phase 1 |

**Acceptance Criteria (GWT):**

| # | Given | When | Then |
|---|-------|------|------|
| 1 | User clicks "Change Plan" | - | Plan selection modal/page shown with all tiers |
| 2 | User views plan options | - | Current plan highlighted; other tiers show price difference |
| 3 | User views plan options | - | Each tier shows: price, idea limit, test limit |
| 4 | User selects higher tier | - | Shows prorated charge amount for current period |
| 5 | User confirms upgrade | - | Immediate access to new limits; prorated charge processed |
| 6 | User selects lower tier | - | Shows: "Downgrade takes effect at next billing date" |
| 7 | User confirms downgrade | - | Current access maintained until period end; new tier starts next cycle |
| 8 | User downgrades | Ideas exceed new limit | Warning: "You have X ideas; new limit is Y. Archive some before downgrade takes effect." |
| 9 | User on annual plan | Upgrades | Prorated for remaining annual period |
| 10 | User on annual plan | Downgrades | Takes effect at annual renewal |
| 11 | User on trial | Changes plan | Trial continues; new tier applies after trial ends |
| 12 | User confirms change | Stripe processes | Success confirmation; billing page reflects new plan |
| 13 | User on monthly | Switches to annual (same tier) | Shows 20% discount; immediate charge minus prorated credit |
| 14 | User on annual | Switches to monthly | Takes effect at renewal; no partial refund |
| 15 | User confirms upgrade | Stripe fails | Error: "Payment failed. Update payment method."; remains on current plan |
| 16 | User has pending downgrade | Views billing | Shows "Downgrading to [Tier] on [Date]" with "Cancel Downgrade" option |
| 17 | User clicks "Cancel Downgrade" | - | Downgrade cancelled; current plan continues; confirmation shown |
| 18 | User selects upgrade | Clicks confirm | Confirmation dialog: charge amount, "You will be charged $X now"; requires "Pay Now" click |
| 19 | User confirms change | Stripe processing | Button disabled; loading indicator; "Processing..."; prevent duplicate submissions |

---

### F-027: Manage Payment Method

| Attribute | Value |
|-----------|-------|
| **Description** | Users update their card, billing details, or VAT ID |
| **Priority** | Must Have (MVP) |
| **Phase** | Phase 1 |

**Acceptance Criteria (GWT):**

| # | Given | When | Then |
|---|-------|------|------|
| 1 | User clicks "Update Payment Method" | - | Stripe-hosted payment form shown (or embedded Stripe Elements) |
| 2 | User enters new card | Valid card | Card validated, saved as default payment method |
| 3 | User enters new card | Invalid card | Error message from Stripe shown |
| 4 | User updates card | Success | Confirmation: "Payment method updated"; billing page shows new card |
| 5 | User views billing | Card expiring soon (within 30 days) | Warning: "Card expires soon - update to avoid interruption" |
| 6 | User in soft lock | Updates valid card | Payment retried automatically; if successful, access restored |
| 7 | User in hard lock | Updates valid card | Payment processed; access restored immediately |
| 8 | User views billing | - | Option to update billing address/name |
| 9 | User updates billing address | - | Saved for future invoices; existing invoices unchanged |
| 10 | User enters card requiring 3D Secure | Stripe triggers SCA | 3DS modal shown; on success card saved; on failure, error and card not saved |
| 11 | User submits card form | Stripe processing | Loading spinner; inputs disabled; "Processing..."; submit button disabled |
| 12 | Business user | Clicks "Add VAT ID" | VAT ID input; validated via Stripe Tax; if valid, applied to future invoices |
| 13 | User updates payment method | Not authenticated recently (>15 min) | Prompted to re-enter password before proceeding |
| 14 | User on mobile | Opens payment form | Touch-friendly; numeric keyboard for card number; 44px min tap targets |

---

### F-028: Cancel Subscription

| Attribute | Value |
|-----------|-------|
| **Description** | Users cancel their subscription with retention opportunities |
| **Priority** | Must Have (MVP) |
| **Phase** | Phase 1 |

**Acceptance Criteria (GWT):**

| # | Given | When | Then |
|---|-------|------|------|
| 1 | User clicks "Cancel Subscription" | - | Cancellation flow begins |
| 2 | User initiates cancel | - | Shown: "Your access continues until [end of period]" |
| 3 | User initiates cancel | - | Exit survey: reason for cancelling (dropdown + optional text) |
| 4 | User confirms cancellation | - | Subscription marked cancelled; access until period end |
| 5 | User cancels | - | Confirmation email sent with end date |
| 6 | User cancelled | Views billing before period end | Shows "Cancelled - access until [date]" with "Resubscribe" option |
| 7 | User cancelled | Period ends | Access revoked; data retained per retention policy (90 days) |
| 8 | User clicks "Resubscribe" | Before period end | Cancellation reversed; subscription continues normally |
| 9 | User clicks "Resubscribe" | After period end | New subscription flow; existing data still accessible |
| 10 | User on trial | Cancels | Trial ends immediately; no charge processed |
| 11 | User selects "too expensive" or "not using enough" | Cancellation flow | Downgrade offer: "Switch to [lower tier] at $X/month?" |
| 12 | User paid for 3+ months | Confirms intent to cancel | Retention offer: one-time 20% discount for next period |
| 13 | User on annual plan | Requests cancellation | "No refund for remaining period"; explicit acknowledgment checkbox required |
| 14 | User confirms cancellation | Before final submit | Data export reminder: "Download your data before [end date]"; requires confirmation |
| 15 | User initiates cancel | - | Pause option shown: "Take a break? Pause for 1-3 months at no charge" |

---

## Feature Group 8: Quick Fire & Entry (Phase 1)

### F-029: Quick Fire Mode

| Attribute | Value |
|-----------|-------|
| **Description** | Sub-60-second onboarding hook that provides a Risk Score and key counter-argument from a single sentence input |
| **Priority** | Must Have (MVP) |
| **Phase** | Phase 1 |

**Acceptance Criteria (GWT):**

| # | Given | When | Then |
|---|-------|------|------|
| 1 | User accesses Quick Fire | Page loads | Single text input with prompt: "Describe your idea in one sentence" |
| 2 | User enters idea description | They submit | Processing indicator: "Analyzing your idea..." |
| 3 | Processing completes | Within 60 seconds | Risk Score (1-100) displayed with visual indicator |
| 4 | Results displayed | - | Key counter-argument shown: "The biggest risk is..." |
| 5 | Results displayed | - | Brief summary of main concerns (2-3 bullet points) |
| 6 | Results displayed | - | CTA: "Go Deeper" to start full validation |
| 7 | Results displayed | - | Option to save idea or discard |
| 8 | User clicks "Go Deeper" | - | Idea created, data carries over to proposal creation |
| 9 | User clicks "Save for Later" | - | Idea saved with Quick Fire score, visible on dashboard |
| 10 | User clicks "Try Another" | - | Form cleared, user can test different idea |
| 11 | User is not logged in | They access Quick Fire | One free Quick Fire allowed; prompted to sign up for more |
| 12 | User is logged in | They access Quick Fire | Unlimited Quick Fire (within tier test limits) |
| 13 | Input is too vague | User submits | Warning: "Add more detail for better results" with suggestions |
| 14 | Input is < 10 characters | User tries to submit | Validation error: "Please describe your idea in more detail" |
| 15 | Input is > 500 characters | User types | Character counter turns red, excess chars blocked |
| 16 | API fails | Processing error | Error message with retry option |
| 17 | User is on mobile | Page loads | Full-width input, large "Analyze" button, touch-optimized |
| 18 | Risk Score is High (70+) | Results display | Visual: Red indicator, "High Risk" label |
| 19 | Risk Score is Medium (40-69) | Results display | Visual: Amber indicator, "Medium Risk" label |
| 20 | Risk Score is Low (1-39) | Results display | Visual: Green indicator, "Lower Risk" label |

---

### F-030: Data Carry-Over

| Attribute | Value |
|-----------|-------|
| **Description** | Data from Quick Fire Mode auto-populates a new Full Validation project |
| **Priority** | Must Have (MVP) |
| **Phase** | Phase 1 |

**Acceptance Criteria (GWT):**

| # | Given | When | Then |
|---|-------|------|------|
| 1 | User clicks "Go Deeper" from Quick Fire | - | New Idea created with Quick Fire description as name |
| 2 | Idea created | - | Quick Fire score and objection saved to Idea record |
| 3 | Proposal creation starts | - | Problem field pre-populated with expanded version of Quick Fire input |
| 4 | Proposal creation starts | - | Hypotheses pre-populated based on Quick Fire analysis |
| 5 | User reviews pre-populated fields | - | All fields editable, user can modify or accept |
| 6 | User completes proposal | - | Connection to Quick Fire preserved for reporting |
| 7 | User views report | After full validation | Shows Quick Fire score comparison: "Quick Fire predicted [X], Full validation found [Y]" |
| 8 | User abandons after "Go Deeper" | Before completing proposal | Idea saved with Quick Fire data, can resume later |
| 9 | Quick Fire data exists | User starts proposal manually | Option to "Import from Quick Fire" if recent Quick Fire exists |

---

## Feature Group 9: Advanced Validation (Phase 2)

### F-031: External Injection

| Attribute | Value |
|-----------|-------|
| **Description** | Ground personas in reality by scraping a URL or pasting raw text for context |
| **Priority** | Should Have (MVP) |
| **Phase** | Phase 2 |

**Acceptance Criteria (GWT):**

| # | Given | When | Then |
|---|-------|------|------|
| 1 | User is creating/editing proposal | - | "Add External Context" section visible |
| 2 | User clicks "Add URL" | - | URL input field shown |
| 3 | User enters valid URL | They submit | System fetches and parses content |
| 4 | URL parsed successfully | - | Preview of extracted content shown for review |
| 5 | User approves content | - | Content saved to proposal.external_context |
| 6 | URL fetch fails | - | Error with fallback: "Paste content manually instead" |
| 7 | User clicks "Paste Text" | - | Text area shown for manual paste |
| 8 | User pastes content | - | Content saved to proposal.external_context |
| 9 | External context saved | Personas generated | Personas informed by external context |
| 10 | External context saved | Sessions run | Personas reference real-world context in responses |
| 11 | URL is promotional/biased | System detects | Input Quality Gate warning shown |
| 12 | URL type | Supported | Reddit threads, review sites, forum posts, news articles |
| 13 | URL type | Not supported | Login-required pages, PDFs, videos |
| 14 | Character limit | External context | Max 5,000 characters |
| 15 | User views report | External context was used | Shows source URL/note and how it influenced personas |

---

### F-032: Assumption Import & Prioritization

| Attribute | Value |
|-----------|-------|
| **Description** | Allow users to paste a list of their own assumptions and rank them by importance |
| **Priority** | Should Have (MVP) |
| **Phase** | Phase 2 |

**Acceptance Criteria (GWT):**

| # | Given | When | Then |
|---|-------|------|------|
| 1 | User is on proposal detail | They click "Manage Assumptions" | Assumption management interface shown |
| 2 | User views assumptions | - | List of assumptions from hypotheses field |
| 3 | User wants to add more | Clicks "Import Assumptions" | Bulk paste text area shown |
| 4 | User pastes list | System parses | Each line/bullet becomes separate assumption |
| 5 | Assumptions imported | - | User can edit individual assumptions |
| 6 | User views assumption list | - | Drag-and-drop to reorder by priority |
| 7 | User drags assumption | - | Priority number updates automatically |
| 8 | User sets priority | - | Priority (1-5) saved to Assumption record |
| 9 | User wants to edit | Clicks assumption | Inline edit enabled |
| 10 | User wants to delete | Clicks delete icon | Confirmation, then removed |
| 11 | Test runs | Assumptions prioritized | Higher-priority assumptions get more focus in sessions |
| 12 | Report generated | - | Assumption Board shows results in priority order |
| 13 | Assumption count | Limit | Max 10 assumptions per proposal |
| 14 | User has > 10 | They try to add more | Warning: "Maximum 10 assumptions. Remove some to add more." |

---

### F-033: The Assumption Board

| Attribute | Value |
|-----------|-------|
| **Description** | Primary report output showing each assumption with evidence, confidence score, and recommended next step |
| **Priority** | Must Have (MVP) |
| **Phase** | Phase 2 |

**Acceptance Criteria (GWT):**

| # | Given | When | Then |
|---|-------|------|------|
| 1 | User views report | - | Assumption Board section prominent below verdict |
| 2 | Assumption Board displays | - | Table/card layout with one row per assumption |
| 3 | Each assumption row | - | Shows: assumption text, confidence score (0-100%), recommended action |
| 4 | Each assumption row | - | Expandable to show evidence for and against |
| 5 | Confidence score | Displayed | Visual bar + percentage |
| 6 | Confidence < 40% | - | Red indicator, "Not Validated" label |
| 7 | Confidence 40-69% | - | Amber indicator, "Needs More Data" label |
| 8 | Confidence 70%+ | - | Green indicator, "Validated" label |
| 9 | Recommended action | Each assumption | One of: Validate, Pivot, Kill, Explore Further |
| 10 | User expands assumption | - | Evidence for: supporting quotes from sessions |
| 11 | User expands assumption | - | Evidence against: challenging quotes from sessions |
| 12 | User expands assumption | - | Sessions that discussed this assumption linked |
| 13 | User clicks quote | - | Jumps to full session context |
| 14 | Assumption not discussed | In any session | Shows "Not discussed - consider adding to proposal" |
| 15 | Board sortable | - | By priority, confidence, or status |
| 16 | Board filterable | - | Show all, validated only, needs attention only |
| 17 | User on mobile | Views board | Card layout, swipe to see details |

---

### F-034: The Reality Check Panel

| Attribute | Value |
|-----------|-------|
| **Description** | Ethical guardrail providing a "Minimum Real-World Validation Plan" |
| **Priority** | Must Have (MVP) |
| **Phase** | Phase 2 |

**Acceptance Criteria (GWT):**

| # | Given | When | Then |
|---|-------|------|------|
| 1 | User views report | - | Reality Check Panel visible after Assumption Board |
| 2 | Panel header | - | "Before You Build: Real-World Validation Steps" |
| 3 | Panel content | - | 3-5 concrete validation steps generated based on verdict |
| 4 | Each step | - | Shows: action, estimated effort (hours), what you'll learn |
| 5 | Verdict is Kill | - | Steps focus on: validating the need exists, finding alternative problems |
| 6 | Verdict is Pivot | - | Steps focus on: testing alternative solutions, refining ICP |
| 7 | Verdict is Build | - | Steps focus on: confirming willingness to pay, finding early adopters |
| 8 | Each step | Has checkbox | User can mark as "Planned" or "Done" |
| 9 | User marks step done | - | Progress tracked, shown on dashboard |
| 10 | Panel disclaimer | - | "AI validation is a starting point. These steps help confirm with real humans." |
| 11 | User on mobile | Views panel | Steps in accordion format |
| 12 | User shares report | - | Reality Check Panel included in shared view |
| 13 | User downloads PDF | - | Reality Check Panel included in PDF |

---

### F-035: Pushback Control (Presets)

| Attribute | Value |
|-----------|-------|
| **Description** | User-facing control with three named presets to adjust Anti-Sycophancy intensity |
| **Priority** | Should Have (MVP) |
| **Phase** | Phase 2 |

**Acceptance Criteria (GWT):**

| # | Given | When | Then |
|---|-------|------|------|
| 1 | User is on test config | - | "Feedback Style" selector shown |
| 2 | Selector displays | - | Three options with descriptions |
| 3 | Option 1: The Cheerleader | User selects | Description: "Supportive but honest. Will validate strengths while noting concerns." |
| 4 | Option 2: The Pragmatist | Default selected | Description: "Balanced, real-world perspective. Questions feasibility and value." |
| 5 | Option 3: The Critic | User selects | Description: "Aggressive devil's advocate. Finds every flaw, challenges everything." |
| 6 | User selects preset | - | Confirmation of selection, can change before starting test |
| 7 | Test runs | Preset applied | Persona behavior adjusts according to preset |
| 8 | Report generated | - | Shows which preset was used: "Tested with: The Pragmatist" |
| 9 | User runs multiple tests | Different presets | Can compare results across presets |
| 10 | User is new | First few tests | Suggestion: "Start with The Pragmatist for balanced feedback" |
| 11 | User selects The Critic | First time | Warning: "This mode is tough. Ready for hard truths?" |

---

### F-036: Pre-Mortem Mode

| Attribute | Value |
|-----------|-------|
| **Description** | Simulation mode that asks "The product launched and failed. Why?" |
| **Priority** | Should Have (MVP) |
| **Phase** | Phase 2 |

**Acceptance Criteria (GWT):**

| # | Given | When | Then |
|---|-------|------|------|
| 1 | User is on test config | - | "Test Type" selector includes "Pre-Mortem" option |
| 2 | User selects Pre-Mortem | - | Description: "Imagine your product failed. Personas explain why." |
| 3 | Pre-Mortem selected | Test starts | Personas receive prompt: "This product launched and failed. Why?" |
| 4 | Sessions run | Pre-Mortem mode | Personas generate failure scenarios and reasons |
| 5 | Sessions run | Pre-Mortem mode | Focus on risks, blind spots, market realities |
| 6 | Report generated | Pre-Mortem mode | "Pre-Mortem Analysis" section instead of standard verdict |
| 7 | Pre-Mortem report | - | Shows: Top failure risks, ranked by likelihood |
| 8 | Pre-Mortem report | - | Shows: What would need to be true for success |
| 9 | Pre-Mortem report | - | Shows: Recommended mitigations for each risk |
| 10 | User views report | - | Standard Assumption Board still shown (with failure lens) |
| 11 | User views report | - | Reality Check Panel adjusted for Pre-Mortem findings |
| 12 | User on mobile | Views Pre-Mortem report | Risk cards in swipeable format |
| 13 | User shares report | Pre-Mortem mode | Clearly labeled as "Pre-Mortem Analysis" |

---

### F-037: Nudge Buttons (Spectator Mode Enhancement)

| Attribute | Value |
|-----------|-------|
| **Description** | Three buttons for Spectator Mode users to intervene without typing: Pause, Dig Deeper, Move On |
| **Priority** | Should Have (MVP) |
| **Phase** | Phase 2 |

**Acceptance Criteria (GWT):**

| # | Given | When | Then |
|---|-------|------|------|
| 1 | User is in Spectator session | - | Nudge Buttons visible below conversation |
| 2 | Nudge Buttons | Display | Three buttons: "Pause", "Dig Deeper", "Move On" |
| 3 | User clicks "Pause" | Conversation active | Conversation pauses after current exchange |
| 4 | Conversation paused | - | "Paused" indicator shown, "Resume" button appears |
| 5 | User clicks "Resume" | Paused | Conversation continues from where it stopped |
| 6 | User clicks "Dig Deeper" | Conversation active | Interviewer asks probing follow-up on current topic |
| 7 | Dig Deeper triggered | - | Visual feedback: "Exploring this further..." |
| 8 | Dig Deeper used | - | Adds 2-3 additional exchanges on current topic |
| 9 | User clicks "Move On" | Conversation active | Interviewer transitions to next assumption/topic |
| 10 | Move On triggered | - | Visual feedback: "Moving to next topic..." |
| 11 | Move On used | Current topic | Current topic marked as "User skipped" in report |
| 12 | Nudge usage | Tracked | Session.nudge_count incremented |
| 13 | Report generated | Nudges used | Shows: "User directed conversation X times" |
| 14 | Conversation near end | - | Nudge buttons disabled with "Wrapping up..." message |
| 15 | User on mobile | In Spectator session | Nudge buttons as floating action buttons |
| 16 | User uses Nudge | Cooldown | 10-second cooldown before next Nudge available |

---

# Section 4: Testing & Validation

## 4.1 Test Strategy

| Test Type | Purpose | Tools (Suggested) |
|-----------|---------|-------------------|
| **Unit Tests** | Individual functions, business logic | Jest/Vitest |
| **Integration Tests** | API endpoints, database operations | Supertest, Playwright |
| **E2E Tests** | Critical user flows end-to-end | Playwright |
| **Manual Testing** | Edge cases, UX validation | Checklist-based |

## 4.2 Critical Test Paths

These paths must pass before MVP launch:

| ID | Path | Features Covered | Phase |
|----|------|------------------|-------|
| T-001 | Quick Fire → Go Deeper → First Verdict | F-029, F-030, F-005, F-006, F-010, F-014, F-018, F-020, F-022 | Phase 1 |
| T-002 | Signup → Onboarding → First Verdict | F-001, F-005, F-029, F-030 | Phase 1 |
| T-003 | Login → View Ideas → Run Test | F-002, F-007, F-008, F-018, F-019 | Phase 1 |
| T-004 | Create Proposal → Add ICP → Run Validation | F-010, F-014, F-018, F-020/F-021 | Phase 1 |
| T-005 | View Report → Share → Download | F-022, F-023, F-024 | Phase 2 |
| T-006 | Upgrade Plan → Payment Success | F-025, F-026, F-027 | Phase 1 |
| T-007 | Cancel Subscription → Retention Flow | F-028 | Phase 1 |
| T-008 | Spectator Mode with Nudge Buttons | F-021, F-037 | Phase 2 |
| T-009 | External Injection → Validation | F-031, F-018, F-022 | Phase 2 |
| T-010 | Pre-Mortem Mode Full Flow | F-036, F-022 | Phase 2 |

## 4.3 Coverage Matrix

| Feature Group | Unit | Integration | E2E | Manual |
|---------------|------|-------------|-----|--------|
| Account & Auth | Y | Y | Y | Y |
| Idea Management | Y | Y | Y | - |
| Proposal Management | Y | Y | Y | Y |
| ICP Management | Y | Y | Y | - |
| Validation Testing | Y | Y | Y | Y |
| Reporting | Y | Y | Y | Y |
| Billing & Subscription | Y | Y | Y | Y |
| Quick Fire & Entry | Y | Y | Y | Y |
| Advanced Validation | Y | Y | Y | Y |

**Note:** Manual testing prioritized for AI conversation quality, payment flows, and PDF generation.

---

# Section 5: Roadmap & Milestones

## 5.0 Phase 0 Requirements (Landing Page)

Phase 0 launches before MVP development to capture early interest.

| Requirement | Description | Priority |
|-------------|-------------|----------|
| **Landing page** | Brand-aligned page explaining value prop, pricing preview | Must Have |
| **Waitlist signup** | Email capture with confirmation email | Must Have |
| **Demo walkthrough** | Interactive or video mock showing validation flow (idea → test → verdict) | Must Have |
| **Social proof placeholder** | Space for testimonials (populated post-launch) | Should Have |
| **Analytics** | Track signups, demo engagement, traffic sources | Must Have |

**Demo Requirements:**
- Show the core loop: Enter idea → See personas generated → Watch/participate in conversation → Get verdict
- Can be interactive prototype (Figma) or video walkthrough
- Must demonstrate anti-sycophancy (persona pushing back, not flattering)
- Include sample Kill, Pivot, and Build verdicts to show range of outcomes

---

## 5.1 Release Phases

| Phase | Timeline | Focus | Key Deliverables |
|-------|----------|-------|------------------|
| **Phase 0** | Now | Landing Page | Waitlist capture, demo, brand presence |
| **Phase 1** | End Jan 2026 | Core Loop MVP | Quick Fire Mode, Auth + Stripe, core validation flow, Interactive Mode, basic verdict |
| **Phase 2** | Feb 2026 | Full MVP & Virality | Spectator Mode + Nudge Buttons, Assumption Board, Reality Check Panel, Pushback Presets, Pre-Mortem, External Injection, Shareable Reports |
| **Phase 3** | Mar-Dec 2026 | Scale | Team accounts, API access, enterprise features, multi-language |

## 5.2 MVP Scope by Phase

### Phase 1 (End January) - Core Loop & Value Proposition

| Feature | ID | Description |
|---------|----|----|
| Auth & Basic Billing | F-001 to F-005 | Full signup/login with Stripe |
| **Quick Fire Mode** | F-029 | Sub-60-second hook with Risk Score |
| **Data Carry-Over** | F-030 | Quick Fire → Full Validation flow |
| Core Validation Loop | F-006 to F-022 | Proposal → ICP → Test → Report |
| Interactive Mode | F-020 | User participates in conversations |
| Basic Verdict | F-022 | Kill/Pivot/Build with confidence |
| Anti-Sycophancy Engine | Section 2.7 | Active but not user-configurable |

### Phase 2 (February) - Full MVP & Virality

| Feature | ID | Description |
|---------|----|----|
| **Spectator Mode + Nudge Buttons** | F-021, F-037 | Hands-off validation with intervention |
| **The Assumption Board** | F-033 | Per-assumption breakdown in reports |
| **The Reality Check Panel** | F-034 | Real-world validation steps |
| **Pushback Presets** | F-035 | User-configurable feedback intensity |
| **Pre-Mortem Mode** | F-036 | "Why did it fail?" simulation |
| **External Injection** | F-031 | URL/text context grounding |
| **Assumption Import** | F-032 | Bulk assumption management |
| Shareable Reports | F-023 | Public links with branding |
| Full Billing Lifecycle | F-025 to F-028 | Complete subscription management |

### Deferred to Phase 3

- Team/organization accounts
- API access for developers
- Side-by-side idea comparison
- Multi-language support
- Enterprise SSO

## 5.3 Dependencies & Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Solo founder capacity | High | Prioritize ruthlessly; Phase 1 is minimal viable |
| Anti-sycophancy quality | Medium | Iterate on prompts; manual QA of conversations |
| "Just use ChatGPT" objection | High | Clear differentiation in marketing; demo anti-sycophancy |
| User acquisition | Medium | Build in public; leverage founder communities |

---

# Section 6: Metrics & Success

## 6.1 Primary Success Metrics

| Metric | Target | Timeframe | Measurement |
|--------|--------|-----------|-------------|
| **Paying founders** | 1,000 | Year 1 (2026) | Stripe subscription count |
| **ARR** | $250K | Year 1 (2026) | Stripe MRR × 12 |
| **Trial-to-paid conversion** | 60%+ | Ongoing | Conversions / trial signups |

## 6.2 Product Health Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Time to first Risk Score (Quick Fire) | ≤60 seconds | Onboarding analytics |
| Time to first verdict | ≤10 minutes | Onboarding analytics |
| Monthly churn | <5% | Cancellations / active subscribers |
| Tests per user per month | 3+ | Usage analytics |
| Report share rate | 20%+ | Shares / reports generated |
| NPS | 40+ | In-app survey |

## 6.3 Leading Indicators

| Indicator | What It Tells Us |
|-----------|------------------|
| Waitlist signups | Pre-launch demand |
| Quick Fire completions | Hook effectiveness |
| Quick Fire → Go Deeper rate | Value demonstration working |
| Trial starts | Top-of-funnel health |
| Onboarding completion | First-run experience quality |
| Second test run | User finds value, comes back |
| Upgrade rate | Users hitting limits = product-market fit |

---

# Section 7: Handoff Readiness Checklist

## 7.1 Documentation Checklist

| Category | Item | Status |
|----------|------|--------|
| **Documentation** | PRD complete with all features (F-001 to F-037) | Complete |
| **Documentation** | Acceptance criteria in GWT format (~500+ criteria) | Complete |
| **Documentation** | Data model defined (10 entities) | Complete |
| **Documentation** | UI sitemap defined | Complete |
| **Documentation** | Business rules & state machines | Complete |
| **Documentation** | Glossary of terms (expanded) | Complete |
| **Documentation** | Anti-Sycophancy Engine specification | Complete |
| **Documentation** | Phase tagging for all features | Complete |
| **Design** | Brand style guide | Complete |
| **Design** | Wireframes/mockups | Pending |
| **Technical** | API dependencies documented | Complete |
| **Technical** | Auth flow defined (OAuth + email) | Complete |
| **Technical** | Payment integration (Stripe) defined | Complete |
| **Business** | Pricing tiers finalized | Complete |
| **Business** | Privacy/compliance requirements | Complete |

## 7.2 Handoff Notes for Developers

**Priority Order:**
1. **Phase 1 First**: Quick Fire Mode (F-029, F-030) as the entry hook
2. Auth + payment integration (gates everything else)
3. Core validation loop (Proposal → ICP → Test → Report)
4. Interactive Mode with basic Anti-Sycophancy
5. Basic verdict (Kill/Pivot/Build)

**Phase 2 Priority:**
1. Spectator Mode + Nudge Buttons
2. Assumption Board + Reality Check Panel
3. Pushback Presets
4. External Injection
5. Pre-Mortem Mode
6. Shareable Reports

**Technical Recommendations:**
| Component | Recommendation | Notes |
|-----------|----------------|-------|
| Auth | Supabase | OAuth (Google, GitHub) + email/password |
| Payment | Stripe | Test mode for Phase 1; webhooks for subscription events |
| LLM | OpenRouter | Model-agnostic; allows switching models without code changes |
| Database | Supabase/Postgres | Matches auth choice; good for MVP |
| Hosting | Vercel or Railway | Fast deploys; good DX for solo founder |

**Key Integration Points:**
- Stripe webhooks for: subscription created, payment failed, subscription cancelled
- OpenRouter for: persona generation, conversation handling, report generation
- Email service (TBD) for: verification, password reset, trial reminders, report ready

## 7.3 Open Questions for Development

| Question | Context | Decision Needed By |
|----------|---------|-------------------|
| Email provider | Transactional emails | Phase 1 start |
| Analytics provider | Usage tracking | Phase 2 launch |
| Error tracking | Sentry or similar | Phase 1 start |
| CDN for PDFs | Report storage/delivery | Phase 2 launch |
| Web scraping service | External Injection feature | Phase 2 start |

---

# Appendix A: Preference Profile

Business context and constraints for development decisions.

```json
{
  "product": {
    "name": "PlebTest",
    "type": "SaaS",
    "stage": "MVP",
    "target_launch": "February 2026"
  },
  "business_constraints": {
    "solo_founder": true,
    "budget_conscious": true,
    "speed_over_perfection": true,
    "must_be_maintainable_by_one_person": true
  },
  "priorities": {
    "1": "Quick Fire hook (≤60 sec to Risk Score)",
    "2": "Time to first verdict (≤10 min onboarding)",
    "3": "Anti-sycophancy quality in conversations",
    "4": "Reliable payment flow",
    "5": "Shareable reports for virality"
  },
  "non_negotiables": [
    "Card captured upfront (even for trials)",
    "AI must challenge, not flatter",
    "Reports must be shareable without login",
    "Mobile-responsive (founders on the go)",
    "Three-environment setup required (dev/staging/production)",
    "Quick Fire Mode as primary entry point"
  ],
  "deferred_to_phase_3": [
    "Team accounts",
    "API access",
    "Multi-language",
    "Enterprise SSO"
  ]
}
```

---

# Appendix B: Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | January 13, 2026 | Initial PRD |
| 2.0 | January 18, 2026 | Added missing core features from original strategy: Quick Fire Mode (F-029), Data Carry-Over (F-030), External Injection (F-031), Assumption Import (F-032), Assumption Board (F-033), Reality Check Panel (F-034), Pushback Presets (F-035), Pre-Mortem Mode (F-036), Nudge Buttons (F-037). Added Anti-Sycophancy Engine specification (Section 2.7). Updated Spectator Mode to clarify as optional (not fallback). Added Phase tagging to all features. Updated data model with new entities (Assumption). |

---

*End of PRD*

*Version 2.0 - January 18, 2026*
