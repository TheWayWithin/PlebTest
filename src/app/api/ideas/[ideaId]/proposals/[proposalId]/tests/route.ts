import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createTestSchema, getTierFeatures } from '@/lib/validations/test';
import type { Database } from '@/types/database.types';

type ValidationTestInsert = Database['public']['Tables']['validation_tests']['Insert'];

interface RouteContext {
  params: Promise<{
    ideaId: string;
    proposalId: string;
  }>;
}

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const { ideaId, proposalId } = await context.params;
    const supabase = await createClient();

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify idea ownership
    const { data: idea, error: ideaError } = await supabase
      .from('ideas')
      .select('id, user_id')
      .eq('id', ideaId)
      .single();

    if (ideaError || !idea) {
      return NextResponse.json({ error: 'Idea not found' }, { status: 404 });
    }

    if (idea.user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Verify proposal exists and belongs to idea
    const { data: proposal, error: proposalError } = await supabase
      .from('proposals')
      .select('id, status')
      .eq('id', proposalId)
      .eq('idea_id', ideaId)
      .single();

    if (proposalError || !proposal) {
      return NextResponse.json({ error: 'Proposal not found' }, { status: 404 });
    }

    if (proposal.status === 'archived') {
      return NextResponse.json(
        { error: 'Cannot create test for archived proposal' },
        { status: 400 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = createTestSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { icp_ids, persona_count, test_mode, validation_mode, pushback_preset } =
      validationResult.data;

    // Verify all ICPs exist and belong to proposal
    const { data: icps, error: icpsError } = await supabase
      .from('icps')
      .select('id')
      .eq('proposal_id', proposalId)
      .in('id', icp_ids);

    if (icpsError || !icps || icps.length !== icp_ids.length) {
      return NextResponse.json(
        { error: 'One or more ICPs not found or invalid' },
        { status: 400 }
      );
    }

    // Get user tier and check usage limits
    const { data: userData } = await supabase
      .from('users')
      .select('subscription_tier')
      .eq('id', user.id)
      .single();

    const userTier = (userData?.subscription_tier || 'solo') as 'solo' | 'growth' | 'scale' | 'pro';
    const tierLimits = getTierFeatures(userTier);

    // Check persona count limit
    if (persona_count > tierLimits.maxPersonasPerTest) {
      return NextResponse.json(
        {
          error: `Maximum ${tierLimits.maxPersonasPerTest} personas allowed for your tier`,
        },
        { status: 400 }
      );
    }

    // Check monthly usage
    const now = new Date();
    const periodStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();

    const { data: usageData } = await supabase
      .from('usage_tracking')
      .select('id, tests_used')
      .eq('user_id', user.id)
      .gte('billing_period_start', periodStart)
      .lte('billing_period_end', periodEnd)
      .single();

    const currentUsage = usageData?.tests_used || 0;

    if (currentUsage >= tierLimits.testsPerMonth) {
      return NextResponse.json(
        {
          error: 'Monthly test limit reached. Please upgrade your plan.',
          testsUsed: currentUsage,
          testsAllowed: tierLimits.testsPerMonth,
        },
        { status: 403 }
      );
    }

    // Create the validation test
    const testInsert: ValidationTestInsert = {
      proposal_id: proposalId,
      icp_ids,
      persona_count,
      test_mode,
      validation_mode,
      pushback_preset,
      status: 'pending',
    };

    const { data: test, error: testError } = await supabase
      .from('validation_tests')
      .insert(testInsert)
      .select()
      .single();

    if (testError) {
      console.error('Error creating test:', testError);
      return NextResponse.json(
        { error: 'Failed to create test' },
        { status: 500 }
      );
    }

    // Update or create usage tracking
    if (usageData?.id) {
      await supabase
        .from('usage_tracking')
        .update({ tests_used: currentUsage + 1 })
        .eq('id', usageData.id);
    } else {
      await supabase.from('usage_tracking').insert({
        user_id: user.id,
        billing_period_start: periodStart,
        billing_period_end: periodEnd,
        tests_used: 1,
      });
    }

    // Update proposal status to testing
    await supabase
      .from('proposals')
      .update({ status: 'testing' })
      .eq('id', proposalId);

    return NextResponse.json({ test }, { status: 201 });
  } catch (error) {
    console.error('Unexpected error in POST /tests:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { ideaId, proposalId } = await context.params;
    const supabase = await createClient();

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify idea ownership
    const { data: idea, error: ideaError } = await supabase
      .from('ideas')
      .select('id, user_id')
      .eq('id', ideaId)
      .single();

    if (ideaError || !idea) {
      return NextResponse.json({ error: 'Idea not found' }, { status: 404 });
    }

    if (idea.user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Fetch all tests for this proposal
    const { data: tests, error: testsError } = await supabase
      .from('validation_tests')
      .select('*')
      .eq('proposal_id', proposalId)
      .order('created_at', { ascending: false });

    if (testsError) {
      console.error('Error fetching tests:', testsError);
      return NextResponse.json(
        { error: 'Failed to fetch tests' },
        { status: 500 }
      );
    }

    return NextResponse.json({ tests });
  } catch (error) {
    console.error('Unexpected error in GET /tests:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
