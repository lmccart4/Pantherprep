"use client";

import { useState } from "react";
import { renderMath } from "@/lib/katex-render";

const ACCENT = "#C8102E";

/* ── Three Forms of Linear Equations ── */
export function ThreeFormsVisual() {
  const [flipped, setFlipped] = useState<Record<number, boolean>>({});

  const forms = [
    { name: "Slope-Intercept", eq: "$y = mx + b$", color: "#34d399", reveals: "slope (m) and y-intercept (b)", details: "Use when: you need the slope or y-intercept quickly, or want to graph. m = slope (rate of change), b = y-intercept (starting value). Most common form on the SAT." },
    { name: "Point-Slope", eq: "$y - y_1 = m(x - x_1)$", color: "#60a5fa", reveals: "slope (m) and a point ($x_1, y_1$)", details: "Use when: you're given a point and a slope, or two points (calculate slope first). Write the equation through ($x_1, y_1$) with slope m. Convert to slope-intercept by distributing and simplifying." },
    { name: "Standard Form", eq: "$Ax + By = C$", color: "#fbbf24", reveals: "x-intercept (set y=0) and y-intercept (set x=0)", details: "Use when: finding intercepts, or working with systems (elimination method works best in standard form). To find x-intercept: set y = 0. To find y-intercept: set x = 0." },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        {forms.map((f, i) => (
          <button
            key={i}
            onClick={() => setFlipped(prev => ({ ...prev, [i]: !prev[i] }))}
            className="cursor-pointer rounded-xl border bg-bg-base p-4 text-left transition-all duration-300 hover:-translate-y-0.5"
            style={{ borderColor: flipped[i] ? `${f.color}44` : "var(--color-border-default)", boxShadow: flipped[i] ? `0 0 20px ${f.color}15` : "none" }}
          >
            {!flipped[i] ? (
              <>
                <div className="mb-2 text-sm font-bold" style={{ color: f.color }}>{f.name}</div>
                <div className="mb-2 font-mono text-lg font-bold text-text-primary">{renderMath(f.eq)}</div>
                <div className="text-[13px] leading-[1.5] text-text-muted">Reveals: <strong>{renderMath(f.reveals)}</strong></div>
                <div className="mt-2 text-right text-[10px] font-medium opacity-70" style={{ color: f.color }}>tap for details &rarr;</div>
              </>
            ) : (
              <>
                <div className="text-sm leading-[1.7] text-[#bcbcc8]">{renderMath(f.details)}</div>
                <div className="mt-2 text-right text-[10px] font-medium opacity-70" style={{ color: f.color }}>&larr; tap to flip back</div>
              </>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── Slope Relationships ── */
export function SlopeVisual() {
  const rows = [
    { type: "Positive Slope", desc: "Line goes up left to right", example: "m = 3", color: "#22c55e" },
    { type: "Negative Slope", desc: "Line goes down left to right", example: "m = -2", color: "#ef4444" },
    { type: "Zero Slope", desc: "Horizontal line (y = constant)", example: "m = 0", color: "#6b7280" },
    { type: "Undefined Slope", desc: "Vertical line (x = constant)", example: "x = 5", color: "#a855f7" },
    { type: "Parallel Lines", desc: "Same slope, different y-intercepts", example: "$m_1 = m_2$", color: "#60a5fa" },
    { type: "Perpendicular Lines", desc: "Slopes are negative reciprocals", example: "$m_1 \\times m_2 = -1$", color: "#fbbf24" },
  ];

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-xl border border-border-default">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="border-b border-border-default bg-bg-surface px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">Type</th>
              <th className="border-b border-border-default bg-bg-surface px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">Description</th>
              <th className="border-b border-border-default bg-bg-surface px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">Example</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                <td className="whitespace-nowrap border-b border-border-default px-4 py-3 font-semibold last:border-b-0" style={{ color: r.color }}>{r.type}</td>
                <td className="border-b border-border-default px-4 py-3 text-[#bcbcc8] last:border-b-0">{r.desc}</td>
                <td className="border-b border-border-default px-4 py-3 last:border-b-0">
                  <code className="rounded-md bg-[rgba(200,16,46,.1)] px-2 py-0.5 font-mono text-[13px]" style={{ color: ACCENT }}>{renderMath(r.example)}</code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="rounded-xl border border-[rgba(96,165,250,.2)] bg-[rgba(96,165,250,.07)] px-5 py-4 text-sm leading-[1.7]">
        <strong style={{ color: "#60a5fa" }}>Slope Formula: </strong>
        {renderMath("$m = \\frac{y_2 - y_1}{x_2 - x_1}$")} -- rise over run. The order matters: stay consistent with which point is &quot;1&quot; and which is &quot;2&quot;.
      </div>
    </div>
  );
}

/* ── Systems: Three Methods ── */
export function SystemsVisual() {
  const [active, setActive] = useState(0);

  const methods = [
    { name: "Substitution", color: "#34d399", when: "When one variable is already isolated (e.g., y = 3x + 1)", steps: ["Solve one equation for a variable", "Plug that expression into the other equation", "Solve for the remaining variable", "Plug back in to find the other variable"] },
    { name: "Elimination", color: "#60a5fa", when: "When coefficients are easy to align or already match", steps: ["Align equations vertically", "Multiply one or both equations to match a coefficient", "Add or subtract equations to cancel a variable", "Solve and plug back in"] },
    { name: "Desmos", color: "#fbbf24", when: "When algebra looks messy or you want to verify quickly", steps: ["Type both equations into Desmos", "Click the intersection point for exact coordinates", "Verify by plugging back into both equations"] },
  ];

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {methods.map((m, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className="flex-1 cursor-pointer rounded-lg px-3 py-2.5 text-center text-sm font-bold transition-all"
            style={{
              background: active === i ? `${m.color}15` : "transparent",
              borderColor: active === i ? `${m.color}44` : "var(--color-border-default)",
              color: active === i ? m.color : "var(--color-text-muted)",
              border: `1px solid ${active === i ? `${m.color}44` : "var(--color-border-default)"}`,
            }}
          >
            {m.name}
          </button>
        ))}
      </div>
      <div className="rounded-xl border bg-bg-base p-5" style={{ borderColor: `${methods[active].color}33` }}>
        <div className="mb-3 text-[13px] text-text-muted"><strong>Best when:</strong> {methods[active].when}</div>
        <div className="space-y-2">
          {methods[active].steps.map((s, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white" style={{ background: methods[active].color }}>{i + 1}</div>
              <div className="text-sm text-[#bcbcc8]">{s}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-[rgba(34,197,94,.2)] bg-[rgba(34,197,94,.07)] p-4 text-center">
          <div className="mb-1 text-sm font-bold text-[#22c55e]">One Solution</div>
          <div className="text-[13px] text-text-muted">Different slopes &rarr; lines intersect</div>
        </div>
        <div className="rounded-xl border border-[rgba(239,68,68,.2)] bg-[rgba(239,68,68,.07)] p-4 text-center">
          <div className="mb-1 text-sm font-bold text-[#ef4444]">No Solution</div>
          <div className="text-[13px] text-text-muted">Same slope, different intercepts &rarr; parallel</div>
        </div>
        <div className="rounded-xl border border-[rgba(96,165,250,.2)] bg-[rgba(96,165,250,.07)] p-4 text-center">
          <div className="mb-1 text-sm font-bold text-[#60a5fa]">Infinite Solutions</div>
          <div className="text-[13px] text-text-muted">Equations are multiples &rarr; same line</div>
        </div>
      </div>
    </div>
  );
}

/* ── Inequality Rules ── */
export function InequalityVisual() {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-[rgba(239,68,68,.3)] bg-[rgba(239,68,68,.07)] px-5 py-4 text-sm leading-[1.7]">
        <strong className="text-[#ef4444]">The One Rule That Changes Everything: </strong>
        When you multiply or divide by a <strong>NEGATIVE</strong> number, <strong>FLIP the inequality sign</strong>. This is the #1 most-tested inequality rule on the SAT. Everything else works exactly like equations.
      </div>
      <div className="overflow-hidden rounded-xl border border-border-default">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="border-b border-border-default bg-bg-surface px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">Type</th>
              <th className="border-b border-border-default bg-bg-surface px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">Notation</th>
              <th className="border-b border-border-default bg-bg-surface px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">Graph</th>
            </tr>
          </thead>
          <tbody>
            <tr><td className="border-b border-border-default px-4 py-3 font-semibold text-text-secondary">Strict (&lt; or &gt;)</td><td className="border-b border-border-default px-4 py-3 text-[#bcbcc8]">Not included</td><td className="border-b border-border-default px-4 py-3 text-[#bcbcc8]">Open circle / dashed line</td></tr>
            <tr><td className="border-b border-border-default px-4 py-3 font-semibold text-text-secondary">&le; or &ge;</td><td className="border-b border-border-default px-4 py-3 text-[#bcbcc8]">Included</td><td className="border-b border-border-default px-4 py-3 text-[#bcbcc8]">Closed circle / solid line</td></tr>
            <tr><td className="border-b border-border-default px-4 py-3 font-semibold text-text-secondary">&quot;and&quot;</td><td className="border-b border-border-default px-4 py-3 text-[#bcbcc8]">Intersection (both true)</td><td className="border-b border-border-default px-4 py-3 text-[#bcbcc8]">Narrower solution region</td></tr>
            <tr><td className="px-4 py-3 font-semibold text-text-secondary">&quot;or&quot;</td><td className="px-4 py-3 text-[#bcbcc8]">Union (either true)</td><td className="px-4 py-3 text-[#bcbcc8]">Wider solution region</td></tr>
          </tbody>
        </table>
      </div>
      <div className="rounded-xl border border-[rgba(96,165,250,.2)] bg-[rgba(96,165,250,.07)] px-5 py-4 text-sm leading-[1.7]">
        <strong style={{ color: "#60a5fa" }}>Desmos Power Move: </strong>
        Type any inequality directly (like <code className="rounded-md bg-[rgba(200,16,46,.1)] px-1.5 py-0.5 font-mono text-[12px]" style={{ color: ACCENT }}>y &gt; 2x + 1</code>) and Desmos automatically shades the solution region. For systems of inequalities, enter multiple -- the overlap is your answer.
      </div>
    </div>
  );
}

/* ── Trap Taxonomy ── */
export function TrapTaxonomyVisual() {
  const [expanded, setExpanded] = useState<number | null>(null);

  const traps = [
    { num: 1, name: "The Wrong Target", color: "#ef4444", desc: "Solved for x when they asked for 2x + 1.", example: 'Asked: "What is x + 4?" You solved: x = 6, picked 6. Answer: 10', fix: "Always underline exactly what the question asks for BEFORE solving." },
    { num: 2, name: "The Sign Flip", color: "#fbbf24", desc: "Forgot to flip the inequality sign when dividing by a negative.", example: "-3x > 12 \u2192 x < -4 (not x > -4)", fix: "Any time you multiply/divide by a negative, immediately flip the sign." },
    { num: 3, name: "The Distribution Ghost", color: "#60a5fa", desc: "Forgot to distribute to ALL terms inside parentheses.", example: "-2(3x - 5) = -6x + 10 (not -6x - 5)", fix: "Always distribute to every term. Watch negative signs especially." },
    { num: 4, name: "The Imposter Subject", color: "#a855f7", desc: "Used the wrong variable or solved for the wrong thing.", example: "System asks for y but you solved for x and stopped.", fix: "Circle what the question asks for and verify before selecting." },
    { num: 5, name: "The One-Case Trap", color: "#f87171", desc: "Only solved one branch of an absolute value equation.", example: "|x - 3| = 7 \u2192 x = 10 AND x = -4 (two answers)", fix: "Absolute value = k always produces TWO cases (when k > 0)." },
    { num: 6, name: "The Percent Spiral", color: ACCENT, desc: "Applied successive percentages to the original value.", example: "$100 + 10% - 10% \u2260 $100. It's $110 \u2192 $99.", fix: "Always apply each percent change to the NEW value, not the original." },
  ];

  return (
    <div className="space-y-2.5">
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
          <div className="flex items-center gap-3.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white" style={{ background: t.color }}>{t.num}</div>
            <div className="flex-1">
              <span className="text-[15px] font-bold" style={{ color: t.color }}>{t.name}</span>
              <span className="ml-2 text-[11px] text-text-muted">{expanded === i ? "\u25B2" : "\u25BC"}</span>
              <div className="mt-0.5 text-[13px] leading-[1.5] text-text-muted">{t.desc}</div>
            </div>
          </div>
          {expanded === i && (
            <div className="mt-3 space-y-2">
              <div className="rounded-lg px-4 py-3 text-sm leading-[1.7]" style={{ background: `${t.color}08`, borderLeft: `3px solid ${t.color}` }}>
                <strong style={{ color: t.color }}>Example: </strong>
                <span className="text-[#bcbcc8]">{t.example}</span>
              </div>
              <div className="rounded-lg bg-[rgba(34,197,94,.07)] px-4 py-3 text-sm leading-[1.7]" style={{ borderLeft: "3px solid #22c55e" }}>
                <strong className="text-[#22c55e]">Fix: </strong>
                <span className="text-[#bcbcc8]">{t.fix}</span>
              </div>
            </div>
          )}
        </button>
      ))}
    </div>
  );
}

/* ── Word Problem Translation Table ── */
export function WordProblemVisual() {
  const translations = [
    { word: '"is"', symbol: "=", color: "#34d399" },
    { word: '"more than" / "increased by"', symbol: "+", color: "#60a5fa" },
    { word: '"less than" / "decreased by"', symbol: "\u2212", color: "#ef4444" },
    { word: '"per" / "each" / "every"', symbol: "\u00d7 (rate)", color: "#fbbf24" },
    { word: '"of" (as in "30% of")', symbol: "\u00d7", color: "#a855f7" },
    { word: '"total" / "sum"', symbol: "+", color: "#60a5fa" },
    { word: '"difference"', symbol: "\u2212", color: "#ef4444" },
    { word: '"quotient" / "ratio"', symbol: "\u00f7", color: "#f97316" },
    { word: '"twice" / "double"', symbol: "\u00d72", color: "#fbbf24" },
    { word: '"half of"', symbol: "\u00f72", color: "#f97316" },
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
            {translations.map((t, i) => (
              <tr key={i}>
                <td className="border-b border-border-default px-4 py-2.5 text-[#bcbcc8] last:border-b-0">{t.word}</td>
                <td className="border-b border-border-default px-4 py-2.5 text-center last:border-b-0">
                  <span className="font-mono text-lg font-bold" style={{ color: t.color }}>{t.symbol}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="rounded-xl border border-[rgba(200,16,46,.2)] bg-[rgba(200,16,46,.07)] px-5 py-4 text-sm leading-[1.7]">
        <strong style={{ color: ACCENT }}>Context Pattern: </strong>
        In <code className="rounded-md bg-[rgba(200,16,46,.1)] px-2 py-0.5 font-mono text-[13px]" style={{ color: ACCENT }}>C = 50 + 0.15m</code>, the 50 is the <strong>flat fee</strong> (y-intercept) and 0.15 is the <strong>per-mile rate</strong> (slope). The SAT loves swapping these to trap you.
      </div>
    </div>
  );
}
