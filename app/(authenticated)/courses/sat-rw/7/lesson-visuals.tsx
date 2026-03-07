"use client";

const ACCENT = "#C8102E";

/* ── Slide: Stats Visual ── */
export function StatsVisual() {
  const stats = [
    { n: "2-3", label: "per test", sub: "Text Structure & Purpose" },
    { n: "~1", label: "per test", sub: "Cross-Text Connections" },
    { n: "5-6%", label: "of section", sub: "Small but high-value" },
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

/* ── Slide: Purpose Types ── */
export function PurposeTypesVisual() {
  const types = [
    { label: "Inform / Describe", signal: "\"Researchers have developed...\"", color: "#3b82f6" },
    { label: "Argue / Persuade", signal: "\"The conventional explanation fails to...\"", color: "#ef4444" },
    { label: "Compare / Contrast", signal: "\"While traditional methods...the new approach...\"", color: "#a855f7" },
    { label: "Qualify / Complicate", signal: "\"Although useful, recent findings suggest...\"", color: "#f59e0b" },
    { label: "Introduce / Contextualize", signal: "\"For centuries, scholars assumed...However...\"", color: "#10b981" },
  ];

  return (
    <div className="space-y-1.5 px-5 py-3">
      <div
        className="mb-2.5 text-xs font-bold uppercase tracking-[1px]"
        style={{ color: ACCENT }}
      >
        Common Passage Purposes
      </div>
      {types.map((t, i) => (
        <div
          key={i}
          className="flex gap-2.5 rounded-r-lg p-2 pl-3"
          style={{
            borderLeft: `3px solid ${t.color}`,
            background: `${t.color}08`,
          }}
        >
          <div className="min-w-[120px]">
            <div className="text-xs font-extrabold" style={{ color: t.color }}>
              {t.label}
            </div>
          </div>
          <div className="font-serif text-[11px] italic text-text-muted">
            {t.signal}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Slide: Sentence Function Roles ── */
export function SentenceRolesVisual() {
  const roles = [
    { role: "Claim", detail: "States the main argument", color: "#ef4444" },
    { role: "Evidence", detail: "Data, examples, facts supporting a claim", color: "#3b82f6" },
    { role: "Counterpoint", detail: "Presents an opposing view", color: "#a855f7" },
    { role: "Concession", detail: "Acknowledges a limitation", color: "#f59e0b" },
    { role: "Transition", detail: "Shifts from one idea to the next", color: "#10b981" },
    { role: "Context", detail: "Provides background information", color: "#6b7280" },
  ];

  return (
    <div className="px-5 py-3">
      <div
        className="mb-2.5 text-xs font-bold uppercase tracking-[1px]"
        style={{ color: ACCENT }}
      >
        Every sentence has a job
      </div>
      <div className="grid grid-cols-2 gap-2">
        {roles.map((r, i) => (
          <div
            key={i}
            className="rounded-[10px] border-l-[3px] px-3 py-2"
            style={{ borderColor: r.color, background: `${r.color}08` }}
          >
            <div className="text-[12px] font-bold" style={{ color: r.color }}>
              {r.role}
            </div>
            <div className="text-[10px] text-text-muted">{r.detail}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Slide: Cross-Text Relationships ── */
export function CrossTextVisual() {
  const relationships = [
    { type: "Direct Disagreement", desc: "Opposing positions on the same issue", color: "#ef4444" },
    { type: "Qualification", desc: "Author 2 partially agrees but adds limits", color: "#f59e0b" },
    { type: "Different Scope", desc: "Same topic, different aspects", color: "#a855f7" },
    { type: "Extension", desc: "Author 2 builds on Author 1", color: "#3b82f6" },
    { type: "Evidence", desc: "One text supports/undermines the other", color: "#10b981" },
  ];

  return (
    <div className="px-5 py-3">
      <div
        className="mb-2.5 text-xs font-bold uppercase tracking-[1px]"
        style={{ color: ACCENT }}
      >
        Five Cross-Text Relationship Types
      </div>
      {relationships.map((r, i) => (
        <div
          key={i}
          className="mb-1.5 flex items-center gap-2.5 rounded-r-md p-1.5 pl-2.5"
          style={{
            borderLeft: `3px solid ${r.color}`,
            background: `${r.color}08`,
          }}
        >
          <div
            className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full text-[11px] font-black"
            style={{ background: `${r.color}22`, color: r.color }}
          >
            {i + 1}
          </div>
          <div>
            <span className="text-xs font-bold text-text-primary">
              {r.type}
            </span>
            <span className="text-[11px] text-text-muted">
              {" "}
              &mdash; {r.desc}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
