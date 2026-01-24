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
  ExternalLink,
  Crown,
  Medal,
  Award
} from 'lucide-react';
import { Ticket } from '@/types';
import { formatTimestamp, cn } from '@/lib/utils';

interface CustomerSidebarProps {
  ticket: Ticket;
}

// Tier styles
const tierStyles: Record<string, { icon: React.ReactNode; text: string; bg: string; border: string }> = {
  Gold: { icon: <Crown className="w-4 h-4" />, text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30' },
  Silver: { icon: <Medal className="w-4 h-4" />, text: 'text-slate-300', bg: 'bg-slate-500/10', border: 'border-slate-500/30' },
  Bronze: { icon: <Award className="w-4 h-4" />, text: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30' },
};

export function CustomerSidebar({ ticket }: CustomerSidebarProps) {
  const domain = ticket.sender.split('@')[1];
  const customerData = ticket.customer_data;
  const companyName = customerData?.company_name || domain.split('.')[0].charAt(0).toUpperCase() + domain.split('.')[0].slice(1);
  const tStyle = tierStyles[ticket.customer_tier] || tierStyles.Bronze;

  return (
    <div className="flex flex-col h-full bg-slate-800/50">
      {/* Company Header */}
      <div className="flex-shrink-0 p-5 border-b border-slate-700/50">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg flex-shrink-0">
            {companyName.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-white text-lg truncate">{companyName}</h3>
            <p className="text-sm text-slate-400 truncate mb-2">{domain}</p>
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
          <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/15 to-orange-500/15 border border-amber-500/40">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/30 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <span className="font-semibold text-amber-300 text-sm">🔥 Lead Detected</span>
                <p className="text-xs text-amber-200/70">Potential upsell opportunity</p>
              </div>
            </div>
          </div>
        )}

        {/* Account Overview */}
        <div>
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            Account Overview
          </h4>
          <div className="grid grid-cols-2 gap-3">
            {customerData?.lifetime_value && (
              <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-700/50">
                <div className="flex items-center gap-2 text-emerald-400 mb-2">
                  <DollarSign className="w-4 h-4" />
                  <span className="text-xs font-medium">Lifetime Value</span>
                </div>
                <span className="text-xl font-bold text-white">{customerData.lifetime_value}</span>
              </div>
            )}

            {customerData?.previous_tickets !== undefined && (
              <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-700/50">
                <div className="flex items-center gap-2 text-blue-400 mb-2">
                  <Mail className="w-4 h-4" />
                  <span className="text-xs font-medium">Past Tickets</span>
                </div>
                <span className="text-xl font-bold text-white">{customerData.previous_tickets}</span>
              </div>
            )}
          </div>
        </div>

        {/* Contact Details */}
        <div className="space-y-3">
          {customerData?.last_contact && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/50 border border-slate-700/50">
              <Clock className="w-5 h-5 text-slate-400 flex-shrink-0" />
              <div className="min-w-0">
                <span className="text-xs text-slate-400 block">Last Contact</span>
                <p className="text-sm text-white font-medium truncate">{formatTimestamp(customerData.last_contact)}</p>
              </div>
            </div>
          )}

          {customerData?.account_manager && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/50 border border-slate-700/50">
              <User className="w-5 h-5 text-purple-400 flex-shrink-0" />
              <div className="min-w-0">
                <span className="text-xs text-slate-400 block">Account Manager</span>
                <p className="text-sm text-white font-medium truncate">{customerData.account_manager}</p>
              </div>
            </div>
          )}
        </div>

        {/* Sentiment History */}
        <div>
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            Recent Sentiment
          </h4>
          <div className="flex items-center gap-2">
            {['😊', '😐', '😤', '😊', '😐'].map((emoji, i) => (
              <div
                key={i}
                className="w-9 h-9 rounded-full bg-slate-700/50 flex items-center justify-center text-lg hover:scale-110 transition-transform cursor-default"
                title={`Interaction ${i + 1}`}
              >
                {emoji}
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-2">Last 5 interactions</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex-shrink-0 p-5 border-t border-slate-700/50 space-y-3">
        <button className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium transition-colors shadow-lg shadow-blue-500/25">
          <Phone className="w-4 h-4" />
          Schedule Call
        </button>
        <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-700/50 hover:bg-slate-700 text-slate-200 text-sm font-medium transition-colors">
          <ExternalLink className="w-4 h-4" />
          View Full Profile
        </button>
      </div>
    </div>
  );
}

export default CustomerSidebar;
