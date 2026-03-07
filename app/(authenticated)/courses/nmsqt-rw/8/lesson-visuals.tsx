"use client";

import { useState } from "react";

const ACCENT = "#d4a017";

/* ── Transition Taxonomy ── */
const CATEGORIES = [
  { name: "Addition", words: ["Furthermore", "Moreover", "Additionally", "In addition"], color: "#60a5fa", signal: "Same direction, adding more" },
  { name: "Contrast", words: ["However", "Nevertheless", "Conversely", "On the other hand"], color: "#ef4444", signal: "Opposite direction, unexpected" },
  { name: "Cause/Effect", words: ["Therefore", "Consequently", "As a result", "Thus"], color: "#34d399", signal: "Logical result follows" },
  { name: "Example", words: ["For instance", "For example", "Specifically"], color: "#fbbf24", signal: "Specific case illustrates" },
  { name: "Comparison", words: ["Similarly", "Likewise", "In the same way"], color: "#a855f7", signal: "Parallel situation" },
  { name: "Time/Sequence", words: ["Meanwhile", "Subsequently", "Previously"], color: "#f472b6", signal: "Temporal ordering" },
  { name: "Surprise", words: ["Surprisingly", "Unexpectedly", "Remarkably"], color: "#06b6d4", signal: "Unexpected outcome" },
];

export function TransitionTaxonomyVisual() {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div className="space-y-2.5">
      <div className="mb-2 text-[11px] font-bold uppercase tracking-[1.5px]" style={{ color: ACCENT }}>
        Seven Transition Families
      </div>
      {CATEGORIES.map((cat, i) => (
        <button
          key={i}
          onClick={() => setExpanded(expanded === i ? null : i)}
          className="w-full cursor-pointer rounded-xl border bg-bg-base p-3.5 text-left transition-all duration-300 hover:-translate-y-0.5"
          style={{
            borderColor: expanded === i ? `${cat.color}33` : "var(--color-border-default)",
            boxShadow: expanded === i ? `0 0 16px ${cat.color}11` : "none",
          }}
        >
          <div className="flex items-center gap-3">
            <div className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: cat.color }} />
            <span className="text-sm font-bold" style={{ color: cat.color }}>{cat.name}</span>
            <span className="flex-1 text-right text-[12px] text-text-muted">{cat.signal}</span>
          </div>
          {expanded === i && (
            <div className="mt-2.5 flex flex-wrap gap-1.5 pl-5">
              {cat.words.map((w, j) => (
                <span key={j} className="rounded-md px-2.5 py-1 text-[13px] font-semibold" style={{ background: `${cat.color}12`, color: cat.color }}>
                  {w}
                </span>
              ))}
            </div>
          )}
        </button>
      ))}
    </div>
  );
}

/* ── Relationship-First Method ── */
export function RelationshipMethodVisual() {
  const steps = [
    { num: "1", title: "Read BOTH sentences", desc: "Read the sentence before AND after the blank completely.", color: "#60a5fa" },
    { num: "2", title: "Name the relationship", desc: "WITHOUT looking at choices: do these ideas agree? Disagree? Does one cause the other?", color: "#34d399" },
    { num: "3", title: "Match the transition", desc: "THEN find the transition word that expresses that relationship.", color: "#fbbf24" },
  ];

  return (
    <div className="space-y-4">
      <div className="mb-2 text-[11px] font-bold uppercase tracking-[1.5px]" style={{ color: ACCENT }}>
        The Relationship-First Method
      </div>
      {steps.map((s, i) => (
        <div key={i} className="flex items-start gap-4 rounded-xl border border-border-default bg-bg-base p-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-mono text-base font-bold" style={{ background: `${s.color}15`, color: s.color }}>
            {s.num}
          </div>
          <div>
            <div className="text-sm font-bold text-text-primary">{s.title}</div>
            <div className="mt-0.5 text-[13px] leading-[1.6] text-text-muted">{s.desc}</div>
          </div>
        </div>
      ))}
      <div className="rounded-xl border border-[rgba(239,68,68,.2)] bg-[rgba(239,68,68,.07)] px-5 py-4 text-sm leading-[1.7]">
        <strong className="text-[#ef4444]">Common Trap: </strong>
        Using a contrast transition when the relationship is actually addition, or vice versa. Always check: do these two ideas <strong>agree</strong> or <strong>disagree</strong>?
      </div>
    </div>
  );
}

/* ── Synthesis Goal-First Visual ── */
export function SynthesisVisual() {
  const goals = [
    { goal: "Introduce a topic to a general audience", key: "Definition + scope/significance", color: "#60a5fa" },
    { goal: "Emphasize a contrast", key: "Two opposing facts or perspectives", color: "#ef4444" },
    { goal: "Present a finding and its implication", key: "Data/result + what it means", color: "#34d399" },
    { goal: "Acknowledge both benefits and drawbacks", key: "Positive fact + negative fact (balanced)", color: "#fbbf24" },
    { goal: "Use a specific example to illustrate", key: "Concrete instance that demonstrates the point", color: "#a855f7" },
  ];

  return (
    <div className="space-y-3">
      <div className="mb-2 text-[11px] font-bold uppercase tracking-[1.5px]" style={{ color: ACCENT }}>
        Common Synthesis Goals &amp; What They Require
      </div>
      <div className="overflow-hidden rounded-xl border border-border-default">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="border-b border-border-default bg-bg-surface px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">Goal</th>
              <th className="border-b border-border-default bg-bg-surface px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">What the Answer Needs</th>
            </tr>
          </thead>
          <tbody>
            {goals.map((g, i) => (
              <tr key={i}>
                <td className="border-b border-border-default px-4 py-3 font-semibold last:border-b-0" style={{ color: g.color }}>{g.goal}</td>
                <td className="border-b border-border-default px-4 py-3 text-[#bcbcc8] last:border-b-0">{g.key}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="rounded-xl border border-[rgba(212,160,23,.2)] bg-[rgba(212,160,23,.07)] px-5 py-4 text-sm leading-[1.7]">
        <strong style={{ color: ACCENT }}>Key Rule: </strong>
        All four answer choices use correct information. The differentiator is always <strong>purpose</strong> -- does this answer accomplish the specific goal?
      </div>
    </div>
  );
}
