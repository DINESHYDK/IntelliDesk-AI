// ============================================================================
// SEARCH: HEADER_COMPONENT
// IntelliDesk AI - Dashboard Header Component
// Antigravity-themed navbar with live clock and status indicators
// ============================================================================

'use client';

import React, { useState, useEffect } from 'react';
import {
  Brain,
  RefreshCw,
  Wifi,
  WifiOff,
  Clock,
  Bell,
  LayoutDashboard,
  BarChart3,
  HelpCircle,
  LogOut,
  User as UserIcon,
  Menu,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface HeaderProps {
  isLoading?: boolean;
  isUsingMockData?: boolean;
  lastUpdated?: Date | null;
  onRefresh?: () => void;
  nextPollIn?: number;
}

// Navigation links - Settings removed for cleaner header
const navigationLinks = [
  { href: "#", label: "Dashboard", icon: LayoutDashboard, active: true },
  { href: "#analytics", label: "Analytics", icon: BarChart3 },
];

/**
 * SEARCH: HEADER_COMPONENT
 * Antigravity-themed dashboard header with live clock and status indicators
 */
export function Header({
  isLoading = false,
  isUsingMockData = false,
  lastUpdated,
  onRefresh,
  nextPollIn
}: HeaderProps) {
  // Live clock state with second-precision
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format time with seconds
  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full h-16',
        'bg-slate-950 backdrop-blur-xl',
        'border-b border-slate-800'
      )}
    >
      {/* Streamlined flex container */}
      <div className="h-full px-4 md:px-6 flex items-center justify-between">
        {/* Left Side: Mobile Menu + Logo + Navigation */}
        <div className="flex items-center gap-3 md:gap-6">
          {/* Mobile Menu Trigger */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden h-9 w-9 text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="start"
              className="w-56 p-2 md:hidden bg-slate-900 border-slate-800"
            >
              <nav className="flex flex-col gap-1">
                {navigationLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.href}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                      link.active
                        ? 'bg-gradient-to-r from-violet-600/20 to-cyan-600/20 text-cyan-400 border border-cyan-500/30'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    )}
                  >
                    <link.icon className="h-4 w-4" />
                    {link.label}
                  </a>
                ))}
                <div className="h-px bg-slate-800 my-2" />
                <a
                  href="#help"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                >
                  <HelpCircle className="h-4 w-4" />
                  Help & Support
                </a>
              </nav>
            </PopoverContent>
          </Popover>

          {/* Logo & Branding - Enhanced typographic hierarchy */}
          <div className="flex items-center gap-3">
            <div
              className={cn(
                'flex items-center justify-center shrink-0',
                'w-9 h-9 md:w-10 md:h-10 rounded-xl',
                'bg-gradient-to-br from-violet-600 via-purple-600 to-cyan-500',
                'shadow-lg shadow-violet-500/25',
                'ring-1 ring-white/10'
              )}
            >
              <Brain className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg md:text-xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent leading-tight">
                IntelliDesk
              </h1>
              <span className="hidden sm:block text-[10px] md:text-xs font-medium text-cyan-400 tracking-wider uppercase">
                AI Support Hub
              </span>
            </div>
          </div>

          {/* Desktop Navigation Menu */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList className="gap-1">
              {navigationLinks.map((link, index) => (
                <NavigationMenuItem key={index}>
                  <NavigationMenuLink asChild>
                    <a
                      href={link.href}
                      className={cn(
                        'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                        link.active
                          ? 'bg-gradient-to-r from-violet-600/20 to-cyan-600/20 text-cyan-400 border border-cyan-500/30'
                          : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                      )}
                    >
                      <link.icon className="h-4 w-4" />
                      {link.label}
                    </a>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Right Side: Status, Clock & Controls */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Demo Mode Indicator - Pill-shaped with pulsating animation */}
          {isUsingMockData ? (
            <div
              className={cn(
                'hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full',
                'bg-amber-500/10 border border-amber-500/30',
                'animate-pulse'
              )}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              <span className="text-xs font-semibold text-amber-400 uppercase tracking-wide">
                Demo Mode
              </span>
            </div>
          ) : (
            <div
              className={cn(
                'hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full',
                'bg-emerald-500/10 border border-emerald-500/30'
              )}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wide">
                Live
              </span>
            </div>
          )}

          {/* Live System Clock - Second precision */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/50 border border-slate-800">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span className="font-mono text-xs text-slate-300 tabular-nums">
              {formattedTime}
            </span>
            {nextPollIn && (
              <span className="text-xs text-violet-400 font-medium">
                • {nextPollIn}s
              </span>
            )}
          </div>

          {/* Refresh Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onRefresh}
            disabled={isLoading}
            className="h-9 w-9 text-slate-400 hover:text-white hover:bg-slate-800"
            title="Refresh data"
          >
            <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
          </Button>

          {/* Notifications Button */}
          <Button
            variant="ghost"
            size="icon"
            className="relative h-9 w-9 text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-[10px] font-bold text-white flex items-center justify-center shadow-lg shadow-rose-500/50">
              2
            </span>
          </Button>

          {/* User Avatar Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-9 w-9 rounded-full p-0 ring-2 ring-slate-700 hover:ring-cyan-500/50 transition-all"
              >
                <Avatar className="h-9 w-9">
                  <AvatarImage src="" alt="User" />
                  <AvatarFallback className="bg-gradient-to-br from-violet-600 to-cyan-500 text-white text-xs font-bold">
                    JD
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 bg-slate-900 border-slate-800"
            >
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium text-white">John Doe</p>
                  <p className="text-xs text-slate-400">
                    john.doe@company.com
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-slate-800" />
              <DropdownMenuItem className="text-slate-300 hover:text-white hover:bg-slate-800 focus:bg-slate-800 focus:text-white">
                <UserIcon className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-slate-300 hover:text-white hover:bg-slate-800 focus:bg-slate-800 focus:text-white">
                <HelpCircle className="mr-2 h-4 w-4" />
                <span>Help & Support</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-slate-800" />
              <DropdownMenuItem className="text-rose-400 hover:text-rose-300 hover:bg-slate-800 focus:bg-slate-800 focus:text-rose-300">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

export default Header;


