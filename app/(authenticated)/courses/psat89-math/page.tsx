"use client";

import { TopBar } from "@/components/layout/top-bar";
import { ModuleCard } from "@/components/course/module-card";

const ACCENT = "#06b6d4";

const PHASES = [
  {
    phase: "Phase 1: Diagnose",
    modules: [
      { num: 1, title: "Diagnostic & Orientation", desc: "Baseline assessment for PSAT 8/9 math", tags: ["diagnostic"] },
    ],
  },
  {
    phase: "Phase 2: Build",
    modules: [
      { num: 2, title: "Algebra — Linear Equations & Systems", desc: "Equations, inequalities, and graphing", tags: ["lesson", "practice"] },
      { num: 3, title: "Advanced Math — Quadratics & Exponentials", desc: "Factoring, quadratic formula, and growth/decay", tags: ["lesson", "practice"] },
      { num: 4, title: "Problem-Solving & Data Analysis", desc: "Ratios, percentages, probability, and statistics", tags: ["lesson", "practice"] },
      { num: 5, title: "Geometry & Trigonometry", desc: "Angles, triangles, circles, and area/volume", tags: ["lesson", "practice"] },
    ],
  },
  {
    phase: "Phase 3: Strategize",
    modules: [
      { num: 6, title: "Desmos & Calculator Strategies", desc: "Using the graphing calculator effectively", tags: ["lesson", "practice"] },
      { num: 7, title: "Strategy & Time Management", desc: "Test-taking tactics and pacing", tags: ["lesson", "practice"] },
    ],
  },
  {
    phase: "Phase 4: Reflect",
    modules: [
      { num: 8, title: "Practice Test & Final Review", desc: "Full math section with error analysis", tags: ["quiz", "review"] },
    ],
  },
];

export default function PSAT89MathCourse() {
  return (
    <div className="min-h-screen">
      <TopBar backHref="/home" backLabel="Home" />
      <div className="mx-auto max-w-3xl px-6 py-10">
        <div className="mb-1 h-1 w-12 rounded-full" style={{ backgroundColor: ACCENT }} />
        <h1 className="mb-2 font-display text-[2.2rem] tracking-[0.02em] text-ink">
          PSAT 8/9 Math Course
        </h1>
        <p className="mb-6 text-text-secondary">
          8 modules covering all four PSAT 8/9 math domains.
        </p>

        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[["8", "Modules"], ["4", "Phases"], ["4", "Domains"], ["100+", "Practice Qs"]].map(
            ([val, label]) => (
              <div key={label} className=" border border-border-default bg-bg-card px-4 py-3 text-center">
                <div className="text-lg font-bold text-ink">{val}</div>
                <div className="text-xs text-text-muted">{label}</div>
              </div>
            )
          )}
        </div>

        <div className="flex flex-col gap-8">
          {PHASES.map((phase) => (
            <div key={phase.phase}>
              <h3 className="mb-3 kicker">
                {phase.phase}
              </h3>
              <div className="flex flex-col gap-2">
                {phase.modules.map((m) => (
                  <ModuleCard
                    key={m.num}
                    moduleNum={m.num}
                    title={m.title}
                    description={m.desc}
                    tags={m.tags}
                    href={`/courses/psat89-math/${m.num}`}
                    accentColor={ACCENT}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
