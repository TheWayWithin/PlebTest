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

interface EditIcpDialogProps {
  icp: Icp;
  ideaId: string;
  proposalId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (updatedIcp: Icp) => void;
}

interface FormErrors {
  name?: string[];
  demographics?: string[];
  psychographics?: string[];
  context?: string[];
  pain_intensity?: string[];
  current_solutions?: string[];
  decision_role?: string[];
  adoption_tendency?: string[];
}

const PAIN_INTENSITY_OPTIONS = [
  { value: '', label: 'Select pain level...' },
  { value: 'annoying', label: 'Annoying - Inconvenient but manageable' },
  { value: 'costly', label: 'Costly - Significant time/money impact' },
  { value: 'blocking', label: 'Blocking - Prevents critical activities' },
];

const DECISION_ROLE_OPTIONS = [
  { value: '', label: 'Select role...' },
  { value: 'decision_maker', label: 'Decision Maker - Has final say' },
  { value: 'influencer', label: 'Influencer - Recommends solutions' },
  { value: 'end_user', label: 'End User - Uses the product daily' },
  { value: 'blocker', label: 'Blocker - Can veto decisions' },
];

const ADOPTION_TENDENCY_OPTIONS = [
  { value: '', label: 'Select adoption tendency...' },
  { value: 'early_adopter', label: 'Early Adopter - Tries new things first' },
  { value: 'early_majority', label: 'Early Majority - Waits for some proof' },
  { value: 'late_majority', label: 'Late Majority - Needs extensive proof' },
  { value: 'laggard', label: 'Laggard - Resistant to change' },
];

export function EditIcpDialog({
  icp,
  ideaId,
  proposalId,
  open,
  onOpenChange,
  onSuccess,
}: EditIcpDialogProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});

  const [formData, setFormData] = useState({
    name: icp.name || '',
    demographics: icp.demographics?.description || '',
    psychographics: icp.psychographics?.description || '',
    context: icp.context || '',
    pain_intensity: icp.pain_intensity || '',
    current_solutions: icp.current_solutions || '',
    decision_role: icp.decision_role || '',
    adoption_tendency: icp.adoption_tendency || '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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
      const response = await fetch(`/api/ideas/${ideaId}/proposals/${proposalId}/icps/${icp.id}`, {
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
          setError(data.error || 'Failed to update ICP');
        }
        return;
      }

      onSuccess(data.icp);
      onOpenChange(false);
      router.refresh();
    } catch (err) {
      console.error('Error updating ICP:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const TextAreaField = ({
    name,
    label,
    placeholder,
    helpText,
    required = false,
    rows = 2,
  }: {
    name: keyof typeof formData;
    label: string;
    placeholder: string;
    helpText?: string;
    required?: boolean;
    rows?: number;
  }) => (
    <div className="space-y-1.5">
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

  const SelectField = ({
    name,
    label,
    options,
  }: {
    name: keyof typeof formData;
    label: string;
    options: { value: string; label: string }[];
  }) => (
    <div className="space-y-1.5">
      <Label htmlFor={name} className="text-white text-sm">
        {label}
      </Label>
      <select
        id={name}
        name={name}
        value={formData[name]}
        onChange={handleChange}
        disabled={isSubmitting}
        className={`w-full bg-gray-800 border rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 ${
          fieldErrors[name] ? 'border-red-500' : 'border-gray-700'
        }`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {fieldErrors[name] && (
        <p className="text-red-400 text-xs">{fieldErrors[name]![0]}</p>
      )}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit ICP</DialogTitle>
          <DialogDescription className="text-gray-400">
            Update the Ideal Customer Profile details.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 text-red-400 bg-red-500/10 border border-red-500/30 p-3 rounded-lg text-sm">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-white text-sm">
              ICP Name <span className="text-red-400">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., 'Solo SaaS Founder'"
              disabled={isSubmitting}
              className={`bg-gray-800 border text-white text-sm placeholder-gray-500 ${
                fieldErrors.name ? 'border-red-500' : 'border-gray-700'
              }`}
            />
            {fieldErrors.name && (
              <p className="text-red-400 text-xs">{fieldErrors.name[0]}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <TextAreaField
              name="demographics"
              label="Demographics"
              placeholder="Age, location, income, job title..."
              helpText="Demographic characteristics"
            />
            <TextAreaField
              name="psychographics"
              label="Psychographics"
              placeholder="Values, beliefs, motivations..."
              helpText="Psychological characteristics"
            />
          </div>

          <TextAreaField
            name="context"
            label="Usage Context"
            placeholder="When and where do they experience this problem?"
            helpText="Situations where the problem occurs"
          />

          <div className="grid grid-cols-3 gap-4">
            <SelectField
              name="pain_intensity"
              label="Pain Intensity"
              options={PAIN_INTENSITY_OPTIONS}
            />
            <SelectField
              name="decision_role"
              label="Decision Role"
              options={DECISION_ROLE_OPTIONS}
            />
            <SelectField
              name="adoption_tendency"
              label="Adoption Tendency"
              options={ADOPTION_TENDENCY_OPTIONS}
            />
          </div>

          <TextAreaField
            name="current_solutions"
            label="Current Solutions"
            placeholder="What do they use today?"
            helpText="Existing workarounds or tools"
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
              disabled={isSubmitting || !formData.name.trim()}
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
