/**
 * Job Payload Types
 *
 * Type definitions for all background job payloads.
 * Ensures type safety when queuing and processing jobs.
 */

import type { TestMode, ValidationMode, PushbackPreset } from '@/lib/validations/test';

/**
 * Payload for running a complete validation test.
 */
export interface RunTestPayload {
  testId: string;
  proposalId: string;
  icpIds: string[];
  personaCount: number;
  testMode: TestMode;
  validationMode: ValidationMode;
  pushbackPreset: PushbackPreset;
}

/**
 * Payload for generating personas for an ICP.
 */
export interface GeneratePersonasPayload {
  testId: string;
  icpId: string;
  count: number;
}

/**
 * Payload for running a single validation session.
 */
export interface RunSessionPayload {
  testId: string;
  sessionId: string;
  personaId: string;
  proposalId: string;
  validationMode: ValidationMode;
  pushbackPreset: PushbackPreset;
}

/**
 * Payload for generating a validation report.
 */
export interface GenerateReportPayload {
  testId: string;
  proposalId: string;
}

/**
 * Payload for sending emails.
 */
export interface SendEmailPayload {
  to: string;
  subject: string;
  template: 'welcome' | 'trial_reminder' | 'test_complete' | 'report_ready' | 'password_reset';
  data: Record<string, unknown>;
}

/**
 * Payload for checking session timeouts.
 * Empty payload - job is triggered by cron.
 */
export interface CheckSessionTimeoutPayload {
  // No payload needed - cron job
}

/**
 * Payload for trial reminder emails.
 * Empty payload - job is triggered by cron.
 */
export interface TrialReminderPayload {
  // No payload needed - cron job
}

/**
 * Payload for data export generation.
 */
export interface DataExportPayload {
  userId: string;
  exportType: 'all_data' | 'tests_only' | 'reports_only';
  format: 'json' | 'csv';
}

/**
 * Union type of all job payloads for type-safe job handlers.
 */
export type JobPayload =
  | RunTestPayload
  | GeneratePersonasPayload
  | RunSessionPayload
  | GenerateReportPayload
  | SendEmailPayload
  | CheckSessionTimeoutPayload
  | TrialReminderPayload
  | DataExportPayload;
