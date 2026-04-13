// Pure helpers for turning a Question + student answer into an AnswerData row.
// No Firebase imports — safe to consume from both client and admin contexts.

import type { Question } from "@/types/question";

/**
 * Map the page-level Question.difficulty ("easy"|"medium"|"hard")
 * to the adaptive engine difficulty code ("F"|"M"|"C").
 */
export function mapDifficulty(d: Question["difficulty"]): "F" | "M" | "C" {
  if (d === "easy") return "F";
  if (d === "hard") return "C";
  return "M";
}

/**
 * Convert options: string[] into the {key, text}[] shape the adaptive engine
 * stores. Uses letter keys A, B, C, D... For student-produced-response (SPR)
 * questions the options array is typically empty or ["","","",""] — we return
 * an empty array so the review UI knows it was a free-response.
 */
export function normalizeChoices(q: Question): { key: string; text: string }[] {
  if (q.type === "spr") return [];
  if (!q.options) return [];
  const keys = ["A", "B", "C", "D", "E", "F"];
  return q.options
    .map((text, i) => ({ key: keys[i] ?? String(i), text }))
    .filter((c) => c.text !== "");
}

/**
 * Check whether a given answer matches the correct answer for the question.
 * Kept in sync with isCorrect() in diagnostic-test.tsx so both paths agree.
 */
export function isCorrect(q: Question, answer: string | undefined): boolean {
  if (answer == null || answer === "") return false;
  const ca = q.correctAnswer.trim();
  const ua = answer.trim();
  if (q.type === "spr") {
    // Numeric-ish comparison for grid-in responses
    const an = parseFloat(ua);
    const cn = parseFloat(ca);
    if (!isNaN(an) && !isNaN(cn)) return Math.abs(an - cn) < 1e-9;
    return ua.toLowerCase() === ca.toLowerCase();
  }
  return ua.toUpperCase() === ca.toUpperCase();
}
