// ============================================================================
// SEARCH: HEADER_COMPONENT
// IntelliDesk AI - Dashboard Header Component
// Top navigation with branding and status indicators
// ============================================================================

'use client';

import React from 'react';
import {
  Brain,
  RefreshCw,
  Wifi,
  WifiOff,
  Clock,
  Bell,
  User
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  isLoading?: boolean;
  isUsingMockData?: boolean;
  lastUpdated?: Date | null;
  onRefresh?: () => void;
  nextPollIn?: number;
}

/**
 * SEARCH: HEADER_COMPONENT
 * Dashboard header with branding and connection status
 */
export function Header({
  isLoading = false,
  isUsingMockData = false,
  lastUpdated,
  onRefresh,
  nextPollIn
}: HeaderProps) {
  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full',
        'bg-[hsl(var(--background)/0.8)] backdrop-blur-xl',
        'border-b border-[hsl(var(--border))]'
      )}
    >
      {/* Fluid container with responsive padding */}
      <div className="container-fluid py-2 sm:py-3">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Logo & Branding - scales responsively */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div
              className={cn(
                'flex items-center justify-center shrink-0',
                'w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl',
                'bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--accent))]',
                'shadow-lg shadow-[hsl(var(--primary)/0.3)]'
              )}
            >
              <Brain className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-fluid-lg sm:text-fluid-xl font-bold text-gradient truncate">
                IntelliDesk AI
              </h1>
              <p className="hidden xs:block text-fluid-xs text-[hsl(var(--muted-foreground))] truncate">
                Intelligent Email Support Dashboard
              </p>
            </div>
          </div>

          {/* Status & Controls - responsive layout */}
          <div className="flex items-center gap-1 sm:gap-2 md:gap-4 shrink-0">
            {/* Connection Status - hidden on mobile, compact on tablet */}
            <div
              className={cn(
                'hidden sm:flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg',
                isUsingMockData
                  ? 'bg-[hsl(var(--warning)/0.15)] text-[hsl(var(--warning))]'
                  : 'bg-[hsl(var(--success)/0.15)] text-[hsl(var(--success))]'
              )}
            >
              {isUsingMockData ? (
                <>
                  <WifiOff className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="text-fluid-xs font-medium">Demo</span>
                </>
              ) : (
                <>
                  <Wifi className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="text-fluid-xs font-medium">Live</span>
                </>
              )}
            </div>

            {/* Last Updated & Poll Timer - only on larger screens */}
            {lastUpdated && (
              <div className="hidden lg:flex items-center gap-2 text-fluid-xs text-[hsl(var(--muted-foreground))]">
                <Clock className="w-3.5 h-3.5" />
                <span className="whitespace-nowrap">
                  Updated {lastUpdated.toLocaleTimeString()}
                </span>
                {nextPollIn && (
                  <span className="text-[hsl(var(--primary))]">
                    ({nextPollIn}s)
                  </span>
                )}
              </div>
            )}

            {/* Refresh Button - touch-friendly size */}
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className={cn(
                'p-1.5 sm:p-2 rounded-lg transition-all duration-200 touch-target',
                'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]',
                'hover:bg-[hsl(var(--muted))] active:bg-[hsl(var(--muted))]',
                isLoading && 'animate-spin'
              )}
              title="Refresh data"
            >
              <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Notifications - touch-friendly */}
            <button
              className={cn(
                'relative p-1.5 sm:p-2 rounded-lg transition-all duration-200 touch-target',
                'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]',
                'hover:bg-[hsl(var(--muted))] active:bg-[hsl(var(--muted))]'
              )}
            >
              <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[hsl(var(--urgent))] text-[10px] font-bold text-white flex items-center justify-center">
                2
              </span>
            </button>

            {/* User Avatar - responsive sizing */}
            <button
              className={cn(
                'flex items-center justify-center shrink-0',
                'w-8 h-8 sm:w-9 sm:h-9 rounded-full',
                'bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--accent))]',
                'text-white font-semibold text-xs sm:text-sm',
                'ring-2 ring-[hsl(var(--background))] hover:ring-[hsl(var(--primary)/0.5)]',
                'transition-all duration-200'
              )}
            >
              <span>JD</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
