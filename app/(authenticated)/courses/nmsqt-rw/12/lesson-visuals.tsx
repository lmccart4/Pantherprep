"use client";

import { useState } from "react";

const ACCENT = "#d4a017";

/* ── Test-Day Checklist ── */
export function TestDayVisual() {
  const [checked, setChecked] = useState<Record<number, boolean>>({});

  const items = [
    { phase: "Night Before", tasks: ["Review error journal (not new material)", "Pack ID, pencils, calculator, watch", "Set two alarms", "Sleep 8+ hours"], color: "#60a5fa" },
    { phase: "Test Morning", tasks: ["Eat protein, not just carbs", "Arrive 15 min early", "Trust your preparation", "No last-minute cramming"], color: "#34d399" },
    { phase: "During Test", tasks: ["Two-pass method: quick wins first", "90-second flag rule", "Never leave blanks", "Answer then flag"], color: "#fbbf24" },
  ];

  let idx = 0;

  return (
    <div className="space-y-4">
      <div className="mb-2 text-[11px] font-bold uppercase tracking-[1.5px]" style={{ color: ACCENT }}>
        Test-Day Battle Plan
      </div>
      {items.map((phase, pi) => (
        <div key={pi} className="rounded-xl border border-border-default bg-bg-base p-4">
          <div className="mb-2.5 text-xs font-bold" style={{ color: phase.color }}>{phase.phase}</div>
          {phase.tasks.map((task) => {
            const thisIdx = idx++;
            return (
              <button
                key={thisIdx}
                onClick={() => setChecked(prev => ({ ...prev, [thisIdx]: !prev[thisIdx] }))}
                className="mb-1.5 flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-[rgba(255,255,255,.03)]"
              >
                <div
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded border text-xs transition-colors"
                  style={{
                    borderColor: checked[thisIdx] ? "#22c55e" : "var(--color-border-default)",
                    background: checked[thisIdx] ? "rgba(34,197,94,.15)" : "transparent",
                    color: checked[thisIdx] ? "#22c55e" : "transparent",
                  }}
                >
                  {checked[thisIdx] && "✓"}
                </div>
                <span className="text-sm text-[#bcbcc8]" style={{ textDecoration: checked[thisIdx] ? "line-through" : "none", opacity: checked[thisIdx] ? 0.6 : 1 }}>
                  {task}
                </span>
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}

/* ── Selection Index Quick Reference ── */
export function SelectionIndexVisual() {
  const [rw, setRw] = useState("");
  const [math, setMath] = useState("");

  const rwV = parseInt(rw), mathV = parseInt(math);
  let result: { index: number; level: string; color: string } | null = null;

  if (!isNaN(rwV) && !isNaN(mathV) && rwV >= 160 && rwV <= 760 && mathV >= 160 && mathV <= 760) {
    const index = Math.round((2 * rwV + mathV) / 10);
    let level: string, color: string;
    if (index >= 223) { level = "NJ Semifinalist Range"; color = "#a855f7"; }
    else if (index >= 210) { level = "Commended Student"; color = "#22c55e"; }
    else if (index >= 190) { level = "Competitive"; color = ACCENT; }
    else { level = "Building"; color = "#fbbf24"; }
    result = { index, level, color };
  }

  return (
    <div className="rounded-2xl border border-[rgba(167,139,250,.2)] bg-bg-base p-5 shadow-[0_0_24px_rgba(167,139,250,.06)]">
      <div className="mb-3 text-[11px] font-bold uppercase tracking-[2px] text-text-muted">Quick Selection Index Calculator</div>
      <div className="mb-4 flex items-center gap-4">
        <div>
          <div className="mb-1 text-[10px] font-bold uppercase tracking-[1px] text-text-muted">R&W</div>
          <input
            type="number" placeholder="160-760" min={160} max={760} value={rw}
            onChange={e => setRw(e.target.value)}
            className="w-[88px] rounded-lg border border-border-default bg-bg-surface p-2 text-center font-mono text-lg text-text-primary transition-all focus:border-[rgba(167,139,250,.5)]"
          />
        </div>
        <div>
          <div className="mb-1 text-[10px] font-bold uppercase tracking-[1px] text-text-muted">Math</div>
          <input
            type="number" placeholder="160-760" min={160} max={760} value={math}
            onChange={e => setMath(e.target.value)}
            className="w-[88px] rounded-lg border border-border-default bg-bg-surface p-2 text-center font-mono text-lg text-text-primary transition-all focus:border-[rgba(167,139,250,.5)]"
          />
        </div>
        {result && (
          <div className="flex-1 text-center">
            <div className="font-mono text-3xl font-bold" style={{ color: result.color }}>{result.index}</div>
            <div className="text-xs text-text-muted">{result.level}</div>
          </div>
        )}
      </div>
      <div className="text-xs text-text-muted">Formula: (2 &times; R&W + Math) &divide; 10 &middot; Cutoffs: Commended ~210, NJ Semi ~223</div>
    </div>
  );
}

/* ── Domain Quick Review ── */
const DOMAIN_REVIEW = [
  { domain: "Craft & Structure", reminders: ["Words in Context: predict before you peek", "Structure: ask 'what does this sentence DO?'", "Cross-Text: map the relationship first"], color: "#60a5fa" },
  { domain: "Information & Ideas", reminders: ["Central Ideas: right scope, not too broad or narrow", "Inferences: most conservative conclusion wins", "Evidence: match the SPECIFIC claim, not the topic"], color: "#34d399" },
  { domain: "Conventions", reminders: ["Find subject, ignore noise, match verb", "Semicolons = two complete sentences", "Commas separate DC from IC"], color: "#fbbf24" },
  { domain: "Expression of Ideas", reminders: ["Transitions: identify the relationship first", "Synthesis: read the goal first, not the notes"], color: "#f472b6" },
];

export function DomainReviewVisual() {
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});

  return (
    <div className="space-y-3">
      <div className="mb-2 text-[11px] font-bold uppercase tracking-[1.5px]" style={{ color: ACCENT }}>
        One-Sentence Reminders by Domain
      </div>
      {DOMAIN_REVIEW.map((d, i) => (
        <button
          key={i}
          onClick={() => setExpanded(prev => ({ ...prev, [i]: !prev[i] }))}
          className="w-full cursor-pointer rounded-xl border bg-bg-base p-4 text-left transition-all duration-300 hover:-translate-y-0.5"
          style={{ borderColor: expanded[i] ? `${d.color}33` : "var(--color-border-default)" }}
        >
          <div className="flex items-center gap-3">
            <div className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: d.color }} />
            <span className="text-sm font-bold" style={{ color: d.color }}>{d.domain}</span>
            <span className="text-[11px] text-text-muted">{expanded[i] ? "▲" : "▼"}</span>
          </div>
          {expanded[i] && (
            <ul className="mt-2.5 space-y-1.5 pl-5">
              {d.reminders.map((r, j) => (
                <li key={j} className="text-[13px] leading-[1.6] text-[#bcbcc8]">{r}</li>
              ))}
            </ul>
          )}
        </button>
      ))}
    </div>
  );
}

/* ── Growth Mindset Visual ── */
export function GrowthMindsetVisual() {
  const skills = [
    { skill: "Active reading for structure", applies: "College reading, academic writing", color: "#60a5fa" },
    { skill: "Evidence evaluation", applies: "Research papers, professional reports", color: "#34d399" },
    { skill: "Logical relationship identification", applies: "Legal reasoning, data analysis", color: "#fbbf24" },
    { skill: "Precise word choice", applies: "Business communication, persuasive writing", color: "#f472b6" },
  ];

  return (
    <div className="space-y-4">
      <div className="mb-2 text-[11px] font-bold uppercase tracking-[1.5px]" style={{ color: ACCENT }}>
        Skills That Transfer Beyond the Test
      </div>
      <div className="grid grid-cols-2 gap-3">
        {skills.map((s, i) => (
          <div key={i} className="rounded-xl border border-border-default bg-bg-base p-4">
            <div className="mb-1 text-sm font-bold" style={{ color: s.color }}>{s.skill}</div>
            <div className="text-[13px] text-text-muted">{s.applies}</div>
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-[rgba(6,214,160,.2)] bg-[rgba(6,214,160,.06)] px-5 py-4 text-sm leading-[1.7]">
        <strong className="text-[#06d6a0]">Whatever your score: </strong>
        You now have a systematic approach to reading and reasoning that will serve you for years. The PSAT is a starting point, not an endpoint.
      </div>
    </div>
  );
}
