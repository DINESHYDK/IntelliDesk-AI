// ============================================================================
// SEARCH: PRIORITY_BADGE
// IntelliDesk AI - Priority Badge Component
// Visual indicator for ticket priority levels
// ============================================================================

'use client';

import React from 'react';
import { 
  AlertOctagon, 
  AlertTriangle, 
  AlertCircle, 
  Info 
} from 'lucide-react';
import { Priority } from '@/types';
import { getPriorityStyles, getPriorityLabel, cn } from '@/lib/utils';

interface PriorityBadgeProps {
  priority: Priority;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  animate?: boolean;
}

/**
 * SEARCH: PRIORITY_BADGE_COMPONENT
 * Displays priority level with appropriate icon and colors
 */
export function PriorityBadge({ 
  priority, 
  showLabel = true, 
  size = 'md',
  animate = true 
}: PriorityBadgeProps) {
  const styles = getPriorityStyles(priority);
  const label = getPriorityLabel(priority);

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const containerSizes = {
    sm: 'px-1.5 py-0.5 text-xs',
    md: 'px-2 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  };

  const icons = {
    P1: <AlertOctagon className={iconSizes[size]} />,
    P2: <AlertTriangle className={iconSizes[size]} />,
    P3: <AlertCircle className={iconSizes[size]} />,
    P4: <Info className={iconSizes[size]} />,
  };

  return (
    <div 
      className={cn(
        'inline-flex items-center gap-1 rounded-md border font-semibold',
        styles.bg,
        styles.text,
        styles.border,
        containerSizes[size],
        animate && priority === 'P1' && 'animate-sla-pulse'
      )}
    >
      {icons[priority]}
      {showLabel && (
        <span>{priority} - {label}</span>
      )}
      {!showLabel && (
        <span>{priority}</span>
      )}
    </div>
  );
}

export default PriorityBadge;
