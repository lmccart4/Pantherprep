"use client";

import Link from "next/link";
import { AnimatedCheck } from "@/components/icons";
import { skillLabel } from "@/lib/adaptive/adaptive-engine";

interface CompleteStat {
  label: string;
  value: string;
  color?: string;
}

export interface PracticeSkillLink {
  course: string;
  taxonomyKey: string;
  label?: string;
  blurb?: string;
}

interface CompleteScreenProps {
  title: string;
  accentColor: string;
  description?: string;
  stats?: CompleteStat[];
  takeaways?: string[];
  practiceSkills?: PracticeSkillLink[];
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
  practiceSkills,
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

      {practiceSkills && practiceSkills.length > 0 && (
        <div
          className="mb-10 w-full max-w-[600px] rounded-[18px] border p-6 text-left"
          style={{
            background: "rgba(15,15,22,.75)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderColor: `${accentColor}30`,
            boxShadow: `0 4px 32px rgba(0,0,0,.2), 0 0 40px ${accentColor}10`,
          }}
        >
          <div
            className="mb-2 text-[11px] font-bold uppercase tracking-[2px]"
            style={{ color: accentColor }}
          >
            Practice What You Just Learned
          </div>
          <p className="mb-5 text-[.88rem] text-text-secondary">
            Adaptive practice on the skills this lesson covered. Each session pulls from the
            question pool keyed to the topic.
          </p>
          <div className="flex flex-col gap-3">
            {practiceSkills.map((s) => (
              <Link
                key={`${s.course}-${s.taxonomyKey}`}
                href={`/skills/${s.course}/${s.taxonomyKey}`}
                className="group flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-[rgba(8,8,12,.5)] px-5 py-4 transition-all hover:-translate-y-0.5 hover:border-white/25 hover:bg-[rgba(15,15,22,.7)]"
              >
                <div className="min-w-0">
                  <div className="truncate text-[15px] font-semibold text-white">
                    {s.label ?? skillLabel(s.taxonomyKey)}
                  </div>
                  {s.blurb && (
                    <div className="mt-0.5 text-[13px] text-text-muted">{s.blurb}</div>
                  )}
                </div>
                <span
                  className="shrink-0 text-sm font-semibold transition-transform group-hover:translate-x-0.5"
                  style={{ color: accentColor }}
                >
                  Practice &rarr;
                </span>
              </Link>
            ))}
          </div>
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
