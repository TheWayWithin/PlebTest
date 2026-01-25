/**
 * SSE Streaming Endpoint for Interactive Sessions
 *
 * Streams AI responses token-by-token using Server-Sent Events.
 * Handles checkpointing, graceful disconnects, and message persistence.
 */

import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createSessionPrompt, type SessionContext } from '@/lib/services/anti-sycophancy';
import type { Persona, PersonaDemographics, PersonaPsychographics, BigFiveTraits, SkepticismLevel } from '@/types/persona';
import type { PushbackPreset } from '@/lib/validations/test';
import type { Database } from '@/types/database.types';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const DEFAULT_MODEL = 'anthropic/claude-3-haiku'; // Fast, cost-effective for conversations
const CHECKPOINT_INTERVAL = 50; // Save every 50 tokens

interface RouteContext {
  params: Promise<{ sessionId: string }>;
}

type MessageInsert = Database['public']['Tables']['messages']['Insert'];

/**
 * POST /api/sessions/[sessionId]/stream
 *
 * Sends a message and streams the AI response.
 * Body: { message: string }
 */
export async function POST(request: NextRequest, context: RouteContext) {
  const { sessionId } = await context.params;
  const encoder = new TextEncoder();

  // Create a TransformStream for SSE
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();

  // Helper to send SSE events
  const sendEvent = async (event: string, data: unknown) => {
    const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
    await writer.write(encoder.encode(payload));
  };

  // Start async processing
  (async () => {
    try {
      const supabase = await createClient();

      // Check authentication
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        await sendEvent('error', { error: 'Unauthorized' });
        await writer.close();
        return;
      }

      // Parse request body
      const body = await request.json();
      const userMessage = body.message as string;

      if (!userMessage || typeof userMessage !== 'string') {
        await sendEvent('error', { error: 'Message is required' });
        await writer.close();
        return;
      }

      // Fetch session with related data
      const { data: session, error: sessionError } = await supabase
        .from('sessions')
        .select(`
          *,
          validation_tests!inner (
            proposal_id,
            pushback_preset,
            proposals!inner (
              problem,
              solution,
              hypotheses,
              ideas!inner (
                user_id
              )
            )
          ),
          personas!inner (
            *
          )
        `)
        .eq('id', sessionId)
        .single();

      if (sessionError || !session) {
        await sendEvent('error', { error: 'Session not found' });
        await writer.close();
        return;
      }

      // Verify ownership through the chain
      const ideaUserId = (session.validation_tests as any)?.proposals?.ideas?.user_id;
      if (ideaUserId !== user.id) {
        await sendEvent('error', { error: 'Forbidden' });
        await writer.close();
        return;
      }

      // Check session is active
      if (session.status !== 'active' && session.status !== 'pending') {
        await sendEvent('error', { error: `Session is ${session.status}` });
        await writer.close();
        return;
      }

      // Mark session as active if pending
      if (session.status === 'pending') {
        await supabase
          .from('sessions')
          .update({ status: 'active', last_activity_at: new Date().toISOString() })
          .eq('id', sessionId);
      }

      // Build persona from database row
      const personaRow = session.personas as any;
      const persona: Persona = {
        id: personaRow.id,
        icpId: personaRow.icp_id,
        name: personaRow.name,
        demographics: personaRow.demographics as PersonaDemographics,
        psychographics: personaRow.psychographics as PersonaPsychographics,
        bigFive: {
          openness: personaRow.openness ?? 50,
          conscientiousness: personaRow.conscientiousness ?? 50,
          extraversion: personaRow.extraversion ?? 50,
          agreeableness: personaRow.agreeableness ?? 50,
          neuroticism: personaRow.neuroticism ?? 50,
        },
        skepticismLevel: personaRow.skepticism_level as SkepticismLevel,
        generatedAt: new Date(personaRow.generated_at),
      };

      // Get proposal details
      const proposal = (session.validation_tests as any)?.proposals;
      const pushbackPreset = (session.validation_tests as any)?.pushback_preset as PushbackPreset;

      // Build session context for prompt
      const sessionContext: SessionContext = {
        persona,
        pushbackPreset,
        problem: proposal?.problem || '',
        solution: proposal?.solution || '',
        hypotheses: proposal?.hypotheses || '',
      };

      // Get system prompt
      const systemPrompt = createSessionPrompt(sessionContext);

      // Fetch conversation history
      const { data: history } = await supabase
        .from('messages')
        .select('role, content')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      // Build messages array
      const messages: Array<{ role: string; content: string }> = [
        { role: 'system', content: systemPrompt },
        ...(history || []).map((m) => ({
          role: m.role === 'user' ? 'user' : 'assistant',
          content: m.content || '',
        })),
        { role: 'user', content: userMessage },
      ];

      // Save user message to database
      const userMessageInsert: MessageInsert = {
        session_id: sessionId,
        role: 'user',
        content: userMessage,
      };

      await supabase.from('messages').insert(userMessageInsert);

      // Update session activity
      await supabase
        .from('sessions')
        .update({ last_activity_at: new Date().toISOString() })
        .eq('id', sessionId);

      // Stream from OpenRouter
      const apiKey = process.env.OPENROUTER_API_KEY;
      if (!apiKey) {
        await sendEvent('error', { error: 'OpenRouter API key not configured' });
        await writer.close();
        return;
      }

      const response = await fetch(OPENROUTER_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://plebtest.com',
          'X-Title': 'PlebTest Session',
        },
        body: JSON.stringify({
          model: DEFAULT_MODEL,
          messages,
          stream: true,
          max_tokens: 500,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('OpenRouter error:', response.status, errorText);
        await sendEvent('error', { error: 'AI service error' });
        await writer.close();
        return;
      }

      // Process streaming response
      const reader = response.body?.getReader();
      if (!reader) {
        await sendEvent('error', { error: 'No response stream' });
        await writer.close();
        return;
      }

      const decoder = new TextDecoder();
      let fullContent = '';
      let tokenCount = 0;
      let lastCheckpoint = 0;
      let assistantMessageId: string | null = null;

      // Create initial assistant message record
      const { data: assistantMessage } = await supabase
        .from('messages')
        .insert({
          session_id: sessionId,
          role: 'assistant',
          content: '',
        })
        .select('id')
        .single();

      assistantMessageId = assistantMessage?.id || null;

      // Send start event
      await sendEvent('start', { messageId: assistantMessageId });

      try {
        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            break;
          }

          // Decode chunk
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n').filter((line) => line.trim() !== '');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);

              if (data === '[DONE]') {
                continue;
              }

              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices?.[0]?.delta?.content || '';

                if (content) {
                  fullContent += content;
                  tokenCount++;

                  // Send token to client
                  await sendEvent('token', { content });

                  // Checkpoint save every N tokens
                  if (tokenCount - lastCheckpoint >= CHECKPOINT_INTERVAL) {
                    if (assistantMessageId) {
                      await supabase
                        .from('messages')
                        .update({ content: fullContent })
                        .eq('id', assistantMessageId);
                    }
                    lastCheckpoint = tokenCount;
                    await sendEvent('checkpoint', { tokens: tokenCount });
                  }
                }
              } catch (parseError) {
                // Ignore parse errors for malformed chunks
              }
            }
          }
        }
      } catch (streamError) {
        console.error('Stream error:', streamError);
        // Save partial content on disconnect
        if (assistantMessageId && fullContent) {
          await supabase
            .from('messages')
            .update({ content: fullContent + ' [interrupted]' })
            .eq('id', assistantMessageId);
        }
        await sendEvent('error', { error: 'Stream interrupted' });
        await writer.close();
        return;
      }

      // Final save
      if (assistantMessageId) {
        await supabase
          .from('messages')
          .update({ content: fullContent })
          .eq('id', assistantMessageId);
      }

      // Update session activity
      await supabase
        .from('sessions')
        .update({ last_activity_at: new Date().toISOString() })
        .eq('id', sessionId);

      // Send completion event
      await sendEvent('done', {
        messageId: assistantMessageId,
        content: fullContent,
        tokens: tokenCount,
      });

      await writer.close();
    } catch (error) {
      console.error('SSE stream error:', error);
      try {
        await sendEvent('error', { error: 'Internal server error' });
        await writer.close();
      } catch {
        // Writer may already be closed
      }
    }
  })();

  // Return the readable stream as SSE response
  return new Response(stream.readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}

/**
 * GET /api/sessions/[sessionId]/stream
 *
 * Returns session info and conversation history.
 */
export async function GET(request: NextRequest, context: RouteContext) {
  const { sessionId } = await context.params;
  const supabase = await createClient();

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Fetch session with related data
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
    return Response.json({ error: 'Session not found' }, { status: 404 });
  }

  // Verify ownership
  const ideaUserId = (session.validation_tests as any)?.proposals?.ideas?.user_id;
  if (ideaUserId !== user.id) {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }

  // Fetch messages
  const { data: messages } = await supabase
    .from('messages')
    .select('id, role, content, created_at')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true });

  return Response.json({
    session: {
      id: session.id,
      status: session.status,
      mode: session.mode,
      persona: session.personas,
      proposal: (session.validation_tests as any)?.proposals,
      pushbackPreset: (session.validation_tests as any)?.pushback_preset,
      validationMode: (session.validation_tests as any)?.validation_mode,
    },
    messages: messages || [],
  });
}
