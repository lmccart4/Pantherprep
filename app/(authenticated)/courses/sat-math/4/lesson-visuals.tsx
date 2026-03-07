"use client";

import { useState } from "react";
import { renderMath } from "@/lib/katex-render";

const ACCENT = "#C8102E";

/* ── Domain & Range Machine ── */
export function DomainRangeVisual() {
  const restrictions = [
    { type: "Fractions", rule: "Denominator \u2260 0", example: "$f(x) = \\frac{1}{x-3}$ \u2192 $x \\neq 3$", color: "#ef4444" },
    { type: "Square Roots", rule: "Radicand \u2265 0", example: "$f(x) = \\sqrt{x-5}$ \u2192 $x \\geq 5$", color: "#fbbf24" },
    { type: "Context", rule: "Physical limits", example: "Time $t \\geq 0$, quantity $n \\geq 0$", color: "#34d399" },
  ];

  return (
    <div className="space-y-4">
      {/* Machine diagram */}
      <div className="flex items-center justify-center gap-3">
        <div className="rounded-xl border border-[rgba(96,165,250,.3)] bg-[rgba(96,165,250,.08)] px-5 py-4 text-center">
          <div className="text-[11px] font-bold uppercase tracking-[1.5px] text-[#60a5fa]">Input (Domain)</div>
          <div className="mt-1 font-mono text-2xl font-bold text-[#60a5fa]">x</div>
        </div>
        <div className="font-mono text-xl font-bold text-text-muted">&rarr; f &rarr;</div>
        <div className="rounded-xl border border-[rgba(200,16,46,.3)] bg-[rgba(200,16,46,.08)] px-5 py-4 text-center">
          <div className="text-[11px] font-bold uppercase tracking-[1.5px]" style={{ color: ACCENT }}>Output (Range)</div>
          <div className="mt-1 font-mono text-2xl font-bold" style={{ color: ACCENT }}>f(x)</div>
        </div>
      </div>

      {/* Domain restrictions */}
      <div className="space-y-2">
        {restrictions.map((r, i) => (
          <div
            key={i}
            className="rounded-xl border bg-bg-base p-4"
            style={{ borderColor: `${r.color}33` }}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white" style={{ background: r.color }}>
                {i + 1}
              </div>
              <div className="flex-1">
                <div className="text-[15px] font-bold" style={{ color: r.color }}>{r.type}: <span className="text-text-primary">{r.rule}</span></div>
                <div className="mt-0.5 font-mono text-[13px] text-text-muted">{renderMath(r.example)}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Transformations Table ── */
export function TransformationsVisual() {
  const transforms = [
    { transform: "Shift UP k", equation: "f(x) + k", effect: "\u2191 Moves graph UP", color: "#22c55e" },
    { transform: "Shift DOWN k", equation: "f(x) \u2212 k", effect: "\u2193 Moves graph DOWN", color: "#ef4444" },
    { transform: "Shift RIGHT h", equation: "f(x \u2212 h)", effect: "\u2192 Moves graph RIGHT", color: "#60a5fa" },
    { transform: "Shift LEFT h", equation: "f(x + h)", effect: "\u2190 Moves graph LEFT", color: "#a855f7" },
    { transform: "Vertical stretch", equation: "$a \\cdot f(x)$, a > 1", effect: "\u2195 Steeper / taller", color: "#fbbf24" },
    { transform: "Vertical compress", equation: "$a \\cdot f(x)$, 0 < a < 1", effect: "\u2194 Flatter / shorter", color: "#f97316" },
    { transform: "Reflect over x-axis", equation: "\u2212f(x)", effect: "\u21C5 Flips upside down", color: "#ec4899" },
    { transform: "Reflect over y-axis", equation: "f(\u2212x)", effect: "\u21C4 Flips left-right", color: "#06b6d4" },
  ];

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-xl border border-border-default">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="border-b border-border-default bg-bg-surface px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">Transformation</th>
              <th className="border-b border-border-default bg-bg-surface px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">Equation</th>
              <th className="border-b border-border-default bg-bg-surface px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">Graph Effect</th>
            </tr>
          </thead>
          <tbody>
            {transforms.map((t, i) => (
              <tr key={i}>
                <td className="whitespace-nowrap border-b border-border-default px-4 py-3 font-semibold text-text-secondary last:border-b-0">{t.transform}</td>
                <td className="border-b border-border-default px-4 py-3 last:border-b-0">
                  <code className="rounded-md bg-[rgba(200,16,46,.1)] px-2 py-0.5 font-mono text-[13px]" style={{ color: ACCENT }}>{renderMath(t.equation)}</code>
                </td>
                <td className="border-b border-border-default px-4 py-3 last:border-b-0" style={{ color: t.color }}>{t.effect}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="rounded-xl border border-[rgba(200,16,46,.2)] bg-[rgba(200,16,46,.07)] px-5 py-4 text-sm leading-[1.7]">
        <strong style={{ color: ACCENT }}>The #1 Trap: </strong>
        Horizontal transformations work <em>backward</em>. <code className="rounded-md bg-[rgba(200,16,46,.1)] px-2 py-0.5 font-mono text-[13px]" style={{ color: ACCENT }}>f(x &minus; 3)</code> shifts <strong>RIGHT</strong> 3, not left. The input needs to be 3 bigger to get the same output.
      </div>
    </div>
  );
}

/* ── Composition Pipeline ── */
export function CompositionVisual() {
  const [input, setInput] = useState(2);
  // f(x) = x² and g(x) = x + 3
  const gResult = input + 3;
  const fgResult = gResult * gResult;
  const fResult = input * input;
  const gfResult = fResult + 3;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-text-muted">Input x =</label>
        <input
          type="number"
          value={input}
          onChange={(e) => setInput(Number(e.target.value) || 0)}
          className="w-16 rounded-lg border border-border-default bg-bg-surface px-3 py-1.5 text-center font-mono text-sm text-text-primary"
        />
      </div>

      {/* f(g(x)) pipeline */}
      <div className="rounded-xl border border-[rgba(168,85,247,.25)] bg-[rgba(168,85,247,.05)] p-4">
        <div className="mb-2 text-sm font-bold text-[#a855f7]">f(g(x)) — where f(x) = x&sup2;, g(x) = x + 3</div>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <div className="rounded-lg bg-[rgba(96,165,250,.15)] px-3 py-1.5 font-mono text-[#60a5fa]">x = {input}</div>
          <span className="text-text-muted">&rarr; g &rarr;</span>
          <div className="rounded-lg bg-[rgba(251,191,36,.15)] px-3 py-1.5 font-mono text-[#fbbf24]">{input} + 3 = {gResult}</div>
          <span className="text-text-muted">&rarr; f &rarr;</span>
          <div className="rounded-lg bg-[rgba(168,85,247,.15)] px-3 py-1.5 font-mono text-[#a855f7]">{gResult}&sup2; = {fgResult}</div>
        </div>
      </div>

      {/* g(f(x)) pipeline */}
      <div className="rounded-xl border border-[rgba(34,197,94,.25)] bg-[rgba(34,197,94,.05)] p-4">
        <div className="mb-2 text-sm font-bold text-[#22c55e]">g(f(x)) — order swapped</div>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <div className="rounded-lg bg-[rgba(96,165,250,.15)] px-3 py-1.5 font-mono text-[#60a5fa]">x = {input}</div>
          <span className="text-text-muted">&rarr; f &rarr;</span>
          <div className="rounded-lg bg-[rgba(251,191,36,.15)] px-3 py-1.5 font-mono text-[#fbbf24]">{input}&sup2; = {fResult}</div>
          <span className="text-text-muted">&rarr; g &rarr;</span>
          <div className="rounded-lg bg-[rgba(34,197,94,.15)] px-3 py-1.5 font-mono text-[#22c55e]">{fResult} + 3 = {gfResult}</div>
        </div>
      </div>

      {fgResult !== gfResult && (
        <div className="rounded-xl border border-[rgba(239,68,68,.2)] bg-[rgba(239,68,68,.07)] px-5 py-4 text-sm leading-[1.7]">
          <strong style={{ color: "#ef4444" }}>Order matters! </strong>
          f(g({input})) = {fgResult} but g(f({input})) = {gfResult}. They&apos;re different!
        </div>
      )}
    </div>
  );
}

/* ── Nonlinear Systems ── */
export function NonlinearSystemsVisual() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-[rgba(34,197,94,.25)] bg-[rgba(34,197,94,.07)] p-4 text-center">
          <div className="mb-2 font-mono text-3xl font-bold text-[#22c55e]">2</div>
          <div className="text-sm font-bold text-[#22c55e]">Intersections</div>
          <div className="mt-1 text-[12px] text-text-muted">Line crosses parabola at two points</div>
        </div>
        <div className="rounded-xl border border-[rgba(251,191,36,.25)] bg-[rgba(251,191,36,.07)] p-4 text-center">
          <div className="mb-2 font-mono text-3xl font-bold text-[#fbbf24]">1</div>
          <div className="text-sm font-bold text-[#fbbf24]">Tangent</div>
          <div className="mt-1 text-[12px] text-text-muted">Line just touches the parabola</div>
        </div>
        <div className="rounded-xl border border-[rgba(239,68,68,.25)] bg-[rgba(239,68,68,.07)] p-4 text-center">
          <div className="mb-2 font-mono text-3xl font-bold text-[#ef4444]">0</div>
          <div className="text-sm font-bold text-[#ef4444]">No Contact</div>
          <div className="mt-1 text-[12px] text-text-muted">Line misses the parabola entirely</div>
        </div>
      </div>
      <div className="rounded-xl border border-[rgba(200,16,46,.2)] bg-[rgba(200,16,46,.07)] px-5 py-4 text-sm leading-[1.7]">
        <strong style={{ color: ACCENT }}>Key insight: </strong>
        Set equations equal, rearrange to standard form, then the <strong>discriminant</strong> tells you how many intersections:
        {renderMath("$b^2 - 4ac$")}
        &gt; 0 = two, = 0 = one, &lt; 0 = none.
      </div>
    </div>
  );
}

/* ── Trap Taxonomy ── */
export function TrapTaxonomyVisual() {
  const [expanded, setExpanded] = useState<number | null>(null);

  const traps = [
    { name: "Horizontal Flip", color: "#ef4444", desc: "Confused the direction of a horizontal transformation", example: "f(x \u2212 3) shifts RIGHT 3, not left. f(x + 3) shifts LEFT 3.", fix: "Remember: horizontal shifts are OPPOSITE to the sign inside the parentheses." },
    { name: "Wrong Target", color: "#fbbf24", desc: "Solved for x when they asked for f(x), or vice versa", example: "Asked \"What is f(3)?\" You found x = 3, picked 3. Answer: f(3) = 7.", fix: "Always underline exactly what the question asks for before solving." },
    { name: "Imposter Domain", color: "#a855f7", desc: "Forgot a domain restriction", example: "f(x) = 1/(x\u22123): domain is all reals except x = 3, not all reals.", fix: "Check for denominators = 0 and negative square roots." },
    { name: "Composition Swap", color: "#06b6d4", desc: "Evaluated f(g(x)) as g(f(x)) or the reverse", example: "f(g(2)) \u2260 g(f(2)) in general. Check which function is inside.", fix: "Always work inside-out. Identify the inner function first." },
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
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white" style={{ background: t.color }}>{i + 1}</div>
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
              <div className="rounded-lg bg-[rgba(34,197,94,.08)] px-4 py-3 text-sm leading-[1.7]" style={{ borderLeft: "3px solid #22c55e" }}>
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
