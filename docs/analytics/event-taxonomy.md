# PlebTest Event Taxonomy v1

> **Created:** 2026-01-23
> **Status:** Active

---

## Naming Conventions

- **Format:** `snake_case` (lowercase with underscores)
- **Structure:** `object_action` (e.g., `waitlist_signup`, `report_viewed`)
- **Properties:** Also use `snake_case`

---

## Current Events

### waitlist_signup

Fired when a user successfully joins the waitlist.

| Property | Type | Description |
|----------|------|-------------|
| `source` | string | Where the signup occurred (e.g., `landing_page_cta`) |

**Example:**
```javascript
posthog.capture("waitlist_signup", {
  source: "landing_page_cta"
})
```

---

## Future Events (Phase 1+)

### quick_fire_submitted

Fired when a user submits a Quick Fire validation.

| Property | Type | Description |
|----------|------|-------------|
| `idea_length` | number | Character count of the idea description |
| `has_target_market` | boolean | Whether target market was provided |

### quick_fire_result_viewed

Fired when a user views their Quick Fire verdict.

| Property | Type | Description |
|----------|------|-------------|
| `verdict` | string | The verdict: `kill`, `pivot`, or `build` |
| `confidence_score` | number | AI confidence score (0-100) |
| `time_to_result_seconds` | number | How long the analysis took |

### validation_started

Fired when a user starts a full validation.

| Property | Type | Description |
|----------|------|-------------|
| `product_id` | string | The product being validated |
| `persona_count` | number | Number of personas selected |

### validation_completed

Fired when a full validation finishes.

| Property | Type | Description |
|----------|------|-------------|
| `product_id` | string | The product validated |
| `verdict` | string | The verdict: `kill`, `pivot`, or `build` |
| `interview_count` | number | Total interviews conducted |
| `duration_minutes` | number | Total validation time |

### report_downloaded

Fired when a user downloads a PDF report.

| Property | Type | Description |
|----------|------|-------------|
| `product_id` | string | The product in the report |
| `report_type` | string | `quick_fire` or `full_validation` |

---

## Automatic Events (via PostHog)

These are tracked automatically by PostHog:

- `$pageview` - Page views (tracked on every route change)
- `$pageleave` - When user leaves a page

---

## Adding New Events

When adding a new event:

1. Add it to this document first
2. Use the naming convention: `object_action`
3. Define all properties with types
4. Implement in code using `posthog.capture("event_name", { properties })`
