/**
 * Session Completion Service
 *
 * Handles completing a session:
 * - Builds transcript from messages
 * - Extracts validation signals using AI
 * - Updates session with results
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';
import { buildSignalExtractionPrompt, type ValidationSignals } from './anti-sycophancy';

type TypedSupabaseClient = SupabaseClient<Database>;

interface Message {
  role: string;
  content: string;
  created_at: string | null;
}

interface SessionCompletionResult {
  success: boolean;
  signals?: ValidationSignals;
  error?: string;
}

/**
 * Build a readable transcript from messages
 */
function buildTranscript(messages: Message[], personaName: string): string {
  return messages
    .map((m) => {
      const speaker = m.role === 'user' ? 'Founder' : personaName;
      return `${speaker}: ${m.content}`;
    })
    .join('\n\n');
}

/**
 * Call AI to extract validation signals from transcript
 */
async function extractSignals(transcript: string): Promise<ValidationSignals> {
  const prompt = buildSignalExtractionPrompt(transcript);

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      'X-Title': 'PlebTest Signal Extraction',
    },
    body: JSON.stringify({
      model: 'anthropic/claude-3.5-haiku',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 1000,
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`AI extraction failed: ${error}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error('No content in AI response');
  }

  // Parse JSON response
  try {
    // Handle potential markdown code blocks
    const jsonContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(jsonContent) as ValidationSignals;
  } catch {
    throw new Error(`Failed to parse signals JSON: ${content}`);
  }
}

/**
 * Calculate a session score based on extracted signals
 * Score represents overall validation quality (0-100)
 */
function calculateScore(signals: ValidationSignals): number {
  let score = 0;

  // Need validated is important (30 points)
  if (signals.needValidated) {
    score += 30;
  }

  // Solution resonance (25 points)
  if (signals.solutionResonated) {
    score += 25;
  }

  // Commitment level (25 points max)
  const commitmentScores: Record<typeof signals.commitmentLevel, number> = {
    none: 0,
    verbal_interest: 10,
    willing_to_try: 18,
    willing_to_pay: 25,
  };
  score += commitmentScores[signals.commitmentLevel];

  // Positive signals count (10 points max)
  score += Math.min(signals.positiveSignals.length * 2, 10);

  // Anti-sycophancy score bonus (10 points max)
  // Higher anti-sycophancy means more genuine feedback, which is valuable
  score += Math.round(signals.antiSycophancyScore / 10);

  return Math.min(score, 100);
}

/**
 * Complete a session and extract validation signals
 */
export async function completeSession(
  sessionId: string,
  supabase: TypedSupabaseClient
): Promise<SessionCompletionResult> {
  // Fetch session with persona info
  const { data: session, error: sessionError } = await supabase
    .from('sessions')
    .select(`
      *,
      personas!inner (
        name
      )
    `)
    .eq('id', sessionId)
    .single();

  if (sessionError || !session) {
    return { success: false, error: 'Session not found' };
  }

  // Check if already completed
  if (session.status === 'completed') {
    return { success: false, error: 'Session already completed' };
  }

  // Fetch messages
  const { data: messages, error: messagesError } = await supabase
    .from('messages')
    .select('role, content, created_at')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true });

  if (messagesError) {
    return { success: false, error: 'Failed to fetch messages' };
  }

  // Check minimum message count
  if (!messages || messages.length < 2) {
    // Still complete but with empty signals
    const { error: updateError } = await supabase
      .from('sessions')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        need_validated: false,
        solution_resonated: false,
        key_objections: [],
        anti_sycophancy_triggers: 0,
        score: 0,
      })
      .eq('id', sessionId);

    if (updateError) {
      return { success: false, error: 'Failed to update session' };
    }

    return {
      success: true,
      signals: {
        needValidated: false,
        solutionResonated: false,
        keyObjections: [],
        positiveSignals: [],
        commitmentLevel: 'none',
        antiSycophancyScore: 0,
      },
    };
  }

  // Build transcript
  const personaName = (session.personas as { name: string }).name;
  const transcript = buildTranscript(messages, personaName);

  // Extract signals
  let signals: ValidationSignals;
  try {
    signals = await extractSignals(transcript);
  } catch (error) {
    console.error('Signal extraction error:', error);
    // Complete session with default signals on extraction failure
    const { error: updateError } = await supabase
      .from('sessions')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        need_validated: false,
        solution_resonated: false,
        key_objections: [],
        anti_sycophancy_triggers: 0,
        score: 0,
      })
      .eq('id', sessionId);

    if (updateError) {
      return { success: false, error: 'Failed to update session' };
    }

    return {
      success: true,
      signals: {
        needValidated: false,
        solutionResonated: false,
        keyObjections: [],
        positiveSignals: [],
        commitmentLevel: 'none',
        antiSycophancyScore: 0,
      },
    };
  }

  // Calculate score
  const score = calculateScore(signals);

  // Update session with results
  const { error: updateError } = await supabase
    .from('sessions')
    .update({
      status: 'completed',
      completed_at: new Date().toISOString(),
      need_validated: signals.needValidated,
      solution_resonated: signals.solutionResonated,
      key_objections: signals.keyObjections,
      anti_sycophancy_triggers: Math.round(signals.antiSycophancyScore / 10), // Convert to trigger count
      score,
    })
    .eq('id', sessionId);

  if (updateError) {
    return { success: false, error: 'Failed to update session' };
  }

  return { success: true, signals };
}

/**
 * Check if all sessions for a validation test are complete
 * If so, update the test status
 */
export async function checkTestCompletion(
  validationTestId: string,
  supabase: TypedSupabaseClient
): Promise<boolean> {
  // Count sessions for this test
  const { data: sessions, error } = await supabase
    .from('sessions')
    .select('status')
    .eq('validation_test_id', validationTestId);

  if (error || !sessions) {
    return false;
  }

  // Check if all complete
  const allComplete = sessions.every(
    (s) => s.status === 'completed' || s.status === 'abandoned' || s.status === 'expired'
  );

  if (allComplete && sessions.length > 0) {
    // Update validation test status
    await supabase
      .from('validation_tests')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
      })
      .eq('id', validationTestId);

    return true;
  }

  return false;
}
