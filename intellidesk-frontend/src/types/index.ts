// ============================================================================
// SEARCH: TYPES_GLOBAL_STATE
// IntelliDesk AI - TypeScript Interfaces
// These types match the expected n8n webhook JSON output structure
// ============================================================================

/**
 * AI Analysis metadata for each ticket
 * Contains classification results from the AI model
 */
export interface AIAnalysis {
  category: string;           // e.g., "Billing", "Technical Support", "Account"
  confidence: number;         // 0-100 percentage
  reasoning: string;          // e.g., "Detected keyword 'Invoice'"
  sentiment: string;          // e.g., "Frustrated", "Neutral", "Happy"
}

/**
 * Thread child represents a merged/deduplicated email
 * Part of the deduplication visualization feature
 */
export interface ThreadChild {
  id: string;
  subject: string;
  sender: string;
  timestamp: string;          // ISO Date string
}

/**
 * Solution resource link (video, doc, manual)
 */
export interface SolutionLink {
  title: string;
  url: string;
  type: 'video' | 'doc' | 'manual' | 'faq';
}

/**
 * Customer insight data for sidebar
 */
export interface CustomerData {
  company_name: string;
  is_potential_lead: boolean;
  previous_tickets: number;
  lifetime_value?: string;
  last_contact?: string;
  account_manager?: string;
}

/**
 * Individual support ticket with all metadata
 * Core data structure for the dashboard
 */
export interface Ticket {
  id: string;
  subject: string;
  sender: string;             // e.g., "dave@tatasteel.com"
  timestamp: string;          // ISO Date string
  status: 'New' | 'In Progress' | 'Resolved';
  priority: 'P1' | 'P2' | 'P3' | 'P4';
  sla_deadline: string;       // ISO Date string (Future time)
  ai_analysis: AIAnalysis;
  customer_tier: 'Gold' | 'Silver' | 'Bronze';
  thread_count: number;       // Number of merged emails for deduplication
  thread_children?: ThreadChild[];  // Array of merged emails
  ai_draft_response?: string; // Pre-generated AI response
  // Phase 1: Full email body
  email_body?: string;
  // Phase 2: Solution resources
  solution_links?: SolutionLink[];
  // Phase 3: Customer insights
  customer_data?: CustomerData;
}

/**
 * Dashboard statistics summary
 * Displayed in the stats row at the top
 */
export interface DashboardStats {
  critical_breaches: number;  // Count of SLA breaches
  my_queue_count: number;     // Tickets assigned to current user
  avg_sentiment: 'Neutral' | 'Frustrated' | 'Happy';
}

/**
 * Global application state from n8n webhook
 * This is the SINGLE JSON OBJECT received from the backend
 */
export interface GlobalState {
  stats: DashboardStats;
  tickets: Ticket[];
}

// ============================================================================
// SEARCH: PRIORITY_HELPERS
// Priority and SLA related type utilities
// ============================================================================

export type Priority = 'P1' | 'P2' | 'P3' | 'P4';
export type CustomerTier = 'Gold' | 'Silver' | 'Bronze';
export type TicketStatus = 'New' | 'In Progress' | 'Resolved';
export type Sentiment = 'Neutral' | 'Frustrated' | 'Happy';

/**
 * SLA time limits in hours for each priority level
 */
export const SLA_HOURS: Record<Priority, number> = {
  P1: 1,   // Critical: < 1 hour
  P2: 4,   // High: < 4 hours
  P3: 24,  // Medium: < 24 hours
  P4: 72,  // Low: < 72 hours
};

/**
 * Priority display labels
 */
export const PRIORITY_LABELS: Record<Priority, string> = {
  P1: 'Critical',
  P2: 'High',
  P3: 'Medium',
  P4: 'Low',
};
