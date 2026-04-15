// Skill mapping + aggregation helpers for the UI.
//
// This file is the single source of truth for source-string ↔ taxonomy-key
// translation. Consumers include:
//   - The questionPool seed script (via scripts/skill-mapping.ts shim)
//   - The dashboard Skills tab
//   - The /skills/[course] catalog route
//   - The /skills/[course]/[skill] detail route
//   - The Past Tests detail view (clickable skill tags)

import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit as limitTo,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type {
  AdaptiveProfile,
  StoredAnswer,
} from "@/lib/adaptive/performance-service";
import type { Timestamp } from "firebase/firestore";
import { MATH_SKILLS, RW_SKILLS } from "@/lib/adaptive/adaptive-engine";

// ============================================================
// SKILL MAP — source string → taxonomy key + domain
// ============================================================

export interface SkillMapping {
  taxonomyKey: string;  // must match a key in MATH_SKILLS or RW_SKILLS
  domain: string;       // must match the top-level domain key in the taxonomy
}

export const SKILL_MAP: Record<string, SkillMapping> = {
  // ==== MATH — Algebra ====
  "Absolute value equations":                       { taxonomyKey: "absolute_value",      domain: "Algebra" },
  "Evaluating expressions":                         { taxonomyKey: "linear_equations",    domain: "Algebra" },
  "Linear equations (word problems)":               { taxonomyKey: "linear_equations",    domain: "Algebra" },
  "Linear equations in 1 variable":                 { taxonomyKey: "linear_equations",    domain: "Algebra" },
  "Linear equations in 2 variables":                { taxonomyKey: "linear_equations",    domain: "Algebra" },
  "Linear equations with fractions":                { taxonomyKey: "linear_equations",    domain: "Algebra" },
  "Linear functions":                               { taxonomyKey: "linear_functions",    domain: "Algebra" },
  "Linear inequalities":                            { taxonomyKey: "linear_inequalities", domain: "Algebra" },
  "Special solutions (identity equations)":         { taxonomyKey: "linear_equations",    domain: "Algebra" },
  "Systems (word problems)":                        { taxonomyKey: "systems_of_equations", domain: "Algebra" },
  "Systems of equations":                           { taxonomyKey: "systems_of_equations", domain: "Algebra" },
  "Systems of equations (word problems)":           { taxonomyKey: "systems_of_equations", domain: "Algebra" },
  "Systems of linear equations":                    { taxonomyKey: "systems_of_equations", domain: "Algebra" },

  // ==== MATH — Advanced Math ====
  "Completing the square":                          { taxonomyKey: "quadratic_equations",   domain: "Advanced Math" },
  "Complex numbers":                                { taxonomyKey: "quadratic_equations",   domain: "Advanced Math" },
  "Composition of functions":                       { taxonomyKey: "polynomial_operations", domain: "Advanced Math" },
  "Equivalent expressions":                         { taxonomyKey: "polynomial_operations", domain: "Advanced Math" },
  "Equivalent expressions (FOIL)":                  { taxonomyKey: "polynomial_operations", domain: "Advanced Math" },
  "Equivalent expressions (factoring)":             { taxonomyKey: "polynomial_operations", domain: "Advanced Math" },
  "Equivalent forms of quadratics":                 { taxonomyKey: "quadratic_equations",   domain: "Advanced Math" },
  "Exponential concepts":                           { taxonomyKey: "exponential_functions", domain: "Advanced Math" },
  "Exponential functions":                          { taxonomyKey: "exponential_functions", domain: "Advanced Math" },
  "Exponential growth":                             { taxonomyKey: "exponential_functions", domain: "Advanced Math" },
  "Exponential growth interpretation":              { taxonomyKey: "exponential_functions", domain: "Advanced Math" },
  "Function evaluation":                            { taxonomyKey: "polynomial_operations", domain: "Advanced Math" },
  "Function notation":                              { taxonomyKey: "polynomial_operations", domain: "Advanced Math" },
  "Polynomial evaluation":                          { taxonomyKey: "polynomial_operations", domain: "Advanced Math" },
  "Polynomial factoring":                           { taxonomyKey: "polynomial_operations", domain: "Advanced Math" },
  "Polynomial functions":                           { taxonomyKey: "polynomial_operations", domain: "Advanced Math" },
  "Quadratic equations":                            { taxonomyKey: "quadratic_equations",   domain: "Advanced Math" },
  "Quadratic equations (factoring)":                { taxonomyKey: "quadratic_equations",   domain: "Advanced Math" },
  "Quadratic expressions (FOIL)":                   { taxonomyKey: "polynomial_operations", domain: "Advanced Math" },
  "Quadratic functions (vertex form)":              { taxonomyKey: "quadratic_equations",   domain: "Advanced Math" },
  "Quadratic functions (vertex)":                   { taxonomyKey: "quadratic_equations",   domain: "Advanced Math" },
  "Radical/rational equations":                     { taxonomyKey: "radical_equations",     domain: "Advanced Math" },
  "Radicals":                                       { taxonomyKey: "radical_equations",     domain: "Advanced Math" },
  "Rational expressions":                           { taxonomyKey: "rational_expressions",  domain: "Advanced Math" },
  "Solving quadratics":                             { taxonomyKey: "quadratic_equations",   domain: "Advanced Math" },
  "Vertex form of quadratics":                      { taxonomyKey: "quadratic_equations",   domain: "Advanced Math" },

  // ==== MATH — Problem Solving & Data ====
  "Confidence intervals / margin of error":         { taxonomyKey: "statistics_spread",        domain: "Problem Solving & Data" },
  "Data interpretation":                            { taxonomyKey: "scatterplots",             domain: "Problem Solving & Data" },
  "Margin of error / confidence intervals":         { taxonomyKey: "statistics_spread",        domain: "Problem Solving & Data" },
  "Measures of center":                             { taxonomyKey: "statistics_central_tendency", domain: "Problem Solving & Data" },
  "Measures of center and spread":                  { taxonomyKey: "statistics_spread",        domain: "Problem Solving & Data" },
  "Mixture problems":                               { taxonomyKey: "ratios_rates",             domain: "Problem Solving & Data" },
  "Percentages":                                    { taxonomyKey: "percentages",              domain: "Problem Solving & Data" },
  "Percentages (sequential)":                       { taxonomyKey: "percentages",              domain: "Problem Solving & Data" },
  "Probability":                                    { taxonomyKey: "probability",              domain: "Problem Solving & Data" },
  "Ratios":                                         { taxonomyKey: "ratios_rates",             domain: "Problem Solving & Data" },
  "Ratios and proportions":                         { taxonomyKey: "ratios_rates",             domain: "Problem Solving & Data" },
  "Scatterplots":                                   { taxonomyKey: "scatterplots",             domain: "Problem Solving & Data" },
  "Scatterplots and regression":                    { taxonomyKey: "linear_regression",        domain: "Problem Solving & Data" },
  "Scatterplots and r²":                            { taxonomyKey: "linear_regression",        domain: "Problem Solving & Data" },
  "Study design":                                   { taxonomyKey: "probability",              domain: "Problem Solving & Data" },
  "Two-way tables / Venn diagrams":                 { taxonomyKey: "two_way_tables",           domain: "Problem Solving & Data" },
  "Two-way tables / conditional probability":       { taxonomyKey: "two_way_tables",           domain: "Problem Solving & Data" },

  // ==== MATH — Geometry & Trig ====
  "Angles":                                         { taxonomyKey: "triangles",          domain: "Geometry & Trig" },
  "Arc length":                                     { taxonomyKey: "circles",            domain: "Geometry & Trig" },
  "Area":                                           { taxonomyKey: "area_perimeter",     domain: "Geometry & Trig" },
  "Circle equations":                               { taxonomyKey: "circles",            domain: "Geometry & Trig" },
  "Circles":                                        { taxonomyKey: "circles",            domain: "Geometry & Trig" },
  "Distance formula":                               { taxonomyKey: "coordinate_geometry", domain: "Geometry & Trig" },
  "Parallel lines and angles":                      { taxonomyKey: "triangles",          domain: "Geometry & Trig" },
  "Perpendicular lines":                            { taxonomyKey: "coordinate_geometry", domain: "Geometry & Trig" },
  "Pythagorean theorem":                            { taxonomyKey: "right_triangle_trig", domain: "Geometry & Trig" },
  "Right triangles / Pythagorean theorem":          { taxonomyKey: "right_triangle_trig", domain: "Geometry & Trig" },
  "Sector area":                                    { taxonomyKey: "circles",            domain: "Geometry & Trig" },
  "Similar figures (area ratios)":                  { taxonomyKey: "triangles",          domain: "Geometry & Trig" },
  "Triangle angle sum":                             { taxonomyKey: "triangles",          domain: "Geometry & Trig" },
  "Trigonometric ratios":                           { taxonomyKey: "right_triangle_trig", domain: "Geometry & Trig" },
  "Volume":                                         { taxonomyKey: "volume",             domain: "Geometry & Trig" },
  "Volume (cone)":                                  { taxonomyKey: "volume",             domain: "Geometry & Trig" },

  // ==== R&W — Information & Ideas ====
  "Central Ideas and Details":                      { taxonomyKey: "central_ideas",       domain: "Information & Ideas" },
  "Command of Evidence (Quantitative)":             { taxonomyKey: "quantitative_evidence", domain: "Information & Ideas" },
  "Command of Evidence (Textual)":                  { taxonomyKey: "details_evidence",    domain: "Information & Ideas" },
  "Inferences":                                     { taxonomyKey: "inferences",          domain: "Information & Ideas" },

  // ==== R&W — Craft & Structure ====
  "Cross-Text Connections":                         { taxonomyKey: "cross_text_connections", domain: "Craft & Structure" },
  "Text Structure and Purpose":                     { taxonomyKey: "purpose_function",    domain: "Craft & Structure" },
  "Words in Context":                               { taxonomyKey: "vocabulary_in_context", domain: "Craft & Structure" },

  // ==== R&W — Expression of Ideas ====
  "Rhetorical Synthesis":                           { taxonomyKey: "rhetorical_synthesis", domain: "Expression of Ideas" },
  "Transitions":                                    { taxonomyKey: "transitions",         domain: "Expression of Ideas" },
  "Form, Structure, and Sense":                     { taxonomyKey: "modifiers",           domain: "Standard English Conventions" },

  // ==== R&W — Standard English Conventions ====
  "Boundaries":                                     { taxonomyKey: "punctuation_boundaries", domain: "Standard English Conventions" },

  // ==== Additions from practice-test banks (Task 3 extension) ====

  // Algebra
  "Absolute value":              { taxonomyKey: "absolute_value",      domain: "Algebra" },
  "Equations with fractions":    { taxonomyKey: "linear_equations",    domain: "Algebra" },
  "Identity equations":          { taxonomyKey: "linear_equations",    domain: "Algebra" },
  "Inequalities":                { taxonomyKey: "linear_inequalities", domain: "Algebra" },
  "Linear equations":            { taxonomyKey: "linear_equations",    domain: "Algebra" },
  "Multi-step equations":        { taxonomyKey: "linear_equations",    domain: "Algebra" },
  "No-solution systems":         { taxonomyKey: "systems_of_equations", domain: "Algebra" },
  "Parallel lines":              { taxonomyKey: "linear_functions",    domain: "Algebra" },
  "Slope":                       { taxonomyKey: "linear_functions",    domain: "Algebra" },
  "Slope and y-intercept":       { taxonomyKey: "linear_functions",    domain: "Algebra" },
  "Slope between points":        { taxonomyKey: "linear_functions",    domain: "Algebra" },
  "Systems (no solution)":       { taxonomyKey: "systems_of_equations", domain: "Algebra" },
  "Systems word problems":       { taxonomyKey: "systems_of_equations", domain: "Algebra" },
  "Word problems":               { taxonomyKey: "linear_equations",    domain: "Algebra" },

  // Advanced Math
  "Difference of squares":       { taxonomyKey: "polynomial_operations", domain: "Advanced Math" },
  "Discriminant":                { taxonomyKey: "quadratic_equations",   domain: "Advanced Math" },
  "Exponent rules":              { taxonomyKey: "exponential_functions", domain: "Advanced Math" },
  "Exponential decay":           { taxonomyKey: "exponential_functions", domain: "Advanced Math" },
  "Exponents":                   { taxonomyKey: "exponential_functions", domain: "Advanced Math" },
  "FOIL":                        { taxonomyKey: "polynomial_operations", domain: "Advanced Math" },
  "FOIL with negatives":         { taxonomyKey: "polynomial_operations", domain: "Advanced Math" },
  "Factoring":                   { taxonomyKey: "polynomial_operations", domain: "Advanced Math" },
  "Factoring quadratics":        { taxonomyKey: "quadratic_equations",   domain: "Advanced Math" },
  "Function composition":        { taxonomyKey: "polynomial_operations", domain: "Advanced Math" },
  "Function operations":         { taxonomyKey: "polynomial_operations", domain: "Advanced Math" },
  "Function transformations":    { taxonomyKey: "polynomial_operations", domain: "Advanced Math" },
  "Growth vs decay":             { taxonomyKey: "exponential_functions", domain: "Advanced Math" },
  "Polynomial division":         { taxonomyKey: "polynomial_operations", domain: "Advanced Math" },
  "Polynomial operations":       { taxonomyKey: "polynomial_operations", domain: "Advanced Math" },
  "Quadratic factoring":         { taxonomyKey: "quadratic_equations",   domain: "Advanced Math" },
  "Quadratic formula":           { taxonomyKey: "quadratic_formula",     domain: "Advanced Math" },
  "Radical expressions":         { taxonomyKey: "radical_equations",     domain: "Advanced Math" },
  "Vertex form":                 { taxonomyKey: "quadratic_equations",   domain: "Advanced Math" },

  // Problem Solving & Data
  "Line of best fit":            { taxonomyKey: "linear_regression",        domain: "Problem Solving & Data" },
  "Margin of error":             { taxonomyKey: "statistics_spread",        domain: "Problem Solving & Data" },
  "Mean":                        { taxonomyKey: "statistics_central_tendency", domain: "Problem Solving & Data" },
  "Median":                      { taxonomyKey: "statistics_central_tendency", domain: "Problem Solving & Data" },
  "Misleading statistics":       { taxonomyKey: "statistics_spread",        domain: "Problem Solving & Data" },
  "Percent change":              { taxonomyKey: "percentages",              domain: "Problem Solving & Data" },
  "Percent of a whole":          { taxonomyKey: "percentages",              domain: "Problem Solving & Data" },
  "Two-way tables":              { taxonomyKey: "two_way_tables",           domain: "Problem Solving & Data" },
  "Unit rates":                  { taxonomyKey: "ratios_rates",             domain: "Problem Solving & Data" },

  // Geometry & Trig
  "Area of triangle":            { taxonomyKey: "triangles",           domain: "Geometry & Trig" },
  "Circle area":                 { taxonomyKey: "circles",             domain: "Geometry & Trig" },
  "Circle from general form":    { taxonomyKey: "circles",             domain: "Geometry & Trig" },
  "Circle properties":           { taxonomyKey: "circles",             domain: "Geometry & Trig" },
  "Circumference":               { taxonomyKey: "circles",             domain: "Geometry & Trig" },
  "Completing square (circles)": { taxonomyKey: "circles",             domain: "Geometry & Trig" },
  "Congruence and proof":        { taxonomyKey: "triangles",           domain: "Geometry & Trig" },
  "Coordinate geometry":         { taxonomyKey: "coordinate_geometry", domain: "Geometry & Trig" },
  "Cylinder volume":             { taxonomyKey: "volume",              domain: "Geometry & Trig" },
  "Midpoint":                    { taxonomyKey: "coordinate_geometry", domain: "Geometry & Trig" },
  "Pythagorean theorem applied": { taxonomyKey: "right_triangle_trig", domain: "Geometry & Trig" },
  "Similar triangles":           { taxonomyKey: "triangles",           domain: "Geometry & Trig" },
  "Trig (sine rule concept)":    { taxonomyKey: "right_triangle_trig", domain: "Geometry & Trig" },
  "Trig ratios":                 { taxonomyKey: "right_triangle_trig", domain: "Geometry & Trig" },
};

// Audit record of taxonomy additions we're making as part of this seed.
// Empty because the existing taxonomy absorbed every source string via
// collapse. If a future re-run exposes a new string that doesn't fit,
// add a taxonomy key to adaptive-engine.ts AND record it here.
export const TAXONOMY_ADDITIONS: Array<{ domain: string; keys: string[] }> = [];

// ============================================================
// REVERSE LOOKUP + AGGREGATION
// ============================================================

/**
 * Inverse of SKILL_MAP. For each taxonomy key, lists every source label
 * that collapsed into it. Computed once at module load.
 */
export const TAXONOMY_TO_SOURCES: Record<string, string[]> = (() => {
  const map: Record<string, string[]> = {};
  for (const [sourceLabel, mapping] of Object.entries(SKILL_MAP)) {
    if (!map[mapping.taxonomyKey]) map[mapping.taxonomyKey] = [];
    map[mapping.taxonomyKey].push(sourceLabel);
  }
  return map;
})();

export interface AggregatedSkillData {
  correct: number;
  total: number;
  mastery: number;
  ease: number;
  interval: number;
  nextReview: string;
  errorPatterns: Record<string, number>;
  lastSeen: Timestamp | null;
  sourceLabels: string[];
}

/**
 * Aggregate profile.skills entries across all source labels that map to the
 * given taxonomy key. Returns an empty aggregate (total: 0) if no source
 * labels have data. This is the primary bridge between the taxonomy-keyed
 * UI and the source-label-keyed profile.
 */
export function getProfileSkillData(
  profile: AdaptiveProfile | null | undefined,
  taxonomyKey: string
): AggregatedSkillData {
  const sourceLabels = TAXONOMY_TO_SOURCES[taxonomyKey] ?? [];
  const empty: AggregatedSkillData = {
    correct: 0,
    total: 0,
    mastery: 0,
    ease: 2.5,
    interval: 0,
    nextReview: "",
    errorPatterns: {},
    lastSeen: null,
    sourceLabels,
  };
  if (!profile?.skills || sourceLabels.length === 0) return empty;

  let correct = 0;
  let total = 0;
  let maxEase = 0;
  let minInterval = Infinity;
  let earliestReview: string | null = null;
  let lastSeenTs: Timestamp | null = null;
  const errorPatterns: Record<string, number> = {};

  for (const label of sourceLabels) {
    const entry = profile.skills[label];
    if (!entry) continue;
    correct += entry.correct ?? 0;
    total += entry.total ?? 0;
    if ((entry.ease ?? 0) > maxEase) maxEase = entry.ease ?? 0;
    if ((entry.interval ?? Infinity) < minInterval) minInterval = entry.interval ?? Infinity;
    if (entry.nextReview && (!earliestReview || entry.nextReview < earliestReview)) {
      earliestReview = entry.nextReview;
    }
    if (entry.lastSeen && (!lastSeenTs || (entry.lastSeen.toMillis?.() ?? 0) > (lastSeenTs.toMillis?.() ?? 0))) {
      lastSeenTs = entry.lastSeen;
    }
    for (const [cat, count] of Object.entries(entry.errorPatterns ?? {})) {
      errorPatterns[cat] = (errorPatterns[cat] ?? 0) + (count as number);
    }
  }

  if (total === 0) return { ...empty, sourceLabels };

  return {
    correct,
    total,
    mastery: total > 0 ? correct / total : 0,
    ease: maxEase || 2.5,
    interval: minInterval === Infinity ? 0 : minInterval,
    nextReview: earliestReview ?? "",
    errorPatterns,
    lastSeen: lastSeenTs,
    sourceLabels,
  };
}

/**
 * Single-item reverse lookup: given a source label from a recommendation or
 * past-test answer row, return its taxonomy key (for routing). Returns null
 * if the label can't be resolved either as a known source label or as a
 * taxonomy key directly.
 *
 * Course module quizzes (module-shell.tsx) pass raw taxonomy keys like
 * "linear_equations" on `question.skill`, whereas diagnostics/practice-tests
 * pass human-readable source labels like "Linear equations in 1 variable".
 * Accept both shapes.
 */
export function sourceToTaxonomyKey(sourceLabel: string): string | null {
  const mapping = SKILL_MAP[sourceLabel];
  if (mapping) return mapping.taxonomyKey;
  if (TAXONOMY_TO_SOURCES[sourceLabel]) return sourceLabel;
  return null;
}

/**
 * Fetch recent performanceLog answers for a given taxonomy key by running
 * N parallel single-skill queries (one per source label that maps to the
 * taxonomy key), merging results, and sorting by timestamp descending.
 *
 * Firestore does not allow `where ... in [...]` combined with `orderBy` on a
 * different field, so we can't use a single `in` query. Parallel single-skill
 * queries are the workaround. With ~8 source labels max per taxonomy key,
 * this is fast and cheap.
 */
export async function getRecentAnswersForTaxonomyKey(
  uid: string,
  taxonomyKey: string,
  limit = 50
): Promise<StoredAnswer[]> {
  const sourceLabels = TAXONOMY_TO_SOURCES[taxonomyKey] ?? [];
  if (sourceLabels.length === 0 || !uid) return [];

  const queries = sourceLabels.map((label) =>
    getDocs(
      query(
        collection(db, "performanceLog", uid, "answers"),
        where("skill", "==", label),
        orderBy("timestamp", "desc"),
        limitTo(limit)
      )
    )
  );

  try {
    const snaps = await Promise.all(queries);
    const merged: StoredAnswer[] = [];
    for (const snap of snaps) {
      for (const doc of snap.docs) {
        merged.push({ id: doc.id, ...doc.data() } as StoredAnswer);
      }
    }
    merged.sort(
      (a, b) => (b.timestamp?.toMillis?.() ?? 0) - (a.timestamp?.toMillis?.() ?? 0)
    );
    return merged.slice(0, limit);
  } catch (e) {
    console.warn("getRecentAnswersForTaxonomyKey error:", e);
    return [];
  }
}

// Count of taxonomy skills available for a given course slug. Used by
// the /skills root picker to render "N skills" on each tile. Static at
// build time — derived from MATH_SKILLS / RW_SKILLS in adaptive-engine.ts.
// Assumes the math taxonomy is shared across sat-math / nmsqt-math / psat89-math
// and the rw taxonomy is shared across sat-rw / nmsqt-rw / psat89-rw (true today).
// If the taxonomies diverge by test family later, this function needs to take
// the full course slug into account instead of just the section suffix.
export function getSkillCountForCourse(course: string): number {
  const taxonomy = course.includes("math") ? MATH_SKILLS : RW_SKILLS;
  return Object.values(taxonomy).reduce((sum, skills) => sum + skills.length, 0);
}
