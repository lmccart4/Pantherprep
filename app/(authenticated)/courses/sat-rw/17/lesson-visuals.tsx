"use client";

const ACCENT = "#C8102E";

/* ── Practice Test Stats ── */
export function PracticeTestStats() {
  const stats = [
    { n: "27", label: "questions", sub: "Full-length R&W module" },
    { n: "32", label: "minutes", sub: "Real SAT timing" },
    { n: "5", label: "blocks", sub: "Conventions, vocab, craft, info, expression" },
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

/* ── Domain Coverage ── */
export function DomainCoverage() {
  const domains = [
    { label: "Conventions (Q1-5)", pct: "~26%", color: "#10b981" },
    { label: "Vocabulary (Q6-9)", pct: "~20%", color: "#3b82f6" },
    { label: "Craft & Structure (Q10-13)", pct: "~28%", color: "#a855f7" },
    { label: "Information & Ideas (Q14-20)", pct: "~26%", color: "#f59e0b" },
    { label: "Expression & Synthesis (Q21-27)", pct: "~20%", color: ACCENT },
  ];

  return (
    <div className="space-y-1.5 px-5 py-3">
      <div
        className="mb-2.5 text-xs font-bold uppercase tracking-[1px]"
        style={{ color: ACCENT }}
      >
        Practice Test Domain Coverage
      </div>
      {domains.map((d, i) => (
        <div
          key={i}
          className="flex items-center gap-2.5 rounded-r-md p-1.5 pl-2.5"
          style={{
            borderLeft: `3px solid ${d.color}`,
            background: `${d.color}08`,
          }}
        >
          <div
            className="flex h-[22px] min-w-[40px] items-center justify-center rounded-full text-[10px] font-black"
            style={{ background: `${d.color}22`, color: d.color }}
          >
            {d.pct}
          </div>
          <span className="text-xs font-bold text-text-primary">
            {d.label}
          </span>
        </div>
      ))}
    </div>
  );
}
