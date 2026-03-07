"use client";

import { useState } from "react";
import { renderMath } from "@/lib/katex-render";

const ACCENT = "#d4a017";
const ADVANCED = "#a78bfa";

/* ── Slide 1: Three Quadratic Forms ── */
export function QuadraticFormsVisual() {
  const [activeForm, setActiveForm] = useState<number | null>(null);

  const forms = [
    {
      name: "Standard Form",
      eq: "$f(x) = ax^2 + bx + c$",
      color: ADVANCED,
      reveals: "y-intercept (c), direction (a > 0 opens up)",
      details: "The y-intercept is simply $c$ (the constant term)\n$a > 0$: parabola opens upward (min at vertex)\n$a < 0$: parabola opens downward (max at vertex)\nUse discriminant $b^2 - 4ac$ to count solutions",
    },
    {
      name: "Factored Form",
      eq: "$f(x) = a(x - r)(x - s)$",
      color: "#34d399",
      reveals: "x-intercepts (zeros/roots: r and s)",
      details: "Set each factor $= 0$ to find zeros\nThe zeros (roots) are $x = r$ and $x = s$\nThe axis of symmetry is $x = \\frac{r + s}{2}$\nBest for finding where the graph crosses the x-axis",
    },
    {
      name: "Vertex Form",
      eq: "$f(x) = a(x - h)^2 + k$",
      color: "#fbbf24",
      reveals: "vertex $(h, k)$ — the min or max point",
      details: "Vertex is at $(h, k)$ — watch the sign!\n$f(x) = a(x - 3)^2 + 2$ has vertex at $(3, 2)$\n$a > 0$: $k$ is the minimum value\n$a < 0$: $k$ is the maximum value\nBest for optimization and max/min questions",
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
            <div className="mt-2 font-mono text-[15px] text-text-primary">{renderMath(f.eq)}</div>
            <div className="mt-2 text-xs leading-[1.5] text-text-muted">Reveals: <strong>{renderMath(f.reveals)}</strong></div>
            <div className="mt-2 text-[10px] font-semibold uppercase tracking-[1.5px] opacity-70" style={{ color: f.color }}>
              {activeForm === i ? "tap to close" : "tap for details"}
            </div>
          </button>
        ))}
      </div>
      {activeForm !== null && (
        <div className="rounded-xl border p-4 text-sm leading-[1.7]" style={{ borderColor: `${forms[activeForm].color}33`, background: `${forms[activeForm].color}08` }}>
          <div className="whitespace-pre-line text-[#bcbcc8]">{renderMath(forms[activeForm].details)}</div>
        </div>
      )}

      <div className="rounded-xl border border-[rgba(167,139,250,.2)] bg-[rgba(167,139,250,.07)] px-5 py-4 text-sm leading-[1.7]">
        <strong style={{ color: ADVANCED }}>Quadratics are the single most tested topic in Advanced Math. </strong>
        If you learn nothing else in this module, learn these three forms and when to use each one. That single skill can be worth 40-60 points.
      </div>
    </div>
  );
}

/* ── Slide 2: Discriminant ── */
export function DiscriminantVisual() {
  const [a, setA] = useState("1");
  const [b, setB] = useState("-6");
  const [c, setC] = useState("9");

  const aVal = parseFloat(a), bVal = parseFloat(b), cVal = parseFloat(c);
  let disc: number | null = null;
  let info: { count: string; color: string; desc: string } | null = null;

  if (!isNaN(aVal) && !isNaN(bVal) && !isNaN(cVal) && aVal !== 0) {
    disc = bVal * bVal - 4 * aVal * cVal;
    if (disc > 0) info = { count: "Two distinct real solutions", color: "#22c55e", desc: "The parabola crosses the x-axis twice." };
    else if (disc === 0) info = { count: "Exactly one real solution", color: "#fbbf24", desc: "The parabola touches the x-axis at its vertex." };
    else info = { count: "No real solutions", color: "#ef4444", desc: "The parabola doesn't cross the x-axis." };
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-[rgba(167,139,250,.25)] bg-bg-base p-5 text-center">
        <div className="mb-1 text-[13px] text-text-muted">The Quadratic Formula</div>
        <div className="text-lg font-bold" style={{ color: ADVANCED }}>
          {renderMath("$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$")}
        </div>
        <div className="mt-2 text-[13px] text-text-muted">
          The expression under the radical — {renderMath("$b^2 - 4ac$")} — is the <strong>discriminant</strong>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "$b^2 - 4ac > 0$", count: "2 solutions", color: "#22c55e", desc: "Crosses x-axis twice" },
          { label: "$b^2 - 4ac = 0$", count: "1 solution", color: "#fbbf24", desc: "Touches x-axis once" },
          { label: "$b^2 - 4ac < 0$", count: "0 solutions", color: "#ef4444", desc: "Never crosses x-axis" },
        ].map((item, i) => (
          <div key={i} className="rounded-xl border bg-bg-base p-3.5 text-center" style={{ borderColor: `${item.color}33` }}>
            <span className="text-xs" style={{ color: item.color }}>{renderMath(item.label)}</span>
            <div className="mt-1 text-sm font-bold" style={{ color: item.color }}>{item.count}</div>
            <div className="mt-1 text-[11px] text-text-muted">{item.desc}</div>
          </div>
        ))}
      </div>

      {/* Interactive calculator */}
      <div className="rounded-2xl border border-[rgba(167,139,250,.2)] bg-bg-base p-5 shadow-[0_0_24px_rgba(167,139,250,.06)]">
        <div className="mb-3 text-[10px] font-bold uppercase tracking-[2px] text-text-muted">Discriminant Calculator</div>
        <div className="mb-4 flex items-center justify-center gap-3">
          <label className="flex items-center gap-1.5 text-sm font-bold text-text-secondary">
            a=
            <input type="number" value={a} onChange={e => setA(e.target.value)}
              className="w-14 rounded-lg border border-border-default bg-bg-surface p-1.5 text-center font-mono text-text-primary focus:border-[rgba(167,139,250,.5)]" />
          </label>
          <label className="flex items-center gap-1.5 text-sm font-bold text-text-secondary">
            b=
            <input type="number" value={b} onChange={e => setB(e.target.value)}
              className="w-14 rounded-lg border border-border-default bg-bg-surface p-1.5 text-center font-mono text-text-primary focus:border-[rgba(167,139,250,.5)]" />
          </label>
          <label className="flex items-center gap-1.5 text-sm font-bold text-text-secondary">
            c=
            <input type="number" value={c} onChange={e => setC(e.target.value)}
              className="w-14 rounded-lg border border-border-default bg-bg-surface p-1.5 text-center font-mono text-text-primary focus:border-[rgba(167,139,250,.5)]" />
          </label>
        </div>
        {disc !== null && info && (
          <div className="rounded-xl p-4 text-center" style={{ background: `${info.color}08` }}>
            <div className="text-xs text-text-muted">{renderMath(`$b^2 - 4ac = (${bVal})^2 - 4(${aVal})(${cVal})$`)}</div>
            <div className="mt-1 font-mono text-2xl font-bold" style={{ color: info.color }}>{disc}</div>
            <div className="mt-1 text-sm font-bold" style={{ color: info.color }}>{info.count}</div>
            <div className="mt-0.5 text-xs text-text-muted">{info.desc}</div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Slide 3: Factoring Techniques ── */
export function FactoringVisual() {
  const [flipped, setFlipped] = useState<Record<number, boolean>>({});

  const techniques = [
    { name: "GCF", color: "#22c55e", front: "Factor out the greatest common factor first", example: "$3x^2 + 6x = 3x(x + 2)$", tip: "Always check for GCF first — it simplifies everything that follows." },
    { name: "Difference of Squares", color: "#60a5fa", front: "$a^2 - b^2 = (a + b)(a - b)$", example: "$x^2 - 25 = (x + 5)(x - 5)$", tip: "Only works for subtraction. $x^2 + 25$ cannot be factored." },
    { name: "Perfect Square", color: ADVANCED, front: "$a^2 \\pm 2ab + b^2 = (a \\pm b)^2$", example: "$x^2 - 10x + 25 = (x - 5)^2$", tip: "Check: is the last term a perfect square? Is the middle term $2ab$?" },
    { name: "Trinomial (a=1)", color: "#fbbf24", front: "Find two numbers that multiply to $c$ and add to $b$", example: "$x^2 + 7x + 12 = (x + 3)(x + 4)$", tip: "Product $= c$, Sum $= b$. List factor pairs of $c$ systematically." },
    { name: "GCF + Other", color: "#f87171", front: "Factor out GCF first, then apply another technique", example: "$2x^2 - 8 = 2(x^2 - 4) = 2(x+2)(x-2)$", tip: "Multi-step: GCF reveals a pattern (here, difference of squares)." },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-3">
        {techniques.map((t, i) => (
          <button
            key={i}
            onClick={() => setFlipped(prev => ({ ...prev, [i]: !prev[i] }))}
            className="cursor-pointer rounded-xl border bg-bg-base p-4 text-left transition-all duration-300 hover:-translate-y-0.5"
            style={{ borderColor: flipped[i] ? `${t.color}44` : "var(--color-border-default)" }}
          >
            {!flipped[i] ? (
              <>
                <div className="text-sm font-bold" style={{ color: t.color }}>{t.name}</div>
                <div className="mt-1.5 text-[13px] leading-[1.5] text-text-muted">{renderMath(t.front)}</div>
                <div className="mt-2 text-right text-[10px] font-semibold uppercase tracking-[1.5px] opacity-70" style={{ color: t.color }}>tap for example</div>
              </>
            ) : (
              <>
                <div className="block rounded-md bg-bg-surface px-2 py-1 text-[13px]" style={{ color: t.color }}>{renderMath(t.example)}</div>
                <div className="mt-2 text-xs leading-[1.5] text-text-muted">{renderMath(t.tip)}</div>
                <div className="mt-2 text-right text-[10px] font-semibold uppercase tracking-[1.5px] opacity-70" style={{ color: t.color }}>tap to flip back</div>
              </>
            )}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-[rgba(212,160,23,.2)] bg-[rgba(212,160,23,.07)] px-5 py-4 text-sm leading-[1.7]">
        <strong style={{ color: ACCENT }}>Factoring Decision Tree: </strong>
        1) Is there a GCF? Factor it out. 2) Two terms? Check for difference of squares. 3) Three terms? Try trinomial factoring or perfect square. Always check by multiplying back.
      </div>
    </div>
  );
}

/* ── Slide 4: Exponent Rules ── */
export function ExponentRulesVisual() {
  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-xl border border-border-default">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="border-b border-border-default bg-bg-surface px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">Rule</th>
              <th className="border-b border-border-default bg-bg-surface px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">Formula</th>
              <th className="border-b border-border-default bg-bg-surface px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">Example</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Product Rule", "$x^a \\cdot x^b = x^{a+b}$", "$x^3 \\cdot x^5 = x^8$"],
              ["Quotient Rule", "$\\frac{x^a}{x^b} = x^{a-b}$", "$\\frac{x^8}{x^3} = x^5$"],
              ["Power Rule", "$(x^a)^b = x^{ab}$", "$(x^2)^3 = x^6$"],
              ["Zero Exponent", "$x^0 = 1$", "$5^0 = 1$"],
              ["Negative Exponent", "$x^{-n} = \\frac{1}{x^n}$", "$x^{-3} = \\frac{1}{x^3}$"],
              ["Fractional Exponent", "$x^{m/n} = \\sqrt[n]{x^m}$", "$8^{2/3} = (\\sqrt[3]{8})^2 = 4$"],
              ["Product to Power", "$(xy)^n = x^n y^n$", "$(2x)^3 = 8x^3$"],
            ].map(([rule, formula, example], i) => (
              <tr key={i}>
                <td className="border-b border-border-default px-4 py-3 font-semibold text-text-secondary last:border-b-0">{rule}</td>
                <td className="border-b border-border-default px-4 py-3 last:border-b-0">
                  <span className="text-[13px]" style={{ color: ADVANCED }}>{renderMath(formula)}</span>
                </td>
                <td className="border-b border-border-default px-4 py-3 text-[#bcbcc8] last:border-b-0">{renderMath(example)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-xl border border-[rgba(167,139,250,.2)] bg-[rgba(167,139,250,.07)] px-5 py-4 text-sm leading-[1.7]">
        <strong style={{ color: ADVANCED }}>Key Pattern: </strong>
        Multiply bases &rarr; <strong>add</strong> exponents. Divide bases &rarr; <strong>subtract</strong> exponents. Raise to a power &rarr; <strong>multiply</strong> exponents. Memorize these cold.
      </div>
    </div>
  );
}

/* ── Slide 5: Exponential Growth & Decay ── */
export function GrowthDecayVisual() {
  const [flipped, setFlipped] = useState<Record<number, boolean>>({});

  const types = [
    { label: "Linear Growth", color: "#34d399", eq: "$y = mx + b$", sign: "Constant amount added", example: "A taxi charges $3 base + $2.50/mile", key: "Graph: straight line going up" },
    { label: "Linear Decay", color: "#60a5fa", eq: "$y = mx + b$ ($m < 0$)", sign: "Constant amount subtracted", example: "A car loses $2,000/year", key: "Graph: straight line going down" },
    { label: "Exponential Growth", color: "#fbbf24", eq: "$y = a(b)^t$, $b > 1$", sign: "Constant percent multiplied", example: "Population doubles every 5 years: $P = 500(2)^{t/5}$", key: "Graph: curves upward faster and faster" },
    { label: "Exponential Decay", color: "#ef4444", eq: "$y = a(b)^t$, $0 < b < 1$", sign: "Constant percent reduced", example: "Radioactive half-life: $A = 100(0.5)^{t/10}$", key: "Graph: curves down, approaches zero" },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {types.map((t, i) => (
          <button
            key={i}
            onClick={() => setFlipped(prev => ({ ...prev, [i]: !prev[i] }))}
            className="cursor-pointer rounded-xl border bg-bg-base p-[18px] text-left transition-all duration-300 hover:-translate-y-0.5"
            style={{ borderColor: flipped[i] ? `${t.color}33` : "var(--color-border-default)" }}
          >
            {!flipped[i] ? (
              <>
                <div className="mb-2 text-sm font-bold" style={{ color: t.color }}>{t.label}</div>
                <div className="block rounded-md bg-bg-surface px-2 py-1 text-[13px]" style={{ color: t.color }}>{renderMath(t.eq)}</div>
                <div className="mt-2 text-[13px] text-text-muted">{t.sign}</div>
                <div className="mt-2 text-right text-[10px] font-semibold uppercase tracking-[1.5px] opacity-70" style={{ color: t.color }}>tap for example</div>
              </>
            ) : (
              <>
                <div className="text-sm leading-[1.7] text-[#bcbcc8]">{renderMath(t.example)}</div>
                <div className="mt-2 text-xs text-text-muted">{t.key}</div>
                <div className="mt-2 text-right text-[10px] font-semibold uppercase tracking-[1.5px] opacity-70" style={{ color: t.color }}>tap to flip back</div>
              </>
            )}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-[rgba(212,160,23,.2)] bg-[rgba(212,160,23,.07)] px-5 py-4 text-sm leading-[1.7]">
        <strong style={{ color: ACCENT }}>The Quick Test: </strong>
        <strong>Linear</strong> = constant amount of change each period. <strong>Exponential</strong> = constant <em>percent</em> of change each period. If the base is &gt; 1, it&apos;s growth. If 0 &lt; base &lt; 1, it&apos;s decay.
      </div>
    </div>
  );
}

/* ── Slide 6: Function Transformations ── */
export function TransformationsVisual() {
  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-xl border border-border-default">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="border-b border-border-default bg-bg-surface px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">Transformation</th>
              <th className="border-b border-border-default bg-bg-surface px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">Notation</th>
              <th className="border-b border-border-default bg-bg-surface px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">Effect</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Shift up", "$f(x) + k$", "Every point moves up $k$ units"],
              ["Shift down", "$f(x) - k$", "Every point moves down $k$ units"],
              ["Shift right", "$f(x - h)$", "Every point moves RIGHT $h$ units"],
              ["Shift left", "$f(x + h)$", "Every point moves LEFT $h$ units"],
              ["Vertical stretch", "$a \\cdot f(x)$, $|a| > 1$", "Graph stretches vertically"],
              ["Vertical compress", "$a \\cdot f(x)$, $0 < |a| < 1$", "Graph compresses vertically"],
              ["Reflect over x-axis", "$-f(x)$", "Graph flips upside down"],
            ].map(([transform, notation, effect], i) => (
              <tr key={i}>
                <td className="border-b border-border-default px-4 py-3 font-semibold text-text-secondary last:border-b-0">{transform}</td>
                <td className="border-b border-border-default px-4 py-3 last:border-b-0">
                  <span className="text-[13px]" style={{ color: ADVANCED }}>{renderMath(notation)}</span>
                </td>
                <td className="border-b border-border-default px-4 py-3 text-[#bcbcc8] last:border-b-0">{renderMath(effect)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-xl border border-[rgba(239,68,68,.2)] bg-[rgba(239,68,68,.07)] px-5 py-4 text-sm leading-[1.7]">
        <strong className="text-[#ef4444]">Common Trap: </strong>
        {renderMath("$f(x - 3)$")} shifts <strong>RIGHT</strong>, not left. The horizontal direction is always the opposite of the sign. Remember: &quot;minus goes right.&quot;
      </div>
    </div>
  );
}
