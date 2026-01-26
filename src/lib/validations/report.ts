import { z } from 'zod';

/**
 * Share Report Schema
 * PATCH /api/.../report/share
 */
export const shareReportSchema = z.object({
  is_public: z.boolean(),
  hide_proposal_details: z.boolean().optional(),
});

export type ShareReportInput = z.infer<typeof shareReportSchema>;
