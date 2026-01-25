/**
 * Report Generator Worker
 *
 * Handles report generation jobs.
 * Aggregates session results into comprehensive validation reports.
 */

import { getBoss, JobTypes } from '../src/lib/jobs';
import type { GenerateReportPayload } from '../src/lib/jobs/types';
import { createAdminClient } from '../src/lib/supabase/admin';
import { generateReport } from '../src/lib/services/report-generator';

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
          // Generate the report using the report generator service
          const result = await generateReport(testId, supabase);

          if (!result.success) {
            throw new Error(result.error || 'Report generation failed');
          }

          // Update proposal status
          await supabase
            .from('proposals')
            .update({ status: 'tested' })
            .eq('id', proposalId);

          console.log(`[${JobTypes.GENERATE_REPORT}] Report ${result.reportId} created for test ${testId}`);
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
