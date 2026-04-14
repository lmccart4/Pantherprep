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
  if (total === 0) return "text-text-muted";
  if (m >= 0.8) return "text-emerald-400";
  if (m >= 0.6) return "text-lime-400";
  if (m >= 0.4) return "text-amber-400";
  if (m >= 0.2) return "text-orange-400";
  return "text-red-400";
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

  return (
    <div className="mx-auto max-w-5xl">
      {/* Breadcrumb */}
      <div className="mb-4 text-xs text-text-muted">
        <Link href="/dashboard" className="hover:text-text-secondary">
          Dashboard
        </Link>
        {" / "}
        <Link href={`/skills/${course}`} className="hover:text-text-secondary">
          Skills
        </Link>
        {" / "}
        <Link href={`/skills/${course}`} className="hover:text-text-secondary">
          {COURSE_LABELS[course] ?? course}
        </Link>
        {" / "}
        <span className="text-text-primary">{label}</span>
      </div>

      {/* Two-column main */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-[2fr_3fr]">
        {/* Left column */}
        <div className="flex flex-col gap-4">
          <GlassCard>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-muted">
              {domain}
            </div>
            <h1 className="mb-3 font-display text-3xl leading-tight tracking-[0.02em] text-white">
              {label}
            </h1>
            <p className="mb-5 text-sm leading-relaxed text-text-secondary">{description}</p>

            <div className="mb-4 flex items-baseline gap-3">
              <div className={`font-display text-[4rem] leading-none ${masteryColor(data.mastery, data.total)}`}>
                {data.total > 0 ? Math.round(data.mastery * 100) + "%" : "—"}
              </div>
              <div className="text-xs text-text-muted">
                {data.total > 0 ? `${data.correct}/${data.total} all-time` : "No data yet"}
                {data.nextReview && (
                  <div className="mt-1">Next review: {data.nextReview}</div>
                )}
              </div>
            </div>

            <button
              onClick={handlePractice}
              disabled={launching}
              className="w-full rounded-radius-md bg-panther-red py-3 text-sm font-semibold text-white transition hover:bg-panther-red/90 disabled:opacity-40"
            >
              {launching ? "Loading…" : "Practice this skill →"}
            </button>
            {launchError && (
              <p className="mt-3 text-xs text-amber-300">{launchError}</p>
            )}
          </GlassCard>

          {errorPatterns.length > 0 && (
            <GlassCard>
              <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-muted">
                Error patterns
              </div>
              <div className="flex flex-wrap gap-2">
                {errorPatterns.map(([cat, count]) => (
                  <span
                    key={cat}
                    className="rounded-full border border-red-400/20 bg-red-400/10 px-3 py-1 text-[11px] text-red-400"
                  >
                    {skillLabel(cat)} ×{count as number}
                  </span>
                ))}
              </div>
            </GlassCard>
          )}
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-4">
          <GlassCard>
            {recentLoading ? (
              <p className="text-xs text-text-muted">Loading trend…</p>
            ) : recentError ? (
              <p className="text-xs text-amber-300">Couldn&apos;t load recent activity.</p>
            ) : (
              <SkillTrendline answers={recentAnswers} />
            )}
          </GlassCard>

          <GlassCard>
            <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-muted">
              By difficulty
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="rounded-md bg-emerald-400/10 px-3 py-2">
                <div className="text-[10px] uppercase text-text-muted">Easy</div>
                <div className="mt-1 font-semibold text-emerald-400">
                  {difficultyBreakdown.F.correct}/{difficultyBreakdown.F.total}
                </div>
              </div>
              <div className="rounded-md bg-amber-400/10 px-3 py-2">
                <div className="text-[10px] uppercase text-text-muted">Medium</div>
                <div className="mt-1 font-semibold text-amber-400">
                  {difficultyBreakdown.M.correct}/{difficultyBreakdown.M.total}
                </div>
              </div>
              <div className="rounded-md bg-red-400/10 px-3 py-2">
                <div className="text-[10px] uppercase text-text-muted">Hard</div>
                <div className="mt-1 font-semibold text-red-400">
                  {difficultyBreakdown.C.correct}/{difficultyBreakdown.C.total}
                </div>
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <SkillRecentActivity answers={recentAnswers} />
          </GlassCard>
        </div>
      </div>

      {/* Related skills */}
      {siblings.length > 0 && (
        <div className="mt-6">
          <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-muted">
            Related skills in {domain}
          </div>
          <div className="flex flex-col gap-2">
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
        </div>
      )}
    </div>
  );
}
