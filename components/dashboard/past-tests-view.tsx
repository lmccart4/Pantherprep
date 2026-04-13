"use client";

import { useEffect, useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import {
  getTestHistory,
  getTestSessionDetail,
  type SessionSummary,
} from "@/lib/session-history";
import type { StoredAnswer } from "@/lib/adaptive/performance-service";

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

function formatTestType(tt: string): string {
  return tt
    .split("-")
    .map((p) => (p.length <= 3 ? p.toUpperCase() : p[0].toUpperCase() + p.slice(1)))
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

// Detail view is a stub for Task 9. Task 10 replaces this with the real component.
function PastTestDetail(_props: {
  uid: string;
  testSessionId: string;
  onBack: () => void;
}) {
  // The unused imports (getTestSessionDetail, StoredAnswer) will be used by
  // Task 10 when this stub is replaced. Keep them here so we don't have to
  // re-import next task.
  void getTestSessionDetail;
  return (
    <GlassCard>
      <p className="text-sm text-text-muted">Detail view coming in next task.</p>
    </GlassCard>
  );
}
