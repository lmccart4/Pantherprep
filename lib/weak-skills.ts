import { sourceToTaxonomyKey } from "@/lib/skill-mapping";

export interface SkillResult {
  skill: string;
  correct: boolean;
}

export interface WeakSkill {
  taxonomyKey: string;
  correct: number;
  total: number;
  pct: number;
}

export interface WeakSkillOptions {
  minAttempts?: number;
  threshold?: number;
  limit?: number;
}

export function computeWeakSkills(
  results: SkillResult[],
  options: WeakSkillOptions = {}
): WeakSkill[] {
  const { minAttempts = 2, threshold = 0.7, limit = 3 } = options;

  const bySkill: Record<string, { correct: number; total: number }> = {};
  for (const r of results) {
    const key = sourceToTaxonomyKey(r.skill);
    if (!key) continue;
    if (!bySkill[key]) bySkill[key] = { correct: 0, total: 0 };
    bySkill[key].total += 1;
    if (r.correct) bySkill[key].correct += 1;
  }

  return Object.entries(bySkill)
    .filter(([, v]) => v.total >= minAttempts)
    .map(([taxonomyKey, v]) => ({
      taxonomyKey,
      correct: v.correct,
      total: v.total,
      pct: v.correct / v.total,
    }))
    .filter((s) => s.pct < threshold)
    .sort((a, b) => a.pct - b.pct)
    .slice(0, limit);
}
