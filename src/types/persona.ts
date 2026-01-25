// Persona Types for PlebTest
// Generated personas represent realistic individuals matching an ICP profile

import { Database } from './database.types';

// Database row type
export type PersonaRow = Database['public']['Tables']['personas']['Row'];
export type PersonaInsert = Database['public']['Tables']['personas']['Insert'];

// Skepticism levels with their target distributions
export type SkepticismLevel = 'low' | 'medium' | 'high';

// Demographics JSONB structure
export interface PersonaDemographics {
  age: number;
  gender: string;
  location: string;
  jobTitle: string;
  company: string;
  industry: string;
  incomeRange: string;
  education: string;
  yearsInRole: number;
}

// Psychographics JSONB structure
export interface PersonaPsychographics {
  values: string[];
  motivations: string[];
  fears: string[];
  goals: string[];
  frustrations: string[];
  communicationStyle: string;
  decisionMakingStyle: string;
  techSavviness: 'low' | 'medium' | 'high';
}

// Big Five personality traits (OCEAN model)
export interface BigFiveTraits {
  openness: number;         // 1-100: Curiosity, creativity, openness to new ideas
  conscientiousness: number; // 1-100: Organization, dependability, self-discipline
  extraversion: number;      // 1-100: Sociability, assertiveness, positive emotions
  agreeableness: number;     // 1-100: Cooperation, trust, empathy
  neuroticism: number;       // 1-100: Emotional instability, anxiety, moodiness
}

// Full persona type for application use
export interface Persona {
  id: string;
  icpId: string;
  name: string;
  demographics: PersonaDemographics;
  psychographics: PersonaPsychographics;
  bigFive: BigFiveTraits;
  skepticismLevel: SkepticismLevel;
  generatedAt: Date;
}

// Generation request parameters
export interface PersonaGenerationRequest {
  icpId: string;
  count: number;
}

// Generation result
export interface PersonaGenerationResult {
  success: boolean;
  personas: Persona[];
  error?: string;
}

// AI-generated persona data (before database insert)
export interface GeneratedPersonaData {
  name: string;
  demographics: PersonaDemographics;
  psychographics: PersonaPsychographics;
}

// Skepticism distribution targets:
// - 40% high: These personas are naturally skeptical, harder to convince
// - 40% medium: Balanced skepticism, will engage but need proof
// - 20% low: More trusting, easier to engage with new ideas
export const SKEPTICISM_DISTRIBUTION = {
  high: 0.4,
  medium: 0.4,
  low: 0.2,
} as const;
