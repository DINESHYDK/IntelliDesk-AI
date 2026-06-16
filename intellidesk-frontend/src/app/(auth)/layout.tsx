// ============================================================================
// SEARCH: AUTH_LAYOUT
// IntelliDesk AI - Auth Route Group Layout
// Centered layout with glassmorphism branding panel
// ============================================================================

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "IntelliDesk AI | Sign In",
  description: "Sign in to your IntelliDesk AI account to manage your support dashboard.",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* Left branding panel — hidden on small screens */}
      <div
        className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative items-center justify-center overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, hsl(222 47% 6%) 0%, hsl(240 30% 8%) 50%, hsl(222 47% 5%) 100%)",
        }}
      >
        {/* Neon glow orbs */}
        <div
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
        <div
          className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(6,182,212,0.18) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 60%)",
            filter: "blur(80px)",
          }}
        />

        {/* Branding content */}
        <div className="relative z-10 text-center px-12 max-w-lg">
          {/* Logo */}
          <div className="flex items-center justify-center mb-10">
            <div
              className="relative flex items-center justify-center w-20 h-20 rounded-2xl mr-4"
              style={{
                background: "linear-gradient(135deg, rgba(99,102,241,0.3), rgba(6,182,212,0.2))",
                border: "1px solid rgba(99,102,241,0.4)",
                boxShadow: "0 0 30px rgba(99,102,241,0.3), inset 0 0 20px rgba(255,255,255,0.05)",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="url(#brain-gradient)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-10 h-10"
              >
                <defs>
                  <linearGradient id="brain-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#818cf8" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
                <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-1.024-4.07A2.5 2.5 0 0 1 5.5 8.5a2.5 2.5 0 0 1 4-2Z" />
                <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 1.024-4.07A2.5 2.5 0 0 0 18.5 8.5a2.5 2.5 0 0 0-4-2Z" />
              </svg>
            </div>
            <div className="text-left">
              <h1
                className="text-3xl font-bold tracking-tight"
                style={{
                  background: "linear-gradient(135deg, #c7d2fe, #06b6d4)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                IntelliDesk
              </h1>
              <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: "rgba(99,102,241,0.8)" }}>
                AI Support Platform
              </span>
            </div>
          </div>

          <h2 className="text-2xl font-semibold mb-4" style={{ color: "rgba(226,232,240,0.9)" }}>
            Intelligent email support,{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #818cf8, #06b6d4)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              automated.
            </span>
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: "rgba(148,163,184,0.8)" }}>
            AI-powered ticket classification, SLA tracking, and automated responses — built for B2B SaaS teams.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-2 justify-center mt-8">
            {["Auto-Classification", "SLA Monitoring", "Smart Replies", "Real-time Sync"].map(
              (feat) => (
                <span
                  key={feat}
                  className="px-3 py-1.5 rounded-full text-xs font-medium"
                  style={{
                    background: "rgba(99,102,241,0.12)",
                    border: "1px solid rgba(99,102,241,0.25)",
                    color: "rgba(165,180,252,0.9)",
                  }}
                >
                  {feat}
                </span>
              )
            )}
          </div>
        </div>
      </div>

      {/* Right auth form panel */}
      <div
        className="flex-1 flex items-center justify-center p-6"
        style={{
          background:
            "linear-gradient(160deg, hsl(222 47% 5%) 0%, hsl(240 20% 7%) 100%)",
        }}
      >
        <div className="w-full max-w-[420px]">
          {/* Mobile logo */}
          <div className="flex items-center justify-center gap-3 mb-8 lg:hidden">
            <div
              className="flex items-center justify-center w-10 h-10 rounded-xl"
              style={{
                background: "linear-gradient(135deg, rgba(99,102,241,0.3), rgba(6,182,212,0.2))",
                border: "1px solid rgba(99,102,241,0.4)",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#818cf8"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5"
              >
                <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-1.024-4.07A2.5 2.5 0 0 1 5.5 8.5a2.5 2.5 0 0 1 4-2Z" />
                <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 1.024-4.07A2.5 2.5 0 0 0 18.5 8.5a2.5 2.5 0 0 0-4-2Z" />
              </svg>
            </div>
            <span
              className="text-xl font-bold"
              style={{
                background: "linear-gradient(135deg, #c7d2fe, #06b6d4)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              IntelliDesk AI
            </span>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
