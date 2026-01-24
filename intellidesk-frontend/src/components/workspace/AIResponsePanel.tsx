// ============================================================================
// IntelliDesk AI - AI Response Panel (Workspace Right Panel)
// Clean layout with proper padding and visible header
// ============================================================================

'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  Edit3, 
  Copy, 
  Check,
  Video,
  FileText,
  BookOpen,
  HelpCircle,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';
import { Ticket } from '@/types';
import { cn } from '@/lib/utils';
import { MatchQualityBadge } from './MatchQualityBadge';
import { Button } from '@/components/ui/button';

interface AIResponsePanelProps {
  ticket: Ticket;
}

const linkTypeIcons: Record<string, React.ReactNode> = {
  video: <Video className="w-4 h-4" />,
  doc: <FileText className="w-4 h-4" />,
  manual: <BookOpen className="w-4 h-4" />,
  faq: <HelpCircle className="w-4 h-4" />,
};

const linkTypeColors: Record<string, string> = {
  video: 'text-destructive bg-destructive/10 border-destructive/30 hover:bg-destructive/20',
  doc: 'text-primary bg-primary/10 border-primary/30 hover:bg-primary/20',
  manual: 'text-accent bg-accent/10 border-accent/30 hover:bg-accent/20',
  faq: 'text-success bg-success/10 border-success/30 hover:bg-success/20',
};

export function AIResponsePanel({ ticket }: AIResponsePanelProps) {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedResponse, setEditedResponse] = useState(ticket.ai_draft_response || '');

  const handleCopy = () => {
    navigator.clipboard.writeText(editedResponse);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const confidence = ticket.ai_analysis.confidence;

  return (
    <div className="flex flex-col h-full bg-card/50">
      {/* Header - Always visible */}
      <div className="flex-shrink-0 p-5 border-b border-border">
        {/* Title Row */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-accent/20">
              <Sparkles className="w-5 h-5 text-accent" />
            </div>
            <h2 className="text-lg font-bold text-foreground">AI Response</h2>
          </div>
          <MatchQualityBadge confidence={confidence} size="sm" />
        </div>

        {/* Metadata Tags */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-2.5 py-1 rounded-lg bg-accent/20 text-accent text-xs font-medium">
            {ticket.ai_analysis.category}
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-muted text-muted-foreground text-xs">
            Status: {ticket.status}
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-muted text-muted-foreground text-xs">
            Sentiment: {ticket.ai_analysis.sentiment}
          </span>
        </div>
      </div>

      {/* Response Body - Scrollable */}
      <div className="flex-1 overflow-y-auto p-5">
        {ticket.ai_draft_response ? (
          <div className="space-y-5">
            {/* Response Card */}
            <div className={cn(
              'relative rounded-xl border p-5',
              'bg-gradient-to-br from-card to-background',
              'border-accent/30'
            )}>
              {/* AI Badge */}
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
                <CheckCircle2 className="w-4 h-4 text-accent" />
                <span className="text-xs font-medium text-accent">AI Generated Response</span>
              </div>

              {isEditing ? (
                <textarea
                  value={editedResponse}
                  onChange={(e) => setEditedResponse(e.target.value)}
                  className="w-full min-h-[250px] bg-background text-foreground text-sm leading-relaxed resize-none focus:outline-none rounded-lg p-3 border border-border"
                />
              ) : (
                <div className="text-foreground text-sm leading-relaxed whitespace-pre-wrap">
                  {editedResponse}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <Button
                variant={isEditing ? 'default' : 'secondary'}
                onClick={() => setIsEditing(!isEditing)}
                className={cn(
                  'flex items-center gap-2',
                  isEditing && 'bg-success hover:bg-success/90 text-success-foreground'
                )}
              >
                <Edit3 className="w-4 h-4" />
                {isEditing ? 'Save Changes' : 'Edit Response'}
              </Button>
              
              <Button
                variant="secondary"
                onClick={handleCopy}
                className="flex items-center gap-2"
              >
                {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy'}
              </Button>

              <Button className="flex items-center gap-2 ml-auto shadow-lg shadow-primary/25">
                <Send className="w-4 h-4" />
                Send Response
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
            <Sparkles className="w-10 h-10 mb-3 opacity-50" />
            <p className="text-sm font-medium">No AI response generated yet</p>
          </div>
        )}
      </div>

      {/* Solution Links - Fixed at bottom */}
      {ticket.solution_links && ticket.solution_links.length > 0 && (
        <div className="flex-shrink-0 p-5 border-t border-border bg-muted/30">
          <h4 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-primary" />
            Related Resources
          </h4>
          <div className="space-y-2 max-h-36 overflow-y-auto">
            {ticket.solution_links.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg border',
                  'transition-all duration-200',
                  linkTypeColors[link.type]
                )}
              >
                {linkTypeIcons[link.type]}
                <span className="flex-1 text-sm font-medium truncate">{link.title}</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-50 flex-shrink-0" />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default AIResponsePanel;
