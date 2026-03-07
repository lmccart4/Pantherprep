"use client";

import { useState, useCallback } from "react";

const ACCENT = "#06b6d4";
const MATH = "#06b6d4";

const CL_ITEMS = [
  "Find a quiet space with 70+ minutes of uninterrupted time.",
  "Have scratch paper and pencils ready.",
  "Open desmos.com/calculator in another tab (to simulate the test calculator).",
  "Turn off your phone and close other tabs.",
  "Set a timer for 35 minutes for Module 1.",
  "Remember: accuracy over speed in Module 1. Double-check everything.",
];

const CL_KEY = "pp_psat89_math_m1_cl";
const WS_KEY = "pp_psat89_math_m1_ws";

const PROTOCOL_STEPS = [
  { n: "1", html: <>Open the <a href="https://bluebook.collegeboard.org/" target="_blank" rel="noopener noreferrer" style={{ color: ACCENT }}>Bluebook app</a> and select a PSAT 8/9 practice test. Take only the Math section (44 questions, 70 minutes).</> },
  { n: "2", html: <><strong>Use the built-in Desmos calculator</strong> during the baseline &mdash; graph equations, find intersections, explore. This establishes your current comfort level with the tool.</> },
  { n: "3", html: <>Simulate test conditions: no phone, no notes, timed modules, quiet environment. No pausing between modules.</> },
  { n: "4", html: <>After completion, <strong>mark every question you were unsure about</strong>, even if you got it correct. &ldquo;Lucky correct&rdquo; answers mask skill gaps.</> },
  { n: "5", html: <>Review your score report. Note which domain(s) had the most errors.</> },
  { n: "6", html: <>Complete the Error Analysis Worksheet below for every missed <strong>and</strong> uncertain question.</> },
];

const HOMEWORK = [
  ["1. Complete Your Baseline Test", "Full 44 questions, 70 minutes, official Bluebook practice test under test conditions."],
  ["2. Self-Score & Mark Uncertain Questions", "Score yourself before reviewing. Flag every question you weren't sure about."],
  ["3. Complete the Error Analysis Worksheet", "One entry for every missed AND uncertain question."],
  ["4. Use the Score Projector", "Enter your raw scores to estimate your scaled score and see where you stand."],
  ["5. Identify Your Top 3 Priority Areas", "Based on the error analysis, what domains/topics cost you the most points?"],
  ["6. Explore Desmos", "Go to desmos.com/calculator and spend 15 minutes graphing equations and finding intersection points."],
];

const DOMAIN_OPTIONS = ["", "Algebra", "Advanced Math", "Problem-Solving & Data", "Geometry"];
const ERROR_OPTIONS = ["", "Content Gap", "Careless/Arithmetic", "Misread/Trap", "Time Pressure", "Strategy Gap"];

interface WsEntry {
  qnum: string;
  domain: string;
  topic: string;
  errorType: string;
  shouldHave: string;
  desmos: string;
}

const EMPTY_ENTRY: WsEntry = { qnum: "", domain: "", topic: "", errorType: "", shouldHave: "", desmos: "" };

function loadCL(): boolean[] {
  try {
    const d = JSON.parse(localStorage.getItem(CL_KEY) || "[]");
    if (d.length !== CL_ITEMS.length) return CL_ITEMS.map(() => false);
    return d;
  } catch { return CL_ITEMS.map(() => false); }
}

function loadWS(): WsEntry[] {
  try {
    const d = JSON.parse(localStorage.getItem(WS_KEY) || "[]");
    return d.length === 0 ? [{ ...EMPTY_ENTRY }] : d;
  } catch { return [{ ...EMPTY_ENTRY }]; }
}

interface WorksheetScreenProps {
  onComplete: () => void;
}

export function WorksheetScreen({ onComplete }: WorksheetScreenProps) {
  const [clState, setCLState] = useState<boolean[]>(loadCL);
  const [wsEntries, setWsEntries] = useState<WsEntry[]>(loadWS);

  const toggleCL = useCallback((i: number) => {
    setCLState((prev) => {
      const n = [...prev];
      n[i] = !n[i];
      localStorage.setItem(CL_KEY, JSON.stringify(n));
      return n;
    });
  }, []);

  const saveWS = (d: WsEntry[]) => localStorage.setItem(WS_KEY, JSON.stringify(d));

  const addEntry = () => {
    setWsEntries((prev) => {
      const n = [...prev, { ...EMPTY_ENTRY }];
      saveWS(n);
      return n;
    });
  };

  const removeEntry = (idx: number) => {
    setWsEntries((prev) => {
      const n = prev.filter((_, i) => i !== idx);
      const result = n.length === 0 ? [{ ...EMPTY_ENTRY }] : n;
      saveWS(result);
      return result;
    });
  };

  const updateEntry = (idx: number, field: keyof WsEntry, val: string) => {
    setWsEntries((prev) => {
      const n = prev.map((e, i) => (i === idx ? { ...e, [field]: val } : e));
      saveWS(n);
      return n;
    });
  };

  const exportWS = () => {
    let txt = "PSAT 8/9 MATH ERROR ANALYSIS \u2014 PantherPrep\n";
    txt += "\u2550".repeat(44) + "\n\n";
    const counts: Record<string, number> = {};
    const domCounts: Record<string, number> = {};
    wsEntries.forEach((e) => {
      txt += `Q${e.qnum || "?"} | ${e.domain || "\u2014"} | ${e.topic || "\u2014"} | ${e.errorType || "\u2014"} | Desmos: ${e.desmos || "\u2014"}\n`;
      txt += `  \u2192 ${e.shouldHave || "\u2014"}\n\n`;
      if (e.errorType) counts[e.errorType] = (counts[e.errorType] || 0) + 1;
      if (e.domain) domCounts[e.domain] = (domCounts[e.domain] || 0) + 1;
    });
    txt += "ERROR TYPE SUMMARY:\n";
    Object.entries(counts).forEach(([k, v]) => { txt += `  ${k}: ${v}\n`; });
    txt += "\nDOMAIN SUMMARY:\n";
    Object.entries(domCounts).forEach(([k, v]) => { txt += `  ${k}: ${v}\n`; });
    navigator.clipboard.writeText(txt).then(() => alert("Worksheet copied to clipboard!"));
  };

  const resetWS = () => {
    if (confirm("Clear all entries?")) {
      localStorage.removeItem(WS_KEY);
      setWsEntries([{ ...EMPTY_ENTRY }]);
    }
  };

  const clDone = clState.filter(Boolean).length;

  const glass = "rounded-[18px] border border-[rgba(255,255,255,.05)] shadow-[0_4px_32px_rgba(0,0,0,.2),inset_0_1px_0_rgba(255,255,255,.03)]";
  const glassBg = "bg-[rgba(15,15,22,.75)] backdrop-blur-[20px]";
  const inputCls = "rounded-lg border border-[rgba(255,255,255,.06)] bg-[rgba(8,8,12,.5)] px-3 py-2 text-sm text-[#eaeaef] transition-all focus:border-[rgba(6,182,212,.3)] focus:outline-none";

  return (
    <div className="mx-auto min-h-screen max-w-[780px] px-6 pb-16 pt-12">

      {/* ── Baseline Protocol ── */}
      <div className="mb-2.5 text-[11px] font-bold uppercase tracking-[2.5px] opacity-80" style={{ color: ACCENT }}>
        Session 3: Full Baseline
      </div>
      <h2 className="mb-2.5 font-display text-[clamp(1.4rem,3.5vw,2rem)] font-bold text-text-primary">
        Baseline Assessment Protocol
      </h2>
      <p className="mb-6 text-[14px] leading-[1.8] text-text-secondary">
        After the mini diagnostic, take a full-length PSAT 8/9 Math section using the Bluebook app.
        This establishes your true baseline score.
      </p>

      <div
        className={`${glass} mb-7 overflow-hidden`}
        style={{ borderColor: "rgba(6,182,212,.15)", boxShadow: "0 4px 32px rgba(0,0,0,.2), 0 0 30px rgba(6,182,212,.15)" }}
      >
        <div
          className="px-6 py-3.5 text-[15px] font-bold tracking-[0.02em] text-white"
          style={{ background: `linear-gradient(135deg, ${ACCENT}, rgba(6,182,212,.8))` }}
        >
          Full Baseline Protocol
        </div>
        {PROTOCOL_STEPS.map((step, i) => (
          <div
            key={i}
            className="flex items-start gap-4 px-6 py-4 text-[14px] leading-[1.7] text-[#bcbcc8]"
            style={{ borderBottom: i < PROTOCOL_STEPS.length - 1 ? "1px solid rgba(255,255,255,.05)" : "none" }}
          >
            <div
              className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full font-mono text-[13px] font-bold"
              style={{ background: "rgba(6,182,212,.07)", border: "1px solid rgba(6,182,212,.25)", color: ACCENT }}
            >
              {step.n}
            </div>
            <div>{step.html}</div>
          </div>
        ))}
      </div>

      {/* ── Pre-Test Checklist ── */}
      <div className="mb-2.5 text-[11px] font-bold uppercase tracking-[2.5px] opacity-80" style={{ color: ACCENT }}>
        Preparation
      </div>
      <h2 className="mb-3.5 font-display text-[clamp(1.4rem,3.5vw,2rem)] font-bold text-text-primary">
        Pre-Test Checklist
      </h2>
      <div className={`${glass} ${glassBg} mb-7 p-6`}>
        <h3 className="mb-3.5 font-display text-[1.2rem] font-semibold text-text-primary">
          Before Your Baseline Test
        </h3>
        {CL_ITEMS.map((item, i) => (
          <div
            key={i}
            onClick={() => toggleCL(i)}
            className="flex cursor-pointer items-start gap-3 py-2.5 text-[14px] transition-all"
            style={{
              borderBottom: i < CL_ITEMS.length - 1 ? "1px solid rgba(255,255,255,.05)" : "none",
              color: clState[i] ? "var(--color-text-muted)" : "#bcbcc8",
              textDecoration: clState[i] ? "line-through" : "none",
            }}
          >
            <div
              className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-md text-[11px] transition-all"
              style={{
                border: `1px solid ${clState[i] ? "rgba(34,197,94,.4)" : "rgba(255,255,255,.06)"}`,
                background: clState[i] ? "#22c55e" : "transparent",
                color: clState[i] ? "#fff" : "transparent",
                boxShadow: clState[i] ? "0 0 8px rgba(34,197,94,.15)" : "none",
              }}
            >
              {clState[i] ? "\u2713" : ""}
            </div>
            <div>{item}</div>
          </div>
        ))}
        <div className="mt-2.5 text-right font-mono text-[13px] font-medium text-text-muted">
          {clDone}/{CL_ITEMS.length} complete
        </div>
      </div>

      {/* ── Error Analysis Worksheet ── */}
      <div className="mb-2.5 text-[11px] font-bold uppercase tracking-[2.5px] opacity-80" style={{ color: MATH }}>
        Session 3: Interactive Tool
      </div>
      <h2 className="mb-2.5 font-display text-[clamp(1.4rem,3.5vw,2rem)] font-bold text-text-primary">
        Error Analysis Worksheet
      </h2>
      <p className="mb-5 text-[14px] leading-[1.8] text-text-secondary">
        For every missed or uncertain question on your baseline test, fill in one entry. Data saves in your browser.
      </p>

      <div
        className={`${glass} ${glassBg} mb-7 p-6`}
        style={{ borderColor: "rgba(6,182,212,.15)", boxShadow: "0 4px 32px rgba(0,0,0,.2), 0 0 30px rgba(6,182,212,.15)" }}
      >
        <h3 className="mb-1.5 font-display text-[1.2rem] font-semibold text-text-primary">
          PSAT 8/9 Math Error Analysis
        </h3>
        <div className="mb-4 text-[14px] text-text-muted">Complete one entry per missed/uncertain question</div>

        {wsEntries.map((e, i) => (
          <div
            key={i}
            className="mb-3 rounded-xl border border-[rgba(255,255,255,.06)] bg-[rgba(8,8,12,.5)] p-4 transition-all hover:border-[rgba(255,255,255,.12)]"
          >
            <div className="mb-2.5 flex items-center justify-between">
              <div className="text-[14px] font-bold tracking-[0.02em]" style={{ color: MATH }}>
                Question {i + 1}
              </div>
              <button
                onClick={() => removeEntry(i)}
                className="cursor-pointer border-none bg-transparent text-[13px] text-text-muted transition-all hover:text-[#ef4444]"
              >
                &times; Remove
              </button>
            </div>

            <div className="mb-2 grid grid-cols-[auto_1fr] items-center gap-x-3 gap-y-2">
              <div className="text-[10px] font-bold uppercase tracking-[1.5px] text-text-muted">Q #</div>
              <input
                type="number" min={1} max={44} placeholder="1-44"
                value={e.qnum} onChange={(ev) => updateEntry(i, "qnum", ev.target.value)}
                className={`${inputCls} w-20`}
              />
              <div className="text-[10px] font-bold uppercase tracking-[1.5px] text-text-muted">Domain</div>
              <select
                value={e.domain} onChange={(ev) => updateEntry(i, "domain", ev.target.value)}
                className={inputCls}
              >
                <option value="">Select domain&hellip;</option>
                {DOMAIN_OPTIONS.slice(1).map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
              <div className="text-[10px] font-bold uppercase tracking-[1.5px] text-text-muted">Topic</div>
              <input
                placeholder="e.g., Systems of equations, Exponent rules"
                value={e.topic} onChange={(ev) => updateEntry(i, "topic", ev.target.value)}
                className={`${inputCls} w-full`}
              />
              <div className="text-[10px] font-bold uppercase tracking-[1.5px] text-text-muted">Error Type</div>
              <select
                value={e.errorType} onChange={(ev) => updateEntry(i, "errorType", ev.target.value)}
                className={inputCls}
              >
                <option value="">Select type&hellip;</option>
                {ERROR_OPTIONS.slice(1).map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            <div className="mb-1 mt-1 text-[10px] font-bold uppercase tracking-[1.5px] text-text-muted">
              What I should have done
            </div>
            <textarea
              placeholder="Write the correct approach in your own words&hellip;"
              value={e.shouldHave} onChange={(ev) => updateEntry(i, "shouldHave", ev.target.value)}
              className={`${inputCls} min-h-[40px] w-full resize-y`}
            />

            <div className="mt-1.5 grid grid-cols-[auto_1fr] items-center gap-x-3 gap-y-2">
              <div className="text-[10px] font-bold uppercase tracking-[1.5px] text-text-muted">Desmos?</div>
              <select
                value={e.desmos} onChange={(ev) => updateEntry(i, "desmos", ev.target.value)}
                className={inputCls}
              >
                <option value="">Could Desmos have helped?</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
                <option value="I didn't try">I didn&apos;t try</option>
              </select>
            </div>
          </div>
        ))}

        <div className="mt-4 flex flex-wrap gap-2.5">
          <button
            onClick={addEntry}
            className="cursor-pointer rounded-xl border-none px-4.5 py-2.5 text-[13px] font-bold text-white transition-all hover:scale-[1.03]"
            style={{ background: MATH }}
          >
            + Add Entry
          </button>
          <button
            onClick={exportWS}
            className="cursor-pointer rounded-xl border px-4.5 py-2.5 text-[13px] font-bold transition-all hover:bg-[rgba(6,182,212,.07)]"
            style={{ background: "transparent", borderColor: "rgba(6,182,212,.3)", color: ACCENT }}
          >
            Export to Clipboard
          </button>
          <button
            onClick={resetWS}
            className="cursor-pointer rounded-xl border px-4.5 py-2.5 text-[13px] font-bold transition-all hover:bg-[rgba(239,68,68,.07)]"
            style={{ background: "transparent", borderColor: "rgba(239,68,68,.25)", color: "#ef4444" }}
          >
            Reset
          </button>
        </div>
      </div>

      {/* ── Homework ── */}
      <div className="mb-2.5 text-[11px] font-bold uppercase tracking-[2.5px] opacity-80" style={{ color: ACCENT }}>
        Action Items
      </div>
      <h2 className="mb-3.5 font-display text-[clamp(1.4rem,3.5vw,2rem)] font-bold text-text-primary">
        Homework
      </h2>
      <div className={`${glass} ${glassBg} mb-7 border-l-[3px] border-l-[#06b6d4] px-6 py-5`}>
        {HOMEWORK.map(([title, desc], i) => (
          <p key={i} className="text-[14px] leading-[1.7] text-[#bcbcc8]" style={{ marginBottom: i < HOMEWORK.length - 1 ? 14 : 0 }}>
            <strong className="text-text-primary">{title}</strong> &mdash; {desc}
          </p>
        ))}
        <div className="mt-4 border-t border-[rgba(255,255,255,.05)] pt-4">
          <div className="mb-2.5 text-[10px] font-bold uppercase tracking-[1.5px]" style={{ color: ACCENT }}>Real-World Transfer</div>
          <p className="mb-2.5 text-[14px] leading-[1.7] text-[#bcbcc8]">
            <strong className="text-text-primary">7. Find Math in the Wild</strong> &mdash; Find a graph or chart in a news article, social media post, or textbook. Identify: What type of data is shown? What&apos;s the scale? Is anything misleading?
          </p>
          <p className="mb-2.5 text-[14px] leading-[1.7] text-[#bcbcc8]">
            <strong className="text-text-primary">8. Mental Math Challenge</strong> &mdash; Next time you&apos;re at a store or restaurant, estimate a percentage mentally before checking with a calculator. (Tip: 15% = 10% + half of 10%.)
          </p>
          <p className="text-[14px] leading-[1.7] text-[#bcbcc8]">
            <strong className="text-text-primary">9. Desmos Discovery</strong> &mdash; Graph <code className="rounded bg-[rgba(6,182,212,.1)] px-1.5 py-0.5 font-mono text-[13px]" style={{ color: MATH }}>y = x&sup2;</code>, then graph <code className="rounded bg-[rgba(6,182,212,.1)] px-1.5 py-0.5 font-mono text-[13px]" style={{ color: MATH }}>y = (x &minus; 3)&sup2; + 2</code>. Describe what changed. Then predict what <code className="rounded bg-[rgba(6,182,212,.1)] px-1.5 py-0.5 font-mono text-[13px]" style={{ color: MATH }}>y = (x + 1)&sup2; &minus; 4</code> will look like <em>before</em> graphing it.
          </p>
        </div>
      </div>

      {/* Continue */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={onComplete}
          className="cursor-pointer rounded-xl border-none px-7 py-3 text-sm font-bold text-white transition-all hover:scale-[1.03] hover:brightness-110"
          style={{ background: `linear-gradient(135deg, ${ACCENT}, #a855f7)` }}
        >
          Finish Module &rarr;
        </button>
      </div>
    </div>
  );
}
