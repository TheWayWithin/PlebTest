import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createIcpSchema } from '@/lib/validations/icp';
import type { Database } from '@/types/database.types';

type IcpInsert = Database['public']['Tables']['icps']['Insert'];

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

    // Fetch ICPs for this proposal
    const { data: icps, error } = await supabase
      .from('icps')
      .select('*')
      .eq('proposal_id', proposalId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching ICPs:', error);
      return NextResponse.json({ error: 'Failed to fetch ICPs' }, { status: 500 });
    }

    return NextResponse.json({ icps });
  } catch (error) {
    console.error('Error in GET /api/ideas/[ideaId]/proposals/[proposalId]/icps:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(
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
    const { data: proposal, error: proposalError } = await supabase
      .from('proposals')
      .select('id')
      .eq('id', proposalId)
      .eq('idea_id', ideaId)
      .single();

    if (proposalError || !proposal) {
      return NextResponse.json({ error: 'Proposal not found' }, { status: 404 });
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = createIcpSchema.safeParse(body);

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

    // Build insert data with proper typing
    const insertData: IcpInsert = {
      proposal_id: proposalId,
      name: data.name,
      demographics: data.demographics ? { description: data.demographics } : null,
      psychographics: data.psychographics ? { description: data.psychographics } : null,
      context: data.context || null,
      current_solutions: data.current_solutions || null,
      pain_intensity: data.pain_intensity || null,
      decision_role: data.decision_role || null,
      adoption_tendency: data.adoption_tendency || null,
    };

    // Create the ICP
    const { data: icp, error: createError } = await supabase
      .from('icps')
      .insert(insertData)
      .select()
      .single();

    if (createError) {
      console.error('Error creating ICP:', createError);
      return NextResponse.json({ error: 'Failed to create ICP' }, { status: 500 });
    }

    return NextResponse.json({ icp }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/ideas/[ideaId]/proposals/[proposalId]/icps:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
