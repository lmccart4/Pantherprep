"use client";

import { useState } from "react";

interface DiscriminantCalculatorProps {
  accentColor: string;
  onComplete: () => void;
}

export function DiscriminantCalculator({
  accentColor,
  onComplete,
}: DiscriminantCalculatorProps) {
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [c, setC] = useState("");
  const [result, setResult] = useState<{
    d: number;
    label: string;
    color: string;
  } | null>(null);

  function compute() {
    const aVal = parseFloat(a);
    const bVal = parseFloat(b);
    const cVal = parseFloat(c);
    if (isNaN(aVal) || isNaN(bVal) || isNaN(cVal)) return;

    const d = bVal * bVal - 4 * aVal * cVal;

    let label: string;
    let color: string;
    if (d > 0) {
      label = "Two real solutions";
      color = "#22c55e";
    } else if (d === 0) {
      label = "One real solution (repeated)";
      color = "#f59e0b";
    } else {
      label = "No real solutions";
      color = "#ef4444";
    }

    setResult({ d, label, color });
  }

  function reset() {
    setA("");
    setB("");
    setC("");
    setResult(null);
  }

  return (
    <div className="mx-auto min-h-screen max-w-[700px] px-5 pb-16 pt-14">
      <div className="mb-6 text-center">
        <h2 className="font-display text-xl font-bold text-text-primary">
          Discriminant Calculator
        </h2>
        <p className="mt-1 text-sm text-text-muted">
          Enter coefficients for ax&sup2; + bx + c = 0 and see how many real
          solutions it has.
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
        {/* Formula display */}
        <div className="mb-6 text-center">
          <p className="font-mono text-sm text-text-muted">
            D = b&sup2; &minus; 4ac
          </p>
        </div>

        {/* Inputs */}
        <div className="mb-6 grid grid-cols-3 gap-4">
          {[
            { label: "a", value: a, set: setA },
            { label: "b", value: b, set: setB },
            { label: "c", value: c, set: setC },
          ].map((field) => (
            <div key={field.label}>
              <label className="mb-1 block text-center text-xs font-bold uppercase tracking-wider text-text-muted">
                {field.label}
              </label>
              <input
                type="number"
                value={field.value}
                onChange={(e) => field.set(e.target.value)}
                placeholder="0"
                className="w-full rounded-lg border bg-[#08080c] px-3 py-2 text-center font-mono text-base text-text-primary outline-none transition-colors focus:border-current"
                style={{
                  borderColor: "rgba(255,255,255,.1)",
                }}
                onFocus={(e) =>
                  (e.currentTarget.style.borderColor = accentColor)
                }
                onBlur={(e) =>
                  (e.currentTarget.style.borderColor = "rgba(255,255,255,.1)")
                }
              />
            </div>
          ))}
        </div>

        {/* Compute button */}
        <div className="mb-6 flex justify-center gap-3">
          <button
            onClick={compute}
            disabled={!a || !b || !c}
            className="rounded-lg px-6 py-2.5 text-sm font-bold text-white transition-all hover:brightness-110 disabled:opacity-40"
            style={{ background: accentColor }}
          >
            Calculate
          </button>
          {result && (
            <button
              onClick={reset}
              className="rounded-lg border px-4 py-2.5 text-sm font-bold text-text-muted transition-colors hover:text-text-primary"
              style={{ borderColor: "rgba(255,255,255,.1)" }}
            >
              Reset
            </button>
          )}
        </div>

        {/* Result */}
        {result && (
          <div
            className="rounded-xl border p-5 text-center transition-all"
            style={{
              borderColor: `${result.color}40`,
              background: `${result.color}0d`,
            }}
          >
            <p className="mb-1 text-xs font-bold uppercase tracking-wider text-text-muted">
              Discriminant
            </p>
            <p className="font-mono text-3xl font-bold" style={{ color: result.color }}>
              D = {result.d}
            </p>
            <p
              className="mt-2 text-sm font-semibold"
              style={{ color: result.color }}
            >
              {result.label}
            </p>
            <p className="mt-3 text-xs text-text-muted">
              {result.d > 0 && (
                <>
                  b&sup2; &minus; 4ac = {b}&sup2; &minus; 4({a})({c}) ={" "}
                  {parseFloat(b) * parseFloat(b)} &minus;{" "}
                  {4 * parseFloat(a) * parseFloat(c)} = {result.d}
                </>
              )}
              {result.d === 0 && (
                <>
                  b&sup2; &minus; 4ac = {b}&sup2; &minus; 4({a})({c}) = 0
                </>
              )}
              {result.d < 0 && (
                <>
                  b&sup2; &minus; 4ac = {b}&sup2; &minus; 4({a})({c}) ={" "}
                  {result.d}
                </>
              )}
            </p>
          </div>
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
