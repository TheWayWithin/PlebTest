import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateProposalFromIdea } from '@/lib/openrouter';

/**
 * POST /api/ideas/from-quick-fire
 *
 * Creates an Idea and auto-generates a Proposal from Quick Fire data.
 * Called by the client after successful authentication.
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Verify user is authenticated
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();
    const { oneLiner, score, keyObjection } = body;

    if (!oneLiner || typeof score !== 'number' || !keyObjection) {
      return NextResponse.json(
        { error: 'Missing required fields: oneLiner, score, keyObjection' },
        { status: 400 }
      );
    }

    // Create the Idea
    const { data: idea, error: ideaError } = await supabase
      .from('ideas')
      .insert({
        user_id: user.id,
        name: oneLiner.slice(0, 200), // Full one-liner as the name
        quick_fire_score: score,
        quick_fire_objection: keyObjection,
      })
      .select()
      .single();

    if (ideaError) {
      console.error('Failed to create idea:', ideaError);
      return NextResponse.json({ error: 'Failed to create idea' }, { status: 500 });
    }

    // Generate proposal content using AI
    let proposalContent;
    try {
      proposalContent = await generateProposalFromIdea(oneLiner, keyObjection);
    } catch (aiError) {
      console.error('AI proposal generation failed:', aiError);
      // Fallback to basic content if AI fails
      proposalContent = {
        problem: `Users face challenges that ${oneLiner} aims to solve.`,
        solution: oneLiner,
        hypotheses: `Key assumption: ${keyObjection}`,
      };
    }

    // Create the Proposal (matches actual schema: problem, solution, hypotheses, etc.)
    const { data: proposal, error: proposalError } = await supabase
      .from('proposals')
      .insert({
        idea_id: idea.id,
        problem: proposalContent.problem,
        solution: proposalContent.solution,
        hypotheses: proposalContent.hypotheses,
        status: 'draft',
      })
      .select()
      .single();

    if (proposalError) {
      console.error('Failed to create proposal:', proposalError);
      // Don't fail completely - idea was created
      return NextResponse.json({
        success: true,
        idea,
        proposal: null,
        warning: 'Idea created but proposal generation failed',
      });
    }

    return NextResponse.json({
      success: true,
      idea,
      proposal,
      redirectUrl: `/ideas/${idea.id}/proposals/${proposal.id}`,
    });
  } catch (error) {
    console.error('Unexpected error in from-quick-fire:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
