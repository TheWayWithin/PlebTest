import { z } from 'zod';

export const createProposalSchema = z.object({
  problem: z
    .string()
    .min(10, 'Problem description must be at least 10 characters')
    .max(2000, 'Problem description must be less than 2000 characters'),
  solution: z
    .string()
    .min(10, 'Solution description must be at least 10 characters')
    .max(2000, 'Solution description must be less than 2000 characters'),
  hypotheses: z
    .string()
    .max(2000, 'Hypotheses must be less than 2000 characters')
    .optional()
    .or(z.literal('')),
  current_workarounds: z
    .string()
    .max(2000, 'Current workarounds must be less than 2000 characters')
    .optional()
    .or(z.literal('')),
  pricing_assumption: z
    .string()
    .max(1000, 'Pricing assumption must be less than 1000 characters')
    .optional()
    .or(z.literal('')),
  competitors: z
    .string()
    .max(2000, 'Competitors must be less than 2000 characters')
    .optional()
    .or(z.literal('')),
  external_context: z
    .string()
    .max(5000, 'External context must be less than 5000 characters')
    .optional()
    .or(z.literal('')),
  external_source_url: z
    .string()
    .url('Must be a valid URL')
    .optional()
    .or(z.literal('')),
});

export type CreateProposalInput = z.infer<typeof createProposalSchema>;

export const updateProposalSchema = createProposalSchema.partial();

export type UpdateProposalInput = z.infer<typeof updateProposalSchema>;
