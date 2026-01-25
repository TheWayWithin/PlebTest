/**
 * Persona Generation Service for PlebTest
 *
 * Generates realistic AI personas from ICP profiles for idea validation interviews.
 * Personas have Big Five personality traits and skepticism levels that influence
 * how they respond during validation sessions.
 */

import { createClient } from '@/lib/supabase/server';
import { callOpenRouter } from '@/lib/openrouter';
import type { Database } from '@/types/database.types';
import type {
  Persona,
  PersonaDemographics,
  PersonaPsychographics,
  BigFiveTraits,
  SkepticismLevel,
  GeneratedPersonaData,
  SKEPTICISM_DISTRIBUTION,
} from '@/types/persona';

// Re-export types for convenience
export type { Persona, SkepticismLevel };

type IcpRow = Database['public']['Tables']['icps']['Row'];
type PersonaInsert = Database['public']['Tables']['personas']['Insert'];
type PersonaRow = Database['public']['Tables']['personas']['Row'];

/**
 * Determines skepticism level based on target distribution:
 * - 40% high
 * - 40% medium
 * - 20% low
 */
function assignSkepticismLevel(index: number, total: number): SkepticismLevel {
  const highCount = Math.round(total * 0.4);
  const mediumCount = Math.round(total * 0.4);

  if (index < highCount) {
    return 'high';
  } else if (index < highCount + mediumCount) {
    return 'medium';
  } else {
    return 'low';
  }
}

/**
 * Generates Big Five personality traits based on skepticism level.
 * High skepticism = higher neuroticism, lower agreeableness
 * Low skepticism = lower neuroticism, higher agreeableness
 */
function generateBigFiveTraits(skepticismLevel: SkepticismLevel): BigFiveTraits {
  const randomInRange = (min: number, max: number): number => {
    return Math.round(min + Math.random() * (max - min));
  };

  switch (skepticismLevel) {
    case 'high':
      return {
        openness: randomInRange(35, 85),
        conscientiousness: randomInRange(50, 90),
        extraversion: randomInRange(25, 65),
        agreeableness: randomInRange(20, 50),
        neuroticism: randomInRange(60, 90),
      };

    case 'low':
      return {
        openness: randomInRange(55, 95),
        conscientiousness: randomInRange(35, 85),
        extraversion: randomInRange(50, 85),
        agreeableness: randomInRange(60, 90),
        neuroticism: randomInRange(20, 50),
      };

    case 'medium':
    default:
      return {
        openness: randomInRange(40, 80),
        conscientiousness: randomInRange(40, 80),
        extraversion: randomInRange(35, 75),
        agreeableness: randomInRange(40, 70),
        neuroticism: randomInRange(40, 70),
      };
  }
}

/**
 * Builds the AI prompt for generating persona details from an ICP.
 */
function buildPersonaPrompt(icp: IcpRow, count: number, skepticismLevels: SkepticismLevel[]): string {
  const skepticismDescriptions = skepticismLevels.map((level, i) =>
    `Persona ${i + 1}: ${level} skepticism`
  ).join('\n');

  // Extract demographics/psychographics description if stored as JSONB
  const demographics = typeof icp.demographics === 'object' && icp.demographics
    ? JSON.stringify(icp.demographics)
    : icp.demographics || 'Not specified';
  const psychographics = typeof icp.psychographics === 'object' && icp.psychographics
    ? JSON.stringify(icp.psychographics)
    : icp.psychographics || 'Not specified';

  return `You are an expert at creating realistic user personas for product validation research.

Given the following Ideal Customer Profile (ICP), generate ${count} unique, realistic personas that fit this profile. Each persona should be distinct but authentically represent someone who matches the ICP.

ICP Details:
- Name: ${icp.name}
- Demographics: ${demographics}
- Psychographics: ${psychographics}
- Context: ${icp.context || 'Not specified'}
- Pain Intensity: ${icp.pain_intensity || 'Not specified'}
- Decision Role: ${icp.decision_role || 'Not specified'}

Skepticism levels for each persona (this affects their personality - skeptical people are harder to convince, ask tougher questions, and need more proof):
${skepticismDescriptions}

For each persona, generate:
1. A realistic full name appropriate for the demographic
2. Specific demographics (age, gender, location, job title, company type, industry, income range, education level, years in current role)
3. Psychographics (3-4 core values, 2-3 primary motivations, 2-3 key fears, 2-3 professional goals, 2-3 work frustrations, communication style, decision-making style, tech savviness level)

IMPORTANT: Make each persona feel like a real individual with a coherent background story, not just a collection of attributes.

Respond with a JSON array of ${count} personas in this exact format:
[
  {
    "name": "Full Name",
    "demographics": {
      "age": 35,
      "gender": "female",
      "location": "Austin, TX",
      "jobTitle": "VP of Engineering",
      "company": "Mid-size SaaS startup",
      "industry": "Software/Technology",
      "incomeRange": "$180,000-$220,000",
      "education": "MS Computer Science, Stanford",
      "yearsInRole": 3
    },
    "psychographics": {
      "values": ["efficiency", "team growth", "technical excellence"],
      "motivations": ["building scalable systems", "developing team members"],
      "fears": ["technical debt accumulation", "losing top talent"],
      "goals": ["achieve CTO role", "build industry-leading engineering culture"],
      "frustrations": ["context switching", "unclear product priorities"],
      "communicationStyle": "direct and data-driven",
      "decisionMakingStyle": "analytical with input from team",
      "techSavviness": "high"
    }
  }
]

Return ONLY the JSON array, no additional text.`;
}

/**
 * Parses the AI response into structured persona data.
 */
function parseAIResponse(response: string, expectedCount: number): GeneratedPersonaData[] {
  try {
    let cleanResponse = response.trim();
    if (cleanResponse.startsWith('```json')) {
      cleanResponse = cleanResponse.slice(7);
    } else if (cleanResponse.startsWith('```')) {
      cleanResponse = cleanResponse.slice(3);
    }
    if (cleanResponse.endsWith('```')) {
      cleanResponse = cleanResponse.slice(0, -3);
    }
    cleanResponse = cleanResponse.trim();

    const parsed = JSON.parse(cleanResponse);

    if (!Array.isArray(parsed)) {
      throw new Error('Expected array of personas');
    }

    return parsed.map((p: Record<string, unknown>) => ({
      name: (p.name as string) || 'Unknown',
      demographics: {
        age: (p.demographics as Record<string, unknown>)?.age as number || 30,
        gender: (p.demographics as Record<string, unknown>)?.gender as string || 'unspecified',
        location: (p.demographics as Record<string, unknown>)?.location as string || 'United States',
        jobTitle: (p.demographics as Record<string, unknown>)?.jobTitle as string || 'Professional',
        company: (p.demographics as Record<string, unknown>)?.company as string || 'Company',
        industry: (p.demographics as Record<string, unknown>)?.industry as string || 'Technology',
        incomeRange: (p.demographics as Record<string, unknown>)?.incomeRange as string || '$50,000-$100,000',
        education: (p.demographics as Record<string, unknown>)?.education as string || "Bachelor's Degree",
        yearsInRole: (p.demographics as Record<string, unknown>)?.yearsInRole as number || 2,
      },
      psychographics: {
        values: (p.psychographics as Record<string, unknown>)?.values as string[] || ['growth', 'efficiency'],
        motivations: (p.psychographics as Record<string, unknown>)?.motivations as string[] || ['career advancement'],
        fears: (p.psychographics as Record<string, unknown>)?.fears as string[] || ['failure'],
        goals: (p.psychographics as Record<string, unknown>)?.goals as string[] || ['success'],
        frustrations: (p.psychographics as Record<string, unknown>)?.frustrations as string[] || ['inefficiency'],
        communicationStyle: (p.psychographics as Record<string, unknown>)?.communicationStyle as string || 'professional',
        decisionMakingStyle: (p.psychographics as Record<string, unknown>)?.decisionMakingStyle as string || 'balanced',
        techSavviness: ((p.psychographics as Record<string, unknown>)?.techSavviness as 'low' | 'medium' | 'high') || 'medium',
      },
    }));
  } catch (error) {
    console.error('Failed to parse AI response:', error);
    throw new Error(`Failed to parse AI-generated personas: ${error}`);
  }
}

/**
 * Converts generated persona data to database insert format.
 */
function toPersonaInsert(
  icpId: string,
  data: GeneratedPersonaData,
  bigFive: BigFiveTraits,
  skepticismLevel: SkepticismLevel
): PersonaInsert {
  return {
    icp_id: icpId,
    name: data.name,
    demographics: data.demographics as unknown as Database['public']['Tables']['personas']['Insert']['demographics'],
    psychographics: data.psychographics as unknown as Database['public']['Tables']['personas']['Insert']['psychographics'],
    openness: bigFive.openness,
    conscientiousness: bigFive.conscientiousness,
    extraversion: bigFive.extraversion,
    agreeableness: bigFive.agreeableness,
    neuroticism: bigFive.neuroticism,
    skepticism_level: skepticismLevel,
  };
}

/**
 * Converts a database row to the application Persona type.
 */
function toPersona(row: PersonaRow): Persona {
  return {
    id: row.id,
    icpId: row.icp_id,
    name: row.name,
    demographics: row.demographics as unknown as PersonaDemographics,
    psychographics: row.psychographics as unknown as PersonaPsychographics,
    bigFive: {
      openness: row.openness ?? 50,
      conscientiousness: row.conscientiousness ?? 50,
      extraversion: row.extraversion ?? 50,
      agreeableness: row.agreeableness ?? 50,
      neuroticism: row.neuroticism ?? 50,
    },
    skepticismLevel: row.skepticism_level as SkepticismLevel,
    generatedAt: new Date(row.generated_at ?? Date.now()),
  };
}

/**
 * Main function: Generates N personas for a given ICP.
 *
 * @param icpId - The ID of the ICP to generate personas for
 * @param count - Number of personas to generate (default: 5)
 * @returns Promise<Persona[]> - Array of created personas
 *
 * Distribution:
 * - 40% high skepticism
 * - 40% medium skepticism
 * - 20% low skepticism
 */
export async function generatePersonas(
  icpId: string,
  count: number = 5
): Promise<Persona[]> {
  console.log(`Generating ${count} personas for ICP: ${icpId}`);

  const supabase = await createClient();

  // 1. Fetch the ICP
  const { data: icp, error: icpError } = await supabase
    .from('icps')
    .select('*')
    .eq('id', icpId)
    .single();

  if (icpError || !icp) {
    throw new Error(`ICP not found: ${icpId}`);
  }

  // 2. Pre-assign skepticism levels to ensure correct distribution
  // Shuffle indices to randomize which personas get which level
  const indices = Array.from({ length: count }, (_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }

  const skepticismLevels: SkepticismLevel[] = indices.map((_, i) =>
    assignSkepticismLevel(i, count)
  );

  // Re-order to match original indices
  const orderedSkepticismLevels: SkepticismLevel[] = new Array(count);
  indices.forEach((originalIndex, newIndex) => {
    orderedSkepticismLevels[originalIndex] = skepticismLevels[newIndex];
  });

  // 3. Generate persona details via AI
  console.log('Calling OpenRouter for persona generation...');
  const prompt = buildPersonaPrompt(icp, count, orderedSkepticismLevels);

  const aiResponse = await callOpenRouter(
    prompt,
    'openai/gpt-4o-mini', // Cost-effective model for persona generation
    2000 // Max tokens
  );

  if (!aiResponse) {
    throw new Error('Failed to get response from AI');
  }

  // 4. Parse AI response
  const generatedData = parseAIResponse(aiResponse, count);

  if (generatedData.length !== count) {
    console.warn(`Expected ${count} personas, got ${generatedData.length}`);
  }

  // 5. Create database insert records with Big Five traits
  const personaInserts: PersonaInsert[] = generatedData.map((data, i) => {
    const skepticismLevel = orderedSkepticismLevels[i] || 'medium';
    const bigFive = generateBigFiveTraits(skepticismLevel);
    return toPersonaInsert(icpId, data, bigFive, skepticismLevel);
  });

  // 6. Batch insert into database
  console.log(`Inserting ${personaInserts.length} personas into database...`);
  const { data: insertedRows, error } = await supabase
    .from('personas')
    .insert(personaInserts)
    .select();

  if (error) {
    console.error('Database insert error:', error);
    throw new Error(`Failed to save personas: ${error.message}`);
  }

  if (!insertedRows || insertedRows.length === 0) {
    throw new Error('No personas were created');
  }

  // 7. Convert to application types and return
  const personas = insertedRows.map(toPersona);
  console.log(`Successfully generated ${personas.length} personas`);

  return personas;
}

/**
 * Fetches existing personas for an ICP.
 */
export async function getPersonasForICP(icpId: string): Promise<Persona[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('personas')
    .select('*')
    .eq('icp_id', icpId)
    .order('generated_at', { ascending: false });

  if (error) {
    console.error('Error fetching personas:', error);
    throw new Error(`Failed to fetch personas: ${error.message}`);
  }

  return (data || []).map(toPersona);
}

/**
 * Deletes all personas for an ICP (useful for regeneration).
 */
export async function deletePersonasForICP(icpId: string): Promise<number> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('personas')
    .delete()
    .eq('icp_id', icpId)
    .select('id');

  if (error) {
    console.error('Error deleting personas:', error);
    throw new Error(`Failed to delete personas: ${error.message}`);
  }

  return data?.length || 0;
}

/**
 * Gets a single persona by ID.
 */
export async function getPersonaById(personaId: string): Promise<Persona | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('personas')
    .select('*')
    .eq('id', personaId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Not found
    }
    console.error('Error fetching persona:', error);
    throw new Error(`Failed to fetch persona: ${error.message}`);
  }

  return toPersona(data);
}
