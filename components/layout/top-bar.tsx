"use client";

import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

interface TopBarProps {
  backHref?: string;
  backLabel?: string;
  className?: string;
}

export function TopBar({ backHref, backLabel, className }: TopBarProps) {
  const { user, role, signOut } = useAuth();

  return (
    <header
      className={cn(
        "glass sticky top-0 z-40 flex items-center justify-between px-6 py-3",
        className
      )}
    >
      <div className="flex items-center gap-4">
        {backHref && (
          <a
            href={backHref}
            className="flex items-center gap-1.5 text-sm text-text-muted transition-colors hover:text-text-secondary"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className="rotate-180"
            >
              <path
                d="M6 3l5 5-5 5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {backLabel ?? "Back"}
          </a>
        )}
        <a href="/home" className="font-display text-[1.4rem] tracking-[0.04em] text-white">
          Panther<span className="text-panther-red">Prep</span>
        </a>
      </div>

      <div className="flex items-center gap-3">
        <span
          className={cn(
            "rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide",
            role === "teacher" || role === "admin"
              ? "bg-panther-red-soft text-panther-light-red"
              : "bg-white/5 text-text-secondary"
          )}
        >
          {role}
        </span>
        <span className="text-sm text-text-secondary">{user?.displayName}</span>
        <button
          onClick={signOut}
          className="rounded-radius-sm border border-border-default px-3.5 py-1.5 text-xs text-text-muted transition-all duration-200 hover:border-panther-red hover:text-panther-red"
        >
          Sign out
        </button>
      </div>
    </header>
  );
}
