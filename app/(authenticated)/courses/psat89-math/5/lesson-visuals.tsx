"use client";

import { useState } from "react";
import { renderMath } from "@/lib/katex-render";

const ACCENT = "#06b6d4";

/* ── Slide 1: Angle Relationships Table ── */
export function AngleRelationshipsVisual() {
  const pairs = [
    { name: "Vertical Angles", rule: "EQUAL", example: "Formed by intersecting lines, across from each other", color: "#60a5fa" },
    { name: "Supplementary", rule: "Sum to 180\u00b0", example: "On a straight line", color: "#a855f7" },
    { name: "Complementary", rule: "Sum to 90\u00b0", example: "Form a right angle", color: "#34d399" },
    { name: "Corresponding", rule: "EQUAL", example: "Same position at each intersection (parallel + transversal)", color: "#fbbf24" },
    { name: "Alternate Interior", rule: "EQUAL", example: "Opposite sides, between the parallels", color: "#f87171" },
    { name: "Co-interior", rule: "Sum to 180\u00b0", example: "Same side, between the parallels", color: "#fb923c" },
  ];

  const triangleRules = [
    { label: "Angle Sum", value: "Interior angles always add to 180\u00b0" },
    { label: "Exterior Angle", value: "= sum of the two remote interior angles" },
    { label: "Similar Triangles", value: "Same shape \u2192 proportional sides" },
    { label: "Triangle Inequality", value: "Any side < sum of the other two sides" },
  ];

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-xl border border-border-default">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="border-b border-border-default bg-bg-surface px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">Angle Pair</th>
              <th className="border-b border-border-default bg-bg-surface px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">Rule</th>
              <th className="border-b border-border-default bg-bg-surface px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">When</th>
            </tr>
          </thead>
          <tbody>
            {pairs.map((p, i) => (
              <tr key={i}>
                <td className="whitespace-nowrap border-b border-border-default px-4 py-3 font-semibold last:border-b-0" style={{ color: p.color }}>{p.name}</td>
                <td className="border-b border-border-default px-4 py-3 last:border-b-0">
                  <code className="rounded-md bg-[rgba(6,182,212,.1)] px-2 py-0.5 font-mono text-[13px]" style={{ color: ACCENT }}>{p.rule}</code>
                </td>
                <td className="border-b border-border-default px-4 py-3 text-[#bcbcc8] last:border-b-0">{p.example}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="overflow-hidden rounded-xl border border-border-default">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="border-b border-border-default bg-bg-surface px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">Triangle Property</th>
              <th className="border-b border-border-default bg-bg-surface px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">Rule</th>
            </tr>
          </thead>
          <tbody>
            {triangleRules.map((r, i) => (
              <tr key={i}>
                <td className="whitespace-nowrap border-b border-border-default px-4 py-3 font-semibold text-text-secondary last:border-b-0">{r.label}</td>
                <td className="border-b border-border-default px-4 py-3 text-[#bcbcc8] last:border-b-0">{r.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-xl border border-[rgba(6,182,212,.2)] bg-[rgba(6,182,212,.07)] px-5 py-4 text-sm leading-[1.7]">
        <strong style={{ color: ACCENT }}>Quick Rule: </strong>
        At a parallel lines + transversal crossing, every angle is either <code className="rounded-md bg-[rgba(6,182,212,.1)] px-2 py-0.5 font-mono text-[13px]" style={{ color: ACCENT }}>x\u00b0</code> or <code className="rounded-md bg-[rgba(6,182,212,.1)] px-2 py-0.5 font-mono text-[13px]" style={{ color: ACCENT }}>(180 \u2212 x)\u00b0</code>. If you know one angle, you know all eight.
      </div>
    </div>
  );
}

/* ── Slide 2: Special Right Triangles ── */
export function SpecialTrianglesVisual() {
  const triples = ["3 \u2013 4 \u2013 5", "5 \u2013 12 \u2013 13", "8 \u2013 15 \u2013 17", "7 \u2013 24 \u2013 25"];
  const [flipped, setFlipped] = useState<Record<number, boolean>>({});

  const triangles = [
    {
      name: "30-60-90",
      ratio: "1 : \u221a3 : 2",
      sides: "Short leg : Long leg : Hypotenuse",
      detail: "Short leg = hyp/2. Long leg = short leg \u00d7 \u221a3. Example: If short leg = 5, long leg = 5\u221a3, hypotenuse = 10.",
      color: "#f87171",
    },
    {
      name: "45-45-90",
      ratio: "1 : 1 : \u221a2",
      sides: "Leg : Leg : Hypotenuse",
      detail: "Both legs are equal. Hypotenuse = leg \u00d7 \u221a2. Example: If each leg = 7, hypotenuse = 7\u221a2 \u2248 9.90.",
      color: "#60a5fa",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Pythagorean Triples */}
      <div className="rounded-2xl border border-border-default bg-bg-base p-5">
        <div className="mb-3 text-[10px] font-bold uppercase tracking-[2px] text-text-muted">Common Pythagorean Triples</div>
        <div className="flex flex-wrap gap-2.5">
          {triples.map((t, i) => (
            <div key={i} className="rounded-lg border border-border-default bg-bg-surface px-4 py-2 font-mono text-sm font-bold" style={{ color: "#60a5fa" }}>{t}</div>
          ))}
        </div>
        <div className="mt-2 text-[13px] text-text-muted">Multiples work too! 6-8-10 and 9-12-15 are from the 3-4-5 family.</div>
      </div>

      {/* Special Right Triangle Cards */}
      <div className="grid grid-cols-2 gap-3.5">
        {triangles.map((t, i) => (
          <button
            key={i}
            onClick={() => setFlipped(prev => ({ ...prev, [i]: !prev[i] }))}
            className="cursor-pointer rounded-xl border bg-bg-base p-[18px] text-center transition-all duration-300 hover:-translate-y-0.5"
            style={{ borderColor: flipped[i] ? `${t.color}33` : "var(--color-border-default)", boxShadow: flipped[i] ? `0 0 20px ${t.color}11` : "none" }}
          >
            {!flipped[i] ? (
              <>
                <div className="mb-1 text-[15px] font-bold text-text-primary">{t.name}</div>
                <div className="mb-2 font-mono text-xl font-bold" style={{ color: t.color }}>{t.ratio}</div>
                <div className="text-[13px] text-text-muted">{t.sides}</div>
                <div className="mt-2 text-[11px] font-medium opacity-70" style={{ color: t.color }}>tap to see example &rarr;</div>
              </>
            ) : (
              <>
                <div className="text-sm leading-[1.7] text-[#bcbcc8]">{t.detail}</div>
                <div className="mt-2 text-[11px] font-medium opacity-70" style={{ color: t.color }}>&larr; tap to flip back</div>
              </>
            )}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-[rgba(6,182,212,.2)] bg-[rgba(6,182,212,.07)] px-5 py-4 text-sm leading-[1.7]">
        <strong style={{ color: ACCENT }}>No Trig Needed: </strong>
        On the PSAT 8/9, every &ldquo;find the missing side&rdquo; right triangle problem can be solved with either the Pythagorean theorem or these ratios. You never need sin/cos/tan.
      </div>
    </div>
  );
}

/* ── Slide 3: Area & Volume Formulas Grid ── */
export function FormulaGridVisual() {
  const formulas = [
    { name: "Rectangle", eq: "$A = lw$", cat: "area" },
    { name: "Triangle", eq: "$A = \\frac{1}{2}bh$", cat: "area" },
    { name: "Parallelogram", eq: "$A = bh$", cat: "area" },
    { name: "Trapezoid", eq: "$A = \\frac{1}{2}(b_1+b_2)h$", cat: "area" },
    { name: "Rect. Prism", eq: "$V = lwh$", cat: "volume" },
    { name: "Cylinder", eq: "$V = \\pi r^2 h$", cat: "volume" },
    { name: "Cone", eq: "$V = \\frac{1}{3}\\pi r^2 h$", cat: "volume" },
    { name: "Pyramid", eq: "$V = \\frac{1}{3}Bh$", cat: "volume" },
    { name: "Sphere", eq: "$V = \\frac{4}{3}\\pi r^3$", cat: "volume" },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2.5">
        {formulas.map((f, i) => (
          <div
            key={i}
            className="rounded-xl border border-border-default bg-bg-base p-3 text-center"
          >
            <div className="mb-1 text-[10px] font-bold uppercase tracking-[1.5px] text-text-muted">{f.name}</div>
            <div className="text-[15px] font-bold" style={{ color: f.cat === "area" ? "#60a5fa" : "#a855f7" }}>{renderMath(f.eq)}</div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-[rgba(168,85,247,.2)] bg-[rgba(168,85,247,.07)] px-5 py-4 text-sm leading-[1.7]">
        <strong style={{ color: "#a855f7" }}>The \u2153 Pattern: </strong>
        Cones and pyramids are always <strong>\u2153</strong> of the &ldquo;full&rdquo; version. Cone = \u2153 \u00d7 cylinder. Pyramid = \u2153 \u00d7 prism. Easiest way to remember them.
      </div>

      <div className="rounded-xl border border-[rgba(6,182,212,.2)] bg-[rgba(6,182,212,.07)] px-5 py-4 text-sm leading-[1.7]">
        <strong style={{ color: ACCENT }}>Shaded Region Strategy: </strong>
        Shaded Area = Area of <strong>outer shape</strong> \u2212 Area of <strong>inner shape</strong>. This pattern appears on nearly every geometry section.
      </div>
    </div>
  );
}

/* ── Slide 4: Circle Formulas & Equation Reading ── */
export function CirclesVisual() {
  const [centerX, setCenterX] = useState("");
  const [centerY, setCenterY] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);

  const circleFormulas = [
    { name: "Equation", eq: "$(x-h)^2+(y-k)^2=r^2$" },
    { name: "Center", eq: "$(h, k)$" },
    { name: "Area", eq: "$A = \\pi r^2$" },
    { name: "Circumference", eq: "$C = 2\\pi r$" },
    { name: "Arc Length", eq: "$\\frac{\\theta}{360} \\times 2\\pi r$" },
    { name: "Sector Area", eq: "$\\frac{\\theta}{360} \\times \\pi r^2$" },
  ];

  const angleRules = [
    { type: "Central angle", rule: "= intercepted arc", color: "#fbbf24" },
    { type: "Inscribed angle", rule: "= HALF the intercepted arc", color: "#f87171" },
    { type: "Tangent line", rule: "Perpendicular to radius (90\u00b0)", color: "#34d399" },
  ];

  return (
    <div className="space-y-4">
      {/* Circle Formulas Grid */}
      <div className="grid grid-cols-3 gap-2.5">
        {circleFormulas.map((f, i) => (
          <div key={i} className="rounded-xl border border-border-default bg-bg-base p-3 text-center">
            <div className="mb-1 text-[10px] font-bold uppercase tracking-[1.5px] text-text-muted">{f.name}</div>
            <div className="text-[14px] font-bold" style={{ color: "#f87171" }}>{renderMath(f.eq)}</div>
          </div>
        ))}
      </div>

      {/* Angle Rules */}
      <div className="overflow-hidden rounded-xl border border-border-default">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="border-b border-border-default bg-bg-surface px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">Angle Type</th>
              <th className="border-b border-border-default bg-bg-surface px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">Rule</th>
            </tr>
          </thead>
          <tbody>
            {angleRules.map((r, i) => (
              <tr key={i}>
                <td className="whitespace-nowrap border-b border-border-default px-4 py-3 font-semibold last:border-b-0" style={{ color: r.color }}>{r.type}</td>
                <td className="border-b border-border-default px-4 py-3 text-[#bcbcc8] last:border-b-0">{r.rule}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Interactive Circle Equation Reader */}
      <div className="rounded-2xl border border-[rgba(6,182,212,.2)] bg-bg-base p-5 shadow-[0_0_24px_rgba(6,182,212,.06)]">
        <div className="mb-3 text-[10px] font-bold uppercase tracking-[2px] text-text-muted">Try It: Read a Circle Equation</div>
        <div className="mb-4 text-center font-mono text-lg font-bold text-text-primary">(x + 3)\u00b2 + (y \u2212 2)\u00b2 = 49</div>
        <div className="mb-3 flex items-center justify-center gap-3">
          <div>
            <label className="mb-1 block text-[11px] font-bold text-text-muted">Center x =</label>
            <input
              type="number" value={centerX} onChange={e => setCenterX(e.target.value)}
              className="w-[72px] rounded-lg border border-border-default bg-bg-surface p-2 text-center font-mono text-text-primary transition-all focus:border-[rgba(6,182,212,.5)] focus:shadow-[0_0_0_3px_rgba(6,182,212,.08)]"
              placeholder="?"
            />
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-bold text-text-muted">Center y =</label>
            <input
              type="number" value={centerY} onChange={e => setCenterY(e.target.value)}
              className="w-[72px] rounded-lg border border-border-default bg-bg-surface p-2 text-center font-mono text-text-primary transition-all focus:border-[rgba(6,182,212,.5)] focus:shadow-[0_0_0_3px_rgba(6,182,212,.08)]"
              placeholder="?"
            />
          </div>
          <button
            onClick={() => setShowAnswer(true)}
            className="mt-4 rounded-lg px-4 py-2 text-sm font-bold text-white transition-all hover:brightness-110"
            style={{ background: ACCENT }}
          >Check</button>
        </div>
        {showAnswer && (
          <div className={`rounded-xl px-4 py-3 text-center text-sm ${centerX === "-3" && centerY === "2" ? "bg-[rgba(34,197,94,.07)] text-[#22c55e]" : "bg-[rgba(239,68,68,.07)] text-[#ef4444]"}`}>
            {centerX === "-3" && centerY === "2" ? (
              <><strong>Correct!</strong> (x+3) means h = \u22123. (y\u22122) means k = 2. Center (\u22123, 2), radius = 7.</>
            ) : (
              <><strong>Not quite.</strong> (x+3)\u00b2 = (x\u2212(\u22123))\u00b2, so h = \u22123. (y\u22122) \u2192 k = 2. <strong>Watch the signs!</strong></>
            )}
          </div>
        )}
      </div>

      <div className="rounded-xl border border-[rgba(239,68,68,.2)] bg-[rgba(239,68,68,.07)] px-5 py-4 text-sm leading-[1.7]">
        <strong className="text-[#ef4444]">Sign Flip Trap: </strong>
        (x+4) means center x = <strong>\u22124</strong>, not +4. The signs in (x\u2212h)\u00b2+(y\u2212k)\u00b2=r\u00b2 are <strong>opposite</strong> to what you see.
      </div>
    </div>
  );
}

/* ── Slide (Geometry Traps) ── */
const GEO_TRAPS = [
  { num: "1", name: "The Wrong Target", desc: "Found the value of x but the question asked for 2x, the perimeter, or the area.", fix: "Always re-read what they're actually asking.", color: "#ef4444" },
  { num: "2", name: "The Phantom Height", desc: "Used the slant side as the height. Height must ALWAYS be perpendicular to the base.", fix: "If they give a slant, use Pythagorean theorem to find the actual height first.", color: "#60a5fa" },
  { num: "3", name: "The Sign Flip", desc: "Misread the signs in circle equations. (x+4) means center x = \u22124, not +4.", fix: "Always convert to (x\u2212h)\u00b2 form before reading the center.", color: "#f87171" },
  { num: "4", name: "The Unit Mismatch", desc: "Mixed inches and feet, or cm and m, without converting.", fix: "All measurements must be in the same unit before computing area or volume.", color: "#a855f7" },
];

export function GeometryTrapsVisual() {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {GEO_TRAPS.map((t, i) => (
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
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white" style={{ background: t.color }}>
              {t.num}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2.5">
                <span className="text-[15px] font-bold" style={{ color: t.color }}>{t.name}</span>
                <span className="text-[11px] text-text-muted">{expanded === i ? "\u25b2" : "\u25bc"}</span>
              </div>
              <div className="mt-0.5 text-[13px] leading-[1.5] text-text-muted">{t.desc}</div>
            </div>
          </div>
          {expanded === i && (
            <div className="mt-3 rounded-lg px-4 py-3 text-sm leading-[1.7]" style={{ background: `${t.color}08`, borderLeft: `3px solid ${t.color}` }}>
              <strong style={{ color: t.color }}>Fix: </strong>
              <span className="text-[#bcbcc8]">{t.fix}</span>
            </div>
          )}
        </button>
      ))}
    </div>
  );
}
