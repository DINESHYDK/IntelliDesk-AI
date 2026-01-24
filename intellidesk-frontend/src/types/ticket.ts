// ============================================================================
// SEARCH: TICKET_TYPES
// IntelliDesk AI - Core Data Models
// strictly maps to Supabase Schema
// ============================================================================

export type TicketStatus = 'New' | 'Open' | 'Resolved' | 'Closed';
export type TicketPriority = 'P1' | 'P2' | 'P3' | 'P4';
export type TicketTone = 'Angry' | 'Urgent' | 'Neutral' | string;

export interface Ticket {
  // Primary Key (maps to Gmail message_id)
  ticket_id: string;

  // Customer Data
  sender_email: string;
  customer_domain: string;
  thread_id: string;

  // Core Metadata
  subject: string;
  description: string; // raw email body
  created_at: string; // ISO 8601
  status: TicketStatus;
  priority: TicketPriority;
  category: string;

  // AI Intelligence Fields
  tone: TicketTone;
  reasoning: string;
  confidence_score: number;
  ai_draft_response: string;
}

export interface DashboardStats {
  queue_depth: number;
  critical_issues: number;
  avg_confidence: number;
}
