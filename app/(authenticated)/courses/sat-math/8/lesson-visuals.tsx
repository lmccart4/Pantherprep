"use client";

import { useState } from "react";

const ACCENT = "#C8102E";

/* ── Slide: Adaptive Module Flow Diagram ── */
export function AdaptiveModuleVisual() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center gap-2.5">
        <div className="min-w-[220px] rounded-xl border border-[rgba(200,16,46,.25)] bg-[rgba(200,16,46,.07)] px-6 py-3.5 text-center text-sm font-semibold shadow-[0_0_24px_rgba(200,16,46,.15)]">
          Module 1: 22 Questions · 35 Minutes<br />
          <span className="text-xs font-normal text-text-muted">Accuracy here determines your Module 2 difficulty</span>
        </div>
        <div className="text-text-muted">&darr; Your performance determines&hellip;</div>
        <div className="flex w-full gap-4">
          <div className="flex-1 rounded-xl border border-[rgba(34,197,94,.25)] bg-[rgba(34,197,94,.07)] px-5 py-3.5 text-center text-sm font-semibold shadow-[0_0_20px_rgba(34,197,94,.08)]">
            Hard Module 2<br />
            <span className="text-xs font-normal text-text-muted">Ceiling: 800</span>
          </div>
          <div className="flex-1 rounded-xl border border-[rgba(239,68,68,.2)] bg-[rgba(239,68,68,.07)] px-5 py-3.5 text-center text-sm font-semibold">
            Easy Module 2<br />
            <span className="text-xs font-normal text-text-muted">Ceiling: ~560-630</span>
          </div>
        </div>
      </div>
      <div className="rounded-xl border border-[rgba(239,68,68,.2)] bg-[rgba(239,68,68,.07)] px-5 py-4 text-sm leading-[1.7]">
        <strong className="text-[#ef4444]">Module 1 accuracy is MORE important than Module 2 speed.</strong> Even if you ace Easy Module 2, your math score is capped around 560-630. Take your time in Module 1 and avoid careless errors.
      </div>
    </div>
  );
}

/* ── Slide: 5-Second Decision Tree ── */
export function DecisionTreeVisual() {
  const steps = [
    { q: "Do I immediately see how to solve this?", yes: "Solve directly", no: "Continue to Step 2", color: "#22c55e" },
    { q: "Variables in the answer choices?", yes: "Use Plug In (PIYON)", no: "Continue to Step 3", color: "#60a5fa" },
    { q: "Answer choices are specific numbers?", yes: "Use Backsolve (PITA)", no: "Continue to Step 4", color: "#a855f7" },
    { q: "Involves a function, graph, or system?", yes: "Use Desmos", no: "Continue to Step 5", color: "#2bc4a9" },
    { q: "Can I eliminate clearly wrong answers?", yes: "Ballpark + POE, then guess", no: "Flag and move on", color: "#f97316" },
  ];

  return (
    <div className="space-y-2">
      {steps.map((s, i) => (
        <div key={i} className="flex items-stretch gap-0">
          <div className="flex w-9 shrink-0 items-center justify-center rounded-l-xl text-sm font-bold text-white" style={{ background: s.color }}>
            {i + 1}
          </div>
          <div className="flex-1 rounded-r-xl border border-border-default border-l-0 px-4 py-3 text-sm">
            <div className="mb-1.5 font-semibold text-text-primary">{s.q}</div>
            <div className="flex gap-4">
              <span className="font-bold text-[#22c55e]">YES &rarr; {s.yes}</span>
              <span className="text-text-muted">NO &rarr; {s.no}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Slide: Plug In Strategy ── */
export function PlugInVisual() {
  const [showExample, setShowExample] = useState(false);

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-[rgba(96,165,250,.2)] bg-[rgba(96,165,250,.07)] px-5 py-4 text-sm leading-[1.7]">
        <strong style={{ color: "#60a5fa" }}>When to use:</strong> Variables in all answer choices. &quot;Which expression is equivalent to...&quot; Questions with no specific values.
      </div>
      <div className="grid grid-cols-4 gap-2">
        {["Step 1: Pick numbers", "Step 2: Get TARGET", "Step 3: Test choices", "Step 4: Match = Answer"].map((s, i) => (
          <div key={i} className="rounded-lg border border-white/5 bg-[rgba(15,15,22,.75)] p-3 text-center text-xs font-semibold text-text-secondary">
            {s}
          </div>
        ))}
      </div>
      <button
        onClick={() => setShowExample(!showExample)}
        className="w-full cursor-pointer rounded-xl border border-border-default bg-bg-base px-5 py-3 text-left text-sm transition-all hover:-translate-y-0.5"
      >
        <span className="font-bold" style={{ color: "#f97316" }}>Worked Example {showExample ? "▲" : "▼"}</span>
        {showExample && (
          <div className="mt-3 text-[13px] leading-[1.8] text-[#bcbcc8]">
            <strong>Q:</strong> If x is positive, which equals (x² + 2x) / x?<br />
            <strong>Plug In:</strong> x = 3: (9 + 6) / 3 = <code className="rounded-md bg-[rgba(200,16,46,.1)] px-2 py-0.5 font-mono text-[13px]" style={{ color: ACCENT }}>5</code> (target)<br />
            A) x + 2 = 3 + 2 = 5 ✓<br />
            B) x² = 9 ✗ &middot; C) x - 2 = 1 ✗ &middot; D) 2x = 6 ✗<br />
            <strong>Answer: A</strong>
          </div>
        )}
      </button>
      <div className="rounded-xl border border-[rgba(239,68,68,.2)] bg-[rgba(239,68,68,.07)] px-5 py-4 text-sm leading-[1.7]">
        <strong className="text-[#ef4444]">Avoid 0 and 1</strong> -- they have special properties that make multiple answers look correct. Best picks: 2, 3, 5, 10, or 100 (for percents).
      </div>
    </div>
  );
}

/* ── Slide: Time Budget Visual ── */
export function TimeBudgetVisual() {
  return (
    <div className="space-y-4">
      <div className="flex h-11 items-center overflow-hidden rounded-lg shadow-md">
        <div className="flex h-full flex-[5] items-center justify-center text-[12px] font-bold text-white" style={{ background: "#22c55e" }}>
          First Pass (~25 min)
        </div>
        <div className="flex h-full flex-[2] items-center justify-center text-[12px] font-bold text-black" style={{ background: "#fbbf24" }}>
          Review (~8 min)
        </div>
        <div className="flex h-full flex-1 items-center justify-center text-[12px] font-bold text-white" style={{ background: "#ef4444" }}>
          LOTD (~2 min)
        </div>
      </div>
      <div className="overflow-hidden rounded-xl border border-border-default">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="border-b border-border-default bg-bg-surface px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">Phase</th>
              <th className="border-b border-border-default bg-bg-surface px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">Time</th>
              <th className="border-b border-border-default bg-bg-surface px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">What to Do</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border-b border-border-default px-4 py-3 font-semibold text-[#22c55e]">First Pass</td>
              <td className="border-b border-border-default px-4 py-3 text-[#bcbcc8]">~25 min</td>
              <td className="border-b border-border-default px-4 py-3 text-[#bcbcc8]">Answer every confident question. Flag uncertain ones. ~1.5 min/question avg.</td>
            </tr>
            <tr>
              <td className="border-b border-border-default px-4 py-3 font-semibold text-[#fbbf24]">Second Pass</td>
              <td className="border-b border-border-default px-4 py-3 text-[#bcbcc8]">~8 min</td>
              <td className="border-b border-border-default px-4 py-3 text-[#bcbcc8]">Return to flagged questions. Use Plug In, Backsolve, or Desmos.</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-semibold text-[#ef4444]">Final Check</td>
              <td className="px-4 py-3 text-[#bcbcc8]">~2 min</td>
              <td className="px-4 py-3 text-[#bcbcc8]">Verify grid-ins. LOTD for unanswered. Never leave blanks.</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="rounded-xl border border-[rgba(200,16,46,.2)] bg-[rgba(200,16,46,.07)] px-5 py-4 text-sm leading-[1.7]">
        <strong style={{ color: ACCENT }}>Pace Check:</strong> At question 11 (halfway), you should have ~17 minutes left. If behind, speed up on easy questions and flag hard ones immediately.
      </div>
    </div>
  );
}

/* ── Slide: Grid-In Rules ── */
export function GridInRulesVisual() {
  const rules = [
    { icon: "÷", title: "Fractions OK", desc: "3/7 and 0.4286 are both correct." },
    { icon: "…", title: "Long Decimals", desc: "Truncate or round. Don't leave blank." },
    { icon: "−", title: "Negatives Allowed", desc: "Digital SAT accepts negative grid-in answers." },
    { icon: "✓", title: "Multiple Correct", desc: "If several answers work, any correct value is accepted." },
    { icon: "!", title: "#1 Trap", desc: "Asks for 2x, not x. ALWAYS re-read what they want." },
    { icon: "?", title: "Reasonableness", desc: "Does your answer make sense in context?" },
  ];

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-3">
      {rules.map((r) => (
        <div key={r.title} className="rounded-xl border border-white/5 bg-[rgba(15,15,22,.75)] p-4">
          <div className="mb-1 text-xl">{r.icon}</div>
          <div className="mb-1 text-sm font-bold text-text-primary">{r.title}</div>
          <div className="text-xs leading-[1.5] text-text-muted">{r.desc}</div>
        </div>
      ))}
    </div>
  );
}

/* ── Slide: Top 8 Preventable Mistakes ── */
const MISTAKES = [
  { name: "Solving for the Wrong Variable", desc: "Question asks for 6x-14, not x.", fix: "Underline exactly what the question asks for BEFORE solving.", color: "#ef4444" },
  { name: "Intermediate vs. Final Answer", desc: "You find the discount but they ask for the final price.", fix: "Make sure your answer addresses the FINAL part of the question.", color: "#f97316" },
  { name: "'At Least' vs. 'More Than'", desc: "'At least 5' means >= 5 (includes 5). 'More than 5' means > 5.", fix: "Circle the exact phrasing and translate to a symbol.", color: "#fbbf24" },
  { name: "Negation Words (NOT, CANNOT)", desc: "Your brain skips the NOT and you pick a valid answer.", fix: "Circle negative words. Underline them.", color: "#a855f7" },
  { name: "Axis Scale / Units", desc: "Y-axis labeled 'in thousands' but you read 45 instead of 45,000.", fix: "Always read axis labels AND the scale before reading data.", color: "#60a5fa" },
  { name: "Positive vs. Negative", desc: "You solve correctly and get x = -3, but enter 3.", fix: "Double-check the sign, especially for grid-ins.", color: "#2bc4a9" },
  { name: "Wrong % Change Denominator", desc: "Price goes from $50 to $60. Use 10/50, not 10/60.", fix: "Denominator = ORIGINAL value. Always.", color: "#f87171" },
  { name: "f(x) Value vs. x Value", desc: "'Value of x' means the input. 'Value of f(x)' means the output.", fix: "Read which one the question asks for.", color: "#22c55e" },
];

export function PreventableMistakesVisual() {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div className="space-y-2">
      {MISTAKES.map((m, i) => (
        <button
          key={i}
          onClick={() => setExpanded(expanded === i ? null : i)}
          className="w-full cursor-pointer rounded-xl border bg-bg-base p-3.5 text-left transition-all duration-200 hover:-translate-y-0.5"
          style={{ borderColor: expanded === i ? `${m.color}44` : "var(--color-border-default)" }}
        >
          <div className="flex items-center gap-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-xs font-bold text-white" style={{ background: m.color }}>{i + 1}</span>
            <div className="flex-1">
              <span className="text-sm font-bold" style={{ color: m.color }}>{m.name}</span>
              {expanded !== i && <span className="ml-2 text-xs text-text-muted">{m.desc}</span>}
            </div>
            <span className="text-[11px] text-text-muted">{expanded === i ? "▲" : "▼"}</span>
          </div>
          {expanded === i && (
            <div className="mt-2.5 space-y-2 pl-10">
              <div className="text-[13px] text-[#bcbcc8]">{m.desc}</div>
              <div className="rounded-lg px-3 py-2 text-[13px]" style={{ background: `${m.color}08`, borderLeft: `3px solid ${m.color}` }}>
                <strong style={{ color: m.color }}>Fix: </strong>
                <span className="text-[#bcbcc8]">{m.fix}</span>
              </div>
            </div>
          )}
        </button>
      ))}
    </div>
  );
}
