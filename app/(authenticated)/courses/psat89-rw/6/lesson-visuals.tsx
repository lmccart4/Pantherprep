"use client";

const ACCENT = "#06b6d4";

/* ── Slide 1: Clause Examples ── */
export function ClauseExamplesVisual() {
  const examples = [
    {
      label: "Independent",
      text: '"The experiment produced unexpected results." \u2713',
      color: "#22c55e",
    },
    {
      label: "Dependent",
      text: '"Because the experiment produced unexpected results" \u2717',
      color: "#ef4444",
    },
    {
      label: "Independent",
      text: '"She revised her hypothesis." \u2713',
      color: "#22c55e",
    },
    {
      label: "Dependent",
      text: '"Although she revised her hypothesis" \u2717',
      color: "#ef4444",
    },
  ];

  return (
    <div className="space-y-1.5 px-1">
      {examples.map((ex, i) => (
        <div
          key={i}
          className="flex items-center gap-2.5 rounded-r-lg border-l-[3px] px-3 py-2"
          style={{
            borderColor: ex.color,
            background: `${ex.color}08`,
          }}
        >
          <span
            className="min-w-[80px] text-xs font-bold"
            style={{ color: ex.color }}
          >
            {ex.label}
          </span>
          <span className="font-mono text-[13px] text-[#bcbcc8]">
            {ex.text}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ── Slide 2: Error Types ── */
export function ErrorTypesVisual() {
  const errors = [
    {
      label: "Run-on",
      example: "Two ICs with NO punctuation",
      color: "#ef4444",
      icon: "\u26D4",
    },
    {
      label: "Comma Splice",
      example: "Two ICs joined by ONLY a comma",
      color: ACCENT,
      icon: "\u26A0\uFE0F",
    },
    {
      label: "Fragment",
      example: "Dependent clause punctuated as a sentence",
      color: "#a78bfa",
      icon: "\u2702\uFE0F",
    },
  ];

  return (
    <div className="space-y-2 px-1">
      <div className="text-[11px] font-bold uppercase tracking-[1px] text-[#ef4444]">
        The Three Boundary Errors
      </div>
      {errors.map((e, i) => (
        <div
          key={i}
          className="flex items-center gap-2.5 rounded-r-lg border-l-[3px] px-3.5 py-2.5"
          style={{
            borderColor: e.color,
            background: `${e.color}08`,
          }}
        >
          <span className="text-lg">{e.icon}</span>
          <div className="min-w-[100px]">
            <span
              className="text-[13px] font-bold"
              style={{ color: e.color }}
            >
              {e.label}
            </span>
          </div>
          <span className="text-xs text-[#bcbcc8]">{e.example}</span>
        </div>
      ))}
      <div
        className="rounded-r-lg border-l-[3px] px-3 py-2"
        style={{
          borderColor: ACCENT,
          background: `${ACCENT}08`,
        }}
      >
        <span className="text-xs font-bold" style={{ color: ACCENT }}>
          #1 Tested:{" "}
        </span>
        <span className="text-xs text-[#bcbcc8]">
          Comma splices appear on every PSAT
        </span>
      </div>
    </div>
  );
}

/* ── Slide 3: Punctuation Grid ── */
export function PuncGridVisual() {
  const puncs = [
    {
      sym: ".",
      name: "Period",
      use: "Full stop between two independent clauses",
      color: "#22c55e",
    },
    {
      sym: ";",
      name: "Semicolon",
      use: "Joins two related independent clauses (no conjunction)",
      color: "#60a5fa",
    },
    {
      sym: ":",
      name: "Colon",
      use: "After an IC to introduce a list, explanation, or elaboration",
      color: "#a78bfa",
    },
    {
      sym: "\u2014",
      name: "Em Dash",
      use: "Sets off an interruption, aside, or dramatic emphasis",
      color: ACCENT,
    },
    {
      sym: ", +",
      name: "Comma + FANBOYS",
      use: 'Comma before for/and/nor/but/or/yet/so joining two ICs',
      color: "#fbbf24",
    },
  ];

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-2 px-1 py-2">
      {puncs.map((p, i) => (
        <div
          key={i}
          className="rounded-lg border border-border-default bg-bg-base p-3 text-center"
        >
          <div
            className="mb-1 font-mono text-[1.4rem] font-bold"
            style={{ color: p.color }}
          >
            {p.sym}
          </div>
          <div className="mb-1 text-[10px] font-bold uppercase tracking-[1px] text-text-muted">
            {p.name}
          </div>
          <div className="text-[11px] leading-snug text-[#bcbcc8]">
            {p.use}
          </div>
        </div>
      ))}
    </div>
  );
}
