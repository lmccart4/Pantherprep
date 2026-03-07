export type TestType = "sat" | "nmsqt" | "psat89";
export type Section = "math" | "rw";
export type Difficulty = "easy" | "medium" | "hard";
export type QuestionType = "mc" | "spr";

export interface Question {
  id: string;
  testType: TestType;
  section: Section;
  module?: number;
  domain: string;
  skill: string;
  difficulty: Difficulty;
  type: QuestionType;
  passage?: string;
  stem: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  explanations?: Record<string, string>;
  tags?: string[];
}

export interface QuestionFilter {
  domain?: string;
  difficulty?: Difficulty;
  type?: QuestionType;
  module?: number;
  tags?: string[];
}
