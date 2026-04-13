// Drop-in integration for existing PantherPrep modules.
//
// USAGE:
// 1. Call adaptiveBridge.init(uid, course, moduleId) when the module loads
// 2. Call adaptiveBridge.startQuestion() when a new question is displayed
// 3. Call adaptiveBridge.recordAnswer({...}) after each question is answered
// 4. Call adaptiveBridge.finishSession() when the student completes the module

import { logAnswerBatch, type AnswerData } from "./performance-service";
import { recomputeProfile } from "./adaptive-engine";

class AdaptiveBridge {
  uid: string | null = null;
  course: string | null = null;
  moduleId: string | null = null;
  sessionId: string | null = null;
  answers: AnswerData[] = [];
  startTime: number | null = null;
  questionStartTime: number | null = null;
  initialized = false;

  init(uid: string, course: string, moduleId: string) {
    this.uid = uid;
    this.course = course;
    this.moduleId = moduleId;
    this.sessionId = `${moduleId}_${Date.now()}`;
    this.answers = [];
    this.startTime = Date.now();
    this.questionStartTime = Date.now();
    this.initialized = true;
  }

  startQuestion() {
    this.questionStartTime = Date.now();
  }

  recordAnswer(data: {
    questionId?: string;
    domain?: string;
    skill?: string;
    difficulty?: "F" | "M" | "C";
    correct: boolean;
    selectedAnswer?: string;
    correctAnswer?: string;
    errorCode?: string;
    errorCategory?: string;
    stem?: string;
    choices?: { key: string; text: string }[];
    explanation?: string;
    testSessionId?: string;
  }) {
    if (!this.initialized) {
      console.warn("[Adaptive] Not initialized. Call init() first.");
      return null;
    }

    const timeSpent = this.questionStartTime
      ? Math.round((Date.now() - this.questionStartTime) / 1000)
      : 0;

    const answer: AnswerData = {
      questionId: data.questionId || `${this.moduleId}_q${this.answers.length + 1}`,
      moduleId: this.moduleId!,
      course: this.course!,
      domain: data.domain || "Unknown",
      skill: data.skill || "unknown",
      difficulty: data.difficulty || "M",
      correct: !!data.correct,
      selectedAnswer: data.selectedAnswer || "",
      correctAnswer: data.correctAnswer || "",
      errorCode: data.errorCode || null,
      errorCategory: data.errorCategory || this._inferErrorCategory(data),
      timeSpent,
      sessionId: this.sessionId!,
      stem: data.stem || "",
      choices: data.choices || [],
      explanation: data.explanation || "",
      testSessionId: data.testSessionId || "",
    };

    this.answers.push(answer);
    this.questionStartTime = Date.now();
    return answer;
  }

  _inferErrorCategory(data: { correct: boolean; errorCode?: string; timeSpent?: number }): string | null {
    if (data.correct) return null;

    const codeMap: Record<string, string> = {
      SIGN_ERROR: "careless",
      WRONG_METHOD: "strategy_gap",
      MISREAD: "misread_trap",
      TRAP: "misread_trap",
      TIME_PRESSURE: "time_pressure",
      CALCULATION: "careless",
      CONCEPT: "content_gap",
      FORMULA: "content_gap",
      VOCAB: "content_gap",
      SCOPE: "misread_trap",
      REVERSAL: "misread_trap",
      PARTIAL: "misread_trap",
      GRAMMAR: "content_gap",
      RUSHED: "time_pressure",
    };

    if (data.errorCode && codeMap[data.errorCode]) {
      return codeMap[data.errorCode];
    }

    if (data.timeSpent !== undefined && data.timeSpent < 10) {
      return "time_pressure";
    }

    return "content_gap";
  }

  async finishSession(): Promise<{ answerCount: number; profile: Awaited<ReturnType<typeof recomputeProfile>> }> {
    if (!this.initialized || !this.uid) {
      console.warn("[Adaptive] Cannot finish — not initialized or no UID.");
      return { answerCount: 0, profile: null };
    }

    let answerCount = 0;
    let profile: Awaited<ReturnType<typeof recomputeProfile>> = null;

    try {
      if (this.answers.length > 0) {
        answerCount = await logAnswerBatch(this.uid, this.answers);
      }
      profile = await recomputeProfile(this.uid);
    } catch (e) {
      console.warn("[Adaptive] finishSession error:", e);
    }

    this.answers = [];
    this.initialized = false;

    return { answerCount, profile };
  }

  getSessionStats() {
    const total = this.answers.length;
    const correct = this.answers.filter((a) => a.correct).length;
    const elapsed = this.startTime ? Math.round((Date.now() - this.startTime) / 1000) : 0;

    const byDomain: Record<string, { correct: number; total: number }> = {};
    for (const a of this.answers) {
      if (!byDomain[a.domain]) byDomain[a.domain] = { correct: 0, total: 0 };
      byDomain[a.domain].total++;
      if (a.correct) byDomain[a.domain].correct++;
    }

    return { total, correct, pct: total > 0 ? Math.round((correct / total) * 100) : 0, elapsed, byDomain };
  }
}

// Singleton instance
const adaptiveBridge = new AdaptiveBridge();
export default adaptiveBridge;

// ============================================================
// SKILL MAP — maps shorthand keys to canonical skill taxonomy keys
// ============================================================

export const SKILL_MAP: Record<string, string> = {
  linear_eq: "linear_equations",
  linear_ineq: "linear_inequalities",
  systems: "systems_of_equations",
  quadratic: "quadratic_equations",
  quad_formula: "quadratic_formula",
  polynomial: "polynomial_operations",
  exponential: "exponential_functions",
  radical: "radical_equations",
  rational: "rational_expressions",
  ratio: "ratios_rates",
  percent: "percentages",
  scatter: "scatterplots",
  regression: "linear_regression",
  prob: "probability",
  mean_med: "statistics_central_tendency",
  spread: "statistics_spread",
  two_way: "two_way_tables",
  ev: "expected_value",
  area: "area_perimeter",
  volume: "volume",
  triangle: "triangles",
  circle: "circles",
  coord: "coordinate_geometry",
  trig: "right_triangle_trig",
  central: "central_ideas",
  evidence: "details_evidence",
  inference: "inferences",
  quant_ev: "quantitative_evidence",
  text_struct: "text_structure",
  vocab: "vocabulary_in_context",
  purpose: "purpose_function",
  cross_text: "cross_text_connections",
  pov: "point_of_view",
  transition: "transitions",
  rhet_synth: "rhetorical_synthesis",
  org: "organization",
  sva: "subject_verb_agreement",
  pronoun: "pronoun_clarity",
  modifier: "modifiers",
  parallel: "parallelism",
  tense: "verb_tense",
  boundary: "punctuation_boundaries",
  comma: "comma_usage",
  colon: "colon_usage",
  possessive: "possessives",
};

export function mapSkill(moduleSkillId: string): string {
  return SKILL_MAP[moduleSkillId] || moduleSkillId;
}

export const ERROR_CATEGORIES = [
  { key: "content_gap", label: "Content Gap", description: "I didn't know the concept or rule" },
  { key: "careless", label: "Careless Error", description: "I knew it but made a silly mistake" },
  { key: "time_pressure", label: "Time Pressure", description: "I ran out of time or rushed" },
  { key: "misread_trap", label: "Misread / Trap", description: "I fell for a trick or misread the question" },
  { key: "strategy_gap", label: "Strategy Gap", description: "I used the wrong approach or method" },
] as const;
