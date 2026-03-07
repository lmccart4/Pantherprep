import {
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Question, TestType, Section, QuestionFilter } from "@/types/question";

const cache = new Map<string, Question[]>();

function cacheKey(testType: TestType, section: Section, extra?: string): string {
  return `${testType}-${section}${extra ? `-${extra}` : ""}`;
}

async function fetchQuestions(
  testType: TestType,
  section: Section,
  filters?: QuestionFilter
): Promise<Question[]> {
  const constraints = [
    where("testType", "==", testType),
    where("section", "==", section),
  ];

  if (filters?.domain) constraints.push(where("domain", "==", filters.domain));
  if (filters?.difficulty) constraints.push(where("difficulty", "==", filters.difficulty));
  if (filters?.type) constraints.push(where("type", "==", filters.type));
  if (filters?.module != null) constraints.push(where("module", "==", filters.module));

  const q = query(collection(db, "questions"), ...constraints);
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Question));
}

export async function getQuestions(
  testType: TestType,
  section: Section,
  filters?: QuestionFilter
): Promise<Question[]> {
  const key = cacheKey(testType, section, JSON.stringify(filters ?? {}));
  if (cache.has(key)) return cache.get(key)!;
  const questions = await fetchQuestions(testType, section, filters);
  cache.set(key, questions);
  return questions;
}

export async function getDiagnosticQuestions(
  testType: TestType,
  section: Section
): Promise<Question[]> {
  const key = cacheKey(testType, section, "diag");
  if (cache.has(key)) return cache.get(key)!;

  const q = query(
    collection(db, "questions"),
    where("testType", "==", testType),
    where("section", "==", section),
    where("tags", "array-contains", "diagnostic")
  );
  const snap = await getDocs(q);
  const questions = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Question));
  cache.set(key, questions);
  return questions;
}

async function fetchPracticeSection(
  testType: TestType,
  section: Section
): Promise<Question[]> {
  const key = cacheKey(testType, section, "practice");
  if (cache.has(key)) return cache.get(key)!;

  const q = query(
    collection(db, "questions"),
    where("testType", "==", testType),
    where("section", "==", section),
    where("tags", "array-contains", "practice-test")
  );
  const snap = await getDocs(q);
  const questions = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Question));
  cache.set(key, questions);
  return questions;
}

export async function getPracticeTestQuestions(
  testType: TestType
): Promise<{ rw: Question[]; math: Question[] }> {
  const [rw, math] = await Promise.all([
    fetchPracticeSection(testType, "rw"),
    fetchPracticeSection(testType, "math"),
  ]);
  return { rw, math };
}

export async function getModuleQuestions(
  testType: TestType,
  section: Section,
  moduleNum: number
): Promise<Question[]> {
  const key = cacheKey(testType, section, `mod${moduleNum}`);
  if (cache.has(key)) return cache.get(key)!;

  const q = query(
    collection(db, "questions"),
    where("testType", "==", testType),
    where("section", "==", section),
    where("module", "==", moduleNum)
  );
  const snap = await getDocs(q);
  const questions = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Question));
  cache.set(key, questions);
  return questions;
}

export function clearQuestionCache(): void {
  cache.clear();
}

export function checkSPRAnswer(userAnswer: string, correctAnswer: string): boolean {
  if (!userAnswer) return false;
  const a = parseFloat(userAnswer.trim());
  const c = parseFloat(correctAnswer.trim());
  if (isNaN(a) || isNaN(c)) {
    return userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
  }
  return Math.abs(a - c) < 0.01;
}
