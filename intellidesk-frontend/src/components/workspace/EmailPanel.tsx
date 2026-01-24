// ============================================================================
// IntelliDesk AI - Email Panel Component (Workspace Left Panel)
// Clean layout with proper padding and readable email body
// ============================================================================

'use client';

import React from 'react';
import { Mail, Clock, Building, AlertTriangle } from 'lucide-react';
import { Ticket } from '@/types';
import { formatFullDate, calculateSLAStatus, cn, getPriorityStyles } from '@/lib/utils';

interface EmailPanelProps {
  ticket: Ticket;
}

export function EmailPanel({ ticket }: EmailPanelProps) {
  const senderName = ticket.sender.split('@')[0].replace(/[._]/g, ' ');
  const domain = ticket.sender.split('@')[1];
  const slaStatus = calculateSLAStatus(ticket.sla_deadline);
  const pStyle = getPriorityStyles(ticket.priority);

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header Section */}
      <div className="flex-shrink-0 p-5 border-b border-border">
        {/* Priority & SLA Row */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className={cn(
            'inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border',
            pStyle.border, pStyle.bg
          )}>
            {ticket.priority === 'P1' && <AlertTriangle className={cn('w-4 h-4', pStyle.text)} />}
            <span className={cn('text-sm font-bold', pStyle.text)}>{ticket.priority}</span>
          </div>
          
          {/* SLA Status */}
          {slaStatus.isBreached ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-destructive/20 border border-destructive/50">
              <AlertTriangle className="w-4 h-4 text-destructive animate-pulse" />
              <span className="text-sm font-bold text-destructive">SLA BREACHED</span>
            </div>
          ) : (
            <div className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-lg',
              slaStatus.isCritical ? 'bg-urgent/10 text-urgent' :
                slaStatus.isWarning ? 'bg-high/10 text-high' : 
                  'bg-muted text-muted-foreground'
            )}>
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">{slaStatus.displayText}</span>
            </div>
          )}
        </div>

        {/* Subject */}
        <h2 className="text-xl font-bold text-foreground mb-4 leading-tight">
          {ticket.subject}
        </h2>

        {/* Sender Info Card */}
        <div className="flex items-center gap-4 p-3 rounded-xl bg-card border border-border">
          {/* Avatar */}
          <div className={cn(
            'flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center',
            'bg-gradient-to-br from-primary to-accent text-primary-foreground font-bold text-sm'
          )}>
            {senderName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-foreground capitalize">
                {senderName}
              </span>
              <span className="text-muted-foreground text-sm truncate">
                &lt;{ticket.sender}&gt;
              </span>
            </div>
            <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
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
          <div className="bg-muted/30 rounded-xl p-5 border border-border">
            <div className="text-foreground text-sm leading-relaxed whitespace-pre-wrap">
              {ticket.email_body}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
            <Mail className="w-10 h-10 mb-3 opacity-50" />
            <p className="text-sm">Email body not available</p>
          </div>
        )}
      </div>

      {/* Thread Indicator */}
      {ticket.thread_count > 1 && (
        <div className="flex-shrink-0 px-5 py-3 bg-muted/50 border-t border-border">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="w-4 h-4" />
            <span>Part of a thread with <strong className="text-foreground">{ticket.thread_count}</strong> messages</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default EmailPanel;
