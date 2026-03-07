"use client";

import { TopBar } from "@/components/layout/top-bar";
import { ModuleCard } from "@/components/course/module-card";

const ACCENT = "#C8102E";

const UNITS = [
  {
    phase: "Orientation",
    modules: [
      { num: 0, title: "Diagnostic & Roadmap", desc: "Assess your baseline and build a study plan", tags: ["diagnostic"] },
    ],
  },
  {
    phase: "Standard English Conventions",
    modules: [
      { num: 1, title: "Sentence Boundaries", desc: "Run-ons, fragments, and comma splices", tags: ["lesson", "practice"] },
      { num: 2, title: "Commas, Colons & Dashes", desc: "Punctuation rules for clarity", tags: ["lesson", "practice"] },
      { num: 3, title: "Subject-Verb Agreement", desc: "Tricky subjects and intervening phrases", tags: ["lesson", "practice"] },
      { num: 4, title: "Conventions Boss Battle", desc: "Mixed conventions under timed pressure", tags: ["boss", "quiz"], isBoss: true },
    ],
  },
  {
    phase: "Vocabulary & Craft",
    modules: [
      { num: 5, title: "Words in Context", desc: "Precise vocabulary from context clues", tags: ["lesson", "practice"] },
      { num: 6, title: "Text Structure & Purpose", desc: "Identifying author's purpose and organization", tags: ["lesson", "practice"] },
      { num: 7, title: "Cross-Text Connections", desc: "Comparing and synthesizing paired passages", tags: ["lesson", "practice"] },
      { num: 8, title: "Craft & Structure Boss Battle", desc: "Mixed craft skills timed challenge", tags: ["boss", "quiz"], isBoss: true },
    ],
  },
  {
    phase: "Information & Ideas",
    modules: [
      { num: 9, title: "Central Ideas & Details", desc: "Main ideas, supporting evidence, summaries", tags: ["lesson", "practice"] },
      { num: 10, title: "Inferences & Evidence", desc: "Drawing conclusions from textual evidence", tags: ["lesson", "practice"] },
      { num: 11, title: "Command of Quantitative Evidence", desc: "Tables, graphs, and data in passages", tags: ["lesson", "practice"] },
      { num: 12, title: "Information Boss Battle", desc: "Mixed information skills challenge", tags: ["boss", "quiz"], isBoss: true },
    ],
  },
  {
    phase: "Expression of Ideas",
    modules: [
      { num: 13, title: "Transitions", desc: "Logical connections between ideas", tags: ["lesson", "practice"] },
      { num: 14, title: "Rhetorical Synthesis", desc: "Combining information from notes effectively", tags: ["lesson", "practice"] },
      { num: 15, title: "Form, Structure & Sense", desc: "Sentence placement and paragraph organization", tags: ["lesson", "practice"] },
      { num: 16, title: "Expression Boss Battle", desc: "Mixed expression skills challenge", tags: ["boss", "quiz"], isBoss: true },
      { num: 17, title: "Full R&W Review", desc: "Comprehensive review of all domains", tags: ["review"] },
    ],
  },
  {
    phase: "Assessment",
    modules: [
      { num: 18, title: "Practice Test & Error Analysis", desc: "Full-length R&W section with deep review", tags: ["quiz", "review"] },
    ],
  },
];

export default function SATRWCourse() {
  return (
    <div className="min-h-screen">
      <TopBar backHref="/home" backLabel="Home" />
      <div className="mx-auto max-w-3xl px-6 py-10">
        <div className="mb-1 h-1 w-12 rounded-full" style={{ backgroundColor: ACCENT }} />
        <h1 className="mb-2 font-display text-[2.2rem] tracking-[0.02em] text-white">
          SAT Reading & Writing
        </h1>
        <p className="mb-6 text-text-secondary">
          18 interactive modules covering all four R&W domains with lessons, practice, and boss battles.
        </p>

        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[["18", "Modules"], ["5", "Units"], ["17", "Question Types"], ["200+", "Practice Qs"]].map(
            ([val, label]) => (
              <div key={label} className="rounded-radius-md border border-border-default bg-bg-card px-4 py-3 text-center">
                <div className="text-lg font-bold text-white">{val}</div>
                <div className="text-xs text-text-muted">{label}</div>
              </div>
            )
          )}
        </div>

        <div className="flex flex-col gap-8">
          {UNITS.map((unit) => (
            <div key={unit.phase}>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-muted">
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
                    href={`/courses/sat-rw/${m.num}`}
                    accentColor={ACCENT}
                    isBoss={m.isBoss}
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
