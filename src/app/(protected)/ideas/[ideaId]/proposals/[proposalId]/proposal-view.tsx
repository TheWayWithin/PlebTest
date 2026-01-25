'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Sparkles,
  Target,
  Lightbulb,
  AlertTriangle,
  Clock,
  Edit2,
} from 'lucide-react';

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
  competitors: string | null;
  status: string | null;
  created_at: string | null;
}

interface ProposalViewProps {
  idea: Idea;
  proposal: Proposal;
}

export function ProposalView({ idea, proposal }: ProposalViewProps) {
  const [isEditing, setIsEditing] = useState(false);

  const getScoreColor = (score: number | null) => {
    if (score === null) return 'text-gray-400';
    if (score >= 70) return 'text-red-400';
    if (score >= 40) return 'text-yellow-400';
    return 'text-green-400';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">
              {proposal.problem ? proposal.problem.slice(0, 80) + '...' : 'Your Proposal'}
            </h1>
            <p className="text-gray-400">Created from your Quick Fire analysis</p>
          </div>

          {idea.quick_fire_score !== null && (
            <div className="flex flex-col items-center bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2">
              <span className="text-xs text-gray-500 uppercase tracking-wide">Risk Score</span>
              <span className={`text-3xl font-bold ${getScoreColor(idea.quick_fire_score)}`}>
                {idea.quick_fire_score}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Success Banner */}
      <div className="bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-500/30 rounded-xl p-6 mb-8">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-orange-500/20 rounded-lg">
            <Sparkles className="w-6 h-6 text-orange-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white mb-1">Your Proposal is Ready!</h2>
            <p className="text-gray-300">
              I have generated a starting proposal based on your idea. Review and refine each
              section, then start testing your assumptions with real users.
            </p>
          </div>
        </div>
      </div>

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

        {/* Problem */}
        <section className="bg-gray-900/50 border border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-gray-400">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="text-sm uppercase tracking-wide">Problem</h3>
            </div>
            <button
              className="text-gray-500 hover:text-white transition-colors"
              onClick={() => setIsEditing(!isEditing)}
            >
              <Edit2 className="w-4 h-4" />
            </button>
          </div>
          <p className="text-gray-200 leading-relaxed">
            {proposal.problem || 'No problem defined yet.'}
          </p>
        </section>

        {/* Solution */}
        <section className="bg-gray-900/50 border border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-gray-400">
              <Target className="w-5 h-5" />
              <h3 className="text-sm uppercase tracking-wide">Solution</h3>
            </div>
            <button className="text-gray-500 hover:text-white transition-colors">
              <Edit2 className="w-4 h-4" />
            </button>
          </div>
          <p className="text-gray-200 leading-relaxed">
            {proposal.solution || 'No solution defined yet.'}
          </p>
        </section>

        {/* Hypotheses */}
        <section className="bg-gray-900/50 border border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-gray-400">
              <Sparkles className="w-5 h-5" />
              <h3 className="text-sm uppercase tracking-wide">Key Hypotheses</h3>
            </div>
            <button className="text-gray-500 hover:text-white transition-colors">
              <Edit2 className="w-4 h-4" />
            </button>
          </div>
          <p className="text-gray-200 leading-relaxed">
            {proposal.hypotheses || 'No hypotheses defined yet.'}
          </p>
        </section>

        {/* Key Objection from Quick Fire */}
        {idea.quick_fire_objection && (
          <section className="bg-gray-900/50 border border-gray-700 rounded-xl p-6">
            <div className="flex items-center gap-2 text-gray-400 mb-4">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="text-sm uppercase tracking-wide">Key Challenge to Address</h3>
            </div>
            <div className="flex items-start gap-3 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
              <Clock className="w-4 h-4 text-yellow-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-white">{idea.quick_fire_objection}</p>
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-400">
                pending
              </span>
            </div>
          </section>
        )}
      </div>

      {/* Next Steps */}
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
    </div>
  );
}
