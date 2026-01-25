/**
 * Report Generator Service
 *
 * Generates validation reports from completed test sessions.
 * Uses the scoring rubric to calculate verdict and confidence.
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';
import { calculateScores, RUBRIC_VERSION, type SessionSignals } from '@/lib/scoring';
import { randomBytes } from 'crypto';

type TypedSupabaseClient = SupabaseClient<Database>;

interface SessionData {
  id: string;
  status: string | null;
  need_validated: boolean | null;
  solution_resonated: boolean | null;
  key_objections: unknown;
  anti_sycophancy_triggers: number | null;
  score: number | null;
  message_count: number | null;
  personas: {
    id: string;
    name: string;
  };
}

interface ReportGenerationResult {
  success: boolean;
  reportId?: string;
  error?: string;
}

/**
 * Generate a unique share token
 */
function generateShareToken(): string {
  return randomBytes(16).toString('hex');
}

/**
 * Extract common objections from all sessions
 */
function extractKeyObjections(sessions: SessionData[]): string[] {
  const allObjections: string[] = [];

  for (const session of sessions) {
    const objections = session.key_objections as string[] | null;
    if (objections && Array.isArray(objections)) {
      allObjections.push(...objections);
    }
  }

  // Count frequency of each objection theme
  const objectionCounts = new Map<string, number>();
  for (const objection of allObjections) {
    // Normalize for comparison
    const normalized = objection.toLowerCase().trim();
    objectionCounts.set(normalized, (objectionCounts.get(normalized) || 0) + 1);
  }

  // Return top 5 most common objections (preserving original casing from first occurrence)
  return allObjections
    .filter((obj, index) => {
      const normalized = obj.toLowerCase().trim();
      const firstIndex = allObjections.findIndex(o => o.toLowerCase().trim() === normalized);
      return firstIndex === index;
    })
    .sort((a, b) => {
      const countA = objectionCounts.get(a.toLowerCase().trim()) || 0;
      const countB = objectionCounts.get(b.toLowerCase().trim()) || 0;
      return countB - countA;
    })
    .slice(0, 5);
}

/**
 * Generate summary of need validation findings
 */
function generateNeedValidationSummary(sessions: SessionData[], needRate: number): string {
  const validatedCount = sessions.filter(s => s.need_validated).length;
  const totalCount = sessions.length;

  if (needRate >= 0.8) {
    return `Strong evidence of problem-market fit. ${validatedCount} out of ${totalCount} personas confirmed they experience this problem and it causes real pain in their work or life.`;
  } else if (needRate >= 0.5) {
    return `Moderate evidence of problem-market fit. ${validatedCount} out of ${totalCount} personas recognized this problem. Consider narrowing your target market to the segments that felt it most strongly.`;
  } else {
    return `Limited evidence of problem-market fit. Only ${validatedCount} out of ${totalCount} personas validated this need. The problem may not be significant enough, or you may be targeting the wrong customer segment.`;
  }
}

/**
 * Generate summary of solution validation findings
 */
function generateSolutionValidationSummary(sessions: SessionData[], solutionRate: number): string {
  const resonatedCount = sessions.filter(s => s.solution_resonated).length;
  const totalCount = sessions.length;

  if (solutionRate >= 0.7) {
    return `Your proposed solution resonated well with ${resonatedCount} out of ${totalCount} personas. They showed genuine interest and could see how it would address their pain points.`;
  } else if (solutionRate >= 0.4) {
    return `Your solution had mixed reception. ${resonatedCount} out of ${totalCount} personas showed interest. Review the objections to understand what modifications might improve adoption.`;
  } else {
    return `Your solution approach needs rethinking. Only ${resonatedCount} out of ${totalCount} personas resonated with it. Consider alternative approaches or pivot the solution significantly.`;
  }
}

/**
 * Generate next steps based on verdict
 */
function generateNextSteps(verdict: 'kill' | 'pivot' | 'build'): string[] {
  switch (verdict) {
    case 'kill':
      return [
        'Consider testing with a completely different customer segment',
        'Revisit your problem hypothesis - is this really a painful problem?',
        'Talk to real customers (not AI) to validate these findings',
        'Look for adjacent problems in the same space that might be more pressing',
      ];
    case 'pivot':
      return [
        'Analyze the key objections and address them in your next iteration',
        'Consider narrowing your target market to the personas who showed most interest',
        'Refine your solution based on the feedback received',
        'Run another validation test with your updated proposal',
        'Talk to real customers who match your most interested persona profiles',
      ];
    case 'build':
      return [
        'Start building an MVP to test with real users',
        'Reach out to real customers who match your validated personas',
        'Create a landing page to capture early interest',
        'Document your key value propositions based on what resonated',
        'Plan your first feature set around the confirmed pain points',
      ];
  }
}

/**
 * Generate strongest signals from the sessions
 */
function generateStrongestSignals(sessions: SessionData[]): string[] {
  const signals: string[] = [];

  // Need validation rate
  const needRate = sessions.filter(s => s.need_validated).length / sessions.length;
  if (needRate >= 0.7) {
    signals.push(`${Math.round(needRate * 100)}% of personas validated the core problem`);
  }

  // Solution resonance
  const solutionRate = sessions.filter(s => s.solution_resonated).length / sessions.length;
  if (solutionRate >= 0.6) {
    signals.push(`${Math.round(solutionRate * 100)}% showed interest in the proposed solution`);
  }

  // High scoring sessions
  const highScorers = sessions.filter(s => s.score !== null && s.score >= 70);
  if (highScorers.length > 0) {
    signals.push(`${highScorers.length} sessions scored 70+ indicating strong interest`);
  }

  // Anti-sycophancy quality
  const avgQuality = sessions.reduce((sum, s) => sum + (s.anti_sycophancy_triggers || 0), 0) / sessions.length;
  if (avgQuality >= 5) {
    signals.push('Sessions included genuine pushback, increasing feedback reliability');
  }

  return signals.slice(0, 4);
}

/**
 * Generate a complete validation report
 */
export async function generateReport(
  testId: string,
  supabase: TypedSupabaseClient
): Promise<ReportGenerationResult> {
  try {
    // 1. Fetch test with sessions
    const { data: sessions, error: sessionsError } = await supabase
      .from('sessions')
      .select(`
        id,
        status,
        need_validated,
        solution_resonated,
        key_objections,
        anti_sycophancy_triggers,
        score,
        message_count,
        personas!inner (
          id,
          name
        )
      `)
      .eq('validation_test_id', testId)
      .eq('status', 'completed');

    if (sessionsError || !sessions || sessions.length === 0) {
      return { success: false, error: 'No completed sessions found' };
    }

    // 2. Convert to scoring format
    const sessionSignals: SessionSignals[] = sessions.map(s => ({
      needValidated: s.need_validated || false,
      solutionResonated: s.solution_resonated || false,
      commitmentLevel: 'verbal_interest', // Default since we don't have this data yet
      antiSycophancyScore: (s.anti_sycophancy_triggers || 0) * 10, // Convert back to 0-100
      messageCount: s.message_count || 0,
    }));

    // 3. Calculate scores
    const scoringResult = calculateScores(sessionSignals);

    // 4. Generate summaries
    const needRate = sessions.filter(s => s.need_validated).length / sessions.length;
    const solutionRate = sessions.filter(s => s.solution_resonated).length / sessions.length;

    const needValidationSummary = generateNeedValidationSummary(sessions, needRate);
    const solutionValidationSummary = generateSolutionValidationSummary(sessions, solutionRate);
    const keyObjections = extractKeyObjections(sessions);
    const nextSteps = generateNextSteps(scoringResult.verdict);
    const strongestSignals = generateStrongestSignals(sessions);

    // 5. Generate share token
    const shareToken = generateShareToken();

    // 6. Create report record
    const { data: report, error: reportError } = await supabase
      .from('reports')
      .insert({
        validation_test_id: testId,
        status: 'ready',
        verdict: scoringResult.verdict,
        confidence_level: scoringResult.confidenceLevel,
        need_validation_summary: needValidationSummary,
        solution_validation_summary: solutionValidationSummary,
        strongest_signals: strongestSignals,
        key_objections: keyObjections,
        next_steps: nextSteps,
        share_token: shareToken,
        is_public: false,
        generation_version: RUBRIC_VERSION,
      })
      .select('id')
      .single();

    if (reportError || !report) {
      return { success: false, error: `Failed to create report: ${reportError?.message}` };
    }

    // 7. Update test with report reference
    await supabase
      .from('validation_tests')
      .update({ report_id: report.id, status: 'completed' })
      .eq('id', testId);

    return { success: true, reportId: report.id };
  } catch (error) {
    console.error('Report generation error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
