# Worker Operations Guide

## Overview

PlebTest uses a background worker service running on Railway to process asynchronous jobs. The worker uses pg-boss for job queue management with PostgreSQL as the backing store.

## Architecture

```
[Railway Worker Service]
    |
    +-- Health Check Server (port 8080)
    |       GET /health -> {status, boss, timestamp}
    |
    +-- pg-boss Worker
            |
            +-- run-test (validation test orchestration)
            +-- generate-personas (AI persona generation)
            +-- run-session (interview session execution)
            +-- generate-report (report aggregation)
            +-- check-session-timeout (cron: every 5 min)
```

## Health Checks

### Endpoint

```
GET /health
```

### Responses

**Healthy (200)**:
```json
{
  "status": "healthy",
  "boss": "connected",
  "timestamp": "2026-01-26T12:00:00.000Z"
}
```

**Unhealthy (503)**:
```json
{
  "status": "unhealthy",
  "boss": "not_connected",
  "timestamp": "2026-01-26T12:00:00.000Z"
}
```

**Shutting Down (503)**:
```json
{
  "status": "shutting_down",
  "boss": "disconnecting",
  "timestamp": "2026-01-26T12:00:00.000Z"
}
```

### Configuration

| Environment Variable | Default | Description |
|---------------------|---------|-------------|
| HEALTH_PORT | 8080 | Port for health check server |

## Railway Configuration

### Restart Policy

Configured in `railway.toml`:

- **Type**: `ON_FAILURE`
- **Max Retries**: 3

This means:
1. If the worker crashes (non-zero exit), Railway restarts it
2. After 3 consecutive failures, Railway stops trying
3. Manual intervention required after 3 failures

### Health Check Configuration

- **Path**: `/health`
- **Timeout**: 30 seconds
- **Behavior**: Railway pings `/health` periodically. If unhealthy for 30s, container restarts.

## Monitoring

### Railway Dashboard

1. **Logs**: Deployments > [deployment] > Logs
   - Real-time log streaming
   - Search and filter capabilities
   - Download logs for analysis

2. **Metrics**: Deployments > [deployment] > Metrics
   - CPU usage
   - Memory usage
   - Network I/O

3. **Alerts**: Settings > Notifications
   - Configure email/Slack alerts
   - Alert on deployment failures
   - Alert on health check failures

### Log Patterns to Watch

**Healthy startup**:
```
🚀 Starting PlebTest workers...
   Environment: production
✅ Health check server listening on port 8080
✅ pg-boss connected
✅ All workers started successfully

📋 Active job handlers:
   - run-test
   - generate-personas
   - run-session
   - generate-report
   - check-session-timeout (cron)

👀 Waiting for jobs...
```

**Job processing**:
```
[pg-boss] Queued job run-test: <job-id>
[pg-boss] Processing job run-test: <job-id>
[TestRunner] Starting test <test-id>
[TestRunner] Test <test-id> completed successfully
```

**Errors**:
```
❌ Worker startup failed: <error>
[pg-boss] Error: <error>
```

**Graceful shutdown**:
```
📤 Received SIGTERM, shutting down gracefully...
[pg-boss] Stopped gracefully
[Health] Health check server stopped
[Shutdown] Complete
```

## Troubleshooting

### Worker Not Starting

1. Check DATABASE_URL is set correctly (must use Session Pooler, port 5432)
2. Verify Supabase credentials (NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
3. Check Railway logs for specific error messages
4. Verify NIXPACKS_NODE_VERSION=20 is set

### Health Check Failing

1. Verify HEALTH_PORT matches Railway's expected port (default 8080)
2. Check if pg-boss connection is failing (DATABASE_URL issues)
3. Review recent deployments for configuration changes
4. Check if port 8080 is blocked or in use

### Jobs Not Processing

1. Verify job is being queued (check pg-boss logs for "Queued job" messages)
2. Check worker logs for handler registration
3. Verify queue names match between sender and worker
4. Check if worker is connected to correct database

### High Memory Usage

1. Check for memory leaks in job handlers
2. Review job retention settings (default: 7 days)
3. Consider adjusting retentionSeconds in pg-boss config
4. Monitor with Railway metrics dashboard

## Manual Operations

### Trigger Manual Job (via Supabase SQL Editor)

```sql
-- Insert a test job directly into pg-boss queue
SELECT pgboss.send('run-test', '{"testId": "test-uuid-here"}'::jsonb);
```

### Check Job Status

```sql
-- View recent jobs
SELECT id, name, state, createdon, completedon
FROM pgboss.job
WHERE name = 'run-test'
ORDER BY createdon DESC
LIMIT 10;

-- View scheduled jobs
SELECT * FROM pgboss.schedule;

-- View failed jobs in archive
SELECT * FROM pgboss.archive
WHERE state = 'failed'
ORDER BY completedon DESC
LIMIT 10;
```

### Force Restart Worker

In Railway dashboard:
1. Go to worker service
2. Click "Redeploy" or "Restart"

Or via Railway CLI:
```bash
railway redeploy -s worker
```

## Testing Health Check Locally

```bash
# Start worker
npm run worker

# In another terminal
curl http://localhost:8080/health
# Should return: {"status":"healthy","boss":"connected","timestamp":"..."}
```

## Environment Variables (Worker Service)

| Variable | Required | Description |
|----------|----------|-------------|
| SERVICE_TYPE | Yes | Set to `worker` to start worker mode |
| DATABASE_URL | Yes | PostgreSQL connection (Session Pooler, port 5432) |
| NEXT_PUBLIC_SUPABASE_URL | Yes | Supabase API URL |
| SUPABASE_SERVICE_ROLE_KEY | Yes | Supabase service role key |
| OPENROUTER_API_KEY | Yes | For AI persona generation |
| UPSTASH_REDIS_REST_URL | Yes | For rate limiting |
| UPSTASH_REDIS_REST_TOKEN | Yes | For rate limiting |
| NODE_ENV | Recommended | Set to `production` |
| NIXPACKS_NODE_VERSION | Build | Set to `20` |
| HEALTH_PORT | Optional | Default: 8080 |
