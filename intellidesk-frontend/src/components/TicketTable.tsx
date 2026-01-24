// ============================================================================
// SEARCH: TICKET_TABLE
// IntelliDesk AI - Ticket Table Component (Command Center)
// Main ticket listing with all columns and interactive features
// ============================================================================

'use client';

import React, { useState, useMemo } from 'react';
import {
  Mail,
  GitMerge,
  ChevronDown,
  ChevronUp,
  Sparkles,
  User,
  ExternalLink,
  Filter,
  Search,
  SortAsc,
  SortDesc
} from 'lucide-react';
import { Ticket, Priority } from '@/types';
import {
  formatTimestamp,
  extractEmailDomain,
  getInitials,
  getStatusStyles,
  calculateSLAStatus,
  cn
} from '@/lib/utils';
import { PriorityBadge } from './PriorityBadge';
import { TierBadge } from './TierBadge';
import { ConfidenceBadge } from './ConfidenceBadge';
import { SLATimer } from './SLATimer';
import { AIReasoningOverlay } from './AIReasoningOverlay';
import { ThreadVisualizer } from './ThreadVisualizer';

interface TicketTableProps {
  tickets: Ticket[];
  isLoading?: boolean;
}

type SortField = 'priority' | 'sla' | 'timestamp' | 'customer_tier';
type SortDirection = 'asc' | 'desc';

/**
 * SEARCH: TICKET_TABLE_COMPONENT
 * The Command Center - main ticket listing with all features
 * 
 * Columns:
 * - Priority (Icon)
 * - Subject (with Thread Badge)
 * - Classification (Pill with Confidence)
 * - Customer (Tier Badge)
 * - SLA Timer (Countdown)
 * - Actions
 */
export function TicketTable({ tickets, isLoading = false }: TicketTableProps) {
  // State for expanded ticket details
  const [expandedTicketId, setExpandedTicketId] = useState<string | null>(null);

  // State for AI reasoning overlay
  const [aiOverlayTicket, setAiOverlayTicket] = useState<Ticket | null>(null);

  // Sorting state
  const [sortField, setSortField] = useState<SortField>('sla');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Filter state
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // SEARCH: SORT_LOGIC
  // Sort and filter tickets
  const processedTickets = useMemo(() => {
    let result = [...tickets];

    // Apply priority filter
    if (priorityFilter !== 'all') {
      result = result.filter(t => t.priority === priorityFilter);
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(t =>
        t.subject.toLowerCase().includes(query) ||
        t.sender.toLowerCase().includes(query) ||
        t.id.toLowerCase().includes(query) ||
        t.ai_analysis.category.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case 'priority':
          const priorityOrder = { P1: 1, P2: 2, P3: 3, P4: 4 };
          comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
          break;
        case 'sla':
          const slaA = calculateSLAStatus(a.sla_deadline).minutesRemaining;
          const slaB = calculateSLAStatus(b.sla_deadline).minutesRemaining;
          comparison = slaA - slaB;
          break;
        case 'timestamp':
          comparison = new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
          break;
        case 'customer_tier':
          const tierOrder = { Gold: 1, Silver: 2, Bronze: 3 };
          comparison = tierOrder[a.customer_tier] - tierOrder[b.customer_tier];
          break;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [tickets, sortField, sortDirection, priorityFilter, searchQuery]);

  // Toggle sort
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Toggle ticket expansion
  const toggleExpand = (ticketId: string) => {
    setExpandedTicketId(prev => prev === ticketId ? null : ticketId);
  };

  // SEARCH: LOADING_SKELETON
  if (isLoading) {
    return (
      <div className="space-y-2 sm:space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="h-16 sm:h-20 rounded-lg sm:rounded-xl bg-[hsl(var(--card))] border border-[hsl(var(--border))] animate-shimmer"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4 animate-fade-in">
      {/* SEARCH: TABLE_CONTROLS */}
      {/* Filters & Search Bar - mobile-first stack layout */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search - full width on mobile */}
        <div className="relative flex-1 w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--muted-foreground))]" />
          <input
            type="text"
            placeholder="Search tickets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={cn(
              'w-full pl-10 pr-4 py-2 sm:py-2.5 rounded-lg border text-fluid-sm',
              'bg-[hsl(var(--card))] border-[hsl(var(--border))]',
              'text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))]',
              'focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary)/0.5)]',
              'transition-all duration-200'
            )}
          />
        </div>

        {/* Priority Filter - horizontal scroll on mobile */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-hide">
          <Filter className="w-4 h-4 text-[hsl(var(--muted-foreground))] shrink-0" />
          <div className="flex gap-1 shrink-0">
            {(['all', 'P1', 'P2', 'P3', 'P4'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPriorityFilter(p)}
                className={cn(
                  'px-2.5 sm:px-3 py-1.5 rounded-lg text-fluid-xs font-medium transition-all touch-target',
                  'whitespace-nowrap',
                  priorityFilter === p
                    ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]'
                    : 'bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted)/0.8)] active:bg-[hsl(var(--muted)/0.7)]'
                )}
              >
                {p === 'all' ? 'All' : p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* SEARCH: TABLE_HEADER */}
      {/* Column Headers - hidden on mobile, visible on large screens */}
      <div className="hidden xl:grid xl:grid-cols-12 gap-4 px-4 py-2 text-fluid-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider">
        <div
          className="col-span-1 flex items-center gap-1 cursor-pointer hover:text-[hsl(var(--foreground))] transition-colors"
          onClick={() => handleSort('priority')}
        >
          Priority
          {sortField === 'priority' && (sortDirection === 'asc' ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />)}
        </div>
        <div className="col-span-4">Subject</div>
        <div className="col-span-2">Classification</div>
        <div
          className="col-span-2 flex items-center gap-1 cursor-pointer hover:text-[hsl(var(--foreground))] transition-colors"
          onClick={() => handleSort('customer_tier')}
        >
          Customer
          {sortField === 'customer_tier' && (sortDirection === 'asc' ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />)}
        </div>
        <div
          className="col-span-2 flex items-center gap-1 cursor-pointer hover:text-[hsl(var(--foreground))] transition-colors"
          onClick={() => handleSort('sla')}
        >
          SLA Timer
          {sortField === 'sla' && (sortDirection === 'asc' ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />)}
        </div>
        <div className="col-span-1">Actions</div>
      </div>

      {/* SEARCH: TICKET_ROWS */}
      {/* Ticket Rows - responsive card/list layout */}
      <div className="space-y-2">
        {processedTickets.length === 0 ? (
          <div className="text-center py-8 sm:py-12 text-[hsl(var(--muted-foreground))]">
            <Mail className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 opacity-50" />
            <p className="text-fluid-lg font-medium">No tickets found</p>
            <p className="text-fluid-sm">Try adjusting your filters</p>
          </div>
        ) : (
          processedTickets.map((ticket) => {
            const isExpanded = expandedTicketId === ticket.id;
            const statusStyles = getStatusStyles(ticket.status);
            const slaStatus = calculateSLAStatus(ticket.sla_deadline);

            return (
              <div
                key={ticket.id}
                className={cn(
                  'rounded-lg sm:rounded-xl border transition-all duration-200',
                  'bg-[hsl(var(--card))] hover:bg-[hsl(var(--card-hover))]',
                  'border-[hsl(var(--border))] hover:border-[hsl(var(--border-hover))]',
                  slaStatus.isBreached && 'border-[hsl(var(--urgent)/0.5)] animate-critical-glow',
                  slaStatus.isCritical && 'border-[hsl(var(--urgent)/0.3)]'
                )}
              >
                {/* Main Row - Mobile: Card layout, Desktop: Grid layout */}
                <div
                  className="p-3 sm:p-4 cursor-pointer"
                  onClick={() => toggleExpand(ticket.id)}
                >
                  {/* Mobile Layout (< xl) */}
                  <div className="xl:hidden space-y-3">
                    {/* Top row: Priority + Subject + Actions */}
                    <div className="flex items-start gap-2 sm:gap-3">
                      <div className="shrink-0">
                        <PriorityBadge priority={ticket.priority} showLabel={false} size="sm" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <h3 className="text-fluid-sm font-semibold text-[hsl(var(--foreground))] line-clamp-2">
                              {ticket.subject}
                            </h3>
                            <div className="flex items-center gap-2 mt-1 text-fluid-xs text-[hsl(var(--muted-foreground))]">
                              <span className="truncate">{ticket.sender}</span>
                              <span>•</span>
                              <span className="whitespace-nowrap">{formatTimestamp(ticket.timestamp)}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setAiOverlayTicket(ticket);
                              }}
                              className={cn(
                                'p-1.5 rounded-lg transition-colors touch-target',
                                'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--primary))]',
                                'hover:bg-[hsl(var(--primary)/0.1)] active:bg-[hsl(var(--primary)/0.15)]'
                              )}
                              title="View AI Analysis"
                            >
                              <Sparkles className="w-4 h-4" />
                            </button>
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4 text-[hsl(var(--muted-foreground))]" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-[hsl(var(--muted-foreground))]" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom row: Classification, Customer, SLA */}
                    <div className="flex flex-wrap items-center gap-2">
                      <ConfidenceBadge
                        confidence={ticket.ai_analysis.confidence}
                        category={ticket.ai_analysis.category}
                        onClick={(e) => {
                          e?.stopPropagation?.();
                          setAiOverlayTicket(ticket);
                        }}
                        compact
                      />
                      <TierBadge tier={ticket.customer_tier} size="sm" />
                      <SLATimer
                        deadline={ticket.sla_deadline}
                        priority={ticket.priority}
                        compact
                      />
                      {ticket.thread_count > 1 && (
                        <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-[hsl(var(--primary)/0.15)] text-[hsl(var(--primary))] text-fluid-xs">
                          <GitMerge className="w-3 h-3" />
                          {ticket.thread_count}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Desktop Layout (xl+) - Grid */}
                  <div className="hidden xl:grid xl:grid-cols-12 gap-4 items-center">
                    {/* Priority */}
                    <div className="col-span-1">
                      <PriorityBadge priority={ticket.priority} showLabel={false} />
                    </div>

                    {/* Subject & Sender */}
                    <div className="col-span-4 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-fluid-sm font-semibold text-[hsl(var(--foreground))] truncate">
                          {ticket.subject}
                        </h3>
                        {ticket.thread_count > 1 && (
                          <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-[hsl(var(--primary)/0.15)] text-[hsl(var(--primary))] text-fluid-xs shrink-0">
                            <GitMerge className="w-3 h-3" />
                            {ticket.thread_count}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-fluid-xs text-[hsl(var(--muted-foreground))]">
                        <span className="flex items-center gap-1 truncate">
                          <User className="w-3 h-3 shrink-0" />
                          <span className="truncate">{ticket.sender}</span>
                        </span>
                        <span className="shrink-0">{formatTimestamp(ticket.timestamp)}</span>
                        <span className={cn('flex items-center gap-1 px-1.5 py-0.5 rounded shrink-0', statusStyles.bg)}>
                          <span className={cn('w-1.5 h-1.5 rounded-full', statusStyles.dot)} />
                          <span className={statusStyles.text}>{ticket.status}</span>
                        </span>
                      </div>
                    </div>

                    {/* Classification */}
                    <div className="col-span-2">
                      <ConfidenceBadge
                        confidence={ticket.ai_analysis.confidence}
                        category={ticket.ai_analysis.category}
                        onClick={(e) => {
                          e?.stopPropagation?.();
                          setAiOverlayTicket(ticket);
                        }}
                        compact
                      />
                    </div>

                    {/* Customer */}
                    <div className="col-span-2">
                      <div className="flex flex-col gap-1">
                        <TierBadge tier={ticket.customer_tier} />
                        <span className="text-fluid-xs text-[hsl(var(--muted-foreground))] truncate">
                          {extractEmailDomain(ticket.sender)}
                        </span>
                      </div>
                    </div>

                    {/* SLA Timer */}
                    <div className="col-span-2">
                      <SLATimer
                        deadline={ticket.sla_deadline}
                        priority={ticket.priority}
                        compact
                      />
                    </div>

                    {/* Actions */}
                    <div className="col-span-1 flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setAiOverlayTicket(ticket);
                        }}
                        className={cn(
                          'p-2 rounded-lg transition-colors',
                          'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--primary))]',
                          'hover:bg-[hsl(var(--primary)/0.1)]'
                        )}
                        title="View AI Analysis"
                      >
                        <Sparkles className="w-4 h-4" />
                      </button>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-[hsl(var(--muted-foreground))]" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-[hsl(var(--muted-foreground))]" />
                      )}
                    </div>
                  </div>
                </div>

                {/* SEARCH: EXPANDED_DETAILS */}
                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-3 sm:px-4 pb-3 sm:pb-4 border-t border-[hsl(var(--border))] animate-fade-in">
                    <div className="pt-3 sm:pt-4 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                      {/* Thread Visualizer */}
                      <ThreadVisualizer
                        masterSubject={ticket.subject}
                        masterSender={ticket.sender}
                        masterTimestamp={ticket.timestamp}
                        threadCount={ticket.thread_count}
                        children={ticket.thread_children}
                        ticketId={ticket.id}
                      />

                      {/* Quick Actions & AI Summary */}
                      <div className="space-y-3 sm:space-y-4">
                        {/* AI Summary Card */}
                        <div className="p-3 sm:p-4 rounded-lg bg-[hsl(var(--muted)/0.3)] border border-[hsl(var(--border))]">
                          <h4 className="text-fluid-sm font-semibold text-[hsl(var(--foreground))] mb-2 flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-[hsl(var(--primary))]" />
                            AI Summary
                          </h4>
                          <p className="text-fluid-sm text-[hsl(var(--muted-foreground))]">
                            {ticket.ai_analysis.reasoning}
                          </p>
                        </div>

                        {/* AI Draft Response (if available) */}
                        {ticket.ai_draft_response && (
                          <div className="p-3 sm:p-4 rounded-lg bg-[hsl(var(--accent)/0.05)] border border-[hsl(var(--accent)/0.3)]">
                            <h4 className="text-fluid-sm font-semibold text-[hsl(var(--foreground))] mb-2">
                              Suggested Response
                            </h4>
                            <p className="text-fluid-sm text-[hsl(var(--muted-foreground))] italic">
                              "{ticket.ai_draft_response}"
                            </p>
                            <button className="mt-3 px-4 py-2 rounded-lg bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] text-fluid-sm font-medium hover:opacity-90 active:opacity-80 transition-opacity touch-target">
                              Use This Response
                            </button>
                          </div>
                        )}

                        {/* Quick Actions - responsive wrap */}
                        <div className="flex flex-wrap gap-2">
                          <button className="px-3 py-1.5 rounded-lg bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] text-fluid-sm font-medium hover:opacity-90 active:opacity-80 touch-target">
                            Reply
                          </button>
                          <button className="px-3 py-1.5 rounded-lg border border-[hsl(var(--border))] text-[hsl(var(--foreground))] text-fluid-sm font-medium hover:bg-[hsl(var(--muted))] active:bg-[hsl(var(--muted)/0.8)] touch-target">
                            Assign
                          </button>
                          <button className="px-3 py-1.5 rounded-lg border border-[hsl(var(--border))] text-[hsl(var(--foreground))] text-fluid-sm font-medium hover:bg-[hsl(var(--muted))] active:bg-[hsl(var(--muted)/0.8)] touch-target">
                            Escalate
                          </button>
                          <button className="px-3 py-1.5 rounded-lg border border-[hsl(var(--low)/0.5)] text-[hsl(var(--low))] text-fluid-sm font-medium hover:bg-[hsl(var(--low)/0.1)] active:bg-[hsl(var(--low)/0.15)] touch-target">
                            Mark Resolved
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Results count */}
      <div className="text-fluid-xs text-[hsl(var(--muted-foreground))] text-center pt-2">
        Showing {processedTickets.length} of {tickets.length} tickets
      </div>

      {/* AI Reasoning Overlay */}
      {aiOverlayTicket && (
        <AIReasoningOverlay
          analysis={aiOverlayTicket.ai_analysis}
          ticketId={aiOverlayTicket.id}
          onClose={() => setAiOverlayTicket(null)}
          draftResponse={aiOverlayTicket.ai_draft_response}
        />
      )}
    </div>
  );
}

export default TicketTable;
