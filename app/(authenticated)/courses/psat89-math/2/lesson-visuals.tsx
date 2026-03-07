"use client";

import { useState } from "react";
import { renderMath } from "@/lib/katex-render";

const ACCENT = "#06b6d4";

/* ── Highlight helper ── */
function Code({ children }: { children: React.ReactNode }) {
  return (
    <code
      className="rounded-md bg-[rgba(6,182,212,.1)] px-2 py-0.5 font-mono text-[13px]"
      style={{ color: ACCENT }}
    >
      {children}
    </code>
  );
}

/* ── Slide 1: High-Impact Domain Callout ── */
export function AlgebraOverviewVisual() {
  const domains = [
    { name: "Algebra", pct: 35, qs: "13-15 Qs", color: "#34d399", active: true },
    { name: "Advanced Math", pct: 35, qs: "13-15 Qs", color: "#a78bfa", active: false },
    { name: "Problem-Solving & Data", pct: 15, qs: "5-7 Qs", color: "#fbbf24", active: false },
    { name: "Geometry", pct: 15, qs: "5-7 Qs", color: "#f87171", active: false },
  ];

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-xl border border-border-default">
        {domains.map((d, i) => (
          <div
            key={i}
            className="flex items-center gap-4 border-b border-border-default px-4 py-3 last:border-b-0"
            style={{
              background: d.active ? "rgba(52,211,153,.07)" : undefined,
              borderLeft: d.active ? "3px solid #34d399" : "3px solid transparent",
            }}
          >
            <div className="min-w-[48px] font-mono text-xl font-bold" style={{ color: d.color }}>
              {d.pct}%
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-text-primary">{d.name}</div>
              <div className="text-[12px] text-text-muted">{d.qs}</div>
            </div>
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-border-default">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${d.pct}%`, background: d.color }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-[rgba(52,211,153,.2)] bg-[rgba(52,211,153,.07)] px-5 py-4 text-sm leading-[1.7]">
        <strong style={{ color: "#34d399" }}>High-Impact Domain: </strong>
        Algebra accounts for 13-15 questions (~35% of the test). Mastering linear equations and systems alone can be worth 60-80 points on your score.
      </div>
    </div>
  );
}

/* ── Slide 2: Topic 2A - One-Variable Equations ── */
export function LinearEquationsVisual() {
  const rules = [
    { label: "Solve", formula: "Distribute -> combine like terms -> isolate variable -> check", color: "#34d399" },
    { label: "No solution", formula: "Variables cancel, leaves false statement (e.g., 0 = 5)", color: "#ef4444" },
    { label: "Infinite solutions", formula: "Variables cancel, leaves true statement (e.g., 0 = 0)", color: "#22c55e" },
    { label: "Absolute value", formula: "|expression| = k -> two equations (k must be >= 0)", color: "#60a5fa" },
  ];

  const translations = [
    { eng: "is", math: "=" },
    { eng: "more than", math: "+" },
    { eng: "less than", math: "-" },
    { eng: "per / each", math: "x (rate)" },
    { eng: "of", math: "x (multiply)" },
    { eng: "twice", math: "x 2" },
  ];

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-xl border border-border-default">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="border-b border-border-default bg-bg-surface px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">
                Rule
              </th>
              <th className="border-b border-border-default bg-bg-surface px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">
                How It Works
              </th>
            </tr>
          </thead>
          <tbody>
            {rules.map((r, i) => (
              <tr key={i}>
                <td className="whitespace-nowrap border-b border-border-default px-4 py-3 font-semibold last:border-b-0" style={{ color: r.color }}>
                  {r.label}
                </td>
                <td className="border-b border-border-default px-4 py-3 font-mono text-[13px] text-[#bcbcc8] last:border-b-0">
                  {r.formula}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-xl border border-[rgba(6,182,212,.2)] bg-[rgba(6,182,212,.07)] px-5 py-4 text-sm leading-[1.7]">
        <strong style={{ color: ACCENT }}>Word Problem Translator: </strong>
        <div className="mt-2 flex flex-wrap gap-2">
          {translations.map((t, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border-default bg-bg-base px-3 py-1.5 text-[13px]"
            >
              <span className="text-text-muted">&quot;{t.eng}&quot;</span>
              <span className="text-text-muted">&rarr;</span>
              <Code>{t.math}</Code>
            </span>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-[rgba(239,68,68,.2)] bg-[rgba(239,68,68,.07)] px-5 py-4 text-sm leading-[1.7]">
        <strong className="text-[#ef4444]">The Wrong Target: </strong>
        The question asks for <em>3x + 2</em>, not x. Always re-read exactly what&apos;s being asked <strong>before</strong> you start solving. Underline it.
      </div>
    </div>
  );
}

/* ── Slide 3: Topic 2B - Three Linear Forms ── */
export function ThreeFormsVisual() {
  const forms = [
    {
      name: "Slope-Intercept",
      formula: "$y = mx + b$",
      reveals: "slope ($m$) and y-intercept ($b$)",
      color: "#34d399",
      use: "When you need slope or y-intercept directly",
    },
    {
      name: "Point-Slope",
      formula: "$y - y_1 = m(x - x_1)$",
      reveals: "slope ($m$) and a point ($(x_1, y_1)$)",
      color: "#60a5fa",
      use: "When given a point and slope",
    },
    {
      name: "Standard Form",
      formula: "$Ax + By = C$",
      reveals: "useful for intercepts and systems",
      color: "#a78bfa",
      use: "When finding intercepts or using elimination",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid gap-3">
        {forms.map((f, i) => (
          <div
            key={i}
            className="rounded-xl border bg-bg-base p-4"
            style={{ borderColor: `${f.color}33` }}
          >
            <div className="mb-2 flex items-center gap-3">
              <span className="text-sm font-bold" style={{ color: f.color }}>{f.name}</span>
            </div>
            <div className="mb-2 text-lg font-bold text-text-primary">{renderMath(f.formula)}</div>
            <div className="text-[13px] text-text-muted">
              <strong>Reveals:</strong> {renderMath(f.reveals)}
            </div>
            <div className="mt-1 text-[13px] text-text-muted">
              <strong>Use when:</strong> {f.use}
            </div>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-border-default">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="border-b border-border-default bg-bg-surface px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">Slope Type</th>
              <th className="border-b border-border-default bg-bg-surface px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">Direction</th>
              <th className="border-b border-border-default bg-bg-surface px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">Relationship</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border-b border-border-default px-4 py-3 font-semibold text-[#22c55e]">Positive</td>
              <td className="border-b border-border-default px-4 py-3 text-[#bcbcc8]">Line goes up</td>
              <td className="border-b border-border-default px-4 py-3 text-[#bcbcc8]">-</td>
            </tr>
            <tr>
              <td className="border-b border-border-default px-4 py-3 font-semibold text-[#ef4444]">Negative</td>
              <td className="border-b border-border-default px-4 py-3 text-[#bcbcc8]">Line goes down</td>
              <td className="border-b border-border-default px-4 py-3 text-[#bcbcc8]">-</td>
            </tr>
            <tr>
              <td className="border-b border-border-default px-4 py-3 font-semibold text-text-muted">Zero</td>
              <td className="border-b border-border-default px-4 py-3 text-[#bcbcc8]">Horizontal</td>
              <td className="border-b border-border-default px-4 py-3 text-[#bcbcc8]">-</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-semibold text-text-muted">Undefined</td>
              <td className="px-4 py-3 text-[#bcbcc8]">Vertical</td>
              <td className="px-4 py-3 text-[#bcbcc8]">-</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-[rgba(96,165,250,.2)] bg-[rgba(96,165,250,.07)] px-4 py-3 text-sm">
          <strong style={{ color: "#60a5fa" }}>Parallel Lines</strong>
          <div className="mt-1 text-[13px] text-text-muted">Same slope: {renderMath("$m_1 = m_2$")}</div>
        </div>
        <div className="rounded-xl border border-[rgba(168,85,247,.2)] bg-[rgba(168,85,247,.07)] px-4 py-3 text-sm">
          <strong style={{ color: "#a855f7" }}>Perpendicular Lines</strong>
          <div className="mt-1 text-[13px] text-text-muted">Negative reciprocal: {renderMath("$m_1 \\cdot m_2 = -1$")}</div>
        </div>
      </div>
    </div>
  );
}

/* ── Slide 4: Topic 2C - Systems ── */
export function SystemsVisual() {
  const [activeMethod, setActiveMethod] = useState(0);

  const methods = [
    {
      name: "Substitution",
      when: "One variable is already isolated (or easy to isolate)",
      steps: "Solve one equation for a variable, plug into the other",
      color: "#34d399",
    },
    {
      name: "Elimination",
      when: "Coefficients line up or are easy to match",
      steps: "Add/subtract equations to cancel a variable",
      color: "#60a5fa",
    },
    {
      name: "Graphing (Desmos)",
      when: "Always works! Often fastest on the PSAT",
      steps: "Graph both, click the intersection point",
      color: "#a855f7",
    },
  ];

  const solutions = [
    { type: "One solution", visual: "Different slopes", result: "Lines cross", color: "#22c55e" },
    { type: "No solution", visual: "Same slope, different intercepts", result: "Parallel lines", color: "#ef4444" },
    { type: "Infinite solutions", visual: "Equations are multiples", result: "Same line", color: "#60a5fa" },
  ];

  return (
    <div className="space-y-4">
      {/* Method selector */}
      <div className="flex gap-2">
        {methods.map((m, i) => (
          <button
            key={i}
            onClick={() => setActiveMethod(i)}
            className="flex-1 cursor-pointer rounded-xl border px-3 py-3 text-center text-sm font-semibold transition-all"
            style={{
              borderColor: activeMethod === i ? `${m.color}55` : "var(--color-border-default)",
              background: activeMethod === i ? `${m.color}0a` : undefined,
              color: activeMethod === i ? m.color : undefined,
              boxShadow: activeMethod === i ? `0 0 16px ${m.color}15` : "none",
            }}
          >
            {m.name}
          </button>
        ))}
      </div>
      <div
        className="rounded-xl border p-4 text-sm transition-all duration-300"
        style={{ borderColor: `${methods[activeMethod].color}33`, background: `${methods[activeMethod].color}06` }}
      >
        <div className="mb-1 font-semibold" style={{ color: methods[activeMethod].color }}>
          {methods[activeMethod].name}
        </div>
        <div className="text-[#bcbcc8]">
          <strong>When: </strong>{methods[activeMethod].when}
        </div>
        <div className="mt-1 text-[#bcbcc8]">
          <strong>How: </strong>{methods[activeMethod].steps}
        </div>
      </div>

      {/* Solutions table */}
      <div className="overflow-hidden rounded-xl border border-border-default">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="border-b border-border-default bg-bg-surface px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">Type</th>
              <th className="border-b border-border-default bg-bg-surface px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">Condition</th>
              <th className="border-b border-border-default bg-bg-surface px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">Geometry</th>
            </tr>
          </thead>
          <tbody>
            {solutions.map((s, i) => (
              <tr key={i}>
                <td className="border-b border-border-default px-4 py-3 font-semibold last:border-b-0" style={{ color: s.color }}>{s.type}</td>
                <td className="border-b border-border-default px-4 py-3 text-[#bcbcc8] last:border-b-0">{s.visual}</td>
                <td className="border-b border-border-default px-4 py-3 text-[#bcbcc8] last:border-b-0">{s.result}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-xl border border-[rgba(96,165,250,.2)] bg-[rgba(96,165,250,.07)] px-5 py-4 text-sm leading-[1.7]">
        <strong style={{ color: "#60a5fa" }}>Desmos Power Move: </strong>
        Graph both equations and click the intersection. Fastest for messy algebra. ~40% of system questions can be solved this way.
      </div>
    </div>
  );
}

/* ── Slide 5: Topic 2D - Inequalities ── */
export function InequalitiesVisual() {
  const [flipped, setFlipped] = useState(false);

  const graphRules = [
    { symbol: "< or >", line: "Dashed", circle: "Open", shade: "Does NOT include boundary" },
    { symbol: "<= or >=", line: "Solid", circle: "Closed", shade: "INCLUDES boundary" },
  ];

  return (
    <div className="space-y-4">
      {/* Sign Flip Demo */}
      <button
        onClick={() => setFlipped(!flipped)}
        className="w-full cursor-pointer rounded-2xl border border-[rgba(239,68,68,.25)] bg-bg-base p-5 text-left transition-all duration-300 hover:-translate-y-0.5"
        style={{ boxShadow: flipped ? "0 0 24px rgba(239,68,68,.12)" : "none" }}
      >
        {!flipped ? (
          <div className="text-center">
            <div className="mb-2 text-xl font-bold text-[#ef4444]">The Sign Flip Rule</div>
            <div className="mb-3 text-sm text-text-muted">
              When you multiply or divide by a <strong>NEGATIVE</strong> number, FLIP the inequality sign.
            </div>
            <div className="font-mono text-lg text-text-primary">
              <Code>-3x &gt; 12</Code>
            </div>
            <div className="mt-3 text-[11px] font-semibold uppercase tracking-[1.5px] text-[#ef4444]">
              tap to see the solution
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="mb-3 text-sm text-text-muted">Divide both sides by -3 and <strong>FLIP</strong>:</div>
            <div className="flex items-center justify-center gap-4">
              <div className="font-mono text-lg text-text-muted">-3x &gt; 12</div>
              <div className="text-text-muted">&rarr;</div>
              <div className="font-mono text-lg font-bold text-[#22c55e]">x &lt; -4</div>
            </div>
            <div className="mt-3 rounded-lg bg-[rgba(239,68,68,.07)] px-4 py-2 text-sm text-[#ef4444]">
              NOT x &gt; -4. The sign flips!
            </div>
            <div className="mt-2 text-[11px] font-semibold uppercase tracking-[1.5px] text-[#ef4444]">
              tap to reset
            </div>
          </div>
        )}
      </button>

      {/* Graph rules table */}
      <div className="overflow-hidden rounded-xl border border-border-default">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="border-b border-border-default bg-bg-surface px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">Symbol</th>
              <th className="border-b border-border-default bg-bg-surface px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">Line Type</th>
              <th className="border-b border-border-default bg-bg-surface px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">Circle</th>
              <th className="border-b border-border-default bg-bg-surface px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">Meaning</th>
            </tr>
          </thead>
          <tbody>
            {graphRules.map((r, i) => (
              <tr key={i}>
                <td className="border-b border-border-default px-4 py-3 font-mono font-semibold text-text-secondary last:border-b-0">{r.symbol}</td>
                <td className="border-b border-border-default px-4 py-3 text-[#bcbcc8] last:border-b-0">{r.line}</td>
                <td className="border-b border-border-default px-4 py-3 text-[#bcbcc8] last:border-b-0">{r.circle}</td>
                <td className="border-b border-border-default px-4 py-3 text-[#bcbcc8] last:border-b-0">{r.shade}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-[rgba(6,182,212,.2)] bg-[rgba(6,182,212,.07)] px-4 py-3 text-sm">
          <strong style={{ color: ACCENT }}>&quot;and&quot; = intersection</strong>
          <div className="mt-1 text-[13px] text-text-muted">Narrower range (both conditions true)</div>
        </div>
        <div className="rounded-xl border border-[rgba(251,191,36,.2)] bg-[rgba(251,191,36,.07)] px-4 py-3 text-sm">
          <strong style={{ color: "#fbbf24" }}>&quot;or&quot; = union</strong>
          <div className="mt-1 text-[13px] text-text-muted">Wider range (either condition true)</div>
        </div>
      </div>
    </div>
  );
}

/* ── Slide 6: Trap Taxonomy ── */
const TRAPS = [
  { num: 1, name: "The Wrong Target", desc: "Solved for x when they asked for 2x + 1. Always underline what the question asks for.", example: "Asked: \"What is x + 4?\" You solved: x = 6, picked 6. Answer: 10", color: "#ef4444" },
  { num: 2, name: "The Sign Flip", desc: "Forgot to flip the inequality sign when multiplying or dividing by a negative number.", example: "-3x > 12 -> x < -4 (not x > -4)", color: "#fbbf24" },
  { num: 3, name: "The Distribution Ghost", desc: "Forgot to distribute to ALL terms inside parentheses. The ghost term gets left behind.", example: "-2(3x - 5) = -6x + 10 (not -6x - 5)", color: "#60a5fa" },
  { num: 4, name: "The Imposter Subject", desc: "Used the wrong variable or misidentified what the problem is actually asking you to solve for.", example: "System asks for y but you solved for x and stopped.", color: "#a855f7" },
  { num: 5, name: "The One-Case Trap", desc: "Only solved one branch of an absolute value equation. |x| = 5 means x = 5 OR x = -5.", example: "|x - 3| = 7 -> x = 10 AND x = -4 (two answers)", color: "#f87171" },
  { num: 6, name: "The Percent Spiral", desc: "Applied successive percentages to the original value instead of the new value after each change.", example: "$100 + 10% - 10% != $100. It's $110 -> $99.", color: "#06b6d4" },
];

export function TrapTaxonomyVisual() {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div className="space-y-2.5">
      {TRAPS.map((t, i) => (
        <button
          key={i}
          onClick={() => setExpanded(expanded === i ? null : i)}
          className="w-full cursor-pointer rounded-xl border bg-bg-base p-4 text-left transition-all duration-300 hover:-translate-y-0.5"
          style={{
            borderColor: expanded === i ? `${t.color}44` : "var(--color-border-default)",
            boxShadow: expanded === i ? `0 0 20px ${t.color}15` : "none",
          }}
        >
          <div className="flex items-center gap-3.5">
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg font-mono text-sm font-bold text-white"
              style={{ background: t.color }}
            >
              {t.num}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[15px] font-bold" style={{ color: t.color }}>{t.name}</span>
                <span className="text-[11px] text-text-muted">{expanded === i ? "v" : ">"}</span>
              </div>
              <div className="mt-0.5 text-[13px] leading-[1.5] text-text-muted">{t.desc}</div>
            </div>
          </div>
          {expanded === i && (
            <div
              className="mt-3 rounded-lg px-4 py-3 font-mono text-[13px] leading-[1.7]"
              style={{ background: `${t.color}08`, borderLeft: `3px solid ${t.color}`, color: "#bcbcc8" }}
            >
              {t.example}
            </div>
          )}
        </button>
      ))}
    </div>
  );
}
