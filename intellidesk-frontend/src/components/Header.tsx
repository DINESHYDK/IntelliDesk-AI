// ============================================================================
// SEARCH: HEADER_COMPONENT
// IntelliDesk AI - Dashboard Header Component
// Top navigation with branding, status indicators, brass countdown, and user dropdown
// ============================================================================

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Brain, 
  RefreshCw, 
  Wifi, 
  WifiOff, 
  Clock,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeSwitch } from '@/components/ui/theme-switch-button';
import { signOut, useSession } from 'next-auth/react';

// ----------------------------------------------------------------------------
// SEARCH: BRASS_SWEEP
// A small brass sweep ring that drains continuously as the poll timer ticks
// down. Uses CSS animation on stroke-dashoffset for a smooth mechanical feel.
// ----------------------------------------------------------------------------
function BrassSweep({ 
  secondsLeft, 
  totalSeconds = 30, 
  degraded = false 
}: { 
  secondsLeft: number; 
  totalSeconds?: number;
  degraded?: boolean;
}) {
  const r = 10;
  const circ = 2 * Math.PI * r; // ≈ 62.83
  const pct = Math.max(0, Math.min(1, secondsLeft / totalSeconds));
  const dash = pct * circ;

  return (
    <div className="hidden md:flex flex-col items-center gap-0.5" title={`Next refresh in ${secondsLeft}s`}>
      <svg width="28" height="28" viewBox="0 0 28 28" className="-rotate-90">
        {/* Track */}
        <circle
          cx="14" cy="14" r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-[hsl(var(--border))]"
        />
        {/* Sweep */}
        <circle
          cx="14" cy="14" r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`}
          className={cn(
            'transition-[stroke-dasharray] duration-1000 linear',
            degraded 
              ? 'text-[hsl(var(--high))]' 
              : 'text-[hsl(var(--primary))]'
          )}
        />
      </svg>
      <span 
        className="text-[10px] tabular-nums text-[hsl(var(--muted-foreground))]"
        style={{ fontFamily: 'var(--font-mono)' }}
      >
        {secondsLeft}s
      </span>
    </div>
  );
}

interface HeaderProps {
  isLoading?: boolean;
  isUsingMockData?: boolean;
  lastUpdated?: Date | null;
  onRefresh?: () => void;
  nextPollIn?: number;
}

/**
 * SEARCH: HEADER_COMPONENT
 * Dashboard header with branding, connection status, and user dropdown
 */
export function Header({ 
  isLoading = false, 
  isUsingMockData = false,
  lastUpdated,
  onRefresh,
  nextPollIn
}: HeaderProps) {
  const { data: session } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get initials from session user name or email
  const getInitials = () => {
    const name = session?.user?.name;
    const email = session?.user?.email;
    if (name) {
      return name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
    }
    if (email) {
      return email.slice(0, 2).toUpperCase();
    }
    return 'AI';
  };

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header 
      className={cn(
        'sticky top-0 z-40 w-full',
        'bg-[hsl(var(--background)/0.8)] backdrop-blur-xl',
        'border-b border-[hsl(var(--border))]'
      )}
    >
      <div className="w-full px-6 md:px-10 py-4">
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
              <h1 className="font-display italic text-xl font-medium text-[hsl(var(--primary))]">
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

            {/* Updated timestamp + Brass Sweep countdown ring */}
            {lastUpdated && (
              <div className="hidden md:flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-xs text-[hsl(var(--muted-foreground))]">
                  <Clock className="w-3.5 h-3.5" strokeWidth={1.75} />
                  <span style={{ fontFamily: 'var(--font-mono)' }}>
                    {lastUpdated.toLocaleTimeString()}
                  </span>
                </div>
                {nextPollIn !== undefined && (
                  <BrassSweep 
                    secondsLeft={nextPollIn} 
                    totalSeconds={30}
                    degraded={isUsingMockData}
                  />
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

            {/* Theme Toggle */}
            <div className="hidden sm:block">
              <ThemeSwitch />
            </div>

            {/* User Avatar with Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setDropdownOpen((prev) => !prev)}
                className={cn(
                  'flex items-center gap-1.5 pl-1 pr-2 py-1 rounded-full',
                  'bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--accent))]',
                  'text-white font-semibold text-sm',
                  'ring-2 ring-[hsl(var(--background))] hover:ring-[hsl(var(--primary)/0.5)]',
                  'transition-all duration-200',
                  dropdownOpen && 'ring-[hsl(var(--primary)/0.5)]'
                )}
                aria-label="User menu"
              >
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-white/20">
                  {getInitials()}
                </span>
                <ChevronDown className={cn('w-3.5 h-3.5 transition-transform duration-200', dropdownOpen && 'rotate-180')} />
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className={cn(
                  'absolute right-0 mt-2 w-56 rounded-xl border shadow-xl z-50 overflow-hidden animate-fade-in',
                  'bg-[hsl(var(--card))] border-[hsl(var(--border))]'
                )}>
                  {/* User Info */}
                  <div className="px-4 py-3 border-b border-[hsl(var(--border))]">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        'flex items-center justify-center w-9 h-9 rounded-full shrink-0',
                        'bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--accent))]',
                        'text-white font-bold text-sm'
                      )}>
                        {getInitials()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-[hsl(var(--foreground))] truncate">
                          {session?.user?.name || 'User'}
                        </p>
                        <p className="text-xs text-[hsl(var(--muted-foreground))] truncate">
                          {session?.user?.email || ''}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="p-1.5">
                    <button
                      onClick={() => signOut({ callbackUrl: '/login' })}
                      className={cn(
                        'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm',
                        'text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]',
                        'transition-colors duration-150 group'
                      )}
                    >
                      <LogOut className="w-4 h-4 text-[hsl(var(--muted-foreground))] group-hover:text-[hsl(var(--urgent))] transition-colors" />
                      <span>Sign out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
