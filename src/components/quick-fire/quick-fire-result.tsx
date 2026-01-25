'use client';

import { useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { RiskScoreGauge } from './risk-score-gauge';
import { RiskLevelBadge } from './risk-level-badge';
import { ArrowRight, RefreshCw, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { storeQuickFireData } from '@/lib/quick-fire-storage';

type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

interface QuickFireResultProps {
  riskScore: number;
  riskLevel: RiskLevel;
  keyObjection: string;
  onTestAnother: () => void;
  ideaText: string;
  className?: string;
}

export function QuickFireResult({
  riskScore,
  riskLevel,
  keyObjection,
  onTestAnother,
  ideaText,
  className,
}: QuickFireResultProps) {
  // Store Quick Fire data and redirect to signup
  const handleGoDeeper = useCallback(() => {
    storeQuickFireData({
      oneLiner: ideaText,
      score: riskScore,
      keyObjection: keyObjection,
    });
    // Navigate to signup page
    window.location.href = '/signup';
  }, [ideaText, riskScore, keyObjection]);

  return (
    <div className={cn('flex flex-col items-center', className)}>
      {/* Risk Score Gauge */}
      <div className="mb-6">
        <RiskScoreGauge score={riskScore} riskLevel={riskLevel} />
      </div>

      {/* Risk Level Badge */}
      <RiskLevelBadge level={riskLevel} className="mb-6" />

      {/* Key Objection Box */}
      <div className="w-full max-w-md bg-slate-50 border border-slate-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-slate-700 mb-1">Key Challenge</h4>
            <p className="text-slate-600 text-sm leading-relaxed">{keyObjection}</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
        <Button
          onClick={onTestAnother}
          variant="outline"
          className="flex-1 border-slate-300 hover:bg-slate-50"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Test Another
        </Button>
        <Button
          onClick={handleGoDeeper}
          className="flex-1 bg-indigo-600 hover:bg-indigo-700"
        >
          Go Deeper
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>

      {/* Teaser text */}
      <p className="text-xs text-slate-500 mt-4 text-center max-w-sm">
        Sign up for a full validation report with AI persona interviews and actionable next steps.
      </p>
    </div>
  );
}
