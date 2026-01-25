import { z } from 'zod';

// Test mode options
export const testModeValues = ['quick', 'standard', 'deep'] as const;
export type TestMode = typeof testModeValues[number];

export const TEST_MODE_OPTIONS = {
  quick: {
    label: 'Quick',
    description: '5 personas, rapid validation',
    duration: '~5 min',
    personaCount: 5,
  },
  standard: {
    label: 'Standard',
    description: '10 personas, balanced depth',
    duration: '~15 min',
    personaCount: 10,
  },
  deep: {
    label: 'Deep',
    description: '20 personas, comprehensive analysis',
    duration: '~30 min',
    personaCount: 20,
  },
} as const;

// Validation mode options
export const validationModeValues = ['interactive', 'spectator'] as const;
export type ValidationMode = typeof validationModeValues[number];

export const VALIDATION_MODE_OPTIONS = {
  interactive: {
    label: 'Interactive',
    description: 'Participate in conversations with AI personas',
  },
  spectator: {
    label: 'Spectator',
    description: 'Watch AI personas discuss your idea autonomously',
  },
} as const;

// Pushback preset options
export const pushbackPresetValues = ['cheerleader', 'pragmatist', 'critic'] as const;
export type PushbackPreset = typeof pushbackPresetValues[number];

export const PUSHBACK_PRESET_OPTIONS = {
  cheerleader: {
    label: 'Cheerleader',
    description: 'Supportive personas, easier validation',
    skepticismBias: 'low',
  },
  pragmatist: {
    label: 'Pragmatist',
    description: 'Balanced skepticism, realistic feedback',
    skepticismBias: 'medium',
  },
  critic: {
    label: 'Critic',
    description: 'Highly skeptical, tough questions',
    skepticismBias: 'high',
  },
} as const;

// Tier-based limits
export const TIER_LIMITS = {
  solo: {
    testsPerMonth: 10,
    maxPersonasPerTest: 10,
    features: ['quick', 'standard'],
  },
  growth: {
    testsPerMonth: 30,
    maxPersonasPerTest: 20,
    features: ['quick', 'standard', 'deep'],
  },
  scale: {
    testsPerMonth: 100,
    maxPersonasPerTest: 50,
    features: ['quick', 'standard', 'deep', 'interactive'],
  },
  pro: {
    testsPerMonth: 200,
    maxPersonasPerTest: 100,
    features: ['quick', 'standard', 'deep', 'interactive', 'spectator'],
  },
} as const;

export type SubscriptionTier = keyof typeof TIER_LIMITS;

// Zod schemas
export const testModeEnum = z.enum(testModeValues);
export const validationModeEnum = z.enum(validationModeValues);
export const pushbackPresetEnum = z.enum(pushbackPresetValues);

export const createTestSchema = z.object({
  icp_ids: z
    .array(z.string().uuid('Invalid ICP ID'))
    .min(1, 'Select at least one ICP'),
  persona_count: z
    .number()
    .int('Persona count must be a whole number')
    .min(1, 'At least 1 persona required')
    .max(100, 'Maximum 100 personas per test'),
  test_mode: testModeEnum,
  validation_mode: validationModeEnum,
  pushback_preset: pushbackPresetEnum,
});

export type CreateTestInput = z.infer<typeof createTestSchema>;

// Output type after parsing (all fields required)
export type CreateTestOutput = z.output<typeof createTestSchema>;

// Helper to get allowed features for a tier
export function getTierFeatures(tier: SubscriptionTier | null) {
  if (!tier) return TIER_LIMITS.solo;
  return TIER_LIMITS[tier] || TIER_LIMITS.solo;
}

// Helper to check if a test mode is available for a tier
export function isTestModeAvailable(tier: SubscriptionTier | null, mode: TestMode): boolean {
  const tierLimits = getTierFeatures(tier);
  return tierLimits.features.includes(mode);
}

// Helper to check if a validation mode is available for a tier
export function isValidationModeAvailable(tier: SubscriptionTier | null, mode: ValidationMode): boolean {
  const tierLimits = getTierFeatures(tier);
  return tierLimits.features.includes(mode);
}
