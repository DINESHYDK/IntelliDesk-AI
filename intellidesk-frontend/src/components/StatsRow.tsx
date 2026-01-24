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
      <div className="flex items-center gap-4 p-4 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
        <div className="w-12 h-12 rounded-lg animate-shimmer" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-20 rounded animate-shimmer" />
          <div className="h-8 w-16 rounded animate-shimmer" />
        </div>
      </div>
    );
  }

  return (
    <div 
      className={cn(
        'flex items-center gap-4 p-4 rounded-xl border transition-all duration-300',
        'bg-[hsl(var(--card))] hover:bg-[hsl(var(--card-hover))]',
        'hover:border-[hsl(var(--border-hover))] hover:shadow-lg',
        variantStyles[variant],
        variant === 'danger' && typeof value === 'number' && value > 0 && 'animate-sla-pulse'
      )}
    >
      {/* Icon Container */}
      <div 
        className={cn(
          'flex items-center justify-center w-12 h-12 rounded-lg',
          'bg-[hsl(var(--muted)/0.5)]',
          iconStyles[variant]
        )}
      >
        {icon}
      </div>

      {/* Content */}
      <div className="flex flex-col">
        <span className="text-sm text-[hsl(var(--muted-foreground))] font-medium">
          {label}
        </span>
        <span className={cn('text-2xl font-bold', valueStyles[variant])}>
          {value}
        </span>
        {subtext && (
          <span className="text-xs text-[hsl(var(--muted-foreground))]">
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
      {/* Critical SLA Breaches */}
      <StatCard
        icon={<AlertTriangle className="w-6 h-6" />}
        label="SLA Breaches"
        value={stats.critical_breaches}
        subtext={stats.critical_breaches > 0 ? 'Requires immediate action' : 'All on track'}
        variant={stats.critical_breaches > 0 ? 'danger' : 'default'}
        isLoading={isLoading}
      />

      {/* My Queue Count */}
      <StatCard
        icon={<Inbox className="w-6 h-6" />}
        label="My Queue"
        value={stats.my_queue_count}
        subtext="Tickets assigned"
        variant="default"
        isLoading={isLoading}
      />

      {/* Average Sentiment */}
      <div 
        className={cn(
          'flex items-center gap-4 p-4 rounded-xl border transition-all duration-300',
          'bg-[hsl(var(--card))] hover:bg-[hsl(var(--card-hover))]',
          'border-[hsl(var(--border))] hover:border-[hsl(var(--border-hover))]',
          'hover:shadow-lg'
        )}
      >
        <div 
          className={cn(
            'flex items-center justify-center w-12 h-12 rounded-lg',
            sentimentStyles.bg
          )}
        >
          <span className="text-2xl">{sentimentStyles.emoji}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm text-[hsl(var(--muted-foreground))] font-medium">
            Avg. Sentiment
          </span>
          <span className={cn('text-2xl font-bold', sentimentStyles.text)}>
            {stats.avg_sentiment}
          </span>
          <span className="text-xs text-[hsl(var(--muted-foreground))]">
            Customer mood
          </span>
        </div>
      </div>

      {/* Real-time Status */}
      <StatCard
        icon={<Activity className="w-6 h-6" />}
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
