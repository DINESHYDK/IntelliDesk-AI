// ============================================================================
// SEARCH: THREAD_VISUALIZER
// IntelliDesk AI - Thread Visualizer Component
// Shows deduplication/merged email timeline
// ============================================================================

'use client';

import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Mail,
  GitMerge,
  Clock,
  User
} from 'lucide-react';
import { ThreadChild } from '@/types';
import { formatTimestamp, cn } from '@/lib/utils';

interface ThreadVisualizerProps {
  masterSubject: string;
  masterSender: string;
  masterTimestamp: string;
  threadCount: number;
  children?: ThreadChild[];
  ticketId: string;
}

/**
 * SEARCH: THREAD_VISUALIZER_COMPONENT
 * Vertical timeline showing master ticket and merged child emails
 * Demonstrates the deduplication logic visually
 */
export function ThreadVisualizer({
  masterSubject,
  masterSender,
  masterTimestamp,
  threadCount,
  children = [],
  ticketId,
}: ThreadVisualizerProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const hasChildren = children && children.length > 0;
  const totalThreads = threadCount || 1;

  return (
    <div className="animate-fade-in">
      {/* Thread Header */}
      <div className="flex items-center justify-between mb-3 sm:mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <GitMerge className="w-4 h-4 sm:w-5 sm:h-5 text-[hsl(var(--primary))]" />
          <h3 className="text-fluid-lg font-semibold text-[hsl(var(--foreground))]">
            Thread Timeline
          </h3>
        </div>
        {totalThreads > 1 && (
          <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 rounded-full bg-[hsl(var(--primary)/0.15)] text-[hsl(var(--primary))]">
            <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="text-fluid-xs sm:text-fluid-sm font-medium">
              {totalThreads} emails merged
            </span>
          </div>
        )}
      </div>

      {/* Timeline */}
      <div className="relative pl-6 sm:pl-8">
        {/* Vertical Line */}
        <div
          className={cn(
            'absolute left-2 sm:left-3 top-0 bottom-0 w-0.5',
            'bg-gradient-to-b from-[hsl(var(--primary))] to-[hsl(var(--muted))]'
          )}
        />

        {/* Master Ticket Node */}
        <div className="relative mb-3 sm:mb-4 group">
          {/* Node Dot */}
          <div
            className={cn(
              'absolute -left-4 sm:-left-5 top-3 sm:top-4 w-3 h-3 sm:w-4 sm:h-4 rounded-full',
              'bg-[hsl(var(--primary))] border-3 sm:border-4 border-[hsl(var(--card))]',
              'ring-3 sm:ring-4 ring-[hsl(var(--primary)/0.2)]'
            )}
          />

          {/* Master Card */}
          <div
            className={cn(
              'p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 border-[hsl(var(--primary)/0.5)]',
              'bg-[hsl(var(--card))] hover:bg-[hsl(var(--card-hover))]',
              'transition-all duration-200 hover:shadow-lg'
            )}
          >
            <div className="flex items-start justify-between gap-3 sm:gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="px-1.5 sm:px-2 py-0.5 text-fluid-xs font-semibold rounded bg-[hsl(var(--primary)/0.2)] text-[hsl(var(--primary))]">
                    MASTER
                  </span>
                  <span className="text-fluid-xs text-[hsl(var(--muted-foreground))]">
                    {ticketId}
                  </span>
                </div>
                <h4 className="text-fluid-sm font-semibold text-[hsl(var(--foreground))] line-clamp-2 sm:truncate">
                  {masterSubject}
                </h4>
                <div className="flex items-center gap-2 sm:gap-3 mt-2 text-fluid-xs text-[hsl(var(--muted-foreground))] flex-wrap">
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3 shrink-0" />
                    <span className="truncate max-w-[150px] sm:max-w-none">{masterSender}</span>
                  </span>
                  <span className="flex items-center gap-1 whitespace-nowrap">
                    <Clock className="w-3 h-3 shrink-0" />
                    {formatTimestamp(masterTimestamp)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Child Threads (Collapsible) */}
        {hasChildren && (
          <>
            {/* Toggle Button */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className={cn(
                'relative flex items-center gap-2 mb-3 sm:mb-4 px-2.5 sm:px-3 py-1.5 rounded-lg touch-target',
                'text-fluid-sm font-medium text-[hsl(var(--primary))]',
                'bg-[hsl(var(--primary)/0.1)] hover:bg-[hsl(var(--primary)/0.2)] active:bg-[hsl(var(--primary)/0.25)]',
                'transition-colors'
              )}
            >
              {/* Node Dot */}
              <div
                className={cn(
                  'absolute -left-4 sm:-left-5 top-1/2 -translate-y-1/2 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full',
                  'bg-[hsl(var(--muted-foreground))] border-2 border-[hsl(var(--card))]'
                )}
              />

              {isExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
              <span className="whitespace-nowrap">
                {isExpanded ? 'Hide' : 'Show'} {children.length} merged email{children.length > 1 ? 's' : ''}
              </span>
            </button>

            {/* Collapsed Children */}
            {isExpanded && (
              <div className="space-y-2 sm:space-y-3 animate-fade-in">
                {children.map((child, index) => (
                  <div key={child.id} className="relative group">
                    {/* Node Dot */}
                    <div
                      className={cn(
                        'absolute -left-4 sm:-left-5 top-3 sm:top-4 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full',
                        'bg-[hsl(var(--muted-foreground))] border-2 border-[hsl(var(--card))]'
                      )}
                    />

                    {/* Child Card */}
                    <div
                      className={cn(
                        'p-2.5 sm:p-3 rounded-lg border border-[hsl(var(--border))]',
                        'bg-[hsl(var(--muted)/0.3)] hover:bg-[hsl(var(--muted)/0.5)]',
                        'transition-all duration-200'
                      )}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <GitMerge className="w-3 h-3 text-[hsl(var(--muted-foreground))]" />
                        <span className="text-fluid-xs text-[hsl(var(--muted-foreground))]">
                          Merged #{index + 1}
                        </span>
                      </div>
                      <h5 className="text-fluid-sm text-[hsl(var(--foreground))] line-clamp-2 sm:truncate">
                        {child.subject}
                      </h5>
                      <div className="flex items-center gap-2 sm:gap-3 mt-1 text-fluid-xs text-[hsl(var(--muted-foreground))] flex-wrap">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3 shrink-0" />
                          <span className="truncate max-w-[120px] sm:max-w-none">{child.sender}</span>
                        </span>
                        <span className="flex items-center gap-1 whitespace-nowrap">
                          <Clock className="w-3 h-3 shrink-0" />
                          {formatTimestamp(child.timestamp)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* No children message */}
        {!hasChildren && totalThreads === 1 && (
          <div className="relative py-2">
            <div
              className={cn(
                'absolute -left-4 sm:-left-5 top-1/2 -translate-y-1/2 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full',
                'bg-[hsl(var(--low))] border-2 border-[hsl(var(--card))]'
              )}
            />
            <span className="text-fluid-sm text-[hsl(var(--muted-foreground))] italic">
              Single email thread - no duplicates detected
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default ThreadVisualizer;
