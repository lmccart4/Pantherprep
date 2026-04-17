"use client";

import { TopBar } from "@/components/layout/top-bar";
import { ModuleCard } from "@/components/course/module-card";

const ACCENT = "#d4a017";

const UNITS = [
  {
    phase: "Foundations",
    modules: [
      { num: 1, title: "Diagnostic & Orientation", desc: "Assess your baseline R&W skills", tags: ["diagnostic"] },
      { num: 2, title: "Sentence Boundaries", desc: "Semicolons, colons, and sentence structure", tags: ["lesson", "practice"] },
      { num: 3, title: "Agreement & Modifiers", desc: "Subject-verb agreement and modifier placement", tags: ["lesson", "practice"] },
      { num: 4, title: "Words in Context", desc: "Vocabulary from context and word parts", tags: ["lesson", "practice"] },
    ],
  },
  {
    phase: "Skill Building",
    modules: [
      { num: 5, title: "Central Ideas & Inferences", desc: "Main ideas, supporting details, and drawing conclusions", tags: ["lesson", "practice"] },
      { num: 6, title: "Command of Evidence", desc: "Textual and quantitative evidence skills", tags: ["lesson", "practice"] },
      { num: 7, title: "Text Structure & Purpose", desc: "Analyzing organization and rhetorical choices", tags: ["lesson", "practice"] },
      { num: 8, title: "Transitions & Synthesis", desc: "Logical connections and rhetorical synthesis", tags: ["lesson", "practice"] },
    ],
  },
  {
    phase: "Test Readiness",
    modules: [
      { num: 9, title: "Expression of Ideas", desc: "Effective language use and revision", tags: ["lesson", "practice"] },
      { num: 10, title: "Timed Practice Simulation", desc: "Full-section timed practice with review", tags: ["quiz", "review"] },
      { num: 11, title: "Error Analysis Workshop", desc: "Analyze mistakes and strengthen weak areas", tags: ["review"] },
      { num: 12, title: "Final Review & Strategies", desc: "Last-mile prep and test-day tips", tags: ["review"] },
    ],
  },
];

export default function NMSQTRWCourse() {
  return (
    <div className="min-h-screen">
      <TopBar backHref="/home" backLabel="Home" />
      <div className="mx-auto max-w-3xl px-6 py-10">
        <div className="mb-1 h-1 w-12 rounded-full" style={{ backgroundColor: ACCENT }} />
        <h1 className="mb-2 font-display text-[2.2rem] tracking-[0.02em] text-ink">
          PSAT/NMSQT Reading & Writing
        </h1>
        <p className="mb-6 text-text-secondary">
          12 modules designed for National Merit qualification.
        </p>

        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[["12", "Modules"], ["3", "Phases"], ["4", "Domains"], ["200+", "Practice Qs"]].map(
            ([val, label]) => (
              <div key={label} className=" border border-border-default bg-bg-card px-4 py-3 text-center">
                <div className="text-lg font-bold text-ink">{val}</div>
                <div className="text-xs text-text-muted">{label}</div>
              </div>
            )
          )}
        </div>

        <div className="flex flex-col gap-8">
          {UNITS.map((unit) => (
            <div key={unit.phase}>
              <h3 className="mb-3 kicker">
                {unit.phase}
              </h3>
              <div className="flex flex-col gap-2">
                {unit.modules.map((m) => (
                  <ModuleCard
                    key={m.num}
                    moduleNum={m.num}
                    title={m.title}
                    description={m.desc}
                    tags={m.tags}
                    href={`/courses/nmsqt-rw/${m.num}`}
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
