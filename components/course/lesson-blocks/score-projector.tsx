"use client";

import { useState, useMemo } from "react";

interface Benchmark {
  label: string;
  score: number;
  color: string;
}

interface ScoreProjectorProps {
  maxPerModule?: number;
  maxScore?: number;
  minScore?: number;
  benchmarks?: Benchmark[];
  accentColor?: string;
}

export function ScoreProjector({
  maxPerModule = 27,
  maxScore = 800,
  minScore = 200,
  benchmarks = [
    { label: "Below Average", score: 400, color: "#ef4444" },
    { label: "Average", score: 530, color: "#eab308" },
    { label: "Good", score: 600, color: "#22c55e" },
    { label: "Excellent", score: 700, color: "#a78bfa" },
  ],
  accentColor = "#a78bfa",
}: ScoreProjectorProps) {
  const [mod1, setMod1] = useState(0);
  const [mod2, setMod2] = useState(0);

  const totalRaw = mod1 + mod2;
  const maxRaw = maxPerModule * 2;

  const estimated = useMemo(() => {
    if (totalRaw === 0) return minScore;
    const pct = totalRaw / maxRaw;
    // Non-linear scaling curve to simulate real score conversion
    const curved = Math.pow(pct, 0.85);
    return Math.round(minScore + curved * (maxScore - minScore));
  }, [totalRaw, maxRaw, minScore, maxScore]);

  const barPct = ((estimated - minScore) / (maxScore - minScore)) * 100;

  const level = useMemo(() => {
    const sorted = [...benchmarks].sort((a, b) => b.score - a.score);
    for (const b of sorted) {
      if (estimated >= b.score) return b;
    }
    return { label: "Needs Improvement", score: 0, color: "#ef4444" };
  }, [estimated, benchmarks]);

  const advice = useMemo(() => {
    if (barPct >= 85) return "Outstanding performance! Focus on maintaining consistency.";
    if (barPct >= 65) return "Strong foundation. Target your weak domains for the biggest score gains.";
    if (barPct >= 40) return "Solid start. Consistent practice on core skills will push your score higher.";
    return "Focus on fundamentals first. Small daily practice sessions build momentum.";
  }, [barPct]);

  return (
    <div className="space-y-5">
      {/* Input row */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Module 1 Raw Score", value: mod1, set: setMod1 },
          { label: "Module 2 Raw Score", value: mod2, set: setMod2 },
        ].map(({ label, value, set }) => (
          <div
            key={label}
            className="rounded-[14px] border border-border-default bg-bg-deep p-4"
          >
            <label className="mb-2 block text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">
              {label}
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min={0}
                max={maxPerModule}
                value={value}
                onChange={(e) => {
                  const v = Math.max(0, Math.min(maxPerModule, Number(e.target.value) || 0));
                  set(v);
                }}
                className="w-full rounded-lg border border-border-default bg-bg-card px-3 py-2 font-mono text-lg font-bold text-text-primary outline-none transition-colors focus:border-opacity-60"
                style={{ borderColor: value > 0 ? `${accentColor}44` : undefined }}
              />
              <span className="shrink-0 text-xs text-text-muted">/ {maxPerModule}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Score display */}
      <div
        className="rounded-[14px] border p-5 text-center transition-all duration-300"
        style={{
          backgroundColor: `${level.color}08`,
          borderColor: `${level.color}33`,
        }}
      >
        <div className="text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">
          Estimated Scaled Score
        </div>
        <div
          className="mt-1 font-display text-5xl font-bold tracking-tight transition-all duration-300"
          style={{ color: level.color }}
        >
          {estimated}
        </div>
        <div
          className="mt-1 text-sm font-semibold"
          style={{ color: level.color }}
        >
          {level.label}
        </div>
      </div>

      {/* Score bar with benchmarks */}
      <div className="rounded-[14px] border border-border-default bg-bg-deep p-5">
        <div className="relative h-4 w-full overflow-hidden rounded-full bg-border-default">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${Math.max(barPct, 2)}%`,
              background: `linear-gradient(90deg, ${level.color}88, ${level.color})`,
            }}
          />
        </div>

        {/* Benchmark markers */}
        <div className="relative mt-1 h-8">
          {benchmarks.map((b) => {
            const pos = ((b.score - minScore) / (maxScore - minScore)) * 100;
            return (
              <div
                key={b.label}
                className="absolute -translate-x-1/2"
                style={{ left: `${pos}%` }}
              >
                <div
                  className="mx-auto h-3 w-px"
                  style={{ backgroundColor: `${b.color}66` }}
                />
                <div
                  className="whitespace-nowrap text-[10px] font-medium"
                  style={{ color: b.color }}
                >
                  {b.score}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-3 flex flex-wrap gap-3">
          {benchmarks.map((b) => (
            <div key={b.label} className="flex items-center gap-1.5 text-[11px] text-text-muted">
              <div
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: b.color }}
              />
              {b.label} ({b.score}+)
            </div>
          ))}
        </div>
      </div>

      {/* Advice */}
      <div
        className="rounded-xl border px-5 py-4 text-sm leading-[1.7] text-[#bcbcc8]"
        style={{
          backgroundColor: `${accentColor}0a`,
          borderColor: `${accentColor}33`,
        }}
      >
        <strong style={{ color: accentColor }}>Strategy Tip: </strong>
        {advice}
      </div>
    </div>
  );
}
