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
    { n: "5-6", label: "per test", sub: "Central Ideas & Details" },
    { n: "2-4", label: "per test", sub: "Inference questions" },
    { n: "100%", label: "in the passage", sub: "The answer is always there" },
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

/* ── Slide 2: Scope Visual ── */
export function ScopeVisual() {
  const items = [
    {
      label: "Too Broad",
      example: '"Science helps us understand nature"',
      color: RED,
      note: "Could describe any science passage",
    },
    {
      label: "Just Right",
      example: '"A new study challenges the assumption that X caused Y"',
      color: GREEN,
      note: "Specific to THIS passage",
    },
    {
      label: "Too Narrow",
      example: '"Pollen samples were collected from three sites"',
      color: AMBER,
      note: "One detail, not the main idea",
    },
  ];

  return (
    <div className="space-y-2 px-5 py-3">
      <div
        className="mb-2.5 text-xs font-bold uppercase tracking-[1px]"
        style={{ color: ACCENT }}
      >
        Finding the right scope
      </div>
      {items.map((s, i) => (
        <div
          key={i}
          className="flex gap-2.5 rounded-r-lg p-2 pl-3"
          style={{
            borderLeft: `3px solid ${s.color}`,
            background: `${s.color}08`,
          }}
        >
          <div className="min-w-[70px]">
            <div className="text-xs font-extrabold" style={{ color: s.color }}>
              {s.label}
            </div>
          </div>
          <div>
            <div className="font-serif text-xs italic text-text-primary">
              {s.example}
            </div>
            <div className="mt-0.5 text-[10px] text-text-muted">{s.note}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Slide 3: Inference Scale ── */
export function InferenceScaleVisual() {
  const levels = [
    { label: "Stated", example: "The passage directly says it", color: GREEN, bar: 100 },
    { label: "Strong inference", example: "Must be true based on evidence", color: BLUE, bar: 80 },
    { label: "Reasonable inference", example: "Very likely based on evidence", color: AMBER, bar: 55 },
    { label: "Weak inference", example: "Possible but requires assumptions", color: RED, bar: 30 },
    { label: "Unsupported", example: "Not based on passage evidence", color: "#475569", bar: 10 },
  ];

  return (
    <div className="space-y-1.5 px-5 py-3">
      <div
        className="mb-2.5 text-xs font-bold uppercase tracking-[1px]"
        style={{ color: ACCENT }}
      >
        Inference strength: smaller leaps are better
      </div>
      {levels.map((s, i) => (
        <div key={i}>
          <div className="mb-0.5 flex items-center justify-between">
            <span className="text-[11px] font-bold" style={{ color: s.color }}>
              {s.label}
            </span>
            <span className="text-[10px] text-text-muted">{s.example}</span>
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

/* ── Slide 4: Literary Elements ── */
export function LiteraryElementsVisual() {
  const elements = [
    { label: "Characters", detail: "Who are they? What do they feel?", color: PURPLE, icon: "\uD83D\uDC64" },
    { label: "Tone/Mood", detail: "What atmosphere is created?", color: AMBER, icon: "\uD83C\uDFAD" },
    { label: "Figurative Language", detail: "What does imagery/metaphor suggest?", color: CYAN, icon: "\u2728" },
    { label: "Emotional Arc", detail: "Does the character's feeling change?", color: RED, icon: "\uD83D\uDCC8" },
  ];

  return (
    <div className="space-y-1.5 px-5 py-3">
      <div
        className="mb-2.5 text-xs font-bold uppercase tracking-[1px]"
        style={{ color: ACCENT }}
      >
        Literary passage focus areas
      </div>
      {elements.map((s, i) => (
        <div
          key={i}
          className="flex items-center gap-2.5 rounded-r-lg p-2 pl-3"
          style={{
            borderLeft: `3px solid ${s.color}`,
            background: `${s.color}08`,
          }}
        >
          <span className="text-lg">{s.icon}</span>
          <div>
            <div className="text-xs font-bold" style={{ color: s.color }}>
              {s.label}
            </div>
            <div className="text-[10px] text-text-muted">{s.detail}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Slide 5: Framework Visual ── */
export function FrameworkVisual() {
  const steps = [
    { n: "1", label: "Read actively", detail: "Topic? Author's position? Evidence?", color: BLUE },
    { n: "2", label: "Identify question type", detail: "Central idea, detail, inference, or summary?", color: PURPLE },
    { n: "3", label: "Go back to the passage", detail: "Find the specific text that answers the question", color: GREEN },
    { n: "4", label: "Evaluate against passage", detail: "Every part of the answer must be supported", color: AMBER },
    { n: "\u2605", label: "Golden Rule", detail: "The answer is ALWAYS in the passage", color: RED },
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
          <div>
            <span className="text-xs font-bold text-text-primary">
              {s.label}
            </span>
            <span className="text-[11px] text-text-muted"> &mdash; {s.detail}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
