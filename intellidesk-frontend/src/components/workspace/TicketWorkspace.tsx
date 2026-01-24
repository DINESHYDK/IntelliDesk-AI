// ============================================================================
// SEARCH: TICKET_WORKSPACE
// IntelliDesk AI - Ticket Resolution Workspace
// Properly contained centered modal
// ============================================================================

'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  ChevronLeft, 
  Maximize2, 
  Minimize2,
  Users,
  Mail,
  Sparkles
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
  const [activeTab, setActiveTab] = useState<'email' | 'response' | 'customer'>('email');

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <>
      {/* Fixed backdrop that covers everything */}
      <div 
        className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal - Centered with fixed position */}
      <div 
        className={cn(
          'fixed z-[101] bg-slate-900 shadow-2xl border border-slate-700',
          'flex flex-col overflow-hidden',
          isFullscreen 
            ? 'inset-0' 
            : 'top-[5vh] left-[2.5vw] right-[2.5vw] bottom-[5vh] lg:left-[5vw] lg:right-[5vw] rounded-2xl'
        )}
      >
        {/* Header Bar */}
        <header className="h-14 flex-shrink-0 flex items-center justify-between px-4 bg-slate-800 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="text-sm font-medium hidden sm:inline">Back to Queue</span>
            </button>
            <span className="hidden sm:block text-sm text-slate-400 font-mono">{ticket.id}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className={cn(
                'hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                showSidebar
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  : 'bg-slate-700/50 hover:bg-slate-700 text-slate-400'
              )}
            >
              <Users className="w-4 h-4" />
              Customer
            </button>

            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="hidden sm:flex p-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-700/50 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Mobile Tab Navigation */}
        <nav className="lg:hidden h-11 flex-shrink-0 flex border-b border-slate-700 bg-slate-800/50">
          <button
            onClick={() => setActiveTab('email')}
            className={cn(
              'flex-1 flex items-center justify-center gap-1.5 text-sm font-medium transition-colors',
              activeTab === 'email'
                ? 'text-blue-400 border-b-2 border-blue-400 bg-blue-500/10'
                : 'text-slate-400'
            )}
          >
            <Mail className="w-4 h-4" />
            Email
          </button>
          <button
            onClick={() => setActiveTab('response')}
            className={cn(
              'flex-1 flex items-center justify-center gap-1.5 text-sm font-medium transition-colors',
              activeTab === 'response'
                ? 'text-purple-400 border-b-2 border-purple-400 bg-purple-500/10'
                : 'text-slate-400'
            )}
          >
            <Sparkles className="w-4 h-4" />
            AI
          </button>
          <button
            onClick={() => setActiveTab('customer')}
            className={cn(
              'flex-1 flex items-center justify-center gap-1.5 text-sm font-medium transition-colors',
              activeTab === 'customer'
                ? 'text-emerald-400 border-b-2 border-emerald-400 bg-emerald-500/10'
                : 'text-slate-400'
            )}
          >
            <Users className="w-4 h-4" />
            Info
          </button>
        </nav>

        {/* Content Area - Takes remaining height */}
        <main className="flex-1 flex overflow-hidden">
          {/* Desktop Layout */}
          <div className="hidden lg:contents">
            {/* Email Panel */}
            <section className="flex-1 overflow-y-auto border-r border-slate-700">
              <EmailPanel ticket={ticket} />
            </section>

            {/* AI Response Panel */}
            <section className="flex-1 overflow-y-auto">
              <AIResponsePanel ticket={ticket} />
            </section>

            {/* Customer Sidebar */}
            {showSidebar && (
              <aside className="w-72 xl:w-80 flex-shrink-0 overflow-y-auto border-l border-slate-700">
                <CustomerSidebar ticket={ticket} />
              </aside>
            )}
          </div>

          {/* Mobile Layout - Tab Content */}
          <div className="lg:hidden flex-1 overflow-y-auto">
            {activeTab === 'email' && <EmailPanel ticket={ticket} />}
            {activeTab === 'response' && <AIResponsePanel ticket={ticket} />}
            {activeTab === 'customer' && <CustomerSidebar ticket={ticket} />}
          </div>
        </main>
      </div>
    </>
  );
}

export default TicketWorkspace;
