// ============================================================================
// SEARCH: LOGIN_PAGE
// IntelliDesk AI - Login Page
// Premium glassmorphism login form with NextAuth credentials provider
// ============================================================================

"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

// ============================================================================
// SEARCH: LOGIN_FORM
// ============================================================================
function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password. Please try again.");
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="w-full rounded-2xl p-8"
      style={{
        background: "hsla(28,8%,11%,0.85)",
        border: "1px solid hsla(250,80%,72%,0.18)",
        boxShadow:
          "0 0 40px hsla(250,80%,72%,0.06), 0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)",
        backdropFilter: "blur(20px)",
      }}
    >
      {/* Header */}
      <div className="mb-8">
        <h1
          className="text-2xl font-bold mb-1"
          style={{ color: "rgba(226,232,240,0.95)" }}
        >
          Welcome back
        </h1>
        <p className="text-sm" style={{ color: "rgba(148,163,184,0.8)" }}>
          Sign in to your IntelliDesk account
        </p>
      </div>

      {/* Error message */}
      {error && (
        <div
          className="flex items-center gap-2.5 rounded-xl px-4 py-3 mb-6 text-sm"
          style={{
            background: "rgba(239, 68, 68, 0.1)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            color: "rgba(252, 165, 165, 0.95)",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="w-4 h-4 shrink-0"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email field */}
        <div className="space-y-1.5">
          <label
            htmlFor="login-email"
            className="block text-sm font-medium"
            style={{ color: "rgba(203,213,225,0.9)" }}
          >
            Email address
          </label>
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all duration-200"
            style={{
              background: "rgba(15,23,42,0.8)",
              border: "1px solid rgba(71, 85, 105, 0.5)",
              color: "rgba(226,232,240,0.95)",
              caretColor: "#818cf8",
            }}
            onFocus={(e) => {
              e.target.style.border = "1px solid hsla(250,80%,72%,0.55)";
              e.target.style.boxShadow = "0 0 0 3px hsla(250,80%,72%,0.12)";
            }}
            onBlur={(e) => {
              e.target.style.border = "1px solid rgba(71, 85, 105, 0.5)";
              e.target.style.boxShadow = "none";
            }}
            suppressHydrationWarning
          />
        </div>

        {/* Password field */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="login-password"
              className="block text-sm font-medium"
              style={{ color: "rgba(203,213,225,0.9)" }}
            >
              Password
            </label>
          </div>
          <input
            id="login-password"
            type="password"
            autoComplete="current-password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all duration-200"
            style={{
              background: "rgba(15,23,42,0.8)",
              border: "1px solid rgba(71, 85, 105, 0.5)",
              color: "rgba(226,232,240,0.95)",
              caretColor: "#818cf8",
            }}
            onFocus={(e) => {
              e.target.style.border = "1px solid rgba(99,102,241,0.6)";
              e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.12)";
            }}
            onBlur={(e) => {
              e.target.style.border = "1px solid rgba(71, 85, 105, 0.5)";
              e.target.style.boxShadow = "none";
            }}
            suppressHydrationWarning
          />
        </div>

        {/* Submit button */}
        <button
          id="login-submit-btn"
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-200 relative overflow-hidden"
          style={{
            background: loading
              ? "hsla(250,80%,72%,0.45)"
              : "linear-gradient(135deg, hsl(250,80%,68%), hsl(250,70%,55%))",
            color: "#fff",
            boxShadow: loading
              ? "none"
              : "0 0 20px hsla(250,80%,72%,0.30), 0 4px 15px rgba(0,0,0,0.3)",
            cursor: loading ? "not-allowed" : "pointer",
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              (e.target as HTMLButtonElement).style.boxShadow =
                "0 0 30px hsla(250,80%,72%,0.45), 0 6px 20px rgba(0,0,0,0.3)";
              (e.target as HTMLButtonElement).style.transform = "translateY(-1px)";
            }
          }}
          onMouseLeave={(e) => {
            if (!loading) {
              (e.target as HTMLButtonElement).style.boxShadow =
                "0 0 20px hsla(250,80%,72%,0.30), 0 4px 15px rgba(0,0,0,0.3)";
              (e.target as HTMLButtonElement).style.transform = "translateY(0)";
            }
          }}
          suppressHydrationWarning
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin w-4 h-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Signing in...
            </span>
          ) : (
            "Sign in"
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-4 my-6">
        <div className="flex-1 h-px" style={{ background: "rgba(51,65,85,0.6)" }} />
        <span className="text-xs" style={{ color: "rgba(100,116,139,0.8)" }}>
          New to IntelliDesk?
        </span>
        <div className="flex-1 h-px" style={{ background: "rgba(51,65,85,0.6)" }} />
      </div>

      {/* Sign up link */}
      <Link
        href="/signup"
        id="login-signup-link"
        className="flex items-center justify-center w-full py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200"
        style={{
          background: "hsla(250,80%,72%,0.07)",
          border: "1px solid hsla(250,80%,72%,0.18)",
          color: "hsl(250,80%,80%)",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLAnchorElement).style.background = "hsla(250,80%,72%,0.13)";
          (e.currentTarget as HTMLAnchorElement).style.borderColor = "hsla(250,80%,72%,0.35)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLAnchorElement).style.background = "hsla(250,80%,72%,0.07)";
          (e.currentTarget as HTMLAnchorElement).style.borderColor = "hsla(250,80%,72%,0.18)";
        }}
      >
        Create an account
      </Link>
    </div>
  );
}

// ============================================================================
// SEARCH: LOGIN_PAGE_EXPORT
// ============================================================================
export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full rounded-2xl p-8 animate-pulse"
          style={{
            background: "rgba(15, 23, 42, 0.7)",
            border: "1px solid rgba(99, 102, 241, 0.2)",
          }}
        >
          <div className="h-7 w-32 rounded-lg mb-2" style={{ background: "rgba(51,65,85,0.5)" }} />
          <div className="h-4 w-48 rounded-lg" style={{ background: "rgba(51,65,85,0.3)" }} />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
