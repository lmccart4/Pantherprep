"use client";

import { useState, useMemo } from "react";

export interface ScoreProjectorProps {
  testType: "sat" | "nmsqt" | "psat89";
  section: "math" | "rw";
  maxM1: number;
  maxM2: number;
  accentColor: string;
  showSelectionIndex?: boolean;
  onComplete: () => void;
}

interface ScaleConfig {
  min: number;
  max: number;
  range: number;
  label: string;
  benchmark: number;
  benchmarkLabel: string;
}

function getScaleConfig(testType: "sat" | "nmsqt" | "psat89"): ScaleConfig {
  switch (testType) {
    case "sat":
      return { min: 200, max: 800, range: 600, label: "SAT", benchmark: 530, benchmarkLabel: "530 College Ready" };
    case "nmsqt":
      return { min: 160, max: 760, range: 600, label: "PSAT/NMSQT", benchmark: 520, benchmarkLabel: "520 College Ready" };
    case "psat89":
      return { min: 120, max: 720, range: 600, label: "PSAT 8/9", benchmark: 450, benchmarkLabel: "450 College Ready" };
  }
}

interface ProjectedScore {
  low: number;
  high: number;
  mid: number;
  raw: number;
  maxRaw: number;
  path: "hard" | "easy";
  color: string;
  message: string;
}

function computeScore(
  m1: number,
  m2: number,
  path: "hard" | "easy",
  maxM1: number,
  maxM2: number,
  scale: ScaleConfig,
): ProjectedScore {
  const raw = m1 + m2;
  const maxRaw = maxM1 + maxM2;
  let low: number, high: number, color: string, message: string;

  if (path === "hard") {
    if (raw >= maxRaw - 4) {
      low = scale.min + Math.round(scale.range * 0.9);
      high = scale.max;
    } else if (raw >= maxRaw - 9) {
      low = scale.min + Math.round(scale.range * 0.75);
      high = scale.min + Math.round(scale.range * 0.917);
    } else if (raw >= maxRaw - 14) {
      low = scale.min + Math.round(scale.range * 0.617);
      high = scale.min + Math.round(scale.range * 0.767);
    } else if (raw >= maxRaw - 19) {
      low = scale.min + Math.round(scale.range * 0.5);
      high = scale.min + Math.round(scale.range * 0.633);
    } else if (raw >= maxRaw - 24) {
      low = scale.min + Math.round(scale.range * 0.4);
      high = scale.min + Math.round(scale.range * 0.517);
    } else {
      low = Math.max(scale.min, scale.min + Math.round((raw / maxRaw) * scale.range * 0.8));
      high = Math.min(scale.min + Math.round(scale.range * 0.433), scale.min + Math.round((raw / maxRaw) * scale.range));
    }
    color = raw >= maxRaw - 9 ? "#22c55e" : raw >= maxRaw - 19 ? "#eab308" : "#ef4444";
    message = raw >= maxRaw - 9
      ? "Strong position! Eliminate careless errors to push higher."
      : "On the harder path -- every correct answer counts more.";
  } else {
    const ceiling = scale.min + Math.round(scale.range * 0.717);
    if (raw >= maxRaw - 4) {
      low = scale.min + Math.round(scale.range * 0.633);
      high = ceiling;
    } else if (raw >= maxRaw - 9) {
      low = scale.min + Math.round(scale.range * 0.533);
      high = scale.min + Math.round(scale.range * 0.667);
    } else if (raw >= maxRaw - 14) {
      low = scale.min + Math.round(scale.range * 0.433);
      high = scale.min + Math.round(scale.range * 0.6);
    } else if (raw >= maxRaw - 19) {
      low = scale.min + Math.round(scale.range * 0.333);
      high = scale.min + Math.round(scale.range * 0.5);
    } else {
      low = Math.max(scale.min, scale.min + Math.round((raw / maxRaw) * scale.range * 0.65));
      high = Math.min(scale.min + Math.round(scale.range * 0.383), scale.min + Math.round((raw / maxRaw) * scale.range * 0.8));
    }
    color = "#eab308";
    message = `Score capped at ~${ceiling} on the easier path. Focus on Module 1 accuracy to reach the harder path.`;
  }

  // Clamp
  low = Math.max(scale.min, Math.min(low, scale.max));
  high = Math.max(low, Math.min(high, scale.max));

  return { low, high, mid: Math.round((low + high) / 2), raw, maxRaw, path, color, message };
}

function computeSelectionIndex(rwScore: number, mathScore: number) {
  const si = Math.round((rwScore * 2 + mathScore) / 10);
  let level: string, color: string;
  if (si >= 220) {
    level = "Strong National Merit Semifinalist contender in most states";
    color = "#d4a017";
  } else if (si >= 210) {
    level = "Commended Student range -- Semifinalist in some states";
    color = "#22c55e";
  } else if (si >= 200) {
    level = "Above average -- near Commended threshold";
    color = "#eab308";
  } else {
    level = "Below Commended threshold -- focus on building core skills";
    color = "#94a3b8";
  }
  return { si, level, color };
}

export function ScoreProjector({
  testType,
  section,
  maxM1,
  maxM2,
  accentColor,
  showSelectionIndex = false,
  onComplete,
}: ScoreProjectorProps) {
  const [m1, setM1] = useState<string>("");
  const [m2, setM2] = useState<string>("");
  const [path, setPath] = useState<"" | "hard" | "easy">("");
  const [rwScore, setRwScore] = useState<string>("");
  const [mathScoreForSI, setMathScoreForSI] = useState<string>("");

  const scale = useMemo(() => getScaleConfig(testType), [testType]);

  const m1Val = parseInt(m1);
  const m2Val = parseInt(m2);
  const hasInputs = !isNaN(m1Val) && !isNaN(m2Val) && path !== "";

  const projected = useMemo(() => {
    if (!hasInputs) return null;
    return computeScore(m1Val, m2Val, path as "hard" | "easy", maxM1, maxM2, scale);
  }, [hasInputs, m1Val, m2Val, path, maxM1, maxM2, scale]);

  const selectionIndex = useMemo(() => {
    if (!showSelectionIndex) return null;
    const rw = parseInt(rwScore);
    const math = parseInt(mathScoreForSI);
    if (isNaN(rw) || isNaN(math)) return null;
    return computeSelectionIndex(rw, math);
  }, [showSelectionIndex, rwScore, mathScoreForSI]);

  const barPct = projected
    ? ((projected.mid - scale.min) / scale.range) * 100
    : 0;
  const benchPct = ((scale.benchmark - scale.min) / scale.range) * 100;

  const testLabel = scale.label;
  const sectionLabel = section === "math" ? "Math" : "Reading & Writing";

  return (
    <div className="mx-auto max-w-2xl px-4 py-20">
      {/* Header */}
      <div className="mb-8 text-center">
        <div
          className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl text-2xl"
          style={{ backgroundColor: `${accentColor}18` }}
        >
          📊
        </div>
        <h2 className="text-2xl font-bold text-text-primary">
          {testLabel} {sectionLabel} Score Projector
        </h2>
        <p className="mt-2 text-sm text-text-muted">
          Enter your raw scores and routing path to estimate your scaled score.
          See how Module 2 routing dramatically affects your score ceiling.
        </p>
      </div>

      {/* Glass card */}
      <div
        className="rounded-2xl border p-6"
        style={{
          borderColor: `${accentColor}30`,
          background: "rgba(30, 30, 30, 0.6)",
          backdropFilter: "blur(16px)",
        }}
      >
        {/* Inputs */}
        <div className="mb-6 grid grid-cols-3 gap-4">
          {/* Module 1 */}
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-text-muted">
              Module 1 Raw
            </label>
            <input
              type="number"
              min={0}
              max={maxM1}
              placeholder={`/${maxM1}`}
              value={m1}
              onChange={(e) => setM1(e.target.value)}
              className="w-full rounded-lg border border-border-default bg-bg-surface px-3 py-2.5 text-center font-mono text-lg text-text-primary outline-none transition-colors focus:border-transparent"
              style={{ boxShadow: m1 ? `0 0 0 2px ${accentColor}40` : undefined }}
            />
          </div>

          {/* Module 2 */}
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-text-muted">
              Module 2 Raw
            </label>
            <input
              type="number"
              min={0}
              max={maxM2}
              placeholder={`/${maxM2}`}
              value={m2}
              onChange={(e) => setM2(e.target.value)}
              className="w-full rounded-lg border border-border-default bg-bg-surface px-3 py-2.5 text-center font-mono text-lg text-text-primary outline-none transition-colors focus:border-transparent"
              style={{ boxShadow: m2 ? `0 0 0 2px ${accentColor}40` : undefined }}
            />
          </div>

          {/* Path selector */}
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-text-muted">
              Module 2 Path
            </label>
            <select
              value={path}
              onChange={(e) => setPath(e.target.value as "" | "hard" | "easy")}
              className="w-full rounded-lg border border-border-default bg-bg-surface px-3 py-2.5 text-sm text-text-primary outline-none transition-colors focus:border-transparent"
              style={{ boxShadow: path ? `0 0 0 2px ${accentColor}40` : undefined }}
            >
              <option value="">Select...</option>
              <option value="hard">Harder (high ceiling)</option>
              <option value="easy">Easier (capped)</option>
            </select>
          </div>
        </div>

        {/* Result */}
        <div
          className="rounded-xl border border-border-default p-5 text-center"
          style={{ background: "rgba(18, 18, 18, 0.5)" }}
        >
          {projected ? (
            <>
              <div
                className="font-mono text-4xl font-bold"
                style={{ color: projected.color }}
              >
                {projected.low}&ndash;{projected.high}
              </div>
              <div className="mt-1 text-xs text-text-muted">
                Estimated scaled score range (midpoint: ~{projected.mid})
              </div>
              <div className="mt-1 text-xs text-text-muted">
                {projected.raw}/{projected.maxRaw} raw &middot;{" "}
                {projected.path === "hard" ? "Harder" : "Easier"} Module 2
              </div>

              {/* Score bar */}
              <div className="relative mx-auto mt-4 h-2 max-w-sm rounded-full bg-border-default">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${barPct}%`,
                    background: `linear-gradient(90deg, ${accentColor}, ${projected.color})`,
                  }}
                />
                {/* Benchmark marker */}
                <div
                  className="absolute -top-1.5 h-5 w-0.5 rounded-full bg-green-400"
                  style={{ left: `${benchPct}%` }}
                  title={scale.benchmarkLabel}
                />
              </div>
              <div className="mx-auto mt-1 flex max-w-sm justify-between text-[10px] text-text-muted">
                <span>{scale.min}</span>
                <span className="text-green-400">{scale.benchmarkLabel}</span>
                <span>{scale.max}</span>
              </div>

              {/* Message */}
              <p
                className="mt-4 text-sm"
                style={{
                  color: projected.path === "easy" ? "#ef4444" : projected.color,
                }}
              >
                {projected.path === "easy" ? "Warning: " : ""}
                {projected.message}
              </p>
            </>
          ) : (
            <p className="text-sm text-text-muted">
              Enter your scores and routing path above
            </p>
          )}
        </div>
      </div>

      {/* Selection Index (NMSQT only) */}
      {showSelectionIndex && (
        <div
          className="mt-6 rounded-2xl border p-6"
          style={{
            borderColor: `${accentColor}30`,
            background: "rgba(30, 30, 30, 0.6)",
            backdropFilter: "blur(16px)",
          }}
        >
          <h3 className="mb-1 text-lg font-bold text-text-primary">
            Selection Index Calculator
          </h3>
          <p className="mb-4 text-xs text-text-muted">
            Selection Index = (RW x 2 + Math) / 10 &mdash; range 48-228. RW is
            double-weighted for National Merit.
          </p>

          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-text-muted">
                RW Scaled Score
              </label>
              <input
                type="number"
                min={160}
                max={760}
                placeholder="160-760"
                value={rwScore}
                onChange={(e) => setRwScore(e.target.value)}
                className="w-full rounded-lg border border-border-default bg-bg-surface px-3 py-2.5 text-center font-mono text-lg text-text-primary outline-none transition-colors focus:border-transparent"
                style={{
                  boxShadow: rwScore ? `0 0 0 2px ${accentColor}40` : undefined,
                }}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-text-muted">
                Math Scaled Score
              </label>
              <input
                type="number"
                min={160}
                max={760}
                placeholder="160-760"
                value={mathScoreForSI}
                onChange={(e) => setMathScoreForSI(e.target.value)}
                className="w-full rounded-lg border border-border-default bg-bg-surface px-3 py-2.5 text-center font-mono text-lg text-text-primary outline-none transition-colors focus:border-transparent"
                style={{
                  boxShadow: mathScoreForSI
                    ? `0 0 0 2px ${accentColor}40`
                    : undefined,
                }}
              />
            </div>
          </div>

          <div
            className="rounded-xl border border-border-default p-4 text-center"
            style={{ background: "rgba(18, 18, 18, 0.5)" }}
          >
            {selectionIndex ? (
              <>
                <div
                  className="font-mono text-4xl font-bold"
                  style={{ color: selectionIndex.color }}
                >
                  {selectionIndex.si}
                </div>
                <div className="mt-1 text-xs text-text-muted">
                  Selection Index (out of 228)
                </div>
                <p
                  className="mt-2 text-sm"
                  style={{ color: selectionIndex.color }}
                >
                  {selectionIndex.level}
                </p>
              </>
            ) : (
              <p className="text-sm text-text-muted">
                Enter both scaled scores to see your Selection Index
              </p>
            )}
          </div>
        </div>
      )}

      {/* Continue button */}
      <div className="mt-8 text-center">
        <button
          onClick={onComplete}
          className="rounded-xl px-8 py-3 text-sm font-semibold text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
          style={{ backgroundColor: accentColor }}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
