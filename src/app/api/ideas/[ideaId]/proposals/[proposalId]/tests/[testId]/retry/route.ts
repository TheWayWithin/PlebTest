import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { queueUniqueJob, JobTypes } from '@/lib/jobs';
import type { RunTestPayload } from '@/lib/jobs/types';

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
 * Re-queues a stuck test job. Used when the original pg-boss job expired
 * (e.g., worker was down) but the test is still in pending state.
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

    // Re-queue the RUN_TEST job with a new idempotency key (timestamp-based)
    const retryKey = `test-${testId}-retry-${Date.now()}`;
    await queueUniqueJob<RunTestPayload>(
      JobTypes.RUN_TEST,
      {
        testId: test.id,
        proposalId,
        icpIds: test.icp_ids as string[],
        personaCount: test.persona_count,
        testMode: (test.test_mode || 'standard') as 'quick' | 'standard' | 'deep',
        validationMode: (test.validation_mode || 'spectator') as 'interactive' | 'spectator',
        pushbackPreset: (test.pushback_preset || 'pragmatist') as 'cheerleader' | 'pragmatist' | 'critic',
      },
      retryKey
    );

    console.log(`[POST /tests/${testId}/retry] Re-queued RUN_TEST job`);

    return NextResponse.json({ success: true, message: 'Test re-queued' });
  } catch (error) {
    console.error('Error retrying test:', error);
    return NextResponse.json(
      { error: 'Failed to retry test' },
      { status: 500 }
    );
  }
}
