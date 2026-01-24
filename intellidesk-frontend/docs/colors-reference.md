# IntelliDesk AI - Color System Reference Guide

> **📍 Primary Source File:** `src/app/globals.css`  
> **🛠️ Utility Functions:** `src/lib/utils.ts`

This document is a complete study guide for understanding the color system used in IntelliDesk AI. It covers HSL color variables, Tailwind integration, utility functions, and real-world usage examples from the codebase.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [How Colors Work (HSL Variables)](#how-colors-work-hsl-variables)
3. [Color Categories](#color-categories)
   - [Base Colors](#1-base-colors)
   - [Priority Colors](#2-priority-colors-sla-based)
   - [Confidence Colors](#3-ai-confidence-colors)
   - [Customer Tier Colors](#4-customer-tier-colors)
   - [Ticket Status Colors](#5-ticket-status-colors)
   - [Sentiment Colors](#6-sentiment-colors)
   - [Accent & Interactive Colors](#7-accent--interactive-colors)
4. [Using Colors in Components](#using-colors-in-components)
5. [Utility Functions](#utility-functions)
6. [Animation Classes](#animation-classes)
7. [Custom Utility Classes](#custom-utility-classes)
8. [Quick Reference Table](#quick-reference-table)

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        globals.css                               │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │   :root { ... }                                           │   │
│  │   CSS Variables defined as HSL values                     │   │
│  │   e.g., --urgent: 0 84% 60%                               │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              ↓                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │   @theme inline { ... }                                   │   │
│  │   Tailwind theme integration                              │   │
│  │   e.g., --color-urgent: hsl(var(--urgent))                │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                         utils.ts                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │   Style Functions                                         │   │
│  │   getPriorityStyles(), getTierStyles(),                   │   │
│  │   getConfidenceStyles(), getSentimentStyles(), etc.       │   │
│  │   Returns: { bg, text, border, ... }                      │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                       Components                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │   Import utility functions                                │   │
│  │   Apply classes dynamically                               │   │
│  │   e.g., className={styles.bg}                             │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## How Colors Work (HSL Variables)

### The HSL Format

We use **HSL (Hue, Saturation, Lightness)** color format stored in CSS custom properties. The values are stored **without** the `hsl()` wrapper to enable opacity modifiers.

**📍 File:** `src/app/globals.css` (lines 14-112)

```css
:root {
  /* Format: H S% L% (no hsl wrapper, no commas) */
  --urgent: 0 84% 60%;        /* Red color */
  --urgent-bg: 0 84% 15%;     /* Dark red background */
}
```

### Why This Format?

This format allows us to use CSS opacity modifiers:

```css
/* Using the variable with opacity */
background: hsl(var(--urgent) / 0.5);    /* 50% opacity red */
border-color: hsl(var(--urgent) / 0.3);  /* 30% opacity red */
```

### In Tailwind Classes

The `@theme inline` block (lines 117-137) maps these to Tailwind utilities:

```css
@theme inline {
  --color-urgent: hsl(var(--urgent));
  --color-high: hsl(var(--high));
  /* ... */
}
```

This enables usage like:
```html
<div class="text-urgent bg-urgent/20">...</div>
```

---

## Color Categories

### 1. Base Colors

**📍 Location:** `src/app/globals.css` (lines 16-29)

These define the overall theme (dark mode by default).

| Variable | HSL Value | Usage | Tailwind Class |
|----------|-----------|-------|----------------|
| `--background` | `222 47% 6%` | Page background | `bg-background` |
| `--foreground` | `210 40% 98%` | Default text | `text-foreground` |
| `--card` | `222 47% 8%` | Card surfaces | `bg-card` |
| `--card-foreground` | `210 40% 98%` | Card text | `text-card-foreground` |
| `--card-hover` | `222 47% 11%` | Card hover state | Use with arbitrary: `bg-[hsl(var(--card-hover))]` |
| `--border` | `217 33% 17%` | Default borders | `border-border` |
| `--border-hover` | `217 33% 25%` | Border hover state | Use with arbitrary |
| `--muted` | `217 33% 17%` | Muted backgrounds | `bg-muted` |
| `--muted-foreground` | `215 20% 65%` | Secondary text | `text-muted-foreground` |

**Example Usage:**
```tsx
<div className="bg-background text-foreground">
  <div className="bg-card border border-border rounded-lg">
    <p className="text-muted-foreground">Secondary text</p>
  </div>
</div>
```

---

### 2. Priority Colors (SLA-Based)

**📍 Location:** `src/app/globals.css` (lines 31-48)

Priority levels are tied to SLA (Service Level Agreement) urgency.

| Priority | Name | SLA Target | Color Variable | BG Variable | Visual Color |
|----------|------|------------|----------------|-------------|--------------|
| **P1** | Critical | < 1 hour | `--urgent` | `--urgent-bg` | 🔴 RED |
| **P2** | High | < 4 hours | `--high` | `--high-bg` | 🟠 ORANGE |
| **P3** | Medium | < 24 hours | `--medium` | `--medium-bg` | 🔵 BLUE |
| **P4** | Low | < 72 hours | `--low` | `--low-bg` | 🟢 GREEN |

**HSL Values:**
```css
/* P1 - Critical */
--urgent: 0 84% 60%;      /* Bright red */
--urgent-bg: 0 84% 15%;   /* Dark red */

/* P2 - High */
--high: 25 95% 53%;       /* Orange */
--high-bg: 25 95% 15%;    /* Dark orange */

/* P3 - Medium */
--medium: 217 91% 60%;    /* Blue */
--medium-bg: 217 91% 15%; /* Dark blue */

/* P4 - Low */
--low: 142 71% 45%;       /* Green */
--low-bg: 142 71% 12%;    /* Dark green */
```

**How to Use - Get Priority Styles:**

**📍 File:** `src/lib/utils.ts` (lines 93-126)

```tsx
import { getPriorityStyles } from '@/lib/utils';

// In your component:
const styles = getPriorityStyles('P1'); // or 'P2', 'P3', 'P4'

// Returns:
{
  bg: 'bg-[hsl(var(--urgent-bg))]',
  text: 'text-[hsl(var(--urgent))]',
  border: 'border-[hsl(var(--urgent)/0.5)]',
  dot: 'bg-[hsl(var(--urgent))]'
}
```

**Real Example from CommandCenterStats.tsx (lines 129-158):**
```tsx
{/* P1 */}
<div className="text-center">
  <div className="w-full aspect-square rounded-lg bg-red-500/20 border border-red-500/40 flex items-center justify-center mb-1">
    <span className="text-lg font-bold text-red-400">{metrics.priorityCounts.P1}</span>
  </div>
  <span className="text-[10px] font-medium text-red-400">P1</span>
</div>

{/* P2 */}
<div className="text-center">
  <div className="w-full aspect-square rounded-lg bg-orange-500/20 border border-orange-500/40 flex items-center justify-center mb-1">
    <span className="text-lg font-bold text-orange-400">{metrics.priorityCounts.P2}</span>
  </div>
  <span className="text-[10px] font-medium text-orange-400">P2</span>
</div>
```

**CSS Utility Classes for Priority Dots:**

**📍 File:** `src/app/globals.css` (lines 324-329)

```css
.priority-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.priority-dot-p1 { background: hsl(var(--urgent)); }
.priority-dot-p2 { background: hsl(var(--high)); }
.priority-dot-p3 { background: hsl(var(--medium)); }
.priority-dot-p4 { background: hsl(var(--low)); }
```

---

### 3. AI Confidence Colors

**📍 Location:** `src/app/globals.css` (lines 50-61)

These colors indicate whether AI classification is reliable enough for auto-processing.

| Threshold | Level | Color Variable | Visual |
|-----------|-------|----------------|--------|
| **≥ 80%** | High Confidence | `--confidence-high` / `--confidence-high-bg` | 🟢 EMERALD GREEN |
| **< 80%** | Low Confidence | `--confidence-low` / `--confidence-low-bg` | 🟡 AMBER/YELLOW |

**HSL Values:**
```css
/* High Confidence (>80%) - EMERALD GREEN */
--confidence-high: 142 76% 36%;
--confidence-high-bg: 142 76% 12%;

/* Low Confidence (<80%) - AMBER/YELLOW */
--confidence-low: 38 92% 50%;
--confidence-low-bg: 38 92% 12%;
```

**How to Use - Get Confidence Styles:**

**📍 File:** `src/lib/utils.ts` (lines 188-204)

```tsx
import { getConfidenceStyles } from '@/lib/utils';

const styles = getConfidenceStyles(85); // confidence percentage

// Returns for ≥80%:
{
  bg: 'bg-[hsl(var(--confidence-high-bg))]',
  text: 'text-[hsl(var(--confidence-high))]',
  border: 'border-[hsl(var(--confidence-high)/0.5)]',
  label: 'Auto-classified',
  needsReview: false
}

// Returns for <80%:
{
  bg: 'bg-[hsl(var(--confidence-low-bg))]',
  text: 'text-[hsl(var(--confidence-low))]',
  border: 'border-[hsl(var(--confidence-low)/0.5)]',
  label: 'Needs Review',
  needsReview: true
}
```

**Real Example from ConfidenceBadge.tsx (lines 32-54):**
```tsx
export function ConfidenceBadge({ confidence, category, onClick, compact = false }: ConfidenceBadgeProps) {
  const styles = getConfidenceStyles(confidence);

  return (
    <button
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-1 rounded-md border',
        'transition-all duration-200 hover:shadow-md',
        styles.bg,      // Background from utility
        styles.border,  // Border from utility
        onClick && 'cursor-pointer hover:opacity-80'
      )}
    >
      <Sparkles className={cn('w-3 h-3', styles.text)} />
      <span className={cn('text-xs font-medium', styles.text)}>{category}</span>
      <span className={cn('text-xs font-bold', styles.text)}>{confidence}%</span>
    </button>
  );
}
```

---

### 4. Customer Tier Colors

**📍 Location:** `src/app/globals.css` (lines 63-77)

Colors for customer value tiers.

| Tier | Color Variable | Visual |
|------|----------------|--------|
| **Gold** | `--tier-gold` / `--tier-gold-bg` | 🟡 GOLD/AMBER |
| **Silver** | `--tier-silver` / `--tier-silver-bg` | ⚪ SILVER/GRAY |
| **Bronze** | `--tier-bronze` / `--tier-bronze-bg` | 🟤 BRONZE/BROWN-ORANGE |

**HSL Values:**
```css
/* Gold Tier */
--tier-gold: 45 93% 47%;
--tier-gold-bg: 45 93% 12%;

/* Silver Tier */
--tier-silver: 220 14% 71%;
--tier-silver-bg: 220 14% 20%;

/* Bronze Tier */
--tier-bronze: 30 41% 45%;
--tier-bronze-bg: 30 41% 12%;
```

**How to Use - Get Tier Styles:**

**📍 File:** `src/lib/utils.ts` (lines 149-176)

```tsx
import { getTierStyles } from '@/lib/utils';

const styles = getTierStyles('Gold'); // or 'Silver', 'Bronze'

// Returns:
{
  bg: 'bg-[hsl(var(--tier-gold-bg))]',
  text: 'text-[hsl(var(--tier-gold))]',
  border: 'border-[hsl(var(--tier-gold)/0.5)]',
  icon: '👑'  // Bonus: emoji icon
}
```

**Real Example from CommandCenterStats.tsx (lines 168-197):**
```tsx
{/* Gold */}
<div className="flex items-center gap-2">
  <span className="w-12 text-xs font-medium text-amber-400 flex items-center gap-1">
    <Crown className="w-3 h-3" /> Gold
  </span>
  <div className="flex-1">
    <MiniProgress value={metrics.tierCounts.Gold} max={metrics.totalTickets} color="bg-amber-400" />
  </div>
  <span className="w-6 text-xs font-bold text-amber-400 text-right">{metrics.tierCounts.Gold}</span>
</div>

{/* Silver */}
<div className="flex items-center gap-2">
  <span className="w-12 text-xs font-medium text-slate-300 flex items-center gap-1">
    <Medal className="w-3 h-3" /> Silver
  </span>
  <div className="flex-1">
    <MiniProgress value={metrics.tierCounts.Silver} max={metrics.totalTickets} color="bg-slate-400" />
  </div>
  <span className="w-6 text-xs font-bold text-slate-300 text-right">{metrics.tierCounts.Silver}</span>
</div>
```

---

### 5. Ticket Status Colors

**📍 Location:** `src/app/globals.css` (lines 79-85)

Colors for ticket workflow status.

| Status | Color Variable | Visual |
|--------|----------------|--------|
| **New** | `--status-new` | 🔵 BLUE |
| **In Progress** | `--status-in-progress` | 🟡 AMBER |
| **Resolved** | `--status-resolved` | 🟢 GREEN |

**HSL Values:**
```css
--status-new: 217 91% 60%;          /* Blue */
--status-in-progress: 38 92% 50%;   /* Amber */
--status-resolved: 142 71% 45%;     /* Green */
```

**How to Use - Get Status Styles:**

**📍 File:** `src/lib/utils.ts` (lines 253-284)

```tsx
import { getStatusStyles } from '@/lib/utils';

const styles = getStatusStyles('New'); // or 'In Progress', 'Resolved'

// Returns:
{
  bg: 'bg-[hsl(var(--status-new)/0.15)]',
  text: 'text-[hsl(var(--status-new))]',
  dot: 'bg-[hsl(var(--status-new))]'
}
```

---

### 6. Sentiment Colors

**📍 Location:** `src/app/globals.css` (lines 87-93)

Colors for customer sentiment analysis.

| Sentiment | Color Variable | Emoji | Visual |
|-----------|----------------|-------|--------|
| **Happy/Positive** | `--sentiment-happy` | 😊 | 🟢 GREEN |
| **Neutral** | `--sentiment-neutral` | 😐 | 🔵 BLUE |
| **Frustrated/Negative** | `--sentiment-frustrated` | 😤 | 🔴 RED |

**HSL Values:**
```css
--sentiment-happy: 142 76% 36%;     /* Green */
--sentiment-neutral: 217 91% 60%;   /* Blue */
--sentiment-frustrated: 0 84% 60%;  /* Red */
```

**How to Use - Get Sentiment Styles:**

**📍 File:** `src/lib/utils.ts` (lines 214-243)

```tsx
import { getSentimentStyles } from '@/lib/utils';

const styles = getSentimentStyles('happy'); // or 'frustrated', 'neutral'

// Returns:
{
  bg: 'bg-[hsl(var(--sentiment-happy)/0.15)]',
  text: 'text-[hsl(var(--sentiment-happy))]',
  emoji: '😊'
}
```

---

### 7. Accent & Interactive Colors

**📍 Location:** `src/app/globals.css` (lines 95-104)

Colors for interactive elements and feedback states.

| Variable | HSL Value | Usage |
|----------|-----------|-------|
| `--primary` | `217 91% 60%` | Primary buttons, links, focus states |
| `--primary-foreground` | `222 47% 6%` | Text on primary background |
| `--accent` | `262 83% 58%` | Secondary accent (purple) |
| `--accent-foreground` | `210 40% 98%` | Text on accent background |
| `--success` | `142 76% 36%` | Success messages |
| `--error` | `0 84% 60%` | Error messages |
| `--warning` | `38 92% 50%` | Warning messages |

---

## Using Colors in Components

### Method 1: Direct Tailwind Classes (Tailwind Theme Colors)

For colors registered in `@theme inline`:
```tsx
<div className="bg-background text-foreground border-border">
  <span className="text-primary">Primary accent text</span>
</div>
```

### Method 2: Arbitrary Values (For CSS Variables)

For colors not in the Tailwind theme:
```tsx
<div className="bg-[hsl(var(--urgent-bg))] text-[hsl(var(--urgent))] border-[hsl(var(--urgent)/0.5)]">
  Critical alert!
</div>
```

### Method 3: Using Utility Functions (Recommended)

Import and use style getter functions:
```tsx
import { getPriorityStyles, cn } from '@/lib/utils';

function PriorityBadge({ priority }: { priority: Priority }) {
  const styles = getPriorityStyles(priority);
  
  return (
    <span className={cn(
      'px-2 py-1 rounded-md border text-xs font-medium',
      styles.bg,
      styles.text,
      styles.border
    )}>
      {priority}
    </span>
  );
}
```

### The `cn()` Helper Function

**📍 File:** `src/lib/utils.ts` (lines 337-339)

Combines class names conditionally:

```tsx
import { cn } from '@/lib/utils';

// Usage:
className={cn(
  'base-classes',           // Always applied
  styles.bg,                // Dynamic class
  isActive && 'active-class', // Conditional
  isDisabled && 'opacity-50'  // Another conditional
)}
```

---

## Animation Classes

**📍 Location:** `src/app/globals.css` (lines 168-220)

| Class | Effect | Use Case |
|-------|--------|----------|
| `.animate-sla-pulse` | Scale + opacity pulse (1.5s) | SLA critical items |
| `.animate-critical-glow` | Red glowing box-shadow (2s) | Breached SLA items |
| `.animate-fade-in` | Fade in + slide up (0.3s) | Page/component entry |
| `.animate-slide-in-right` | Slide from right (0.3s) | Side panel entries |
| `.animate-shimmer` | Loading skeleton shimmer | Loading states |

**Example:**
```tsx
// Loading skeleton
<div className="h-28 rounded-xl bg-slate-800/50 border border-slate-700/50 animate-shimmer" />

// Fade in content
<div className="grid grid-cols-5 gap-3 animate-fade-in">
  ...
</div>

// Critical SLA pulsing
<div className={cn(
  'rounded-lg',
  isCritical && 'animate-sla-pulse'
)}>
  ...
</div>
```

---

## Custom Utility Classes

**📍 Location:** `src/app/globals.css` (lines 250-329)

### Glassmorphism Effect
```css
.glass {
  background: hsl(var(--card) / 0.8);
  backdrop-filter: blur(12px);
  border: 1px solid hsl(var(--border) / 0.5);
}
```

### Gradient Border Card
```css
.card-gradient-border {
  /* Creates a subtle gradient border effect */
}
```
```tsx
<div className="card-gradient-border p-4">
  Card with gradient border
</div>
```

### Text Gradient
```css
.text-gradient {
  background: linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```
```tsx
<h1 className="text-gradient text-3xl font-bold">
  Gradient Heading
</h1>
```

### Priority Dots
```tsx
<span className="priority-dot priority-dot-p1"></span>  {/* Red dot */}
<span className="priority-dot priority-dot-p2"></span>  {/* Orange dot */}
<span className="priority-dot priority-dot-p3"></span>  {/* Blue dot */}
<span className="priority-dot priority-dot-p4"></span>  {/* Green dot */}
```

---

## Quick Reference Table

### All CSS Variables at a Glance

| Category | Variable | HSL Value | Color |
|----------|----------|-----------|-------|
| **Base** | `--background` | `222 47% 6%` | Dark blue-gray |
| | `--foreground` | `210 40% 98%` | Near white |
| | `--card` | `222 47% 8%` | Slightly lighter |
| | `--border` | `217 33% 17%` | Subtle gray |
| | `--muted-foreground` | `215 20% 65%` | Gray text |
| **Priority** | `--urgent` | `0 84% 60%` | 🔴 Red |
| | `--high` | `25 95% 53%` | 🟠 Orange |
| | `--medium` | `217 91% 60%` | 🔵 Blue |
| | `--low` | `142 71% 45%` | 🟢 Green |
| **Confidence** | `--confidence-high` | `142 76% 36%` | 🟢 Emerald |
| | `--confidence-low` | `38 92% 50%` | 🟡 Amber |
| **Tier** | `--tier-gold` | `45 93% 47%` | 🟡 Gold |
| | `--tier-silver` | `220 14% 71%` | ⚪ Silver |
| | `--tier-bronze` | `30 41% 45%` | 🟤 Bronze |
| **Status** | `--status-new` | `217 91% 60%` | 🔵 Blue |
| | `--status-in-progress` | `38 92% 50%` | 🟡 Amber |
| | `--status-resolved` | `142 71% 45%` | 🟢 Green |
| **Accent** | `--primary` | `217 91% 60%` | Brand blue |
| | `--accent` | `262 83% 58%` | Purple |
| | `--success` | `142 76% 36%` | Green |
| | `--error` | `0 84% 60%` | Red |
| | `--warning` | `38 92% 50%` | Amber |

### Utility Functions Quick Reference

| Function | Import | Returns |
|----------|--------|---------|
| `getPriorityStyles(priority)` | `@/lib/utils` | `{ bg, text, border, dot }` |
| `getTierStyles(tier)` | `@/lib/utils` | `{ bg, text, border, icon }` |
| `getConfidenceStyles(score)` | `@/lib/utils` | `{ bg, text, border, label, needsReview }` |
| `getSentimentStyles(sentiment)` | `@/lib/utils` | `{ bg, text, emoji }` |
| `getStatusStyles(status)` | `@/lib/utils` | `{ bg, text, dot }` |
| `cn(...classes)` | `@/lib/utils` | Combined class string |

---

## File Locations Summary

| Purpose | File Path |
|---------|-----------|
| CSS Variables & Animations | `src/app/globals.css` |
| Style Utility Functions | `src/lib/utils.ts` |
| Example Component (Confidence) | `src/components/ConfidenceBadge.tsx` |
| Example Component (Dashboard) | `src/components/CommandCenterStats.tsx` |

---

*Last Updated: January 24, 2026*
*IntelliDesk AI - Color System Documentation v1.0*
