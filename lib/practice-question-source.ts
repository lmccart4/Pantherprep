// Caller-facing helpers for sourcing questions for the practice runner.
// Two modes:
//   - getQuestionsBySkill(course, skill, count)  → single-skill practice
//   - getAdaptivePracticeSet(uid, course, count) → recommendation-weighted
//
// Both return a uniform PracticeBatch shape that PracticeRunner accepts.
// The single-skill path falls back to adjacent skills in the same domain
// when the primary skill has fewer than `count` questions, and records
// any fallbacks used as human-readable notes for the results card.

import {
  getQuestions,
  type PoolQuestion,
} from "@/lib/adaptive/performance-service";
import {
  generatePracticeSet,
  MATH_SKILLS,
  RW_SKILLS,
} from "@/lib/adaptive/adaptive-engine";
import type { Question } from "@/types/question";

export interface PracticeBatch {
  questions: Question[];
  fallbackNotes: string[];
}

interface SkillOpts {
  excludeIds?: string[];
  preferredDifficulty?: "F" | "M" | "C";
  fallbackToDomain?: boolean;  // default true
}

export async function getQuestionsBySkill(
  course: string,
  skill: string,
  count: number = 10,
  opts: SkillOpts = {}
): Promise<PracticeBatch> {
  const notes: string[] = [];
  const excludeSet = new Set(opts.excludeIds ?? []);
  const fallbackOn = opts.fallbackToDomain !== false;

  // Primary query: the requested skill
  const primaryPool = await getQuestions({
    course,
    skill,
    difficulty: opts.preferredDifficulty,
    limit: count * 3,
    excludeIds: opts.excludeIds,
  });

  const selected: PoolQuestion[] = shuffle(primaryPool).slice(0, count);
  const primaryCount = selected.length;

  if (selected.length < count && fallbackOn) {
    const domain = findDomainForSkill(skill, course);
    if (domain) {
      const siblings = getSkillsInDomain(domain, course).filter(
        (s) => s !== skill
      );
      for (const siblingSkill of siblings) {
        if (selected.length >= count) break;
        const more = await getQuestions({
          course,
          skill: siblingSkill,
          limit: (count - selected.length) * 2,
        });
        const moreFiltered = more.filter(
          (q) =>
            !excludeSet.has(q.sourceId) &&
            !selected.find((p) => p.sourceId === q.sourceId)
        );
        const shuffled = shuffle(moreFiltered);
        selected.push(...shuffled.slice(0, count - selected.length));
      }
      const padCount = selected.length - primaryCount;
      if (padCount > 0) {
        notes.push(
          `${padCount} question${padCount === 1 ? "" : "s"} pulled from adjacent skills in ${domain} because this skill doesn't have enough content yet.`
        );
      }
    }
  }

  return {
    questions: selected.map(toQuestion),
    fallbackNotes: notes,
  };
}

export async function getAdaptivePracticeSet(
  uid: string,
  course: string,
  count: number = 15,
  opts: { excludeIds?: string[] } = {}
): Promise<PracticeBatch> {
  // Over-fetch so we can filter excluded ids and still hit the target count.
  const overFetch = opts.excludeIds && opts.excludeIds.length > 0 ? count * 2 : count;
  const set = await generatePracticeSet(uid, course, overFetch);
  const excludeSet = new Set(opts.excludeIds ?? []);
  const filtered = (set.questions ?? []).filter(
    (q) => !excludeSet.has(q.sourceId)
  );
  return {
    questions: filtered.slice(0, count).map(toQuestion),
    fallbackNotes: [],
  };
}

// --- internals ---

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function findDomainForSkill(skillKey: string, course: string): string | null {
  const taxonomy = course.includes("math") ? MATH_SKILLS : RW_SKILLS;
  for (const [domain, skills] of Object.entries(taxonomy)) {
    if ((skills as string[]).includes(skillKey)) return domain;
  }
  return null;
}

function getSkillsInDomain(domain: string, course: string): string[] {
  const taxonomy = course.includes("math") ? MATH_SKILLS : RW_SKILLS;
  return (taxonomy as Record<string, string[]>)[domain] ?? [];
}

/**
 * Map a PoolQuestion (Firestore shape) back to Question (UI shape) so
 * QuestionCard can render it without any changes. The sourceSkill label
 * is used for display and for storage in the answer row, keeping skill
 * identifiers consistent with how the existing diagnostic harness tags
 * answers. The taxonomy key (pq.skill) is only used for the routing /
 * query path and is dropped here.
 */
function toQuestion(pq: PoolQuestion): Question {
  return {
    id: pq.sourceId,
    testType: pq.testType,
    section: pq.section,
    module: pq.module,
    domain: pq.domain,
    skill: pq.sourceSkill,
    difficulty:
      pq.difficulty === "F"
        ? "easy"
        : pq.difficulty === "C"
        ? "hard"
        : "medium",
    type: pq.type,
    passage: pq.passage,
    stem: pq.stem,
    options: pq.choices.map((c) => c.text),
    correctAnswer: pq.correctAnswer,
    explanation: pq.explanation,
    explanations: pq.explanations,
    tags: pq.tags,
  };
}
