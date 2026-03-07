"use client";

import { useAuth } from "@/hooks/use-auth";

export function LoginScreen() {
  const { signIn, error, loading } = useAuth();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8 text-center relative">

      <div className="relative z-10">
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
        <h1 className="mb-0 font-display text-[4.5rem] font-normal leading-none tracking-[0.04em] text-white">
          Panther<span className="text-panther-red">Prep</span>
        </h1>
        <p className="mb-2 text-[0.95rem] font-medium uppercase tracking-[0.15em] text-text-muted">
          Test Prep Platform
        </p>
        <p className="mx-auto mb-10 max-w-[420px] text-[1.05rem] leading-relaxed text-text-secondary">
          Practice for the SAT, PSAT/NMSQT, and PSAT 8/9 with targeted questions and detailed explanations.
        </p>

        {/* Sign-in button */}
        <button
          onClick={signIn}
          disabled={loading}
          className="mx-auto flex items-center gap-3 rounded-radius-md border border-panther-red bg-panther-red px-8 py-3.5 font-body text-base font-semibold text-white transition-all duration-200 hover:-translate-y-px hover:bg-panther-dark-red hover:shadow-[0_0_24px_rgba(214,40,40,0.15)] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#fff" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#fff" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#fff" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#fff" />
          </svg>
          Sign in with Google
        </button>

        {/* Error message */}
        {error && (
          <div className="mt-4 rounded-radius-sm border border-accent-red/20 bg-accent-red-soft px-5 py-3 text-[0.9rem] text-accent-red">
            {error}
          </div>
        )}

        <p className="mt-6 text-[0.85rem] text-text-muted">
          @paps.net accounts only
        </p>
      </div>
    </div>
  );
}
