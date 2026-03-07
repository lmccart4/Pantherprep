"use client";

import { useState } from "react";

const ACCENT = "#C8102E";

/* ── Slide: 10 Essential Desmos Skills Table ── */
export function DesmosSkillsVisual() {
  const skills = [
    { num: 1, skill: "Graph a Function", input: "y = 2x² - 3x + 1", use: "Visualize any equation instantly" },
    { num: 2, skill: "Find Intersections", input: "Click gray dots", use: "Solve systems, find where curves meet" },
    { num: 3, skill: "Use Sliders", input: "y = ax + b (auto-slider)", use: "Find unknown parameters, test values" },
    { num: 4, skill: "Enter Tables", input: "Click + -> Table", use: "Plot data points for regression" },
    { num: 5, skill: "Run Regression", input: "y₁ ~ mx₁ + b", use: "Find best-fit line/curve for data" },
    { num: 6, skill: "Graph Inequalities", input: "y < 3x - 1", use: "Shade solution regions" },
    { num: 7, skill: "Calculate Statistics", input: "mean(L), median(L)", use: "Instant stats on data lists" },
    { num: 8, skill: "Percentages", input: '15% of 840', use: "Type it directly -- Desmos computes it" },
    { num: 9, skill: "Graph Circles", input: "(x-2)²+(y+3)²=25", use: "Visualize circles, find centers" },
    { num: 10, skill: "Keyboard Shortcuts", input: "^ _ ~ | sqrt pi", use: "Speed up input dramatically" },
  ];

  return (
    <div className="overflow-hidden rounded-xl border border-border-default">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            <th className="border-b border-border-default bg-bg-surface px-3 py-3 text-left text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">#</th>
            <th className="border-b border-border-default bg-bg-surface px-3 py-3 text-left text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">Skill</th>
            <th className="border-b border-border-default bg-bg-surface px-3 py-3 text-left text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">What to Type</th>
            <th className="border-b border-border-default bg-bg-surface px-3 py-3 text-left text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">When to Use</th>
          </tr>
        </thead>
        <tbody>
          {skills.map((s) => (
            <tr key={s.num}>
              <td className="border-b border-border-default px-3 py-2.5 last:border-b-0">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#2bc4a9] text-[11px] font-bold text-black">{s.num}</span>
              </td>
              <td className="whitespace-nowrap border-b border-border-default px-3 py-2.5 font-semibold text-text-secondary last:border-b-0">{s.skill}</td>
              <td className="border-b border-border-default px-3 py-2.5 last:border-b-0">
                <code className="rounded-md bg-[rgba(43,196,169,.1)] px-2 py-0.5 font-mono text-[12px] text-[#2bc4a9]">{s.input}</code>
              </td>
              <td className="border-b border-border-default px-3 py-2.5 text-[13px] text-[#bcbcc8] last:border-b-0">{s.use}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ── Slide: Keyboard Shortcuts Grid ── */
export function ShortcutsVisual() {
  const shortcuts = [
    { key: "^", desc: "Exponent (x^2)" },
    { key: "_", desc: "Subscript (y_1)" },
    { key: "~", desc: "Regression (~)" },
    { key: "|", desc: "Absolute value" },
    { key: "sqrt", desc: "Square root" },
    { key: "pi", desc: "π constant" },
    { key: "nCr", desc: "Combinations" },
    { key: "!", desc: "Factorial" },
  ];

  return (
    <div className="grid grid-cols-4 gap-2.5">
      {shortcuts.map((s) => (
        <div key={s.key} className="rounded-xl border border-white/5 bg-[rgba(15,15,22,.75)] p-3 text-center transition-all hover:border-[#2bc4a9]">
          <div className="mb-1 font-mono text-lg font-bold text-[#2bc4a9]">{s.key}</div>
          <div className="text-xs text-text-muted">{s.desc}</div>
        </div>
      ))}
    </div>
  );
}

/* ── Slide: Do vs Don't ── */
export function DoDontVisual() {
  return (
    <div className="grid grid-cols-2 gap-3.5">
      <div className="rounded-xl border-2 border-[#22c55e] bg-bg-base p-5">
        <h4 className="mb-3 font-bold text-[#22c55e]">USE Desmos When</h4>
        <ul className="space-y-1.5 text-[13px] leading-[1.6] text-[#bcbcc8]">
          <li>Systems of equations (graph + click intersection)</li>
          <li>Quadratics: vertex, zeros, # of solutions</li>
          <li>Regression / best-fit line for data</li>
          <li>Circle equations (graph instantly)</li>
          <li>Verifying your algebraic answer</li>
          <li>Any function with a parameter to find</li>
        </ul>
      </div>
      <div className="rounded-xl border-2 border-[#ef4444] bg-bg-base p-5">
        <h4 className="mb-3 font-bold text-[#ef4444]">SKIP Desmos When</h4>
        <ul className="space-y-1.5 text-[13px] leading-[1.6] text-[#bcbcc8]">
          <li>Simple arithmetic (8 x 7, 25% of 400)</li>
          <li>Combining like terms (3x + 5x = 8x)</li>
          <li>Direct substitution (f(3) = 3 + 7 = 10)</li>
          <li>Conceptual questions (study design, vocab)</li>
          <li>Single-step equations (2x = 14)</li>
          <li>Setup takes more than 5 seconds</li>
        </ul>
      </div>
    </div>
  );
}

/* ── Slide: Desmos Trap Taxonomy ── */
const TRAPS = [
  { num: 1, name: "The Intersection Misread", color: "#ef4444", desc: "Read the wrong coordinate from the intersection point (e.g., read x when they asked for y, or misread the sign).", fix: "Click the intersection dot carefully. Write down both x and y. Then re-read what the question asks for." },
  { num: 2, name: "The Setup Trap", color: "#f97316", desc: "Spent too long setting up a Desmos graph when algebra would have been faster. Lost time with no payoff.", fix: "The 5-second rule: if you can't set it up in Desmos in 5 seconds, switch to algebra." },
  { num: 3, name: "The CAS Illusion", color: "#fbbf24", desc: "Used Desmos as a CAS (computer algebra system) for something it can't do, like factoring symbolically.", fix: "Desmos graphs and computes, but doesn't factor or simplify. Use algebra for simplification." },
  { num: 4, name: "The Mental Math Trap", color: "#60a5fa", desc: "Guessed or eyeballed an answer when Desmos would have given the exact value in seconds.", fix: "If the question involves a graph, function, or data — open Desmos. Don't trust mental estimates." },
];

export function DesmosTrapsVisual() {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div className="space-y-2.5">
      {TRAPS.map((t) => (
        <button
          key={t.num}
          onClick={() => setExpanded(expanded === t.num ? null : t.num)}
          className="w-full cursor-pointer rounded-xl border bg-bg-base p-4 text-left transition-all duration-300 hover:-translate-y-0.5"
          style={{
            borderColor: expanded === t.num ? `${t.color}44` : "var(--color-border-default)",
            boxShadow: expanded === t.num ? `0 0 20px ${t.color}15` : "none",
          }}
        >
          <div className="flex items-center gap-3.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white" style={{ background: t.color }}>
              {t.num}
            </div>
            <div className="flex-1">
              <span className="text-[15px] font-bold" style={{ color: t.color }}>{t.name}</span>
              <span className="ml-2 text-[11px] text-text-muted">{expanded === t.num ? "▲" : "▼"}</span>
              <div className="mt-0.5 text-[13px] leading-[1.5] text-text-muted">{t.desc}</div>
            </div>
          </div>
          {expanded === t.num && (
            <div className="mt-3 rounded-lg px-4 py-3 text-sm leading-[1.7]" style={{ background: `${t.color}08`, borderLeft: `3px solid ${t.color}` }}>
              <strong style={{ color: t.color }}>Fix: </strong>
              <span className="text-[#bcbcc8]">{t.fix}</span>
            </div>
          )}
        </button>
      ))}
    </div>
  );
}

/* ── Slide: 5-Second Rule Callout ── */
export function FiveSecondRuleVisual() {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-[rgba(43,196,169,.25)] bg-bg-base p-6 text-center shadow-[0_0_24px_rgba(43,196,169,.1)]">
        <div className="mb-3 text-[10px] font-bold uppercase tracking-[2px] text-text-muted">Calculator Discipline Rule</div>
        <div className="mb-2 font-mono text-4xl font-bold text-[#2bc4a9]">5 seconds</div>
        <div className="text-sm text-[#bcbcc8]">If you can set up the problem in Desmos within <strong>5 seconds</strong>, graph it.<br />If setup takes longer, switch to algebra.</div>
      </div>
      <div className="rounded-xl border border-[rgba(200,16,46,.2)] bg-[rgba(200,16,46,.07)] px-5 py-4 text-sm leading-[1.7]">
        <strong style={{ color: ACCENT }}>With CAS calculators now banned,</strong> Desmos fluency is your single biggest competitive advantage. ~1/3 of SAT math questions can be solved or verified with Desmos.
      </div>
    </div>
  );
}
