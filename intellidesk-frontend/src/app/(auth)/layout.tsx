// ============================================================================
// SEARCH: AUTH_LAYOUT
// IntelliDesk AI - Auth Route Group Layout
// Two-panel split: branding left, form right — Rev. 2 palette
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
    <div className="min-h-screen flex" style={{ background: "hsl(30 9% 7%)" }}>

      {/* ────────────────────────────────────────────────────────────────────
          Left branding panel
      ──────────────────────────────────────────────────────────────────── */}
      <div
        className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative items-center justify-center overflow-hidden"
        style={{
          background:
            "linear-gradient(145deg, hsl(30 9% 7%) 0%, hsl(28 8% 9%) 60%, hsl(250 20% 9%) 100%)",
        }}
      >
        {/* Soft ambient glows — pastel violet + teal, no neon */}
        <div
          className="absolute top-1/4 left-1/3 w-72 h-72 rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, hsla(250,80%,72%,0.14) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, hsla(188,72%,65%,0.10) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />

        {/* Branding content */}
        <div className="relative z-10 text-center px-12 max-w-lg">

          {/* Logo mark */}
          <div className="flex items-center justify-center mb-10">
            <div
              className="relative flex items-center justify-center w-20 h-20 rounded-2xl mr-5"
              style={{
                background: "hsla(250,80%,72%,0.12)",
                border: "1px solid hsla(250,80%,72%,0.28)",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-10 h-10"
              >
                <defs>
                  <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="hsl(250,80%,78%)" />
                    <stop offset="100%" stopColor="hsl(188,72%,65%)" />
                  </linearGradient>
                </defs>
                <path stroke="url(#logo-grad)" d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-1.024-4.07A2.5 2.5 0 0 1 5.5 8.5a2.5 2.5 0 0 1 4-2Z" />
                <path stroke="url(#logo-grad)" d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 1.024-4.07A2.5 2.5 0 0 0 18.5 8.5a2.5 2.5 0 0 0-4-2Z" />
              </svg>
            </div>
            <div className="text-left">
              {/* Fraunces wordmark via CSS variable set in layout */}
              <h1
                className="text-3xl font-medium tracking-tight italic"
                style={{
                  fontFamily: "var(--font-display, Georgia, serif)",
                  background: "linear-gradient(135deg, hsl(250,80%,80%), hsl(188,72%,70%))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                IntelliDesk
              </h1>
              <span
                className="text-xs font-semibold tracking-widest uppercase"
                style={{ color: "hsla(250,80%,72%,0.75)", fontFamily: "var(--font-sans, sans-serif)" }}
              >
                AI Support Platform
              </span>
            </div>
          </div>

          {/* Hero headline */}
          <h2
            className="text-2xl font-semibold mb-4 leading-snug"
            style={{ color: "hsl(30 10% 88%)", fontFamily: "var(--font-sans, sans-serif)" }}
          >
            Intelligent email support,{" "}
            <span
              style={{
                background: "linear-gradient(135deg, hsl(250,80%,78%), hsl(188,72%,68%))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              automated.
            </span>
          </h2>

          <p
            className="text-sm leading-relaxed"
            style={{ color: "hsl(30 6% 60%)", fontFamily: "var(--font-sans, sans-serif)" }}
          >
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
                    background: "hsla(250,80%,72%,0.10)",
                    border: "1px solid hsla(250,80%,72%,0.22)",
                    color: "hsl(250,80%,82%)",
                    fontFamily: "var(--font-sans, sans-serif)",
                  }}
                >
                  {feat}
                </span>
              )
            )}
          </div>

          {/* Subtle stat bar at the bottom */}
          <div
            className="flex items-center justify-center gap-8 mt-14 pt-8"
            style={{ borderTop: "1px solid hsla(28,7%,17%,1)" }}
          >
            {[
              { value: "99.9%", label: "Uptime" },
              { value: "<2s",   label: "Avg response" },
              { value: "AI",    label: "Powered" },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <p
                  className="text-xl font-semibold tabular-nums"
                  style={{
                    color: "hsl(250,80%,78%)",
                    fontFamily: "var(--font-mono, monospace)",
                  }}
                >
                  {value}
                </p>
                <p className="text-xs mt-0.5" style={{ color: "hsl(30 6% 50%)" }}>
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────────────────
          Right form panel
      ──────────────────────────────────────────────────────────────────── */}
      <div
        className="flex-1 flex items-center justify-center p-6"
        style={{ background: "hsl(28 8% 8%)" }}
      >
        <div className="w-full max-w-[420px]">
          {/* Mobile logo — only shows when left panel is hidden */}
          <div className="flex items-center justify-center gap-3 mb-8 lg:hidden">
            <div
              className="flex items-center justify-center w-10 h-10 rounded-xl"
              style={{
                background: "hsla(250,80%,72%,0.12)",
                border: "1px solid hsla(250,80%,72%,0.28)",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5"
              >
                <path stroke="hsl(250,80%,78%)" d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-1.024-4.07A2.5 2.5 0 0 1 5.5 8.5a2.5 2.5 0 0 1 4-2Z" />
                <path stroke="hsl(250,80%,78%)" d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 1.024-4.07A2.5 2.5 0 0 0 18.5 8.5a2.5 2.5 0 0 0-4-2Z" />
              </svg>
            </div>
            <span
              className="text-xl font-medium italic"
              style={{
                fontFamily: "var(--font-display, Georgia, serif)",
                background: "linear-gradient(135deg, hsl(250,80%,80%), hsl(188,72%,68%))",
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
