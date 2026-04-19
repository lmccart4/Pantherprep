import type { Timestamp } from "firebase/firestore";

export type StudyPlanStatus = "active" | "archived" | "paused";
export type StudyPlanMode = "normal" | "cramming";

export interface SkillQueueEntry {
  skill: string;
  assignedWeek: number;
  targetMastery: number;
}

export interface TodaysSet {
  skill: string;
  course: string;
  targetCount: number;
  estMinutes: number;
}

export interface StudyPlan {
  uid: string;
  course: string;
  testDate: Timestamp;
  createdAt: Timestamp;
  status: StudyPlanStatus;
  mode: StudyPlanMode;
  skillQueue: SkillQueueEntry[];
  currentWeekIndex: number;
  currentWeekSkills: string[];
  targetSessionsThisWeek: number;
  weeklyNarrative?: string;
  pullQuote?: string;
  completedDays: Record<string, boolean>;
  skippedWeeks: number[];
  lastRegeneratedAt?: Timestamp;
  lastAlgorithmRunAt?: Timestamp;
}

export interface StudyPlanOutput {
  weeksRemaining: number;
  mode: StudyPlanMode;
  skillQueue: SkillQueueEntry[];
  currentWeekIndex: number;
  currentWeekSkills: string[];
  targetSessionsThisWeek: number;
  today: TodaysSet | null;
}
