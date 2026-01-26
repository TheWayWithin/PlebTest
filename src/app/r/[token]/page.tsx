import { notFound } from 'next/navigation';
import {
  FileText,
  AlertTriangle,
  RefreshCw,
  Rocket,
  TrendingUp,
  TrendingDown,
  Shield,
  Target,
  Lightbulb,
  Info,
} from 'lucide-react';
import { createAdminClient } from '@/lib/supabase/admin';
import { Badge } from '@/components/ui/badge';

interface PageProps {
  params: Promise<{
    token: string;
  }>;
}

const VERDICT_CONFIG = {
  kill: {
    label: 'KILL',
    color: 'bg-red-500/20 text-red-400 border-red-500/50',
    icon: AlertTriangle,
    description: 'High risk - Proceed with caution or consider abandoning this direction.',
    bgGradient: 'from-red-500/10 to-transparent',
  },
  pivot: {
    label: 'PIVOT',
    color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
    icon: RefreshCw,
    description: 'Needs refinement - Some signals positive, but significant concerns remain.',
    bgGradient: 'from-yellow-500/10 to-transparent',
  },
  build: {
    label: 'BUILD',
    color: 'bg-green-500/20 text-green-400 border-green-500/50',
    icon: Rocket,
    description: 'Strong signals - Worth pursuing with confidence.',
    bgGradient: 'from-green-500/10 to-transparent',
  },
};

const CONFIDENCE_CONFIG = {
  low: {
    label: 'Low Confidence',
    color: 'text-red-400',
    description: 'Results are preliminary - consider more testing',
  },
  medium: {
    label: 'Medium Confidence',
    color: 'text-yellow-400',
    description: 'Results are indicative but not definitive',
  },
  high: {
    label: 'High Confidence',
    color: 'text-green-400',
    description: 'Results are reliable with strong agreement',
  },
};

export default async function PublicReportPage({ params }: PageProps) {
  const { token } = await params;

  // Use admin client to bypass RLS - we validate via token
  const supabase = createAdminClient();

  // Fetch report by share_token
  const { data: report, error: reportError } = await supabase
    .from('reports')
    .select(`
      *,
      validation_tests!inner (
        id,
        proposal_id,
        proposals!inner (
          id,
          problem,
          solution,
          idea_id,
          ideas!inner (
            id,
            name
          )
        )
      )
    `)
    .eq('share_token', token)
    .eq('is_public', true)
    .single();

  if (reportError || !report) {
    notFound();
  }

  const verdict = (report.verdict || 'pivot') as keyof typeof VERDICT_CONFIG;
  const verdictConfig = VERDICT_CONFIG[verdict];
  const VerdictIcon = verdictConfig.icon;

  const confidence = (report.confidence_level || 'medium') as keyof typeof CONFIDENCE_CONFIG;
  const confidenceConfig = CONFIDENCE_CONFIG[confidence];

  const keyObjections = (report.key_objections || []) as string[];
  const strongestSignals = (report.strongest_signals || []) as string[];
  const nextSteps = (report.next_steps || []) as string[];

  // Type assertion for nested data
  const test = report.validation_tests as unknown as {
    id: string;
    proposal_id: string;
    proposals: {
      id: string;
      problem: string | null;
      solution: string | null;
      idea_id: string;
      ideas: {
        id: string;
        name: string;
      };
    };
  };

  const hideProposalDetails = report.hide_proposal_details ?? false;
  const ideaName = test.proposals.ideas.name;

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-orange-500/20 flex items-center justify-center">
              <FileText className="w-6 h-6 text-orange-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Validation Report</h1>
              <p className="text-gray-400">
                {ideaName} - Generated{' '}
                {report.generated_at
                  ? new Date(report.generated_at).toLocaleDateString()
                  : 'recently'}
              </p>
            </div>
          </div>
        </div>

        {/* Verdict Card - Prominent */}
        <div
          className={`relative overflow-hidden rounded-xl border border-gray-700 p-8 mb-6 bg-gradient-to-r ${verdictConfig.bgGradient}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`p-4 rounded-xl ${verdictConfig.color}`}>
                <VerdictIcon className="w-10 h-10" />
              </div>
              <div>
                <Badge
                  className={`text-2xl font-bold px-4 py-2 ${verdictConfig.color} border`}
                >
                  {verdictConfig.label}
                </Badge>
                <p className="text-gray-300 mt-2 max-w-md">{verdictConfig.description}</p>
              </div>
            </div>

            <div className="text-right">
              <p className={`text-lg font-medium ${confidenceConfig.color}`}>
                {confidenceConfig.label}
              </p>
              <p className="text-sm text-gray-400">{confidenceConfig.description}</p>
            </div>
          </div>
        </div>

        {/* Proposal Details (if not hidden) */}
        {!hideProposalDetails && (test.proposals.problem || test.proposals.solution) && (
          <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6 mb-6">
            <h2 className="text-lg font-semibold text-white mb-4">Proposal Overview</h2>
            {test.proposals.problem && (
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-400 mb-1">Problem</h3>
                <p className="text-gray-300">{test.proposals.problem}</p>
              </div>
            )}
            {test.proposals.solution && (
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-1">Solution</h3>
                <p className="text-gray-300">{test.proposals.solution}</p>
              </div>
            )}
          </div>
        )}

        {/* Need Validation Summary */}
        <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Target className="w-5 h-5 text-orange-400" />
            <h2 className="text-lg font-semibold text-white">Problem Validation</h2>
          </div>
          <p className="text-gray-300 leading-relaxed">
            {report.need_validation_summary || 'No summary available.'}
          </p>
        </div>

        {/* Solution Validation Summary */}
        <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Lightbulb className="w-5 h-5 text-orange-400" />
            <h2 className="text-lg font-semibold text-white">Solution Validation</h2>
          </div>
          <p className="text-gray-300 leading-relaxed">
            {report.solution_validation_summary || 'No summary available.'}
          </p>
        </div>

        {/* Two Column: Strongest Signals & Key Objections */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Strongest Signals */}
          <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <h2 className="text-lg font-semibold text-white">Strongest Signals</h2>
            </div>
            {strongestSignals.length > 0 ? (
              <ul className="space-y-3">
                {strongestSignals.map((signal, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-300">
                    <span className="text-green-400 mt-1">+</span>
                    <span>{signal}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No significant positive signals detected.</p>
            )}
          </div>

          {/* Key Objections */}
          <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <TrendingDown className="w-5 h-5 text-red-400" />
              <h2 className="text-lg font-semibold text-white">Key Objections</h2>
            </div>
            {keyObjections.length > 0 ? (
              <ul className="space-y-3">
                {keyObjections.map((objection, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-300">
                    <span className="text-red-400 mt-1">-</span>
                    <span>{objection}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No significant objections recorded.</p>
            )}
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-5 h-5 text-orange-400" />
            <h2 className="text-lg font-semibold text-white">Recommended Next Steps</h2>
          </div>
          {nextSteps.length > 0 ? (
            <ul className="space-y-3">
              {nextSteps.map((step, index) => (
                <li key={index} className="flex items-start gap-3 text-gray-300">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No specific next steps generated.</p>
          )}
        </div>

        {/* Disclaimer */}
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <p className="text-yellow-200/80 text-sm">
              <strong>Important:</strong> These results are patterns from AI simulations,
              not market guarantees. They provide directional guidance based on synthetic
              personas derived from ICP definitions. Always validate findings with real
              customer conversations before making significant business decisions.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center space-y-2">
          <p className="text-gray-400 text-sm">
            Report generated with{' '}
            <a
              href="https://plebtest.com"
              className="text-orange-400 hover:text-orange-300"
              target="_blank"
              rel="noopener noreferrer"
            >
              PlebTest
            </a>
          </p>
          <p className="text-xs text-gray-500">
            Report version: {report.generation_version || 'unknown'} | Generated:{' '}
            {report.generated_at ? new Date(report.generated_at).toISOString() : 'N/A'}
          </p>
        </div>
      </div>
    </div>
  );
}
