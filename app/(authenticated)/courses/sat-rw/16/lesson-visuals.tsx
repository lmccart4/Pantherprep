"use client";

const ACCENT = "#C8102E";

/* ── Boss Battle Stats ── */
export function BattleStatsVisual() {
  const stats = [
    { n: "27", label: "battle questions", sub: "All expression skills" },
    { n: "~20%", label: "of SAT R&W", sub: "Expression of Ideas" },
    { n: "5", label: "question types", sub: "Conventions, vocab, craft, info, expression" },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-4 p-4">
      {stats.map((s, i) => (
        <div
          key={i}
          className="min-w-[140px] rounded-[14px] border border-[rgba(200,16,46,.2)] bg-[rgba(200,16,46,.07)] px-6 py-4 text-center"
        >
          <div className="text-[28px] font-black" style={{ color: ACCENT }}>
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
