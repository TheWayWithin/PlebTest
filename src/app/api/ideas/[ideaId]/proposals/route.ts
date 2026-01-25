import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createProposalSchema } from '@/lib/validations/proposal';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ ideaId: string }> }
) {
  try {
    const { ideaId } = await params;
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

    // Fetch proposals for this idea
    const { data: proposals, error } = await supabase
      .from('proposals')
      .select('*')
      .eq('idea_id', ideaId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching proposals:', error);
      return NextResponse.json({ error: 'Failed to fetch proposals' }, { status: 500 });
    }

    return NextResponse.json({ proposals });
  } catch (error) {
    console.error('Error in GET /api/ideas/[ideaId]/proposals:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ ideaId: string }> }
) {
  try {
    const { ideaId } = await params;
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

    // Parse and validate request body
    const body = await request.json();
    const validationResult = createProposalSchema.safeParse(body);

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

    // Create the proposal
    const { data: proposal, error: createError } = await supabase
      .from('proposals')
      .insert({
        idea_id: ideaId,
        problem: data.problem,
        solution: data.solution,
        hypotheses: data.hypotheses || null,
        current_workarounds: data.current_workarounds || null,
        pricing_assumption: data.pricing_assumption || null,
        competitors: data.competitors || null,
        external_context: data.external_context || null,
        external_source_url: data.external_source_url || null,
        status: 'draft',
      })
      .select()
      .single();

    if (createError) {
      console.error('Error creating proposal:', createError);
      return NextResponse.json({ error: 'Failed to create proposal' }, { status: 500 });
    }

    return NextResponse.json({ proposal }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/ideas/[ideaId]/proposals:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
