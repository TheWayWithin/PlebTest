'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Sparkles,
  Target,
  Lightbulb,
  AlertTriangle,
  Clock,
  Edit2,
  DollarSign,
  Users,
  FileText,
  Link as LinkIcon,
  CheckCircle,
  XCircle,
  Archive,
  ArchiveRestore,
  Trash2,
  Loader2,
  Plus,
  UserCircle,
  ChevronRight,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { EditProposalDialog } from '@/components/proposals/edit-proposal-dialog';

interface Idea {
  id: string;
  name: string;
  quick_fire_score: number | null;
  quick_fire_objection: string | null;
}

interface Proposal {
  id: string;
  idea_id: string;
  problem: string | null;
  solution: string | null;
  hypotheses: string | null;
  current_workarounds: string | null;
  pricing_assumption: string | null;
  competitors: string | null;
  external_context: string | null;
  external_source_url: string | null;
  status: string | null;
  created_at: string | null;
}

interface Icp {
  id: string;
  proposal_id: string;
  name: string;
  pain_intensity: string | null;
  decision_role: string | null;
  adoption_tendency: string | null;
  created_at: string | null;
}

interface ProposalViewProps {
  idea: Idea;
  proposal: Proposal;
  icps: Icp[];
}

const PAIN_INTENSITY_LABELS: Record<string, { label: string; color: string }> = {
  annoying: { label: 'Annoying', color: 'bg-yellow-500/20 text-yellow-400' },
  costly: { label: 'Costly', color: 'bg-orange-500/20 text-orange-400' },
  blocking: { label: 'Blocking', color: 'bg-red-500/20 text-red-400' },
};

export function ProposalView({ idea, proposal: initialProposal, icps }: ProposalViewProps) {
  const router = useRouter();
  const [proposal, setProposal] = useState(initialProposal);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const getScoreColor = (score: number | null) => {
    if (score === null) return 'text-gray-400';
    if (score >= 70) return 'text-red-400';
    if (score >= 40) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getStatusConfig = (status: string | null) => {
    switch (status) {
      case 'draft':
        return { label: 'Draft', color: 'bg-gray-500/20 text-gray-400 border-gray-500/30', icon: FileText };
      case 'active':
        return { label: 'Active', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', icon: Sparkles };
      case 'validated':
        return { label: 'Validated', color: 'bg-green-500/20 text-green-400 border-green-500/30', icon: CheckCircle };
      case 'invalidated':
        return { label: 'Invalidated', color: 'bg-red-500/20 text-red-400 border-red-500/30', icon: XCircle };
      case 'archived':
        return { label: 'Archived', color: 'bg-gray-600/20 text-gray-500 border-gray-600/30', icon: Archive };
      default:
        return { label: 'Draft', color: 'bg-gray-500/20 text-gray-400 border-gray-500/30', icon: FileText };
    }
  };

  const statusConfig = getStatusConfig(proposal.status);
  const StatusIcon = statusConfig.icon;
  const isArchived = proposal.status === 'archived';

  const handleEditSuccess = (updatedProposal: Proposal) => {
    setProposal(updatedProposal);
  };

  const handleArchiveToggle = async () => {
    setIsArchiving(true);
    try {
      const response = await fetch(`/api/ideas/${idea.id}/proposals/${proposal.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: isArchived ? 'unarchive' : 'archive' }),
      });

      if (response.ok) {
        const data = await response.json();
        setProposal(data.proposal);
      }
    } catch (error) {
      console.error('Error toggling archive:', error);
    } finally {
      setIsArchiving(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/ideas/${idea.id}/proposals/${proposal.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push(`/ideas/${idea.id}`);
      }
    } catch (error) {
      console.error('Error deleting proposal:', error);
      setIsDeleting(false);
    }
  };

  const Section = ({
    icon: Icon,
    title,
    content,
    emptyText = 'Not defined yet.',
  }: {
    icon: React.ElementType;
    title: string;
    content: string | null;
    emptyText?: string;
  }) => (
    <section className="bg-gray-900/50 border border-gray-700 rounded-xl p-6">
      <div className="flex items-center gap-2 text-gray-400 mb-3">
        <Icon className="w-5 h-5" />
        <h3 className="text-sm uppercase tracking-wide">{title}</h3>
      </div>
      <p className={`leading-relaxed ${content ? 'text-gray-200' : 'text-gray-500 italic'}`}>
        {content || emptyText}
      </p>
    </section>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href={`/ideas/${idea.id}`}
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to {idea.name}
        </Link>

        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-white">
                {proposal.problem ? (proposal.problem.length > 60 ? proposal.problem.slice(0, 60) + '...' : proposal.problem) : 'Your Proposal'}
              </h1>
              <Badge className={`${statusConfig.color} border`}>
                <StatusIcon className="w-3 h-3 mr-1" />
                {statusConfig.label}
              </Badge>
            </div>
            <p className="text-gray-400">
              {proposal.created_at
                ? `Created ${new Date(proposal.created_at).toLocaleDateString()}`
                : 'Recently created'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {idea.quick_fire_score !== null && (
              <div className="flex flex-col items-center bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2 mr-2">
                <span className="text-xs text-gray-500 uppercase tracking-wide">Risk Score</span>
                <span className={`text-3xl font-bold ${getScoreColor(idea.quick_fire_score)}`}>
                  {idea.quick_fire_score}
                </span>
              </div>
            )}

            {!isArchived && (
              <Button
                onClick={() => setIsEditDialogOpen(true)}
                variant="outline"
                size="sm"
                className="border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800"
              >
                <Edit2 className="w-4 h-4 mr-1" />
                Edit
              </Button>
            )}

            <Button
              onClick={handleArchiveToggle}
              variant="outline"
              size="sm"
              disabled={isArchiving}
              className="border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800"
            >
              {isArchiving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : isArchived ? (
                <>
                  <ArchiveRestore className="w-4 h-4 mr-1" />
                  Restore
                </>
              ) : (
                <>
                  <Archive className="w-4 h-4 mr-1" />
                  Archive
                </>
              )}
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-red-500/30 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-gray-900 border-gray-700">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-white">Delete Proposal?</AlertDialogTitle>
                  <AlertDialogDescription className="text-gray-400">
                    This action cannot be undone. This will permanently delete this proposal
                    and all associated data.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="bg-red-500 hover:bg-red-600 text-white"
                  >
                    {isDeleting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      'Delete Proposal'
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>

      {/* Archived Banner */}
      {isArchived && (
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Archive className="w-5 h-5 text-gray-500" />
            <p className="text-gray-400">This proposal is archived and read-only.</p>
          </div>
          <Button
            onClick={handleArchiveToggle}
            variant="outline"
            size="sm"
            disabled={isArchiving}
            className="border-gray-600 text-gray-300 hover:text-white hover:bg-gray-700"
          >
            {isArchiving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <ArchiveRestore className="w-4 h-4 mr-1" />
                Restore
              </>
            )}
          </Button>
        </div>
      )}

      {/* Proposal Sections */}
      <div className="space-y-6">
        {/* Original Idea */}
        <section className="bg-gray-900/50 border border-gray-700 rounded-xl p-6">
          <div className="flex items-center gap-2 text-gray-400 mb-3">
            <Lightbulb className="w-5 h-5" />
            <h3 className="text-sm uppercase tracking-wide">Original Idea</h3>
          </div>
          <p className="text-white text-lg">{idea.name}</p>
        </section>

        {/* Core Proposal - Problem & Solution */}
        <div className="grid md:grid-cols-2 gap-6">
          <Section
            icon={AlertTriangle}
            title="Problem"
            content={proposal.problem}
            emptyText="No problem defined yet."
          />
          <Section
            icon={Target}
            title="Solution"
            content={proposal.solution}
            emptyText="No solution defined yet."
          />
        </div>

        {/* Hypotheses */}
        <Section
          icon={Sparkles}
          title="Key Hypotheses"
          content={proposal.hypotheses}
          emptyText="No hypotheses defined yet."
        />

        {/* Current Workarounds */}
        {proposal.current_workarounds && (
          <Section
            icon={Users}
            title="Current Workarounds"
            content={proposal.current_workarounds}
          />
        )}

        {/* Pricing & Competitors */}
        {(proposal.pricing_assumption || proposal.competitors) && (
          <div className="grid md:grid-cols-2 gap-6">
            {proposal.pricing_assumption && (
              <Section
                icon={DollarSign}
                title="Pricing Assumption"
                content={proposal.pricing_assumption}
              />
            )}
            {proposal.competitors && (
              <Section
                icon={Users}
                title="Competitors"
                content={proposal.competitors}
              />
            )}
          </div>
        )}

        {/* External Source URL */}
        {proposal.external_source_url && (
          <section className="bg-gray-900/50 border border-gray-700 rounded-xl p-6">
            <div className="flex items-center gap-2 text-gray-400 mb-3">
              <LinkIcon className="w-5 h-5" />
              <h3 className="text-sm uppercase tracking-wide">External Source</h3>
            </div>
            <a
              href={proposal.external_source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-400 hover:text-orange-300 underline break-all"
            >
              {proposal.external_source_url}
            </a>
          </section>
        )}

        {/* External Context */}
        {proposal.external_context && (
          <Section
            icon={FileText}
            title="External Context"
            content={proposal.external_context}
          />
        )}

        {/* Key Objection from Quick Fire */}
        {idea.quick_fire_objection && (
          <section className="bg-gray-900/50 border border-gray-700 rounded-xl p-6">
            <div className="flex items-center gap-2 text-gray-400 mb-4">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="text-sm uppercase tracking-wide">Key Challenge to Address</h3>
            </div>
            <div className="flex items-start gap-3 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
              <Clock className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-white">{idea.quick_fire_objection}</p>
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-400">
                pending
              </span>
            </div>
          </section>
        )}

        {/* ICPs Section */}
        <section className="bg-gray-900/50 border border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-gray-400">
              <UserCircle className="w-5 h-5" />
              <h3 className="text-sm uppercase tracking-wide">Ideal Customer Profiles</h3>
            </div>
            {!isArchived && (
              <Link href={`/ideas/${idea.id}/proposals/${proposal.id}/icps/new`}>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add ICP
                </Button>
              </Link>
            )}
          </div>

          {icps.length === 0 ? (
            <div className="text-center py-8">
              <UserCircle className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400 mb-2">No ICPs defined yet</p>
              <p className="text-gray-500 text-sm">
                Define your Ideal Customer Profiles to better understand who you&apos;re building for.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {icps.map((icp) => {
                const painConfig = icp.pain_intensity ? PAIN_INTENSITY_LABELS[icp.pain_intensity] : null;
                return (
                  <Link
                    key={icp.id}
                    href={`/ideas/${idea.id}/proposals/${proposal.id}/icps/${icp.id}`}
                    className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                        <UserCircle className="w-6 h-6 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium group-hover:text-orange-400 transition-colors">
                          {icp.name}
                        </p>
                        <p className="text-gray-500 text-sm">
                          {icp.created_at
                            ? `Created ${new Date(icp.created_at).toLocaleDateString()}`
                            : 'Recently created'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {painConfig && (
                        <span className={`text-xs px-2 py-1 rounded-full ${painConfig.color}`}>
                          {painConfig.label}
                        </span>
                      )}
                      <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-gray-300" />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {/* Next Steps */}
      {!isArchived && (
        <div className="mt-8 p-6 bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-3">Next Steps</h3>
          <ol className="list-decimal list-inside space-y-2 text-gray-300">
            <li>Review and refine each section of your proposal</li>
            <li>Identify your riskiest assumption to test first</li>
            <li>Design a simple test to validate or invalidate it</li>
            <li>Talk to 5 potential customers this week</li>
          </ol>
          <p className="mt-4 text-sm text-gray-400">Full testing and validation features coming soon!</p>
        </div>
      )}

      {/* Edit Dialog */}
      <EditProposalDialog
        proposal={proposal}
        ideaId={idea.id}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSuccess={handleEditSuccess}
      />
    </div>
  );
}
