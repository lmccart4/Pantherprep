"use client";

/* ================================================================
   Campus Press — QuestionCard
   Replaces components/test/question-card.tsx
   ----------------------------------------------------------------
   Same props, same behavior, same KaTeX rendering. Visual surface
   rewritten to match the prototype's editorial grammar:

   - Pill difficulty badges → italic display number + "DIFFICULTY N / 5"
     running head
   - Rounded glass card → flat paper card with hard ink rule
   - Round answer letter circles → square letter boxes with ink border
   - Selected state → inverted ink block instead of soft-red chip
   - Elimination affordance added (new; not in original)
     Hover any answer to see the ⌫ button; toggles .eliminated state.
   - Explanation "correct/incorrect" box → stamped result ribbon
     (DELIVERED-style) with dashed rule separator.

   IMPLEMENTATION NOTES FOR CLAUDE CODE:
   - This file does not add new data — eliminated state is purely
     local UI. If you want to persist it across refreshes, lift to
     PracticeRunner state (same as `flagged`) and thread it through.
   - `cn` and `renderMath` imports unchanged from before.
   - No framer-motion needed here. Transitions are CSS only.
   ================================================================ */

import { useState } from "react";
import { renderMath } from "@/lib/katex-render";
import { cn } from "@/lib/utils";
import type { Question } from "@/types/question";

interface QuestionCardProps {
  question: Question;
  selectedAnswer?: string;
  onAnswer: (answer: string) => void;
  showExplanation: boolean;
  locked: boolean;
  questionNumber: number;
}

const OPTION_LETTERS = ["A", "B", "C", "D"] as const;

export function QuestionCard({
  question,
  selectedAnswer,
  onAnswer,
  showExplanation,
  locked,
  questionNumber,
}: QuestionCardProps) {
  const [sprInput, setSprInput] = useState("");
  const [passageExpanded, setPassageExpanded] = useState(true);
  const [eliminated, setEliminated] = useState<Set<string>>(new Set());

  const toggleEliminated = (letter: string) => {
    if (locked) return;
    setEliminated((prev) => {
      const next = new Set(prev);
      if (next.has(letter)) next.delete(letter);
      else next.add(letter);
      return next;
    });
  };

  const isCorrect =
    selectedAnswer != null &&
    (question.type === "mc"
      ? selectedAnswer === question.correctAnswer
      : checkSPRMatch(selectedAnswer, question.correctAnswer));

  const difficultyNum =
    question.difficulty === "easy" ? 2 : question.difficulty === "medium" ? 3 : 4;

  return (
    <div className="flex flex-col gap-6">
      {/* ── Kicker row: replaces the old badge pill cluster ── */}
      <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-rule-hair pb-3">
        <div className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-ink-3">
          <span className="text-ink">
            Question {String(questionNumber).padStart(2, "0")}
          </span>
          <span className="mx-2 text-ink-4">·</span>
          <span>{question.domain}</span>
          <span className="mx-2 text-ink-4">·</span>
          <span>{question.type === "mc" ? "Multiple Choice" : "Student Response"}</span>
        </div>
        <div className={cn(
          "font-mono text-[10px] font-bold uppercase tracking-[0.16em]",
          difficultyNum <= 2 ? "text-green" : difficultyNum >= 4 ? "text-accent" : "text-amber"
        )}>
          <span className="inline-block translate-y-[1px]">●</span>{" "}
          {question.difficulty} · Difficulty {difficultyNum} / 5
        </div>
      </div>

      {/* ── Passage (reading mode) ── */}
      {question.passage && (
        <article className="border border-ink bg-paper-2 p-5">
          <header className="mb-3 flex items-baseline justify-between border-b border-dashed border-rule-hair pb-2">
            <button
              onClick={() => setPassageExpanded(!passageExpanded)}
              className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-ink-3 hover:text-accent"
            >
              Passage {passageExpanded ? "—" : "+"}
            </button>
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-amber">
              ● Highlight mode
            </span>
          </header>
          {passageExpanded && (
            <div className="font-body text-[16px] leading-[1.62] text-ink">
              {renderMath(question.passage)}
            </div>
          )}
        </article>
      )}

      {/* ── Stem ── */}
      <div className="font-body text-[clamp(22px,2vw,28px)] leading-[1.35] text-ink">
        <span className="mr-2 align-baseline font-mono text-sm font-bold text-ink-3">
          {questionNumber}.
        </span>
        {renderMath(question.stem)}
      </div>

      {/* ── MC answer choices ── */}
      {question.type === "mc" && question.options && (
        <div className="flex flex-col gap-2">
          {question.options.map((opt, i) => {
            const letter = OPTION_LETTERS[i];
            const isSelected = selectedAnswer === letter;
            const isCorrectOption = letter === question.correctAnswer;
            const isElim = eliminated.has(letter);
            const showResult = showExplanation && locked;

            return (
              <div key={letter} className="group relative">
                <button
                  onClick={() => !locked && !isElim && onAnswer(letter)}
                  disabled={locked}
                  role="radio"
                  aria-checked={isSelected}
                  tabIndex={0}
                  className={cn(
                    "flex w-full items-center gap-4 border-2 px-4 py-3 text-left transition-colors",
                    // Default (not locked, not selected)
                    !showResult && !isSelected && !isElim && "border-rule-hair bg-paper-card hover:border-ink",
                    // Selected (not locked)
                    !showResult && isSelected && "border-ink bg-ink text-paper",
                    // Eliminated — only shown when not locked
                    !showResult && isElim && "border-rule-hair bg-paper-card opacity-45",
                    // Locked + correct
                    showResult && isCorrectOption && "border-green bg-green-soft",
                    // Locked + user's wrong pick
                    showResult && isSelected && !isCorrectOption && "border-accent bg-accent-soft",
                    // Locked + unrelated option
                    showResult && !isSelected && !isCorrectOption && "border-rule-hair bg-paper-card opacity-55",
                    locked && "cursor-default"
                  )}
                >
                  <span
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center border-2 font-mono text-sm font-bold",
                      !showResult && !isSelected && "border-ink text-ink bg-paper-card",
                      !showResult && isSelected && "border-paper bg-paper text-ink",
                      showResult && isCorrectOption && "border-green text-green bg-paper-card",
                      showResult && isSelected && !isCorrectOption && "border-accent text-accent bg-paper-card"
                    )}
                  >
                    {letter}
                  </span>
                  <span className={cn(
                    "flex-1 font-body text-[17px] leading-snug",
                    isElim && "line-through decoration-2 decoration-accent"
                  )}>
                    {renderMath(opt)}
                  </span>
                </button>

                {/* Eliminate toggle — not shown when locked or result is visible */}
                {!locked && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleEliminated(letter);
                    }}
                    aria-label={isElim ? `Restore ${letter}` : `Eliminate ${letter}`}
                    className={cn(
                      "absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center border border-rule-hair bg-paper font-mono text-sm font-bold transition-opacity",
                      isElim
                        ? "border-accent bg-accent text-paper opacity-100"
                        : "text-ink-3 opacity-0 hover:border-accent hover:text-accent group-hover:opacity-100"
                    )}
                  >
                    {isElim ? "↺" : "⌫"}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── SPR input ── */}
      {question.type === "spr" && (
        <div className="flex items-center gap-4">
          <input
            type="text"
            value={locked ? (selectedAnswer ?? "") : sprInput}
            onChange={(e) => {
              if (!locked) {
                setSprInput(e.target.value);
                onAnswer(e.target.value);
              }
            }}
            disabled={locked}
            placeholder="Enter your answer"
            className={cn(
              "w-56 border-2 bg-paper-card px-4 py-2.5 font-display text-[22px] italic text-ink outline-none transition-colors",
              !locked && "border-rule-hair focus:border-ink",
              locked && isCorrect && "border-green bg-green-soft",
              locked && !isCorrect && "border-accent bg-accent-soft"
            )}
          />
          {showExplanation && locked && (
            <span className="font-body text-sm italic text-ink-3">
              Correct answer:{" "}
              <span className="font-display text-[17px] not-italic font-bold text-green">
                {question.correctAnswer}
              </span>
            </span>
          )}
        </div>
      )}

      {/* ── Explanation ── */}
      {showExplanation && (
        <div className={cn(
          "border-2 bg-paper-card p-5 relative",
          isCorrect ? "border-green" : "border-accent"
        )}>
          <div
            className={cn("stamp absolute -top-3 right-4", isCorrect ? "stamp-green" : "stamp-red")}
          >
            {isCorrect ? "Correct" : "Try again"}
          </div>
          <div className="font-mono mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-accent">
            Why
          </div>
          <div className="font-body text-[15px] leading-[1.6] italic text-ink-2">
            {question.explanations && selectedAnswer && question.explanations[selectedAnswer]
              ? renderMath(question.explanations[selectedAnswer])
              : renderMath(question.explanation)}
          </div>
        </div>
      )}
    </div>
  );
}

function checkSPRMatch(userAnswer: string, correct: string): boolean {
  if (!userAnswer) return false;
  const a = parseFloat(userAnswer.trim());
  const c = parseFloat(correct.trim());
  if (isNaN(a) || isNaN(c)) {
    return userAnswer.trim().toLowerCase() === correct.trim().toLowerCase();
  }
  return Math.abs(a - c) < 0.01;
}
