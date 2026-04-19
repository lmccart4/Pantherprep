"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GlassCard } from "@/components/ui/glass-card";
import { PracticeRunner } from "@/components/practice/practice-runner";
import { SkillTrendline } from "./skill-trendline";
import { SkillRecentActivity } from "./skill-recent-activity";
import { SkillRow } from "./skill-row";
import {
  MATH_SKILLS,
  RW_SKILLS,
  skillLabel,
} from "@/lib/adaptive/adaptive-engine";
import {
  getProfileSkillData,
  getRecentAnswersForTaxonomyKey,
} from "@/lib/skill-mapping";
import { getSkillDescription } from "@/lib/skill-descriptions";
import { getQuestionsBySkill, type PracticeBatch } from "@/lib/practice-question-source";
import {
  getAdaptiveProfile,
  type AdaptiveProfile,
  type StoredAnswer,
} from "@/lib/adaptive/performance-service";

interface SkillDetailProps {
  uid: string;
  email: string;
  course: string;
  taxonomyKey: string;
  profile: AdaptiveProfile | null;
}

const COURSE_LABELS: Record<string, string> = {
  "sat-math": "SAT Math",
  "sat-rw": "SAT R&W",
  "nmsqt-math": "NMSQT Math",
  "nmsqt-rw": "NMSQT R&W",
  "psat89-math": "PSAT 8/9 Math",
  "psat89-rw": "PSAT 8/9 R&W",
};

function masteryColor(m: number, total: number): string {
  if (total === 0) return "text-ink-3";
  if (m >= 0.8) return "text-green";
  if (m >= 0.5) return "text-amber";
  return "text-accent";
}

function findDomain(course: string, taxonomyKey: string): string | null {
  const taxonomy: Record<string, string[]> = course.includes("math") ? MATH_SKILLS : RW_SKILLS;
  for (const [domain, skills] of Object.entries(taxonomy)) {
    if (skills.includes(taxonomyKey)) return domain;
  }
  return null;
}

function siblingsInDomain(course: string, domain: string, excludeKey: string): string[] {
  const taxonomy: Record<string, string[]> = course.includes("math") ? MATH_SKILLS : RW_SKILLS;
  return (taxonomy[domain] ?? []).filter((s) => s !== excludeKey);
}

export function SkillDetail({
  uid,
  email,
  course,
  taxonomyKey,
  profile: propProfile,
}: SkillDetailProps) {
  const domain = findDomain(course, taxonomyKey);

  const label = skillLabel(taxonomyKey);
  const description = getSkillDescription(taxonomyKey);

  const [profile, setProfile] = useState<AdaptiveProfile | null>(propProfile);
  const data = useMemo(() => getProfileSkillData(profile, taxonomyKey), [profile, taxonomyKey]);

  const [recentAnswers, setRecentAnswers] = useState<StoredAnswer[]>([]);
  const [recentLoading, setRecentLoading] = useState(true);
  const [recentError, setRecentError] = useState(false);
  const [session, setSession] = useState<PracticeBatch | null>(null);
  const [launching, setLaunching] = useState(false);
  const [launchError, setLaunchError] = useState<string | null>(null);

  useEffect(() => {
    setProfile(propProfile);
  }, [propProfile]);

  useEffect(() => {
    let cancelled = false;
    setRecentLoading(true);
    setRecentError(false);
    getRecentAnswersForTaxonomyKey(uid, taxonomyKey, 100)
      .then((rows) => {
        if (!cancelled) setRecentAnswers(rows);
      })
      .catch(() => {
        if (!cancelled) setRecentError(true);
      })
      .finally(() => {
        if (!cancelled) setRecentLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [uid, taxonomyKey]);

  const difficultyBreakdown = useMemo(() => {
    const agg = { F: { correct: 0, total: 0 }, M: { correct: 0, total: 0 }, C: { correct: 0, total: 0 } };
    for (const a of recentAnswers) {
      const key = (a.difficulty ?? "M") as "F" | "M" | "C";
      agg[key].total += 1;
      if (a.correct) agg[key].correct += 1;
    }
    return agg;
  }, [recentAnswers]);

  if (!domain) {
    notFound();
  }

  const handlePractice = async () => {
    setLaunching(true);
    setLaunchError(null);
    try {
      const batch = await getQuestionsBySkill(course, taxonomyKey, 10);
      if (batch.questions.length === 0) {
        setLaunchError("No content yet for this skill — check back soon.");
        return;
      }
      setSession(batch);
    } catch (e) {
      setLaunchError((e as Error).message);
    } finally {
      setLaunching(false);
    }
  };

  const handlePracticeAgain = async () => {
    try {
      const batch = await getQuestionsBySkill(course, taxonomyKey, 10);
      if (batch.questions.length === 0) {
        setSession(null);
        setLaunchError("No more content available.");
        return;
      }
      setSession(batch);
    } catch {
      setSession(null);
      setLaunchError("Failed to load next batch.");
    }
  };

  const handleExit = async () => {
    setSession(null);
    try {
      const [newProfile, newAnswers] = await Promise.all([
        getAdaptiveProfile(uid),
        getRecentAnswersForTaxonomyKey(uid, taxonomyKey, 100),
      ]);
      setProfile(newProfile);
      setRecentAnswers(newAnswers);
    } catch (e) {
      console.warn("post-practice refetch failed:", e);
    }
  };

  // --- Practice mode ---
  if (session) {
    return (
      <PracticeRunner
        uid={uid}
        email={email}
        course={course}
        skill={taxonomyKey}
        skillLabel={label}
        testType={`${course}-skill-practice`}
        questions={session.questions}
        fallbackNotes={session.fallbackNotes}
        beforeProfile={profile}
        onExit={handleExit}
        onPracticeAgain={handlePracticeAgain}
      />
    );
  }

  const errorPatterns = Object.entries(data.errorPatterns)
    .filter(([, count]) => (count as number) > 0)
    .sort((a, b) => (b[1] as number) - (a[1] as number))
    .slice(0, 3);

  const siblings = siblingsInDomain(course, domain, taxonomyKey).slice(0, 5);

  const masteryPct = data.total > 0 ? Math.round(data.mastery * 100) : null;
  const accuracy =
    data.total > 0 ? Math.round((data.correct / data.total) * 100) : null;

  return (
    <div className="mx-auto max-w-[1240px]">
      {/* Breadcrumb */}
      <div className="mb-5 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-ink-3">
        <Link href="/dashboard" className="hover:text-accent">
          Dashboard
        </Link>
        <span className="mx-2 text-ink-4">/</span>
        <Link href={`/skills/${course}`} className="hover:text-accent">
          Skills
        </Link>
        <span className="mx-2 text-ink-4">/</span>
        <Link href={`/skills/${course}`} className="hover:text-accent">
          {COURSE_LABELS[course] ?? course}
        </Link>
        <span className="mx-2 text-ink-4">/</span>
        <span className="text-accent">{label}</span>
      </div>

      {/* Masthead row: title + stat block */}
      <div className="mb-8 grid gap-8 border-b-2 border-ink pb-8 md:grid-cols-[3fr_2fr]">
        <div>
          <div className="kicker mb-3">{domain}</div>
          <h1 className="font-display text-[clamp(44px,5vw,72px)] leading-[0.95] text-ink">
            {label.split(" ").slice(0, -1).join(" ")}{" "}
            <em className="text-accent" style={{ fontStyle: "italic" }}>
              {label.split(" ").slice(-1)[0]}
            </em>
            .
          </h1>
          <p className="mt-4 border-l-2 border-accent pl-4 font-body text-[15px] italic leading-[1.55] text-ink-2">
            {description}
          </p>
        </div>
        <div className="border-2 border-ink bg-paper-card p-5 shadow-[5px_5px_0_var(--color-ink)]">
          <div className="grid grid-cols-2 gap-5">
            <div>
              <div className="kicker mb-2">Your mastery</div>
              <div className={`font-display text-[40px] leading-none ${masteryColor(data.mastery, data.total)}`}>
                {masteryPct != null ? `${masteryPct}%` : "—"}
              </div>
              <div className="mt-1 font-body text-[12px] italic text-ink-3">
                {data.total > 0 ? `${data.correct}/${data.total} all-time` : "no data yet"}
              </div>
            </div>
            <div>
              <div className="kicker mb-2">Attempts</div>
              <div className="font-display text-[40px] leading-none text-ink">
                {data.total}
              </div>
              <div className="mt-1 font-body text-[12px] italic text-ink-3">
                {data.total > 0 ? "tracked to date" : "—"}
              </div>
            </div>
            <div>
              <div className="kicker mb-2">Accuracy</div>
              <div className="font-display text-[40px] leading-none text-ink">
                {accuracy != null ? `${accuracy}%` : "—"}
              </div>
              <div className="mt-1 font-body text-[12px] italic text-ink-3">
                {data.nextReview ? `next review ${data.nextReview}` : "—"}
              </div>
            </div>
            <div>
              <div className="kicker mb-2">Action</div>
              <button
                onClick={handlePractice}
                disabled={launching}
                className="w-full border-2 border-ink bg-accent px-3 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-accent-fg transition-colors hover:bg-ink hover:text-paper disabled:opacity-40"
              >
                {launching ? "Loading…" : "Practice →"}
              </button>
              {launchError && (
                <p className="mt-2 font-body text-[11px] italic text-accent">{launchError}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Two-column detail */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-[2fr_3fr]">
        {/* Left column */}
        <div className="flex flex-col gap-6">
          {errorPatterns.length > 0 && (
            <div className="card-paper p-5">
              <div className="mb-3 kicker">Error patterns</div>
              <div className="flex flex-col">
                {errorPatterns.map(([cat, count], i) => (
                  <div
                    key={cat}
                    className={`flex items-baseline justify-between border-b border-dashed border-rule-hair py-2 ${
                      i === errorPatterns.length - 1 ? "border-b-0" : ""
                    }`}
                  >
                    <span className="font-body text-[14px] text-ink">
                      {skillLabel(cat)}
                    </span>
                    <span className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-accent">
                      × {count as number}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="card-paper p-5">
            <div className="mb-3 kicker">By difficulty</div>
            <div className="grid grid-cols-3 gap-0 border-2 border-ink">
              <div className="border-r-2 border-ink bg-paper-card px-3 py-3">
                <div className="kicker mb-1" style={{ color: "var(--color-green)" }}>
                  Easy
                </div>
                <div className="font-display text-[22px] leading-none text-green">
                  {difficultyBreakdown.F.correct}
                  <span className="font-mono text-[11px] text-ink-3">
                    /{difficultyBreakdown.F.total}
                  </span>
                </div>
              </div>
              <div className="border-r-2 border-ink bg-paper-card px-3 py-3">
                <div className="kicker mb-1" style={{ color: "var(--color-amber)" }}>
                  Medium
                </div>
                <div className="font-display text-[22px] leading-none text-amber">
                  {difficultyBreakdown.M.correct}
                  <span className="font-mono text-[11px] text-ink-3">
                    /{difficultyBreakdown.M.total}
                  </span>
                </div>
              </div>
              <div className="bg-paper-card px-3 py-3">
                <div className="kicker mb-1">Hard</div>
                <div className="font-display text-[22px] leading-none text-accent">
                  {difficultyBreakdown.C.correct}
                  <span className="font-mono text-[11px] text-ink-3">
                    /{difficultyBreakdown.C.total}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-6">
          <div className="card-paper p-5">
            {recentLoading ? (
              <p className="font-body text-[13px] italic text-ink-3">Loading trend…</p>
            ) : recentError ? (
              <p className="font-body text-[13px] italic text-accent">
                Couldn&apos;t load recent activity.
              </p>
            ) : (
              <SkillTrendline answers={recentAnswers} />
            )}
          </div>

          <div className="card-paper p-5">
            <SkillRecentActivity answers={recentAnswers} />
          </div>
        </div>
      </div>

      {/* Related skills */}
      {siblings.length > 0 && (
        <section className="mt-10">
          <div className="mb-4 flex items-baseline justify-between border-b-2 border-ink pb-3">
            <h2 className="font-display text-[clamp(24px,2.5vw,34px)] leading-tight text-ink">
              Related skills{" "}
              <em className="text-accent" style={{ fontStyle: "italic" }}>
                · {domain}
              </em>
            </h2>
            <div className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-ink-3">
              {siblings.length} nearby
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {siblings
              .map((key) => ({ key, data: getProfileSkillData(profile, key) }))
              .sort((a, b) => a.data.mastery - b.data.mastery)
              .map(({ key, data: siblingData }) => (
                <SkillRow
                  key={key}
                  taxonomyKey={key}
                  data={siblingData}
                  course={course}
                />
              ))}
          </div>
        </section>
      )}
    </div>
  );
}
