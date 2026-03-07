"use client";

import { useState } from "react";

const ACCENT = "#06b6d4";

/* ── Slide 1: Two-Pass System ── */
export function TwoPassVisual() {
  const [simTime, setSimTime] = useState(25);

  const phases = [
    { label: "Pass 1", time: "First 25 min", desc: "Move through all 27 questions. Answer confident ones (~60 sec each). Flag uncertain ones.", color: "#22c55e", flex: 25 },
    { label: "Pass 2", time: "Last 7 min", desc: "Return to flagged questions. Focus remaining time on solvable ones.", color: "#fbbf24", flex: 7 },
  ];

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border-default bg-bg-base p-5">
        <div className="mb-3 text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">The Two-Pass System</div>

        {/* Timeline bar */}
        <div className="mb-4 flex h-10 overflow-hidden rounded-lg">
          {phases.map((p, i) => (
            <div
              key={i}
              className="flex items-center justify-center text-[11px] font-bold text-white"
              style={{ flex: p.flex, background: p.color }}
            >
              {p.label}: {p.time}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          {phases.map((p, i) => (
            <div key={i} className="rounded-xl border-l-[3px] px-4 py-3" style={{ borderColor: p.color, background: `${p.color}06` }}>
              <div className="mb-1 text-[13px] font-bold" style={{ color: p.color }}>{p.label}</div>
              <div className="text-[12px] leading-snug text-text-muted">{p.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-[rgba(6,182,212,.2)] bg-bg-base p-5">
        <div className="mb-3 text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">Time Simulator</div>
        <div className="mb-3 flex items-center gap-3">
          <span className="font-mono text-xs text-text-muted">0</span>
          <input
            type="range" min={0} max={32} value={simTime}
            onChange={e => setSimTime(parseInt(e.target.value))}
            className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full"
            style={{ background: `linear-gradient(90deg, #22c55e ${(25/32)*100}%, #fbbf24 ${(25/32)*100}%, #ef4444 100%)` }}
          />
          <span className="font-mono text-xs text-text-muted">32</span>
          <div className="min-w-[48px] text-center font-mono text-lg font-bold text-text-primary">{simTime}</div>
        </div>
        <div className="rounded-lg px-4 py-2.5 text-center text-sm" style={{
          background: simTime <= 25 ? "rgba(34,197,94,.07)" : simTime <= 31 ? "rgba(251,191,36,.07)" : "rgba(239,68,68,.07)",
          color: simTime <= 25 ? "#22c55e" : simTime <= 31 ? "#fbbf24" : "#ef4444",
        }}>
          {simTime <= 25 ? `Pass 1: You should be finishing question ${Math.min(27, Math.round(simTime * 27/25))}.`
            : simTime <= 31 ? "Pass 2: Return to flagged questions now."
            : "Last minute! Answer ALL remaining blanks. Guess if needed."}
        </div>
      </div>

      <div className="rounded-xl border border-[rgba(239,68,68,.2)] bg-[rgba(239,68,68,.05)] px-5 py-4 text-sm leading-[1.7]">
        <strong style={{ color: "#ef4444" }}>The 90-second rule: </strong>
        If you&apos;ve spent 90 seconds and you&apos;re stuck, pick your best guess, flag it, and move on. Every question is worth the same points.
      </div>
    </div>
  );
}

/* ── Slide 2: Pacing Checkpoints ── */
export function PacingVisual() {
  const checkpoints = [
    { time: "8 min", question: "Q7", note: "If on Q5 or earlier, speed up.", color: "#22c55e" },
    { time: "16 min", question: "Q14", note: "Halfway. If 5+ flagged, you may be too cautious.", color: "#60a5fa" },
    { time: "25 min", question: "Q27", note: "Pass 1 complete. Start Pass 2.", color: "#fbbf24" },
    { time: "31 min", question: "All", note: "1 minute left. Answer ALL remaining blanks.", color: "#ef4444" },
  ];

  const speeds = [
    { type: "Transitions", time: "~20 sec", module: "Module 8", color: "#22c55e" },
    { type: "Grammar / Conventions", time: "~45 sec", module: "Modules 6\u20137", color: "#60a5fa" },
    { type: "Vocabulary / Central Ideas", time: "~60 sec", module: "Modules 2\u20133", color: ACCENT },
    { type: "Inference / Evidence", time: "~75 sec", module: "Modules 4\u20135", color: "#fbbf24" },
    { type: "Rhetorical Synthesis", time: "~90 sec", module: "Module 9", color: "#a78bfa" },
  ];

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-xl border border-border-default">
        <div className="bg-bg-surface px-4 py-2.5 text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">Pacing Checkpoints</div>
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="border-b border-border-default bg-bg-surface px-4 py-2 text-left text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">Time</th>
              <th className="border-b border-border-default bg-bg-surface px-4 py-2 text-left text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">Target</th>
              <th className="border-b border-border-default bg-bg-surface px-4 py-2 text-left text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">Note</th>
            </tr>
          </thead>
          <tbody>
            {checkpoints.map((c, i) => (
              <tr key={i}>
                <td className="border-b border-border-default px-4 py-2.5 last:border-b-0">
                  <code className="rounded-md bg-[rgba(6,182,212,.1)] px-2 py-0.5 font-mono text-[13px]" style={{ color: c.color }}>{c.time}</code>
                </td>
                <td className="border-b border-border-default px-4 py-2.5 font-semibold text-text-secondary last:border-b-0">{c.question}</td>
                <td className="border-b border-border-default px-4 py-2.5 text-[#bcbcc8] last:border-b-0">{c.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="overflow-hidden rounded-xl border border-border-default">
        <div className="bg-bg-surface px-4 py-2.5 text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">Speed by Question Type</div>
        <div className="divide-y divide-border-default">
          {speeds.map((s, i) => (
            <div key={i} className="flex items-center justify-between px-4 py-2.5">
              <span className="text-[13px] font-semibold text-text-secondary">{s.type}</span>
              <div className="flex items-center gap-3">
                <span className="text-[11px] text-text-muted">{s.module}</span>
                <code className="rounded-md bg-[rgba(6,182,212,.1)] px-2 py-0.5 font-mono text-[13px]" style={{ color: s.color }}>{s.time}</code>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Slide 3: Answer Elimination ── */
export function EliminationVisual() {
  const [eliminated, setEliminated] = useState(0);

  const patterns = [
    { label: "Too Extreme", desc: "Uses \"always,\" \"never,\" \"completely\" when the passage is nuanced.", icon: "\uD83D\uDCA5", color: "#ef4444" },
    { label: "Right Topic, Wrong Claim", desc: "Same subject but makes a claim the passage doesn't support.", icon: "\uD83C\uDFAF", color: "#fbbf24" },
    { label: "Half Right", desc: "First part correct, second part adds unsupported claim. Read the ENTIRE choice.", icon: "\u00BD", color: "#a78bfa" },
    { label: "Out of Scope", desc: "Introduces information not in the passage at all.", icon: "\uD83D\uDEAB", color: ACCENT },
  ];

  const odds = [
    { elim: 0, pct: "25%", label: "Wild guess", color: "#ef4444" },
    { elim: 1, pct: "33%", label: "Eliminate 1", color: "#fbbf24" },
    { elim: 2, pct: "50%", label: "Eliminate 2", color: ACCENT },
    { elim: 3, pct: "100%", label: "Eliminate 3", color: "#22c55e" },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2.5">
        {patterns.map((p, i) => (
          <div key={i} className="rounded-xl border border-border-default bg-bg-base px-4 py-3">
            <div className="mb-1 flex items-center gap-2">
              <span className="text-base">{p.icon}</span>
              <span className="text-[13px] font-bold" style={{ color: p.color }}>{p.label}</span>
            </div>
            <div className="text-[11px] leading-snug text-text-muted">{p.desc}</div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border-default bg-bg-base p-5">
        <div className="mb-3 text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">Power of Elimination</div>
        <div className="mb-3 flex items-center gap-3">
          <span className="text-xs text-text-muted">Eliminated:</span>
          {[0, 1, 2, 3].map(n => (
            <button
              key={n}
              onClick={() => setEliminated(n)}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border text-[13px] font-bold transition-all"
              style={{
                borderColor: eliminated === n ? odds[n].color : "var(--color-border-default)",
                background: eliminated === n ? `${odds[n].color}11` : "transparent",
                color: eliminated === n ? odds[n].color : "var(--color-text-muted)",
              }}
            >
              {n}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="h-3 overflow-hidden rounded-full bg-border-default">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${parseInt(odds[eliminated].pct)}%`,
                  background: odds[eliminated].color,
                  boxShadow: `0 0 12px ${odds[eliminated].color}44`,
                }}
              />
            </div>
          </div>
          <div className="text-center">
            <div className="font-mono text-xl font-bold" style={{ color: odds[eliminated].color }}>{odds[eliminated].pct}</div>
            <div className="text-[11px] text-text-muted">{odds[eliminated].label}</div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-[rgba(34,197,94,.2)] bg-[rgba(34,197,94,.07)] px-5 py-4 text-sm leading-[1.7]">
        <strong style={{ color: "#22c55e" }}>The 50/50 advantage: </strong>
        Eliminating just 2 wrong answers doubles your odds from 25% to 50%. On a 27-question module, this can add 1\u20132 extra correct answers.
      </div>
    </div>
  );
}
