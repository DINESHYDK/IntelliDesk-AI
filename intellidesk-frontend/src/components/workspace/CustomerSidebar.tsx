// ============================================================================
// SEARCH: CUSTOMER_SIDEBAR
// IntelliDesk AI - Customer Insight Sidebar
// Shows customer context: company, tier, lead detection, history
// ============================================================================

'use client';

import React, { useState } from 'react';
import { 
  Building2, 
  Crown, 
  Star, 
  Medal,
  TrendingUp,
  Clock,
  User,
  ChevronDown,
  ChevronUp,
  Sparkles,
  DollarSign,
  Mail,
  Phone
} from 'lucide-react';
import { Ticket, CustomerTier, CustomerData } from '@/types';
import { formatTimestamp, cn } from '@/lib/utils';
import { TierBadge } from '../TierBadge';

interface CustomerSidebarProps {
  ticket: Ticket;
  isCollapsed?: boolean;
  onToggle?: () => void;
}

export function CustomerSidebar({ ticket, isCollapsed = false, onToggle }: CustomerSidebarProps) {
  const domain = ticket.sender.split('@')[1];
  const customerData = ticket.customer_data;

  // Fallback if no customer data
  const companyName = customerData?.company_name || domain.split('.')[0].charAt(0).toUpperCase() + domain.split('.')[0].slice(1);

  return (
    <div className={cn(
      'flex flex-col bg-slate-800/50 border-l border-slate-700/50',
      'transition-all duration-300',
      isCollapsed ? 'w-0 overflow-hidden' : 'w-full lg:w-80'
    )}>
      {/* Mobile Toggle Header */}
      <button
        onClick={onToggle}
        className="lg:hidden flex items-center justify-between p-4 border-b border-slate-700/50 hover:bg-slate-700/30"
      >
        <span className="font-semibold text-white flex items-center gap-2">
          <Building2 className="w-4 h-4 text-blue-400" />
          Customer Insights
        </span>
        {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
      </button>

      {/* Content */}
      <div className={cn('flex-1 overflow-y-auto', isCollapsed && 'lg:block hidden')}>
        {/* Company Header */}
        <div className="p-4 border-b border-slate-700/50">
          <div className="flex items-start gap-3">
            {/* Company Logo Placeholder */}
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
              {companyName.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-white truncate">{companyName}</h3>
              <p className="text-xs text-slate-400 truncate">{domain}</p>
              <div className="mt-2">
                <TierBadge tier={ticket.customer_tier} size="sm" />
              </div>
            </div>
          </div>
        </div>

        {/* Lead Detection Flag */}
        {customerData?.is_potential_lead && (
          <div className="mx-4 mt-4 p-3 rounded-lg bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-amber-400" />
              <div>
                <span className="font-semibold text-amber-300 text-sm">Lead Detected</span>
                <p className="text-xs text-amber-200/70">Potential upsell opportunity</p>
              </div>
            </div>
          </div>
        )}

        {/* Customer Stats */}
        <div className="p-4 space-y-3">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Account Overview
          </h4>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-2">
            {/* Lifetime Value */}
            {customerData?.lifetime_value && (
              <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-700/50">
                <div className="flex items-center gap-1.5 text-emerald-400 mb-1">
                  <DollarSign className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium">Lifetime Value</span>
                </div>
                <span className="text-lg font-bold text-white">{customerData.lifetime_value}</span>
              </div>
            )}

            {/* Previous Tickets */}
            {customerData?.previous_tickets !== undefined && (
              <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-700/50">
                <div className="flex items-center gap-1.5 text-blue-400 mb-1">
                  <Mail className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium">Past Tickets</span>
                </div>
                <span className="text-lg font-bold text-white">{customerData.previous_tickets}</span>
              </div>
            )}
          </div>

          {/* Last Contact */}
          {customerData?.last_contact && (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-900/50 border border-slate-700/50">
              <Clock className="w-4 h-4 text-slate-400" />
              <div>
                <span className="text-xs text-slate-400">Last Contact</span>
                <p className="text-sm text-white">{formatTimestamp(customerData.last_contact)}</p>
              </div>
            </div>
          )}

          {/* Account Manager */}
          {customerData?.account_manager && (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-900/50 border border-slate-700/50">
              <User className="w-4 h-4 text-purple-400" />
              <div>
                <span className="text-xs text-slate-400">Account Manager</span>
                <p className="text-sm text-white">{customerData.account_manager}</p>
              </div>
            </div>
          )}
        </div>

        {/* Sentiment History */}
        <div className="p-4 border-t border-slate-700/50">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Recent Sentiment
          </h4>
          <div className="flex items-center gap-1">
            {/* Sentiment dots visualization */}
            {['😊', '😐', '😤', '😊', '😐'].map((emoji, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full bg-slate-700/50 flex items-center justify-center text-sm"
                title={`Ticket ${i + 1}`}
              >
                {emoji}
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-2">Last 5 interactions</p>
        </div>

        {/* Quick Actions */}
        <div className="p-4 border-t border-slate-700/50">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Quick Actions
          </h4>
          <div className="space-y-2">
            <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-200 text-sm transition-colors">
              <Phone className="w-4 h-4" />
              Schedule Call
            </button>
            <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-200 text-sm transition-colors">
              <Sparkles className="w-4 h-4" />
              View AI Insights
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomerSidebar;
