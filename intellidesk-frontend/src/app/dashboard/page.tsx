// ============================================================================
// SEARCH: DASHBOARD_PAGE
// IntelliDesk AI - Main Dashboard Page at /dashboard
// Assembles the Command Center with Stats Row and Ticket Table
// ============================================================================

'use client';

import React from 'react';
import { useTicketStream, usePollingStatus } from '@/hooks/useTicketStream';
import { Header } from '@/components/Header';
import { CommandCenterStats } from '@/components/CommandCenterStats';
import { TicketTable } from '@/components/TicketTable';
import { Brain, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * SEARCH: DASHBOARD_COMPONENT
 * Main dashboard assembling all components
 * - Header with status
 * - Stats Row with key metrics
 * - Ticket Table (Command Center)
 */
export default function DashboardPage() {
  const { tickets, stats, loading, error, refresh, lastUpdated } = useTicketStream();
  const { nextPollIn } = usePollingStatus();

  // SEARCH: LOADING_STATE
  // Initial loading state with branded skeleton
  if (loading && tickets.length === 0) {
    return (
      <div className='min-h-screen bg-[hsl(var(--background))] flex items-center justify-center'>
        <div className='text-center animate-fade-in'>
          <div
            className={cn(
              'flex items-center justify-center w-20 h-20 mx-auto mb-6 rounded-2xl',
              'bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--accent))]',
              'shadow-2xl shadow-[hsl(var(--primary)/0.4)]'
            )}
          >
            <Brain className='w-10 h-10 text-white animate-pulse' />
          </div>
          <h1 className='text-2xl font-bold text-gradient mb-2'>
            IntelliDesk AI
          </h1>
          <div className='flex items-center justify-center gap-2 text-[hsl(var(--muted-foreground))]'>
            <Loader2 className='w-4 h-4 animate-spin' />
            <span>Loading Support Dashboard...</span>
          </div>
        </div>
      </div>
    );
  }

  // SEARCH: ERROR_STATE
  // Error state (when no fallback data available)
  if (error && tickets.length === 0) {
    return (
      <div className='min-h-screen bg-[hsl(var(--background))] flex items-center justify-center p-4'>
        <div className='text-center max-w-md animate-fade-in'>
          <div
            className={cn(
              'flex items-center justify-center w-20 h-20 mx-auto mb-6 rounded-2xl',
              'bg-[hsl(var(--urgent)/0.2)] border-2 border-[hsl(var(--urgent)/0.5)]'
            )}
          >
            <Brain className='w-10 h-10 text-[hsl(var(--urgent))]' />
          </div>
          <h1 className='text-2xl font-bold text-[hsl(var(--foreground))] mb-2'>
            Connection Error
          </h1>
          <p className='text-[hsl(var(--muted-foreground))] mb-6'>
            {error}
          </p>
          <button
            onClick={refresh}
            className={cn(
              'px-6 py-3 rounded-xl font-semibold',
              'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]',
              'hover:opacity-90 transition-opacity'
            )}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // SEARCH: MAIN_DASHBOARD
  // Main dashboard with data
  return (
    <div className='min-h-screen bg-[hsl(var(--background))]'>
      {/* Header */}
      <Header
        isLoading={loading}
        isUsingMockData={false}
        lastUpdated={lastUpdated}
        onRefresh={refresh}
        nextPollIn={nextPollIn}
      />

      {/* Main Content */}
      <main className='w-full max-w-[1600px] mx-auto px-4 py-6 space-y-6'>

        {/* Command Center Stats Row */}
        <section>
           <CommandCenterStats tickets={tickets} isLoading={loading} />
        </section>

        {/* Ticket Table - Command Center */}
        <section>
          <div className='flex items-center justify-between mb-4'>
            <h2 className='text-xl font-bold text-[hsl(var(--foreground))]'>
              Support Queue
            </h2>
            <span className='text-sm text-[hsl(var(--muted-foreground))]'>
              {tickets.length} total tickets
            </span>
          </div>
          <TicketTable tickets={tickets} isLoading={loading} />
        </section>
      </main>

      {/* Footer */}
      <footer className='border-t border-[hsl(var(--border))] py-4 mt-8'>
        <div className='w-full max-w-[1600px] mx-auto px-4 text-center text-xs text-[hsl(var(--muted-foreground))]'>
          <p>
            IntelliDesk AI · Intelligent Email Support Dashboard
          </p>
          <p className='mt-1'>
            Built for Agglomeration 2.0 @2026 <br />Powered by AI Classification &amp; n8n Workflows
          </p>
        </div>
      </footer>
    </div>
  );
}
