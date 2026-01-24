// ============================================================================
// SEARCH: CONFIDENCE_BADGE
// IntelliDesk AI - AI Confidence Badge Component
// Shows classification confidence with review indicator
// ============================================================================

'use client';

import React from 'react';
import { CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { getConfidenceStyles, cn } from '@/lib/utils';

interface ConfidenceBadgeProps {
  confidence: number;
  category: string;
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  compact?: boolean;
}

/**
 * SEARCH: CONFIDENCE_BADGE_COMPONENT
 * Displays AI classification with confidence indicator
 * - Green for >80% (auto-classified)
 * - Amber for <80% (needs review)
 */
export function ConfidenceBadge({ 
  confidence, 
  category, 
  onClick,
  compact = false 
}: ConfidenceBadgeProps) {
  const styles = getConfidenceStyles(confidence);

  if (compact) {
    return (
      <button
        onClick={onClick}
        className={cn(
          'inline-flex items-center gap-1.5 px-2 py-1 rounded-md border',
          'transition-all duration-200 hover:shadow-md',
          styles.bg,
          styles.border,
          onClick && 'cursor-pointer hover:opacity-80'
        )}
      >
        <Sparkles className={cn('w-3 h-3', styles.text)} />
        <span className={cn('text-xs font-medium', styles.text)}>
          {category}
        </span>
        <span className={cn('text-xs font-bold', styles.text)}>
          {confidence}%
        </span>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-2 px-3 py-2 rounded-lg border',
        'transition-all duration-200 hover:shadow-md',
        styles.bg,
        styles.border,
        onClick && 'cursor-pointer hover:opacity-80'
      )}
    >
      <div className="flex items-center gap-1.5">
        <Sparkles className={cn('w-4 h-4', styles.text)} />
        <span className={cn('text-sm font-medium', styles.text)}>
          {category}
        </span>
      </div>
      
      <div className="flex items-center gap-1">
        {confidence >= 80 ? (
          <CheckCircle2 className={cn('w-4 h-4', styles.text)} />
        ) : (
          <AlertCircle className={cn('w-4 h-4', styles.text)} />
        )}
        <span className={cn('text-sm font-bold', styles.text)}>
          {confidence}%
        </span>
      </div>
    </button>
  );
}

export default ConfidenceBadge;
