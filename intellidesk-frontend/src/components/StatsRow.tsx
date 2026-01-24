// ============================================================================
// SEARCH: STATS_ROW
// IntelliDesk AI - Stats Row Component
// Displays key metrics at the top of the dashboard
// ============================================================================

'use client';

import React from 'react';
import {
  AlertTriangle,
  Inbox,
  TrendingUp,
  Activity,
  Zap,
  Clock
} from 'lucide-react';
import { DashboardStats } from '@/types';
import { getSentimentStyles, cn } from '@/lib/utils';

interface StatsRowProps {
  stats: DashboardStats;
  isLoading?: boolean;
}

/**
 * SEARCH: STAT_CARD
 * Individual stat card component
 */
interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  subtext?: string;
  variant?: 'default' | 'danger' | 'warning' | 'success';
  isLoading?: boolean;
}

function StatCard({ icon, label, value, subtext, variant = 'default', isLoading }: StatCardProps) {
  const variantStyles = {
    default: 'border-[hsl(var(--border))]',
    danger: 'border-[hsl(var(--urgent)/0.5)] bg-[hsl(var(--urgent)/0.05)]',
    warning: 'border-[hsl(var(--high)/0.5)] bg-[hsl(var(--high)/0.05)]',
    success: 'border-[hsl(var(--low)/0.5)] bg-[hsl(var(--low)/0.05)]',
  };

  const iconStyles = {
    default: 'text-[hsl(var(--primary))]',
    danger: 'text-[hsl(var(--urgent))]',
    warning: 'text-[hsl(var(--high))]',
    success: 'text-[hsl(var(--low))]',
  };

  const valueStyles = {
    default: 'text-[hsl(var(--foreground))]',
    danger: 'text-[hsl(var(--urgent))]',
    warning: 'text-[hsl(var(--high))]',
    success: 'text-[hsl(var(--low))]',
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg animate-shimmer shrink-0" />
        <div className="flex-1 space-y-2 min-w-0">
          <div className="h-3 sm:h-4 w-16 sm:w-20 rounded animate-shimmer" />
          <div className="h-6 sm:h-8 w-12 sm:w-16 rounded animate-shimmer" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg sm:rounded-xl border transition-all duration-300',
        'bg-[hsl(var(--card))] hover:bg-[hsl(var(--card-hover))]',
        'hover:border-[hsl(var(--border-hover))] hover:shadow-lg',
        variantStyles[variant],
        variant === 'danger' && typeof value === 'number' && value > 0 && 'animate-sla-pulse'
      )}
    >
      {/* Icon Container - responsive sizing */}
      <div
        className={cn(
          'flex items-center justify-center shrink-0',
          'w-10 h-10 sm:w-12 sm:h-12 rounded-lg',
          'bg-[hsl(var(--muted)/0.5)]',
          iconStyles[variant]
        )}
      >
        <span className="[&>svg]:w-5 [&>svg]:h-5 sm:[&>svg]:w-6 sm:[&>svg]:h-6">
          {icon}
        </span>
      </div>

      {/* Content - fluid typography */}
      <div className="flex flex-col min-w-0">
        <span className="text-fluid-xs sm:text-fluid-sm text-[hsl(var(--muted-foreground))] font-medium truncate">
          {label}
        </span>
        <span className={cn('text-fluid-xl sm:text-fluid-2xl font-bold', valueStyles[variant])}>
          {value}
        </span>
        {subtext && (
          <span className="text-fluid-xs text-[hsl(var(--muted-foreground))] truncate">
            {subtext}
          </span>
        )}
      </div>
    </div>
  );
}

/**
 * SEARCH: STATS_ROW_COMPONENT
 * Main stats row component displaying dashboard metrics
 */
export function StatsRow({ stats, isLoading = false }: StatsRowProps) {
  const sentimentStyles = getSentimentStyles(stats.avg_sentiment);

  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 animate-fade-in">
      {/* Critical SLA Breaches */}
      <StatCard
        icon={<AlertTriangle />}
        label="SLA Breaches"
        value={stats.critical_breaches}
        subtext={stats.critical_breaches > 0 ? 'Requires immediate action' : 'All on track'}
        variant={stats.critical_breaches > 0 ? 'danger' : 'default'}
        isLoading={isLoading}
      />

      {/* My Queue Count */}
      <StatCard
        icon={<Inbox />}
        label="My Queue"
        value={stats.my_queue_count}
        subtext="Tickets assigned"
        variant="default"
        isLoading={isLoading}
      />

      {/* Average Sentiment - custom card */}
      <div
        className={cn(
          'flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg sm:rounded-xl border transition-all duration-300',
          'bg-[hsl(var(--card))] hover:bg-[hsl(var(--card-hover))]',
          'border-[hsl(var(--border))] hover:border-[hsl(var(--border-hover))]',
          'hover:shadow-lg'
        )}
      >
        <div
          className={cn(
            'flex items-center justify-center shrink-0',
            'w-10 h-10 sm:w-12 sm:h-12 rounded-lg',
            sentimentStyles.bg
          )}
        >
          <span className="text-xl sm:text-2xl">{sentimentStyles.emoji}</span>
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-fluid-xs sm:text-fluid-sm text-[hsl(var(--muted-foreground))] font-medium truncate">
            Avg. Sentiment
          </span>
          <span className={cn('text-fluid-xl sm:text-fluid-2xl font-bold', sentimentStyles.text)}>
            {stats.avg_sentiment}
          </span>
          <span className="text-fluid-xs text-[hsl(var(--muted-foreground))] truncate">
            Customer mood
          </span>
        </div>
      </div>

      {/* Real-time Status */}
      <StatCard
        icon={<Activity />}
        label="System Status"
        value="Live"
        subtext="Auto-refresh: 30s"
        variant="success"
        isLoading={isLoading}
      />
    </div>
  );
}

export default StatsRow;
