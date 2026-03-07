"use client";

import { useState } from "react";

interface StatisticsCalculatorProps {
  accentColor: string;
  onComplete: () => void;
}

interface Stats {
  mean: number;
  median: number;
  range: number;
  stdDev: number;
  sorted: number[];
}

function computeStats(nums: number[]): Stats {
  const sorted = [...nums].sort((a, b) => a - b);
  const n = sorted.length;
  const mean = sorted.reduce((s, v) => s + v, 0) / n;

  let median: number;
  if (n % 2 === 1) {
    median = sorted[Math.floor(n / 2)];
  } else {
    median = (sorted[n / 2 - 1] + sorted[n / 2]) / 2;
  }

  const range = sorted[n - 1] - sorted[0];

  const variance = sorted.reduce((s, v) => s + (v - mean) ** 2, 0) / n;
  const stdDev = Math.sqrt(variance);

  return { mean, median, range, stdDev, sorted };
}

export function StatisticsCalculator({
  accentColor,
  onComplete,
}: StatisticsCalculatorProps) {
  const [input, setInput] = useState("");
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState("");

  function calculate() {
    setError("");
    const parts = input
      .split(/[,\s]+/)
      .map((s) => s.trim())
      .filter(Boolean);
    const nums = parts.map(Number);

    if (nums.length < 2) {
      setError("Enter at least 2 numbers separated by commas.");
      return;
    }
    if (nums.some(isNaN)) {
      setError("All entries must be valid numbers.");
      return;
    }

    setStats(computeStats(nums));
  }

  function reset() {
    setInput("");
    setStats(null);
    setError("");
  }

  function fmt(n: number) {
    return Number.isInteger(n) ? String(n) : n.toFixed(4);
  }

  return (
    <div className="mx-auto min-h-screen max-w-[700px] px-5 pb-16 pt-14">
      <div className="mb-6 text-center">
        <h2 className="font-display text-xl font-bold text-text-primary">
          Statistics Calculator
        </h2>
        <p className="mt-1 text-sm text-text-muted">
          Enter a list of numbers to compute mean, median, range, and standard
          deviation.
        </p>
      </div>

      <div
        className="rounded-2xl border p-6"
        style={{
          background: "rgba(15,15,22,.75)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderColor: "rgba(255,255,255,.05)",
          boxShadow: "0 2px 16px rgba(0,0,0,.1)",
        }}
      >
        {/* Input */}
        <div className="mb-5">
          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-text-muted">
            Data (comma-separated)
          </label>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. 10, 12, 14, 15, 16"
            className="w-full rounded-lg border bg-[#08080c] px-4 py-2.5 font-mono text-sm text-text-primary outline-none transition-colors focus:border-current"
            style={{ borderColor: "rgba(255,255,255,.1)" }}
            onFocus={(e) =>
              (e.currentTarget.style.borderColor = accentColor)
            }
            onBlur={(e) =>
              (e.currentTarget.style.borderColor = "rgba(255,255,255,.1)")
            }
            onKeyDown={(e) => e.key === "Enter" && calculate()}
          />
          {error && (
            <p className="mt-1 text-xs text-red-400">{error}</p>
          )}
        </div>

        {/* Buttons */}
        <div className="mb-6 flex justify-center gap-3">
          <button
            onClick={calculate}
            disabled={!input.trim()}
            className="rounded-lg px-6 py-2.5 text-sm font-bold text-white transition-all hover:brightness-110 disabled:opacity-40"
            style={{ background: accentColor }}
          >
            Calculate
          </button>
          {stats && (
            <button
              onClick={reset}
              className="rounded-lg border px-4 py-2.5 text-sm font-bold text-text-muted transition-colors hover:text-text-primary"
              style={{ borderColor: "rgba(255,255,255,.1)" }}
            >
              Reset
            </button>
          )}
        </div>

        {/* Results */}
        {stats && (
          <>
            {/* Sorted data display */}
            <div className="mb-4 text-center">
              <p className="text-xs font-bold uppercase tracking-wider text-text-muted">
                Sorted Data
              </p>
              <p className="mt-1 font-mono text-sm text-text-primary">
                {stats.sorted.join(", ")}
              </p>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Mean", value: fmt(stats.mean), desc: "Sum / Count" },
                {
                  label: "Median",
                  value: fmt(stats.median),
                  desc: "Middle value",
                },
                {
                  label: "Range",
                  value: fmt(stats.range),
                  desc: "Max - Min",
                },
                {
                  label: "Std Dev",
                  value: fmt(stats.stdDev),
                  desc: "Spread from mean",
                },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl border p-4 text-center"
                  style={{
                    borderColor: `${accentColor}30`,
                    background: `${accentColor}0d`,
                  }}
                >
                  <p className="text-[.65rem] font-bold uppercase tracking-wider text-text-muted">
                    {s.label}
                  </p>
                  <p
                    className="mt-1 font-mono text-xl font-bold"
                    style={{ color: accentColor }}
                  >
                    {s.value}
                  </p>
                  <p className="mt-0.5 text-[.65rem] text-text-muted">
                    {s.desc}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Continue */}
      <div className="mt-8 flex justify-center">
        <button
          onClick={() => onComplete()}
          className="rounded-lg px-8 py-3 text-sm font-bold text-white transition-all hover:brightness-110"
          style={{ background: accentColor }}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
