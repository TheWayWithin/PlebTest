'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, AlertCircle, HelpCircle } from 'lucide-react';

interface CreateIcpFormProps {
  ideaId: string;
  proposalId: string;
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

export function CreateIcpForm({ ideaId, proposalId }: CreateIcpFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});

  const [formData, setFormData] = useState({
    name: '',
    demographics: '',
    psychographics: '',
    context: '',
    pain_intensity: '',
    current_solutions: '',
    decision_role: '',
    adoption_tendency: '',
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
      const response = await fetch(`/api/ideas/${ideaId}/proposals/${proposalId}/icps`, {
        method: 'POST',
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
          setError(data.error || 'Failed to create ICP');
        }
        return;
      }

      // Success - redirect to proposal view (ICPs will be shown there)
      router.push(`/ideas/${ideaId}/proposals/${proposalId}`);
      router.refresh();
    } catch (err) {
      console.error('Error creating ICP:', err);
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
        <Label htmlFor={name} className="text-white">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </Label>
        {helpText && (
          <div className="group relative">
            <HelpCircle className="w-4 h-4 text-gray-500 cursor-help" />
            <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-64 p-2 bg-gray-800 border border-gray-700 rounded-lg text-xs text-gray-300 z-10">
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
        className={`w-full bg-gray-800 border rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 resize-none ${
          fieldErrors[name] ? 'border-red-500' : 'border-gray-700'
        }`}
      />
      {fieldErrors[name] && (
        <p className="text-red-400 text-sm">{fieldErrors[name]![0]}</p>
      )}
    </div>
  );

  const SelectField = ({
    name,
    label,
    helpText,
    options,
  }: {
    name: keyof typeof formData;
    label: string;
    helpText?: string;
    options: { value: string; label: string }[];
  }) => (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Label htmlFor={name} className="text-white">
          {label}
        </Label>
        {helpText && (
          <div className="group relative">
            <HelpCircle className="w-4 h-4 text-gray-500 cursor-help" />
            <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-64 p-2 bg-gray-800 border border-gray-700 rounded-lg text-xs text-gray-300 z-10">
              {helpText}
            </div>
          </div>
        )}
      </div>
      <select
        id={name}
        name={name}
        value={formData[name]}
        onChange={handleChange}
        disabled={isSubmitting}
        className={`w-full bg-gray-800 border rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 ${
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
        <p className="text-red-400 text-sm">{fieldErrors[name]![0]}</p>
      )}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="flex items-center gap-2 text-red-400 bg-red-500/10 border border-red-500/30 p-4 rounded-lg">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Basic Info */}
      <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6 space-y-6">
        <h3 className="text-lg font-semibold text-white">ICP Identity</h3>

        <div className="space-y-2">
          <Label htmlFor="name" className="text-white">
            ICP Name <span className="text-red-400">*</span>
          </Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., 'Solo SaaS Founder' or 'Enterprise IT Manager'"
            disabled={isSubmitting}
            className={`bg-gray-800 border text-white placeholder-gray-500 ${
              fieldErrors.name ? 'border-red-500' : 'border-gray-700'
            }`}
          />
          {fieldErrors.name && (
            <p className="text-red-400 text-sm">{fieldErrors.name[0]}</p>
          )}
        </div>

        <TextAreaField
          name="demographics"
          label="Demographics"
          placeholder="Age range, location, income level, job title, company size..."
          helpText="Describe the demographic characteristics of this customer segment."
          rows={3}
        />

        <TextAreaField
          name="psychographics"
          label="Psychographics"
          placeholder="Values, beliefs, motivations, frustrations, goals..."
          helpText="Describe the psychological characteristics, values, and motivations."
          rows={3}
        />
      </div>

      {/* Problem Context */}
      <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6 space-y-6">
        <h3 className="text-lg font-semibold text-white">Problem Context</h3>

        <TextAreaField
          name="context"
          label="Usage Context"
          placeholder="When and where do they experience this problem? What triggers it?"
          helpText="Describe the situations where this customer experiences the problem."
          rows={3}
        />

        <SelectField
          name="pain_intensity"
          label="Pain Intensity"
          helpText="How severely does this problem affect them?"
          options={PAIN_INTENSITY_OPTIONS}
        />

        <TextAreaField
          name="current_solutions"
          label="Current Solutions"
          placeholder="What tools, workarounds, or processes do they use today?"
          helpText="How are they currently solving or managing this problem?"
          rows={3}
        />
      </div>

      {/* Buying Behavior */}
      <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6 space-y-6">
        <h3 className="text-lg font-semibold text-white">Buying Behavior</h3>

        <SelectField
          name="decision_role"
          label="Decision Role"
          helpText="What role do they play in purchasing decisions?"
          options={DECISION_ROLE_OPTIONS}
        />

        <SelectField
          name="adoption_tendency"
          label="Adoption Tendency"
          helpText="How quickly do they adopt new solutions?"
          options={ADOPTION_TENDENCY_OPTIONS}
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4">
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push(`/ideas/${ideaId}/proposals/${proposalId}`)}
          disabled={isSubmitting}
          className="text-gray-400 hover:text-white"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || !formData.name.trim()}
          className="bg-orange-500 hover:bg-orange-600 text-white px-8"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            'Create ICP'
          )}
        </Button>
      </div>
    </form>
  );
}
