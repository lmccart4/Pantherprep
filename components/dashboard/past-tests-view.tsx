"use client";

import { useEffect, useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import {
  getTestHistory,
  getTestSessionDetail,
  type SessionSummary,
} from "@/lib/session-history";
import type { StoredAnswer } from "@/lib/adaptive/performance-service";
import { renderMath } from "@/lib/katex-render";

interface Props {
  uid: string;
}

type ViewMode =
  | { kind: "list" }
  | { kind: "detail"; testSessionId: string };

type FirestoreTimestamp = { toDate: () => Date };

function formatDate(ts: FirestoreTimestamp | string | number | null | undefined): string {
  if (!ts) return "—";
  const d =
    typeof ts === "object" && "toDate" in ts ? ts.toDate() : new Date(ts as string | number);
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

const TEST_TYPE_ABBREVS = new Set(["sat", "psat", "psat89", "nmsqt", "rw"]);

function formatTestType(tt: string): string {
  return tt
    .split("-")
    .map((p) =>
      TEST_TYPE_ABBREVS.has(p.toLowerCase())
        ? p.toUpperCase()
        : p[0].toUpperCase() + p.slice(1)
    )
    .join(" ");
}

export function PastTestsView({ uid }: Props) {
  const [mode, setMode] = useState<ViewMode>({ kind: "list" });
  const [sessions, setSessions] = useState<SessionSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    getTestHistory(uid)
      .then((s) => {
        if (!cancelled) setSessions(s);
      })
      .catch((e) => {
        if (!cancelled) setError((e as Error).message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [uid]);

  if (loading) {
    return (
      <GlassCard>
        <p className="text-sm text-text-muted">Loading past tests…</p>
      </GlassCard>
    );
  }

  if (error) {
    return (
      <GlassCard>
        <p className="text-sm text-red-400">Failed to load past tests: {error}</p>
      </GlassCard>
    );
  }

  if (mode.kind === "detail") {
    return (
      <PastTestDetail
        uid={uid}
        testSessionId={mode.testSessionId}
        onBack={() => setMode({ kind: "list" })}
      />
    );
  }

  if (sessions.length === 0) {
    return (
      <GlassCard>
        <p className="text-sm text-text-muted">No tests taken yet.</p>
      </GlassCard>
    );
  }

  return (
    <GlassCard>
      <h3 className="mb-4 text-base font-bold">Past Tests</h3>
      <div className="flex flex-col gap-1.5">
        {sessions.map((s) => {
          const pct = s.percentage ?? 0;
          return (
            <div
              key={s.id}
              onClick={() => {
                if (s.testSessionId) {
                  setMode({ kind: "detail", testSessionId: s.testSessionId });
                }
              }}
              className={`grid grid-cols-5 items-center gap-2 rounded-lg border border-border-primary bg-bg-secondary p-3 text-sm transition ${
                s.testSessionId ? "cursor-pointer hover:border-panther-red/30" : "opacity-60"
              }`}
            >
              <span className="col-span-2 font-semibold">{formatTestType(s.testType)}</span>
              <span className="text-text-muted">{formatDate(s.createdAt)}</span>
              <span className="text-text-muted">
                {s.score}/{s.total} ({pct}%)
              </span>
              <span className="text-right text-panther-red">
                {s.testSessionId ? "Review →" : "Legacy"}
              </span>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}

type DetailFilter = "all" | "wrong" | "skipped";

function PastTestDetail({
  uid,
  testSessionId,
  onBack,
}: {
  uid: string;
  testSessionId: string;
  onBack: () => void;
}) {
  const [summary, setSummary] = useState<SessionSummary | null>(null);
  const [answers, setAnswers] = useState<StoredAnswer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<DetailFilter>("all");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    getTestSessionDetail(uid, testSessionId)
      .then(({ session, answers }) => {
        if (!cancelled) {
          setSummary(session);
          setAnswers(answers);
        }
      })
      .catch((e) => {
        if (!cancelled) setError((e as Error).message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [uid, testSessionId]);

  if (loading) {
    return (
      <GlassCard>
        <p className="text-sm text-text-muted">Loading test…</p>
      </GlassCard>
    );
  }

  if (error) {
    return (
      <GlassCard>
        <p className="text-sm text-red-400">Failed to load test: {error}</p>
        <button
          onClick={onBack}
          className="mt-3 rounded-full bg-bg-secondary px-3 py-1 text-xs font-semibold text-text-muted"
        >
          ← Back
        </button>
      </GlassCard>
    );
  }

  const filtered = answers.filter((a) => {
    if (filter === "wrong") return !a.correct && a.selectedAnswer !== "";
    if (filter === "skipped") return a.selectedAnswer === "";
    return true;
  });

  const wrongCount = answers.filter((a) => !a.correct && a.selectedAnswer !== "").length;
  const skippedCount = answers.filter((a) => a.selectedAnswer === "").length;

  // Breakdown by domain — correct / total per domain, ordered by weakest first
  const domainBreakdown: { domain: string; correct: number; total: number }[] = (() => {
    const map = new Map<string, { correct: number; total: number }>();
    for (const a of answers) {
      const d = a.domain || "Uncategorized";
      const row = map.get(d) ?? { correct: 0, total: 0 };
      row.total += 1;
      if (a.correct) row.correct += 1;
      map.set(d, row);
    }
    return Array.from(map.entries())
      .map(([domain, row]) => ({ domain, ...row }))
      .sort((a, b) => a.correct / a.total - b.correct / b.total);
  })();

  // Breakdown by skill — same shape, same weakest-first ordering
  const skillBreakdown: { skill: string; correct: number; total: number }[] = (() => {
    const map = new Map<string, { correct: number; total: number }>();
    for (const a of answers) {
      const s = a.skill || "Uncategorized";
      const row = map.get(s) ?? { correct: 0, total: 0 };
      row.total += 1;
      if (a.correct) row.correct += 1;
      map.set(s, row);
    }
    return Array.from(map.entries())
      .map(([skill, row]) => ({ skill, ...row }))
      .sort((a, b) => a.correct / a.total - b.correct / b.total);
  })();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="rounded-full bg-bg-secondary px-3 py-1 text-xs font-semibold text-text-muted hover:text-text-primary"
        >
          ← Back to Past Tests
        </button>
      </div>

      {summary && (
        <GlassCard>
          <div className="mb-1 text-xs uppercase tracking-wide text-text-muted">
            {formatTestType(summary.testType)}
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <div className="text-2xl font-bold">
              {summary.score}/{summary.total}
            </div>
            <div className="text-sm text-text-muted">
              {summary.percentage ?? 0}% &middot; {formatDate(summary.createdAt)}
              {summary.scaledScore != null && ` · Scaled ${summary.scaledScore}`}
            </div>
          </div>
        </GlassCard>
      )}

      {answers.length > 0 && (
        <GlassCard>
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-text-muted">
            Breakdown — weakest first
          </h4>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-text-muted">
                By Domain
              </div>
              <div className="flex flex-col gap-1.5">
                {domainBreakdown.map((d) => {
                  const pct = d.total > 0 ? d.correct / d.total : 0;
                  const barColor =
                    pct >= 0.8
                      ? "bg-emerald-400"
                      : pct >= 0.6
                      ? "bg-lime-400"
                      : pct >= 0.4
                      ? "bg-amber-400"
                      : pct >= 0.2
                      ? "bg-orange-400"
                      : "bg-red-400";
                  return (
                    <div key={d.domain} className="flex items-center gap-2 text-xs">
                      <span className="w-32 truncate text-text-secondary" title={d.domain}>
                        {d.domain}
                      </span>
                      <div className="flex-1 overflow-hidden rounded-full bg-bg-secondary">
                        <div
                          className={`h-1.5 ${barColor}`}
                          style={{ width: `${Math.max(pct * 100, 3)}%` }}
                        />
                      </div>
                      <span className="w-12 text-right font-mono text-text-muted">
                        {d.correct}/{d.total}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div>
              <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-text-muted">
                By Skill
              </div>
              <div className="flex flex-col gap-1.5">
                {skillBreakdown.slice(0, 10).map((sk) => {
                  const pct = sk.total > 0 ? sk.correct / sk.total : 0;
                  const barColor =
                    pct >= 0.8
                      ? "bg-emerald-400"
                      : pct >= 0.6
                      ? "bg-lime-400"
                      : pct >= 0.4
                      ? "bg-amber-400"
                      : pct >= 0.2
                      ? "bg-orange-400"
                      : "bg-red-400";
                  return (
                    <div key={sk.skill} className="flex items-center gap-2 text-xs">
                      <span className="w-32 truncate text-text-secondary" title={sk.skill}>
                        {sk.skill}
                      </span>
                      <div className="flex-1 overflow-hidden rounded-full bg-bg-secondary">
                        <div
                          className={`h-1.5 ${barColor}`}
                          style={{ width: `${Math.max(pct * 100, 3)}%` }}
                        />
                      </div>
                      <span className="w-12 text-right font-mono text-text-muted">
                        {sk.correct}/{sk.total}
                      </span>
                    </div>
                  );
                })}
                {skillBreakdown.length > 10 && (
                  <p className="mt-1 text-[10px] text-text-muted">
                    Showing 10 weakest of {skillBreakdown.length} skills
                  </p>
                )}
              </div>
            </div>
          </div>
        </GlassCard>
      )}

      <div className="flex flex-wrap gap-2">
        {(["all", "wrong", "skipped"] as DetailFilter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-3 py-1 text-xs font-semibold capitalize transition ${
              f === filter
                ? "bg-panther-red text-white"
                : "border border-border-primary bg-bg-secondary text-text-muted"
            }`}
          >
            {f} (
            {f === "all"
              ? answers.length
              : f === "wrong"
              ? wrongCount
              : skippedCount}
            )
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {filtered.map((a) => {
          const originalIdx = answers.indexOf(a);
          const skipped = a.selectedAnswer === "";
          const borderColor = skipped
            ? "border-l-slate-500"
            : a.correct
            ? "border-l-emerald-400"
            : "border-l-red-400";
          return (
            <GlassCard
              key={a.id}
              className={`border-l-[3px] ${borderColor}`}
            >
              <div className="mb-2 flex items-center justify-between text-xs text-text-muted">
                <span>
                  Question {originalIdx + 1} / {answers.length}
                </span>
                <span>
                  {a.domain} · {a.skill}
                </span>
              </div>

              <div className="mb-3 text-sm">
                {renderMath(a.stem)}
              </div>

              {a.choices.length > 0 && (
                <div className="mb-3 flex flex-col gap-1">
                  {a.choices.map((c) => {
                    const isUser = c.key === a.selectedAnswer;
                    const isCorrectChoice = c.key === a.correctAnswer;
                    let cls = "bg-bg-secondary text-text-muted";
                    if (isCorrectChoice) cls = "bg-emerald-400/15 text-emerald-300";
                    else if (isUser) cls = "bg-red-400/15 text-red-300";
                    return (
                      <div
                        key={c.key}
                        className={`flex gap-2 rounded-md px-3 py-1.5 text-sm ${cls}`}
                      >
                        <span className="font-bold">{c.key}.</span>
                        <span className="flex-1">
                          {renderMath(c.text)}
                        </span>
                        {isUser && <span className="text-xs">your answer</span>}
                        {isCorrectChoice && !isUser && (
                          <span className="text-xs">correct</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {a.choices.length === 0 && (
                <div className="mb-3 flex flex-col gap-1 text-sm">
                  <div className="rounded-md bg-bg-secondary px-3 py-1.5">
                    <span className="text-text-muted">Your answer: </span>
                    <span className={skipped ? "text-slate-500" : a.correct ? "text-emerald-300" : "text-red-300"}>
                      {skipped ? "(skipped)" : a.selectedAnswer}
                    </span>
                  </div>
                  <div className="rounded-md bg-bg-secondary px-3 py-1.5">
                    <span className="text-text-muted">Correct answer: </span>
                    <span className="text-emerald-300">{a.correctAnswer}</span>
                  </div>
                </div>
              )}

              {a.explanation && (
                <details open={!a.correct}>
                  <summary className="cursor-pointer text-xs font-semibold text-text-muted">
                    Explanation
                  </summary>
                  <div className="mt-2 text-sm text-text-secondary">
                    {renderMath(a.explanation)}
                  </div>
                </details>
              )}
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}
