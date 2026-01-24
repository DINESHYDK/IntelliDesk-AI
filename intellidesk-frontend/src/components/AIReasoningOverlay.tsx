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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className={cn(
          'relative w-full max-w-lg rounded-2xl overflow-hidden',
          'bg-[hsl(var(--card))] border-2',
          'animate-slide-in-right shadow-2xl',
          confidenceStyles.border
        )}
      >
        {/* Header with gradient */}
        <div 
          className={cn(
            'relative px-6 py-4 border-b border-[hsl(var(--border))]',
            'bg-gradient-to-r from-[hsl(var(--primary)/0.1)] to-transparent'
          )}
        >
          {/* AI Badge */}
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-[hsl(var(--primary)/0.15)] text-[hsl(var(--primary))]">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="text-xs font-semibold">AI Analysis</span>
            </div>
            <span className="text-xs text-[hsl(var(--muted-foreground))]">
              Ticket {ticketId}
            </span>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className={cn(
              'absolute top-4 right-4 p-1.5 rounded-lg',
              'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]',
              'hover:bg-[hsl(var(--muted))] transition-colors'
            )}
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Category and Confidence */}
          <div className="flex items-center justify-between mt-2">
            <h3 className="text-xl font-bold text-[hsl(var(--foreground))]">
              {analysis.category}
            </h3>
            <div 
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-full border',
                confidenceStyles.bg,
                confidenceStyles.border
              )}
            >
              {analysis.confidence >= 80 ? (
                <CheckCircle2 className={cn('w-4 h-4', confidenceStyles.text)} />
              ) : (
                <AlertCircle className={cn('w-4 h-4', confidenceStyles.text)} />
              )}
              <span className={cn('text-sm font-bold', confidenceStyles.text)}>
                {analysis.confidence}%
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Confidence Status */}
          <div 
            className={cn(
              'flex items-center gap-2 px-4 py-3 rounded-lg border',
              confidenceStyles.bg,
              confidenceStyles.border
            )}
          >
            <Brain className={cn('w-5 h-5', confidenceStyles.text)} />
            <div>
              <span className={cn('font-semibold', confidenceStyles.text)}>
                {confidenceStyles.label}
              </span>
              {confidenceStyles.needsReview && (
                <p className="text-xs text-[hsl(var(--muted-foreground))]">
                  Human review recommended before auto-response
                </p>
              )}
            </div>
          </div>

          {/* Reasoning Section */}
          <div>
            <h4 className="text-sm font-semibold text-[hsl(var(--foreground))] mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[hsl(var(--primary))]" />
              AI Reasoning
            </h4>
            <div className="p-4 rounded-lg bg-[hsl(var(--muted)/0.3)] border border-[hsl(var(--border))]">
              <p className="text-sm text-[hsl(var(--foreground))] leading-relaxed">
                "{analysis.reasoning}"
              </p>
            </div>
          </div>

          {/* Sentiment */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-[hsl(var(--muted-foreground))]">
              Customer Sentiment:
            </span>
            <div 
              className={cn(
                'flex items-center gap-1.5 px-3 py-1 rounded-full',
                sentimentStyles.bg
              )}
            >
              <span className="text-lg">{sentimentStyles.emoji}</span>
              <span className={cn('text-sm font-medium', sentimentStyles.text)}>
                {analysis.sentiment}
              </span>
            </div>
          </div>

          {/* AI Draft Response (if available) */}
          {draftResponse && (
            <div>
              <h4 className="text-sm font-semibold text-[hsl(var(--foreground))] mb-2 flex items-center gap-2">
                <Brain className="w-4 h-4 text-[hsl(var(--accent))]" />
                Suggested Response
              </h4>
              <div 
                className={cn(
                  'p-4 rounded-lg border-l-4',
                  'bg-[hsl(var(--accent)/0.05)] border-[hsl(var(--accent))]'
                )}
              >
                <p className="text-sm text-[hsl(var(--foreground))] leading-relaxed italic">
                  "{draftResponse}"
                </p>
              </div>
              <div className="flex gap-2 mt-3">
                <button 
                  className={cn(
                    'flex-1 px-4 py-2 rounded-lg font-medium text-sm',
                    'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]',
                    'hover:opacity-90 transition-opacity'
                  )}
                >
                  Use Response
                </button>
                <button 
                  className={cn(
                    'px-4 py-2 rounded-lg font-medium text-sm',
                    'border border-[hsl(var(--border))] text-[hsl(var(--foreground))]',
                    'hover:bg-[hsl(var(--muted))] transition-colors'
                  )}
                >
                  Edit
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AIReasoningOverlay;
