/**
 * Validation Schemas Index
 *
 * Central export point for all Zod validation schemas.
 * Import from here for consistent validation across the app.
 */

// Re-export all existing schemas
export * from './proposal';
export * from './icp';
export * from './test';
export * from './idea';
export * from './session';
export * from './waitlist';
export * from './report';

// Re-export validation utilities
export * from './utils';
