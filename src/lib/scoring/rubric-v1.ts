/**
 * Scoring Rubric v1.0
 *
 * Defines how validation results are scored and interpreted.
 * This is a versioned config - changes should increment the version.
 *
 * Key Metrics:
 * 1. Verdict (Kill / Pivot / Build) - Based on signal strength and consistency
 * 2. Confidence Level (Low / Medium / High) - Based on data quality and agreement
 */

export const RUBRIC_VERSION = '1.0.0';

// ============================================================================
// VERDICT SCORING
// ============================================================================

/**
 * Verdict Thresholds
 *
 * The verdict is determined by a weighted score that combines:
 * - Need validation rate
 * - Solution resonance rate
 * - Commitment level distribution
 * - Anti-sycophancy scores (quality of feedback)
 */
export interface VerdictWeights {
  needValidation: number;      // Weight for % of personas who validated the need
  solutionResonance: number;   // Weight for % of personas who resonated with solution
  commitmentLevel: number;     // Weight for commitment level distribution
  antiSycophancy: number;      // Bonus weight for high-quality feedback
}

export const VERDICT_WEIGHTS: VerdictWeights = {
  needValidation: 0.35,
  solutionResonance: 0.30,
  commitmentLevel: 0.25,
  antiSycophancy: 0.10,
};

/**
 * Verdict Thresholds
 *
 * Combined score ranges:
 * - 0-40: Kill (high risk, proceed with caution)
 * - 41-60: Pivot (needs refinement, some signals positive)
 * - 61-100: Build (strong signals, worth pursuing)
 */
export interface VerdictThresholds {
  kill: { min: number; max: number };
  pivot: { min: number; max: number };
  build: { min: number; max: number };
}

export const VERDICT_THRESHOLDS: VerdictThresholds = {
  kill: { min: 0, max: 40 },
  pivot: { min: 41, max: 60 },
  build: { min: 61, max: 100 },
};

/**
 * Commitment Level Scoring
 *
 * How different commitment levels contribute to the score:
 * - none: 0 points
 * - verbal_interest: 25 points
 * - willing_to_try: 60 points
 * - willing_to_pay: 100 points
 */
export const COMMITMENT_SCORES: Record<string, number> = {
  none: 0,
  verbal_interest: 25,
  willing_to_try: 60,
  willing_to_pay: 100,
};

// ============================================================================
// CONFIDENCE LEVEL SCORING
// ============================================================================

/**
 * Confidence Level
 *
 * Measures how reliable the verdict is based on:
 * - Number of sessions completed
 * - Anti-sycophancy scores (quality of conversations)
 * - Agreement between personas (consistency)
 * - Message depth (conversation quality)
 */
export interface ConfidenceWeights {
  sampleSize: number;      // Weight for number of completed sessions
  agreementRate: number;   // Weight for consistency across personas
  conversationQuality: number; // Weight for anti-sycophancy and depth
}

export const CONFIDENCE_WEIGHTS: ConfidenceWeights = {
  sampleSize: 0.35,
  agreementRate: 0.35,
  conversationQuality: 0.30,
};

/**
 * Confidence Thresholds
 *
 * Combined confidence score ranges:
 * - 0-40: Low (results are preliminary, consider more testing)
 * - 41-70: Medium (results are indicative, reasonable confidence)
 * - 71-100: High (results are reliable, strong confidence)
 */
export interface ConfidenceThresholds {
  low: { min: number; max: number };
  medium: { min: number; max: number };
  high: { min: number; max: number };
}

export const CONFIDENCE_THRESHOLDS: ConfidenceThresholds = {
  low: { min: 0, max: 40 },
  medium: { min: 41, max: 70 },
  high: { min: 71, max: 100 },
};

/**
 * Sample Size Scoring
 *
 * Minimum personas for confidence thresholds:
 * - 1-2: Low confidence bonus (20 points)
 * - 3-4: Medium confidence bonus (50 points)
 * - 5+: High confidence bonus (100 points)
 */
export const SAMPLE_SIZE_SCORES: Array<{ min: number; max: number; score: number }> = [
  { min: 1, max: 2, score: 20 },
  { min: 3, max: 4, score: 50 },
  { min: 5, max: Infinity, score: 100 },
];

// ============================================================================
// DRIVER EXPLANATIONS
// ============================================================================

/**
 * Verdict Drivers
 *
 * Human-readable explanations for what drove the verdict.
 * Used in "Why this verdict" section of reports.
 */
export interface VerdictDriver {
  id: string;
  label: string;
  description: string;
  impact: 'positive' | 'negative' | 'neutral';
}

export const VERDICT_DRIVERS: Record<string, VerdictDriver> = {
  high_need_validation: {
    id: 'high_need_validation',
    label: 'Strong Need Validation',
    description: 'Most personas confirmed they experience this problem',
    impact: 'positive',
  },
  low_need_validation: {
    id: 'low_need_validation',
    label: 'Weak Need Validation',
    description: 'Few personas recognized this as a real problem',
    impact: 'negative',
  },
  high_solution_resonance: {
    id: 'high_solution_resonance',
    label: 'Solution Resonated',
    description: 'Personas showed genuine interest in the proposed solution',
    impact: 'positive',
  },
  low_solution_resonance: {
    id: 'low_solution_resonance',
    label: 'Solution Did Not Resonate',
    description: 'Limited interest in the proposed solution approach',
    impact: 'negative',
  },
  high_commitment: {
    id: 'high_commitment',
    label: 'Strong Commitment Signals',
    description: 'Personas indicated willingness to try or pay',
    impact: 'positive',
  },
  low_commitment: {
    id: 'low_commitment',
    label: 'Weak Commitment Signals',
    description: 'Little to no willingness to take action',
    impact: 'negative',
  },
  quality_feedback: {
    id: 'quality_feedback',
    label: 'Quality Feedback',
    description: 'Personas provided genuine pushback and detailed objections',
    impact: 'positive',
  },
  consistent_objections: {
    id: 'consistent_objections',
    label: 'Consistent Objections',
    description: 'Multiple personas raised similar concerns',
    impact: 'neutral',
  },
};

/**
 * Confidence Drivers
 *
 * Human-readable explanations for confidence level.
 */
export const CONFIDENCE_DRIVERS: Record<string, VerdictDriver> = {
  sufficient_sample: {
    id: 'sufficient_sample',
    label: 'Adequate Sample Size',
    description: 'Tested with enough personas for reliable patterns',
    impact: 'positive',
  },
  limited_sample: {
    id: 'limited_sample',
    label: 'Limited Sample Size',
    description: 'More personas would improve confidence',
    impact: 'negative',
  },
  high_agreement: {
    id: 'high_agreement',
    label: 'High Agreement',
    description: 'Personas showed consistent feedback patterns',
    impact: 'positive',
  },
  mixed_signals: {
    id: 'mixed_signals',
    label: 'Mixed Signals',
    description: 'Persona feedback varied significantly',
    impact: 'negative',
  },
  deep_conversations: {
    id: 'deep_conversations',
    label: 'In-Depth Conversations',
    description: 'Sessions had meaningful exchanges and genuine pushback',
    impact: 'positive',
  },
  shallow_conversations: {
    id: 'shallow_conversations',
    label: 'Surface-Level Conversations',
    description: 'Limited depth in persona interactions',
    impact: 'negative',
  },
};

// ============================================================================
// QUICK FIRE INTEGRATION
// ============================================================================

/**
 * Quick Fire Top Drivers
 *
 * For Quick Fire results, return the top 2 most impactful drivers.
 * These are used for the quick rejection/acceptance decision.
 */
export interface QuickFireDriver {
  driver: string;
  explanation: string;
  direction: 'supports' | 'challenges';
}

export function getTopQuickFireDrivers(
  needRate: number,
  objection: string | null
): QuickFireDriver[] {
  const drivers: QuickFireDriver[] = [];

  // Primary driver based on need validation
  if (needRate >= 0.7) {
    drivers.push({
      driver: 'Market Need',
      explanation: 'Strong indication of market demand for this problem space',
      direction: 'supports',
    });
  } else if (needRate < 0.3) {
    drivers.push({
      driver: 'Market Need',
      explanation: 'Limited evidence of market demand',
      direction: 'challenges',
    });
  }

  // Secondary driver based on objection
  if (objection) {
    drivers.push({
      driver: 'Key Challenge',
      explanation: objection,
      direction: 'challenges',
    });
  }

  return drivers.slice(0, 2);
}

// ============================================================================
// SCORING FUNCTIONS
// ============================================================================

export interface SessionSignals {
  needValidated: boolean;
  solutionResonated: boolean;
  commitmentLevel: string;
  antiSycophancyScore: number;
  messageCount: number;
}

export interface ScoringResult {
  verdictScore: number;
  verdict: 'kill' | 'pivot' | 'build';
  verdictDrivers: VerdictDriver[];
  confidenceScore: number;
  confidenceLevel: 'low' | 'medium' | 'high';
  confidenceDrivers: VerdictDriver[];
}

/**
 * Calculate verdict and confidence from session signals
 */
export function calculateScores(sessions: SessionSignals[]): ScoringResult {
  const totalSessions = sessions.length;

  if (totalSessions === 0) {
    return {
      verdictScore: 0,
      verdict: 'kill',
      verdictDrivers: [VERDICT_DRIVERS.low_need_validation],
      confidenceScore: 0,
      confidenceLevel: 'low',
      confidenceDrivers: [CONFIDENCE_DRIVERS.limited_sample],
    };
  }

  // Calculate rates
  const needValidationRate = sessions.filter(s => s.needValidated).length / totalSessions;
  const solutionResonanceRate = sessions.filter(s => s.solutionResonated).length / totalSessions;

  // Calculate average commitment score
  const avgCommitment = sessions.reduce((sum, s) => {
    return sum + (COMMITMENT_SCORES[s.commitmentLevel] || 0);
  }, 0) / totalSessions;

  // Calculate average anti-sycophancy
  const avgAntiSycophancy = sessions.reduce((sum, s) => sum + s.antiSycophancyScore, 0) / totalSessions;

  // Calculate verdict score (0-100)
  const verdictScore = Math.round(
    needValidationRate * 100 * VERDICT_WEIGHTS.needValidation +
    solutionResonanceRate * 100 * VERDICT_WEIGHTS.solutionResonance +
    avgCommitment * VERDICT_WEIGHTS.commitmentLevel +
    avgAntiSycophancy * VERDICT_WEIGHTS.antiSycophancy
  );

  // Determine verdict
  let verdict: 'kill' | 'pivot' | 'build';
  if (verdictScore <= VERDICT_THRESHOLDS.kill.max) {
    verdict = 'kill';
  } else if (verdictScore <= VERDICT_THRESHOLDS.pivot.max) {
    verdict = 'pivot';
  } else {
    verdict = 'build';
  }

  // Collect verdict drivers
  const verdictDrivers: VerdictDriver[] = [];
  if (needValidationRate >= 0.7) {
    verdictDrivers.push(VERDICT_DRIVERS.high_need_validation);
  } else if (needValidationRate < 0.3) {
    verdictDrivers.push(VERDICT_DRIVERS.low_need_validation);
  }
  if (solutionResonanceRate >= 0.6) {
    verdictDrivers.push(VERDICT_DRIVERS.high_solution_resonance);
  } else if (solutionResonanceRate < 0.3) {
    verdictDrivers.push(VERDICT_DRIVERS.low_solution_resonance);
  }
  if (avgCommitment >= 50) {
    verdictDrivers.push(VERDICT_DRIVERS.high_commitment);
  } else if (avgCommitment < 20) {
    verdictDrivers.push(VERDICT_DRIVERS.low_commitment);
  }

  // Calculate confidence score
  const sampleSizeScore = SAMPLE_SIZE_SCORES.find(
    range => totalSessions >= range.min && totalSessions <= range.max
  )?.score || 20;

  // Calculate agreement rate (how consistent are the signals)
  const needAgreement = Math.max(needValidationRate, 1 - needValidationRate);
  const solutionAgreement = Math.max(solutionResonanceRate, 1 - solutionResonanceRate);
  const agreementScore = ((needAgreement + solutionAgreement) / 2) * 100;

  // Calculate conversation quality
  const avgMessageCount = sessions.reduce((sum, s) => sum + s.messageCount, 0) / totalSessions;
  const conversationScore = Math.min(
    (avgAntiSycophancy / 2) + (avgMessageCount >= 10 ? 50 : avgMessageCount * 5),
    100
  );

  const confidenceScore = Math.round(
    sampleSizeScore * CONFIDENCE_WEIGHTS.sampleSize +
    agreementScore * CONFIDENCE_WEIGHTS.agreementRate +
    conversationScore * CONFIDENCE_WEIGHTS.conversationQuality
  );

  // Determine confidence level
  let confidenceLevel: 'low' | 'medium' | 'high';
  if (confidenceScore <= CONFIDENCE_THRESHOLDS.low.max) {
    confidenceLevel = 'low';
  } else if (confidenceScore <= CONFIDENCE_THRESHOLDS.medium.max) {
    confidenceLevel = 'medium';
  } else {
    confidenceLevel = 'high';
  }

  // Collect confidence drivers
  const confidenceDrivers: VerdictDriver[] = [];
  if (totalSessions >= 5) {
    confidenceDrivers.push(CONFIDENCE_DRIVERS.sufficient_sample);
  } else {
    confidenceDrivers.push(CONFIDENCE_DRIVERS.limited_sample);
  }
  if (agreementScore >= 70) {
    confidenceDrivers.push(CONFIDENCE_DRIVERS.high_agreement);
  } else if (agreementScore < 50) {
    confidenceDrivers.push(CONFIDENCE_DRIVERS.mixed_signals);
  }
  if (avgAntiSycophancy >= 50 && avgMessageCount >= 10) {
    confidenceDrivers.push(CONFIDENCE_DRIVERS.deep_conversations);
  } else if (avgAntiSycophancy < 30 || avgMessageCount < 6) {
    confidenceDrivers.push(CONFIDENCE_DRIVERS.shallow_conversations);
  }

  return {
    verdictScore,
    verdict,
    verdictDrivers,
    confidenceScore,
    confidenceLevel,
    confidenceDrivers,
  };
}
