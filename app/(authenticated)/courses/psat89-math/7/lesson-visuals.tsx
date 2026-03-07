"use client";

import { useState } from "react";

const ACCENT = "#06b6d4";

/* ── Slide 1: Decision Tree Visual ── */
export function DecisionTreeVisual() {
  const steps = [
    { num: "1", bg: "#f59e0b", bgLight: "rgba(245,158,11,.08)", text: "Do I immediately see how to solve this?", yes: "Solve directly.", no: "Step 2" },
    { num: "2", bg: "#a855f7", bgLight: "rgba(168,85,247,.08)", text: "Variables in the answer choices?", yes: "Use Plug In (PIYON).", no: "Step 3" },
    { num: "3", bg: "#34d399", bgLight: "rgba(52,211,153,.08)", text: "Answer choices are specific numbers?", yes: "Use Backsolve (PITA).", no: "Step 4" },
    { num: "4", bg: ACCENT, bgLight: "rgba(6,182,212,.07)", text: "Involves a function, graph, or system?", yes: "Use Desmos.", no: "Step 5" },
    { num: "5", bg: "#fbbf24", bgLight: "rgba(251,191,36,.08)", text: "Can I eliminate clearly wrong answers?", yes: "Ballpark + POE, then pick.", no: "Flag and move on." },
  ];

  return (
    <div className="space-y-2">
      {steps.map((s) => (
        <div key={s.num} className="flex items-stretch gap-0">
          <div className="flex w-[38px] shrink-0 items-center justify-center rounded-l-[10px] text-sm font-bold text-white" style={{ background: s.bg }}>{s.num}</div>
          <div className="flex-1 rounded-r-[10px] border border-l-0 border-border-default p-3 text-[13px] leading-[1.5]" style={{ background: s.bgLight }}>
            {s.text}<br />
            <span className="font-bold text-[#22c55e]">YES &rarr; {s.yes}</span>{" "}
            <span className="font-semibold text-text-muted">NO &rarr; {s.no}</span>
          </div>
        </div>
      ))}
      <div className="rounded-xl border border-[rgba(245,158,11,.2)] bg-[rgba(245,158,11,.07)] px-5 py-4 text-sm leading-[1.7]">
        <strong style={{ color: "#f59e0b" }}>Strategy &gt; Speed: </strong>
        Most students lose points not because they can&apos;t do the math, but because they misread problems, pick the wrong approach, or run out of time. This decision tree fixes all three.
      </div>
    </div>
  );
}

/* ── Slide 2: Plug In & Backsolve Cards ── */
const STRATEGIES = [
  {
    title: "Plug In (PIYON)",
    trigger: "Variables in answer choices",
    color: "#a855f7",
    steps: ["Choose simple numbers (2, 3, 5, 10, 100)", "Work the problem to get a TARGET", "Plug same numbers into each choice", "Match = correct answer"],
    example: "If x is positive, which equals (x\u00b2 + 2x)/x?  Let x=3: (9+6)/3 = 5. A) x+2 = 5 \u2714",
    warning: "Avoid 0 and 1 \u2014 they have special properties that make multiple answers look right.",
  },
  {
    title: "Backsolve (PITA)",
    trigger: "Answer choices are specific numbers",
    color: "#34d399",
    steps: ["Start with choice B or C (middle value)", "Plug that number into the problem", "If it works \u2192 done!", "If too big, go smaller. If too small, go bigger."],
    example: "If 3x \u2212 7 = 2x + 5, what is x?  Try C (x=12): 3(12)\u22127=29, 2(12)+5=29 \u2714",
    warning: "Key advantage: you work with concrete numbers instead of abstract algebra.",
  },
  {
    title: "Ballpark & POE",
    trigger: "Can estimate or eliminate",
    color: "#fbbf24",
    steps: ["Estimate before calculating", "Eliminate clearly wrong choices", "Pick from what remains"],
    example: "15% of 392 \u2248 10% is 39, +half = ~59. Eliminate 20 and 79 instantly.",
    warning: "Especially powerful on geometry \u2014 if the answer should be ~100, eliminate 12 and 800.",
  },
];

export function StrategyCardsVisual() {
  const [flipped, setFlipped] = useState<Record<number, boolean>>({});

  return (
    <div className="space-y-3">
      {STRATEGIES.map((s, i) => (
        <button
          key={i}
          onClick={() => setFlipped(prev => ({ ...prev, [i]: !prev[i] }))}
          className="w-full cursor-pointer rounded-xl border bg-bg-base p-[18px] text-left transition-all duration-300 hover:-translate-y-0.5"
          style={{ borderColor: flipped[i] ? `${s.color}33` : "var(--color-border-default)", boxShadow: flipped[i] ? `0 0 20px ${s.color}11` : "none" }}
        >
          {!flipped[i] ? (
            <>
              <div className="mb-1 flex items-center gap-2.5">
                <span className="text-[15px] font-bold" style={{ color: s.color }}>{s.title}</span>
              </div>
              <div className="mb-2 text-[13px] text-text-muted">
                <strong>When: </strong>{s.trigger}
              </div>
              <ol className="space-y-1 pl-5 text-[13px] text-[#bcbcc8]">
                {s.steps.map((step, j) => <li key={j} className="list-decimal">{step}</li>)}
              </ol>
              <div className="mt-2 text-right text-[11px] font-medium opacity-70" style={{ color: s.color }}>tap to see example &rarr;</div>
            </>
          ) : (
            <>
              <div className="mb-2 rounded-lg border-l-[3px] px-3 py-2 text-sm leading-[1.7] text-[#bcbcc8]" style={{ borderColor: s.color, background: `${s.color}08` }}>
                <strong style={{ color: s.color }}>Example: </strong>{s.example}
              </div>
              <div className="text-[13px] leading-[1.6] text-text-muted">{s.warning}</div>
              <div className="mt-2 text-right text-[11px] font-medium opacity-70" style={{ color: s.color }}>&larr; tap to flip back</div>
            </>
          )}
        </button>
      ))}
    </div>
  );
}

/* ── Slide 3: Time Management Visual ── */
export function TimeBudgetVisual() {
  const passes = [
    { name: "Pass 1", time: "~25 min", pct: 71, desc: "Answer everything you can in under 90 seconds. Flag anything hard.", color: "#22c55e" },
    { name: "Pass 2", time: "~8 min", pct: 23, desc: "Return to flagged questions. Desmos, backsolve, or POE.", color: "#fbbf24" },
    { name: "Final Check", time: "~2 min", pct: 6, desc: "Review marked answers. Answer ALL remaining questions (no penalty!).", color: "#ef4444" },
  ];

  const tiers = [
    { label: "Easy (Tier 1)", time: "~60 sec", color: "#34d399", pct: 37 },
    { label: "Medium (Tier 2)", time: "~90 sec", color: "#60a5fa", pct: 55 },
    { label: "Hard (Tier 3)", time: "~120 sec max", color: "#a855f7", pct: 73 },
  ];

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border-default bg-bg-base p-5">
        <div className="mb-3 text-[10px] font-bold uppercase tracking-[2px] text-text-muted">Two-Pass System</div>
        {passes.map((p, i) => (
          <div key={i} className="mb-3 last:mb-0">
            <div className="mb-1 flex justify-between text-[13px]">
              <span className="font-bold" style={{ color: p.color }}>{p.name} ({p.time})</span>
            </div>
            <div className="mb-1 h-2 overflow-hidden rounded-full bg-border-default">
              <div className="h-full rounded-full transition-all" style={{ width: `${p.pct}%`, background: p.color }} />
            </div>
            <div className="text-[12px] text-text-muted">{p.desc}</div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border-default bg-bg-base p-5">
        <div className="mb-3 text-[10px] font-bold uppercase tracking-[2px] text-text-muted">Per-Question Targets</div>
        {tiers.map((t, i) => (
          <div key={i} className="mb-2.5 flex items-center gap-3 last:mb-0">
            <span className="min-w-[110px] text-[13px] font-semibold" style={{ color: t.color }}>{t.label}</span>
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-border-default">
              <div className="h-full rounded-full" style={{ width: `${t.pct}%`, background: t.color }} />
            </div>
            <span className="min-w-[80px] text-right font-mono text-[12px] font-bold" style={{ color: t.color }}>{t.time}</span>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-[rgba(239,68,68,.2)] bg-[rgba(239,68,68,.07)] px-5 py-4 text-sm leading-[1.7]">
        <strong className="text-[#ef4444]">The 2-Minute Rule: </strong>
        If you&apos;ve spent 2 minutes on a question and aren&apos;t close to an answer, <strong>flag it and move on</strong>. There&apos;s no penalty for wrong answers &mdash; always guess before time expires.
      </div>
    </div>
  );
}

/* ── Slide 4: SPR (Grid-In) Rules ── */
export function SPRRulesVisual() {
  const rules = [
    { icon: "\u2716", label: "No Mixed Numbers", desc: "Enter 3\u00bd as 3.5 or 7/2. Never type 3 1/2 \u2014 it will be read as 31/2." },
    { icon: "\u2713", label: "Fractions OK", desc: "You can enter fractions like 7/2. No need to convert to decimals." },
    { icon: "\u2212", label: "Negatives Allowed", desc: "The grid allows negative numbers. Don\u2019t forget the negative sign!" },
    { icon: "\u00d7", label: "Multiple Valid Answers", desc: "If |x \u2212 3| = 7, either 10 or \u22124 works. Enter either one." },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {rules.map((r, i) => (
          <div key={i} className="rounded-xl border border-border-default bg-bg-base p-4">
            <div className="mb-2 text-xl">{r.icon}</div>
            <div className="mb-1 text-sm font-bold text-text-primary">{r.label}</div>
            <div className="text-[13px] leading-[1.6] text-text-muted">{r.desc}</div>
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-[rgba(6,182,212,.2)] bg-[rgba(6,182,212,.07)] px-5 py-4 text-sm leading-[1.7]">
        <strong style={{ color: ACCENT }}>SPR is ~25% of questions. </strong>
        No answer choices means no POE and no backsolving. Double-check your arithmetic and <strong>always re-read what the question asks</strong> before entering.
      </div>
    </div>
  );
}

/* ── Slide 5: Common Traps ── */
const TRAPS = [
  { name: "Wrong Target", desc: "Question asks for 3x + 2 but you solved for x.", fix: "Always re-read what\u2019s being asked before submitting.", color: "#ef4444" },
  { name: "Sign Errors", desc: "Negative signs are the most common careless error.", fix: "Double-check when distributing negatives and flipping inequality signs.", color: "#f59e0b" },
  { name: "Unit Mismatches", desc: "Question asks for minutes but you calculated in hours.", fix: "Always check units before answering.", color: "#a855f7" },
  { name: "Forgetting Cases", desc: "Absolute value gives TWO solutions. Quadratics can give 0, 1, or 2.", fix: "Ask yourself: is there a second solution?", color: "#60a5fa" },
  { name: "Graph Misread", desc: "Clicked the wrong intersection point when there are multiple.", fix: "Zoom in and verify the coordinates match the question\u2019s context.", color: "#34d399" },
  { name: "Axis Scale", desc: "Read y \u2248 3 grid lines up as \u201c3\u201d when each line = 50.", fix: "Always check what each grid line represents before reading values.", color: "#fbbf24" },
];

export function CommonTrapsVisual() {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div className="space-y-2.5">
      {TRAPS.map((t, i) => (
        <button
          key={i}
          onClick={() => setExpanded(expanded === i ? null : i)}
          className="w-full cursor-pointer rounded-xl border bg-bg-base p-3.5 text-left transition-all duration-300 hover:-translate-y-0.5"
          style={{
            borderColor: expanded === i ? `${t.color}44` : "var(--color-border-default)",
            borderLeftWidth: "3px",
            borderLeftColor: t.color,
          }}
        >
          <div className="flex items-center justify-between">
            <span className="text-[14px] font-bold" style={{ color: t.color }}>{t.name}</span>
            <span className="text-[11px] text-text-muted">{expanded === i ? "\u25b2" : "\u25bc"}</span>
          </div>
          <div className="mt-0.5 text-[13px] text-text-muted">{t.desc}</div>
          {expanded === i && (
            <div className="mt-2 rounded-lg px-3 py-2 text-[13px] leading-[1.7]" style={{ background: `${t.color}08` }}>
              <strong style={{ color: "#22c55e" }}>Fix: </strong>
              <span className="text-[#bcbcc8]">{t.fix}</span>
            </div>
          )}
        </button>
      ))}
    </div>
  );
}

/* ── Slide: Adaptive Module Strategy ── */
export function AdaptiveStrategyVisual() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center gap-2.5">
        <div className="w-full rounded-xl border border-[rgba(6,182,212,.25)] bg-[rgba(6,182,212,.07)] px-6 py-3.5 text-center text-sm font-semibold shadow-[0_0_24px_rgba(6,182,212,.15)]">
          Module 1: Mixed Difficulty<br />
          <span className="text-xs font-normal text-text-muted">22 questions \u00b7 35 minutes \u00b7 Accuracy &gt; Speed</span>
        </div>
        <div className="text-text-muted">&darr; Your performance determines&hellip;</div>
        <div className="flex w-full gap-4">
          <div className="flex-1 rounded-xl border border-[rgba(34,197,94,.25)] bg-[rgba(34,197,94,.07)] px-5 py-3.5 text-center text-sm font-semibold shadow-[0_0_20px_rgba(34,197,94,.08)]">
            Module 2: <strong>Harder</strong><br />
            <span className="text-xs font-normal text-text-muted">14+ correct in M1 \u2192 score ceiling up to 720</span>
          </div>
          <div className="flex-1 rounded-xl border border-[rgba(239,68,68,.2)] bg-[rgba(239,68,68,.07)] px-5 py-3.5 text-center text-sm font-semibold">
            Module 2: <strong>Easier</strong><br />
            <span className="text-xs font-normal text-text-muted">&lt;11 correct in M1 \u2192 score ceiling ~480\u2013560</span>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-[rgba(34,197,94,.2)] bg-[rgba(34,197,94,.07)] px-5 py-4 text-sm leading-[1.7]">
        <strong className="text-[#22c55e]">Key Insight: </strong>
        Getting into the HARD Module 2 is worth <strong>~40\u201380 points</strong>. Even if you miss more questions in hard M2, your ceiling is much higher. Accuracy in Module 1 matters most.
      </div>
    </div>
  );
}
