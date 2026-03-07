"use client";

import { useState } from "react";

const ACCENT = "#d4a017";

/* ── Scope Trap Detector ── */
export function ScopeTrapVisual() {
  const traps = [
    { type: "Too Broad", color: "#ef4444", icon: "🔍", desc: "Goes beyond what the passage discusses. Uses words like 'all,' 'always,' 'every,' or makes claims the passage doesn't support.", example: "Learning a second language is the most effective way to improve cognitive abilities." },
    { type: "Too Narrow", color: "#fbbf24", icon: "🔬", desc: "Captures only one detail instead of the main point. True but incomplete.", example: "A study of 500 adults compared bilinguals with monolinguals." },
    { type: "Off-Topic", color: "#6b7280", icon: "🚫", desc: "An accurate statement that isn't what the passage is about.", example: "Dr. Chen has conducted the largest study of bilingualism ever." },
    { type: "Just Right", color: "#22c55e", icon: "✅", desc: "Captures the central finding at the right level of specificity. Supported by the whole passage.", example: "Bilingualism provides cognitive advantages through increased brain density in areas linked to executive function." },
  ];

  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      <div className="mb-2 text-[11px] font-bold uppercase tracking-[1.5px]" style={{ color: ACCENT }}>
        The Three Scope Traps (and the Right Answer)
      </div>
      {traps.map((t, i) => (
        <button
          key={i}
          onClick={() => setExpanded(expanded === i ? null : i)}
          className="w-full cursor-pointer rounded-xl border bg-bg-base p-4 text-left transition-all duration-300 hover:-translate-y-0.5"
          style={{
            borderColor: expanded === i ? `${t.color}44` : "var(--color-border-default)",
            boxShadow: expanded === i ? `0 0 20px ${t.color}15` : "none",
          }}
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">{t.icon}</span>
            <span className="text-[15px] font-bold" style={{ color: t.color }}>{t.type}</span>
            <span className="text-[11px] text-text-muted">{expanded === i ? "▲" : "▼"}</span>
          </div>
          <div className="mt-1 text-[13px] leading-[1.5] text-text-muted">{t.desc}</div>
          {expanded === i && (
            <div className="mt-3 rounded-lg px-4 py-3 text-sm leading-[1.7]" style={{ background: `${t.color}08`, borderLeft: `3px solid ${t.color}` }}>
              <strong style={{ color: t.color }}>Example: </strong>
              <span className="text-[#bcbcc8]">&quot;{t.example}&quot;</span>
            </div>
          )}
        </button>
      ))}
    </div>
  );
}

/* ── Inference Hedging Language ── */
export function HedgingVisual() {
  const hedged = [
    { word: "may", safe: true },
    { word: "suggests", safe: true },
    { word: "could", safe: true },
    { word: "primarily", safe: true },
    { word: "some", safe: true },
  ];
  const absolute = [
    { word: "always", safe: false },
    { word: "never", safe: false },
    { word: "proves", safe: false },
    { word: "all", safe: false },
    { word: "exclusively", safe: false },
  ];

  return (
    <div className="space-y-4">
      <div className="mb-2 text-[11px] font-bold uppercase tracking-[1.5px]" style={{ color: ACCENT }}>
        Hedging vs. Absolute Language
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-[rgba(34,197,94,.2)] bg-[rgba(34,197,94,.05)] p-4">
          <div className="mb-2 text-xs font-bold text-[#22c55e]">SAFE (Usually Correct)</div>
          <div className="space-y-1.5">
            {hedged.map((h, i) => (
              <div key={i} className="rounded-lg bg-[rgba(34,197,94,.1)] px-3 py-1.5 text-center font-mono text-sm font-bold text-[#22c55e]">
                {h.word}
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-[rgba(239,68,68,.2)] bg-[rgba(239,68,68,.05)] p-4">
          <div className="mb-2 text-xs font-bold text-[#ef4444]">DANGEROUS (Usually Wrong)</div>
          <div className="space-y-1.5">
            {absolute.map((a, i) => (
              <div key={i} className="rounded-lg bg-[rgba(239,68,68,.1)] px-3 py-1.5 text-center font-mono text-sm font-bold text-[#ef4444]">
                {a.word}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="rounded-xl border border-[rgba(212,160,23,.2)] bg-[rgba(212,160,23,.07)] px-5 py-4 text-sm leading-[1.7]">
        <strong style={{ color: ACCENT }}>Pro Tip: </strong>
        When two answers seem equally good, check the qualifying words. The PSAT rewards precision -- the answer with appropriate hedging is almost always correct.
      </div>
    </div>
  );
}

/* ── Prediction Method for R&W ── */
export function PredictionMethodVisual() {
  const steps = [
    { num: "1", title: "Read the passage carefully", desc: "Look for context clues, contrast signals, and the author's main argument.", color: "#60a5fa" },
    { num: "2", title: "Identify the question type", desc: "Central idea? Inference? The type determines your strategy.", color: "#34d399" },
    { num: "3", title: "Predict before peeking", desc: "Form your answer BEFORE looking at the choices.", color: "#fbbf24" },
    { num: "4", title: "Match and verify", desc: "Find the choice closest to your prediction, then verify it against the passage.", color: "#f472b6" },
  ];

  return (
    <div className="space-y-3">
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
      <div className="rounded-xl border border-[rgba(212,160,23,.2)] bg-[rgba(212,160,23,.07)] px-5 py-4 text-sm leading-[1.7]">
        <strong style={{ color: ACCENT }}>For inferences: </strong>
        Ask yourself: &quot;What is the most boring, conservative conclusion I can draw from this evidence?&quot; That is usually the right answer.
      </div>
    </div>
  );
}
