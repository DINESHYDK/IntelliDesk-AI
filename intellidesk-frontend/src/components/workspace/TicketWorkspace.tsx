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
import { FrontendTicket as Ticket } from '@/types';
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
        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal - Centered with fixed position */}
      <div 
        className={cn(
          'fixed z-[101] glass-neon-cyan shadow-2xl',
          'flex flex-col overflow-hidden',
          isFullscreen 
            ? 'inset-0' 
            : 'top-[5vh] left-[2.5vw] right-[2.5vw] bottom-[5vh] lg:left-[5vw] lg:right-[5vw] rounded-2xl animate-neon-border-flow'
        )}
      >
        {/* Header Bar */}
        <header className="h-14 flex-shrink-0 flex items-center justify-between px-4 bg-transparent border-b border-white/5">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-colors border border-border"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="text-sm font-medium hidden sm:inline">Back to Queue</span>
            </button>
            <span className="hidden sm:block text-sm text-muted-foreground font-mono">{ticket.id}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className={cn(
                'hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border',
                showSidebar
                  ? 'bg-primary/10 text-primary border-primary/20'
                  : 'bg-card text-muted-foreground border-border hover:bg-muted'
              )}
            >
              <Users className="w-4 h-4" />
              Customer
            </button>

            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="hidden sm:flex p-2 rounded-lg bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-colors border border-border"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-card hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors border border-border hover:border-destructive/30"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Mobile Tab Navigation */}
        <nav className="lg:hidden h-11 flex-shrink-0 flex border-b border-border bg-white/[0.02]">
          <button
            onClick={() => setActiveTab('email')}
            className={cn(
              'flex-1 flex items-center justify-center gap-1.5 text-sm font-medium transition-colors',
              activeTab === 'email'
                ? 'neon-text-cyan border-b-2 border-[oklch(0.75_0.15_195)] bg-[oklch(0.75_0.15_195/0.05)]'
                : 'text-muted-foreground'
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
                ? 'neon-text-pink border-b-2 border-[oklch(0.65_0.25_350)] bg-[oklch(0.65_0.25_350/0.05)]'
                : 'text-muted-foreground'
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
                ? 'neon-text-green border-b-2 border-[oklch(0.72_0.2_145)] bg-[oklch(0.72_0.2_145/0.05)]'
                : 'text-muted-foreground'
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
            <section className="flex-1 overflow-y-auto border-r border-border">
              <EmailPanel ticket={ticket} />
            </section>

            {/* AI Response Panel */}
            <section className="flex-1 overflow-y-auto">
              <AIResponsePanel ticket={ticket} />
            </section>

            {/* Customer Sidebar */}
            {showSidebar && (
              <aside className="w-72 xl:w-80 flex-shrink-0 overflow-y-auto border-l border-border bg-white/[0.02]">
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
