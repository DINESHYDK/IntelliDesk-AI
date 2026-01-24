// ============================================================================
// SEARCH: CUSTOMER_SIDEBAR
// IntelliDesk AI - Customer Insight Sidebar - Proper heights
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
import { formatTimestamp, cn } from '@/lib/utils';
import { TierBadge } from '../TierBadge';

interface CustomerSidebarProps {
  ticket: Ticket;
}

export function CustomerSidebar({ ticket }: CustomerSidebarProps) {
  const domain = ticket.sender.split('@')[1];
  const customerData = ticket.customer_data;
  const companyName = customerData?.company_name || domain.split('.')[0].charAt(0).toUpperCase() + domain.split('.')[0].slice(1);

  return (
    <div className="flex flex-col h-full bg-slate-800/50">
      {/* Company Header - Fixed */}
      <div className="flex-shrink-0 p-4 border-b border-slate-700/50">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg flex-shrink-0">
            {companyName.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-white text-base truncate">{companyName}</h3>
            <p className="text-xs text-slate-400 truncate">{domain}</p>
            <div className="mt-2">
              <TierBadge tier={ticket.customer_tier} size="sm" />
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Lead Detection Flag */}
        {customerData?.is_potential_lead && (
          <div className="p-3 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-amber-400 flex-shrink-0" />
              <div>
                <span className="font-semibold text-amber-300 text-sm">Lead Detected</span>
                <p className="text-xs text-amber-200/70">Potential upsell opportunity</p>
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        <div>
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Account Overview
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {customerData?.lifetime_value && (
              <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-700/50">
                <div className="flex items-center gap-1.5 text-emerald-400 mb-1">
                  <DollarSign className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium">Lifetime Value</span>
                </div>
                <span className="text-base font-bold text-white">{customerData.lifetime_value}</span>
              </div>
            )}

            {customerData?.previous_tickets !== undefined && (
              <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-700/50">
                <div className="flex items-center gap-1.5 text-blue-400 mb-1">
                  <Mail className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium">Past Tickets</span>
                </div>
                <span className="text-base font-bold text-white">{customerData.previous_tickets}</span>
              </div>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="space-y-2">
          {customerData?.last_contact && (
            <div className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-900/50 border border-slate-700/50">
              <Clock className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <div className="min-w-0">
                <span className="text-xs text-slate-400 block">Last Contact</span>
                <p className="text-sm text-white truncate">{formatTimestamp(customerData.last_contact)}</p>
              </div>
            </div>
          )}

          {customerData?.account_manager && (
            <div className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-900/50 border border-slate-700/50">
              <User className="w-4 h-4 text-purple-400 flex-shrink-0" />
              <div className="min-w-0">
                <span className="text-xs text-slate-400 block">Account Manager</span>
                <p className="text-sm text-white truncate">{customerData.account_manager}</p>
              </div>
            </div>
          )}
        </div>

        {/* Sentiment */}
        <div>
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Recent Sentiment
          </h4>
          <div className="flex items-center gap-1.5">
            {['😊', '😐', '😤', '😊', '😐'].map((emoji, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full bg-slate-700/50 flex items-center justify-center text-base"
              >
                {emoji}
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-1.5">Last 5 interactions</p>
        </div>
      </div>

      {/* Action Buttons - Fixed at bottom */}
      <div className="flex-shrink-0 p-4 border-t border-slate-700/50 space-y-2">
        <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium transition-colors shadow-lg">
          <Phone className="w-4 h-4" />
          Schedule Call
        </button>
        <button className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-slate-700/50 hover:bg-slate-700 text-slate-200 text-sm font-medium transition-colors">
          <ExternalLink className="w-4 h-4" />
          View Full Profile
        </button>
      </div>
    </div>
  );
}

export default CustomerSidebar;
