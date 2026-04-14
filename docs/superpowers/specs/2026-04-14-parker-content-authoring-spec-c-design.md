# PantherPrep — Parker Content Authoring Pipeline (Spec C)

**Date:** 2026-04-14
**Owner:** Luke (Lachlan drafting)
**Status:** Design — awaiting approval
**Parent initiative:** Skill-based practice (decomposed into specs A, B, C, D, E)
**This spec:** C — content generation pipeline

## Context

Specs D + B + A + E are all shipped. Students can browse a skill catalog, open a detail page, run adaptive practice, and see per-skill mastery deltas after every session. The one remaining gap: the `questionPool` has real coverage holes. The post-seed inventory at `docs/superpowers/specs/2026-04-14-question-pool-seed-inventory.md` flags 25 skill×course combinations with fewer than 3 questions. The first skill Luke clicked on during spec A smoke-testing immediately surfaced a "needs more data" state because the pool was too thin.

Spec C closes the content gap by running a one-shot parallel content-generation pipeline that produces, for every skill across every course:

1. A skill-level content bundle (concept blurb + longer explanation + 2-3 worked examples + 3 hint templates) written to a new `skillContent` Firestore collection
2. ~20 new practice questions per skill×course, matching the real exam's difficulty distribution, written additively to `questionPool`

Generation runs as **parallel Claude Code subagent dispatches from a single Lachlan session**. No third-party API calls, no new infrastructure, no cost beyond the existing Claude Code subscription. A critic subagent pass reviews every artifact before Luke spot-checks and runs the seed script.

## Goals

1. **Bring every (course, skill) combination to at least ~20 questions.** The adaptive engine needs question density at each difficulty level to route students meaningfully.
2. **Give every skill a reusable learning-content bundle.** Concept explanations, worked examples, and hint templates that can back a future Learn tab without re-authoring.
3. **Generate at maximum fidelity.** Clean context per skill, style anchors from existing vetted questions, domain-aware prompts, explicit enforcement of content rules (KaTeX, factual-only MC, randomized answer positions).
4. **Ship everything in a single session.** Parallel subagents turn what would otherwise be weeks of hand-authoring into 30-60 minutes of orchestrated generation.
5. **Preserve grade integrity.** Writes are append-only. No existing question, lesson, or progress record is touched.

## Non-goals

- **No Learn tab UI.** The `skillContent` schema is sketched here so generated data matches the future UI, but no `/skills/[course]/[skill]` Learn tab is built in this spec.
- **No replacement of `lib/skill-descriptions.ts`.** The static descriptions stay until the Learn tab ships. Swapping them out when nothing new is wired would be half-done work.
- **No adaptive engine changes.** `recomputeProfile`, `completeTestSession`, `getAdaptivePracticeSet`, and every downstream path stay as-is. New questions just appear in `questionPool` and are picked up automatically.
- **No teacher-facing authoring UI.** Luke is the reviewer; there is no web form for editing drafts.
- **No automated re-generation schedule.** Spec C is one-shot. Nightly top-up for skills that get depleted is a separate future spec.
- **No translation.** English only. Bilingual concerns live inside individual embed activities, not the question pool.
- **No image/figure generation in questions.** Questions requiring geometry figures or charts get rejected by the critic with an `image-needed` tag and moved to a separate backlog.
- **No third-party API usage.** Generation is 100% in-session Claude Code subagents.

## Architecture

### Data flow

```
Lachlan (this session, orchestrator)
  │
  ├─ Reads seed inventory → builds work queue
  │     • ~36 skill-level concept jobs (unique taxonomy keys)
  │     • ~108 skill×course question jobs (one per skill per course)
  │
  ├─ Pre-fetches style anchors per skill×course from questionPool
  │     (3 mid-difficulty existing questions per combo, inlined into
  │      wave 2 subagent prompts; sibling-course fallback if <3 exist)
  │
  ├─ Wave 1: ~36 parallel concept subagents, dispatched in batches of 8
  │     each writes: drafts/skill-content/{taxonomyKey}.json
  │
  ├─ Wave 2: ~108 parallel question subagents, dispatched in batches of 8
  │     each writes: drafts/question-batches/{course}__{taxonomyKey}.json
  │
  ├─ Wave 3: ~144 parallel critic subagents (one per artifact)
  │     each writes: {name}.reviewed.json + {name}.rejected.json
  │
  ├─ Aggregate audit: scripts/audit-question-pool.mjs runs the new
  │     A/B/C/D distribution check against the reviewed batches
  │
  ├─ Orchestrator collates → drafts/parker-gen-report-2026-04-14.md
  │     + Discord summary delivered to nightly-build channel
  │
  ├─ Luke spot-checks flagged batches, optionally reruns jobs
  │
  └─ Luke runs seed scripts (manual):
       node scripts/seed-skill-content.mjs --source parker-gen-2026-04-14
       node scripts/seed-generated-questions.mjs --source parker-gen-2026-04-14
```

### Key structural decisions

- **Concept content is skill-level, not course-scoped.** The explanation of "linear regression" is the same for SAT, PSAT 10/11, PSAT 8/9, and NMSQT. One `skillContent/{taxonomyKey}` doc covers all courses. This is why wave 1 has ~36 jobs (unique taxonomy keys) and wave 2 has ~108 (skill × course).
- **"Staging" is JSON on disk, not a Firestore collection.** Every generated artifact lands in `drafts/` first. Luke reviews the filesystem, runs seed scripts when ready. No `questionPool_staging` collection.
- **Append-only writes to `questionPool`.** The seed script uses `addDoc()` exclusively. Existing 588 questions are never touched. Grade integrity (per `.claude/rules/grade-data-integrity.md`) is preserved structurally.
- **Idempotent reruns.** Every job checks for existing valid output before regenerating. A seed script rerun skips any `(course, skill, source, stem)` tuple already present. Explicit `--force` flag available to regenerate from scratch.

## Content schema

### New collection: `skillContent/{taxonomyKey}`

One doc per unique taxonomy key (~36 total). Course-agnostic.

```ts
interface SkillContent {
  taxonomyKey: string;               // "linear_regression"
  skillLabel: string;                // "Linear regression"
  domain: string;                    // "Problem Solving & Data Analysis"

  conceptBlurb: string;              // 3-5 sentences, replaces lib/skill-descriptions.ts
                                     // when the Learn tab ships
  conceptExplanation: string;        // markdown, ~200-400 words, KaTeX inline
  workedExamples: WorkedExample[];   // 2-3 examples
  hintTemplates: string[];           // 3 general approach prompts, not question-specific

  source: "parker-gen-2026-04-14";
  generatedAt: Timestamp;
  reviewedBy: "parker-critic";
}

interface WorkedExample {
  prompt: string;                    // problem statement, markdown + KaTeX
  steps: string[];                   // 2-5 ordered steps, each 1-2 sentences
  answer: string;                    // final answer
  takeaway: string;                  // 1 sentence, the transferable lesson
}
```

### Additions to `questionPool`

Existing shape from `seed-question-pool.mjs` stays unchanged. Only new metadata tags:

```ts
{
  ...existingQuestionFields,   // course, skill, domain, difficulty, type, stem,
                               // choices, correctAnswer, explanation, etc.
  source: "parker-gen-2026-04-14",
  generatedAt: Timestamp,
  reviewedBy: "parker-critic",
}
```

No schema migration. No changes to any consumer of `questionPool`.

### Render sketch (future Learn tab, not built here)

```
┌─────────────────────────────────────────┐
│  Linear regression                      │
│  [ Practice ]  [ Learn ]  [ History ]   │
├─────────────────────────────────────────┤
│  [conceptExplanation markdown]          │
│                                         │
│  Worked example 1                       │
│    prompt → steps → answer → takeaway   │
│  Worked example 2 ...                   │
│                                         │
│  Stuck? Try one of these:               │
│    • hintTemplate[0]                    │
│    • hintTemplate[1]                    │
│    • hintTemplate[2]                    │
└─────────────────────────────────────────┘
```

Spec C only sketches this layout. Building the Learn tab is a separate future spec.

## Generation prompts

Each subagent receives a self-contained brief. No exploration, no multi-file reading — just a tight task with all needed context inlined.

### Concept subagent brief (~36 jobs, wave 1)

```
You are generating skill-level learning content for a PSAT/SAT prep platform.

SKILL: linear_regression
DOMAIN: Problem Solving & Data Analysis
SKILL LABEL: Linear regression
COLLEGE BOARD DESCRIPTION: [verbatim from docs/superpowers/specs/college-board-skills.md]

DELIVERABLE: one JSON file matching this exact schema:
[SkillContent schema inlined verbatim]

TONE: Written for an 11th grader. Direct, no padding, no "Great question!"
energy. One clear idea per sentence.

CONSTRAINTS:
- All math in KaTeX ($ inline, $$ block). Never plain-text equations.
- conceptBlurb: 3-5 sentences, no more
- conceptExplanation: 200-400 words markdown
- Each workedExample must have 2-5 steps, a final answer, and a one-sentence takeaway
- hintTemplates are general "how to approach any problem in this skill" prompts,
  NOT tied to a specific question
- Worked examples use realistic SAT-style numbers, not 1/2/3 filler

OUTPUT: write to drafts/skill-content/linear_regression.json. Nothing else.
```

### Question subagent brief (~108 jobs, wave 2)

```
You are generating SAT/PSAT practice questions for the adaptive question pool.

SKILL: linear_regression
COURSE: nmsqt-math
DOMAIN: Problem Solving & Data Analysis
DIFFICULTY MIX: 7 easy / 9 medium / 4 hard (NMSQT/PSAT 10/11 proportions — sits
  between SAT and PSAT 8/9)

REFERENCE STYLE ANCHORS (match voice + difficulty calibration):
[3 actual existing questions from questionPool at that skill×course, fetched
 by the orchestrator before dispatch and inlined here. Sibling-course fallback
 if fewer than 3 exist.]

DELIVERABLE: JSON array of 20 question objects matching this exact shape:
[questionPool shape from scripts/seed-question-pool.mjs inlined]

HARD RULES:
- MC questions must have an OBJECTIVELY CORRECT answer. No "which is most likely,"
  no opinions, no predictions. If there's no single right answer, use SPR instead.
- For each question, independently assign the correct answer to a uniformly random
  position (A/B/C/D). Do NOT pre-plan or balance distribution — let randomness
  do its work.
- All math in KaTeX. Never plain-text equations.
- Each question has a 1-2 sentence explanation that explains WHY the right answer
  is right, not just restating it.
- No duplicates with the reference anchors or with each other.
- SPR is for open-numeric answers only (math). Don't use SPR for verbal skills.
- Do NOT reuse the numbers, structure, or problem framing of the reference anchors.
  Match their voice, don't rephrase them.

DIFFICULTY CALIBRATION:
- Easy: single-step, one concept, friendly numbers
- Medium: two-step, may combine with a prerequisite concept
- Hard: multi-step, requires picking the right approach, adversarial distractors

OUTPUT: write to drafts/question-batches/nmsqt-math__linear_regression.json.
Nothing else.
```

### Critic subagent brief (~144 jobs, wave 3)

```
You are reviewing a batch of generated [concept content | practice questions]
for correctness and quality. You do not generate new content — you FIX or REJECT.

INPUT FILE: drafts/question-batches/sat-math__linear_equations.json

FOR EACH QUESTION, CHECK:
1. Is the stated correct answer actually correct? (do the math, verify the text)
2. Are there TWO defensible correct answers? (reject)
3. Is the stem ambiguous, missing info, or unparseable? (reject)
4. Is the question framed as opinion/prediction/guess? (reject or convert to SPR)
5. Is all math in KaTeX? (fix if trivial, reject if pervasive)
6. Does the explanation actually explain, or just restate the answer? (fix)
7. Are the distractors plausible and pedagogically useful?

DO NOT enforce A/B/C/D distribution at the per-batch level. At n=20, genuine
randomness often looks uneven (7/5/4/4 is fine). Aggregate distribution is
checked separately after seeding.

OUTPUT: two files:
- {original}.reviewed.json — approved + fixed questions
- {original}.rejected.json — array of {original, reason} for dropped items
Do not modify the original file.
```

### Difficulty mix per course

From the official SAT/PSAT/NMSQT difficulty distributions:

| Course | Easy | Medium | Hard | Rationale |
|---|---|---|---|---|
| sat-math | 5 | 10 | 5 | SAT's actual Module 2 adaptive routing |
| sat-rw | 5 | 10 | 5 | |
| psat89-math | 8 | 8 | 4 | PSAT 8/9 weighted easier |
| psat89-rw | 8 | 8 | 4 | |
| nmsqt-math | 7 | 9 | 4 | PSAT 10/11 between PSAT 8/9 and SAT |
| nmsqt-rw | 7 | 9 | 4 | |

Each wave-2 subagent is given the exact integer counts for its course so there's no rounding ambiguity.

### Reference material sourcing (orchestrator responsibility)

Before wave 1 dispatches:
- **Skill description reference doc:** `docs/superpowers/specs/college-board-skills.md` — 36 short entries (2-3 sentences each), one per taxonomy key, summarizing what the skill tests and the question shapes that typically show up on the real exam. Written from existing SAT/PSAT knowledge, not literally copied from College Board PDFs. Committed reference; subagent prompts inline the relevant entry verbatim.

Before wave 2 dispatches:
- **Style anchors:** Orchestrator queries `questionPool` for each (course, skill) combo, picks 3 mid-difficulty questions, inlines them into the subagent prompt. Skills with fewer than 3 existing questions pull anchors from a sibling course (e.g., `nmsqt-math linear_regression` falls back to `sat-math linear_regression` anchors).

## Review gate + Discord report

After all three waves complete, orchestrator builds one consolidated report. Delivered to the Discord `nightly-build` channel and written to `drafts/parker-gen-report-2026-04-14.md`.

### Report shape

```markdown
# Parker Content Generation — 2026-04-14

## Summary
- Skill-level bundles: 36 generated, 36 passed critic
- Question batches: 108 generated, 108 passed critic
- Total new questions: 2,160 proposed → 2,120 approved → 40 rejected
- Aggregate answer distribution check: 2 flagged groups (listed below)

## Rejected questions (38)
Grouped by reason, one line per question with pointer to source file:

### Two defensible answers (11)
- sat-math__linear_equations.json #7 — "both (C) and (D) satisfy the system..."
- ...

### Math error in stated answer (6)
- sat-math__quadratic_equations.json #18 — "given x² = 16, stated answer x=4
  omits x=-4"
- ...

### Ambiguous stem (9)
- ...

### Opinion/prediction framed as MC (4)
- ...

### Plain-text math not in KaTeX (8)
- ...

## Suspicious answer distribution (2)
- sat-math__polynomial_operations (26 questions): A=11, B=3, C=7, D=5
  — A over 35%, B under 15%. Recommend rerun.
- nmsqt-rw__transitions (24 questions): A=5, B=6, C=4, D=9
  — within thresholds, flagged for borderline. Optional rerun.

## Files to review before seeding
drafts/skill-content/*.json                 (36 files)
drafts/question-batches/*.reviewed.json     (108 files)

## Commands
# Rerun a specific batch
/parker-regen sat-math polynomial_operations

# Approve and seed everything
node scripts/seed-skill-content.mjs --source parker-gen-2026-04-14
node scripts/seed-generated-questions.mjs --source parker-gen-2026-04-14
```

### Review workflow

1. Luke reads the report
2. Opens any flagged files to eyeball
3. Either:
   - Runs both seed commands → done
   - Says "rerun sat-math polynomial_operations" → orchestrator redispatches that single job's full pipeline (gen → critic → report refresh)
   - Manually edits a `.reviewed.json` file if one question is 95% right and just needs a tweaked distractor → seed script picks up edits as-is

### Aggregate distribution check

Added to `scripts/audit-question-pool.mjs`. For each `(course, skill)` group with ≥20 questions, report the A/B/C/D position distribution. Flag as **suspicious** only if any letter is >35% or <15%. These are the real clustering thresholds at n=20+; genuine randomness almost never crosses them. Flagged groups appear in the report for Luke's review.

### Seed scripts

**`scripts/seed-skill-content.mjs`** (~80 lines):
- Reads all `drafts/skill-content/*.json`
- For each: `setDoc(skillContent/{taxonomyKey}, data)`
- `skillContent` is a new collection with no existing docs → safe overwrite
- Tags every doc with `source: "parker-gen-2026-04-14"`
- Supports `--source <tag>` and `--dry-run` flags

**`scripts/seed-generated-questions.mjs`** (~120 lines):
- Reads all `drafts/question-batches/*.reviewed.json`
- For each question: `addDoc(questionPool, data)` with auto-ID
- Before write, checks for existing doc matching `{course, skill, source: <tag>, stem: X}` — idempotent on rerun
- Existing non-Parker questions are never touched
- Supports `--source <tag>`, `--dry-run`, and `--course <course>` flags

**Grade-integrity rule compliance:** both scripts are strictly additive. No `.set()` on existing docs. No path that could regenerate existing question IDs. Follows `.claude/rules/grade-data-integrity.md`.

## Orchestration mechanics

### Waves and batching

Dispatching 144 `Agent` calls in one message is technically possible but creates rate-limit risk and makes failures hard to isolate. Real plan: **3 waves, chunked batches of 8 parallel subagents per dispatch message**.

```
Wave 1 — Concept bundles: 44 jobs
  6 batches of 8, each batch waits for prior before launching

Wave 2 — Question batches: 97 jobs
  13 batches of 8

Wave 3 — Critic pass: 144 jobs (36 concept + 108 question)
  18 batches of 8

Total dispatch messages: ~37. Wall clock: 30-60 minutes including
orchestration overhead between waves.
```

Batch size of 8 is the starting point. If wave 1 hits rate limits or is unreasonably slow, orchestrator drops to 4 per batch before wave 2 starts.

### Failure handling

Each subagent's final action is writing its output file. After each batch:
- Orchestrator verifies expected output file exists and parses as valid JSON
- Missing/malformed → job goes to end-of-wave retry queue
- Subagent that escalates "I couldn't do this" → same retry queue
- A job that fails twice lands in the final report as `MANUAL-NEEDED`, pipeline continues

### Idempotency + resumption

All three waves are safe to rerun:
- Wave 1 output is overwritten on rerun; downstream is unaffected until seed is run
- Wave 2 and 3 outputs behave the same way
- Orchestrator scans `drafts/` for existing valid output files on startup and skips jobs that already have output
- `--force` flag regenerates everything from scratch

Fresh sessions can resume mid-pipeline: state file is the source of truth.

### Orchestrator state file

`drafts/parker-gen-state.json` (gitignored):

```json
{
  "runId": "parker-gen-2026-04-14",
  "startedAt": "2026-04-14T14:30:00Z",
  "waves": {
    "concept":   { "total": 36,  "done": 36,  "failed": [] },
    "questions": { "total": 108, "done": 107, "failed": ["sat-math__linear_functions"] },
    "critic":    { "total": 144, "done": 143, "failed": [] }
  },
  "finishedAt": null
}
```

### Where orchestration lives

Orchestration is **Lachlan, in a session, issuing `Agent` tool calls** following this spec. It is not a standalone script. The only code deliverables are the two seed scripts, the audit script modification, and the reference doc.

## File structure

| File | Status | Purpose |
|---|---|---|
| `docs/superpowers/specs/college-board-skills.md` | create | ~36 verbatim skill descriptions, inlined into subagent prompts |
| `scripts/seed-skill-content.mjs` | create | Reads `drafts/skill-content/*.json`, writes `skillContent/{taxonomyKey}` |
| `scripts/seed-generated-questions.mjs` | create | Reads `drafts/question-batches/*.reviewed.json`, appends to `questionPool` |
| `scripts/audit-question-pool.mjs` | modify | Add aggregate A/B/C/D distribution check per (course, skill) |
| `drafts/skill-content/.gitkeep` | create | Staging dir for wave 1 output |
| `drafts/question-batches/.gitkeep` | create | Staging dir for wave 2 + 3 output |
| `.gitignore` | modify | Add `drafts/parker-gen-state.json` |

No changes to `lib/`, `components/`, `app/`, or any existing shipping code. Pure content generation + seed infrastructure.

## Testing

No automated test framework (same as prior specs). Verification:

1. **Dry-run seed scripts** before the full pipeline. Run `seed-skill-content.mjs --dry-run` and `seed-generated-questions.mjs --dry-run` with a single pre-authored sample JSON file to confirm the write path works without touching Firestore.
2. **Small-scope first run.** Orchestrator supports `--only <course>__<taxonomyKey>` to run the full pipeline for a single skill×course. Run this once (e.g., `nmsqt-math__linear_regression`), review the output end-to-end, run the seed in dry-run mode, then live. This validates every stage before scaling to the full 288 dispatches.
3. **Audit check.** Run `npm run audit:pool` after seeding. Confirm every (course, skill) group now has ≥20 questions and the A/B/C/D distribution falls within thresholds.
4. **Live practice test.** Open a skill detail page for a newly-populated skill on pantherprep.web.app, run adaptive practice, confirm new questions appear in the session and score correctly.
5. **Grade-integrity check.** Before and after the seed run, query `questionPool` by any existing non-Parker question ID and confirm the doc is byte-identical. No hand-authored content was touched.

## Rollout

Single branch, six tasks:

1. Draft `docs/superpowers/specs/college-board-skills.md` — 44 verbatim College Board skill descriptions
2. Create `scripts/seed-skill-content.mjs` with `--dry-run`, `--source`, and idempotency checks
3. Create `scripts/seed-generated-questions.mjs` with `--dry-run`, `--source`, `--course`, and idempotency checks
4. Modify `scripts/audit-question-pool.mjs` to add the aggregate A/B/C/D distribution check
5. Create `drafts/skill-content/` and `drafts/question-batches/` staging dirs; update `.gitignore`
6. Orchestrate the full generation pipeline (3 waves, ~288 total subagent dispatches: 36 concept + 108 question + 144 critic), review, seed, verify

Tasks 1-5 are the code + reference deliverables. Task 6 is the orchestrator session itself, following this spec.

## Risks + mitigations

1. **Subagent generates confidently wrong math.**
   *Mitigation:* critic's job #1 is re-deriving stated answers. Critic wave is non-negotiable.

2. **Student encounters a bad question post-seed.**
   *Mitigation:* every Parker-generated question is tagged `source: "parker-gen-2026-04-14"`. A one-liner Firestore script can delete-by-tag any subset. Because everything is append-only, rolling back a batch is safe — no student progress depends on these question IDs yet.

3. **Wave dispatches exceed the subagent rate budget.**
   *Mitigation:* batched 8 at a time, not 97 at once. Drop to 4 if wave 1 hits limits.

4. **Style anchors pollute generation** (subagents rephrase the anchors).
   *Mitigation:* anchor prompt explicitly forbids reusing numbers, structure, or framing. Critic flags duplicates.

5. **Concept bundles drift from question content** (e.g., concept says "use point-slope," questions all use slope-intercept).
   *Mitigation:* accepted risk for v1. Tight coupling would require generating concept + questions in the same subagent, which pushes job size beyond what a single subagent handles well. Revisit in v2 if it matters.

6. **Critic is too soft** and approves borderline-ambiguous questions.
   *Mitigation:* aggregate audit at the end surfaces flagged groups. Luke spot-checks. Rerun critic with harsher prompt if a whole batch feels soft.

7. **Lachlan loses context mid-orchestration.**
   *Mitigation:* state file + idempotent waves mean a fresh session can resume. Orchestrator reads `drafts/parker-gen-state.json` on startup and picks up where it left off.

## Open questions

None. Assumptions made:

- 8-wide parallel dispatch is the starting batch size; adjust after wave 1 if needed
- Difficulty mixes match the table above (sourced from the official SAT/PSAT/NMSQT distributions)
- Orchestration lives in a Lachlan session, not as standalone code; the seed scripts are the only code deliverables
- Grade-integrity rule is satisfied by strictly additive writes; no `.set()` path anywhere in the seed scripts
- `skillContent/{taxonomyKey}` is a brand-new collection with no existing docs, so `setDoc` is safe there
- Claude Code subscription covers all subagent token cost; no third-party API billing
