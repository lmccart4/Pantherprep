"use client";

import Link from "next/link";
import { TopBar } from "@/components/layout/top-bar";

type Option = {
  href: string;
  track: string;
  title: string;
  italic?: string;
  subtitle: string;
  description: string;
  minutes: number;
  primary?: boolean;
};

const OPTIONS: Option[] = [
  {
    href: "/diagnostics/sat-rw",
    track: "SAT",
    title: "SAT",
    italic: "Reading & Writing",
    subtitle: "54 questions · 2 modules",
    description: "Full Digital SAT R&W diagnostic. Adaptive by module.",
    minutes: 64,
    primary: true,
  },
  {
    href: "/diagnostics/sat-math",
    track: "SAT",
    title: "SAT",
    italic: "Math",
    subtitle: "44 questions · 2 modules",
    description: "Algebra, Advanced Math, Data, Geometry & Trig.",
    minutes: 70,
    primary: true,
  },
  {
    href: "/diagnostics/nmsqt-rw",
    track: "PSAT/NMSQT",
    title: "PSAT/NMSQT",
    italic: "Reading & Writing",
    subtitle: "54 questions · 2 modules",
    description: "10th & 11th grade scholarship qualifier.",
    minutes: 64,
  },
  {
    href: "/diagnostics/nmsqt-math",
    track: "PSAT/NMSQT",
    title: "PSAT/NMSQT",
    italic: "Math",
    subtitle: "44 questions · 2 modules",
    description: "Same format as the SAT, slightly easier ceiling.",
    minutes: 70,
  },
  {
    href: "/diagnostics/psat89-rw",
    track: "PSAT 8/9",
    title: "PSAT 8/9",
    italic: "Reading & Writing",
    subtitle: "42 questions · 2 modules",
    description: "Entry-level test for 8th and 9th graders.",
    minutes: 54,
  },
  {
    href: "/diagnostics/psat89-math",
    track: "PSAT 8/9",
    title: "PSAT 8/9",
    italic: "Math",
    subtitle: "34 questions · 2 modules",
    description: "Foundations: linear, ratios, intro stats.",
    minutes: 60,
  },
];

export default function DiagnosticsIndex() {
  return (
    <div className="min-h-screen bg-paper">
      <TopBar backHref="/home" backLabel="Home" />

      <main className="mx-auto max-w-[1240px] px-6 py-10">
        <header className="mb-10 flex items-baseline justify-between border-b-2 border-ink pb-4">
          <div>
            <div className="kicker mb-2">Today&rsquo;s section</div>
            <h1 className="font-display text-[clamp(44px,5vw,72px)] leading-[0.95] text-ink">
              Choose a <em className="text-accent" style={{ fontStyle: "italic" }}>diagnostic</em>.
            </h1>
          </div>
          <div className="hidden font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-ink-3 sm:block">
            Six tracks · Pick one
          </div>
        </header>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {OPTIONS.map((opt, i) => (
            <Link
              key={opt.href}
              href={opt.href}
              className="group relative block border-2 border-ink bg-paper-card p-6 transition-transform hover:-translate-y-0.5 hover:shadow-[5px_5px_0_var(--color-ink)]"
            >
              {opt.primary && (
                <div className="absolute -top-[2px] left-0 right-0 h-1 bg-accent" />
              )}
              <div className="mb-3 flex items-baseline justify-between">
                <div className="kicker">
                  {opt.primary ? "Primary track" : "Alt track"}
                </div>
                <div className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-ink-4">
                  {String(i + 1).padStart(2, "0")} / {String(OPTIONS.length).padStart(2, "0")}
                </div>
              </div>
              <h2 className="mb-1 font-display text-[32px] leading-tight text-ink">
                {opt.title}{" "}
                {opt.italic && (
                  <em className="text-accent" style={{ fontStyle: "italic" }}>
                    {opt.italic}
                  </em>
                )}
              </h2>
              <div className="mb-4 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-ink-3">
                {opt.subtitle}
              </div>
              <p className="mb-6 font-body text-[15px] italic leading-[1.55] text-ink-2">
                {opt.description}
              </p>
              <div className="flex items-baseline justify-between border-t border-rule-hair pt-3">
                <div className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-ink-3">
                  {opt.minutes} min
                </div>
                <div className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-accent transition-all group-hover:translate-x-1">
                  Start &rarr;
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
