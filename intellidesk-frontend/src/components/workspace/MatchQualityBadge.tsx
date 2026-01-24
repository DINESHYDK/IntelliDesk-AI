// ============================================================================
// SEARCH: MATCH_QUALITY_BADGE
// IntelliDesk AI - Match Quality Badge Component
// Dynamic status based on confidence: Perfect (>90%), Partial (60-90%), Review (<60%)
// ============================================================================

'use client';

import React from 'react';
import { CheckCircle2, AlertCircle, HelpCircle, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MatchQualityBadgeProps {
  confidence: number;
  size?: 'sm' | 'md' | 'lg';
}

type MatchLevel = 'perfect' | 'partial' | 'review';

const getMatchLevel = (confidence: number): MatchLevel => {
  if (confidence >= 90) return 'perfect';
  if (confidence >= 60) return 'partial';
  return 'review';
};

const matchConfig: Record<MatchLevel, {
  label: string;
  description: string;
  icon: React.ReactNode;
  bg: string;
  text: string;
  border: string;
  glow: string;
}> = {
  perfect: {
    label: 'Perfect Match',
    description: 'High confidence auto-response ready',
    icon: <CheckCircle2 className="w-5 h-5" />,
    bg: 'bg-emerald-500/15',
    text: 'text-emerald-400',
    border: 'border-emerald-500/40',
    glow: 'shadow-emerald-500/20',
  },
  partial: {
    label: 'Partial Match',
    description: 'Review suggested before sending',
    icon: <AlertCircle className="w-5 h-5" />,
    bg: 'bg-amber-500/15',
    text: 'text-amber-400',
    border: 'border-amber-500/40',
    glow: 'shadow-amber-500/20',
  },
  review: {
    label: 'Needs Review',
    description: 'Human review required',
    icon: <HelpCircle className="w-5 h-5" />,
    bg: 'bg-slate-500/15',
    text: 'text-slate-400',
    border: 'border-slate-500/40',
    glow: 'shadow-slate-500/20',
  },
};

export function MatchQualityBadge({ confidence, size = 'md' }: MatchQualityBadgeProps) {
  const level = getMatchLevel(confidence);
  const config = matchConfig[level];

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs gap-1.5',
    md: 'px-3 py-2 text-sm gap-2',
    lg: 'px-4 py-3 text-base gap-3',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-lg border',
        'transition-all duration-300 shadow-lg',
        config.bg,
        config.border,
        config.glow,
        sizeClasses[size]
      )}
    >
      <span className={config.text}>{config.icon}</span>
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className={cn('font-semibold', config.text)}>{config.label}</span>
          <span className={cn('font-bold', config.text)}>{confidence}%</span>
        </div>
        {size !== 'sm' && (
          <span className="text-xs text-slate-400">{config.description}</span>
        )}
      </div>
    </div>
  );
}

export default MatchQualityBadge;
