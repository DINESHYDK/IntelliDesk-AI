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
import { Ticket, SolutionLink } from '@/types';
import { cn } from '@/lib/utils';
import { MatchQualityBadge } from './MatchQualityBadge';

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
  video: 'text-red-400 bg-red-500/10 border-red-500/30 hover:bg-red-500/20',
  doc: 'text-blue-400 bg-blue-500/10 border-blue-500/30 hover:bg-blue-500/20',
  manual: 'text-purple-400 bg-purple-500/10 border-purple-500/30 hover:bg-purple-500/20',
  faq: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30 hover:bg-emerald-500/20',
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
    <div className="flex flex-col h-full bg-slate-900/50">
      {/* Header - Always visible */}
      <div className="flex-shrink-0 p-5 border-b border-slate-700/50">
        {/* Title Row */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-purple-500/20">
              <Sparkles className="w-5 h-5 text-purple-400" />
            </div>
            <h2 className="text-lg font-bold text-white">AI Response</h2>
          </div>
          <MatchQualityBadge confidence={confidence} size="sm" />
        </div>

        {/* Metadata Tags */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-300 text-xs font-medium">
            {ticket.ai_analysis.category}
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-slate-700 text-slate-300 text-xs">
            Status: {ticket.status}
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-slate-700 text-slate-300 text-xs">
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
              'bg-gradient-to-br from-slate-800/80 to-slate-900/80',
              'border-purple-500/30'
            )}>
              {/* AI Badge */}
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-700/50">
                <CheckCircle2 className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-medium text-purple-300">AI Generated Response</span>
              </div>

              {isEditing ? (
                <textarea
                  value={editedResponse}
                  onChange={(e) => setEditedResponse(e.target.value)}
                  className="w-full min-h-[250px] bg-slate-800/50 text-slate-200 text-sm leading-relaxed resize-none focus:outline-none rounded-lg p-3 border border-slate-600"
                />
              ) : (
                <div className="text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">
                  {editedResponse}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium',
                  'transition-all duration-200',
                  isEditing
                    ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                    : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                )}
              >
                <Edit3 className="w-4 h-4" />
                {isEditing ? 'Save Changes' : 'Edit Response'}
              </button>
              
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-700 text-slate-200 hover:bg-slate-600 text-sm font-medium transition-all"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>

              <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium transition-all ml-auto shadow-lg shadow-blue-500/25">
                <Send className="w-4 h-4" />
                Send Response
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-40 text-slate-500">
            <Sparkles className="w-10 h-10 mb-3 opacity-50" />
            <p className="text-sm font-medium">No AI response generated yet</p>
          </div>
        )}
      </div>

      {/* Solution Links - Fixed at bottom */}
      {ticket.solution_links && ticket.solution_links.length > 0 && (
        <div className="flex-shrink-0 p-5 border-t border-slate-700/50 bg-slate-800/30">
          <h4 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-blue-400" />
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
