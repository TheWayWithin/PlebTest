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
        console.log(`[${JobTypes.GENERATE_REPORT}] Generating report for test: ${job.data.testId}`);

        const { testId, proposalId } = job.data;
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
