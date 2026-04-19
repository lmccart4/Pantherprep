"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useAuth } from "@/hooks/use-auth";
import { getDiagnosticQuestions } from "@/lib/questions";
import { saveProgress, loadProgress } from "@/lib/firestore";
import { completeTestSession } from "@/lib/test-persistence";
import { GlassCard } from "@/components/ui/glass-card";
import { QuestionCard } from "@/components/test/question-card";
import { Timer } from "@/components/test/timer";
import { QuestionNavigator } from "@/components/test/question-navigator";
import { ProgressBar } from "@/components/test/progress-bar";
import { ScoreCircle } from "@/components/test/score-circle";
import { DomainBreakdown } from "@/components/test/domain-breakdown";
import { ReferenceSheet } from "@/components/test/reference-sheet";
import { TopBar } from "@/components/layout/top-bar";
import { WeakSkillsCallout } from "@/components/skills/weak-skills-callout";
import type { Question, TestType, Section } from "@/types/question";

type Screen = "landing" | "test" | "interstitial" | "results";

interface DiagnosticTestProps {
  testType: TestType;
  section: Section;
  title: string;
  timeMinutes: number;
  domains: string[];
  questions?: Question[];
}

const TEST_COLORS: Record<TestType, string> = {
  sat: "#C8102E",
  nmsqt: "#d4a017",
  psat89: "#06b6d4",
};

const SCORE_RANGES: Record<TestType, { min: number; max: number }> = {
  sat: { min: 200, max: 800 },
  nmsqt: { min: 160, max: 760 },
  psat89: { min: 120, max: 720 },
};

const REFLECTION_PROMPTS: Record<string, string[]> = {
  "sat-math": [
    "How did you feel about your pacing? Did you have enough time for both modules?",
    "Which math domains felt strongest? Which need the most work?",
    "Were there question types you hadn't seen before?",
    "How did Module 2 difficulty compare to Module 1?",
    "Did you use the reference sheet effectively?",
    "What's your #1 math study priority based on these results?",
    "What score are you targeting, and how far are you from it?",
  ],
  "sat-rw": [
    "How did you feel about your pacing across both modules?",
    "Which felt harder — reading comprehension or grammar questions?",
    "Were there vocabulary or grammar rules you need to review?",
    "How did Module 2 compare to Module 1 in difficulty?",
    "Did any question types consistently trip you up?",
    "What's your #1 R&W study priority based on these results?",
    "What score are you targeting, and how far are you from it?",
  ],
  "nmsqt-math": [
    "How did your pacing compare to what you expected?",
    "Which domains felt comfortable vs. challenging?",
    "Were there topics you haven't learned yet in school?",
    "How does this compare to the SAT Math diagnostic (if you took it)?",
    "What content areas need the most review?",
    "What's your study plan leading up to the PSAT/NMSQT?",
  ],
  "nmsqt-rw": [
    "How did your pacing feel across both modules?",
    "Which question types were most challenging?",
    "Were there grammar rules you need to brush up on?",
    "How does this compare to the SAT R&W diagnostic (if you took it)?",
    "What's your biggest area for improvement?",
    "What's your study plan leading up to the PSAT/NMSQT?",
  ],
  "psat89-math": [
    "How did you feel about the difficulty level overall?",
    "Which math topics felt most familiar from school?",
    "Were there question types that surprised you?",
    "Did you use the reference sheet? Was it helpful?",
    "What topics do you want to review before the PSAT/NMSQT?",
    "Are you ready to try the PSAT/NMSQT Math diagnostic next?",
  ],
  "psat89-rw": [
    "How comfortable were you with the reading passages?",
    "Were the grammar questions easier or harder than expected?",
    "Did you have enough time for both modules?",
    "Which question types were new to you?",
    "What topics do you want to review before the PSAT/NMSQT?",
    "Are you ready to try the PSAT/NMSQT R&W diagnostic next?",
  ],
};

function computeScaledScore(testType: TestType, correct: number, total: number): number {
  const { min } = SCORE_RANGES[testType];
  return total > 0 ? Math.round(min + (correct / total) * 600) : min;
}

export function DiagnosticTest({
  testType,
  section,
  title,
  timeMinutes,
  domains,
  questions: providedQuestions,
}: DiagnosticTestProps) {
  const { user } = useAuth();
  const [screen, setScreen] = useState<Screen>("landing");
  const [questions, setQuestions] = useState<Question[]>(providedQuestions ?? []);
  const [loading, setLoading] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState<Record<number, boolean>>({});
  const [flagged, setFlagged] = useState<Set<number>>(new Set());
  const [showExplanations, setShowExplanations] = useState<Record<number, boolean>>({});
  const [reflections, setReflections] = useState<Record<number, string>>({});
  const [timerKey, setTimerKey] = useState(0);
  const [currentModule, setCurrentModule] = useState(1);
  const [saveError, setSaveError] = useState(false);
  const startTimeRef = useRef<number>(0);
  const progressKey = `${testType}-${section}-diag`;

  // Module-aware question indices
  const mod1Questions = questions
    .map((q, i) => ({ q, i }))
    .filter(({ q }) => !q.module || q.module === 1);
  const mod2Questions = questions
    .map((q, i) => ({ q, i }))
    .filter(({ q }) => q.module === 2);
  const hasModules = mod2Questions.length > 0;
  const currentModuleQuestions = currentModule === 1 ? mod1Questions : mod2Questions;
  const moduleStartIdx = currentModuleQuestions.length > 0 ? currentModuleQuestions[0].i : 0;
  const moduleEndIdx = currentModuleQuestions.length > 0
    ? currentModuleQuestions[currentModuleQuestions.length - 1].i
    : questions.length - 1;

  // Load questions
  const loadQuestions = useCallback(async () => {
    if (providedQuestions && providedQuestions.length > 0) {
      setQuestions(providedQuestions);
      return;
    }
    setLoading(true);
    try {
      const qs = await getDiagnosticQuestions(testType, section);
      setQuestions(qs);
    } catch (e) {
      console.error("Failed to load questions:", e);
    } finally {
      setLoading(false);
    }
  }, [testType, section, providedQuestions]);

  // Preload question count for landing screen
  useEffect(() => {
    if (screen === "landing" && questions.length === 0) {
      loadQuestions();
    }
  }, [screen, questions.length, loadQuestions]);

  // Restore progress
  const restoreProgress = useCallback(async () => {
    if (!user) return;
    try {
      const progress = await loadProgress(user.uid, progressKey);
      if (progress?.state) {
        const s = progress.state as Record<string, unknown>;
        if (s.answers) setAnswers(s.answers as Record<number, string>);
        if (s.currentQ != null) setCurrentQ(s.currentQ as number);
        if (s.flagged) setFlagged(new Set(s.flagged as number[]));
        if (s.submitted) setSubmitted(s.submitted as Record<number, boolean>);
        setScreen("test");
        startTimeRef.current = Date.now();
        setTimerKey((k) => k + 1);
      }
    } catch {
      // No saved progress, that's fine
    }
  }, [user, progressKey]);

  // Auto-save progress
  useEffect(() => {
    if (screen !== "test" || !user || questions.length === 0) return;

    const timer = setTimeout(() => {
      saveProgress(user.uid, progressKey, {
        answers,
        currentQ,
        flagged: Array.from(flagged),
        submitted,
      }).catch(() => {});
    }, 2000);

    return () => clearTimeout(timer);
  }, [answers, currentQ, flagged, submitted, screen, user, questions.length, progressKey]);

  // Start test
  const handleStart = async () => {
    await loadQuestions();
    startTimeRef.current = Date.now();
    setCurrentModule(1);
    setScreen("test");
  };

  // Resume from saved
  const handleResume = async () => {
    await loadQuestions();
    await restoreProgress();
  };

  // Advance to module 2 interstitial
  const handleEndModule1 = () => {
    setScreen("interstitial");
  };

  // Start module 2
  const handleStartModule2 = () => {
    setCurrentModule(2);
    // Jump to first question of module 2
    if (mod2Questions.length > 0) {
      setCurrentQ(mod2Questions[0].i);
    }
    setTimerKey((k) => k + 1);
    setScreen("test");
  };

  // Finish test
  const handleFinish = useCallback(() => {
    setScreen("results");
    if (!user || questions.length === 0) return;

    const timeSpent = Math.round((Date.now() - startTimeRef.current) / 1000);
    const correct = questions.filter((q, i) => isCorrect(q, answers[i])).length;
    const scaled = computeScaledScore(testType, correct, questions.length);

    // Derive course id from testType + section (e.g. "sat" + "math" → "sat-math")
    const course = `${testType}-${section}`;

    completeTestSession({
      uid: user.uid,
      email: user.email ?? "",
      testType: `${testType}-${section}-diagnostic`,
      mode: "diagnostic",
      course,
      questions,
      answers,
      timeSpent,
      scaledScore: scaled,
    }).catch((err) => {
      console.error("completeTestSession failed:", err);
      setSaveError(true);
    });
  }, [user, questions, answers, testType, section]);

  const handleAnswer = (answer: string) => {
    setAnswers((prev) => ({ ...prev, [currentQ]: answer }));
  };

  const handleSubmit = () => {
    setSubmitted((prev) => ({ ...prev, [currentQ]: true }));
    setShowExplanations((prev) => ({ ...prev, [currentQ]: true }));
  };

  const handleToggleFlag = (idx: number) => {
    setFlagged((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const answeredSet = new Set(
    Object.entries(answers)
      .filter(([, v]) => v != null && v !== "")
      .map(([k]) => Number(k))
  );

  // Module-scoped navigator: remap indices to 0-based within current module
  const moduleNavigatorTotal = currentModuleQuestions.length;
  const moduleNavigatorCurrent = currentQ - moduleStartIdx;
  const moduleAnsweredSet = new Set(
    currentModuleQuestions
      .filter(({ i }) => answeredSet.has(i))
      .map(({ i }) => i - moduleStartIdx)
  );
  const moduleFlaggedSet = new Set(
    currentModuleQuestions
      .filter(({ i }) => flagged.has(i))
      .map(({ i }) => i - moduleStartIdx)
  );

  // Compute results
  const results = computeResults(questions, answers, domains);
  const scaledScore = computeScaledScore(testType, results.correct, results.total);
  const { min: scoreMin, max: scoreMax } = SCORE_RANGES[testType];

  // Strengths & Focus Areas
  const strengths: string[] = [];
  const focusAreas: string[] = [];
  for (const ds of results.domainStats) {
    const pct = ds.total > 0 ? ds.correct / ds.total : 0;
    if (pct >= 0.7) {
      strengths.push(ds.domain);
    } else {
      focusAreas.push(ds.domain);
    }
  }

  const accentColor = TEST_COLORS[testType];

  // ── Landing Screen ──
  if (screen === "landing") {
    return (
      <div className="min-h-screen bg-paper">
        <TopBar backHref="/home" backLabel="Home" />
        <div className="mx-auto max-w-2xl px-6 py-12">
          <div className="kicker mb-3">Diagnostic Test</div>
          <h1 className="mb-3 font-display text-4xl leading-tight text-ink sm:text-[2.6rem]">
            {title}
          </h1>
          <p className="mb-8 font-body text-base italic text-ink-2">
            Assess your current skill level to build a personalized study plan.
          </p>

          <GlassCard raised className="mb-6">
            <div className="grid grid-cols-1 gap-5 xs:grid-cols-2 sm:grid-cols-2">
              <div>
                <span className="kicker">Questions</span>
                <p className="mt-1 font-display text-2xl text-ink">
                  {questions.length > 0 ? questions.length : "~44"}
                </p>
              </div>
              <div>
                <span className="kicker">Time Limit</span>
                <p className="mt-1 font-display text-2xl leading-tight text-ink">
                  {section === "math" ? "70" : "64"}
                  <span className="ml-1 font-mono text-sm font-bold uppercase tracking-[0.14em] text-ink-3">
                    min
                  </span>
                  <span className="block font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-ink-3">
                    2 modules
                  </span>
                </p>
              </div>
              <div>
                <span className="kicker">Score Range</span>
                <p className="mt-1 font-display text-2xl text-ink">
                  {SCORE_RANGES[testType].min}&ndash;{SCORE_RANGES[testType].max}
                </p>
              </div>
              <div>
                <span className="kicker">Format</span>
                <p className="mt-1 font-display text-2xl text-ink">
                  {section === "math" ? "MC + SPR" : "MC"}
                </p>
              </div>
              <div>
                <span className="kicker">Domains</span>
                <p className="mt-1 font-display text-2xl text-ink">{domains.length}</p>
              </div>
            </div>
          </GlassCard>

          <div className="mb-6">
            <h3 className="mb-3 kicker">Domains Covered</h3>
            <div className="flex flex-wrap gap-2">
              {domains.map((d) => (
                <span
                  key={d}
                  className="border-2 border-ink bg-paper-card px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-ink"
                >
                  {d}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={handleStart}
              disabled={loading}
              className="border-2 border-ink bg-accent px-8 py-3 font-mono text-xs font-bold uppercase tracking-[0.14em] text-accent-fg transition-colors hover:bg-ink disabled:opacity-40"
            >
              {loading ? "Loading..." : "Start Diagnostic →"}
            </button>
            <button
              onClick={handleResume}
              className="border-2 border-ink bg-paper-card px-6 py-3 font-mono text-xs font-bold uppercase tracking-[0.14em] text-ink transition-colors hover:bg-ink hover:text-paper"
            >
              Resume Saved
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Test Screen ──
  if (screen === "test") {
    const q = questions[currentQ];

    if (!q) {
      return (
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-text-muted">Loading questions...</div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-paper">
        {/* Test Header */}
        <div className="sticky top-0 z-40 border-b-2 border-ink bg-paper-card px-6 py-3">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="font-display text-lg italic text-ink">{title}</span>
              {hasModules && (
                <span className="border-2 border-ink bg-paper px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-ink">
                  Mod {currentModule}/2
                </span>
              )}
              <ProgressBar
                current={currentQ - moduleStartIdx}
                total={moduleNavigatorTotal}
                className="w-48"
              />
            </div>
            <div className="flex items-center gap-3">
              {section === "math" && <ReferenceSheet />}
              <Timer
                key={timerKey}
                initialSeconds={timeMinutes * 60}
                onExpire={
                  hasModules && currentModule === 1 ? handleEndModule1 : handleFinish
                }
              />
              <button
                onClick={
                  hasModules && currentModule === 1 ? handleEndModule1 : handleFinish
                }
                className="border-2 border-ink bg-paper-card px-4 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-ink transition-colors hover:bg-ink hover:text-paper"
              >
                {hasModules && currentModule === 1 ? "End Module 1" : "Finish"}
              </button>
            </div>
          </div>
        </div>

        {/* Test Body */}
        <div className="mx-auto flex max-w-5xl gap-6 px-6 py-6">
          {/* Main Question */}
          <div className="flex-1">
            <GlassCard raised>
              <QuestionCard
                question={q}
                questionNumber={currentQ + 1}
                selectedAnswer={answers[currentQ]}
                onAnswer={handleAnswer}
                showExplanation={!!showExplanations[currentQ]}
                locked={!!submitted[currentQ]}
              />
            </GlassCard>

            {/* Navigation buttons */}
            <div className="mt-6 flex items-center justify-between">
              <button
                onClick={() => setCurrentQ((p) => Math.max(moduleStartIdx, p - 1))}
                disabled={currentQ === moduleStartIdx}
                className="border-2 border-ink bg-paper-card px-5 py-2.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-ink transition-colors hover:bg-ink hover:text-paper disabled:opacity-30"
              >
                ← Previous
              </button>

              <div className="flex gap-3">
                {!submitted[currentQ] && answers[currentQ] != null && (
                  <button
                    onClick={handleSubmit}
                    className="border-2 border-ink bg-ink px-5 py-2.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-paper transition-colors hover:bg-accent hover:text-accent-fg"
                  >
                    Submit
                  </button>
                )}

                {currentQ < moduleEndIdx ? (
                  <button
                    onClick={() => setCurrentQ((p) => Math.min(moduleEndIdx, p + 1))}
                    className="border-2 border-ink bg-accent px-5 py-2.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-accent-fg transition-colors hover:bg-ink"
                  >
                    Next →
                  </button>
                ) : hasModules && currentModule === 1 ? (
                  <button
                    onClick={handleEndModule1}
                    className="border-2 border-ink bg-accent px-5 py-2.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-accent-fg transition-colors hover:bg-ink"
                  >
                    End Module 1 →
                  </button>
                ) : (
                  <button
                    onClick={handleFinish}
                    className="border-2 border-ink bg-accent px-5 py-2.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-accent-fg transition-colors hover:bg-ink"
                  >
                    Finish Test →
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Side Navigator */}
          <div className="hidden w-64 shrink-0 lg:block">
            <div className="sticky top-20 border-2 border-ink bg-paper-card p-4">
              {hasModules && (
                <div className="mb-3 text-center kicker">
                  Module {currentModule} of 2
                </div>
              )}
              <QuestionNavigator
                total={moduleNavigatorTotal}
                current={moduleNavigatorCurrent}
                answered={moduleAnsweredSet}
                flagged={moduleFlaggedSet}
                onJump={(localIdx) => setCurrentQ(localIdx + moduleStartIdx)}
                onToggleFlag={(localIdx) => handleToggleFlag(localIdx + moduleStartIdx)}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Module Interstitial ──
  if (screen === "interstitial") {
    return (
      <div className="min-h-screen bg-paper">
        <TopBar backHref="/home" backLabel="Home" />
        <div className="mx-auto flex max-w-xl flex-col items-center px-6 py-24 text-center">
          <GlassCard raised className="w-full">
            <div className="kicker mb-3 text-green">Module 1 Complete</div>
            <h2 className="mb-3 font-display text-3xl leading-tight text-ink">
              End of <em className="text-accent not-italic">—</em> Module <span className="font-mono text-2xl font-bold">01</span>
            </h2>
            <p className="mb-8 font-body text-base italic text-ink-2">
              Great work. Take a moment to breathe, then begin Module 2. You will have{" "}
              <span className="font-mono not-italic text-ink">{timeMinutes}</span> minutes.
            </p>
            <button
              onClick={handleStartModule2}
              className="border-2 border-ink bg-accent px-8 py-3 font-mono text-xs font-bold uppercase tracking-[0.14em] text-accent-fg transition-colors hover:bg-ink"
            >
              Start Module 02 →
            </button>
          </GlassCard>
        </div>
      </div>
    );
  }

  // ── Results Screen ──
  return (
    <div className="min-h-screen bg-paper">
      <TopBar backHref="/home" backLabel="Home" />
      <div className="mx-auto max-w-3xl px-6 py-12">
        <div className="kicker mb-3 text-green">● Diagnostic Complete</div>
        <h1 className="mb-8 font-display text-[2.4rem] leading-tight text-ink">
          {title} <em className="text-accent">Results</em>
        </h1>

        {saveError && (
          <div className="mb-6 border-2 border-amber bg-amber-soft px-4 py-3 font-body text-sm italic text-ink">
            Your score couldn&apos;t be saved. Check your connection and try reloading if you need to review this session.
          </div>
        )}

        {/* Scaled Score — hero card */}
        <GlassCard raised className="mb-8 text-center">
          <div className="kicker mb-3">Your Score</div>
          <div className="font-display text-[5rem] font-bold leading-none text-ink">
            {scaledScore}
          </div>
          <div className="mt-2 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-ink-3">
            out of <span className="text-ink">{scoreMax}</span>
            <span className="mx-2 text-ink-4">·</span>
            range <span className="text-ink">{scoreMin}&ndash;{scoreMax}</span>
          </div>
        </GlassCard>

        {/* Raw Score */}
        <div className="mb-8 flex justify-center">
          <ScoreCircle correct={results.correct} total={results.total} label="Raw Score" />
        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid grid-cols-2 gap-0 border-2 border-ink sm:grid-cols-4">
          {[
            ["Correct", results.correct, "text-green"],
            ["Incorrect", results.total - results.correct - results.skipped, "text-accent"],
            ["Skipped", results.skipped, "text-ink-3"],
            ["Accuracy", `${results.percentage}%`, "text-ink"],
          ].map(([label, value, tone], i) => (
            <div
              key={label as string}
              className={`bg-paper-card p-5 text-center ${
                i > 0 ? "border-t-2 border-ink sm:border-l-2 sm:border-t-0" : ""
              }`}
            >
              <div className={`font-display text-3xl font-bold ${tone as string}`}>{value}</div>
              <div className="kicker mt-1">{label}</div>
            </div>
          ))}
        </div>

        {/* Strengths & Focus Areas */}
        {(strengths.length > 0 || focusAreas.length > 0) && (
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {strengths.length > 0 && (
              <div className="border-2 border-green bg-green-soft p-5">
                <h3 className="kicker mb-3 text-green">● Strengths</h3>
                <ul className="flex flex-col gap-2">
                  {strengths.map((d) => (
                    <li key={d} className="flex items-center gap-2 font-body text-sm text-ink">
                      <span className="h-2 w-2 shrink-0 bg-green" />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {focusAreas.length > 0 && (
              <div className="border-2 border-amber bg-amber-soft p-5">
                <h3 className="kicker mb-3 text-amber">● Focus Areas</h3>
                <ul className="flex flex-col gap-2">
                  {focusAreas.map((d) => (
                    <li key={d} className="flex items-center gap-2 font-body text-sm text-ink">
                      <span className="h-2 w-2 shrink-0 bg-amber" />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Domain Breakdown */}
        <GlassCard className="mb-8">
          <h3 className="mb-4 kicker">Performance by Domain</h3>
          <DomainBreakdown stats={results.domainStats} />
        </GlassCard>

        {/* Weak Skills CTA — Spec F */}
        <WeakSkillsCallout
          course={`${testType}-${section}`}
          accentColor={accentColor}
          results={questions.map((q, i) => ({
            skill: q.skill,
            correct: isCorrect(q, answers[i]),
          }))}
        />

        {/* Post-Test Reflection */}
        <div className="mb-8 border-2 border-ink bg-paper-card p-6">
          <div className="mb-5 kicker">● Post-Test Reflection</div>
          <div className="flex flex-col gap-5">
            {(REFLECTION_PROMPTS[`${testType}-${section}`] ?? []).map((prompt, idx) => (
              <div key={idx}>
                <label className="mb-2 block font-body text-sm italic text-ink-2">
                  {prompt}
                </label>
                <textarea
                  value={reflections[idx] ?? ""}
                  onChange={(e) =>
                    setReflections((prev) => ({ ...prev, [idx]: e.target.value }))
                  }
                  rows={2}
                  className="w-full resize-y border-2 border-rule-hair bg-paper px-3 py-2 font-body text-sm text-ink outline-none transition-colors focus:border-ink focus:shadow-[3px_3px_0_var(--color-ink)]"
                  placeholder="Type your reflection..."
                />
              </div>
            ))}
          </div>
        </div>

        {/* Question Review */}
        <GlassCard>
          <h3 className="mb-4 kicker">Question Review</h3>
          <div className="flex flex-col gap-6">
            {questions.map((q, i) => (
              <div
                key={q.id}
                className="border-t-2 border-rule-hair pt-5 first:border-0 first:pt-0"
              >
                <QuestionCard
                  question={q}
                  questionNumber={i + 1}
                  selectedAnswer={answers[i]}
                  onAnswer={() => {}}
                  showExplanation={true}
                  locked={true}
                />
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Actions */}
        <div className="mt-8 flex justify-center gap-3">
          <a
            href="/home"
            className="border-2 border-ink bg-paper-card px-6 py-3 font-mono text-xs font-bold uppercase tracking-[0.14em] text-ink transition-colors hover:bg-ink hover:text-paper"
          >
            ← Home
          </a>
          <button
            onClick={() => {
              setScreen("landing");
              setAnswers({});
              setSubmitted({});
              setShowExplanations({});
              setFlagged(new Set());
              setCurrentQ(0);
              setCurrentModule(1);
              setTimerKey((k) => k + 1);
            }}
            className="border-2 border-ink bg-accent px-6 py-3 font-mono text-xs font-bold uppercase tracking-[0.14em] text-accent-fg transition-colors hover:bg-ink"
          >
            Retake Diagnostic →
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Helpers ──

function isCorrect(question: Question, answer?: string): boolean {
  if (!answer) return false;
  if (question.type === "mc") return answer === question.correctAnswer;
  // SPR
  const a = parseFloat(answer.trim());
  const c = parseFloat(question.correctAnswer.trim());
  if (isNaN(a) || isNaN(c)) {
    return answer.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase();
  }
  return Math.abs(a - c) < 0.01;
}

function computeResults(
  questions: Question[],
  answers: Record<number, string>,
  domains: string[]
) {
  let correct = 0;
  let skipped = 0;
  const domainMap: Record<string, { correct: number; total: number }> = {};

  for (const d of domains) {
    domainMap[d] = { correct: 0, total: 0 };
  }

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    const d = q.domain;
    if (!domainMap[d]) domainMap[d] = { correct: 0, total: 0 };
    domainMap[d].total++;

    const ans = answers[i];
    if (!ans) {
      skipped++;
      continue;
    }
    if (isCorrect(q, ans)) {
      correct++;
      domainMap[d].correct++;
    }
  }

  const total = questions.length;
  const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;

  const domainStats = Object.entries(domainMap).map(([domain, s]) => ({
    domain,
    correct: s.correct,
    total: s.total,
  }));

  return { correct, total, skipped, percentage, domainStats };
}
