'use client';

import { User, Briefcase, MapPin, Brain } from 'lucide-react';

interface PersonaPanelProps {
  persona: {
    name: string;
    demographics?: {
      age?: number;
      gender?: string;
      location?: string;
      jobTitle?: string;
      company?: string;
      industry?: string;
    };
    psychographics?: {
      values?: string[];
      frustrations?: string[];
      communicationStyle?: string;
    };
    skepticism_level?: string;
  };
  pushbackPreset: string;
}

export function PersonaPanel({ persona, pushbackPreset }: PersonaPanelProps) {
  const demographics = persona.demographics || {};
  const psychographics = persona.psychographics || {};

  const skepticismColors: Record<string, string> = {
    low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  };

  const presetColors: Record<string, string> = {
    cheerleader: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    pragmatist: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    critic: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-4 space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
          <User className="w-6 h-6 text-orange-600 dark:text-orange-400" />
        </div>
        <div>
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
            {persona.name}
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {demographics.jobTitle || 'Professional'}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {persona.skepticism_level && (
          <span
            className={`text-xs px-2 py-1 rounded-full font-medium ${
              skepticismColors[persona.skepticism_level] || skepticismColors.medium
            }`}
          >
            {persona.skepticism_level.charAt(0).toUpperCase() + persona.skepticism_level.slice(1)} Skepticism
          </span>
        )}
        <span
          className={`text-xs px-2 py-1 rounded-full font-medium ${
            presetColors[pushbackPreset] || presetColors.pragmatist
          }`}
        >
          {pushbackPreset.charAt(0).toUpperCase() + pushbackPreset.slice(1)} Mode
        </span>
      </div>

      <div className="space-y-3 text-sm">
        {(demographics.company || demographics.industry) && (
          <div className="flex items-start gap-2">
            <Briefcase className="w-4 h-4 text-zinc-400 mt-0.5" />
            <div>
              {demographics.company && (
                <p className="text-zinc-700 dark:text-zinc-300">{demographics.company}</p>
              )}
              {demographics.industry && (
                <p className="text-zinc-500 dark:text-zinc-400">{demographics.industry}</p>
              )}
            </div>
          </div>
        )}

        {demographics.location && (
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-zinc-400" />
            <p className="text-zinc-700 dark:text-zinc-300">{demographics.location}</p>
          </div>
        )}

        {psychographics.communicationStyle && (
          <div className="flex items-start gap-2">
            <Brain className="w-4 h-4 text-zinc-400 mt-0.5" />
            <p className="text-zinc-700 dark:text-zinc-300">
              {psychographics.communicationStyle}
            </p>
          </div>
        )}
      </div>

      {psychographics.frustrations && psychographics.frustrations.length > 0 && (
        <div className="pt-2 border-t border-zinc-200 dark:border-zinc-700">
          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-2">
            Key Frustrations
          </p>
          <ul className="text-sm text-zinc-600 dark:text-zinc-400 space-y-1">
            {psychographics.frustrations.slice(0, 3).map((frustration, i) => (
              <li key={i} className="flex items-start gap-1">
                <span className="text-orange-500">-</span>
                <span>{frustration}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
