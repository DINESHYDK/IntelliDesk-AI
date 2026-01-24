// ============================================================================
// IntelliDesk AI - Customer Insight Sidebar
// Clean layout with proper padding and organized sections
// ============================================================================

'use client';

import React from 'react';
import { 
  TrendingUp,
  Clock,
  User,
  DollarSign,
  Mail,
  Phone,
  ExternalLink
} from 'lucide-react';
import { Ticket } from '@/types';
import { formatTimestamp, cn, getTierStyles } from '@/lib/utils';
import { Button } from '../ui/button';

interface CustomerSidebarProps {
  ticket: Ticket;
}

export function CustomerSidebar({ ticket }: CustomerSidebarProps) {
  const domain = ticket.sender.split('@')[1];
  const customerData = ticket.customer_data;
  const companyName = customerData?.company_name || domain.split('.')[0].charAt(0).toUpperCase() + domain.split('.')[0].slice(1);
  const tStyle = getTierStyles(ticket.customer_tier);

  return (
    <div className="flex flex-col h-full bg-card/50">
      {/* Company Header */}
      <div className="flex-shrink-0 p-5 border-b border-border">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold text-xl shadow-lg flex-shrink-0">
            {companyName.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-foreground text-lg truncate">{companyName}</h3>
            <p className="text-sm text-muted-foreground truncate mb-2">{domain}</p>
            <div className={cn(
              'inline-flex items-center gap-2 px-2.5 py-1 rounded-lg border',
              tStyle.bg, tStyle.border
            )}>
              <span className={tStyle.text}>{tStyle.icon}</span>
              <span className={cn('text-sm font-semibold', tStyle.text)}>{ticket.customer_tier}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {/* Lead Detection */}
        {customerData?.is_potential_lead && (
          <div className="p-4 rounded-xl bg-gradient-to-r from-high/15 to-urgent/15 border border-high/40">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-high/30 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-high" />
              </div>
              <div>
                <span className="font-semibold text-high text-sm">🔥 Lead Detected</span>
                <p className="text-xs text-high/70">Potential upsell opportunity</p>
              </div>
            </div>
          </div>
        )}

        {/* Account Overview */}
        <div>
          <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
            Account Overview
          </h4>
          <div className="grid grid-cols-2 gap-3">
            {customerData?.lifetime_value && (
              <div className="p-4 rounded-xl bg-card border border-border">
                <div className="flex items-center gap-2 text-confidence-high mb-2">
                  <DollarSign className="w-4 h-4" />
                  <span className="text-xs font-medium">Lifetime Value</span>
                </div>
                <span className="text-xl font-bold text-foreground">{customerData.lifetime_value}</span>
              </div>
            )}

            {customerData?.previous_tickets !== undefined && (
              <div className="p-4 rounded-xl bg-card border border-border">
                <div className="flex items-center gap-2 text-primary mb-2">
                  <Mail className="w-4 h-4" />
                  <span className="text-xs font-medium">Past Tickets</span>
                </div>
                <span className="text-xl font-bold text-foreground">{customerData.previous_tickets}</span>
              </div>
            )}
          </div>
        </div>

        {/* Contact Details */}
        <div className="space-y-3">
          {customerData?.last_contact && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border">
              <Clock className="w-5 h-5 text-muted-foreground flex-shrink-0" />
              <div className="min-w-0">
                <span className="text-xs text-muted-foreground block">Last Contact</span>
                <p className="text-sm text-foreground font-medium truncate">{formatTimestamp(customerData.last_contact)}</p>
              </div>
            </div>
          )}

          {customerData?.account_manager && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border">
              <User className="w-5 h-5 text-accent flex-shrink-0" />
              <div className="min-w-0">
                <span className="text-xs text-muted-foreground block">Account Manager</span>
                <p className="text-sm text-foreground font-medium truncate">{customerData.account_manager}</p>
              </div>
            </div>
          )}
        </div>

        {/* Sentiment History */}
        <div>
          <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
            Recent Sentiment
          </h4>
          <div className="flex items-center gap-2">
            {['😊', '😐', '😤', '😊', '😐'].map((emoji, i) => (
              <div
                key={i}
                className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-lg hover:scale-110 transition-transform cursor-default"
                title={`Interaction ${i + 1}`}
              >
                {emoji}
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2">Last 5 interactions</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex-shrink-0 p-5 border-t border-border space-y-3">
        <Button className="w-full gap-2 shadow-lg shadow-primary/25">
          <Phone className="w-4 h-4" />
          Schedule Call
        </Button>
        <Button variant="secondary" className="w-full gap-2">
          <ExternalLink className="w-4 h-4" />
          View Full Profile
        </Button>
      </div>
    </div>
  );
}

export default CustomerSidebar;
