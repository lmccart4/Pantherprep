# PantherPrep Skill Catalog + Detail Pages Implementation Plan (Spec A)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the student-visible surface of the skill-based practice initiative — a `/skills/[course]` catalog, a rich `/skills/[course]/[skill]` detail page with mastery/trend/activity, and clickable recommendations across the dashboard, all backed by a fix for the broken profile.skills key mismatch.

**Architecture:** Fix the profile-key mismatch by moving `SKILL_MAP` into `lib/` and adding a reverse-lookup + aggregation helper. Build two new routes under `app/(authenticated)/skills/` that reuse the existing auth layout. The detail page embeds `PracticeRunner` (from spec B) inline via state transition when the student clicks "Practice this skill" — no route change. The dashboard's existing Skills tab shrinks to a 6-item preview; recommendations on the Overview and Practice tabs + the Past Tests per-question skill tags all become clickable and route to the detail page via `sourceToTaxonomyKey` reverse lookup.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript 5.7, Firebase 10 (client SDK), Tailwind 4, existing `PracticeRunner` + `QuestionCard` + `GlassCard` utilities.

**Spec:** [docs/superpowers/specs/2026-04-14-skill-catalog-detail-spec-a-design.md](../specs/2026-04-14-skill-catalog-detail-spec-a-design.md)

**Testing convention:** No automated test framework. Verification uses `npx tsc --noEmit` + `npm run lint` + `npm run build` + manual smoke tests via browser. Do NOT add a test framework.

---

## File map

| File | Status | Purpose |
|---|---|---|
| `lib/skill-mapping.ts` | create | Moved `SKILL_MAP` + new `TAXONOMY_TO_SOURCES`, `getProfileSkillData`, `sourceToTaxonomyKey`, `getRecentAnswersForTaxonomyKey` helpers |
| `scripts/skill-mapping.ts` | modify (shim) | Re-export from `@/lib/skill-mapping` so seed script keeps working |
| `lib/skill-descriptions.ts` | create | 50 one-line static descriptions keyed by taxonomy key |
| `firestore.indexes.json` | modify | Add `answers(skill asc, timestamp desc)` composite index |
| `components/skills/skill-row.tsx` | create | Reusable single-skill row component (used by catalog + dashboard preview) |
| `components/skills/skill-catalog.tsx` | create | Catalog UI — domain tabs + mastery filter + skill rows |
| `components/skills/skill-trendline.tsx` | create | 14-day mastery bar chart |
| `components/skills/skill-recent-activity.tsx` | create | 5-square recent answers strip + modal detail |
| `components/skills/skill-detail.tsx` | create | Top-level detail page (flips between detail view and PracticeRunner) |
| `app/(authenticated)/skills/[course]/page.tsx` | create | Catalog route |
| `app/(authenticated)/skills/[course]/[skill]/page.tsx` | create | Detail route |
| `app/(authenticated)/dashboard/page.tsx` | modify | Shrink Skills tab to 6-item preview + wire clickable recommendations on Overview and Practice |
| `components/dashboard/past-tests-view.tsx` | modify | Clickable skill tags in detail view |

---

## Task 1: Move `SKILL_MAP` to `lib/` + add `TAXONOMY_TO_SOURCES` + helpers

**Files:**
- Create: `lib/skill-mapping.ts`
- Modify: `scripts/skill-mapping.ts` (becomes a shim)
- Modify: `scripts/seed-question-pool.mjs` (update import path)

- [ ] **Step 1: Create `lib/skill-mapping.ts` with the full content**

This file starts with the existing `SKILL_MAP` table (copy verbatim from `scripts/skill-mapping.ts`), then appends:

- An inverse `TAXONOMY_TO_SOURCES: Record<string, string[]>` computed at module load
- `getProfileSkillData(profile, taxonomyKey)` — aggregates `profile.skills` entries across source labels for a taxonomy key
- `sourceToTaxonomyKey(sourceLabel)` — single-item reverse lookup for click-through
- `getRecentAnswersForTaxonomyKey(uid, taxonomyKey, limit?)` — runs N parallel single-skill queries against `performanceLog` and merges/sorts by timestamp

Create `lib/skill-mapping.ts`:

```ts
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

// ============================================================
// SKILL MAP — source string → taxonomy key + domain
// ============================================================

export interface SkillMapping {
  taxonomyKey: string;
  domain: string;
}

export const SKILL_MAP: Record<string, SkillMapping> = {
  // ==== MATH — Algebra ====
  "Absolute value":                                 { taxonomyKey: "absolute_value",      domain: "Algebra" },
  "Absolute value equations":                       { taxonomyKey: "absolute_value",      domain: "Algebra" },
  "Equations with fractions":                       { taxonomyKey: "linear_equations",    domain: "Algebra" },
  "Evaluating expressions":                         { taxonomyKey: "linear_equations",    domain: "Algebra" },
  "Identity equations":                             { taxonomyKey: "linear_equations",    domain: "Algebra" },
  "Inequalities":                                   { taxonomyKey: "linear_inequalities", domain: "Algebra" },
  "Linear equations":                               { taxonomyKey: "linear_equations",    domain: "Algebra" },
  "Linear equations (word problems)":               { taxonomyKey: "linear_equations",    domain: "Algebra" },
  "Linear equations in 1 variable":                 { taxonomyKey: "linear_equations",    domain: "Algebra" },
  "Linear equations in 2 variables":                { taxonomyKey: "linear_equations",    domain: "Algebra" },
  "Linear equations with fractions":                { taxonomyKey: "linear_equations",    domain: "Algebra" },
  "Linear functions":                               { taxonomyKey: "linear_functions",    domain: "Algebra" },
  "Linear inequalities":                            { taxonomyKey: "linear_inequalities", domain: "Algebra" },
  "Multi-step equations":                           { taxonomyKey: "linear_equations",    domain: "Algebra" },
  "No-solution systems":                            { taxonomyKey: "systems_of_equations", domain: "Algebra" },
  "Parallel lines":                                 { taxonomyKey: "linear_functions",    domain: "Algebra" },
  "Slope":                                          { taxonomyKey: "linear_functions",    domain: "Algebra" },
  "Slope and y-intercept":                          { taxonomyKey: "linear_functions",    domain: "Algebra" },
  "Slope between points":                           { taxonomyKey: "linear_functions",    domain: "Algebra" },
  "Special solutions (identity equations)":         { taxonomyKey: "linear_equations",    domain: "Algebra" },
  "Systems (no solution)":                          { taxonomyKey: "systems_of_equations", domain: "Algebra" },
  "Systems (word problems)":                        { taxonomyKey: "systems_of_equations", domain: "Algebra" },
  "Systems of equations":                           { taxonomyKey: "systems_of_equations", domain: "Algebra" },
  "Systems of equations (word problems)":           { taxonomyKey: "systems_of_equations", domain: "Algebra" },
  "Systems of linear equations":                    { taxonomyKey: "systems_of_equations", domain: "Algebra" },
  "Systems word problems":                          { taxonomyKey: "systems_of_equations", domain: "Algebra" },
  "Word problems":                                  { taxonomyKey: "linear_equations",    domain: "Algebra" },

  // ==== MATH — Advanced Math ====
  "Completing the square":                          { taxonomyKey: "quadratic_equations",   domain: "Advanced Math" },
  "Complex numbers":                                { taxonomyKey: "quadratic_equations",   domain: "Advanced Math" },
  "Composition of functions":                       { taxonomyKey: "polynomial_operations", domain: "Advanced Math" },
  "Difference of squares":                          { taxonomyKey: "polynomial_operations", domain: "Advanced Math" },
  "Discriminant":                                   { taxonomyKey: "quadratic_equations",   domain: "Advanced Math" },
  "Equivalent expressions":                         { taxonomyKey: "polynomial_operations", domain: "Advanced Math" },
  "Equivalent expressions (FOIL)":                  { taxonomyKey: "polynomial_operations", domain: "Advanced Math" },
  "Equivalent expressions (factoring)":             { taxonomyKey: "polynomial_operations", domain: "Advanced Math" },
  "Equivalent forms of quadratics":                 { taxonomyKey: "quadratic_equations",   domain: "Advanced Math" },
  "Exponent rules":                                 { taxonomyKey: "exponential_functions", domain: "Advanced Math" },
  "Exponential concepts":                           { taxonomyKey: "exponential_functions", domain: "Advanced Math" },
  "Exponential decay":                              { taxonomyKey: "exponential_functions", domain: "Advanced Math" },
  "Exponential functions":                          { taxonomyKey: "exponential_functions", domain: "Advanced Math" },
  "Exponential growth":                             { taxonomyKey: "exponential_functions", domain: "Advanced Math" },
  "Exponential growth interpretation":              { taxonomyKey: "exponential_functions", domain: "Advanced Math" },
  "Exponents":                                      { taxonomyKey: "exponential_functions", domain: "Advanced Math" },
  "FOIL":                                           { taxonomyKey: "polynomial_operations", domain: "Advanced Math" },
  "FOIL with negatives":                            { taxonomyKey: "polynomial_operations", domain: "Advanced Math" },
  "Factoring":                                      { taxonomyKey: "polynomial_operations", domain: "Advanced Math" },
  "Factoring quadratics":                           { taxonomyKey: "quadratic_equations",   domain: "Advanced Math" },
  "Function composition":                           { taxonomyKey: "polynomial_operations", domain: "Advanced Math" },
  "Function evaluation":                            { taxonomyKey: "polynomial_operations", domain: "Advanced Math" },
  "Function notation":                              { taxonomyKey: "polynomial_operations", domain: "Advanced Math" },
  "Function operations":                            { taxonomyKey: "polynomial_operations", domain: "Advanced Math" },
  "Function transformations":                       { taxonomyKey: "polynomial_operations", domain: "Advanced Math" },
  "Growth vs decay":                                { taxonomyKey: "exponential_functions", domain: "Advanced Math" },
  "Polynomial division":                            { taxonomyKey: "polynomial_operations", domain: "Advanced Math" },
  "Polynomial evaluation":                          { taxonomyKey: "polynomial_operations", domain: "Advanced Math" },
  "Polynomial factoring":                           { taxonomyKey: "polynomial_operations", domain: "Advanced Math" },
  "Polynomial functions":                           { taxonomyKey: "polynomial_operations", domain: "Advanced Math" },
  "Polynomial operations":                          { taxonomyKey: "polynomial_operations", domain: "Advanced Math" },
  "Quadratic equations":                            { taxonomyKey: "quadratic_equations",   domain: "Advanced Math" },
  "Quadratic equations (factoring)":                { taxonomyKey: "quadratic_equations",   domain: "Advanced Math" },
  "Quadratic expressions (FOIL)":                   { taxonomyKey: "polynomial_operations", domain: "Advanced Math" },
  "Quadratic factoring":                            { taxonomyKey: "quadratic_equations",   domain: "Advanced Math" },
  "Quadratic formula":                              { taxonomyKey: "quadratic_formula",     domain: "Advanced Math" },
  "Quadratic functions (vertex form)":              { taxonomyKey: "quadratic_equations",   domain: "Advanced Math" },
  "Quadratic functions (vertex)":                   { taxonomyKey: "quadratic_equations",   domain: "Advanced Math" },
  "Radical expressions":                            { taxonomyKey: "radical_equations",     domain: "Advanced Math" },
  "Radical/rational equations":                     { taxonomyKey: "radical_equations",     domain: "Advanced Math" },
  "Radicals":                                       { taxonomyKey: "radical_equations",     domain: "Advanced Math" },
  "Rational expressions":                           { taxonomyKey: "rational_expressions",  domain: "Advanced Math" },
  "Solving quadratics":                             { taxonomyKey: "quadratic_equations",   domain: "Advanced Math" },
  "Vertex form":                                    { taxonomyKey: "quadratic_equations",   domain: "Advanced Math" },
  "Vertex form of quadratics":                      { taxonomyKey: "quadratic_equations",   domain: "Advanced Math" },

  // ==== MATH — Problem Solving & Data ====
  "Confidence intervals / margin of error":         { taxonomyKey: "statistics_spread",        domain: "Problem Solving & Data" },
  "Data interpretation":                            { taxonomyKey: "scatterplots",             domain: "Problem Solving & Data" },
  "Line of best fit":                               { taxonomyKey: "linear_regression",        domain: "Problem Solving & Data" },
  "Margin of error":                                { taxonomyKey: "statistics_spread",        domain: "Problem Solving & Data" },
  "Margin of error / confidence intervals":         { taxonomyKey: "statistics_spread",        domain: "Problem Solving & Data" },
  "Mean":                                           { taxonomyKey: "statistics_central_tendency", domain: "Problem Solving & Data" },
  "Measures of center":                             { taxonomyKey: "statistics_central_tendency", domain: "Problem Solving & Data" },
  "Measures of center and spread":                  { taxonomyKey: "statistics_spread",        domain: "Problem Solving & Data" },
  "Median":                                         { taxonomyKey: "statistics_central_tendency", domain: "Problem Solving & Data" },
  "Misleading statistics":                          { taxonomyKey: "statistics_spread",        domain: "Problem Solving & Data" },
  "Mixture problems":                               { taxonomyKey: "ratios_rates",             domain: "Problem Solving & Data" },
  "Percent change":                                 { taxonomyKey: "percentages",              domain: "Problem Solving & Data" },
  "Percent of a whole":                             { taxonomyKey: "percentages",              domain: "Problem Solving & Data" },
  "Percentages":                                    { taxonomyKey: "percentages",              domain: "Problem Solving & Data" },
  "Percentages (sequential)":                       { taxonomyKey: "percentages",              domain: "Problem Solving & Data" },
  "Probability":                                    { taxonomyKey: "probability",              domain: "Problem Solving & Data" },
  "Ratios":                                         { taxonomyKey: "ratios_rates",             domain: "Problem Solving & Data" },
  "Ratios and proportions":                         { taxonomyKey: "ratios_rates",             domain: "Problem Solving & Data" },
  "Scatterplots":                                   { taxonomyKey: "scatterplots",             domain: "Problem Solving & Data" },
  "Scatterplots and regression":                    { taxonomyKey: "linear_regression",        domain: "Problem Solving & Data" },
  "Scatterplots and r²":                            { taxonomyKey: "linear_regression",        domain: "Problem Solving & Data" },
  "Study design":                                   { taxonomyKey: "probability",              domain: "Problem Solving & Data" },
  "Two-way tables":                                 { taxonomyKey: "two_way_tables",           domain: "Problem Solving & Data" },
  "Two-way tables / Venn diagrams":                 { taxonomyKey: "two_way_tables",           domain: "Problem Solving & Data" },
  "Two-way tables / conditional probability":       { taxonomyKey: "two_way_tables",           domain: "Problem Solving & Data" },
  "Unit rates":                                     { taxonomyKey: "ratios_rates",             domain: "Problem Solving & Data" },

  // ==== MATH — Geometry & Trig ====
  "Angles":                                         { taxonomyKey: "triangles",           domain: "Geometry & Trig" },
  "Arc length":                                     { taxonomyKey: "circles",             domain: "Geometry & Trig" },
  "Area":                                           { taxonomyKey: "area_perimeter",      domain: "Geometry & Trig" },
  "Area of triangle":                               { taxonomyKey: "triangles",           domain: "Geometry & Trig" },
  "Circle area":                                    { taxonomyKey: "circles",             domain: "Geometry & Trig" },
  "Circle equations":                               { taxonomyKey: "circles",             domain: "Geometry & Trig" },
  "Circle from general form":                       { taxonomyKey: "circles",             domain: "Geometry & Trig" },
  "Circle properties":                              { taxonomyKey: "circles",             domain: "Geometry & Trig" },
  "Circles":                                        { taxonomyKey: "circles",             domain: "Geometry & Trig" },
  "Circumference":                                  { taxonomyKey: "circles",             domain: "Geometry & Trig" },
  "Completing square (circles)":                    { taxonomyKey: "circles",             domain: "Geometry & Trig" },
  "Congruence and proof":                           { taxonomyKey: "triangles",           domain: "Geometry & Trig" },
  "Coordinate geometry":                            { taxonomyKey: "coordinate_geometry", domain: "Geometry & Trig" },
  "Cylinder volume":                                { taxonomyKey: "volume",              domain: "Geometry & Trig" },
  "Distance formula":                               { taxonomyKey: "coordinate_geometry", domain: "Geometry & Trig" },
  "Midpoint":                                       { taxonomyKey: "coordinate_geometry", domain: "Geometry & Trig" },
  "Parallel lines and angles":                      { taxonomyKey: "triangles",           domain: "Geometry & Trig" },
  "Perpendicular lines":                            { taxonomyKey: "coordinate_geometry", domain: "Geometry & Trig" },
  "Pythagorean theorem":                            { taxonomyKey: "right_triangle_trig", domain: "Geometry & Trig" },
  "Pythagorean theorem applied":                    { taxonomyKey: "right_triangle_trig", domain: "Geometry & Trig" },
  "Right triangles / Pythagorean theorem":          { taxonomyKey: "right_triangle_trig", domain: "Geometry & Trig" },
  "Sector area":                                    { taxonomyKey: "circles",             domain: "Geometry & Trig" },
  "Similar figures (area ratios)":                  { taxonomyKey: "triangles",           domain: "Geometry & Trig" },
  "Similar triangles":                              { taxonomyKey: "triangles",           domain: "Geometry & Trig" },
  "Triangle angle sum":                             { taxonomyKey: "triangles",           domain: "Geometry & Trig" },
  "Trig (sine rule concept)":                       { taxonomyKey: "right_triangle_trig", domain: "Geometry & Trig" },
  "Trig ratios":                                    { taxonomyKey: "right_triangle_trig", domain: "Geometry & Trig" },
  "Trigonometric ratios":                           { taxonomyKey: "right_triangle_trig", domain: "Geometry & Trig" },
  "Volume":                                         { taxonomyKey: "volume",              domain: "Geometry & Trig" },
  "Volume (cone)":                                  { taxonomyKey: "volume",              domain: "Geometry & Trig" },

  // ==== R&W — Information & Ideas ====
  "Central Ideas and Details":                      { taxonomyKey: "central_ideas",         domain: "Information & Ideas" },
  "Command of Evidence (Quantitative)":             { taxonomyKey: "quantitative_evidence", domain: "Information & Ideas" },
  "Command of Evidence (Textual)":                  { taxonomyKey: "details_evidence",      domain: "Information & Ideas" },
  "Inferences":                                     { taxonomyKey: "inferences",            domain: "Information & Ideas" },

  // ==== R&W — Craft & Structure ====
  "Cross-Text Connections":                         { taxonomyKey: "cross_text_connections", domain: "Craft & Structure" },
  "Text Structure and Purpose":                     { taxonomyKey: "purpose_function",      domain: "Craft & Structure" },
  "Words in Context":                               { taxonomyKey: "vocabulary_in_context",  domain: "Craft & Structure" },

  // ==== R&W — Expression of Ideas ====
  "Rhetorical Synthesis":                           { taxonomyKey: "rhetorical_synthesis",  domain: "Expression of Ideas" },
  "Transitions":                                    { taxonomyKey: "transitions",           domain: "Expression of Ideas" },
  "Form, Structure, and Sense":                     { taxonomyKey: "modifiers",             domain: "Standard English Conventions" },

  // ==== R&W — Standard English Conventions ====
  "Boundaries":                                     { taxonomyKey: "punctuation_boundaries", domain: "Standard English Conventions" },
};

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
 * if the source label isn't in the map — caller can fall back to the catalog.
 */
export function sourceToTaxonomyKey(sourceLabel: string): string | null {
  const mapping = SKILL_MAP[sourceLabel];
  return mapping?.taxonomyKey ?? null;
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
```

- [ ] **Step 2: Replace `scripts/skill-mapping.ts` with a shim**

Replace the entire contents of `scripts/skill-mapping.ts` with:

```ts
// Shim: SKILL_MAP now lives in @/lib/skill-mapping. Re-exported here for
// backward compatibility with the seed script and any other tooling that
// imports from the scripts path. New code should import directly from
// @/lib/skill-mapping.
export { SKILL_MAP, TAXONOMY_ADDITIONS, type SkillMapping } from "@/lib/skill-mapping";
```

- [ ] **Step 3: Update the seed script import**

The seed script currently imports from `./skill-mapping.ts`. Check whether the shim works or whether the dynamic import path needs to update. Run:

```
cd /Users/lukemccarthy/pantherprep && grep -n "skill-mapping" scripts/seed-question-pool.mjs
```

The import line is `await import("./skill-mapping.ts")`. The shim re-exports from `@/lib/skill-mapping` — under `tsx`, path aliases resolve via `tsconfig.json`'s `paths` mapping. If this works, no change needed. If the `@/` alias doesn't resolve in the script context, edit the shim to use a relative path: `export { ... } from "../lib/skill-mapping";` instead.

Test the dry-run on a small set to verify:

```
cd /Users/lukemccarthy/pantherprep && GOOGLE_CLOUD_PROJECT=pantherprep-a5a73 npm run seed:pool -- --test-type=sat-math --dry-run 2>&1 | tail -20
```

Expected: same behavior as before, skipped=0, transformed=88. If the import fails, fix the shim to use a relative path and re-run.

- [ ] **Step 4: Type-check**

```
cd /Users/lukemccarthy/pantherprep && npx tsc --noEmit 2>&1 | grep "skill-mapping" | head
```

Expected: no errors in `lib/skill-mapping.ts` or `scripts/skill-mapping.ts`.

- [ ] **Step 5: Build**

```
cd /Users/lukemccarthy/pantherprep && npm run build 2>&1 | tail -15
```

Expected: build succeeds.

- [ ] **Step 6: Commit**

```bash
cd /Users/lukemccarthy/pantherprep
git add lib/skill-mapping.ts scripts/skill-mapping.ts
git commit -m "Move SKILL_MAP to lib + add TAXONOMY_TO_SOURCES + getProfileSkillData helpers"
```

---

## Task 2: Create `lib/skill-descriptions.ts` with 50 static descriptions

**Files:**
- Create: `lib/skill-descriptions.ts`

- [ ] **Step 1: Create the file**

Create `lib/skill-descriptions.ts` with:

```ts
// Short one-line skill descriptions used by the skill catalog and detail pages.
// These are placeholders until spec C (Parker authoring pipeline) replaces
// them with rich concept content. If a skill key isn't present here, the
// detail page renders a generic "No description yet" fallback.

export const SKILL_DESCRIPTIONS: Record<string, string> = {
  // ==== MATH — Algebra ====
  linear_equations: "Solve and graph linear equations in one or two variables, including word-problem setups and special-case identity/no-solution forms.",
  linear_functions: "Interpret slope, intercepts, and rate of change. Write equations from points or graphs. Identify parallel and perpendicular lines.",
  linear_inequalities: "Solve and graph inequalities in one or two variables, including system constraints and feasible regions.",
  systems_of_equations: "Solve systems of two linear equations by substitution, elimination, or graphing. Recognize no-solution and infinite-solution cases.",
  absolute_value: "Solve absolute value equations and inequalities. Understand the geometric interpretation of distance from a point.",

  // ==== MATH — Advanced Math ====
  quadratic_equations: "Factor, use the quadratic formula, and complete the square. Recognize vertex, factored, and standard forms. Work with the discriminant to predict root behavior.",
  quadratic_formula: "Apply the quadratic formula to non-factorable quadratics. Interpret the discriminant.",
  polynomial_operations: "Add, subtract, multiply, factor, and divide polynomials. Work with FOIL, difference of squares, and polynomial long division.",
  exponential_functions: "Work with exponential growth and decay. Interpret base, growth rate, and initial value in context. Solve equations with exponents.",
  radical_equations: "Solve equations with square roots and other radicals. Identify extraneous solutions introduced by squaring.",
  rational_expressions: "Simplify, multiply, divide, add, and subtract rational expressions. Solve rational equations and interpret domain restrictions.",

  // ==== MATH — Problem Solving & Data ====
  ratios_rates: "Work with ratios, unit rates, proportions, and scaling. Apply to mixture, speed, and word-problem setups.",
  percentages: "Calculate percent change, percent of a whole, and sequential percent operations. Interpret percent in real-world contexts.",
  unit_conversion: "Convert between units using conversion factors and dimensional analysis. Common SAT contexts include distance, time, and rates.",
  scatterplots: "Interpret scatterplots, identify trends, estimate lines of best fit, and read off specific data points.",
  linear_regression: "Read and interpret linear regression output. Use r² to assess fit. Distinguish correlation from causation.",
  probability: "Calculate simple and compound probabilities. Work with independent and mutually exclusive events. Interpret two-way tables.",
  statistics_central_tendency: "Compute and interpret mean, median, and mode. Understand how outliers affect each measure.",
  statistics_spread: "Work with range, standard deviation, margin of error, and confidence intervals. Interpret spread in real-world contexts.",
  two_way_tables: "Read two-way frequency tables. Calculate conditional and joint probabilities from table data.",
  expected_value: "Calculate expected value for discrete random variables in game and decision-making contexts.",

  // ==== MATH — Geometry & Trig ====
  area_perimeter: "Calculate area and perimeter of polygons and composite figures. Apply to real-world measurement problems.",
  volume: "Calculate the volume of prisms, cylinders, cones, pyramids, and spheres. Work with composite solids.",
  triangles: "Apply triangle angle-sum, similarity, and congruence. Work with special right triangles (30-60-90, 45-45-90). Includes area ratios of similar figures.",
  circles: "Work with circumference, arc length, sector area, and the standard form of a circle's equation. Complete the square to rewrite general forms.",
  coordinate_geometry: "Apply the distance, midpoint, and slope formulas. Interpret linear equations on the coordinate plane. Recognize parallel and perpendicular relationships.",
  right_triangle_trig: "Apply SOH-CAH-TOA. Use the Pythagorean theorem. Work with angles of elevation and depression.",
  unit_circle: "Understand radian measure and the unit circle. Evaluate trig functions at standard angles.",

  // ==== R&W — Information & Ideas ====
  central_ideas: "Identify main ideas and supporting details in a passage. Distinguish claims from evidence.",
  details_evidence: "Find specific details that support or weaken a claim. Choose the quote that best supports a given argument.",
  inferences: "Draw logical inferences from text. Recognize what the passage implies without stating directly.",
  quantitative_evidence: "Interpret data presented in tables, charts, or graphs embedded in a passage. Connect quantitative claims to textual arguments.",
  text_structure: "Recognize how a passage is organized: chronological, compare-contrast, cause-effect, problem-solution, and others.",

  // ==== R&W — Craft & Structure ====
  vocabulary_in_context: "Determine the precise meaning of a word as used in context. Distinguish connotation from denotation.",
  purpose_function: "Identify the author's purpose for a specific sentence, paragraph, or passage. Recognize rhetorical function.",
  cross_text_connections: "Compare claims, evidence, or reasoning across two related passages.",
  point_of_view: "Identify the perspective or stance of an author or character. Recognize how perspective shapes argument.",

  // ==== R&W — Expression of Ideas ====
  transitions: "Choose transition words and phrases that clarify the relationship between sentences or paragraphs.",
  rhetorical_synthesis: "Combine evidence from multiple sources into a coherent summary that serves a specified rhetorical goal.",
  organization: "Recognize and improve the organization of a passage. Rearrange sentences or paragraphs for logical flow.",

  // ==== R&W — Standard English Conventions ====
  subject_verb_agreement: "Match subjects to verbs in number, even with intervening phrases or unusual word order.",
  pronoun_clarity: "Choose pronouns that agree with their antecedents in number and have unambiguous references.",
  modifiers: "Place modifiers near the words they modify. Fix dangling and misplaced modifiers.",
  parallelism: "Maintain parallel grammatical structures in lists, comparisons, and correlative conjunctions.",
  verb_tense: "Choose verb tenses that are consistent and appropriate to the context.",
  punctuation_boundaries: "Use periods, semicolons, colons, and commas correctly to separate independent clauses and set off nonessential elements.",
  comma_usage: "Use commas correctly in series, after introductory elements, around nonrestrictive clauses, and in complex sentences.",
  colon_usage: "Use colons to introduce lists, explanations, or quotations after an independent clause.",
  possessives: "Form possessive nouns and pronouns correctly. Distinguish possessives from contractions.",
};

/**
 * Get the description for a taxonomy key. Falls back to a generic message
 * if the skill isn't in the descriptions table. Used by the catalog and
 * detail pages.
 */
export function getSkillDescription(taxonomyKey: string): string {
  return (
    SKILL_DESCRIPTIONS[taxonomyKey] ??
    "No description yet — more content coming soon."
  );
}
```

- [ ] **Step 2: Type-check**

```
cd /Users/lukemccarthy/pantherprep && npx tsc --noEmit 2>&1 | grep "skill-descriptions" | head
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
cd /Users/lukemccarthy/pantherprep
git add lib/skill-descriptions.ts
git commit -m "Add lib/skill-descriptions.ts: 50 static one-line skill blurbs"
```

---

## Task 3: Add composite Firestore index for per-skill recent-activity queries

**Files:**
- Modify: `firestore.indexes.json`

- [ ] **Step 1: Add the new index**

Open `firestore.indexes.json`. Inside the `indexes` array, add:

```json
    {
      "collectionGroup": "answers",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "skill", "order": "ASCENDING" },
        { "fieldPath": "timestamp", "order": "DESCENDING" }
      ]
    }
```

Place alongside the existing `answers` indexes. Watch JSON commas.

- [ ] **Step 2: Validate JSON**

```
cd /Users/lukemccarthy/pantherprep && node -e "JSON.parse(require('fs').readFileSync('firestore.indexes.json','utf8')); console.log('ok')"
```
Expected: `ok`.

- [ ] **Step 3: Deploy the index**

```
cd /Users/lukemccarthy/pantherprep && firebase deploy --only firestore:indexes 2>&1 | tail -15
```
Expected: "Deploy complete!" Index builds in the background.

- [ ] **Step 4: Commit**

```bash
cd /Users/lukemccarthy/pantherprep
git add firestore.indexes.json
git commit -m "Add composite index: answers(skill, timestamp) for detail page recent-activity"
```

---

## Task 4: Create `components/skills/skill-row.tsx`

**Files:**
- Create: `components/skills/skill-row.tsx`

Shared single-row component used by the catalog and the dashboard Skills tab preview. Keeps styling consistent across both surfaces.

- [ ] **Step 1: Create the file**

```tsx
"use client";

import Link from "next/link";
import { skillLabel } from "@/lib/adaptive/adaptive-engine";
import type { AggregatedSkillData } from "@/lib/skill-mapping";

interface SkillRowProps {
  taxonomyKey: string;
  data: AggregatedSkillData;
  course: string;
}

function tierColor(mastery: number, total: number): string {
  if (total === 0) return "border-l-slate-500";
  if (mastery >= 0.8) return "border-l-emerald-400";
  if (mastery >= 0.6) return "border-l-lime-400";
  if (mastery >= 0.4) return "border-l-amber-400";
  if (mastery >= 0.2) return "border-l-orange-400";
  return "border-l-red-400";
}

function tierTextColor(mastery: number, total: number): string {
  if (total === 0) return "text-text-muted";
  if (mastery >= 0.8) return "text-emerald-400";
  if (mastery >= 0.6) return "text-lime-400";
  if (mastery >= 0.4) return "text-amber-400";
  if (mastery >= 0.2) return "text-orange-400";
  return "text-red-400";
}

export function SkillRow({ taxonomyKey, data, course }: SkillRowProps) {
  const href = `/skills/${course}/${taxonomyKey}`;
  const label = skillLabel(taxonomyKey);
  const hasData = data.total > 0;
  const percent = hasData ? Math.round(data.mastery * 100) : null;

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-lg border border-border-primary bg-bg-secondary border-l-[3px] ${tierColor(
        data.mastery,
        data.total
      )} px-4 py-3 text-sm transition hover:border-panther-red/30`}
    >
      <div className="min-w-0 flex-1">
        <div className="truncate font-semibold text-text-primary">{label}</div>
        <div className="truncate text-xs text-text-muted">
          {hasData ? `${data.correct}/${data.total} correct` : "No data yet"}
        </div>
      </div>
      <div className={`w-14 text-right font-mono ${tierTextColor(data.mastery, data.total)}`}>
        {percent != null ? `${percent}%` : "—"}
      </div>
      <span className="text-text-muted">›</span>
    </Link>
  );
}
```

- [ ] **Step 2: Type-check**

```
cd /Users/lukemccarthy/pantherprep && npx tsc --noEmit 2>&1 | grep "skill-row" | head
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
cd /Users/lukemccarthy/pantherprep
git add components/skills/skill-row.tsx
git commit -m "Add SkillRow component for catalog + dashboard preview reuse"
```

---

## Task 5: Create `components/skills/skill-catalog.tsx` + `/skills/[course]/page.tsx`

**Files:**
- Create: `components/skills/skill-catalog.tsx`
- Create: `app/(authenticated)/skills/[course]/page.tsx`

- [ ] **Step 1: Create the catalog component**

Create `components/skills/skill-catalog.tsx`:

```tsx
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GlassCard } from "@/components/ui/glass-card";
import { SkillRow } from "./skill-row";
import {
  MATH_SKILLS,
  RW_SKILLS,
} from "@/lib/adaptive/adaptive-engine";
import {
  getProfileSkillData,
  type AggregatedSkillData,
} from "@/lib/skill-mapping";
import type { AdaptiveProfile } from "@/lib/adaptive/performance-service";

type TierFilter = "all" | "weak" | "medium" | "strong";

const COURSES: { value: string; label: string }[] = [
  { value: "sat-math", label: "SAT Math" },
  { value: "sat-rw", label: "SAT R&W" },
  { value: "nmsqt-math", label: "NMSQT Math" },
  { value: "nmsqt-rw", label: "NMSQT R&W" },
  { value: "psat89-math", label: "PSAT 8/9 Math" },
  { value: "psat89-rw", label: "PSAT 8/9 R&W" },
];

interface SkillCatalogProps {
  course: string;
  profile: AdaptiveProfile | null;
}

function tierOf(data: AggregatedSkillData): TierFilter {
  if (data.total === 0) return "weak";
  if (data.mastery >= 0.8) return "strong";
  if (data.mastery >= 0.5) return "medium";
  return "weak";
}

export function SkillCatalog({ course, profile }: SkillCatalogProps) {
  const router = useRouter();
  const taxonomy: Record<string, string[]> = useMemo(
    () => (course.includes("math") ? MATH_SKILLS : RW_SKILLS),
    [course]
  );
  const domains = Object.keys(taxonomy);
  const [activeDomain, setActiveDomain] = useState<string>(domains[0] ?? "");
  const [tierFilter, setTierFilter] = useState<TierFilter>("all");

  const skillsInDomain = taxonomy[activeDomain] ?? [];
  const aggregated = useMemo(
    () =>
      skillsInDomain.map((key) => ({
        key,
        data: getProfileSkillData(profile, key),
      })),
    [skillsInDomain, profile]
  );
  const filtered = useMemo(
    () =>
      aggregated.filter(({ data }) => {
        if (tierFilter === "all") return true;
        return tierOf(data) === tierFilter;
      }),
    [aggregated, tierFilter]
  );

  const courseLabel = COURSES.find((c) => c.value === course)?.label ?? course;

  return (
    <div className="mx-auto max-w-4xl">
      {/* Breadcrumb + course switcher */}
      <div className="mb-4 flex items-center justify-between">
        <div className="text-xs text-text-muted">
          <Link href="/dashboard" className="hover:text-text-secondary">
            Dashboard
          </Link>
          {" / "}
          <span className="text-text-secondary">Skills</span>
          {" / "}
          <span className="text-text-primary">{courseLabel}</span>
        </div>
        <select
          value={course}
          onChange={(e) => router.push(`/skills/${e.target.value}`)}
          className="rounded-radius-sm border border-border-default bg-bg-surface px-3 py-1.5 text-xs text-text-secondary outline-none focus:border-panther-red"
        >
          {COURSES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      {/* Title */}
      <h1 className="mb-1 font-display text-3xl tracking-[0.02em] text-white sm:text-[2.4rem]">
        Skill Catalog
      </h1>
      <p className="mb-6 text-sm text-text-muted">
        Browse every skill for {courseLabel}. Click a skill to see details and practice.
      </p>

      {/* Mastery tier filter */}
      <div className="mb-4 flex flex-wrap gap-2">
        {(["all", "weak", "medium", "strong"] as TierFilter[]).map((t) => (
          <button
            key={t}
            onClick={() => setTierFilter(t)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold capitalize transition ${
              t === tierFilter
                ? "bg-panther-red text-white"
                : "border border-border-primary bg-bg-secondary text-text-muted hover:text-text-secondary"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Domain tab strip */}
      <div className="mb-5 flex flex-wrap gap-2">
        {domains.map((d) => (
          <button
            key={d}
            onClick={() => setActiveDomain(d)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
              d === activeDomain
                ? "bg-panther-red text-white"
                : "border border-border-primary bg-bg-secondary text-text-muted hover:text-text-secondary"
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Skill rows */}
      {filtered.length === 0 ? (
        <GlassCard>
          <p className="text-sm text-text-muted">
            No skills match the current filter.{" "}
            <button
              onClick={() => setTierFilter("all")}
              className="text-panther-red hover:underline"
            >
              Clear filters
            </button>
          </p>
        </GlassCard>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map(({ key, data }) => (
            <SkillRow key={key} taxonomyKey={key} data={data} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Create the catalog route**

Create `app/(authenticated)/skills/[course]/page.tsx`:

```tsx
"use client";

import { use, useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { TopBar } from "@/components/layout/top-bar";
import { SkillCatalog } from "@/components/skills/skill-catalog";
import { useAuth } from "@/hooks/use-auth";
import { getAdaptiveProfile } from "@/lib/adaptive/performance-service";
import type { AdaptiveProfile } from "@/lib/adaptive/performance-service";

const VALID_COURSES = new Set([
  "sat-math",
  "sat-rw",
  "nmsqt-math",
  "nmsqt-rw",
  "psat89-math",
  "psat89-rw",
]);

export default function SkillCatalogPage({
  params,
}: {
  params: Promise<{ course: string }>;
}) {
  const { course } = use(params);
  const { user } = useAuth();
  const [profile, setProfile] = useState<AdaptiveProfile | null>(null);
  const [loading, setLoading] = useState(true);

  if (!VALID_COURSES.has(course)) {
    notFound();
  }

  useEffect(() => {
    if (!user?.uid) return;
    getAdaptiveProfile(user.uid)
      .then(setProfile)
      .finally(() => setLoading(false));
  }, [user?.uid]);

  return (
    <div className="min-h-screen">
      <TopBar />
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {loading ? (
          <p className="text-sm text-text-muted">Loading catalog…</p>
        ) : (
          <SkillCatalog course={course} profile={profile} />
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Build**

```
cd /Users/lukemccarthy/pantherprep && npm run build 2>&1 | tail -20
```

Expected: build succeeds and `/skills/[course]` appears in the route list.

- [ ] **Step 4: Commit**

```bash
cd /Users/lukemccarthy/pantherprep
git add components/skills/skill-catalog.tsx 'app/(authenticated)/skills/[course]/page.tsx'
git commit -m "SkillCatalog component + /skills/[course] route"
```

---

## Task 6: Create `skill-trendline.tsx` + `skill-recent-activity.tsx`

**Files:**
- Create: `components/skills/skill-trendline.tsx`
- Create: `components/skills/skill-recent-activity.tsx`

- [ ] **Step 1: Create the trendline component**

Create `components/skills/skill-trendline.tsx`:

```tsx
"use client";

import type { StoredAnswer } from "@/lib/adaptive/performance-service";

interface SkillTrendlineProps {
  answers: StoredAnswer[];  // already filtered to this skill, ordered desc by timestamp
}

interface DayBucket {
  date: string;  // YYYY-MM-DD
  correct: number;
  total: number;
}

function bucketByDay(answers: StoredAnswer[], days = 14): DayBucket[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const buckets: DayBucket[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    buckets.push({
      date: d.toISOString().split("T")[0],
      correct: 0,
      total: 0,
    });
  }
  const bucketsByDate = new Map(buckets.map((b) => [b.date, b]));

  for (const a of answers) {
    if (!a.timestamp) continue;
    const ts = a.timestamp.toDate ? a.timestamp.toDate() : new Date(a.timestamp as unknown as string);
    const key = ts.toISOString().split("T")[0];
    const bucket = bucketsByDate.get(key);
    if (!bucket) continue;
    bucket.total += 1;
    if (a.correct) bucket.correct += 1;
  }
  return buckets;
}

function tierBg(pct: number, total: number): string {
  if (total === 0) return "bg-slate-700";
  if (pct >= 0.8) return "bg-emerald-400";
  if (pct >= 0.6) return "bg-lime-400";
  if (pct >= 0.4) return "bg-amber-400";
  if (pct >= 0.2) return "bg-orange-400";
  return "bg-red-400";
}

export function SkillTrendline({ answers }: SkillTrendlineProps) {
  const buckets = bucketByDay(answers);
  const maxBarHeight = 40;

  return (
    <div>
      <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-muted">
        14-day trend
      </div>
      <div className="flex items-end gap-1" style={{ height: `${maxBarHeight}px` }}>
        {buckets.map((b, i) => {
          const pct = b.total > 0 ? b.correct / b.total : 0;
          const heightPct = b.total > 0 ? Math.max(pct * 100, 8) : 4;
          return (
            <div
              key={i}
              className={`flex-1 rounded-t ${tierBg(pct, b.total)}`}
              style={{ height: `${heightPct}%`, opacity: b.total > 0 ? 1 : 0.35 }}
              title={b.total > 0 ? `${b.date}: ${b.correct}/${b.total}` : `${b.date}: no activity`}
            />
          );
        })}
      </div>
      <div className="mt-1 flex justify-between text-[10px] text-text-muted">
        <span>{buckets[0]?.date.slice(5) ?? ""}</span>
        <span>{buckets[buckets.length - 1]?.date.slice(5) ?? ""}</span>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create the recent activity component**

Create `components/skills/skill-recent-activity.tsx`:

```tsx
"use client";

import { useState } from "react";
import { renderMath } from "@/lib/katex-render";
import type { StoredAnswer } from "@/lib/adaptive/performance-service";

interface SkillRecentActivityProps {
  answers: StoredAnswer[];  // expected ordered desc by timestamp
}

export function SkillRecentActivity({ answers }: SkillRecentActivityProps) {
  const recent = answers.slice(0, 5);
  const [selected, setSelected] = useState<StoredAnswer | null>(null);

  if (recent.length === 0) {
    return (
      <div>
        <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-muted">
          Recent activity
        </div>
        <p className="text-xs text-text-muted">No practice yet.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-muted">
        Recent activity
      </div>
      <div className="flex gap-2">
        {recent.map((a) => {
          const skipped = !a.selectedAnswer;
          const bg = skipped
            ? "bg-slate-500"
            : a.correct
            ? "bg-emerald-400"
            : "bg-red-400";
          return (
            <button
              key={a.id}
              onClick={() => setSelected(a)}
              className={`h-6 w-6 rounded ${bg} transition hover:scale-110`}
              title={skipped ? "Skipped" : a.correct ? "Correct" : "Incorrect"}
            />
          );
        })}
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="max-h-[80vh] w-full max-w-xl overflow-y-auto rounded-radius-md border border-border-default bg-bg-card p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-start justify-between gap-3">
              <div className="text-xs text-text-muted">
                {selected.domain} &middot; {selected.skill}
              </div>
              <button
                onClick={() => setSelected(null)}
                className="text-xs text-text-muted hover:text-text-secondary"
              >
                ✕
              </button>
            </div>
            <div className="mb-4 text-sm text-text-primary">
              {renderMath(selected.stem || "")}
            </div>
            {selected.choices && selected.choices.length > 0 && (
              <div className="mb-4 flex flex-col gap-1.5">
                {selected.choices.map((c) => {
                  const isUser = c.key === selected.selectedAnswer;
                  const isCorrect = c.key === selected.correctAnswer;
                  let cls = "bg-bg-secondary text-text-muted";
                  if (isCorrect) cls = "bg-emerald-400/15 text-emerald-300";
                  else if (isUser) cls = "bg-red-400/15 text-red-300";
                  return (
                    <div
                      key={c.key}
                      className={`flex gap-2 rounded-md px-3 py-1.5 text-xs ${cls}`}
                    >
                      <span className="font-bold">{c.key}.</span>
                      <span className="flex-1">{renderMath(c.text)}</span>
                      {isUser && <span className="text-[10px]">your answer</span>}
                      {isCorrect && !isUser && <span className="text-[10px]">correct</span>}
                    </div>
                  );
                })}
              </div>
            )}
            {selected.explanation && (
              <div className="rounded-radius-sm border border-border-default bg-bg-surface p-3 text-xs text-text-secondary">
                <div className="mb-1 font-semibold text-text-muted">Explanation</div>
                {renderMath(selected.explanation)}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Type-check**

```
cd /Users/lukemccarthy/pantherprep && npx tsc --noEmit 2>&1 | grep "skill-trendline\|skill-recent-activity" | head
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
cd /Users/lukemccarthy/pantherprep
git add components/skills/skill-trendline.tsx components/skills/skill-recent-activity.tsx
git commit -m "Add SkillTrendline + SkillRecentActivity helper components"
```

---

## Task 7: Create `components/skills/skill-detail.tsx` + `/skills/[course]/[skill]/page.tsx`

**Files:**
- Create: `components/skills/skill-detail.tsx`
- Create: `app/(authenticated)/skills/[course]/[skill]/page.tsx`

This is the biggest task. The detail component owns the left/right column layout, the related-skills strip, and the state-flip to `PracticeRunner`.

- [ ] **Step 1: Create the skill-detail component**

Create `components/skills/skill-detail.tsx`:

```tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GlassCard } from "@/components/ui/glass-card";
import { PracticeRunner } from "@/components/practice/practice-runner";
import { SkillTrendline } from "./skill-trendline";
import { SkillRecentActivity } from "./skill-recent-activity";
import { SkillRow } from "./skill-row";
import {
  MATH_SKILLS,
  RW_SKILLS,
  skillLabel,
} from "@/lib/adaptive/adaptive-engine";
import {
  getProfileSkillData,
  getRecentAnswersForTaxonomyKey,
  type AggregatedSkillData,
} from "@/lib/skill-mapping";
import { getSkillDescription } from "@/lib/skill-descriptions";
import { getQuestionsBySkill, type PracticeBatch } from "@/lib/practice-question-source";
import type {
  AdaptiveProfile,
  StoredAnswer,
} from "@/lib/adaptive/performance-service";

interface SkillDetailProps {
  uid: string;
  email: string;
  course: string;
  taxonomyKey: string;
  profile: AdaptiveProfile | null;
}

const COURSE_LABELS: Record<string, string> = {
  "sat-math": "SAT Math",
  "sat-rw": "SAT R&W",
  "nmsqt-math": "NMSQT Math",
  "nmsqt-rw": "NMSQT R&W",
  "psat89-math": "PSAT 8/9 Math",
  "psat89-rw": "PSAT 8/9 R&W",
};

function masteryColor(m: number, total: number): string {
  if (total === 0) return "text-text-muted";
  if (m >= 0.8) return "text-emerald-400";
  if (m >= 0.6) return "text-lime-400";
  if (m >= 0.4) return "text-amber-400";
  if (m >= 0.2) return "text-orange-400";
  return "text-red-400";
}

function findDomain(course: string, taxonomyKey: string): string | null {
  const taxonomy: Record<string, string[]> = course.includes("math") ? MATH_SKILLS : RW_SKILLS;
  for (const [domain, skills] of Object.entries(taxonomy)) {
    if (skills.includes(taxonomyKey)) return domain;
  }
  return null;
}

function siblingsInDomain(course: string, domain: string, excludeKey: string): string[] {
  const taxonomy: Record<string, string[]> = course.includes("math") ? MATH_SKILLS : RW_SKILLS;
  return (taxonomy[domain] ?? []).filter((s) => s !== excludeKey);
}

export function SkillDetail({ uid, email, course, taxonomyKey, profile }: SkillDetailProps) {
  const domain = findDomain(course, taxonomyKey);
  if (!domain) {
    notFound();
  }

  const label = skillLabel(taxonomyKey);
  const description = getSkillDescription(taxonomyKey);
  const data = useMemo(() => getProfileSkillData(profile, taxonomyKey), [profile, taxonomyKey]);

  const [recentAnswers, setRecentAnswers] = useState<StoredAnswer[]>([]);
  const [recentLoading, setRecentLoading] = useState(true);
  const [recentError, setRecentError] = useState(false);
  const [session, setSession] = useState<PracticeBatch | null>(null);
  const [launching, setLaunching] = useState(false);
  const [launchError, setLaunchError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setRecentLoading(true);
    setRecentError(false);
    getRecentAnswersForTaxonomyKey(uid, taxonomyKey, 100)
      .then((rows) => {
        if (!cancelled) setRecentAnswers(rows);
      })
      .catch(() => {
        if (!cancelled) setRecentError(true);
      })
      .finally(() => {
        if (!cancelled) setRecentLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [uid, taxonomyKey]);

  const handlePractice = async () => {
    setLaunching(true);
    setLaunchError(null);
    try {
      const batch = await getQuestionsBySkill(course, taxonomyKey, 10);
      if (batch.questions.length === 0) {
        setLaunchError("No content yet for this skill — check back soon.");
        return;
      }
      setSession(batch);
    } catch (e) {
      setLaunchError((e as Error).message);
    } finally {
      setLaunching(false);
    }
  };

  const handlePracticeAgain = async () => {
    try {
      const batch = await getQuestionsBySkill(course, taxonomyKey, 10);
      if (batch.questions.length === 0) {
        setSession(null);
        setLaunchError("No more content available.");
        return;
      }
      setSession(batch);
    } catch {
      setSession(null);
      setLaunchError("Failed to load next batch.");
    }
  };

  // --- Practice mode ---
  if (session) {
    return (
      <PracticeRunner
        uid={uid}
        email={email}
        course={course}
        skill={taxonomyKey}
        skillLabel={label}
        testType={`${course}-skill-practice`}
        questions={session.questions}
        fallbackNotes={session.fallbackNotes}
        onExit={() => setSession(null)}
        onPracticeAgain={handlePracticeAgain}
      />
    );
  }

  // --- Detail mode ---
  const difficultyBreakdown = useMemo(() => {
    const agg = { F: { correct: 0, total: 0 }, M: { correct: 0, total: 0 }, C: { correct: 0, total: 0 } };
    for (const a of recentAnswers) {
      const key = (a.difficulty ?? "M") as "F" | "M" | "C";
      agg[key].total += 1;
      if (a.correct) agg[key].correct += 1;
    }
    return agg;
  }, [recentAnswers]);

  const errorPatterns = Object.entries(data.errorPatterns)
    .filter(([, count]) => (count as number) > 0)
    .sort((a, b) => (b[1] as number) - (a[1] as number))
    .slice(0, 3);

  const siblings = siblingsInDomain(course, domain, taxonomyKey).slice(0, 5);

  return (
    <div className="mx-auto max-w-5xl">
      {/* Breadcrumb */}
      <div className="mb-4 text-xs text-text-muted">
        <Link href="/dashboard" className="hover:text-text-secondary">
          Dashboard
        </Link>
        {" / "}
        <Link href={`/skills/${course}`} className="hover:text-text-secondary">
          Skills
        </Link>
        {" / "}
        <Link href={`/skills/${course}`} className="hover:text-text-secondary">
          {COURSE_LABELS[course] ?? course}
        </Link>
        {" / "}
        <span className="text-text-primary">{label}</span>
      </div>

      {/* Two-column main */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-[2fr_3fr]">
        {/* Left column */}
        <div className="flex flex-col gap-4">
          <GlassCard>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-muted">
              {domain}
            </div>
            <h1 className="mb-3 font-display text-3xl leading-tight tracking-[0.02em] text-white">
              {label}
            </h1>
            <p className="mb-5 text-sm leading-relaxed text-text-secondary">{description}</p>

            <div className="mb-4 flex items-baseline gap-3">
              <div className={`font-display text-[4rem] leading-none ${masteryColor(data.mastery, data.total)}`}>
                {data.total > 0 ? Math.round(data.mastery * 100) + "%" : "—"}
              </div>
              <div className="text-xs text-text-muted">
                {data.total > 0 ? `${data.correct}/${data.total} all-time` : "No data yet"}
                {data.nextReview && (
                  <div className="mt-1">Next review: {data.nextReview}</div>
                )}
              </div>
            </div>

            <button
              onClick={handlePractice}
              disabled={launching}
              className="w-full rounded-radius-md bg-panther-red py-3 text-sm font-semibold text-white transition hover:bg-panther-red/90 disabled:opacity-40"
            >
              {launching ? "Loading…" : "Practice this skill →"}
            </button>
            {launchError && (
              <p className="mt-3 text-xs text-amber-300">{launchError}</p>
            )}
          </GlassCard>

          {errorPatterns.length > 0 && (
            <GlassCard>
              <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-muted">
                Error patterns
              </div>
              <div className="flex flex-wrap gap-2">
                {errorPatterns.map(([cat, count]) => (
                  <span
                    key={cat}
                    className="rounded-full border border-red-400/20 bg-red-400/10 px-3 py-1 text-[11px] text-red-400"
                  >
                    {skillLabel(cat)} ×{count as number}
                  </span>
                ))}
              </div>
            </GlassCard>
          )}
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-4">
          <GlassCard>
            {recentLoading ? (
              <p className="text-xs text-text-muted">Loading trend…</p>
            ) : recentError ? (
              <p className="text-xs text-amber-300">Couldn&apos;t load recent activity.</p>
            ) : (
              <SkillTrendline answers={recentAnswers} />
            )}
          </GlassCard>

          <GlassCard>
            <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-muted">
              By difficulty
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="rounded-md bg-emerald-400/10 px-3 py-2">
                <div className="text-[10px] uppercase text-text-muted">Easy</div>
                <div className="mt-1 font-semibold text-emerald-400">
                  {difficultyBreakdown.F.correct}/{difficultyBreakdown.F.total}
                </div>
              </div>
              <div className="rounded-md bg-amber-400/10 px-3 py-2">
                <div className="text-[10px] uppercase text-text-muted">Medium</div>
                <div className="mt-1 font-semibold text-amber-400">
                  {difficultyBreakdown.M.correct}/{difficultyBreakdown.M.total}
                </div>
              </div>
              <div className="rounded-md bg-red-400/10 px-3 py-2">
                <div className="text-[10px] uppercase text-text-muted">Hard</div>
                <div className="mt-1 font-semibold text-red-400">
                  {difficultyBreakdown.C.correct}/{difficultyBreakdown.C.total}
                </div>
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <SkillRecentActivity answers={recentAnswers} />
          </GlassCard>
        </div>
      </div>

      {/* Related skills */}
      {siblings.length > 0 && (
        <div className="mt-6">
          <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-muted">
            Related skills in {domain}
          </div>
          <div className="flex flex-col gap-2">
            {siblings
              .map((key) => ({ key, data: getProfileSkillData(profile, key) }))
              .sort((a, b) => a.data.mastery - b.data.mastery)
              .map(({ key, data: siblingData }) => (
                <SkillRow
                  key={key}
                  taxonomyKey={key}
                  data={siblingData}
                  course={course}
                />
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Create the detail route**

Create `app/(authenticated)/skills/[course]/[skill]/page.tsx`:

```tsx
"use client";

import { use, useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { TopBar } from "@/components/layout/top-bar";
import { SkillDetail } from "@/components/skills/skill-detail";
import { useAuth } from "@/hooks/use-auth";
import { getAdaptiveProfile } from "@/lib/adaptive/performance-service";
import { MATH_SKILLS, RW_SKILLS } from "@/lib/adaptive/adaptive-engine";
import type { AdaptiveProfile } from "@/lib/adaptive/performance-service";

const VALID_COURSES = new Set([
  "sat-math",
  "sat-rw",
  "nmsqt-math",
  "nmsqt-rw",
  "psat89-math",
  "psat89-rw",
]);

function skillExistsInCourse(course: string, skill: string): boolean {
  const taxonomy: Record<string, string[]> = course.includes("math") ? MATH_SKILLS : RW_SKILLS;
  for (const skills of Object.values(taxonomy)) {
    if (skills.includes(skill)) return true;
  }
  return false;
}

export default function SkillDetailPage({
  params,
}: {
  params: Promise<{ course: string; skill: string }>;
}) {
  const { course, skill } = use(params);
  const { user } = useAuth();
  const [profile, setProfile] = useState<AdaptiveProfile | null>(null);
  const [loading, setLoading] = useState(true);

  if (!VALID_COURSES.has(course) || !skillExistsInCourse(course, skill)) {
    notFound();
  }

  useEffect(() => {
    if (!user?.uid) return;
    getAdaptiveProfile(user.uid)
      .then(setProfile)
      .finally(() => setLoading(false));
  }, [user?.uid]);

  if (!user) return null;

  return (
    <div className="min-h-screen">
      <TopBar />
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {loading ? (
          <p className="text-sm text-text-muted">Loading skill details…</p>
        ) : (
          <SkillDetail
            uid={user.uid}
            email={user.email ?? ""}
            course={course}
            taxonomyKey={skill}
            profile={profile}
          />
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Build**

```
cd /Users/lukemccarthy/pantherprep && npm run build 2>&1 | tail -20
```

Expected: build succeeds. Both `/skills/[course]` and `/skills/[course]/[skill]` appear in the route list.

- [ ] **Step 4: Commit**

```bash
cd /Users/lukemccarthy/pantherprep
git add components/skills/skill-detail.tsx 'app/(authenticated)/skills/[course]/[skill]/page.tsx'
git commit -m "SkillDetail component + /skills/[course]/[skill] route with PracticeRunner flip"
```

---

## Task 8: Shrink dashboard Skills tab to preview + wire clickable recommendations

**Files:**
- Modify: `app/(authenticated)/dashboard/page.tsx`

- [ ] **Step 1: Replace the `StudentSkills` function**

Find the `StudentSkills` function in `app/(authenticated)/dashboard/page.tsx` (around line 316). Replace it with:

```tsx
function StudentSkills({
  profile,
  course,
}: {
  profile: AdaptiveProfile;
  course: Course;
}) {
  const allSkills = useMemo(() => {
    const taxonomy: Record<string, string[]> = course.includes("math") ? MATH_SKILLS : RW_SKILLS;
    const out: Array<{ key: string; data: ReturnType<typeof getProfileSkillData> }> = [];
    for (const skills of Object.values(taxonomy)) {
      for (const key of skills as string[]) {
        out.push({ key, data: getProfileSkillData(profile, key) });
      }
    }
    return out;
  }, [profile, course]);

  const weakest = useMemo(() => {
    // Sort by ascending mastery; untested (total=0) treated as 0 mastery.
    return [...allSkills]
      .sort((a, b) => {
        if (a.data.total === 0 && b.data.total > 0) return -1;
        if (b.data.total === 0 && a.data.total > 0) return 1;
        return a.data.mastery - b.data.mastery;
      })
      .slice(0, 6);
  }, [allSkills]);

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-text-muted">
          Top skills to focus on
        </h3>
        <Link
          href={`/skills/${course}`}
          className="text-xs text-panther-red transition hover:text-panther-red/80"
        >
          See full catalog →
        </Link>
      </div>
      <div className="flex flex-col gap-2">
        {weakest.map(({ key, data }) => (
          <SkillRow key={key} taxonomyKey={key} data={data} course={course} />
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Add imports at the top of the file**

At the top of `app/(authenticated)/dashboard/page.tsx`, add (alongside existing imports):

```ts
import Link from "next/link";
import { SkillRow } from "@/components/skills/skill-row";
import { getProfileSkillData, sourceToTaxonomyKey } from "@/lib/skill-mapping";
```

`useMemo` and `MATH_SKILLS`/`RW_SKILLS` should already be imported — confirm.

- [ ] **Step 3: Update the StudentView caller to pass `course`**

Find the JSX call `<StudentSkills profile={profile} taxonomy={...} .../>` in `StudentView`. Replace it with:

```tsx
<StudentSkills profile={profile} course={course} />
```

Remove the `taxonomy`, `selectedDomain`, `onSelectDomain` props — they no longer exist.

- [ ] **Step 4: Remove the now-unused `SkillRow` function** (the local one) and related state.

The existing local `SkillRow` function in `dashboard/page.tsx` (near line 359) is the OLD row component that displayed SM-2 data. Delete it — we're now using the imported `SkillRow` from `components/skills/skill-row.tsx` which is a simpler link row.

Also delete:
- The `selectedDomain` / `setSelectedDomain` state in `StudentView` (or wherever it was declared — grep the file)
- Any helper functions that only fed the old `SkillRow` (`masteryBg`, `masteryColor`, `masteryBarColor` if they're only referenced inside the deleted code — leave them if other callers exist)

Use grep to confirm before deleting.

- [ ] **Step 5: Wire clickable recommendations on Overview tab**

Find the `StudentOverview` function (around line 219). Locate the recommendations rendering block (the loop over `recs`). Wrap each rec row in a `<Link>` that routes to the skill detail page via reverse lookup:

```tsx
{recs.slice(0, 5).map((rec: Recommendation, i: number) => {
  const taxonomyKey = sourceToTaxonomyKey(rec.skill);
  const href = taxonomyKey ? `/skills/${course}/${taxonomyKey}` : `/skills/${course}`;
  return (
    <Link
      key={i}
      href={href}
      className="flex items-center gap-3 rounded-lg border border-border-primary bg-bg-primary p-3 transition hover:border-panther-red/30"
    >
      <div
        className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold ${
          i < 3 ? "bg-panther-red text-white" : "bg-bg-secondary text-text-muted"
        }`}
      >
        {rec.priority}
      </div>
      <div className="flex-1">
        <div className="text-sm font-semibold">{skillLabel(rec.skill)}</div>
        <div className="text-xs text-text-muted">
          {rec.domain} &middot; {rec.reason}
        </div>
      </div>
      <span className="text-xs text-text-muted">›</span>
    </Link>
  );
})}
```

Read the existing recommendation rendering code first — adapt the exact JSX structure to match the existing pattern. The key change is wrapping in `<Link>` with the reverse-lookup href. Also ensure `course` is available in `StudentOverview`'s scope; if it isn't, add it to the props.

- [ ] **Step 6: Wire clickable recommendations on Practice tab**

Find the `StudentPractice` function (around line 426). Locate the recommendation rendering block (similar to Overview). Apply the same Link wrapping pattern as Step 5. `course` is already a prop on `StudentPractice`.

- [ ] **Step 7: Build**

```
cd /Users/lukemccarthy/pantherprep && npm run build 2>&1 | tail -20
```

Expected: build succeeds. Common issues:
- `SkillRow` import conflict with the old local `SkillRow` — ensure the local one is deleted.
- `masteryBg` / `masteryColor` / `masteryBarColor` unused imports — delete them if so.
- `sourceToTaxonomyKey` not found → verify Task 1 landed and the import path is correct.

- [ ] **Step 8: Commit**

```bash
cd /Users/lukemccarthy/pantherprep
git add 'app/(authenticated)/dashboard/page.tsx'
git commit -m "Dashboard: Skills tab becomes 6-item preview; Overview/Practice recs clickable"
```

---

## Task 9: Wire clickable skill tags in `PastTestsView`

**Files:**
- Modify: `components/dashboard/past-tests-view.tsx`

- [ ] **Step 1: Locate the skill tag rendering**

```
cd /Users/lukemccarthy/pantherprep && grep -n "a.domain\|a.skill" components/dashboard/past-tests-view.tsx
```

There should be a span that renders `{a.domain} · {a.skill}` inside each question card in the detail view. That's the target.

- [ ] **Step 2: Add the import**

At the top of `components/dashboard/past-tests-view.tsx`, alongside the existing imports, add:

```ts
import Link from "next/link";
import { sourceToTaxonomyKey } from "@/lib/skill-mapping";
```

- [ ] **Step 3: Wrap the skill tag in a Link**

Replace the existing skill tag span:

```tsx
<span>
  {a.domain} · {a.skill}
</span>
```

with:

```tsx
{(() => {
  const taxonomyKey = sourceToTaxonomyKey(a.skill);
  if (!taxonomyKey) {
    return <span>{a.domain} · {a.skill}</span>;
  }
  return (
    <Link
      href={`/skills/${a.course}/${taxonomyKey}`}
      className="hover:text-panther-red transition"
    >
      {a.domain} · {a.skill}
    </Link>
  );
})()}
```

Note: `a.course` is on the answer row (set by `completeTestSession`). Verify this by grepping for `course` in the `StoredAnswer` interface — it should be there. If not, use the session's course (which is available in the summary already fetched at the top of the detail view).

- [ ] **Step 4: Build**

```
cd /Users/lukemccarthy/pantherprep && npm run build 2>&1 | tail -15
```

Expected: build succeeds.

- [ ] **Step 5: Commit**

```bash
cd /Users/lukemccarthy/pantherprep
git add components/dashboard/past-tests-view.tsx
git commit -m "PastTestsView: make per-question skill tags clickable to detail page"
```

---

## Task 10: Manual verification

**Files:** none — ops only.

- [ ] **Step 1: Deploy to prod for testing**

```
cd /Users/lukemccarthy/pantherprep && firebase deploy --only hosting 2>&1 | tail -10
```

Expected: deploy complete.

- [ ] **Step 2: Catalog smoke test**

1. Open `https://pantherprep.web.app/skills/sat-math` in a browser while signed in.
2. Confirm the catalog renders with the breadcrumb, course switcher, mastery tier filters, domain tab strip, and skill rows.
3. Click the domain tabs — confirm the row list changes.
4. Click mastery tier filters — confirm filtering works.
5. Change the course switcher to SAT R&W — confirm the URL updates to `/skills/sat-rw` and the domain list changes.
6. Click a skill row — confirm it routes to `/skills/sat-math/{skill}`.

- [ ] **Step 3: Detail page smoke test**

1. On the detail page, confirm:
   - Breadcrumb renders and each segment is clickable.
   - Skill name, domain tag, description, mastery hero render.
   - Left column: Practice button, error patterns (if any).
   - Right column: 14-day trend (may be mostly empty bars), difficulty breakdown, recent activity dots.
   - Related skills strip at the bottom shows 5 siblings sorted by weakest mastery.
2. Click a recent-activity dot (if any) — confirm the modal opens with the question stem and explanation.
3. Click a related skill — confirm routing to that skill's detail page.

- [ ] **Step 4: Practice inline test**

1. On the detail page, click **Practice this skill**.
2. Confirm the detail view gets replaced by the `PracticeRunner` landing card. URL stays the same.
3. Start the session, answer 2-3 questions, click Exit.
4. Confirm you return to the detail view (not the catalog or dashboard).
5. Click Practice again, finish all 10 questions.
6. Confirm the results card renders with the practice-again / back buttons.
7. Click **Back** — confirm return to the detail view with updated mastery (page may need a refresh to see the delta; that's spec E's problem).

- [ ] **Step 5: Dashboard Skills tab test**

1. Go to `/dashboard`.
2. Click the Skills tab.
3. Confirm it shows 6 weakest skills (not 25+ taxonomy entries).
4. Confirm each row shows real mastery data — NOT "No data yet" for skills you've practiced.
5. Click a row — confirm routing to the detail page.
6. Click "See full catalog →" — confirm routing to `/skills/[course]`.

- [ ] **Step 6: Clickable recommendations test**

1. Go to the Overview tab on the dashboard.
2. Click any recommendation entry.
3. Confirm it routes to the corresponding skill detail page.
4. Repeat for the Practice tab recommendations.

- [ ] **Step 7: Past Tests clickable skill tag test**

1. Go to the Past Tests tab.
2. Click any past session to open the detail view.
3. Scroll to a question card and find the domain/skill tag.
4. Hover the tag — it should highlight as a link.
5. Click the tag — confirm routing to the skill detail page.

- [ ] **Step 8: Empty state tests**

1. Navigate to a thin skill like `/skills/sat-math/quadratic_formula`. Click Practice — confirm the runner launches with ~10 questions (domain fallback) and fallback notes appear on the results.
2. Navigate to a nonexistent skill URL like `/skills/sat-math/bogus_skill`. Confirm a 404 page renders (via `notFound()`).
3. Navigate to a nonexistent course URL like `/skills/invalid-course`. Confirm a 404 page renders.

- [ ] **Step 9: Mobile responsive test**

1. Resize to 375px (or use DevTools device emulation).
2. Confirm the catalog collapses cleanly.
3. Confirm the detail page stacks columns (left column content appears first, right column content below).
4. Confirm breadcrumbs don't overflow.

- [ ] **Step 10: Report**

Tell Luke:
- Did all 8 smoke tests pass?
- Any surprises or visual issues?
- Any Firestore query errors in the browser console?

---

## Task 11: Merge + push + deploy

**Files:** none — ops.

- [ ] **Step 1: Confirm branch state**

```
cd /Users/lukemccarthy/pantherprep && git log --oneline feat/skill-catalog ^main 2>&1
```

Expected: 8-10 commits from Tasks 1-9.

- [ ] **Step 2: Checkout main + merge**

```
cd /Users/lukemccarthy/pantherprep && git checkout main
cd /Users/lukemccarthy/pantherprep && git merge --ff-only feat/skill-catalog
```

- [ ] **Step 3: Push**

```
cd /Users/lukemccarthy/pantherprep && git push origin main 2>&1 | tail -3
```

- [ ] **Step 4: Deploy hosting**

If not already deployed in Task 10:
```
cd /Users/lukemccarthy/pantherprep && firebase deploy --only hosting 2>&1 | tail -10
```

- [ ] **Step 5: Delete the feature branch**

```
cd /Users/lukemccarthy/pantherprep && git branch -d feat/skill-catalog
```

- [ ] **Step 6: Report**

Spec A shipped. The skill catalog + detail pages are live on prod. Spec E (mastery delta feedback) and spec C (Parker authoring pipeline) are the remaining pieces of the initiative.

---

## Out-of-scope follow-ups (do not implement here)

- **Concept content authoring** — spec C.
- **Mastery delta display** after practice completes — spec E.
- **Retry-wrong-only mode** on Practice Again — deferred.
- **Free-text search** across skills — deferred.
- **Teacher view changes** — out of scope.
- **Refactoring the existing `SkillRow`** beyond what's needed for the new version — ship first, polish later.
- **Accessibility audit** — tracked separately.

## Known caveats

- The trendline component buckets by ISO date string (`YYYY-MM-DD`), which is UTC-based. Students in different time zones may see activity appear on an unexpected day by up to 5 hours. Good enough for a 14-day view; fix later if it becomes an issue.
- The recent-activity modal uses `position: fixed` and doesn't trap focus — screen-reader accessibility is not audited.
- Course switcher uses a plain `<select>`, which looks native-ugly on some platforms. Style polish can come later.
- `sourceToTaxonomyKey` doesn't fuzzy-match. A recommendation with a source label that's 99% matched but has different casing or trailing whitespace will fall back to the catalog instead of routing to the detail. The seed data is clean so this shouldn't happen in practice, but it's a known gap.
