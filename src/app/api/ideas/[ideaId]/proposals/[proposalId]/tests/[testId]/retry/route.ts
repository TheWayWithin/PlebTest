import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

interface RouteContext {
  params: Promise<{
    ideaId: string;
    proposalId: string;
    testId: string;
  }>;
}

/**
 * POST /api/ideas/[ideaId]/proposals/[proposalId]/tests/[testId]/retry
 *
 * Re-queues a stuck test job by calling a database function that inserts
 * directly into the pgboss.job table. This avoids starting a full pg-boss
 * instance on the web server (which would open additional DB connections
 * and exhaust Supabase free tier connection limits).
 */
export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const { ideaId, proposalId, testId } = await context.params;
    const supabase = await createClient();

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify idea ownership
    const { data: idea } = await supabase
      .from('ideas')
      .select('id, user_id')
      .eq('id', ideaId)
      .single();

    if (!idea || idea.user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Fetch test to verify it exists and is in a retryable state
    const { data: test, error: testError } = await supabase
      .from('validation_tests')
      .select('*')
      .eq('id', testId)
      .eq('proposal_id', proposalId)
      .single();

    if (testError || !test) {
      return NextResponse.json({ error: 'Test not found' }, { status: 404 });
    }

    // Only allow retry for pending or failed tests
    if (test.status !== 'pending' && test.status !== 'failed') {
      return NextResponse.json(
        { error: `Cannot retry test in ${test.status} state` },
        { status: 400 }
      );
    }

    // Reset test status to pending if it was failed
    if (test.status === 'failed') {
      await supabase
        .from('validation_tests')
        .update({ status: 'pending', started_at: null })
        .eq('id', testId);
    }

    // Queue the job via database function (bypasses pg-boss SDK entirely)
    const adminClient = createAdminClient();
    const jobData = {
      testId: test.id,
      proposalId,
      icpIds: test.icp_ids,
      personaCount: test.persona_count,
      testMode: test.test_mode || 'standard',
      validationMode: test.validation_mode || 'spectator',
      pushbackPreset: test.pushback_preset || 'pragmatist',
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: jobId, error: jobError } = await (adminClient.rpc as any)('queue_pgboss_job', {
      job_name: 'run-test',
      job_data: jobData,
      retry_limit: 3,
      expire_minutes: 15,
      singleton_key: `test-${testId}-retry-${Date.now()}`,
    });

    if (jobError) {
      console.error(`[POST /tests/${testId}/retry] Failed to queue job:`, jobError);
      return NextResponse.json(
        { error: 'Failed to queue test job' },
        { status: 500 }
      );
    }

    console.log(`[POST /tests/${testId}/retry] Re-queued RUN_TEST job: ${jobId}`);

    return NextResponse.json({ success: true, message: 'Test re-queued', jobId });
  } catch (error) {
    console.error('Error retrying test:', error);
    return NextResponse.json(
      { error: 'Failed to retry test' },
      { status: 500 }
    );
  }
}
