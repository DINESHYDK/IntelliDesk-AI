// ============================================================================
// SEARCH: ROOT_LAYOUT
// IntelliDesk AI - Root Layout
// ============================================================================

import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// Primary font - Inter for clean UI
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// Monospace font for code/technical content
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

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
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
