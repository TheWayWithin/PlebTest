import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, FlaskConical, Clock, Users, MessageSquare, Loader2, Eye, Play, CheckCircle, XCircle, AlertCircle, FileText } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface PageProps {
  params: Promise<{
    ideaId: string;
    proposalId: string;
    testId: string;
  }>;
}

const STATUS_CONFIG = {
  pending: {
    label: 'Pending',
    color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    description: 'Test is queued and will start soon',
  },
  in_progress: {
    label: 'In Progress',
    color: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    description: 'AI personas are conducting interviews',
  },
  completed: {
    label: 'Completed',
    color: 'bg-green-500/20 text-green-400 border-green-500/30',
    description: 'Test finished - view your report',
  },
  cancelled: {
    label: 'Cancelled',
    color: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    description: 'Test was cancelled',
  },
  failed: {
    label: 'Failed',
    color: 'bg-red-500/20 text-red-400 border-red-500/30',
    description: 'Test encountered an error',
  },
};

export default async function TestViewPage({ params }: PageProps) {
  const { ideaId, proposalId, testId } = await params;
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
    .select('id, problem')
    .eq('id', proposalId)
    .eq('idea_id', ideaId)
    .single();

  if (proposalError || !proposal) {
    redirect(`/ideas/${ideaId}`);
  }

  // Fetch test
  const { data: test, error: testError } = await supabase
    .from('validation_tests')
    .select('*')
    .eq('id', testId)
    .eq('proposal_id', proposalId)
    .single();

  if (testError || !test) {
    redirect(`/ideas/${ideaId}/proposals/${proposalId}`);
  }

  // Fetch sessions with persona info
  const { data: sessions } = await supabase
    .from('sessions')
    .select(`
      id,
      status,
      mode,
      message_count,
      score,
      need_validated,
      solution_resonated,
      personas!inner (
        id,
        name,
        skepticism_level
      )
    `)
    .eq('validation_test_id', testId)
    .order('created_at', { ascending: true });

  const status = (test.status || 'pending') as keyof typeof STATUS_CONFIG;
  const statusConfig = STATUS_CONFIG[status];

  // Calculate progress
  const totalSessions = sessions?.length || 0;
  const completedSessions = sessions?.filter(s => s.status === 'completed' || s.status === 'abandoned' || s.status === 'expired').length || 0;
  const activeSession = sessions?.find(s => s.status === 'active');
  const progressPercent = totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0;
  const allSessionsComplete = totalSessions > 0 && completedSessions === totalSessions;

  // Session status config
  const SESSION_STATUS = {
    pending: { icon: Clock, color: 'text-yellow-400', label: 'Pending' },
    active: { icon: Play, color: 'text-blue-400', label: 'In Progress' },
    completed: { icon: CheckCircle, color: 'text-green-400', label: 'Complete' },
    abandoned: { icon: XCircle, color: 'text-red-400', label: 'Abandoned' },
    expired: { icon: AlertCircle, color: 'text-gray-400', label: 'Expired' },
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href={`/ideas/${ideaId}/proposals/${proposalId}`}
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Proposal
        </Link>

        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-orange-500/20 flex items-center justify-center">
              <FlaskConical className="w-6 h-6 text-orange-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Validation Test</h1>
              <p className="text-gray-400">
                {test.created_at
                  ? `Created ${new Date(test.created_at).toLocaleDateString()}`
                  : 'Recently created'}
              </p>
            </div>
          </div>

          <Badge className={`${statusConfig.color} border`}>
            {statusConfig.label}
          </Badge>
        </div>
      </div>

      {/* Status Card */}
      <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-center gap-4">
          {status === 'pending' || status === 'in_progress' ? (
            <Loader2 className="w-8 h-8 text-orange-400 animate-spin" />
          ) : (
            <FlaskConical className="w-8 h-8 text-orange-400" />
          )}
          <div className="text-center">
            <p className="text-lg text-white font-medium">{statusConfig.description}</p>
            <p className="text-sm text-gray-400 mt-1">
              {status === 'pending' && 'Personas are being generated...'}
              {status === 'in_progress' && 'This usually takes a few minutes'}
              {status === 'completed' && 'Click below to view your full report'}
            </p>
          </div>
        </div>
      </div>

      {/* Test Configuration Summary */}
      <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6 mb-6">
        <h2 className="text-lg font-semibold text-white mb-4">Test Configuration</h2>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
            <Users className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-400">Personas</p>
              <p className="text-white font-medium">{test.persona_count}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
            <Clock className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-400">Test Mode</p>
              <p className="text-white font-medium capitalize">{test.test_mode || 'standard'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
            <MessageSquare className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-400">Validation Mode</p>
              <p className="text-white font-medium capitalize">{test.validation_mode || 'spectator'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
            <FlaskConical className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-400">Pushback Level</p>
              <p className="text-white font-medium capitalize">{test.pushback_preset || 'pragmatist'}</p>
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-gray-800/50 rounded-lg">
          <p className="text-sm text-gray-400 mb-1">ICPs Being Tested</p>
          <p className="text-white">{test.icp_ids?.length || 0} customer profile(s)</p>
        </div>
      </div>

      {/* Sessions List */}
      {sessions && sessions.length > 0 && (
        <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Sessions</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">
                {completedSessions} / {totalSessions} complete
              </span>
              <div className="w-32">
                <Progress value={progressPercent} className="h-2" />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {sessions.map((session) => {
              const sessionStatus = (session.status || 'pending') as keyof typeof SESSION_STATUS;
              const StatusIcon = SESSION_STATUS[sessionStatus]?.icon || Clock;
              const statusColor = SESSION_STATUS[sessionStatus]?.color || 'text-gray-400';
              const statusLabel = SESSION_STATUS[sessionStatus]?.label || 'Unknown';
              const persona = session.personas as { id: string; name: string; skepticism_level: string };

              return (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700"
                >
                  <div className="flex items-center gap-4">
                    <StatusIcon className={`w-5 h-5 ${statusColor}`} />
                    <div>
                      <p className="text-white font-medium">{persona.name}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <span className="capitalize">{persona.skepticism_level || 'medium'} skepticism</span>
                        {session.message_count !== null && session.message_count > 0 && (
                          <>
                            <span>•</span>
                            <span>{session.message_count} messages</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {session.status === 'completed' && (
                      <div className="flex items-center gap-2 text-sm">
                        {session.need_validated && (
                          <Badge className="bg-green-500/20 text-green-400 border border-green-500/30">
                            Need ✓
                          </Badge>
                        )}
                        {session.solution_resonated && (
                          <Badge className="bg-blue-500/20 text-blue-400 border border-blue-500/30">
                            Solution ✓
                          </Badge>
                        )}
                        {session.score !== null && (
                          <span className="text-gray-400">Score: {session.score}</span>
                        )}
                      </div>
                    )}

                    {(session.status === 'active' || session.status === 'pending') && session.mode === 'interactive' ? (
                      <Link href={`/sessions/${session.id}`}>
                        <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                          <Play className="w-4 h-4 mr-1" />
                          Join
                        </Button>
                      </Link>
                    ) : session.status === 'active' || session.status === 'pending' ? (
                      <Link href={`/sessions/${session.id}`}>
                        <Button size="sm" variant="outline" className="border-gray-600">
                          <Eye className="w-4 h-4 mr-1" />
                          Watch
                        </Button>
                      </Link>
                    ) : session.status === 'completed' ? (
                      <Link href={`/sessions/${session.id}`}>
                        <Button size="sm" variant="outline" className="border-gray-600">
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                      </Link>
                    ) : (
                      <Badge className={`${SESSION_STATUS[sessionStatus]?.color || 'text-gray-400'}`}>
                        {statusLabel}
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-center gap-4">
        {status === 'completed' && test.report_id && (
          <Link href={`/ideas/${ideaId}/proposals/${proposalId}/tests/${testId}/report`}>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">
              <FileText className="w-4 h-4 mr-2" />
              View Report
            </Button>
          </Link>
        )}

        {allSessionsComplete && !test.report_id && (
          <form action={`/api/ideas/${ideaId}/proposals/${proposalId}/tests/${testId}/generate-report`} method="POST">
            <Button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white">
              <FileText className="w-4 h-4 mr-2" />
              Generate Report
            </Button>
          </form>
        )}

        {(status === 'pending' || status === 'in_progress') && !allSessionsComplete && (
          <Button variant="outline" className="border-gray-700 text-gray-300" disabled>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            {activeSession ? 'Sessions in progress...' : 'Preparing sessions...'}
          </Button>
        )}

        <Link href={`/ideas/${ideaId}/proposals/${proposalId}`}>
          <Button variant="outline" className="border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800">
            Back to Proposal
          </Button>
        </Link>
      </div>

    </div>
  );
}
