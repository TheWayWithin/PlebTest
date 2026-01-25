import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, FlaskConical } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { TestConfigForm } from '@/components/tests/test-config-form';

interface PageProps {
  params: Promise<{
    ideaId: string;
    proposalId: string;
  }>;
}

export default async function NewTestPage({ params }: PageProps) {
  const { ideaId, proposalId } = await params;
  const supabase = await createClient();

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch idea and verify ownership
  const { data: idea, error: ideaError } = await supabase
    .from('ideas')
    .select('id, name, user_id')
    .eq('id', ideaId)
    .single();

  if (ideaError || !idea) {
    redirect('/ideas');
  }

  if (idea.user_id !== user.id) {
    redirect('/ideas');
  }

  // Fetch proposal
  const { data: proposal, error: proposalError } = await supabase
    .from('proposals')
    .select('id, problem, status')
    .eq('id', proposalId)
    .eq('idea_id', ideaId)
    .single();

  if (proposalError || !proposal) {
    redirect(`/ideas/${ideaId}`);
  }

  // Check if proposal is archived
  if (proposal.status === 'archived') {
    redirect(`/ideas/${ideaId}/proposals/${proposalId}`);
  }

  // Fetch ICPs for this proposal
  const { data: icps } = await supabase
    .from('icps')
    .select('id, name, pain_intensity')
    .eq('proposal_id', proposalId)
    .order('created_at', { ascending: false });

  // Fetch user tier and usage
  const { data: userData } = await supabase
    .from('users')
    .select('subscription_tier')
    .eq('id', user.id)
    .single();

  // Get current billing period usage
  const now = new Date();
  const periodStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();

  const { data: usageData } = await supabase
    .from('usage_tracking')
    .select('tests_used')
    .eq('user_id', user.id)
    .gte('billing_period_start', periodStart)
    .lte('billing_period_end', periodEnd)
    .single();

  const userTier = userData?.subscription_tier as 'solo' | 'growth' | 'scale' | 'pro' | null;
  const testsUsedThisMonth = usageData?.tests_used || 0;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href={`/ideas/${ideaId}/proposals/${proposalId}`}
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Proposal
        </Link>

        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
            <FlaskConical className="w-5 h-5 text-orange-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Configure Validation Test</h1>
            <p className="text-gray-400">
              Set up your AI-powered idea validation
            </p>
          </div>
        </div>
      </div>

      {/* Proposal Context */}
      <div className="mb-8 p-4 bg-gray-900/50 border border-gray-700 rounded-lg">
        <p className="text-sm text-gray-400 mb-1">Testing proposal for:</p>
        <p className="text-white font-medium">
          {proposal.problem
            ? proposal.problem.length > 100
              ? proposal.problem.slice(0, 100) + '...'
              : proposal.problem
            : 'Untitled Proposal'}
        </p>
      </div>

      {/* Test Configuration Form */}
      <TestConfigForm
        ideaId={ideaId}
        proposalId={proposalId}
        icps={icps || []}
        userTier={userTier}
        testsUsedThisMonth={testsUsedThisMonth}
      />
    </div>
  );
}
