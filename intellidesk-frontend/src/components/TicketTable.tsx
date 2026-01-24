// ============================================================================
// SEARCH: TICKET_TABLE
// IntelliDesk AI - Ticket Table Component (Command Center)
// Simplified: Single-click opens workspace, no expand slider
// ============================================================================

'use client';

import React, { useState, useMemo } from 'react';
import { 
  Mail, 
  GitMerge, 
  Sparkles,
  User,
  ExternalLink,
  Filter,
  Search,
  SortAsc,
  SortDesc,
  Eye
} from 'lucide-react';
import { Ticket, Priority } from '@/types';
import { 
  formatTimestamp, 
  extractEmailDomain,
  getStatusStyles,
  calculateSLAStatus,
  cn 
} from '@/lib/utils';
import { PriorityBadge } from './PriorityBadge';
import { TierBadge } from './TierBadge';
import { ConfidenceBadge } from './ConfidenceBadge';
import { SLATimer } from './SLATimer';
import { TicketWorkspace } from './workspace';

interface TicketTableProps {
  tickets: Ticket[];
  isLoading?: boolean;
}

type SortField = 'priority' | 'sla' | 'timestamp' | 'customer_tier';
type SortDirection = 'asc' | 'desc';

export function TicketTable({ tickets, isLoading = false }: TicketTableProps) {
  // State for workspace modal
  const [workspaceTicket, setWorkspaceTicket] = useState<Ticket | null>(null);
  
  // Sorting state
  const [sortField, setSortField] = useState<SortField>('sla');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  
  // Filter state
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Sort and filter tickets
  const processedTickets = useMemo(() => {
    let result = [...tickets];

    if (priorityFilter !== 'all') {
      result = result.filter(t => t.priority === priorityFilter);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(t => 
        t.subject.toLowerCase().includes(query) ||
        t.sender.toLowerCase().includes(query) ||
        t.id.toLowerCase().includes(query) ||
        t.ai_analysis.category.toLowerCase().includes(query)
      );
    }

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

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div 
            key={i}
            className="h-16 rounded-xl bg-[hsl(var(--card))] border border-[hsl(var(--border))] animate-shimmer"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Filters & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--muted-foreground))]" />
          <input
            type="text"
            placeholder="Search tickets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={cn(
              'w-full pl-10 pr-4 py-2.5 rounded-xl border',
              'bg-[hsl(var(--card))] border-[hsl(var(--border))]',
              'text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))]',
              'focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary)/0.5)]',
              'transition-all duration-200'
            )}
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <Filter className="w-4 h-4 text-[hsl(var(--muted-foreground))] flex-shrink-0" />
          {(['all', 'P1', 'P2', 'P3', 'P4'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPriorityFilter(p)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap',
                priorityFilter === p
                  ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] shadow-lg'
                  : 'bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--card-hover))]'
              )}
            >
              {p === 'all' ? 'All' : p}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop Table Header */}
      <div className="hidden lg:grid lg:grid-cols-12 gap-4 px-4 py-2 text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider border-b border-[hsl(var(--border))]">
        <div className="col-span-1 flex items-center gap-1 cursor-pointer hover:text-[hsl(var(--foreground))]" onClick={() => handleSort('priority')}>
          Priority
          {sortField === 'priority' && (sortDirection === 'asc' ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />)}
        </div>
        <div className="col-span-4">Subject</div>
        <div className="col-span-2">Classification</div>
        <div className="col-span-2 flex items-center gap-1 cursor-pointer hover:text-[hsl(var(--foreground))]" onClick={() => handleSort('customer_tier')}>
          Customer
          {sortField === 'customer_tier' && (sortDirection === 'asc' ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />)}
        </div>
        <div className="col-span-2 flex items-center gap-1 cursor-pointer hover:text-[hsl(var(--foreground))]" onClick={() => handleSort('sla')}>
          SLA Timer
          {sortField === 'sla' && (sortDirection === 'asc' ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />)}
        </div>
        <div className="col-span-1 text-center">Actions</div>
      </div>

      {/* Ticket List */}
      <div className="space-y-2">
        {processedTickets.length === 0 ? (
          <div className="text-center py-12 text-[hsl(var(--muted-foreground))]">
            <Mail className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-lg font-medium">No tickets found</p>
            <p className="text-sm">Try adjusting your filters</p>
          </div>
        ) : (
          processedTickets.map((ticket) => {
            const statusStyles = getStatusStyles(ticket.status);
            const slaStatus = calculateSLAStatus(ticket.sla_deadline);

            return (
              <div
                key={ticket.id}
                onClick={() => setWorkspaceTicket(ticket)}
                className={cn(
                  'rounded-xl border transition-all duration-200 cursor-pointer',
                  'bg-[hsl(var(--card))] hover:bg-[hsl(var(--card-hover))]',
                  'border-[hsl(var(--border))] hover:border-[hsl(var(--primary)/0.5)]',
                  'hover:shadow-lg hover:shadow-[hsl(var(--primary)/0.1)]',
                  'active:scale-[0.995]',
                  slaStatus.isBreached && 'border-[hsl(var(--urgent)/0.5)] animate-critical-glow',
                  slaStatus.isCritical && 'border-[hsl(var(--urgent)/0.3)]'
                )}
              >
                {/* Desktop Row */}
                <div className="hidden lg:grid lg:grid-cols-12 gap-4 p-4 items-center">
                  {/* Priority */}
                  <div className="col-span-1">
                    <PriorityBadge priority={ticket.priority} showLabel={false} />
                  </div>

                  {/* Subject & Sender */}
                  <div className="col-span-4 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-[hsl(var(--foreground))] truncate">
                        {ticket.subject}
                      </h3>
                      {ticket.thread_count > 1 && (
                        <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-[hsl(var(--primary)/0.15)] text-[hsl(var(--primary))] text-xs flex-shrink-0">
                          <GitMerge className="w-3 h-3" />
                          {ticket.thread_count}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[hsl(var(--muted-foreground))]">
                      <span className="truncate">{ticket.sender}</span>
                      <span>•</span>
                      <span className="flex-shrink-0">{formatTimestamp(ticket.timestamp)}</span>
                    </div>
                  </div>

                  {/* Classification */}
                  <div className="col-span-2">
                    <ConfidenceBadge
                      confidence={ticket.ai_analysis.confidence}
                      category={ticket.ai_analysis.category}
                      compact
                    />
                  </div>

                  {/* Customer */}
                  <div className="col-span-2">
                    <TierBadge tier={ticket.customer_tier} />
                    <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1 truncate">
                      {extractEmailDomain(ticket.sender)}
                    </p>
                  </div>

                  {/* SLA Timer */}
                  <div className="col-span-2">
                    <SLATimer deadline={ticket.sla_deadline} priority={ticket.priority} compact />
                  </div>

                  {/* Actions */}
                  <div className="col-span-1 flex items-center justify-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setWorkspaceTicket(ticket);
                      }}
                      className={cn(
                        'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium',
                        'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]',
                        'hover:opacity-90 transition-all shadow-md'
                      )}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Open
                    </button>
                  </div>
                </div>

                {/* Mobile Card */}
                <div className="lg:hidden p-4 space-y-3">
                  {/* Top Row: Priority + Subject */}
                  <div className="flex items-start gap-3">
                    <PriorityBadge priority={ticket.priority} showLabel={false} size="sm" />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-[hsl(var(--foreground))] line-clamp-2">
                        {ticket.subject}
                      </h3>
                      <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
                        {ticket.sender}
                      </p>
                    </div>
                  </div>

                  {/* Middle Row: Badges */}
                  <div className="flex flex-wrap items-center gap-2">
                    <TierBadge tier={ticket.customer_tier} size="sm" />
                    <ConfidenceBadge
                      confidence={ticket.ai_analysis.confidence}
                      category={ticket.ai_analysis.category}
                      compact
                    />
                    {ticket.thread_count > 1 && (
                      <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-[hsl(var(--primary)/0.15)] text-[hsl(var(--primary))] text-xs">
                        <GitMerge className="w-3 h-3" />
                        {ticket.thread_count}
                      </span>
                    )}
                  </div>

                  {/* Bottom Row: SLA + Status + Button */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <SLATimer deadline={ticket.sla_deadline} priority={ticket.priority} compact />
                      <span className={cn('flex items-center gap-1 px-1.5 py-0.5 rounded text-xs', statusStyles.bg)}>
                        <span className={cn('w-1.5 h-1.5 rounded-full', statusStyles.dot)} />
                        <span className={statusStyles.text}>{ticket.status}</span>
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setWorkspaceTicket(ticket);
                      }}
                      className={cn(
                        'flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium',
                        'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]',
                        'hover:opacity-90 transition-all shadow-md'
                      )}
                    >
                      <Eye className="w-4 h-4" />
                      Open
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Results count */}
      <div className="text-xs text-[hsl(var(--muted-foreground))] text-center pt-2">
        Showing {processedTickets.length} of {tickets.length} tickets
      </div>

      {/* Ticket Workspace Modal */}
      {workspaceTicket && (
        <TicketWorkspace
          ticket={workspaceTicket}
          onClose={() => setWorkspaceTicket(null)}
        />
      )}
    </div>
  );
}

export default TicketTable;
