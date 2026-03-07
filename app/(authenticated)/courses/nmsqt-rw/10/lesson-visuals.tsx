"use client";

import { useState } from "react";

const ACCENT = "#d4a017";

/* ── Two-Pass Method Visual ── */
export function TwoPassVisual() {
  return (
    <div className="space-y-4">
      <div className="mb-2 text-[11px] font-bold uppercase tracking-[1.5px]" style={{ color: ACCENT }}>
        The Two-Pass Method
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-[rgba(34,197,94,.2)] bg-[rgba(34,197,94,.05)] p-5">
          <div className="mb-2 text-xs font-bold text-[#22c55e]">PASS 1: Quick Wins (20 min)</div>
          <ul className="space-y-1.5 text-sm text-[#bcbcc8]">
            <li>Answer every confident question</li>
            <li>Flag anything over 90 seconds</li>
            <li>Never leave blanks -- guess first</li>
          </ul>
        </div>
        <div className="rounded-xl border border-[rgba(212,160,23,.2)] bg-[rgba(212,160,23,.05)] p-5">
          <div className="mb-2 text-xs font-bold" style={{ color: ACCENT }}>PASS 2: Flagged Items (12 min)</div>
          <ul className="space-y-1.5 text-sm text-[#bcbcc8]">
            <li>Return to flagged questions</li>
            <li>Fresh eyes often resolve uncertainty</li>
            <li>Context from other passages may help</li>
          </ul>
        </div>
      </div>
      <div className="rounded-xl border border-[rgba(239,68,68,.2)] bg-[rgba(239,68,68,.07)] px-5 py-4 text-sm leading-[1.7]">
        <strong className="text-[#ef4444]">Critical: </strong>
        Always answer a flagged question with your best guess <strong>before</strong> flagging it. If you run out of time, you still have an answer recorded.
      </div>
    </div>
  );
}

/* ── Pacing by Question Type ── */
export function PacingVisual() {
  const tiers = [
    {
      speed: "Fast",
      time: "~60s",
      color: "#22c55e",
      types: ["Words in Context", "Conventions", "Transitions"],
      tip: "Pattern-recognition -- if you've drilled them, they should be automatic.",
    },
    {
      speed: "Moderate",
      time: "~80s",
      color: "#fbbf24",
      types: ["Central Ideas", "Inferences", "Structure"],
      tip: "Careful reading required, but no re-reading if you read actively.",
    },
    {
      speed: "Slow",
      time: "~90s",
      color: "#ef4444",
      types: ["Quantitative Evidence", "Cross-Text", "Rhetorical Synthesis"],
      tip: "More information to process. Budget extra time but stay disciplined.",
    },
  ];

  return (
    <div className="space-y-3">
      <div className="mb-2 text-[11px] font-bold uppercase tracking-[1.5px]" style={{ color: ACCENT }}>
        Pacing Targets by Question Type
      </div>
      {tiers.map((t, i) => (
        <div key={i} className="rounded-xl border bg-bg-base p-4" style={{ borderColor: `${t.color}33` }}>
          <div className="mb-2 flex items-center gap-3">
            <code className="rounded-md px-2.5 py-1 font-mono text-base font-bold" style={{ background: `${t.color}15`, color: t.color }}>
              {t.time}
            </code>
            <span className="text-sm font-bold" style={{ color: t.color }}>{t.speed}</span>
          </div>
          <div className="mb-1.5 flex flex-wrap gap-1.5">
            {t.types.map((type, j) => (
              <span key={j} className="rounded-md px-2 py-0.5 text-[12px] font-semibold" style={{ background: `${t.color}10`, color: t.color }}>
                {type}
              </span>
            ))}
          </div>
          <div className="text-[13px] text-text-muted">{t.tip}</div>
        </div>
      ))}
    </div>
  );
}

/* ── Strategic Flagging Visual ── */
export function FlaggingVisual() {
  const [selected, setSelected] = useState<number | null>(null);

  const scenarios = [
    { scenario: "You've narrowed to 2 choices but aren't sure which", action: "FLAG IT", color: "#22c55e", reason: "Perfect flag candidate. Answer with your best guess, then flag." },
    { scenario: "You're completely lost and have no idea", action: "GUESS & MOVE", color: "#fbbf24", reason: "Don't waste flag time. Pick your Letter of the Day and move on." },
    { scenario: "You're confident in your answer", action: "MOVE ON", color: "#60a5fa", reason: "No need to flag. Lock it in and keep your momentum." },
    { scenario: "You know the concept but need to re-read carefully", action: "FLAG IT", color: "#22c55e", reason: "Fresh eyes on Pass 2 may resolve it quickly." },
  ];

  return (
    <div className="space-y-3">
      <div className="mb-2 text-[11px] font-bold uppercase tracking-[1.5px]" style={{ color: ACCENT }}>
        When to Flag -- Tap each scenario
      </div>
      {scenarios.map((s, i) => (
        <button
          key={i}
          onClick={() => setSelected(selected === i ? null : i)}
          className="w-full cursor-pointer rounded-xl border bg-bg-base p-4 text-left transition-all duration-300 hover:-translate-y-0.5"
          style={{
            borderColor: selected === i ? `${s.color}44` : "var(--color-border-default)",
          }}
        >
          <div className="text-sm text-[#bcbcc8]">{s.scenario}</div>
          {selected === i && (
            <div className="mt-2 flex items-center gap-3">
              <span className="rounded-md px-2.5 py-1 text-xs font-bold" style={{ background: `${s.color}15`, color: s.color }}>
                {s.action}
              </span>
              <span className="text-[13px] text-text-muted">{s.reason}</span>
            </div>
          )}
        </button>
      ))}
    </div>
  );
}
