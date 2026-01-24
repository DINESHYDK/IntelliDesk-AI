// ============================================================================
// SEARCH: AI_RESPONSE_PANEL
// IntelliDesk AI - AI Response Panel (Right side of workspace)
// Shows AI-generated response with match quality - proper heights
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
  ExternalLink
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
    <div className="flex flex-col h-full">
      {/* Header - Fixed */}
      <div className="flex-shrink-0 p-4 md:p-5 border-b border-slate-700/50 bg-slate-900/80">
        {/* Match Quality Badge */}
        <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <span className="font-semibold text-white">AI Response</span>
          </div>
          <MatchQualityBadge confidence={confidence} size="sm" />
        </div>

        {/* Category & Metadata */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="px-2 py-1 rounded-lg bg-purple-500/20 text-purple-300 font-medium">
            {ticket.ai_analysis.category}
          </span>
          <span className="px-2 py-1 rounded-lg bg-slate-700 text-slate-300">
            Status: {ticket.status}
          </span>
          <span className="px-2 py-1 rounded-lg bg-slate-700 text-slate-300">
            Sentiment: {ticket.ai_analysis.sentiment}
          </span>
        </div>
      </div>

      {/* Response Body - Scrollable */}
      <div className="flex-1 overflow-y-auto p-4 md:p-5">
        {ticket.ai_draft_response ? (
          <div className="space-y-4">
            {/* Response Text */}
            <div className={cn(
              'relative rounded-xl border p-4',
              'bg-gradient-to-br from-slate-800/80 to-slate-900/80',
              'border-purple-500/30'
            )}>
              {/* AI Badge */}
              <div className="absolute -top-2.5 left-4 px-2 py-0.5 bg-purple-500/20 border border-purple-500/40 rounded-md text-xs text-purple-300 font-medium">
                AI Generated
              </div>

              {isEditing ? (
                <textarea
                  value={editedResponse}
                  onChange={(e) => setEditedResponse(e.target.value)}
                  className="w-full min-h-[200px] bg-transparent text-slate-200 text-sm leading-relaxed resize-none focus:outline-none mt-2"
                />
              ) : (
                <pre className="whitespace-pre-wrap font-sans text-slate-200 text-sm leading-relaxed mt-2 break-words">
                  {editedResponse}
                </pre>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium',
                  'transition-all duration-200',
                  isEditing
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                )}
              >
                <Edit3 className="w-4 h-4" />
                {isEditing ? 'Save' : 'Edit Response'}
              </button>
              
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-700 text-slate-200 hover:bg-slate-600 text-sm font-medium transition-all"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>

              <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium transition-all ml-auto shadow-lg">
                <Send className="w-4 h-4" />
                Send Response
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-32 text-slate-500">
            <Sparkles className="w-8 h-8 mb-2 opacity-50" />
            <p className="text-sm">No AI response generated</p>
          </div>
        )}
      </div>

      {/* Solution Links Section - Fixed at bottom */}
      {ticket.solution_links && ticket.solution_links.length > 0 && (
        <div className="flex-shrink-0 p-4 md:p-5 border-t border-slate-700/50 bg-slate-800/50">
          <h4 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-blue-400" />
            Related Resources
          </h4>
          <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto">
            {ticket.solution_links.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg border',
                  'transition-all duration-200',
                  linkTypeColors[link.type]
                )}
              >
                {linkTypeIcons[link.type]}
                <span className="flex-1 text-sm font-medium truncate">{link.title}</span>
                <ExternalLink className="w-3 h-3 opacity-50 flex-shrink-0" />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default AIResponsePanel;
