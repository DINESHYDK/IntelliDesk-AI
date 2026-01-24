// ============================================================================
// SEARCH: UTILITY_FUNCTIONS
// IntelliDesk AI - Utility Functions
// Helper functions for SLA calculations, formatting, and styling
// ============================================================================

import { formatDistanceToNow, differenceInMinutes, differenceInHours, format, parseISO } from 'date-fns';
import { Priority, CustomerTier, Sentiment } from '@/types';

// ============================================================================
// SEARCH: SLA_LOGIC
// SLA Timer Calculation Functions
// ============================================================================

/**
 * Calculate time remaining until SLA deadline
 * @param deadline - ISO date string of the SLA deadline
 * @returns Object with time remaining details
 */
export function calculateSLAStatus(deadline: string): {
  isBreached: boolean;
  isCritical: boolean;      // < 1 hour remaining
  isWarning: boolean;       // < 25% of SLA time remaining
  minutesRemaining: number;
  hoursRemaining: number;
  displayText: string;
  percentageRemaining: number;
} {
  const now = new Date();
  const deadlineDate = parseISO(deadline);
  
  const minutesRemaining = differenceInMinutes(deadlineDate, now);
  const hoursRemaining = differenceInHours(deadlineDate, now);
  
  const isBreached = minutesRemaining <= 0;
  const isCritical = minutesRemaining > 0 && minutesRemaining <= 60; // Less than 1 hour
  const isWarning = minutesRemaining > 60 && minutesRemaining <= 120; // Less than 2 hours
  
  // Calculate percentage (assuming max SLA is 72 hours)
  const maxMinutes = 72 * 60;
  const percentageRemaining = Math.max(0, Math.min(100, (minutesRemaining / maxMinutes) * 100));
  
  let displayText: string;
  
  if (isBreached) {
    displayText = `Breached ${formatDistanceToNow(deadlineDate, { addSuffix: true })}`;
  } else if (minutesRemaining < 60) {
    displayText = `${minutesRemaining}m remaining`;
  } else if (hoursRemaining < 24) {
    const mins = minutesRemaining % 60;
    displayText = `${hoursRemaining}h ${mins}m remaining`;
  } else {
    const days = Math.floor(hoursRemaining / 24);
    const hrs = hoursRemaining % 24;
    displayText = `${days}d ${hrs}h remaining`;
  }
  
  return {
    isBreached,
    isCritical,
    isWarning,
    minutesRemaining,
    hoursRemaining,
    displayText,
    percentageRemaining,
  };
}

/**
 * Format SLA timer for compact display
 */
export function formatSLACompact(deadline: string): string {
  const { minutesRemaining, isBreached } = calculateSLAStatus(deadline);
  
  if (isBreached) return 'BREACHED';
  if (minutesRemaining < 60) return `${minutesRemaining}m`;
  
  const hours = Math.floor(minutesRemaining / 60);
  if (hours < 24) return `${hours}h`;
  
  const days = Math.floor(hours / 24);
  return `${days}d`;
}

// ============================================================================
// SEARCH: PRIORITY_STYLES
// Priority-based styling utilities
// ============================================================================

/**
 * Get CSS classes for priority badge
 */
// ============================================================================
// SEARCH: PRIORITY_STYLES
// Priority-based styling utilities
// ============================================================================

/**
 * Get CSS classes for priority badge
 */
export function getPriorityStyles(priority: Priority): {
  bg: string;
  text: string;
  border: string;
  dot: string;
} {
  const styles: Record<Priority, { bg: string; text: string; border: string; dot: string }> = {
    P1: {
      bg: 'bg-urgent/15',
      text: 'text-urgent',
      border: 'border-urgent/50',
      dot: 'bg-urgent',
    },
    P2: {
      bg: 'bg-high/15',
      text: 'text-high',
      border: 'border-high/50',
      dot: 'bg-high',
    },
    P3: {
      bg: 'bg-medium/15',
      text: 'text-medium',
      border: 'border-medium/50',
      dot: 'bg-medium',
    },
    P4: {
      bg: 'bg-low/15',
      text: 'text-low',
      border: 'border-low/50',
      dot: 'bg-low',
    },
  };
  return styles[priority];
}

/**
 * Get priority label
 */
export function getPriorityLabel(priority: Priority): string {
  const labels: Record<Priority, string> = {
    P1: 'Critical',
    P2: 'High',
    P3: 'Medium',
    P4: 'Low',
  };
  return labels[priority];
}

// ============================================================================
// SEARCH: TIER_STYLES
// Customer tier styling utilities
// ============================================================================

/**
 * Get CSS classes for customer tier badge
 */
export function getTierStyles(tier: CustomerTier): {
  bg: string;
  text: string;
  border: string;
  icon: string;
} {
  const styles: Record<CustomerTier, { bg: string; text: string; border: string; icon: string }> = {
    Gold: {
      bg: 'bg-tier-gold/15',
      text: 'text-tier-gold',
      border: 'border-tier-gold/50',
      icon: '👑',
    },
    Silver: {
      bg: 'bg-tier-silver/15',
      text: 'text-tier-silver',
      border: 'border-tier-silver/50',
      icon: '⭐',
    },
    Bronze: {
      bg: 'bg-tier-bronze/15',
      text: 'text-tier-bronze',
      border: 'border-tier-bronze/50',
      icon: '🥉',
    },
  };
  return styles[tier];
}

// ============================================================================
// SEARCH: CONFIDENCE_STYLES
// AI Confidence score styling
// ============================================================================

/**
 * Get CSS classes based on confidence score
 * >80% = High confidence (green)
 * <80% = Low confidence (amber) - needs review
 */
export function getConfidenceStyles(confidence: number): {
  bg: string;
  text: string;
  border: string;
  label: string;
  needsReview: boolean;
} {
  const isHigh = confidence >= 80;
  
  return {
    bg: isHigh ? 'bg-confidence-high/15' : 'bg-confidence-low/15',
    text: isHigh ? 'text-confidence-high' : 'text-confidence-low',
    border: isHigh ? 'border-confidence-high/50' : 'border-confidence-low/50',
    label: isHigh ? 'Auto-classified' : 'Needs Review',
    needsReview: !isHigh,
  };
}

// ============================================================================
// SEARCH: SENTIMENT_STYLES
// Sentiment analysis styling
// ============================================================================

/**
 * Get CSS classes and emoji for sentiment
 */
export function getSentimentStyles(sentiment: string): {
  bg: string;
  text: string;
  emoji: string;
} {
  const normalizedSentiment = sentiment.toLowerCase();
  
  if (normalizedSentiment === 'happy' || normalizedSentiment === 'positive') {
    return {
      bg: 'bg-sentiment-happy/15',
      text: 'text-sentiment-happy',
      emoji: '😊',
    };
  }
  
  if (normalizedSentiment === 'frustrated' || normalizedSentiment === 'negative' || normalizedSentiment === 'angry') {
    return {
      bg: 'bg-sentiment-frustrated/15',
      text: 'text-sentiment-frustrated',
      emoji: '😤',
    };
  }
  
  // Neutral default
  return {
    bg: 'bg-sentiment-neutral/15',
    text: 'text-sentiment-neutral',
    emoji: '😐',
  };
}

// ============================================================================
// SEARCH: STATUS_STYLES
// Ticket status styling
// ============================================================================

/**
 * Get CSS classes for ticket status
 */
export function getStatusStyles(status: string): {
  bg: string;
  text: string;
  dot: string;
} {
  switch (status) {
    case 'New':
      return {
        bg: 'bg-[hsl(var(--status-new)/0.15)]',
        text: 'text-[hsl(var(--status-new))]',
        dot: 'bg-[hsl(var(--status-new))]',
      };
    case 'In Progress':
      return {
        bg: 'bg-[hsl(var(--status-in-progress)/0.15)]',
        text: 'text-[hsl(var(--status-in-progress))]',
        dot: 'bg-[hsl(var(--status-in-progress))]',
      };
    case 'Resolved':
      return {
        bg: 'bg-[hsl(var(--success)/0.15)]',
        text: 'text-[hsl(var(--success))]',
        dot: 'bg-[hsl(var(--success))]',
      };
    default:
      return {
        bg: 'bg-[hsl(var(--muted))]',
        text: 'text-[hsl(var(--muted-foreground))]',
        dot: 'bg-[hsl(var(--muted-foreground))]',
      };
  }
}

// ============================================================================
// SEARCH: DATE_FORMATTING
// Date and time formatting utilities
// ============================================================================

/**
 * Format timestamp for display
 */
export function formatTimestamp(timestamp: string): string {
  const date = parseISO(timestamp);
  return formatDistanceToNow(date, { addSuffix: true });
}

/**
 * Format timestamp to full date/time
 */
export function formatFullDate(timestamp: string): string {
  const date = parseISO(timestamp);
  return format(date, 'MMM d, yyyy h:mm a');
}

/**
 * Extract domain from email address
 */
export function extractEmailDomain(email: string): string {
  const match = email.match(/@(.+)$/);
  return match ? match[1] : email;
}

/**
 * Get initials from email or name
 */
export function getInitials(emailOrName: string): string {
  const name = emailOrName.split('@')[0];
  const parts = name.split(/[._-]/);
  
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  
  return name.slice(0, 2).toUpperCase();
}

// ============================================================================
// SEARCH: CLASSNAME_HELPER
// Utility for conditional class names
// ============================================================================

/**
 * Combine class names conditionally
 */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
