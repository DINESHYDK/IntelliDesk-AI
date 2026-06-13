// ============================================================================
// SEARCH: MOCK_DATA
// IntelliDesk AI - Dummy Data for Development & Demo
// This data simulates the n8n webhook JSON output
// ============================================================================

import { GlobalState } from '@/types';

const hoursFromNow = (hours: number): string => {
  const date = new Date();
  date.setHours(date.getHours() + hours);
  return date.toISOString();
};

const hoursAgo = (hours: number): string => {
  const date = new Date();
  date.setHours(date.getHours() - hours);
  return date.toISOString();
};

const daysAgo = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
};

// SEARCH: MOCK_DASHBOARD_DATA
const RAW_MOCK_DATA = {
  stats: {
    critical_breaches: 2,
    my_queue_count: 12,
    avg_sentiment: 'Neutral',
  },

  tickets: [
    // P1 - Critical ticket with full email body
    {
      id: 'TKT-001',
      subject: 'URGENT: Production server down - Cannot process payments',
      sender: 'cfo@tatasteel.com',
      timestamp: hoursAgo(0.5),
      status: 'New',
      priority: 'P1',
      sla_deadline: hoursFromNow(0.5),
      ai_analysis: {
        category: 'Technical Support',
        confidence: 94,
        reasoning: 'Detected keywords: "production", "down", "cannot process". Sender is Gold tier executive.',
        sentiment: 'Frustrated',
      },
      customer_tier: 'Gold',
      thread_count: 3,
      thread_children: [
        { id: 'TKT-001-A', subject: 'Re: URGENT: Production server down', sender: 'support@intellidesk.ai', timestamp: hoursAgo(0.3) },
        { id: 'TKT-001-B', subject: 'Re: URGENT: Production server down - Still waiting', sender: 'cfo@tatasteel.com', timestamp: hoursAgo(0.1) },
      ],
      email_body: `Hi Support Team,

This is absolutely critical. Our production payment gateway has been down for the past 45 minutes and we are losing transactions by the minute.

Error message we're seeing:
"Gateway Timeout - Connection to payment processor failed (Error Code: PG-5023)"

We have a major shipment confirmation pending worth ₹4.2 Cr and the client is on a call with us RIGHT NOW asking why their payment isn't going through.

I've already tried:
- Restarting the application server
- Checking our firewall rules
- Contacting our bank (they say it's on your end)

Please escalate this immediately to your engineering team. We need someone on a call within the next 15 minutes or I'm escalating to your CEO directly.

Regards,
Vikram Sharma
Chief Financial Officer
Tata Steel Ltd.
+91 98765 43210`,
      ai_draft_response: `Dear Mr. Sharma,

I completely understand the urgency of this situation and sincerely apologize for the disruption to your payment operations.

I have immediately escalated this to our Tier-1 Engineering team and they are actively investigating the PG-5023 error. Our initial analysis indicates this may be related to a connection timeout with the payment processor's API endpoint.

**Immediate Actions Taken:**
1. Engineering team engaged (Incident #INC-2024-0892)
2. Payment processor notified for coordinated investigation  
3. Temporary failover gateway being prepared as backup

**Estimated Resolution:** 15-20 minutes

I will personally monitor this case and provide you updates every 5 minutes until resolution. A senior engineer will be joining a call with you shortly.

Best regards,
IntelliDesk AI Support`,
      solution_links: [
        { title: 'Payment Gateway Troubleshooting Guide', url: 'https://docs.intellidesk.ai/gateway-troubleshoot', type: 'doc' },
        { title: 'Emergency Escalation Procedures', url: 'https://docs.intellidesk.ai/escalation', type: 'manual' },
        { title: 'PG-5023 Error Resolution Video', url: 'https://videos.intellidesk.ai/pg-5023-fix', type: 'video' },
      ],
      customer_data: {
        company_name: 'Tata Steel Ltd.',
        is_potential_lead: false,
        previous_tickets: 23,
        lifetime_value: '₹2.4 Cr',
        last_contact: daysAgo(5),
        account_manager: 'Priya Reddy',
      },
    },

    // P1 - Billing critical
    {
      id: 'TKT-002',
      subject: 'Invoice #45892 overcharged by $50,000 - Need immediate correction',
      sender: 'dave.wilson@infosys.com',
      timestamp: hoursAgo(0.8),
      status: 'In Progress',
      priority: 'P1',
      sla_deadline: hoursFromNow(0.2),
      ai_analysis: {
        category: 'Billing',
        confidence: 98,
        reasoning: 'Detected "Invoice", "overcharged", dollar amount. High-value billing dispute.',
        sentiment: 'Frustrated',
      },
      customer_tier: 'Gold',
      thread_count: 1,
      email_body: `Hi Billing Team,

I just received Invoice #45892 dated Jan 20, 2024 and the amount is completely wrong.

Invoice shows: $75,000
Our contract rate: $25,000/month

That's a $50,000 overcharge! I've attached our signed contract for reference (see MSA-2023-INF-0234.pdf).

This needs to be corrected immediately as our finance team has flagged this for audit. We cannot process payment until this is resolved.

Please issue a corrected invoice within 24 hours or we'll need to escalate to procurement leadership.

Thanks,
Dave Wilson
Senior Procurement Manager
Infosys Technologies
Mumbai, India`,
      ai_draft_response: `Dear Dave,

Thank you for bringing this to our attention. I have reviewed Invoice #45892 and confirmed the discrepancy you mentioned.

**Investigation Results:**
- Your contracted rate: $25,000/month ✓
- Billed amount: $75,000 (incorrect)
- Variance: $50,000 overcharge

This error occurred due to an incorrect billing code being applied during our system migration last week. 

**Resolution:**
1. Credit memo for $50,000 has been issued (CM-2024-0123)
2. Corrected invoice will be sent within 2 hours
3. This will reflect in your account within 24-48 hours

I sincerely apologize for this inconvenience. Please let me know if you need anything else.

Best regards,
IntelliDesk AI Billing Support`,
      solution_links: [
        { title: 'Invoice Correction Process', url: 'https://docs.intellidesk.ai/billing/corrections', type: 'doc' },
        { title: 'Credit Memo FAQ', url: 'https://help.intellidesk.ai/credit-memo', type: 'faq' },
      ],
      customer_data: {
        company_name: 'Infosys Technologies',
        is_potential_lead: false,
        previous_tickets: 45,
        lifetime_value: '$890,000',
        last_contact: daysAgo(12),
        account_manager: 'Rahul Kapoor',
      },
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
        { id: 'TKT-003-A', subject: 'Re: API rate limits', sender: 'tech.lead@wipro.com', timestamp: hoursAgo(1.5) },
      ],
      email_body: `Hello Support,

We're experiencing HTTP 429 (Too Many Requests) errors on our production integration since this morning.

Current usage: ~8,000 requests/minute
Error rate: 15% of requests failing

Our batch processing jobs are timing out and this is affecting our client deliverables.

Questions:
1. What is our current rate limit tier?
2. Can we get a temporary increase while we optimize?
3. Is there a bulk API endpoint we should use instead?

Environment: Production (API Key: sk_live_***4521)

Thanks,
Ankit Sharma
Technical Lead, Integration Team
Wipro Ltd.`,
      ai_draft_response: `Hi Ankit,

I understand the API rate limit issues are impacting your production workloads. Let me address each of your questions:

**Current Status:**
- Your tier: Silver (5,000 req/min limit)
- Current usage: 8,000 req/min (60% over limit)

**Immediate Solutions:**

1. **Temporary Rate Increase:** I've applied a 24-hour emergency increase to 12,000 req/min while you optimize.

2. **Bulk API Endpoint:** Yes! Use \`POST /v2/batch\` instead of individual calls. This allows up to 100 operations per request and doesn't count against rate limits the same way.

3. **Optimization Tips:**
   - Implement exponential backoff
   - Cache responses where possible
   - Use webhooks instead of polling

The rate increase is active immediately. Would you like to schedule a call with our solutions architect to discuss long-term optimization?

Best,
IntelliDesk AI Support`,
      solution_links: [
        { title: 'Rate Limiting Best Practices', url: 'https://docs.intellidesk.ai/api/rate-limits', type: 'doc' },
        { title: 'Batch API Tutorial', url: 'https://videos.intellidesk.ai/batch-api', type: 'video' },
        { title: 'API Optimization Guide', url: 'https://docs.intellidesk.ai/api/optimization', type: 'manual' },
      ],
      customer_data: {
        company_name: 'Wipro Ltd.',
        is_potential_lead: false,
        previous_tickets: 18,
        lifetime_value: '$340,000',
        last_contact: daysAgo(8),
        account_manager: 'Sanjay Mehta',
      },
    },

    // P2 - Low confidence (needs review)
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
        confidence: 65,
        reasoning: 'Possible sales inquiry but could also be account-related. Ambiguous intent.',
        sentiment: 'Neutral',
      },
      customer_tier: 'Gold',
      thread_count: 1,
      email_body: `Hi,

We're currently evaluating our options for expanding our support infrastructure and have some questions about your enterprise tier.

Specifically interested in:
- SSO/SAML integration capabilities
- Custom SLA configurations
- Dedicated account management
- On-premise deployment options
- Data residency in India

We currently have 50 support agents and are planning to scale to 200+ by Q3.

Could you arrange a call with your enterprise sales team? Our CTO would also like to join.

Best,
Procurement Team
Reliance Industries Ltd.`,
      ai_draft_response: `Hello,

Thank you for your interest in our Enterprise tier! I'd be happy to address your questions and arrange a meeting with our enterprise team.

**Quick Answers:**
- ✅ SSO/SAML: Full support for Okta, Azure AD, OneLogin
- ✅ Custom SLAs: Fully configurable per customer tier
- ✅ Dedicated AM: Included with Enterprise+
- ✅ On-premise: Available (also hybrid cloud option)
- ✅ India data residency: Mumbai region available

For a team scaling to 200+ agents, I recommend our **Enterprise Plus** package which includes priority support and quarterly business reviews.

I'm connecting you with Rajesh Iyer, our Enterprise Solutions Director for the APAC region. He'll reach out within the hour to schedule a call with your CTO.

Best regards,
IntelliDesk AI`,
      solution_links: [
        { title: 'Enterprise Features Overview', url: 'https://intellidesk.ai/enterprise', type: 'doc' },
        { title: 'SSO Setup Guide', url: 'https://docs.intellidesk.ai/sso', type: 'manual' },
      ],
      customer_data: {
        company_name: 'Reliance Industries Ltd.',
        is_potential_lead: true,
        previous_tickets: 3,
        lifetime_value: '₹45 Lakh',
        last_contact: daysAgo(30),
        account_manager: 'Pending Assignment',
      },
    },

    // P3 - How-to question
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
        confidence: 97,
        reasoning: 'Clear how-to question about feature usage. Keywords: "how to", "export".',
        sentiment: 'Neutral',
      },
      customer_tier: 'Silver',
      thread_count: 1,
      email_body: `Hi Support,

Quick question - how do I export my monthly ticket analytics report to CSV?

I can see the dashboard but can't find the export button anywhere. Need this for our weekly management review.

Thanks!
Meera`,
      ai_draft_response: `Hi Meera!

Great question - exporting reports is easy. Here's how:

**Steps to Export CSV:**
1. Go to **Analytics** → **Reports**
2. Select your date range (e.g., "Last 30 days")
3. Click the **⋮** menu in the top-right corner
4. Select **Export** → **CSV Format**

**Pro Tip:** You can also schedule automatic exports!
- Go to **Settings** → **Automation** → **Scheduled Reports**
- Set frequency to "Weekly" and choose your email

The CSV will include all ticket metrics, agent performance, and SLA compliance data.

Let me know if you need help with anything else!

Best,
IntelliDesk AI Support`,
      solution_links: [
        { title: 'Exporting Reports Guide', url: 'https://docs.intellidesk.ai/reports/export', type: 'doc' },
        { title: 'Report Export Video Tutorial', url: 'https://videos.intellidesk.ai/export-csv', type: 'video' },
      ],
      customer_data: {
        company_name: 'HCL Technologies',
        is_potential_lead: false,
        previous_tickets: 8,
        lifetime_value: '$125,000',
        last_contact: daysAgo(15),
        account_manager: 'Arjun Patel',
      },
    },

    // P3 - Account management
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
        confidence: 92,
        reasoning: 'Account/user management request. Keywords: "access", "team members".',
        sentiment: 'Happy',
      },
      customer_tier: 'Bronze',
      thread_count: 1,
      email_body: `Hi Team,

We have 5 new hires joining the support team next week and need accounts created.

Details:
1. Arun Kumar - arun.k@mahindra.com - Agent
2. Priya Nair - priya.n@mahindra.com - Agent
3. Ravi Shankar - ravi.s@mahindra.com - Agent
4. Deepa Menon - deepa.m@mahindra.com - Team Lead
5. Karthik Iyer - karthik.i@mahindra.com - Agent

Please assign them to the "Mumbai Support" team with standard agent permissions. Deepa should have team lead access to view team analytics.

Thanks,
HR Team
Mahindra & Mahindra`,
      ai_draft_response: `Hello HR Team,

I've created accounts for all 5 new team members. Here are the details:

**Accounts Created:**
| Name | Email | Role | Team |
|------|-------|------|------|
| Arun Kumar | arun.k@mahindra.com | Agent | Mumbai Support |
| Priya Nair | priya.n@mahindra.com | Agent | Mumbai Support |
| Ravi Shankar | ravi.s@mahindra.com | Agent | Mumbai Support |
| Deepa Menon | deepa.m@mahindra.com | Team Lead | Mumbai Support |
| Karthik Iyer | karthik.i@mahindra.com | Agent | Mumbai Support |

**Next Steps:**
- Login credentials sent to each email address
- First-time login will require password reset
- Deepa has team analytics access enabled

Welcome aboard to the new team members! 🎉

Best,
IntelliDesk AI Support`,
      solution_links: [
        { title: 'User Management Guide', url: 'https://docs.intellidesk.ai/admin/users', type: 'doc' },
      ],
      customer_data: {
        company_name: 'Mahindra & Mahindra',
        is_potential_lead: false,
        previous_tickets: 12,
        lifetime_value: '₹18 Lakh',
        last_contact: daysAgo(3),
        account_manager: 'Vikram Singh',
      },
    },

    // P4 - Feedback
    {
      id: 'TKT-007',
      subject: 'Feedback: Love the new dashboard design!',
      sender: 'founder@startupxyz.com',
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
      email_body: `Hey team!

Just wanted to drop a quick note - the new dashboard redesign is AMAZING! 

The dark mode is so much easier on the eyes during late night support shifts, and the SLA countdown timers are super helpful.

One small suggestion: would be cool to have keyboard shortcuts for common actions. Just a thought!

Keep up the great work! 🚀

Cheers,
Amit
Founder, StartupXYZ`,
      ai_draft_response: `Hi Amit! 👋

Thank you so much for the kind words - feedback like this really makes our day!

We're thrilled you're enjoying the new dashboard, especially the dark mode (we're night owls too! 🦉).

**About keyboard shortcuts:** Great suggestion! This is actually on our Q2 roadmap. We're planning:
- \`K\` - Navigate between tickets
- \`R\` - Quick reply
- \`E\` - Escalate
- \`/\` - Search

Would love your input on what shortcuts would be most useful. Mind if we reach out when we have a beta?

Thanks for being an awesome customer!

Best,
The IntelliDesk Team`,
      solution_links: [],
      customer_data: {
        company_name: 'StartupXYZ',
        is_potential_lead: true,
        previous_tickets: 4,
        lifetime_value: '$2,400',
        last_contact: daysAgo(1),
        account_manager: 'Self-service',
      },
    },

    // P4 - Documentation request
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
      email_body: `Hi,

I'm a developer working on integrating IntelliDesk with our internal tools. Where can I find the API documentation?

Specifically looking for:
- REST API endpoints
- Authentication methods (OAuth2?)
- Webhook events list
- Rate limits
- SDK availability (preferably Python or Node.js)

Thanks,
Dev Team`,
      ai_draft_response: `Hello Developer! 

Here are all the resources you need:

**📚 Documentation:**
- REST API Docs: https://docs.intellidesk.ai/api
- Authentication Guide: https://docs.intellidesk.ai/auth (OAuth2 + API Keys)
- Webhooks Reference: https://docs.intellidesk.ai/webhooks

**🔧 SDKs Available:**
- Python: \`pip install intellidesk\`
- Node.js: \`npm install @intellidesk/sdk\`
- Go: \`go get github.com/intellidesk/go-sdk\`

**📊 Rate Limits (Silver tier):**
- 5,000 requests/minute
- 100,000 requests/day
- Bulk endpoints: 10,000 operations/request

**🎯 Quick Start:**
Check out our interactive API playground at https://api.intellidesk.ai/playground

Need help with a specific integration? Our developer relations team does 1:1 onboarding calls!

Cheers,
IntelliDesk AI`,
      solution_links: [
        { title: 'API Documentation', url: 'https://docs.intellidesk.ai/api', type: 'doc' },
        { title: 'Getting Started Video', url: 'https://videos.intellidesk.ai/api-quickstart', type: 'video' },
        { title: 'SDK Reference', url: 'https://docs.intellidesk.ai/sdk', type: 'manual' },
      ],
      customer_data: {
        company_name: 'TechCorp India',
        is_potential_lead: false,
        previous_tickets: 6,
        lifetime_value: '$45,000',
        last_contact: daysAgo(22),
        account_manager: 'Neha Gupta',
      },
    },

    // P3 - Multi-thread deduplication demo
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
        { id: 'TKT-009-A', subject: 'Re: Login issues - Tried clearing cache', sender: 'admin@bhartiairtel.com', timestamp: hoursAgo(9) },
        { id: 'TKT-009-B', subject: 'Re: Login issues - Still not working', sender: 'admin@bhartiairtel.com', timestamp: hoursAgo(7) },
        { id: 'TKT-009-C', subject: 'Re: Login issues - Tried different browser', sender: 'admin@bhartiairtel.com', timestamp: hoursAgo(5) },
        { id: 'TKT-009-D', subject: 'Re: Login issues - Please escalate', sender: 'admin@bhartiairtel.com', timestamp: hoursAgo(3) },
      ],
      email_body: `Hi Support,

Multiple users on our team are unable to login since yesterday morning. We're getting "Session expired" errors even after fresh login.

Affected users: ~25 agents
Browsers tried: Chrome, Firefox, Edge
Devices: Both desktop and mobile

This is blocking our entire support operation. We've already tried:
1. Clearing cache and cookies
2. Different browsers
3. Incognito mode
4. Different networks (office + mobile data)

Nothing works. Please help urgently!

- Airtel IT Admin`,
      ai_draft_response: `Hi Airtel IT Admin,

I apologize for the login issues affecting your team. Based on the symptoms you described, this appears to be related to a session token issue.

**Root Cause Identified:**
Our investigation shows a session validation change deployed yesterday may be affecting accounts with special characters in usernames.

**Immediate Fix:**
1. We've deployed a hotfix (v2.3.47)
2. Please ask all affected users to:
   - Clear browser cookies for *.intellidesk.ai
   - Wait 5 minutes
   - Login again

**Verification:**
I've tested with your admin account and confirmed login is working.

For the 25 affected agents, we can force-logout all sessions from our end if the above doesn't work. Just confirm and I'll do it immediately.

Again, sorry for the disruption. This is being escalated to our engineering leadership for review.

Best,
IntelliDesk AI Support`,
      solution_links: [
        { title: 'Session Troubleshooting', url: 'https://docs.intellidesk.ai/troubleshoot/sessions', type: 'doc' },
        { title: 'Force Logout Guide', url: 'https://docs.intellidesk.ai/admin/force-logout', type: 'manual' },
      ],
      customer_data: {
        company_name: 'Bharti Airtel Ltd.',
        is_potential_lead: false,
        previous_tickets: 34,
        lifetime_value: '₹1.8 Cr',
        last_contact: daysAgo(2),
        account_manager: 'Priya Reddy',
      },
    },

    // P2 - Compliance
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
        confidence: 72,
        reasoning: 'Legal/compliance related. Requires careful handling. Keywords: "compliance", "audit".',
        sentiment: 'Neutral',
      },
      customer_tier: 'Gold',
      thread_count: 1,
      email_body: `Dear IntelliDesk Team,

As part of our annual RBI compliance audit, we require the following documentation for our records:

1. SOC 2 Type II report (current year)
2. Data Processing Agreement (DPA) with data residency details
3. Penetration test results summary
4. Business Continuity Plan (BCP) overview
5. Incident response procedures

Please provide these by end of week if possible. Our auditors are arriving next Monday.

Additionally, can you confirm:
- Data encryption standards (at-rest and in-transit)
- Employee background verification process
- Subprocessor list

Thank you for your cooperation.

Legal & Compliance Team
ICICI Bank Ltd.`,
      ai_draft_response: `Dear ICICI Bank Compliance Team,

Thank you for reaching out. We take compliance very seriously and are happy to support your RBI audit.

**Documents Ready for Immediate Delivery:**
1. ✅ SOC 2 Type II Report (2024) - Attached
2. ✅ Data Processing Agreement - Attached
3. ✅ Pen Test Summary (Q4 2024) - Attached
4. ✅ BCP Overview - Attached
5. ✅ Incident Response Procedures - Attached

**Confirmations:**
- **Encryption:** AES-256 at-rest, TLS 1.3 in-transit
- **Background Verification:** All employees undergo criminal + employment verification via AuthBridge
- **Subprocessors:** AWS (Mumbai), Cloudflare, SendGrid (list attached)

I'm also CC'ing our Chief Compliance Officer, Sunita Rao, who can join a call with your auditors if needed.

Please let us know if you require any additional documentation.

Best regards,
IntelliDesk Legal & Compliance`,
      solution_links: [
        { title: 'Security & Compliance Portal', url: 'https://trust.intellidesk.ai', type: 'doc' },
        { title: 'SOC 2 Report Request', url: 'https://intellidesk.ai/security/soc2', type: 'manual' },
      ],
      customer_data: {
        company_name: 'ICICI Bank Ltd.',
        is_potential_lead: false,
        previous_tickets: 52,
        lifetime_value: '₹4.2 Cr',
        last_contact: daysAgo(7),
        account_manager: 'Amit Shah',
      },
    },
  ],
};

export const MOCK_DASHBOARD_DATA: GlobalState = {
  stats: RAW_MOCK_DATA.stats,
  tickets: RAW_MOCK_DATA.tickets.map((t: any) => ({
    ...t,
    ticket_id: t.ticket_id || t.id,
    sender_email: t.sender_email || t.sender,
    customer_domain: t.customer_domain || (t.sender && t.sender.includes('@') ? t.sender.split('@')[1] : 'unknown.com'),
    thread_id: t.thread_id || t.id + '_thread',
    description: t.description || t.email_body || '',
    created_at: t.created_at || t.timestamp,
    category: t.category || t.ai_analysis?.category || 'General Inquiry',
    tone: t.tone || t.ai_analysis?.sentiment || 'Neutral',
    reasoning: t.reasoning || t.ai_analysis?.reasoning || '',
    confidence_score: t.confidence_score !== undefined ? t.confidence_score : (t.ai_analysis?.confidence !== undefined ? t.ai_analysis.confidence / 100 : 0.8),
    ai_draft_response: t.ai_draft_response || '',
    solution_links: (t.solution_links || []).map((link: any) => ({
      ...link,
      label: link.label || link.title,
    })),
  })),
};

export const API_CONFIG = {
  ENDPOINT: process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || '/api/dashboard',
  POLL_INTERVAL: 30000,
  USE_MOCK_FALLBACK: true,
};
