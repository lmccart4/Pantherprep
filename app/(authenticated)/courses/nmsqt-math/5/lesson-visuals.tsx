"use client";

import { useState } from "react";
import { renderMath } from "@/lib/katex-render";

const ACCENT = "#d4a017";
const ACCENT_BG = "rgba(212,160,23,.07)";
const ACCENT_BORDER = "rgba(212,160,23,.2)";
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

/* ── Slide 1: Angle Relationships Table ── */
export function AngleRelationshipsVisual() {
  const rows = [
    ["Vertical Angles", "Equal", "Formed by intersecting lines"],
    ["Supplementary", "Sum to 180\u00B0", "On a straight line"],
    ["Complementary", "Sum to 90\u00B0", "Form a right angle"],
    ["Corresponding", "Equal", "Same position at each intersection"],
    ["Alternate Interior", "Equal", "Opposite sides, between parallels"],
    ["Co-Interior", "Sum to 180\u00B0", "Same side, between parallels"],
  ];

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-xl border border-border-default">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="border-b border-border-default bg-bg-surface px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">
                Angle Type
              </th>
              <th className="border-b border-border-default bg-bg-surface px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">
                Relationship
              </th>
              <th className="border-b border-border-default bg-bg-surface px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">
                Context
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([type, rel, ctx], i) => (
              <tr key={i}>
                <td className="whitespace-nowrap border-b border-border-default px-4 py-3 font-semibold text-text-secondary last:border-b-0">
                  {type}
                </td>
                <td className="border-b border-border-default px-4 py-3 last:border-b-0">
                  <Code>{rel}</Code>
                </td>
                <td className="border-b border-border-default px-4 py-3 text-[#bcbcc8] last:border-b-0">
                  {ctx}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Callout>
        <strong style={{ color: ACCENT }}>Triangle Angle Sum: </strong>
        Interior angles always add to <Code>180\u00B0</Code>. Exterior angle = sum
        of two remote interior angles.
      </Callout>
    </div>
  );
}

/* ── Slide 2: Special Right Triangles ── */
export function SpecialTrianglesVisual() {
  const triangles = [
    {
      name: "30-60-90",
      ratio: "$1 : \\sqrt{3} : 2$",
      sides: "Short leg : Long leg : Hypotenuse",
      color: "#f87171",
    },
    {
      name: "45-45-90",
      ratio: "$1 : 1 : \\sqrt{2}$",
      sides: "Leg : Leg : Hypotenuse",
      color: "#60a5fa",
    },
  ];

  const triples = [
    "3 \u2013 4 \u2013 5",
    "5 \u2013 12 \u2013 13",
    "8 \u2013 15 \u2013 17",
    "7 \u2013 24 \u2013 25",
    "6 \u2013 8 \u2013 10",
    "9 \u2013 12 \u2013 15",
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3.5">
        {triangles.map((t, i) => (
          <div
            key={i}
            className="rounded-xl p-[18px] text-center"
            style={{
              border: `2px solid ${t.color}`,
              background: `${t.color}0a`,
            }}
          >
            <div
              className="mb-1 text-lg font-bold"
              style={{ color: t.color }}
            >
              {t.name}
            </div>
            <div className="mb-1.5 text-xl font-bold text-text-primary">
              {renderMath(t.ratio)}
            </div>
            <div className="text-[13px] text-text-muted">{t.sides}</div>
          </div>
        ))}
      </div>

      <div>
        <div className="mb-2 text-sm font-bold text-text-primary">
          Common Pythagorean Triples
        </div>
        <div className="flex flex-wrap gap-2">
          {triples.map((t, i) => (
            <span
              key={i}
              className="rounded-lg border border-border-default bg-bg-base px-3.5 py-1.5 font-mono text-sm"
            >
              {t}
            </span>
          ))}
        </div>
        <div className="mt-2 text-[13px] text-text-muted">
          Last two are multiples of 3-4-5. Any multiple of a triple is also a
          triple.
        </div>
      </div>

      <Callout>
        <strong style={{ color: ACCENT }}>Pythagorean Theorem: </strong>
        {renderMath("$a^2 + b^2 = c^2$")} &mdash; $c$ is always the
        hypotenuse (longest side, opposite the right angle).
      </Callout>
    </div>
  );
}

/* ── Slide 3: Circle Formulas ── */
export function CircleFormulasVisual() {
  const formulas = [
    { name: "Standard Form", eq: "$(x-h)^2+(y-k)^2=r^2$" },
    { name: "Center", eq: "$(h, k)$" },
    { name: "Area", eq: "$A = \\pi r^2$" },
    { name: "Circumference", eq: "$C = 2\\pi r$" },
    { name: "Arc Length", eq: "$\\frac{\\theta}{360} \\times 2\\pi r$" },
    { name: "Sector Area", eq: "$\\frac{\\theta}{360} \\times \\pi r^2$" },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2.5">
        {formulas.map((f, i) => (
          <div
            key={i}
            className="rounded-xl border border-border-default bg-bg-base p-3 text-center"
          >
            <div
              className="mb-1 text-[11px] font-bold uppercase tracking-[1px]"
              style={{ color: ACCENT }}
            >
              {f.name}
            </div>
            <div className="text-sm text-text-primary">{renderMath(f.eq)}</div>
          </div>
        ))}
      </div>

      <Callout color="#60a5fa" bg="rgba(96,165,250,.07)" border="rgba(96,165,250,.2)">
        <strong style={{ color: "#60a5fa" }}>Desmos: </strong>
        Type {renderMath("$(x-2)^2+(y+3)^2=25$")} directly to graph any
        circle. Find intersections with lines by graphing both.
      </Callout>

      <Callout>
        <strong style={{ color: ACCENT }}>Completing the Square: </strong>
        If given general form {renderMath("$x^2 + y^2 + Dx + Ey + F = 0$")}, group x and
        y terms, complete the square for each. Example:{" "}
        {renderMath("$x^2 + y^2 - 6x + 4y - 12 = 0$")}{" "}
        becomes {renderMath("$(x-3)^2 + (y+2)^2 = 25$")} &rarr; Center {renderMath("$(3,-2)$")},
        Radius 5.
      </Callout>
    </div>
  );
}

/* ── Slide 4: Area & Volume Formulas ── */
export function AreaVolumeVisual() {
  const formulas = [
    { name: "Rectangle", eq: "$A = lw$" },
    { name: "Triangle", eq: "$A = \\frac{1}{2}bh$" },
    { name: "Trapezoid", eq: "$A = \\frac{1}{2}(b_1+b_2)h$" },
    { name: "Cylinder", eq: "$V = \\pi r^2 h$" },
    { name: "Cone", eq: "$V = \\frac{1}{3}\\pi r^2 h$" },
    { name: "Sphere", eq: "$V = \\frac{4}{3}\\pi r^3$" },
    { name: "Pyramid", eq: "$V = \\frac{1}{3}Bh$" },
    { name: "Rect. Prism", eq: "$V = lwh$" },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-2.5">
        {formulas.map((f, i) => (
          <div
            key={i}
            className="rounded-xl border border-border-default bg-bg-base p-3 text-center"
          >
            <div
              className="mb-1 text-[11px] font-bold uppercase tracking-[1px]"
              style={{ color: ACCENT }}
            >
              {f.name}
            </div>
            <div className="text-sm text-text-primary">{renderMath(f.eq)}</div>
          </div>
        ))}
      </div>

      <Callout color="#22c55e" bg="rgba(34,197,94,.07)" border="rgba(34,197,94,.2)">
        <strong style={{ color: "#22c55e" }}>Pattern: </strong>
        Cones and pyramids are always {renderMath("$\\frac{1}{3}$")} of the corresponding
        &quot;full&quot; shape. Cone {renderMath("$= \\frac{1}{3} \\times$")} cylinder. Pyramid {renderMath("$= \\frac{1}{3} \\times$")} prism.
      </Callout>
    </div>
  );
}

/* ── Slide 5: SOH-CAH-TOA & Trig ── */
export function TrigVisual() {
  const [degInput, setDegInput] = useState("");
  const deg = parseFloat(degInput);
  const rad = !isNaN(deg) ? (deg * Math.PI) / 180 : null;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3.5">
        <div
          className="rounded-xl p-[18px] text-center"
          style={{
            border: "2px solid #a78bfa",
            background: "rgba(167,139,250,.07)",
          }}
        >
          <div className="mb-1 text-lg font-bold" style={{ color: "#a78bfa" }}>
            SOH-CAH-TOA
          </div>
          <div className="text-sm leading-[1.8] text-[#bcbcc8]">
            <strong>S</strong>in = <strong>O</strong>pp / <strong>H</strong>yp
            <br />
            <strong>C</strong>os = <strong>A</strong>dj / <strong>H</strong>yp
            <br />
            <strong>T</strong>an = <strong>O</strong>pp / <strong>A</strong>dj
          </div>
        </div>
        <div
          className="rounded-xl p-[18px]"
          style={{
            border: "2px solid #fbbf24",
            background: "rgba(251,191,36,.07)",
          }}
        >
          <div
            className="mb-1 text-center text-lg font-bold"
            style={{ color: "#fbbf24" }}
          >
            Key Relationships
          </div>
          <div className="text-left text-sm leading-[1.8] text-[#bcbcc8]">
            {renderMath("$\\sin(x) = \\cos(90° - x)$")}
            <br />
            {renderMath("$\\tan(x) = \\frac{\\sin(x)}{\\cos(x)}$")}
            <br />
            {renderMath("$\\sin^2(x) + \\cos^2(x) = 1$")}<br />
            {renderMath("$180° = \\pi$ radians")}
          </div>
        </div>
      </div>

      {/* Interactive degree-radian converter */}
      <div className="rounded-2xl border border-border-default bg-bg-base p-5 shadow-[0_0_24px_rgba(212,160,23,.08)]">
        <div className="mb-3 text-[10px] font-bold uppercase tracking-[2px] text-text-muted">
          Degrees &harr; Radians Converter
        </div>
        <div className="flex items-center gap-4">
          <input
            type="number"
            placeholder="Degrees"
            value={degInput}
            onChange={(e) => setDegInput(e.target.value)}
            className="w-[100px] rounded-lg border border-border-default bg-bg-surface p-2.5 text-center font-mono text-lg text-text-primary transition-all focus:border-[rgba(212,160,23,.5)] focus:shadow-[0_0_0_3px_rgba(212,160,23,.08)]"
          />
          <span className="text-text-muted">&rarr;</span>
          <div className="min-w-[120px] rounded-lg bg-bg-surface px-4 py-2.5 text-center font-mono text-lg font-bold" style={{ color: ACCENT }}>
            {rad !== null ? `${rad.toFixed(4)} rad` : "\u2014"}
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2 text-[13px] text-text-muted">
          {[
            ["30°", "$\\pi/6$"],
            ["45°", "$\\pi/4$"],
            ["60°", "$\\pi/3$"],
            ["90°", "$\\pi/2$"],
            ["180°", "$\\pi$"],
            ["360°", "$2\\pi$"],
          ].map(([d, r], i) => (
            <span key={i} className="rounded-md border border-border-default bg-bg-base px-2 py-0.5 text-[12px]">
              {d} = {renderMath(r)}
            </span>
          ))}
        </div>
      </div>

      <Callout>
        <strong style={{ color: ACCENT }}>Complementary Angle Rule: </strong>
        {renderMath("$\\sin(x) = \\cos(90° - x)$")}. If {renderMath("$\\sin(x) = \\cos(32°)$")}, then {renderMath("$x = 58°$")}. This appears on nearly every PSAT.
      </Callout>
    </div>
  );
}

/* ── Slide 6: Geometry Trap Taxonomy ── */
const TRAPS = [
  {
    name: "The Wrong Target",
    desc: "Using diameter instead of radius, or answering for the wrong quantity.",
    example: "Area $= \\pi(10)^2$ when diameter is 10 — should use $r=5$",
    color: "#ef4444",
  },
  {
    name: "The Sign Flip",
    desc: "Misreading signs in circle equation: $(y+2)^2$ means $k=-2$.",
    example: "$(x-3)^2+(y+2)^2=25$ — center $(3,-2)$ NOT $(3,2)$",
    color: "#f59e0b",
  },
  {
    name: "The Phantom Height",
    desc: "Using slant height instead of actual height, or confusing which measurement to use.",
    example: "Cone $V=\\frac{1}{3}\\pi r^2 h$ uses HEIGHT, not slant height",
    color: "#a855f7",
  },
  {
    name: "Unit Mismatch",
    desc: "Mixing degrees and radians, or forgetting to convert units.",
    example: "Desmos defaults to radians \u2014 switch with wrench icon for degrees",
    color: "#3b82f6",
  },
];

export function TrapTaxonomyVisual() {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {TRAPS.map((t, i) => (
        <button
          key={i}
          onClick={() => setExpanded(expanded === i ? null : i)}
          className="w-full cursor-pointer rounded-xl border bg-bg-base p-4 text-left transition-all duration-300 hover:-translate-y-0.5"
          style={{
            borderColor:
              expanded === i
                ? `${t.color}44`
                : "var(--color-border-default)",
            boxShadow:
              expanded === i ? `0 0 20px ${t.color}15` : "none",
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
                <span
                  className="text-[15px] font-bold"
                  style={{ color: t.color }}
                >
                  {t.name}
                </span>
                <span className="text-[11px] text-text-muted">
                  {expanded === i ? "\u25B2" : "\u25BC"}
                </span>
              </div>
              <div className="mt-0.5 text-[13px] leading-[1.5] text-text-muted">
                {renderMath(t.desc)}
              </div>
            </div>
          </div>
          {expanded === i && (
            <div
              className="mt-3 rounded-lg px-4 py-3 text-[13px] leading-[1.7]"
              style={{
                background: `${t.color}08`,
                borderLeft: `3px solid ${t.color}`,
                color: "#60a5fa",
              }}
            >
              {renderMath(t.example)}
            </div>
          )}
        </button>
      ))}
    </div>
  );
}

/* ── Slide 7: Coordinate Geometry ── */
export function CoordinateGeometryVisual() {
  const formulas = [
    {
      name: "Distance",
      eq: "$d = \\sqrt{(x_2-x_1)^2 + (y_2-y_1)^2}$",
      note: "Pythagorean theorem on coordinates",
    },
    {
      name: "Midpoint",
      eq: "$M = \\left(\\frac{x_1+x_2}{2},\\, \\frac{y_1+y_2}{2}\\right)$",
      note: "Average the coordinates",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3.5">
        {formulas.map((f, i) => (
          <div
            key={i}
            className="rounded-xl border bg-bg-base p-4"
            style={{ borderColor: `${ACCENT}33` }}
          >
            <div
              className="mb-1 text-[11px] font-bold uppercase tracking-[1px]"
              style={{ color: ACCENT }}
            >
              {f.name} Formula
            </div>
            <div className="mb-2 text-sm text-text-primary">
              {renderMath(f.eq)}
            </div>
            <div className="text-[13px] text-text-muted">{f.note}</div>
          </div>
        ))}
      </div>
      <Callout>
        <strong style={{ color: ACCENT }}>Key Insight: </strong>
        The distance formula IS the Pythagorean theorem &mdash; the horizontal
        and vertical distances are the legs, and the distance between the points
        is the hypotenuse. These often appear combined with circle or line
        questions on the PSAT.
      </Callout>
    </div>
  );
}
