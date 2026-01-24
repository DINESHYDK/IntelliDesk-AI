// ============================================================================
// SEARCH: MOCK_DATA
// IntelliDesk AI - Dummy Data for Development & Demo
// This data simulates the n8n webhook JSON output
// Used when API is unavailable or for offline demos
// ============================================================================

import { GlobalState } from '@/types';

/**
 * Generate a future ISO date string based on hours from now
 * Used to create realistic SLA deadlines
 */
const hoursFromNow = (hours: number): string => {
  const date = new Date();
  date.setHours(date.getHours() + hours);
  return date.toISOString();
};

/**
 * Generate a past ISO date string based on hours ago
 * Used to create realistic ticket timestamps
 */
const hoursAgo = (hours: number): string => {
  const date = new Date();
  date.setHours(date.getHours() - hours);
  return date.toISOString();
};

/**
 * MOCK_DASHBOARD_DATA
 * Complete simulation of the n8n webhook response
 * Includes diverse scenarios for testing all UI states:
 * - Different priorities (P1-P4)
 * - Various customer tiers (Gold/Silver/Bronze)
 * - Mixed confidence scores (high/low)
 * - Thread counts for deduplication
 * - Different sentiments and categories
 */
export const MOCK_DASHBOARD_DATA: GlobalState = {
  // SEARCH: STATS_DATA
  stats: {
    critical_breaches: 2,
    my_queue_count: 12,
    avg_sentiment: 'Neutral',
  },

  // SEARCH: TICKETS_DATA
  tickets: [
    // P1 - Critical ticket (SLA breach imminent)
    {
      id: 'TKT-001',
      subject: 'URGENT: Production server down - Cannot process payments',
      sender: 'cfo@tatasteel.com',
      timestamp: hoursAgo(0.5),
      status: 'New',
      priority: 'P1',
      sla_deadline: hoursFromNow(0.5), // Only 30 mins left!
      ai_analysis: {
        category: 'Technical Support',
        confidence: 94,
        reasoning: 'Detected keywords: "production", "down", "cannot process". Sender is Gold tier executive.',
        sentiment: 'Frustrated',
      },
      customer_tier: 'Gold',
      thread_count: 3,
      thread_children: [
        {
          id: 'TKT-001-A',
          subject: 'Re: URGENT: Production server down',
          sender: 'support@intellidesk.ai',
          timestamp: hoursAgo(0.3),
        },
        {
          id: 'TKT-001-B',
          subject: 'Re: URGENT: Production server down - Still waiting',
          sender: 'cfo@tatasteel.com',
          timestamp: hoursAgo(0.1),
        },
      ],
      ai_draft_response: 'Dear Customer, We have identified the issue with your production server and our engineering team is actively working on it. We expect resolution within the next 15 minutes. We apologize for the inconvenience.',
    },

    // P1 - Another critical ticket
    {
      id: 'TKT-002',
      subject: 'Invoice #45892 overcharged by $50,000 - Need immediate correction',
      sender: 'dave@infosys.com',
      timestamp: hoursAgo(0.8),
      status: 'In Progress',
      priority: 'P1',
      sla_deadline: hoursFromNow(0.2), // Almost breached!
      ai_analysis: {
        category: 'Billing',
        confidence: 98,
        reasoning: 'Detected "Invoice", "overcharged", dollar amount. High-value billing dispute.',
        sentiment: 'Frustrated',
      },
      customer_tier: 'Gold',
      thread_count: 1,
      ai_draft_response: 'Dear Dave, We have reviewed Invoice #45892 and confirmed the overcharge. A credit memo for $50,000 has been issued and will reflect in your account within 24 hours.',
    },

    // P2 - High priority
    {
      id: 'TKT-003',
      subject: 'API rate limits affecting our integration',
      sender: 'tech.lead@wipro.com',
      timestamp: hoursAgo(2),
      status: 'New',
      priority: 'P2',
      sla_deadline: hoursFromNow(2),
      ai_analysis: {
        category: 'Technical Support',
        confidence: 87,
        reasoning: 'Technical issue related to API. Keywords: "rate limits", "integration".',
        sentiment: 'Neutral',
      },
      customer_tier: 'Silver',
      thread_count: 2,
      thread_children: [
        {
          id: 'TKT-003-A',
          subject: 'Re: API rate limits',
          sender: 'tech.lead@wipro.com',
          timestamp: hoursAgo(1.5),
        },
      ],
      ai_draft_response: 'Hello, We can increase your API rate limits to 10,000 requests/minute. Please confirm if this meets your requirements.',
    },

    // P2 - High priority with low confidence (needs review)
    {
      id: 'TKT-004',
      subject: 'Question about enterprise features',
      sender: 'procurement@reliance.com',
      timestamp: hoursAgo(1.5),
      status: 'New',
      priority: 'P2',
      sla_deadline: hoursFromNow(2.5),
      ai_analysis: {
        category: 'Sales Inquiry',
        confidence: 65, // Low confidence - needs human review
        reasoning: 'Possible sales inquiry but could also be account-related. Ambiguous intent.',
        sentiment: 'Neutral',
      },
      customer_tier: 'Gold',
      thread_count: 1,
    },

    // P3 - Medium priority
    {
      id: 'TKT-005',
      subject: 'How to export reports in CSV format?',
      sender: 'analyst@hcl.com',
      timestamp: hoursAgo(5),
      status: 'New',
      priority: 'P3',
      sla_deadline: hoursFromNow(19),
      ai_analysis: {
        category: 'How-To Question',
        confidence: 92,
        reasoning: 'Clear how-to question about feature usage. Keywords: "how to", "export".',
        sentiment: 'Neutral',
      },
      customer_tier: 'Silver',
      thread_count: 1,
      ai_draft_response: 'Hi! To export reports in CSV format, navigate to Reports > Export > Select CSV. You can also schedule automatic exports from Settings > Automation.',
    },

    // P3 - Medium priority
    {
      id: 'TKT-006',
      subject: 'Request access for 5 new team members',
      sender: 'hr@mahindra.com',
      timestamp: hoursAgo(8),
      status: 'In Progress',
      priority: 'P3',
      sla_deadline: hoursFromNow(16),
      ai_analysis: {
        category: 'Account Management',
        confidence: 88,
        reasoning: 'Account/user management request. Keywords: "access", "team members".',
        sentiment: 'Happy',
      },
      customer_tier: 'Bronze',
      thread_count: 1,
      ai_draft_response: 'Hello! I have provisioned 5 new user accounts. Login credentials have been sent to the email addresses provided.',
    },

    // P4 - Low priority
    {
      id: 'TKT-007',
      subject: 'Feedback: Love the new dashboard design!',
      sender: 'user@startupxyz.com',
      timestamp: hoursAgo(24),
      status: 'Resolved',
      priority: 'P4',
      sla_deadline: hoursFromNow(48),
      ai_analysis: {
        category: 'Feedback',
        confidence: 96,
        reasoning: 'Positive feedback, no action required. Keywords: "love", "feedback".',
        sentiment: 'Happy',
      },
      customer_tier: 'Bronze',
      thread_count: 1,
    },

    // P4 - Low priority documentation request
    {
      id: 'TKT-008',
      subject: 'Looking for API documentation',
      sender: 'developer@techcorp.in',
      timestamp: hoursAgo(20),
      status: 'New',
      priority: 'P4',
      sla_deadline: hoursFromNow(52),
      ai_analysis: {
        category: 'Documentation Request',
        confidence: 91,
        reasoning: 'Documentation request. Keywords: "documentation", "API".',
        sentiment: 'Neutral',
      },
      customer_tier: 'Silver',
      thread_count: 1,
      ai_draft_response: 'Hello! Our complete API documentation is available at docs.intellidesk.ai/api. Let me know if you need any specific guidance!',
    },

    // P3 - Medium with multiple threads (deduplication demo)
    {
      id: 'TKT-009',
      subject: 'Login issues across multiple devices',
      sender: 'admin@bhartiairtel.com',
      timestamp: hoursAgo(10),
      status: 'In Progress',
      priority: 'P3',
      sla_deadline: hoursFromNow(14),
      ai_analysis: {
        category: 'Technical Support',
        confidence: 85,
        reasoning: 'Authentication issue. Keywords: "login", "issues", "devices".',
        sentiment: 'Frustrated',
      },
      customer_tier: 'Gold',
      thread_count: 5,
      thread_children: [
        {
          id: 'TKT-009-A',
          subject: 'Re: Login issues - Tried clearing cache',
          sender: 'admin@bhartiairtel.com',
          timestamp: hoursAgo(9),
        },
        {
          id: 'TKT-009-B',
          subject: 'Re: Login issues - Still not working',
          sender: 'admin@bhartiairtel.com',
          timestamp: hoursAgo(7),
        },
        {
          id: 'TKT-009-C',
          subject: 'Re: Login issues - Tried different browser',
          sender: 'admin@bhartiairtel.com',
          timestamp: hoursAgo(5),
        },
        {
          id: 'TKT-009-D',
          subject: 'Re: Login issues - Please escalate',
          sender: 'admin@bhartiairtel.com',
          timestamp: hoursAgo(3),
        },
      ],
    },

    // P2 - High priority with low confidence
    {
      id: 'TKT-010',
      subject: 'Compliance audit requirements',
      sender: 'legal@icicibank.com',
      timestamp: hoursAgo(3),
      status: 'New',
      priority: 'P2',
      sla_deadline: hoursFromNow(1),
      ai_analysis: {
        category: 'Compliance',
        confidence: 72, // Needs human review
        reasoning: 'Legal/compliance related. Requires careful handling. Keywords: "compliance", "audit".',
        sentiment: 'Neutral',
      },
      customer_tier: 'Gold',
      thread_count: 1,
    },
  ],
};

// ============================================================================
// SEARCH: API_CONFIG
// Configuration for API endpoints and fallback behavior
// ============================================================================

export const API_CONFIG = {
  // Placeholder URL - replace with actual n8n webhook URL
  ENDPOINT: process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || '/api/dashboard',
  
  // Polling interval in milliseconds (30 seconds)
  POLL_INTERVAL: 30000,
  
  // Whether to use mock data as fallback
  USE_MOCK_FALLBACK: true,
};
