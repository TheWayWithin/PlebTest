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

