// ============================================================================
// SEARCH: TICKET_TYPES
// IntelliDesk AI - Frontend-Specific Data Models
// These types represent the view models used by UI components.
// The canonical DB types live in index.ts
// ============================================================================

export type TicketPriority = "P1" | "P2" | "P3" | "P4";
export type TicketTone = "Angry" | "Urgent" | "Neutral" | string;

/**
 * Frontend view model for tickets.
 * Used by existing UI components (EmailPanel, CustomerSidebar, etc.)
 * that expect a flattened ticket shape with display-ready fields.
 */
export interface FrontendTicket {
	// Primary Key (maps to Gmail message_id)
	ticket_id: string;
	id?: string; // alias for ticket_id, used by some UI components

	// Customer Data
	sender_email: string;
	sender: string;
	customer_domain: string;
	thread_id: string;
	customer_tier?: string;
	customer_data?: {
		company_name?: string;
		account_manager?: string;
		ltv?: string;
		ticket_count?: number;
		tier?: string;
		is_potential_lead?: boolean;
		lifetime_value?: string;
		previous_tickets?: number;
		last_contact?: string;
	};

	// Core Metadata
	subject: string;
	description: string; // raw email body
	email_body: string; // alias for description
	created_at: string; // ISO 8601
	timestamp: string; // alias for created_at
	status: string;
	priority: TicketPriority;
	category: string;

	// AI Intelligence Fields
	tone: TicketTone;
	reasoning: string;
	confidence_score: number;
	ai_draft_response: string;
	ai_analysis: {
		category: string;
		confidence: number;
		reasoning: string;
		sentiment: string;
	};

	// SLA & Thread
	sla_deadline: string;
	thread_count: number;
	thread_children?: ThreadChild[];

	// Solution links (FAQ references)
	solution_links?: { label: string; url: string; type: string; title: string }[];
}

export interface DashboardStats {
	queue_depth: number;
	critical_issues: number;
	avg_confidence: number;
	// Properties used by StatsRow component
	avg_sentiment: string;
	critical_breaches: number;
	my_queue_count: number;
}

export interface ThreadChild {
	id: string;
	subject: string;
	sender: string;
	timestamp: string;
}

/** Top-level state shape used by dashboard page and mock data */
export interface GlobalState {
	stats: Partial<DashboardStats>;
	tickets: FrontendTicket[];
}
