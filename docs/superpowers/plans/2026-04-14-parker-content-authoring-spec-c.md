# Parker Content Authoring Pipeline Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Generate skill-level content bundles + ~2,160 additional practice questions across every skill×course combination in pantherprep via parallel Claude Code subagent dispatches, then seed additively to Firestore.

**Architecture:** Six code deliverables (reference doc, two seed scripts, one audit script extension, a drafts dir, an npm script registration) plus one orchestration task that issues ~288 subagent dispatches across three waves (concept → question → critic). All writes are append-only and tagged `source: "parker-gen-2026-04-14"` so runs are idempotent and reversible. No schema changes, no UI changes, no third-party API usage.

**Tech Stack:** Node.js ESM, firebase-admin SDK, Firestore, Claude Code `Agent` tool for subagent dispatch, existing `scripts/skill-mapping.ts` shim.

**Spec:** `docs/superpowers/specs/2026-04-14-parker-content-authoring-spec-c-design.md`

---

## File Structure

| File | Status | Task |
|---|---|---|
| `drafts/skill-content/.gitkeep` | create | 1 |
| `drafts/question-batches/.gitkeep` | create | 1 |
| `.gitignore` | modify | 1 |
| `docs/superpowers/specs/college-board-skills.md` | create | 2 |
| `scripts/seed-skill-content.mjs` | create | 3 |
| `scripts/seed-generated-questions.mjs` | create | 4 |
| `scripts/audit-question-pool.mjs` | modify | 5 |
| `package.json` | modify | 6 |
| `drafts/skill-content/*.json` + `drafts/question-batches/*.json` | generated | 7 (orchestration, not code) |

Total code tasks: 6. Orchestration (task 7) is a live subagent-dispatch session following the spec — no code, just commands.

---

## Taxonomy key reference

The plan references 36 taxonomy keys. Here they are, grouped:

**Math (25):** absolute_value, area_perimeter, circles, coordinate_geometry, exponential_functions, linear_equations, linear_functions, linear_inequalities, linear_regression, percentages, polynomial_operations, probability, quadratic_equations, quadratic_formula, radical_equations, rational_expressions, ratios_rates, right_triangle_trig, scatterplots, statistics_central_tendency, statistics_spread, systems_of_equations, triangles, two_way_tables, volume

**Reading & Writing (11):** central_ideas, cross_text_connections, details_evidence, inferences, modifiers, punctuation_boundaries, purpose_function, quantitative_evidence, rhetorical_synthesis, transitions, vocabulary_in_context

**Course assignments:**
- sat-math, nmsqt-math, psat89-math → 25 math skills each → 75 skill×course combos
- sat-rw, nmsqt-rw, psat89-rw → 11 R&W skills each → 33 skill×course combos
- Total: **108 skill×course combos**

---

## Task 1: Staging directories + gitignore

**Files:**
- Create: `drafts/skill-content/.gitkeep`
- Create: `drafts/question-batches/.gitkeep`
- Modify: `.gitignore`

- [ ] **Step 1: Create the staging directories with .gitkeep files**

```bash
mkdir -p drafts/skill-content drafts/question-batches
touch drafts/skill-content/.gitkeep drafts/question-batches/.gitkeep
```

- [ ] **Step 2: Read the current .gitignore to locate a reasonable insertion point**

Run: `cat .gitignore`
Expected: Existing gitignore content displayed.

- [ ] **Step 3: Add the orchestrator state file to .gitignore**

Append these lines at the end of `.gitignore`:

```gitignore

# Parker content generation orchestrator state (spec C)
drafts/parker-gen-state.json
drafts/parker-gen-report-*.md
```

Rationale: `drafts/skill-content/*.json` and `drafts/question-batches/*.json` are intentionally NOT gitignored — we want the generated drafts committed so the review workflow is inspectable in git history and diffs. Only the runtime state file and the report output are ephemeral.

- [ ] **Step 4: Verify directories exist and gitignore updated**

Run: `ls -la drafts/ && tail -5 .gitignore`
Expected: Both `skill-content/` and `question-batches/` directories visible; last lines of gitignore include the new entries.

- [ ] **Step 5: Commit**

```bash
git add drafts/skill-content/.gitkeep drafts/question-batches/.gitkeep .gitignore
git commit -m "Spec C task 1: add drafts/ staging dirs and gitignore entries"
```

---

## Task 2: Skill description reference doc

**Files:**
- Create: `docs/superpowers/specs/college-board-skills.md`

Purpose: a single committed reference file that every wave-1 concept subagent and every wave-2 question subagent reads to prime its context. Each entry is 2-3 sentences describing what the skill tests, the question shapes that typically show up on the real exam, and any traps students fall into.

Note: "college-board-skills.md" is a filename — the content is *not* verbatim College Board copy. These are original descriptions based on the published SAT/PSAT skill taxonomy.

- [ ] **Step 1: Create the file with the full 36-entry reference doc**

Write this entire content to `docs/superpowers/specs/college-board-skills.md`:

````markdown
# SAT/PSAT Skill Description Reference

One short entry per taxonomy key. Used by the Parker content-authoring pipeline (spec C) to prime generation and critic subagents. Not copied from College Board — original summaries of what each skill tests and the question shapes that show up on the real exam.

## Math Skills

### absolute_value
Tests absolute value equations, inequalities, and their graph shape. Questions usually ask students to solve $|ax+b|=c$ (splitting into two cases) or to interpret the vee-shape of $y=|x-h|+k$. Common trap: forgetting the negative case and only reporting one solution.

### area_perimeter
Tests basic plane geometry — area and perimeter of rectangles, triangles, circles, and composite figures. Questions are usually two-step: compute an unknown side from a perimeter constraint, then use it to find area (or vice versa). Composite figures use subtraction (area outside shape A minus area of shape B inside it).

### circles
Tests the equation of a circle $(x-h)^2+(y-k)^2=r^2$, completing the square to convert general form to standard form, and chord/radius/tangent relationships. Questions often give the general-form equation and ask for center, radius, or points on the circle. Trap: sign errors on $h$ and $k$ when reading off the center.

### coordinate_geometry
Tests distance, midpoint, slope, and line equations in the coordinate plane. Questions often combine two skills — find the midpoint of a segment, then determine the slope of a perpendicular line through it. Students should know slope-intercept, point-slope, and standard form conversions fluently.

### exponential_functions
Tests the form $y=a\cdot b^x$ — growth vs. decay, identifying $a$ as the initial value and $b$ as the growth factor. Questions give a word problem (population, bank account, radioactive decay) and ask students to set up the function, evaluate it at a future time, or solve for when it hits a target. Trap: confusing $1+r$ (growth factor) with $r$ (growth rate).

### linear_equations
Tests solving single-variable linear equations, including ones with variables on both sides, parentheses, and fractional coefficients. Questions range from direct algebraic manipulation to word problems that require setting up the equation first. Also covers interpreting slope and intercept in real-world context.

### linear_functions
Tests function notation $f(x)=mx+b$, evaluating at a point, finding the function rule from two points, and interpreting slope and intercept in context. Questions often give a table of values and ask students to identify the linear function that matches. Trap: confusing $f(a)$ (plug $a$ into $f$) with $f(x)=a$ (solve for the $x$ that outputs $a$).

### linear_inequalities
Tests solving linear inequalities in one variable and graphing solution sets. Key rule: flip the inequality when multiplying or dividing by a negative. Questions may ask students to identify the graph of a solution, or to express it in interval notation.

### linear_regression
Tests interpreting a line-of-best-fit on a scatterplot. Questions give a regression equation like $y=2.3x+15.4$ and ask students to interpret slope and intercept in the context of the variables (e.g., "for every additional X, Y increases by 2.3"). Also covers predicting Y for a given X within the data range.

### percentages
Tests percent-of, percent increase/decrease, and markup/discount word problems. Questions often chain operations: price goes up 20% then down 15%, what's the net change? Trap: applying the second percent to the original rather than to the new total.

### polynomial_operations
Tests adding, subtracting, multiplying, and factoring polynomials. Covers the difference of squares $a^2-b^2=(a-b)(a+b)$, trinomial factoring, and polynomial long division. Questions often ask students to simplify an expression or to identify an equivalent form among four choices.

### probability
Tests simple and compound probability, including "with replacement" vs. "without replacement," independent events, and conditional probability from two-way tables. Questions frequently use dice, cards, or marbles in bags. Trap: double-counting outcomes that satisfy both events in a P(A or B) question.

### quadratic_equations
Tests solving quadratics by factoring, completing the square, and the quadratic formula. Covers the relationship between roots, vertex, axis of symmetry, and discriminant. Questions ask for real solutions, the number of real solutions, or the vertex of a parabola given its equation.

### quadratic_formula
Tests applied use of $x=\\frac{-b\\pm\\sqrt{b^2-4ac}}{2a}$, especially when factoring doesn't work cleanly. Questions give a quadratic in standard form and ask for exact solutions or the sum/product of roots. Trap: sign errors on $b$ when the coefficient is negative.

### radical_equations
Tests solving equations with square roots, cube roots, or rational exponents. Key technique: isolate the radical, square both sides, solve the resulting polynomial, and *check for extraneous solutions*. Questions always include at least one case where squaring introduces a false solution.

### rational_expressions
Tests simplifying, adding, subtracting, multiplying, and dividing rational expressions. Students must find common denominators, factor first, and identify restrictions (values that make a denominator zero). Questions often ask for the simplified form or for values of $x$ where the expression is undefined.

### ratios_rates
Tests proportional reasoning, unit rates, and scaling. Questions use recipes, unit conversions, maps, and mixture problems. Students set up a proportion and cross-multiply, or use dimensional analysis. Trap: inverting the ratio when the question phrases it in reverse.

### right_triangle_trig
Tests sine, cosine, tangent, and the Pythagorean theorem in right triangles. Covers SOHCAHTOA, the 30-60-90 and 45-45-90 special triangles, and inverse trig for finding angles. Questions often give two sides or one side and one angle, and ask for the unknown.

### scatterplots
Tests reading a scatterplot, identifying correlation direction and strength, and estimating a line of best fit by eye. Questions may ask students to predict a $y$ value for a given $x$, or to identify which of four lines best fits the data. Often paired with linear_regression.

### statistics_central_tendency
Tests mean, median, and mode — especially how an outlier affects each. Questions give a small data set and ask for one of the three measures, or ask which measure is most affected by a changed value. Trap: forgetting to sort the data before finding the median.

### statistics_spread
Tests range, standard deviation (qualitatively, not computationally), and interquartile range. Questions compare two data sets and ask which has larger spread, or ask how removing an outlier affects the spread. Students should know that standard deviation is sensitive to outliers and IQR is not.

### systems_of_equations
Tests solving systems of two linear equations using substitution or elimination, and recognizing when a system has one solution, no solutions, or infinitely many. Questions also cover linear-quadratic systems solved by substitution. Trap: arithmetic slips in elimination when coefficients need to be multiplied out first.

### triangles
Tests angle relationships, triangle inequality, similar triangles, and isosceles/equilateral properties. Questions often give a figure with some angles marked and ask for an unknown angle using the fact that interior angles sum to $180°$. Similarity problems use ratios of corresponding sides.

### two_way_tables
Tests reading a two-way frequency table and computing joint, marginal, and conditional probabilities. Questions ask things like "given that a respondent is under 18, what fraction voted yes?" — a conditional probability. Trap: using the total instead of the row/column total as the denominator.

### volume
Tests volume formulas for prisms, cylinders, cones, pyramids, and spheres. The SAT provides the formulas at the start of the math section, so the test is whether students know which formula applies and can plug in correctly. Trap: using diameter instead of radius in the cylinder or sphere formulas.

## Reading & Writing Skills

### central_ideas
Tests identifying the main idea or overall purpose of a passage. Questions ask "which choice best states the central idea?" or "the passage is primarily concerned with..." The correct answer captures both the topic AND the author's angle on it, not just one or the other.

### cross_text_connections
Tests relationships between two paired passages — usually where the authors agree, disagree, or extend each other's arguments. Questions ask things like "the author of Passage 2 would most likely respond to the claim in lines X-Y of Passage 1 by..." Students must read both passages actively and track each author's stance separately.

### details_evidence
Tests finding specific information in a passage and identifying which lines support a claim. Command-of-evidence questions pair: first "what does the author think X?", then "which lines best support the previous answer?" Students must actually locate the line, not just pick plausible-sounding text.

### inferences
Tests drawing logical conclusions from a passage — things the author implies but doesn't state directly. Correct answers are tightly supported by the text; wrong answers are either too broad, too narrow, or use information not in the passage. Students should be suspicious of any answer that would need outside knowledge.

### modifiers
Tests modifier placement, especially dangling and misplaced modifiers. Questions give a sentence with an introductory phrase and ask students to pick the version where the thing being modified comes first in the main clause. Trap: answers that sound fluent but have the wrong noun as the subject.

### punctuation_boundaries
Tests commas, semicolons, colons, and dashes at sentence boundaries and between clauses. The test specifically checks whether students know when to use a semicolon vs. a comma splice, when a colon is appropriate, and when no punctuation is needed. Questions are often 4-choice "punctuation only" problems.

### purpose_function
Tests identifying the function of a specific sentence, paragraph, or word choice within the larger passage. Questions ask "the author uses the phrase X to..." or "what is the function of the third paragraph?" Correct answers describe what the passage *does*, not just what it says.

### quantitative_evidence
Tests using data from tables or graphs to support claims in a passage. Questions give both a passage and a table and ask "which choice most effectively uses data from the table to support the author's claim?" Students must check that the answer's numbers actually match the table.

### rhetorical_synthesis
Tests combining several pieces of information from notes or bullet points into a single sentence that accomplishes a specific rhetorical goal. The goal is always stated — "make a comparison," "introduce a counterexample," "emphasize the scale of the problem." Students must pick the sentence that achieves that specific goal, not just any true sentence.

### transitions
Tests choosing the right transition word or phrase between sentences — "however," "therefore," "moreover," "for example," etc. Students must read the logical relationship between the two sentences (contrast, cause/effect, example, addition) and pick the transition that matches. Trap: transitions that sound fluent but express the wrong relationship.

### vocabulary_in_context
Tests identifying the meaning of a word as it's used in a specific passage. Correct answers are context-dependent — a word's common meaning might be wrong if the passage uses it in a specialized way. Students should substitute each answer choice into the sentence and pick the one that preserves meaning.
````

- [ ] **Step 2: Verify file created with 36 skill entries**

Run: `grep -c "^### " docs/superpowers/specs/college-board-skills.md`
Expected: `36`

- [ ] **Step 3: Commit**

```bash
git add docs/superpowers/specs/college-board-skills.md
git commit -m "Spec C task 2: skill description reference doc (36 entries)"
```

---

## Task 3: `scripts/seed-skill-content.mjs`

**Files:**
- Create: `scripts/seed-skill-content.mjs`
- Create: `drafts/skill-content/_sample.json` (test fixture, not committed)

Purpose: read all `drafts/skill-content/*.json` files, validate each against the `SkillContent` schema, and write them to the `skillContent` Firestore collection keyed by `taxonomyKey`. Supports `--dry-run`, `--source <tag>`, and rejects files that don't match the schema.

- [ ] **Step 1: Write a fixture file that exercises the script**

Write this content to `drafts/skill-content/_sample.json` (starts with underscore so the script can ignore it if we want later, but for now we keep it as a test fixture):

```json
{
  "taxonomyKey": "linear_equations",
  "skillLabel": "Linear equations",
  "domain": "Algebra",
  "conceptBlurb": "Linear equations are equations of the form ax + b = c, where the goal is to isolate x. The SAT tests these through direct algebra, word problems, and real-world context.",
  "conceptExplanation": "A linear equation in one variable has the general form $ax + b = c$ where $a \\neq 0$. Solving means finding the value of $x$ that makes both sides equal.\n\nThe basic technique: undo the operations in reverse order. Subtract $b$ from both sides, then divide by $a$. For equations with variables on both sides, first collect the $x$ terms on one side and the constants on the other.\n\nOn the SAT, linear equations show up in three flavors: direct algebra, word problems that require translating English into an equation, and interpretation questions where you're given an equation in context and asked what a coefficient represents.",
  "workedExamples": [
    {
      "prompt": "Solve for x: $3x - 7 = 2x + 5$",
      "steps": [
        "Subtract $2x$ from both sides to collect variables: $x - 7 = 5$.",
        "Add 7 to both sides to isolate $x$: $x = 12$."
      ],
      "answer": "x = 12",
      "takeaway": "Always collect variables on one side and constants on the other before isolating."
    },
    {
      "prompt": "A phone plan costs $\\$30$ per month plus $\\$0.10$ per minute. If the bill is $\\$45$, how many minutes were used?",
      "steps": [
        "Set up: $30 + 0.10m = 45$, where $m$ is minutes.",
        "Subtract 30: $0.10m = 15$.",
        "Divide by $0.10$: $m = 150$."
      ],
      "answer": "150 minutes",
      "takeaway": "Word problems reduce to an equation once you identify the variable and the rate."
    }
  ],
  "hintTemplates": [
    "What operation is being done to x? The solving step is the inverse of that operation.",
    "If there are variables on both sides, start by collecting them onto the side with the larger coefficient.",
    "After solving, plug your answer back into the original equation to check."
  ],
  "source": "parker-gen-2026-04-14",
  "generatedAt": "2026-04-14T00:00:00.000Z",
  "reviewedBy": "parker-critic"
}
```

- [ ] **Step 2: Write the seed script**

Write this content to `scripts/seed-skill-content.mjs`:

```javascript
#!/usr/bin/env node
// Seed script: reads drafts/skill-content/*.json, validates each, writes to
// Firestore skillContent/{taxonomyKey}. Strictly additive in the sense that
// skillContent is a new collection — no existing hand-authored docs exist
// to overwrite. Idempotent on re-run: a fresh write replaces the previous
// one only if the source tag matches.
//
// Usage:
//   GOOGLE_CLOUD_PROJECT=pantherprep-a5a73 node scripts/seed-skill-content.mjs --dry-run
//   GOOGLE_CLOUD_PROJECT=pantherprep-a5a73 node scripts/seed-skill-content.mjs --dry-run --source parker-gen-2026-04-14
//   GOOGLE_CLOUD_PROJECT=pantherprep-a5a73 node scripts/seed-skill-content.mjs --source parker-gen-2026-04-14

import admin from "firebase-admin";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
const SOURCE_TAG =
  args.find((a) => a.startsWith("--source="))?.split("=")[1] ??
  args[args.indexOf("--source") + 1] ??
  "parker-gen-2026-04-14";

const DRAFTS_DIR = "drafts/skill-content";

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});
const db = admin.firestore();

// --- Schema validation ---
function validateSkillContent(data, filename) {
  const errors = [];
  const required = [
    "taxonomyKey",
    "skillLabel",
    "domain",
    "conceptBlurb",
    "conceptExplanation",
    "workedExamples",
    "hintTemplates",
  ];
  for (const field of required) {
    if (data[field] === undefined || data[field] === null) {
      errors.push(`missing field: ${field}`);
    }
  }

  if (typeof data.conceptBlurb === "string") {
    const sentences = data.conceptBlurb.split(/[.!?]+\s/).filter(Boolean);
    if (sentences.length < 2 || sentences.length > 7) {
      errors.push(
        `conceptBlurb should be 3-5 sentences (got ~${sentences.length})`
      );
    }
  }

  if (Array.isArray(data.workedExamples)) {
    if (data.workedExamples.length < 2 || data.workedExamples.length > 3) {
      errors.push(
        `workedExamples should have 2-3 entries (got ${data.workedExamples.length})`
      );
    }
    data.workedExamples.forEach((ex, i) => {
      if (!ex.prompt || !ex.steps || !ex.answer || !ex.takeaway) {
        errors.push(`workedExamples[${i}] missing required sub-field`);
      }
      if (Array.isArray(ex.steps) && (ex.steps.length < 2 || ex.steps.length > 5)) {
        errors.push(
          `workedExamples[${i}].steps should have 2-5 entries (got ${ex.steps.length})`
        );
      }
    });
  }

  if (Array.isArray(data.hintTemplates) && data.hintTemplates.length !== 3) {
    errors.push(`hintTemplates should have exactly 3 entries (got ${data.hintTemplates.length})`);
  }

  return errors;
}

// --- Main ---
async function main() {
  console.log(`seed-skill-content starting. DRY_RUN=${DRY_RUN} SOURCE=${SOURCE_TAG}`);

  let files;
  try {
    files = readdirSync(DRAFTS_DIR).filter(
      (f) => f.endsWith(".json") && !f.startsWith("_")
    );
  } catch (e) {
    console.error(`Cannot read ${DRAFTS_DIR}:`, e.message);
    process.exit(1);
  }

  console.log(`Found ${files.length} draft file(s) in ${DRAFTS_DIR}`);

  const validDocs = [];
  const invalidFiles = [];

  for (const file of files) {
    const path = join(DRAFTS_DIR, file);
    let data;
    try {
      data = JSON.parse(readFileSync(path, "utf8"));
    } catch (e) {
      invalidFiles.push({ file, error: `JSON parse error: ${e.message}` });
      continue;
    }

    const errors = validateSkillContent(data, file);
    if (errors.length > 0) {
      invalidFiles.push({ file, error: errors.join("; ") });
      continue;
    }

    validDocs.push({ file, data });
  }

  console.log(`\nValid: ${validDocs.length}`);
  console.log(`Invalid: ${invalidFiles.length}`);
  if (invalidFiles.length > 0) {
    console.log(`\nInvalid files:`);
    for (const { file, error } of invalidFiles) {
      console.log(`  ${file}: ${error}`);
    }
  }

  if (validDocs.length === 0) {
    console.log(`\nNothing to write. Done.`);
    return;
  }

  // Print sample
  console.log(`\n--- Sample (first valid doc) ---`);
  console.log(JSON.stringify(validDocs[0].data, null, 2).slice(0, 800));
  console.log(`--- End sample ---\n`);

  if (DRY_RUN) {
    console.log(`DRY_RUN — no writes. Would write ${validDocs.length} docs to skillContent/.`);
    return;
  }

  const now = admin.firestore.FieldValue.serverTimestamp();
  const colRef = db.collection("skillContent");
  let written = 0;

  for (const { data } of validDocs) {
    const payload = {
      ...data,
      source: SOURCE_TAG,
      generatedAt: now,
      updatedAt: now,
    };
    await colRef.doc(data.taxonomyKey).set(payload, { merge: false });
    written += 1;
    console.log(`  Wrote skillContent/${data.taxonomyKey}`);
  }

  console.log(`\nseed-skill-content complete. Written: ${written}`);
}

main().catch((e) => {
  console.error("seed-skill-content failed:", e);
  process.exit(1);
});
```

- [ ] **Step 3: Run the script in dry-run mode against the fixture**

Run: `cd ~/pantherprep && GOOGLE_CLOUD_PROJECT=pantherprep-a5a73 node scripts/seed-skill-content.mjs --dry-run`

Expected output (approximately):
```
seed-skill-content starting. DRY_RUN=true SOURCE=parker-gen-2026-04-14
Found 1 draft file(s) in drafts/skill-content
Valid: 1
Invalid: 0

--- Sample (first valid doc) ---
{
  "taxonomyKey": "linear_equations",
  ...
}
--- End sample ---

DRY_RUN — no writes. Would write 1 docs to skillContent/.
```

- [ ] **Step 4: Test the invalid-file path**

Create a deliberately invalid fixture at `drafts/skill-content/_bad.json`:

```json
{
  "taxonomyKey": "broken",
  "skillLabel": "Broken"
}
```

Note: because `_bad.json` starts with `_`, the script ignores it. Rename to test:

```bash
mv drafts/skill-content/_bad.json drafts/skill-content/bad.json
GOOGLE_CLOUD_PROJECT=pantherprep-a5a73 node scripts/seed-skill-content.mjs --dry-run
```

Expected: The script reports `Valid: 1`, `Invalid: 1`, and lists `bad.json` with missing-field errors. It does NOT crash.

Clean up:
```bash
rm drafts/skill-content/bad.json
```

- [ ] **Step 5: Clean up the sample fixture (it should not be committed)**

```bash
rm drafts/skill-content/_sample.json
```

- [ ] **Step 6: Commit**

```bash
git add scripts/seed-skill-content.mjs
git commit -m "Spec C task 3: seed-skill-content.mjs with dry-run + validation"
```

---

## Task 4: `scripts/seed-generated-questions.mjs`

**Files:**
- Create: `scripts/seed-generated-questions.mjs`
- Create: `drafts/question-batches/_sample.json` (test fixture, not committed)

Purpose: read all `drafts/question-batches/*.reviewed.json` files, validate each question against a subset of the existing `questionPool` shape, and append them to Firestore. Idempotent: skips questions where `(course, skill, source, stem)` already exists. Tags every doc with `source: "parker-gen-2026-04-14"`.

- [ ] **Step 1: Write a fixture file that exercises the script**

Write this content to `drafts/question-batches/_sample.reviewed.json`:

```json
[
  {
    "course": "sat-math",
    "testType": "sat",
    "section": "math",
    "domain": "Algebra",
    "skill": "linear_equations",
    "sourceSkill": "Linear equations in 1 variable",
    "difficulty": "F",
    "type": "mc",
    "stem": "If $3x - 7 = 2x + 5$, what is the value of $x$?",
    "choices": [
      { "key": "A", "text": "5" },
      { "key": "B", "text": "7" },
      { "key": "C", "text": "10" },
      { "key": "D", "text": "12" }
    ],
    "correctAnswer": "D",
    "explanation": "Subtract $2x$ from both sides to get $x - 7 = 5$, then add 7 to get $x = 12$.",
    "katex": true,
    "tags": ["parker-gen-2026-04-14"]
  }
]
```

- [ ] **Step 2: Write the seed script**

Write this content to `scripts/seed-generated-questions.mjs`:

```javascript
#!/usr/bin/env node
// Seed script: reads drafts/question-batches/*.reviewed.json, validates each
// question, appends to questionPool via auto-ID addDoc. Idempotent on re-run:
// skips any (course, skill, source, stem) tuple already present.
//
// This script is STRICTLY ADDITIVE. It never touches existing questions.
// It never uses setDoc. It only adds new docs with Firestore-generated IDs.
//
// Usage:
//   GOOGLE_CLOUD_PROJECT=pantherprep-a5a73 node scripts/seed-generated-questions.mjs --dry-run
//   GOOGLE_CLOUD_PROJECT=pantherprep-a5a73 node scripts/seed-generated-questions.mjs --dry-run --course sat-math
//   GOOGLE_CLOUD_PROJECT=pantherprep-a5a73 node scripts/seed-generated-questions.mjs --source parker-gen-2026-04-14

import admin from "firebase-admin";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
const SOURCE_TAG =
  args.find((a) => a.startsWith("--source="))?.split("=")[1] ??
  args[args.indexOf("--source") + 1] ??
  "parker-gen-2026-04-14";
const COURSE_FILTER =
  args.find((a) => a.startsWith("--course="))?.split("=")[1] ??
  (args.indexOf("--course") >= 0 ? args[args.indexOf("--course") + 1] : null);

const DRAFTS_DIR = "drafts/question-batches";
const VALID_COURSES = new Set([
  "sat-math", "sat-rw", "nmsqt-math", "nmsqt-rw", "psat89-math", "psat89-rw",
]);
const VALID_DIFFICULTIES = new Set(["F", "M", "C"]);
const VALID_TYPES = new Set(["mc", "spr"]);

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});
const db = admin.firestore();

// --- Validation ---
function validateQuestion(q, filename, idx) {
  const errors = [];
  const required = [
    "course", "testType", "section", "domain", "skill", "sourceSkill",
    "difficulty", "type", "stem", "correctAnswer", "explanation",
  ];
  for (const field of required) {
    if (q[field] === undefined || q[field] === null || q[field] === "") {
      errors.push(`missing field: ${field}`);
    }
  }
  if (!VALID_COURSES.has(q.course)) errors.push(`invalid course: ${q.course}`);
  if (!VALID_DIFFICULTIES.has(q.difficulty)) errors.push(`invalid difficulty: ${q.difficulty} (expected F|M|C)`);
  if (!VALID_TYPES.has(q.type)) errors.push(`invalid type: ${q.type} (expected mc|spr)`);

  if (q.type === "mc") {
    if (!Array.isArray(q.choices) || q.choices.length !== 4) {
      errors.push(`mc question must have exactly 4 choices (got ${q.choices?.length})`);
    } else {
      const keys = q.choices.map((c) => c.key);
      if (JSON.stringify(keys) !== JSON.stringify(["A", "B", "C", "D"])) {
        errors.push(`mc choice keys must be [A,B,C,D] in order`);
      }
      if (!["A", "B", "C", "D"].includes(q.correctAnswer)) {
        errors.push(`mc correctAnswer must be A|B|C|D (got "${q.correctAnswer}")`);
      }
    }
  }

  return errors;
}

// --- Main ---
async function main() {
  console.log(
    `seed-generated-questions starting. DRY_RUN=${DRY_RUN} SOURCE=${SOURCE_TAG} COURSE=${COURSE_FILTER ?? "(all)"}`
  );

  let files;
  try {
    files = readdirSync(DRAFTS_DIR).filter(
      (f) => f.endsWith(".reviewed.json") && !f.startsWith("_")
    );
  } catch (e) {
    console.error(`Cannot read ${DRAFTS_DIR}:`, e.message);
    process.exit(1);
  }

  // Filter by --course flag if provided
  if (COURSE_FILTER) {
    files = files.filter((f) => f.startsWith(`${COURSE_FILTER}__`));
  }

  console.log(`Found ${files.length} batch file(s) in ${DRAFTS_DIR}`);

  const validQuestions = [];
  const invalidQuestions = [];

  for (const file of files) {
    const path = join(DRAFTS_DIR, file);
    let arr;
    try {
      arr = JSON.parse(readFileSync(path, "utf8"));
    } catch (e) {
      invalidQuestions.push({ file, idx: null, error: `JSON parse error: ${e.message}` });
      continue;
    }
    if (!Array.isArray(arr)) {
      invalidQuestions.push({ file, idx: null, error: `expected top-level array` });
      continue;
    }
    arr.forEach((q, idx) => {
      const errors = validateQuestion(q, file, idx);
      if (errors.length > 0) {
        invalidQuestions.push({ file, idx, error: errors.join("; ") });
      } else {
        validQuestions.push({ file, q });
      }
    });
  }

  console.log(`\nValid questions: ${validQuestions.length}`);
  console.log(`Invalid questions: ${invalidQuestions.length}`);
  if (invalidQuestions.length > 0) {
    console.log(`\nFirst 10 invalid:`);
    for (const { file, idx, error } of invalidQuestions.slice(0, 10)) {
      console.log(`  ${file}[${idx}]: ${error}`);
    }
  }

  if (validQuestions.length === 0) {
    console.log(`\nNothing to write. Done.`);
    return;
  }

  // Print sample
  console.log(`\n--- Sample (first valid question) ---`);
  console.log(JSON.stringify(validQuestions[0].q, null, 2).slice(0, 600));
  console.log(`--- End sample ---\n`);

  if (DRY_RUN) {
    console.log(
      `DRY_RUN — no writes. Would append ${validQuestions.length} docs to questionPool/.`
    );
    return;
  }

  // Idempotency: fetch existing (course, skill, source, stem) tuples for this source
  console.log(`Fetching existing questionPool docs with source=${SOURCE_TAG}...`);
  const existingSnap = await db
    .collection("questionPool")
    .where("source", "==", SOURCE_TAG)
    .get();
  const existingKeys = new Set();
  for (const doc of existingSnap.docs) {
    const d = doc.data();
    existingKeys.add(`${d.course}|${d.skill}|${d.stem}`);
  }
  console.log(`Found ${existingKeys.size} existing docs with this source tag.`);

  const now = admin.firestore.FieldValue.serverTimestamp();
  const colRef = db.collection("questionPool");
  let written = 0;
  let skipped = 0;

  for (const { q } of validQuestions) {
    const key = `${q.course}|${q.skill}|${q.stem}`;
    if (existingKeys.has(key)) {
      skipped += 1;
      continue;
    }
    const payload = {
      ...q,
      source: SOURCE_TAG,
      reviewedBy: "parker-critic",
      generatedAt: now,
      createdAt: now,
      updatedAt: now,
    };
    await colRef.add(payload);
    written += 1;
    if (written % 50 === 0) console.log(`  Wrote ${written}...`);
  }

  console.log(`\nseed-generated-questions complete.`);
  console.log(`  Written: ${written}`);
  console.log(`  Skipped (already existed): ${skipped}`);
}

main().catch((e) => {
  console.error("seed-generated-questions failed:", e);
  process.exit(1);
});
```

- [ ] **Step 3: Run the script in dry-run mode against the fixture**

Run: `cd ~/pantherprep && GOOGLE_CLOUD_PROJECT=pantherprep-a5a73 node scripts/seed-generated-questions.mjs --dry-run`

Note: because `_sample.reviewed.json` starts with `_`, it will be ignored by the glob. Rename temporarily to exercise the script:

```bash
mv drafts/question-batches/_sample.reviewed.json drafts/question-batches/sample.reviewed.json
GOOGLE_CLOUD_PROJECT=pantherprep-a5a73 node scripts/seed-generated-questions.mjs --dry-run
```

Expected output (approximately):
```
seed-generated-questions starting. DRY_RUN=true SOURCE=parker-gen-2026-04-14 COURSE=(all)
Found 1 batch file(s) in drafts/question-batches
Valid questions: 1
Invalid questions: 0

--- Sample (first valid question) ---
{ "course": "sat-math", ... }
--- End sample ---

DRY_RUN — no writes. Would append 1 docs to questionPool/.
```

- [ ] **Step 4: Test invalid-question rejection**

Edit `drafts/question-batches/sample.reviewed.json` to break it — set `correctAnswer` to `"X"` (invalid for MC):

```bash
node -e "const fs = require('fs'); const p = 'drafts/question-batches/sample.reviewed.json'; const a = JSON.parse(fs.readFileSync(p)); a[0].correctAnswer = 'X'; fs.writeFileSync(p, JSON.stringify(a, null, 2));"
GOOGLE_CLOUD_PROJECT=pantherprep-a5a73 node scripts/seed-generated-questions.mjs --dry-run
```

Expected: Script reports `Valid questions: 0`, `Invalid questions: 1`, error message mentions `mc correctAnswer must be A|B|C|D (got "X")`.

- [ ] **Step 5: Test --course filter**

Restore the valid fixture:

```bash
node -e "const fs = require('fs'); const p = 'drafts/question-batches/sample.reviewed.json'; const a = JSON.parse(fs.readFileSync(p)); a[0].correctAnswer = 'D'; fs.writeFileSync(p, JSON.stringify(a, null, 2));"
```

Rename to include a course prefix so the `--course` filter has something to match:

```bash
mv drafts/question-batches/sample.reviewed.json drafts/question-batches/sat-math__linear_equations.reviewed.json
GOOGLE_CLOUD_PROJECT=pantherprep-a5a73 node scripts/seed-generated-questions.mjs --dry-run --course sat-math
```

Expected: `Found 1 batch file(s)`, `Valid questions: 1`.

Now try a non-matching course:
```bash
GOOGLE_CLOUD_PROJECT=pantherprep-a5a73 node scripts/seed-generated-questions.mjs --dry-run --course nmsqt-math
```

Expected: `Found 0 batch file(s)`, `Nothing to write. Done.`

- [ ] **Step 6: Clean up fixtures**

```bash
rm drafts/question-batches/sat-math__linear_equations.reviewed.json
```

- [ ] **Step 7: Commit**

```bash
git add scripts/seed-generated-questions.mjs
git commit -m "Spec C task 4: seed-generated-questions.mjs with dry-run + validation + idempotency"
```

---

## Task 5: Extend `audit-question-pool.mjs` with A/B/C/D distribution

**Files:**
- Modify: `scripts/audit-question-pool.mjs`

Purpose: add an aggregate answer-position distribution check. For each `(course, skill)` group with ≥20 MC questions, report the A/B/C/D counts and flag groups where any letter is >35% or <15%.

- [ ] **Step 1: Read the current audit script to find the insertion point**

Run: `cat scripts/audit-question-pool.mjs`

The existing script ends with a "Source-skill spread per course" section. New logic goes AFTER that and BEFORE the closing `main` catch.

- [ ] **Step 2: Add the distribution check block to the script**

Open `scripts/audit-question-pool.mjs` and insert the following block right after the `Source-skill spread per course` section (after the `for (const [c, n] of Object.entries(sourceSpread).sort())` loop and before `main().catch(...)`):

```javascript
  // --- Answer-position distribution per (course, skill) with n >= 20 MC ---
  const distByCourseSkill = {};
  for (const doc of snap.docs) {
    const d = doc.data();
    if (d.type !== "mc") continue;
    if (!["A", "B", "C", "D"].includes(d.correctAnswer)) continue;
    const key = `${d.course}|${d.skill}`;
    if (!distByCourseSkill[key]) {
      distByCourseSkill[key] = { course: d.course, skill: d.skill, A: 0, B: 0, C: 0, D: 0, total: 0 };
    }
    distByCourseSkill[key][d.correctAnswer] += 1;
    distByCourseSkill[key].total += 1;
  }

  console.log(`\nAnswer-position distribution (groups with n >= 20 MC questions):`);
  console.log(`  Flagged if any letter > 35% or < 15% of total`);
  const flagged = [];
  const ok = [];
  for (const row of Object.values(distByCourseSkill)) {
    if (row.total < 20) continue;
    const pct = {
      A: row.A / row.total,
      B: row.B / row.total,
      C: row.C / row.total,
      D: row.D / row.total,
    };
    const suspicious =
      pct.A > 0.35 || pct.A < 0.15 ||
      pct.B > 0.35 || pct.B < 0.15 ||
      pct.C > 0.35 || pct.C < 0.15 ||
      pct.D > 0.35 || pct.D < 0.15;
    const line = `    ${row.course.padEnd(12)} ${row.skill.padEnd(30)} n=${row.total.toString().padStart(3)}  A=${row.A} B=${row.B} C=${row.C} D=${row.D}`;
    if (suspicious) flagged.push(line);
    else ok.push(line);
  }
  console.log(`  Flagged: ${flagged.length}`);
  console.log(`  OK:      ${ok.length}`);
  if (flagged.length > 0) {
    console.log(`\n  Flagged groups:`);
    for (const line of flagged) console.log(line);
  }
```

- [ ] **Step 3: Run the script to verify output**

Run: `cd ~/pantherprep && GOOGLE_CLOUD_PROJECT=pantherprep-a5a73 npm run audit:pool`

Expected: All previous output (Per course, Per skill, Source-skill spread) still renders unchanged. New section "Answer-position distribution" appears at the bottom. With the current seed (~588 questions, most skills under 20 per group), `Flagged: 0` and `OK: 0` are likely — the distribution check will start reporting meaningful numbers only after the Parker seed runs.

- [ ] **Step 4: Commit**

```bash
git add scripts/audit-question-pool.mjs
git commit -m "Spec C task 5: audit-question-pool A/B/C/D distribution check"
```

---

## Task 6: Register new npm scripts in package.json

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Read the current `scripts` block**

Run: `grep -A 20 '"scripts"' package.json | head -25`
Expected: Existing scripts including `seed:pool`, `audit:pool`, and Next.js commands.

- [ ] **Step 2: Add the new seed scripts**

Open `package.json` and add these two entries to the `"scripts"` block (alphabetically near the existing `seed:pool` entry). The exact addition:

```json
    "seed:skill-content": "node scripts/seed-skill-content.mjs",
    "seed:generated-questions": "node scripts/seed-generated-questions.mjs",
```

- [ ] **Step 3: Verify the scripts registered**

Run: `npm run 2>&1 | grep -E "seed:(skill-content|generated-questions)"`
Expected: Both script names appear in the available-scripts list.

- [ ] **Step 4: Dry-run via npm to confirm wiring**

Run: `GOOGLE_CLOUD_PROJECT=pantherprep-a5a73 npm run seed:skill-content -- --dry-run`
Expected: Script runs, reports `Found 0 draft file(s)` (drafts dir is empty), exits cleanly.

Run: `GOOGLE_CLOUD_PROJECT=pantherprep-a5a73 npm run seed:generated-questions -- --dry-run`
Expected: Same — `Found 0 batch file(s)`, clean exit.

- [ ] **Step 5: Commit**

```bash
git add package.json
git commit -m "Spec C task 6: register seed:skill-content and seed:generated-questions npm scripts"
```

---

## Task 7: Orchestrate the generation pipeline (live subagent dispatch)

**Files:**
- Generated: `drafts/skill-content/*.json` (36 files)
- Generated: `drafts/question-batches/*.json` + `*.reviewed.json` + `*.rejected.json` (108 × 3 files)
- Generated: `drafts/parker-gen-state.json` (gitignored)
- Generated: `drafts/parker-gen-report-2026-04-14.md` (gitignored)

This task is NOT code. It's a live Lachlan session issuing Claude Code `Agent` tool calls following the spec. The orchestrator reads the state file, dispatches subagents in batches of 8 per wave, tracks completion, retries failures once, and compiles the final report for Luke to review.

**Do not attempt this task until tasks 1-6 are committed and verified.** The orchestration depends on the seed scripts being ready to run against the drafts the subagents will produce.

- [ ] **Step 1: Confirm prerequisites are in place**

Run these checks:

```bash
cd ~/pantherprep
ls drafts/skill-content drafts/question-batches
ls scripts/seed-skill-content.mjs scripts/seed-generated-questions.mjs
grep -c "^### " docs/superpowers/specs/college-board-skills.md
GOOGLE_CLOUD_PROJECT=pantherprep-a5a73 npm run audit:pool 2>&1 | tail -20
```

Expected:
- Both draft dirs exist (contain only `.gitkeep`)
- Both seed scripts exist
- `36` skill entries in the reference doc
- `audit:pool` runs without error and reports the current post-spec-D inventory

- [ ] **Step 2: Initialize the orchestrator state file**

Write this content to `drafts/parker-gen-state.json`:

```json
{
  "runId": "parker-gen-2026-04-14",
  "startedAt": "2026-04-14T00:00:00.000Z",
  "waves": {
    "concept":   { "total": 36,  "done": 0, "failed": [] },
    "questions": { "total": 108, "done": 0, "failed": [] },
    "critic":    { "total": 144, "done": 0, "failed": [] }
  },
  "finishedAt": null
}
```

- [ ] **Step 3: Pre-fetch style anchors for wave 2**

Before wave 2 dispatches, the orchestrator queries `questionPool` for 3 mid-difficulty existing questions per (course, skill) combo. This is done in-session via a one-off script:

Write this content to `scripts/fetch-style-anchors.mjs`:

```javascript
#!/usr/bin/env node
// One-off helper: fetches 3 mid-difficulty questions per (course, skill) combo
// from questionPool, writes to drafts/_style-anchors.json for wave 2 subagents
// to inline into their prompts. Sibling-course fallback if < 3 exist.

import admin from "firebase-admin";
import { writeFileSync } from "node:fs";

admin.initializeApp({ credential: admin.credential.applicationDefault() });
const db = admin.firestore();

async function main() {
  const snap = await db.collection("questionPool").get();

  // Group by (course, skill) and (siblingCourse, skill)
  const byCourseSkill = new Map();
  for (const doc of snap.docs) {
    const d = doc.data();
    const key = `${d.course}|${d.skill}`;
    if (!byCourseSkill.has(key)) byCourseSkill.set(key, []);
    byCourseSkill.get(key).push({
      course: d.course,
      skill: d.skill,
      difficulty: d.difficulty,
      type: d.type,
      stem: d.stem,
      choices: d.choices,
      correctAnswer: d.correctAnswer,
      explanation: d.explanation,
    });
  }

  // Sibling-course map: each math course falls back to any other math course;
  // each rw course falls back to any other rw course.
  const mathCourses = ["sat-math", "nmsqt-math", "psat89-math"];
  const rwCourses = ["sat-rw", "nmsqt-rw", "psat89-rw"];
  function siblings(course) {
    if (mathCourses.includes(course)) return mathCourses.filter((c) => c !== course);
    if (rwCourses.includes(course)) return rwCourses.filter((c) => c !== course);
    return [];
  }

  // Build anchor set per (course, skill): prefer 3 medium-difficulty from same course,
  // fall back to easy+hard same course, then to siblings.
  const taxonomyKeys = [
    "absolute_value","area_perimeter","circles","coordinate_geometry","exponential_functions",
    "linear_equations","linear_functions","linear_inequalities","linear_regression","percentages",
    "polynomial_operations","probability","quadratic_equations","quadratic_formula","radical_equations",
    "rational_expressions","ratios_rates","right_triangle_trig","scatterplots","statistics_central_tendency",
    "statistics_spread","systems_of_equations","triangles","two_way_tables","volume",
    "central_ideas","cross_text_connections","details_evidence","inferences","modifiers",
    "punctuation_boundaries","purpose_function","quantitative_evidence","rhetorical_synthesis",
    "transitions","vocabulary_in_context",
  ];
  const mathSkills = new Set(taxonomyKeys.slice(0, 25));
  const rwSkills = new Set(taxonomyKeys.slice(25));

  const out = {};
  for (const course of [...mathCourses, ...rwCourses]) {
    for (const skill of taxonomyKeys) {
      // Skip incompatible combos (math skill in rw course or vice versa)
      const isMathCourse = mathCourses.includes(course);
      const isMathSkill = mathSkills.has(skill);
      if (isMathCourse !== isMathSkill) continue;

      const key = `${course}|${skill}`;
      const ownPool = byCourseSkill.get(key) ?? [];
      // Prefer medium
      const medium = ownPool.filter((q) => q.difficulty === "M");
      let anchors = medium.slice(0, 3);
      // Fallback: fill from any own-course questions
      if (anchors.length < 3) {
        const extras = ownPool.filter((q) => !anchors.includes(q)).slice(0, 3 - anchors.length);
        anchors = anchors.concat(extras);
      }
      // Sibling-course fallback
      if (anchors.length < 3) {
        for (const sib of siblings(course)) {
          const sibPool = byCourseSkill.get(`${sib}|${skill}`) ?? [];
          const sibMedium = sibPool.filter((q) => q.difficulty === "M");
          anchors = anchors.concat(sibMedium.slice(0, 3 - anchors.length));
          if (anchors.length >= 3) break;
        }
      }
      out[key] = anchors;
    }
  }

  writeFileSync("drafts/_style-anchors.json", JSON.stringify(out, null, 2));
  console.log(`Wrote style anchors for ${Object.keys(out).length} (course, skill) combos`);
  const thin = Object.entries(out).filter(([_, v]) => v.length < 3);
  console.log(`Combos with < 3 anchors (will generate from sibling-course-only context): ${thin.length}`);
  for (const [k, v] of thin.slice(0, 10)) console.log(`  ${k}: ${v.length}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
```

Run it:

```bash
GOOGLE_CLOUD_PROJECT=pantherprep-a5a73 node scripts/fetch-style-anchors.mjs
```

Expected: Creates `drafts/_style-anchors.json` with ~108 entries. Thin-combo count should match the ⚠ items from the seed inventory.

- [ ] **Step 4: Dispatch wave 1 — concept subagents (36 jobs, batches of 8)**

The orchestrator (Lachlan in this session) issues 5 dispatch messages, each containing up to 8 parallel `Agent` tool calls. Each subagent receives a prompt built from the template below, inlining the specific taxonomy key + the reference doc entry.

**Concept subagent prompt template** (inline the `[BRACKETED]` fields per job):

```
You are generating skill-level learning content for a PSAT/SAT prep platform.

SKILL: [taxonomyKey]
DOMAIN: [domain]
SKILL LABEL: [skillLabel]
SKILL DESCRIPTION: [verbatim entry from docs/superpowers/specs/college-board-skills.md for this taxonomyKey]

DELIVERABLE: one JSON file matching this exact schema:

{
  "taxonomyKey": "[taxonomyKey]",
  "skillLabel": "[skillLabel]",
  "domain": "[domain]",
  "conceptBlurb": "3-5 sentences, renders on skill detail page",
  "conceptExplanation": "200-400 words markdown, KaTeX inline with $...$ for inline and $$...$$ for block",
  "workedExamples": [
    {
      "prompt": "problem statement, markdown + KaTeX",
      "steps": ["step 1", "step 2", "step 3"],
      "answer": "final answer",
      "takeaway": "one sentence transferable lesson"
    }
    // 2-3 examples total
  ],
  "hintTemplates": [
    "general approach hint 1 — not question-specific",
    "general approach hint 2",
    "general approach hint 3"
  ],
  "source": "parker-gen-2026-04-14",
  "generatedAt": "2026-04-14T00:00:00.000Z",
  "reviewedBy": "parker-critic"
}

TONE: Written for an 11th grader. Direct, no padding, no "Great question!"
energy. One clear idea per sentence.

CONSTRAINTS:
- All math in KaTeX ($ inline, $$ block). Never plain-text equations.
- conceptBlurb: 3-5 sentences, no more
- conceptExplanation: 200-400 words markdown
- Each workedExample: 2-5 steps, a final answer, one-sentence takeaway
- hintTemplates are general "how to approach any problem in this skill" prompts,
  NOT tied to a specific question
- Worked examples use realistic SAT-style numbers, not 1/2/3 filler
- Output EXACTLY matches the schema above — no extra fields, no missing fields

OUTPUT: Use the Write tool to write the JSON file to
drafts/skill-content/[taxonomyKey].json in the pantherprep repo
(/Users/lukemccarthy/pantherprep). Nothing else. Do not commit.
```

Dispatch batches:
- Batch 1 (8): absolute_value, area_perimeter, circles, coordinate_geometry, exponential_functions, linear_equations, linear_functions, linear_inequalities
- Batch 2 (8): linear_regression, percentages, polynomial_operations, probability, quadratic_equations, quadratic_formula, radical_equations, rational_expressions
- Batch 3 (8): ratios_rates, right_triangle_trig, scatterplots, statistics_central_tendency, statistics_spread, systems_of_equations, triangles, two_way_tables
- Batch 4 (8): volume, central_ideas, cross_text_connections, details_evidence, inferences, modifiers, punctuation_boundaries, purpose_function
- Batch 5 (4): quantitative_evidence, rhetorical_synthesis, transitions, vocabulary_in_context

After each batch, verify:
```bash
ls drafts/skill-content/*.json | wc -l
```
Expected: 8, 16, 24, 32, 36 cumulative.

For any job whose output file is missing or malformed JSON, redispatch that single subagent with the same prompt once. If it fails twice, record in the state file's `failed` array and move on.

- [ ] **Step 5: Update state after wave 1**

```bash
# Edit drafts/parker-gen-state.json — set waves.concept.done to match actual output count
```

- [ ] **Step 6: Dispatch wave 2 — question subagents (108 jobs, batches of 8)**

Build the 108 (course, skill) combos as the Cartesian product of:
- Math: {sat-math, nmsqt-math, psat89-math} × {25 math taxonomy keys} = 75
- R&W: {sat-rw, nmsqt-rw, psat89-rw} × {11 R&W taxonomy keys} = 33

For each combo, construct the prompt from the template below. The `REFERENCE STYLE ANCHORS` block comes from `drafts/_style-anchors.json[courseKey]`.

**Question subagent prompt template:**

```
You are generating SAT/PSAT practice questions for the adaptive question pool.

SKILL: [taxonomyKey]
COURSE: [course]
DOMAIN: [domain]
SKILL DESCRIPTION: [verbatim entry from docs/superpowers/specs/college-board-skills.md]

DIFFICULTY MIX: [counts per course]
  sat-math, sat-rw:         5 easy / 10 medium / 5 hard
  nmsqt-math, nmsqt-rw:     7 easy / 9 medium / 4 hard
  psat89-math, psat89-rw:   8 easy / 8 medium / 4 hard

REFERENCE STYLE ANCHORS (match voice + difficulty calibration;
do NOT reuse the numbers, structure, or problem framing):
[up to 3 existing questions from drafts/_style-anchors.json for this course|skill key]

DELIVERABLE: a JSON array of exactly 20 question objects. Each question has
this shape:

{
  "course": "[course]",
  "testType": "[testType]",   // "sat" | "nmsqt" | "psat89"
  "section": "[section]",      // "math" | "rw"
  "domain": "[domain]",
  "skill": "[taxonomyKey]",
  "sourceSkill": "[human-readable skill label, e.g. 'Linear equations in 1 variable']",
  "difficulty": "F" | "M" | "C",   // F=easy, M=medium, C=hard
  "type": "mc" | "spr",
  "stem": "question text, markdown + KaTeX",
  "choices": [                     // only for type=mc, exactly 4 entries with keys A,B,C,D
    { "key": "A", "text": "option text" },
    { "key": "B", "text": "option text" },
    { "key": "C", "text": "option text" },
    { "key": "D", "text": "option text" }
  ],
  "correctAnswer": "A" | "B" | "C" | "D" | "<numeric string for spr>",
  "explanation": "1-2 sentences explaining WHY the right answer is right",
  "katex": true | false,
  "tags": ["parker-gen-2026-04-14"]
}

HARD RULES:
- MC questions must have an OBJECTIVELY CORRECT answer. No "which is most likely,"
  no opinions, no predictions. If there's no single right answer, use SPR instead.
- For each question, independently assign the correct answer to a uniformly random
  position (A/B/C/D). Do NOT pre-plan or balance distribution — let randomness
  do its work. Per-batch distribution will NOT be checked; aggregate distribution
  across all 108 batches is audited separately.
- All math in KaTeX ($ inline, $$ block). Never plain-text equations.
- Each question has a 1-2 sentence explanation that explains WHY the right answer
  is right, not just restating it.
- No duplicates with the reference anchors or with each other.
- SPR is for open-numeric answers only (math). Do NOT use SPR for verbal skills.
- Do NOT reuse the numbers, structure, or problem framing of the reference anchors.
  Match their voice, don't rephrase them.
- If a question would require a diagram or figure to answer (geometry figure,
  chart, scatterplot), SKIP it and generate a different question instead. This
  pipeline does not produce images.

DIFFICULTY CALIBRATION:
- Easy (F): single-step, one concept, friendly numbers
- Medium (M): two-step, may combine with a prerequisite concept
- Hard (C): multi-step, requires picking the right approach, adversarial distractors

OUTPUT: Use the Write tool to write the JSON array to
drafts/question-batches/[course]__[taxonomyKey].json in the pantherprep repo
(/Users/lukemccarthy/pantherprep). Nothing else. Do not commit.
```

Dispatch in 14 batches of 8 (the last batch has 4). After each batch:

```bash
ls drafts/question-batches/*__*.json | grep -v reviewed | grep -v rejected | wc -l
```
Expected cumulative: 8, 16, 24, 32, 40, 48, 56, 64, 72, 80, 88, 96, 104, 108.

Retry policy same as wave 1: one retry per failed job, record in state file if it fails twice.

- [ ] **Step 7: Update state after wave 2**

Edit `drafts/parker-gen-state.json` — set `waves.questions.done` to match actual output count.

- [ ] **Step 8: Dispatch wave 3 — critic subagents (144 jobs, batches of 8)**

Each critic subagent reads one artifact from wave 1 or wave 2 and produces two outputs: `{name}.reviewed.json` (approved + fixed content) and `{name}.rejected.json` (dropped items with reasons).

**Critic subagent prompt template (for concept bundles):**

```
You are reviewing a generated skill-level content bundle for correctness
and quality. You FIX minor issues or REJECT broken content. You do not
generate new content.

INPUT FILE: drafts/skill-content/[taxonomyKey].json

CHECKS:
1. Does the conceptBlurb match the schema (3-5 sentences, no more)?
2. Is the conceptExplanation 200-400 words?
3. Are all math expressions in KaTeX ($ inline, $$ block)?
4. For each workedExample:
   - Is the stated answer actually correct? (do the math)
   - Are the steps coherent and in order?
   - Does the takeaway state a transferable lesson?
5. Are the 3 hintTemplates general approach hints, not tied to specific
   question numbers?

FIXES YOU MAY APPLY:
- Rewording conceptBlurb if it's the wrong length
- Trimming conceptExplanation if over 400 words
- Fixing KaTeX syntax errors
- Correcting a wrong answer in a worked example (recompute from the steps)

REJECTIONS (write to .rejected.json):
- conceptExplanation is fundamentally wrong or incoherent
- A worked example has a wrong approach that can't be fixed by correcting the
  final answer alone
- Math errors pervasive throughout (more than one worked example broken)

OUTPUT: Use the Write tool to write two files in /Users/lukemccarthy/pantherprep:
- drafts/skill-content/[taxonomyKey].reviewed.json — the corrected bundle
  (same schema as input). If you rejected the whole bundle, this file is
  still written but contains { "rejected": true, "reason": "..." }.
- drafts/skill-content/[taxonomyKey].rejected.json — array of
  { "section": "conceptExplanation" | "workedExamples[i]" | ..., "reason": "..." }
  entries. Empty array if nothing rejected.

Do NOT modify the input file.
```

**Critic subagent prompt template (for question batches):**

```
You are reviewing a generated batch of 20 SAT/PSAT practice questions. You
FIX minor issues or REJECT broken questions. You do not generate new questions.

INPUT FILE: drafts/question-batches/[course]__[taxonomyKey].json

FOR EACH QUESTION, CHECK:
1. Is the stated correct answer actually correct? (do the math, verify the text)
2. Are there TWO defensible correct answers? (reject)
3. Is the stem ambiguous, missing info, or unparseable? (reject)
4. Is the question framed as opinion/prediction/guess? (reject or convert to SPR)
5. Is all math in KaTeX? (fix if trivial, reject if pervasive)
6. Does the explanation actually explain, or just restate the answer? (fix if so)
7. Are the distractors plausible and pedagogically useful? (fix weak ones)
8. For MC: are there exactly 4 choices with keys A, B, C, D in order?
9. Does the correctAnswer field match one of the choice keys (for MC)?

DO NOT enforce A/B/C/D distribution at the per-batch level. At n=20, genuine
randomness often looks uneven (7/5/4/4 is fine). Aggregate distribution is
checked separately after seeding.

OUTPUT: Use the Write tool to write two files in /Users/lukemccarthy/pantherprep:
- drafts/question-batches/[course]__[taxonomyKey].reviewed.json — JSON array of
  approved + fixed questions (same schema as input). Questions you rejected do
  NOT appear in this array.
- drafts/question-batches/[course]__[taxonomyKey].rejected.json — JSON array of
  { "originalIndex": <int>, "original": <question object>, "reason": "<string>" }
  entries. Empty array if nothing rejected.

Do NOT modify the input file.
```

Dispatch in 18 batches of 8 (the last batch has 0 — 18×8=144 exactly). After each batch:

```bash
ls drafts/skill-content/*.reviewed.json drafts/question-batches/*.reviewed.json 2>/dev/null | wc -l
```
Expected cumulative: 8, 16, 24, ..., 144.

- [ ] **Step 9: Update state after wave 3**

Edit `drafts/parker-gen-state.json` — set `waves.critic.done` to 144 (or actual count). Set `finishedAt` to the current ISO timestamp.

- [ ] **Step 10: Generate the consolidated report**

The orchestrator (Lachlan) reads all `.rejected.json` files, counts rejections by reason, summarizes rejected-question counts per file, and writes a markdown report to `drafts/parker-gen-report-2026-04-14.md`. Template:

```markdown
# Parker Content Generation — 2026-04-14

## Summary
- Skill-level bundles: <N> generated, <M> passed critic
- Question batches: <N> generated, <M> passed critic
- Total new questions: <proposed> proposed → <approved> approved → <rejected> rejected
- State file: drafts/parker-gen-state.json

## Rejected (grouped by reason)

### Two defensible answers (<count>)
- <file>#<idx> — <excerpt>

### Math error in stated answer (<count>)
...

### Ambiguous stem (<count>)
...

### Opinion/prediction framed as MC (<count>)
...

### Plain-text math not in KaTeX (<count>)
...

## Files to review before seeding
drafts/skill-content/*.reviewed.json        (<count> files)
drafts/question-batches/*.reviewed.json     (<count> files)

## Commands
# Dry-run both seeds
GOOGLE_CLOUD_PROJECT=pantherprep-a5a73 npm run seed:skill-content -- --dry-run
GOOGLE_CLOUD_PROJECT=pantherprep-a5a73 npm run seed:generated-questions -- --dry-run

# Live seed (after review)
GOOGLE_CLOUD_PROJECT=pantherprep-a5a73 npm run seed:skill-content
GOOGLE_CLOUD_PROJECT=pantherprep-a5a73 npm run seed:generated-questions

# Post-seed audit
GOOGLE_CLOUD_PROJECT=pantherprep-a5a73 npm run audit:pool
```

Deliver the report to Luke via:
1. The `drafts/parker-gen-report-2026-04-14.md` file itself (Luke reads in editor)
2. A Discord summary to the `nightly-build` channel via `scripts/send-discord.sh` style pattern (if one exists in the Lachlan workspace)

- [ ] **Step 11: Luke reviews drafts + optionally reruns problem batches**

This step is Luke's. He opens any flagged files, eyeballs the output, and either approves the full seed or says "rerun <course>__<taxonomyKey>". For a rerun, re-dispatch that single job's wave 2 + wave 3 subagents and regenerate the report.

- [ ] **Step 12: Dry-run seeds**

```bash
cd ~/pantherprep
GOOGLE_CLOUD_PROJECT=pantherprep-a5a73 npm run seed:skill-content -- --dry-run
GOOGLE_CLOUD_PROJECT=pantherprep-a5a73 npm run seed:generated-questions -- --dry-run
```

Expected: both scripts report the number of valid docs they'd write, with no invalid files. Any validation errors → fix the offending JSON files manually or rerun the critic on them.

- [ ] **Step 13: Live seed**

```bash
GOOGLE_CLOUD_PROJECT=pantherprep-a5a73 npm run seed:skill-content
GOOGLE_CLOUD_PROJECT=pantherprep-a5a73 npm run seed:generated-questions
```

Expected: first script writes ~36 docs to `skillContent/`. Second script appends ~2,000 new docs to `questionPool`. Console reports totals.

- [ ] **Step 14: Post-seed audit + verification**

```bash
GOOGLE_CLOUD_PROJECT=pantherprep-a5a73 npm run audit:pool
```

Expected:
- Total questions is roughly `588 + <approved>` — previous seed plus the new additions
- Every (course, skill) group reports ≥20 questions (or flagged as still thin if the critic rejected most of a batch)
- New "Answer-position distribution" section reports few/no flagged groups
- No unmapped skills

Grade-integrity check:

```bash
node -e "
const admin = require('firebase-admin');
admin.initializeApp({ credential: admin.credential.applicationDefault() });
const db = admin.firestore();
(async () => {
  const snap = await db.collection('questionPool').where('source', '==', 'parker-gen-2026-04-14').get();
  console.log('Parker-tagged docs:', snap.size);
  const anySourceTest = await db.collection('questionPool').where('sourceTestType', '==', 'sat-math-diagnostic').limit(1).get();
  if (anySourceTest.empty) console.log('WARN: pre-existing diagnostic docs not found');
  else {
    const d = anySourceTest.docs[0].data();
    console.log('Pre-existing doc sample preserved:', !!d.stem, !!d.correctAnswer);
  }
})();
"
```

Expected: Parker-tagged count > 0; pre-existing doc sample preserved.

Browser verification:

1. Open pantherprep.web.app, sign in as a test student
2. Visit the skill catalog for any course
3. Click into a skill that was thin before (e.g., `linear_regression` under nmsqt-math)
4. Start adaptive practice
5. Verify new questions appear in the session and score correctly
6. Complete the session and verify the mastery delta card (spec E) renders

- [ ] **Step 15: Commit the generated drafts**

```bash
cd ~/pantherprep
git add drafts/skill-content/*.json drafts/question-batches/*.json drafts/question-batches/*.reviewed.json drafts/question-batches/*.rejected.json
git commit -m "Spec C task 7: commit generated drafts (36 concept bundles + 108 question batches + critic outputs)"
```

The raw drafts stay in version control as an audit trail. Only the runtime state file and the report are gitignored.

- [ ] **Step 16: Final commit + optional push**

```bash
git log --oneline -20
```
Verify all 7 task commits are present. Then optionally push:

```bash
git push origin main
```

---

## Verification Summary

After all tasks are complete:

1. **Files created:** 2 seed scripts, 1 reference doc, 2 staging dirs, up to ~432 generated draft files in git (36 concept bundles + 36 concept reviews + 108 question batches + 108 question reviews + 144 rejection logs)
2. **Files modified:** `scripts/audit-question-pool.mjs`, `package.json`, `.gitignore`
3. **Firestore writes:** ~36 new docs in `skillContent`, ~2,000 new docs in `questionPool`
4. **Existing data:** 0 docs touched. All 588 pre-existing questions and all student progress records are byte-identical to their pre-run state.
5. **Functional verification:** Adaptive practice from the skill detail page surfaces new questions; mastery delta displays correctly after sessions.
6. **Rollback path:** `db.collection('questionPool').where('source', '==', 'parker-gen-2026-04-14').get()` + batched delete is the one-liner to undo the seed if needed. `skillContent` collection can be wiped separately without any side effect since nothing else reads it yet.
