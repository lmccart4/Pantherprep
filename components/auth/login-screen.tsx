"use client";

import { useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/hooks/use-auth";

export function LoginScreen() {
  const { signIn, error, loading } = useAuth();

  // Agent auto-sign-in via URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const agent = params.get("agent");
    const key = params.get("key");
    if (agent && key) {
      window.history.replaceState({}, "", window.location.pathname);
      signInWithEmailAndPassword(auth, `${agent}@lachlan.internal`, key).catch(
        (err) => {
          console.warn("Agent sign-in failed:", err);
        }
      );
    }
  }, []);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).toUpperCase();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8 text-center relative">
      <div className="relative z-10 w-full sm:max-w-[560px] md:max-w-[640px]">
        {/* Dateline */}
        <div className="mb-4 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-ink-3">
          {today} &middot; Vol. 2 &middot; No. 17
        </div>

        {/* Triple rule */}
        <div className="mb-6">
          <div className="h-[2px] bg-ink" />
          <div className="mt-[4px] h-[4px] bg-ink" />
          <div className="mt-[4px] h-[2px] bg-ink" />
        </div>

        {/* Masthead */}
        <h1 className="mb-1 font-display text-[clamp(48px,7vw,84px)] font-bold leading-none tracking-[-0.02em] text-ink">
          Panther<em className="italic text-accent">Prep</em>
          <span className="text-accent">.</span>
        </h1>
        <p className="kicker mb-3">Test Prep Platform</p>
        <p className="mx-auto mb-8 max-w-[480px] text-base leading-relaxed text-ink-2">
          Practice for the SAT, PSAT/NMSQT, and PSAT 8/9 with targeted questions and detailed explanations.
        </p>

        {/* Value prop card */}
        <div className="card-paper mx-auto mb-10 w-full max-w-[480px] px-6 py-5 text-left">
          <div className="kicker mb-3">What&apos;s inside</div>
          <ul className="flex flex-col gap-3 text-sm leading-relaxed text-ink-2">
            <li className="flex items-start gap-3">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center border-2 border-ink bg-paper text-ink">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                </svg>
              </span>
              <span><strong className="font-bold text-ink">Full SAT, PSAT/NMSQT, and PSAT&nbsp;8/9</strong> practice tests with score estimates</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center border-2 border-ink bg-paper text-ink">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
                </svg>
              </span>
              <span><strong className="font-bold text-ink">Adaptive practice</strong> that targets your weak areas automatically</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center border-2 border-ink bg-paper text-ink">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
              </span>
              <span><strong className="font-bold text-ink">Detailed explanations</strong> for every question — built for Perth Amboy students</span>
            </li>
          </ul>
        </div>

        {/* Sign-in button */}
        <button
          onClick={signIn}
          disabled={loading}
          aria-label={loading ? "Signing in..." : "Sign in with Google"}
          aria-busy={loading}
          className="mx-auto flex items-center gap-3 border-2 border-ink bg-paper-card px-7 py-3 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-ink transition-all duration-200 hover:bg-ink hover:text-paper shadow-[5px_5px_0_var(--color-ink)] hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Sign in with Google
        </button>

        {error && (
          <div className="mt-5 border-2 border-accent bg-accent-soft px-5 py-3 text-sm text-accent">
            {error}
          </div>
        )}

        <div className="mt-6 inline-flex items-center gap-2 border border-ink bg-paper-card px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-ink-2">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <span>@paps.net school accounts only</span>
        </div>
      </div>
    </div>
  );
}
