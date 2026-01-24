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
import { ThemeSwitch } from '@/components/ui/theme-switch-button';

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
      <div className="w-full max-w-[1600px] mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo & Branding */}
          <div className="flex items-center gap-3">
            <div 
              className={cn(
                'flex items-center justify-center w-10 h-10 rounded-xl',
                'bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--accent))]',
                'shadow-lg shadow-[hsl(var(--primary)/0.3)]'
              )}
            >
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gradient">
                IntelliDesk AI
              </h1>
              <p className="text-xs text-[hsl(var(--muted-foreground))]">
                Intelligent Email Support Dashboard
              </p>
            </div>
          </div>

          {/* Status & Controls */}
          <div className="flex items-center gap-4">
            {/* Connection Status */}
            <div 
              className={cn(
                'hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg',
                isUsingMockData 
                  ? 'bg-[hsl(var(--warning)/0.15)] text-[hsl(var(--warning))]'
                  : 'bg-[hsl(var(--success)/0.15)] text-[hsl(var(--success))]'
              )}
            >
              {isUsingMockData ? (
                <>
                  <WifiOff className="w-4 h-4" />
                  <span className="text-xs font-medium">Demo Mode</span>
                </>
              ) : (
                <>
                  <Wifi className="w-4 h-4" />
                  <span className="text-xs font-medium">Live</span>
                </>
              )}
            </div>

            {/* Last Updated & Poll Timer */}
            {lastUpdated && (
              <div className="hidden md:flex items-center gap-2 text-xs text-[hsl(var(--muted-foreground))]">
                <Clock className="w-3.5 h-3.5" />
                <span>
                  Updated {lastUpdated.toLocaleTimeString()}
                </span>
                {nextPollIn && (
                  <span className="text-[hsl(var(--primary))]">
                    ({nextPollIn}s)
                  </span>
                )}
              </div>
            )}

            {/* Refresh Button */}
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className={cn(
                'p-2 rounded-lg transition-all duration-200',
                'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]',
                'hover:bg-[hsl(var(--muted))]',
                isLoading && 'animate-spin'
              )}
              title="Refresh data"
            >
              <RefreshCw className="w-5 h-5" />
            </button>

            {/* Notifications */}
            <button 
              className={cn(
                'relative p-2 rounded-lg transition-all duration-200',
                'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]',
                'hover:bg-[hsl(var(--muted))]'
              )}
            >
              <Bell className="w-5 h-5" />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[hsl(var(--urgent))] text-[10px] font-bold text-white flex items-center justify-center">
                2
              </span>
            </button>

            {/* Theme Toggle */}
            <div className="hidden sm:block">
              <ThemeSwitch />
            </div>

            {/* User Avatar */}
            <button 
              className={cn(
                'flex items-center justify-center w-9 h-9 rounded-full',
                'bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--accent))]',
                'text-white font-semibold text-sm',
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
