'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Loader2, AlertCircle, HelpCircle } from 'lucide-react';

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

interface EditProposalDialogProps {
  proposal: Proposal;
  ideaId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (updatedProposal: Proposal) => void;
}

interface FormErrors {
  problem?: string[];
  solution?: string[];
  hypotheses?: string[];
  current_workarounds?: string[];
  pricing_assumption?: string[];
  competitors?: string[];
  external_context?: string[];
  external_source_url?: string[];
}

export function EditProposalDialog({
  proposal,
  ideaId,
  open,
  onOpenChange,
  onSuccess,
}: EditProposalDialogProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});

  const [formData, setFormData] = useState({
    problem: proposal.problem || '',
    solution: proposal.solution || '',
    hypotheses: proposal.hypotheses || '',
    current_workarounds: proposal.current_workarounds || '',
    pricing_assumption: proposal.pricing_assumption || '',
    competitors: proposal.competitors || '',
    external_context: proposal.external_context || '',
    external_source_url: proposal.external_source_url || '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name as keyof FormErrors]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/ideas/${ideaId}/proposals/${proposal.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.details) {
          setFieldErrors(data.details);
        } else {
          setError(data.error || 'Failed to update proposal');
        }
        return;
      }

      onSuccess(data.proposal);
      onOpenChange(false);
      router.refresh();
    } catch (err) {
      console.error('Error updating proposal:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const FormField = ({
    name,
    label,
    placeholder,
    helpText,
    required = false,
    rows = 3,
  }: {
    name: keyof typeof formData;
    label: string;
    placeholder: string;
    helpText?: string;
    required?: boolean;
    rows?: number;
  }) => (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Label htmlFor={name} className="text-white text-sm">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </Label>
        {helpText && (
          <div className="group relative">
            <HelpCircle className="w-3.5 h-3.5 text-gray-500 cursor-help" />
            <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-56 p-2 bg-gray-800 border border-gray-700 rounded-lg text-xs text-gray-300 z-50">
              {helpText}
            </div>
          </div>
        )}
      </div>
      <textarea
        id={name}
        name={name}
        value={formData[name]}
        onChange={handleChange}
        placeholder={placeholder}
        rows={rows}
        disabled={isSubmitting}
        className={`w-full bg-gray-800 border rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 resize-none ${
          fieldErrors[name] ? 'border-red-500' : 'border-gray-700'
        }`}
      />
      {fieldErrors[name] && (
        <p className="text-red-400 text-xs">{fieldErrors[name]![0]}</p>
      )}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Proposal</DialogTitle>
          <DialogDescription className="text-gray-400">
            Update your proposal details. Problem and solution are required.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 text-red-400 bg-red-500/10 border border-red-500/30 p-3 rounded-lg text-sm">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <FormField
            name="problem"
            label="Problem Statement"
            placeholder="What problem are you solving?"
            helpText="Describe the specific problem your target customers face."
            required
            rows={3}
          />

          <FormField
            name="solution"
            label="Proposed Solution"
            placeholder="How does your product solve this problem?"
            helpText="Describe your solution and what makes it unique."
            required
            rows={3}
          />

          <FormField
            name="hypotheses"
            label="Key Hypotheses"
            placeholder="What assumptions need validation?"
            helpText="List 2-3 key assumptions that need testing."
            rows={2}
          />

          <FormField
            name="current_workarounds"
            label="Current Workarounds"
            placeholder="How do people currently solve this?"
            helpText="Understanding existing solutions helps identify switching barriers."
            rows={2}
          />

          <FormField
            name="pricing_assumption"
            label="Pricing Assumption"
            placeholder="How much would customers pay?"
            helpText="Your assumptions about willingness to pay."
            rows={2}
          />

          <FormField
            name="competitors"
            label="Competitors"
            placeholder="Who else is solving this problem?"
            helpText="List direct and indirect competitors."
            rows={2}
          />

          <div className="space-y-2">
            <Label htmlFor="external_source_url" className="text-white text-sm">
              External Source URL
            </Label>
            <Input
              id="external_source_url"
              name="external_source_url"
              type="url"
              value={formData.external_source_url}
              onChange={handleChange}
              placeholder="https://example.com/research"
              disabled={isSubmitting}
              className={`bg-gray-800 border text-white text-sm placeholder-gray-500 ${
                fieldErrors.external_source_url ? 'border-red-500' : 'border-gray-700'
              }`}
            />
            {fieldErrors.external_source_url && (
              <p className="text-red-400 text-xs">{fieldErrors.external_source_url[0]}</p>
            )}
          </div>

          <FormField
            name="external_context"
            label="External Context"
            placeholder="Any additional research or market data."
            helpText="Paste relevant market research or customer quotes."
            rows={3}
          />

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="text-gray-400 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !formData.problem.trim() || !formData.solution.trim()}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
