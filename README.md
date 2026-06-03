# IntelliDesk AI

**IntelliDesk AI** is a next-generation, AI-powered helpdesk interface designed to streamline customer support workflows. It leverages a modern tech stack to provide agents with a high-performance, aesthetically pleasing, and intelligent dashboard for managing tickets, visualizing threads, and generating AI-assisted responses.

## 🚀 Tech Stack

### Frontend
- **Framework:** [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **Library:** [React 19](https://react.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Components:** Custom components built with [Radix UI](https://www.radix-ui.com/) primitives.
- **Icons:** [Lucide React](https://lucide.dev/)
- **Utilities:** `clsx`, `tailwind-merge`, `date-fns`

### Backend / Data
- **BaaS (Backend as a Service):** [Supabase](https://supabase.com/)
  - Database (PostgreSQL)
  - Authentication
  - Real-time subscriptions
- **State/Mocking:** `dummy-data.ts` is currently used for UI prototyping, with a transition strategy to Supabase integration via `src/lib/supabase.ts`.

## ✨ Key Features

- **Command Center Dashboard:** Real-time statistics, priority tracking, and SLA monitoring.
- **Intelligent Ticket Workspace:**
  - **Thread Visualizer:** Graphical representation of email/message threads.
  - **AI Response Panel:** Generates context-aware responses for agents.
  - **Customer Sidebar:** Detailed customer profile and history at a glance.
- **Smart Components:**
  - **SLA Timer:** Dynamic countdowns for service level agreements.
  - **Confidence Badges:** AI confidence scores for categorization and solution matching.
  - **Reasoning Overlay:** Explains *why* the AI made a certain recommendation.
- **Theme Support:** Fully integrated Light/Dark mode with high-contrast accessibility.

## 📂 Project Structure

```bash
intellidesk-frontend/
├── src/
│   ├── app/                # Next.js App Router (Pages & Layouts)
│   ├── components/         # Reusable UI Components
│   │   ├── ui/             # Generic UI atoms (Buttons, Inputs, etc.)
│   │   ├── workspace/      # Specific components for the Ticket Workspace
│   │   │   ├── TicketWorkspace.tsx  # Main workspace layout
│   │   │   ├── AIResponsePanel.tsx  # AI drafting interface
│   │   │   └── CustomerSidebar.tsx  # Customer context
│   │   └── ...             # Feature-specific components (CommandCenter, Header, etc.)
│   ├── lib/                # Utilities & Configurations
│   │   ├── supabase.ts     # Supabase client instantiation
│   │   └── dummy-data.ts   # Mock data for development
│   ├── types/              # TypeScript definitions
│   └── hooks/              # Custom React hooks
├── public/                 # Static assets
└── ...config files         # Tailwind, Next.js, ESLint, etc.
```

## 🛠️ Setup & Installation

Follow these steps to get the project running locally.

### 1. Prerequisites
- **Node.js** (v18+ recommended)
- **npm** or **yarn**

### 2. Clone & Install
Navigate to the project directory:
```bash
cd intellidesk-frontend
```

Install dependencies:
```bash
npm install
```
*Alternatively, run `install_deps.bat` on Windows to install specific core dependencies.*

### 3. Environment Configuration
Create a `.env.local` file in the `intellidesk-frontend` root directory and add your Supabase credentials. This is crucial for the Supabase authentication and database connection to work:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 4. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) (or port 3001 if 3000 is taken, checking the console output) to view the application.

## 🎨 UI/UX Philosophy
The interface is designed with a "Premium & Dynamic" aesthetic:
- **Glassmorphism & Gradients:** Used subtly to add depth and modernize the dashboard feel.
- **Micro-animations:** Smooth transitions for hover states and interactions to keep the experience lively.
- **Data Density:** Designed to present high-density information clearly, suitable for power users (agents).

## 🧩 Component Details

- **`TicketTable.tsx`**: The central grid for managing tickets, supporting sorting, filtering, and status updates. It handles searching against the dummy or live data.
- **`TicketWorkspace.tsx`**: The detail view for a specific ticket. It orchestrates the `EmailPanel`, `AIResponsePanel`, and `CustomerSidebar`.
- **`AIReasoningOverlay.tsx`**: A specialized modal/overlay that provides transparency into LLM decision-making, helping build trust with the agent.
- **`Header.tsx`**: Contains the global navigation and the Theme Toggle logic.

---
**IntelliDesk AI** — *Empowering Support Teams with Intelligence.*
