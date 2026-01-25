/**
 * Test Runner Worker
 *
 * Handles validation test execution jobs:
 * - RUN_TEST: Orchestrates entire test flow
 * - GENERATE_PERSONAS: Creates personas for ICPs
 * - RUN_SESSION: Runs individual validation sessions
 */

import { getBoss, JobTypes, queueUniqueJob } from '../src/lib/jobs';
import type {
  RunTestPayload,
  GeneratePersonasPayload,
  RunSessionPayload,
} from '../src/lib/jobs/types';
import { createAdminClient } from '../src/lib/supabase/admin';
import { generatePersonas } from '../src/lib/services/persona-generator';

/**
 * Idempotency: Check if test has already been started or completed.
 * Returns true if the job should be skipped.
 */
async function isTestAlreadyProcessed(testId: string): Promise<boolean> {
  const supabase = createAdminClient();
  const { data: test } = await supabase
    .from('validation_tests')
    .select('status')
    .eq('id', testId)
    .single();

  // Skip if test is already in progress, completed, or failed
  if (test && test.status && ['in_progress', 'completed', 'failed'].includes(test.status)) {
    console.log(`[idempotency] Test ${testId} already in state: ${test.status}, skipping`);
    return true;
  }
  return false;
}

/**
 * Idempotency: Check if session has already been started or completed.
 * Returns true if the job should be skipped.
 */
async function isSessionAlreadyProcessed(sessionId: string): Promise<boolean> {
  const supabase = createAdminClient();
  const { data: session } = await supabase
    .from('sessions')
    .select('status')
    .eq('id', sessionId)
    .single();

  // Skip if session is already active, completed, or abandoned
  if (session && session.status && ['active', 'completed', 'expired', 'abandoned'].includes(session.status)) {
    console.log(`[idempotency] Session ${sessionId} already in state: ${session.status}, skipping`);
    return true;
  }
  return false;
}

/**
 * Start the test runner worker handlers.
 */
export async function startTestRunnerWorker(): Promise<void> {
  const boss = await getBoss();

  // Handler for RUN_TEST job
  await boss.work<RunTestPayload>(
    JobTypes.RUN_TEST,
    { localConcurrency: 2 }, // Max 2 tests running at once
    async (jobs) => {
      for (const job of jobs) {
        const { testId, icpIds, personaCount } = job.data;
        console.log(`[${JobTypes.RUN_TEST}] Starting test: ${testId}`);

        // Idempotency check: Skip if already processed
        if (await isTestAlreadyProcessed(testId)) {
          continue;
        }

        const supabase = createAdminClient();

        try {
          // 1. Update test status to in_progress
          await supabase
            .from('validation_tests')
            .update({
              status: 'in_progress',
              started_at: new Date().toISOString(),
            })
            .eq('id', testId);

          // 2. Queue persona generation for each ICP (with idempotency key)
          const personasPerIcp = Math.ceil(personaCount / icpIds.length);

          for (const icpId of icpIds) {
            // Use unique job key to prevent duplicate persona generation
            const idempotencyKey = `${testId}-${icpId}`;
            await queueUniqueJob<GeneratePersonasPayload>(
              JobTypes.GENERATE_PERSONAS,
              {
                testId,
                icpId,
                count: personasPerIcp,
              },
              idempotencyKey
            );
          }

          console.log(`[${JobTypes.RUN_TEST}] Queued persona generation for ${icpIds.length} ICPs`);

          // Note: Session creation and execution will be handled
          // after persona generation completes (task-1.7.6)
        } catch (error) {
          console.error(`[${JobTypes.RUN_TEST}] Error:`, error);

          // Mark test as failed
          await supabase
            .from('validation_tests')
            .update({ status: 'failed' })
            .eq('id', testId);

          throw error; // Re-throw to trigger retry
        }
      }
    }
  );

  // Handler for GENERATE_PERSONAS job
  await boss.work<GeneratePersonasPayload>(
    JobTypes.GENERATE_PERSONAS,
    { localConcurrency: 3 }, // Max 3 concurrent persona generations
    async (jobs) => {
      for (const job of jobs) {
        console.log(`[${JobTypes.GENERATE_PERSONAS}] Generating personas for ICP: ${job.data.icpId}`);

        const { icpId, count } = job.data;

        try {
          // Generate personas using the persona generator service
          const personas = await generatePersonas(icpId, count);

          console.log(
            `[${JobTypes.GENERATE_PERSONAS}] Generated ${personas.length} personas for ICP ${icpId}`
          );

          // TODO (task-1.7.6): Create session records for each persona
          // and queue RUN_SESSION jobs
        } catch (error) {
          console.error(`[${JobTypes.GENERATE_PERSONAS}] Error:`, error);
          throw error; // Re-throw to trigger retry
        }
      }
    }
  );

  // Handler for RUN_SESSION job
  await boss.work<RunSessionPayload>(
    JobTypes.RUN_SESSION,
    { localConcurrency: 5 }, // Max 5 concurrent sessions
    async (jobs) => {
      for (const job of jobs) {
        const { sessionId } = job.data;
        console.log(`[${JobTypes.RUN_SESSION}] Running session: ${sessionId}`);

        // Idempotency check: Skip if already processed
        if (await isSessionAlreadyProcessed(sessionId)) {
          continue;
        }

        const supabase = createAdminClient();

        try {
          // Mark session as active to claim it
          await supabase
            .from('sessions')
            .update({
              status: 'active',
              last_activity_at: new Date().toISOString(),
            })
            .eq('id', sessionId);

          // TODO (task-1.8.*): Implement actual session execution
          // - Build persona-specific prompt with anti-sycophancy
          // - Run conversation loop with LLM
          // - Extract validation signals
          // - Update session record

          // Placeholder: Mark session as completed
          await supabase
            .from('sessions')
            .update({
              status: 'completed',
              completed_at: new Date().toISOString(),
            })
            .eq('id', sessionId);

          console.log(`[${JobTypes.RUN_SESSION}] Session ${sessionId} completed (placeholder)`);
        } catch (error) {
          console.error(`[${JobTypes.RUN_SESSION}] Error:`, error);

          // Mark session as abandoned on failure
          await supabase.from('sessions').update({ status: 'abandoned' }).eq('id', sessionId);

          throw error; // Re-throw to trigger retry
        }
      }
    }
  );

  console.log(`   [test-runner] Registered handlers: ${JobTypes.RUN_TEST}, ${JobTypes.GENERATE_PERSONAS}, ${JobTypes.RUN_SESSION}`);
}
