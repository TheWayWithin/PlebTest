import { NextRequest, NextResponse } from 'next/server';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { generateReport } from '@/lib/services/report-generator';

interface RouteContext {
  params: Promise<{
    ideaId: string;
    proposalId: string;
    testId: string;
  }>;
}

/**
 * POST /api/ideas/[ideaId]/proposals/[proposalId]/tests/[testId]/generate-report
 *
 * Triggers report generation for a completed test.
 */
export async function POST(
  request: NextRequest,
  context: RouteContext
): Promise<NextResponse | Response> {
  const { ideaId, proposalId, testId } = await context.params;
  const supabase = await createClient();

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Verify ownership through idea
  const { data: idea, error: ideaError } = await supabase
    .from('ideas')
    .select('user_id')
    .eq('id', ideaId)
    .single();

  if (ideaError || !idea || idea.user_id !== user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  // Verify test exists and belongs to proposal
  const { data: test, error: testError } = await supabase
    .from('validation_tests')
    .select('id, report_id, status')
    .eq('id', testId)
    .eq('proposal_id', proposalId)
    .single();

  if (testError || !test) {
    return NextResponse.json({ error: 'Test not found' }, { status: 404 });
  }

  // Check if report already exists
  if (test.report_id) {
    return NextResponse.redirect(
      new URL(`/ideas/${ideaId}/proposals/${proposalId}/tests/${testId}/report`, request.url)
    );
  }

  // Verify all sessions are complete
  const { data: sessions, error: sessionsError } = await supabase
    .from('sessions')
    .select('status')
    .eq('validation_test_id', testId);

  if (sessionsError || !sessions || sessions.length === 0) {
    return NextResponse.json({ error: 'No sessions found' }, { status: 400 });
  }

  const allComplete = sessions.every(
    s => s.status === 'completed' || s.status === 'abandoned' || s.status === 'expired'
  );

  if (!allComplete) {
    return NextResponse.json({ error: 'Not all sessions are complete' }, { status: 400 });
  }

  // Generate the report
  const result = await generateReport(testId, supabase);

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  // Redirect to the report page
  return NextResponse.redirect(
    new URL(`/ideas/${ideaId}/proposals/${proposalId}/tests/${testId}/report`, request.url)
  );
}
