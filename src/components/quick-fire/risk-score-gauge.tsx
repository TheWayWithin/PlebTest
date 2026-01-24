'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

interface RiskScoreGaugeProps {
  score: number;
  riskLevel: RiskLevel;
  animated?: boolean;
  className?: string;
}

const riskColors: Record<RiskLevel, { stroke: string; text: string }> = {
  LOW: {
    stroke: '#10b981', // emerald-500
    text: 'text-emerald-600',
  },
  MEDIUM: {
    stroke: '#f59e0b', // amber-500
    text: 'text-amber-600',
  },
  HIGH: {
    stroke: '#e11d48', // rose-600
    text: 'text-rose-600',
  },
};

export function RiskScoreGauge({
  score,
  riskLevel,
  animated = true,
  className,
}: RiskScoreGaugeProps) {
  const [displayScore, setDisplayScore] = useState(animated ? 0 : score);
  const [strokeOffset, setStrokeOffset] = useState(animated ? 251.2 : 251.2 - (score / 100) * 251.2);

  // SVG arc calculations
  const radius = 80;
  const circumference = Math.PI * radius; // Semi-circle = half circumference
  const strokeWidth = 12;

  useEffect(() => {
    if (!animated) return;

    // Animate score number
    const duration = 1500;
    const steps = 60;
    const increment = score / steps;
    let current = 0;

    const scoreInterval = setInterval(() => {
      current += increment;
      if (current >= score) {
        setDisplayScore(score);
        clearInterval(scoreInterval);
      } else {
        setDisplayScore(Math.round(current));
      }
    }, duration / steps);

    // Animate stroke
    const targetOffset = circumference - (score / 100) * circumference;
    const offsetStep = (circumference - targetOffset) / steps;
    let currentOffset = circumference;

    const strokeInterval = setInterval(() => {
      currentOffset -= offsetStep;
      if (currentOffset <= targetOffset) {
        setStrokeOffset(targetOffset);
        clearInterval(strokeInterval);
      } else {
        setStrokeOffset(currentOffset);
      }
    }, duration / steps);

    return () => {
      clearInterval(scoreInterval);
      clearInterval(strokeInterval);
    };
  }, [score, animated, circumference]);

  const colors = riskColors[riskLevel];

  return (
    <div className={cn('relative inline-flex flex-col items-center', className)}>
      <svg
        width="200"
        height="120"
        viewBox="0 0 200 120"
        className="overflow-visible"
      >
        {/* Background arc */}
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-slate-200"
          strokeLinecap="round"
        />
        {/* Foreground arc (animated) */}
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke={colors.stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeOffset}
          style={{
            transition: animated ? 'none' : 'stroke-dashoffset 1.5s ease-out',
          }}
        />
      </svg>
      {/* Score display */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center">
        <span
          className={cn('text-5xl font-bold tabular-nums', colors.text)}
        >
          {displayScore}
        </span>
        <span className="text-slate-400 text-lg">/100</span>
      </div>
    </div>
  );
}
