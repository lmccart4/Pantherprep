"use client";

import { useState } from "react";

interface TrigCalculatorProps {
  accentColor: string;
  onComplete: () => void;
}

interface TrigResult {
  opp: number;
  adj: number;
  hyp: number;
  sin: number;
  cos: number;
  tan: number;
  computed: "opp" | "adj" | "hyp";
}

export function TrigCalculator({
  accentColor,
  onComplete,
}: TrigCalculatorProps) {
  const [opp, setOpp] = useState("");
  const [adj, setAdj] = useState("");
  const [hyp, setHyp] = useState("");
  const [result, setResult] = useState<TrigResult | null>(null);
  const [error, setError] = useState("");

  function compute() {
    setError("");

    const o = opp ? parseFloat(opp) : NaN;
    const a = adj ? parseFloat(adj) : NaN;
    const h = hyp ? parseFloat(hyp) : NaN;

    const provided = [!isNaN(o), !isNaN(a), !isNaN(h)].filter(Boolean).length;
    if (provided !== 2) {
      setError("Enter exactly 2 of the 3 sides.");
      return;
    }

    let rO: number, rA: number, rH: number;
    let computed: "opp" | "adj" | "hyp";

    if (isNaN(o)) {
      // compute opposite
      if (h <= a || h <= 0 || a <= 0) {
        setError("Hypotenuse must be greater than adjacent and both must be positive.");
        return;
      }
      rO = Math.sqrt(h * h - a * a);
      rA = a;
      rH = h;
      computed = "opp";
    } else if (isNaN(a)) {
      // compute adjacent
      if (h <= o || h <= 0 || o <= 0) {
        setError("Hypotenuse must be greater than opposite and both must be positive.");
        return;
      }
      rO = o;
      rA = Math.sqrt(h * h - o * o);
      rH = h;
      computed = "adj";
    } else {
      // compute hypotenuse
      if (o <= 0 || a <= 0) {
        setError("Both sides must be positive.");
        return;
      }
      rO = o;
      rA = a;
      rH = Math.sqrt(o * o + a * a);
      computed = "hyp";
    }

    setResult({
      opp: rO,
      adj: rA,
      hyp: rH,
      sin: rO / rH,
      cos: rA / rH,
      tan: rO / rA,
      computed,
    });
  }

  function reset() {
    setOpp("");
    setAdj("");
    setHyp("");
    setResult(null);
    setError("");
  }

  function fmt(n: number) {
    if (Number.isInteger(n)) return String(n);
    const rounded = Math.round(n * 10000) / 10000;
    return String(rounded);
  }

  return (
    <div className="mx-auto min-h-screen max-w-[700px] px-5 pb-16 pt-14">
      <div className="mb-6 text-center">
        <h2 className="font-display text-xl font-bold text-text-primary">
          Right Triangle &amp; Trig Calculator
        </h2>
        <p className="mt-1 text-sm text-text-muted">
          Enter any 2 sides of a right triangle. The calculator finds the
          missing side and all trig ratios.
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
        {/* Triangle diagram hint */}
        <div className="mb-5 text-center">
          <p className="font-mono text-xs text-text-muted">
            a&sup2; + b&sup2; = c&sup2; &nbsp;|&nbsp; SOH-CAH-TOA
          </p>
        </div>

        {/* Inputs */}
        <div className="mb-5 grid grid-cols-3 gap-4">
          {[
            { label: "Opposite", value: opp, set: setOpp, hint: "opp" },
            { label: "Adjacent", value: adj, set: setAdj, hint: "adj" },
            { label: "Hypotenuse", value: hyp, set: setHyp, hint: "hyp" },
          ].map((field) => (
            <div key={field.hint}>
              <label className="mb-1 block text-center text-xs font-bold uppercase tracking-wider text-text-muted">
                {field.label}
              </label>
              <input
                type="number"
                value={field.value}
                onChange={(e) => field.set(e.target.value)}
                placeholder="—"
                className="w-full rounded-lg border bg-[#08080c] px-3 py-2 text-center font-mono text-base text-text-primary outline-none transition-colors focus:border-current"
                style={{ borderColor: "rgba(255,255,255,.1)" }}
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

        {error && (
          <p className="mb-4 text-center text-xs text-red-400">{error}</p>
        )}

        {/* Buttons */}
        <div className="mb-6 flex justify-center gap-3">
          <button
            onClick={compute}
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

        {/* Results */}
        {result && (
          <>
            {/* Sides */}
            <div className="mb-4">
              <p className="mb-2 text-center text-xs font-bold uppercase tracking-wider text-text-muted">
                Sides
              </p>
              <div className="grid grid-cols-3 gap-3">
                {(
                  [
                    ["Opposite", result.opp, "opp"],
                    ["Adjacent", result.adj, "adj"],
                    ["Hypotenuse", result.hyp, "hyp"],
                  ] as const
                ).map(([label, val, key]) => (
                  <div
                    key={key}
                    className="rounded-xl border p-3 text-center"
                    style={{
                      borderColor:
                        key === result.computed
                          ? `${accentColor}60`
                          : "rgba(255,255,255,.05)",
                      background:
                        key === result.computed
                          ? `${accentColor}0d`
                          : "transparent",
                    }}
                  >
                    <p className="text-[.6rem] font-bold uppercase tracking-wider text-text-muted">
                      {label}
                      {key === result.computed && " *"}
                    </p>
                    <p
                      className="mt-0.5 font-mono text-lg font-bold"
                      style={{
                        color:
                          key === result.computed
                            ? accentColor
                            : "var(--text-primary, #eaeaef)",
                      }}
                    >
                      {fmt(val)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Trig ratios */}
            <div>
              <p className="mb-2 text-center text-xs font-bold uppercase tracking-wider text-text-muted">
                Trig Ratios
              </p>
              <div className="grid grid-cols-3 gap-3">
                {[
                  {
                    label: "sin",
                    value: result.sin,
                    formula: `${fmt(result.opp)} / ${fmt(result.hyp)}`,
                  },
                  {
                    label: "cos",
                    value: result.cos,
                    formula: `${fmt(result.adj)} / ${fmt(result.hyp)}`,
                  },
                  {
                    label: "tan",
                    value: result.tan,
                    formula: `${fmt(result.opp)} / ${fmt(result.adj)}`,
                  },
                ].map((r) => (
                  <div
                    key={r.label}
                    className="rounded-xl border p-3 text-center"
                    style={{
                      borderColor: `${accentColor}30`,
                      background: `${accentColor}0d`,
                    }}
                  >
                    <p className="text-[.6rem] font-bold uppercase tracking-wider text-text-muted">
                      {r.label}(&theta;)
                    </p>
                    <p
                      className="mt-0.5 font-mono text-lg font-bold"
                      style={{ color: accentColor }}
                    >
                      {fmt(r.value)}
                    </p>
                    <p className="mt-0.5 font-mono text-[.6rem] text-text-muted">
                      {r.formula}
                    </p>
                  </div>
                ))}
              </div>
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
