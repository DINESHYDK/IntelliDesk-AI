// ============================================================================
// SEARCH: AI_REASONING_OVERLAY
// IntelliDesk AI - AI Reasoning Overlay Component
// Shows AI classification details with confidence indicator
// ============================================================================

'use client';

import React from 'react';
import { X, Sparkles, Brain, AlertCircle, CheckCircle2 } from 'lucide-react';
import { AIAnalysis } from '@/types';
import { getConfidenceStyles, getSentimentStyles, cn } from '@/lib/utils';

interface AIReasoningOverlayProps {
  analysis: AIAnalysis;
  ticketId: string;
  onClose: () => void;
  draftResponse?: string;
}

/**
 * SEARCH: AI_REASONING_COMPONENT
 * Dismissible overlay showing AI classification details
 * Features:
 * - Category with confidence percentage
 * - Reasoning explanation
 * - Sentiment analysis
 * - Optional AI draft response
 */
export function AIReasoningOverlay({
  analysis,
  ticketId,
  onClose,
  draftResponse
}: AIReasoningOverlayProps) {
  const confidenceStyles = getConfidenceStyles(analysis.confidence);
  const sentimentStyles = getSentimentStyles(analysis.sentiment);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className={cn(
          'relative w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl overflow-hidden',
          'bg-[hsl(var(--card))] border-t-2 sm:border-2',
          'animate-slide-in-right shadow-2xl',
          'max-h-[90vh] sm:max-h-[85vh] flex flex-col',
          confidenceStyles.border
        )}
      >
        {/* Header with gradient */}
        <div
          className={cn(
            'relative px-4 sm:px-6 py-3 sm:py-4 border-b border-[hsl(var(--border))] shrink-0',
            'bg-gradient-to-r from-[hsl(var(--primary)/0.1)] to-transparent'
          )}
        >
          {/* AI Badge */}
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-[hsl(var(--primary)/0.15)] text-[hsl(var(--primary))]">
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span className="text-fluid-xs font-semibold">AI Analysis</span>
            </div>
            <span className="text-fluid-xs text-[hsl(var(--muted-foreground))]">
              Ticket {ticketId}
            </span>
          </div>

          {/* Close Button - larger tap target for mobile */}
          <button
            onClick={onClose}
            className={cn(
              'absolute top-3 sm:top-4 right-3 sm:right-4 p-2 rounded-lg touch-target',
              'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]',
              'hover:bg-[hsl(var(--muted))] active:bg-[hsl(var(--muted))] transition-colors'
            )}
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Category and Confidence */}
          <div className="flex items-center justify-between mt-2 gap-2 pr-8 sm:pr-0">
            <h3 className="text-fluid-xl font-bold text-[hsl(var(--foreground))] truncate">
              {analysis.category}
            </h3>
            <div
              className={cn(
                'flex items-center gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border shrink-0',
                confidenceStyles.bg,
                confidenceStyles.border
              )}
            >
              {analysis.confidence >= 80 ? (
                <CheckCircle2 className={cn('w-3.5 h-3.5 sm:w-4 sm:h-4', confidenceStyles.text)} />
              ) : (
                <AlertCircle className={cn('w-3.5 h-3.5 sm:w-4 sm:h-4', confidenceStyles.text)} />
              )}
              <span className={cn('text-fluid-sm font-bold', confidenceStyles.text)}>
                {analysis.confidence}%
              </span>
            </div>
          </div>
        </div>

        {/* Content - scrollable */}
        <div className="p-4 sm:p-6 space-y-3 sm:space-y-4 overflow-y-auto flex-1">
          {/* Confidence Status */}
          <div
            className={cn(
              'flex items-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border',
              confidenceStyles.bg,
              confidenceStyles.border
            )}
          >
            <Brain className={cn('w-4 h-4 sm:w-5 sm:h-5 shrink-0', confidenceStyles.text)} />
            <div className="min-w-0">
              <span className={cn('font-semibold text-fluid-sm', confidenceStyles.text)}>
                {confidenceStyles.label}
              </span>
              {confidenceStyles.needsReview && (
                <p className="text-fluid-xs text-[hsl(var(--muted-foreground))]">
                  Human review recommended before auto-response
                </p>
              )}
            </div>
          </div>

          {/* Reasoning Section */}
          <div>
            <h4 className="text-fluid-sm font-semibold text-[hsl(var(--foreground))] mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[hsl(var(--primary))]" />
              AI Reasoning
            </h4>
            <div className="p-3 sm:p-4 rounded-lg bg-[hsl(var(--muted)/0.3)] border border-[hsl(var(--border))]">
              <p className="text-fluid-sm text-[hsl(var(--foreground))] leading-relaxed">
                "{analysis.reasoning}"
              </p>
            </div>
          </div>

          {/* Sentiment */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-fluid-sm text-[hsl(var(--muted-foreground))]">
              Customer Sentiment:
            </span>
            <div
              className={cn(
                'flex items-center gap-1.5 px-3 py-1 rounded-full',
                sentimentStyles.bg
              )}
            >
              <span className="text-base sm:text-lg">{sentimentStyles.emoji}</span>
              <span className={cn('text-fluid-sm font-medium', sentimentStyles.text)}>
                {analysis.sentiment}
              </span>
            </div>
          </div>

          {/* AI Draft Response (if available) */}
          {draftResponse && (
            <div>
              <h4 className="text-fluid-sm font-semibold text-[hsl(var(--foreground))] mb-2 flex items-center gap-2">
                <Brain className="w-4 h-4 text-[hsl(var(--accent))]" />
                Suggested Response
              </h4>
              <div
                className={cn(
                  'p-3 sm:p-4 rounded-lg border-l-4',
                  'bg-[hsl(var(--accent)/0.05)] border-[hsl(var(--accent))]'
                )}
              >
                <p className="text-fluid-sm text-[hsl(var(--foreground))] leading-relaxed italic">
                  "{draftResponse}"
                </p>
              </div>
              <div className="flex gap-2 mt-3">
                <button
                  className={cn(
                    'flex-1 px-4 py-2.5 rounded-lg font-medium text-fluid-sm touch-target',
                    'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]',
                    'hover:opacity-90 active:opacity-80 transition-opacity'
                  )}
                >
                  Use Response
                </button>
                <button
                  className={cn(
                    'px-4 py-2.5 rounded-lg font-medium text-fluid-sm touch-target',
                    'border border-[hsl(var(--border))] text-[hsl(var(--foreground))]',
                    'hover:bg-[hsl(var(--muted))] active:bg-[hsl(var(--muted))] transition-colors'
                  )}
                >
                  Edit
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Safe area padding for mobile */}
        <div className="h-safe-area-inset-bottom sm:hidden" />
      </div>
    </div>
  );
}

export default AIReasoningOverlay;
