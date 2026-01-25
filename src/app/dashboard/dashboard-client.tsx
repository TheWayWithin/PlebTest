'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CreateIdeaDialog, CreateIdeaLimitReached } from '@/components/ideas/create-idea-dialog';
import { Lightbulb, Zap, ArrowRight, LogOut } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { QuickFireProcessor } from '@/components/quick-fire-processor';

interface Idea {
  id: string;
  name: string;
  quick_fire_score: number | null;
  quick_fire_objection: string | null;
  created_at: string | null;
  updated_at: string | null;
}

interface DashboardClientProps {
  ideas: Idea[];
  tier: string;
  limit: number;
  currentCount: number;
  userEmail: string;
}

export function DashboardClient({
  ideas: initialIdeas,
  tier,
  limit,
  currentCount: initialCount,
  userEmail
}: DashboardClientProps) {
  const ideas = initialIdeas;
  const currentCount = initialCount;
  const router = useRouter();
  const supabase = createClient();

  const isAtLimit = currentCount >= limit;

  const handleIdeaCreated = () => {
    // Refresh the page to get updated ideas
    router.refresh();
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Recently';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getScoreColor = (score: number | null) => {
    if (score === null) return 'text-gray-400';
    if (score >= 70) return 'text-red-500';
    if (score >= 40) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getScoreLabel = (score: number | null) => {
    if (score === null) return null;
    if (score >= 70) return 'High Risk';
    if (score >= 40) return 'Medium Risk';
    return 'Low Risk';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Quick Fire Processor - handles post-signup Quick Fire flow */}
      <QuickFireProcessor />

      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Zap className="h-6 w-6 text-orange-500" />
              <span className="font-bold text-xl">PlebTest</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">{userEmail}</span>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Your Ideas</h1>
            <p className="text-gray-500 mt-1">
              {currentCount} of {limit} idea{limit > 1 ? 's' : ''} ({tier} plan)
            </p>
          </div>

          {isAtLimit ? (
            <CreateIdeaLimitReached tier={tier} />
          ) : (
            <CreateIdeaDialog
              currentCount={currentCount}
              limit={limit}
              tier={tier}
              onIdeaCreated={handleIdeaCreated}
            />
          )}
        </div>

        {/* Ideas Grid */}
        {ideas.length === 0 ? (
          <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
            <Lightbulb className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No ideas yet
            </h3>
            <p className="text-gray-500 mb-6">
              Create your first product idea and validate it with AI-powered analysis.
            </p>
            {!isAtLimit && (
              <CreateIdeaDialog
                currentCount={currentCount}
                limit={limit}
                tier={tier}
                onIdeaCreated={handleIdeaCreated}
              />
            )}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ideas.map((idea) => (
              <Link
                key={idea.id}
                href={`/ideas/${idea.id}`}
                className="bg-white rounded-lg border p-6 hover:shadow-md transition-shadow group"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-medium text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2">
                    {idea.name}
                  </h3>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-orange-600 transition-colors flex-shrink-0 ml-2" />
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    {formatDate(idea.created_at)}
                  </span>

                  {idea.quick_fire_score !== null ? (
                    <span className={`font-medium ${getScoreColor(idea.quick_fire_score)}`}>
                      {getScoreLabel(idea.quick_fire_score)} ({idea.quick_fire_score})
                    </span>
                  ) : (
                    <span className="text-gray-400 italic">
                      Not validated
                    </span>
                  )}
                </div>

                {idea.quick_fire_objection && (
                  <p className="mt-3 text-sm text-gray-600 line-clamp-2">
                    {idea.quick_fire_objection}
                  </p>
                )}
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
