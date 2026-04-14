// Pure helper for computing per-skill mastery deltas from before/after
// profile snapshots plus the practiced questions and answers. Consumed by
// PracticeRunner after session completion and rendered by
// PracticeResultsCard.

import {
  getProfileSkillData,
  sourceToTaxonomyKey,
} from "@/lib/skill-mapping";
import { skillLabel } from "@/lib/adaptive/adaptive-engine";
import type { AdaptiveProfile } from "@/lib/adaptive/performance-service";
import type { Question } from "@/types/question";

export interface MasteryDeltaRow {
  taxonomyKey: string;
  skillLabel: string;
  sessionCorrect: number;
  sessionTotal: number;
  beforePercent: number;    // 0-100, 0 if untested
  afterPercent: number;     // 0-100
  deltaPp: number;          // signed; positive = improvement
  beforeTotal: number;      // answer count before the session
  afterTotal: number;       // answer count after
  beforeTested: boolean;    // was there any data before this session
}

function isCorrect(q: Question, answer: string): boolean {
  if (!answer) return false;
  const ca = q.correctAnswer.trim();
  const ua = answer.trim();
  if (q.type === "spr") {
    const an = parseFloat(ua);
    const cn = parseFloat(ca);
    if (!isNaN(an) && !isNaN(cn)) return Math.abs(an - cn) < 1e-9;
    return ua.toLowerCase() === ca.toLowerCase();
  }
  return ua.toUpperCase() === ca.toUpperCase();
}

export function computeMasteryDeltas(
  questions: Question[],
  answers: Record<number, string>,
  beforeProfile: AdaptiveProfile | null,
  afterProfile: AdaptiveProfile | null
): MasteryDeltaRow[] {
  // Group question indices by taxonomy key (fallback to raw skill string
  // if the source label isn't in SKILL_MAP).
  const byTaxonomy = new Map<string, { questionIdxs: number[] }>();
  questions.forEach((q, idx) => {
    const taxonomyKey = sourceToTaxonomyKey(q.skill) ?? q.skill;
    if (!byTaxonomy.has(taxonomyKey)) {
      byTaxonomy.set(taxonomyKey, { questionIdxs: [] });
    }
    byTaxonomy.get(taxonomyKey)!.questionIdxs.push(idx);
  });

  const rows: MasteryDeltaRow[] = [];
  for (const [taxonomyKey, { questionIdxs }] of byTaxonomy) {
    let sessionCorrect = 0;
    let sessionTotal = 0;
    for (const i of questionIdxs) {
      const q = questions[i];
      const a = answers[i] ?? "";
      if (a === "") continue; // skipped questions don't count toward session accuracy
      sessionTotal += 1;
      if (isCorrect(q, a)) sessionCorrect += 1;
    }

    const before = getProfileSkillData(beforeProfile, taxonomyKey);
    const after = getProfileSkillData(afterProfile, taxonomyKey);
    const beforePercent = before.total > 0 ? Math.round(before.mastery * 100) : 0;
    const afterPercent = after.total > 0 ? Math.round(after.mastery * 100) : 0;

    rows.push({
      taxonomyKey,
      skillLabel: skillLabel(taxonomyKey),
      sessionCorrect,
      sessionTotal,
      beforePercent,
      afterPercent,
      deltaPp: afterPercent - beforePercent,
      beforeTotal: before.total,
      afterTotal: after.total,
      beforeTested: before.total > 0,
    });
  }

  // Sort by session accuracy descending — student sees wins first
  rows.sort((a, b) => {
    const aAcc = a.sessionTotal > 0 ? a.sessionCorrect / a.sessionTotal : 0;
    const bAcc = b.sessionTotal > 0 ? b.sessionCorrect / b.sessionTotal : 0;
    return bAcc - aAcc;
  });

  return rows;
}
