// ============================================================================
// SEARCH: EMAIL_PANEL
// IntelliDesk AI - Email Panel Component (Left side of workspace)
// Shows original email with sender details and body
// ============================================================================

'use client';

import React from 'react';
import { Mail, User, Clock, Building, AlertTriangle } from 'lucide-react';
import { Ticket } from '@/types';
import { formatTimestamp, formatFullDate, cn } from '@/lib/utils';
import { PriorityBadge } from '../PriorityBadge';
import { SLATimer } from '../SLATimer';

interface EmailPanelProps {
  ticket: Ticket;
}

export function EmailPanel({ ticket }: EmailPanelProps) {
  const senderName = ticket.sender.split('@')[0].replace(/[._]/g, ' ');
  const domain = ticket.sender.split('@')[1];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex-shrink-0 p-4 md:p-6 border-b border-slate-700/50">
        {/* Priority & SLA Row */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <PriorityBadge priority={ticket.priority} size="md" />
            <span className="text-xs text-slate-400 font-mono">{ticket.id}</span>
          </div>
          <SLATimer deadline={ticket.sla_deadline} priority={ticket.priority} />
        </div>

        {/* Subject */}
        <h2 className="text-lg md:text-xl font-bold text-white mb-4 leading-tight">
          {ticket.subject}
        </h2>

        {/* Sender Info */}
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div className={cn(
            'flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center',
            'bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold text-sm'
          )}>
            {senderName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-white capitalize">
                {senderName}
              </span>
              <span className="text-slate-400 text-sm truncate">
                &lt;{ticket.sender}&gt;
              </span>
            </div>
            <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatFullDate(ticket.timestamp)}
              </span>
              <span className="flex items-center gap-1">
                <Building className="w-3 h-3" />
                {domain}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Email Body */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        {ticket.email_body ? (
          <div className="prose prose-invert prose-sm max-w-none">
            <pre className="whitespace-pre-wrap font-sans text-slate-300 text-sm leading-relaxed bg-transparent p-0 m-0">
              {ticket.email_body}
            </pre>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-500">
            <Mail className="w-12 h-12 mb-3 opacity-50" />
            <p>Email body not available</p>
          </div>
        )}
      </div>

      {/* Thread indicator */}
      {ticket.thread_count > 1 && (
        <div className="flex-shrink-0 p-3 bg-slate-800/50 border-t border-slate-700/50">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Mail className="w-4 h-4" />
            <span>Part of a thread with {ticket.thread_count} messages</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default EmailPanel;
