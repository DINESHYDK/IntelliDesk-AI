// ============================================================================
// IntelliDesk AI - Ticket Table Component
// Deep Dark Mode Design with Pagination
// ============================================================================

'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  AlertTriangle,
  Clock,
  Eye,
  Search,
  Filter,
  GitMerge,
  Sparkles,
  ChevronUp,
  ChevronDown,
  Mail,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Ticket, Priority } from '@/types';
import { 
  formatTimestamp, 
  extractEmailDomain, 
  calculateSLAStatus, 
  cn,
  getPriorityStyles, 
  getTierStyles,
  getConfidenceStyles
} from '@/lib/utils';
import { TicketWorkspace } from './workspace';
import { usePagination } from '@/components/hooks/use-pagination';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from '@/components/ui/pagination';
import { Button } from '@/components/ui/button';

interface TicketTableProps {
  tickets: Ticket[];
  isLoading?: boolean;
}

type SortField = 'priority' | 'sla' | 'timestamp' | 'customer_tier';
type SortDirection = 'asc' | 'desc';

export function TicketTable({ tickets, isLoading = false }: TicketTableProps) {
  const [workspaceTicket, setWorkspaceTicket] = useState<Ticket | null>(null);
  const [sortField, setSortField] = useState<SortField>('sla');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [priorityFilter, searchQuery, sortField, sortDirection]);

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

  const totalPages = Math.ceil(processedTickets.length / itemsPerPage);

  const { pages, showLeftEllipsis, showRightEllipsis } = usePagination({
    currentPage,
    totalPages,
    paginationItemsToDisplay: 5,
  });

  const displayedTickets = processedTickets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
      <div className="p-6 bg-card rounded-xl space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="h-16 rounded-lg bg-muted border border-border animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      {/* Filters & Search Bar */}
      <div className="p-6 border-b border-border">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search tickets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                'w-full pl-10 pr-4 py-2.5 rounded-lg border',
                'bg-background border-input',
                'text-foreground placeholder:text-muted-foreground',
                'focus:outline-none focus:ring-2 focus:ring-ring focus:border-input',
                'transition-all text-sm'
              )}
            />
          </div>

          {/* Priority Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            {(['all', 'P1', 'P2', 'P3', 'P4'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPriorityFilter(p)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
                  priorityFilter === p
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
                )}
              >
                {p === 'all' ? 'All' : p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table Header */}
      <div className="hidden lg:grid lg:grid-cols-12 gap-4 px-6 py-3 bg-muted/50 border-b border-border">
        <div
          className="col-span-1 flex items-center gap-1 cursor-pointer text-xs font-bold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors"
          onClick={() => handleSort('priority')}
        >
          Priority
          {sortField === 'priority' && (
            sortDirection === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
          )}
        </div>
        <div className="col-span-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">
          Subject
        </div>
        <div className="col-span-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
          Classification
        </div>
        <div
          className="col-span-2 flex items-center gap-1 cursor-pointer text-xs font-bold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors"
          onClick={() => handleSort('customer_tier')}
        >
          Customer
          {sortField === 'customer_tier' && (
            sortDirection === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
          )}
        </div>
        <div
          className="col-span-2 flex items-center gap-1 cursor-pointer text-xs font-bold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors"
          onClick={() => handleSort('sla')}
        >
          SLA Timer
          {sortField === 'sla' && (
            sortDirection === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
          )}
        </div>
        <div className="col-span-1 text-xs font-bold text-muted-foreground uppercase tracking-wider text-center">
          Actions
        </div>
      </div>

      {/* Ticket Rows */}
      <div className="divide-y divide-border">
        {processedTickets.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Mail className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-lg font-medium text-foreground">No tickets found</p>
            <p className="text-sm">Try adjusting your filters</p>
          </div>
        ) : (
          displayedTickets.map((ticket) => {
            const slaStatus = calculateSLAStatus(ticket.sla_deadline);
            const pStyle = getPriorityStyles(ticket.priority);
            const tStyle = getTierStyles(ticket.customer_tier);
            const cStyle = getConfidenceStyles(ticket.ai_analysis.confidence);

            return (
              <div
                key={ticket.id}
                onClick={() => setWorkspaceTicket(ticket)}
                className={cn(
                  'bg-card hover:bg-card-hover transition-all duration-200 cursor-pointer',
                  slaStatus.isBreached && 'bg-destructive/10 hover:bg-destructive/20 border-l-2 border-l-destructive'
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
                      <h3 className="text-sm font-semibold text-foreground truncate">
                        {ticket.subject}
                      </h3>
                      {ticket.thread_count > 1 && (
                        <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-primary/10 text-primary text-xs flex-shrink-0">
                          <GitMerge className="w-3 h-3" />
                          {ticket.thread_count}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="truncate">{ticket.sender}</span>
                      <span className="text-muted-foreground/60">•</span>
                      <span className="flex-shrink-0">{formatTimestamp(ticket.timestamp)}</span>
                    </div>
                  </div>

                  {/* AI Classification */}
                  <div className="col-span-2">
                    <div className={cn(
                      'inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg',
                      cStyle.bg, cStyle.text
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
                    <p className="text-xs text-muted-foreground mt-1 truncate">
                      {extractEmailDomain(ticket.sender)}
                    </p>
                  </div>

                  {/* SLA Timer */}
                  <div className="col-span-2">
                    {slaStatus.isBreached ? (
                      <div className="flex items-center gap-1.5 text-destructive">
                        <AlertTriangle className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase">Breached</span>
                      </div>
                    ) : (
                      <div className={cn(
                        'flex items-center gap-1.5 text-sm',
                        slaStatus.isCritical ? 'text-urgent' :
                          slaStatus.isWarning ? 'text-high' : 'text-foreground'
                      )}>
                        <Clock className="w-4 h-4" />
                        <span className="font-semibold">{slaStatus.displayText}</span>
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
                        'text-primary hover:text-primary-foreground hover:bg-primary',
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
                      <h3 className="text-sm font-semibold text-foreground line-clamp-2">
                        {ticket.subject}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1 truncate">
                        {ticket.sender}
                      </p>
                    </div>
                  </div>

                  {/* Middle Row: Classification + Tier */}
                  <div className="flex flex-wrap items-center gap-2">
                    <div className={cn(
                      'inline-flex items-center gap-1 px-2 py-1 rounded',
                      cStyle.bg, cStyle.text
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
                      <div className="flex items-center gap-1.5 text-destructive">
                        <AlertTriangle className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase">Breached</span>
                      </div>
                    ) : (
                      <div className={cn(
                        'flex items-center gap-1.5 text-sm',
                        slaStatus.isCritical ? 'text-urgent' :
                          slaStatus.isWarning ? 'text-high' : 'text-foreground'
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
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-primary hover:text-primary-foreground hover:bg-primary transition-all"
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

      {/* Footer with Pagination */}
      <div className="px-6 py-4 bg-muted/50 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-xs text-muted-foreground text-center md:text-left">
          Showing {displayedTickets.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{' '}
          {Math.min(currentPage * itemsPerPage, processedTickets.length)} of {processedTickets.length} tickets
        </p>

        {processedTickets.length > itemsPerPage && (
          <Pagination className="w-auto mx-0">
            <PaginationContent>
              <PaginationItem>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 bg-card border-input hover:bg-muted"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4 text-muted-foreground" />
                </Button>
              </PaginationItem>

              {showLeftEllipsis && (
                <>
                  <PaginationItem>
                    <PaginationLink
                      className="h-8 w-8 bg-card border-input text-muted-foreground hover:bg-muted hover:text-foreground"
                      onClick={() => setCurrentPage(1)}
                    >
                      1
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationEllipsis className="text-muted-foreground" />
                  </PaginationItem>
                </>
              )}

              {pages.map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => setCurrentPage(page)}
                    isActive={currentPage === page}
                    className={cn(
                      "h-8 w-8",
                      currentPage === page
                        ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90"
                        : "bg-card border-input text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}

              {showRightEllipsis && (
                <>
                  <PaginationItem>
                    <PaginationEllipsis className="text-muted-foreground" />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink
                      className="h-8 w-8 bg-card border-input text-muted-foreground hover:bg-muted hover:text-foreground"
                      onClick={() => setCurrentPage(totalPages)}
                    >
                      {totalPages}
                    </PaginationLink>
                  </PaginationItem>
                </>
              )}

              <PaginationItem>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 bg-card border-input hover:bg-muted"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
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
