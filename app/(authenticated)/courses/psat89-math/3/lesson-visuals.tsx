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

/* ── Slide 1: Exponent Rules Table ── */
export function ExponentRulesVisual() {
  const rules = [
    { name: "Product Rule", formula: "$x^a \\cdot x^b = x^{a+b}$", example: "$x^3 \\cdot x^4 = x^7$", color: "#a78bfa" },
    { name: "Quotient Rule", formula: "$\\frac{x^a}{x^b} = x^{a-b}$", example: "$\\frac{x^8}{x^3} = x^5$", color: "#60a5fa" },
    { name: "Power Rule", formula: "$(x^a)^b = x^{ab}$", example: "$(x^2)^5 = x^{10}$", color: "#34d399" },
    { name: "Zero Rule", formula: "$x^0 = 1$", example: "$5^0 = 1,\\; 100^0 = 1$", color: "#fbbf24" },
    { name: "Negative Rule", formula: "$x^{-n} = \\frac{1}{x^n}$", example: "$2^{-3} = \\frac{1}{8}$", color: "#f87171" },
    { name: "Distribution", formula: "$(xy)^n = x^n \\cdot y^n$", example: "$(3x)^2 = 9x^2$", color: "#06b6d4" },
  ];

  const mistakes = [
    { wrong: "$x^2 \\cdot x^3 = x^6$", right: "$x^2 \\cdot x^3 = x^5$", rule: "Add exponents, don't multiply" },
    { wrong: "$(x^2)^3 = x^5$", right: "$(x^2)^3 = x^6$", rule: "Multiply exponents, don't add" },
    { wrong: "$x^2 + y^2 = (xy)^2$", right: "$x^2 + y^2$ stays as is", rule: "Can't combine different bases" },
    { wrong: "$3^{-2} = -9$", right: "$3^{-2} = \\frac{1}{9}$", rule: "Negative exponent != negative number" },
  ];

  const [showMistakes, setShowMistakes] = useState(false);

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
                <td className="whitespace-nowrap border-b border-border-default px-4 py-3 font-semibold last:border-b-0" style={{ color: r.color }}>{r.name}</td>
                <td className="border-b border-border-default px-4 py-3 text-[13px] text-text-primary last:border-b-0">{renderMath(r.formula)}</td>
                <td className="border-b border-border-default px-4 py-3 text-[13px] text-[#bcbcc8] last:border-b-0">{renderMath(r.example)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        onClick={() => setShowMistakes(!showMistakes)}
        className="w-full cursor-pointer rounded-xl border border-[rgba(239,68,68,.2)] bg-[rgba(239,68,68,.07)] px-5 py-4 text-left text-sm transition-all"
      >
        <strong className="text-[#ef4444]">Common Mistakes {showMistakes ? "(hide)" : "(tap to reveal)"}</strong>
        {showMistakes && (
          <div className="mt-3 space-y-2">
            {mistakes.map((m, i) => (
              <div key={i} className="flex items-start gap-3 rounded-lg bg-bg-base px-3 py-2">
                <span className="text-[13px] text-[#ef4444] line-through">{renderMath(m.wrong)}</span>
                <span className="text-text-muted">&rarr;</span>
                <span className="text-[13px] text-[#22c55e]">{renderMath(m.right)}</span>
                <span className="ml-auto text-[12px] text-text-muted">{m.rule}</span>
              </div>
            ))}
          </div>
        )}
      </button>
    </div>
  );
}

/* ── Slide 2: Three Quadratic Forms ── */
export function QuadraticFormsVisual() {
  const forms = [
    {
      name: "Standard Form",
      formula: "$f(x) = ax^2 + bx + c$",
      reveals: ["y-intercept ($c$)", "Direction ($a > 0$ opens up, $a < 0$ opens down)", "Discriminant ($b^2 - 4ac$)"],
      color: "#60a5fa",
    },
    {
      name: "Vertex Form",
      formula: "$f(x) = a(x - h)^2 + k$",
      reveals: ["Vertex at $(h, k)$", "Axis of symmetry $x = h$", "Maximum or minimum value ($k$)"],
      color: "#a78bfa",
    },
    {
      name: "Factored Form",
      formula: "$f(x) = a(x - r_1)(x - r_2)$",
      reveals: ["x-intercepts (zeros) at $r_1$ and $r_2$", "Sum of zeros $= r_1 + r_2$", "Product of zeros $= r_1 \\cdot r_2$"],
      color: "#34d399",
    },
  ];

  const [activeForm, setActiveForm] = useState(0);

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {forms.map((f, i) => (
          <button
            key={i}
            onClick={() => setActiveForm(i)}
            className="flex-1 cursor-pointer rounded-xl border px-3 py-3 text-center text-sm font-semibold transition-all"
            style={{
              borderColor: activeForm === i ? `${f.color}55` : "var(--color-border-default)",
              background: activeForm === i ? `${f.color}0a` : undefined,
              color: activeForm === i ? f.color : undefined,
              boxShadow: activeForm === i ? `0 0 16px ${f.color}15` : "none",
            }}
          >
            {f.name}
          </button>
        ))}
      </div>

      <div
        className="rounded-2xl border p-5 transition-all duration-300"
        style={{ borderColor: `${forms[activeForm].color}33`, background: `${forms[activeForm].color}06` }}
      >
        <div className="mb-3 text-center text-xl font-bold text-text-primary">
          {renderMath(forms[activeForm].formula)}
        </div>
        <div className="text-[10px] font-bold uppercase tracking-[2px] text-text-muted">Reveals:</div>
        <ul className="mt-2 space-y-1.5">
          {forms[activeForm].reveals.map((r, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-[#bcbcc8]">
              <span style={{ color: forms[activeForm].color }}>&#x2713;</span>
              {renderMath(r)}
            </li>
          ))}
        </ul>
      </div>

      {/* Discriminant */}
      <div className="overflow-hidden rounded-xl border border-border-default">
        <div className="bg-bg-surface px-4 py-2.5 text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">
          The Discriminant: {renderMath("$b^2 - 4ac$")}
        </div>
        <div className="divide-y divide-border-default">
          <div className="flex items-center gap-3 px-4 py-3">
            <Code>&gt; 0</Code>
            <span className="text-sm text-[#22c55e]">Two real solutions</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-3">
            <Code>= 0</Code>
            <span className="text-sm text-[#fbbf24]">Exactly one real solution</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-3">
            <Code>&lt; 0</Code>
            <span className="text-sm text-[#ef4444]">No real solutions</span>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-[rgba(96,165,250,.2)] bg-[rgba(96,165,250,.07)] px-5 py-4 text-sm leading-[1.7]">
        <strong style={{ color: "#60a5fa" }}>Vertex Shortcut: </strong>
        For standard form {renderMath("$ax^2 + bx + c$")}, the x-coordinate of the vertex is {renderMath("$\\frac{-b}{2a}$")}. Plug back in for {renderMath("$y$")}.
      </div>
    </div>
  );
}

/* ── Slide 3: Factoring Techniques ── */
export function FactoringVisual() {
  const techniques = [
    {
      name: "GCF First",
      formula: "$6x^2 + 12x = 6x(x + 2)$",
      tip: "Always look for GCF first. It makes everything else easier.",
      color: "#34d399",
    },
    {
      name: "Trinomial",
      formula: "$x^2 + 5x + 6 = (x + 2)(x + 3)$",
      tip: "Find two numbers that multiply to $c$ and add to $b$.",
      color: "#60a5fa",
    },
    {
      name: "Difference of Squares",
      formula: "$x^2 - 9 = (x + 3)(x - 3)$",
      tip: "Pattern: $a^2 - b^2 = (a + b)(a - b)$. Only works for subtraction!",
      color: "#a78bfa",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid gap-3">
        {techniques.map((t, i) => (
          <div key={i} className="rounded-xl border bg-bg-base p-4" style={{ borderColor: `${t.color}33` }}>
            <div className="mb-2 text-sm font-bold" style={{ color: t.color }}>{t.name}</div>
            <div className="mb-2 text-base text-text-primary">{renderMath(t.formula)}</div>
            <div className="text-[13px] text-text-muted">{renderMath(t.tip)}</div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-[rgba(6,182,212,.2)] bg-[rgba(6,182,212,.07)] px-5 py-4 text-sm leading-[1.7]">
        <strong style={{ color: ACCENT }}>Factoring Decision Tree: </strong>
        <div className="mt-2 flex flex-col gap-1 text-[13px] text-[#bcbcc8]">
          <span>1. Is there a GCF? Factor it out first.</span>
          <span>2. Is it {renderMath("$a^2 - b^2$")}? Use difference of squares.</span>
          <span>3. Is it {renderMath("$ax^2 + bx + c$")}? Try trinomial factoring.</span>
          <span>4. Stuck? Use the quadratic formula as backup.</span>
        </div>
      </div>
    </div>
  );
}

/* ── Slide 4: Functions & Transformations ── */
export function TransformationsVisual() {
  const transforms = [
    { notation: "$f(x) + k$", effect: "Shifts UP $k$ units", dir: "vertical", color: "#22c55e" },
    { notation: "$f(x) - k$", effect: "Shifts DOWN $k$ units", dir: "vertical", color: "#ef4444" },
    { notation: "$f(x - h)$", effect: "Shifts RIGHT $h$ units", dir: "horizontal", color: "#60a5fa" },
    { notation: "$f(x + h)$", effect: "Shifts LEFT $h$ units", dir: "horizontal", color: "#fbbf24" },
    { notation: "$-f(x)$", effect: "Reflects over x-axis", dir: "reflection", color: "#a855f7" },
  ];

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-xl border border-border-default">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="border-b border-border-default bg-bg-surface px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">Notation</th>
              <th className="border-b border-border-default bg-bg-surface px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">Effect</th>
              <th className="border-b border-border-default bg-bg-surface px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">Type</th>
            </tr>
          </thead>
          <tbody>
            {transforms.map((t, i) => (
              <tr key={i}>
                <td className="border-b border-border-default px-4 py-3 last:border-b-0">
                  {renderMath(t.notation)}
                </td>
                <td className="border-b border-border-default px-4 py-3 font-semibold last:border-b-0" style={{ color: t.color }}>
                  {renderMath(t.effect)}
                </td>
                <td className="border-b border-border-default px-4 py-3 text-[13px] text-text-muted capitalize last:border-b-0">
                  {t.dir}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-xl border border-[rgba(239,68,68,.2)] bg-[rgba(239,68,68,.07)] px-5 py-4 text-sm leading-[1.7]">
        <strong className="text-[#ef4444]">Horizontal shifts feel backwards: </strong>
        {renderMath("$f(x - 3)$")} shifts <em>right</em>, not left. Think of it as: what value of {renderMath("$x$")} makes the inside equal to 0? {renderMath("$x = 3$")} &rarr; shifts to 3.
      </div>
    </div>
  );
}

/* ── Slide 5: Growth vs Decay ── */
export function GrowthDecayVisual() {
  const [rate, setRate] = useState(15);
  const isGrowth = rate > 0;
  const multiplier = isGrowth ? 1 + rate / 100 : 1 + rate / 100;
  const initial = 1000;

  // Calculate 5 periods
  const periods = Array.from({ length: 6 }, (_, i) => ({
    t: i,
    value: Math.round(initial * Math.pow(multiplier, i)),
  }));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-[rgba(34,197,94,.2)] bg-[rgba(34,197,94,.07)] px-4 py-3">
          <div className="text-sm font-bold text-[#22c55e]">Growth</div>
          <div className="mt-1 text-[13px] text-text-primary">{renderMath("$y = a(1 + r)^t$")}</div>
          <div className="text-[12px] text-text-muted">Multiplier &gt; 1</div>
        </div>
        <div className="rounded-xl border border-[rgba(239,68,68,.2)] bg-[rgba(239,68,68,.07)] px-4 py-3">
          <div className="text-sm font-bold text-[#ef4444]">Decay</div>
          <div className="mt-1 text-[13px] text-text-primary">{renderMath("$y = a(1 - r)^t$")}</div>
          <div className="text-[12px] text-text-muted">Multiplier between 0 and 1</div>
        </div>
      </div>

      {/* Interactive slider */}
      <div className="rounded-2xl border border-[rgba(6,182,212,.2)] bg-bg-base p-5 shadow-[0_0_24px_rgba(6,182,212,.08)]">
        <div className="mb-3 text-[10px] font-bold uppercase tracking-[2px] text-text-muted">
          Rate Simulator (initial = 1,000)
        </div>
        <div className="mb-4 flex items-center gap-4">
          <span className="font-mono text-xs text-[#ef4444]">-50%</span>
          <input
            type="range"
            min={-50}
            max={50}
            value={rate}
            onChange={(e) => setRate(parseInt(e.target.value))}
            className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full"
            style={{
              background: `linear-gradient(90deg, #ef4444 0%, #fbbf24 50%, #22c55e 100%)`,
            }}
          />
          <span className="font-mono text-xs text-[#22c55e]">+50%</span>
          <div className="min-w-[56px] text-center font-mono text-xl font-bold" style={{ color: isGrowth ? "#22c55e" : "#ef4444" }}>
            {rate > 0 ? "+" : ""}{rate}%
          </div>
        </div>

        <div className="mb-2 text-center text-sm text-text-muted">
          Multiplier: <Code>{multiplier.toFixed(2)}</Code> &mdash; {isGrowth ? "Exponential Growth" : rate === 0 ? "No Change" : "Exponential Decay"}
        </div>

        <div className="flex justify-between gap-1">
          {periods.map((p) => (
            <div key={p.t} className="flex-1 rounded-lg bg-bg-surface px-1 py-2 text-center">
              <div className="text-[10px] font-semibold text-text-muted">t={p.t}</div>
              <div className="font-mono text-[12px] font-bold" style={{ color: isGrowth ? "#22c55e" : "#ef4444" }}>
                {p.value.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-[rgba(6,182,212,.2)] bg-[rgba(6,182,212,.07)] px-5 py-4 text-sm leading-[1.7]">
        <strong style={{ color: ACCENT }}>Key Insight: </strong>
        If the base (multiplier) is &gt; 1, it&apos;s growth. If 0 &lt; base &lt; 1, it&apos;s decay. A car losing 15% per year has multiplier 0.85 (keeps 85%).
      </div>
    </div>
  );
}

/* ── Slide 6: Advanced Math Traps ── */
const ADV_TRAPS = [
  { num: 1, name: "The Wrong Target", desc: "Solved for x when they asked for x^2 + 1 or f(3). Always underline what the question asks for.", example: "Asked: \"What is 2x + 1?\" You solved x = 3 and picked 3. Answer: 7", color: "#ef4444" },
  { num: 2, name: "The Distribution Ghost", desc: "Forgot to distribute to ALL terms during FOIL or expansion. The ghost term gets left behind.", example: "(x+3)(x-2) = x^2 - 2x + 3x - 6 = x^2 + x - 6 (not x^2 + x + 6)", color: "#60a5fa" },
  { num: 3, name: "The One-Case Trap", desc: "Only solved one branch of a square root or absolute value. Remember: x^2 = 9 means x = +/-3.", example: "(x-1)^2 = 4 -> x-1 = +/-2 -> x = 3 AND x = -1 (two answers)", color: "#f87171" },
  { num: 4, name: "The Form Mismatch", desc: "Used the wrong quadratic form for what the question asks. Vertex question? Use vertex form. Zeros? Use factored form.", example: "Asked for vertex but used standard form and forgot -b/(2a). Use vertex form: (h,k) is right there.", color: "#a78bfa" },
];

export function AdvancedTrapsVisual() {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div className="space-y-2.5">
      {ADV_TRAPS.map((t, i) => (
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
      <div className="rounded-xl border border-[rgba(168,85,247,.2)] bg-[rgba(168,85,247,.07)] px-5 py-4 text-sm leading-[1.7]">
        <strong style={{ color: "#a855f7" }}>Don&apos;t panic: </strong>
        The PSAT 8/9 tests Advanced Math at its simplest level. Most problems need just 1-2 steps. If you know the rules and avoid the traps, you&apos;re set.
      </div>
    </div>
  );
}
