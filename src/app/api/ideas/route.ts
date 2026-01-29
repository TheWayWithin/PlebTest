import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Tier limits for number of ideas/products
const TIER_LIMITS: Record<string, number> = {
  solo: 1,
  growth: 3,
  scale: 10,
  pro: 20,
};

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get request body
    const body = await request.json();
    const { name } = body;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    // Get user's subscription tier
    let { data: userData, error: userError } = await supabase
      .from('users')
      .select('subscription_tier')
      .eq('id', user.id)
      .single();

    // If user record doesn't exist, create it (fallback for email confirmation flow)
    if (userError && userError.code === 'PGRST116') {
      const { data: newUser, error: createUserError } = await supabase
        .from('users')
        .insert({
          id: user.id,
          email: user.email!,
          name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'User',
          subscription_tier: 'solo',
        })
        .select('subscription_tier')
        .single();

      if (createUserError) {
        console.error('Error creating user record:', createUserError);
        return NextResponse.json(
          { error: 'Failed to create user record' },
          { status: 500 }
        );
      }
      userData = newUser;
      userError = null;
    } else if (userError) {
      console.error('Error fetching user data:', userError);
      return NextResponse.json(
        { error: 'Failed to fetch user data' },
        { status: 500 }
      );
    }

    const tier = userData?.subscription_tier || 'solo';
    const limit = TIER_LIMITS[tier] || 1;

    // Count existing ideas for this user
    const { count, error: countError } = await supabase
      .from('ideas')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    if (countError) {
      console.error('Error counting ideas:', countError);
      return NextResponse.json(
        { error: 'Failed to check idea limit' },
        { status: 500 }
      );
    }

    const currentCount = count || 0;

    if (currentCount >= limit) {
      return NextResponse.json(
        {
          error: `You have reached your limit of ${limit} idea${limit > 1 ? 's' : ''} on the ${tier} plan. Upgrade to add more.`,
          code: 'TIER_LIMIT_REACHED',
          currentCount,
          limit,
          tier
        },
        { status: 403 }
      );
    }

    // Create the idea
    const { data: idea, error: createError } = await supabase
      .from('ideas')
      .insert({
        user_id: user.id,
        name: name.trim(),
      })
      .select()
      .single();

    if (createError) {
      console.error('Error creating idea:', createError);
      return NextResponse.json(
        { error: 'Failed to create idea' },
        { status: 500 }
      );
    }

    return NextResponse.json({ idea }, { status: 201 });

  } catch (error) {
    console.error('Unexpected error in POST /api/ideas:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const supabase = await createClient();

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user's ideas
    const { data: ideas, error } = await supabase
      .from('ideas')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching ideas:', error);
      return NextResponse.json(
        { error: 'Failed to fetch ideas' },
        { status: 500 }
      );
    }

    // Get user's tier info for limit display
    let { data: userData } = await supabase
      .from('users')
      .select('subscription_tier')
      .eq('id', user.id)
      .single();

    // If user record doesn't exist, create it (fallback for email confirmation flow)
    if (!userData) {
      const { data: newUser } = await supabase
        .from('users')
        .insert({
          id: user.id,
          email: user.email!,
          name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'User',
          subscription_tier: 'solo',
        })
        .select('subscription_tier')
        .single();

      userData = newUser;
    }

    const tier = userData?.subscription_tier || 'solo';
    const limit = TIER_LIMITS[tier] || 1;

    return NextResponse.json({
      ideas,
      tier,
      limit,
      currentCount: ideas?.length || 0
    });

  } catch (error) {
    console.error('Unexpected error in GET /api/ideas:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
