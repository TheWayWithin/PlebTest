import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { completeSession, checkTestCompletion } from '@/lib/services/session-completion';

interface RouteContext {
  params: Promise<{ sessionId: string }>;
}

/**
 * POST /api/sessions/[sessionId]/complete
 * Complete a session and extract validation signals
 */
export async function POST(
  request: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  const { sessionId } = await context.params;
  const supabase = await createClient();

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Verify session ownership through validation_test -> proposal -> idea -> user chain
  const { data: session, error: sessionError } = await supabase
    .from('sessions')
    .select(`
      id,
      status,
      validation_test_id,
      validation_tests!inner (
        proposal_id,
        proposals!inner (
          idea_id,
          ideas!inner (
            user_id
          )
        )
      )
    `)
    .eq('id', sessionId)
    .single();

  if (sessionError || !session) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 });
  }

  // Check ownership
  const ideaUserId = (session.validation_tests as any)?.proposals?.ideas?.user_id;
  if (ideaUserId !== user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  // Check if session is in a valid state to complete
  if (session.status === 'completed') {
    return NextResponse.json({ error: 'Session already completed' }, { status: 400 });
  }

  if (session.status === 'pending') {
    return NextResponse.json({ error: 'Session not started' }, { status: 400 });
  }

  // Complete the session
  const result = await completeSession(sessionId, supabase);

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  // Check if all sessions in the test are complete
  const testComplete = await checkTestCompletion(
    session.validation_test_id,
    supabase
  );

  return NextResponse.json({
    success: true,
    signals: result.signals,
    testComplete,
  });
}
