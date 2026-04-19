// Deterministic, pure function that takes a student's profile + testDate
// and produces a StudyPlanOutput. Runs on both client (fast daily path)
// and server (Sunday regen). Same input → same output.

import type { AdaptiveProfile } from "@/lib/adaptive/performance-service";
import type { StudyPlanOutput, SkillQueueEntry } from "@/types/study-plan";
import {
  getCourseTaxonomy,
  filterSkillsForCourse,
} from "@/lib/adaptive/adaptive-engine";
import { prerequisitesOf } from "./prerequisites";
import { weeksRemaining, isRestDay, toISODate } from "./dates";

interface BuildArgs {
  profile: AdaptiveProfile | null;
  testDate: Date;
  today: Date;
  course: string;
  completedDays?: Record<string, boolean>;
}

// Domain weights per test program. Values from CB's Digital SAT Assessment
// Framework (Tables 16–18). Used to bias ordering toward high-weight skills.
const DOMAIN_WEIGHTS: Record<string, Record<string, number>> = {
  sat: {
    Algebra: 0.35,
    "Advanced Math": 0.35,
    "Problem Solving & Data": 0.15,
    "Geometry & Trig": 0.15,
    "Information & Ideas": 0.26,
    "Craft & Structure": 0.28,
    "Expression of Ideas": 0.2,
    "Standard English Conventions": 0.26,
  },
  nmsqt: {
    Algebra: 0.35,
    "Advanced Math": 0.325,
    "Problem Solving & Data": 0.2,
    "Geometry & Trig": 0.125,
    "Information & Ideas": 0.26,
    "Craft & Structure": 0.28,
    "Expression of Ideas": 0.2,
    "Standard English Conventions": 0.26,
  },
  p89: {
    Algebra: 0.425,
    "Advanced Math": 0.2,
    "Problem Solving & Data": 0.2,
    "Geometry & Trig": 0.175,
    "Information & Ideas": 0.26,
    "Craft & Structure": 0.28,
    "Expression of Ideas": 0.2,
    "Standard English Conventions": 0.26,
  },
};

function testProgramOf(course: string): "sat" | "nmsqt" | "p89" {
  if (course.startsWith("psat89")) return "p89";
  if (course.startsWith("nmsqt")) return "nmsqt";
  return "sat";
}

function domainForSkill(skill: string, course: string): string {
  const taxonomy = getCourseTaxonomy(course);
  for (const [domain, skills] of Object.entries(taxonomy)) {
    if (skills.includes(skill)) return domain;
  }
  return "Unknown";
}

export function buildPlan(args: BuildArgs): StudyPlanOutput {
  const { profile, testDate, today, course, completedDays = {} } = args;

  const weeks = weeksRemaining(today, testDate);
  const mode: "normal" | "cramming" = weeks < 2 ? "cramming" : "normal";

  const taxonomy = getCourseTaxonomy(course);
  const allSkills: string[] = [];
  for (const skills of Object.values(taxonomy)) allSkills.push(...skills);
  const eligible = filterSkillsForCourse(allSkills, course);

  const program = testProgramOf(course);
  const domainWeights = DOMAIN_WEIGHTS[program] ?? {};

  const recIndex = new Map<string, number>();
  (profile?.recommendations ?? []).forEach((r, i) => recIndex.set(r.skill, i));
  const recCount = profile?.recommendations?.length ?? 0;

  function scoreFor(skill: string): number {
    const skillData = profile?.skills?.[skill];
    const mastery = skillData?.mastery ?? 0;
    const total = skillData?.total ?? 0;
    const unexploredBoost = total < 5 ? 1 : 0;
    const masteryGap = 1 - mastery;
    const domainWeight = domainWeights[domainForSkill(skill, course)] ?? 0.1;
    const recRank = recIndex.get(skill);
    const recBoost = recRank !== undefined && recCount > 0 ? 1 - recRank / recCount : 0;
    return unexploredBoost * 2 + masteryGap * 0.6 + domainWeight * 0.3 + recBoost * 0.1;
  }

  const ranked = [...eligible].sort((a, b) => scoreFor(b) - scoreFor(a));
  const trimmed = mode === "cramming" ? ranked.slice(0, 5) : ranked;

  const skillsPerWeek = 2;
  const maxWeek = Math.max(0, weeks - 1);
  const assigned = new Map<string, number>();
  let weekCursor = 0;
  let inWeek = 0;

  for (const skill of trimmed) {
    const prereqs = prerequisitesOf(skill).filter((p) => trimmed.includes(p));
    let earliest = weekCursor;
    for (const p of prereqs) {
      const pWeek = assigned.get(p);
      if (pWeek !== undefined && pWeek + 1 > earliest) earliest = pWeek + 1;
    }
    if (earliest > weekCursor) {
      weekCursor = earliest;
      inWeek = 0;
    }
    const targetWeek = Math.min(weekCursor, maxWeek);
    assigned.set(skill, targetWeek);
    inWeek++;
    if (inWeek >= skillsPerWeek) {
      weekCursor++;
      inWeek = 0;
    }
  }

  const skillQueue: SkillQueueEntry[] = trimmed
    .map((skill) => ({
      skill,
      assignedWeek: assigned.get(skill) ?? maxWeek,
      targetMastery: skill in (profile?.skills ?? {}) ? 0.8 : 0.75,
    }))
    .sort((a, b) =>
      a.assignedWeek === b.assignedWeek
        ? trimmed.indexOf(a.skill) - trimmed.indexOf(b.skill)
        : a.assignedWeek - b.assignedWeek
    );

  const currentWeekIndex = 0;
  const currentWeekSkills = skillQueue
    .filter((q) => q.assignedWeek === currentWeekIndex)
    .map((q) => q.skill);

  const targetSessionsThisWeek = mode === "cramming" ? 4 : 3;

  let todayOut: StudyPlanOutput["today"] = null;
  if (!isRestDay(today)) {
    const iso = toISODate(today);
    if (!completedDays[iso]) {
      const pick = currentWeekSkills.find((skill) => {
        const m = profile?.skills?.[skill]?.mastery ?? 0;
        const target =
          skillQueue.find((q) => q.skill === skill)?.targetMastery ?? 0.8;
        return m < target;
      });
      if (pick) {
        const domain = domainForSkill(pick, course);
        const isHighWeight = (domainWeights[domain] ?? 0) >= 0.3;
        const targetCount = isHighWeight ? 15 : 10;
        todayOut = {
          skill: pick,
          course,
          targetCount,
          estMinutes: Math.round(targetCount * 1.5),
        };
      }
    }
  }

  return {
    weeksRemaining: weeks,
    mode,
    skillQueue,
    currentWeekIndex,
    currentWeekSkills,
    targetSessionsThisWeek,
    today: todayOut,
  };
}
