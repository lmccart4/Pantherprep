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
    { n: "2-3", label: "per test", sub: "Strengthen/Weaken" },
    { n: "1-2", label: "per test", sub: "Logical Completion" },
    { n: "~1", label: "per test", sub: "Synthesis" },
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

/* ── Slide 2: Anatomy Visual (Parts of an Argument) ── */
export function AnatomyVisual() {
  const parts = [
    { part: "Claim", example: "Urban gardens improve community health", color: RED, icon: "\uD83D\uDCCC" },
    { part: "Evidence", example: "15% lower depression in garden neighborhoods", color: BLUE, icon: "\uD83D\uDCCA" },
    { part: "Reasoning", example: "Green space + social interaction reduces stress", color: GREEN, icon: "\uD83D\uDD17" },
    { part: "Assumption", example: "Gardens caused the improvement (not reverse)", color: AMBER, icon: "\uD83D\uDD0D" },
  ];

  return (
    <div className="space-y-1.5 px-5 py-3">
      <div
        className="mb-2.5 text-xs font-bold uppercase tracking-[1px]"
        style={{ color: ACCENT }}
      >
        Parts of an argument
      </div>
      {parts.map((s, i) => (
        <div
          key={i}
          className="flex items-center gap-2.5 rounded-r-lg p-2 pl-3"
          style={{
            borderLeft: `3px solid ${s.color}`,
            background: `${s.color}08`,
          }}
        >
          <span className="text-base">{s.icon}</span>
          <div className="min-w-[75px]">
            <span className="text-xs font-extrabold" style={{ color: s.color }}>
              {s.part}
            </span>
          </div>
          <span className="text-xs text-text-secondary">{s.example}</span>
        </div>
      ))}
    </div>
  );
}

/* ── Slide 3: Strengthen/Weaken Examples ── */
export function StrengthenExamplesVisual() {
  return (
    <div className="grid grid-cols-2 gap-2.5 px-5 py-3">
      <div
        className="rounded-[10px] border p-3"
        style={{ background: `${GREEN}08`, borderColor: `${GREEN}22` }}
      >
        <div className="mb-1.5 text-xs font-bold" style={{ color: GREEN }}>
          STRENGTHEN by:
        </div>
        {[
          "Eliminating alternatives",
          "Additional supporting evidence",
          "Confirming an assumption",
          "Pattern holds in new contexts",
        ].map((s, i) => (
          <div key={i} className="mb-0.5 text-[11px] text-text-secondary">
            + {s}
          </div>
        ))}
      </div>
      <div
        className="rounded-[10px] border p-3"
        style={{ background: `${RED}08`, borderColor: `${RED}22` }}
      >
        <div className="mb-1.5 text-xs font-bold" style={{ color: RED }}>
          WEAKEN by:
        </div>
        {[
          "Alternative explanation",
          "Contradicting evidence",
          "Undermining assumption",
          "Confounding variable",
        ].map((s, i) => (
          <div key={i} className="mb-0.5 text-[11px] text-text-secondary">
            - {s}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Slide 4: Causal Traps ── */
export function CausalTrapsVisual() {
  const traps = [
    { trap: "Correlation \u2260 Causation", example: "Ice cream sales + drowning both rise in summer", color: RED },
    { trap: "Reverse Causation", example: "Happy people exercise OR exercise makes people happy?", color: AMBER },
    { trap: "Confounding Variable", example: "Coffee drinkers live longer... or richer people do?", color: PURPLE },
    { trap: "Selection Bias", example: '"Our customers love us" \u2014 unhappy ones already left', color: CYAN },
  ];

  return (
    <div className="space-y-1.5 px-5 py-3">
      <div
        className="mb-2.5 text-xs font-bold uppercase tracking-[1px]"
        style={{ color: RED }}
      >
        Causal reasoning traps
      </div>
      {traps.map((s, i) => (
        <div
          key={i}
          className="flex gap-2.5 rounded-r-lg p-2 pl-3"
          style={{
            borderLeft: `3px solid ${s.color}`,
            background: `${s.color}08`,
          }}
        >
          <div className="min-w-[120px]">
            <span className="text-xs font-bold" style={{ color: s.color }}>
              {s.trap}
            </span>
          </div>
          <span className="text-[11px] text-text-muted">{s.example}</span>
        </div>
      ))}
    </div>
  );
}

/* ── Slide 5: Framework Visual ── */
export function FrameworkVisual() {
  const steps = [
    { n: "1", label: "Identify claim, evidence, reasoning", color: BLUE },
    { n: "2", label: "Find the gap / hidden assumption", color: PURPLE },
    { n: "3", label: "Strengthen: fill the gap", color: GREEN },
    { n: "4", label: "Weaken: expose the gap", color: RED },
    { n: "5", label: "Completion: choose the most moderate conclusion", color: AMBER },
    { n: "\u2605", label: "Extreme/absolute conclusions are almost always wrong", color: RED },
  ];

  return (
    <div className="space-y-1.5 px-5 py-3">
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
          <span className="text-xs font-semibold text-text-primary">
            {s.label}
          </span>
        </div>
      ))}
    </div>
  );
}
