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
    const totalMin = rwTime[0] + rwTime[1] + mathTime[0] + mathTime[1];
    const modules: [string, string, number][] = [
      ["R&W", "01", rwTime[0]],
      ["R&W", "02", rwTime[1]],
      ["Math", "01", mathTime[0]],
      ["Math", "02", mathTime[1]],
    ];
    return (
      <div className="min-h-screen bg-paper">
        <TopBar backHref="/home" backLabel="Home" />
        <div className="mx-auto max-w-2xl px-6 py-12">
          <div className="kicker mb-3">Full Practice Test</div>
          <h1 className="mb-3 font-display text-[2.6rem] leading-tight text-ink">
            {title}
          </h1>
          <p className="mb-8 font-body text-base italic text-ink-2">
            A complete{" "}
            {testType === "sat" ? "SAT" : testType === "nmsqt" ? "PSAT/NMSQT" : "PSAT 8/9"}{" "}
            practice test — all four modules, scored end-to-end.
          </p>

          {/* Module cards — paper-card grid */}
          <div className="mb-6 grid grid-cols-2 gap-0 border-2 border-ink">
            {modules.map(([sect, mod, min], i) => (
              <div
                key={i}
                className={`bg-paper-card p-5 ${
                  i % 2 === 1 ? "border-l-2 border-ink" : ""
                } ${i >= 2 ? "border-t-2 border-ink" : ""}`}
              >
                <div className="kicker">{sect}</div>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="font-display text-3xl font-bold leading-none text-ink">
                    {mod}
                  </span>
                  <span className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-ink-3">
                    {min} min
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mb-8 flex items-baseline justify-between border-t-2 border-b-2 border-ink py-3">
            <span className="kicker">Total Time</span>
            <span className="font-display text-2xl font-bold text-ink">
              {totalMin}
              <span className="ml-1 font-mono text-sm font-bold uppercase tracking-[0.14em] text-ink-3">
                min
              </span>
            </span>
          </div>

          {/* Mode selection */}
          <div className="mb-6">
            <h3 className="mb-2 kicker">Test Mode</h3>
            <div className="flex gap-0 border-2 border-ink">
              {(["timed", "practice"] as Mode[]).map((m, i) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`flex-1 px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-[0.14em] transition-colors ${
                    i === 1 ? "border-l-2 border-ink" : ""
                  } ${
                    mode === m
                      ? "bg-ink text-paper"
                      : "bg-paper-card text-ink hover:bg-paper-2"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Check mode */}
          <div className="mb-8">
            <h3 className="mb-2 kicker">Review Answers</h3>
            <div className="flex gap-0 border-2 border-ink">
              {(
                [
                  ["each", "After Each Question"],
                  ["end", "At the End"],
                ] as [CheckMode, string][]
              ).map(([c, label], i) => (
                <button
                  key={c}
                  onClick={() => setCheckMode(c)}
                  className={`flex-1 px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-[0.14em] transition-colors ${
                    i === 1 ? "border-l-2 border-ink" : ""
                  } ${
                    checkMode === c
                      ? "bg-ink text-paper"
                      : "bg-paper-card text-ink hover:bg-paper-2"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleStart}
            disabled={loading}
            className="border-2 border-ink bg-accent px-8 py-3 font-mono text-xs font-bold uppercase tracking-[0.14em] text-accent-fg transition-colors hover:bg-ink disabled:opacity-40"
          >
            {loading ? "Loading..." : "Begin Test →"}
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
      <div className="flex min-h-screen items-center justify-center bg-paper px-6">
        <GlassCard raised className="max-w-lg text-center">
          <div className="kicker mb-3">Next Up</div>
          <h2 className="mb-3 font-display text-[2rem] leading-tight text-ink">
            {sec?.name} <em className="text-accent">—</em> Module{" "}
            <span className="font-mono text-2xl font-bold">
              {String(moduleIdx + 1).padStart(2, "0")}
            </span>
          </h2>
          <p className="mb-2 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-ink-3">
            <span className="text-ink">{modQs.length}</span> questions
            <span className="mx-2 text-ink-4">·</span>
            <span className="text-ink">{sec?.time[moduleIdx]}</span> minutes
          </p>
          {sectionIdx === 1 && moduleIdx === 0 && (
            <p className="mb-4 font-body text-sm italic text-ink-2">
              Calculator allowed for all Math questions.
            </p>
          )}
          <button
            onClick={handleResumeFromBreak}
            className="mt-4 border-2 border-ink bg-accent px-8 py-3 font-mono text-xs font-bold uppercase tracking-[0.14em] text-accent-fg transition-colors hover:bg-ink"
          >
            Begin Module →
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
      <div className="min-h-screen bg-paper">
        <div className="sticky top-0 z-40 border-b-2 border-ink bg-paper-card px-6 py-3">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-ink">
                {currentSection?.short}
                <span className="mx-2 text-ink-4">·</span>
                <span className="text-accent">
                  MOD {String(moduleIdx + 1).padStart(2, "0")}
                </span>
              </span>
              <ProgressBar current={questionIdx} total={currentModule.length} className="w-48" />
            </div>
            <div className="flex items-center gap-3">
              {sectionIdx === 1 && <ReferenceSheet />}
              {mode === "timed" && (
                <Timer
                  key={timerKey}
                  initialSeconds={currentTimeMins * 60}
                  onExpire={handleAdvanceModule}
                />
              )}
              <button
                onClick={handleAdvanceModule}
                className="border-2 border-ink bg-paper-card px-4 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-ink transition-colors hover:bg-ink hover:text-paper"
              >
                {isLastQuestion ? "Next Module" : "End Module"}
              </button>
            </div>
          </div>
        </div>

        <div className="mx-auto flex max-w-5xl gap-6 px-6 py-6">
          <div className="flex-1">
            <GlassCard raised>
              <QuestionCard
                question={currentQ}
                questionNumber={questionIdx + 1}
                selectedAnswer={answers[qId]}
                onAnswer={handleAnswer}
                showExplanation={!!explanations[qId]}
                locked={!!submitted[qId]}
              />
            </GlassCard>

            <div className="mt-6 flex items-center justify-between">
              <button
                onClick={() => setQuestionIdx((p) => Math.max(0, p - 1))}
                disabled={questionIdx === 0}
                className="border-2 border-ink bg-paper-card px-5 py-2.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-ink transition-colors hover:bg-ink hover:text-paper disabled:opacity-30"
              >
                ← Previous
              </button>

              <div className="flex gap-3">
                {!submitted[qId] && answers[qId] != null && (
                  <button
                    onClick={handleSubmit}
                    className="border-2 border-ink bg-ink px-5 py-2.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-paper transition-colors hover:bg-accent hover:text-accent-fg"
                  >
                    Submit
                  </button>
                )}

                {!isLastQuestion ? (
                  <button
                    onClick={() => setQuestionIdx((p) => p + 1)}
                    className="border-2 border-ink bg-accent px-5 py-2.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-accent-fg transition-colors hover:bg-ink"
                  >
                    Next →
                  </button>
                ) : (
                  <button
                    onClick={handleAdvanceModule}
                    className="border-2 border-ink bg-accent px-5 py-2.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-accent-fg transition-colors hover:bg-ink"
                  >
                    Next Module →
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="hidden w-64 shrink-0 lg:block">
            <div className="sticky top-20 border-2 border-ink bg-paper-card p-4">
              <QuestionNavigator
                total={currentModule.length}
                current={questionIdx}
                answered={answeredSet}
                flagged={flaggedSet}
                onJump={setQuestionIdx}
                onToggleFlag={handleToggleFlag}
              />
            </div>
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
    <div className="min-h-screen bg-paper">
      <TopBar backHref="/home" backLabel="Home" />
      <div className="mx-auto max-w-3xl px-6 py-12">
        <div className="kicker mb-3 text-green">● Practice Test Complete</div>
        <h1 className="mb-8 font-display text-[2.4rem] leading-tight text-ink">
          {title} <em className="text-accent">Results</em>
        </h1>

        {saveError && (
          <div className="mb-6 border-2 border-amber bg-amber-soft px-4 py-3 font-body text-sm italic text-ink">
            Your score couldn&apos;t be saved. Check your connection and try reloading if you need to review this session.
          </div>
        )}

        {/* Composite Score — hero */}
        <GlassCard raised className="mb-8 text-center">
          <div className="kicker mb-3">Composite Score</div>
          <div className="font-display text-[5.5rem] font-bold leading-none text-ink">
            {composite}
          </div>
          <div className="mt-2 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-ink-3">
            out of <span className="text-ink">{(scaleMin + scaleRange) * 2}</span>
            <span className="mx-2 text-ink-4">·</span>
            range <span className="text-ink">{scaleMin * 2}&ndash;{(scaleMin + scaleRange) * 2}</span>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-0 border-2 border-ink">
            <div className="bg-paper p-4">
              <div className="kicker mb-1">R&W</div>
              <div className="font-display text-3xl font-bold text-ink">{rwScaled}</div>
              <div className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-ink-3">
                {scaleMin}&ndash;{scaleMin + scaleRange}
              </div>
            </div>
            <div className="border-l-2 border-ink bg-paper p-4">
              <div className="kicker mb-1">Math</div>
              <div className="font-display text-3xl font-bold text-ink">{mathScaled}</div>
              <div className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-ink-3">
                {scaleMin}&ndash;{scaleMin + scaleRange}
              </div>
            </div>
          </div>
        </GlassCard>

        {/* NMSQT National Merit Banner */}
        {testType === "nmsqt" && (
          <div
            className={`mb-8 border-2 px-6 py-4 ${
              composite >= 1480
                ? "border-green bg-green-soft"
                : composite >= 1400
                ? "border-amber bg-amber-soft"
                : "border-ink bg-paper-card"
            }`}
          >
            <div className="kicker mb-1">
              Selection Index: <span className="text-ink">{composite}</span>
            </div>
            <p className="font-body text-sm italic text-ink-2">
              {composite >= 1480
                ? "Your Selection Index is in the range typically needed for National Merit Semifinalist status."
                : composite >= 1400
                ? "Your Selection Index is approaching the competitive range for National Merit recognition."
                : "National Merit Semifinalist cutoffs are typically around 1480+. Keep working toward your goal."}
            </p>
          </div>
        )}

        {/* PSAT 8/9 Readiness Assessment */}
        {testType === "psat89" && (
          <div
            className={`mb-8 border-2 px-6 py-4 ${
              overallAccuracy >= 80
                ? "border-green bg-green-soft"
                : overallAccuracy >= 60
                ? "border-amber bg-amber-soft"
                : "border-ink bg-paper-card"
            }`}
          >
            <div className="kicker mb-1">
              {overallAccuracy >= 80
                ? "● Excellent Foundation"
                : overallAccuracy >= 60
                ? "● Solid Start"
                : "● Building Blocks"}
            </div>
            <p className="font-body text-sm italic text-ink-2">
              {overallAccuracy >= 80
                ? "You show strong readiness for the PSAT/NMSQT."
                : overallAccuracy >= 60
                ? "You have a good foundation to build on."
                : "Focus on strengthening foundational skills before moving to PSAT/NMSQT prep."}
            </p>
          </div>
        )}

        {/* Review Tabs */}
        <div className="mb-6 flex border-b-2 border-ink">
          {(["overview", "rw", "math", "reflect"] as ReviewTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setReviewTab(tab)}
              className={`-mb-0.5 border-b-4 px-4 py-2.5 font-mono text-[11px] font-bold uppercase tracking-[0.14em] transition-colors ${
                reviewTab === tab
                  ? "border-accent text-ink"
                  : "border-transparent text-ink-3 hover:text-ink"
              }`}
            >
              {tab === "overview" ? "Overview" : tab === "rw" ? "Reading & Writing" : tab === "math" ? "Math" : "Reflect"}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {reviewTab === "overview" && (
          <>
            <div className="mb-8 flex justify-center gap-12">
              <ScoreCircle correct={rwCorrect} total={rwQuestions.length} label="R&W" />
              <ScoreCircle correct={mathCorrect} total={mathQuestions.length} label="Math" />
            </div>

            <div className="mb-8 grid grid-cols-2 gap-0 border-2 border-ink sm:grid-cols-4">
              {[
                ["Correct", totalCorrect, "text-green"],
                ["Total", allQuestions.length, "text-ink"],
                [
                  "Skipped",
                  allQuestions.length - Object.keys(answers).filter((k) => answers[k]).length,
                  "text-ink-3",
                ],
                ["Accuracy", `${overallAccuracy}%`, "text-ink"],
              ].map(([label, value, tone], i) => (
                <div
                  key={label as string}
                  className={`bg-paper-card p-5 text-center ${
                    i > 0 ? "border-t-2 border-ink sm:border-l-2 sm:border-t-0" : ""
                  }`}
                >
                  <div className={`font-display text-3xl font-bold ${tone as string}`}>
                    {value}
                  </div>
                  <div className="kicker mt-1">{label}</div>
                </div>
              ))}
            </div>

            {/* Strengths & Focus Areas */}
            <div className="mb-8 grid gap-4 sm:grid-cols-2">
              <div className="border-2 border-green bg-green-soft p-5">
                <h3 className="kicker mb-3 text-green">● Strengths</h3>
                {strengths.length > 0 ? (
                  <ul className="flex flex-col gap-2">
                    {strengths.map((d) => (
                      <li
                        key={d.domain}
                        className="flex items-center justify-between border-t-2 border-rule-hair pt-2 text-sm first:border-0 first:pt-0"
                      >
                        <span className="font-body text-ink">{d.domain}</span>
                        <span className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-green">
                          {d.total > 0 ? Math.round((d.correct / d.total) * 100) : 0}%
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="font-body text-sm italic text-ink-2">
                    Keep practicing to build strengths.
                  </p>
                )}
              </div>
              <div className="border-2 border-amber bg-amber-soft p-5">
                <h3 className="kicker mb-3 text-amber">● Focus Areas</h3>
                {focusAreas.length > 0 ? (
                  <ul className="flex flex-col gap-2">
                    {focusAreas.map((d) => (
                      <li
                        key={d.domain}
                        className="flex items-center justify-between border-t-2 border-rule-hair pt-2 text-sm first:border-0 first:pt-0"
                      >
                        <span className="font-body text-ink">{d.domain}</span>
                        <span className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-amber">
                          {d.total > 0 ? Math.round((d.correct / d.total) * 100) : 0}%
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="font-body text-sm italic text-ink-2">
                    No weak areas detected.
                  </p>
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
              <h3 className="mb-4 kicker">R&W Domain Breakdown</h3>
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
              <h3 className="mb-4 kicker">Question Review</h3>
              <div className="flex flex-col gap-6">
                {rwQuestions.map((q, i) => (
                  <div
                    key={q.id}
                    className="border-t-2 border-rule-hair pt-5 first:border-0 first:pt-0"
                  >
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
              <h3 className="mb-4 kicker">Math Domain Breakdown</h3>
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
              <h3 className="mb-4 kicker">Question Review</h3>
              <div className="flex flex-col gap-6">
                {mathQuestions.map((q, i) => (
                  <div
                    key={q.id}
                    className="border-t-2 border-rule-hair pt-5 first:border-0 first:pt-0"
                  >
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
              <div key={idx} className="border-2 border-ink bg-paper-card p-5">
                <label className="mb-2 block font-body text-sm italic text-ink-2">
                  {prompt}
                </label>
                <textarea
                  value={reflections[idx] ?? ""}
                  onChange={(e) =>
                    setReflections((prev) => ({ ...prev, [idx]: e.target.value }))
                  }
                  placeholder="Type your reflection here..."
                  rows={3}
                  className="w-full resize-y border-2 border-rule-hair bg-paper px-4 py-3 font-body text-sm text-ink outline-none transition-colors focus:border-ink focus:shadow-[3px_3px_0_var(--color-ink)]"
                />
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="mt-8 flex justify-center gap-3">
          <a
            href="/home"
            className="border-2 border-ink bg-paper-card px-6 py-3 font-mono text-xs font-bold uppercase tracking-[0.14em] text-ink transition-colors hover:bg-ink hover:text-paper"
          >
            ← Home
          </a>
          <button
            onClick={handleRetake}
            className="border-2 border-ink bg-accent px-6 py-3 font-mono text-xs font-bold uppercase tracking-[0.14em] text-accent-fg transition-colors hover:bg-ink"
          >
            Retake Test →
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
