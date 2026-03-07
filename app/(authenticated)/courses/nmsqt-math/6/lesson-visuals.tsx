"use client";

import { useState } from "react";

const ACCENT = "#d4a017";
const ACCENT_CODE_BG = "rgba(212,160,23,.1)";

/* ---- helpers ---- */
const Code = ({ children }: { children: React.ReactNode }) => (
  <code
    className="rounded-md px-2 py-0.5 font-mono text-[13px]"
    style={{ background: ACCENT_CODE_BG, color: ACCENT }}
  >
    {children}
  </code>
);

const Callout = ({
  children,
  color = ACCENT,
  bg,
  border,
}: {
  children: React.ReactNode;
  color?: string;
  bg?: string;
  border?: string;
}) => (
  <div
    className="rounded-xl px-5 py-4 text-sm leading-[1.7]"
    style={{
      background: bg ?? `${color}12`,
      border: `1px solid ${border ?? `${color}33`}`,
    }}
  >
    {children}
  </div>
);

/* ── Slide 1: 10 Essential Desmos Skills ── */
export function SkillsTableVisual() {
  const skills = [
    { num: 1, skill: "Graph a function", how: "y = x\u00B2 \u2212 4", app: "Visualize, find intercepts & vertex" },
    { num: 2, skill: "Find intersections", how: "Graph two equations; click the dot", app: "Solve systems, find where f(x) = g(x)" },
    { num: 3, skill: "Use sliders", how: "Type parameter like a; click slider", app: "Find unknown constants, explore transformations" },
    { num: 4, skill: "Enter a table", how: "Click + \u2192 Table; enter x, y values", app: "Set up data for regression, verify values" },
    { num: 5, skill: "Run a regression", how: "After table: y\u2081 ~ mx\u2081 + b", app: "Find line/curve of best fit" },
    { num: 6, skill: "Graph inequalities", how: "y > 2x + 1", app: "Visualize solution regions" },
    { num: 7, skill: "Calculate statistics", how: "mean(1,2,3,4) or median()", app: "Quick stat calculations" },
    { num: 8, skill: "Use the % key", how: "20% of 350", app: "Percentage calculations" },
    { num: 9, skill: "Graph circles", how: "(x\u22122)\u00B2+(y+3)\u00B2=25", app: "Verify center, radius; find tangent points" },
    { num: 10, skill: "Keyboard shortcuts", how: "^ _ ~ | sqrt pi", app: "Speed up data entry" },
  ];

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-xl border border-border-default">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="border-b border-border-default bg-bg-surface px-3 py-3 text-left text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">
                Skill
              </th>
              <th className="border-b border-border-default bg-bg-surface px-3 py-3 text-left text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">
                How To
              </th>
              <th className="border-b border-border-default bg-bg-surface px-3 py-3 text-left text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">
                PSAT Application
              </th>
            </tr>
          </thead>
          <tbody>
            {skills.map((s, i) => (
              <tr key={i}>
                <td className="whitespace-nowrap border-b border-border-default px-3 py-2.5 last:border-b-0">
                  <span
                    className="mr-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold text-white"
                    style={{ background: ACCENT }}
                  >
                    {s.num}
                  </span>
                  <span className="text-[13px] font-semibold text-text-secondary">{s.skill}</span>
                </td>
                <td className="border-b border-border-default px-3 py-2.5 last:border-b-0">
                  <Code>{s.how}</Code>
                </td>
                <td className="border-b border-border-default px-3 py-2.5 text-[13px] text-[#bcbcc8] last:border-b-0">
                  {s.app}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Callout color="#2bc4a9" bg="rgba(43,196,169,.07)" border="rgba(43,196,169,.2)">
        <strong style={{ color: "#2bc4a9" }}>Key Fact: </strong>
        Roughly 1/3 of all PSAT math questions can be solved or verified faster
        with Desmos than by hand. That is about 15 questions where fluency pays
        off.
      </Callout>
    </div>
  );
}

/* ── Slide 2: Keyboard Shortcuts ── */
export function ShortcutsVisual() {
  const shortcuts = [
    { key: "^", desc: "Exponents: x^2 \u2192 x\u00B2" },
    { key: "_", desc: "Subscripts: y_1 \u2192 y\u2081" },
    { key: "~", desc: "Regression: y\u2081 ~ mx\u2081+b" },
    { key: "Shift+\\", desc: "Absolute value: |x\u22123|" },
    { key: "sqrt", desc: "Square root: sqrt(x)" },
    { key: "pi", desc: "\u03C0 constant: pi \u2192 \u03C0" },
    { key: "/", desc: "Fractions: 3/7" },
    { key: "\u2699", desc: "Wrench: degrees \u2194 radians" },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-2.5">
        {shortcuts.map((s, i) => (
          <div
            key={i}
            className="rounded-xl border border-border-default bg-bg-base p-3 text-center"
          >
            <div className="mb-1 font-mono text-xl font-bold" style={{ color: ACCENT }}>
              {s.key}
            </div>
            <div className="text-[12px] text-text-muted">{s.desc}</div>
          </div>
        ))}
      </div>
      <Callout>
        <strong style={{ color: ACCENT }}>Memorize these before test day. </strong>
        They save 2&ndash;3 seconds per entry &mdash; which adds up over 44
        questions.
      </Callout>
    </div>
  );
}

/* ── Slide 3: Do / Don't Table ── */
export function DoDontVisual() {
  const doItems = [
    "Systems of equations (graph & click)",
    "Quadratic vertex, zeros, graph shape",
    "Finding where f(x) = g(x)",
    "Data tables & regression",
    "Inequality solution regions",
    "Circle equations (center, radius)",
    "Unknown constant with slider",
    "Verifying your algebraic answer",
  ];

  const dontItems = [
    "Simple arithmetic (7 \u00D7 8)",
    "Single-step calculations",
    "Questions testing setup, not solving",
    "When you see the answer immediately",
    "Unit conversions",
    "Probability from tables",
    "If setup takes >15 seconds",
    "Study design / conceptual questions",
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3.5">
        <div className="rounded-xl border-2 border-[#22c55e] bg-bg-base p-4">
          <h4 className="mb-2 text-sm font-bold text-[#22c55e]">USE Desmos</h4>
          <ul className="space-y-1 pl-4 text-[13px] leading-[1.6] text-[#bcbcc8]">
            {doItems.map((item, i) => (
              <li key={i} className="list-disc">{item}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border-2 border-[#ef4444] bg-bg-base p-4">
          <h4 className="mb-2 text-sm font-bold text-[#ef4444]">DON&apos;T Use Desmos</h4>
          <ul className="space-y-1 pl-4 text-[13px] leading-[1.6] text-[#bcbcc8]">
            {dontItems.map((item, i) => (
              <li key={i} className="list-disc">{item}</li>
            ))}
          </ul>
        </div>
      </div>
      <Callout>
        <strong style={{ color: ACCENT }}>The 5-Second Rule: </strong>
        If you can&apos;t figure out how to set it up in Desmos within 5 seconds,
        switch to algebra. Desmos is a tool, not a crutch.
      </Callout>
    </div>
  );
}

/* ── Slide 4: Worked Examples (Flippable Cards) ── */
const EXAMPLES = [
  {
    title: "Solve a System",
    subtitle: "y = 2x + 1 and y = \u2212x + 7",
    color: "#34d399",
    front: "Graph both equations, click intersection dot \u2192 (2, 5). Done in ~10 seconds.",
    steps: ["Type y = 2x + 1 on line 1", "Type y = \u2212x + 7 on line 2", "Click the gray intersection dot", "Read: x = 2, y = 5"],
  },
  {
    title: "Find a Vertex",
    subtitle: "f(x) = x\u00B2 \u2212 6x + 5",
    color: "#a78bfa",
    front: "Graph the parabola, click the bottom \u2192 vertex at (3, \u22124).",
    steps: ["Type y = x^2 \u2212 6x + 5", "Click the vertex of the parabola", "Desmos shows (3, \u22124)", "Also see zeros at x=1 and x=5"],
  },
  {
    title: "Regression",
    subtitle: "Data: (1,3), (2,5), (3,8), (4,11), (5,14)",
    color: "#fbbf24",
    front: "Enter table, type y\u2081 ~ mx\u2081 + b \u2192 m \u2248 2.8, b \u2248 \u22120.2.",
    steps: ["Click + \u2192 Table, enter data", "Type y\u2081 ~ mx\u2081 + b (use _ and ~)", "Read: m \u2248 2.8, b \u2248 \u22120.2", "For quadratic: y\u2081 ~ ax\u2081\u00B2 + bx\u2081 + c"],
  },
  {
    title: "Slider for Unknown",
    subtitle: "y = ax + 3 passes through (4, 11)",
    color: "#f87171",
    front: "Type y = ax + 3, Desmos makes slider. Plot (4,11). Slide until line passes through.",
    steps: ["Type y = ax + 3 (slider for a)", "Plot the point (4, 11)", "Slide a until line hits point", "Read a = 2"],
  },
  {
    title: "Quick Statistics",
    subtitle: "Mean of 12, 15, 18, 22, 33",
    color: "#2bc4a9",
    front: "Type mean(12,15,18,22,33) \u2192 instant result: 20.",
    steps: ["Type mean(12,15,18,22,33) \u2192 20", "median(12,15,18,22,33) \u2192 18", "total(12,15,18,22,33) \u2192 100", "stdev() for standard deviation"],
  },
];

export function WorkedExamplesVisual() {
  const [flipped, setFlipped] = useState<Record<number, boolean>>({});

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-3">
      {EXAMPLES.map((ex, i) => (
        <button
          key={i}
          onClick={() => setFlipped((prev) => ({ ...prev, [i]: !prev[i] }))}
          className="cursor-pointer rounded-xl border bg-bg-base p-4 text-left transition-all duration-250 hover:-translate-y-0.5"
          style={{
            borderColor: flipped[i] ? `${ex.color}33` : "var(--color-border-default)",
            boxShadow: flipped[i] ? `0 0 20px ${ex.color}15` : "none",
          }}
        >
          {!flipped[i] ? (
            <>
              <div className="mb-1.5 text-sm font-bold" style={{ color: ex.color }}>
                {ex.title}
              </div>
              <div className="mb-2 font-mono text-[12px] text-text-muted">{ex.subtitle}</div>
              <div className="text-[13px] leading-[1.6] text-[#bcbcc8]">{ex.front}</div>
              <div className="mt-2.5 text-right text-[10px] font-semibold uppercase tracking-[1.5px] opacity-70" style={{ color: ex.color }}>
                tap for steps
              </div>
            </>
          ) : (
            <>
              <ol className="space-y-1.5 pl-4 text-[13px] leading-[1.6] text-[#bcbcc8]">
                {ex.steps.map((s, j) => (
                  <li key={j} className="list-decimal">{s}</li>
                ))}
              </ol>
              <div className="mt-2.5 text-right text-[10px] font-semibold uppercase tracking-[1.5px] opacity-70" style={{ color: ex.color }}>
                tap to flip back
              </div>
            </>
          )}
        </button>
      ))}
    </div>
  );
}

/* ── Slide 5: Desmos Trap Taxonomy ── */
const DESMOS_TRAPS = [
  {
    name: "Intersection Misread",
    desc: "Clicking near an intersection but reading the wrong coordinates, or not zooming in enough.",
    fix: "Click directly on the gray dot. Zoom in if coordinates aren't clear.",
    color: "#ef4444",
  },
  {
    name: "Setup Trap",
    desc: "Spending 30+ seconds trying to set up a problem in Desmos when algebra would be faster.",
    fix: "Apply the 5-second rule. If setup isn't obvious, switch methods.",
    color: "#f59e0b",
  },
  {
    name: "CAS Illusion",
    desc: "Expecting Desmos to simplify algebraic expressions or factor for you \u2014 it can't.",
    fix: "Desmos evaluates numerically and graphs. It does NOT do symbolic algebra.",
    color: "#a855f7",
  },
  {
    name: "Mental Math Trap",
    desc: "Opening Desmos for calculations you could do in your head (7\u00D78, 25% of 100).",
    fix: "If it takes longer to type than to think, don't type it.",
    color: "#3b82f6",
  },
];

export function DesmosTrapVisual() {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {DESMOS_TRAPS.map((t, i) => (
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
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white"
              style={{ background: t.color }}
            >
              {i + 1}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2.5">
                <span className="text-[15px] font-bold" style={{ color: t.color }}>
                  {t.name}
                </span>
                <span className="text-[11px] text-text-muted">
                  {expanded === i ? "\u25B2" : "\u25BC"}
                </span>
              </div>
              <div className="mt-0.5 text-[13px] leading-[1.5] text-text-muted">{t.desc}</div>
            </div>
          </div>
          {expanded === i && (
            <div
              className="mt-3 rounded-lg px-4 py-3 text-sm leading-[1.7]"
              style={{ background: `${t.color}08`, borderLeft: `3px solid ${t.color}` }}
            >
              <strong style={{ color: "#22c55e" }}>Fix: </strong>
              <span className="text-[#bcbcc8]">{t.fix}</span>
            </div>
          )}
        </button>
      ))}
    </div>
  );
}
