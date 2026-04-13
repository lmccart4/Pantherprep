# PantherPrep questionPool Seeding Implementation Plan (Spec D)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Seed Firestore `questionPool` with every question from the existing hardcoded diagnostic + practice-test banks, normalized to a schema specs A and B can query by course/skill/difficulty. Establish the data substrate for skill-based practice.

**Architecture:** `questionPool` is a derived index, not a source of truth. The hardcoded `questions.ts` files stay authoritative for the live test flow. A one-time seed script reads them, transforms shapes, and writes to Firestore via admin SDK with deterministic doc ids. Skills normalize to snake_case taxonomy keys via a committed mapping table; original human-readable labels are preserved in a `sourceSkill` field for display. Taxonomy can be expanded where source content exposes gaps.

**Tech Stack:** Next.js 15, TypeScript 5.7, Firebase Admin SDK, tsx (TypeScript-aware Node runner, already installed as a devDep from the adaptive-wiring plan).

**Spec:** [docs/superpowers/specs/2026-04-13-questionpool-seeding-design.md](../specs/2026-04-13-questionpool-seeding-design.md)

**Testing convention:** This repo has no automated test framework. Each task uses `npx tsc --noEmit` for type checks, `node --check` for script syntax, and manual verification via dry-run + audit for behavior. Do NOT add a test framework.

---

## File map

| File | Status | Purpose |
|---|---|---|
| `lib/adaptive/performance-service.ts` | modify | Extend `PoolQuestion` interface to the new shape |
| `lib/adaptive/adaptive-engine.ts` | modify | Add any new taxonomy keys/domains the skill-map audit exposes |
| `app/(authenticated)/practice-tests/sat/page.tsx` | modify | Import questions from sibling `questions.ts` instead of inlining |
| `app/(authenticated)/practice-tests/sat/questions.ts` | create | Extract `RW_QUESTIONS` + `MATH_QUESTIONS` from the page |
| `app/(authenticated)/practice-tests/nmsqt/page.tsx` | modify | Same pattern as sat |
| `app/(authenticated)/practice-tests/nmsqt/questions.ts` | create | Same pattern as sat |
| `app/(authenticated)/practice-tests/psat89/page.tsx` | modify | Same pattern as sat |
| `app/(authenticated)/practice-tests/psat89/questions.ts` | create | Same pattern as sat |
| `scripts/skill-mapping.ts` | create | Committed mapping: source skill string → `{taxonomyKey, domain}`. Luke reviews before seed runs. |
| `scripts/seed-question-pool.mjs` | create | Main seed script. Reads questions.ts files, transforms, writes via admin SDK batch. |
| `scripts/audit-question-pool.mjs` | create | Query Firestore, print inventory grouped by course + skill, flag thin skills. |
| `package.json` | modify | Add `seed:pool` and `audit:pool` npm scripts |

---

## Task 1: Extract practice-test QUESTIONS arrays to sibling `questions.ts` files

**Files:**
- Create: `app/(authenticated)/practice-tests/sat/questions.ts`
- Create: `app/(authenticated)/practice-tests/nmsqt/questions.ts`
- Create: `app/(authenticated)/practice-tests/psat89/questions.ts`
- Modify: `app/(authenticated)/practice-tests/sat/page.tsx`
- Modify: `app/(authenticated)/practice-tests/nmsqt/page.tsx`
- Modify: `app/(authenticated)/practice-tests/psat89/page.tsx`

Each practice-test page currently has two module-level `const` arrays: `RW_QUESTIONS` and `MATH_QUESTIONS`. Neither is exported, so the seed script can't import them. Extract each pair into a sibling `questions.ts` file with named exports — same pattern we used for the diagnostic pages in commit `1727d1b`.

- [ ] **Step 1: Start with sat/**

Open `app/(authenticated)/practice-tests/sat/page.tsx`. Find `const RW_QUESTIONS: Question[] = [` (should be around line 6) and `const MATH_QUESTIONS: Question[] = [` (around line 927). Note their line ranges.

Create `app/(authenticated)/practice-tests/sat/questions.ts` with exactly this shape, pasting the arrays in verbatim — do NOT alter any question data:

```ts
import type { Question } from "@/types/question";

export const RW_QUESTIONS: Question[] = [
  // <-- paste the exact RW_QUESTIONS array from page.tsx here, unchanged -->
];

export const MATH_QUESTIONS: Question[] = [
  // <-- paste the exact MATH_QUESTIONS array from page.tsx here, unchanged -->
];
```

- [ ] **Step 2: Update sat/page.tsx**

In `page.tsx`, delete the two inline arrays. Add near the top of the file (with the other imports):

```ts
import { RW_QUESTIONS, MATH_QUESTIONS } from "./questions";
```

The existing JSX usage `rwQuestions={RW_QUESTIONS} mathQuestions={MATH_QUESTIONS}` continues to work because the names are unchanged.

- [ ] **Step 3: Build-verify sat/**

Run:
```
cd /Users/lukemccarthy/pantherprep && npm run build 2>&1 | tail -15
```
Expected: build succeeds. If there's an error about `QUESTIONS` or types, you missed something in the paste — re-check the array boundaries.

- [ ] **Step 4: Repeat for nmsqt/ and psat89/**

Apply the exact same refactor to:
- `app/(authenticated)/practice-tests/nmsqt/page.tsx` + create `nmsqt/questions.ts`
- `app/(authenticated)/practice-tests/psat89/page.tsx` + create `psat89/questions.ts`

Each file has its own `RW_QUESTIONS` and `MATH_QUESTIONS` (named identically; they're local to each file). Move each pair to the sibling `questions.ts`.

- [ ] **Step 5: Full build**

Run:
```
cd /Users/lukemccarthy/pantherprep && npm run build 2>&1 | tail -15
```
Expected: success. All three practice-test routes appear in the build output.

- [ ] **Step 6: Commit**

```bash
cd /Users/lukemccarthy/pantherprep
git add 'app/(authenticated)/practice-tests/'
git commit -m "Extract practice-test QUESTIONS arrays to questions.ts for importability"
```

---

## Task 2: Extend `PoolQuestion` type to the new shape

**Files:**
- Modify: `lib/adaptive/performance-service.ts` (the `PoolQuestion` interface at lines 266-280)

- [ ] **Step 1: Replace the interface**

Open `lib/adaptive/performance-service.ts`. Find the `PoolQuestion` interface (around lines 266-280, after the `// QUESTION POOL` comment). Replace the entire interface with:

```ts
export interface PoolQuestion {
  // Identity — Firestore doc id = `${sourceTestType}__${sourceId}`
  sourceTestType: string;  // "sat-math-diagnostic" | "sat-practice" | etc.
  sourceId: string;        // original id from questions.ts (e.g. "diag-sat-math-1")

  // Routing / grouping
  course: string;          // "sat-math" | "sat-rw" | "nmsqt-math" | ...
  testType: "sat" | "nmsqt" | "psat89";
  section: "math" | "rw";
  domain: string;          // must match a key in MATH_SKILLS / RW_SKILLS
  skill: string;           // snake_case taxonomy key
  sourceSkill: string;     // original human label from the source question
  difficulty: "F" | "M" | "C";
  module?: number;         // 1 or 2 when the source identifies a module

  // Content
  type: "mc" | "spr";
  passage?: string;        // R&W passage text, omitted for math
  stem: string;
  choices: { key: string; text: string }[];  // empty for spr
  correctAnswer: string;
  explanation: string;
  explanations?: Record<string, string>;  // per-choice explanations when present

  // Metadata
  tags?: string[];         // ["diagnostic"] | ["practice-test"]
  katex: boolean;          // true when stem/explanation contains `$...$`
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

- [ ] **Step 2: Verify `Timestamp` is already imported**

Look at the top of `lib/adaptive/performance-service.ts`. The existing import line should already include `Timestamp`:
```ts
import { ..., Timestamp } from "firebase/firestore";
```
If it's not there, add it to the existing destructured import.

- [ ] **Step 3: Type-check**

Run:
```
cd /Users/lukemccarthy/pantherprep && npx tsc --noEmit 2>&1 | grep "performance-service\|questionPool" | head
```
Expected: no errors. If you see errors about `getQuestions()` returning the old shape, check the function body — it uses `{ id: d.id, ...d.data() } as PoolQuestion`. The type coercion should still work because the new shape is similar.

- [ ] **Step 4: Full build to catch downstream regressions**

```
cd /Users/lukemccarthy/pantherprep && npm run build 2>&1 | tail -15
```
Expected: build succeeds.

- [ ] **Step 5: Commit**

```bash
cd /Users/lukemccarthy/pantherprep
git add lib/adaptive/performance-service.ts
git commit -m "Extend PoolQuestion shape for seeded content with dual-field skill + metadata"
```

---

## Task 3: Audit source skill strings and write `scripts/skill-mapping.ts`

**Files:**
- Create: `scripts/skill-mapping.ts`
- Modify: `lib/adaptive/adaptive-engine.ts` (taxonomy constants at lines 478-490, if additions are needed)

- [ ] **Step 1: Dump every unique source skill string**

Run from the repo root:
```
cd /Users/lukemccarthy/pantherprep && cat \
  "app/(authenticated)/diagnostics/sat-math/questions.ts" \
  "app/(authenticated)/diagnostics/sat-rw/questions.ts" \
  "app/(authenticated)/diagnostics/nmsqt-math/questions.ts" \
  "app/(authenticated)/diagnostics/nmsqt-rw/questions.ts" \
  "app/(authenticated)/diagnostics/psat89-math/questions.ts" \
  "app/(authenticated)/diagnostics/psat89-rw/questions.ts" \
  "app/(authenticated)/practice-tests/sat/questions.ts" \
  "app/(authenticated)/practice-tests/nmsqt/questions.ts" \
  "app/(authenticated)/practice-tests/psat89/questions.ts" \
  | grep -oE 'skill:\s*"[^"]+"' | sed 's/skill:\s*"//;s/"$//' | sort -u > /tmp/all-source-skills.txt && wc -l /tmp/all-source-skills.txt
```

Expected: writes something like `83 /tmp/all-source-skills.txt` (expect ~83 unique strings across diagnostics, more once practice-test banks are included).

- [ ] **Step 2: Read the current taxonomy**

```
cd /Users/lukemccarthy/pantherprep && sed -n '475,500p' lib/adaptive/adaptive-engine.ts
```

Take note of existing keys in `MATH_SKILLS` and `RW_SKILLS`. You'll map each source string to one of these keys, or propose a new key if nothing fits.

- [ ] **Step 3: Create `scripts/skill-mapping.ts` with the full mapping**

The 83 unique source strings (dumped during Step 1) collapse cleanly into the existing taxonomy without adding any new keys. Create `scripts/skill-mapping.ts` with this exact content:

```ts
// scripts/skill-mapping.ts
//
// Source skill string → taxonomy-key mapping for the questionPool seed script.
// Every unique "skill" value in the hardcoded questions.ts banks appears here.
// Entries map to a taxonomyKey that exists in MATH_SKILLS or RW_SKILLS
// (see lib/adaptive/adaptive-engine.ts). If the audit in Step 2 revealed a
// source string not in this map, add it before running the seed.

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
};

// Audit record of taxonomy additions we're making as part of this seed.
// Empty here because the existing taxonomy absorbed every source string
// via collapse. If the Step 2 audit in a future re-run exposes a new
// string that doesn't fit, add a taxonomy key to adaptive-engine.ts AND
// record it here.
export const TAXONOMY_ADDITIONS: Array<{ domain: string; keys: string[] }> = [];
```

**Judgment calls worth flagging for Luke's review:**

- "Study design" → `probability`. This is thin — study design is really methodology (observational vs experimental, random assignment, etc.). If the source questions are about causation/correlation reasoning, `probability` is OK; if they're really about experiment design, consider a new `study_design` key.
- "Angles" and "Parallel lines and angles" → `triangles`. Angle problems don't perfectly fit any existing slot. `triangles` is the closest but the content may not actually involve triangles. If after seeding you see ≥3 "angles" questions that are really about non-triangle geometry, add a new `angles` key.
- "Arc length" and "Sector area" → `circles`. These are circle-derived but specifically about radian measure / arc work. If there are ≥3 questions, consider a `arc_length_radians` key.
- "Data interpretation" → `scatterplots`. Depends on the question — could also fit `statistics_central_tendency`. Spot-check during review.
- "Function evaluation", "Function notation", "Composition of functions" → `polynomial_operations`. Aggressive collapse — these are general function topics, not polynomial-specific. If there are ≥3 each, a `functions_general` key would be cleaner.
- "Form, Structure, and Sense" (R&W) → `modifiers` (Standard English Conventions). This is a College Board category that covers modifiers, parallelism, and verb agreement — it's broader than just modifiers. Collapsing to `modifiers` is imprecise. Spot-check the source questions to pick the best existing slot, or add a new `form_structure_sense` key if the content warrants it.

These collapses keep the existing taxonomy clean for the first seed. If the audit in Task 9 shows clustering that warrants a new slot, add it in a follow-up commit before spec A runs.

- [ ] **Step 4: Add any new taxonomy keys to `adaptive-engine.ts`**

If `TAXONOMY_ADDITIONS` is non-empty, open `lib/adaptive/adaptive-engine.ts` and extend the relevant taxonomy records at lines 478-490. Example (only if needed):

```ts
export const MATH_SKILLS: Record<string, string[]> = {
  Algebra: ["linear_equations", "linear_inequalities", "systems_of_equations", "linear_functions", "absolute_value"],
  "Advanced Math": ["quadratic_equations", "quadratic_formula", "polynomial_operations", "exponential_functions", "radical_equations", "rational_expressions", "completing_the_square"],  // added "completing_the_square"
  "Problem Solving & Data": ["ratios_rates", "percentages", "unit_conversion", "scatterplots", "linear_regression", "probability", "statistics_central_tendency", "statistics_spread", "two_way_tables", "expected_value"],
  "Geometry & Trig": ["area_perimeter", "volume", "triangles", "circles", "coordinate_geometry", "right_triangle_trig", "unit_circle", "arc_length_radians"],  // added "arc_length_radians"
};
```

Mirror in `RW_SKILLS` if the mapping exposes R&W concepts not covered. The existing R&W side is severely under-tagged in the source (11 unique strings across 162 questions), so you probably WON'T need many new R&W keys — the 11 strings mostly collapse to existing taxonomy. Let the audit speak for itself.

- [ ] **Step 5: Type-check**

```
cd /Users/lukemccarthy/pantherprep && npx tsc --noEmit 2>&1 | grep "skill-mapping\|adaptive-engine" | head
```
Expected: no errors. Common issue: forgetting a quote or comma in the big SKILL_MAP literal — fix syntax and re-run.

- [ ] **Step 6: Coverage check**

Confirm every source string is mapped:
```
cd /Users/lukemccarthy/pantherprep && node -e "
const { SKILL_MAP } = require('tsx/cjs').require('./scripts/skill-mapping.ts');
const fs = require('fs');
const sources = fs.readFileSync('/tmp/all-source-skills.txt', 'utf8').trim().split('\n');
const missing = sources.filter(s => !(s in SKILL_MAP));
console.log('Total source strings:', sources.length);
console.log('Mapped:', sources.length - missing.length);
console.log('Missing:', missing.length);
if (missing.length) { console.log('MISSING:'); missing.forEach(m => console.log('  \"' + m + '\"')); }
"
```

Expected: `Missing: 0`. If anything is missing, go back to Step 3 and add it.

- [ ] **Step 7: Commit**

```bash
cd /Users/lukemccarthy/pantherprep
git add scripts/skill-mapping.ts lib/adaptive/adaptive-engine.ts
git commit -m "Draft skill mapping for questionPool seed"
```

**Luke reviews this commit's diff before Task 8 runs the live seed.** If Luke requests edits, update and re-commit with a `fixup` message.

---

## Task 4: Create `scripts/seed-question-pool.mjs`

**Files:**
- Create: `scripts/seed-question-pool.mjs`

- [ ] **Step 1: Create the file**

Create `scripts/seed-question-pool.mjs` with this exact content:

```js
#!/usr/bin/env node
// Seed script: reads hardcoded questions.ts banks, transforms each question
// into a PoolQuestion via the skill-mapping table, writes to Firestore
// questionPool via admin SDK batched sets. Deterministic doc ids make
// re-runs idempotent.
//
// Usage:
//   GOOGLE_CLOUD_PROJECT=pantherprep-a5a73 npm run seed:pool -- --dry-run
//   GOOGLE_CLOUD_PROJECT=pantherprep-a5a73 npm run seed:pool -- --test-type=sat-math --dry-run
//   GOOGLE_CLOUD_PROJECT=pantherprep-a5a73 npm run seed:pool -- --test-type=sat-math
//   GOOGLE_CLOUD_PROJECT=pantherprep-a5a73 npm run seed:pool

import admin from "firebase-admin";

const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
const TEST_TYPE_ARG = args.find((a) => a.startsWith("--test-type="))?.split("=")[1];

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});
const db = admin.firestore();

// --- Import source question banks via tsx's TS-aware resolver ---
const diagnostics = {
  "sat-math":     { module: await import("../app/(authenticated)/diagnostics/sat-math/questions.ts"),     key: "QUESTIONS" },
  "sat-rw":       { module: await import("../app/(authenticated)/diagnostics/sat-rw/questions.ts"),       key: "QUESTIONS" },
  "nmsqt-math":   { module: await import("../app/(authenticated)/diagnostics/nmsqt-math/questions.ts"),   key: "QUESTIONS" },
  "nmsqt-rw":     { module: await import("../app/(authenticated)/diagnostics/nmsqt-rw/questions.ts"),     key: "QUESTIONS" },
  "psat89-math":  { module: await import("../app/(authenticated)/diagnostics/psat89-math/questions.ts"),  key: "QUESTIONS" },
  "psat89-rw":    { module: await import("../app/(authenticated)/diagnostics/psat89-rw/questions.ts"),    key: "QUESTIONS" },
};

const practiceBanks = {
  "sat":    await import("../app/(authenticated)/practice-tests/sat/questions.ts"),
  "nmsqt":  await import("../app/(authenticated)/practice-tests/nmsqt/questions.ts"),
  "psat89": await import("../app/(authenticated)/practice-tests/psat89/questions.ts"),
};

const { SKILL_MAP } = await import("./skill-mapping.ts");

// --- Transform helpers ---
function mapDifficulty(d) {
  if (d === "easy") return "F";
  if (d === "hard") return "C";
  return "M";
}

function normalizeChoices(q) {
  if (q.type === "spr") return [];
  if (!q.options) return [];
  const keys = ["A", "B", "C", "D", "E", "F"];
  return q.options
    .map((text, i) => ({ key: keys[i] ?? String(i), text }))
    .filter((c) => c.text !== "");
}

function detectKatex(q) {
  const haystack = [
    q.stem ?? "",
    q.explanation ?? "",
    ...Object.values(q.explanations ?? {}),
    q.passage ?? "",
  ].join(" ");
  return /\$[^$\n]+\$/.test(haystack);
}

function makeDocId(sourceTestType, sourceId) {
  return `${sourceTestType}__${sourceId}`;
}

function transformQuestion(q, sourceTestType) {
  const mapping = SKILL_MAP[q.skill];
  if (!mapping) {
    return { skipped: true, reason: "unmapped-skill", q };
  }

  const course = `${q.testType}-${q.section}`;
  const doc = {
    sourceTestType,
    sourceId: q.id,
    course,
    testType: q.testType,
    section: q.section,
    domain: mapping.domain,
    skill: mapping.taxonomyKey,
    sourceSkill: q.skill,
    difficulty: mapDifficulty(q.difficulty),
    type: q.type,
    stem: q.stem,
    choices: normalizeChoices(q),
    correctAnswer: q.correctAnswer,
    explanation: q.explanation,
    katex: detectKatex(q),
    tags: q.tags ?? [],
  };
  if (q.module != null) doc.module = q.module;
  if (q.passage) doc.passage = q.passage;
  if (q.explanations) doc.explanations = q.explanations;
  return { skipped: false, doc };
}

// --- Build the list of questions to process ---
function gatherQuestions() {
  const list = [];

  // Diagnostics
  for (const [courseKey, { module, key }] of Object.entries(diagnostics)) {
    if (TEST_TYPE_ARG && TEST_TYPE_ARG !== courseKey) continue;
    const sourceTestType = `${courseKey}-diagnostic`;
    const questions = module[key];
    for (const q of questions) list.push({ q, sourceTestType });
  }

  // Practice tests — RW_QUESTIONS and MATH_QUESTIONS exported as named arrays
  for (const [testType, mod] of Object.entries(practiceBanks)) {
    for (const [section, arrName] of [["rw", "RW_QUESTIONS"], ["math", "MATH_QUESTIONS"]]) {
      const courseKey = `${testType}-${section}`;
      if (TEST_TYPE_ARG && TEST_TYPE_ARG !== courseKey && TEST_TYPE_ARG !== `${testType}-practice`) continue;
      const sourceTestType = `${testType}-practice`;
      const questions = mod[arrName];
      if (!questions) continue;
      for (const q of questions) list.push({ q, sourceTestType });
    }
  }

  return list;
}

async function fetchExistingCreatedAt(docIds) {
  if (docIds.length === 0) return new Map();
  const map = new Map();
  const colRef = db.collection("questionPool");
  // Firestore getAll has a 500-doc limit per call
  const chunkSize = 500;
  for (let i = 0; i < docIds.length; i += chunkSize) {
    const chunk = docIds.slice(i, i + chunkSize);
    const refs = chunk.map((id) => colRef.doc(id));
    const snaps = await db.getAll(...refs);
    for (const snap of snaps) {
      if (snap.exists) {
        const data = snap.data();
        if (data.createdAt) map.set(snap.id, data.createdAt);
      }
    }
  }
  return map;
}

// --- Main ---
async function main() {
  console.log(`Seed starting. DRY_RUN=${DRY_RUN} TEST_TYPE=${TEST_TYPE_ARG ?? "(all)"}`);

  const all = gatherQuestions();
  console.log(`Gathered ${all.length} question(s) from source files.`);

  const transformed = [];
  const skipped = { unmappedSkill: [] };

  for (const { q, sourceTestType } of all) {
    const result = transformQuestion(q, sourceTestType);
    if (result.skipped) {
      skipped.unmappedSkill.push({ sourceTestType, id: q.id, skillString: q.skill });
      continue;
    }
    transformed.push({
      id: makeDocId(result.doc.sourceTestType, result.doc.sourceId),
      doc: result.doc,
    });
  }

  console.log(`Transformed: ${transformed.length}`);
  console.log(`Skipped (unmapped skill): ${skipped.unmappedSkill.length}`);
  if (skipped.unmappedSkill.length > 0) {
    console.log(`First 10 unmapped skills:`);
    skipped.unmappedSkill.slice(0, 10).forEach((s) => {
      console.log(`  ${s.sourceTestType}/${s.id}: "${s.skillString}"`);
    });
  }

  // Print a 3-doc sample for sanity
  console.log(`\n--- Sample (first 3 transformed docs) ---`);
  transformed.slice(0, 3).forEach((t) => {
    console.log(JSON.stringify({ id: t.id, ...t.doc }, null, 2));
  });
  console.log(`--- End sample ---\n`);

  if (DRY_RUN) {
    console.log(`DRY_RUN — no writes. Done.`);
    return;
  }

  // Fetch existing createdAt values so we don't clobber them
  const docIds = transformed.map((t) => t.id);
  console.log(`Fetching existing createdAt values for ${docIds.length} docs...`);
  const existingCreatedAt = await fetchExistingCreatedAt(docIds);
  console.log(`Found ${existingCreatedAt.size} existing docs; rest will be fresh creates.`);

  // Batch writes (500 per batch — Firestore limit)
  const now = admin.firestore.FieldValue.serverTimestamp();
  const colRef = db.collection("questionPool");
  const batchSize = 500;
  let written = 0;

  for (let i = 0; i < transformed.length; i += batchSize) {
    const batch = db.batch();
    const slice = transformed.slice(i, i + batchSize);
    for (const { id, doc } of slice) {
      const payload = {
        ...doc,
        createdAt: existingCreatedAt.get(id) ?? now,
        updatedAt: now,
      };
      batch.set(colRef.doc(id), payload);
    }
    await batch.commit();
    written += slice.length;
    console.log(`  Wrote ${written}/${transformed.length}`);
  }

  // Per-skill / per-course inventory summary
  const perCourse = {};
  const perSkill = {};
  for (const { doc } of transformed) {
    perCourse[doc.course] = (perCourse[doc.course] || 0) + 1;
    const key = `${doc.course}/${doc.skill}`;
    perSkill[key] = (perSkill[key] || 0) + 1;
  }

  console.log(`\nSeed complete.`);
  console.log(`  Total written: ${written}`);
  console.log(`  Per course:`);
  for (const [c, n] of Object.entries(perCourse).sort()) {
    console.log(`    ${c}: ${n}`);
  }
  console.log(`  Skills with < 3 questions (thin — flag for spec C):`);
  for (const [k, n] of Object.entries(perSkill).sort()) {
    if (n < 3) console.log(`    ⚠  ${k}: ${n}`);
  }
}

main().catch((e) => {
  console.error("Seed failed:", e);
  process.exit(1);
});
```

- [ ] **Step 2: Parse-check the script**

```
cd /Users/lukemccarthy/pantherprep && node --check scripts/seed-question-pool.mjs && echo "parse OK"
```
Expected: `parse OK`.

- [ ] **Step 3: Commit**

```bash
cd /Users/lukemccarthy/pantherprep
git add scripts/seed-question-pool.mjs
git commit -m "Add seed-question-pool script"
```

---

## Task 5: Create `scripts/audit-question-pool.mjs`

**Files:**
- Create: `scripts/audit-question-pool.mjs`

- [ ] **Step 1: Create the file**

Create `scripts/audit-question-pool.mjs`:

```js
#!/usr/bin/env node
// Audit script: queries Firestore questionPool and prints an inventory
// grouped by course + skill + domain. Flags skills with < 3 questions so
// spec C (Parker content authoring) knows where to direct attention.
//
// Usage:
//   GOOGLE_CLOUD_PROJECT=pantherprep-a5a73 npm run audit:pool

import admin from "firebase-admin";

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});
const db = admin.firestore();

async function main() {
  const snap = await db.collection("questionPool").get();
  console.log(`=== questionPool inventory (pantherprep) ===`);
  console.log(`Total: ${snap.size} questions\n`);

  const byCourse = {};
  const byCourseSkill = {};
  const bySourceSkillPerCourse = {};

  for (const doc of snap.docs) {
    const d = doc.data();
    byCourse[d.course] = (byCourse[d.course] || 0) + 1;

    const cs = `${d.course}|${d.skill}`;
    if (!byCourseSkill[cs]) {
      byCourseSkill[cs] = { course: d.course, skill: d.skill, domain: d.domain, count: 0 };
    }
    byCourseSkill[cs].count += 1;

    const ss = `${d.course}|${d.sourceSkill}`;
    bySourceSkillPerCourse[ss] = (bySourceSkillPerCourse[ss] || 0) + 1;
  }

  console.log(`Per course:`);
  for (const [c, n] of Object.entries(byCourse).sort()) {
    console.log(`  ${c}: ${n}`);
  }

  console.log(`\nPer skill (weakest first per course):`);
  const courses = [...new Set(Object.values(byCourseSkill).map((r) => r.course))].sort();
  for (const course of courses) {
    const rows = Object.values(byCourseSkill)
      .filter((r) => r.course === course)
      .sort((a, b) => a.count - b.count);
    console.log(`  [${course}]`);
    for (const r of rows) {
      const flag = r.count < 3 ? "⚠  " : "   ";
      console.log(`    ${flag}${r.domain.padEnd(30)} ${r.skill.padEnd(30)} ${r.count}`);
    }
  }

  // Source-skill spread per course (detect undertagging)
  console.log(`\nSource-skill spread per course (low numbers = under-tagged):`);
  const sourceSpread = {};
  for (const key of Object.keys(bySourceSkillPerCourse)) {
    const [course] = key.split("|");
    sourceSpread[course] = (sourceSpread[course] || 0) + 1;
  }
  for (const [c, n] of Object.entries(sourceSpread).sort()) {
    console.log(`  ${c}: ${n} unique source-skill strings`);
  }
}

main().catch((e) => {
  console.error("Audit failed:", e);
  process.exit(1);
});
```

- [ ] **Step 2: Parse-check**

```
cd /Users/lukemccarthy/pantherprep && node --check scripts/audit-question-pool.mjs && echo "parse OK"
```
Expected: `parse OK`.

- [ ] **Step 3: Commit**

```bash
cd /Users/lukemccarthy/pantherprep
git add scripts/audit-question-pool.mjs
git commit -m "Add audit-question-pool inventory script"
```

---

## Task 6: Add npm scripts to `package.json`

**Files:**
- Modify: `package.json` (the `scripts` object)

- [ ] **Step 1: Add the two entries**

Open `package.json`. Find the `scripts` block. It currently has (among others):
```json
"backfill:perflog": "tsx scripts/backfill-performance-log.mjs"
```

Add the two new entries right after it:
```json
"seed:pool": "tsx scripts/seed-question-pool.mjs",
"audit:pool": "tsx scripts/audit-question-pool.mjs"
```

Make sure JSON commas are correct — the entry before must have a trailing comma, the last entry in the block must not.

- [ ] **Step 2: Validate JSON**

```
cd /Users/lukemccarthy/pantherprep && node -e "JSON.parse(require('fs').readFileSync('package.json','utf8')); console.log('ok')"
```
Expected: `ok`.

- [ ] **Step 3: Confirm the scripts are invokable**

```
cd /Users/lukemccarthy/pantherprep && npm run seed:pool -- --help 2>&1 | head -3
```
Expected: either the script runs and prints usage (because the script itself doesn't have --help handling, it'll just start executing and likely fail on the Firebase Admin init without credentials — that's FINE, it means the script is wired up). If you see "Missing script" errors, the package.json entry is wrong.

- [ ] **Step 4: Commit**

```bash
cd /Users/lukemccarthy/pantherprep
git add package.json
git commit -m "Add npm scripts: seed:pool and audit:pool"
```

---

## Task 7: Dry-run on `sat-math` diagnostic only

**Files:** none — verification only.

- [ ] **Step 1: Run the dry-run**

```
cd /Users/lukemccarthy/pantherprep && GOOGLE_CLOUD_PROJECT=pantherprep-a5a73 npm run seed:pool -- --test-type=sat-math --dry-run 2>&1 | tail -80
```

Expected output:
- "Seed starting. DRY_RUN=true TEST_TYPE=sat-math"
- "Gathered 44 question(s) from source files." (or close to 44)
- "Transformed: 44"
- "Skipped (unmapped skill): 0"
- A 3-doc sample showing the PoolQuestion shape — verify each sample has:
  - `sourceTestType: "sat-math-diagnostic"`
  - `course: "sat-math"`
  - `skill` is a snake_case key
  - `sourceSkill` is the original human label
  - `choices` is `[{key:"A", text:"..."}, ...]`
  - `katex` is a boolean
  - `difficulty` is F/M/C (not easy/medium/hard)
- "DRY_RUN — no writes. Done."

- [ ] **Step 2: If skipped > 0, fix the mapping**

If any source strings are unmapped, go back to Task 3 Step 3, add the missing entries, commit, and re-run this step until skipped is 0.

- [ ] **Step 3: If anything else looks wrong, stop**

Common issues:
- Sample shows `course: "undefined-undefined"` → `q.testType` / `q.section` missing from the source. Check the source file.
- `choices` is empty for MC questions → `normalizeChoices` bug or source has empty `options`. Debug.
- `katex` is false on a question that clearly has math → regex bug. Log the haystack string, fix.

Do NOT proceed to Task 8 until Task 7 passes cleanly.

---

## Task 8: Live run on `sat-math` + audit

**Files:** none — ops.

- [ ] **Step 1: Live seed for sat-math only**

```
cd /Users/lukemccarthy/pantherprep && GOOGLE_CLOUD_PROJECT=pantherprep-a5a73 npm run seed:pool -- --test-type=sat-math 2>&1 | tail -30
```

Expected:
- "Seed starting. DRY_RUN=false TEST_TYPE=sat-math"
- "Gathered 44..."
- "Fetching existing createdAt values for 44 docs..."
- "Found 0 existing docs; rest will be fresh creates." (first run)
- "Wrote 44/44"
- "Seed complete. Total written: 44"
- Per-course: sat-math: 44
- Any "Skills with < 3 questions" warnings — note them for spec C but they're not blockers

- [ ] **Step 2: Run the audit**

```
cd /Users/lukemccarthy/pantherprep && GOOGLE_CLOUD_PROJECT=pantherprep-a5a73 npm run audit:pool 2>&1 | tail -40
```

Expected:
- "Total: 44 questions"
- "Per course: sat-math: 44"
- "Per skill (weakest first per course)" with sat-math breakdown
- Source-skill spread for sat-math (expect 20-30 unique source strings)

- [ ] **Step 3: Spot-check 5 random docs in Firebase console**

Open `https://console.firebase.google.com/project/pantherprep-a5a73/firestore/data/~2FquestionPool`. Click 5 random docs and verify each has:
- Full `stem`, `choices`, `correctAnswer`, `explanation`
- `skill` is snake_case, `sourceSkill` is human readable
- `course: "sat-math"`
- `createdAt` and `updatedAt` are recent timestamps

- [ ] **Step 4: Re-run the seed to verify idempotency**

```
cd /Users/lukemccarthy/pantherprep && GOOGLE_CLOUD_PROJECT=pantherprep-a5a73 npm run seed:pool -- --test-type=sat-math 2>&1 | tail -10
```
Expected:
- "Found 44 existing docs" (second run)
- "Wrote 44/44"
- Total in Firestore is still 44 (not 88) — check with `npm run audit:pool`

- [ ] **Step 5: Verify `createdAt` was preserved**

Open one of the docs you spot-checked in Step 3. Its `createdAt` should still be the original timestamp; `updatedAt` should be newer (from the re-run). If `createdAt` changed, there's a bug in the `fetchExistingCreatedAt` flow — stop, fix, re-run.

Do NOT proceed until all 5 sub-steps pass.

---

## Task 9: Seed all 6 diagnostics

**Files:** none — ops.

- [ ] **Step 1: Run the full diagnostic seed**

```
cd /Users/lukemccarthy/pantherprep && GOOGLE_CLOUD_PROJECT=pantherprep-a5a73 npm run seed:pool 2>&1 | tail -50
```

This seeds all 6 diagnostics + all 3 practice-test banks in one run. If you want a safer path, run each diagnostic one at a time with `--test-type=sat-rw`, `--test-type=nmsqt-math`, etc.

Expected (full run):
- ~700 questions gathered (294 diagnostics + ~400 practice tests)
- Skipped: 0 (if the mapping is complete)
- Per-course breakdown covering all 6 diagnostic courses AND the 6 practice-test course-sections
- A list of thin skills (< 3 questions) — these are spec C's to-do list

- [ ] **Step 2: Audit**

```
cd /Users/lukemccarthy/pantherprep && GOOGLE_CLOUD_PROJECT=pantherprep-a5a73 npm run audit:pool 2>&1 | tail -60
```

Expected: total ~700, all courses present.

- [ ] **Step 3: Archive the audit output**

Copy the audit output and save it as a reference file:

```
cd /Users/lukemccarthy/pantherprep && GOOGLE_CLOUD_PROJECT=pantherprep-a5a73 npm run audit:pool > docs/superpowers/specs/2026-04-13-question-pool-seed-inventory.md 2>&1
```

Open the file, add a short preface at the top:

```md
# questionPool Seed Inventory — 2026-04-13

Generated by `npm run audit:pool` after running spec D (questionPool seeding).
Reference for spec C (Parker authoring) on where to direct question generation.

---

(audit output below)
```

- [ ] **Step 4: Commit the inventory**

```bash
cd /Users/lukemccarthy/pantherprep
git add docs/superpowers/specs/2026-04-13-question-pool-seed-inventory.md
git commit -m "Archive questionPool inventory after spec D seed"
```

---

## Task 10: Report to Luke

**Files:** none — status report only.

- [ ] **Step 1: Summarize**

Tell Luke:
- Total questions written to `questionPool`
- Any skill that has zero questions (the taxonomy key exists but no source question matched)
- Any skill that has fewer than 3 questions (thin content)
- Any unexpected surprises
- The path to the inventory file so he can read it later

Spec D is then complete. Spec B (practice runner) starts next; its first task is adding the composite index on `questionPool` for `course + skill + difficulty` querying.

---

## Out-of-scope follow-ups (do not implement)

- **Fixing R&W undertagging.** Most R&W questions will land in ~11 source-skill buckets even after mapping. Re-tagging belongs to spec C.
- **Parker authoring pipeline.** Generating new questions or concept explanations — spec C.
- **Skill detail UI, skill catalog, skill routing.** Spec A.
- **Practice runner logic.** Spec B.
- **Deleting the `moduleId` string field from `PoolQuestion`.** It was in the old shape; the new shape has `module: number` instead. A `moduleId` field won't exist on new docs but old callers wouldn't have worked anyway (no call sites exist). Clean follow-up if needed.
