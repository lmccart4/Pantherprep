// Firestore service layer for the PantherPrep Adaptive Engine
// Handles all reads/writes to performanceLog, adaptiveProfile, and questionPool

import {
  doc,
  setDoc,
  getDoc,
  getDocs,
  addDoc,
  collection,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  writeBatch,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

// ============================================================
// PERFORMANCE LOG — granular per-answer tracking
// ============================================================

export interface AnswerData {
  questionId: string;
  moduleId: string;
  course: string;
  domain: string;
  skill: string;
  difficulty?: "F" | "M" | "C";
  correct: boolean;
  selectedAnswer: string;
  correctAnswer: string;
  errorCode?: string | null;
  errorCategory?: string | null;
  timeSpent?: number;
  sessionId?: string;

  // Snapshot fields — let us render this answer later without the original question registry
  stem: string;
  choices: { key: string; text: string }[];
  explanation: string;
  testSessionId: string;
}

export async function logAnswer(uid: string, answer: AnswerData): Promise<string | null> {
  if (!uid) return null;
  try {
    const ref = collection(db, "performanceLog", uid, "answers");
    const docRef = await addDoc(ref, {
      uid,
      questionId: answer.questionId,
      moduleId: answer.moduleId,
      course: answer.course,
      domain: answer.domain,
      skill: answer.skill,
      difficulty: answer.difficulty || "M",
      correct: answer.correct,
      selectedAnswer: answer.selectedAnswer || "",
      correctAnswer: answer.correctAnswer || "",
      errorCode: answer.errorCode || null,
      errorCategory: answer.errorCategory || null,
      timeSpent: answer.timeSpent || 0,
      timestamp: serverTimestamp(),
      sessionId: answer.sessionId || "",
      stem: answer.stem || "",
      choices: answer.choices || [],
      explanation: answer.explanation || "",
      testSessionId: answer.testSessionId || "",
    });
    return docRef.id;
  } catch (e) {
    console.warn("logAnswer error:", e);
    return null;
  }
}

export async function logAnswerBatch(
  uid: string,
  answers: AnswerData[],
  opts: { overrideTimestamp?: Timestamp } = {}
): Promise<number> {
  if (!uid || !answers.length) return 0;
  try {
    const batch = writeBatch(db);
    const colRef = collection(db, "performanceLog", uid, "answers");
    const ts = opts.overrideTimestamp ?? Timestamp.now();
    let count = 0;

    for (const answer of answers) {
      const docRef = doc(colRef);
      batch.set(docRef, {
        uid,
        questionId: answer.questionId,
        moduleId: answer.moduleId,
        course: answer.course,
        domain: answer.domain,
        skill: answer.skill,
        difficulty: answer.difficulty || "M",
        correct: answer.correct,
        selectedAnswer: answer.selectedAnswer || "",
        correctAnswer: answer.correctAnswer || "",
        errorCode: answer.errorCode || null,
        errorCategory: answer.errorCategory || null,
        timeSpent: answer.timeSpent || 0,
        timestamp: ts,
        sessionId: answer.sessionId || "",
        stem: answer.stem || "",
        choices: answer.choices || [],
        explanation: answer.explanation || "",
        testSessionId: answer.testSessionId || "",
      });
      count++;
    }

    await batch.commit();
    return count;
  } catch (e) {
    console.warn("logAnswerBatch error:", e);
    return 0;
  }
}

export interface StoredAnswer extends AnswerData {
  id: string;
  uid: string;
  timestamp: Timestamp;
}

export async function getRecentAnswers(uid: string, limitN = 100): Promise<StoredAnswer[]> {
  if (!uid) return [];
  try {
    const q = query(
      collection(db, "performanceLog", uid, "answers"),
      orderBy("timestamp", "desc"),
      limit(limitN)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as StoredAnswer));
  } catch (e) {
    console.warn("getRecentAnswers error:", e);
    return [];
  }
}

export async function getAnswersByCourse(
  uid: string,
  course: string,
  filters: { domain?: string; skill?: string } = {}
): Promise<StoredAnswer[]> {
  if (!uid) return [];
  try {
    const q = query(
      collection(db, "performanceLog", uid, "answers"),
      where("course", "==", course),
      orderBy("timestamp", "desc"),
      limit(500)
    );
    const snap = await getDocs(q);
    let results = snap.docs.map((d) => ({ id: d.id, ...d.data() } as StoredAnswer));

    if (filters.domain) {
      results = results.filter((r) => r.domain === filters.domain);
    }
    if (filters.skill) {
      results = results.filter((r) => r.skill === filters.skill);
    }
    return results;
  } catch (e) {
    console.warn("getAnswersByCourse error:", e);
    return [];
  }
}

// ============================================================
// ADAPTIVE PROFILE — computed mastery state per student
// ============================================================

export interface SkillData {
  correct: number;
  total: number;
  mastery: number;
  ease: number;
  interval: number;
  nextReview: string;
  lastSeen: Timestamp | null;
  errorPatterns: Record<string, number>;
}

export interface DomainData {
  mastery: number;
  totalCorrect: number;
  totalAnswers: number;
  weakestSkills: string[];
  strongestSkills: string[];
}

export interface Recommendation {
  skill: string;
  domain: string;
  reason: string;
  priority: number;
  suggestedDifficulty: "F" | "M" | "C";
  questionCount: number;
}

export interface WeeklyStats {
  answersThisWeek: number;
  correctThisWeek: number;
  sessionsThisWeek: number;
  dominantErrorCategory: string | null;
  improvingDomains: string[];
  decliningDomains: string[];
}

export interface AdaptiveProfile {
  uid: string;
  lastUpdated?: Timestamp;
  totalAnswers: number;
  totalCorrect: number;
  streakDays: number;
  lastActiveDate: string;
  skills: Record<string, SkillData>;
  domains: Record<string, DomainData>;
  recommendations: Recommendation[];
  weeklyStats: WeeklyStats;
}

export async function getAdaptiveProfile(uid: string): Promise<AdaptiveProfile | null> {
  if (!uid) return null;
  try {
    const snap = await getDoc(doc(db, "adaptiveProfile", uid));
    return snap.exists() ? ({ uid, ...snap.data() } as AdaptiveProfile) : null;
  } catch (e) {
    console.warn("getAdaptiveProfile error:", e);
    return null;
  }
}

export async function saveAdaptiveProfile(uid: string, profile: Partial<AdaptiveProfile>): Promise<boolean> {
  if (!uid) return false;
  try {
    await setDoc(
      doc(db, "adaptiveProfile", uid),
      {
        ...profile,
        uid,
        lastUpdated: serverTimestamp(),
      },
      { merge: true }
    );
    return true;
  } catch (e) {
    console.warn("saveAdaptiveProfile error:", e);
    return false;
  }
}

export async function getAllAdaptiveProfiles(uids?: string[]): Promise<AdaptiveProfile[]> {
  try {
    // If specific UIDs are provided, fetch only those documents (avoids full collection scan)
    if (uids && uids.length > 0) {
      const results = await Promise.all(
        uids.map((uid) => getDoc(doc(db, "adaptiveProfile", uid)))
      );
      return results
        .filter((d) => d.exists())
        .map((d) => ({ uid: d.id, ...d.data() } as AdaptiveProfile));
    }
    // Fall back to bounded collection scan (max 200 docs)
    const q = query(collection(db, "adaptiveProfile"), limit(200));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ uid: d.id, ...d.data() } as AdaptiveProfile));
  } catch (e) {
    console.warn("getAllAdaptiveProfiles error:", e);
    return [];
  }
}

// ============================================================
// QUESTION POOL
// ============================================================

export interface PoolQuestion {
  id: string;
  course: string;
  moduleId: string;
  domain: string;
  skill: string;
  difficulty: "F" | "M" | "C";
  questionText: string;
  choices: { key: string; text: string }[];
  correctAnswer: string;
  explanation: string;
  trapType?: string | null;
  tags?: string[];
  katex?: boolean;
}

export async function getQuestions(criteria: {
  course: string;
  domain?: string;
  skill?: string;
  difficulty?: string;
  limit?: number;
}): Promise<PoolQuestion[]> {
  try {
    const constraints = [where("course", "==", criteria.course)];
    if (criteria.domain) constraints.push(where("domain", "==", criteria.domain));
    if (criteria.skill) constraints.push(where("skill", "==", criteria.skill));
    if (criteria.difficulty) constraints.push(where("difficulty", "==", criteria.difficulty));

    const q = query(
      collection(db, "questionPool"),
      ...constraints,
      limit(criteria.limit || 50)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as PoolQuestion));
  } catch (e) {
    console.warn("getQuestions error:", e);
    return [];
  }
}

// ============================================================
// UTILITY HELPERS
// ============================================================

export function todayISO(): string {
  return new Date().toISOString().split("T")[0];
}

export function daysBetween(dateA: string, dateB: string): number {
  const a = new Date(dateA);
  const b = new Date(dateB);
  return Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
}
