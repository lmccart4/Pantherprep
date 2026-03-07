"use client";

import { TopBar } from "@/components/layout/top-bar";
import { ModuleCard } from "@/components/course/module-card";

const ACCENT = "#d4a017";

const PHASES = [
  {
    phase: "Phase 1: Diagnose",
    modules: [
      { num: 1, title: "Diagnostic & Orientation", desc: "Baseline assessment for NMSQT math", tags: ["diagnostic"] },
    ],
  },
  {
    phase: "Phase 2: Build",
    modules: [
      { num: 2, title: "Algebra — Linear Equations & Systems", desc: "Linear equations, inequalities, and systems", tags: ["lesson", "practice"] },
      { num: 3, title: "Advanced Math — Quadratics & Exponentials", desc: "Quadratic forms, factoring, and exponential growth", tags: ["lesson", "practice"] },
      { num: 4, title: "Problem-Solving & Data Analysis", desc: "Ratios, percentages, and statistical reasoning", tags: ["lesson", "practice"] },
      { num: 5, title: "Geometry & Trigonometry", desc: "Angles, area, volume, and right triangles", tags: ["lesson", "practice"] },
    ],
  },
  {
    phase: "Phase 3: Strategize",
    modules: [
      { num: 6, title: "Desmos Mastery", desc: "Calculator strategies for NMSQT", tags: ["lesson", "practice"] },
      { num: 7, title: "Strategy & Time Management", desc: "Pacing, plugging in, and back-solving", tags: ["lesson", "practice"] },
    ],
  },
  {
    phase: "Phase 4: Reflect",
    modules: [
      { num: 8, title: "Practice Test & Final Review", desc: "Full math section practice with error analysis", tags: ["quiz", "review"] },
    ],
  },
];

export default function NMSQTMathCourse() {
  return (
    <div className="min-h-screen">
      <TopBar backHref="/home" backLabel="Home" />
      <div className="mx-auto max-w-3xl px-6 py-10">
        <div className="mb-1 h-1 w-12 rounded-full" style={{ backgroundColor: ACCENT }} />
        <h1 className="mb-2 font-display text-[2.2rem] tracking-[0.02em] text-white">
          PSAT/NMSQT Math Course
        </h1>
        <p className="mb-6 text-text-secondary">
          8 modules covering all four NMSQT math domains.
        </p>

        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[["8", "Modules"], ["4", "Phases"], ["4", "Domains"], ["120+", "Practice Qs"]].map(
            ([val, label]) => (
              <div key={label} className="rounded-radius-md border border-border-default bg-bg-card px-4 py-3 text-center">
                <div className="text-lg font-bold text-white">{val}</div>
                <div className="text-xs text-text-muted">{label}</div>
              </div>
            )
          )}
        </div>

        <div className="flex flex-col gap-8">
          {PHASES.map((phase) => (
            <div key={phase.phase}>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-muted">
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
                    href={`/courses/nmsqt-math/${m.num}`}
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
