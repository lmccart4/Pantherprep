# Study Plan — Design Spec

**Date:** 2026-04-19
**Author:** Lachlan (brainstorm with Luke)
**Status:** Approved, ready for implementation plan
**Target:** pantherprep.web.app

---

## 1. Purpose

A student-facing auto-generated ramp from today to their target test date. A deterministic algorithm ranks skills, packs them into weeks, and surfaces one task per day on the home page. Parker writes a short weekly narrative on Sunday nights that goes through the existing Coach Chat approval queue so Luke can adjust the voice before it ships.

Shipped as v1; excludes calendar view, push notifications, custom rest days, and class-level plans (see §10 YAGNI).

---

## 2. User stories

- **As a student,** I set my test date on first visit to `/study-plan` and get a week-by-week ramp to that date. On my home page I see one card each day: "Today: linear equations, 10 questions, ~15 min" — one tap starts the practice.
- **As a student,** when I finish today's set, the results screen tells me what's next and I see it on home tomorrow.
- **As a student,** I can skip a whole week if life happens. My mastery still counts; the plan redistributes around it.
- **As a student,** when my test date changes, the plan immediately recomputes. I don't wait until Sunday.
- **As Luke,** every Sunday I see one coach-note draft per active student summarizing their new week's plan. I approve or edit before it goes out — same Drafts queue as Coach Chat.
- **As Parker,** I write a short narrative Sunday nights grounded in the actual skillQueue and last week's mastery deltas; I flag "no change" and skip when the student didn't practice.

---

## 3. Architecture

```
Student sets testDate (onboarding modal on /study-plan)
    ↓
Client writes studyPlans/{uid_course} { testDate, course, status:"active", ... }
    ↓
Client runs algorithm (pure function) to produce skillQueue + week + today
    ↓
Client writes those fields back to the doc
    ↓
UI renders:
  - Home page "Today's set" card (new)
  - /study-plan full page (new route)
  - Nav entry "Study Plan" (new)
    ↓
Practice runner accepts ?plan=1&skill=X&count=N query params
  - Results screen reads studyPlans/{uid_course} and shows "tomorrow: ..."
  - lib/test-persistence.ts writes completedDays[today] on matching session
    ↓
Sunday 10 PM (Mac mini launchd):
  1. Server-side algorithm regen for every active plan (pure function)
  2. For each plan where skillQueue or weekIndex changed, invoke the new
     study-plan-narrative skill (Claude Code subscription, no paid API).
     Parker writes { narrative, pullQuote } to studyPlans/{uid_course}.
  3. Also invoke coach-draft with trigger=weekly_plan_update — narrative
     becomes the coach note body. It flows through the existing coachDrafts
     approval queue (Discord + Dashboard).
    ↓
Lifecycle:
  - testDate passes → status flips to "archived", Today card hides,
    /study-plan shows wrap-up summary
  - testDate changes → immediate client-side regen
  - skippedWeeks[n] = true → Today card hides for that week,
    Sunday regen redistributes skills
```

Algorithm is a pure function in `lib/study-plan/algorithm.ts` — same input produces same output. Runs client-side (daily fast path) and server-side (Sunday regen). No Cloud Function required.

---

## 4. Algorithm

**Signature:** `buildPlan(profile: AdaptiveProfile, testDate: Date, today: Date, course: Course): StudyPlanOutput`

**Inputs:**
- `profile` — existing `AdaptiveProfile` from `lib/adaptive/performance-service.ts`
- `testDate` — student's target
- `today` — current date (injected for testability)
- `course` — the course this plan targets (`sat-math`, `sat-rw`, `nmsqt-math`, `nmsqt-rw`, `psat89-math`, `psat89-rw`)

**Output:**

```ts
interface StudyPlanOutput {
  weeksRemaining: number;                 // floor((testDate - today) / 7 days), min 0
  mode: "normal" | "cramming";            // cramming when weeksRemaining < 2
  skillQueue: Array<{
    skill: string;                        // taxonomy key
    assignedWeek: number;                 // 0-indexed
    targetMastery: number;                // 0.75–0.85
  }>;
  currentWeekIndex: number;               // 0 = this week
  currentWeekSkills: string[];            // 2–3 skills
  targetSessionsThisWeek: number;         // normal: 3, cramming: 4
  today: {
    skill: string;
    course: string;
    targetCount: number;                  // 10 or 15
    estMinutes: number;                   // targetCount × 1.5
  } | null;                               // null on rest days (Sunday) or when already done
}
```

**Ordering rules (priority order):**
1. Filter skills to those in-scope for the course via existing `filterSkillsForCourse(skills, course)` — PSAT 8/9 never gets trig etc.
2. Unexplored skills (`profile.skills[key].totalAnswers < 5`) get top priority — can't plan around what's untried
3. Among explored skills, score = `0.6 × (1 − mastery) + 0.3 × domainWeight + 0.1 × recommendationBoost`
   - `domainWeight` from CB's Assessment Framework (SAT Math: Algebra 0.35, Adv Math 0.35, PSDA 0.15, Geo&Trig 0.15; similar per-test values)
   - `recommendationBoost` = normalized rank from `profile.recommendations` if skill appears there, else 0
4. Apply prerequisite chains (static list in `lib/study-plan/prerequisites.ts`): a skill cannot be scheduled in an earlier week than its prerequisite
   - `linear_equations → linear_inequalities, systems_of_equations, linear_functions`
   - `quadratic_equations → completing_the_square, polynomial_operations`
   - `triangles → right_triangle_trig → unit_circle`
   - (full list lives in the prerequisites file; keep tight to avoid over-constraining)

**Packing:**
- Start with all eligible skills sorted by score (descending).
- Assign 2 skills per week in normal mode, 2 per week in cramming mode too but fewer weeks cover fewer skills.
- `currentWeekIndex = 0` always points to the block whose `assignedWeek` equals the week offset from plan `createdAt`. Fast-forwarded by Sunday regen.
- If `weeksRemaining < 2` → cramming mode: only include the top 5 weakest in-scope skills, one per week (so weeks 0 and 1 get top 2 each).

**Today's skill picker:**
- If today is Sunday → `today = null` (rest day).
- Else: pick the first skill in `currentWeekSkills` where (a) `profile.skills[skill].mastery < targetMastery` AND (b) `completedDays[todayString]` doesn't already mark today as done.
- If all skills hit target OR all done today → `today = null` (student's ahead).

**targetCount:** 15 for skills in high-weight domains (≥ 0.3), 10 otherwise. **estMinutes = targetCount × 1.5.**

---

## 5. Parker's weekly narrative

**Skill location:** `~/Lachlan/.claude/skills/study-plan-narrative/SKILL.md`

**Invocation:**

```
claude --print "Run study-plan-narrative with --uid <UID> --course <COURSE>"
```

The trigger engine passes one uid+course pair per invocation.

**Process:**
1. Load voice guide `parker-coach-voice.md` (shared with Coach Chat).
2. Load inputs via firebase-admin:
   - `studyPlans/{uid}_{course}` — current skillQueue, currentWeekSkills, testDate, weeksRemaining
   - `adaptiveProfile/{uid}` — last week's mastery snapshot for diffing
   - `performanceLog/{uid}/answers` — last 7 days of activity
3. Compute week-over-week mastery deltas per skill.
4. Dedupe check: if the plan's `currentWeekSkills` are identical to last week's AND the student logged zero answers in the last 7 days, return `{ "skipped": true, "reason": "no change" }`.
5. Draft narrative + pullQuote per voice guide constraints.
6. Output JSON: `{ "narrative": "...", "pullQuote": "...", "skipped": false }` OR `{ "skipped": true, "reason": "..." }`.

**Voice constraints (same as coach-draft):** 3–4 sentences, specific, numbered evidence where possible, no cheerleading. Pull-quote is 2–6 words from the narrative.

**Pipeline:** Sunday 10 PM launchd job runs `scripts/study-plan-regen.cjs`. For each active plan:
1. Run the pure algorithm server-side, write the updated plan doc.
2. If `skillQueue` or `currentWeekSkills` changed from prior state, invoke `study-plan-narrative`.
3. Write `narrative` and `pullQuote` to `studyPlans/{uid}_{course}`.
4. Also invoke `coach-draft` with `trigger: "weekly_plan_update"`, body = the narrative — this flows through the existing `coachDrafts` queue (Discord ping + Drafts tab). Luke approves or edits before it ships to the student's Coach Chat thread.

**Failure mode:** if the narrative skill fails or times out, the plan still regenerated (step 1 ran); just no coach note for that week. Log and move on.

---

## 6. Data model

### `studyPlans/{planId}`

`planId = {uid}_{course}` — compound so one student can have separate plans per course.

| Field | Type | Notes |
|---|---|---|
| `uid` | string | student |
| `course` | string | `sat-math` etc. |
| `testDate` | timestamp | student's target |
| `createdAt` | timestamp | |
| `status` | `"active" \| "archived" \| "paused"` | `archived` after testDate |
| `skillQueue` | array | `{ skill, assignedWeek, targetMastery }` |
| `currentWeekIndex` | number | 0 = this week |
| `currentWeekSkills` | array<string> | |
| `targetSessionsThisWeek` | number | 3 normal, 4 cramming |
| `mode` | `"normal" \| "cramming"` | |
| `weeklyNarrative` | string? | Parker's prose |
| `pullQuote` | string? | 2–6 words |
| `completedDays` | map `{ "YYYY-MM-DD": true }` | auto-filled from matching sessions |
| `skippedWeeks` | array<number> | |
| `lastRegeneratedAt` | timestamp | last server-side Sunday regen |
| `lastAlgorithmRunAt` | timestamp | last client-side recompute |

### Rules

```
match /studyPlans/{planId} {
  allow read: if isPapsUser() && (
    resource.data.uid == request.auth.uid ||
    isStaff(request.auth.uid)
  );
  allow create: if request.auth != null
    && request.resource.data.uid == request.auth.uid;
  allow update: if request.auth != null
    && resource.data.uid == request.auth.uid
    && request.resource.data.diff(resource.data).affectedKeys().hasOnly([
      "testDate", "skippedWeeks", "completedDays", "status",
      "currentWeekIndex", "currentWeekSkills", "targetSessionsThisWeek",
      "skillQueue", "mode", "lastAlgorithmRunAt"
    ]);
  allow delete: if false;
}
```

`weeklyNarrative`, `pullQuote`, `lastRegeneratedAt` are server-only (admin SDK writes during Sunday regen).

### Index

```
{ collectionGroup: "studyPlans", fields: [
  { fieldPath: "status", order: "ASCENDING" },
  { fieldPath: "testDate", order: "ASCENDING" }
]}
```

Used by the Sunday cron to list active plans.

---

## 7. UI surfaces

### 7.1 Home page — Today's set card

New component `components/home/today-card.tsx`. Mounted above Coach's Note block on home.

**Render condition:** any `studyPlans/{uid}_*` has `status: "active"` AND its `today` field is non-null.

**Layout:**
- Paper-card with stamp shadow and 4px accent-red top rule
- Kicker: `TODAY'S SET · WEEK {n} OF {total}`
- Serif heading: skill label ("Linear equations")
- Mono meta: `10 QUESTIONS · ~15 MIN`
- Primary button: "START TODAY'S SET" → `/dashboard?tab=practice&skill={key}&count={n}&plan={planId}`
- Secondary link under: "See full study plan →" → `/study-plan`

If a student has multiple active plans, show ONE card per home visit — whichever plan has the oldest `lastAlgorithmRunAt` (least recently touched).

### 7.2 `/study-plan` — full plan page

New route `app/(authenticated)/study-plan/page.tsx`.

**Masthead:** "Your study plan" + dateline counting down to test ("37 days to SAT · May 24")

**Course toggle:** if multiple active plans, inline toggle strip (default: most recent `lastAlgorithmRunAt`)

**Week strip:** horizontal row of week cards; this week highlighted `bg-ink text-paper`. Each card: week number + 2–3 skill names + status (`Done` / `This week` / `Upcoming` / `Skipped`)

**Narrative block:** below the week strip, Parker's `weeklyNarrative` as a paper-card with the `pullQuote` rendering italic accent red inline. Timestamp footer (`FROM PARKER · UPDATED SUN 10 PM`).

**Per-skill progress:** below the narrative, a list of this week's skills with a mastery bar (current) and a target line. Mono percentages.

**Footer actions:**
- "Skip this week" — confirmation modal → sets `skippedWeeks[currentWeekIndex] = true`
- "Change test date" — inline date picker
- "Archive this plan" (only when status=active and testDate is in future) — flips status=archived, hides Today card

### 7.3 Onboarding modal

Triggered on first `/study-plan` visit when no plan exists for any course.

- Test selector (radio: SAT, PSAT/NMSQT, PSAT 8/9) — defaults to their most-active test from adaptiveProfile (most answers in last 30 days)
- Section selector (Math or R&W, checkable either or both — creates 1 or 2 plans)
- Test date picker — pre-filled with upcoming official CB dates based on test selection
- Validation: date must be in future; test selection required
- "Build my plan" → writes one `studyPlans/{uid}_{course}` doc per selected section, runs algorithm client-side, redirects to `/study-plan`

### 7.4 Nav

Add `Study Plan` entry in `components/layout/top-bar.tsx` between `Skills Library` and `Progress`. href = `/study-plan`. No badge (no per-user unread signal; the Today card handles urgency).

### 7.5 Practice runner integration

In `components/practice/practice-runner.tsx` and `components/test/practice-test.tsx`:
- When the URL has `?plan={planId}`, pass it through to the results screen
- Results screen reads `studyPlans/{planId}` and renders a small footer card:
  - Kicker: `STUDY PLAN`
  - Body: `Today's set complete. Tomorrow: {nextSkillLabel}.` OR `Week {n} complete — {skills} all at target.`
  - Link: "See plan →" → `/study-plan`

### 7.6 Auto-complete hook

In `lib/test-persistence.ts` `completeTestSession`:
- After the session write, query active plans for this uid (`studyPlans where uid == <uid> and status == "active"`)
- For each plan where `course` matches the session's course AND session's skills overlap with `currentWeekSkills`, update `completedDays[todayISO] = true` and bump `lastAlgorithmRunAt` (rerun algorithm to refresh `today`)

---

## 8. Client-side algorithm run

`lib/study-plan/client-regen.ts` exports:

```ts
export async function regenerateStudyPlan(planId: string): Promise<void>;
```

Called:
- On `/study-plan` page mount (if `lastAlgorithmRunAt` > 2 hours old)
- From the auto-complete hook in `test-persistence.ts` after a matching session
- On test-date change
- On week skip

Reads the plan doc, reads the student's adaptiveProfile, runs the pure algorithm, writes the whitelisted fields back. Never writes `weeklyNarrative` or `pullQuote` (those are Parker-only).

---

## 9. Mac mini pipeline

Two new scripts, one new skill, two new launchd plists.

### `~/Lachlan/scripts/study-plan-regen.cjs`

Runs every Sunday at 22:00. For each `studyPlans where status == "active"`:
1. Load profile, compute algorithm, write the plan doc (admin SDK bypasses client rules)
2. Flip `status = "archived"` if `testDate` has passed — skip further steps for archived plans
3. If `skillQueue` diff from prior state is material, invoke `study-plan-narrative` skill for this plan
4. Write `weeklyNarrative` + `pullQuote` fields
5. Invoke `coach-draft` with `trigger: "weekly_plan_update"`, `body: narrative`, `quotedPassage: pullQuote` — creates a pending draft in `coachDrafts`
6. The existing Coach Chat dispatcher handles the Discord ping + dashboard surface

### `~/Lachlan/.claude/skills/study-plan-narrative/SKILL.md`

Defined in §5. Shares the Parker voice guide with coach-draft.

### launchd

- `com.luke.study-plan-regen.plist` — Sunday 22:00 weekly
- `com.luke.study-plan-archive.plist` — Daily 01:00, flips past-date plans to archived (redundant with the Sunday regen but catches single-day test dates sooner)

Installer at `~/Lachlan/ops/study-plan/install.sh` following the Coach Chat pattern.

---

## 10. Lifecycle edge cases

| Situation | Behavior |
|---|---|
| testDate passes | status → archived (Sunday regen or daily archive cron). Today card hides. /study-plan shows wrap-up: final mastery vs week-1 mastery, total sessions, "How'd it go?" button that opens the existing Coach Chat composer with a prefilled body — goes through the normal student-reply flow (Parker drafts response, Luke approves) |
| testDate < 2 weeks | Cramming mode: top 5 weakest skills only, 4 sessions/week, narrative calls it out |
| testDate changes | Immediate client regen. Sunday narrative stays as-is; next Sunday reflects. Drafts a coach note `trigger: "test_date_change"` |
| Zero activity 7+ days | Sunday regen runs. Narrative acknowledges: "Quiet week. Plan carries over." Coach Chat's existing weak_skill trigger still fires independently |
| Student skips week | `skippedWeeks[n] = true`. Today card hides for that week. Sunday regen redistributes skills into remaining weeks if room; else those skills drop off (explicit defer) |
| Multiple courses active | Home shows one Today card (least recently run plan). `/study-plan` has course toggle |
| Plan created with testDate in past | Onboarding modal blocks submit — date picker validation |
| Parker narrative fails | Algorithm still ran; plan still current; no coach note that week. Error logged to `/tmp/study-plan-regen.err` |

---

## 11. Dependencies

**Existing** (reused):
- Firestore, Firebase Auth, `adaptiveProfile/{uid}`, `performanceLog/{uid}/answers`
- Campus Press design system (tokens, primitives, `top-bar.tsx`)
- Coach Chat `coachDrafts` collection + Discord/Dashboard dispatcher + `coach-draft` skill for narrative distribution
- Parker voice guide (`~/Lachlan/.claude/skills/coach-draft/parker-coach-voice.md`)
- `filterSkillsForCourse` + `getCourseTaxonomy` from `lib/adaptive/adaptive-engine.ts`
- `recomputeProfile` + adaptive engine's `recommendations` output

**New**:
- `lib/study-plan/algorithm.ts` (pure function)
- `lib/study-plan/prerequisites.ts` (static map)
- `lib/study-plan/client-regen.ts`
- `types/study-plan.ts`
- `components/home/today-card.tsx`
- `components/study-plan/week-strip.tsx`, `narrative-card.tsx`, `onboarding-modal.tsx`, `skill-progress.tsx`
- `app/(authenticated)/study-plan/page.tsx`
- `~/Lachlan/scripts/study-plan-regen.cjs`
- `~/Lachlan/.claude/skills/study-plan-narrative/`
- `~/Lachlan/ops/study-plan/` (plists + installer)

---

## 12. Out of scope (YAGNI)

- Calendar month view (the week strip is enough)
- Push / email / SMS reminders
- Parent-visible plans
- Class-level shared plans
- Plan templates ("accelerated 4-week") authored by Luke
- Analytics on adherence
- Mid-week Parker regen (narrative only refreshes Sunday)
- Rescheduling individual days (skip-week is the only deferral)
- Google Classroom assignment integration
- Audio mode
- Study buddy / peer matching
- Custom rest days (Sunday is the only rest day)
- Time-of-day scheduling
- Per-skill drill-down ("why is this skill in my plan?") — defer until students ask

---

## 13. Open questions

None at spec time. If ambiguity surfaces during implementation, fall back:
- Scale choice → simpler option
- UI ambiguity → match the Coach Chat surface conventions from `components/coach-chat/`
- Voice ambiguity → `parker-coach-voice.md`
- Algorithm ambiguity → prefer weakest skill + prerequisite respect over recency/recommendations
