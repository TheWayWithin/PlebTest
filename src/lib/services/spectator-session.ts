/**
 * Spectator Session Service
 *
 * Runs AI-to-AI validation sessions where:
 * - AI Interviewer asks questions (Mom Test style)
 * - AI Persona responds as generated character
 * - Conversation progresses automatically
 * - Messages stored in database for real-time UI updates
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';
import type { Persona, PersonaDemographics, PersonaPsychographics, SkepticismLevel } from '@/types/persona';
import type { PushbackPreset } from '@/lib/validations/test';
import {
  createSessionPrompt,
  buildInterviewerPrompt,
  buildProposalContext,
  type SessionContext,
} from './anti-sycophancy';
import { completeSession } from './session-completion';

type TypedSupabaseClient = SupabaseClient<Database>;

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const INTERVIEWER_MODEL = 'anthropic/claude-3-haiku';
const PERSONA_MODEL = 'anthropic/claude-3-haiku';

// Session parameters
const MIN_EXCHANGES = 5; // Minimum back-and-forth exchanges
const MAX_EXCHANGES = 12; // Maximum exchanges before ending
const TARGET_EXCHANGES = 8; // Target number of exchanges

interface SpectatorSessionConfig {
  sessionId: string;
  personaId: string;
  proposalId: string;
  pushbackPreset: PushbackPreset;
  supabase: TypedSupabaseClient;
  onMessage?: (role: 'interviewer' | 'persona', content: string) => void;
}

interface ProposalData {
  problem: string;
  solution: string;
  hypotheses: string;
}

/**
 * Build persona from database row
 */
function buildPersona(personaRow: any): Persona {
  return {
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
}

/**
 * Call OpenRouter API for a chat completion (non-streaming)
 */
async function callAI(
  systemPrompt: string,
  messages: Array<{ role: string; content: string }>,
  model: string
): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error('OpenRouter API key not configured');
  }

  const response = await fetch(OPENROUTER_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://plebtest.com',
      'X-Title': 'PlebTest Spectator Session',
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
      max_tokens: 400,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`AI call failed: ${response.status} - ${error}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
}

/**
 * Save a message to the database
 */
async function saveMessage(
  supabase: TypedSupabaseClient,
  sessionId: string,
  role: 'user' | 'assistant',
  content: string
): Promise<string | null> {
  const { data } = await supabase
    .from('messages')
    .insert({
      session_id: sessionId,
      role,
      content,
    })
    .select('id')
    .single();

  return data?.id || null;
}

/**
 * Determine if the conversation should end
 */
function shouldEndConversation(
  exchangeCount: number,
  lastInterviewerMessage: string
): boolean {
  // Minimum exchanges not reached
  if (exchangeCount < MIN_EXCHANGES) {
    return false;
  }

  // Maximum exchanges reached
  if (exchangeCount >= MAX_EXCHANGES) {
    return true;
  }

  // Check for natural ending signals in interviewer message
  const endingSignals = [
    'thank you for your time',
    'thanks for sharing',
    'that\'s very helpful',
    'this has been really insightful',
    'i really appreciate',
    'one last question',
    'final question',
    'before we wrap up',
  ];

  const lowerMessage = lastInterviewerMessage.toLowerCase();
  for (const signal of endingSignals) {
    if (lowerMessage.includes(signal)) {
      return exchangeCount >= MIN_EXCHANGES;
    }
  }

  // Probabilistically end after target
  if (exchangeCount >= TARGET_EXCHANGES) {
    return Math.random() > 0.3; // 70% chance to end
  }

  return false;
}

/**
 * Run a complete spectator session
 */
export async function runSpectatorSession(
  config: SpectatorSessionConfig
): Promise<{ success: boolean; error?: string }> {
  const { sessionId, personaId, proposalId, pushbackPreset, supabase, onMessage } = config;

  try {
    // 1. Fetch persona
    const { data: personaRow, error: personaError } = await supabase
      .from('personas')
      .select('*')
      .eq('id', personaId)
      .single();

    if (personaError || !personaRow) {
      return { success: false, error: 'Persona not found' };
    }

    const persona = buildPersona(personaRow);

    // 2. Fetch proposal
    const { data: proposal, error: proposalError } = await supabase
      .from('proposals')
      .select('problem, solution, hypotheses')
      .eq('id', proposalId)
      .single();

    if (proposalError || !proposal) {
      return { success: false, error: 'Proposal not found' };
    }

    // 3. Build prompts
    const proposalContext = buildProposalContext(
      proposal.problem || '',
      proposal.solution || '',
      proposal.hypotheses || ''
    );

    // Interviewer system prompt
    const interviewerPrompt = buildInterviewerPrompt(proposalContext);

    // Persona system prompt
    const sessionContext: SessionContext = {
      persona,
      pushbackPreset,
      problem: proposal.problem || '',
      solution: proposal.solution || '',
      hypotheses: proposal.hypotheses || '',
    };
    const personaPrompt = createSessionPrompt(sessionContext);

    // 4. Mark session as active
    await supabase
      .from('sessions')
      .update({
        status: 'active',
        started_at: new Date().toISOString(),
        last_activity_at: new Date().toISOString(),
      })
      .eq('id', sessionId);

    // 5. Run conversation loop
    const conversationHistory: Array<{ role: string; content: string }> = [];
    let exchangeCount = 0;

    // Interviewer starts the conversation
    let interviewerMessage = await callAI(
      interviewerPrompt,
      [],
      INTERVIEWER_MODEL
    );

    // Save interviewer's opening
    await saveMessage(supabase, sessionId, 'user', interviewerMessage);
    onMessage?.('interviewer', interviewerMessage);
    conversationHistory.push({ role: 'user', content: interviewerMessage });

    // Conversation loop
    while (true) {
      exchangeCount++;

      // Update activity timestamp
      await supabase
        .from('sessions')
        .update({ last_activity_at: new Date().toISOString() })
        .eq('id', sessionId);

      // Persona responds
      const personaMessage = await callAI(
        personaPrompt,
        conversationHistory,
        PERSONA_MODEL
      );

      // Save persona's response
      await saveMessage(supabase, sessionId, 'assistant', personaMessage);
      onMessage?.('persona', personaMessage);
      conversationHistory.push({ role: 'assistant', content: personaMessage });

      // Check if we should end
      if (shouldEndConversation(exchangeCount, interviewerMessage)) {
        break;
      }

      // Interviewer follows up
      interviewerMessage = await callAI(
        interviewerPrompt,
        conversationHistory,
        INTERVIEWER_MODEL
      );

      // Save interviewer's follow-up
      await saveMessage(supabase, sessionId, 'user', interviewerMessage);
      onMessage?.('interviewer', interviewerMessage);
      conversationHistory.push({ role: 'user', content: interviewerMessage });

      // Small delay to prevent rate limiting
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    // 6. Complete the session (extract signals)
    const completionResult = await completeSession(sessionId, supabase);

    if (!completionResult.success) {
      console.error(`Session completion failed: ${completionResult.error}`);
      // Still mark as completed even if signal extraction fails
      await supabase
        .from('sessions')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
        })
        .eq('id', sessionId);
    }

    return { success: true };
  } catch (error) {
    console.error('Spectator session error:', error);

    // Mark session as abandoned
    await supabase
      .from('sessions')
      .update({ status: 'abandoned' })
      .eq('id', sessionId);

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
