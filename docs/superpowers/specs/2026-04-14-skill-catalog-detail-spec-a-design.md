# PantherPrep — Skill Catalog + Detail Pages (Spec A)

**Date:** 2026-04-14
**Owner:** Luke (Lachlan drafting)
**Status:** Design — awaiting approval
**Parent initiative:** Skill-based practice (decomposed into specs A, B, C, D, E)
**This spec:** A — student-visible skill catalog + detail pages + clickable recommendations

## Context

Spec D seeded `questionPool`. Spec B built `PracticeRunner` + the question source helpers. Spec A is the student-facing surface: it makes the whole initiative visible and useful by giving students a browsable catalog of every skill in their course, a rich per-skill detail page with mastery + activity + trend, and clickable recommendations throughout the app that route into the detail pages.

The existing dashboard already has a Skills tab that attempts to show per-skill mastery but is effectively broken — it's keyed by snake_case taxonomy keys (`linear_equations`), while `profile.skills` is keyed by the source-label human strings (`"Linear equations in 1 variable"`) that come from the hardcoded question banks' `skill` field. So every skill currently displays "No data yet" regardless of how much the student has practiced. Spec A fixes this key mismatch as its foundation, then builds on top.

## Goals

1. **Fix the profile.skills key mismatch.** Build a lookup that aggregates source-label entries into taxonomy-key buckets so the dashboard, catalog, and detail pages all read real mastery data.
2. **Build a new catalog route** at `/skills/[course]` with a domain-tab layout (the "Layout B" from the visual companion mockup: chip row for domain filters, flat skill rows with mastery left-border, plus a mastery-tier filter row above).
3. **Build a new detail route** at `/skills/[course]/[skill]` with a two-column rich layout (mastery hero + practice button + error patterns on the left; 14-day trend + difficulty breakdown + recent activity on the right; related skills across the bottom).
4. **Wire clickable recommendations** in three places on the dashboard so they route to the skill detail page: Overview tab recommendations, Practice tab recommendations, and per-question skill tags inside Past Tests detail view.
5. **Integrate PracticeRunner inline** on the detail page so clicking "Practice this skill" doesn't leave the route — the detail page swaps into runner mode via state transition.
6. **Keep the dashboard Skills tab** but shrink it to a 6-item "top weakest" preview with a "See full catalog →" link, and make its rows clickable too.

## Non-goals

- **No Parker-authored concept content.** Skill descriptions in this spec are one-line static placeholders I write myself, stored in `lib/skill-descriptions.ts`. Spec C later replaces them with rich Parker-generated explanations.
- **No mastery delta display** after practice completes. "Your mastery on this skill went from 42% → 56%" is spec E's job.
- **No worked examples, no interactive hints, no scaffolding.**
- **No free-text skill search.** 50 skills are few enough that filter chips (domain + mastery tier) cover discovery.
- **No "recommended next skills" ML.** Related-skills strip is just siblings in the same domain, sorted by mastery.
- **No teacher view changes.** The teacher drill-down keeps its current layout unchanged.
- **No mobile gesture work.** Responsive via Tailwind breakpoints only.
- **No changes to `DiagnosticTest`, `PracticeTest`, or `PastTestsView`** except where clickable skill tags need to be added.

## Architecture

### Routing

- **`/skills/[course]`** — catalog route. `course` matches `sat-math | sat-rw | nmsqt-math | nmsqt-rw | psat89-math | psat89-rw`. Route segment drives the page; course switcher in the header lets students jump between courses without leaving the route.
- **`/skills/[course]/[skill]`** — detail route. `skill` is the snake_case taxonomy key (`linear_equations`). Page fetches its own data via lib helpers.
- **Breadcrumbs:** "Dashboard / Skills / {Course} / {Skill}" on the detail page, each segment linked. Catalog has "Dashboard / Skills / {Course}".

Both routes are rendered inside the existing `(authenticated)` layout so they pick up the top bar, auth gate, and background orbs for free.

### Fixing the key mismatch

The root issue: `profile.skills` has human-readable keys like `"Linear equations in 1 variable"` because `recomputeProfile` reads each answer row's `skill` field verbatim, and that field comes from the hardcoded question's `q.skill` string. Meanwhile, the existing dashboard Skills tab iterates `MATH_SKILLS`/`RW_SKILLS` which contain snake_case taxonomy keys like `linear_equations`. The two never meet.

Fix approach:

1. **Move `SKILL_MAP` from `scripts/skill-mapping.ts` to `lib/skill-mapping.ts`.** The seed script updates its import to the new path. No functional change to the seed; it's a pure move.
2. **Add `TAXONOMY_TO_SOURCES: Record<string, string[]>`** to `lib/skill-mapping.ts`. Computed once at module load by inverting `SKILL_MAP`. For each taxonomy key, it lists all source labels that collapsed into it. Example: `linear_equations` → `["Linear equations in 1 variable", "Linear equations with fractions", "Linear equations in 2 variables", "Linear equations (word problems)", "Evaluating expressions", "Multi-step equations", "Special solutions (identity equations)", "Word problems"]`.
3. **Add `getProfileSkillData(profile, taxonomyKey)`** helper to the same file. Iterates `profile.skills`, picks out every entry whose key is in `TAXONOMY_TO_SOURCES[taxonomyKey]`, and aggregates them into a single `AggregatedSkillData`:

```ts
export interface AggregatedSkillData {
  correct: number;
  total: number;
  mastery: number;          // weighted average across aggregated entries
  ease: number;             // max across entries (most-practiced wins)
  interval: number;         // min across entries (most-urgent review wins)
  nextReview: string;       // earliest nextReview across entries
  errorPatterns: Record<string, number>;  // summed across entries
  lastSeen: Timestamp | null;
  sourceLabels: string[];   // which source labels were aggregated
}
```

Mastery aggregation formula: `totalCorrect / totalAnswers` (weighted average). If no source labels have data, returns an empty aggregate with `total: 0`.

4. **All consumers switch to `getProfileSkillData`.** The dashboard Skills tab, catalog page, and detail page all use this helper. Source-label-keyed access becomes internal — the UI layer only speaks taxonomy keys going forward.

### Catalog page — `/skills/[course]/page.tsx`

Layout (matches Layout B from the visual companion):

```
┌─────────────────────────────────────────────────────────┐
│  [Dashboard / Skills / SAT Math]     [SAT Math ▾]       │
│                                                          │
│  SKILL CATALOG                                           │
│  Browse and practice any skill for this course.          │
│                                                          │
│  [ All ] [ Weak ] [ Medium ] [ Strong ]                  │
│                                                          │
│  [Algebra] [Advanced Math] [Problem Solving] [Geom]     │
│                                                          │
│  ┃━━━━ Linear equations in one variable     82%  ▶     │
│  ┃━━━━ Linear functions                     55%  ▶     │
│  ┃━━━━ Linear inequalities                  58%  ▶     │
│  ┃━━━━ Systems of equations                 78%  ▶     │
│  ┃━━━━ Absolute value                       22%  ▶     │
└─────────────────────────────────────────────────────────┘
```

- **Header** includes a course switcher (`<select>` or dropdown) that routes to `/skills/{selected-course}`.
- **Mastery tier filter row:** All / Weak (< 50%) / Medium (50-79%) / Strong (≥ 80%). Untested skills count as Weak.
- **Domain tab strip:** one chip per top-level domain key in `MATH_SKILLS` or `RW_SKILLS` depending on the course. Active chip is panther-red.
- **Skill rows:** each row shows the human-readable skill name (via `skillLabel(taxonomyKey)` which humanizes snake_case), mastery percentage, question-count (`"12/22"`), colored left border (emerald/lime/amber/orange/red by mastery tier), and a right-pointing chevron. Click anywhere on the row to route to `/skills/{course}/{skill}`.
- **Empty domain:** if the active domain has zero skills after filters, show "No skills match the current filter" with a "Clear filters" button.

Skill labels come from `skillLabel(key)` in the existing `adaptive-engine.ts`, which replaces underscores with spaces and title-cases. Domain labels are the `MATH_SKILLS`/`RW_SKILLS` top-level keys verbatim.

Data source per skill: `getProfileSkillData(profile, taxonomyKey)`. Untested skills (total = 0) render with a gray left border and "No data yet" instead of a percent.

### Detail page — `/skills/[course]/[skill]/page.tsx`

Layout (matches Layout B "two-column" from the visual companion):

Two columns on desktop (md: and up), stacked on mobile. The Practice button is prominent in the left column. Left column is narrower (~40%); right column (~60%) holds the data visualizations.

**Left column contents:**

- Breadcrumb + course name + domain tag + skill name as H1
- Static description blurb from `SKILL_DESCRIPTIONS[taxonomyKey]`
- Big mastery display: circular percent indicator, tier color
- Quick stats row: "12/22 all-time · Next review in 3d"
- **"Practice this skill" button** (panther-red) — on click, state transitions to runner mode: `session = await getQuestionsBySkill(course, taxonomyKey, 10)`, render `<PracticeRunner questions={session.questions} ... />` inline in place of the detail page contents. The URL stays at `/skills/[course]/[skill]` — no route change.
- Error patterns card: list of the top 3 error categories with counts (pulled from `aggregated.errorPatterns`), rendered as red pills. Hidden if the student has no error data yet.

**Right column contents:**

- **14-day mastery trendline** — bar chart, 14 bars (one per day for the last 2 weeks). Each bar height = percent correct on this skill that day, color-tiered. Empty days render as zero-height gray bars. Data source: `getRecentAnswers(uid, 200)` filtered to this skill's source labels, then bucketed by day.
- **Difficulty breakdown** — three compact stats showing correct/total on Easy, Medium, Hard. Data derived from the same filtered answer set.
- **Recent activity card** — last 5 answers on this skill, displayed as colored squares (emerald = correct, red = wrong, slate = skipped). Clicking a square pops open a small inline modal showing the full question stem, the student's answer, the correct answer, and the explanation. Modal closes by clicking outside or pressing Escape.

**Bottom row (full width):**

- **Related skills in {domain}** — horizontal strip of up to 5 sibling skills in the same domain, sorted by the student's weakest. Each renders as a small card with skill name + mastery percent + arrow. Click routes to that skill's detail page.

**Practice mode flip:**

The detail page holds a local `session` state. When the student clicks "Practice this skill":

```ts
const [session, setSession] = useState<PracticeBatch | null>(null);

const handlePractice = async () => {
  const batch = await getQuestionsBySkill(course, taxonomyKey, 10);
  if (batch.questions.length === 0) {
    // show empty state: "No content yet for this skill. Check back soon."
    return;
  }
  setSession(batch);
};

if (session) {
  return (
    <PracticeRunner
      uid={user.uid}
      email={user.email ?? ""}
      course={course}
      skill={taxonomyKey}
      skillLabel={skillLabel(taxonomyKey)}
      testType={`${course}-skill-practice`}
      questions={session.questions}
      fallbackNotes={session.fallbackNotes}
      onExit={() => setSession(null)}
      onPracticeAgain={async () => {
        const newBatch = await getQuestionsBySkill(course, taxonomyKey, 10);
        setSession(newBatch);
      }}
    />
  );
}
```

The `PracticeRunner` writes results via `completeTestSession` using `testType: "sat-math-skill-practice"` (or the corresponding course), so each skill practice session appears in Past Tests with a distinct label from adaptive practice sessions.

### Dashboard Skills tab — what happens to it

The existing Skills tab at [dashboard/page.tsx:316](../../../app/(authenticated)/dashboard/page.tsx#L316) stays but shrinks. After this spec:

- Shows top 6 weakest skills across all domains (sorted by ascending mastery, aggregated via `getProfileSkillData`).
- Each row is clickable and routes to `/skills/[course]/[skill-taxonomy-key]`.
- A "See full catalog →" link at the bottom routes to `/skills/[course]`.
- Domain chip strip is removed from the tab (it lives on the full catalog page instead — the tab is a quick glance, not a browsing tool).
- Mastery data uses `getProfileSkillData`, so the current "No data yet" bug gets fixed as a side effect.

This preserves information density on the dashboard while making the full catalog the primary browsing surface.

### Clickable recommendations — three targets

Three places currently display skill recommendations. All three get wired to route to the skill detail page.

1. **Overview tab (`StudentOverview` at [dashboard/page.tsx:219](../../../app/(authenticated)/dashboard/page.tsx#L219)).** The recommendations list at the top of the overview becomes clickable. Each rec entry gets wrapped in a `<Link>` (or click handler) that navigates to `/skills/[course]/[taxonomy-key]`.
2. **Practice tab (`StudentPractice`).** Same recommendation list as Overview, same click behavior.
3. **Past Tests detail view — per-question skill tags.** The `PastTestsView` detail mode renders each question with a domain + skill tag (via `<span>{a.domain} · {a.skill}</span>` in [past-tests-view.tsx](../../../components/dashboard/past-tests-view.tsx)). The `skill` here is the source label. Wrap it in a link that does the reverse lookup → taxonomy key → detail route.

**Reverse lookup helper:**

```ts
// in lib/skill-mapping.ts
export function sourceToTaxonomyKey(sourceLabel: string): string | null {
  const mapping = SKILL_MAP[sourceLabel];
  return mapping?.taxonomyKey ?? null;
}
```

If the reverse lookup fails (source label not in `SKILL_MAP`), the link falls back to the catalog page `/skills/[course]` with no skill selection. This handles any stray source labels that slip in from legacy data.

### Static skill descriptions — `lib/skill-descriptions.ts`

All 50 taxonomy keys get a one-line description. These are placeholders until spec C replaces them. Written once, reviewed by Luke, committed. Example:

```ts
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
```

Luke reviews the wording before the catalog ships. If any description feels wrong, he edits the file directly.

### Firestore queries and indexes

**New composite index required** for the detail page's recent-activity query:

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

This lets per-skill queries on `performanceLog/{uid}/answers` with `orderBy(timestamp desc)` work without hitting a `failed-precondition`.

**Query pattern — parallel queries, not `in`:** Firestore does not allow combining a `where ... in [...]` clause with `orderBy` on a different field. So the detail page fires **N parallel queries** (one per source label that maps to the taxonomy key) and merges results client-side:

```ts
async function getRecentAnswersForTaxonomyKey(
  uid: string,
  taxonomyKey: string,
  limit = 50
): Promise<StoredAnswer[]> {
  const sourceLabels = TAXONOMY_TO_SOURCES[taxonomyKey] ?? [];
  if (sourceLabels.length === 0) return [];
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
  const snaps = await Promise.all(queries);
  const merged: StoredAnswer[] = [];
  for (const snap of snaps) {
    for (const doc of snap.docs) {
      merged.push({ id: doc.id, ...doc.data() } as StoredAnswer);
    }
  }
  // Sort merged by timestamp desc and slice to limit
  merged.sort((a, b) => (b.timestamp?.toMillis?.() ?? 0) - (a.timestamp?.toMillis?.() ?? 0));
  return merged.slice(0, limit);
}
```

Per-skill queries stay within Firestore's single-field-plus-orderBy combinations, which the new composite index supports. For ~8 source labels max per taxonomy key, that's 8 parallel reads — fast and cheap. This helper lives in `lib/skill-mapping.ts` alongside `getProfileSkillData`.

The catalog page doesn't need a new query — it reads the student's `adaptiveProfile` doc (single doc get) and aggregates via `getProfileSkillData`.

### File structure

| File | Status | Purpose |
|---|---|---|
| `lib/skill-mapping.ts` | create (move from `scripts/`) | `SKILL_MAP`, `TAXONOMY_TO_SOURCES`, `getProfileSkillData`, `sourceToTaxonomyKey` |
| `scripts/skill-mapping.ts` | modify (shim) | Re-export from `@/lib/skill-mapping` so the seed script keeps working |
| `lib/skill-descriptions.ts` | create | 50 one-line static descriptions keyed by taxonomy key |
| `firestore.indexes.json` | modify | Add `answers(skill asc, timestamp desc)` composite index |
| `app/(authenticated)/skills/[course]/page.tsx` | create | Catalog route (Layout B) |
| `app/(authenticated)/skills/[course]/[skill]/page.tsx` | create | Detail route (Layout B two-column) |
| `components/skills/skill-catalog.tsx` | create | Catalog UI (reusable outside of the route for the Skills tab preview) |
| `components/skills/skill-detail.tsx` | create | Detail UI — top-level component that flips between detail view and PracticeRunner |
| `components/skills/skill-row.tsx` | create | Reusable single-row component used by the catalog and the dashboard Skills tab preview |
| `components/skills/skill-trendline.tsx` | create | 14-day mastery trend bar chart |
| `components/skills/skill-recent-activity.tsx` | create | 5-square recent answers strip + modal for detail inspection |
| `app/(authenticated)/dashboard/page.tsx` | modify | Shrink Skills tab to 6-item preview; wire Overview + Practice clickable recommendations |
| `components/dashboard/past-tests-view.tsx` | modify | Make per-question skill tags clickable to the detail page |

### Error handling

- **No questions available for a skill.** Clicking "Practice this skill" with an empty `getQuestionsBySkill` result shows an inline empty state: "No content yet for this skill — check back soon." The runner never launches with zero questions.
- **Invalid `course` or `skill` in the URL.** Route validates both — if `course` isn't a known test-section combo or `skill` isn't in `MATH_SKILLS`/`RW_SKILLS` for that course, render a "Skill not found" page with a button back to the catalog.
- **No `adaptiveProfile` doc yet** (brand new student). All mastery values display as "No data yet" gray state. Practice button is still enabled (they can practice from zero).
- **Firestore read failure** on recent activity query. Detail page catches the error, shows the left column normally, displays "Unable to load recent activity" in the right column. Does not block the Practice button.
- **Reverse lookup misses** (source label not in `SKILL_MAP`). Clickable skill tag falls back to the catalog page with a toast: "Couldn't find this skill in the taxonomy."

### Firestore rules

No rule changes. The `performanceLog` and `adaptiveProfile` reads use existing rules. The detail page queries `performanceLog/{uid}/answers` for the current student's own data — already permitted.

## Testing

No automated test framework (same convention as specs D and B). Manual verification after the full build:

1. **Type-check + build** after each task.
2. **Catalog smoke test:** navigate to `/skills/sat-math`. Confirm the domain tabs render, the mastery tier filter chips work, and clicking a skill routes to the detail page.
3. **Detail page smoke test:** land on `/skills/sat-math/linear_equations`. Confirm the two-column layout renders, mastery shows real data (not "No data yet"), trendline renders, difficulty breakdown shows correct numbers, recent activity has colored squares.
4. **Practice inline test:** click "Practice this skill" — confirm `PracticeRunner` replaces the detail content, URL stays unchanged. Complete the session. Confirm `onExit` returns to the detail view with updated mastery (via `profile` refetch) and the Past Tests tab shows the new session with `testType: "sat-math-skill-practice"`.
5. **Dashboard Skills tab:** confirm it's now a 6-item preview, not a 25-item list. Confirm each row is clickable. Confirm the "See full catalog" link routes correctly.
6. **Clickable recommendations test:** from the Overview tab, click a recommendation. Confirm it routes to the detail page for that skill (via reverse lookup of the source label). Repeat for Practice tab recommendations and Past Tests skill tags.
7. **Mobile responsive test:** resize to 375px. Confirm catalog collapses cleanly, detail page stacks columns, breadcrumbs truncate gracefully.
8. **Empty state test:** navigate to a thin skill like `sat-math/quadratic_formula`. Click Practice. Confirm the runner launches with ~10 questions (domain fallback kicks in) and fallback notes appear on the results card.
9. **Reverse lookup miss test:** deliberately break the click-through by routing to `/skills/sat-math/nonexistent_skill`. Confirm the "Skill not found" page renders.

## Rollout

Single branch. Task order (taskification in the plan):

1. Fix key mismatch: move `SKILL_MAP` to lib, add `TAXONOMY_TO_SOURCES`, add `getProfileSkillData`, update seed script import.
2. Write `lib/skill-descriptions.ts` with all 50 descriptions. Luke reviews before moving on.
3. Add new composite index + deploy.
4. Create `components/skills/skill-row.tsx` as a shared row component.
5. Create `components/skills/skill-catalog.tsx` and the `/skills/[course]` route.
6. Create `components/skills/skill-trendline.tsx` and `components/skills/skill-recent-activity.tsx` helpers.
7. Create `components/skills/skill-detail.tsx` and the `/skills/[course]/[skill]` route.
8. Shrink the dashboard Skills tab + wire rows clickable.
9. Wire clickable recommendations on Overview and Practice tabs.
10. Wire clickable skill tags on PastTestsView per-question review.
11. Manual verification (all 9 test items above).
12. Merge, push, deploy.

## Open questions

None outstanding. Assumptions made:

- Course switcher is a simple `<select>` or dropdown component — no need for a rich visual picker.
- Mastery aggregation uses a weighted average by answer count, not by recency or difficulty.
- The "top 6 weakest" preview on the dashboard Skills tab sorts by ascending mastery; ties broken by most-recent activity.
- Related-skills strip sorts by ascending mastery (weakest first) so it surfaces skills the student should prioritize, not skills they've already mastered.
- Recent-activity modal closes on outside click + Escape key — standard modal behavior.
- Skill description blurbs are 1 sentence, ~100 chars max. If any need to be longer for clarity, leave them longer — the description block in the detail page has room.
