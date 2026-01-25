import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { IcpView } from './icp-view';

interface PageProps {
  params: Promise<{
    ideaId: string;
    proposalId: string;
    icpId: string;
  }>;
}

export default async function IcpPage({ params }: PageProps) {
  const { ideaId, proposalId, icpId } = await params;
  const supabase = await createClient();

  // Verify user is authenticated
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect('/login');
  }

  // Fetch the idea to verify ownership
  const { data: idea, error: ideaError } = await supabase
    .from('ideas')
    .select('id, name')
    .eq('id', ideaId)
    .eq('user_id', user.id)
    .single();

  if (ideaError || !idea) {
    redirect('/dashboard');
  }

  // Fetch the proposal
  const { data: proposal, error: proposalError } = await supabase
    .from('proposals')
    .select('id, problem')
    .eq('id', proposalId)
    .eq('idea_id', ideaId)
    .single();

  if (proposalError || !proposal) {
    redirect(`/ideas/${ideaId}`);
  }

  // Fetch the ICP
  const { data: icp, error: icpError } = await supabase
    .from('icps')
    .select('*')
    .eq('id', icpId)
    .eq('proposal_id', proposalId)
    .single();

  if (icpError || !icp) {
    redirect(`/ideas/${ideaId}/proposals/${proposalId}`);
  }

  // Transform the ICP data to match the expected interface
  const transformedIcp = {
    ...icp,
    demographics: icp.demographics as { description?: string } | null,
    psychographics: icp.psychographics as { description?: string } | null,
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <IcpView
        idea={idea}
        proposal={proposal}
        icp={transformedIcp}
      />
    </div>
  );
}
