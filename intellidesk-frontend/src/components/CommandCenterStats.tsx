// ============================================================================
// SEARCH: COMMAND_CENTER_STATS
// IntelliDesk AI - Command Center Stats Row
// High-density AI Intelligence & Ticket Distribution Summary
// ============================================================================

'use client';

import React, { useMemo } from 'react';
import { 
  AlertTriangle, 
  Activity,
  Sparkles,
  Clock,
  CheckCircle2,
  Loader2,
  Crown,
  Medal,
  Award
} from 'lucide-react';
import { Ticket } from '@/types';
import { calculateSLAStatus, cn } from '@/lib/utils';

interface CommandCenterStatsProps {
  tickets: Ticket[];
  isLoading?: boolean;
}

// Mini progress bar component
function MiniProgress({ value, max, color }: { value: number; max: number; color: string }) {
  const percentage = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
      <div 
        className={cn('h-full rounded-full transition-all duration-500', color)}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}

// Animated pulse dot
function PulseDot({ color }: { color: string }) {
  return (
    <span className="relative flex h-2 w-2">
      <span className={cn(
        'animate-ping absolute inline-flex h-full w-full rounded-full opacity-75',
        color
      )}></span>
      <span className={cn('relative inline-flex rounded-full h-2 w-2', color)}></span>
    </span>
  );
}

export function CommandCenterStats({ tickets, isLoading = false }: CommandCenterStatsProps) {
  // Calculate all metrics
  const metrics = useMemo(() => {
    // Priority counts
    const priorityCounts = { P1: 0, P2: 0, P3: 0, P4: 0 };
    // Tier counts
    const tierCounts = { Gold: 0, Silver: 0, Bronze: 0 };
    // Status counts
    const statusCounts = { pending: 0, resolved: 0 };
    // SLA metrics
    const slaMetrics = { nearBreach: 0, breached: 0 };
    // AI confidence
    let totalConfidence = 0;

    tickets.forEach(ticket => {
      // Priority
      priorityCounts[ticket.priority]++;
      
      // Tier
      tierCounts[ticket.customer_tier]++;
      
      // Status
      if (ticket.status === 'Resolved') {
        statusCounts.resolved++;
      } else {
        statusCounts.pending++;
      }
      
      // SLA
      const slaStatus = calculateSLAStatus(ticket.sla_deadline);
      if (slaStatus.isBreached) {
        slaMetrics.breached++;
      } else if (slaStatus.isCritical) {
        slaMetrics.nearBreach++;
      }
      
      // AI Confidence
      totalConfidence += ticket.ai_analysis.confidence;
    });

    const avgConfidence = tickets.length > 0 ? Math.round(totalConfidence / tickets.length) : 0;
    const totalTickets = tickets.length;

    return {
      priorityCounts,
      tierCounts,
      statusCounts,
      slaMetrics,
      avgConfidence,
      totalTickets
    };
  }, [tickets]);

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-28 rounded-xl bg-card border border-border animate-shimmer" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 animate-fade-in">
      
      {/* 1. Priority Pulse Card */}
      <div className="col-span-1 p-4 rounded-xl bg-card border border-border backdrop-blur-sm hover:border-ring transition-all">
        <div className="flex items-center gap-2 mb-3">
          <Activity className="w-4 h-4 text-primary" />
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Priority Pulse</span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {/* P1 */}
          <div className="text-center">
            <div className="w-full aspect-square rounded-lg bg-urgent/20 border border-urgent/40 flex items-center justify-center mb-1">
              <span className="text-lg font-bold text-urgent">{metrics.priorityCounts.P1}</span>
            </div>
            <span className="text-[10px] font-medium text-urgent">P1</span>
          </div>
          {/* P2 */}
          <div className="text-center">
            <div className="w-full aspect-square rounded-lg bg-high/20 border border-high/40 flex items-center justify-center mb-1">
              <span className="text-lg font-bold text-high">{metrics.priorityCounts.P2}</span>
            </div>
            <span className="text-[10px] font-medium text-high">P2</span>
          </div>
          {/* P3 */}
          <div className="text-center">
            <div className="w-full aspect-square rounded-lg bg-medium/20 border border-medium/40 flex items-center justify-center mb-1">
              <span className="text-lg font-bold text-medium">{metrics.priorityCounts.P3}</span>
            </div>
            <span className="text-[10px] font-medium text-medium">P3</span>
          </div>
          {/* P4 */}
          <div className="text-center">
            <div className="w-full aspect-square rounded-lg bg-low/20 border border-low/40 flex items-center justify-center mb-1">
              <span className="text-lg font-bold text-low">{metrics.priorityCounts.P4}</span>
            </div>
            <span className="text-[10px] font-medium text-low">P4</span>
          </div>
        </div>
      </div>

      {/* 2. Customer Tier Mix Card */}
      <div className="col-span-1 p-4 rounded-xl bg-card border border-border backdrop-blur-sm hover:border-ring transition-all">
        <div className="flex items-center gap-2 mb-3">
          <Crown className="w-4 h-4 text-tier-gold" />
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Customer Mix</span>
        </div>
        <div className="space-y-2.5">
          {/* Gold */}
          <div className="flex items-center gap-2">
            <span className="w-12 text-xs font-medium text-tier-gold flex items-center gap-1">
              <Crown className="w-3 h-3" /> Gold
            </span>
            <div className="flex-1">
              <MiniProgress value={metrics.tierCounts.Gold} max={metrics.totalTickets} color="bg-tier-gold" />
            </div>
            <span className="w-6 text-xs font-bold text-tier-gold text-right">{metrics.tierCounts.Gold}</span>
          </div>
          {/* Silver */}
          <div className="flex items-center gap-2">
            <span className="w-12 text-xs font-medium text-tier-silver flex items-center gap-1">
              <Medal className="w-3 h-3" /> Silver
            </span>
            <div className="flex-1">
              <MiniProgress value={metrics.tierCounts.Silver} max={metrics.totalTickets} color="bg-tier-silver" />
            </div>
            <span className="w-6 text-xs font-bold text-tier-silver text-right">{metrics.tierCounts.Silver}</span>
          </div>
          {/* Bronze */}
          <div className="flex items-center gap-2">
            <span className="w-12 text-xs font-medium text-tier-bronze flex items-center gap-1">
              <Award className="w-3 h-3" /> Bronze
            </span>
            <div className="flex-1">
              <MiniProgress value={metrics.tierCounts.Bronze} max={metrics.totalTickets} color="bg-tier-bronze" />
            </div>
            <span className="w-6 text-xs font-bold text-tier-bronze text-right">{metrics.tierCounts.Bronze}</span>
          </div>
        </div>
      </div>

      {/* 3. Resolution Progress Card */}
      <div className="col-span-1 p-4 rounded-xl bg-card border border-border backdrop-blur-sm hover:border-ring transition-all">
        <div className="flex items-center gap-2 mb-3">
          <CheckCircle2 className="w-4 h-4 text-success" />
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Resolution</span>
        </div>
        <div className="flex items-center justify-between mb-3">
          {/* Pending */}
          <div className="text-center">
            <div className="flex items-center gap-1.5 text-warning mb-1">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-2xl font-bold">{metrics.statusCounts.pending}</span>
            </div>
            <span className="text-[10px] text-muted-foreground uppercase">Pending</span>
          </div>
          {/* Divider */}
          <div className="h-10 w-px bg-border" />
          {/* Resolved */}
          <div className="text-center">
            <div className="flex items-center gap-1.5 text-success mb-1">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-2xl font-bold">{metrics.statusCounts.resolved}</span>
            </div>
            <span className="text-[10px] text-muted-foreground uppercase">Resolved</span>
          </div>
        </div>
        {/* Progress bar */}
        <div className="h-2 w-full bg-muted rounded-full overflow-hidden flex">
          <div 
            className="h-full bg-warning transition-all duration-500"
            style={{ width: `${metrics.totalTickets > 0 ? (metrics.statusCounts.pending / metrics.totalTickets) * 100 : 0}%` }}
          />
          <div 
            className="h-full bg-success transition-all duration-500"
            style={{ width: `${metrics.totalTickets > 0 ? (metrics.statusCounts.resolved / metrics.totalTickets) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* 4. AI Accuracy Card */}
      <div className="col-span-1 p-4 rounded-xl bg-card border border-border backdrop-blur-sm hover:border-ring transition-all">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-accent" />
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">AI Accuracy</span>
        </div>
        <div className="flex items-center gap-3">
          {/* Circular progress */}
          <div className="relative">
            <svg className="w-14 h-14 -rotate-90">
              <circle
                cx="28"
                cy="28"
                r="24"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                className="text-muted"
              />
              <circle
                cx="28"
                cy="28"
                r="24"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                strokeDasharray={`${metrics.avgConfidence * 1.5} 150`}
                className={cn(
                  'transition-all duration-1000',
                  metrics.avgConfidence >= 80 ? 'text-confidence-high' : 'text-confidence-low'
                )}
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-foreground">
              {metrics.avgConfidence}%
            </span>
          </div>
          <div>
            <p className={cn(
              'text-sm font-semibold',
              metrics.avgConfidence >= 80 ? 'text-confidence-high' : 'text-confidence-low'
            )}>
              {metrics.avgConfidence >= 90 ? 'Excellent' : metrics.avgConfidence >= 80 ? 'Good' : 'Needs Review'}
            </p>
            <p className="text-[10px] text-muted-foreground">Avg. Classification</p>
          </div>
        </div>
      </div>

      {/* 5. SLA Alert Zone Card */}
      <div className={cn(
        'col-span-2 md:col-span-1 p-4 rounded-xl backdrop-blur-sm transition-all',
        metrics.slaMetrics.breached > 0 
          ? 'bg-destructive/10 border border-destructive/40 hover:border-destructive' 
          : 'bg-card border border-border hover:border-ring'
      )}>
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-4 h-4 text-destructive" />
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">SLA Alert Zone</span>
          {metrics.slaMetrics.breached > 0 && <PulseDot color="bg-destructive" />}
        </div>
        <div className="grid grid-cols-2 gap-3">
          {/* Near Breach */}
          <div className="p-2 rounded-lg bg-high/10 border border-high/30">
            <div className="flex items-center gap-1 mb-1">
              <AlertTriangle className="w-3 h-3 text-high" />
              <span className="text-[10px] text-high font-medium">NEAR BREACH</span>
            </div>
            <span className="text-xl font-bold text-high">{metrics.slaMetrics.nearBreach}</span>
            <span className="text-[10px] text-high/70 ml-1">&lt;1h left</span>
          </div>
          {/* Breached */}
          <div className="p-2 rounded-lg bg-destructive/10 border border-destructive/30">
            <div className="flex items-center gap-1 mb-1">
              <AlertTriangle className="w-3 h-3 text-destructive animate-pulse" />
              <span className="text-[10px] text-destructive font-medium">BREACHED</span>
            </div>
            <span className="text-xl font-bold text-destructive">{metrics.slaMetrics.breached}</span>
            <span className="text-[10px] text-destructive/70 ml-1">overdue</span>
          </div>
        </div>
      </div>

    </div>
  );
}

export default CommandCenterStats;
