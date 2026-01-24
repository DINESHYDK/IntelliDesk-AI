// ============================================================================
// SEARCH: SLA_TIMER
// IntelliDesk AI - SLA Timer Component
// Real-time countdown with visual urgency indicators
// ============================================================================

'use client';

import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';
import { calculateSLAStatus, cn } from '@/lib/utils';

interface SLATimerProps {
  deadline: string;
  priority: 'P1' | 'P2' | 'P3' | 'P4';
  compact?: boolean;
}

/**
 * SEARCH: SLA_TIMER_COMPONENT
 * Real-time SLA countdown timer
 * - Updates every second
 * - Pulses red when < 1 hour remaining
 * - Shows breach status when exceeded
 */
export function SLATimer({ deadline, priority, compact = false }: SLATimerProps) {
  const [slaStatus, setSlaStatus] = useState(() => calculateSLAStatus(deadline));

  // SEARCH: SLA_COUNTDOWN
  // Update countdown every second
  useEffect(() => {
    const interval = setInterval(() => {
      setSlaStatus(calculateSLAStatus(deadline));
    }, 1000);

    return () => clearInterval(interval);
  }, [deadline]);

  const { isBreached, isCritical, isWarning, displayText, minutesRemaining } = slaStatus;

  // Determine styling based on status
  const getStyles = () => {
    if (isBreached) {
      return {
        container: 'bg-[hsl(var(--urgent)/0.15)] border-[hsl(var(--urgent)/0.5)] animate-sla-pulse',
        text: 'text-[hsl(var(--urgent))]',
        icon: 'text-[hsl(var(--urgent))]',
      };
    }
    if (isCritical) {
      return {
        container: 'bg-[hsl(var(--urgent)/0.1)] border-[hsl(var(--urgent)/0.3)] animate-sla-pulse',
        text: 'text-[hsl(var(--urgent))]',
        icon: 'text-[hsl(var(--urgent))]',
      };
    }
    if (isWarning) {
      return {
        container: 'bg-[hsl(var(--high)/0.1)] border-[hsl(var(--high)/0.3)]',
        text: 'text-[hsl(var(--high))]',
        icon: 'text-[hsl(var(--high))]',
      };
    }
    // Normal state
    return {
      container: 'bg-[hsl(var(--muted)/0.3)] border-[hsl(var(--border))]',
      text: 'text-[hsl(var(--muted-foreground))]',
      icon: 'text-[hsl(var(--muted-foreground))]',
    };
  };

  const styles = getStyles();

  if (compact) {
    return (
      <div 
        className={cn(
          'inline-flex items-center gap-1.5 px-2 py-1 rounded-md border text-xs font-medium',
          styles.container
        )}
      >
        {isBreached || isCritical ? (
          <AlertTriangle className={cn('w-3 h-3', styles.icon)} />
        ) : (
          <Clock className={cn('w-3 h-3', styles.icon)} />
        )}
        <span className={styles.text}>
          {isBreached ? 'BREACHED' : displayText.replace(' remaining', '')}
        </span>
      </div>
    );
  }

  return (
    <div 
      className={cn(
        'flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-300',
        styles.container
      )}
    >
      {/* Icon */}
      {isBreached || isCritical ? (
        <AlertTriangle className={cn('w-4 h-4', styles.icon)} />
      ) : (
        <Clock className={cn('w-4 h-4', styles.icon)} />
      )}

      {/* Timer Display */}
      <div className="flex flex-col">
        <span className={cn('text-sm font-semibold', styles.text)}>
          {displayText}
        </span>
        {(isBreached || isCritical) && (
          <span className="text-xs text-[hsl(var(--urgent))] font-medium">
            {isBreached ? 'SLA Breached!' : 'Urgent - SLA Critical'}
          </span>
        )}
      </div>
    </div>
  );
}

export default SLATimer;
