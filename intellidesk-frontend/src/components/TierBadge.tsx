// ============================================================================
// SEARCH: TIER_BADGE
// IntelliDesk AI - Customer Tier Badge Component
// Visual indicator for customer tier (Gold/Silver/Bronze)
// ============================================================================

'use client';

import React from 'react';
import { Crown, Star, Medal } from 'lucide-react';
import { CustomerTier } from '@/types';
import { getTierStyles, cn } from '@/lib/utils';

interface TierBadgeProps {
  tier: CustomerTier;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * SEARCH: TIER_BADGE_COMPONENT
 * Displays customer tier with icon and styling
 */
export function TierBadge({ tier, showLabel = true, size = 'md' }: TierBadgeProps) {
  const styles = getTierStyles(tier);

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const containerSizes = {
    sm: 'px-1.5 py-0.5 text-xs',
    md: 'px-2 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  };

  const icons = {
    Gold: <Crown className={iconSizes[size]} />,
    Silver: <Star className={iconSizes[size]} />,
    Bronze: <Medal className={iconSizes[size]} />,
  };

  return (
    <div 
      className={cn(
        'inline-flex items-center gap-1 rounded-md border font-medium',
        styles.bg,
        styles.text,
        styles.border,
        containerSizes[size]
      )}
    >
      {icons[tier]}
      {showLabel && <span>{tier}</span>}
    </div>
  );
}

export default TierBadge;
