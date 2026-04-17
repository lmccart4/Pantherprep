"use client";

import Link from "next/link";
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

  const shortName = user?.displayName?.split(" ")[0] ?? "";

  const today = new Date()
    .toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    })
    .toUpperCase();

  return (
    <header className={cn("sticky top-0 z-40 bg-paper", className)}>
      <div className="relative mx-auto flex max-w-[1240px] items-end justify-between px-6 pt-5 pb-3">
        <div className="flex shrink-0 flex-col gap-1 font-mono text-[10px] font-bold uppercase leading-tight tracking-[0.14em] text-ink-3">
          {backHref ? (
            <Link
              href={backHref}
              className="flex items-center gap-1.5 text-ink-3 transition-colors hover:text-accent"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="rotate-180">
                <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>{backLabel ?? "Back"}</span>
            </Link>
          ) : (
            <div className="hidden sm:block">
              <div>{today}</div>
              <div className="text-ink-4">Vol. 2 &middot; No. 17</div>
            </div>
          )}
        </div>

        <Link
          href="/home"
          className="absolute left-1/2 top-5 -translate-x-1/2 font-display text-[clamp(28px,3.5vw,44px)] font-bold leading-none tracking-[-0.02em] text-ink"
        >
          Panther<em className="text-accent" style={{ fontStyle: "italic" }}>Prep</em>
          <span className="text-accent">.</span>
        </Link>

        <div className="flex shrink-0 items-center gap-3">
          {role && (
            <span
              className={cn(
                "hidden font-mono text-[10px] font-bold uppercase tracking-[0.14em] sm:inline-block",
                role === "teacher" || role === "admin" ? "text-accent" : "text-ink-3"
              )}
            >
              {role}
            </span>
          )}
          <span className="hidden max-w-[140px] truncate font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-ink sm:inline-block md:max-w-[220px]">
            <span className="md:hidden">{shortName}</span>
            <span className="hidden md:inline">{user?.displayName}</span>
          </span>
          <button
            onClick={signOut}
            aria-label="Sign out"
            className="border border-ink px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-ink transition-colors hover:bg-ink hover:text-paper"
          >
            <span className="hidden sm:inline">Sign out</span>
            <svg className="h-3.5 w-3.5 sm:hidden" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-[1240px] px-6">
        <div className="h-[3px] bg-ink" />
        <div className="h-[1px] bg-ink" style={{ marginTop: 2 }} />
      </div>

      <nav className="mx-auto max-w-[1240px] border-b border-ink px-6">
        <div className="flex items-center justify-between py-2">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1 font-mono text-[11px] font-bold uppercase tracking-[0.14em]">
            <NavLink href="/home" active={pathname === "/home"}>Home</NavLink>
            <NavLink href="/diagnostics" active={pathname?.startsWith("/diagnostics")}>Diagnostic</NavLink>
            <NavLink href="/skills" active={skillsActive}>Skills Library</NavLink>
            <NavLink href="/dashboard" active={pathname?.startsWith("/dashboard")}>Progress</NavLink>
            <NavLink href="/practice-tests" active={pathname?.startsWith("/practice-tests")}>Practice Test</NavLink>
          </div>
        </div>
      </nav>
    </header>
  );
}

function NavLink({
  href,
  active,
  children,
}: {
  href: string;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "transition-colors",
        active ? "bg-ink px-2 py-1 text-paper" : "text-ink-2 hover:text-accent"
      )}
    >
      {children}
    </Link>
  );
}
