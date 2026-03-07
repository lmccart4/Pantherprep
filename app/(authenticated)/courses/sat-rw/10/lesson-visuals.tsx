"use client";

const ACCENT = "#C8102E";
const BLUE = "#3b82f6";
const CYAN = "#06b6d4";
const PURPLE = "#a855f7";
const AMBER = "#f59e0b";
const RED = "#ef4444";
const GREEN = "#10b981";

/* ── Slide 1: Stats ── */
export function StatsVisual() {
  const stats = [
    { n: "2-3", label: "per test", sub: "Textual Evidence" },
    { n: "~2", label: "per test", sub: "Quantitative/Data" },
    { n: "\u2260", label: "correlation \u2260 causation", sub: "The #1 data trap" },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-4 p-4">
      {stats.map((s, i) => (
        <div
          key={i}
          className="min-w-[140px] rounded-[14px] border px-6 py-4 text-center"
          style={{
            background: `${ACCENT}11`,
            borderColor: `${ACCENT}33`,
          }}
        >
          <div className="text-2xl font-black" style={{ color: ACCENT }}>
            {s.n}
          </div>
          <div className="text-[13px] font-semibold text-text-primary">
            {s.label}
          </div>
          <div className="text-[11px] text-text-muted">{s.sub}</div>
        </div>
      ))}
    </div>
  );
}

/* ── Slide 2: Strength Scale ── */
export function StrengthScaleVisual() {
  const levels = [
    { label: "Specific data/stats", strength: 100, color: GREEN, example: '"reduced by 34%"' },
    { label: "Direct examples", strength: 85, color: BLUE, example: "concrete case demonstrating claim" },
    { label: "Expert testimony", strength: 70, color: CYAN, example: "specialist directly addresses claim" },
    { label: "General statements", strength: 35, color: AMBER, example: '"showed positive results"' },
    { label: "Tangential info", strength: 15, color: RED, example: "same topic but doesn't support claim" },
  ];

  return (
    <div className="space-y-2 px-5 py-3">
      <div
        className="mb-2.5 text-xs font-bold uppercase tracking-[1px]"
        style={{ color: ACCENT }}
      >
        Evidence strength hierarchy
      </div>
      {levels.map((s, i) => (
        <div key={i}>
          <div className="mb-0.5 flex items-center justify-between">
            <span className="text-xs font-bold" style={{ color: s.color }}>
              {s.label}
            </span>
            <span className="text-[10px] italic text-text-muted">
              {s.example}
            </span>
          </div>
          <div className="h-[7px] overflow-hidden rounded-sm bg-border-default">
            <div
              className="h-full rounded-sm"
              style={{ width: `${s.strength}%`, background: s.color }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Slide 3: Data Reading ── */
export function DataReadingVisual() {
  const steps = [
    { n: "1", label: "Read labels first", detail: "Title, axes, units \u2014 BEFORE data", color: BLUE },
    { n: "2", label: "Identify trends", detail: "Increasing? Decreasing? Exceptions?", color: GREEN },
    { n: "3", label: "Match to claim", detail: "Does the data support the direction & magnitude?", color: AMBER },
  ];

  return (
    <div className="space-y-1.5 px-5 py-3">
      <div
        className="mb-2.5 text-xs font-bold uppercase tracking-[1px]"
        style={{ color: ACCENT }}
      >
        3-step data reading process
      </div>
      {steps.map((s, i) => (
        <div
          key={i}
          className="flex items-center gap-2.5 rounded-r-md p-1.5 pl-2.5"
          style={{
            borderLeft: `3px solid ${s.color}`,
            background: `${s.color}08`,
          }}
        >
          <div
            className="flex h-[22px] w-[22px] items-center justify-center rounded-full text-[11px] font-black"
            style={{ background: `${s.color}22`, color: s.color }}
          >
            {s.n}
          </div>
          <div>
            <span className="text-xs font-bold text-text-primary">
              {s.label}
            </span>
            <span className="text-[11px] text-text-muted">
              {" "}
              &mdash; {s.detail}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Slide 4: Sample Table ── */
export function SampleTableVisual() {
  const data = [
    ["Country", "GDP Growth", "Unemployment", "Inflation"],
    ["Country A", "3.2%", "4.1%", "2.8%"],
    ["Country B", "1.1%", "7.3%", "1.2%"],
    ["Country C", "4.7%", "3.5%", "5.1%"],
  ];

  return (
    <div className="px-5 py-3">
      <div
        className="mb-2 text-xs font-bold uppercase tracking-[1px]"
        style={{ color: ACCENT }}
      >
        Practice: Read this table
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr>
              {data[0].map((h, i) => (
                <th
                  key={i}
                  className="border-b-2 px-3 py-2 text-left font-bold"
                  style={{ borderColor: ACCENT, color: ACCENT }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.slice(1).map((row, ri) => (
              <tr key={ri}>
                {row.map((cell, ci) => (
                  <td
                    key={ci}
                    className="border-b border-border-default px-3 py-2"
                    style={{
                      color: ci === 0 ? "var(--color-text-primary)" : "var(--color-text-secondary)",
                    }}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-2 text-[10px] text-text-muted">
        Key: Rows = countries. Columns = metrics. Each cell = one data point.
        Country C has highest GDP growth but also highest inflation.
      </div>
    </div>
  );
}

/* ── Slide 5: Framework Visual ── */
export function FrameworkVisual() {
  return (
    <div className="space-y-1 px-5 py-3">
      <div
        className="mb-1.5 text-[11px] font-bold uppercase tracking-[1px]"
        style={{ color: CYAN }}
      >
        Textual Evidence
      </div>
      {[
        { n: "1", label: "Read the claim exactly", color: BLUE },
        { n: "2", label: "Does evidence SUPPORT or just RELATE?", color: GREEN },
        { n: "3", label: "Choose most direct & specific", color: AMBER },
      ].map((s, i) => (
        <div
          key={`t-${i}`}
          className="flex items-center gap-2 rounded-r-md p-1 pl-2"
          style={{
            borderLeft: `3px solid ${s.color}`,
            background: `${s.color}08`,
          }}
        >
          <div
            className="flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-black"
            style={{ background: `${s.color}22`, color: s.color }}
          >
            {s.n}
          </div>
          <span className="text-xs font-semibold text-text-primary">
            {s.label}
          </span>
        </div>
      ))}

      <div
        className="mb-1.5 mt-3 text-[11px] font-bold uppercase tracking-[1px]"
        style={{ color: PURPLE }}
      >
        Quantitative Evidence
      </div>
      {[
        { n: "1", label: "Read labels, title, units", color: PURPLE },
        { n: "2", label: "Find relevant data for the claim", color: CYAN },
        { n: "3", label: "Check direction & magnitude", color: RED },
        { n: "!", label: "Correlation \u2260 Causation", color: RED },
      ].map((s, i) => (
        <div
          key={`q-${i}`}
          className="flex items-center gap-2 rounded-r-md p-1 pl-2"
          style={{
            borderLeft: `3px solid ${s.color}`,
            background: `${s.color}08`,
          }}
        >
          <div
            className="flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-black"
            style={{ background: `${s.color}22`, color: s.color }}
          >
            {s.n}
          </div>
          <span className="text-xs font-semibold text-text-primary">
            {s.label}
          </span>
        </div>
      ))}
    </div>
  );
}
