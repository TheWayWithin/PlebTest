import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { CreateIcpForm } from '@/components/icps/create-icp-form';

interface PageProps {
  params: Promise<{
    ideaId: string;
    proposalId: string;
  }>;
}

export default async function NewIcpPage({ params }: PageProps) {
  const { ideaId, proposalId } = await params;
  const supabase = await createClient();

  // Verify user is authenticated
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect('/login');
  }

  // Verify the idea exists and belongs to user
  const { data: idea, error: ideaError } = await supabase
    .from('ideas')
    .select('id, name')
    .eq('id', ideaId)
    .eq('user_id', user.id)
    .single();

  if (ideaError || !idea) {
    redirect('/dashboard');
  }

  // Verify the proposal exists and belongs to idea
  const { data: proposal, error: proposalError } = await supabase
    .from('proposals')
    .select('id, problem')
    .eq('id', proposalId)
    .eq('idea_id', ideaId)
    .single();

  if (proposalError || !proposal) {
    redirect(`/ideas/${ideaId}`);
  }

  const proposalTitle = proposal.problem
    ? proposal.problem.length > 50
      ? proposal.problem.slice(0, 50) + '...'
      : proposal.problem
    : 'Your Proposal';

  return (
    <div className="min-h-screen bg-gray-950">
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

          <h1 className="text-2xl font-bold text-white mb-2">Create New ICP</h1>
          <p className="text-gray-400">
            Define an Ideal Customer Profile for &quot;{proposalTitle}&quot;
          </p>
        </div>

        {/* Info Box */}
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-6">
          <h3 className="text-blue-400 font-medium mb-2">What is an ICP?</h3>
          <p className="text-gray-300 text-sm">
            An Ideal Customer Profile (ICP) describes the type of customer who would get the most
            value from your solution. Defining your ICP helps you focus your validation efforts
            and create more targeted tests.
          </p>
        </div>

        {/* Form */}
        <CreateIcpForm ideaId={ideaId} proposalId={proposalId} />
      </div>
    </div>
  );
}
