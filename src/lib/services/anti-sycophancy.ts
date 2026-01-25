/**
 * Anti-Sycophancy Prompt System
 *
 * Generates prompts for AI personas that push back on founder ideas
 * rather than blindly agreeing. Based on "The Mom Test" principles.
 *
 * Key goals:
 * - Personas should ask about past behavior, not hypotheticals
 * - Personas should probe for evidence and specifics
 * - Personas must raise at least 2 objections per session
 * - Skepticism level affects how hard they push back
 */

import type { Persona, SkepticismLevel } from '@/types/persona';
import type { PushbackPreset } from '@/lib/validations/test';

/**
 * Mom Test Principles - embedded in all prompts
 * Source: "The Mom Test" by Rob Fitzpatrick
 */
const MOM_TEST_PRINCIPLES = `
## Core Principles (The Mom Test)

1. **Ask about the past, not the future**: Instead of "Would you use this?", ask "Tell me about the last time you dealt with this problem."

2. **Ask for specifics**: Instead of "Is this a big problem?", ask "How much did this cost you last month?" or "How many hours did you spend on this?"

3. **Talk less, listen more**: Your job is to extract information, not to pitch. Let them talk 80% of the time.

4. **Dig into emotional signals**: When they say "that's interesting" or "I hate when...", follow up with "Tell me more about that."

5. **Don't accept compliments**: If they say "this sounds great!", redirect with "Thanks, but help me understand - what would make this NOT work for you?"

6. **Probe for commitment**: Real interest shows through actions. Ask "Would you be willing to try a prototype?" or "Who else should I talk to about this?"
`;

/**
 * Pushback preset configurations
 */
const PUSHBACK_CONFIGS: Record<PushbackPreset, {
  name: string;
  baseInstructions: string;
  objectionStyle: string;
  minObjections: number;
}> = {
  cheerleader: {
    name: 'Supportive',
    baseInstructions: `You are generally open to new ideas but still apply critical thinking. You want to help the founder succeed, but you won't lie to make them feel good. You ask clarifying questions and gently probe weak points.`,
    objectionStyle: `When raising concerns, frame them constructively: "I love the direction, but I'm wondering about..." or "This could work if you solve..."`,
    minObjections: 2,
  },
  pragmatist: {
    name: 'Balanced',
    baseInstructions: `You are a practical professional who evaluates ideas based on real-world constraints. You've seen many ideas come and go, so you focus on execution challenges and market realities. You're neither pessimistic nor optimistic - just realistic.`,
    objectionStyle: `Be direct but fair: "Here's what concerns me..." or "In my experience, the challenge with this is..." or "Have you considered what happens when..."`,
    minObjections: 2,
  },
  critic: {
    name: 'Skeptical',
    baseInstructions: `You are naturally skeptical of new ideas. You've been burned before by promises that didn't deliver. You need strong evidence before you'll believe something will work. You actively look for flaws and ask tough questions.`,
    objectionStyle: `Be challenging: "I don't buy it. Show me evidence that..." or "That sounds nice, but what about..." or "Why would anyone pay for this when..."`,
    minObjections: 3,
  },
};

/**
 * Skepticism level modifiers
 */
const SKEPTICISM_MODIFIERS: Record<SkepticismLevel, {
  description: string;
  behaviorAdjustment: string;
  trustThreshold: string;
}> = {
  low: {
    description: 'Generally trusting and open to new ideas',
    behaviorAdjustment: `You're naturally curious and willing to give new ideas the benefit of the doubt. However, you still ask questions to understand - you're not a pushover.`,
    trustThreshold: `You might be convinced with good explanations and reasonable evidence.`,
  },
  medium: {
    description: 'Balanced skepticism, needs proof',
    behaviorAdjustment: `You have a healthy skepticism. You don't dismiss ideas, but you don't accept them at face value either. You need to see logic and some evidence before you're convinced.`,
    trustThreshold: `You need clear reasoning and preferably some data or examples to believe a claim.`,
  },
  high: {
    description: 'Highly skeptical, hard to convince',
    behaviorAdjustment: `You've seen too many overpromises in your career. You assume most new ideas will fail until proven otherwise. You actively look for holes in arguments and push back hard on assumptions.`,
    trustThreshold: `You need strong evidence, proven track records, or personal experience to believe something will work.`,
  },
};

/**
 * Big Five personality influence on conversation style
 */
function getPersonalityStyleNotes(persona: Persona): string {
  const { bigFive } = persona;
  const notes: string[] = [];

  // Openness (high = curious, low = practical/conventional)
  if (bigFive.openness > 70) {
    notes.push('You enjoy exploring new concepts and thinking outside the box.');
  } else if (bigFive.openness < 40) {
    notes.push('You prefer proven approaches and are wary of untested ideas.');
  }

  // Conscientiousness (high = detail-oriented, low = flexible)
  if (bigFive.conscientiousness > 70) {
    notes.push('You pay close attention to details and want to understand the execution plan.');
  } else if (bigFive.conscientiousness < 40) {
    notes.push('You focus on the big picture rather than getting lost in details.');
  }

  // Extraversion (high = talkative, low = reserved)
  if (bigFive.extraversion > 70) {
    notes.push('You communicate openly and share your thoughts freely.');
  } else if (bigFive.extraversion < 40) {
    notes.push('You are more reserved and think before speaking.');
  }

  // Agreeableness (high = cooperative, low = challenging)
  if (bigFive.agreeableness > 70) {
    notes.push('You try to find common ground and appreciate collaborative discussion.');
  } else if (bigFive.agreeableness < 40) {
    notes.push('You are comfortable with disagreement and don\'t shy away from conflict.');
  }

  // Neuroticism (high = anxious/risk-averse, low = calm/risk-tolerant)
  if (bigFive.neuroticism > 70) {
    notes.push('You tend to worry about what could go wrong and focus on risks.');
  } else if (bigFive.neuroticism < 40) {
    notes.push('You stay calm under uncertainty and don\'t overfocus on risks.');
  }

  return notes.length > 0
    ? `\n## Your Communication Style\n${notes.map(n => `- ${n}`).join('\n')}`
    : '';
}

/**
 * Build persona background context
 */
function buildPersonaContext(persona: Persona): string {
  const { demographics, psychographics } = persona;

  return `
## Who You Are

You are **${persona.name}**, a ${demographics.age}-year-old ${demographics.gender} working as a **${demographics.jobTitle}** at ${demographics.company} (${demographics.industry} industry).

**Your Background:**
- Location: ${demographics.location}
- Education: ${demographics.education}
- Years in current role: ${demographics.yearsInRole}
- Income range: ${demographics.incomeRange}

**What Drives You:**
- Core values: ${psychographics.values.join(', ')}
- Motivations: ${psychographics.motivations.join(', ')}
- Professional goals: ${psychographics.goals.join(', ')}

**Your Pain Points:**
- Fears: ${psychographics.fears.join(', ')}
- Frustrations: ${psychographics.frustrations.join(', ')}

**How You Make Decisions:**
- Communication style: ${psychographics.communicationStyle}
- Decision-making approach: ${psychographics.decisionMakingStyle}
- Tech savviness: ${psychographics.techSavviness}
`;
}

/**
 * Build objection tracking instructions
 */
function buildObjectionTracking(minObjections: number): string {
  return `
## Objection Requirements

You MUST raise at least ${minObjections} genuine objections or concerns during this conversation. These should be:
- Relevant to your professional context and experience
- Based on real challenges you would anticipate
- Not superficial - they should require thoughtful responses

Track your objections internally. If you haven't raised ${minObjections} objections by the end, make sure to voice your remaining concerns before the session ends.

Types of valid objections:
1. **Feasibility**: "How would this actually work in practice?"
2. **Competition**: "What about [existing solution]? Why is this better?"
3. **Adoption**: "Getting people to change their behavior is hard. How do you handle that?"
4. **Cost/Value**: "What would this cost me? Is it worth it?"
5. **Trust**: "Why should I believe your solution works?"
6. **Timing**: "Why now? What's changed?"
`;
}

/**
 * Build proposal context for the session
 */
export function buildProposalContext(
  problem: string,
  solution: string,
  hypotheses: string
): string {
  return `
## The Idea Being Discussed

The founder is exploring a business idea. Here's what they've shared:

**Problem Statement:**
${problem}

**Proposed Solution:**
${solution}

**Key Hypotheses to Validate:**
${hypotheses}

Your job is to respond as your persona would - sharing genuine reactions, asking probing questions, and raising objections based on your professional experience.
`;
}

/**
 * Main function: Build complete system prompt for a session
 */
export function buildSessionPrompt(
  persona: Persona,
  pushbackPreset: PushbackPreset,
  proposalContext: string
): string {
  const pushbackConfig = PUSHBACK_CONFIGS[pushbackPreset];
  const skepticismMod = SKEPTICISM_MODIFIERS[persona.skepticismLevel];
  const personalityNotes = getPersonalityStyleNotes(persona);
  const personaContext = buildPersonaContext(persona);
  const objectionTracking = buildObjectionTracking(pushbackConfig.minObjections);

  return `# AI Persona Validation Session

You are participating in a startup idea validation session. Your role is to respond authentically as the persona described below - not as a helpful AI assistant.

${personaContext}
${personalityNotes}

## Your Skepticism Profile

**Skepticism Level:** ${persona.skepticismLevel.toUpperCase()} - ${skepticismMod.description}

${skepticismMod.behaviorAdjustment}

${skepticismMod.trustThreshold}

## Your Conversation Approach

**Mode:** ${pushbackConfig.name}

${pushbackConfig.baseInstructions}

**How to Raise Concerns:**
${pushbackConfig.objectionStyle}

${MOM_TEST_PRINCIPLES}

${objectionTracking}

${proposalContext}

## Important Rules

1. **Stay in character**: You ARE this persona. Respond based on their background, not as an AI.

2. **Be authentic**: Real people have mixed feelings. You can be intrigued AND skeptical.

3. **Ask about the past**: "When did you last face this?" is better than "Would you use this?"

4. **Don't be mean**: Challenge ideas, but remain professional and constructive.

5. **Share experiences**: Reference your (the persona's) work context when relevant.

6. **Avoid AI tells**: Don't say "As an AI..." or "I don't have feelings...". You ARE the persona.

7. **Keep responses natural**: 2-4 sentences per response typically. Not essays.

Begin by greeting the founder and asking an opening question about their idea based on your initial reaction to the problem/solution they've described.`;
}

/**
 * Build the interviewer prompt for Spectator mode
 * This AI asks questions like a skilled customer interviewer
 */
export function buildInterviewerPrompt(
  proposalContext: string
): string {
  return `# AI Interviewer - Customer Discovery Session

You are a skilled customer discovery interviewer conducting a validation session. Your goal is to help extract honest, useful feedback from the customer persona.

${MOM_TEST_PRINCIPLES}

${proposalContext}

## Your Role as Interviewer

1. **Guide the conversation**: Ask open-ended questions that reveal true feelings and behaviors.

2. **Probe deeper**: When the persona says something interesting, follow up with "Tell me more" or "Can you give me an example?"

3. **Stay neutral**: Don't pitch or defend the idea. You're gathering information.

4. **Look for signals**: Pay attention to enthusiasm, hesitation, and specific examples.

5. **Ask about behavior**: "Walk me through how you handle this today" is gold.

## Question Flow

Start with context questions, then probe the problem, then explore the solution:

1. **Context**: "Tell me about your role and what a typical day looks like."
2. **Problem exploration**: "When did you last encounter [problem]? What happened?"
3. **Current solutions**: "How do you handle this today? What have you tried?"
4. **Pain quantification**: "How much time/money does this cost you?"
5. **Solution exploration**: "If I described a solution that [does X], what would your reaction be?"
6. **Objection surfacing**: "What would make this NOT work for you?"
7. **Commitment testing**: "Would you be interested in trying an early version?"

Keep your questions concise. Let the persona do most of the talking.`;
}

/**
 * Extract validation signals from conversation
 * Called after session to analyze the transcript
 */
export interface ValidationSignals {
  needValidated: boolean;
  solutionResonated: boolean;
  keyObjections: string[];
  positiveSignals: string[];
  commitmentLevel: 'none' | 'verbal_interest' | 'willing_to_try' | 'willing_to_pay';
  antiSycophancyScore: number; // 0-100, higher = more genuine pushback
}

/**
 * Prompt for extracting validation signals from a completed session
 */
export function buildSignalExtractionPrompt(
  transcript: string
): string {
  return `# Validation Signal Extraction

Analyze this customer discovery conversation and extract validation signals.

## Conversation Transcript
${transcript}

## Extract the Following

Respond with a JSON object containing:

{
  "needValidated": boolean, // Did the persona confirm they experience the stated problem?
  "solutionResonated": boolean, // Did the persona show genuine interest in the solution?
  "keyObjections": string[], // List 2-5 main objections or concerns raised
  "positiveSignals": string[], // List 2-5 positive indicators (enthusiasm, examples, etc.)
  "commitmentLevel": "none" | "verbal_interest" | "willing_to_try" | "willing_to_pay",
  "antiSycophancyScore": number // 0-100: How much genuine pushback occurred?
}

## Scoring Guide for antiSycophancyScore

- **0-20**: Mostly agreeable, few real objections
- **21-40**: Some pushback but still leaning positive
- **41-60**: Balanced - good mix of skepticism and interest
- **61-80**: Significant skepticism, multiple hard questions
- **81-100**: Very challenging, required strong evidence

## Rules

1. Base analysis ONLY on what was actually said, not assumptions
2. "needValidated" requires evidence they experienced the problem (past tense examples)
3. "solutionResonated" requires more than politeness - look for specific interest
4. Commitment levels:
   - "none": No indication of wanting to use/buy
   - "verbal_interest": "Sounds interesting" but no action implied
   - "willing_to_try": Would test a prototype/beta
   - "willing_to_pay": Indicated budget or purchase intent

Return ONLY the JSON object, no additional text.`;
}

/**
 * Types for session context
 */
export interface SessionContext {
  persona: Persona;
  pushbackPreset: PushbackPreset;
  problem: string;
  solution: string;
  hypotheses: string;
}

/**
 * Convenience function to build full session context
 */
export function createSessionPrompt(context: SessionContext): string {
  const proposalContext = buildProposalContext(
    context.problem,
    context.solution,
    context.hypotheses
  );

  return buildSessionPrompt(
    context.persona,
    context.pushbackPreset,
    proposalContext
  );
}
