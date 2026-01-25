/**
 * OpenRouter AI Integration
 *
 * Handles AI analysis for Quick Fire feature using OpenRouter API.
 * Uses claude-3-haiku for speed and cost efficiency.
 */

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions"

// Model selection: claude-3-haiku for fast, cost-effective analysis
const MODEL = "anthropic/claude-3-haiku"

// Token budget enforcement
const MAX_TOKENS = 150

export interface QuickFireAnalysis {
  riskScore: number // 0-100
  riskLevel: "LOW" | "MEDIUM" | "HIGH"
  keyObjection: string
}

interface OpenRouterResponse {
  choices: Array<{
    message: {
      content: string
    }
  }>
}

/**
 * Analyzes a startup idea and returns risk assessment
 *
 * The AI is instructed to be skeptical and critical, not encouraging.
 * This helps founders identify real challenges early.
 *
 * @param idea - The startup idea to analyze (10-200 chars)
 * @returns Risk score, level, and key objection
 */
export async function analyzeIdea(idea: string): Promise<QuickFireAnalysis> {
  const apiKey = process.env.OPENROUTER_API_KEY

  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY environment variable is required")
  }

  const systemPrompt = `You are a critical startup analyst. Your job is to identify the most significant risk or challenge with a startup idea.

Be skeptical and honest, not encouraging. Founders need to hear real challenges, not validation.

Analyze the idea and respond with ONLY valid JSON in this exact format:
{
  "riskScore": <number 0-100, where 100 is highest risk>,
  "keyObjection": "<one sentence describing the main challenge or objection>"
}

Scoring guide:
- 0-30: Low risk (clear value, achievable)
- 31-60: Medium risk (challenges exist but surmountable)
- 61-100: High risk (major obstacles, unclear value)

Be concise. One key objection only.`

  const response = await fetch(OPENROUTER_API_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://plebtest.com",
      "X-Title": "PlebTest Quick Fire",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Analyze this startup idea: ${idea}` },
      ],
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error("OpenRouter API error:", response.status, errorText)
    throw new Error(`OpenRouter API error: ${response.status}`)
  }

  const data: OpenRouterResponse = await response.json()

  if (!data.choices || data.choices.length === 0) {
    throw new Error("No response from AI model")
  }

  const content = data.choices[0].message.content.trim()

  // Parse the JSON response
  let parsed: { riskScore: number; keyObjection: string }
  try {
    // Handle potential markdown code blocks in response
    const jsonContent = content.replace(/```json\n?|```\n?/g, "").trim()
    parsed = JSON.parse(jsonContent)
  } catch (parseError) {
    console.error("Failed to parse AI response:", content)
    throw new Error("Invalid response format from AI")
  }

  // Validate and clamp risk score
  const riskScore = Math.max(0, Math.min(100, Math.round(parsed.riskScore)))

  // Determine risk level from score
  let riskLevel: "LOW" | "MEDIUM" | "HIGH"
  if (riskScore <= 30) {
    riskLevel = "LOW"
  } else if (riskScore <= 60) {
    riskLevel = "MEDIUM"
  } else {
    riskLevel = "HIGH"
  }

  return {
    riskScore,
    riskLevel,
    keyObjection: parsed.keyObjection || "Unable to determine key objection",
  }
}

/**
 * Proposal Generation Interface
 * Matches actual database schema: problem, solution, hypotheses
 */
export interface GeneratedProposal {
  problem: string;
  solution: string;
  hypotheses: string;
}

/**
 * Generates a structured proposal from a business idea one-liner.
 *
 * @param oneLiner - The original idea from Quick Fire
 * @param keyObjection - The identified objection to address
 * @returns Structured proposal content for database insertion
 */
export async function generateProposalFromIdea(
  oneLiner: string,
  keyObjection: string
): Promise<GeneratedProposal> {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY environment variable is required");
  }

  const systemPrompt = `You are a startup strategist helping founders develop their business ideas into structured proposals.

You will receive a business idea one-liner and a key objection that was identified. Generate a structured proposal to help the founder think through their idea.

Respond with ONLY valid JSON in this exact format:
{
  "problem": "<2-3 sentences describing the problem being solved and who experiences it>",
  "solution": "<2-3 sentences describing the proposed solution and how it works>",
  "hypotheses": "<2-3 key assumptions that need to be validated, including the objection raised>"
}

Be specific and actionable. Avoid generic startup jargon. Focus on clarity.`;

  const userPrompt = `Business Idea: ${oneLiner}

Key Objection to Address: ${keyObjection}`;

  const response = await fetch(OPENROUTER_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://plebtest.com",
      "X-Title": "PlebTest Proposal Generator",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 500, // More tokens for proposal generation
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("OpenRouter API error:", response.status, errorText);
    throw new Error(`OpenRouter API error: ${response.status}`);
  }

  const data: OpenRouterResponse = await response.json();

  if (!data.choices || data.choices.length === 0) {
    throw new Error("No response from AI model");
  }

  const content = data.choices[0].message.content.trim();

  // Parse the JSON response
  let parsed: {
    problem: string;
    solution: string;
    hypotheses: string;
  };

  try {
    // Handle potential markdown code blocks in response
    const jsonContent = content.replace(/```json\n?|```\n?/g, "").trim();
    parsed = JSON.parse(jsonContent);
  } catch (parseError) {
    console.error("Failed to parse proposal AI response:", content);
    throw new Error("Invalid response format from AI");
  }

  // Validate required fields
  const requiredFields = ["problem", "solution", "hypotheses"];
  for (const field of requiredFields) {
    if (typeof parsed[field as keyof typeof parsed] !== "string") {
      throw new Error(`Missing or invalid field: ${field}`);
    }
  }

  return {
    problem: parsed.problem,
    solution: parsed.solution,
    hypotheses: parsed.hypotheses,
  };
}
