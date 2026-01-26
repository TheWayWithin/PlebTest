import { z } from 'zod';

/**
 * Session Message Schema
 * Used for validating messages sent during interactive sessions
 */
export const sessionMessageSchema = z.object({
  content: z
    .string()
    .min(1, 'Message cannot be empty')
    .max(5000, 'Message must be less than 5000 characters')
    .transform((val) => val.trim()),
});

export type SessionMessageInput = z.infer<typeof sessionMessageSchema>;

/**
 * Complete Session Schema
 * POST /api/sessions/[sessionId]/complete
 */
export const completeSessionSchema = z.object({
  needValidated: z.boolean().optional(),
  solutionResonated: z.boolean().optional(),
  keyObjections: z
    .array(z.string().max(500))
    .max(10, 'Maximum 10 key objections')
    .optional(),
  score: z
    .number()
    .int()
    .min(0)
    .max(100)
    .optional(),
});

export type CompleteSessionInput = z.infer<typeof completeSessionSchema>;
