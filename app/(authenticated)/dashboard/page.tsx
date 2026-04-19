/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { TopBar } from "@/components/layout/top-bar";
import { GlassCard } from "@/components/ui/glass-card";
import {
  useAdaptiveProfile,
} from "@/hooks/use-adaptive";
import { SkillRow } from "@/components/skills/skill-row";
import { getProfileSkillData, sourceToTaxonomyKey } from "@/lib/skill-mapping";
import { PastTestsView } from "@/components/dashboard/past-tests-view";
import { DraftsTab } from "@/components/dashboard/drafts-tab";
import {
  MATH_SKILLS,
  RW_SKILLS,
  getCourseTaxonomy,
  skillLabel,
} from "@/lib/adaptive/adaptive-engine";
import { getAllAdaptiveProfiles } from "@/lib/adaptive/performance-service";
import type { AdaptiveProfile, Recommendation } from "@/lib/adaptive/performance-service";
import { PracticeRunner } from "@/components/practice/practice-runner";
import { getAdaptivePracticeSet, type PracticeBatch } from "@/lib/practice-question-source";
import { getTeacherClasses } from "@/lib/firestore";

type Course = "sat-math" | "sat-rw" | "nmsqt-math" | "nmsqt-rw" | "psat89-math" | "psat89-rw";
type Tab = "overview" | "skills" | "past-tests" | "practice";
type TeacherTab = "overview" | "students" | "alerts" | "heatmap" | "drafts";

const COURSES: { value: Course; label: string }[] = [
  { value: "sat-math", label: "SAT Math" },
  { value: "sat-rw", label: "SAT R&W" },
  { value: "nmsqt-math", label: "NMSQT Math" },
  { value: "nmsqt-rw", label: "NMSQT R&W" },
  { value: "psat89-math", label: "PSAT 8/9 Math" },
  { value: "psat89-rw", label: "PSAT 8/9 R&W" },
];

function masteryColor(m: number): string {
  if (m >= 0.8) return "text-green";
  if (m >= 0.5) return "text-amber";
  return "text-accent";
}

function masteryBarColor(m: number): string {
  if (m >= 0.8) return "bg-green";
  if (m >= 0.5) return "bg-amber";
  return "bg-accent";
}

// ============================================================
// MAIN PAGE
// ============================================================

export default function DashboardPage() {
  const { user, role } = useAuth();
  const [course, setCourse] = useState<Course>("sat-math");

  if (!user) return null;

  return (
    <div className="min-h-screen bg-paper text-ink">
      <TopBar backHref="/home" backLabel="Home" />

      <div className="mx-auto max-w-[1240px] px-6 py-8">
        {/* Course selector — newspaper style */}
        <div className="mb-8 flex flex-wrap items-center gap-2">
          <span className="mr-2 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-ink-3">
            Course
          </span>
          {COURSES.map((c) => {
            const active = course === c.value;
            return (
              <button
                key={c.value}
                onClick={() => setCourse(c.value)}
                className={`border-2 border-ink px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.18em] transition-colors ${
                  active
                    ? "bg-ink text-paper"
                    : "bg-paper-card text-ink hover:bg-ink hover:text-paper"
                }`}
              >
                {c.label}
              </button>
            );
          })}
        </div>

        {role === "teacher" ? (
          <TeacherView course={course} />
        ) : (
          <StudentView uid={user.uid} email={user.email ?? ""} course={course} />
        )}
      </div>
    </div>
  );
}

// ============================================================
// STUDENT VIEW
// ============================================================

function StudentView({ uid, email, course }: { uid: string; email: string; course: Course }) {
  const { profile, loading, error, refresh } = useAdaptiveProfile(uid);
  const [tab, setTab] = useState<Tab>("overview");

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="text-center">
          <div className="kicker mb-3">Loading</div>
          <p className="font-body text-[14px] italic text-ink-3">Loading adaptive profile…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-md border-2 border-accent bg-accent-soft p-6 text-center shadow-[5px_5px_0_var(--color-ink)]">
        <div className="mb-2 kicker">Error</div>
        <p className="font-body text-[14px] italic text-accent">{error}</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="mx-auto w-full max-w-2xl border-2 border-ink bg-paper-card p-8 text-center shadow-[5px_5px_0_var(--color-ink)]">
          <div className="kicker mb-3">Empty state</div>
          <h2 className="mb-3 font-display text-[clamp(32px,4vw,48px)] leading-tight text-ink">
            No adaptive data{" "}
            <em className="text-accent" style={{ fontStyle: "italic" }}>
              yet
            </em>
            .
          </h2>
          <p className="mb-6 font-body text-[15px] italic leading-[1.55] text-ink-2">
            Take a diagnostic or a few practice modules and your mastery map will populate here.
          </p>
          <div className="mb-6 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {[
              ["/diagnostics/sat-math", "SAT Math"],
              ["/diagnostics/sat-rw", "SAT R&W"],
              ["/diagnostics/nmsqt-math", "NMSQT Math"],
              ["/diagnostics/nmsqt-rw", "NMSQT R&W"],
              ["/diagnostics/psat89-math", "PSAT 8/9 Math"],
              ["/diagnostics/psat89-rw", "PSAT 8/9 R&W"],
            ].map(([href, label]) => (
              <a
                key={href}
                href={href}
                className="border-2 border-ink bg-paper-card px-3 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-ink transition-colors hover:bg-ink hover:text-paper"
              >
                {label}
              </a>
            ))}
          </div>
          <button
            onClick={refresh}
            className="border-2 border-ink bg-accent px-5 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-accent-fg transition-colors hover:bg-ink hover:text-paper"
          >
            Check again →
          </button>
        </div>
      </div>
    );
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: "overview", label: "Overview" },
    { key: "skills", label: "Skills" },
    { key: "past-tests", label: "Past Tests" },
    { key: "practice", label: "Practice" },
  ];

  return (
    <div>
      {/* Masthead */}
      <div className="mb-8 border-b-2 border-ink pb-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="kicker mb-3">● Adaptive engine · Live · {profile.totalAnswers} answers tracked</div>
            <h1 className="font-display text-[clamp(44px,5vw,72px)] leading-[0.95] text-ink">
              The{" "}
              <em className="text-accent" style={{ fontStyle: "italic" }}>
                adaptive
              </em>{" "}
              desk.
            </h1>
            <p className="mt-3 max-w-xl font-body text-[15px] italic leading-[1.55] text-ink-2">
              Everything the engine knows about you, laid out the way a coach would write it up —
              so the next move is obvious.
            </p>
          </div>
          <button
            onClick={refresh}
            className="border-2 border-ink bg-paper-card px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-ink transition-colors hover:bg-ink hover:text-paper"
          >
            Refresh →
          </button>
        </div>
      </div>

      {/* Tabs — editorial section nav */}
      <div className="mb-8 flex flex-wrap gap-0 border-b-2 border-ink">
        {tabs.map((t) => {
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`font-mono text-[11px] font-bold uppercase tracking-[0.18em] transition-colors ${
                active
                  ? "bg-ink px-4 py-3 text-paper"
                  : "px-4 py-3 text-ink-2 hover:text-accent"
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      {tab === "overview" && <StudentOverview profile={profile} course={course} />}
      {tab === "skills" && (
        <StudentSkills profile={profile} course={course} />
      )}
      {tab === "past-tests" && <PastTestsView uid={uid} />}
      {tab === "practice" && <StudentPractice profile={profile} uid={uid} email={email} course={course} onRefetch={refresh} />}
    </div>
  );
}

// ---- Student Overview Tab ----

function StudentOverview({ profile, course }: { profile: AdaptiveProfile; course: Course }) {
  const { totalAnswers, totalCorrect, streakDays, weeklyStats, recommendations, domains } = profile;
  const overallPct = totalAnswers > 0 ? Math.round((totalCorrect / totalAnswers) * 100) : 0;

  return (
    <div>
      {/* Scoreboard */}
      <div className="mb-8 grid grid-cols-2 gap-0 border-2 border-ink bg-paper-card shadow-[5px_5px_0_var(--color-ink)] sm:grid-cols-4">
        <StatCard label="Overall accuracy" value={`${overallPct}%`} color={masteryColor(overallPct / 100)} />
        <StatCard label="Questions answered" value={String(totalAnswers)} />
        <StatCard label="Day streak" value={String(streakDays)} color="text-amber" />
        <StatCard label="This week" value={`${weeklyStats?.answersThisWeek || 0}`} />
      </div>

      {/* Weekly momentum */}
      {weeklyStats && (
        <section className="mb-10">
          <div className="mb-4 flex items-baseline justify-between border-b-2 border-ink pb-3">
            <h2 className="font-display text-[clamp(26px,3vw,36px)] leading-tight text-ink">
              Weekly{" "}
              <em className="text-accent" style={{ fontStyle: "italic" }}>
                momentum
              </em>
            </h2>
            <div className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-ink-3">
              Derived · last 7 days
            </div>
          </div>
          <div className="grid gap-0 border-2 border-ink bg-paper-card sm:grid-cols-3">
            <div className="border-rule-hair p-5 sm:border-r">
              <div className="mb-2 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-green">
                ▲ Improving
              </div>
              <div className="font-body text-[14px] italic text-ink">
                {weeklyStats.improvingDomains?.length
                  ? weeklyStats.improvingDomains.join(", ")
                  : "—"}
              </div>
            </div>
            <div className="border-t border-rule-hair p-5 sm:border-l-0 sm:border-r sm:border-t-0">
              <div className="mb-2 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-accent">
                ▼ Needs attention
              </div>
              <div className="font-body text-[14px] italic text-ink">
                {weeklyStats.decliningDomains?.length
                  ? weeklyStats.decliningDomains.join(", ")
                  : "—"}
              </div>
            </div>
            <div className="border-t border-rule-hair p-5 sm:border-t-0">
              <div className="mb-2 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-amber">
                ◆ Top error pattern
              </div>
              <div className="font-body text-[14px] italic text-ink">
                {weeklyStats.dominantErrorCategory
                  ? skillLabel(weeklyStats.dominantErrorCategory)
                  : "—"}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Domain spread */}
      <section className="mb-10">
        <div className="mb-4 flex items-baseline justify-between border-b-2 border-ink pb-3">
          <h2 className="font-display text-[clamp(26px,3vw,36px)] leading-tight text-ink">
            Domain{" "}
            <em className="text-accent" style={{ fontStyle: "italic" }}>
              spread
            </em>
          </h2>
          <div className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-ink-3">
            {Object.keys(domains || {}).length} domains
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(domains || {}).map(([domain, data]: [string, any]) => {
            const m = data?.mastery ?? 0;
            return (
              <div
                key={domain}
                className="border-2 border-ink bg-paper-card p-5"
              >
                <div className="mb-2 flex items-baseline justify-between">
                  <span className="font-display text-[18px] leading-tight text-ink">
                    {domain}
                  </span>
                  <span className={`font-display text-[22px] leading-none ${masteryColor(m)}`}>
                    {Math.round(m * 100)}%
                  </span>
                </div>
                <div className="mb-2 h-[5px] w-full border border-ink bg-paper">
                  <div
                    className={`h-full ${masteryBarColor(m)}`}
                    style={{ width: `${m * 100}%` }}
                  />
                </div>
                <div className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-ink-3">
                  {data?.totalCorrect ?? 0}/{data?.totalAnswers ?? 0} correct
                </div>
                {data?.weakestSkills?.length > 0 && (
                  <div className="mt-2 border-t border-dashed border-rule-hair pt-2 font-body text-[12px] italic text-accent">
                    Focus · {data.weakestSkills.map(skillLabel).join(", ")}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Recommendations */}
      <section>
        <div className="mb-4 flex items-baseline justify-between border-b-2 border-ink pb-3">
          <h2 className="font-display text-[clamp(26px,3vw,36px)] leading-tight text-ink">
            Recommended{" "}
            <em className="text-accent" style={{ fontStyle: "italic" }}>
              practice
            </em>
          </h2>
          <div className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-ink-3">
            Ranked · impact-weighted
          </div>
        </div>
        <div className="border-2 border-ink bg-paper-card">
          {recommendations?.length > 0 ? (
            recommendations.slice(0, 5).map((rec: Recommendation, i: number) => {
              const taxonomyKey = sourceToTaxonomyKey(rec.skill);
              const href = taxonomyKey ? `/skills/${course}/${taxonomyKey}` : `/skills/${course}`;
              return (
                <Link
                  key={i}
                  href={href}
                  className={`group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-paper-2 ${
                    i > 0 ? "border-t border-dashed border-rule-hair" : ""
                  }`}
                >
                  <div className="font-display text-[28px] leading-none text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div className="flex-1">
                    <div className="font-display text-[17px] leading-tight text-ink">
                      {skillLabel(rec.skill)}
                    </div>
                    <div className="font-body text-[13px] italic text-ink-2">
                      {rec.domain} · {rec.reason}
                    </div>
                  </div>
                  <span className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-accent transition-transform group-hover:translate-x-0.5">
                    Drill →
                  </span>
                </Link>
              );
            })
          ) : (
            <p className="p-5 font-body text-[14px] italic text-ink-3">
              Complete more practice to get personalized recommendations.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

// ---- Student Skills Tab ----

function StudentSkills({
  profile,
  course,
}: {
  profile: AdaptiveProfile;
  course: Course;
}) {
  const allSkills = useMemo(() => {
    const taxonomy: Record<string, string[]> = getCourseTaxonomy(course);
    const out: Array<{ key: string; data: ReturnType<typeof getProfileSkillData> }> = [];
    for (const skills of Object.values(taxonomy)) {
      for (const key of skills as string[]) {
        out.push({ key, data: getProfileSkillData(profile, key) });
      }
    }
    return out;
  }, [profile, course]);

  const weakest = useMemo(() => {
    // Sort by ascending mastery; untested (total=0) treated as weakest (negative infinity sentinel)
    return [...allSkills]
      .sort((a, b) => {
        if (a.data.total === 0 && b.data.total > 0) return -1;
        if (b.data.total === 0 && a.data.total > 0) return 1;
        return a.data.mastery - b.data.mastery;
      })
      .slice(0, 6);
  }, [allSkills]);

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="kicker">
          Top skills to focus on
        </h3>
        <Link
          href={`/skills/${course}`}
          className="text-xs text-panther-red transition hover:text-panther-red/80"
        >
          See full catalog →
        </Link>
      </div>
      <div className="flex flex-col gap-2">
        {weakest.map(({ key, data }) => (
          <SkillRow key={key} taxonomyKey={key} data={data} course={course} />
        ))}
      </div>
    </div>
  );
}


// ---- Student Practice Tab ----

function StudentPractice({
  profile,
  uid,
  email,
  course,
  onRefetch,
}: {
  profile: AdaptiveProfile;
  uid: string;
  email: string;
  course: Course;
  onRefetch?: () => void;
}) {
  const recs = profile?.recommendations || [];
  const [launching, setLaunching] = useState(false);
  const [session, setSession] = useState<PracticeBatch | null>(null);
  const [excludeIds, setExcludeIds] = useState<string[]>([]);

  const launchAdaptive = async () => {
    setLaunching(true);
    try {
      const batch = await getAdaptivePracticeSet(uid, course, 15);
      if (batch.questions.length === 0) {
        setLaunching(false);
        return;
      }
      setSession(batch);
    } finally {
      setLaunching(false);
    }
  };

  const handlePracticeAgain = async () => {
    const newExclude = session
      ? [...excludeIds, ...session.questions.map((q) => q.id)]
      : excludeIds;
    setExcludeIds(newExclude);
    setLaunching(true);
    try {
      const batch = await getAdaptivePracticeSet(uid, course, 15, { excludeIds: newExclude });
      setSession(batch);
    } finally {
      setLaunching(false);
    }
  };

  const handleExit = () => {
    setSession(null);
    onRefetch?.();
  };

  // If a session is active, render the runner in place of the plan
  if (session) {
    return (
      <PracticeRunner
        uid={uid}
        email={email}
        course={course}
        testType={`${course}-adaptive-practice`}
        questions={session.questions}
        fallbackNotes={session.fallbackNotes}
        beforeProfile={profile}
        onExit={handleExit}
        onPracticeAgain={handlePracticeAgain}
      />
    );
  }

  return (
    <GlassCard>
      <h3 className="mb-2 text-base font-bold">Your Adaptive Practice Plan</h3>
      <p className="mb-4 text-sm text-text-muted">
        Based on your performance data, here&apos;s what to focus on next.
      </p>

      {recs.length > 0 ? (
        <div className="flex flex-col gap-2">
          {recs.map((rec: Recommendation, i: number) => {
            const taxonomyKey = sourceToTaxonomyKey(rec.skill);
            const href = taxonomyKey ? `/skills/${course}/${taxonomyKey}` : `/skills/${course}`;
            return (
              <Link
                key={i}
                href={href}
                className="flex items-center gap-3 rounded-lg border border-border-primary bg-bg-primary p-3 transition hover:border-panther-red/30"
              >
                <div
                  className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    i < 3 ? "bg-panther-red text-ink" : "bg-bg-secondary text-text-muted"
                  }`}
                >
                  {rec.priority}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold">{skillLabel(rec.skill)}</div>
                  <div className="text-xs text-text-muted">
                    {rec.domain} &middot; {rec.reason}
                  </div>
                </div>
                <span className="text-xs text-text-muted">›</span>
              </Link>
            );
          })}
        </div>
      ) : (
        <p className="text-sm text-text-muted">
          Complete some modules to generate recommendations.
        </p>
      )}

      <button
        onClick={launchAdaptive}
        disabled={recs.length === 0 || launching}
        className="mt-5 w-full rounded-lg bg-panther-red py-3.5 text-sm font-bold text-ink transition hover:bg-panther-red/90 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {launching
          ? "Loading..."
          : `Launch Adaptive Practice (${recs.reduce(
              (s: number, r: Recommendation) => s + (r.questionCount || 0),
              0
            )} questions)`}
      </button>
    </GlassCard>
  );
}

// ============================================================
// TEACHER VIEW
// ============================================================

function TeacherView({ course }: { course: Course }) {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<AdaptiveProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<TeacherTab>("overview");
  const [selectedStudent, setSelectedStudent] = useState<AdaptiveProfile | null>(null);
  const [sortBy, setSortBy] = useState<"name" | "mastery" | "activity" | "streak">("name");

  const taxonomy = getCourseTaxonomy(course);

  useEffect(() => {
    loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uid]);

  async function loadData() {
    setLoading(true);
    try {
      // Fetch only students in this teacher's classes to avoid full collection scan
      let studentUids: string[] | undefined;
      if (user?.uid) {
        const classes = await getTeacherClasses(user.uid);
        const allStudents = classes.flatMap((c) => c.students || []);
        if (allStudents.length > 0) {
          studentUids = [...new Set(allStudents)];
        }
      }
      const all = await getAllAdaptiveProfiles(studentUids);
      setProfiles(all);
    } catch (e) {
      console.warn("TeacherDashboard load error:", e);
    } finally {
      setLoading(false);
    }
  }

  const classStats = useMemo(() => {
    if (!profiles.length) return null;
    const totalStudents = profiles.length;
    const activeThisWeek = profiles.filter((p) => (p.weeklyStats?.answersThisWeek || 0) > 0).length;
    const avgMastery = profiles.reduce((sum, p) => {
      const dm = Object.values(p.domains || {}).map((d: any) => d.mastery || 0);
      return sum + (dm.length > 0 ? dm.reduce((a: number, b: number) => a + b, 0) / dm.length : 0);
    }, 0) / totalStudents;
    const avgAccuracy = profiles.reduce((sum, p) => sum + (p.totalAnswers > 0 ? p.totalCorrect / p.totalAnswers : 0), 0) / totalStudents;
    const totalAnswersThisWeek = profiles.reduce((s, p) => s + (p.weeklyStats?.answersThisWeek || 0), 0);
    return { totalStudents, activeThisWeek, avgMastery, avgAccuracy, totalAnswersThisWeek };
  }, [profiles]);

  const alerts = useMemo(() => {
    const a: { uid: string; type: string; severity: "high" | "medium" | "low"; message: string }[] = [];
    for (const p of profiles) {
      const dm = Object.values(p.domains || {}).map((d: any) => d.mastery || 0);
      const avgM = dm.length > 0 ? dm.reduce((s, v) => s + v, 0) / dm.length : 0;
      if (avgM < 0.3 && p.totalAnswers > 10) {
        a.push({ uid: p.uid || "", type: "low_mastery", severity: "high", message: `Overall mastery at ${Math.round(avgM * 100)}% after ${p.totalAnswers} questions` });
      }
      if (p.weeklyStats?.decliningDomains?.length > 0) {
        a.push({ uid: p.uid || "", type: "declining", severity: "medium", message: `Declining in: ${p.weeklyStats.decliningDomains.join(", ")}` });
      }
      if (p.totalAnswers > 0 && (p.weeklyStats?.answersThisWeek || 0) === 0) {
        a.push({ uid: p.uid || "", type: "inactive", severity: "low", message: `No activity this week (${p.totalAnswers} total answers)` });
      }
    }
    return a.sort((x, y) => {
      const sev = { high: 0, medium: 1, low: 2 };
      return sev[x.severity] - sev[y.severity];
    });
  }, [profiles]);

  const classSkillMastery = useMemo(() => {
    const all: Record<string, { masteries: number[]; total: number; correct: number; avgMastery: number; studentCount: number }> = {};
    for (const p of profiles) {
      for (const [skill, data] of Object.entries(p.skills || {})) {
        const d = data as any;
        if (!all[skill]) all[skill] = { masteries: [], total: 0, correct: 0, avgMastery: 0, studentCount: 0 };
        all[skill].masteries.push(d.mastery);
        all[skill].total += d.total;
        all[skill].correct += d.correct;
      }
    }
    for (const v of Object.values(all)) {
      v.avgMastery = v.masteries.reduce((s, m) => s + m, 0) / v.masteries.length;
      v.studentCount = v.masteries.length;
    }
    return all;
  }, [profiles]);

  const sortedProfiles = useMemo(() => {
    return [...profiles].sort((a, b) => {
      if (sortBy === "name") return (a.uid || "").localeCompare(b.uid || "");
      if (sortBy === "mastery") {
        const aM = Object.values(a.domains || {}).reduce((s, d: any) => s + (d.mastery || 0), 0);
        const bM = Object.values(b.domains || {}).reduce((s, d: any) => s + (d.mastery || 0), 0);
        return aM - bM;
      }
      if (sortBy === "activity") return (b.weeklyStats?.answersThisWeek || 0) - (a.weeklyStats?.answersThisWeek || 0);
      if (sortBy === "streak") return (b.streakDays || 0) - (a.streakDays || 0);
      return 0;
    });
  }, [profiles, sortBy]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <p className="text-sm text-text-muted">Loading class data...</p>
      </div>
    );
  }

  const teacherTabs: { key: TeacherTab; label: string }[] = [
    { key: "overview", label: "Class Overview" },
    { key: "students", label: "Students" },
    { key: "alerts", label: `Alerts (${alerts.length})` },
    { key: "heatmap", label: "Skill Heatmap" },
    { key: "drafts", label: "Drafts" },
  ];

  return (
    <div>
      {/* Masthead — editorial header */}
      <div className="mb-6">
        <div className="kicker mb-2">The Faculty Desk &middot; Vol. 2</div>
        <div className="flex items-end justify-between gap-4 border-b-2 border-ink pb-4">
          <div>
            <h1 className="font-display text-4xl font-bold leading-none tracking-[-0.01em] text-ink sm:text-5xl">
              Teacher <em className="italic text-accent" style={{ fontStyle: "italic" }}>Dashboard</em>
            </h1>
            <p className="mt-2 font-body text-sm text-ink-2">
              <span className="font-mono text-xs tracking-wider text-ink">{profiles.length}</span> students on roll
              <span className="mx-2 text-ink-4">|</span>
              <span className="font-mono text-xs tracking-wider text-accent">{alerts.filter((a) => a.severity === "high").length}</span> high-priority alerts
            </p>
          </div>
          <button
            onClick={loadData}
            className="shrink-0 border-2 border-ink bg-paper-card px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-ink transition-colors hover:bg-ink hover:text-paper"
          >
            Refresh
          </button>
        </div>
        <div className="h-[2px] bg-ink" style={{ marginTop: 2 }} />
      </div>

      {/* Section tabs — newspaper section nav */}
      <div className="mb-6 flex flex-wrap gap-0 border-b-2 border-ink">
        {teacherTabs.map((t) => (
          <button
            key={t.key}
            onClick={() => { setTab(t.key); setSelectedStudent(null); }}
            className={`font-mono text-[11px] font-bold uppercase tracking-[0.18em] transition-colors ${
              tab === t.key
                ? "bg-ink px-4 py-3 text-paper"
                : "px-4 py-3 text-ink-2 hover:text-accent"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* CLASS OVERVIEW */}
      {tab === "overview" && classStats && (
        <div>
          <div className="mb-6 grid grid-cols-2 gap-0 border-2 border-ink bg-paper-card sm:grid-cols-5">
            <EditorialStat label="Students" value={String(classStats.totalStudents)} />
            <EditorialStat label="Active / Week" value={String(classStats.activeThisWeek)} />
            <EditorialStat label="Avg Mastery" value={`${Math.round(classStats.avgMastery * 100)}%`} accent={classStats.avgMastery < 0.5} />
            <EditorialStat label="Avg Accuracy" value={`${Math.round(classStats.avgAccuracy * 100)}%`} accent={classStats.avgAccuracy < 0.5} />
            <EditorialStat label="Answers / Week" value={String(classStats.totalAnswersThisWeek)} />
          </div>

          <div className="mb-6 border-2 border-ink bg-paper-card p-7">
            <div className="kicker mb-1">By the Numbers</div>
            <h3 className="mb-5 font-display text-2xl font-bold leading-tight text-ink">Class Domain Performance</h3>
            <div className="grid gap-0 sm:grid-cols-2 lg:grid-cols-4">
              {Object.entries(taxonomy).map(([domain, skills], idx, arr) => {
                const skillData = skills.map((s) => classSkillMastery[s]).filter(Boolean);
                const avgM = skillData.length > 0 ? skillData.reduce((s, d) => s + d.avgMastery, 0) / skillData.length : 0;
                const isLastCol = (idx + 1) % 4 === 0 || idx === arr.length - 1;
                return (
                  <div key={domain} className={`flex flex-col gap-3 p-4 ${!isLastCol ? "lg:border-r lg:border-rule-hair" : ""} border-t border-rule-hair first:border-t-0 lg:border-t-0`}>
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="font-body text-sm font-semibold text-ink">{domain}</span>
                      <span className={`font-mono text-lg font-bold ${avgM < 0.5 ? "text-accent" : "text-ink"}`}>{Math.round(avgM * 100)}%</span>
                    </div>
                    <div className="h-[6px] border border-ink bg-paper">
                      <div className={`h-full ${avgM < 0.5 ? "bg-accent" : "bg-ink"}`} style={{ width: `${avgM * 100}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {alerts.filter((a) => a.severity === "high").length > 0 && (
            <div className="border-2 border-ink bg-paper-card p-7 shadow-[5px_5px_0_var(--color-ink)]">
              <div className="mb-4 flex items-baseline justify-between border-b border-ink pb-3">
                <div>
                  <div className="kicker mb-1">Errata</div>
                  <h3 className="font-display text-2xl font-bold leading-tight text-accent">High Priority Alerts</h3>
                </div>
                <span className="stamp stamp-red">Review</span>
              </div>
              <ul className="divide-y divide-rule-hair">
                {alerts.filter((a) => a.severity === "high").slice(0, 5).map((alert, i) => (
                  <li key={i} className="flex items-center gap-3 py-2.5 font-body text-sm">
                    <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-accent">{alert.uid}</span>
                    <span className="flex-1 text-ink-2">{alert.message}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* STUDENTS */}
      {tab === "students" && !selectedStudent && (
        <div>
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <span className="kicker">Sort By</span>
            {(["name", "mastery", "activity", "streak"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSortBy(s)}
                className={`border-2 border-ink px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.18em] transition-colors ${
                  s === sortBy ? "bg-ink text-paper" : "bg-paper-card text-ink hover:bg-ink hover:text-paper"
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Editorial broadsheet roster */}
          <div className="border-2 border-ink bg-paper-card">
            {/* Header row */}
            <div className="hidden grid-cols-6 gap-2 border-b-2 border-ink px-4 py-2 sm:grid">
              <span className="kicker">Student</span>
              <span className="kicker text-right">Mastery</span>
              <span className="kicker text-right">Accuracy</span>
              <span className="kicker text-right">Per Week</span>
              <span className="kicker text-right">Streak</span>
              <span className="kicker text-right">&nbsp;</span>
            </div>
            <div>
              {sortedProfiles.map((p, i) => {
                const dm = Object.values(p.domains || {}).map((d: any) => d.mastery || 0);
                const avgM = dm.length > 0 ? dm.reduce((s, v) => s + v, 0) / dm.length : 0;
                const accuracy = p.totalAnswers > 0 ? p.totalCorrect / p.totalAnswers : 0;
                const struggling = avgM < 0.4 && p.totalAnswers > 10;
                return (
                  <div
                    key={p.uid}
                    onClick={() => setSelectedStudent(p)}
                    className={`grid cursor-pointer grid-cols-3 items-center gap-2 px-4 py-3 transition-colors hover:bg-paper sm:grid-cols-6 ${i > 0 ? "border-t border-rule-hair" : ""}`}
                  >
                    <span className={`col-span-2 font-display text-base font-bold sm:col-span-1 ${struggling ? "text-accent" : "text-ink"}`}>
                      {p.uid}
                    </span>
                    <span className={`text-right font-mono text-sm font-bold ${struggling ? "text-accent" : "text-ink"}`}>
                      {Math.round(avgM * 100)}%
                    </span>
                    <span className="hidden text-right font-mono text-sm text-ink-2 sm:inline">{Math.round(accuracy * 100)}%</span>
                    <span className="hidden text-right font-mono text-sm text-ink-2 sm:inline">{p.weeklyStats?.answersThisWeek || 0}</span>
                    <span className="hidden text-right font-mono text-sm text-ink-2 sm:inline">{p.streakDays || 0}d</span>
                    <span className="text-right font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-accent">
                      Read <span aria-hidden>&rarr;</span>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* STUDENT DRILL-DOWN */}
      {tab === "students" && selectedStudent && (
        <TeacherStudentDrillDown profile={selectedStudent} course={course} onBack={() => setSelectedStudent(null)} />
      )}

      {/* ALERTS */}
      {tab === "alerts" && (
        <div className="border-2 border-ink bg-paper-card p-7">
          <div className="kicker mb-1">Intervention Desk</div>
          <h3 className="mb-5 font-display text-2xl font-bold leading-tight text-ink">Open Alerts</h3>
          {alerts.length === 0 ? (
            <p className="font-body text-base italic text-ink-2">No alerts — all students are on track.</p>
          ) : (
            <ul className="divide-y divide-rule-hair border-t-2 border-ink">
              {alerts.map((alert, i) => {
                const sevClass =
                  alert.severity === "high"
                    ? "text-accent"
                    : alert.severity === "medium"
                    ? "text-amber"
                    : "text-ink-3";
                const stampClass =
                  alert.severity === "high"
                    ? "stamp stamp-red"
                    : alert.severity === "medium"
                    ? "stamp stamp-amber"
                    : "stamp";
                return (
                  <li key={i} className="flex flex-wrap items-center gap-3 py-3">
                    <span className={stampClass} style={{ transform: "rotate(-1deg)" }}>
                      {alert.severity}
                    </span>
                    <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-ink-3">
                      {alert.type.replace("_", " ")}
                    </span>
                    <span className={`font-display text-base font-bold ${sevClass}`}>{alert.uid}</span>
                    <span className="flex-1 font-body text-sm text-ink-2">{alert.message}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}

      {/* SKILL HEATMAP */}
      {tab === "heatmap" && (
        <div className="border-2 border-ink bg-paper-card p-7">
          <div className="kicker mb-1">The Forecast</div>
          <h3 className="mb-1 font-display text-2xl font-bold leading-tight text-ink">Class Skill Mastery</h3>
          <p className="mb-6 font-body text-sm italic text-ink-2">
            Average mastery across all students. <em className="text-accent">Red indicates class weakness.</em>
          </p>
          {Object.entries(taxonomy).map(([domain, skills]) => (
            <section key={domain} className="mb-6 last:mb-0">
              <div className="mb-3 flex items-baseline justify-between border-b border-ink pb-1">
                <h4 className="font-display text-lg font-bold text-ink">{domain}</h4>
                <span className="kicker">Section</span>
              </div>
              <div className="grid grid-cols-1 gap-0 border border-ink sm:grid-cols-2 lg:grid-cols-4">
                {skills.map((skillKey, idx) => {
                  const data = classSkillMastery[skillKey];
                  const m = data?.avgMastery ?? 0;
                  const weak = m < 0.5 && data;
                  return (
                    <div
                      key={skillKey}
                      className={`border-rule-hair p-3 ${idx > 0 ? "border-t sm:border-t sm:[&:nth-child(2n+1)]:border-l-0 sm:border-l lg:[&:nth-child(4n+1)]:border-l-0 lg:border-l" : ""} ${weak ? "bg-accent-soft" : ""}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-body text-xs leading-snug text-ink">{skillLabel(skillKey)}</span>
                        <span className={`font-mono text-sm font-bold ${weak ? "text-accent" : "text-ink"}`}>
                          {data ? `${Math.round(m * 100)}%` : "\u2014"}
                        </span>
                      </div>
                      {data && (
                        <div className="mt-1 font-mono text-[10px] tracking-wider text-ink-3">
                          {data.studentCount} students &middot; {data.correct}/{data.total} correct
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}

      {/* DRAFTS */}
      {tab === "drafts" && (
        <DraftsTab
          studentLookup={Object.fromEntries(
            profiles.map((p) => [
              p.uid,
              (p as AdaptiveProfile & { displayName?: string }).displayName ?? p.uid.slice(0, 8),
            ])
          )}
        />
      )}
    </div>
  );
}

// ---- Teacher Student Drill-Down ----

function TeacherStudentDrillDown({
  profile,
  course,
  onBack,
}: {
  profile: AdaptiveProfile;
  course: Course;
  onBack: () => void;
}) {
  const [drillTab, setDrillTab] = useState<"mastery" | "past-tests">("mastery");
  const dm = Object.values(profile.domains || {}).map((d: any) => d.mastery || 0);
  const avgM = dm.length > 0 ? dm.reduce((s, v) => s + v, 0) / dm.length : 0;

  const struggling = avgM < 0.4 && profile.totalAnswers > 10;

  return (
    <div>
      <button
        onClick={onBack}
        className="mb-4 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-ink-3 transition-colors hover:text-accent"
      >
        &larr; Back to Students
      </button>

      {/* Sub-tab strip — newspaper section */}
      <div className="mb-5 flex gap-0 border-b-2 border-ink">
        {(["mastery", "past-tests"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setDrillTab(t)}
            className={`font-mono text-[11px] font-bold uppercase tracking-[0.18em] transition-colors ${
              drillTab === t
                ? "bg-ink px-4 py-2.5 text-paper"
                : "px-4 py-2.5 text-ink-2 hover:text-accent"
            }`}
          >
            {t === "mastery" ? "Mastery" : "Past Tests"}
          </button>
        ))}
      </div>

      {drillTab === "mastery" && (
        <>
          {/* Student broadsheet header */}
          <div className="mb-6 border-2 border-ink bg-paper-card p-7 shadow-[5px_5px_0_var(--color-ink)]">
            <div className="kicker mb-2">Student Profile</div>
            <div className="flex items-start justify-between gap-6">
              <div className="min-w-0 flex-1">
                <h2 className={`mb-2 font-display text-4xl font-bold leading-none tracking-[-0.01em] ${struggling ? "text-accent" : "text-ink"}`}>
                  {profile.uid}
                </h2>
                <p className="font-body text-sm text-ink-2">
                  <span className="font-mono text-xs tracking-wider text-ink">{profile.totalAnswers}</span> answers
                  <span className="mx-2 text-ink-4">|</span>
                  <span className="font-mono text-xs tracking-wider text-ink">{profile.streakDays || 0}</span> day streak
                  <span className="mx-2 text-ink-4">|</span>
                  Last active <span className="font-mono text-xs tracking-wider text-ink">{profile.lastActiveDate || "—"}</span>
                </p>
              </div>
              <div className="shrink-0 border-l-2 border-ink pl-6 text-right">
                <div className={`font-display text-5xl font-bold leading-none ${struggling ? "text-accent" : "text-ink"}`}>
                  {Math.round(avgM * 100)}<span className="text-3xl">%</span>
                </div>
                <div className="kicker mt-1">Overall Mastery</div>
              </div>
            </div>
          </div>

          <div className="mb-6 grid grid-cols-1 gap-0 border-2 border-ink bg-paper-card sm:grid-cols-2 lg:grid-cols-4">
            {Object.entries(profile.domains || {}).map(([domain, data]: [string, any], idx, arr) => {
              const mastery = data.mastery || 0;
              const weak = mastery < 0.5;
              const isLastCol = (idx + 1) % 4 === 0 || idx === arr.length - 1;
              return (
                <div
                  key={domain}
                  className={`flex flex-col gap-2 p-4 ${!isLastCol ? "lg:border-r lg:border-rule-hair" : ""} ${idx > 0 ? "border-t border-rule-hair lg:border-t-0" : ""}`}
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="font-body text-sm font-semibold text-ink">{domain}</span>
                    <span className={`font-mono text-lg font-bold ${weak ? "text-accent" : "text-ink"}`}>{Math.round(mastery * 100)}%</span>
                  </div>
                  <div className="h-[6px] border border-ink bg-paper">
                    <div className={`h-full ${weak ? "bg-accent" : "bg-ink"}`} style={{ width: `${mastery * 100}%` }} />
                  </div>
                  <div className="font-mono text-[10px] tracking-wider text-ink-3">{data.totalCorrect}/{data.totalAnswers} correct</div>
                  {data.weakestSkills?.length > 0 && (
                    <div className="font-body text-[11px] italic text-accent">Weak: {data.weakestSkills.map(skillLabel).join(", ")}</div>
                  )}
                  {data.strongestSkills?.length > 0 && (
                    <div className="font-body text-[11px] text-ink-2">Strong: {data.strongestSkills.map(skillLabel).join(", ")}</div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="border-2 border-ink bg-paper-card p-7">
            <div className="kicker mb-1">The Assignment</div>
            <h3 className="mb-5 font-display text-2xl font-bold leading-tight text-ink">Recommended Next Steps</h3>
            {profile.recommendations?.length > 0 ? (
              <ol className="divide-y divide-rule-hair border-t-2 border-ink">
                {profile.recommendations.slice(0, 5).map((rec: any, i: number) => {
                  const taxonomyKey = sourceToTaxonomyKey(rec.skill) || rec.skill;
                  const href = `/skills/${course}/${taxonomyKey}`;
                  return (
                    <li key={i}>
                      <Link
                        href={href}
                        className="flex items-center gap-3 py-3 font-body text-sm transition-colors hover:bg-paper"
                      >
                        <span className="w-10 font-mono text-base font-bold text-accent">#{rec.priority}</span>
                        <span className="font-display text-base font-bold text-ink">{skillLabel(rec.skill)}</span>
                        <span className="flex-1 text-xs italic text-ink-2">{rec.reason}</span>
                        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-accent">Read &rarr;</span>
                      </Link>
                    </li>
                  );
                })}
              </ol>
            ) : (
              <p className="font-body text-base italic text-ink-2">No recommendations yet.</p>
            )}
          </div>
        </>
      )}

      {drillTab === "past-tests" && <PastTestsView uid={profile.uid} />}
    </div>
  );
}

// ============================================================
// SHARED
// ============================================================

function StatCard({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <GlassCard className="text-center !p-4">
      <div className={`text-2xl font-bold tracking-tight ${color}`}>{value}</div>
      <div className="mt-1 text-[11px] uppercase tracking-wider text-text-muted">{label}</div>
    </GlassCard>
  );
}

// Editorial stat cell — broadsheet "by the numbers" style, used across teacher overview.
function EditorialStat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center border-rule-hair p-4 text-center [&:not(:first-child)]:border-l [&:nth-child(3)]:border-t sm:[&:nth-child(3)]:border-t-0">
      <div className={`font-display text-3xl font-bold leading-none tracking-[-0.01em] ${accent ? "text-accent" : "text-ink"}`}>{value}</div>
      <div className="kicker mt-2">{label}</div>
    </div>
  );
}
