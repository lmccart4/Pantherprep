"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { createPlan } from "@/lib/study-plan/client-regen";

type TestChoice = "sat" | "nmsqt" | "psat89";

const UPCOMING: Record<TestChoice, string[]> = {
  sat: ["2026-05-03", "2026-06-07", "2026-08-23", "2026-10-04"],
  nmsqt: ["2026-10-15", "2026-10-23", "2026-10-28"],
  psat89: ["2026-10-15", "2027-04-15"],
};

const LABEL: Record<TestChoice, string> = {
  sat: "SAT",
  nmsqt: "PSAT/NMSQT",
  psat89: "PSAT 8/9",
};

export function OnboardingModal({ onDone }: { onDone: () => void }) {
  const { user } = useAuth();
  const router = useRouter();
  const [test, setTest] = useState<TestChoice>("sat");
  const [sections, setSections] = useState<{ math: boolean; rw: boolean }>({
    math: true,
    rw: true,
  });
  const [date, setDate] = useState(UPCOMING.sat[0]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    if (!user?.uid) return;
    if (!sections.math && !sections.rw) {
      setError("Pick at least one section.");
      return;
    }
    const chosenDate = new Date(date + "T12:00:00");
    if (isNaN(chosenDate.getTime()) || chosenDate.getTime() < Date.now()) {
      setError("Pick a future date.");
      return;
    }
    setBusy(true);
    try {
      const targets: string[] = [];
      if (sections.math) targets.push(`${test}-math`);
      if (sections.rw) targets.push(`${test}-rw`);
      for (const course of targets) {
        await createPlan({ uid: user.uid, course, testDate: chosenDate });
      }
      onDone();
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/30 p-4">
      <div className="w-full max-w-lg border-2 border-ink bg-paper-card p-6 shadow-[5px_5px_0_var(--color-ink)]">
        <div className="kicker mb-3">Set up your plan</div>
        <h2 className="mb-5 font-display text-[32px] leading-tight text-ink">
          When&rsquo;s your{" "}
          <em className="text-accent" style={{ fontStyle: "italic" }}>
            test
          </em>
          ?
        </h2>

        <div className="mb-4">
          <div className="kicker mb-2">Which test</div>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(LABEL) as TestChoice[]).map((t) => (
              <button
                key={t}
                onClick={() => {
                  setTest(t);
                  setDate(UPCOMING[t][0]);
                }}
                className={`border-2 border-ink px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.14em] ${
                  test === t ? "bg-ink text-paper" : "bg-paper-card text-ink"
                }`}
              >
                {LABEL[t]}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <div className="kicker mb-2">Sections</div>
          <div className="flex gap-3">
            <label className="flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-ink">
              <input
                type="checkbox"
                checked={sections.math}
                onChange={(e) =>
                  setSections({ ...sections, math: e.target.checked })
                }
              />
              Math
            </label>
            <label className="flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-ink">
              <input
                type="checkbox"
                checked={sections.rw}
                onChange={(e) =>
                  setSections({ ...sections, rw: e.target.checked })
                }
              />
              R&amp;W
            </label>
          </div>
        </div>

        <div className="mb-5">
          <div className="kicker mb-2">Test date</div>
          <div className="mb-2 flex flex-wrap gap-2">
            {UPCOMING[test].map((d) => (
              <button
                key={d}
                onClick={() => setDate(d)}
                className={`border border-ink px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.14em] ${
                  date === d ? "bg-ink text-paper" : "bg-paper-card text-ink"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border-2 border-ink bg-paper px-3 py-2 font-body text-[15px] text-ink focus:outline-none"
          />
        </div>

        {error && (
          <div className="mb-3 border border-accent bg-accent-soft p-2 font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
            {error}
          </div>
        )}

        <div className="flex items-center justify-end gap-2">
          <button
            onClick={onDone}
            className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-ink-3 hover:text-accent"
          >
            Not now
          </button>
          <button
            onClick={submit}
            disabled={busy}
            className="border-2 border-ink bg-accent px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-accent-fg transition-colors hover:bg-ink disabled:opacity-40"
          >
            {busy ? "Building..." : "Build my plan"}
          </button>
        </div>
      </div>
    </div>
  );
}
