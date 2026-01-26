import { z } from 'zod';

/**
 * Create Idea Schema
 * POST /api/ideas
 */
export const createIdeaSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(200, 'Name must be less than 200 characters')
    .transform((val) => val.trim()),
});

export type CreateIdeaInput = z.infer<typeof createIdeaSchema>;

/**
 * Update Idea Schema
 * PATCH /api/ideas/[ideaId]
 */
export const updateIdeaSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(200, 'Name must be less than 200 characters')
    .transform((val) => val.trim())
    .optional(),
});

export type UpdateIdeaInput = z.infer<typeof updateIdeaSchema>;

/**
 * Create Idea from Quick Fire Schema
 * POST /api/ideas/from-quick-fire
 */
export const createIdeaFromQuickFireSchema = z.object({
  idea: z
    .string()
    .min(10, 'Idea must be at least 10 characters')
    .max(500, 'Idea must be less than 500 characters')
    .transform((val) => val.trim()),
  quick_fire_score: z
    .number()
    .int()
    .min(0)
    .max(100)
    .optional(),
  quick_fire_objection: z
    .string()
    .max(1000)
    .optional(),
});

export type CreateIdeaFromQuickFireInput = z.infer<typeof createIdeaFromQuickFireSchema>;
