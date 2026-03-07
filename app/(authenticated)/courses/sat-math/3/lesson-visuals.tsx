"use client";

import { useState } from "react";
import { renderMath } from "@/lib/katex-render";

const ACCENT = "#C8102E";

/* ── Three Quadratic Forms ── */
export function QuadraticFormsVisual() {
  const [flipped, setFlipped] = useState<Record<number, boolean>>({});

  const forms = [
    { name: "Standard Form", eq: "$f(x) = ax^2 + bx + c$", color: "#a855f7", reveals: "y-intercept (c), direction (a > 0 opens up)", details: "Use when: finding the y-intercept, using the quadratic formula, or computing the discriminant. The y-intercept is simply c. Direction is determined by the sign of a." },
    { name: "Factored Form", eq: "$f(x) = a(x - r)(x - s)$", color: "#34d399", reveals: "x-intercepts / zeros (r and s)", details: "Use when: finding x-intercepts (roots/zeros), or building an equation from given zeros. Set f(x) = 0, and the solutions are x = r and x = s." },
    { name: "Vertex Form", eq: "$f(x) = a(x - h)^2 + k$", color: "#fbbf24", reveals: "vertex (h, k) = min or max point", details: "Use when: finding the minimum/maximum value, or when given the vertex. The vertex is (h, k). If a > 0, k is the minimum. If a < 0, k is the maximum." },
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
                <div className="mb-2 font-mono text-base font-bold text-text-primary">{renderMath(f.eq)}</div>
                <div className="text-[13px] leading-[1.5] text-text-muted">{f.reveals}</div>
                <div className="mt-2 text-right text-[10px] font-medium opacity-70" style={{ color: f.color }}>tap for details &rarr;</div>
              </>
            ) : (
              <>
                <div className="text-sm leading-[1.7] text-[#bcbcc8]">{f.details}</div>
                <div className="mt-2 text-right text-[10px] font-medium opacity-70" style={{ color: f.color }}>&larr; tap to flip back</div>
              </>
            )}
          </button>
        ))}
      </div>
      <div className="rounded-xl border border-[rgba(200,16,46,.2)] bg-[rgba(200,16,46,.07)] px-5 py-4 text-sm leading-[1.7]">
        <strong style={{ color: ACCENT }}>Quadratics are the most tested topic in Advanced Math. </strong>
        If you learn nothing else in this module, learn these three forms and when to use each one. That single skill can be worth 40--60 points.
      </div>
    </div>
  );
}

/* ── Discriminant Guide ── */
export function DiscriminantVisual() {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-[rgba(200,16,46,.2)] bg-bg-base p-5">
        <div className="mb-3 text-center font-mono text-xl font-bold text-text-primary">
          <span style={{ color: ACCENT }}>b&sup2; &minus; 4ac</span>
        </div>
        <div className="text-center text-sm text-text-muted">The Discriminant -- from the Quadratic Formula</div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-[rgba(34,197,94,.25)] bg-[rgba(34,197,94,.07)] p-4 text-center">
          <div className="mb-2 font-mono text-2xl font-bold text-[#22c55e]">&gt; 0</div>
          <div className="text-sm font-bold text-[#22c55e]">Two Solutions</div>
          <div className="mt-1 text-[12px] text-text-muted">Parabola crosses x-axis twice</div>
        </div>
        <div className="rounded-xl border border-[rgba(251,191,36,.25)] bg-[rgba(251,191,36,.07)] p-4 text-center">
          <div className="mb-2 font-mono text-2xl font-bold text-[#fbbf24]">= 0</div>
          <div className="text-sm font-bold text-[#fbbf24]">One Solution</div>
          <div className="mt-1 text-[12px] text-text-muted">Parabola touches x-axis at vertex</div>
        </div>
        <div className="rounded-xl border border-[rgba(239,68,68,.25)] bg-[rgba(239,68,68,.07)] p-4 text-center">
          <div className="mb-2 font-mono text-2xl font-bold text-[#ef4444]">&lt; 0</div>
          <div className="text-sm font-bold text-[#ef4444]">No Solutions</div>
          <div className="mt-1 text-[12px] text-text-muted">Parabola doesn&apos;t cross x-axis</div>
        </div>
      </div>
      <div className="rounded-xl border border-[rgba(200,16,46,.2)] bg-[rgba(200,16,46,.07)] px-5 py-4 text-sm leading-[1.7]">
        <strong style={{ color: ACCENT }}>Vertex Shortcut: </strong>
        x = <code className="rounded-md bg-[rgba(200,16,46,.1)] px-2 py-0.5 font-mono text-[13px]" style={{ color: ACCENT }}>&minus;b / 2a</code>. Plug this back into f(x) for the min/max value. Much faster than completing the square.
      </div>
    </div>
  );
}

/* ── Five Factoring Techniques ── */
export function FactoringVisual() {
  const [expanded, setExpanded] = useState<number | null>(null);

  const techniques = [
    { name: "GCF", color: "#60a5fa", desc: "Factor out the greatest common factor first", example: "$6x^3 + 9x^2 = 3x^2(2x + 3)$" },
    { name: "Difference of Squares", color: "#a855f7", desc: "$a^2 - b^2 = (a + b)(a - b)$", example: "$x^2 - 49 = (x + 7)(x - 7)$" },
    { name: "Perfect Square Trinomial", color: "#34d399", desc: "$a^2 + 2ab + b^2 = (a + b)^2$", example: "$x^2 + 6x + 9 = (x + 3)^2$" },
    { name: "Standard Trinomial", color: "#fbbf24", desc: "Find two numbers that multiply to ac and add to b", example: "$x^2 + 5x + 6 = (x + 2)(x + 3)$" },
    { name: "Factor by Grouping", color: "#f87171", desc: "For 4-term polynomials, group pairs and factor each", example: "$x^3 + 3x^2 + 2x + 6 = (x^2 + 2)(x + 3)$" },
  ];

  return (
    <div className="space-y-2.5">
      {techniques.map((t, i) => (
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
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white" style={{ background: t.color }}>{i + 1}</div>
            <div className="flex-1">
              <span className="text-[15px] font-bold" style={{ color: t.color }}>{t.name}</span>
              <span className="ml-2 text-[11px] text-text-muted">{expanded === i ? "\u25B2" : "\u25BC"}</span>
              <div className="mt-0.5 text-[13px] leading-[1.5] text-text-muted">{renderMath(t.desc)}</div>
            </div>
          </div>
          {expanded === i && (
            <div className="mt-3 rounded-lg px-4 py-3 text-sm leading-[1.7]" style={{ background: `${t.color}08`, borderLeft: `3px solid ${t.color}` }}>
              <strong style={{ color: t.color }}>Example: </strong>
              <span className="font-mono text-[#bcbcc8]">{renderMath(t.example)}</span>
            </div>
          )}
        </button>
      ))}
    </div>
  );
}

/* ── Exponent Rules Table ── */
export function ExponentRulesVisual() {
  const rules = [
    { rule: "Product Rule", formula: "$a^m \\cdot a^n = a^{m+n}$", example: "$x^3 \\cdot x^4 = x^7$" },
    { rule: "Power Rule", formula: "$(a^m)^n = a^{mn}$", example: "$(x^2)^3 = x^6$" },
    { rule: "Quotient Rule", formula: "$a^m / a^n = a^{m-n}$", example: "$x^5 / x^2 = x^3$" },
    { rule: "Zero Exponent", formula: "$a^0 = 1$", example: "$7^0 = 1$" },
    { rule: "Negative Exponent", formula: "$a^{-n} = \\frac{1}{a^n}$", example: "$x^{-2} = \\frac{1}{x^2}$" },
    { rule: "Fractional Exponent", formula: "$a^{1/n} = \\sqrt[n]{a}$", example: "$8^{1/3} = \\sqrt[3]{8} = 2$" },
    { rule: "Combined Fractional", formula: "$a^{m/n} = (\\sqrt[n]{a})^m$", example: "$27^{2/3} = (\\sqrt[3]{27})^2 = 9$" },
  ];

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
            {rules.map((r, i) => (
              <tr key={i}>
                <td className="whitespace-nowrap border-b border-border-default px-4 py-3 font-semibold text-text-secondary last:border-b-0">{r.rule}</td>
                <td className="border-b border-border-default px-4 py-3 last:border-b-0">
                  <code className="rounded-md bg-[rgba(200,16,46,.1)] px-2 py-0.5 font-mono text-[13px]" style={{ color: ACCENT }}>{renderMath(r.formula)}</code>
                </td>
                <td className="border-b border-border-default px-4 py-3 text-[#bcbcc8] last:border-b-0">{renderMath(r.example)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="rounded-xl border border-[rgba(200,16,46,.2)] bg-[rgba(200,16,46,.07)] px-5 py-4 text-sm leading-[1.7]">
        <strong style={{ color: ACCENT }}>Memorize these cold. </strong>
        Exponent rules show up in almost every Advanced Math question on the SAT.
      </div>
    </div>
  );
}

/* ── Growth vs Decay ── */
export function GrowthDecayVisual() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-[rgba(34,197,94,.25)] bg-[rgba(34,197,94,.07)] p-5">
          <div className="mb-2 text-sm font-bold text-[#22c55e]">Exponential Growth</div>
          <div className="mb-2 font-mono text-base font-bold text-text-primary">f(x) = a(1 + r)<sup>x</sup></div>
          <div className="text-[13px] text-text-muted">Base &gt; 1 (multiplier grows)</div>
          <div className="mt-2 text-[13px] text-text-muted">Example: 500(1.08)<sup>t</sup> = 8% growth</div>
        </div>
        <div className="rounded-xl border border-[rgba(239,68,68,.25)] bg-[rgba(239,68,68,.07)] p-5">
          <div className="mb-2 text-sm font-bold text-[#ef4444]">Exponential Decay</div>
          <div className="mb-2 font-mono text-base font-bold text-text-primary">f(x) = a(1 &minus; r)<sup>x</sup></div>
          <div className="text-[13px] text-text-muted">0 &lt; Base &lt; 1 (multiplier shrinks)</div>
          <div className="mt-2 text-[13px] text-text-muted">Example: 1200(0.95)<sup>t</sup> = 5% decay</div>
        </div>
      </div>
      <div className="rounded-xl border border-[rgba(251,191,36,.2)] bg-[rgba(251,191,36,.07)] px-5 py-4 text-sm leading-[1.7]">
        <strong style={{ color: "#fbbf24" }}>Linear vs. Exponential: </strong>
        If a table shows values increasing by the <strong>same amount</strong> &rarr; linear. If values increase by the <strong>same multiplier</strong> &rarr; exponential. The SAT loves testing this distinction.
      </div>
    </div>
  );
}
