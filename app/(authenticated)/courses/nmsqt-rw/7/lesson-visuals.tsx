"use client";

const ACCENT = "#d4a017";

/* ── Slide 1: Stats Visual ── */
export function StatsVisual() {
  const stats = [
    { n: "~6", label: "questions/test", sub: "Structure + Cross-Text" },
    { n: "3", label: "question types", sub: "Purpose, Function, Cross-Text" },
    {
      n: "6",
      label: "sentence functions",
      sub: "Claim, Evidence, Counterpoint\u2026",
    },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-4 py-2">
      {stats.map((s, i) => (
        <div
          key={i}
          className="min-w-[140px] rounded-xl border px-6 py-4 text-center"
          style={{
            background: `${ACCENT}11`,
            borderColor: `${ACCENT}33`,
          }}
        >
          <div
            className="text-[28px] font-black"
            style={{ color: ACCENT }}
          >
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

/* ── Slide 2: Function Grid ── */
export function FunctionGridVisual() {
  const funcs = [
    { name: "Claim", color: "#f472b6", desc: "Author's position" },
    { name: "Evidence", color: "#60a5fa", desc: "Facts/studies" },
    { name: "Counterpoint", color: "#34d399", desc: "Opposing view" },
    { name: "Concession", color: "#fbbf24", desc: "Accepts counterpoint merit" },
    { name: "Transition", color: ACCENT, desc: "Shifts between ideas" },
    { name: "Context", color: "#64748b", desc: "Background/setup" },
  ];

  return (
    <div className="grid grid-cols-3 gap-2 px-1 py-2">
      {funcs.map((f, i) => (
        <div
          key={i}
          className="rounded-lg border p-3 text-center"
          style={{
            background: `${f.color}12`,
            borderColor: `${f.color}33`,
          }}
        >
          <div
            className="text-sm font-extrabold"
            style={{ color: f.color }}
          >
            {f.name}
          </div>
          <div className="mt-0.5 text-[11px] text-text-muted">{f.desc}</div>
        </div>
      ))}
    </div>
  );
}

/* ── Slide 3: Relationship Grid ── */
export function RelationshipGridVisual() {
  const rels = [
    { name: "Agreement", color: "#22c55e", icon: "\uD83E\uDD1D" },
    { name: "Disagreement", color: "#ef4444", icon: "\u2694\uFE0F" },
    { name: "Qualification", color: "#34d399", icon: "\u2696\uFE0F" },
    { name: "Extension", color: "#f472b6", icon: "\uD83D\uDD17" },
  ];

  return (
    <div className="grid grid-cols-2 gap-2.5 px-1 py-2">
      {rels.map((r, i) => (
        <div
          key={i}
          className="rounded-lg border p-3.5 text-center"
          style={{
            background: `${r.color}12`,
            borderColor: `${r.color}33`,
          }}
        >
          <div className="mb-1 text-2xl">{r.icon}</div>
          <div
            className="text-sm font-extrabold"
            style={{ color: r.color }}
          >
            {r.name}
          </div>
        </div>
      ))}
    </div>
  );
}
