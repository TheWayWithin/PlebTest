import { NextResponse } from 'next/server';
import { z, ZodError, ZodSchema } from 'zod';

/**
 * Validation Error Response
 */
export interface ValidationErrorResponse {
  error: 'validation_error';
  message: string;
  details: Array<{
    path: string;
    message: string;
  }>;
}

/**
 * Format Zod errors into a consistent response format
 */
export function formatZodErrors(error: ZodError): ValidationErrorResponse {
  // Zod v4 uses 'issues' instead of 'errors'
  const issues = error.issues || [];
  const details = issues.map((issue) => ({
    path: issue.path.join('.'),
    message: issue.message,
  }));

  return {
    error: 'validation_error',
    message: details[0]?.message || 'Validation failed',
    details,
  };
}

/**
 * Validate request body against a Zod schema
 *
 * @param schema - The Zod schema to validate against
 * @param body - The request body to validate
 * @returns Either the validated data or a NextResponse with validation errors
 *
 * @example
 * ```ts
 * const result = validateBody(createIdeaSchema, await request.json());
 * if (result instanceof NextResponse) return result;
 * // result is now typed as CreateIdeaInput
 * ```
 */
export function validateBody<T extends ZodSchema>(
  schema: T,
  body: unknown
): z.infer<T> | NextResponse<ValidationErrorResponse> {
  const result = schema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(formatZodErrors(result.error), { status: 400 });
  }

  return result.data;
}

/**
 * Validate and parse request body, throwing on error
 * Use this when you want to handle errors manually
 *
 * @param schema - The Zod schema to validate against
 * @param body - The request body to validate
 * @throws ZodError if validation fails
 */
export function parseBody<T extends ZodSchema>(
  schema: T,
  body: unknown
): z.infer<T> {
  return schema.parse(body);
}

/**
 * Safe parse helper that returns a discriminated union
 * Useful when you need more control over error handling
 *
 * @param schema - The Zod schema to validate against
 * @param body - The request body to validate
 * @returns Object with success flag and either data or error
 */
export function safeParseBody<T extends ZodSchema>(
  schema: T,
  body: unknown
): { success: true; data: z.infer<T> } | { success: false; error: ZodError } {
  const result = schema.safeParse(body);

  if (result.success) {
    return { success: true, data: result.data };
  }

  return { success: false, error: result.error };
}

/**
 * Type guard to check if a validateBody result is an error response
 */
export function isValidationError<T>(
  result: T | NextResponse<ValidationErrorResponse>
): result is NextResponse<ValidationErrorResponse> {
  return result instanceof NextResponse;
}

/**
 * Common reusable field validators
 */
export const validators = {
  // UUID validator
  uuid: z.string().uuid('Invalid ID format'),

  // Email validator
  email: z
    .string()
    .email('Invalid email address')
    .max(254, 'Email too long')
    .transform((val) => val.toLowerCase().trim()),

  // URL validator
  url: z.string().url('Invalid URL format'),

  // Non-empty string
  nonEmptyString: (maxLength = 1000) =>
    z
      .string()
      .min(1, 'This field is required')
      .max(maxLength, `Must be less than ${maxLength} characters`)
      .transform((val) => val.trim()),

  // Optional string that becomes undefined when empty
  optionalString: (maxLength = 1000) =>
    z
      .string()
      .max(maxLength, `Must be less than ${maxLength} characters`)
      .optional()
      .transform((val) => (val?.trim() || undefined)),

  // Positive integer
  positiveInt: z.number().int().positive(),

  // Percentage (0-100)
  percentage: z.number().int().min(0).max(100),
};
