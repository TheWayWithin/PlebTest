# Environment Variables Checklist

> **Last Updated**: 2026-01-24
> **Purpose**: Track which environment variables are configured in each environment

## Quick Reference

| Variable | Local | Staging | Production | Required For |
|----------|-------|---------|------------|--------------|
| **SUPABASE** |
| NEXT_PUBLIC_SUPABASE_URL | ✅ Local | ✅ | ✅ | Phase 0 |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | ✅ Local | ✅ | ✅ | Phase 0 |
| SUPABASE_SERVICE_ROLE_KEY | ✅ Local | ✅ | ✅ | Phase 0 |
| **ANALYTICS** |
| NEXT_PUBLIC_POSTHOG_KEY | ❌ Optional | ✅ | ✅ | Phase 0 |
| NEXT_PUBLIC_POSTHOG_HOST | ❌ Optional | ✅ | ✅ | Phase 0 |
| **APP CONFIG** |
| NEXT_PUBLIC_APP_URL | ✅ localhost | ⏳ Needs | ⏳ Needs | Phase 1 |
| **AI/LLM** |
| OPENROUTER_API_KEY | ❌ When needed | ⏳ Needs | ⏳ Needs | Phase 1.3 |
| **PAYMENTS** |
| NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY | ❌ When needed | ⏳ Needs | ⏳ Needs | Phase 1.13 |
| STRIPE_SECRET_KEY | ❌ When needed | ⏳ Needs | ⏳ Needs | Phase 1.13 |
| STRIPE_WEBHOOK_SECRET | ❌ When needed | ⏳ Needs | ⏳ Needs | Phase 1.13 |
| **RATE LIMITING** |
| UPSTASH_REDIS_REST_URL | ❌ When needed | ⏳ Needs | ⏳ Needs | Phase 1.3 |
| UPSTASH_REDIS_REST_TOKEN | ❌ When needed | ⏳ Needs | ⏳ Needs | Phase 1.3 |
| **EMAIL** |
| RESEND_API_KEY | ❌ When needed | ⏳ Needs | ⏳ Needs | Phase 1.8 |
| **BACKGROUND JOBS** |
| DATABASE_URL | ✅ Local | ⏳ Needs | ⏳ Needs | Phase 1.7 |
| **MONITORING** |
| NEXT_PUBLIC_SENTRY_DSN | ❌ Optional | ❌ Optional | ⏳ Recommended | Phase 2 |
| SENTRY_AUTH_TOKEN | ❌ Optional | ❌ Optional | ⏳ Recommended | Phase 2 |

### Legend
- ✅ Configured
- ⏳ Needs configuration (when task requires it)
- ❌ Not needed yet / Optional

---

## Configuration Instructions

### Where to Get Keys

1. **Supabase**: https://supabase.com/dashboard/project/[project-id]/settings/api
2. **PostHog**: https://us.posthog.com/settings/project
3. **OpenRouter**: https://openrouter.ai/keys
4. **Stripe**: https://dashboard.stripe.com/apikeys
5. **Upstash**: https://console.upstash.com/
6. **Resend**: https://resend.com/api-keys
7. **Sentry**: https://sentry.io/settings/[org]/projects/[project]/keys/

### Railway Configuration

**Staging** (plebteststaging-staging.up.railway.app):
```
NEXT_PUBLIC_APP_URL=https://plebteststaging-staging.up.railway.app
```

**Production** (plebtest.com):
```
NEXT_PUBLIC_APP_URL=https://plebtest.com
```

### Setting Variables in Railway

1. Go to Railway Dashboard: https://railway.com/dashboard
2. Select "PlebTest" project
3. Click on your service
4. Go to "Variables" tab
5. Add variables for the target environment

---

## Notes

- Phase 1 tasks requiring API keys will be blocked until keys are configured
- We'll add keys incrementally as we reach tasks that need them
- Test keys (pk_test_, sk_test_) should be used for staging
- Live keys (pk_live_, sk_live_) for production only after Phase 2 launch
