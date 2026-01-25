'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, AlertCircle, HelpCircle } from 'lucide-react';

interface CreateProposalFormProps {
  ideaId: string;
  ideaName: string;
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

export function CreateProposalForm({ ideaId, ideaName }: CreateProposalFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});

  const [formData, setFormData] = useState({
    problem: '',
    solution: '',
    hypotheses: '',
    current_workarounds: '',
    pricing_assumption: '',
    competitors: '',
    external_context: '',
    external_source_url: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field error when user starts typing
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
      const response = await fetch(`/api/ideas/${ideaId}/proposals`, {
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
          setError(data.error || 'Failed to create proposal');
        }
        return;
      }

      // Success - redirect to proposal view
      router.push(`/ideas/${ideaId}/proposals/${data.proposal.id}`);
    } catch (err) {
      console.error('Error creating proposal:', err);
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
    rows = 4,
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="flex items-center gap-2 text-red-400 bg-red-500/10 border border-red-500/30 p-4 rounded-lg">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Required Fields */}
      <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6 space-y-6">
        <h3 className="text-lg font-semibold text-white">Core Proposal</h3>

        <FormField
          name="problem"
          label="Problem Statement"
          placeholder="What problem are you solving? Who experiences this problem and how painful is it?"
          helpText="Describe the specific problem your target customers face. Be as concrete as possible."
          required
          rows={4}
        />

        <FormField
          name="solution"
          label="Proposed Solution"
          placeholder="How does your product solve this problem? What makes it different?"
          helpText="Describe your solution and what makes it unique compared to existing alternatives."
          required
          rows={4}
        />

        <FormField
          name="hypotheses"
          label="Key Hypotheses"
          placeholder="What assumptions are you making? List the riskiest ones that need validation."
          helpText="List 2-3 key assumptions that, if wrong, would invalidate your idea."
          rows={3}
        />
      </div>

      {/* Optional Fields */}
      <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6 space-y-6">
        <h3 className="text-lg font-semibold text-white">Additional Context</h3>
        <p className="text-gray-400 text-sm">
          These fields are optional but help generate better validation tests.
        </p>

        <FormField
          name="current_workarounds"
          label="Current Workarounds"
          placeholder="How do people currently solve this problem? What tools or processes do they use?"
          helpText="Understanding existing solutions helps identify switching barriers."
          rows={3}
        />

        <FormField
          name="pricing_assumption"
          label="Pricing Assumption"
          placeholder="How much would customers pay? What pricing model are you considering?"
          helpText="Your assumptions about willingness to pay and pricing structure."
          rows={2}
        />

        <FormField
          name="competitors"
          label="Competitors"
          placeholder="Who else is solving this problem? What are their strengths and weaknesses?"
          helpText="List direct and indirect competitors and how you differ."
          rows={3}
        />

        <div className="space-y-2">
          <Label htmlFor="external_source_url" className="text-white">
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
            className={`bg-gray-800 border text-white placeholder-gray-500 ${
              fieldErrors.external_source_url ? 'border-red-500' : 'border-gray-700'
            }`}
          />
          {fieldErrors.external_source_url && (
            <p className="text-red-400 text-sm">{fieldErrors.external_source_url[0]}</p>
          )}
        </div>

        <FormField
          name="external_context"
          label="External Context"
          placeholder="Any additional research, market data, or context that informs your proposal."
          helpText="Paste relevant market research, customer quotes, or other supporting information."
          rows={4}
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4">
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push(`/ideas/${ideaId}`)}
          disabled={isSubmitting}
          className="text-gray-400 hover:text-white"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || !formData.problem.trim() || !formData.solution.trim()}
          className="bg-orange-500 hover:bg-orange-600 text-white px-8"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            'Create Proposal'
          )}
        </Button>
      </div>
    </form>
  );
}
