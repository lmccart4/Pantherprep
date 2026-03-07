"use client";

const ACCENT = "#d4a017";

/* ── Slide 1: Evidence Strength Scale ── */
export function StrengthVisual() {
  const rows = [
    {
      label: "Direct Support",
      detail: "Proves the specific claim with data or quotation",
      color: "#22c55e",
      w: 100,
    },
    {
      label: "Partial Support",
      detail: "Addresses some parts of the claim but not all",
      color: "#34d399",
      w: 65,
    },
    {
      label: "Related but Not Supporting",
      detail: "Same topic, different point — the #1 trap",
      color: ACCENT,
      w: 35,
    },
    {
      label: "Background / Context",
      detail: "Gives context but proves nothing about the claim",
      color: "#ef4444",
      w: 15,
    },
    {
      label: "Contradicts",
      detail: "Actually weakens or opposes the claim",
      color: "#475569",
      w: 5,
    },
  ];

  return (
    <div className="space-y-2 px-1">
      <div
        className="mb-2.5 text-[11px] font-bold uppercase tracking-[1px]"
        style={{ color: "#34d399" }}
      >
        Evidence Strength
      </div>
      {rows.map((r, i) => (
        <div key={i}>
          <div className="mb-0.5 flex justify-between">
            <span
              className="text-[11px] font-bold"
              style={{ color: r.color }}
            >
              {r.label}
            </span>
            <span className="text-[10px] text-text-muted">{r.detail}</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-border-default">
            <div
              className="h-full rounded-full"
              style={{ width: `${r.w}%`, background: r.color }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Slide 2: Framework Steps ── */
export function FrameworkVisual() {
  const steps = [
    {
      n: "1",
      label: "Underline the specific assertion",
      detail: "What exactly does the claim say?",
      color: "#f472b6",
    },
    {
      n: "2",
      label: "Test each choice individually",
      detail: '"If I only had this quote, would I believe the claim?"',
      color: "#34d399",
    },
    {
      n: "3",
      label: "Eliminate by category",
      detail: "Background? Related? Contradicts? \u2192 Cut it",
      color: ACCENT,
    },
    {
      n: "4",
      label: "Confirm direct logical link",
      detail: "The answer must PROVE, not just RELATE",
      color: "#8b5cf6",
    },
    {
      n: "\u2605",
      label: "Golden Rule",
      detail: "Match evidence to the SPECIFIC claim, not the topic",
      color: "#ef4444",
    },
  ];

  return (
    <div className="space-y-1.5 px-1">
      {steps.map((s, i) => (
        <div
          key={i}
          className="flex items-center gap-2.5 rounded-r-md border-l-[3px] px-2.5 py-1.5"
          style={{
            borderColor: s.color,
            background: `${s.color}08`,
          }}
        >
          <div
            className="flex h-[22px] w-[22px] flex-shrink-0 items-center justify-center rounded-full text-[11px] font-black"
            style={{ background: `${s.color}22`, color: s.color }}
          >
            {s.n}
          </div>
          <div>
            <span className="text-xs font-bold text-text-primary">
              {s.label}
            </span>
            <span className="text-[11px] text-text-muted"> — {s.detail}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Slide 3: Scope Visual ── */
export function ScopeVisual() {
  const rows = [
    {
      label: "Cherry-Picked",
      example: '"Germany increased from 31% to 52%"',
      note: "One data point — doesn't support a comparison claim",
      color: "#ef4444",
    },
    {
      label: "Comprehensive",
      example:
        '"All three European countries increased 12+ pp vs. 7\u201310 pp for non-European"',
      note: "Full comparison — addresses all relevant data",
      color: "#22c55e",
    },
    {
      label: "Off-Target",
      example: '"All five countries increased their renewable share"',
      note: "True but doesn't address the specific claim",
      color: ACCENT,
    },
  ];

  return (
    <div className="space-y-2 px-1">
      <div
        className="mb-2.5 text-[11px] font-bold uppercase tracking-[1px]"
        style={{ color: "#34d399" }}
      >
        Finding the right scope of data
      </div>
      {rows.map((r, i) => (
        <div
          key={i}
          className="flex gap-2.5 rounded-r-lg border-l-[3px] p-2"
          style={{
            borderColor: r.color,
            background: `${r.color}08`,
          }}
        >
          <div className="min-w-[90px]">
            <div
              className="text-xs font-extrabold"
              style={{ color: r.color }}
            >
              {r.label}
            </div>
          </div>
          <div>
            <div className="text-xs italic text-text-primary">
              {r.example}
            </div>
            <div className="mt-0.5 text-[10px] text-text-muted">
              {r.note}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
