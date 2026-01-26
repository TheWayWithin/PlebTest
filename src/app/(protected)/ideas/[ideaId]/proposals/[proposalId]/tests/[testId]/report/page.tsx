import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  FileText,
  AlertTriangle,
  RefreshCw,
  Rocket,
  TrendingUp,
  TrendingDown,
  Shield,
  Target,
  Lightbulb,
  Download,
  Info,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShareReportSection } from '@/components/report/ShareReportSection';

interface PageProps {
  params: Promise<{
    ideaId: string;
    proposalId: string;
    testId: string;
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

export default async function ReportPage({ params }: PageProps) {
  const { ideaId, proposalId, testId } = await params;
  const supabase = await createClient();

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch idea and verify ownership
  const { data: idea, error: ideaError } = await supabase
    .from('ideas')
    .select('id, name, user_id')
    .eq('id', ideaId)
    .single();

  if (ideaError || !idea || idea.user_id !== user.id) {
    redirect('/ideas');
  }

  // Fetch test with report
  const { data: test, error: testError } = await supabase
    .from('validation_tests')
    .select('id, report_id')
    .eq('id', testId)
    .eq('proposal_id', proposalId)
    .single();

  if (testError || !test || !test.report_id) {
    redirect(`/ideas/${ideaId}/proposals/${proposalId}/tests/${testId}`);
  }

  // Fetch report
  const { data: report, error: reportError } = await supabase
    .from('reports')
    .select('*')
    .eq('id', test.report_id)
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

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href={`/ideas/${ideaId}/proposals/${proposalId}/tests/${testId}`}
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Test
        </Link>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-orange-500/20 flex items-center justify-center">
            <FileText className="w-6 h-6 text-orange-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Validation Report</h1>
            <p className="text-gray-400">
              Generated {report.generated_at
                ? new Date(report.generated_at).toLocaleDateString()
                : 'recently'}
            </p>
          </div>
        </div>
      </div>

      {/* Verdict Card - Prominent */}
      <div className={`relative overflow-hidden rounded-xl border border-gray-700 p-8 mb-6 bg-gradient-to-r ${verdictConfig.bgGradient}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`p-4 rounded-xl ${verdictConfig.color}`}>
              <VerdictIcon className="w-10 h-10" />
            </div>
            <div>
              <Badge className={`text-2xl font-bold px-4 py-2 ${verdictConfig.color} border`}>
                {verdictConfig.label}
              </Badge>
              <p className="text-gray-300 mt-2 max-w-md">
                {verdictConfig.description}
              </p>
            </div>
          </div>

          <div className="text-right">
            <p className={`text-lg font-medium ${confidenceConfig.color}`}>
              {confidenceConfig.label}
            </p>
            <p className="text-sm text-gray-400">
              {confidenceConfig.description}
            </p>
          </div>
        </div>
      </div>

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
                  <span className="text-red-400 mt-1">−</span>
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
            <strong>Important:</strong> These results are patterns from AI simulations, not market guarantees.
            They provide directional guidance based on synthetic personas derived from your ICP definitions.
            Always validate findings with real customer conversations before making significant business decisions.
          </p>
        </div>
      </div>

      {/* Share Report Section */}
      <ShareReportSection
        reportId={report.id}
        testId={testId}
        proposalId={proposalId}
        ideaId={ideaId}
        initialIsPublic={report.is_public ?? false}
        initialHideProposalDetails={report.hide_proposal_details ?? false}
        initialShareToken={report.share_token}
      />

      {/* Actions */}
      <div className="flex justify-center gap-4 mt-6">
        <Link href={`/api/ideas/${ideaId}/proposals/${proposalId}/tests/${testId}/report/download`}>
          <Button variant="outline" className="border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800">
            <Download className="w-4 h-4 mr-2" />
            Download JSON
          </Button>
        </Link>

        <Link href={`/ideas/${ideaId}/proposals/${proposalId}`}>
          <Button className="bg-orange-500 hover:bg-orange-600 text-white">
            Back to Proposal
          </Button>
        </Link>
      </div>

      {/* Generation Info */}
      <div className="mt-8 text-center text-xs text-gray-500">
        Report version: {report.generation_version || 'unknown'} |
        Generated: {report.generated_at ? new Date(report.generated_at).toISOString() : 'N/A'}
      </div>
    </div>
  );
}
