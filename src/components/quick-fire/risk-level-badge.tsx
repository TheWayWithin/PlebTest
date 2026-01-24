'use client';

import { cn } from '@/lib/utils';

type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

interface RiskLevelBadgeProps {
  level: RiskLevel;
  className?: string;
}

const riskConfig: Record<RiskLevel, { label: string; className: string }> = {
  LOW: {
    label: 'Low Risk',
    className: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  },
  MEDIUM: {
    label: 'Medium Risk',
    className: 'bg-amber-100 text-amber-700 border-amber-200',
  },
  HIGH: {
    label: 'High Risk',
    className: 'bg-rose-100 text-rose-700 border-rose-200',
  },
};

export function RiskLevelBadge({ level, className }: RiskLevelBadgeProps) {
  const config = riskConfig[level];

  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
