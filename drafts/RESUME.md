# Spec C Resumption Notes

**Last session:** 2026-04-14 — Lachlan
**Branch:** `feat/parker-content-pipeline`
**Status:** Tasks 1-6 committed and reviewed. Smoke test (1 skill, 4 subagents) complete and validated. Waves 1-3 dispatch is pending a fresh session.

## What's done

- Infrastructure (tasks 1-6): staging dirs, skill reference doc, `seed-skill-content.mjs`, `seed-generated-questions.mjs`, audit extension, npm scripts
- `scripts/shuffle-answer-positions.mjs` — post-generation correct-answer randomizer (LLMs are bad at uniform random)
- `scripts/fetch-style-anchors.mjs` — pre-fetches 3 mid-difficulty anchors per (course, skill) combo
- `drafts/_style-anchors.json` — 108 combos, 3 thin combos (quadratic_formula)
- Smoke test artifacts for `linear_regression`:
  - `drafts/skill-content/linear_regression.json` + `.reviewed.json` + `.rejected.json`
  - `drafts/question-batches/nmsqt-math__linear_regression.json` + `.reviewed.json` + `.rejected.json`

## Two fixes applied mid-smoke (important for resume)

1. **Answer position clustering.** The question subagent's raw output had A=11, B=3, C=1, D=0 out of 15 MC — LLM "pretend to be random" failure. Fixed via `scripts/shuffle-answer-positions.mjs` which mechanically randomizes positions post-generation. **Must run this after every wave 2 batch, BEFORE wave 3 critic dispatches.**
2. **Seed filter bug.** `seed-skill-content.mjs` filtered `.json` instead of `.reviewed.json`, catching rejected sidecars. Fixed.

## What to dispatch next

### Wave 1 — Concept subagents (35 remaining)

Skip: `linear_regression` (already done).

Dispatch the other 35 taxonomy keys in 5 batches of ~7. Use the concept prompt template from `docs/superpowers/plans/2026-04-14-parker-content-authoring-spec-c.md` task 7 step 4. Inline the relevant entry from `docs/superpowers/specs/college-board-skills.md` for each taxonomyKey.

Taxonomy keys to dispatch:

**Math (24 remaining):**
absolute_value, area_perimeter, circles, coordinate_geometry, exponential_functions, linear_equations, linear_functions, linear_inequalities, percentages, polynomial_operations, probability, quadratic_equations, quadratic_formula, radical_equations, rational_expressions, ratios_rates, right_triangle_trig, scatterplots, statistics_central_tendency, statistics_spread, systems_of_equations, triangles, two_way_tables, volume

**R&W (11 remaining):**
central_ideas, cross_text_connections, details_evidence, inferences, modifiers, punctuation_boundaries, purpose_function, quantitative_evidence, rhetorical_synthesis, transitions, vocabulary_in_context

Each subagent writes `drafts/skill-content/{taxonomyKey}.json`.

### Wave 2 — Question subagents (107 remaining)

Skip: `nmsqt-math__linear_regression` (already done).

The 107 remaining (course, skill) combos are the Cartesian product minus the one skip:
- Math: 25 skills × 3 math courses = 75 → minus `nmsqt-math|linear_regression` = **74 combos**
- R&W: 11 skills × 3 r&w courses = **33 combos**
- **Total: 107 combos**

Dispatch in 14 batches of ~8. Use the question prompt template from plan task 7 step 6. Inline the relevant style anchors from `drafts/_style-anchors.json[courseKey]`.

**Difficulty mix by course:**
- sat-math, sat-rw: 5 easy / 10 medium / 5 hard
- nmsqt-math, nmsqt-rw: 7 easy / 9 medium / 4 hard
- psat89-math, psat89-rw: 8 easy / 8 medium / 4 hard

Each subagent writes `drafts/question-batches/{course}__{taxonomyKey}.json`.

### After wave 2: Run the shuffle script

```bash
cd /Users/lukemccarthy/pantherprep
node scripts/shuffle-answer-positions.mjs
```

This mechanically randomizes the correct-answer position for every MC question in every question batch file. **Do not skip this step.** The LLMs will always cluster on A without it.

### Wave 3 — Critic subagents (142 remaining)

Skip: the 2 critics already done (skill-content/linear_regression, question-batches/nmsqt-math__linear_regression).

- 35 concept critics (one per wave-1 artifact)
- 107 question critics (one per wave-2 artifact, post-shuffle)
- **Total: 142 critics**

Dispatch in 18 batches of ~8. Use the critic prompt templates from plan task 7 step 8. Each critic writes `{original}.reviewed.json` + `{original}.rejected.json` next to the input file.

### After wave 3: Seed and verify

```bash
cd /Users/lukemccarthy/pantherprep

# Verify everything is where it should be
ls drafts/skill-content/*.reviewed.json | wc -l  # should be 36
ls drafts/question-batches/*.reviewed.json | wc -l  # should be 108

# Dry-run both seeds
GOOGLE_CLOUD_PROJECT=pantherprep-a5a73 npm run seed:skill-content -- --dry-run
GOOGLE_CLOUD_PROJECT=pantherprep-a5a73 npm run seed:generated-questions -- --dry-run

# Review any invalid files, regenerate if needed

# Live seed (after review)
GOOGLE_CLOUD_PROJECT=pantherprep-a5a73 npm run seed:skill-content
GOOGLE_CLOUD_PROJECT=pantherprep-a5a73 npm run seed:generated-questions

# Audit
GOOGLE_CLOUD_PROJECT=pantherprep-a5a73 npm run audit:pool
```

Expected: every (course, skill) group now has ≥20 questions, A/B/C/D distribution check reports few or no flags.

### Merge

```bash
git checkout main
git merge --no-ff feat/parker-content-pipeline
git push
```

## Grade-integrity check before merge

```bash
cd /Users/lukemccarthy/pantherprep
# Count pre-existing hardcoded-bank docs that should NOT have been touched
node -e "
const admin = require('firebase-admin');
admin.initializeApp({ credential: admin.credential.applicationDefault() });
const db = admin.firestore();
(async () => {
  const preSnap = await db.collection('questionPool').where('sourceTestType', '==', 'sat-math-diagnostic').get();
  console.log('sat-math-diagnostic docs:', preSnap.size);
  const parkerSnap = await db.collection('questionPool').where('source', '==', 'parker-gen-2026-04-14').get();
  console.log('parker-gen docs:', parkerSnap.size);
})();
"
```

The sat-math-diagnostic count must match the pre-Parker baseline. The parker-gen count will be ~2100.
