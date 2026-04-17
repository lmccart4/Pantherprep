"use client";

import { TopBar } from "@/components/layout/top-bar";
import { ModuleCard } from "@/components/course/module-card";

const ACCENT = "#C8102E";

const PHASES = [
  {
    phase: "Phase 1: Diagnose",
    modules: [
      { num: 1, title: "Diagnostic & Orientation", desc: "Baseline assessment across all domains", tags: ["diagnostic"] },
    ],
  },
  {
    phase: "Phase 2: Build",
    modules: [
      { num: 2, title: "Algebra — Linear Equations & Systems", desc: "Solving, graphing, and modeling with linear relationships", tags: ["lesson", "practice"] },
      { num: 3, title: "Advanced Math — Quadratics & Polynomials", desc: "Factoring, quadratic formula, and polynomial operations", tags: ["lesson", "practice"] },
      { num: 4, title: "Advanced Math — Functions & Properties", desc: "Function notation, transformations, and composition", tags: ["lesson", "practice"] },
      { num: 5, title: "Problem-Solving & Data Analysis", desc: "Ratios, percentages, probability, and statistics", tags: ["lesson", "practice"] },
      { num: 6, title: "Geometry & Trigonometry", desc: "Angles, triangles, circles, and trig ratios", tags: ["lesson", "practice"] },
    ],
  },
  {
    phase: "Phase 3: Strategize",
    modules: [
      { num: 7, title: "Desmos Mastery", desc: "Calculator strategies for maximum efficiency", tags: ["lesson", "practice"] },
      { num: 8, title: "Strategy Application & Time Management", desc: "Test-taking tactics and pacing drills", tags: ["lesson", "practice"] },
    ],
  },
  {
    phase: "Phase 4: Reflect",
    modules: [
      { num: 9, title: "Full Practice Test & Error Analysis", desc: "Complete math section with deep review", tags: ["quiz", "review"] },
      { num: 10, title: "Final Review & Test-Day Prep", desc: "Last-mile review and confidence building", tags: ["review"] },
    ],
  },
];

export default function SATMathCourse() {
  return (
    <div className="min-h-screen">
      <TopBar backHref="/home" backLabel="Home" />
      <div className="mx-auto max-w-3xl px-6 py-10">
        <div className="mb-1 h-1 w-12 rounded-full" style={{ backgroundColor: ACCENT }} />
        <h1 className="mb-2 font-display text-[2.2rem] tracking-[0.02em] text-ink">SAT Math Course</h1>
        <p className="mb-6 text-text-secondary">
          10 modules covering all four math domains with interactive lessons and practice.
        </p>

        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[["10", "Modules"], ["4", "Phases"], ["44", "SAT Questions"], ["4", "Domains"]].map(
            ([val, label]) => (
              <div key={label} className=" border border-border-default bg-bg-card px-4 py-3 text-center">
                <div className="text-lg font-bold text-ink">{val}</div>
                <div className="text-xs text-text-muted">{label}</div>
              </div>
            )
          )}
        </div>

        {/* Domain distribution */}
        <div className="mb-8 grid grid-cols-2 gap-3">
          {[
            ["Algebra", "~35%", "#60a5fa"],
            ["Advanced Math", "~35%", "#a78bfa"],
            ["Problem-Solving & Data", "~15%", "#34d399"],
            ["Geometry & Trig", "~15%", "#fb923c"],
          ].map(([name, pct, color]) => (
            <div
              key={name}
              className=" border border-border-default bg-bg-card px-4 py-3"
            >
              <div className="text-sm font-semibold" style={{ color: color as string }}>{pct}</div>
              <div className="text-xs text-text-muted">{name}</div>
            </div>
          ))}
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
                    href={`/courses/sat-math/${m.num}`}
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
