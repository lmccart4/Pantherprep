# PantherPrep — questionPool Seeding (Spec D)

**Date:** 2026-04-13
**Owner:** Luke (Lachlan drafting)
**Status:** Design — awaiting approval
**Parent initiative:** Skill-based practice (decomposed into specs A, B, C, D, E)
**This spec:** D — data substrate

## Context

Students see "Recommended Next Steps" on the adaptive dashboard but the recommendations are display-only. The goal of the larger skill-based practice initiative is to make those recommendations clickable, route to per-skill pages, and give students practice content filtered to just the skill they need. The initiative decomposes into five sub-projects:

- **A.** Skill catalog UI + routing (`/skills/[course]`, `/skills/[course]/[skill]`, clickable recommendations)
- **B.** Practice runner (a component that takes `{uid, course, skill, count}` and runs N questions through the adaptive pipeline)
- **C.** Parker authoring pipeline (content generation workflow for new skill questions + concept explanations)
- **D.** *This spec.* questionPool data substrate — seed Firestore from existing hardcoded question banks so specs A and B have real data to query
- **E.** Per-skill mastery feedback polish

The sequencing is D → B → A (→ E → C) — each spec is designed against the concrete reality established by the previous one, instead of guessing at interfaces.

## Goals

1. Write every question in the existing hardcoded `questions.ts` banks to a Firestore collection `questionPool` with a normalized shape that specs A and B can query by `course`, `skill`, `domain`, `difficulty`.
2. Preserve both the taxonomy key (`linear_equations`) for routing/queries AND the original source label (`"Linear equations in 1 variable"`) for display.
3. Keep the seed idempotent: re-running overwrites the same docs in place via deterministic ids, never duplicates.
4. Allow targeted expansion of `MATH_SKILLS` / `RW_SKILLS` taxonomy in [lib/adaptive/adaptive-engine.ts](../../../lib/adaptive/adaptive-engine.ts) when source content reveals skills the taxonomy doesn't currently cover.
5. Produce a post-seed inventory report so spec C (Parker) knows which skills are under-tagged and need human authoring first.

## Non-goals

- Changing diagnostic or practice-test pages' runtime behavior. Hardcoded `questions.ts` files remain the source of truth for the live test flow.
- Fixing R&W undertagging (162 R&W questions share only 11 source strings). That's a content authoring problem for spec C.
- Building practice runner logic (spec B).
- Building skill routing, skill catalog, or skill detail pages (spec A).
- Adding composite indexes for querying `questionPool` by skill/course/difficulty — spec B adds them as its first task.

## Architecture

### questionPool identity

`questionPool` is a **derived index**, not a source of truth. Hardcoded `questions.ts` files stay authoritative for the live diagnostic + practice-test flow. The seed script reads those files and writes a denormalized, skill-indexed copy to Firestore. If a question gets updated in a `questions.ts` file, the next seed run propagates the change via `setDoc` overwrite.

Consequences of this choice:
- Diagnostic and practice-test pages continue to import their local arrays; zero change to the live test flow.
- Nobody should hand-edit `questionPool` docs in Firestore — any edit gets wiped on the next seed run. Parker's future authoring pipeline (spec C) will either bypass this constraint by writing to a separate collection or will treat generated questions as a new source of truth with their own files.
- Rollback is trivial: delete the collection and re-run the script. No student data is stored in `questionPool`.

### Data shape

Extend the existing `PoolQuestion` interface in [lib/adaptive/performance-service.ts:266](../../../lib/adaptive/performance-service.ts#L266) to the following:

```ts
export interface PoolQuestion {
  // Identity — deterministic doc id = `${sourceTestType}__${sourceId}`
  sourceTestType: string;  // "sat-math-diagnostic" | "sat-rw-diagnostic" | "sat-practice" | ...
  sourceId: string;        // original id from questions.ts (e.g. "diag-sat-math-1")

  // Routing / grouping
  course: string;          // "sat-math" | "sat-rw" | "nmsqt-math" | ...
  testType: "sat" | "nmsqt" | "psat89";
  section: "math" | "rw";
  domain: string;          // must match a key in MATH_SKILLS / RW_SKILLS
  skill: string;           // snake_case taxonomy key — queried by recommendations + practice runner
  sourceSkill: string;     // original human label — shown on skill detail pages
  difficulty: "F" | "M" | "C";
  module?: number;         // 1 or 2, when the source identifies a module

  // Content
  type: "mc" | "spr";
  passage?: string;        // R&W passage text, omitted for math
  stem: string;
  choices: { key: string; text: string }[];  // empty for spr
  correctAnswer: string;
  explanation: string;
  explanations?: Record<string, string>;  // per-choice explanations when the source has them

  // Metadata
  tags?: string[];         // ["diagnostic"] or ["practice-test"] from source
  katex: boolean;          // precomputed at seed time; true iff stem/explanation contains `$...$`
  createdAt: import("firebase-admin").firestore.Timestamp;
  updatedAt: import("firebase-admin").firestore.Timestamp;
}
```

The existing fields `id`, `moduleId`, `questionText`, `choices`, `correctAnswer`, `explanation`, `trapType`, `tags`, `katex` in the current `PoolQuestion` interface are replaced by this new shape. The current interface has no callers outside the type definition itself, so no call site migration is required — but `getQuestions()` in the same file will read against the new shape without changes because it passes through `d.data()` generically.

### Deterministic doc id

`id = ${sourceTestType}__${sourceId}` — for example, `sat-math-diagnostic__diag-sat-math-1`.

This achieves three things:
1. Idempotent seeds via `setDoc` (no duplicates on re-run).
2. Cross-reference with student answer rows: when a student answers a diagnostic question, the `questionId` on their `performanceLog/{uid}/answers/{id}` doc already matches `sourceId`, so analytics that join pooled questions to student performance can bridge via the suffix after `__`.
3. Stable across re-seeds — spec B can safely cache question ids.

### Skill mapping

A new file `scripts/skill-mapping.ts` holds the canonical source-string → taxonomy-key map:

```ts
import type { MATH_SKILLS, RW_SKILLS } from "@/lib/adaptive/adaptive-engine";

export interface SkillMapping {
  taxonomyKey: string;  // must match a key in MATH_SKILLS or RW_SKILLS
  domain: string;       // must match the domain key in the taxonomy
}

export const SKILL_MAP: Record<string, SkillMapping> = {
  "Linear equations in 1 variable": { taxonomyKey: "linear_equations", domain: "Algebra" },
  "Linear equations with fractions": { taxonomyKey: "linear_equations", domain: "Algebra" },
  "Linear functions":               { taxonomyKey: "linear_functions", domain: "Algebra" },
  // ... 80 more entries, one per unique source string ...
};

// Informational: record of taxonomy additions we're making as part of this seed.
// Luke manually edits MATH_SKILLS / RW_SKILLS in adaptive-engine.ts to add these
// keys before running the seed. The array below exists so PR reviewers have an
// audit trail.
export const TAXONOMY_ADDITIONS: Array<{ domain: string; keys: string[] }> = [];
```

The seed script looks up each source question's `skill` field in `SKILL_MAP`. If found, it writes `{skill: taxonomyKey, sourceSkill: <original>, domain}` to Firestore. If not found, it logs `skip reason=unmapped-skill` and continues.

**Mapping authoring flow:**

1. Implementer (me or a subagent) audits all 83 unique source strings by cat'ing the `questions.ts` files through `grep -oE 'skill:\\s*"[^"]+"' | sort -u`.
2. Implementer writes the first draft of `SKILL_MAP` covering every source string, with a best-effort mapping to existing taxonomy keys.
3. Where a source string has no good existing taxonomy match (e.g., "Arc length" doesn't fit cleanly into the existing `circles` slot), the implementer proposes a new taxonomy key, adds it to `adaptive-engine.ts` in the same commit, and records it in `TAXONOMY_ADDITIONS`.
4. Commit the mapping + taxonomy edits as a single commit titled "Draft skill mapping for questionPool seed".
5. Luke reviews the commit diff on GitHub or in the editor. Approves or edits.
6. On approval, run the seed script.

Taxonomy expansion is in scope for D. The existing 50-slot taxonomy is a guess and the real content exposes gaps — D treats this as a one-time opportunity to get the taxonomy honest to the source material.

### Seed script behavior

`scripts/seed-question-pool.mjs` — new file, structurally similar to [scripts/backfill-performance-log.mjs](../../../scripts/backfill-performance-log.mjs) (runs under `tsx`, uses admin SDK with ADC, imports TypeScript source via dynamic import).

```
Usage:
  GOOGLE_CLOUD_PROJECT=pantherprep-a5a73 npm run seed:pool -- --dry-run
  GOOGLE_CLOUD_PROJECT=pantherprep-a5a73 npm run seed:pool -- --test-type=sat-math --dry-run
  GOOGLE_CLOUD_PROJECT=pantherprep-a5a73 npm run seed:pool -- --test-type=sat-math
  GOOGLE_CLOUD_PROJECT=pantherprep-a5a73 npm run seed:pool
  GOOGLE_CLOUD_PROJECT=pantherprep-a5a73 npm run seed:pool -- --report
```

**Flags:**
- `--dry-run` — transforms every question, logs what would be written, no Firestore writes. Used for validation before any real run.
- `--test-type=<type>` — restrict the seed to a single test type (sat-math, sat-rw, nmsqt-math, nmsqt-rw, psat89-math, psat89-rw, sat-practice, nmsqt-practice, psat89-practice). Used for the incremental rollout.
- `--report` — skip the seed, just query Firestore and print the current inventory (counts per skill + per domain + per course). Used for post-seed verification.

**Main loop:**

1. Import `SKILL_MAP` and `TAXONOMY_ADDITIONS` from `scripts/skill-mapping.ts`.
2. Import question arrays from each target `questions.ts` file (via `tsx` TypeScript-aware dynamic import — same pattern as the backfill script).
3. For each question in each source file:
   - Look up `q.skill` in `SKILL_MAP`. If missing, increment `skipped.unmappedSkill` and continue.
   - Derive `course` from `testType` + `section`.
   - Normalize `difficulty`: `"easy" → "F"`, `"medium" → "M"`, `"hard" → "C"`.
   - Build `choices: {key, text}[]` from `options: string[]` using letter keys A/B/C/D.
   - Detect `katex`: scan `stem + explanation + Object.values(explanations ?? {}).join(" ")` for `/\$[^$]+\$/`.
   - Construct the deterministic doc id.
   - If `--dry-run`, log the doc summary (id, course, skill, difficulty). Otherwise `setDoc` the full payload with `createdAt: existingOrNow`, `updatedAt: now`.
4. Print the final report: `{written, skipped, warnings, perSkill, perDomain, perCourse}`.

**`createdAt` preservation:** To avoid clobbering `createdAt` on re-runs, the script does one up-front `getAll()` (or `listDocuments` / `collection.get()`) to build a `Map<docId, existingCreatedAt>`, then uses that map when constructing each payload. This is ~1 round-trip for the whole collection instead of N transactions, so the full seed finishes in seconds rather than minutes. Writes go out via a `WriteBatch` in chunks of 500 docs (Firestore's batch limit).

**Source file locations:**

| Source | Location |
|---|---|
| SAT Math diagnostic | `app/(authenticated)/diagnostics/sat-math/questions.ts` |
| SAT R&W diagnostic | `app/(authenticated)/diagnostics/sat-rw/questions.ts` |
| NMSQT Math diagnostic | `app/(authenticated)/diagnostics/nmsqt-math/questions.ts` |
| NMSQT R&W diagnostic | `app/(authenticated)/diagnostics/nmsqt-rw/questions.ts` |
| PSAT 8/9 Math diagnostic | `app/(authenticated)/diagnostics/psat89-math/questions.ts` |
| PSAT 8/9 R&W diagnostic | `app/(authenticated)/diagnostics/psat89-rw/questions.ts` |
| Practice-test question banks | Unknown at spec time — implementer audits `components/test/practice-test.tsx` and `app/(authenticated)/practice-tests/**` to locate. If the shape is different from diagnostics (e.g. `modules: Question[][]`), the seed script handles both. |

### Inventory audit script

`scripts/audit-question-pool.mjs` — small companion that queries `questionPool` and prints inventory. Runs independently of the seed script for ongoing monitoring.

Output shape:

```
=== questionPool inventory (pantherprep) ===
Total: 294 questions
Per course:
  sat-math: 44
  sat-rw: 54
  nmsqt-math: 44
  nmsqt-rw: 54
  psat89-math: 44
  psat89-rw: 54
Per skill (weakest first — skills with < 3 questions flagged):
  [sat-math]
    ⚠  arc_length_radians: 1
    ⚠  special_triangles: 2
       linear_equations: 6
       quadratic_equations: 8
       ...
  [sat-rw]
    ⚠  central_ideas: 14 (UNDER-TAGGED — source collapses)
    ⚠  cross_text_connections: 0
    ...
```

Skills with zero questions are spec C's first targets (Parker needs to author them). Skills with < 3 questions are flagged as thin.

### Firestore rules

`questionPool` currently has:
```
match /questionPool/{questionId} {
  allow read: if isPapsUser();
  allow write: if isPapsUser() && isStaff(request.auth.uid);
}
```

The seed script writes via admin SDK which bypasses security rules, so no rule change is needed for the seed itself. The read rule already allows any paps/agent user to read pooled questions, which is what spec B (practice runner) needs.

### Idempotency and safety

- **Deterministic ids + `setDoc`** = re-runs overwrite the same docs, never duplicate.
- **`createdAt` preserved via read-before-write transaction.**
- **`updatedAt` bumped on every write** so we can identify stale content if Parker gets wired in later and starts re-writing.
- **Dry-run is mandatory for the first real run** and is documented in the rollout checklist below.
- **Rollback:** delete the `questionPool` collection (via Firebase console or admin SDK), fix the bug, re-run. Zero data loss because `questionPool` is derived.

## Rollout

1. Implementer writes `scripts/skill-mapping.ts` + any `TAXONOMY_ADDITIONS` edits to `lib/adaptive/adaptive-engine.ts`. Commits as "Draft skill mapping for questionPool seed".
2. Luke reviews the commit diff. Approves, edits, or pushes back. If edits, implementer updates and re-commits.
3. Implementer extends the `PoolQuestion` type in `lib/adaptive/performance-service.ts` to the new shape. Runs `npx tsc --noEmit` to confirm nothing breaks. Commits as "Extend PoolQuestion shape for seeded content".
4. Implementer writes `scripts/seed-question-pool.mjs` + `scripts/audit-question-pool.mjs`. Adds `npm run seed:pool` + `npm run audit:pool` to `package.json`. Commits as "Add question-pool seed + audit scripts".
5. **Dry-run on a single test type:**
   ```
   GOOGLE_CLOUD_PROJECT=pantherprep-a5a73 npm run seed:pool -- --test-type=sat-math --dry-run
   ```
   Eyeball 3 sample docs in the output. Confirm counts roughly match expected (~44 questions across ~25 math taxonomy slots).
6. **Live run on that test type:**
   ```
   GOOGLE_CLOUD_PROJECT=pantherprep-a5a73 npm run seed:pool -- --test-type=sat-math
   ```
   Follow with `npm run audit:pool` to confirm Firestore counts match.
7. **Manual Firestore console spot-check** on 5 random sat-math docs.
8. If anything looks wrong: stop, diagnose, fix, re-run (seed is idempotent).
9. If sat-math looks good: expand to all 6 diagnostics one at a time, auditing between each.
10. Expand to practice-test banks last. These may need additional handling if the question structure differs.
11. Final full audit: `npm run audit:pool`. Archive the output to `docs/superpowers/specs/2026-04-13-question-pool-seed-inventory.md` so spec C has a starting inventory.

## Error handling

- **Unmapped skill string:** logged as `skip sourceTestType=X sourceId=Y reason=unmapped-skill skillString="..."`. Script continues, increments counter, final report shows total. Fix: add the string to `SKILL_MAP` and re-run.
- **Missing `domain` in MATH_SKILLS/RW_SKILLS:** script throws at the mapping lookup because the domain in `SkillMapping` doesn't match the taxonomy. Fix: add the domain key to the taxonomy or correct the mapping. Dry-run catches this.
- **Firestore write failure:** the script continues past one failure, increments `errors` counter, prints each failing doc id. Final report shows total. Fix: diagnose (quota? auth? rule misconfiguration on admin SDK?) and re-run.
- **Source file import failure** (wrong path, file moved, TypeScript error): the script throws at import time. Fix and re-run.

## Known limitations

1. **R&W undertagging.** 162 R&W questions share only 11 unique source strings. After seeding, most R&W taxonomy slots will be empty or nearly empty. Spec C (Parker authoring pipeline) must re-tag R&W questions with granular skills before spec A (skill UI) launches for R&W courses. The audit script flags this.
2. **Practice-test question shape may differ from diagnostics.** If practice-test question arrays are shaped differently (nested modules, different skill tagging), the seed script needs per-source adapters. Implementer audits during step 11 of the rollout; extra work lives inside the seed script itself, no spec change.
3. **`questionPool` is a derived index, not a source of truth.** Any hand-edit in Firestore is destroyed on the next seed run. If spec C later writes generated content directly to `questionPool`, we'll need to either write to a separate collection or mark generated docs with an `authoredBy: "parker"` field and skip them during seeds.
4. **No MC option shuffling at seed time.** The MC-randomization rule in `.claude/rules/mc-answer-randomization.md` applies at runtime — spec B's practice runner shuffles option positions on display, not at seed time.

## Handoff to spec B (practice runner)

When spec B designs its Firestore query for "give me N questions for skill=X, course=Y, difficulty=Z", it will need a new composite index:

```json
{
  "collectionGroup": "questionPool",
  "queryScope": "COLLECTION",
  "fields": [
    { "fieldPath": "course", "order": "ASCENDING" },
    { "fieldPath": "skill", "order": "ASCENDING" },
    { "fieldPath": "difficulty", "order": "ASCENDING" }
  ]
}
```

Spec B adds this index in its first task. D's only Firestore change is writing docs into `questionPool`, so D deploys no index changes.

## Testing

This repo has no test framework (confirmed during spec D-pantherprep-adaptive-wiring). Verification for this spec is:

1. **Type-check passes after `PoolQuestion` extension** — `npx tsc --noEmit`.
2. **Dry-run produces expected counts.** For a single test type like sat-math, the expected count is 44 questions written minus any `skip` entries. Manual inspection of 3 sample docs in the dry-run output confirms field shape.
3. **Live run audit matches.** `npm run audit:pool` after each live run should show the cumulative count matching the sum of all dry-run counts.
4. **Firestore console spot-check.** Visually inspect 5 random sat-math docs before expanding to the remaining 5 test types.

No unit tests are written as part of this spec.

## Open questions

None outstanding. Assumptions made:
- Practice-test question banks exist in a form that can be imported under `tsx` (if not, the implementer adapts or flags as a follow-up).
- The `TAXONOMY_ADDITIONS` array does not need an automated sync check against `adaptive-engine.ts`; Luke reviews manually.
- Concurrent Firestore writes from the seed script do not conflict with live student writes because the two collections (`questionPool` vs `performanceLog`/`sessions`) are disjoint.
