"use client";

const ACCENT = "#C8102E";

/* ── Slide: Skills Overview ── */
export function SkillsOverview() {
  const skills = [
    { label: "Synthesis", detail: "Use notes to accomplish a specific writing goal", color: "#3b82f6" },
    { label: "Transitions", detail: "Connect sentences with the right logical relationship", color: "#a855f7" },
    { label: "Expression", detail: "Revise to match a stated objective", color: "#10b981" },
    { label: "Concision", detail: "Choose the most efficient phrasing", color: "#f59e0b" },
    { label: "Strategy", detail: "Smart decisions under time pressure", color: ACCENT },
  ];

  return (
    <div className="space-y-1.5 px-5 py-3">
      <div
        className="mb-2.5 text-xs font-bold uppercase tracking-[1px]"
        style={{ color: ACCENT }}
      >
        Expression & Strategy Skills
      </div>
      {skills.map((s, i) => (
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
            {i + 1}
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

/* ── Slide: Synthesis Process ── */
export function SynthesisProcess() {
  const steps = [
    { n: "1", label: "Read the GOAL first", detail: "Circle the specific writing objective", color: "#3b82f6" },
    { n: "2", label: "Identify relevant notes", detail: "Which bullet points serve the goal?", color: "#a855f7" },
    { n: "3", label: "Eliminate non-matches", detail: "Cut choices that miss the goal or use wrong notes", color: "#ef4444" },
    { n: "4", label: "Pick the best synthesis", detail: "The answer that weaves relevant notes into the goal", color: "#10b981" },
  ];

  return (
    <div className="space-y-1.5 px-5 py-3">
      <div
        className="mb-2.5 text-xs font-bold uppercase tracking-[1px]"
        style={{ color: ACCENT }}
      >
        Synthesis Question Process
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

/* ── Slide: Transition Map ── */
export function TransitionMap() {
  const groups = [
    {
      relation: "Addition",
      words: ["furthermore", "moreover", "additionally", "also"],
      color: "#3b82f6",
    },
    {
      relation: "Contrast",
      words: ["however", "nevertheless", "by contrast", "on the other hand"],
      color: "#ef4444",
    },
    {
      relation: "Cause/Effect",
      words: ["as a result", "consequently", "therefore", "thus"],
      color: "#10b981",
    },
    {
      relation: "Example",
      words: ["for instance", "for example", "specifically", "to illustrate"],
      color: "#f59e0b",
    },
    {
      relation: "Concession",
      words: ["admittedly", "to be sure", "granted", "that said"],
      color: "#a855f7",
    },
  ];

  return (
    <div className="px-5 py-3">
      <div
        className="mb-2.5 text-xs font-bold uppercase tracking-[1px]"
        style={{ color: ACCENT }}
      >
        Transition Word Map
      </div>
      {groups.map((g, i) => (
        <div
          key={i}
          className="mb-2 rounded-lg border-l-[3px] px-3 py-2"
          style={{ borderColor: g.color, background: `${g.color}06` }}
        >
          <div className="mb-1 text-[12px] font-bold" style={{ color: g.color }}>
            {g.relation}
          </div>
          <div className="flex flex-wrap gap-1">
            {g.words.map((w, j) => (
              <code
                key={j}
                className="rounded-md px-2 py-0.5 font-mono text-[11px]"
                style={{ background: `${g.color}11`, color: g.color }}
              >
                {w}
              </code>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
