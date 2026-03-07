"use client";

import { AnimatedParty, AnimatedCheck } from "@/components/icons";

interface CompleteStat {
  label: string;
  value: string;
  color?: string;
}

interface CompleteScreenProps {
  title: string;
  accentColor: string;
  description?: string;
  stats?: CompleteStat[];
  takeaways?: string[];
  nextHref?: string;
  nextLabel?: string;
  courseHref: string;
  courseLabel?: string;
}

export function CompleteScreen({
  title,
  accentColor,
  description,
  stats,
  takeaways,
  nextHref,
  nextLabel,
  courseHref,
  courseLabel = "Back to Course",
}: CompleteScreenProps) {
  return (
    <div className="flex min-h-screen flex-col items-center px-5 pb-16 pt-24 text-center">
      <h1 className="mb-4 font-display text-[clamp(2rem,5vw,3rem)] font-bold text-text-primary">
        {title}
      </h1>

      {description && (
        <p className="mb-10 max-w-[600px] text-[1.05rem] leading-[1.7] text-text-secondary">{description}</p>
      )}

      {stats && stats.length > 0 && (
        <div className="mb-8 grid w-full max-w-[400px] grid-cols-2 gap-3">
          {stats.map((s) => (
            <div key={s.label} className="rounded-xl bg-bg-surface p-4 text-center">
              <div className="mb-1 text-[.75rem] uppercase tracking-wider text-text-muted">{s.label}</div>
              <div className="font-mono text-xl font-bold" style={{ color: s.color || accentColor }}>
                {s.value}
              </div>
            </div>
          ))}
        </div>
      )}

      {takeaways && takeaways.length > 0 && (
        <div className="mb-10 w-full max-w-[600px] rounded-[18px] border border-[rgba(255,255,255,.05)] bg-[rgba(15,15,22,.75)] p-6 text-left shadow-[0_4px_32px_rgba(0,0,0,.2)] backdrop-blur-[20px]">
          <div className="mb-4 flex items-center gap-2 text-[1.1rem] font-bold" style={{ color: accentColor }}>
            <span>📋</span> Key Takeaways
          </div>
          {takeaways.map((t, i) => (
            <div key={i} className="flex items-start gap-3 py-2.5 text-[.93rem] leading-[1.6] text-[#b8b8c8]">
              <span className="mt-0.5 flex-shrink-0"><AnimatedCheck size={18} /></span>
              <span>{t}</span>
            </div>
          ))}
        </div>
      )}

      <div className="w-full max-w-[600px] border-t border-[rgba(255,255,255,.06)] pt-8">
        <div className="flex justify-center gap-3">
          <a
            href={courseHref}
            className="cursor-pointer rounded-xl border border-border-default bg-bg-surface px-6 py-3 text-[.95rem] font-semibold text-text-secondary no-underline transition-all duration-200 hover:-translate-y-0.5 hover:border-border-hover"
          >
            {courseLabel}
          </a>
          {nextHref && (
            <a
              href={nextHref}
              className="cursor-pointer rounded-xl border-none px-6 py-3 text-[.95rem] font-bold text-white no-underline transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110"
              style={{
                background: `linear-gradient(135deg, ${accentColor}, #a855f7)`,
              }}
            >
              {nextLabel || "Next Module →"}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
