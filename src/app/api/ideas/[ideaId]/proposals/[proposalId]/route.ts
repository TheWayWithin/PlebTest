import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { updateProposalSchema } from '@/lib/validations/proposal';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ ideaId: string; proposalId: string }> }
) {
  try {
    const { ideaId, proposalId } = await params;
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify idea belongs to user
    const { data: idea, error: ideaError } = await supabase
      .from('ideas')
      .select('id')
      .eq('id', ideaId)
      .eq('user_id', user.id)
      .single();

    if (ideaError || !idea) {
      return NextResponse.json({ error: 'Idea not found' }, { status: 404 });
    }

    // Fetch the proposal
    const { data: proposal, error } = await supabase
      .from('proposals')
      .select('*')
      .eq('id', proposalId)
      .eq('idea_id', ideaId)
      .single();

    if (error || !proposal) {
      return NextResponse.json({ error: 'Proposal not found' }, { status: 404 });
    }

    return NextResponse.json({ proposal });
  } catch (error) {
    console.error('Error in GET /api/ideas/[ideaId]/proposals/[proposalId]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ ideaId: string; proposalId: string }> }
) {
  try {
    const { ideaId, proposalId } = await params;
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify idea belongs to user
    const { data: idea, error: ideaError } = await supabase
      .from('ideas')
      .select('id')
      .eq('id', ideaId)
      .eq('user_id', user.id)
      .single();

    if (ideaError || !idea) {
      return NextResponse.json({ error: 'Idea not found' }, { status: 404 });
    }

    // Verify proposal exists and belongs to idea
    const { data: existingProposal, error: proposalError } = await supabase
      .from('proposals')
      .select('id')
      .eq('id', proposalId)
      .eq('idea_id', ideaId)
      .single();

    if (proposalError || !existingProposal) {
      return NextResponse.json({ error: 'Proposal not found' }, { status: 404 });
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = updateProposalSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validationResult.error.flatten().fieldErrors
        },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Build update object with only provided fields
    const updateData: Record<string, string | null> = {};
    if (data.problem !== undefined) updateData.problem = data.problem || null;
    if (data.solution !== undefined) updateData.solution = data.solution || null;
    if (data.hypotheses !== undefined) updateData.hypotheses = data.hypotheses || null;
    if (data.current_workarounds !== undefined) updateData.current_workarounds = data.current_workarounds || null;
    if (data.pricing_assumption !== undefined) updateData.pricing_assumption = data.pricing_assumption || null;
    if (data.competitors !== undefined) updateData.competitors = data.competitors || null;
    if (data.external_context !== undefined) updateData.external_context = data.external_context || null;
    if (data.external_source_url !== undefined) updateData.external_source_url = data.external_source_url || null;

    // Update the proposal
    const { data: proposal, error: updateError } = await supabase
      .from('proposals')
      .update(updateData)
      .eq('id', proposalId)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating proposal:', updateError);
      return NextResponse.json({ error: 'Failed to update proposal' }, { status: 500 });
    }

    return NextResponse.json({ proposal });
  } catch (error) {
    console.error('Error in PUT /api/ideas/[ideaId]/proposals/[proposalId]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ ideaId: string; proposalId: string }> }
) {
  try {
    const { ideaId, proposalId } = await params;
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify idea belongs to user
    const { data: idea, error: ideaError } = await supabase
      .from('ideas')
      .select('id')
      .eq('id', ideaId)
      .eq('user_id', user.id)
      .single();

    if (ideaError || !idea) {
      return NextResponse.json({ error: 'Idea not found' }, { status: 404 });
    }

    // Verify proposal exists and belongs to idea
    const { data: existingProposal, error: proposalError } = await supabase
      .from('proposals')
      .select('id')
      .eq('id', proposalId)
      .eq('idea_id', ideaId)
      .single();

    if (proposalError || !existingProposal) {
      return NextResponse.json({ error: 'Proposal not found' }, { status: 404 });
    }

    // Parse request body for action
    const body = await request.json();
    const { action } = body;

    if (action === 'archive') {
      const { data: proposal, error: updateError } = await supabase
        .from('proposals')
        .update({ status: 'archived' })
        .eq('id', proposalId)
        .select()
        .single();

      if (updateError) {
        console.error('Error archiving proposal:', updateError);
        return NextResponse.json({ error: 'Failed to archive proposal' }, { status: 500 });
      }

      return NextResponse.json({ proposal });
    }

    if (action === 'unarchive') {
      const { data: proposal, error: updateError } = await supabase
        .from('proposals')
        .update({ status: 'draft' })
        .eq('id', proposalId)
        .select()
        .single();

      if (updateError) {
        console.error('Error unarchiving proposal:', updateError);
        return NextResponse.json({ error: 'Failed to unarchive proposal' }, { status: 500 });
      }

      return NextResponse.json({ proposal });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Error in PATCH /api/ideas/[ideaId]/proposals/[proposalId]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ ideaId: string; proposalId: string }> }
) {
  try {
    const { ideaId, proposalId } = await params;
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify idea belongs to user
    const { data: idea, error: ideaError } = await supabase
      .from('ideas')
      .select('id')
      .eq('id', ideaId)
      .eq('user_id', user.id)
      .single();

    if (ideaError || !idea) {
      return NextResponse.json({ error: 'Idea not found' }, { status: 404 });
    }

    // Verify proposal exists and belongs to idea
    const { data: existingProposal, error: proposalError } = await supabase
      .from('proposals')
      .select('id')
      .eq('id', proposalId)
      .eq('idea_id', ideaId)
      .single();

    if (proposalError || !existingProposal) {
      return NextResponse.json({ error: 'Proposal not found' }, { status: 404 });
    }

    // Delete the proposal
    const { error: deleteError } = await supabase
      .from('proposals')
      .delete()
      .eq('id', proposalId);

    if (deleteError) {
      console.error('Error deleting proposal:', deleteError);
      return NextResponse.json({ error: 'Failed to delete proposal' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/ideas/[ideaId]/proposals/[proposalId]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
