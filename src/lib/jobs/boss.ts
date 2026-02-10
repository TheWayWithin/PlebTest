/**
 * pg-boss Background Job Manager
 *
 * Singleton pattern for managing background jobs using pg-boss.
 * Uses the same PostgreSQL database as Supabase for job storage.
 */

import { PgBoss, type SendOptions } from 'pg-boss';

// Singleton instance
let boss: PgBoss | null = null;

/**
 * Job type constants for type-safe job creation and handling.
 */
export const JobTypes = {
  // Test execution jobs
  RUN_TEST: 'run-test',
  GENERATE_PERSONAS: 'generate-personas',
  RUN_SESSION: 'run-session',

  // Report generation jobs
  GENERATE_REPORT: 'generate-report',

  // Communication jobs
  SEND_EMAIL: 'send-email',

  // Maintenance jobs
  CHECK_SESSION_TIMEOUT: 'check-session-timeout',
  TRIAL_REMINDER: 'trial-reminder',

  // Data export jobs
  DATA_EXPORT: 'generate-data-export',
} as const;

export type JobType = (typeof JobTypes)[keyof typeof JobTypes];

/**
 * Get or create the pg-boss instance.
 * Uses lazy initialization to avoid connection during build.
 *
 * @returns The pg-boss instance
 */
export async function getBoss(): Promise<PgBoss> {
  if (boss) {
    return boss;
  }

  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is required for pg-boss');
  }

  boss = new PgBoss({
    connectionString: databaseUrl,
    // Limit connection pool to avoid exceeding Supabase free tier limits
    // Default pg pool is 10 connections - too many when web app also connects
    max: 3,
    // Monitor interval for detecting stuck jobs
    monitorIntervalSeconds: 30,
    // Maintenance interval for cleanup tasks
    maintenanceIntervalSeconds: 300, // 5 minutes
  });

  // Handle boss events
  boss.on('error', (error) => {
    console.error('[pg-boss] Error:', error);
  });

  boss.on('monitor-states', (states) => {
    console.log('[pg-boss] Monitor states:', JSON.stringify(states));
  });

  await boss.start();
  console.log('[pg-boss] Started successfully');

  return boss;
}

/**
 * Stop the pg-boss instance gracefully.
 * Call this during application shutdown.
 */
export async function stopBoss(): Promise<void> {
  if (boss) {
    await boss.stop({ graceful: true, timeout: 10000 });
    boss = null;
    console.log('[pg-boss] Stopped gracefully');
  }
}

// Default job options for retry and expiration
const DEFAULT_JOB_OPTIONS: SendOptions = {
  // Retry failed jobs with exponential backoff
  retryLimit: 3,
  retryDelay: 1, // 1 second initial delay
  retryBackoff: true, // Exponential backoff: 1s, 2s, 4s
  // Expire jobs after 15 minutes if not started
  expireInSeconds: 60 * 15,
  // Keep completed jobs for 7 days for debugging
  retentionSeconds: 60 * 60 * 24 * 7,
};

/**
 * Queue a job for processing.
 *
 * @param jobType - The type of job to queue
 * @param data - The job payload
 * @param options - Optional pg-boss job options (merged with defaults)
 * @returns The job ID
 */
export async function queueJob<T extends object>(
  jobType: JobType,
  data: T,
  options?: SendOptions
): Promise<string | null> {
  const bossInstance = await getBoss();
  const mergedOptions = { ...DEFAULT_JOB_OPTIONS, ...options };
  const jobId = await bossInstance.send(jobType, data, mergedOptions);
  console.log(`[pg-boss] Queued job ${jobType}:`, jobId);
  return jobId;
}

/**
 * Queue a job with a specific ID for idempotency.
 * If a job with the same key already exists (in created, active, or retry state),
 * it won't be duplicated. This prevents duplicate test runs on worker restart.
 *
 * @param jobType - The type of job to queue
 * @param data - The job payload
 * @param key - Unique key for idempotency (e.g., test_id, report_id)
 * @param options - Optional pg-boss job options (merged with defaults)
 * @returns The job ID (null if duplicate exists)
 */
export async function queueUniqueJob<T extends object>(
  jobType: JobType,
  data: T,
  key: string,
  options?: SendOptions
): Promise<string | null> {
  const bossInstance = await getBoss();
  const mergedOptions = {
    ...DEFAULT_JOB_OPTIONS,
    ...options,
    singletonKey: key,
  };
  const jobId = await bossInstance.send(jobType, data, mergedOptions);
  if (jobId) {
    console.log(`[pg-boss] Queued unique job ${jobType} (key: ${key}):`, jobId);
  } else {
    console.log(`[pg-boss] Job ${jobType} (key: ${key}) already exists, skipped`);
  }
  return jobId;
}

/**
 * Dead Letter Queue Operations
 * pg-boss automatically moves jobs to dead letter state after retryLimit is exhausted.
 * These functions provide visibility into failed jobs.
 */

/**
 * Get queued jobs for monitoring.
 *
 * Note: pg-boss v12 moves failed jobs to archive tables after retryLimit exhausted.
 * For failed job analysis, check the pgboss.archive table directly via SQL:
 *   SELECT * FROM pgboss.archive WHERE state = 'failed' ORDER BY completedon DESC;
 *
 * @param jobType - Job type to fetch (required by pg-boss v12)
 * @param batchSize - Maximum number of jobs to return (default 10)
 * @returns Array of queued jobs
 */
export async function getQueuedJobs(
  jobType: JobType,
  batchSize = 10
): Promise<Array<{ id: string; name: string; data: unknown }>> {
  const bossInstance = await getBoss();

  const jobs = await bossInstance.fetch(jobType, { batchSize });

  console.log(`[pg-boss] Fetched ${jobs?.length || 0} queued ${jobType} jobs`);

  return (jobs || []).map((job) => ({
    id: job.id,
    name: job.name,
    data: job.data,
  }));
}

/**
 * Get job counts by state for monitoring.
 * Returns counts for created, active, completed, failed states.
 */
export async function getJobStats(): Promise<{
  created: number;
  active: number;
  completed: number;
  failed: number;
}> {
  const bossInstance = await getBoss();

  // pg-boss emits monitor-states events, but we can also query directly
  // For now, return placeholder - full stats require direct SQL query
  // The monitor-states event handler logs these automatically
  console.log('[pg-boss] Job stats requested - check monitor-states logs');

  return {
    created: 0,
    active: 0,
    completed: 0,
    failed: 0,
  };
}

/**
 * Retry a specific failed job by re-queuing with the same payload.
 *
 * Note: pg-boss v12 moves failed jobs to archive tables.
 * To retry failed jobs, query the archive and re-queue:
 *   SELECT * FROM pgboss.archive WHERE id = 'job-id';
 *
 * @param jobType - The job type
 * @param data - The job payload to re-queue
 * @param originalJobId - Original job ID (used for idempotency key)
 */
export async function retryFailedJob<T extends object>(
  jobType: JobType,
  data: T,
  originalJobId: string
): Promise<string | null> {
  const bossInstance = await getBoss();

  console.log(`[pg-boss] Retrying failed job ${originalJobId} of type ${jobType}`);

  const jobId = await bossInstance.send(jobType, data, {
    ...DEFAULT_JOB_OPTIONS,
    singletonKey: `retry-${originalJobId}`,
  });

  if (jobId) {
    console.log(`[pg-boss] Queued retry job ${jobId} for original ${originalJobId}`);
  }

  return jobId;
}
