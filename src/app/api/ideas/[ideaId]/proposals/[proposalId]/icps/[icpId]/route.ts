import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { updateIcpSchema } from '@/lib/validations/icp';
import type { Database } from '@/types/database.types';

type IcpUpdate = Database['public']['Tables']['icps']['Update'];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ ideaId: string; proposalId: string; icpId: string }> }
) {
  try {
    const { ideaId, proposalId, icpId } = await params;
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
    const { data: proposal, error: proposalError } = await supabase
      .from('proposals')
      .select('id')
      .eq('id', proposalId)
      .eq('idea_id', ideaId)
      .single();

    if (proposalError || !proposal) {
      return NextResponse.json({ error: 'Proposal not found' }, { status: 404 });
    }

    // Fetch the ICP
    const { data: icp, error } = await supabase
      .from('icps')
      .select('*')
      .eq('id', icpId)
      .eq('proposal_id', proposalId)
      .single();

    if (error || !icp) {
      return NextResponse.json({ error: 'ICP not found' }, { status: 404 });
    }

    return NextResponse.json({ icp });
  } catch (error) {
    console.error('Error in GET /api/ideas/[ideaId]/proposals/[proposalId]/icps/[icpId]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ ideaId: string; proposalId: string; icpId: string }> }
) {
  try {
    const { ideaId, proposalId, icpId } = await params;
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
    const { data: proposal, error: proposalError } = await supabase
      .from('proposals')
      .select('id')
      .eq('id', proposalId)
      .eq('idea_id', ideaId)
      .single();

    if (proposalError || !proposal) {
      return NextResponse.json({ error: 'Proposal not found' }, { status: 404 });
    }

    // Verify ICP exists and belongs to proposal
    const { data: existingIcp, error: icpError } = await supabase
      .from('icps')
      .select('id')
      .eq('id', icpId)
      .eq('proposal_id', proposalId)
      .single();

    if (icpError || !existingIcp) {
      return NextResponse.json({ error: 'ICP not found' }, { status: 404 });
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = updateIcpSchema.safeParse(body);

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

    // Build update data
    const updateData: IcpUpdate = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.demographics !== undefined) {
      updateData.demographics = data.demographics ? { description: data.demographics } : null;
    }
    if (data.psychographics !== undefined) {
      updateData.psychographics = data.psychographics ? { description: data.psychographics } : null;
    }
    if (data.context !== undefined) updateData.context = data.context || null;
    if (data.current_solutions !== undefined) updateData.current_solutions = data.current_solutions || null;
    if (data.pain_intensity !== undefined) updateData.pain_intensity = data.pain_intensity || null;
    if (data.decision_role !== undefined) updateData.decision_role = data.decision_role || null;
    if (data.adoption_tendency !== undefined) updateData.adoption_tendency = data.adoption_tendency || null;

    // Update the ICP
    const { data: icp, error: updateError } = await supabase
      .from('icps')
      .update(updateData)
      .eq('id', icpId)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating ICP:', updateError);
      return NextResponse.json({ error: 'Failed to update ICP' }, { status: 500 });
    }

    return NextResponse.json({ icp });
  } catch (error) {
    console.error('Error in PUT /api/ideas/[ideaId]/proposals/[proposalId]/icps/[icpId]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ ideaId: string; proposalId: string; icpId: string }> }
) {
  try {
    const { ideaId, proposalId, icpId } = await params;
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
    const { data: proposal, error: proposalError } = await supabase
      .from('proposals')
      .select('id')
      .eq('id', proposalId)
      .eq('idea_id', ideaId)
      .single();

    if (proposalError || !proposal) {
      return NextResponse.json({ error: 'Proposal not found' }, { status: 404 });
    }

    // Verify ICP exists and belongs to proposal
    const { data: existingIcp, error: icpError } = await supabase
      .from('icps')
      .select('id')
      .eq('id', icpId)
      .eq('proposal_id', proposalId)
      .single();

    if (icpError || !existingIcp) {
      return NextResponse.json({ error: 'ICP not found' }, { status: 404 });
    }

    // Check if ICP is used in any active validation tests
    const { data: activeTests, error: testCheckError } = await supabase
      .from('validation_tests')
      .select('id')
      .eq('proposal_id', proposalId)
      .contains('icp_ids', [icpId])
      .in('status', ['pending', 'in_progress']);

    if (testCheckError) {
      console.error('Error checking active tests:', testCheckError);
      return NextResponse.json(
        { error: 'Failed to verify ICP usage' },
        { status: 500 }
      );
    }

    if (activeTests && activeTests.length > 0) {
      return NextResponse.json(
        {
          error: 'Cannot delete ICP while it is used in active tests',
          details: `This ICP is currently assigned to ${activeTests.length} active test(s). Please complete or cancel these tests before deleting the ICP.`,
          activeTestCount: activeTests.length
        },
        { status: 409 }
      );
    }

    // Delete the ICP
    const { error: deleteError } = await supabase
      .from('icps')
      .delete()
      .eq('id', icpId);

    if (deleteError) {
      console.error('Error deleting ICP:', deleteError);
      return NextResponse.json({ error: 'Failed to delete ICP' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/ideas/[ideaId]/proposals/[proposalId]/icps/[icpId]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
