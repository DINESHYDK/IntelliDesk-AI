// ============================================================================
// IntelliDesk AI - Ticket Table Component
// Deep Dark Mode Design with Strict Visual Specifications
// ============================================================================

'use client';

import React, { useState, useMemo } from 'react';
import {
  AlertTriangle,
  Clock,
  Crown,
  Eye,
  Search,
  Filter,
  GitMerge,
  Sparkles,
  ChevronUp,
  ChevronDown,
  Mail
} from 'lucide-react';
import { Ticket, Priority } from '@/types';
import { formatTimestamp, extractEmailDomain, calculateSLAStatus, cn } from '@/lib/utils';
import { TicketWorkspace } from './workspace';

interface TicketTableProps {
  tickets: Ticket[];
  isLoading?: boolean;
}

type SortField = 'priority' | 'sla' | 'timestamp' | 'customer_tier';
type SortDirection = 'asc' | 'desc';

// Priority badge styles
const priorityStyles: Record<Priority, { border: string; text: string; bg: string }> = {
  P1: { border: 'border-red-500/50', text: 'text-red-500', bg: 'bg-red-500/10' },
  P2: { border: 'border-orange-500/50', text: 'text-orange-500', bg: 'bg-orange-500/10' },
  P3: { border: 'border-blue-500/50', text: 'text-blue-500', bg: 'bg-blue-500/10' },
  P4: { border: 'border-slate-500/50', text: 'text-slate-400', bg: 'bg-slate-500/10' },
};

// Tier styles
const tierStyles: Record<string, { icon: string; text: string; bg: string }> = {
  Gold: { icon: '👑', text: 'text-amber-400', bg: 'bg-amber-500/10' },
  Silver: { icon: '⭐', text: 'text-slate-300', bg: 'bg-slate-500/10' },
  Bronze: { icon: '🥉', text: 'text-orange-300', bg: 'bg-orange-500/10' },
};

export function TicketTable({ tickets, isLoading = false }: TicketTableProps) {
  const [workspaceTicket, setWorkspaceTicket] = useState<Ticket | null>(null);
  const [sortField, setSortField] = useState<SortField>('sla');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
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
          comparison = new Date(a.sla_deadline).getTime() - new Date(b.sla_deadline).getTime();
          break;
        case 'timestamp':
          comparison = new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
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
      <div className="p-6 bg-slate-950 rounded-xl space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="h-16 rounded-lg bg-slate-900 border border-slate-800 animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
      {/* Filters & Search Bar */}
      <div className="p-6 border-b border-slate-800">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search tickets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                'w-full pl-10 pr-4 py-2.5 rounded-lg border',
                'bg-slate-900 border-slate-700',
                'text-white placeholder:text-slate-500',
                'focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50',
                'transition-all text-sm'
              )}
            />
          </div>

          {/* Priority Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500" />
            {(['all', 'P1', 'P2', 'P3', 'P4'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPriorityFilter(p)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
                  priorityFilter === p
                    ? 'bg-blue-500 text-white'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                )}
              >
                {p === 'all' ? 'All' : p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table Header */}
      <div className="hidden lg:grid lg:grid-cols-12 gap-4 px-6 py-3 bg-slate-900/50 border-b border-slate-800">
        <div
          className="col-span-1 flex items-center gap-1 cursor-pointer text-xs font-bold text-slate-500 uppercase tracking-wider hover:text-slate-300 transition-colors"
          onClick={() => handleSort('priority')}
        >
          Priority
          {sortField === 'priority' && (
            sortDirection === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
          )}
        </div>
        <div className="col-span-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
          Subject
        </div>
        <div className="col-span-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
          Classification
        </div>
        <div
          className="col-span-2 flex items-center gap-1 cursor-pointer text-xs font-bold text-slate-500 uppercase tracking-wider hover:text-slate-300 transition-colors"
          onClick={() => handleSort('customer_tier')}
        >
          Customer
          {sortField === 'customer_tier' && (
            sortDirection === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
          )}
        </div>
        <div
          className="col-span-2 flex items-center gap-1 cursor-pointer text-xs font-bold text-slate-500 uppercase tracking-wider hover:text-slate-300 transition-colors"
          onClick={() => handleSort('sla')}
        >
          SLA Timer
          {sortField === 'sla' && (
            sortDirection === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
          )}
        </div>
        <div className="col-span-1 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">
          Actions
        </div>
      </div>

      {/* Ticket Rows */}
      <div className="divide-y divide-slate-800">
        {processedTickets.length === 0 ? (
          <div className="text-center py-16 text-slate-500">
            <Mail className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-lg font-medium text-slate-400">No tickets found</p>
            <p className="text-sm">Try adjusting your filters</p>
          </div>
        ) : (
          processedTickets.map((ticket) => {
            const slaStatus = calculateSLAStatus(ticket.sla_deadline);
            const pStyle = priorityStyles[ticket.priority];
            const tStyle = tierStyles[ticket.customer_tier] || tierStyles.Bronze;
            const isHighConfidence = ticket.ai_analysis.confidence >= 80;

            return (
              <div
                key={ticket.id}
                onClick={() => setWorkspaceTicket(ticket)}
                className={cn(
                  'bg-slate-900 hover:bg-slate-800/80 transition-all duration-200 cursor-pointer',
                  slaStatus.isBreached && 'bg-red-950/20 hover:bg-red-950/30 border-l-2 border-l-red-500'
                )}
              >
                {/* Desktop Row */}
                <div className="hidden lg:grid lg:grid-cols-12 gap-4 px-6 py-4 items-center">
                  {/* Priority */}
                  <div className="col-span-1">
                    <div className={cn(
                      'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border',
                      pStyle.border, pStyle.bg
                    )}>
                      {ticket.priority === 'P1' && <AlertTriangle className={cn('w-3.5 h-3.5', pStyle.text)} />}
                      <span className={cn('text-xs font-bold', pStyle.text)}>
                        {ticket.priority}
                      </span>
                    </div>
                  </div>

                  {/* Subject & Sender */}
                  <div className="col-span-4 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-white truncate">
                        {ticket.subject}
                      </h3>
                      {ticket.thread_count > 1 && (
                        <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 text-xs flex-shrink-0">
                          <GitMerge className="w-3 h-3" />
                          {ticket.thread_count}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span className="truncate">{ticket.sender}</span>
                      <span className="text-slate-600">•</span>
                      <span className="flex-shrink-0">{formatTimestamp(ticket.timestamp)}</span>
                    </div>
                  </div>

                  {/* AI Classification */}
                  <div className="col-span-2">
                    <div className={cn(
                      'inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg',
                      isHighConfidence
                        ? 'bg-green-500/10 text-green-400'
                        : 'bg-amber-500/10 text-amber-400'
                    )}>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span className="text-xs font-medium truncate">
                        {ticket.ai_analysis.category}
                      </span>
                      <span className="text-xs font-bold">
                        {ticket.ai_analysis.confidence}%
                      </span>
                    </div>
                  </div>

                  {/* Customer Tier */}
                  <div className="col-span-2">
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        'inline-flex items-center gap-1.5 px-2 py-1 rounded',
                        tStyle.bg
                      )}>
                        <span className="text-sm">{tStyle.icon}</span>
                        <span className={cn('text-xs font-semibold', tStyle.text)}>
                          {ticket.customer_tier}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 truncate">
                      {extractEmailDomain(ticket.sender)}
                    </p>
                  </div>

                  {/* SLA Timer */}
                  <div className="col-span-2">
                    {slaStatus.isBreached ? (
                      <div className="flex items-center gap-1.5 text-red-500">
                        <AlertTriangle className="w-4 h-4" />
                        <span className="text-sm font-bold uppercase">Breached</span>
                      </div>
                    ) : (
                      <div className={cn(
                        'flex items-center gap-1.5',
                        slaStatus.isCritical ? 'text-red-400' :
                          slaStatus.isWarning ? 'text-orange-400' : 'text-white'
                      )}>
                        <Clock className="w-4 h-4" />
                        <span className="text-sm font-semibold">
                          {slaStatus.displayText}
                        </span>
                      </div>
                    )}
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
                        'text-blue-400 hover:text-blue-300 hover:bg-blue-500/10',
                        'transition-all'
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
                    <div className={cn(
                      'inline-flex items-center gap-1 px-2 py-1 rounded border flex-shrink-0',
                      pStyle.border, pStyle.bg
                    )}>
                      {ticket.priority === 'P1' && <AlertTriangle className={cn('w-3 h-3', pStyle.text)} />}
                      <span className={cn('text-xs font-bold', pStyle.text)}>{ticket.priority}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-white line-clamp-2">
                        {ticket.subject}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 truncate">
                        {ticket.sender}
                      </p>
                    </div>
                  </div>

                  {/* Middle Row: Classification + Tier */}
                  <div className="flex flex-wrap items-center gap-2">
                    <div className={cn(
                      'inline-flex items-center gap-1 px-2 py-1 rounded',
                      isHighConfidence ? 'bg-green-500/10 text-green-400' : 'bg-amber-500/10 text-amber-400'
                    )}>
                      <Sparkles className="w-3 h-3" />
                      <span className="text-xs font-medium">{ticket.ai_analysis.category}</span>
                      <span className="text-xs font-bold">{ticket.ai_analysis.confidence}%</span>
                    </div>
                    <div className={cn('inline-flex items-center gap-1 px-2 py-1 rounded', tStyle.bg)}>
                      <span className="text-xs">{tStyle.icon}</span>
                      <span className={cn('text-xs font-semibold', tStyle.text)}>{ticket.customer_tier}</span>
                    </div>
                  </div>

                  {/* Bottom Row: SLA + Open Button */}
                  <div className="flex items-center justify-between">
                    {slaStatus.isBreached ? (
                      <div className="flex items-center gap-1.5 text-red-500">
                        <AlertTriangle className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase">Breached</span>
                      </div>
                    ) : (
                      <div className={cn(
                        'flex items-center gap-1.5 text-sm',
                        slaStatus.isCritical ? 'text-red-400' :
                          slaStatus.isWarning ? 'text-orange-400' : 'text-white'
                      )}>
                        <Clock className="w-4 h-4" />
                        <span className="font-semibold">{slaStatus.displayText}</span>
                      </div>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setWorkspaceTicket(ticket);
                      }}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 transition-all"
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

      {/* Footer */}
      <div className="px-6 py-3 bg-slate-900/50 border-t border-slate-800">
        <p className="text-xs text-slate-500 text-center">
          Showing {processedTickets.length} of {tickets.length} tickets
        </p>
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
