/**
 * Report Generator Worker
 *
 * Handles report generation jobs.
 * Aggregates session results into comprehensive validation reports.
 */

import { getBoss, JobTypes } from '../src/lib/jobs';
import type { GenerateReportPayload } from '../src/lib/jobs/types';
import { createAdminClient } from '../src/lib/supabase/admin';

/**
 * Idempotency: Check if a report has already been generated for this test.
 * Returns true if the job should be skipped.
 */
async function isReportAlreadyGenerated(testId: string): Promise<boolean> {
  const supabase = createAdminClient();
  const { data: test } = await supabase
    .from('validation_tests')
    .select('report_id, status')
    .eq('id', testId)
    .single();

  // Skip if test already has a report or is completed
  if (test?.report_id) {
    console.log(`[idempotency] Test ${testId} already has report ${test.report_id}, skipping`);
    return true;
  }

  // Also skip if test is not in the right state
  if (test && test.status && !['in_progress', 'pending'].includes(test.status)) {
    console.log(`[idempotency] Test ${testId} in state ${test.status}, skipping report generation`);
    return true;
  }

  return false;
}

/**
 * Start the report generator worker handlers.
 */
export async function startReportGeneratorWorker(): Promise<void> {
  const boss = await getBoss();

  await boss.work<GenerateReportPayload>(
    JobTypes.GENERATE_REPORT,
    { localConcurrency: 2 }, // Max 2 reports generating at once
    async (jobs) => {
      // Process each job in the batch
      for (const job of jobs) {
        const { testId, proposalId } = job.data;
        console.log(`[${JobTypes.GENERATE_REPORT}] Generating report for test: ${testId}`);

        // Idempotency check: Skip if report already generated
        if (await isReportAlreadyGenerated(testId)) {
          continue;
        }

        const supabase = createAdminClient();

        try {
          // 1. Fetch all completed sessions for this test
          const { data: sessions, error: sessionsError } = await supabase
            .from('sessions')
            .select('*')
            .eq('validation_test_id', testId)
            .eq('status', 'completed');

          if (sessionsError) {
            throw sessionsError;
          }

          if (!sessions || sessions.length === 0) {
            console.log(`[${JobTypes.GENERATE_REPORT}] No completed sessions found for test ${testId}`);
            continue;
          }

          console.log(`[${JobTypes.GENERATE_REPORT}] Found ${sessions.length} completed sessions`);

          // 2. Aggregate session data
          // TODO (task-1.10.*): Implement full report generation
          // - Calculate need_validated and solution_resonated percentages
          // - Identify strongest signals and key objections
          // - Generate verdict (KILL/PIVOT/BUILD)
          // - Create assumption board
          // - Generate pivot suggestions and next steps

          // Placeholder: Create basic report
          const { data: report, error: reportError } = await supabase
            .from('reports')
            .insert({
              validation_test_id: testId,
              status: 'ready',
              generated_at: new Date().toISOString(),
              generation_version: '1.0.0-placeholder',
              // Placeholder values - will be computed in task-1.10
              need_validation_summary: 'Report generation pending full implementation.',
              solution_validation_summary: 'Report generation pending full implementation.',
              verdict: null,
              confidence_level: null,
            })
            .select()
            .single();

          if (reportError) {
            throw reportError;
          }

          // 3. Link report to test and update test status
          await supabase
            .from('validation_tests')
            .update({
              report_id: report.id,
              status: 'completed',
              completed_at: new Date().toISOString(),
            })
            .eq('id', testId);

          // 4. Update proposal status
          await supabase
            .from('proposals')
            .update({ status: 'tested' })
            .eq('id', proposalId);

          console.log(`[${JobTypes.GENERATE_REPORT}] Report ${report.id} created for test ${testId}`);
        } catch (error) {
          console.error(`[${JobTypes.GENERATE_REPORT}] Error:`, error);

          // Mark test as failed if report generation fails
          await supabase
            .from('validation_tests')
            .update({ status: 'failed' })
            .eq('id', testId);

          throw error; // Re-throw to trigger retry
        }
      }
    }
  );

  console.log(`   [report-generator] Registered handler: ${JobTypes.GENERATE_REPORT}`);
}
