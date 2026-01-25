import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { ArrowLeft, FileText, Plus } from 'lucide-react';
import { EditIdeaDialog } from '@/components/ideas/edit-idea-dialog';

interface PageProps {
  params: Promise<{
    ideaId: string;
  }>;
}

export default async function IdeaPage({ params }: PageProps) {
  const { ideaId } = await params;
  const supabase = await createClient();

  // Verify user is authenticated
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect('/login');
  }

  // Fetch the idea
  const { data: idea, error: ideaError } = await supabase
    .from('ideas')
    .select('*')
    .eq('id', ideaId)
    .eq('user_id', user.id)
    .single();

  if (ideaError || !idea) {
    redirect('/dashboard');
  }

  // Fetch proposals for this idea
  const { data: proposals } = await supabase
    .from('proposals')
    .select('*')
    .eq('idea_id', ideaId)
    .order('created_at', { ascending: false });

  const getScoreColor = (score: number | null) => {
    if (score === null) return 'text-gray-400';
    if (score >= 70) return 'text-red-400';
    if (score >= 40) return 'text-yellow-400';
    return 'text-green-400';
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>

          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white">{idea.name}</h1>
              <EditIdeaDialog ideaId={ideaId} currentName={idea.name} />
            </div>

            {idea.quick_fire_score !== null && (
              <div className="flex flex-col items-center bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2">
                <span className="text-xs text-gray-500 uppercase tracking-wide">Risk Score</span>
                <span className={`text-3xl font-bold ${getScoreColor(idea.quick_fire_score)}`}>
                  {idea.quick_fire_score}
                </span>
              </div>
            )}
          </div>

          {idea.quick_fire_objection && (
            <p className="text-gray-400 mt-2">Key challenge: {idea.quick_fire_objection}</p>
          )}
        </div>

        {/* Proposals Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Proposals</h2>
            <Link
              href={`/ideas/${ideaId}/proposals/new`}
              className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm"
            >
              <Plus className="w-4 h-4" />
              New Proposal
            </Link>
          </div>

          {proposals && proposals.length > 0 ? (
            <div className="space-y-3">
              {proposals.map((proposal) => (
                <Link
                  key={proposal.id}
                  href={`/ideas/${ideaId}/proposals/${proposal.id}`}
                  className="block p-4 bg-gray-900/50 border border-gray-700 rounded-xl hover:border-gray-600 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-gray-800 rounded-lg">
                      <FileText className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-medium truncate">
                        {proposal.problem ? proposal.problem.slice(0, 60) + '...' : 'Untitled Proposal'}
                      </h3>
                      {proposal.solution && (
                        <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                          {proposal.solution}
                        </p>
                      )}
                      <div className="flex items-center gap-3 mt-2">
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            proposal.status === 'tested'
                              ? 'bg-green-500/20 text-green-400'
                              : proposal.status === 'testing'
                                ? 'bg-blue-500/20 text-blue-400'
                                : 'bg-gray-500/20 text-gray-400'
                          }`}
                        >
                          {proposal.status || 'draft'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {proposal.created_at
                            ? new Date(proposal.created_at).toLocaleDateString()
                            : 'Recently'}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-900/50 border border-gray-700 rounded-xl">
              <FileText className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">No proposals yet</p>
              <p className="text-gray-500 text-sm mt-1">Create your first proposal to start testing</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
