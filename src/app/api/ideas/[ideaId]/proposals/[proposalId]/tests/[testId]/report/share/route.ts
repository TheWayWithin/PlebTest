import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { randomBytes } from 'crypto';
import { shareReportSchema, validateBody, isValidationError } from '@/lib/validations';

interface RouteParams {
  params: Promise<{
    ideaId: string;
    proposalId: string;
    testId: string;
  }>;
}

/**
 * PATCH /api/ideas/[ideaId]/proposals/[proposalId]/tests/[testId]/report/share
 * Update report share settings (is_public, hide_proposal_details)
 * Generates share_token if making public for the first time
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { ideaId, proposalId, testId } = await params;
    const supabase = await createClient();

    // Verify authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify user owns the idea
    const { data: idea, error: ideaError } = await supabase
      .from('ideas')
      .select('id, user_id')
      .eq('id', ideaId)
      .single();

    if (ideaError || !idea || idea.user_id !== user.id) {
      return NextResponse.json({ error: 'Idea not found' }, { status: 404 });
    }

    // Verify the test belongs to the proposal and has a report
    const { data: test, error: testError } = await supabase
      .from('validation_tests')
      .select('id, report_id')
      .eq('id', testId)
      .eq('proposal_id', proposalId)
      .single();

    if (testError || !test || !test.report_id) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    // Parse and validate request body
    const body = await request.json();
    const validated = validateBody(shareReportSchema, body);
    if (isValidationError(validated)) return validated;

    const { is_public, hide_proposal_details } = validated;

    // Get current report to check if we need to generate a token
    const { data: currentReport, error: reportFetchError } = await supabase
      .from('reports')
      .select('share_token')
      .eq('id', test.report_id)
      .single();

    if (reportFetchError || !currentReport) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    // Generate share token if making public and no token exists
    let shareToken = currentReport.share_token;
    if (is_public && !shareToken) {
      // Generate a URL-safe random token (22 chars, similar to YouTube video IDs)
      shareToken = randomBytes(16).toString('base64url').slice(0, 22);
    }

    // Update the report
    const updateData: {
      is_public: boolean;
      hide_proposal_details?: boolean;
      share_token?: string;
    } = {
      is_public,
    };

    if (typeof hide_proposal_details === 'boolean') {
      updateData.hide_proposal_details = hide_proposal_details;
    }

    if (shareToken) {
      updateData.share_token = shareToken;
    }

    const { data: report, error: updateError } = await supabase
      .from('reports')
      .update(updateData)
      .eq('id', test.report_id)
      .select('id, is_public, hide_proposal_details, share_token')
      .single();

    if (updateError) {
      console.error('Error updating report:', updateError);
      return NextResponse.json(
        { error: 'Failed to update report' },
        { status: 500 }
      );
    }

    return NextResponse.json(report);
  } catch (error) {
    console.error('Share report error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
