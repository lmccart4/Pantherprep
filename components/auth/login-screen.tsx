"use client";

import { useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/hooks/use-auth";

export function LoginScreen() {
  const { signIn, error, loading } = useAuth();

  // Agent auto-sign-in via URL params — same pattern as pantherlearn's
  // LoginPage. Visual QA, integration checks, and nightly builds hit the
  // site with ?agent=pixel&key=<password> and get signed in as
  // pixel@lachlan.internal via Firebase email/password auth. We strip the
  // params from the URL immediately so the credentials don't leak through
  // browser history or referrer headers.
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

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8 text-center relative">

      <div className="relative z-10 w-full sm:max-w-[560px] md:max-w-[640px]">
        {/* Logo mark */}
        <div className="mb-6 flex justify-center">
          <div className="h-24 w-24 animate-[logoEntrance_0.8s_cubic-bezier(.16,1,.3,1)_forwards] drop-shadow-[0_0_32px_rgba(214,40,40,0.25)]">
            <img
              src="/apple-touch-icon.png"
              alt="PantherPrep"
              className="h-full w-full rounded-2xl object-contain"
            />
          </div>
        </div>

        {/* Branding */}
        <h1 className="mb-0 font-display text-5xl font-normal leading-none tracking-[0.04em] text-white sm:text-6xl md:text-[4.5rem]">
          Panther<span className="text-panther-red">Prep</span>
        </h1>
        <p className="mb-2 text-[0.85rem] font-medium uppercase tracking-[0.2em] text-text-muted sm:text-[0.95rem]">
          Test Prep Platform
        </p>
        <p className="mx-auto mb-8 max-w-[420px] text-base leading-relaxed text-text-secondary sm:text-[1.05rem]">
          Practice for the SAT, PSAT/NMSQT, and PSAT 8/9 with targeted questions and detailed explanations.
        </p>

        {/* Value proposition */}
        <div className="mx-auto mb-10 w-full max-w-[440px] rounded-2xl border border-white/20 bg-[rgba(15,15,22,.6)] px-6 py-5 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_8px_32px_rgba(0,0,0,0.3)] backdrop-blur-[20px] md:max-w-full">
          <ul className="flex flex-col gap-3.5 text-sm leading-relaxed text-text-secondary">
            <li className="flex items-start gap-3">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-panther-red/15 text-panther-red">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                </svg>
              </span>
              <span><strong className="font-semibold text-white">Full SAT, PSAT/NMSQT, and PSAT&nbsp;8/9</strong> practice tests with score estimates</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-panther-red/15 text-panther-red">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
                </svg>
              </span>
              <span><strong className="font-semibold text-white">Adaptive practice</strong> that targets your weak areas automatically</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-panther-red/15 text-panther-red">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
              </span>
              <span><strong className="font-semibold text-white">Detailed explanations</strong> for every question — built for Perth Amboy students</span>
            </li>
          </ul>
        </div>

        {/* Sign-in button — official Google brand treatment: white bg, colored G logo, dark text */}
        <button
          onClick={signIn}
          disabled={loading}
          aria-label={loading ? "Signing in..." : "Sign in with Google"}
          aria-busy={loading}
          className="mx-auto flex items-center gap-3 rounded-radius-md border border-white/20 bg-white px-7 py-3 font-body text-base font-semibold text-[#1f1f1f] shadow-[0_1px_2px_rgba(0,0,0,0.3)] transition-all duration-200 hover:-translate-y-px hover:shadow-[0_4px_12px_rgba(255,255,255,0.15)] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Sign in with Google
        </button>

        {/* Error message */}
        {error && (
          <div className="mt-4 rounded-radius-sm border border-accent-red/20 bg-accent-red-soft px-5 py-3 text-[0.9rem] text-accent-red">
            {error}
          </div>
        )}

        <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1 text-[0.8rem] text-text-secondary">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <span>@paps.net school accounts only</span>
        </div>
      </div>
    </div>
  );
}
