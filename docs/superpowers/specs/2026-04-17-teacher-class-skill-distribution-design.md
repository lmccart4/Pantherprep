# Teacher/Admin Class Skill Distribution on `/skills`

Date: 2026-04-17
Owner: Kit (implementation) / Lachlan (spec)

## Problem

On the `/skills` catalog page, the tier filter (Weak / Medium / Strong) is computed from the **logged-in user's own** `AdaptiveProfile`. Teachers and admins have no practice data, so every skill is classified Weak and the Medium/Strong filters are permanently empty. There is no way for a teacher to see how their class is doing across the skill taxonomy.

## Goal

When a teacher or admin views `/skills/[course]`, the tier filter reflects **class-wide mastery** rather than the teacher's personal mastery. Teachers pick one class at a time; admins see platform-wide data.

## Non-goals

- Student-by-student drill-down from a skill row (followup).
- Pre-aggregation via Cloud Functions (current scale does not need it).
- Pagination of admin view beyond a 500-student soft cap.
- Changes to the student-side experience — student mastery/tier logic is untouched.

## Design

### Data flow

1. `SkillCatalogPageClient` reads `role` from the existing auth/profile hook.
2. Fetch strategy branches on role:
   - **student** — unchanged. Load own `AdaptiveProfile` via `getAdaptiveProfile(uid)`.
   - **teacher** — load `classes` where `teacherUid == uid`. Render a class picker. For the selected class (or "All my classes"), load `AdaptiveProfile` docs for every `uid` in the combined `students` arrays. Parallel `getDoc` calls.
   - **admin** — call `getAllAdaptiveProfiles()` with no args (existing helper; falls back to a 200-doc collection scan). Log a console warning if results hit the cap. No class picker.
3. Aggregate client-side: a new `getAggregatedSkillData(profiles: AdaptiveProfile[], key: string) → AggregatedSkillData` returns the same shape `getProfileSkillData` already returns (`{ total, correct, mastery }`) so downstream consumers don't change. Sum `correct` and `total` across profiles; `mastery = correct / total` (or 0 when total === 0).
4. `tierOf(data)` is unchanged — same 0.5 / 0.8 thresholds apply to class-aggregated mastery.

### UI

- **Class picker** — `<select>` above the course tab strip, visible only for teachers. Options: `"All my classes (combined)"` + one entry per class. Persists selection in `localStorage` key `pp.skills.classId`. Empty-state: if teacher has zero classes, hide the tier filter and show a muted CTA pointing to class creation.
- **Tier filter** — same three buttons, but labels swap contextually when viewing class data:
  - Weak → "Struggling"
  - Medium → "Developing"
  - Strong → "Proficient"
  - `All` stays `All`.
- **Skill row (teacher/admin only)** — replace the single mastery % bar on the right side with a three-segment stacked distribution bar (red / amber / green) sized proportionally by student counts in each tier. Tooltip on hover: `"5 struggling · 8 developing · 12 proficient · 3 untouched"`. Untouched students (no attempts on that skill) appear as a neutral grey segment but do not contribute to the tier bucketing.
- **Subtitle on `skills-card.tsx`** (home page) — teacher/admin copy becomes: `"See how your class is doing on every skill. Click any skill for a student-by-student breakdown."` (The drill-down is a followup; the copy is written to be forward-compatible.) Admin subtitle: `"Platform-wide skill distribution across all students."`

### Firestore rules

Existing rules in `firestore.rules` already grant staff (users with `role == "teacher"` or `role == "admin"` in the `students` collection) read access to any `adaptiveProfile/{uid}` doc via the `isStaff()` helper. No rule changes required.

### Aggregation helper shape

```ts
// lib/skill-mapping.ts
export function getAggregatedSkillData(
  profiles: AdaptiveProfile[],
  taxonomyKey: string
): AggregatedSkillData;

// components/skills/skill-catalog.tsx
// When role !== 'student', pass profiles[] to a new aggregation path
// rather than the single-profile getProfileSkillData.
```

The existing student path continues to call `getProfileSkillData(profile, key)` unchanged.

## Edge cases

- **Empty class** (no students, or none have profiles) → rows render with all-zero distribution, muted `"No student data yet"` note under the skill. Tier filter falls back to showing all skills regardless of tier.
- **Students with no attempts on a given skill** → "untouched" bucket. Not counted toward any tier; shown as grey segment in distribution bar.
- **Admin with many students** → existing 200-doc cap in `getAllAdaptiveProfiles()`; warn in console if the returned count equals the cap. Real pagination is a followup.
- **Stale profiles** → existing write path (`completeTestSession → recomputeProfile`) is the source of truth. No new write path introduced.
- **Class roster churn** — student removed from class after page load: no action, next navigation refreshes.
- **Boundary mastery values** — 0.5 exactly → Developing; 0.8 exactly → Proficient. Matches existing `tierOf` behavior.

## Performance

- Typical teacher class: 25–30 students → 25–30 parallel small `getDoc` calls on page load. Acceptable; `/skills` is a low-frequency teacher destination.
- Admin query: one `collection('adaptiveProfiles').limit(500)` query.
- If a class ever exceeds ~100 students, switch the teacher path to batched `where(uid, 'in', [...])` queries in chunks of 10. Not needed at current scale.

## Testing

- **Unit** — `getAggregatedSkillData` with fixtures: empty array, single profile, mixed-mastery profiles, all-strong, all-weak, some profiles missing the skill entirely.
- **Unit** — `tierOf` at boundaries 0.499, 0.5, 0.799, 0.8 against class-aggregated input.
- **Manual QA (Pixel)** — teacher login with seeded class; verify class picker populates, each tier filter returns expected skills, distribution bar renders with correct proportions, tooltip copy correct.
- **Playwright (followup, not blocking)** — qa-student + a second seeded student in a test class → teacher login → assert Medium filter is non-empty and distribution bar segments are proportional.

## Files touched

- `lib/skill-mapping.ts` — add `getAggregatedSkillData`.
- `components/skills/skill-catalog.tsx` — branch on role; use aggregated data path; class picker; relabeled tier filter.
- `components/skills/skill-catalog-page.tsx` — role-aware fetch logic (profiles[] vs single profile).
- `components/skills/skill-row.tsx` — distribution bar variant for teacher/admin view.
- `components/home/skills-card.tsx` — updated teacher/admin subtitle copy.
- (No new Firestore helper — `getAllAdaptiveProfiles(uids?)` already covers both paths.)
- (No rules changes — `isStaff()` already grants read.)
- `scripts/tests/skill-aggregation.test.mjs` — `tsx`-runnable assertion script for the aggregation helper.

## Out of scope / followups

- Student-by-student drill-down from a skill row.
- Admin pagination past 500 students.
- Pre-aggregated `classSkillAggregates/{classId}` docs via Cloud Function (only if read volume forces it).
- Time-windowed distributions (e.g., "last 30 days").
