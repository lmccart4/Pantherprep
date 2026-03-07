"use client";

const ACCENT = "#C8102E";

/* ── Slide 1: Stats Visual ── */
export function StatsVisual() {
  const stats = [
    { n: "4-5", label: "per test", sub: "Rhetorical Synthesis" },
    { n: "2-3", label: "per test", sub: "Transitions" },
    { n: "1-2", label: "per test", sub: "Expression" },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-4 p-4">
      {stats.map((s, i) => (
        <div
          key={i}
          className="min-w-[140px] rounded-xl border border-[rgba(200,16,46,.25)] bg-[rgba(200,16,46,.07)] px-6 py-4 text-center"
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

/* ── Slide 3: Synthesis Steps ── */
export function SynthesisStepsVisual() {
  const steps = [
    {
      n: "1",
      label: "Read the GOAL first",
      detail: "What purpose must the sentence serve?",
      color: ACCENT,
    },
    {
      n: "2",
      label: "Identify relevant notes",
      detail: "Which notes serve the goal? Ignore the rest.",
      color: "#3b82f6",
    },
    {
      n: "3",
      label: "Evaluate choices",
      detail: "Relevant + Accurate + Complete + Fluent",
      color: "#22c55e",
    },
  ];

  return (
    <div className="space-y-1.5 px-5 py-3">
      {steps.map((s, i) => (
        <div
          key={i}
          className="flex items-center gap-2.5 rounded-r-md border-l-[3px] px-2.5 py-1.5"
          style={{
            borderColor: s.color,
            background: `${s.color}0a`,
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

/* ── Slide 4: Transition Map ── */
export function TransitionMapVisual() {
  const categories = [
    {
      cat: "Addition",
      words: "furthermore, moreover, also, similarly",
      color: "#3b82f6",
    },
    {
      cat: "Contrast",
      words: "however, nevertheless, by contrast, yet",
      color: ACCENT,
    },
    {
      cat: "Cause/Effect",
      words: "therefore, consequently, as a result, thus",
      color: "#f59e0b",
    },
    {
      cat: "Example",
      words: "for instance, for example, specifically",
      color: "#22c55e",
    },
    {
      cat: "Concession",
      words: "that said, admittedly, granted, of course",
      color: "#06b6d4",
    },
  ];

  return (
    <div className="px-5 py-3">
      <div
        className="mb-2.5 text-xs font-bold uppercase tracking-wider"
        style={{ color: ACCENT }}
      >
        Transition categories
      </div>
      <div className="space-y-1.5">
        {categories.map((t, i) => (
          <div
            key={i}
            className="flex gap-2.5 rounded-r-lg border-l-[3px] px-2.5 py-1.5"
            style={{
              borderColor: t.color,
              background: `${t.color}0a`,
            }}
          >
            <div className="min-w-[80px]">
              <span
                className="text-xs font-extrabold"
                style={{ color: t.color }}
              >
                {t.cat}
              </span>
            </div>
            <span className="text-[11px] text-text-secondary">{t.words}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Slide 8: Framework Visual ── */
export function FrameworkVisual() {
  const sections: {
    title: string;
    color: string;
    steps: { n: string; label: string }[];
  }[] = [
    {
      title: "Synthesis",
      color: ACCENT,
      steps: [
        { n: "1", label: "Goal first \u2192 which notes matter?" },
        { n: "2", label: "Right notes + right purpose = right answer" },
      ],
    },
    {
      title: "Transitions",
      color: "#06b6d4",
      steps: [
        { n: "1", label: "Cover transition \u2192 read both sentences" },
        { n: "2", label: "Identify relationship \u2192 match transition" },
      ],
    },
    {
      title: "Expression",
      color: "#f59e0b",
      steps: [
        { n: "1", label: "Read the goal precisely" },
        { n: "2", label: "Match the answer to the EXACT objective" },
      ],
    },
  ];

  return (
    <div className="space-y-3 px-5 py-3">
      {sections.map((section, si) => (
        <div key={si}>
          <div
            className="mb-1.5 text-[11px] font-bold uppercase tracking-wider"
            style={{ color: section.color }}
          >
            {section.title}
          </div>
          <div className="space-y-1">
            {section.steps.map((s, i) => (
              <div
                key={i}
                className="flex items-center gap-2 rounded-r-md border-l-[3px] px-2 py-1"
                style={{
                  borderColor: section.color,
                  background: `${section.color}0a`,
                }}
              >
                <div
                  className="flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-black"
                  style={{
                    background: `${section.color}22`,
                    color: section.color,
                  }}
                >
                  {s.n}
                </div>
                <span className="text-xs font-semibold text-text-primary">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
