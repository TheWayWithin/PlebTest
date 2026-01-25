'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Edit2,
  Users,
  Brain,
  MapPin,
  AlertTriangle,
  Wrench,
  UserCheck,
  Zap,
  Trash2,
  Loader2,
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
import { EditIcpDialog } from '@/components/icps/edit-icp-dialog';

interface Idea {
  id: string;
  name: string;
}

interface Proposal {
  id: string;
  problem: string | null;
}

interface Icp {
  id: string;
  proposal_id: string;
  name: string;
  demographics: { description?: string } | null;
  psychographics: { description?: string } | null;
  context: string | null;
  pain_intensity: string | null;
  current_solutions: string | null;
  decision_role: string | null;
  adoption_tendency: string | null;
  created_at: string | null;
}

interface IcpViewProps {
  idea: Idea;
  proposal: Proposal;
  icp: Icp;
}

const PAIN_INTENSITY_LABELS: Record<string, { label: string; color: string }> = {
  annoying: { label: 'Annoying', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  costly: { label: 'Costly', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
  blocking: { label: 'Blocking', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
};

const DECISION_ROLE_LABELS: Record<string, string> = {
  decision_maker: 'Decision Maker',
  influencer: 'Influencer',
  end_user: 'End User',
  blocker: 'Blocker',
};

const ADOPTION_TENDENCY_LABELS: Record<string, string> = {
  early_adopter: 'Early Adopter',
  early_majority: 'Early Majority',
  late_majority: 'Late Majority',
  laggard: 'Laggard',
};

export function IcpView({ idea, proposal, icp: initialIcp }: IcpViewProps) {
  const router = useRouter();
  const [icp, setIcp] = useState(initialIcp);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEditSuccess = (updatedIcp: Icp) => {
    setIcp(updatedIcp);
  };

  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDelete = async () => {
    setIsDeleting(true);
    setDeleteError(null);
    try {
      const response = await fetch(`/api/ideas/${idea.id}/proposals/${proposal.id}/icps/${icp.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push(`/ideas/${idea.id}/proposals/${proposal.id}`);
        return;
      }

      const errorData = await response.json();

      if (response.status === 409) {
        // ICP is in use by active tests
        setDeleteError(errorData.details || 'Cannot delete ICP while it is used in active tests.');
        setIsDeleting(false);
        return;
      }

      setDeleteError(errorData.error || 'Failed to delete ICP');
      setIsDeleting(false);
    } catch (error) {
      console.error('Error deleting ICP:', error);
      setDeleteError('An unexpected error occurred');
      setIsDeleting(false);
    }
  };

  const Section = ({
    icon: Icon,
    title,
    content,
    emptyText = 'Not defined',
  }: {
    icon: React.ElementType;
    title: string;
    content: string | null | undefined;
    emptyText?: string;
  }) => (
    <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-5">
      <div className="flex items-center gap-2 text-gray-400 mb-2">
        <Icon className="w-4 h-4" />
        <h3 className="text-sm uppercase tracking-wide">{title}</h3>
      </div>
      <p className={`leading-relaxed ${content ? 'text-gray-200' : 'text-gray-500 italic'}`}>
        {content || emptyText}
      </p>
    </div>
  );

  const painConfig = icp.pain_intensity ? PAIN_INTENSITY_LABELS[icp.pain_intensity] : null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href={`/ideas/${idea.id}/proposals/${proposal.id}`}
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Proposal
        </Link>

        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-white">{icp.name}</h1>
              {painConfig && (
                <Badge className={`${painConfig.color} border`}>
                  {painConfig.label} Pain
                </Badge>
              )}
            </div>
            <p className="text-gray-400">
              Ideal Customer Profile for your proposal
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => setIsEditDialogOpen(true)}
              variant="outline"
              size="sm"
              className="border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800"
            >
              <Edit2 className="w-4 h-4 mr-1" />
              Edit
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
                  <AlertDialogTitle className="text-white">Delete ICP?</AlertDialogTitle>
                  <AlertDialogDescription className="text-gray-400">
                    This action cannot be undone. This will permanently delete this
                    Ideal Customer Profile.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                {deleteError && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                    <p className="text-red-400 text-sm">{deleteError}</p>
                  </div>
                )}
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
                      'Delete ICP'
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>

      {/* ICP Details */}
      <div className="space-y-6">
        {/* Demographics & Psychographics */}
        <div className="grid md:grid-cols-2 gap-6">
          <Section
            icon={Users}
            title="Demographics"
            content={icp.demographics?.description}
            emptyText="No demographics defined"
          />
          <Section
            icon={Brain}
            title="Psychographics"
            content={icp.psychographics?.description}
            emptyText="No psychographics defined"
          />
        </div>

        {/* Context */}
        <Section
          icon={MapPin}
          title="Usage Context"
          content={icp.context}
          emptyText="No context defined"
        />

        {/* Current Solutions */}
        <Section
          icon={Wrench}
          title="Current Solutions"
          content={icp.current_solutions}
          emptyText="No current solutions defined"
        />

        {/* Behavior Traits */}
        <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-5">
          <h3 className="text-sm uppercase tracking-wide text-gray-400 mb-4">Behavior Profile</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {/* Pain Intensity */}
            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-400 mb-2">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-xs uppercase tracking-wide">Pain Intensity</span>
              </div>
              {icp.pain_intensity ? (
                <Badge className={`${painConfig?.color} border`}>
                  {painConfig?.label}
                </Badge>
              ) : (
                <span className="text-gray-500 text-sm italic">Not set</span>
              )}
            </div>

            {/* Decision Role */}
            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-400 mb-2">
                <UserCheck className="w-4 h-4" />
                <span className="text-xs uppercase tracking-wide">Decision Role</span>
              </div>
              {icp.decision_role ? (
                <span className="text-white font-medium">
                  {DECISION_ROLE_LABELS[icp.decision_role]}
                </span>
              ) : (
                <span className="text-gray-500 text-sm italic">Not set</span>
              )}
            </div>

            {/* Adoption Tendency */}
            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-400 mb-2">
                <Zap className="w-4 h-4" />
                <span className="text-xs uppercase tracking-wide">Adoption Tendency</span>
              </div>
              {icp.adoption_tendency ? (
                <span className="text-white font-medium">
                  {ADOPTION_TENDENCY_LABELS[icp.adoption_tendency]}
                </span>
              ) : (
                <span className="text-gray-500 text-sm italic">Not set</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Dialog */}
      <EditIcpDialog
        icp={icp}
        ideaId={idea.id}
        proposalId={proposal.id}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSuccess={handleEditSuccess}
      />
    </div>
  );
}
