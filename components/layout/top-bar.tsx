"use client";

import { useAuth } from "@/hooks/use-auth";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface TopBarProps {
  backHref?: string;
  backLabel?: string;
  className?: string;
}

export function TopBar({ backHref, backLabel, className }: TopBarProps) {
  const { user, role, signOut } = useAuth();
  const pathname = usePathname();
  const skillsActive = pathname?.startsWith("/skills") ?? false;

  // Truncate long displayNames on narrow viewports so the top-right trio
  // (role badge + name + sign-out) doesn't collide with the wordmark.
  const shortName = user?.displayName?.split(" ")[0] ?? "";

  return (
    <header
      className={cn(
        "glass sticky top-0 z-40 flex items-center justify-between px-4 py-3 sm:px-6",
        className
      )}
    >
      <div className="flex min-w-0 items-center gap-3 sm:gap-4">
        {backHref && (
          <a
            href={backHref}
            className="flex shrink-0 items-center gap-1.5 text-sm text-text-muted transition-colors hover:text-text-secondary"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="rotate-180">
              <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="hidden sm:inline">{backLabel ?? "Back"}</span>
          </a>
        )}
        <a
          href="/home"
          className="truncate font-display text-lg tracking-[0.04em] text-white sm:text-[1.4rem]"
        >
          Panther<span className="text-panther-red">Prep</span>
        </a>
        <span className="hidden h-4 w-px bg-white/15 sm:inline-block" aria-hidden />
        <a
          href="/skills"
          className={cn(
            "hidden shrink-0 text-sm font-medium transition-colors sm:inline-block",
            skillsActive
              ? "text-white"
              : "text-text-muted hover:text-text-secondary"
          )}
        >
          Skills
        </a>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        {/* Role badge — only shown on sm+ to save mobile space */}
        <span
          className={cn(
            "hidden rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide sm:inline-block",
            role === "teacher" || role === "admin"
              ? "bg-panther-red-soft text-panther-light-red"
              : "bg-white/5 text-text-secondary"
          )}
        >
          {role}
        </span>
        {/* Display name — hidden on the smallest viewports, short form on sm */}
        <span className="hidden max-w-[140px] truncate text-sm text-text-secondary sm:inline-block md:max-w-[220px]">
          <span className="md:hidden">{shortName}</span>
          <span className="hidden md:inline">{user?.displayName}</span>
        </span>
        <button
          onClick={signOut}
          aria-label="Sign out"
          className="rounded-radius-sm border border-border-default px-3 py-1.5 text-xs text-text-muted transition-all duration-200 hover:border-panther-red hover:text-panther-red"
        >
          <span className="hidden sm:inline">Sign out</span>
          <svg className="h-4 w-4 sm:hidden" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </button>
      </div>
    </header>
  );
}
