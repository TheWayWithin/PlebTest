import { z } from 'zod';

export const painIntensityValues = ['annoying', 'costly', 'blocking'] as const;
export const decisionRoleValues = ['decision_maker', 'influencer', 'end_user', 'blocker'] as const;
export const adoptionTendencyValues = ['early_adopter', 'early_majority', 'late_majority', 'laggard'] as const;

export type PainIntensity = typeof painIntensityValues[number];
export type DecisionRole = typeof decisionRoleValues[number];
export type AdoptionTendency = typeof adoptionTendencyValues[number];

export const painIntensityEnum = z.enum(painIntensityValues);
export const decisionRoleEnum = z.enum(decisionRoleValues);
export const adoptionTendencyEnum = z.enum(adoptionTendencyValues);

export const createIcpSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  demographics: z
    .string()
    .max(2000, 'Demographics must be less than 2000 characters')
    .optional()
    .transform((val) => val || undefined),
  psychographics: z
    .string()
    .max(2000, 'Psychographics must be less than 2000 characters')
    .optional()
    .transform((val) => val || undefined),
  context: z
    .string()
    .max(2000, 'Context must be less than 2000 characters')
    .optional()
    .transform((val) => val || undefined),
  pain_intensity: z
    .string()
    .optional()
    .transform((val): PainIntensity | undefined => {
      if (!val || val === '') return undefined;
      if (painIntensityValues.includes(val as PainIntensity)) {
        return val as PainIntensity;
      }
      return undefined;
    }),
  current_solutions: z
    .string()
    .max(2000, 'Current solutions must be less than 2000 characters')
    .optional()
    .transform((val) => val || undefined),
  decision_role: z
    .string()
    .optional()
    .transform((val): DecisionRole | undefined => {
      if (!val || val === '') return undefined;
      if (decisionRoleValues.includes(val as DecisionRole)) {
        return val as DecisionRole;
      }
      return undefined;
    }),
  adoption_tendency: z
    .string()
    .optional()
    .transform((val): AdoptionTendency | undefined => {
      if (!val || val === '') return undefined;
      if (adoptionTendencyValues.includes(val as AdoptionTendency)) {
        return val as AdoptionTendency;
      }
      return undefined;
    }),
});

export type CreateIcpInput = z.infer<typeof createIcpSchema>;

export const updateIcpSchema = createIcpSchema.partial().extend({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .optional(),
});

export type UpdateIcpInput = z.infer<typeof updateIcpSchema>;
