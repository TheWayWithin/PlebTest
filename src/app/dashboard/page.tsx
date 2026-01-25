import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { DashboardClient } from './dashboard-client';

// Tier limits for number of ideas/products
const TIER_LIMITS: Record<string, number> = {
  solo: 1,
  growth: 3,
  scale: 10,
  pro: 20,
};

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect('/login');
  }

  // Fetch user's ideas
  const { data: ideas, error: ideasError } = await supabase
    .from('ideas')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  // Fetch user's subscription tier
  const { data: userData } = await supabase
    .from('users')
    .select('subscription_tier')
    .eq('id', user.id)
    .single();

  const tier = userData?.subscription_tier || 'solo';
  const limit = TIER_LIMITS[tier] || 1;
  const currentCount = ideas?.length || 0;

  if (ideasError) {
    console.error('Error fetching ideas:', ideasError);
  }

  return (
    <DashboardClient
      ideas={ideas || []}
      tier={tier}
      limit={limit}
      currentCount={currentCount}
      userEmail={user.email || ''}
    />
  );
}
