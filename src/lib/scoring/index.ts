/**
 * Scoring Module
 *
 * Exports the current rubric version for scoring validation tests.
 */

export {
  RUBRIC_VERSION,
  VERDICT_WEIGHTS,
  VERDICT_THRESHOLDS,
  COMMITMENT_SCORES,
  CONFIDENCE_WEIGHTS,
  CONFIDENCE_THRESHOLDS,
  SAMPLE_SIZE_SCORES,
  VERDICT_DRIVERS,
  CONFIDENCE_DRIVERS,
  getTopQuickFireDrivers,
  calculateScores,
  type VerdictWeights,
  type VerdictThresholds,
  type ConfidenceWeights,
  type ConfidenceThresholds,
  type VerdictDriver,
  type QuickFireDriver,
  type SessionSignals,
  type ScoringResult,
} from './rubric-v1';
