"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import {
  getStudentProfile,
  updateStudentProfile,
  getSessions,
  getTeacherClasses,
  createClass,
  deleteClass,
  joinClass,
  getClassByCode,
} from "@/lib/firestore";
import { getAdaptiveProfile } from "@/lib/adaptive/performance-service";
import type { AdaptiveProfile } from "@/lib/adaptive/performance-service";
import { getUserRole } from "@/lib/auth-utils";
import { GlassCard } from "@/components/ui/glass-card";
import { TopBar } from "@/components/layout/top-bar";
import { PastTestsView } from "@/components/dashboard/past-tests-view";
import type { TestType } from "@/types/question";
import { TESTS, COURSE_ROUTES } from "@/lib/test-types";
import type { StudentProfile, Session, ClassDoc } from "@/types/firestore";

type View = "home" | "test-detail" | "dashboard" | "class-detail" | "student-detail";

type ClassStudentRow = {
  uid: string;
  displayName: string;
  email: string;
  profile: StudentProfile | null;
  sessions: (Session & { id: string })[];
};

function masteryColor(m: number): string {
  if (m >= 0.8) return "text-emerald-400";
  if (m >= 0.6) return "text-lime-400";
  if (m >= 0.4) return "text-amber-400";
  if (m >= 0.2) return "text-orange-400";
  return "text-red-400";
}

function masteryBarColor(m: number): string {
  if (m >= 0.8) return "bg-emerald-400";
  if (m >= 0.6) return "bg-lime-400";
  if (m >= 0.4) return "bg-amber-400";
  if (m >= 0.2) return "bg-orange-400";
  return "bg-red-400";
}

const LEVELS = [
  { name: "Cub", min: 0 },
  { name: "Prowler", min: 200 },
  { name: "Stalker", min: 600 },
  { name: "Hunter", min: 1200 },
  { name: "Alpha Panther", min: 2500 },
];


export default function HomePage() {
  const { user, role } = useAuth();
  const [view, setView] = useState<View>("home");
  const [selectedTest, setSelectedTest] = useState<TestType | null>(null);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [sessions, setSessions] = useState<(Session & { id: string })[]>([]);
  const [classes, setClasses] = useState<(ClassDoc & { id: string })[]>([]);
  const [joinCode, setJoinCode] = useState("");
  const [joinError, setJoinError] = useState("");
  const [showJoin, setShowJoin] = useState(false);
  const [newClassName, setNewClassName] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [selectedClass, setSelectedClass] = useState<(ClassDoc & { id: string }) | null>(null);
  const [classStudents, setClassStudents] = useState<ClassStudentRow[]>([]);
  const [classLoading, setClassLoading] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<ClassStudentRow | null>(null);
  const [studentAdaptive, setStudentAdaptive] = useState<AdaptiveProfile | null>(null);
  const [studentAdaptiveLoading, setStudentAdaptiveLoading] = useState(false);

  // Load profile & sessions
  useEffect(() => {
    if (!user) return;
    getStudentProfile(user.uid).then((p) => {
      if (p) setProfile(p);
      else {
        // Create initial profile — resolve role from heuristic so teachers
        // see the teacher UI from their very first login.
        updateStudentProfile(user.uid, {
          email: user.email,
          displayName: user.displayName,
          role: getUserRole(user.email),
          xp: 0,
          level: 0,
          streak: 0,
          badges: [],
        });
      }
    });
    getSessions(user.uid, 20).then(setSessions);
    if (role === "teacher" || role === "admin") {
      getTeacherClasses(user.uid).then(setClasses);
    }
  }, [user, role]);

  const currentLevel = LEVELS.reduce(
    (acc, l) => ((profile?.xp ?? 0) >= l.min ? l : acc),
    LEVELS[0]
  );
  const nextLevel = LEVELS[LEVELS.indexOf(currentLevel) + 1];
  const xpProgress = nextLevel
    ? ((profile?.xp ?? 0) - currentLevel.min) / (nextLevel.min - currentLevel.min)
    : 1;

  const handleSelectTest = (t: TestType) => {
    setSelectedTest(t);
    setView("test-detail");
  };

  const handleJoinClass = async () => {
    if (!joinCode || !user) return;
    setJoinError("");
    const cls = await getClassByCode(joinCode.trim());
    if (!cls) {
      setJoinError("Class not found. Check the code.");
      return;
    }
    await joinClass(cls.id, user.uid);
    setShowJoin(false);
    setJoinCode("");
  };

  const handleCreateClass = async () => {
    if (!newClassName.trim() || !user) return;
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    await createClass({
      code,
      name: newClassName.trim(),
      teacherUid: user.uid,
      teacherEmail: user.email,
      teacherName: user.displayName,
    });
    setNewClassName("");
    setShowCreate(false);
    getTeacherClasses(user.uid).then(setClasses);
  };

  const handleDeleteClass = async (classId: string) => {
    await deleteClass(classId);
    setClasses((prev) => prev.filter((c) => c.id !== classId));
  };

  const handleSelectClass = async (cls: ClassDoc & { id: string }) => {
    setSelectedClass(cls);
    setView("class-detail");
    setClassLoading(true);
    setClassStudents([]);
    const uids = cls.students || [];
    const rows = await Promise.all(
      uids.map(async (uid) => {
        const [profile, sessionList] = await Promise.all([
          getStudentProfile(uid),
          getSessions(uid, 50),
        ]);
        return {
          uid,
          displayName: profile?.displayName || profile?.email || uid,
          email: profile?.email || "",
          profile,
          sessions: sessionList,
        };
      })
    );
    setClassStudents(rows);
    setClassLoading(false);
  };

  const handleSelectStudent = async (row: ClassStudentRow) => {
    setSelectedStudent(row);
    setView("student-detail");
    setStudentAdaptive(null);
    setStudentAdaptiveLoading(true);
    const ap = await getAdaptiveProfile(row.uid);
    setStudentAdaptive(ap);
    setStudentAdaptiveLoading(false);
  };

  const formatTestType = (raw: string): string => {
    // Sessions written from diagnostic-test.tsx have a mangled testType
    // like "psat89-math-diagnostic" — format it for display.
    const map: Record<string, string> = {
      "sat-math-diagnostic": "SAT Math Diagnostic",
      "sat-rw-diagnostic": "SAT R&W Diagnostic",
      "nmsqt-math-diagnostic": "PSAT/NMSQT Math Diagnostic",
      "nmsqt-rw-diagnostic": "PSAT/NMSQT R&W Diagnostic",
      "psat89-math-diagnostic": "PSAT 8/9 Math Diagnostic",
      "psat89-rw-diagnostic": "PSAT 8/9 R&W Diagnostic",
      sat: "SAT",
      nmsqt: "PSAT/NMSQT",
      psat89: "PSAT 8/9",
    };
    return map[raw] || raw;
  };

  // ── Home View ──
  if (view === "home") {
    return (
      <div className="min-h-screen">
        <TopBar />
        <div className="mx-auto max-w-[1200px] px-6 py-8">
          {/* Welcome + Gamification Bar */}
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-3xl tracking-[0.02em] text-white sm:text-[2.2rem]">
                Welcome, {user?.displayName?.split(" ")[0]}
              </h2>
              <p className="text-base text-text-secondary">
                {role === "student"
                  ? "Choose a test to start practicing."
                  : "Pick a section to review your classes and adaptive insights."}
              </p>
            </div>

            {/* XP / Level / Streak — students only. Teachers don't need gamification. */}
            {role === "student" && (
              <div className="flex items-center gap-5">
                <div className="text-right">
                  <div className="text-xs font-semibold uppercase tracking-wider text-text-muted">Level</div>
                  <div className="text-sm font-bold text-white">{currentLevel.name}</div>
                </div>
                <div className="w-32">
                  <div className="mb-1 flex justify-between text-xs text-text-muted">
                    <span>{profile?.xp ?? 0} XP</span>
                    {nextLevel && <span>{nextLevel.min} XP</span>}
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/5">
                    <div
                      className="h-full rounded-full bg-panther-red transition-[width] duration-500"
                      style={{ width: `${Math.round(xpProgress * 100)}%` }}
                    />
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-accent-amber">{profile?.streak ?? 0}</div>
                  <div className="text-xs text-text-muted">Streak</div>
                </div>
              </div>
            )}
          </div>

          {/* Test Cards — fixed breakpoints for stable responsive layout */}
          <div className="mb-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {(Object.entries(TESTS) as [TestType, typeof TESTS.sat][]).map(([key, test]) => (
              <GlassCard
                key={key}
                className="cursor-pointer"
                onClick={() => handleSelectTest(key)}
              >
                <div
                  className="mb-3 h-1 w-12 rounded-full"
                  style={{ backgroundColor: test.color }}
                />
                <h3 className="mb-1.5 font-display text-[1.7rem] tracking-[0.02em] text-white">
                  {test.name}
                </h3>
                <p className="text-sm leading-relaxed text-text-secondary">{test.desc}</p>
              </GlassCard>
            ))}
          </div>

          {/* Recent Sessions */}
          {sessions.length > 0 && (
            <div className="mb-10">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-text-muted">
                  Recent Activity
                </h3>
                <button
                  onClick={() => setView("dashboard")}
                  className="text-xs text-text-muted transition-colors hover:text-text-secondary"
                >
                  View All
                </button>
              </div>
              <div className="flex flex-col gap-2">
                {sessions.slice(0, 5).map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between rounded-radius-md border border-border-default bg-bg-card px-4 py-3"
                  >
                    <div>
                      <span className="text-sm font-medium text-white">{s.testType}</span>
                      {s.domain && (
                        <span className="ml-2 text-xs text-text-muted">{s.domain}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-sm text-text-secondary">
                        {s.score}/{s.total} ({s.percentage}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Student: Join Class */}
          {role === "student" && (
            <div className="mb-10">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-muted">
                Class
              </h3>
              {showJoin ? (
                <GlassCard>
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={joinCode}
                      onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                      placeholder="Enter class code"
                      maxLength={6}
                      className="w-32 rounded-radius-sm border border-border-default bg-bg-surface px-3 py-2 font-mono text-sm uppercase text-white outline-none focus:border-panther-red"
                    />
                    <button
                      onClick={handleJoinClass}
                      className="rounded-radius-sm bg-panther-red px-4 py-2 text-sm font-semibold text-white"
                    >
                      Join
                    </button>
                    <button
                      onClick={() => setShowJoin(false)}
                      className="text-xs text-text-muted"
                    >
                      Cancel
                    </button>
                  </div>
                  {joinError && <p className="mt-2 text-xs text-accent-red">{joinError}</p>}
                </GlassCard>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowJoin(true)}
                    className="rounded-radius-md border border-border-default px-5 py-2.5 text-sm text-text-secondary transition-colors hover:border-border-light"
                  >
                    Join a Class
                  </button>
                  <a
                    href="/dashboard"
                    className="rounded-radius-md border border-panther-red/30 bg-panther-red/10 px-5 py-2.5 text-sm text-panther-red transition-colors hover:bg-panther-red/20"
                  >
                    Adaptive Dashboard
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Teacher: Class Management */}
          {(role === "teacher" || role === "admin") && (
            <div className="mb-10">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-text-muted">
                  My Classes
                </h3>
                <button
                  onClick={() => setShowCreate(true)}
                  className="rounded-radius-sm bg-panther-red px-4 py-1.5 text-xs font-semibold text-white"
                >
                  Create Class
                </button>
              </div>

              {showCreate && (
                <GlassCard className="mb-4">
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={newClassName}
                      onChange={(e) => setNewClassName(e.target.value)}
                      placeholder="Class name"
                      className="flex-1 rounded-radius-sm border border-border-default bg-bg-surface px-3 py-2 text-sm text-white outline-none focus:border-panther-red"
                    />
                    <button
                      onClick={handleCreateClass}
                      className="rounded-radius-sm bg-panther-red px-4 py-2 text-sm font-semibold text-white"
                    >
                      Create
                    </button>
                    <button onClick={() => setShowCreate(false)} className="text-xs text-text-muted">
                      Cancel
                    </button>
                  </div>
                </GlassCard>
              )}

              <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
                {classes.map((cls) => (
                  <GlassCard
                    key={cls.id}
                    className="cursor-pointer transition-all hover:border-border-light"
                    onClick={() => handleSelectClass(cls)}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <h4 className="font-semibold text-white">{cls.name}</h4>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClass(cls.id);
                        }}
                        className="text-xs text-text-muted transition-colors hover:text-accent-red"
                      >
                        Delete
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="rounded-radius-sm bg-bg-surface px-3 py-1 font-mono text-lg tracking-widest text-white">
                        {cls.code}
                      </span>
                      <span className="text-xs text-text-muted">
                        {(cls.students || []).length} student{(cls.students || []).length !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </GlassCard>
                ))}
                {classes.length === 0 && !showCreate && (
                  <p className="text-sm text-text-muted">No classes yet. Create one to get started.</p>
                )}
              </div>

              <div className="mt-4 flex gap-3">
                <a
                  href="/dashboard"
                  className="rounded-radius-md border border-panther-red/30 bg-panther-red/10 px-5 py-2.5 text-sm font-semibold text-panther-red transition-colors hover:bg-panther-red/20"
                >
                  Open Adaptive Dashboard →
                </a>
              </div>
            </div>
          )}

          {/* Badges */}
          {profile && profile.badges.length > 0 && (
            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-muted">
                Badges
              </h3>
              <div className="flex flex-wrap gap-2">
                {profile.badges.map((b) => (
                  <span
                    key={b}
                    className="rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-text-secondary"
                  >
                    {b}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── Test Detail View ──
  if (view === "test-detail" && selectedTest) {
    const test = TESTS[selectedTest];
    const routes = COURSE_ROUTES[selectedTest];

    return (
      <div className="min-h-screen">
        <TopBar />
        <div className="mx-auto max-w-3xl px-6 py-8">
          <button
            onClick={() => setView("home")}
            className="mb-6 flex items-center gap-1.5 text-sm text-text-muted transition-colors hover:text-text-secondary"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="rotate-180">
              <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back
          </button>

          <div className="mb-1 h-1 w-12 rounded-full" style={{ backgroundColor: test.color }} />
          <h1 className="mb-2 font-display text-[2.4rem] tracking-[0.02em] text-white">{test.name}</h1>
          <p className="mb-8 text-text-secondary">{test.desc}</p>

          {/* Actions Grid */}
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Diagnostics */}
            <a href={`/diagnostics/${selectedTest}-math`}>
              <GlassCard className="cursor-pointer">
                <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-text-muted">
                  Diagnostic
                </div>
                <h3 className="text-lg font-semibold text-white">Math Diagnostic</h3>
                <p className="text-sm text-text-secondary">Assess your current math level</p>
              </GlassCard>
            </a>
            <a href={`/diagnostics/${selectedTest}-rw`}>
              <GlassCard className="cursor-pointer">
                <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-text-muted">
                  Diagnostic
                </div>
                <h3 className="text-lg font-semibold text-white">R&W Diagnostic</h3>
                <p className="text-sm text-text-secondary">Assess your reading & writing level</p>
              </GlassCard>
            </a>

            {/* Practice Test */}
            <a href={`/practice-tests/${selectedTest}`} className="sm:col-span-2">
              <GlassCard className="cursor-pointer">
                <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-text-muted">
                  Full Practice Test
                </div>
                <h3 className="text-lg font-semibold text-white">{test.name} Full-Length Test</h3>
                <p className="text-sm text-text-secondary">
                  Complete test with R&W and Math sections — timed or practice mode
                </p>
              </GlassCard>
            </a>

            {/* Courses */}
            <a href={routes.math}>
              <GlassCard className="cursor-pointer">
                <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-text-muted">
                  Course
                </div>
                <h3 className="text-lg font-semibold text-white">Math Course</h3>
                <p className="text-sm text-text-secondary">Structured lessons and practice</p>
              </GlassCard>
            </a>
            <a href={routes.rw}>
              <GlassCard className="cursor-pointer">
                <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-text-muted">
                  Course
                </div>
                <h3 className="text-lg font-semibold text-white">R&W Course</h3>
                <p className="text-sm text-text-secondary">Reading & writing skill building</p>
              </GlassCard>
            </a>
          </div>
        </div>
      </div>
    );
  }

  // ── Class Detail View ──
  if (view === "class-detail" && selectedClass) {
    const totalStudents = classStudents.length;
    const studentsWithActivity = classStudents.filter((s) => s.sessions.length > 0).length;
    const allSessions = classStudents.flatMap((s) => s.sessions);
    const classAvg =
      allSessions.length > 0
        ? Math.round(
            allSessions.reduce((sum, x) => sum + (x.percentage ?? 0), 0) / allSessions.length
          )
        : 0;

    return (
      <div className="min-h-screen">
        <TopBar />
        <div className="mx-auto max-w-4xl px-6 py-8">
          <button
            onClick={() => {
              setView("home");
              setSelectedClass(null);
              setClassStudents([]);
            }}
            className="mb-6 flex items-center gap-1.5 text-sm text-text-muted transition-colors hover:text-text-secondary"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="rotate-180">
              <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back
          </button>

          <div className="mb-6">
            <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-text-muted">
              Class
            </div>
            <h1 className="mb-2 font-display text-[2.2rem] tracking-[0.02em] text-white">
              {selectedClass.name}
            </h1>
            <div className="flex items-center gap-4 text-sm text-text-secondary">
              <span className="rounded-radius-sm bg-bg-surface px-3 py-1 font-mono tracking-widest text-white">
                {selectedClass.code}
              </span>
              <span>Share this code for students to join</span>
            </div>
          </div>

          {/* Class stats */}
          <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <GlassCard className="text-center">
              <div className="text-2xl font-bold text-white">{totalStudents}</div>
              <div className="text-xs text-text-muted">Students</div>
            </GlassCard>
            <GlassCard className="text-center">
              <div className="text-2xl font-bold text-white">{studentsWithActivity}</div>
              <div className="text-xs text-text-muted">Active</div>
            </GlassCard>
            <GlassCard className="text-center">
              <div className="text-2xl font-bold text-white">{allSessions.length}</div>
              <div className="text-xs text-text-muted">Sessions</div>
            </GlassCard>
            <GlassCard className="text-center">
              <div className="text-2xl font-bold text-white">{classAvg}%</div>
              <div className="text-xs text-text-muted">Class Avg</div>
            </GlassCard>
          </div>

          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-muted">
            Students
          </h3>

          {classLoading ? (
            <p className="text-sm text-text-muted">Loading student results…</p>
          ) : totalStudents === 0 ? (
            <GlassCard>
              <p className="text-sm text-text-muted">
                No students yet. Share the class code <span className="font-mono text-white">{selectedClass.code}</span> so students can join.
              </p>
            </GlassCard>
          ) : (
            <div className="flex flex-col gap-3">
              {classStudents.map((row) => {
                const rowAvg =
                  row.sessions.length > 0
                    ? Math.round(
                        row.sessions.reduce((sum, s) => sum + (s.percentage ?? 0), 0) /
                          row.sessions.length
                      )
                    : null;
                return (
                  <GlassCard
                    key={row.uid}
                    className="cursor-pointer"
                    onClick={() => handleSelectStudent(row)}
                  >
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <h4 className="font-semibold text-white hover:text-panther-red">{row.displayName}</h4>
                        {row.email && (
                          <p className="text-xs text-text-muted">{row.email}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="text-text-muted">
                          {row.sessions.length} session{row.sessions.length !== 1 ? "s" : ""}
                        </span>
                        {rowAvg !== null && (
                          <span
                            className={`rounded-full px-2 py-0.5 font-semibold ${
                              rowAvg >= 80
                                ? "bg-accent-green-soft text-accent-green"
                                : rowAvg >= 60
                                  ? "bg-accent-amber-soft text-accent-amber"
                                  : "bg-accent-red-soft text-accent-red"
                            }`}
                          >
                            avg {rowAvg}%
                          </span>
                        )}
                      </div>
                    </div>

                    {row.sessions.length === 0 ? (
                      <p className="text-xs text-text-muted">No activity yet.</p>
                    ) : (
                      <div className="flex flex-col gap-1.5">
                        {row.sessions.map((s) => {
                          const when = s.createdAt
                            ? // @ts-expect-error Firestore Timestamp vs serialized
                              (s.createdAt?.toDate?.() ?? new Date(s.createdAt)).toLocaleDateString(undefined, {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })
                            : "";
                          return (
                            <div
                              key={s.id}
                              className="flex items-center justify-between rounded-radius-sm border border-border-default bg-bg-card px-3 py-2"
                            >
                              <div className="min-w-0 flex-1">
                                <div className="truncate text-sm text-white">
                                  {formatTestType(s.testType)}
                                </div>
                                <div className="text-[0.7rem] text-text-muted">{when}</div>
                              </div>
                              <div className="flex items-center gap-3">
                                {s.scaledScore != null && (
                                  <span className="font-mono text-xs text-text-secondary">
                                    {s.scaledScore}
                                  </span>
                                )}
                                <span className="font-mono text-xs text-text-secondary">
                                  {s.score}/{s.total}
                                </span>
                                <span
                                  className={`rounded-full px-2 py-0.5 text-[0.65rem] font-semibold ${
                                    s.percentage >= 80
                                      ? "bg-accent-green-soft text-accent-green"
                                      : s.percentage >= 60
                                        ? "bg-accent-amber-soft text-accent-amber"
                                        : "bg-accent-red-soft text-accent-red"
                                  }`}
                                >
                                  {s.percentage}%
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </GlassCard>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── Student Detail View ──
  if (view === "student-detail" && selectedStudent) {
    const s = selectedStudent;
    const allSessions = s.sessions;
    const totalS = allSessions.length;
    const overallAvg =
      allSessions.length > 0
        ? Math.round(
            allSessions.reduce((sum, x) => sum + (x.percentage ?? 0), 0) / allSessions.length
          )
        : 0;

    // Adaptive mastery derived
    const domainEntries = studentAdaptive
      ? Object.entries(studentAdaptive.domains || {})
      : [];
    const avgDomainMastery =
      domainEntries.length > 0
        ? domainEntries.reduce((sum, [, d]) => sum + (d.mastery || 0), 0) / domainEntries.length
        : 0;

    return (
      <div className="min-h-screen">
        <TopBar />
        <div className="mx-auto max-w-4xl px-6 py-8">
          <button
            onClick={() => {
              setView("class-detail");
              setSelectedStudent(null);
              setStudentAdaptive(null);
            }}
            className="mb-6 flex items-center gap-1.5 text-sm text-text-muted transition-colors hover:text-text-secondary"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="rotate-180">
              <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to {selectedClass?.name ?? "class"}
          </button>

          <div className="mb-6">
            <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-text-muted">
              Student
            </div>
            <h1 className="mb-1 font-display text-[2.2rem] tracking-[0.02em] text-white">
              {s.displayName}
            </h1>
            {s.email && <p className="text-sm text-text-secondary">{s.email}</p>}
          </div>

          {/* Overall stats */}
          <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <GlassCard className="text-center">
              <div className="text-2xl font-bold text-white">{totalS}</div>
              <div className="text-xs text-text-muted">Sessions</div>
            </GlassCard>
            <GlassCard className="text-center">
              <div className="text-2xl font-bold text-white">{overallAvg}%</div>
              <div className="text-xs text-text-muted">Avg Accuracy</div>
            </GlassCard>
            <GlassCard className="text-center">
              <div className="text-2xl font-bold text-white">{s.profile?.xp ?? 0}</div>
              <div className="text-xs text-text-muted">XP</div>
            </GlassCard>
            <GlassCard className="text-center">
              <div className="text-2xl font-bold text-white">{s.profile?.streak ?? 0}</div>
              <div className="text-xs text-text-muted">Day Streak</div>
            </GlassCard>
          </div>

          {/* Adaptive Mastery */}
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-muted">
            Adaptive Mastery
          </h3>
          {studentAdaptiveLoading ? (
            <p className="mb-6 text-sm text-text-muted">Loading adaptive profile…</p>
          ) : !studentAdaptive ? (
            <GlassCard className="mb-6">
              <p className="text-sm text-text-muted">
                No adaptive data yet. The adaptive engine populates once the student completes course modules
                — diagnostic and practice-test sessions don&apos;t feed mastery.
              </p>
            </GlassCard>
          ) : (
            <div className="mb-6">
              <GlassCard className="mb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-xs text-text-muted">
                      {studentAdaptive.totalAnswers ?? 0} answers · {studentAdaptive.streakDays ?? 0} day streak
                    </div>
                    <div className="text-xs text-text-muted">
                      Last active: {studentAdaptive.lastActiveDate || "Unknown"}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-3xl font-bold ${masteryColor(avgDomainMastery)}`}>
                      {Math.round(avgDomainMastery * 100)}%
                    </div>
                    <div className="text-xs text-text-muted">Overall Mastery</div>
                  </div>
                </div>
              </GlassCard>

              {domainEntries.length > 0 && (
                <div className="mb-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {domainEntries.map(([domain, data]) => (
                    <GlassCard key={domain} className="!p-4">
                      <div className="mb-2 flex justify-between">
                        <span className="text-sm font-semibold text-white">{domain}</span>
                        <span className={`font-bold ${masteryColor(data.mastery || 0)}`}>
                          {Math.round((data.mastery || 0) * 100)}%
                        </span>
                      </div>
                      <div className="mb-2 h-1.5 overflow-hidden rounded-full bg-border-default">
                        <div
                          className={`h-full rounded-full ${masteryBarColor(data.mastery || 0)}`}
                          style={{ width: `${(data.mastery || 0) * 100}%` }}
                        />
                      </div>
                      <div className="text-xs text-text-muted">
                        {data.totalCorrect}/{data.totalAnswers} correct
                      </div>
                      {data.weakestSkills?.length > 0 && (
                        <div className="mt-1 text-[11px] text-red-400">
                          Weak: {data.weakestSkills.join(", ")}
                        </div>
                      )}
                      {data.strongestSkills?.length > 0 && (
                        <div className="mt-0.5 text-[11px] text-emerald-400">
                          Strong: {data.strongestSkills.join(", ")}
                        </div>
                      )}
                    </GlassCard>
                  ))}
                </div>
              )}

              {studentAdaptive.recommendations && studentAdaptive.recommendations.length > 0 && (
                <GlassCard>
                  <h4 className="mb-2 text-sm font-semibold text-white">Recommended Next Steps</h4>
                  <div className="flex flex-col gap-1.5">
                    {studentAdaptive.recommendations.slice(0, 5).map((rec, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2.5 rounded-md border border-border-default bg-bg-card p-2.5 text-sm"
                      >
                        <span className="w-6 font-bold text-panther-red">#{rec.priority}</span>
                        <span className="font-semibold text-white">{rec.skill}</span>
                        <span className="flex-1 text-xs text-text-muted">{rec.reason}</span>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              )}
            </div>
          )}

          {/* Session history — delegated to PastTestsView which reads from
              performanceLog for per-question review with stem/choices/
              explanation. */}
          <PastTestsView uid={s.uid} />
        </div>
      </div>
    );
  }

  // ── Dashboard View ──
  const totalSessions = sessions.length;
  const avgAccuracy =
    sessions.length > 0
      ? Math.round(sessions.reduce((sum, s) => sum + s.percentage, 0) / sessions.length)
      : 0;

  return (
    <div className="min-h-screen">
      <TopBar />
      <div className="mx-auto max-w-[1200px] px-6 py-8">
        <button
          onClick={() => setView("home")}
          className="mb-6 flex items-center gap-1.5 text-sm text-text-muted transition-colors hover:text-text-secondary"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="rotate-180">
            <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back
        </button>

        <h1 className="mb-6 font-display text-[2rem] tracking-[0.02em] text-white">Dashboard</h1>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <GlassCard className="text-center">
            <div className="text-2xl font-bold text-white">{totalSessions}</div>
            <div className="text-xs text-text-muted">Sessions</div>
          </GlassCard>
          <GlassCard className="text-center">
            <div className="text-2xl font-bold text-white">{avgAccuracy}%</div>
            <div className="text-xs text-text-muted">Avg Accuracy</div>
          </GlassCard>
          <GlassCard className="text-center">
            <div className="text-2xl font-bold text-white">{profile?.xp ?? 0}</div>
            <div className="text-xs text-text-muted">Total XP</div>
          </GlassCard>
          <GlassCard className="text-center">
            <div className="text-2xl font-bold text-white">{profile?.streak ?? 0}</div>
            <div className="text-xs text-text-muted">Day Streak</div>
          </GlassCard>
        </div>

        {/* Session History */}
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-muted">
          Session History
        </h3>
        {sessions.length === 0 ? (
          <p className="text-sm text-text-muted">No sessions yet. Take a diagnostic or practice test to get started.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {sessions.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between rounded-radius-md border border-border-default bg-bg-card px-4 py-3"
              >
                <div>
                  <span className="text-sm font-medium text-white">{s.testType}</span>
                  <span className="ml-2 text-xs text-text-muted">{s.mode}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-mono text-sm text-text-secondary">
                    {s.score}/{s.total}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                      s.percentage >= 80
                        ? "bg-accent-green-soft text-accent-green"
                        : s.percentage >= 60
                          ? "bg-accent-amber-soft text-accent-amber"
                          : "bg-accent-red-soft text-accent-red"
                    }`}
                  >
                    {s.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
