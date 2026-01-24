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
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <GitMerge className="w-5 h-5 text-[hsl(var(--primary))]" />
          <h3 className="text-lg font-semibold text-[hsl(var(--foreground))]">
            Thread Timeline
          </h3>
        </div>
        {totalThreads > 1 && (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(var(--primary)/0.15)] text-[hsl(var(--primary))]">
            <Mail className="w-4 h-4" />
            <span className="text-sm font-medium">
              {totalThreads} emails merged
            </span>
          </div>
        )}
      </div>

      {/* Timeline */}
      <div className="relative pl-8">
        {/* Vertical Line */}
        <div 
          className={cn(
            'absolute left-3 top-0 bottom-0 w-0.5',
            'bg-gradient-to-b from-[hsl(var(--primary))] to-[hsl(var(--muted))]'
          )}
        />

        {/* Master Ticket Node */}
        <div className="relative mb-4 group">
          {/* Node Dot */}
          <div 
            className={cn(
              'absolute -left-5 top-4 w-4 h-4 rounded-full',
              'bg-[hsl(var(--primary))] border-4 border-[hsl(var(--card))]',
              'ring-4 ring-[hsl(var(--primary)/0.2)]'
            )}
          />
          
          {/* Master Card */}
          <div 
            className={cn(
              'p-4 rounded-xl border-2 border-[hsl(var(--primary)/0.5)]',
              'bg-[hsl(var(--card))] hover:bg-[hsl(var(--card-hover))]',
              'transition-all duration-200 hover:shadow-lg'
            )}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 text-xs font-semibold rounded bg-[hsl(var(--primary)/0.2)] text-[hsl(var(--primary))]">
                    MASTER
                  </span>
                  <span className="text-xs text-[hsl(var(--muted-foreground))]">
                    {ticketId}
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-[hsl(var(--foreground))] truncate">
                  {masterSubject}
                </h4>
                <div className="flex items-center gap-3 mt-2 text-xs text-[hsl(var(--muted-foreground))]">
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {masterSender}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
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
                'relative flex items-center gap-2 mb-4 px-3 py-1.5 rounded-lg',
                'text-sm font-medium text-[hsl(var(--primary))]',
                'bg-[hsl(var(--primary)/0.1)] hover:bg-[hsl(var(--primary)/0.2)]',
                'transition-colors'
              )}
            >
              {/* Node Dot */}
              <div 
                className={cn(
                  'absolute -left-5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full',
                  'bg-[hsl(var(--muted-foreground))] border-2 border-[hsl(var(--card))]'
                )}
              />
              
              {isExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
              {isExpanded ? 'Hide' : 'Show'} {children.length} merged email{children.length > 1 ? 's' : ''}
            </button>

            {/* Collapsed Children */}
            {isExpanded && (
              <div className="space-y-3 animate-fade-in">
                {children.map((child, index) => (
                  <div key={child.id} className="relative group">
                    {/* Node Dot */}
                    <div 
                      className={cn(
                        'absolute -left-5 top-4 w-3 h-3 rounded-full',
                        'bg-[hsl(var(--muted-foreground))] border-2 border-[hsl(var(--card))]'
                      )}
                    />
                    
                    {/* Child Card */}
                    <div 
                      className={cn(
                        'p-3 rounded-lg border border-[hsl(var(--border))]',
                        'bg-[hsl(var(--muted)/0.3)] hover:bg-[hsl(var(--muted)/0.5)]',
                        'transition-all duration-200'
                      )}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <GitMerge className="w-3 h-3 text-[hsl(var(--muted-foreground))]" />
                        <span className="text-xs text-[hsl(var(--muted-foreground))]">
                          Merged #{index + 1}
                        </span>
                      </div>
                      <h5 className="text-sm text-[hsl(var(--foreground))] truncate">
                        {child.subject}
                      </h5>
                      <div className="flex items-center gap-3 mt-1 text-xs text-[hsl(var(--muted-foreground))]">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {child.sender}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
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
                'absolute -left-5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full',
                'bg-[hsl(var(--low))] border-2 border-[hsl(var(--card))]'
              )}
            />
            <span className="text-sm text-[hsl(var(--muted-foreground))] italic">
              Single email thread - no duplicates detected
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default ThreadVisualizer;
