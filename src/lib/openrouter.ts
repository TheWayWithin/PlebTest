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
