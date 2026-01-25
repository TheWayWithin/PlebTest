import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Header } from '@/components/layout';
import { QuickFireProcessor } from '@/components/quick-fire-processor';
import { Sparkles, Lightbulb, ArrowRight, Plus } from 'lucide-react';

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch user's ideas
  const { data: ideas } = await supabase
    .from('ideas')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(10);

  const getScoreColor = (score: number | null) => {
    if (score === null) return 'text-gray-400';
    if (score >= 70) return 'text-red-400';
    if (score >= 40) return 'text-yellow-400';
    return 'text-green-400';
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Quick Fire Processor - handles post-signup Quick Fire flow */}
      <QuickFireProcessor />

      <Header />
      <main className="container py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard</h1>
            <p className="mt-2 text-zinc-400">Welcome back, {user.email}</p>
          </div>
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg hover:from-orange-600 hover:to-amber-600 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            Quick Fire
          </Link>
        </div>

        {/* Ideas Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Your Ideas</h2>
            <button className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm">
              <Plus className="w-4 h-4" />
              New Idea
            </button>
          </div>

          {ideas && ideas.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {ideas.map((idea) => (
                <Link
                  key={idea.id}
                  href={`/ideas/${idea.id}`}
                  className="group block p-5 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-zinc-700 transition-all"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="p-2 bg-zinc-800 rounded-lg group-hover:bg-zinc-700 transition-colors">
                      <Lightbulb className="w-5 h-5 text-orange-400" />
                    </div>
                    {idea.quick_fire_score !== null && (
                      <span
                        className={`text-2xl font-bold ${getScoreColor(idea.quick_fire_score)}`}
                      >
                        {idea.quick_fire_score}
                      </span>
                    )}
                  </div>
                  <h3 className="text-white font-medium mb-2 line-clamp-2">{idea.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-500">
                      {idea.created_at
                        ? new Date(idea.created_at).toLocaleDateString()
                        : 'Recently'}
                    </span>
                    <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-orange-400 transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-zinc-900 border border-zinc-800 rounded-xl">
              <Lightbulb className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No ideas yet</h3>
              <p className="text-zinc-400 mb-6 max-w-sm mx-auto">
                Start by testing your idea with Quick Fire to get instant feedback
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all"
              >
                <Sparkles className="w-5 h-5" />
                Try Quick Fire
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
