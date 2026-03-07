"use client";

import { useState } from "react";

const ACCENT = "#d4a017";

/* ── Error Category Cards ── */
const ERROR_CATS = [
  { type: "Content Gap", icon: "📚", color: "#ef4444", desc: "You didn't know the rule, concept, or vocabulary.", fix: "Go back to the relevant module and re-learn the material.", priority: "Study" },
  { type: "Trap Answer", icon: "🪤", color: "#a855f7", desc: "You knew the material but fell for a distractor.", fix: "Learn the common trap patterns: scope traps, reversal traps, partial-truth traps.", priority: "Strategy" },
  { type: "Misread", icon: "👁️", color: "#3b82f6", desc: "You misread the passage, question, or a key word.", fix: "Slow down. Re-read what the question asks before selecting.", priority: "Discipline" },
  { type: "Time Pressure", icon: "⏱️", color: "#6b7280", desc: "You rushed and didn't apply your full process.", fix: "Practice pacing with the two-pass method.", priority: "Pacing" },
];

export function ErrorCategoriesVisual() {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      <div className="mb-2 text-[11px] font-bold uppercase tracking-[1.5px]" style={{ color: ACCENT }}>
        Four Error Categories
      </div>
      {ERROR_CATS.map((e, i) => (
        <button
          key={i}
          onClick={() => setExpanded(expanded === i ? null : i)}
          className="w-full cursor-pointer rounded-xl border bg-bg-base p-4 text-left transition-all duration-300 hover:-translate-y-0.5"
          style={{
            borderColor: expanded === i ? `${e.color}44` : "var(--color-border-default)",
            boxShadow: expanded === i ? `0 0 20px ${e.color}15` : "none",
          }}
        >
          <div className="flex items-center gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-xl" style={{ background: `${e.color}15` }}>
              {e.icon}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2.5">
                <span className="text-[15px] font-bold" style={{ color: e.color }}>{e.type}</span>
                <span className="rounded-md px-2 py-0.5 text-[10px] font-bold uppercase" style={{ background: `${e.color}12`, color: e.color }}>{e.priority}</span>
              </div>
              <div className="mt-0.5 text-[13px] leading-[1.5] text-text-muted">{e.desc}</div>
            </div>
          </div>
          {expanded === i && (
            <div className="mt-3 rounded-lg px-4 py-3 text-sm leading-[1.7]" style={{ background: `${e.color}08`, borderLeft: `3px solid ${e.color}` }}>
              <strong style={{ color: e.color }}>Fix: </strong>
              <span className="text-[#bcbcc8]">{e.fix}</span>
            </div>
          )}
        </button>
      ))}
    </div>
  );
}

/* ── Trap Pattern Cards ── */
const TRAP_PATTERNS = [
  { name: "Scope Trap", desc: "Too broad, too narrow, or slightly off-topic", signal: "Look for 'all,' 'always,' 'every' (too broad) or single-detail answers (too narrow)", color: "#ef4444" },
  { name: "Reversal Trap", desc: "Right vocabulary, wrong direction", signal: "Check cause/effect direction. Does the answer support when it should undermine?", color: "#fbbf24" },
  { name: "Partial-Truth Trap", desc: "Partially correct with one wrong detail", signal: "Read every word of every answer choice. One wrong word = wrong answer.", color: "#a855f7" },
];

export function TrapPatternsVisual() {
  const [flipped, setFlipped] = useState<Record<number, boolean>>({});

  return (
    <div className="space-y-3">
      <div className="mb-2 text-[11px] font-bold uppercase tracking-[1.5px]" style={{ color: ACCENT }}>
        Common Trap Answer Patterns
      </div>
      {TRAP_PATTERNS.map((t, i) => (
        <button
          key={i}
          onClick={() => setFlipped(prev => ({ ...prev, [i]: !prev[i] }))}
          className="w-full cursor-pointer rounded-xl border bg-bg-base p-4 text-left transition-all duration-300 hover:-translate-y-0.5"
          style={{ borderColor: flipped[i] ? `${t.color}33` : "var(--color-border-default)" }}
        >
          <div className="flex items-center gap-3">
            <div className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: t.color }} />
            <span className="text-sm font-bold" style={{ color: t.color }}>{t.name}</span>
          </div>
          <div className="mt-1 text-[13px] text-text-muted">{t.desc}</div>
          {flipped[i] && (
            <div className="mt-2 rounded-lg px-3 py-2 text-[13px] text-[#bcbcc8]" style={{ background: `${t.color}08`, borderLeft: `3px solid ${t.color}` }}>
              <strong style={{ color: t.color }}>How to spot: </strong>{t.signal}
            </div>
          )}
        </button>
      ))}
    </div>
  );
}

/* ── Domain Triage Visual ── */
export function DomainTriageVisual() {
  const domains = [
    { name: "Conventions", modules: "2-3", color: "#fbbf24" },
    { name: "Words in Context", modules: "4", color: "#60a5fa" },
    { name: "Central Ideas/Inferences", modules: "5", color: "#34d399" },
    { name: "Evidence", modules: "6", color: "#a855f7" },
    { name: "Structure/Cross-Text", modules: "7", color: "#f472b6" },
    { name: "Transitions/Synthesis", modules: "8-9", color: "#06b6d4" },
  ];

  return (
    <div className="space-y-4">
      <div className="mb-2 text-[11px] font-bold uppercase tracking-[1.5px]" style={{ color: ACCENT }}>
        Domain Triage -- Where to Focus
      </div>
      <div className="overflow-hidden rounded-xl border border-border-default">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="border-b border-border-default bg-bg-surface px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">Domain</th>
              <th className="border-b border-border-default bg-bg-surface px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">Review Modules</th>
            </tr>
          </thead>
          <tbody>
            {domains.map((d, i) => (
              <tr key={i}>
                <td className="border-b border-border-default px-4 py-3 font-semibold last:border-b-0" style={{ color: d.color }}>{d.name}</td>
                <td className="border-b border-border-default px-4 py-3 text-[#bcbcc8] last:border-b-0">
                  <code className="rounded-md bg-[rgba(212,160,23,.1)] px-2 py-0.5 font-mono text-[13px]" style={{ color: ACCENT }}>Module {d.modules}</code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="rounded-xl border border-[rgba(212,160,23,.2)] bg-[rgba(212,160,23,.07)] px-5 py-4 text-sm leading-[1.7]">
        <strong style={{ color: ACCENT }}>The 70/30 Rule: </strong>
        Spend 70% of study time on weak domains and 30% maintaining strong ones. Lowest accuracy = highest priority.
      </div>
    </div>
  );
}

/* ── Error Journal Template ── */
export function ErrorJournalVisual() {
  const columns = ["Question Type", "Your Answer", "Correct Answer", "Error Category", "Rule/Insight"];
  const exampleRow = ["Conventions (SVA)", "B) have shown", "D) has shown", "Content Gap", "\"The number of\" = singular"];

  return (
    <div className="space-y-4">
      <div className="mb-2 text-[11px] font-bold uppercase tracking-[1.5px]" style={{ color: ACCENT }}>
        Error Journal Template
      </div>
      <div className="overflow-x-auto rounded-xl border border-border-default">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              {columns.map((col, i) => (
                <th key={i} className="whitespace-nowrap border-b border-border-default bg-bg-surface px-3 py-2.5 text-left text-[10px] font-bold uppercase tracking-[1.5px] text-text-muted">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {exampleRow.map((cell, i) => (
                <td key={i} className="whitespace-nowrap border-b border-border-default px-3 py-2.5 text-[13px] text-[#bcbcc8]">{cell}</td>
              ))}
            </tr>
            <tr>
              <td colSpan={5} className="px-3 py-4 text-center text-xs text-text-muted italic">Your entries will go here...</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="rounded-xl border border-[rgba(34,197,94,.2)] bg-[rgba(34,197,94,.07)] px-5 py-4 text-sm leading-[1.7]">
        <strong style={{ color: "#22c55e" }}>After 3-4 sessions: </strong>
        Clear patterns emerge. Maybe you consistently miss modifier questions, or always fall for scope traps on central idea questions. The journal converts random practice into targeted improvement.
      </div>
    </div>
  );
}
