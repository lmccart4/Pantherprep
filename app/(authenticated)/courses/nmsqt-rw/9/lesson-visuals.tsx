"use client";

import { useState } from "react";

const ACCENT = "#d4a017";

/* ── Goal-First Method Steps ── */
export function GoalFirstVisual() {
  const steps = [
    { num: "1", title: "Read the GOAL first", desc: "Underline key words: 'introduce,' 'emphasize,' 'contrast,' 'acknowledge both...'", color: "#60a5fa", icon: "🎯" },
    { num: "2", title: "Tag each note", desc: "Classify: Definition, Statistic, Comparison, Date, Finding, Drawback, Example", color: "#34d399", icon: "🏷️" },
    { num: "3", title: "Match notes to goal", desc: "Which 2-3 notes directly serve the stated goal? Ignore irrelevant ones.", color: "#fbbf24", icon: "🔗" },
    { num: "4", title: "Find the answer", desc: "The correct answer combines the relevant notes to accomplish the specific goal.", color: "#f472b6", icon: "✅" },
  ];

  return (
    <div className="space-y-3">
      <div className="mb-2 text-[11px] font-bold uppercase tracking-[1.5px]" style={{ color: ACCENT }}>
        The Goal-First Method for Synthesis
      </div>
      {steps.map((s, i) => (
        <div key={i} className="flex items-start gap-4 rounded-xl border border-border-default bg-bg-base p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-xl" style={{ background: `${s.color}12` }}>
            {s.icon}
          </div>
          <div>
            <div className="text-sm font-bold text-text-primary">
              <span style={{ color: s.color }}>Step {s.num}: </span>{s.title}
            </div>
            <div className="mt-0.5 text-[13px] leading-[1.6] text-text-muted">{s.desc}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Note Tagging Visual ── */
const NOTE_TAGS = [
  { tag: "Definition", color: "#60a5fa", example: "Coral bleaching occurs when water temperatures rise..." },
  { tag: "Statistic", color: "#34d399", example: "91% of reefs affected; 50% decline since 1950" },
  { tag: "Comparison", color: "#fbbf24", example: "30-50% lower cost than traditional construction" },
  { tag: "Finding", color: "#f472b6", example: "Porites lobata showed natural heat resistance" },
  { tag: "Drawback", color: "#ef4444", example: "Energy costs can be 8-10 times higher" },
  { tag: "Source", color: "#a855f7", example: "Dr. Terry Hughes of James Cook University" },
];

export function NoteTaggingVisual() {
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});

  return (
    <div className="space-y-3">
      <div className="mb-2 text-[11px] font-bold uppercase tracking-[1.5px]" style={{ color: ACCENT }}>
        Note Tagging -- Classify Before You Choose
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        {NOTE_TAGS.map((nt, i) => (
          <button
            key={i}
            onClick={() => setRevealed(prev => ({ ...prev, [i]: !prev[i] }))}
            className="cursor-pointer rounded-xl border bg-bg-base p-3.5 text-left transition-all duration-300 hover:-translate-y-0.5"
            style={{
              borderColor: revealed[i] ? `${nt.color}33` : "var(--color-border-default)",
            }}
          >
            <div className="mb-1 text-xs font-bold" style={{ color: nt.color }}>{nt.tag}</div>
            {revealed[i] ? (
              <div className="text-[13px] leading-[1.5] text-text-muted italic">&quot;{nt.example}&quot;</div>
            ) : (
              <div className="text-[11px] text-text-muted">tap for example</div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── Dual-Goal Test Visual ── */
export function DualGoalVisual() {
  const [selected, setSelected] = useState<number | null>(null);

  const answers = [
    { text: "EVs produce zero direct emissions during operation.", meets: "benefit only", pass: false },
    { text: "While EVs produce zero emissions and ranges have tripled since 2015, their battery production depends on lithium mining, which causes environmental damage.", meets: "benefit AND drawback", pass: true },
    { text: "EV sales now represent 18% of the global market.", meets: "neither benefit nor drawback framing", pass: false },
    { text: "Lithium mining for EV batteries causes significant environmental damage.", meets: "drawback only", pass: false },
  ];

  return (
    <div className="space-y-3">
      <div className="mb-2 text-[11px] font-bold uppercase tracking-[1.5px]" style={{ color: ACCENT }}>
        Dual-Goal Test: &quot;Present benefits AND drawbacks&quot;
      </div>
      <div className="rounded-xl border border-[rgba(212,160,23,.2)] bg-[rgba(212,160,23,.07)] px-4 py-3 text-sm">
        <strong style={{ color: ACCENT }}>Goal: </strong>Present a balanced view of EVs by acknowledging <strong>both benefits and drawbacks</strong>.
      </div>
      {answers.map((a, i) => (
        <button
          key={i}
          onClick={() => setSelected(i)}
          className="w-full cursor-pointer rounded-xl border bg-bg-base p-4 text-left transition-all duration-300"
          style={{
            borderColor: selected === i
              ? a.pass ? "rgba(34,197,94,.4)" : "rgba(239,68,68,.4)"
              : "var(--color-border-default)",
            background: selected === i
              ? a.pass ? "rgba(34,197,94,.05)" : "rgba(239,68,68,.05)"
              : undefined,
          }}
        >
          <div className="text-sm leading-[1.6] text-[#bcbcc8]">{a.text}</div>
          {selected !== null && (
            <div className="mt-2 text-xs font-semibold" style={{ color: a.pass ? "#22c55e" : selected === i ? "#ef4444" : "var(--color-text-muted)" }}>
              {a.pass ? "Meets BOTH parts of the goal" : `Fails: ${a.meets}`}
            </div>
          )}
        </button>
      ))}
    </div>
  );
}

/* ── Info vs. Purpose Visual ── */
export function InfoVsPurposeVisual() {
  return (
    <div className="space-y-4">
      <div className="mb-2 text-[11px] font-bold uppercase tracking-[1.5px]" style={{ color: ACCENT }}>
        Information vs. Purpose
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-[rgba(239,68,68,.2)] bg-[rgba(239,68,68,.05)] p-4">
          <div className="mb-2 text-xs font-bold text-[#ef4444]">WRONG QUESTION</div>
          <div className="text-sm text-[#bcbcc8]">&quot;Is this answer <strong>accurate</strong>?&quot;</div>
          <div className="mt-2 text-xs text-text-muted">All four answers use correct info. Accuracy is necessary but not sufficient.</div>
        </div>
        <div className="rounded-xl border border-[rgba(34,197,94,.2)] bg-[rgba(34,197,94,.05)] p-4">
          <div className="mb-2 text-xs font-bold text-[#22c55e]">RIGHT QUESTION</div>
          <div className="text-sm text-[#bcbcc8]">&quot;Does this answer accomplish the <strong>GOAL</strong>?&quot;</div>
          <div className="mt-2 text-xs text-text-muted">The correct answer uses the right notes to serve the specific rhetorical purpose.</div>
        </div>
      </div>
      <div className="rounded-xl border border-[rgba(212,160,23,.2)] bg-[rgba(212,160,23,.07)] px-5 py-4 text-sm leading-[1.7]">
        <strong style={{ color: ACCENT }}>The Trap: </strong>
        An answer accurately states information from the notes but does not accomplish the specific rhetorical goal. Always ask: does this serve the <strong>purpose</strong>?
      </div>
    </div>
  );
}
