"use client";

import { TopBar } from "@/components/layout/top-bar";
import { ModuleCard } from "@/components/course/module-card";

const ACCENT = "#06b6d4";

const UNITS = [
  {
    phase: "Foundations",
    modules: [
      { num: 1, title: "Diagnostic & Orientation", desc: "Assess your baseline R&W skills for PSAT 8/9", tags: ["diagnostic"] },
      { num: 2, title: "Sentence Boundaries", desc: "Independent clauses, run-ons, and fragments", tags: ["lesson", "practice"] },
      { num: 3, title: "Agreement & Verb Forms", desc: "Subject-verb agreement and tense consistency", tags: ["lesson", "practice"] },
    ],
  },
  {
    phase: "Skill Building",
    modules: [
      { num: 4, title: "Words in Context", desc: "Vocabulary and precise word choice", tags: ["lesson", "practice"] },
      { num: 5, title: "Central Ideas & Evidence", desc: "Finding main ideas and supporting details", tags: ["lesson", "practice"] },
      { num: 6, title: "Punctuation & Conventions", desc: "Commas, colons, semicolons, and dashes", tags: ["lesson", "practice"] },
      { num: 7, title: "Text Structure & Purpose", desc: "Understanding how texts are organized", tags: ["lesson", "practice"] },
    ],
  },
  {
    phase: "Test Readiness",
    modules: [
      { num: 8, title: "Transitions & Expression", desc: "Connecting ideas and effective language", tags: ["lesson", "practice"] },
      { num: 9, title: "Timed Practice", desc: "Full R&W section under test conditions", tags: ["quiz"] },
      { num: 10, title: "Review & Error Analysis", desc: "Analyze patterns and strengthen weak areas", tags: ["review"] },
    ],
  },
];

export default function PSAT89RWCourse() {
  return (
    <div className="min-h-screen">
      <TopBar backHref="/home" backLabel="Home" />
      <div className="mx-auto max-w-3xl px-6 py-10">
        <div className="mb-1 h-1 w-12 rounded-full" style={{ backgroundColor: ACCENT }} />
        <h1 className="mb-2 font-display text-[2.2rem] tracking-[0.02em] text-ink">
          PSAT 8/9 Reading & Writing
        </h1>
        <p className="mb-6 text-text-secondary">
          10 modules designed for 8th and 9th grade readers and writers.
        </p>

        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[["10", "Modules"], ["3", "Phases"], ["4", "Domains"], ["150+", "Practice Qs"]].map(
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
                    href={`/courses/psat89-rw/${m.num}`}
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
