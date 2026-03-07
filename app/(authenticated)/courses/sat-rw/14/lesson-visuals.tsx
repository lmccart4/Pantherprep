"use client";

const ACCENT = "#C8102E";

/* ── Slide 1: Format Visual ── */
export function FormatVisual() {
  const modules = [
    {
      label: "Module 1",
      time: "32 min",
      qs: "27 Qs",
      note: "Standard difficulty",
      color: "#3b82f6",
    },
    {
      label: "10-min Break",
      time: "",
      qs: "",
      note: "Reset & refuel",
      color: "#64748b",
    },
    {
      label: "Module 2",
      time: "32 min",
      qs: "27 Qs",
      note: "ADAPTIVE difficulty",
      color: "#8b5cf6",
    },
  ];

  return (
    <div className="px-5 py-3">
      <div
        className="mb-2.5 text-xs font-bold uppercase tracking-wider"
        style={{ color: "#f59e0b" }}
      >
        Digital SAT R&W Structure
      </div>
      <div className="flex flex-wrap gap-3">
        {modules.map((m, i) => (
          <div
            key={i}
            className="min-w-[100px] flex-1 rounded-xl border p-3 text-center"
            style={{
              borderColor: `${m.color}33`,
              background: `${m.color}0a`,
            }}
          >
            <div
              className="text-[13px] font-extrabold"
              style={{ color: m.color }}
            >
              {m.label}
            </div>
            {m.time && (
              <div className="mt-1 text-lg font-black text-text-primary">
                {m.time}
              </div>
            )}
            {m.qs && (
              <div className="text-xs text-text-secondary">{m.qs}</div>
            )}
            <div className="mt-1 text-[10px] text-text-muted">{m.note}</div>
          </div>
        ))}
      </div>
      <div className="mt-2.5 rounded-r-lg border-l-[3px] border-l-[#ef4444] bg-[rgba(239,68,68,.06)] px-3 py-2">
        <span className="text-[11px] font-bold text-[#ef4444]">KEY: </span>
        <span className="text-[11px] text-text-secondary">
          Module 1 accuracy determines Module 2 difficulty. Strong Module 1 =
          harder Module 2 = higher score ceiling.
        </span>
      </div>
    </div>
  );
}

/* ── Slide 2: Pacing Chart ── */
export function PacingChartVisual() {
  const tiers = [
    {
      label: "Fast (30-45s)",
      types: "Conventions, simple vocab, transitions",
      color: "#22c55e",
      pct: 30,
    },
    {
      label: "Medium (60-90s)",
      types: "Central idea, detail, evidence",
      color: "#f59e0b",
      pct: 55,
    },
    {
      label: "Slow (90-120s)",
      types: "Inference, strengthen/weaken, data, synthesis",
      color: "#ef4444",
      pct: 75,
    },
  ];

  return (
    <div className="px-5 py-3">
      <div
        className="mb-2.5 text-xs font-bold uppercase tracking-wider"
        style={{ color: "#f59e0b" }}
      >
        Time allocation by question type
      </div>
      <div className="space-y-2">
        {tiers.map((s, i) => (
          <div key={i}>
            <div className="mb-0.5 flex justify-between">
              <span
                className="text-xs font-bold"
                style={{ color: s.color }}
              >
                {s.label}
              </span>
              <span className="text-[10px] text-text-muted">{s.types}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-border-default">
              <div
                className="h-full rounded-full"
                style={{ width: `${s.pct}%`, background: s.color }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-2 rounded-md bg-[rgba(59,130,246,.06)] px-2.5 py-1.5">
        <span className="text-[11px] font-bold text-[#3b82f6]">
          TIME BANK:{" "}
        </span>
        <span className="text-[11px] text-text-secondary">
          Save 30s on 10 easy Qs = 5 extra minutes for the 5 hardest Qs
        </span>
      </div>
    </div>
  );
}

/* ── Slide 4: Elimination Visual ── */
export function EliminationVisual() {
  const rows = [
    { eliminated: 0, odds: "25%", color: "#475569", pct: 25 },
    { eliminated: 1, odds: "33%", color: "#ef4444", pct: 33 },
    { eliminated: 2, odds: "50%", color: "#f59e0b", pct: 50 },
    { eliminated: 3, odds: "100%", color: "#22c55e", pct: 100 },
  ];

  return (
    <div className="px-5 py-3">
      <div
        className="mb-2.5 text-xs font-bold uppercase tracking-wider"
        style={{ color: "#f59e0b" }}
      >
        Elimination odds
      </div>
      <div className="space-y-1.5">
        {rows.map((r, i) => (
          <div key={i} className="flex items-center gap-2.5">
            <div className="flex min-w-[100px] gap-1">
              {[0, 1, 2, 3].map((j) => {
                const isEliminated = j < r.eliminated;
                const isTarget =
                  j === r.eliminated && r.eliminated < 4;
                return (
                  <div
                    key={j}
                    className="flex h-[18px] w-[18px] items-center justify-center rounded text-[8px]"
                    style={{
                      background: isEliminated
                        ? "rgba(239,68,68,.2)"
                        : isTarget
                          ? "rgba(34,197,94,.2)"
                          : "var(--color-border-default)",
                      border: `1px solid ${
                        isEliminated
                          ? "#ef4444"
                          : isTarget
                            ? "#22c55e"
                            : "var(--color-border-default)"
                      }`,
                      color: isEliminated
                        ? "#ef4444"
                        : "var(--color-text-muted)",
                    }}
                  >
                    {isEliminated
                      ? "X"
                      : String.fromCharCode(65 + j)}
                  </div>
                );
              })}
            </div>
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-border-default">
              <div
                className="h-full rounded-full"
                style={{ width: `${r.pct}%`, background: r.color }}
              />
            </div>
            <span
              className="min-w-[40px] text-[13px] font-extrabold"
              style={{ color: r.color }}
            >
              {r.odds}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Slide 6: Strategy Grid ── */
export function StrategyGridVisual() {
  const strategies = [
    {
      cat: "Conventions",
      tip: "Identify the rule, apply, move on",
      speed: "Fast",
      color: "#22c55e",
    },
    {
      cat: "Vocabulary",
      tip: "Tone \u2192 context clues \u2192 eliminate \u2192 secondary meanings",
      speed: "Fast",
      color: "#3b82f6",
    },
    {
      cat: "Structure",
      tip: "What is the author DOING?",
      speed: "Med",
      color: "#f59e0b",
    },
    {
      cat: "Info & Ideas",
      tip: "Answer is always in the passage",
      speed: "Med-Slow",
      color: "#8b5cf6",
    },
    {
      cat: "Expression",
      tip: "Read the GOAL first",
      speed: "Med",
      color: "#06b6d4",
    },
  ];

  return (
    <div className="space-y-1 px-5 py-3">
      {strategies.map((s, i) => (
        <div
          key={i}
          className="flex items-center gap-2.5 rounded-r-md border-l-[3px] px-2.5 py-1.5"
          style={{
            borderColor: s.color,
            background: `${s.color}0a`,
          }}
        >
          <span
            className="min-w-[80px] text-[11px] font-bold"
            style={{ color: s.color }}
          >
            {s.cat}
          </span>
          <span className="flex-1 text-[11px] text-text-secondary">
            {s.tip}
          </span>
          <span className="text-[10px] font-semibold text-text-muted">
            {s.speed}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ── Slide 8: Score Targets ── */
export function ScoreTargetsVisual() {
  const targets = [
    {
      score: "500-550",
      correct: "~15-18/27",
      focus: "Conventions + easy vocab",
      color: "#475569",
    },
    {
      score: "550-600",
      correct: "~18-21/27",
      focus: "+ detail & central idea",
      color: "#3b82f6",
    },
    {
      score: "600-650",
      correct: "~21-23/27",
      focus: "+ evidence & inference",
      color: "#f59e0b",
    },
    {
      score: "650-700",
      correct: "~23-25/27",
      focus: "+ synthesis & reasoning",
      color: "#8b5cf6",
    },
    {
      score: "700+",
      correct: "25-27/27",
      focus: "Near-perfect M1 + strong hard M2",
      color: ACCENT,
    },
  ];

  return (
    <div className="px-5 py-3">
      <div
        className="mb-2.5 text-xs font-bold uppercase tracking-wider"
        style={{ color: "#f59e0b" }}
      >
        Target accuracy by score goal
      </div>
      <div className="space-y-1">
        {targets.map((s, i) => (
          <div
            key={i}
            className="flex items-center gap-2.5 rounded-r-md border-l-[3px] px-2.5 py-1.5"
            style={{
              borderColor: s.color,
              background: `${s.color}0a`,
            }}
          >
            <span
              className="min-w-[55px] text-xs font-extrabold"
              style={{ color: s.color }}
            >
              {s.score}
            </span>
            <span className="min-w-[75px] text-[11px] font-semibold text-text-primary">
              {s.correct}
            </span>
            <span className="text-[11px] text-text-secondary">
              {s.focus}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
