"use client";

import { useState } from "react";

interface GrowthTrackerProps {
  /** Test type for score scaling */
  testType: "sat" | "nmsqt" | "psat89";
  /** Section */
  section: "math" | "rw";
  /** Total questions on the test */
  totalQuestions: number;
  accentColor: string;
  /** Domain-to-module mapping for recommendations */
  domainModules?: Record<string, string>;
  onComplete: () => void;
}

const SCORE_RANGES: Record<string, { min: number; max: number; label: string }> = {
  sat: { min: 200, max: 800, label: "SAT" },
  nmsqt: { min: 160, max: 760, label: "PSAT/NMSQT" },
  psat89: { min: 120, max: 720, label: "PSAT 8/9" },
};

export function GrowthTracker({
  testType,
  section,
  totalQuestions,
  accentColor,
  domainModules,
  onComplete,
}: GrowthTrackerProps) {
  const [baselineRaw, setBaselineRaw] = useState<string>("");
  const [practiceRaw, setPracticeRaw] = useState<string>("");

  const range = SCORE_RANGES[testType];
  const spread = range.max - range.min;

  function rawToScaled(raw: number): number {
    const pct = raw / totalQuestions;
    return Math.min(Math.max(Math.round(range.min + pct * spread), range.min), range.max);
  }

  const baseNum = parseInt(baselineRaw);
  const practNum = parseInt(practiceRaw);
  const hasBaseline = !isNaN(baseNum) && baseNum >= 0 && baseNum <= totalQuestions;
  const hasPractice = !isNaN(practNum) && practNum >= 0 && practNum <= totalQuestions;
  const hasBoth = hasBaseline && hasPractice;

  const baseScaled = hasBaseline ? rawToScaled(baseNum) : 0;
  const practScaled = hasPractice ? rawToScaled(practNum) : 0;
  const rawDiff = hasBoth ? practNum - baseNum : 0;
  const scaledDiff = hasBoth ? practScaled - baseScaled : 0;

  const sectionLabel = section === "math" ? "Math" : "Reading & Writing";

  return (
    <div className="mx-auto min-h-screen max-w-[780px] px-6 pb-16 pt-12">
      <div
        className="mb-2.5 text-[11px] font-bold uppercase tracking-[2.5px] opacity-80"
        style={{ color: accentColor }}
      >
        Growth Tracker
      </div>
      <h2 className="mb-1 font-display text-[clamp(1.4rem,3.5vw,2rem)] font-bold text-text-primary">
        Measure Your Progress
      </h2>
      <p className="mb-7 text-sm leading-[1.8] text-text-secondary">
        Enter your Module 1 diagnostic raw score and your practice test raw score to see how much
        you&apos;ve grown in {range.label} {sectionLabel}.
      </p>

      {/* Score inputs */}
      <div
        className="mb-8 rounded-[18px] border p-6"
        style={{
          background: "rgba(15,15,22,.75)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderColor: "rgba(255,255,255,.05)",
          boxShadow: "0 4px 32px rgba(0,0,0,.2), inset 0 1px 0 rgba(255,255,255,.03)",
        }}
      >
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="mb-2 block text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">
              Diagnostic Raw Score
            </label>
            <div className="flex items-baseline gap-2">
              <input
                type="number"
                min={0}
                max={totalQuestions}
                placeholder="0"
                value={baselineRaw}
                onChange={(e) => setBaselineRaw(e.target.value)}
                className="w-20 rounded-lg border px-3 py-2.5 text-center font-mono text-[1.3rem] font-bold text-text-primary outline-none"
                style={{
                  background: "rgba(8,8,12,.5)",
                  borderColor: "rgba(255,255,255,.08)",
                }}
              />
              <span className="text-[14px] text-text-muted">/ {totalQuestions}</span>
            </div>
            {hasBaseline && (
              <div className="mt-2 text-[13px] text-text-muted">
                Est. scaled: <span className="font-mono font-semibold text-text-primary">{baseScaled}</span>
              </div>
            )}
          </div>
          <div>
            <label className="mb-2 block text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">
              Practice Test Raw Score
            </label>
            <div className="flex items-baseline gap-2">
              <input
                type="number"
                min={0}
                max={totalQuestions}
                placeholder="0"
                value={practiceRaw}
                onChange={(e) => setPracticeRaw(e.target.value)}
                className="w-20 rounded-lg border px-3 py-2.5 text-center font-mono text-[1.3rem] font-bold text-text-primary outline-none"
                style={{
                  background: "rgba(8,8,12,.5)",
                  borderColor: "rgba(255,255,255,.08)",
                }}
              />
              <span className="text-[14px] text-text-muted">/ {totalQuestions}</span>
            </div>
            {hasPractice && (
              <div className="mt-2 text-[13px] text-text-muted">
                Est. scaled: <span className="font-mono font-semibold text-text-primary">{practScaled}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Results */}
      {hasBoth && (
        <div
          className="mb-8 rounded-[18px] border p-8"
          style={{
            background: "rgba(15,15,22,.75)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderColor:
              rawDiff > 0
                ? "rgba(34,197,94,.15)"
                : rawDiff === 0
                  ? "rgba(251,191,36,.15)"
                  : "rgba(251,191,36,.15)",
            boxShadow: `0 4px 32px rgba(0,0,0,.2), 0 0 40px ${accentColor}10`,
          }}
        >
          {/* Growth headline */}
          <div className="mb-6 text-center">
            {rawDiff > 0 ? (
              <>
                <div className="font-mono text-[3rem] font-bold leading-none text-[#22c55e]">
                  +{rawDiff}
                </div>
                <div className="mt-2 text-[15px] text-[#22c55e]">
                  questions improved! (~+{scaledDiff} scaled points)
                </div>
              </>
            ) : rawDiff === 0 ? (
              <>
                <div className="font-mono text-[3rem] font-bold leading-none text-[#f59e0b]">
                  \u00B10
                </div>
                <div className="mt-2 text-[15px] text-[#bcbcc8]">
                  Same score. Focus on error analysis to identify where to break through.
                </div>
              </>
            ) : (
              <>
                <div className="font-mono text-[3rem] font-bold leading-none text-[#f59e0b]">
                  {rawDiff}
                </div>
                <div className="mt-2 text-[15px] text-[#bcbcc8]">
                  Practice test conditions can be harder than a diagnostic. Focus on error types
                  above \u2014 especially careless mistakes.
                </div>
              </>
            )}
          </div>

          {/* Visual comparison bars */}
          <div className="mb-6">
            <div className="mb-3 flex items-center gap-3">
              <span className="w-24 text-[13px] text-text-muted">Diagnostic</span>
              <div
                className="h-[10px] flex-1 overflow-hidden rounded-full"
                style={{ background: "rgba(255,255,255,.06)" }}
              >
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${(baseNum / totalQuestions) * 100}%`,
                    background: "rgba(255,255,255,.25)",
                  }}
                />
              </div>
              <span className="w-12 text-right font-mono text-[14px] text-text-muted">
                {baseNum}/{totalQuestions}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-24 text-[13px] text-text-muted">Practice</span>
              <div
                className="h-[10px] flex-1 overflow-hidden rounded-full"
                style={{ background: "rgba(255,255,255,.06)" }}
              >
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${(practNum / totalQuestions) * 100}%`,
                    background:
                      rawDiff > 0
                        ? "#22c55e"
                        : rawDiff === 0
                          ? "#f59e0b"
                          : "#f59e0b",
                  }}
                />
              </div>
              <span className="w-12 text-right font-mono text-[14px] text-text-muted">
                {practNum}/{totalQuestions}
              </span>
            </div>
          </div>

          {/* Score projections */}
          <div className="mb-6 grid grid-cols-3 gap-3">
            {[
              {
                label: range.label,
                baseline: baseScaled,
                practice: practScaled,
                color: accentColor,
              },
              ...(testType === "psat89"
                ? [
                    {
                      label: "PSAT 10 (proj.)",
                      baseline: Math.round(160 + (baseNum / totalQuestions) * 600),
                      practice: Math.round(160 + (practNum / totalQuestions) * 600),
                      color: "#d4a017",
                    },
                    {
                      label: "SAT (proj.)",
                      baseline: Math.round(200 + (baseNum / totalQuestions) * 600),
                      practice: Math.round(200 + (practNum / totalQuestions) * 600),
                      color: "#C8102E",
                    },
                  ]
                : testType === "nmsqt"
                  ? [
                      {
                        label: "SAT (proj.)",
                        baseline: Math.round(200 + (baseNum / totalQuestions) * 600),
                        practice: Math.round(200 + (practNum / totalQuestions) * 600),
                        color: "#C8102E",
                      },
                    ]
                  : []),
            ].map((proj) => (
              <div
                key={proj.label}
                className="rounded-[14px] border px-4 py-4 text-center"
                style={{
                  background: "rgba(8,8,12,.5)",
                  borderColor: "rgba(255,255,255,.06)",
                }}
              >
                <div className="mb-1 text-[10px] font-bold uppercase tracking-[1.5px] text-text-muted">
                  {proj.label}
                </div>
                <div className="font-mono text-[1.4rem] font-bold" style={{ color: proj.color }}>
                  {proj.baseline} &rarr; {proj.practice}
                </div>
                {proj.practice > proj.baseline && (
                  <div className="mt-1 text-[12px] font-semibold text-[#22c55e]">
                    +{proj.practice - proj.baseline}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Domain module recommendations */}
          {domainModules && rawDiff <= 0 && (
            <div
              className="rounded-[12px] border-l-[3px] px-5 py-4 text-[14px] leading-[1.7]"
              style={{
                background: "rgba(8,8,12,.5)",
                borderColor: "#f59e0b",
                color: "#a0a0b0",
              }}
            >
              <strong className="text-text-primary">Focus areas: </strong>
              Use your error analysis to identify weak domains, then review:{" "}
              {Object.entries(domainModules)
                .map(([d, m]) => `${d} \u2192 ${m}`)
                .join(", ")}
              .
            </div>
          )}

          {rawDiff > 0 && (
            <div
              className="rounded-[12px] border-l-[3px] px-5 py-4 text-[14px] leading-[1.7]"
              style={{
                background: "rgba(8,8,12,.5)",
                borderColor: "#22c55e",
                color: "#a0a0b0",
              }}
            >
              <strong className="text-[#22c55e]">Keep building momentum! </strong>
              Your improvement shows your study strategy is working. Focus on the error analysis to
              find the remaining gaps for even more growth.
            </div>
          )}
        </div>
      )}

      {/* Continue */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={onComplete}
          className="cursor-pointer rounded-xl border-none px-7 py-3 text-sm font-bold text-white transition-all hover:scale-[1.03] hover:brightness-110"
          style={{ background: `linear-gradient(135deg, ${accentColor}, #a855f7)` }}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
