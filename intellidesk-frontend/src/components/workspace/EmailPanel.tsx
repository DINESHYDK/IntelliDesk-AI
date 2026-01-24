// ============================================================================
// IntelliDesk AI - Email Panel Component (Workspace Left Panel)
// Clean layout with proper padding and readable email body
// ============================================================================

'use client';

import React from 'react';
import { Mail, Clock, Building, AlertTriangle, User } from 'lucide-react';
import { Ticket } from '@/types';
import { formatFullDate, calculateSLAStatus, cn } from '@/lib/utils';

interface EmailPanelProps {
  ticket: Ticket;
}

// Priority styles
const priorityStyles: Record<string, { border: string; text: string; bg: string; label: string }> = {
  P1: { border: 'border-red-500/50', text: 'text-red-500', bg: 'bg-red-500/10', label: 'Critical' },
  P2: { border: 'border-orange-500/50', text: 'text-orange-500', bg: 'bg-orange-500/10', label: 'High' },
  P3: { border: 'border-blue-500/50', text: 'text-blue-500', bg: 'bg-blue-500/10', label: 'Medium' },
  P4: { border: 'border-slate-500/50', text: 'text-slate-400', bg: 'bg-slate-500/10', label: 'Low' },
};

export function EmailPanel({ ticket }: EmailPanelProps) {
  const senderName = ticket.sender.split('@')[0].replace(/[._]/g, ' ');
  const domain = ticket.sender.split('@')[1];
  const slaStatus = calculateSLAStatus(ticket.sla_deadline);
  const pStyle = priorityStyles[ticket.priority] || priorityStyles.P3;

  return (
    <div className="flex flex-col h-full bg-slate-900">
      {/* Header Section */}
      <div className="flex-shrink-0 p-5 border-b border-slate-700/50">
        {/* Priority & SLA Row */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className={cn(
            'inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border',
            pStyle.border, pStyle.bg
          )}>
            {ticket.priority === 'P1' && <AlertTriangle className={cn('w-4 h-4', pStyle.text)} />}
            <span className={cn('text-sm font-bold', pStyle.text)}>{ticket.priority}</span>
            <span className={cn('text-xs', pStyle.text)}>• {pStyle.label}</span>
          </div>
          
          {/* SLA Status */}
          {slaStatus.isBreached ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/20 border border-red-500/50">
              <AlertTriangle className="w-4 h-4 text-red-500 animate-pulse" />
              <span className="text-sm font-bold text-red-500">SLA BREACHED</span>
            </div>
          ) : (
            <div className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-lg',
              slaStatus.isCritical ? 'bg-red-500/10 text-red-400' :
                slaStatus.isWarning ? 'bg-orange-500/10 text-orange-400' : 
                  'bg-slate-700/50 text-slate-300'
            )}>
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">{slaStatus.displayText}</span>
            </div>
          )}
        </div>

        {/* Subject */}
        <h2 className="text-xl font-bold text-white mb-4 leading-tight">
          {ticket.subject}
        </h2>

        {/* Sender Info Card */}
        <div className="flex items-center gap-4 p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
          {/* Avatar */}
          <div className={cn(
            'flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center',
            'bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-sm'
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
            <div className="flex items-center gap-3 mt-1 text-sm text-slate-400">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {formatFullDate(ticket.timestamp)}
              </span>
              <span className="flex items-center gap-1">
                <Building className="w-3.5 h-3.5" />
                {domain}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Email Body - Scrollable */}
      <div className="flex-1 overflow-y-auto p-5">
        {ticket.email_body ? (
          <div className="bg-slate-800/30 rounded-xl p-5 border border-slate-700/30">
            <div className="text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">
              {ticket.email_body}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-40 text-slate-500">
            <Mail className="w-10 h-10 mb-3 opacity-50" />
            <p className="text-sm">Email body not available</p>
          </div>
        )}
      </div>

      {/* Thread Indicator */}
      {ticket.thread_count > 1 && (
        <div className="flex-shrink-0 px-5 py-3 bg-slate-800/50 border-t border-slate-700/50">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Mail className="w-4 h-4" />
            <span>Part of a thread with <strong className="text-white">{ticket.thread_count}</strong> messages</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default EmailPanel;
