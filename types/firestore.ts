import type { Timestamp } from "firebase/firestore";

export interface StudentProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  xp: number;
  level: number;
  streak: number;
  lastActiveDate?: string;
  badges: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Session {
  uid: string;
  email: string;
  testType: string;
  domain?: string;
  mode: string;
  score: number;
  total: number;
  percentage: number;
  scaledScore?: number;
  timeSpent: number;
  testSessionId?: string; // NEW — joins to performanceLog answers
  createdAt: Timestamp;
  // Legacy: older session docs include `answers: SessionAnswer[]`.
  // New writes do not populate this field. Readers ignore it.
  answers?: SessionAnswer[];
}

export interface SessionAnswer {
  questionId: string;
  correct: boolean;
  userAnswer: string;
  timeSpent?: number;
}

export interface QuestionStats {
  questionId: string;
  totalAttempts: number;
  correctCount: number;
  incorrectCount: number;
  lastAttempted: Timestamp;
}

export interface ProgressDoc {
  uid: string;
  key: string;
  state: Record<string, unknown>;
  updatedAt: Timestamp;
}

export interface ClassDoc {
  code: string;
  name: string;
  teacherUid: string;
  teacherEmail: string;
  teacherName: string;
  students: string[];
  createdAt: Timestamp;
}

export interface CustomQuestion {
  id?: string;
  testType: string;
  domain: string;
  difficulty: string;
  type: "mc" | "gridin";
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  skill?: string;
  createdBy: string;
  createdAt: Timestamp;
}
