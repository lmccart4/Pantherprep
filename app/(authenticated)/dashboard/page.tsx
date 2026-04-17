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
import {
  MATH_SKILLS,
  RW_SKILLS,
  skillLabel,
} from "@/lib/adaptive/adaptive-engine";
import { getAllAdaptiveProfiles } from "@/lib/adaptive/performance-service";
import type { AdaptiveProfile, Recommendation } from "@/lib/adaptive/performance-service";
import { PracticeRunner } from "@/components/practice/practice-runner";
import { getAdaptivePracticeSet, type PracticeBatch } from "@/lib/practice-question-source";
import { getTeacherClasses } from "@/lib/firestore";

type Course = "sat-math" | "sat-rw" | "nmsqt-math" | "nmsqt-rw" | "psat89-math" | "psat89-rw";
type Tab = "overview" | "skills" | "past-tests" | "practice";
type TeacherTab = "overview" | "students" | "alerts" | "heatmap";

const COURSES: { value: Course; label: string }[] = [
  { value: "sat-math", label: "SAT Math" },
  { value: "sat-rw", label: "SAT R&W" },
  { value: "nmsqt-math", label: "NMSQT Math" },
  { value: "nmsqt-rw", label: "NMSQT R&W" },
  { value: "psat89-math", label: "PSAT 8/9 Math" },
  { value: "psat89-rw", label: "PSAT 8/9 R&W" },
];

function masteryColor(m: number): string {
  if (m >= 0.8) return "text-emerald-400";
  if (m >= 0.6) return "text-lime-400";
  if (m >= 0.4) return "text-amber-400";
  if (m >= 0.2) return "text-orange-400";
  return "text-red-400";
}

function masteryBg(m: number): string {
  if (m >= 0.8) return "bg-emerald-400/15";
  if (m >= 0.6) return "bg-lime-400/12";
  if (m >= 0.4) return "bg-amber-400/12";
  if (m >= 0.2) return "bg-orange-400/12";
  return "bg-red-400/12";
}

function masteryBarColor(m: number): string {
  if (m >= 0.8) return "bg-emerald-400";
  if (m >= 0.6) return "bg-lime-400";
  if (m >= 0.4) return "bg-amber-400";
  if (m >= 0.2) return "bg-orange-400";
  return "bg-red-400";
}

// ============================================================
// MAIN PAGE
// ============================================================

export default function DashboardPage() {
  const { user, role } = useAuth();
  const [course, setCourse] = useState<Course>("sat-math");

  if (!user) return null;

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <TopBar backHref="/home" backLabel="Home" />

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {/* Course selector */}
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <span className="mr-2 text-sm text-text-muted">Course:</span>
          {COURSES.map((c) => (
            <button
              key={c.value}
              onClick={() => setCourse(c.value)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
                course === c.value
                  ? "bg-panther-red text-ink"
                  : "bg-bg-secondary text-text-muted hover:text-text-secondary border border-border-primary"
              }`}
            >
              {c.label}
            </button>
          ))}
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
          <div className="mb-3 text-3xl animate-pulse text-panther-red">&#9672;</div>
          <p className="text-sm text-text-muted">Loading adaptive profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <GlassCard className="mx-auto max-w-md text-center">
        <p className="text-red-400">{error}</p>
      </GlassCard>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="mx-auto w-full max-w-2xl">
          <GlassCard className="text-center">
            <div className="mb-4 text-5xl">&#128202;</div>
            <h2 className="mb-2 font-display text-2xl text-ink">No Adaptive Data Yet</h2>
            <p className="mb-6 text-sm text-text-muted">
              Take a diagnostic or a few practice modules and your mastery map will populate here.
            </p>
            <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
              <a href="/diagnostics/sat-math" className="rounded-lg border border-border-primary bg-bg-secondary px-3 py-2.5 text-xs font-semibold text-text-secondary transition hover:border-panther-red/40 hover:text-ink">SAT Math</a>
              <a href="/diagnostics/sat-rw" className="rounded-lg border border-border-primary bg-bg-secondary px-3 py-2.5 text-xs font-semibold text-text-secondary transition hover:border-panther-red/40 hover:text-ink">SAT R&amp;W</a>
              <a href="/diagnostics/nmsqt-math" className="rounded-lg border border-border-primary bg-bg-secondary px-3 py-2.5 text-xs font-semibold text-text-secondary transition hover:border-panther-red/40 hover:text-ink">NMSQT Math</a>
              <a href="/diagnostics/nmsqt-rw" className="rounded-lg border border-border-primary bg-bg-secondary px-3 py-2.5 text-xs font-semibold text-text-secondary transition hover:border-panther-red/40 hover:text-ink">NMSQT R&amp;W</a>
              <a href="/diagnostics/psat89-math" className="rounded-lg border border-border-primary bg-bg-secondary px-3 py-2.5 text-xs font-semibold text-text-secondary transition hover:border-panther-red/40 hover:text-ink">PSAT 8/9 Math</a>
              <a href="/diagnostics/psat89-rw" className="rounded-lg border border-border-primary bg-bg-secondary px-3 py-2.5 text-xs font-semibold text-text-secondary transition hover:border-panther-red/40 hover:text-ink">PSAT 8/9 R&amp;W</a>
            </div>
            <button onClick={refresh} className="rounded-full border border-ink/20 bg-paper-card px-5 py-2 text-xs font-semibold text-text-muted transition hover:text-text-primary">
              Check again
            </button>
          </GlassCard>
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
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            <span className="text-panther-red">&#9672;</span> Adaptive Dashboard
          </h1>
          <p className="mt-1 text-sm text-text-muted">
            {profile.totalAnswers} answers tracked &middot; {profile.streakDays} day streak
          </p>
        </div>
        <button onClick={refresh} className="rounded-lg border border-border-primary bg-bg-secondary px-4 py-2 text-sm text-panther-red transition hover:border-panther-red">
          Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-0 border-b border-border-primary">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-5 py-3 text-xs font-semibold uppercase tracking-wider transition ${
              tab === t.key
                ? "border-b-2 border-panther-red text-panther-red"
                : "border-b-2 border-transparent text-text-muted hover:text-text-secondary"
            }`}
          >
            {t.label}
          </button>
        ))}
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
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Overall Accuracy" value={`${overallPct}%`} color={masteryColor(overallPct / 100)} />
        <StatCard label="Questions Answered" value={String(totalAnswers)} color="text-sky-400" />
        <StatCard label="Day Streak" value={String(streakDays)} color="text-amber-500" />
        <StatCard label="This Week" value={`${weeklyStats?.answersThisWeek || 0}`} color="text-indigo-400" />
      </div>

      {/* Weekly momentum */}
      {weeklyStats && (
        <GlassCard className="mb-6">
          <h3 className="mb-4 text-base font-bold">Weekly Momentum</h3>
          <div className="flex flex-wrap gap-6">
            {weeklyStats.improvingDomains?.length > 0 && (
              <div>
                <span className="text-xs font-semibold text-emerald-400">&#9650; Improving</span>
                <div className="mt-1 text-xs text-text-muted">{weeklyStats.improvingDomains.join(", ")}</div>
              </div>
            )}
            {weeklyStats.decliningDomains?.length > 0 && (
              <div>
                <span className="text-xs font-semibold text-red-400">&#9660; Needs Attention</span>
                <div className="mt-1 text-xs text-text-muted">{weeklyStats.decliningDomains.join(", ")}</div>
              </div>
            )}
            {weeklyStats.dominantErrorCategory && (
              <div>
                <span className="text-xs font-semibold text-amber-400">Top Error Pattern</span>
                <div className="mt-1 text-xs text-text-muted">{skillLabel(weeklyStats.dominantErrorCategory)}</div>
              </div>
            )}
          </div>
        </GlassCard>
      )}

      {/* Domain mastery */}
      <GlassCard className="mb-6">
        <h3 className="mb-4 text-base font-bold">Domain Mastery</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(domains || {}).map(([domain, data]: [string, any]) => {
            const m = data?.mastery ?? 0;
            return (
              <div key={domain} className="rounded-lg border border-border-primary bg-bg-primary p-4">
                <div className="mb-2 flex items-start justify-between">
                  <span className="text-sm font-semibold">{domain}</span>
                  <span className={`text-lg font-bold ${masteryColor(m)}`}>{Math.round(m * 100)}%</span>
                </div>
                <div className="mb-2 h-2 overflow-hidden rounded-full bg-border-primary">
                  <div className={`h-full rounded-full ${masteryBarColor(m)} transition-all duration-500`} style={{ width: `${m * 100}%` }} />
                </div>
                <div className="text-xs text-text-muted">
                  {data?.totalCorrect ?? 0}/{data?.totalAnswers ?? 0} correct
                </div>
                {data?.weakestSkills?.length > 0 && (
                  <div className="mt-1 text-[11px] text-red-400">
                    Focus: {data.weakestSkills.map(skillLabel).join(", ")}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </GlassCard>

      {/* Recommendations */}
      <GlassCard>
        <h3 className="mb-4 text-base font-bold">Recommended Practice</h3>
        {recommendations?.length > 0 ? (
          <div className="flex flex-col gap-2">
            {recommendations.slice(0, 5).map((rec: Recommendation, i: number) => {
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
          <p className="text-sm text-text-muted">Complete more practice to get personalized recommendations.</p>
        )}
      </GlassCard>
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
    const taxonomy: Record<string, string[]> = course.includes("math") ? MATH_SKILLS : RW_SKILLS;
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

  const taxonomy = course.includes("math") ? MATH_SKILLS : RW_SKILLS;

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
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            <span className="text-panther-red">&#9672;</span> Teacher Dashboard
          </h1>
          <p className="mt-1 text-sm text-text-muted">
            {profiles.length} students &middot; {alerts.filter((a) => a.severity === "high").length} high-priority alerts
          </p>
        </div>
        <button onClick={loadData} className="rounded-lg border border-border-primary bg-bg-secondary px-4 py-2 text-sm text-panther-red transition hover:border-panther-red">
          Refresh
        </button>
      </div>

      <div className="mb-6 flex gap-0 border-b border-border-primary">
        {teacherTabs.map((t) => (
          <button
            key={t.key}
            onClick={() => { setTab(t.key); setSelectedStudent(null); }}
            className={`px-5 py-3 text-xs font-semibold tracking-wider transition ${
              tab === t.key
                ? "border-b-2 border-panther-red text-panther-red"
                : "border-b-2 border-transparent text-text-muted hover:text-text-secondary"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* CLASS OVERVIEW */}
      {tab === "overview" && classStats && (
        <div>
          <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
            <StatCard label="Students" value={String(classStats.totalStudents)} color="text-sky-400" />
            <StatCard label="Active This Week" value={String(classStats.activeThisWeek)} color="text-emerald-400" />
            <StatCard label="Avg Mastery" value={`${Math.round(classStats.avgMastery * 100)}%`} color={masteryColor(classStats.avgMastery)} />
            <StatCard label="Avg Accuracy" value={`${Math.round(classStats.avgAccuracy * 100)}%`} color={masteryColor(classStats.avgAccuracy)} />
            <StatCard label="Answers This Week" value={String(classStats.totalAnswersThisWeek)} color="text-indigo-400" />
          </div>

          <GlassCard className="mb-4">
            <h3 className="mb-4 text-base font-bold">Class Domain Performance</h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {Object.entries(taxonomy).map(([domain, skills]) => {
                const skillData = skills.map((s) => classSkillMastery[s]).filter(Boolean);
                const avgM = skillData.length > 0 ? skillData.reduce((s, d) => s + d.avgMastery, 0) / skillData.length : 0;
                return (
                  <div key={domain} className="rounded-lg border border-border-primary bg-bg-primary p-3">
                    <div className="mb-2 flex justify-between">
                      <span className="text-sm font-semibold">{domain}</span>
                      <span className={`font-bold ${masteryColor(avgM)}`}>{Math.round(avgM * 100)}%</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-border-primary">
                      <div className={`h-full rounded-full ${masteryBarColor(avgM)}`} style={{ width: `${avgM * 100}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </GlassCard>

          {alerts.filter((a) => a.severity === "high").length > 0 && (
            <GlassCard className="!border-red-400/30">
              <h3 className="mb-3 text-base font-bold text-red-400">High Priority Alerts</h3>
              {alerts.filter((a) => a.severity === "high").slice(0, 5).map((alert, i) => (
                <div key={i} className="mb-1.5 flex items-center gap-2.5 rounded-md border-l-[3px] border-l-red-400 bg-red-400/5 px-3 py-2 text-sm">
                  <span className="font-semibold text-red-400">{alert.uid}</span>
                  <span className="flex-1 text-text-muted">{alert.message}</span>
                </div>
              ))}
            </GlassCard>
          )}
        </div>
      )}

      {/* STUDENTS */}
      {tab === "students" && !selectedStudent && (
        <div>
          <div className="mb-4 flex items-center gap-2">
            <span className="mr-1 text-xs text-text-muted">Sort by:</span>
            {(["name", "mastery", "activity", "streak"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSortBy(s)}
                className={`rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize transition ${
                  s === sortBy ? "bg-panther-red text-ink" : "border border-border-primary bg-bg-secondary text-text-muted"
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-1.5">
            {sortedProfiles.map((p) => {
              const dm = Object.values(p.domains || {}).map((d: any) => d.mastery || 0);
              const avgM = dm.length > 0 ? dm.reduce((s, v) => s + v, 0) / dm.length : 0;
              const accuracy = p.totalAnswers > 0 ? p.totalCorrect / p.totalAnswers : 0;
              return (
                <div
                  key={p.uid}
                  onClick={() => setSelectedStudent(p)}
                  className="grid cursor-pointer grid-cols-3 items-center gap-2 rounded-lg border border-border-primary bg-bg-secondary p-3 text-sm transition hover:border-panther-red/30 sm:grid-cols-6"
                >
                  <span className="col-span-2 font-semibold sm:col-span-1">{p.uid}</span>
                  <span className={masteryColor(avgM)}>{Math.round(avgM * 100)}%</span>
                  <span className="hidden text-text-muted sm:block">{Math.round(accuracy * 100)}% acc</span>
                  <span className="hidden text-text-muted sm:block">{p.weeklyStats?.answersThisWeek || 0}/wk</span>
                  <span className="hidden text-amber-400 sm:block">{p.streakDays || 0} streak</span>
                  <span className="text-right text-panther-red">View &rarr;</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* STUDENT DRILL-DOWN */}
      {tab === "students" && selectedStudent && (
        <TeacherStudentDrillDown profile={selectedStudent} course={course} onBack={() => setSelectedStudent(null)} />
      )}

      {/* ALERTS */}
      {tab === "alerts" && (
        <GlassCard>
          <h3 className="mb-4 text-base font-bold">Intervention Alerts</h3>
          {alerts.length === 0 ? (
            <p className="text-sm text-text-muted">No alerts — all students are on track.</p>
          ) : (
            <div className="flex flex-col gap-1.5">
              {alerts.map((alert, i) => (
                <div key={i} className={`flex items-center gap-2.5 rounded-md border-l-[3px] bg-bg-primary px-3 py-2.5 text-sm ${
                  alert.severity === "high" ? "border-l-red-400" : alert.severity === "medium" ? "border-l-amber-400" : "border-l-slate-500"
                }`}>
                  <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${
                    alert.severity === "high" ? "bg-red-400/15 text-red-400" : alert.severity === "medium" ? "bg-amber-400/12 text-amber-400" : "bg-slate-500/15 text-slate-500"
                  }`}>
                    {alert.severity}
                  </span>
                  <span className="rounded bg-indigo-400/10 px-1.5 py-0.5 text-[10px] text-indigo-400">
                    {alert.type.replace("_", " ")}
                  </span>
                  <span className="font-semibold">{alert.uid}</span>
                  <span className="flex-1 text-text-muted">{alert.message}</span>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      )}

      {/* SKILL HEATMAP */}
      {tab === "heatmap" && (
        <GlassCard>
          <h3 className="mb-2 text-base font-bold">Class Skill Mastery Heatmap</h3>
          <p className="mb-4 text-sm text-text-muted">
            Average mastery across all students. Red = class weakness. Green = strength.
          </p>
          {Object.entries(taxonomy).map(([domain, skills]) => (
            <div key={domain} className="mb-5">
              <h4 className="mb-2 text-sm font-semibold text-panther-red">{domain}</h4>
              <div className="grid gap-1.5 sm:grid-cols-2 lg:grid-cols-4">
                {skills.map((skillKey) => {
                  const data = classSkillMastery[skillKey];
                  const m = data?.avgMastery ?? 0;
                  return (
                    <div key={skillKey} className={`rounded-md border p-2.5 ${masteryBg(m)} border-border-primary`}>
                      <div className="flex items-center justify-between">
                        <span className="text-xs">{skillLabel(skillKey)}</span>
                        <span className={`text-sm font-bold ${masteryColor(m)}`}>
                          {data ? `${Math.round(m * 100)}%` : "\u2014"}
                        </span>
                      </div>
                      {data && (
                        <div className="mt-1 text-[11px] text-text-muted">
                          {data.studentCount} students &middot; {data.correct}/{data.total} correct
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </GlassCard>
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

  return (
    <div>
      <button onClick={onBack} className="mb-4 text-sm font-semibold text-panther-red hover:underline">
        &larr; Back to Students
      </button>

      {/* Sub-tab strip */}
      <div className="mb-4 flex gap-2">
        {(["mastery", "past-tests"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setDrillTab(t)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
              drillTab === t
                ? "bg-panther-red text-ink"
                : "bg-bg-secondary text-text-muted hover:text-text-primary"
            }`}
          >
            {t === "mastery" ? "Mastery" : "Past Tests"}
          </button>
        ))}
      </div>

      {drillTab === "mastery" && (
        <>
          <GlassCard className="mb-4">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="mb-1 text-xl font-bold">{profile.uid}</h2>
                <p className="text-sm text-text-muted">
                  {profile.totalAnswers} answers &middot; {profile.streakDays || 0} streak &middot;
                  Last active: {profile.lastActiveDate || "Unknown"}
                </p>
              </div>
              <div className="text-right">
                <div className={`text-3xl font-bold ${masteryColor(avgM)}`}>{Math.round(avgM * 100)}%</div>
                <div className="text-xs text-text-muted">Overall Mastery</div>
              </div>
            </div>
          </GlassCard>

          <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {Object.entries(profile.domains || {}).map(([domain, data]: [string, any]) => (
              <GlassCard key={domain} className="!p-4">
                <div className="mb-2 flex justify-between">
                  <span className="text-sm font-semibold">{domain}</span>
                  <span className={`font-bold ${masteryColor(data.mastery || 0)}`}>{Math.round((data.mastery || 0) * 100)}%</span>
                </div>
                <div className="mb-2 h-1.5 overflow-hidden rounded-full bg-border-primary">
                  <div className={`h-full rounded-full ${masteryBarColor(data.mastery || 0)}`} style={{ width: `${(data.mastery || 0) * 100}%` }} />
                </div>
                <div className="text-xs text-text-muted">{data.totalCorrect}/{data.totalAnswers} correct</div>
                {data.weakestSkills?.length > 0 && (
                  <div className="mt-1 text-[11px] text-red-400">Weak: {data.weakestSkills.map(skillLabel).join(", ")}</div>
                )}
                {data.strongestSkills?.length > 0 && (
                  <div className="mt-0.5 text-[11px] text-emerald-400">Strong: {data.strongestSkills.map(skillLabel).join(", ")}</div>
                )}
              </GlassCard>
            ))}
          </div>

          <GlassCard>
            <h3 className="mb-3 text-base font-bold">Recommended Next Steps</h3>
            {profile.recommendations?.length > 0 ? (
              <div className="flex flex-col gap-1.5">
                {profile.recommendations.slice(0, 5).map((rec: any, i: number) => {
                  const taxonomyKey = sourceToTaxonomyKey(rec.skill) || rec.skill;
                  const href = `/skills/${course}/${taxonomyKey}`;
                  return (
                    <Link
                      key={i}
                      href={href}
                      className="flex items-center gap-2.5 rounded-md border border-border-primary bg-bg-primary p-2.5 text-sm transition hover:border-panther-red/30"
                    >
                      <span className="w-6 font-bold text-panther-red">#{rec.priority}</span>
                      <span className="font-semibold">{skillLabel(rec.skill)}</span>
                      <span className="flex-1 text-xs text-text-muted">{rec.reason}</span>
                      <span className="text-xs text-text-muted">›</span>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-text-muted">No recommendations yet.</p>
            )}
          </GlassCard>
        </>
      )}

      {drillTab === "past-tests" && <PastTestsView uid={profile.uid} />}
    </div>
  );
}

// ============================================================
// SHARED
// ============================================================

function StatCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <GlassCard className="text-center !p-4">
      <div className={`text-2xl font-bold tracking-tight ${color}`}>{value}</div>
      <div className="mt-1 text-[11px] uppercase tracking-wider text-text-muted">{label}</div>
    </GlassCard>
  );
}
