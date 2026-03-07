"use client";

const ACCENT = "#C8102E";

/* ── Slide: Test Format Overview ── */
export function FormatVisual() {
  const stats = [
    { n: "54", label: "total questions", sub: "Two 27-question modules" },
    { n: "64", label: "minutes total", sub: "32 min per module" },
    { n: "~71s", label: "per question", sub: "Average time budget" },
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

/* ── Slide: Four Domains Breakdown ── */
export function DomainsVisual() {
  const domains = [
    { label: "Craft & Structure", pct: "~28%", qs: "~15 Qs", color: "#a855f7" },
    { label: "Information & Ideas", pct: "~26%", qs: "~14 Qs", color: "#3b82f6" },
    { label: "Standard English Conventions", pct: "~26%", qs: "~14 Qs", color: "#10b981" },
    { label: "Expression of Ideas", pct: "~20%", qs: "~11 Qs", color: "#f59e0b" },
  ];

  return (
    <div className="space-y-2 px-5 py-3">
      <div
        className="mb-2.5 text-xs font-bold uppercase tracking-[1px]"
        style={{ color: ACCENT }}
      >
        The Four Content Domains
      </div>
      {domains.map((d, i) => (
        <div
          key={i}
          className="flex items-center gap-3 rounded-r-lg border-l-[3px] px-3 py-2.5"
          style={{ borderColor: d.color, background: `${d.color}08` }}
        >
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[12px] font-black"
            style={{ background: `${d.color}22`, color: d.color }}
          >
            {d.pct}
          </div>
          <div>
            <div className="text-[13px] font-bold text-text-primary">
              {d.label}
            </div>
            <div className="text-[11px] text-text-muted">{d.qs}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Slide: Score Ranges ── */
export function ScoreRangesVisual() {
  const ranges = [
    { range: "720-800", pct: "96th-99th+", target: "Ivy League / Top-20", color: "#10b981", bar: 100 },
    { range: "620-710", pct: "85th-95th", target: "Selective colleges / Merit", color: "#3b82f6", bar: 80 },
    { range: "530-610", pct: "65th-84th", target: "State flagships", color: "#f59e0b", bar: 60 },
    { range: "480-520", pct: "50th-64th", target: "College ready", color: "#f97316", bar: 45 },
    { range: "200-470", pct: "Below 50th", target: "Focus on Conventions", color: "#ef4444", bar: 25 },
  ];

  return (
    <div className="space-y-1.5 px-5 py-3">
      <div
        className="mb-2.5 text-xs font-bold uppercase tracking-[1px]"
        style={{ color: ACCENT }}
      >
        Score Ranges & Targets
      </div>
      {ranges.map((s, i) => (
        <div key={i}>
          <div className="mb-0.5 flex items-center justify-between">
            <span className="text-[12px] font-bold" style={{ color: s.color }}>
              {s.range}
            </span>
            <span className="text-[10px] text-text-muted">
              {s.pct} &mdash; {s.target}
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-sm bg-border-default">
            <div
              className="h-full rounded-sm"
              style={{ width: `${s.bar}%`, background: s.color }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Slide: Learning Path Roadmap ── */
export function RoadmapVisual() {
  const units = [
    { n: "1", label: "Modules 1-4", detail: "Standard English Conventions + Boss", color: "#10b981" },
    { n: "2", label: "Modules 5-8", detail: "Vocabulary & Craft + Boss", color: "#3b82f6" },
    { n: "3", label: "Modules 9-12", detail: "Information & Ideas + Boss", color: "#a855f7" },
    { n: "4", label: "Modules 13-16", detail: "Expression & Strategy + Boss", color: "#f59e0b" },
    { n: "5", label: "Modules 17-18", detail: "Practice Tests & Final Review", color: ACCENT },
  ];

  return (
    <div className="space-y-1.5 px-5 py-3">
      {units.map((s, i) => (
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

/* ── Slide: Pre-Test Checklist ── */
export function ChecklistVisual() {
  const items = [
    "Bluebook app installed",
    "Quiet testing environment",
    "Phone silenced & out of reach",
    "Scratch paper & pencil ready",
    "64 uninterrupted minutes",
    "Water bottle nearby",
    "Know your target RW score",
  ];

  return (
    <div className="px-5 py-3">
      <div
        className="mb-2.5 text-xs font-bold uppercase tracking-[1px]"
        style={{ color: ACCENT }}
      >
        Pre-Test Checklist
      </div>
      <div className="space-y-1.5">
        {items.map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-2.5 rounded-lg border border-[rgba(200,16,46,.15)] bg-[rgba(200,16,46,.04)] px-3 py-2"
          >
            <div
              className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-black"
              style={{ background: `${ACCENT}22`, color: ACCENT }}
            >
              {i + 1}
            </div>
            <span className="text-[13px] text-text-primary">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
