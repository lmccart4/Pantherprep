"use client";

import { useState } from "react";

const ACCENT = "#d4a017";
const ALGEBRA = "#34d399";

/* ── Slide 1: Linear Equations Overview ── */
export function LinearEquationsVisual() {
  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-xl border border-border-default">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="border-b border-border-default bg-bg-surface px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">Step</th>
              <th className="border-b border-border-default bg-bg-surface px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">Action</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["1. Distribute", "Clear parentheses using the distributive property"],
              ["2. Combine", "Combine like terms on each side"],
              ["3. Isolate", "Move variable terms to one side, constants to the other"],
              ["4. Solve", "Divide to get the variable alone"],
              ["5. Check", "Plug your answer back into the original equation"],
            ].map(([step, action], i) => (
              <tr key={i}>
                <td className="whitespace-nowrap border-b border-border-default px-4 py-3 font-semibold text-text-secondary last:border-b-0">
                  <code className="rounded-md bg-[rgba(52,211,153,.1)] px-2 py-0.5 font-mono text-[13px]" style={{ color: ALGEBRA }}>{step}</code>
                </td>
                <td className="border-b border-border-default px-4 py-3 text-[#bcbcc8] last:border-b-0">{action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "One Solution", desc: "Normal — variable isolated", color: "#22c55e", example: "2x = 8 → x = 4" },
          { label: "No Solution", desc: "Contradiction (false)", color: "#ef4444", example: "0 = 5 (impossible)" },
          { label: "Infinite", desc: "Identity (always true)", color: "#60a5fa", example: "0 = 0 (always)" },
        ].map((item, i) => (
          <div key={i} className="rounded-xl border bg-bg-base p-4 text-center" style={{ borderColor: `${item.color}33` }}>
            <div className="text-sm font-bold" style={{ color: item.color }}>{item.label}</div>
            <div className="mt-1 text-xs text-text-muted">{item.desc}</div>
            <code className="mt-2 inline-block rounded-md bg-[rgba(212,160,23,.07)] px-2 py-0.5 font-mono text-[12px]" style={{ color: ACCENT }}>{item.example}</code>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-[rgba(200,16,46,.2)] bg-[rgba(200,16,46,.07)] px-5 py-4 text-sm leading-[1.7]">
        <strong className="text-[#C8102E]">PSAT Trap #1: </strong>
        The question asks for the value of <em>3x + 2</em>, not x. Always re-read exactly what&apos;s being asked <strong>before</strong> you start solving.
      </div>
    </div>
  );
}

/* ── Slide 2: Three Forms of Linear Equations ── */
export function ThreeFormsVisual() {
  const [activeForm, setActiveForm] = useState<number | null>(null);

  const forms = [
    {
      name: "Slope-Intercept",
      eq: "y = mx + b",
      color: ALGEBRA,
      reveals: "slope (m) and y-intercept (b)",
      use: "When you need to graph quickly or identify slope/y-int directly",
      details: "m = slope (rate of change)\nb = y-intercept (starting value)\nMost common form on the PSAT",
    },
    {
      name: "Point-Slope",
      eq: "y - y\u2081 = m(x - x\u2081)",
      color: "#60a5fa",
      reveals: "slope (m) and a point (x\u2081, y\u2081)",
      use: "When given a point and a slope, or two points",
      details: "Plug in the known point and slope\nConvert to slope-intercept by distributing\nOften appears in 'find the equation' questions",
    },
    {
      name: "Standard Form",
      eq: "Ax + By = C",
      color: "#a855f7",
      reveals: "x-intercept (C/A) and y-intercept (C/B)",
      use: "When finding intercepts or setting up systems for elimination",
      details: "Set x=0 for y-intercept, y=0 for x-intercept\nA, B, C are typically integers\nBest for elimination in systems",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        {forms.map((f, i) => (
          <button
            key={i}
            onClick={() => setActiveForm(activeForm === i ? null : i)}
            className="cursor-pointer rounded-xl border bg-bg-base p-4 text-center transition-all duration-300 hover:-translate-y-0.5"
            style={{ borderColor: activeForm === i ? f.color : "var(--color-border-default)", boxShadow: activeForm === i ? `0 0 20px ${f.color}22` : "none" }}
          >
            <div className="text-sm font-bold" style={{ color: f.color }}>{f.name}</div>
            <div className="mt-2 font-mono text-base text-text-primary">{f.eq}</div>
            <div className="mt-2 text-xs leading-[1.5] text-text-muted">Reveals: <strong>{f.reveals}</strong></div>
            <div className="mt-2 text-[10px] font-semibold uppercase tracking-[1.5px] opacity-70" style={{ color: f.color }}>
              {activeForm === i ? "tap to close" : "tap for details"}
            </div>
          </button>
        ))}
      </div>
      {activeForm !== null && (
        <div className="rounded-xl border p-4 text-sm leading-[1.7]" style={{ borderColor: `${forms[activeForm].color}33`, background: `${forms[activeForm].color}08` }}>
          <div className="mb-2 font-bold" style={{ color: forms[activeForm].color }}>When to use: {forms[activeForm].use}</div>
          <div className="whitespace-pre-line text-[#bcbcc8]">{forms[activeForm].details}</div>
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-border-default">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="border-b border-border-default bg-bg-surface px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">Relationship</th>
              <th className="border-b border-border-default bg-bg-surface px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">Slope Rule</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border-b border-border-default px-4 py-3 font-semibold text-text-secondary">Parallel lines</td>
              <td className="border-b border-border-default px-4 py-3 text-[#bcbcc8]">Same slope: <code className="rounded-md bg-[rgba(52,211,153,.1)] px-2 py-0.5 font-mono text-[13px]" style={{ color: ALGEBRA }}>m&#8321; = m&#8322;</code></td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-semibold text-text-secondary">Perpendicular lines</td>
              <td className="px-4 py-3 text-[#bcbcc8]">Negative reciprocal: <code className="rounded-md bg-[rgba(96,165,250,.1)] px-2 py-0.5 font-mono text-[13px]" style={{ color: "#60a5fa" }}>m&#8321; &times; m&#8322; = -1</code></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── Slide 3: Systems of Equations ── */
export function SystemsVisual() {
  const [method, setMethod] = useState<number>(0);

  const methods = [
    { name: "Substitution", when: "One variable is already isolated", steps: "1. Solve one equation for a variable\n2. Plug that expression into the other equation\n3. Solve for the remaining variable\n4. Back-substitute to find the first", example: "y = 3x + 1 and 2x + y = 11\nSubstitute: 2x + (3x + 1) = 11 → 5x = 10 → x = 2, y = 7", color: ALGEBRA },
    { name: "Elimination", when: "Coefficients are easy to align", steps: "1. Multiply one/both equations so a variable has matching coefficients\n2. Add or subtract equations to eliminate that variable\n3. Solve for the remaining variable\n4. Back-substitute", example: "2x + 3y = 12 and 4x - 3y = 6\nAdd: 6x = 18 → x = 3, y = 2", color: "#60a5fa" },
    { name: "Desmos", when: "Messy algebra or verification", steps: "1. Graph both equations\n2. Click the intersection point\n3. Read the coordinates\n4. Done in ~10 seconds", example: "Type both equations → click intersection → answer", color: "#a855f7" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {methods.map((m, i) => (
          <button
            key={i}
            onClick={() => setMethod(i)}
            className="flex-1 cursor-pointer rounded-lg border px-3 py-2.5 text-center text-sm font-bold transition-all"
            style={{
              borderColor: method === i ? m.color : "var(--color-border-default)",
              background: method === i ? `${m.color}10` : "transparent",
              color: method === i ? m.color : "var(--color-text-muted)",
            }}
          >
            {m.name}
          </button>
        ))}
      </div>

      <div className="rounded-xl border p-5" style={{ borderColor: `${methods[method].color}33`, background: `${methods[method].color}06` }}>
        <div className="mb-2 text-xs font-bold uppercase tracking-[2px] text-text-muted">Best when: {methods[method].when}</div>
        <div className="mb-3 whitespace-pre-line text-sm leading-[1.8] text-[#bcbcc8]">{methods[method].steps}</div>
        <div className="rounded-lg bg-bg-base p-3">
          <div className="text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">Example</div>
          <div className="mt-1 whitespace-pre-line font-mono text-[13px] leading-[1.8]" style={{ color: methods[method].color }}>{methods[method].example}</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "One Solution", desc: "Lines intersect (different slopes)", color: "#22c55e" },
          { label: "No Solution", desc: "Lines are parallel (same slope, different intercepts)", color: "#ef4444" },
          { label: "Infinite Solutions", desc: "Same line (equations are multiples)", color: "#60a5fa" },
        ].map((item, i) => (
          <div key={i} className="rounded-xl border bg-bg-base p-3.5 text-center" style={{ borderColor: `${item.color}33` }}>
            <div className="text-sm font-bold" style={{ color: item.color }}>{item.label}</div>
            <div className="mt-1 text-xs leading-[1.4] text-text-muted">{item.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Slide 4: Linear Inequalities ── */
export function InequalitiesVisual() {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-[rgba(200,16,46,.3)] bg-[rgba(200,16,46,.07)] px-5 py-4 text-center text-sm leading-[1.7]">
        <strong className="text-lg text-[#C8102E]">The One Rule That Changes Everything</strong>
        <div className="mt-2 text-[#bcbcc8]">
          When you multiply or divide by a <strong>NEGATIVE</strong> number, <strong>FLIP the inequality sign</strong>.
        </div>
        <div className="mt-2 font-mono text-base" style={{ color: ACCENT }}>
          -3x &gt; 12 &rarr; x &lt; -4 <span className="text-text-muted">(not x &gt; -4)</span>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border-default">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="border-b border-border-default bg-bg-surface px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">Symbol</th>
              <th className="border-b border-border-default bg-bg-surface px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">Number Line</th>
              <th className="border-b border-border-default bg-bg-surface px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">Graph Line</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["< or >", "Open circle (not included)", "Dashed line"],
              ["\u2264 or \u2265", "Closed circle (included)", "Solid line"],
            ].map(([sym, nl, gl], i) => (
              <tr key={i}>
                <td className="border-b border-border-default px-4 py-3 font-mono font-semibold text-text-secondary last:border-b-0">{sym}</td>
                <td className="border-b border-border-default px-4 py-3 text-[#bcbcc8] last:border-b-0">{nl}</td>
                <td className="border-b border-border-default px-4 py-3 text-[#bcbcc8] last:border-b-0">{gl}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-[rgba(52,211,153,.2)] bg-[rgba(52,211,153,.07)] p-4">
          <div className="text-sm font-bold" style={{ color: ALGEBRA }}>Compound: &quot;AND&quot;</div>
          <div className="mt-1 text-xs text-text-muted">Intersection (both true) — narrower solution</div>
          <code className="mt-2 inline-block rounded-md bg-bg-base px-2 py-0.5 font-mono text-[12px]" style={{ color: ALGEBRA }}>2 &lt; x &lt; 7</code>
        </div>
        <div className="rounded-xl border border-[rgba(96,165,250,.2)] bg-[rgba(96,165,250,.07)] p-4">
          <div className="text-sm font-bold text-[#60a5fa]">Compound: &quot;OR&quot;</div>
          <div className="mt-1 text-xs text-text-muted">Union (either true) — wider solution</div>
          <code className="mt-2 inline-block rounded-md bg-bg-base px-2 py-0.5 font-mono text-[12px] text-[#60a5fa]">x &lt; -1 or x &gt; 4</code>
        </div>
      </div>
    </div>
  );
}

/* ── Slide 5 (referenced from lesson): Trap Taxonomy ── */
const TRAPS = [
  { num: "1", name: "The Wrong Target", color: "#ef4444", desc: "Solved for x when they asked for 2x + 1. Always underline exactly what the question asks for.", example: 'Asked: "What is x + 4?" You solved: x = 6, picked 6. Answer: 10' },
  { num: "2", name: "The Sign Flip", color: "#fbbf24", desc: "Forgot to flip the inequality sign when multiplying or dividing by a negative number.", example: "-3x > 12 \u2192 x < -4 (not x > -4)" },
  { num: "3", name: "The Distribution Ghost", color: "#60a5fa", desc: "Forgot to distribute to ALL terms inside parentheses.", example: "-2(3x - 5) = -6x + 10 (not -6x - 5)" },
  { num: "4", name: "The Imposter Subject", color: "#a78bfa", desc: "Used the wrong variable or misidentified what the problem asks you to solve for.", example: "System asks for y but you solved for x and stopped." },
  { num: "5", name: "The One-Case Trap", color: "#f87171", desc: "Only solved one branch of an absolute value equation. |x| = 5 means x = 5 OR x = -5.", example: "|x - 3| = 7 \u2192 x = 10 AND x = -4 (two answers)" },
  { num: "6", name: "The Percent Spiral", color: "#C8102E", desc: "Applied successive percentages to the original value instead of the new value.", example: "$100 + 10% - 10% \u2260 $100. It's $110 \u2192 $99." },
];

export function TrapTaxonomyVisual() {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div className="space-y-2.5">
      {TRAPS.map((t, i) => (
        <button
          key={i}
          onClick={() => setExpanded(expanded === i ? null : i)}
          className="flex w-full cursor-pointer items-start gap-3.5 rounded-xl border bg-bg-base p-4 text-left transition-all duration-300 hover:-translate-y-0.5"
          style={{ borderColor: expanded === i ? `${t.color}44` : "var(--color-border-default)" }}
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[13px] font-bold text-white" style={{ background: t.color }}>
            {t.num}
          </div>
          <div className="flex-1">
            <div className="text-[15px] font-bold" style={{ color: t.color }}>{t.name}</div>
            <div className="mt-0.5 text-[13px] leading-[1.5] text-text-muted">{t.desc}</div>
            {expanded === i && (
              <div className="mt-2 rounded-lg bg-bg-surface px-3 py-2 font-mono text-[12px] leading-[1.6]" style={{ color: t.color }}>
                {t.example}
              </div>
            )}
          </div>
        </button>
      ))}
    </div>
  );
}

/* ── Word Problem Translation Table ── */
export function WordProblemVisual() {
  const rows = [
    { phrase: '"is"', symbol: "=", color: "#22c55e" },
    { phrase: '"more than" / "increased by"', symbol: "+", color: "#60a5fa" },
    { phrase: '"less than" / "decreased by"', symbol: "\u2212", color: "#f87171" },
    { phrase: '"per" / "each" / "every"', symbol: "\u00D7 (or \u00F7)", color: ACCENT },
    { phrase: '"of" (as in "30% of")', symbol: "\u00D7", color: "#a855f7" },
    { phrase: '"total" / "sum"', symbol: "+", color: "#60a5fa" },
    { phrase: '"twice" / "double"', symbol: "\u00D72", color: ACCENT },
    { phrase: '"half of"', symbol: "\u00F72", color: "#fbbf24" },
  ];

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-xl border border-border-default">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="border-b border-border-default bg-bg-surface px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">English Phrase</th>
              <th className="border-b border-border-default bg-bg-surface px-4 py-3 text-center text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">Math Symbol</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                <td className="border-b border-border-default px-4 py-3 text-[#bcbcc8] last:border-b-0">{r.phrase}</td>
                <td className="border-b border-border-default px-4 py-3 text-center last:border-b-0">
                  <code className="rounded-md bg-[rgba(212,160,23,.1)] px-3 py-1 font-mono text-base font-bold" style={{ color: r.color }}>{r.symbol}</code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-xl border border-[rgba(212,160,23,.2)] bg-[rgba(212,160,23,.07)] px-5 py-4 text-sm leading-[1.7]">
        <strong style={{ color: ACCENT }}>Context Interpretation: </strong>
        In <code className="rounded-md bg-[rgba(212,160,23,.1)] px-2 py-0.5 font-mono text-[13px]" style={{ color: ACCENT }}>C = 50 + 0.15m</code>, the 50 is the flat fee and 0.15 is the per-mile rate. Slope = rate of change, y-intercept = starting value.
      </div>
    </div>
  );
}
