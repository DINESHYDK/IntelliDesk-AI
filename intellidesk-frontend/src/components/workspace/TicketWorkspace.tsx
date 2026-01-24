// ============================================================================
// SEARCH: TICKET_WORKSPACE
// IntelliDesk AI - Ticket Resolution Workspace
// Full slide-over panel with Email, AI Response, and Customer Sidebar
// ============================================================================

'use client';

import React, { useState } from 'react';
import { 
  X, 
  ChevronLeft, 
  Maximize2, 
  Minimize2,
  Users
} from 'lucide-react';
import { Ticket } from '@/types';
import { cn } from '@/lib/utils';
import { EmailPanel } from './EmailPanel';
import { AIResponsePanel } from './AIResponsePanel';
import { CustomerSidebar } from './CustomerSidebar';

interface TicketWorkspaceProps {
  ticket: Ticket;
  onClose: () => void;
}

export function TicketWorkspace({ ticket, onClose }: TicketWorkspaceProps) {
  const [showSidebar, setShowSidebar] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <div 
      className={cn(
        'fixed inset-0 z-50 flex flex-col',
        'bg-slate-900/95 backdrop-blur-sm',
        'animate-fade-in'
      )}
    >
      {/* Header Bar */}
      <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 bg-slate-800/80 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-700/50 text-slate-300 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="text-sm font-medium hidden sm:inline">Back to Queue</span>
          </button>
          <div className="h-4 w-px bg-slate-700" />
          <span className="text-sm text-slate-400 font-mono">{ticket.id}</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Toggle Customer Sidebar */}
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
              showSidebar
                ? 'bg-blue-500/20 text-blue-400'
                : 'hover:bg-slate-700/50 text-slate-400'
            )}
          >
            <Users className="w-4 h-4" />
            <span className="hidden sm:inline">Customer</span>
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-white transition-colors"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Close */}
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Two-Column Layout: Email + AI Response */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Left Panel: Original Email */}
          <div className={cn(
            'flex-1 flex flex-col overflow-hidden',
            'bg-slate-900 border-r border-slate-700/50'
          )}>
            <EmailPanel ticket={ticket} />
          </div>

          {/* Right Panel: AI Response */}
          <div className="flex-1 flex flex-col overflow-hidden bg-slate-900/80">
            <AIResponsePanel ticket={ticket} />
          </div>
        </div>

        {/* Customer Sidebar (Collapsible) */}
        <CustomerSidebar 
          ticket={ticket} 
          isCollapsed={!showSidebar}
          onToggle={() => setShowSidebar(!showSidebar)}
        />
      </div>
    </div>
  );
}

export default TicketWorkspace;
