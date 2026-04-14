"use client";

import type { StoredAnswer } from "@/lib/adaptive/performance-service";

interface SkillTrendlineProps {
  answers: StoredAnswer[];  // already filtered to this skill, ordered desc by timestamp
}

interface DayBucket {
  date: string;  // YYYY-MM-DD
  correct: number;
  total: number;
}

function bucketByDay(answers: StoredAnswer[], days = 14): DayBucket[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const buckets: DayBucket[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    buckets.push({
      date: d.toISOString().split("T")[0],
      correct: 0,
      total: 0,
    });
  }
  const bucketsByDate = new Map(buckets.map((b) => [b.date, b]));

  for (const a of answers) {
    if (!a.timestamp) continue;
    const ts = a.timestamp.toDate ? a.timestamp.toDate() : new Date(a.timestamp as unknown as string);
    const key = ts.toISOString().split("T")[0];
    const bucket = bucketsByDate.get(key);
    if (!bucket) continue;
    bucket.total += 1;
    if (a.correct) bucket.correct += 1;
  }
  return buckets;
}

function tierBg(pct: number, total: number): string {
  if (total === 0) return "bg-slate-700";
  if (pct >= 0.8) return "bg-emerald-400";
  if (pct >= 0.6) return "bg-lime-400";
  if (pct >= 0.4) return "bg-amber-400";
  if (pct >= 0.2) return "bg-orange-400";
  return "bg-red-400";
}

export function SkillTrendline({ answers }: SkillTrendlineProps) {
  const buckets = bucketByDay(answers);
  const maxBarHeight = 40;

  return (
    <div>
      <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-muted">
        14-day trend
      </div>
      <div className="flex items-end gap-1" style={{ height: `${maxBarHeight}px` }}>
        {buckets.map((b, i) => {
          const pct = b.total > 0 ? b.correct / b.total : 0;
          const heightPct = b.total > 0 ? Math.max(pct * 100, 8) : 4;
          return (
            <div
              key={i}
              className={`flex-1 rounded-t ${tierBg(pct, b.total)}`}
              style={{ height: `${heightPct}%`, opacity: b.total > 0 ? 1 : 0.35 }}
              title={b.total > 0 ? `${b.date}: ${b.correct}/${b.total}` : `${b.date}: no activity`}
            />
          );
        })}
      </div>
      <div className="mt-1 flex justify-between text-[10px] text-text-muted">
        <span>{buckets[0]?.date.slice(5) ?? ""}</span>
        <span>{buckets[buckets.length - 1]?.date.slice(5) ?? ""}</span>
      </div>
    </div>
  );
}
