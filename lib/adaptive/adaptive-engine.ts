// Core adaptive logic: mastery calculation, spaced repetition, recommendations
//
// Uses a modified SM-2 algorithm adapted for test prep:
// - Mastery is weighted toward recent performance (exponential decay)
// - Ease factor adjusts based on error patterns, not just correct/incorrect
// - Interval scheduling determines when a skill should be reviewed
// - Recommendations are prioritized by a composite score

import {
  getRecentAnswers,
  getAdaptiveProfile,
  saveAdaptiveProfile,
  getQuestions,
  todayISO,
  daysBetween,
  type StoredAnswer,
  type AdaptiveProfile,
  type DomainData,
  type SkillData,
  type Recommendation,
} from "./performance-service";

// ============================================================
// CONSTANTS
// ============================================================

const DEFAULT_EASE = 2.0;
const MIN_EASE = 1.3;
const MAX_EASE = 2.5;
const DECAY_HALFLIFE = 14;
const MIN_ANSWERS_FOR_MASTERY = 3;
const MAX_RECOMMENDATIONS = 10;

const DIFFICULTY_WEIGHT: Record<string, number> = { F: 0.7, M: 1.0, C: 1.4 };

const ERROR_SEVERITY: Record<string, number> = {
  content_gap: 0.25,
  strategy_gap: 0.2,
  misread_trap: 0.15,
  time_pressure: 0.1,
  careless: 0.05,
};

// ============================================================
// MASTERY CALCULATION
// ============================================================

function calcSkillMastery(answers: StoredAnswer[]) {
  if (!answers.length) return { mastery: 0, weightedCorrect: 0, weightedTotal: 0 };

  const now = Date.now();
  let weightedCorrect = 0;
  let weightedTotal = 0;

  for (const ans of answers) {
    const ansTime = (ans.timestamp as { toDate?: () => Date; seconds?: number })?.toDate?.()
      ? (ans.timestamp as { toDate: () => Date }).toDate().getTime()
      : (ans.timestamp as { seconds?: number })?.seconds
        ? (ans.timestamp as { seconds: number }).seconds * 1000
        : now;

    const daysAgo = (now - ansTime) / (1000 * 60 * 60 * 24);
    const recencyWeight = Math.pow(0.5, daysAgo / DECAY_HALFLIFE);
    const diffWeight = DIFFICULTY_WEIGHT[ans.difficulty || "M"] || 1.0;
    const weight = recencyWeight * diffWeight;

    weightedTotal += weight;
    if (ans.correct) weightedCorrect += weight;
  }

  const mastery = weightedTotal > 0 ? weightedCorrect / weightedTotal : 0;
  return { mastery, weightedCorrect, weightedTotal };
}

function countErrorPatterns(answers: StoredAnswer[]): Record<string, number> {
  const counts: Record<string, number> = {
    content_gap: 0,
    careless: 0,
    time_pressure: 0,
    misread_trap: 0,
    strategy_gap: 0,
  };
  for (const ans of answers) {
    if (!ans.correct && ans.errorCategory && counts[ans.errorCategory] !== undefined) {
      counts[ans.errorCategory]++;
    }
  }
  return counts;
}

function calcEase(currentEase: number, recentAnswers: StoredAnswer[]): number {
  if (!recentAnswers.length) return currentEase;

  const correct = recentAnswers.filter((a) => a.correct).length;
  const total = recentAnswers.length;
  const pct = correct / total;

  const q = pct * 5;
  let newEase = currentEase + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));

  const errors = countErrorPatterns(recentAnswers);
  for (const [category, count] of Object.entries(errors)) {
    if (count > 0 && ERROR_SEVERITY[category]) {
      newEase -= ERROR_SEVERITY[category] * Math.min(count, 3);
    }
  }

  return Math.max(MIN_EASE, Math.min(MAX_EASE, newEase));
}

function calcInterval(ease: number, currentInterval: number, lastCorrect: boolean): number {
  if (!lastCorrect) return 1;
  if (currentInterval === 0) return 1;
  if (currentInterval === 1) return 3;
  return Math.round(currentInterval * ease);
}

// ============================================================
// PROFILE RECOMPUTATION
// ============================================================

export async function recomputeProfile(uid: string): Promise<AdaptiveProfile | null> {
  const existingProfile = await getAdaptiveProfile(uid);
  const existingSkills = existingProfile?.skills || {};

  const allAnswers = await getRecentAnswers(uid, 500);
  if (!allAnswers.length) return existingProfile;

  // Group answers by skill
  const bySkill: Record<string, StoredAnswer[]> = {};
  for (const ans of allAnswers) {
    const key = ans.skill || "unknown";
    if (!bySkill[key]) bySkill[key] = [];
    bySkill[key].push(ans);
  }

  // Compute per-skill mastery
  const skills: Record<string, SkillData> = {};
  for (const [skillKey, answers] of Object.entries(bySkill)) {
    const { mastery } = calcSkillMastery(answers);
    const total = answers.length;
    const correct = answers.filter((a) => a.correct).length;
    const errorPatterns = countErrorPatterns(answers);

    const prev = existingSkills[skillKey] || { ease: DEFAULT_EASE, interval: 0 };
    const recentForEase = answers.slice(0, 8);
    const newEase = calcEase(prev.ease, recentForEase);
    const lastCorrect = answers[0]?.correct ?? true;
    const newInterval = calcInterval(newEase, prev.interval, lastCorrect);

    const nextReviewDate = new Date();
    nextReviewDate.setDate(nextReviewDate.getDate() + newInterval);

    skills[skillKey] = {
      correct,
      total,
      mastery: Math.round(mastery * 1000) / 1000,
      ease: Math.round(newEase * 100) / 100,
      interval: newInterval,
      nextReview: nextReviewDate.toISOString().split("T")[0],
      lastSeen: answers[0]?.timestamp ?? null,
      errorPatterns,
    };
  }

  // Compute per-domain rollups
  const domains: Record<string, DomainData & { skillMasteries?: { skill: string; mastery: number }[] }> = {};
  for (const [skillKey, skillData] of Object.entries(skills)) {
    const sampleAnswer = bySkill[skillKey]?.[0];
    const domain = sampleAnswer?.domain || "Unknown";

    if (!domains[domain]) {
      domains[domain] = {
        mastery: 0,
        totalCorrect: 0,
        totalAnswers: 0,
        skillMasteries: [],
        weakestSkills: [],
        strongestSkills: [],
      };
    }

    domains[domain].totalCorrect += skillData.correct;
    domains[domain].totalAnswers += skillData.total;
    domains[domain].skillMasteries!.push({ skill: skillKey, mastery: skillData.mastery });
  }

  // Finalize domain rollups
  for (const domainData of Object.values(domains)) {
    const masteries = domainData.skillMasteries!;
    domainData.mastery =
      masteries.length > 0
        ? Math.round((masteries.reduce((sum, s) => sum + s.mastery, 0) / masteries.length) * 1000) / 1000
        : 0;

    masteries.sort((a, b) => a.mastery - b.mastery);
    domainData.weakestSkills = masteries.slice(0, 3).map((s) => s.skill);
    domainData.strongestSkills = masteries.slice(-3).reverse().map((s) => s.skill);
    delete domainData.skillMasteries;
  }

  const recommendations = generateRecommendations(skills, domains);
  const weeklyStats = calcWeeklyStats(allAnswers, domains, existingProfile);
  const streakDays = calcStreak(allAnswers);

  const profile: AdaptiveProfile = {
    uid,
    totalAnswers: allAnswers.length,
    totalCorrect: allAnswers.filter((a) => a.correct).length,
    streakDays,
    lastActiveDate: todayISO(),
    skills,
    domains: domains as Record<string, DomainData>,
    recommendations,
    weeklyStats,
  };

  await saveAdaptiveProfile(uid, profile);
  return profile;
}

// ============================================================
// RECOMMENDATION ENGINE
// ============================================================

function generateRecommendations(
  skills: Record<string, SkillData>,
  domains: Record<string, DomainData>
): Recommendation[] {
  const today = todayISO();
  const recs: (Recommendation & { rawPriority: number })[] = [];

  for (const [skillKey, skillData] of Object.entries(skills)) {
    if (skillData.mastery > 0.9 && skillData.nextReview > today) continue;

    let priorityScore = 0;
    let reason = "";

    // Factor 1: Low mastery (0-40 points)
    priorityScore += (1 - skillData.mastery) * 40;
    if (skillData.mastery < 0.4) {
      reason = `Low mastery (${Math.round(skillData.mastery * 100)}%)`;
    }

    // Factor 2: Due for review (0-25 points)
    if (skillData.nextReview <= today) {
      const overdueDays = daysBetween(skillData.nextReview, today);
      priorityScore += Math.min(25, 10 + overdueDays * 2);
      if (!reason) reason = `Due for review (${overdueDays}d overdue)`;
    }

    // Factor 3: Error pattern severity (0-20 points)
    const errors = skillData.errorPatterns || {};
    let errorScore = 0;
    for (const [cat, count] of Object.entries(errors)) {
      errorScore += (ERROR_SEVERITY[cat] || 0) * count * 10;
    }
    priorityScore += Math.min(20, errorScore);
    if (errors.content_gap > 2 && !reason) reason = `Frequent content gaps (${errors.content_gap} occurrences)`;
    if (errors.misread_trap > 2 && !reason) reason = `Falling for traps (${errors.misread_trap} occurrences)`;

    // Factor 4: Insufficient data (0-15 points)
    if (skillData.total < MIN_ANSWERS_FOR_MASTERY) {
      priorityScore += 15;
      if (!reason) reason = `Needs more practice (only ${skillData.total} answers)`;
    }

    if (!reason) reason = `Review recommended (${Math.round(skillData.mastery * 100)}% mastery)`;

    let suggestedDifficulty: "F" | "M" | "C" = "M";
    if (skillData.mastery < 0.3) suggestedDifficulty = "F";
    else if (skillData.mastery > 0.7) suggestedDifficulty = "C";

    let questionCount = 5;
    if (skillData.mastery < 0.3) questionCount = 8;
    else if (skillData.mastery > 0.7) questionCount = 3;

    const domain = findDomainForSkill(skillKey, domains) || "Unknown";

    recs.push({
      skill: skillKey,
      domain,
      reason,
      priority: Math.round(priorityScore),
      rawPriority: priorityScore,
      suggestedDifficulty,
      questionCount,
    });
  }

  recs.sort((a, b) => b.rawPriority - a.rawPriority);
  return recs.slice(0, MAX_RECOMMENDATIONS).map((r, i) => ({
    skill: r.skill,
    domain: r.domain,
    reason: r.reason,
    priority: i + 1,
    suggestedDifficulty: r.suggestedDifficulty,
    questionCount: r.questionCount,
  }));
}

function findDomainForSkill(skillKey: string, domains: Record<string, DomainData>): string | null {
  for (const [domainKey, domainData] of Object.entries(domains)) {
    if (domainData.weakestSkills?.includes(skillKey) || domainData.strongestSkills?.includes(skillKey)) {
      return domainKey;
    }
  }
  return null;
}

// ============================================================
// PRACTICE SET GENERATION
// ============================================================

export async function generatePracticeSet(
  uid: string,
  course: string,
  totalQuestions = 15
) {
  const profile = await getAdaptiveProfile(uid);
  if (!profile?.recommendations?.length) {
    return {
      questions: [],
      focusSkills: [],
      difficulty: "mixed" as const,
      message: "No adaptive data yet. Complete some modules first!",
    };
  }

  const recs = profile.recommendations;
  const focusSkills = recs.slice(0, 3).map((r) => r.skill);

  const allocations: { skill: string; domain: string; difficulty: string; count: number }[] = [];
  let remaining = totalQuestions;

  for (const rec of recs) {
    if (remaining <= 0) break;
    const count = Math.min(rec.questionCount, remaining);
    allocations.push({
      skill: rec.skill,
      domain: rec.domain,
      difficulty: rec.suggestedDifficulty,
      count,
    });
    remaining -= count;
  }

  if (remaining > 0 && profile.skills) {
    const strongSkills = Object.entries(profile.skills)
      .filter(([, s]) => s.mastery > 0.7)
      .sort((a, b) => b[1].mastery - a[1].mastery)
      .slice(0, 3);

    for (const [skillKey] of strongSkills) {
      if (remaining <= 0) break;
      const count = Math.min(2, remaining);
      allocations.push({
        skill: skillKey,
        domain: findDomainForSkill(skillKey, profile.domains) || "Unknown",
        difficulty: "C",
        count,
      });
      remaining -= count;
    }
  }

  let questions: Awaited<ReturnType<typeof getQuestions>> = [];
  for (const alloc of allocations) {
    const pool = await getQuestions({
      course,
      skill: alloc.skill,
      difficulty: alloc.difficulty,
      limit: alloc.count * 2,
    });
    const shuffled = pool.sort(() => Math.random() - 0.5);
    questions.push(...shuffled.slice(0, alloc.count));
  }

  questions = questions.sort(() => Math.random() - 0.5);

  return {
    questions,
    focusSkills,
    difficulty: "adaptive" as const,
    allocations,
    totalRequested: totalQuestions,
    totalFilled: questions.length,
  };
}

// ============================================================
// WEEKLY STATS & STREAKS
// ============================================================

function calcWeeklyStats(
  allAnswers: StoredAnswer[],
  domains: Record<string, DomainData>,
  existingProfile: AdaptiveProfile | null
) {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const oneWeekMs = oneWeekAgo.getTime();

  const weekAnswers = allAnswers.filter((a) => {
    const ts = (a.timestamp as { toDate?: () => Date; seconds?: number })?.toDate?.()
      ? (a.timestamp as { toDate: () => Date }).toDate().getTime()
      : (a.timestamp as { seconds?: number })?.seconds
        ? (a.timestamp as { seconds: number }).seconds * 1000
        : 0;
    return ts >= oneWeekMs;
  });

  const answersThisWeek = weekAnswers.length;
  const correctThisWeek = weekAnswers.filter((a) => a.correct).length;
  const sessionIds = new Set(weekAnswers.map((a) => a.sessionId).filter(Boolean));
  const sessionsThisWeek = sessionIds.size;

  const errorCounts = countErrorPatterns(weekAnswers);
  const dominantErrorCategory =
    Object.entries(errorCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || null;

  const prevDomains = existingProfile?.domains || {};
  const improvingDomains: string[] = [];
  const decliningDomains: string[] = [];

  for (const [dk, dd] of Object.entries(domains)) {
    const prevMastery = prevDomains[dk]?.mastery || 0;
    if (dd.mastery > prevMastery + 0.05) improvingDomains.push(dk);
    else if (dd.mastery < prevMastery - 0.05) decliningDomains.push(dk);
  }

  return {
    answersThisWeek,
    correctThisWeek,
    sessionsThisWeek,
    dominantErrorCategory,
    improvingDomains,
    decliningDomains,
  };
}

function calcStreak(allAnswers: StoredAnswer[]): number {
  if (!allAnswers.length) return 0;

  const dates = new Set<string>();
  for (const ans of allAnswers) {
    const ts = (ans.timestamp as { toDate?: () => Date; seconds?: number })?.toDate?.()
      ? (ans.timestamp as { toDate: () => Date }).toDate()
      : (ans.timestamp as { seconds?: number })?.seconds
        ? new Date((ans.timestamp as { seconds: number }).seconds * 1000)
        : null;
    if (ts) dates.add(ts.toISOString().split("T")[0]);
  }

  const sortedDates = [...dates].sort().reverse();
  if (!sortedDates.length) return 0;

  const today = todayISO();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayISO = yesterday.toISOString().split("T")[0];

  if (sortedDates[0] !== today && sortedDates[0] !== yesterdayISO) return 0;

  let streak = 1;
  for (let i = 0; i < sortedDates.length - 1; i++) {
    const diff = daysBetween(sortedDates[i + 1], sortedDates[i]);
    if (diff === 1) streak++;
    else break;
  }
  return streak;
}

// ============================================================
// SKILL TAXONOMY
// ============================================================

export const MATH_SKILLS: Record<string, string[]> = {
  Algebra: ["linear_equations", "linear_inequalities", "systems_of_equations", "linear_functions", "absolute_value"],
  "Advanced Math": ["quadratic_equations", "quadratic_formula", "polynomial_operations", "exponential_functions", "radical_equations", "rational_expressions"],
  "Problem Solving & Data": ["ratios_rates", "percentages", "unit_conversion", "scatterplots", "linear_regression", "probability", "statistics_central_tendency", "statistics_spread", "two_way_tables", "expected_value"],
  "Geometry & Trig": ["area_perimeter", "volume", "triangles", "circles", "coordinate_geometry", "right_triangle_trig", "unit_circle"],
};

export const RW_SKILLS: Record<string, string[]> = {
  "Information & Ideas": ["central_ideas", "details_evidence", "inferences", "quantitative_evidence", "text_structure"],
  "Craft & Structure": ["vocabulary_in_context", "purpose_function", "cross_text_connections", "point_of_view"],
  "Expression of Ideas": ["transitions", "rhetorical_synthesis", "organization"],
  "Standard English Conventions": ["subject_verb_agreement", "pronoun_clarity", "modifiers", "parallelism", "verb_tense", "punctuation_boundaries", "comma_usage", "colon_usage", "possessives"],
};

export function skillLabel(key: string): string {
  return key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function domainForSkill(skillKey: string): string {
  for (const [domain, skills] of Object.entries({ ...MATH_SKILLS, ...RW_SKILLS })) {
    if (skills.includes(skillKey)) return domain;
  }
  return "Unknown";
}
