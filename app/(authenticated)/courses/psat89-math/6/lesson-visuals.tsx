"use client";

import { useState } from "react";

const ACCENT = "#06b6d4";

/* ── Slide 1: 10 Essential Desmos Skills Table ── */
export function DesmosSkillsVisual() {
  const skills = [
    { num: 1, skill: "Graph a function", how: "Type: y = x\u00b2 \u2212 4", use: "Visualize shape, find intercepts & vertex" },
    { num: 2, skill: "Find intersections", how: "Graph two equations; click the gray dot", use: "Solve systems, find where f(x) = g(x)" },
    { num: 3, skill: "Use sliders", how: "Type a letter like a; Desmos creates a slider", use: "Find unknown constants" },
    { num: 4, skill: "Enter a table", how: "Click + \u2192 Table; enter x, y values", use: "Check points, set up regression data" },
    { num: 5, skill: "Run a regression", how: "After table: type y\u2081 ~ mx\u2081 + b", use: "Find line of best fit" },
    { num: 6, skill: "Graph inequalities", how: "Type: y > 2x + 1", use: "Visualize solution regions" },
    { num: 7, skill: "Calculate statistics", how: "Type: mean(1,2,3,4,5)", use: "Quick mean, median calculations" },
    { num: 8, skill: "Use percent", how: "Type: 20% of 350", use: "Percentage problems" },
    { num: 9, skill: "Graph circles", how: "Type: (x\u22122)\u00b2+(y+3)\u00b2=25", use: "Verify center, radius" },
    { num: 10, skill: "Keyboard shortcuts", how: "^  _  ~  |  sqrt  pi", use: "Speed up every entry" },
  ];

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-xl border border-border-default">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="border-b border-border-default bg-bg-surface px-3 py-3 text-left text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">#</th>
              <th className="border-b border-border-default bg-bg-surface px-3 py-3 text-left text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">Skill</th>
              <th className="border-b border-border-default bg-bg-surface px-3 py-3 text-left text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">How</th>
              <th className="border-b border-border-default bg-bg-surface px-3 py-3 text-left text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">PSAT Use</th>
            </tr>
          </thead>
          <tbody>
            {skills.map((s) => (
              <tr key={s.num}>
                <td className="border-b border-border-default px-3 py-2.5 last:border-b-0">
                  <span className="inline-flex h-[22px] w-[22px] items-center justify-center rounded-full text-[11px] font-bold text-white" style={{ background: ACCENT }}>{s.num}</span>
                </td>
                <td className="border-b border-border-default px-3 py-2.5 font-semibold text-text-secondary last:border-b-0">{s.skill}</td>
                <td className="border-b border-border-default px-3 py-2.5 last:border-b-0">
                  <code className="rounded-md bg-[rgba(6,182,212,.1)] px-2 py-0.5 font-mono text-[12px]" style={{ color: "#60a5fa" }}>{s.how}</code>
                </td>
                <td className="border-b border-border-default px-3 py-2.5 text-[13px] text-[#bcbcc8] last:border-b-0">{s.use}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="rounded-xl border border-[rgba(6,182,212,.2)] bg-[rgba(6,182,212,.07)] px-5 py-4 text-sm leading-[1.7]">
        <strong style={{ color: ACCENT }}>Why Desmos Matters: </strong>
        Desmos can solve <strong>60\u201370%</strong> of PSAT 8/9 math questions faster than algebra. Students who master it score higher not because they are better at math, but because they are <strong>faster</strong>.
      </div>
    </div>
  );
}

/* ── Slide 2: Keyboard Shortcuts Grid ── */
export function ShortcutsVisual() {
  const shortcuts = [
    { key: "^", desc: "Exponents: x^2 \u2192 x\u00b2" },
    { key: "_", desc: "Subscripts: y_1 \u2192 y\u2081" },
    { key: "~", desc: "Regression: y\u2081~mx\u2081+b" },
    { key: "Shift+\\", desc: "Absolute value: |x\u22123|" },
    { key: "sqrt", desc: "Square root: sqrt(x)" },
    { key: "pi", desc: "\u03c0 constant: 3.14159\u2026" },
    { key: "/", desc: "Fractions: 3/7 \u2192 \u00b3\u2044\u2087" },
    { key: "\u2699", desc: "Wrench icon: set axis range" },
  ];

  return (
    <div className="grid grid-cols-4 gap-2.5">
      {shortcuts.map((s, i) => (
        <div key={i} className="rounded-xl border border-border-default bg-bg-base p-3 text-center">
          <div className="mb-1 font-mono text-xl font-bold" style={{ color: ACCENT }}>{s.key}</div>
          <div className="text-[12px] text-text-muted">{s.desc}</div>
        </div>
      ))}
    </div>
  );
}

/* ── Slide 3: When To Use / Not Use Desmos ── */
export function DesmosDecisionVisual() {
  const doList = [
    "Systems of equations (graph & click)",
    "Quadratic vertex, zeros, graph shape",
    "Finding where f(x) = g(x)",
    "Data tables & regression",
    "Inequality solution regions",
    "Circle equations",
    "Unknown constants with sliders",
    "Verifying your algebraic answer",
  ];

  const dontList = [
    "Simple arithmetic (mental math)",
    "Single-step calculations",
    "Questions testing setup, not solving",
    "When you see the answer immediately",
    "Probability from tables",
    "Study design / conceptual questions",
    "If setup takes > 15 seconds",
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border-2 border-[#22c55e] bg-bg-surface p-4">
          <div className="mb-2 text-sm font-bold text-[#22c55e]">USE Desmos</div>
          <ul className="space-y-1 pl-4 text-[13px] text-[#bcbcc8]">
            {doList.map((item, i) => <li key={i} className="list-disc">{item}</li>)}
          </ul>
        </div>
        <div className="rounded-xl border-2 border-[#ef4444] bg-bg-surface p-4">
          <div className="mb-2 text-sm font-bold text-[#ef4444]">DON&apos;T Use Desmos</div>
          <ul className="space-y-1 pl-4 text-[13px] text-[#bcbcc8]">
            {dontList.map((item, i) => <li key={i} className="list-disc">{item}</li>)}
          </ul>
        </div>
      </div>

      <div className="rounded-xl border border-[rgba(6,182,212,.2)] bg-[rgba(6,182,212,.07)] px-5 py-4 text-sm leading-[1.7]">
        <strong style={{ color: ACCENT }}>The 5-Second Rule: </strong>
        If you can&apos;t figure out how to set up the problem in Desmos within 5 seconds, switch to algebra. Desmos is a tool, not a crutch.
      </div>
    </div>
  );
}

/* ── Slide 4: First Steps Tutorial ── */
export function FirstStepsVisual() {
  const steps = [
    { num: "1", title: "Opening Desmos", body: "Click the calculator icon at the top of every math question. It appears in a resizable panel." },
    { num: "2", title: "Typing an Equation", body: "Click the first empty line and type y = 2x + 3. The line appears instantly. Type a second equation on line 2." },
    { num: "3", title: "Finding Intersections", body: "When two graphs cross, a gray dot appears. Click it to see the exact (x, y) coordinates." },
    { num: "4", title: "Zooming & Panning", body: "Use + and \u2212 buttons or scroll wheel. Click the wrench icon to set exact axis ranges." },
    { num: "5", title: "Key Symbols", body: "^ for exponents, / for fractions, sqrt for roots, pi for \u03c0, | (Shift+\\) for absolute value." },
  ];

  return (
    <div className="space-y-2.5">
      {steps.map((s) => (
        <div key={s.num} className="rounded-xl border border-border-default bg-bg-surface p-4">
          <div className="mb-1.5 flex items-center gap-2.5">
            <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[13px] font-bold text-white" style={{ background: ACCENT }}>{s.num}</span>
            <span className="text-sm font-bold text-text-primary">{s.title}</span>
          </div>
          <div className="pl-[38px] text-[13px] leading-[1.6] text-[#bcbcc8]">{s.body}</div>
        </div>
      ))}

      <div className="rounded-xl border border-[rgba(96,165,250,.2)] bg-[rgba(96,165,250,.07)] px-5 py-4 text-sm leading-[1.7]">
        <strong style={{ color: "#60a5fa" }}>Practice Now: </strong>
        Go to <strong>desmos.com/calculator</strong> and try typing <code className="rounded-md bg-[rgba(6,182,212,.1)] px-2 py-0.5 font-mono text-[13px]" style={{ color: ACCENT }}>y = x^2 - 4</code>. Then type <code className="rounded-md bg-[rgba(6,182,212,.1)] px-2 py-0.5 font-mono text-[13px]" style={{ color: ACCENT }}>y = x</code> on line 2. Click the intersection points.
      </div>
    </div>
  );
}

/* ── Slide: Desmos Limitations Callout ── */
export function DesmosLimitationsVisual() {
  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-xl border border-border-default">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="border-b border-border-default bg-bg-surface px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">Mode</th>
              <th className="border-b border-border-default bg-bg-surface px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">Best For</th>
              <th className="border-b border-border-default bg-bg-surface px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">Use When</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border-b border-border-default px-4 py-3 font-semibold last:border-b-0" style={{ color: ACCENT }}>Graphing (default)</td>
              <td className="border-b border-border-default px-4 py-3 text-[#bcbcc8] last:border-b-0">Equations, intersections, tables, regressions</td>
              <td className="border-b border-border-default px-4 py-3 text-[#bcbcc8] last:border-b-0">95% of the time</td>
            </tr>
            <tr>
              <td className="border-b border-border-default px-4 py-3 font-semibold last:border-b-0" style={{ color: "#fbbf24" }}>Scientific</td>
              <td className="border-b border-border-default px-4 py-3 text-[#bcbcc8] last:border-b-0">Pure arithmetic, unit conversions</td>
              <td className="border-b border-border-default px-4 py-3 text-[#bcbcc8] last:border-b-0">When graph view is cluttered</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="rounded-xl border border-[rgba(239,68,68,.2)] bg-[rgba(239,68,68,.07)] px-5 py-4 text-sm leading-[1.7]">
        <strong className="text-[#ef4444]">CAS Ban: </strong>
        Computer Algebra Systems (like TI-Nspire CAS) are NOT allowed. Desmos cannot simplify algebraic expressions or factor for you. It can only <strong>evaluate numerically</strong> and <strong>graph</strong>.
      </div>

      <div className="rounded-xl border border-[rgba(6,182,212,.2)] bg-[rgba(6,182,212,.07)] px-5 py-4 text-sm leading-[1.7]">
        <strong style={{ color: ACCENT }}>Workaround: </strong>
        Desmos can&apos;t factor x\u00b2 \u2212 5x + 6, but you CAN graph y = x\u00b2 \u2212 5x + 6 and find the <strong>zeros</strong> at x = 2 and x = 3. Same result, different method.
      </div>
    </div>
  );
}
