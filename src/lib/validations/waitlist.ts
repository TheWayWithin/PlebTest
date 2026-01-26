import { z } from 'zod';

/**
 * Waitlist Signup Schema
 * POST /api/waitlist
 */
export const waitlistSignupSchema = z.object({
  email: z
    .string()
    .email('Please enter a valid email address')
    .max(254, 'Email must be less than 254 characters')
    .transform((val) => val.toLowerCase().trim()),
});

export type WaitlistSignupInput = z.infer<typeof waitlistSignupSchema>;
