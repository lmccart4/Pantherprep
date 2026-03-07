"use client";

import { useState } from "react";
import { renderMath } from "@/lib/katex-render";

const ACCENT = "#C8102E";

/* ── Slide: Angle Relationships Table ── */
export function AngleRelationshipsVisual() {
  const rows = [
    ["Vertical Angles", "Equal", "Formed by intersecting lines, across from each other"],
    ["Supplementary", <><code className="rounded-md bg-[rgba(200,16,46,.1)] px-2 py-0.5 font-mono text-[13px]" style={{ color: ACCENT }}>180°</code></>, "On a straight line"],
    ["Complementary", <><code className="rounded-md bg-[rgba(200,16,46,.1)] px-2 py-0.5 font-mono text-[13px]" style={{ color: ACCENT }}>90°</code></>, "Form a right angle"],
    ["Corresponding", "Equal", "Same position at each intersection (parallel lines)"],
    ["Alternate Interior", "Equal", "Opposite sides, between the parallels"],
    ["Co-Interior", <><code className="rounded-md bg-[rgba(200,16,46,.1)] px-2 py-0.5 font-mono text-[13px]" style={{ color: ACCENT }}>180°</code></>, "Same side, supplementary"],
  ] as const;

  return (
    <div className="overflow-hidden rounded-xl border border-border-default">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            <th className="border-b border-border-default bg-bg-surface px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">Angle Type</th>
            <th className="border-b border-border-default bg-bg-surface px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">Relationship</th>
            <th className="border-b border-border-default bg-bg-surface px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">When</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([type, rel, when], i) => (
            <tr key={i}>
              <td className="whitespace-nowrap border-b border-border-default px-4 py-3 font-semibold text-text-secondary last:border-b-0">{type}</td>
              <td className="border-b border-border-default px-4 py-3 text-[#bcbcc8] last:border-b-0">{rel}</td>
              <td className="border-b border-border-default px-4 py-3 text-[#bcbcc8] last:border-b-0">{when}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ── Slide: Special Right Triangles ── */
export function SpecialTrianglesVisual() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3.5">
        <div className="rounded-xl border-2 border-[#f87171] bg-bg-base p-5 text-center">
          <div className="mb-1 text-base font-bold text-[#f87171]">30-60-90</div>
          <div className="mb-2 font-mono text-xl font-bold text-text-primary">{renderMath("$1 : \\sqrt{3} : 2$")}</div>
          <div className="text-[13px] text-text-muted">Short leg : Long leg : Hypotenuse<br />Opp 30° : Opp 60° : Opp 90°</div>
        </div>
        <div className="rounded-xl border-2 border-[#f87171] bg-bg-base p-5 text-center">
          <div className="mb-1 text-base font-bold text-[#f87171]">45-45-90</div>
          <div className="mb-2 font-mono text-xl font-bold text-text-primary">{renderMath("$1 : 1 : \\sqrt{2}$")}</div>
          <div className="text-[13px] text-text-muted">Leg : Leg : Hypotenuse<br />Two legs are always equal</div>
        </div>
      </div>
      <div>
        <div className="mb-2 text-sm font-bold text-text-primary">Common Pythagorean Triples (memorize!):</div>
        <div className="flex flex-wrap gap-2">
          {["3-4-5", "5-12-13", "8-15-17", "7-24-25", "6-8-10", "9-12-15"].map((t) => (
            <div key={t} className="rounded-xl border border-white/5 bg-[rgba(15,15,22,.75)] px-3.5 py-1.5 font-mono text-sm">{t}</div>
          ))}
        </div>
        <div className="mt-2 text-[13px] text-text-muted">Last two are multiples of 3-4-5. Any multiple of a triple is also a triple!</div>
      </div>
    </div>
  );
}

/* ── Slide: Circle Formulas Grid ── */
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
        {formulas.map((f) => (
          <div key={f.name} className="rounded-xl border border-white/5 bg-[rgba(15,15,22,.75)] p-3 text-center">
            <div className="mb-1 text-xs font-bold text-[#f87171]">{f.name}</div>
            <div className="font-mono text-sm">{renderMath(f.eq)}</div>
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-[rgba(96,165,250,.2)] bg-[rgba(96,165,250,.07)] px-5 py-4 text-sm leading-[1.7]">
        <strong style={{ color: "#60a5fa" }}>Desmos:</strong> Type {renderMath("$(x-2)^2+(y+3)^2=25$")} directly to graph any circle. Find intersections with lines by graphing both.
      </div>
    </div>
  );
}

/* ── Slide: Area & Volume Formulas ── */
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
        {formulas.map((f) => (
          <div key={f.name} className="rounded-xl border border-white/5 bg-[rgba(15,15,22,.75)] p-3 text-center">
            <div className="mb-1 text-xs font-bold text-[#f87171]">{f.name}</div>
            <div className="font-mono text-sm">{renderMath(f.eq)}</div>
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-[rgba(200,16,46,.2)] bg-[rgba(200,16,46,.07)] px-5 py-4 text-sm leading-[1.7]">
        <strong style={{ color: ACCENT }}>Pattern:</strong> Cones and pyramids are always 1/3 of the corresponding &quot;full&quot; shape. Cone = 1/3 &times; cylinder. Pyramid = 1/3 &times; prism.
      </div>
    </div>
  );
}

/* ── Slide: SOH-CAH-TOA + Key Relationships ── */
export function TrigRatiosVisual() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3.5">
        <div className="rounded-xl border-2 border-[#a78bfa] bg-bg-base p-5 text-center">
          <div className="mb-2 text-base font-bold text-[#a78bfa]">SOH-CAH-TOA</div>
          <div className="font-mono text-sm leading-[2]">
            <strong>S</strong>in = <strong>O</strong>pp / <strong>H</strong>yp<br />
            <strong>C</strong>os = <strong>A</strong>dj / <strong>H</strong>yp<br />
            <strong>T</strong>an = <strong>O</strong>pp / <strong>A</strong>dj
          </div>
        </div>
        <div className="rounded-xl border-2 border-[#fbbf24] bg-bg-base p-5 text-left">
          <div className="mb-2 text-base font-bold text-[#fbbf24]">Key Relationships</div>
          <div className="text-sm leading-[2] text-[#bcbcc8]">
            {renderMath("$\\sin(x) = \\cos(90° - x)$")}<br />
            {renderMath("$\\tan(x) = \\frac{\\sin(x)}{\\cos(x)}$")}<br />
            {renderMath("$\\sin^2(x) + \\cos^2(x) = 1$")}<br />
            {renderMath("$180° = \\pi$ radians")}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Slide: Radians ↔ Degrees Conversion Table ── */
export function RadiansVisual() {
  const conversions = [
    { deg: "30°", rad: "π/6" },
    { deg: "45°", rad: "π/4" },
    { deg: "60°", rad: "π/3" },
    { deg: "90°", rad: "π/2" },
    { deg: "180°", rad: "π" },
    { deg: "360°", rad: "2π" },
  ];

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-xl border border-border-default">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="border-b border-border-default bg-bg-surface px-4 py-3 text-center text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">Degrees</th>
              <th className="border-b border-border-default bg-bg-surface px-4 py-3 text-center text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">Radians</th>
            </tr>
          </thead>
          <tbody>
            {conversions.map((c, i) => (
              <tr key={i}>
                <td className="border-b border-border-default px-4 py-2.5 text-center font-semibold text-text-secondary last:border-b-0">{c.deg}</td>
                <td className="border-b border-border-default px-4 py-2.5 text-center last:border-b-0">
                  <code className="rounded-md bg-[rgba(200,16,46,.1)] px-2 py-0.5 font-mono text-[13px]" style={{ color: ACCENT }}>{c.rad}</code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="rounded-xl border border-[rgba(96,165,250,.2)] bg-[rgba(96,165,250,.07)] px-5 py-4 text-sm leading-[1.7]">
        <strong style={{ color: "#60a5fa" }}>Desmos:</strong> Defaults to radians. Click the wrench icon to switch to degrees if needed.
      </div>
    </div>
  );
}

/* ── Slide: Geometry Trap Taxonomy ── */
const TRAPS = [
  { num: 1, name: "The Wrong Target", color: "#ef4444", desc: "Solved for the wrong measurement -- found diameter when they asked for radius, found area when they asked for circumference.", example: "Diameter = 10 -> Area = $\\pi(5^2) = 25\\pi$ (not $\\pi(10^2) = 100\\pi$)" },
  { num: 2, name: "The Phantom Height", color: "#f87171", desc: "Used the slant height instead of the actual height in a volume or area formula. The height must be perpendicular to the base.", example: "Cone: $V = \\frac{1}{3}\\pi r^2 h$ uses vertical height, NOT slant height" },
  { num: 3, name: "The Sign Flip", color: "#fbbf24", desc: "In circle equations, $(x+3)^2$ means h = -3, not h = 3. The sign inside the parentheses is opposite to the center coordinate.", example: "$(x+1)^2+(y-4)^2=9$ -> Center (-1, 4), NOT (1, -4)" },
  { num: 4, name: "The Unit Mismatch", color: "#60a5fa", desc: "Mixed up degrees and radians, or used inches for one dimension and feet for another.", example: "sin(30) in Desmos = sin(30 radians) != sin(30°)" },
];

export function TrapTaxonomyVisual() {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div className="space-y-2.5">
      {TRAPS.map((t) => (
        <button
          key={t.num}
          onClick={() => setExpanded(expanded === t.num ? null : t.num)}
          className="w-full cursor-pointer rounded-xl border bg-bg-base p-4 text-left transition-all duration-300 hover:-translate-y-0.5"
          style={{
            borderColor: expanded === t.num ? `${t.color}44` : "var(--color-border-default)",
            boxShadow: expanded === t.num ? `0 0 20px ${t.color}15` : "none",
          }}
        >
          <div className="flex items-center gap-3.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white" style={{ background: t.color }}>
              {t.num}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2.5">
                <span className="text-[15px] font-bold" style={{ color: t.color }}>{t.name}</span>
                <span className="text-[11px] text-text-muted">{expanded === t.num ? "▲" : "▼"}</span>
              </div>
              <div className="mt-0.5 text-[13px] leading-[1.5] text-text-muted">{renderMath(t.desc)}</div>
            </div>
          </div>
          {expanded === t.num && (
            <div className="mt-3 rounded-lg px-4 py-3 text-sm leading-[1.7]" style={{ background: `${t.color}08`, borderLeft: `3px solid ${t.color}` }}>
              <span className="font-mono text-[13px]" style={{ color: t.color }}>{renderMath(t.example)}</span>
            </div>
          )}
        </button>
      ))}
    </div>
  );
}

/* ── Slide: Distance & Midpoint ── */
export function DistanceMidpointVisual() {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-white/5 bg-[rgba(15,15,22,.75)] p-5 font-mono text-sm leading-[2]">
        <div><span className="font-bold text-[#f87171]">Distance:</span> {renderMath("$d = \\sqrt{(x_2-x_1)^2 + (y_2-y_1)^2}$")}</div>
        <div className="text-[13px] text-text-muted">This IS the Pythagorean theorem on the coordinate plane!</div>
        <div className="mt-2"><span className="font-bold text-[#f87171]">Midpoint:</span> {renderMath("$M = \\left(\\frac{x_1+x_2}{2},\\, \\frac{y_1+y_2}{2}\\right)$")}</div>
        <div className="text-[13px] text-text-muted">Average the x&apos;s and average the y&apos;s</div>
      </div>
      <div className="rounded-xl border border-[rgba(200,16,46,.2)] bg-[rgba(200,16,46,.07)] px-5 py-4 text-sm leading-[1.7]">
        <strong style={{ color: ACCENT }}>Don&apos;t memorize the distance formula separately.</strong> Just draw a right triangle on the coordinate plane. The horizontal and vertical distances are the legs. Use a² + b² = c².
      </div>
    </div>
  );
}
