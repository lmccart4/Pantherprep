import type { TestType, Section } from "./question";

export interface LessonSlide {
  id: string;
  title: string;
  subtitle?: string;
  body: string[];
  visual?: string | null;
}

export interface WarmupQuestion {
  source?: string;
  stem: string;
  choices: string[];
  correct: number;
  explanation: string;
}

export interface QuizQuestion {
  passage?: string | null;
  stem: string;
  choices: string[];
  correct: number;
  explanation: string;
  type?: string;
  difficulty?: "easy" | "medium" | "hard";
  trap?: string | null;
  trapAnswer?: number;
  trapDesc?: string | null;
  /** Adaptive engine: canonical skill key (e.g. "triangles", "linear_equations") */
  skill?: string;
  /** Adaptive engine: domain name (e.g. "Geometry & Trig", "Algebra") */
  domain?: string;
}

export interface ModuleScreen {
  id: string;
  label: string;
  icon?: string;
}

export interface ModuleConfig {
  testType: TestType;
  section: Section;
  moduleNum: number;
  title: string;
  subtitle: string;
  accentColor: string;
  screens: ModuleScreen[];
  lessons?: LessonSlide[];
  warmup?: WarmupQuestion[];
  quiz?: QuizQuestion[];
  challenge?: QuizQuestion[];
  /** Description shown on the complete screen */
  completionDescription?: string;
  /** Key takeaways shown on the complete screen */
  takeaways?: string[];
}
