// ============================================================================
// SEARCH: ROOT_LAYOUT
// IntelliDesk AI - Root Layout
// ============================================================================

import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { fraunces, plexSans, plexMono } from "./fonts";

// SEO Metadata
export const metadata: Metadata = {
  title: "IntelliDesk AI | Intelligent Email Support Dashboard",
  description: "AI-powered email support dashboard with intelligent classification, SLA tracking, and automated responses. Built for B2B SaaS companies.",
  keywords: ["AI", "Support", "Dashboard", "Email", "SLA", "Classification", "Automation"],
  authors: [{ name: "IntelliDesk Team" }],
  openGraph: {
    title: "IntelliDesk AI | Intelligent Email Support Dashboard",
    description: "AI-powered email support dashboard with intelligent classification and SLA tracking.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${fraunces.variable} ${plexSans.variable} ${plexMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
