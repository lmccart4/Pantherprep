"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useAuth } from "@/hooks/use-auth";
import { getPracticeTestQuestions } from "@/lib/questions";
import { saveProgress } from "@/lib/firestore";
import { completeTestSession } from "@/lib/test-persistence";
import { GlassCard } from "@/components/ui/glass-card";
import { QuestionCard } from "@/components/test/question-card";
import { Timer } from "@/components/test/timer";
import { QuestionNavigator } from "@/components/test/question-navigator";
import { ProgressBar } from "@/components/test/progress-bar";
import { ScoreCircle } from "@/components/test/score-circle";
import { DomainBreakdown } from "@/components/test/domain-breakdown";
import { WeakSkillsCallout } from "@/components/skills/weak-skills-callout";
import { ReferenceSheet } from "@/components/test/reference-sheet";
import { TopBar } from "@/components/layout/top-bar";
import type { Question, TestType } from "@/types/question";

type Screen = "landing" | "test" | "break" | "results";
type Mode = "timed" | "practice";
type CheckMode = "each" | "end";
type ReviewTab = "overview" | "rw" | "math" | "reflect";

interface SectionConfig {
  name: string;
  short: string;
  modules: Question[][];
  time: number[]; // minutes per module
}

interface PracticeTestProps {
  testType: TestType;
  title: string;
  rwTime?: [number, number]; // [mod1, mod2] minutes
  mathTime?: [number, number];
  rwQuestions?: Question[];
  mathQuestions?: Question[];
}

const TEST_COLORS: Record<TestType, string> = {
  sat: "#C8102E",
  nmsqt: "#d4a017",
  psat89: "#06b6d4",
};

const RW_DOMAINS = ["Craft and Structure", "Information and Ideas", "Standard English Conventions", "Expression of Ideas"];
const MATH_DOMAINS_DEFAULT = ["Algebra", "Advanced Math", "Problem-Solving & Data Analysis", "Geometry & Trigonometry"];
const MATH_DOMAINS_PSAT89 = ["Algebra", "Advanced Math", "Problem-Solving & Data Analysis", "Geometry"];

const REFLECTION_PROMPTS: Record<TestType, string[]> = {
  sat: [
    "How did you feel about your overall pacing across the test?",
    "Which section (R&W or Math) felt more challenging?",
    "Were there any question types that consistently tripped you up?",
    "How did Module 2 difficulty compare to Module 1?",
    "What's your #1 study priority based on these results?",
  ],
  nmsqt: [
    "How does your score compare to National Merit cutoffs (~1480+)?",
    "Which domains need the most improvement?",
    "Were there pacing issues in any module?",
    "What content areas surprised you (harder or easier than expected)?",
    "What's your study plan leading up to the PSAT/NMSQT?",
  ],
  psat89: [
    "Which section felt more comfortable — R&W or Math?",
    "Were there question types you hadn't seen before?",
    "How was your pacing — did you finish with time to spare?",
    "What topics do you want to review before taking the PSAT/NMSQT?",
    "How confident are you feeling about test day?",
  ],
};

export function PracticeTest({
  testType,
  title,
  rwTime = [32, 32],
  mathTime = [35, 35],
  rwQuestions: embeddedRw,
  mathQuestions: embeddedMath,
}: PracticeTestProps) {
  const { user } = useAuth();
  const [screen, setScreen] = useState<Screen>("landing");
  const [mode, setMode] = useState<Mode>("timed");
  const [checkMode, setCheckMode] = useState<CheckMode>("end");
  const [sections, setSections] = useState<SectionConfig[]>([]);
  const [loading, setLoading] = useState(false);

  // Test state
  const [sectionIdx, setSectionIdx] = useState(0); // 0 = R&W, 1 = Math
  const [moduleIdx, setModuleIdx] = useState(0); // 0 or 1
  const [questionIdx, setQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({});
  const [explanations, setExplanations] = useState<Record<string, boolean>>({});
  const [flagged, setFlagged] = useState<Set<string>>(new Set());
  const [timerKey, setTimerKey] = useState(0);
  const [reviewTab, setReviewTab] = useState<ReviewTab>("overview");
  const [reflections, setReflections] = useState<Record<number, string>>({});
  const [saveError, setSaveError] = useState(false);
  const startTimeRef = useRef<number>(0);
  const progressKey = `${testType}-practice-test`;

  const accentColor = TEST_COLORS[testType];
  const mathDomains = testType === "psat89" ? MATH_DOMAINS_PSAT89 : MATH_DOMAINS_DEFAULT;

  // Get current module questions
  const currentSection = sections[sectionIdx];
  const currentModule = currentSection?.modules[moduleIdx] ?? [];
  const currentQ = currentModule[questionIdx];

  function qid(q: Question): string {
    return q.id;
  }

  // Load questions
  const loadQuestions = useCallback(async () => {
    setLoading(true);
    try {
      let rw: Question[];
      let math: Question[];
      if (embeddedRw && embeddedMath) {
        rw = embeddedRw;
        math = embeddedMath;
      } else {
        const result = await getPracticeTestQuestions(testType);
        rw = result.rw;
        math = result.math;
      }
      const rwMod1 = rw.filter((q) => q.module === 1);
      const rwMod2 = rw.filter((q) => q.module === 2);
      const mathMod1 = math.filter((q) => q.module === 1);
      const mathMod2 = math.filter((q) => q.module === 2);

      setSections([
        { name: "Reading & Writing", short: "R&W", modules: [rwMod1, rwMod2], time: rwTime },
        { name: "Math", short: "Math", modules: [mathMod1, mathMod2], time: mathTime },
      ]);
    } catch (e) {
      console.error("Failed to load questions:", e);
    } finally {
      setLoading(false);
    }
  }, [testType, rwTime, mathTime, embeddedRw, embeddedMath]);

  // Auto-save
  useEffect(() => {
    if (screen !== "test" || !user) return;
    const timer = setTimeout(() => {
      saveProgress(user.uid, progressKey, {
        answers,
        submitted,
        explanations,
        flagged: Array.from(flagged),
        sectionIdx,
        moduleIdx,
        questionIdx,
        mode,
        checkMode,
      }).catch(() => {});
    }, 2000);
    return () => clearTimeout(timer);
  }, [answers, submitted, explanations, flagged, sectionIdx, moduleIdx, questionIdx, screen, user, progressKey, mode, checkMode]);

  const handleStart = async () => {
    await loadQuestions();
    startTimeRef.current = Date.now();
    setSectionIdx(0);
    setModuleIdx(0);
    setQuestionIdx(0);
    setTimerKey((k) => k + 1);
    setScreen("test");
  };

  const handleRetake = () => {
    setScreen("landing");
    setAnswers({});
    setSubmitted({});
    setExplanations({});
    setFlagged(new Set());
    setSectionIdx(0);
    setModuleIdx(0);
    setQuestionIdx(0);
    setTimerKey(0);
    setReviewTab("overview");
    setReflections({});
    setSections([]);
  };

  const handleAnswer = (answer: string) => {
    if (!currentQ) return;
    setAnswers((prev) => ({ ...prev, [qid(currentQ)]: answer }));
  };

  const handleSubmit = () => {
    if (!currentQ) return;
    const id = qid(currentQ);
    setSubmitted((prev) => ({ ...prev, [id]: true }));
    if (checkMode === "each") {
      setExplanations((prev) => ({ ...prev, [id]: true }));
    }
  };

  const handleAdvanceModule = () => {
    if (moduleIdx === 0) {
      setModuleIdx(1);
    } else {
      if (sectionIdx === 0) {
        setSectionIdx(1);
        setModuleIdx(0);
      } else {
        finishTest();
        return;
      }
    }
    setQuestionIdx(0);
    setTimerKey((k) => k + 1);
    setScreen("break");
  };

  const handleResumeFromBreak = () => {
    setScreen("test");
    setTimerKey((k) => k + 1);
  };

  const finishTest = useCallback(() => {
    if (checkMode === "end") {
      const allQ = sections.flatMap((s) => s.modules.flat());
      const newExp: Record<string, boolean> = {};
      const newSub: Record<string, boolean> = {};
      allQ.forEach((q) => {
        newExp[qid(q)] = true;
        newSub[qid(q)] = true;
      });
      setExplanations(newExp);
      setSubmitted(newSub);
    }
    setScreen("results");

    if (!user || sections.length === 0) return;
    const allQ = sections.flatMap((s) => s.modules.flat());
    const timeSpent = Math.round((Date.now() - startTimeRef.current) / 1000);

    const answersByIndex: Record<number, string> = {};
    allQ.forEach((q, i) => {
      answersByIndex[i] = answers[qid(q)] ?? "";
    });
    const course = `${testType}-combined`;

    completeTestSession({
      uid: user.uid,
      email: user.email ?? "",
      testType: `${testType}-practice`,
      mode: "practice",
      course,
      questions: allQ,
      answers: answersByIndex,
      timeSpent,
    }).catch((err) => {
      console.error("completeTestSession failed:", err);
      setSaveError(true);
    });
  }, [user, sections, answers, testType, checkMode]);

  const handleToggleFlag = (idx: number) => {
    if (!currentModule[idx]) return;
    const id = qid(currentModule[idx]);
    setFlagged((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Compute results
  const allQuestions = sections.flatMap((s) => s.modules.flat());
  const rwQuestions = sections[0]?.modules.flat() ?? [];
  const mathQuestions = sections[1]?.modules.flat() ?? [];

  const answeredSet = new Set(
    currentModule
      .map((q, i) => (answers[qid(q)] != null && answers[qid(q)] !== "" ? i : -1))
      .filter((i) => i >= 0)
  );

  const flaggedSet = new Set(
    currentModule
      .map((q, i) => (flagged.has(qid(q)) ? i : -1))
      .filter((i) => i >= 0)
  );

  const currentTimeMins = currentSection?.time[moduleIdx] ?? 32;

  // -- Landing Screen --
  if (screen === "landing") {
    return (
      <div className="min-h-screen">
        <TopBar backHref="/home" backLabel="Home" />
        <div className="mx-auto max-w-2xl px-6 py-12">
          <div className="mb-2 text-sm font-semibold uppercase tracking-wider" style={{ color: accentColor }}>
            Full Practice Test
          </div>
          <h1 className="mb-2 font-display text-[2.4rem] tracking-[0.02em] text-white">{title}</h1>
          <p className="mb-8 text-text-secondary">
            A complete {testType === "sat" ? "SAT" : testType === "nmsqt" ? "PSAT/NMSQT" : "PSAT 8/9"} practice test
            with all 4 modules.
          </p>

          <GlassCard className="mb-6">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-muted">Test Structure</h3>
            <div className="flex flex-col gap-2 text-sm">
              {[
                [`R&W Module 1`, `${rwTime[0]} min`],
                [`R&W Module 2`, `${rwTime[1]} min`],
                [`Math Module 1`, `${mathTime[0]} min`],
                [`Math Module 2`, `${mathTime[1]} min`],
              ].map(([mod, time]) => (
                <div key={mod} className="flex justify-between">
                  <span className="text-text-secondary">{mod}</span>
                  <span className="text-text-muted">{time}</span>
                </div>
              ))}
              <div className="mt-2 flex justify-between border-t border-border-default pt-2 font-semibold">
                <span className="text-text-primary">Total</span>
                <span className="text-text-primary">{rwTime[0] + rwTime[1] + mathTime[0] + mathTime[1]} min</span>
              </div>
            </div>
          </GlassCard>

          {/* Mode selection */}
          <div className="mb-6">
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-text-muted">Test Mode</h3>
            <div className="flex gap-3">
              {(["timed", "practice"] as Mode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`rounded-radius-md border px-5 py-2.5 text-sm capitalize transition-all ${
                    mode === m
                      ? "border-transparent text-white"
                      : "border-border-default text-text-muted hover:border-border-light"
                  }`}
                  style={mode === m ? { backgroundColor: accentColor } : undefined}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Check mode */}
          <div className="mb-8">
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-text-muted">Review Answers</h3>
            <div className="flex gap-3">
              {(
                [
                  ["each", "After Each Question"],
                  ["end", "At the End"],
                ] as [CheckMode, string][]
              ).map(([c, label]) => (
                <button
                  key={c}
                  onClick={() => setCheckMode(c)}
                  className={`rounded-radius-md border px-5 py-2.5 text-sm transition-all ${
                    checkMode === c
                      ? "border-transparent text-white"
                      : "border-border-default text-text-muted hover:border-border-light"
                  }`}
                  style={checkMode === c ? { backgroundColor: accentColor } : undefined}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleStart}
            disabled={loading}
            className="rounded-radius-md px-8 py-3 text-sm font-semibold text-white transition-all hover:brightness-110"
            style={{ backgroundColor: accentColor }}
          >
            {loading ? "Loading..." : "Begin Test"}
          </button>
        </div>
      </div>
    );
  }

  // -- Break Screen --
  if (screen === "break") {
    const sec = sections[sectionIdx];
    const modQs = sec?.modules[moduleIdx] ?? [];
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <GlassCard className="max-w-lg text-center">
          <h2 className="mb-2 font-display text-[1.8rem] text-white">
            {sec?.name} — Module {moduleIdx + 1}
          </h2>
          <p className="mb-4 text-sm text-text-secondary">
            {modQs.length} questions · {sec?.time[moduleIdx]} minutes
          </p>
          {sectionIdx === 1 && moduleIdx === 0 && (
            <p className="mb-4 text-xs text-text-muted">Calculator allowed for all Math questions.</p>
          )}
          <button
            onClick={handleResumeFromBreak}
            className="rounded-radius-md px-8 py-3 text-sm font-semibold text-white transition-all hover:brightness-110"
            style={{ backgroundColor: accentColor }}
          >
            Begin Module
          </button>
        </GlassCard>
      </div>
    );
  }

  // -- Test Screen --
  if (screen === "test") {
    if (!currentQ) {
      return (
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-text-muted">Loading questions...</div>
        </div>
      );
    }

    const isLastQuestion = questionIdx === currentModule.length - 1;
    const qId = qid(currentQ);

    return (
      <div className="min-h-screen">
        <div className="glass sticky top-0 z-40 border-b border-border-default px-6 py-3">
          <div className="mx-auto flex max-w-5xl items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold" style={{ color: accentColor }}>
                {currentSection?.short} Mod {moduleIdx + 1}
              </span>
              <ProgressBar current={questionIdx} total={currentModule.length} className="w-48" />
            </div>
            <div className="flex items-center gap-4">
              {sectionIdx === 1 && (
                <div className="relative">
                  <ReferenceSheet />
                </div>
              )}
              {mode === "timed" && (
                <Timer
                  key={timerKey}
                  initialSeconds={currentTimeMins * 60}
                  onExpire={handleAdvanceModule}
                />
              )}
              <button
                onClick={handleAdvanceModule}
                className="rounded-radius-sm border border-border-default px-4 py-1.5 text-xs font-medium text-text-muted transition-colors hover:border-accent-red hover:text-accent-red"
              >
                {isLastQuestion ? "Next Module" : "End Module"}
              </button>
            </div>
          </div>
        </div>

        <div className="mx-auto flex max-w-5xl gap-6 px-6 py-6">
          <div className="flex-1">
            <QuestionCard
              question={currentQ}
              questionNumber={questionIdx + 1}
              selectedAnswer={answers[qId]}
              onAnswer={handleAnswer}
              showExplanation={!!explanations[qId]}
              locked={!!submitted[qId]}
            />

            <div className="mt-6 flex items-center justify-between">
              <button
                onClick={() => setQuestionIdx((p) => Math.max(0, p - 1))}
                disabled={questionIdx === 0}
                className="rounded-radius-sm border border-border-default px-5 py-2 text-sm text-text-secondary transition-colors hover:border-border-light disabled:opacity-30"
              >
                Previous
              </button>

              <div className="flex gap-3">
                {!submitted[qId] && answers[qId] != null && (
                  <button
                    onClick={handleSubmit}
                    className="rounded-radius-sm px-5 py-2 text-sm font-semibold text-white transition-all hover:brightness-110"
                    style={{ backgroundColor: accentColor }}
                  >
                    Submit
                  </button>
                )}

                {!isLastQuestion ? (
                  <button
                    onClick={() => setQuestionIdx((p) => p + 1)}
                    className="rounded-radius-sm border border-border-default px-5 py-2 text-sm text-text-secondary transition-colors hover:border-border-light"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    onClick={handleAdvanceModule}
                    className="rounded-radius-sm px-5 py-2 text-sm font-semibold text-white"
                    style={{ backgroundColor: accentColor }}
                  >
                    Next Module
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="hidden w-64 shrink-0 lg:block">
            <GlassCard className="sticky top-20">
              <QuestionNavigator
                total={currentModule.length}
                current={questionIdx}
                answered={answeredSet}
                flagged={flaggedSet}
                onJump={setQuestionIdx}
                onToggleFlag={handleToggleFlag}
              />
            </GlassCard>
          </div>
        </div>
      </div>
    );
  }

  // -- Results Screen --
  const rwCorrect = rwQuestions.filter((q) => isCorrect(q, answers[qid(q)])).length;
  const mathCorrect = mathQuestions.filter((q) => isCorrect(q, answers[qid(q)])).length;
  const totalCorrect = rwCorrect + mathCorrect;

  // Scaled scores (test-specific ranges: SAT 200-800, NMSQT 160-760, PSAT89 120-720)
  const scaleMin = testType === "psat89" ? 120 : testType === "nmsqt" ? 160 : 200;
  const scaleRange = testType === "psat89" ? 600 : testType === "nmsqt" ? 600 : 600;
  const rwScaled = rwQuestions.length > 0 ? Math.round(scaleMin + (rwCorrect / rwQuestions.length) * scaleRange) : 0;
  const mathScaled = mathQuestions.length > 0 ? Math.round(scaleMin + (mathCorrect / mathQuestions.length) * scaleRange) : 0;
  const composite = rwScaled + mathScaled;

  const overallAccuracy = allQuestions.length > 0 ? Math.round((totalCorrect / allQuestions.length) * 100) : 0;

  const computeDomainStats = (qs: Question[], domains: string[]) => {
    const map: Record<string, { correct: number; total: number }> = {};
    domains.forEach((d) => (map[d] = { correct: 0, total: 0 }));
    qs.forEach((q) => {
      if (!map[q.domain]) map[q.domain] = { correct: 0, total: 0 };
      map[q.domain].total++;
      if (isCorrect(q, answers[qid(q)])) map[q.domain].correct++;
    });
    return Object.entries(map).map(([domain, s]) => ({ domain, ...s }));
  };

  const rwDomainStats = computeDomainStats(rwQuestions, RW_DOMAINS);
  const mathDomainStats = computeDomainStats(mathQuestions, mathDomains);
  const allDomainStats = [...rwDomainStats, ...mathDomainStats];

  const strengths = allDomainStats.filter((d) => d.total > 0 && (d.correct / d.total) >= 0.7);
  const focusAreas = allDomainStats.filter((d) => d.total > 0 && (d.correct / d.total) < 0.7);

  return (
    <div className="min-h-screen">
      <TopBar backHref="/home" backLabel="Home" />
      <div className="mx-auto max-w-3xl px-6 py-12">
        <div className="mb-2 text-sm font-semibold uppercase tracking-wider" style={{ color: accentColor }}>
          Practice Test Complete
        </div>
        <h1 className="mb-8 font-display text-[2.2rem] tracking-[0.02em] text-white">{title} Results</h1>

        {saveError && (
          <div className="mb-6 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-300">
            Your score couldn&apos;t be saved. Check your connection and try reloading if you need to review this session.
          </div>
        )}

        {/* Composite Score */}
        <GlassCard className="mb-8 text-center">
          <div className="text-5xl font-bold text-white">{composite}</div>
          <div className="mt-1 text-sm text-text-muted">Composite Score ({scaleMin * 2}–{(scaleMin + scaleRange) * 2})</div>
          <div className="mt-4 flex justify-center gap-8">
            <div>
              <div className="text-2xl font-bold" style={{ color: accentColor }}>{rwScaled}</div>
              <div className="text-xs text-text-muted">R&W ({scaleMin}–{scaleMin + scaleRange})</div>
            </div>
            <div>
              <div className="text-2xl font-bold" style={{ color: accentColor }}>{mathScaled}</div>
              <div className="text-xs text-text-muted">Math ({scaleMin}–{scaleMin + scaleRange})</div>
            </div>
          </div>
        </GlassCard>

        {/* NMSQT National Merit Banner */}
        {testType === "nmsqt" && (
          <div
            className={`mb-8 rounded-2xl border px-6 py-4 text-sm ${
              composite >= 1480
                ? "border-green-500/30 bg-green-500/10 text-green-300"
                : composite >= 1400
                ? "border-amber-500/30 bg-amber-500/10 text-amber-300"
                : "border-white/10 bg-[rgba(15,15,22,.75)] text-text-secondary"
            }`}
          >
            <div className="mb-1 font-semibold">
              Selection Index: {composite}
            </div>
            {composite >= 1480
              ? "Your Selection Index is in the range typically needed for National Merit Semifinalist status!"
              : composite >= 1400
              ? "Your Selection Index is approaching the competitive range for National Merit recognition."
              : "National Merit Semifinalist cutoffs are typically around 1480+. Keep working toward your goal!"}
          </div>
        )}

        {/* PSAT 8/9 Readiness Assessment */}
        {testType === "psat89" && (
          <div
            className={`mb-8 rounded-2xl border px-6 py-4 text-sm ${
              overallAccuracy >= 80
                ? "border-green-500/30 bg-green-500/10 text-green-300"
                : overallAccuracy >= 60
                ? "border-amber-500/30 bg-amber-500/10 text-amber-300"
                : "border-blue-500/30 bg-blue-500/10 text-blue-300"
            }`}
          >
            <div className="mb-1 font-semibold">
              {overallAccuracy >= 80
                ? "Excellent Foundation!"
                : overallAccuracy >= 60
                ? "Solid Start!"
                : "Building Blocks"}
            </div>
            {overallAccuracy >= 80
              ? "You show strong readiness for the PSAT/NMSQT."
              : overallAccuracy >= 60
              ? "You have a good foundation to build on."
              : "Focus on strengthening foundational skills before moving to PSAT/NMSQT prep."}
          </div>
        )}

        {/* Review Tabs */}
        <div className="mb-6 flex gap-2 border-b border-border-default">
          {(["overview", "rw", "math", "reflect"] as ReviewTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setReviewTab(tab)}
              className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
                reviewTab === tab
                  ? "border-current text-white"
                  : "border-transparent text-text-muted hover:text-text-secondary"
              }`}
              style={reviewTab === tab ? { color: accentColor } : undefined}
            >
              {tab === "overview" ? "Overview" : tab === "rw" ? "Reading & Writing" : tab === "math" ? "Math" : "Reflect"}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {reviewTab === "overview" && (
          <>
            <div className="mb-8 flex justify-center gap-8">
              <ScoreCircle correct={rwCorrect} total={rwQuestions.length} label="R&W" />
              <ScoreCircle correct={mathCorrect} total={mathQuestions.length} label="Math" />
            </div>

            <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                ["Total Correct", totalCorrect],
                ["Total Questions", allQuestions.length],
                ["Skipped", allQuestions.length - Object.keys(answers).filter((k) => answers[k]).length],
                ["Accuracy", `${overallAccuracy}%`],
              ].map(([label, value]) => (
                <GlassCard key={label as string} className="text-center">
                  <div className="text-2xl font-bold text-white">{value}</div>
                  <div className="text-xs text-text-muted">{label}</div>
                </GlassCard>
              ))}
            </div>

            {/* Strengths & Focus Areas */}
            <div className="mb-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-green-500/20 bg-[rgba(15,15,22,.75)] p-5 backdrop-blur-[20px]">
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-green-400">Strengths</h3>
                {strengths.length > 0 ? (
                  <ul className="flex flex-col gap-2">
                    {strengths.map((d) => (
                      <li key={d.domain} className="flex items-center justify-between text-sm">
                        <span className="text-text-secondary">{d.domain}</span>
                        <span className="font-medium text-green-400">
                          {d.total > 0 ? Math.round((d.correct / d.total) * 100) : 0}%
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-text-muted">Keep practicing to build strengths!</p>
                )}
              </div>
              <div className="rounded-2xl border border-amber-500/20 bg-[rgba(15,15,22,.75)] p-5 backdrop-blur-[20px]">
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-amber-400">Focus Areas</h3>
                {focusAreas.length > 0 ? (
                  <ul className="flex flex-col gap-2">
                    {focusAreas.map((d) => (
                      <li key={d.domain} className="flex items-center justify-between text-sm">
                        <span className="text-text-secondary">{d.domain}</span>
                        <span className="font-medium text-amber-400">
                          {d.total > 0 ? Math.round((d.correct / d.total) * 100) : 0}%
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-text-muted">Great job — no weak areas detected!</p>
                )}
              </div>
            </div>

            {/* Weak Skills CTA — Spec F */}
            <WeakSkillsCallout
              course={`${testType}-rw`}
              accentColor={accentColor}
              title="Practice Your R&W Weak Areas"
              results={rwQuestions.map((q) => ({
                skill: q.skill,
                correct: isCorrect(q, answers[qid(q)]),
              }))}
            />
            <WeakSkillsCallout
              course={`${testType}-math`}
              accentColor={accentColor}
              title="Practice Your Math Weak Areas"
              results={mathQuestions.map((q) => ({
                skill: q.skill,
                correct: isCorrect(q, answers[qid(q)]),
              }))}
            />
          </>
        )}

        {/* R&W Review Tab */}
        {reviewTab === "rw" && (
          <>
            <GlassCard className="mb-6">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-text-muted">
                R&W Domain Breakdown
              </h3>
              <DomainBreakdown stats={rwDomainStats} />
            </GlassCard>
            <WeakSkillsCallout
              course={`${testType}-rw`}
              accentColor={accentColor}
              title="Practice Your R&W Weak Areas"
              results={rwQuestions.map((q) => ({
                skill: q.skill,
                correct: isCorrect(q, answers[qid(q)]),
              }))}
            />
            <GlassCard>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-text-muted">
                Question Review
              </h3>
              <div className="flex flex-col gap-6">
                {rwQuestions.map((q, i) => (
                  <div key={q.id} className="border-t border-border-default pt-4 first:border-0 first:pt-0">
                    <QuestionCard
                      question={q}
                      questionNumber={i + 1}
                      selectedAnswer={answers[qid(q)]}
                      onAnswer={() => {}}
                      showExplanation={true}
                      locked={true}
                    />
                  </div>
                ))}
              </div>
            </GlassCard>
          </>
        )}

        {/* Math Review Tab */}
        {reviewTab === "math" && (
          <>
            <GlassCard className="mb-6">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-text-muted">
                Math Domain Breakdown
              </h3>
              <DomainBreakdown stats={mathDomainStats} />
            </GlassCard>
            <WeakSkillsCallout
              course={`${testType}-math`}
              accentColor={accentColor}
              title="Practice Your Math Weak Areas"
              results={mathQuestions.map((q) => ({
                skill: q.skill,
                correct: isCorrect(q, answers[qid(q)]),
              }))}
            />
            <GlassCard>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-text-muted">
                Question Review
              </h3>
              <div className="flex flex-col gap-6">
                {mathQuestions.map((q, i) => (
                  <div key={q.id} className="border-t border-border-default pt-4 first:border-0 first:pt-0">
                    <QuestionCard
                      question={q}
                      questionNumber={i + 1}
                      selectedAnswer={answers[qid(q)]}
                      onAnswer={() => {}}
                      showExplanation={true}
                      locked={true}
                    />
                  </div>
                ))}
              </div>
            </GlassCard>
          </>
        )}

        {/* Reflect Tab */}
        {reviewTab === "reflect" && (
          <div className="flex flex-col gap-5">
            {REFLECTION_PROMPTS[testType].map((prompt, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-white/10 bg-[rgba(15,15,22,.75)] p-5 backdrop-blur-[20px]"
              >
                <label className="mb-2 block text-sm font-medium text-text-secondary">
                  {prompt}
                </label>
                <textarea
                  value={reflections[idx] ?? ""}
                  onChange={(e) =>
                    setReflections((prev) => ({ ...prev, [idx]: e.target.value }))
                  }
                  placeholder="Type your reflection here..."
                  rows={3}
                  className="w-full resize-y rounded-xl border border-white/10 bg-[rgba(10,10,16,.6)] px-4 py-3 text-sm text-white placeholder-text-muted outline-none transition-colors focus:border-white/20"
                />
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="mt-8 flex justify-center gap-4">
          <a
            href="/home"
            className="rounded-radius-md border border-border-default px-6 py-3 text-sm text-text-secondary transition-colors hover:border-border-light"
          >
            Back to Home
          </a>
          <button
            onClick={handleRetake}
            className="rounded-radius-md px-6 py-3 text-sm font-semibold text-white transition-all hover:brightness-110"
            style={{ backgroundColor: accentColor }}
          >
            Retake Test
          </button>
        </div>
      </div>
    </div>
  );
}

function isCorrect(question: Question, answer?: string): boolean {
  if (!answer) return false;
  if (question.type === "mc") return answer === question.correctAnswer;
  const a = parseFloat(answer.trim());
  const c = parseFloat(question.correctAnswer.trim());
  if (isNaN(a) || isNaN(c)) {
    return answer.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase();
  }
  return Math.abs(a - c) < 0.01;
}
