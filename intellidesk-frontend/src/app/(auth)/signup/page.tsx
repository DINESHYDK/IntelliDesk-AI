// ============================================================================
// SEARCH: SIGNUP_PAGE
// IntelliDesk AI - Sign Up Page
// Premium glassmorphism registration form — creates new org + admin user
// ============================================================================

"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, organizationName }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Signup failed. Please try again.");
        setLoading(false);
        return;
      }

      // Auto-login after successful signup
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Account created! Please sign in manually.");
        router.push("/login");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // Shared input style helpers
  const inputStyle: React.CSSProperties = {
    background: "rgba(15,23,42,0.8)",
    border: "1px solid rgba(71, 85, 105, 0.5)",
    color: "rgba(226,232,240,0.95)",
    caretColor: "#818cf8",
  };
  const onFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.border = "1px solid rgba(99,102,241,0.6)";
    e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.12)";
  };
  const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.border = "1px solid rgba(71, 85, 105, 0.5)";
    e.target.style.boxShadow = "none";
  };

  return (
    <div
      className="w-full rounded-2xl p-8"
      style={{
        background: "rgba(15, 23, 42, 0.7)",
        border: "1px solid rgba(99, 102, 241, 0.2)",
        boxShadow:
          "0 0 40px rgba(99, 102, 241, 0.08), 0 20px 60px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255,255,255,0.06)",
        backdropFilter: "blur(20px)",
      }}
    >
      {/* Header */}
      <div className="mb-8">
        <h1
          className="text-2xl font-bold mb-1"
          style={{ color: "rgba(226,232,240,0.95)" }}
        >
          Create your account
        </h1>
        <p className="text-sm" style={{ color: "rgba(148,163,184,0.8)" }}>
          Set up IntelliDesk AI for your team
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

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Organization name */}
        <div className="space-y-1.5">
          <label
            htmlFor="signup-org"
            className="block text-sm font-medium"
            style={{ color: "rgba(203,213,225,0.9)" }}
          >
            Organization name
          </label>
          <input
            id="signup-org"
            type="text"
            required
            value={organizationName}
            onChange={(e) => setOrganizationName(e.target.value)}
            placeholder="Acme Inc."
            className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all duration-200"
            style={inputStyle}
            onFocus={onFocus}
            onBlur={onBlur}
            suppressHydrationWarning
          />
        </div>

        {/* Full name */}
        <div className="space-y-1.5">
          <label
            htmlFor="signup-name"
            className="block text-sm font-medium"
            style={{ color: "rgba(203,213,225,0.9)" }}
          >
            Your name
          </label>
          <input
            id="signup-name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jane Smith"
            className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all duration-200"
            style={inputStyle}
            onFocus={onFocus}
            onBlur={onBlur}
            suppressHydrationWarning
          />
        </div>

        {/* Work email */}
        <div className="space-y-1.5">
          <label
            htmlFor="signup-email"
            className="block text-sm font-medium"
            style={{ color: "rgba(203,213,225,0.9)" }}
          >
            Work email
          </label>
          <input
            id="signup-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="jane@acme.com"
            className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all duration-200"
            style={inputStyle}
            onFocus={onFocus}
            onBlur={onBlur}
            suppressHydrationWarning
          />
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label
            htmlFor="signup-password"
            className="block text-sm font-medium"
            style={{ color: "rgba(203,213,225,0.9)" }}
          >
            Password
          </label>
          <input
            id="signup-password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Min. 8 characters"
            className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all duration-200"
            style={inputStyle}
            onFocus={onFocus}
            onBlur={onBlur}
            suppressHydrationWarning
          />
        </div>

        {/* Submit button */}
        <button
          id="signup-submit-btn"
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-200 mt-2"
          style={{
            background: loading
              ? "rgba(99,102,241,0.5)"
              : "linear-gradient(135deg, #6366f1, #4f46e5)",
            color: "#fff",
            boxShadow: loading
              ? "none"
              : "0 0 20px rgba(99,102,241,0.35), 0 4px 15px rgba(0,0,0,0.3)",
            cursor: loading ? "not-allowed" : "pointer",
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              (e.target as HTMLButtonElement).style.boxShadow =
                "0 0 30px rgba(99,102,241,0.5), 0 6px 20px rgba(0,0,0,0.3)";
              (e.target as HTMLButtonElement).style.transform = "translateY(-1px)";
            }
          }}
          onMouseLeave={(e) => {
            if (!loading) {
              (e.target as HTMLButtonElement).style.boxShadow =
                "0 0 20px rgba(99,102,241,0.35), 0 4px 15px rgba(0,0,0,0.3)";
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
              Creating account...
            </span>
          ) : (
            "Create account"
          )}
        </button>

        {/* Terms note */}
        <p className="text-xs text-center pt-1" style={{ color: "rgba(100,116,139,0.8)" }}>
          By creating an account you agree to our terms of service.
        </p>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-4 my-6">
        <div className="flex-1 h-px" style={{ background: "rgba(51,65,85,0.6)" }} />
        <span className="text-xs" style={{ color: "rgba(100,116,139,0.8)" }}>
          Already have an account?
        </span>
        <div className="flex-1 h-px" style={{ background: "rgba(51,65,85,0.6)" }} />
      </div>

      {/* Sign in link */}
      <Link
        href="/login"
        id="signup-login-link"
        className="flex items-center justify-center w-full py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200"
        style={{
          background: "rgba(99,102,241,0.08)",
          border: "1px solid rgba(99,102,241,0.2)",
          color: "rgba(165,180,252,0.9)",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLAnchorElement).style.background = "rgba(99,102,241,0.14)";
          (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(99,102,241,0.4)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLAnchorElement).style.background = "rgba(99,102,241,0.08)";
          (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(99,102,241,0.2)";
        }}
      >
        Sign in instead
      </Link>
    </div>
  );
}
