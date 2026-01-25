import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { ArrowLeft, Construction } from 'lucide-react';

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
    .select('id, name')
    .eq('id', ideaId)
    .eq('user_id', user.id)
    .single();

  if (ideaError || !idea) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/ideas/${ideaId}`}
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to {idea.name}
          </Link>

          <h1 className="text-2xl font-bold text-white">New Proposal</h1>
        </div>

        {/* Coming Soon Placeholder */}
        <div className="text-center py-16 bg-gray-900/50 border border-gray-700 rounded-xl">
          <Construction className="w-16 h-16 text-orange-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">
            Create Proposal Form Coming Soon
          </h2>
          <p className="text-gray-400 max-w-md mx-auto mb-6">
            The full proposal creation form is being built. For now, proposals
            are automatically created when you use Quick Fire and click "Go Deeper".
          </p>
          <Link
            href={`/ideas/${ideaId}`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Idea
          </Link>
        </div>
      </div>
    </div>
  );
}
