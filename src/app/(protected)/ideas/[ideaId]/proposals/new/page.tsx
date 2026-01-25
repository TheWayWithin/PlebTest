import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { CreateProposalForm } from '@/components/proposals/create-proposal-form';

interface PageProps {
  params: Promise<{
    ideaId: string;
  }>;
}

export default async function NewProposalPage({ params }: PageProps) {
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

  // Verify the idea exists and belongs to user
  const { data: idea, error: ideaError } = await supabase
    .from('ideas')
    .select('id, name, quick_fire_score, quick_fire_objection')
    .eq('id', ideaId)
    .eq('user_id', user.id)
    .single();

  if (ideaError || !idea) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/ideas/${ideaId}`}
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to {idea.name}
          </Link>

          <h1 className="text-2xl font-bold text-white mb-2">Create New Proposal</h1>
          <p className="text-gray-400">
            Define your problem, solution, and key hypotheses to validate.
          </p>
        </div>

        {/* Quick Fire Context (if available) */}
        {idea.quick_fire_score !== null && idea.quick_fire_objection && (
          <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-4 mb-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-gray-400 mb-1">From your Quick Fire analysis:</p>
                <p className="text-gray-200">{idea.quick_fire_objection}</p>
              </div>
              <div className="text-center">
                <span className="text-xs text-gray-500 uppercase">Risk Score</span>
                <p
                  className={`text-2xl font-bold ${
                    idea.quick_fire_score >= 70
                      ? 'text-red-400'
                      : idea.quick_fire_score >= 40
                        ? 'text-yellow-400'
                        : 'text-green-400'
                  }`}
                >
                  {idea.quick_fire_score}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <CreateProposalForm ideaId={ideaId} ideaName={idea.name} />
      </div>
    </div>
  );
}
