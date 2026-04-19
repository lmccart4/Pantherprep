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
  if (total === 0) return "bg-ink-4";
  if (pct >= 0.8) return "bg-green";
  if (pct >= 0.5) return "bg-amber";
  return "bg-accent";
}

export function SkillTrendline({ answers }: SkillTrendlineProps) {
  const buckets = bucketByDay(answers);
  const maxBarHeight = 48;
  const hasData = buckets.some((b) => b.total > 0);

  return (
    <div>
      <div className="mb-3 flex items-baseline justify-between">
        <div className="kicker">14-day trend</div>
        <div className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-ink-3">
          {hasData ? `${answers.length} answers` : "No activity"}
        </div>
      </div>
      <div
        className="flex items-end gap-[3px] border-b-2 border-ink pb-1"
        style={{ height: `${maxBarHeight}px` }}
      >
        {buckets.map((b, i) => {
          const pct = b.total > 0 ? b.correct / b.total : 0;
          const heightPct = b.total > 0 ? Math.max(pct * 100, 10) : 3;
          return (
            <div
              key={i}
              className={`flex-1 ${tierBg(pct, b.total)}`}
              style={{ height: `${heightPct}%`, opacity: b.total > 0 ? 1 : 0.35 }}
              title={b.total > 0 ? `${b.date}: ${b.correct}/${b.total}` : `${b.date}: no activity`}
            />
          );
        })}
      </div>
      <div className="mt-2 flex justify-between font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-ink-3">
        <span>{buckets[0]?.date.slice(5) ?? ""}</span>
        <span>{buckets[buckets.length - 1]?.date.slice(5) ?? ""}</span>
      </div>
      {!hasData && (
        <p className="mt-3 font-body text-[13px] italic text-ink-3">
          No data yet &mdash; start a practice session to see your trend.
        </p>
      )}
    </div>
  );
}
