"use client";

import { useState, useCallback } from "react";

interface ErrorEntry {
  questionNum: string;
  domain: string;
  errorType: string | null;
  notes: string;
}

interface ErrorAnalysisWorksheetProps {
  /** Domain options for the dropdown */
  domains: string[];
  /** Test label for display (e.g., "SAT Math", "PSAT 8/9 R&W") */
  testLabel: string;
  accentColor: string;
  onComplete: () => void;
}

const ERROR_TYPES = [
  { label: "Content Gap", color: "#ef4444", desc: "Didn\u2019t know the concept or formula" },
  { label: "Careless/Arithmetic", color: "#f59e0b", desc: "Knew it but made a silly mistake" },
  { label: "Misread/Trap", color: "#a855f7", desc: "Solved correctly but answered wrong thing" },
  { label: "Time Pressure", color: "#6b7280", desc: "Ran out of time or rushed" },
  { label: "Strategy Gap", color: "#3b82f6", desc: "Used an inefficient approach" },
];

export function ErrorAnalysisWorksheet({
  domains,
  testLabel,
  accentColor,
  onComplete,
}: ErrorAnalysisWorksheetProps) {
  const [entries, setEntries] = useState<ErrorEntry[]>([
    { questionNum: "", domain: domains[0] || "", errorType: null, notes: "" },
  ]);
  const [showSummary, setShowSummary] = useState(false);

  const addEntry = useCallback(() => {
    setEntries((prev) => [
      ...prev,
      { questionNum: "", domain: domains[0] || "", errorType: null, notes: "" },
    ]);
  }, [domains]);

  const updateEntry = useCallback(
    (index: number, field: keyof ErrorEntry, value: string | null) => {
      setEntries((prev) => {
        const next = [...prev];
        next[index] = { ...next[index], [field]: value };
        return next;
      });
    },
    []
  );

  const removeEntry = useCallback((index: number) => {
    setEntries((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const classifiedCount = entries.filter((e) => e.errorType !== null).length;
  const allClassified = entries.length > 0 && classifiedCount === entries.length;

  // Summary stats
  const typeCounts: Record<string, number> = {};
  ERROR_TYPES.forEach((t) => (typeCounts[t.label] = 0));
  entries.forEach((e) => {
    if (e.errorType) typeCounts[e.errorType] = (typeCounts[e.errorType] || 0) + 1;
  });

  const domainCounts: Record<string, number> = {};
  entries.forEach((e) => {
    if (e.domain) domainCounts[e.domain] = (domainCounts[e.domain] || 0) + 1;
  });

  const topErrorType = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0];

  function generateAdvice(): string {
    if (!topErrorType || topErrorType[1] === 0) return "";
    const total = entries.length;
    const careless = typeCounts["Careless/Arithmetic"] || 0;
    const content = typeCounts["Content Gap"] || 0;
    const misread = typeCounts["Misread/Trap"] || 0;
    const time = typeCounts["Time Pressure"] || 0;
    const strategy = typeCounts["Strategy Gap"] || 0;

    const parts: string[] = [];
    if (careless > content && careless >= 2)
      parts.push(
        `${careless} of ${total} errors are careless mistakes. You know the material \u2014 slow down on Module 1 and double-check before moving on.`
      );
    if (content >= 3)
      parts.push(
        `${content} concept gaps found. These are your highest-ROI improvements \u2014 review the relevant course modules for these topics.`
      );
    if (misread >= 2)
      parts.push(
        `${misread} misread/trap errors. Build the habit of underlining what the question asks BEFORE selecting your answer.`
      );
    if (time >= 2)
      parts.push(
        `${time} time pressure errors. Practice the two-pass system: confident questions first, flagged questions second.`
      );
    if (strategy >= 2)
      parts.push(
        `${strategy} strategy errors. Review efficient techniques (Plug In, Backsolve, Desmos) for faster problem-solving.`
      );
    if (parts.length === 0)
      parts.push("Review each error entry and focus your study on the patterns you see.");
    return parts.join(" ");
  }

  return (
    <div className="mx-auto min-h-screen max-w-[780px] px-6 pb-16 pt-12">
      <div
        className="mb-2.5 text-[11px] font-bold uppercase tracking-[2.5px] opacity-80"
        style={{ color: accentColor }}
      >
        Interactive Tool
      </div>
      <h2 className="mb-1 font-display text-[clamp(1.4rem,3.5vw,2rem)] font-bold text-text-primary">
        Error Analysis Worksheet
      </h2>
      <p className="mb-7 text-sm leading-[1.8] text-text-secondary">
        For every missed or uncertain question on your {testLabel} test, add an entry below. Classify
        each error to reveal where your study time will have the most impact.
      </p>

      {/* Entries */}
      <div className="flex flex-col gap-4">
        {entries.map((entry, i) => (
          <div
            key={i}
            className="rounded-[18px] border p-5 transition-all"
            style={{
              background: "rgba(15,15,22,.75)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              borderColor: entry.errorType
                ? `${ERROR_TYPES.find((t) => t.label === entry.errorType)?.color || accentColor}30`
                : "rgba(255,255,255,.05)",
              boxShadow: "0 4px 32px rgba(0,0,0,.2), inset 0 1px 0 rgba(255,255,255,.03)",
            }}
          >
            <div className="mb-4 flex items-center justify-between">
              <span className="text-[13px] font-semibold text-text-muted">Entry {i + 1}</span>
              {entries.length > 1 && (
                <button
                  onClick={() => removeEntry(i)}
                  className="cursor-pointer rounded-md border border-transparent px-2 py-0.5 text-[12px] text-text-muted transition-colors hover:border-[rgba(239,68,68,.3)] hover:text-[#ef4444]"
                  style={{ background: "transparent" }}
                >
                  Remove
                </button>
              )}
            </div>

            {/* Q# and Domain row */}
            <div className="mb-4 grid grid-cols-[100px_1fr] gap-3">
              <div>
                <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">
                  Q #
                </label>
                <input
                  type="text"
                  placeholder="e.g. 14"
                  value={entry.questionNum}
                  onChange={(e) => updateEntry(i, "questionNum", e.target.value)}
                  className="w-full rounded-lg border px-3 py-2 font-mono text-[15px] text-text-primary outline-none"
                  style={{
                    background: "rgba(8,8,12,.5)",
                    borderColor: "rgba(255,255,255,.08)",
                  }}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">
                  Domain
                </label>
                <select
                  value={entry.domain}
                  onChange={(e) => updateEntry(i, "domain", e.target.value)}
                  className="w-full rounded-lg border px-3 py-2 text-[14px] text-text-primary outline-none"
                  style={{
                    background: "rgba(8,8,12,.5)",
                    borderColor: "rgba(255,255,255,.08)",
                  }}
                >
                  {domains.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Error type buttons */}
            <div className="mb-4">
              <label className="mb-2 block text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">
                Error Type
              </label>
              <div className="flex flex-wrap gap-2">
                {ERROR_TYPES.map((t) => (
                  <button
                    key={t.label}
                    onClick={() => updateEntry(i, "errorType", t.label)}
                    className="cursor-pointer rounded-lg border px-3 py-2 text-[13px] transition-all"
                    style={{
                      background:
                        entry.errorType === t.label ? `${t.color}15` : "rgba(8,8,12,.4)",
                      borderColor:
                        entry.errorType === t.label ? `${t.color}40` : "rgba(255,255,255,.06)",
                      color: entry.errorType === t.label ? t.color : "var(--color-text-muted)",
                      fontWeight: entry.errorType === t.label ? 600 : 400,
                    }}
                    title={t.desc}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">
                What should I have done?
              </label>
              <input
                type="text"
                placeholder="e.g. Check what the question asks for before answering"
                value={entry.notes}
                onChange={(e) => updateEntry(i, "notes", e.target.value)}
                className="w-full rounded-lg border px-3 py-2.5 text-[14px] text-text-primary outline-none"
                style={{
                  background: "rgba(8,8,12,.5)",
                  borderColor: "rgba(255,255,255,.08)",
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Add entry + progress */}
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          onClick={addEntry}
          className="cursor-pointer rounded-xl border px-5 py-2.5 text-[14px] font-semibold transition-all hover:brightness-110"
          style={{
            background: `${accentColor}12`,
            borderColor: `${accentColor}30`,
            color: accentColor,
          }}
        >
          + Add Entry
        </button>
        <span className="text-[13px] text-text-muted">
          {classifiedCount}/{entries.length} classified
        </span>
      </div>

      {/* Summary button */}
      {allClassified && entries.length >= 1 && !showSummary && (
        <div className="mt-6 text-center">
          <button
            onClick={() => setShowSummary(true)}
            className="cursor-pointer rounded-xl border-none px-8 py-3 text-sm font-bold text-ink transition-all hover:scale-[1.03] hover:brightness-110"
            style={{ background: `linear-gradient(135deg, ${accentColor}, #a855f7)` }}
          >
            View Error Summary
          </button>
        </div>
      )}

      {/* Summary panel */}
      {showSummary && (
        <div
          className="mt-8 rounded-[18px] border p-8"
          style={{
            background: "rgba(15,15,22,.75)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderColor: `${accentColor}20`,
            boxShadow: `0 4px 32px rgba(0,0,0,.2), 0 0 40px ${accentColor}10`,
          }}
        >
          <div
            className="mb-5 text-[11px] font-bold uppercase tracking-[2.5px]"
            style={{ color: accentColor }}
          >
            Error Summary
          </div>

          {/* Type breakdown */}
          <div className="mb-6 grid grid-cols-5 gap-2">
            {ERROR_TYPES.map((t) => (
              <div
                key={t.label}
                className="rounded-[14px] border px-3 py-4 text-center"
                style={{
                  background: "rgba(8,8,12,.5)",
                  borderColor: typeCounts[t.label] > 0 ? `${t.color}25` : "rgba(255,255,255,.06)",
                }}
              >
                <div className="font-mono text-[1.8rem] font-bold" style={{ color: t.color }}>
                  {typeCounts[t.label]}
                </div>
                <div className="mt-1 text-[10px] leading-tight text-text-muted">{t.label}</div>
              </div>
            ))}
          </div>

          {/* Domain breakdown */}
          {Object.keys(domainCounts).length > 1 && (
            <div className="mb-6">
              <div className="mb-3 text-[12px] font-semibold text-text-muted">Errors by Domain</div>
              <div className="flex flex-col gap-2">
                {Object.entries(domainCounts)
                  .sort((a, b) => b[1] - a[1])
                  .map(([d, count]) => (
                    <div key={d} className="flex items-center gap-3">
                      <span className="w-40 text-[14px] text-[#bcbcc8]">{d}</span>
                      <div
                        className="h-[6px] flex-1 overflow-hidden rounded-full"
                        style={{ background: "rgba(255,255,255,.06)" }}
                      >
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${(count / entries.length) * 100}%`,
                            background: accentColor,
                          }}
                        />
                      </div>
                      <span className="w-6 text-right font-mono text-[14px] text-text-muted">
                        {count}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Actionable advice */}
          {generateAdvice() && (
            <div
              className="rounded-[12px] border-l-[3px] px-5 py-4 text-[14px] leading-[1.7]"
              style={{
                background: "rgba(8,8,12,.5)",
                borderColor: topErrorType
                  ? ERROR_TYPES.find((t) => t.label === topErrorType[0])?.color || accentColor
                  : accentColor,
                color: "#a0a0b0",
              }}
            >
              <strong className="text-text-primary">Action Plan: </strong>
              {generateAdvice()}
            </div>
          )}

          {/* Continue */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={onComplete}
              className="cursor-pointer rounded-xl border-none px-7 py-3 text-sm font-bold text-ink transition-all hover:scale-[1.03] hover:brightness-110"
              style={{ background: `linear-gradient(135deg, ${accentColor}, #a855f7)` }}
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
