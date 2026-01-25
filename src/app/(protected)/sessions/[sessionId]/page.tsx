import { redirect, notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { InteractiveSession, SpectatorSession } from '@/components/sessions';

interface PageProps {
  params: Promise<{ sessionId: string }>;
}

export default async function SessionPage({ params }: PageProps) {
  const { sessionId } = await params;
  const supabase = await createClient();

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch session data from the streaming API endpoint
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/sessions/${sessionId}/stream`,
    {
      headers: {
        // Forward auth cookies
        cookie: (await supabase.auth.getSession()).data.session?.access_token
          ? `sb-access-token=${(await supabase.auth.getSession()).data.session?.access_token}`
          : '',
      },
      cache: 'no-store',
    }
  );

  // If fetch fails, try direct database query
  if (!response.ok) {
    // Fetch session with related data directly
    const { data: session, error: sessionError } = await supabase
      .from('sessions')
      .select(`
        *,
        validation_tests!inner (
          proposal_id,
          pushback_preset,
          validation_mode,
          proposals!inner (
            problem,
            solution,
            hypotheses,
            ideas!inner (
              user_id,
              one_liner
            )
          )
        ),
        personas!inner (
          id,
          name,
          demographics,
          psychographics,
          skepticism_level
        )
      `)
      .eq('id', sessionId)
      .single();

    if (sessionError || !session) {
      notFound();
    }

    // Verify ownership
    const ideaUserId = (session.validation_tests as any)?.proposals?.ideas?.user_id;
    if (ideaUserId !== user.id) {
      notFound();
    }

    // Fetch messages
    const { data: messages } = await supabase
      .from('messages')
      .select('id, role, content, created_at')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    const sessionData = {
      session: {
        id: session.id,
        status: session.status || 'pending',
        mode: session.mode || 'interactive',
        persona: session.personas as any,
        proposal: (session.validation_tests as any)?.proposals,
        pushbackPreset: (session.validation_tests as any)?.pushback_preset || 'pragmatist',
        validationMode: (session.validation_tests as any)?.validation_mode || 'interactive',
      },
      messages: (messages || []).map((m) => ({
        id: m.id,
        role: m.role as 'user' | 'assistant',
        content: m.content || '',
        created_at: m.created_at || new Date().toISOString(),
      })),
    };

    // Render based on session mode
    const SessionComponent = sessionData.session.mode === 'spectator' ? SpectatorSession : InteractiveSession;

    return (
      <div className="container mx-auto py-6">
        <SessionComponent sessionId={sessionId} initialData={sessionData} />
      </div>
    );
  }

  const data = await response.json();

  // Render based on session mode
  const SessionComponent = data.session?.mode === 'spectator' ? SpectatorSession : InteractiveSession;

  return (
    <div className="container mx-auto py-6">
      <SessionComponent sessionId={sessionId} initialData={data} />
    </div>
  );
}
