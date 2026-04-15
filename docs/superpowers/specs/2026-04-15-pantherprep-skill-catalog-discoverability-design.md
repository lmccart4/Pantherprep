# Spec — PantherPrep Skill Catalog Discoverability

**Date:** 2026-04-15
**Author:** Lachlan (in brainstorming session with Luke)
**Status:** Design approved, ready for implementation plan

## Problem

The skill catalog (`/skills/[course]` + `/skills/[course]/[skill]`) is fully built and content-complete at 49/49 skill coverage, but a student can only reach it through contextual entry points that assume they've already finished a test: weak-skill CTAs on diagnostic/practice-test/module-complete screens, clickable tags in Past Tests view, Dashboard Skills-tab preview, Practice Results Card delta rows.

A new student who logs in and lands on `/home` has **no top-level path** to the catalog. The top bar (`components/layout/top-bar.tsx`) is minimal — wordmark + optional back button + auth trio — and has no persistent nav link for browsing skills. The home page (`app/(authenticated)/home/page.tsx`) shows test-family cards and past tests, but nothing about the skill library.

Net effect: the catalog behaves as a post-test consolation surface, not a self-directed review tool. This spec adds three entry points — a new root picker route, a persistent top-bar link, and a home-page card — so students can find and use it on their own initiative.

## Scope

**In scope:**
1. New `/skills` root route with a 6-tile picker (3 test types × 2 sections)
2. Top-bar "Skills" link (left-group placement, active-state aware)
3. Home-page SkillsCard (dynamic copy based on adaptive profile state)

**Out of scope (explicit):**
- Analytics/click-through instrumentation on the new entry points
- Search UI inside the catalog (6 tiles doesn't need it)
- Changes to existing `/skills/[course]` and `/skills/[course]/[skill]` pages — they already exist and work
- Any teacher-side skill-coverage analytics surface (separate project)
- Migration or backfill — this spec is pure additive UI

## Role scope

All three entry points are **universal** — visible to `student`, `teacher`, and `admin` roles alike. Rationale: the catalog is read-safe (no mutations), and teachers benefit from previewing what students see. Role differentiation happens only in the `SkillsCard` subtitle copy (see section 3).

## Architecture

Three additions, one edit per location:

| # | Type | Path | Purpose |
|---|---|---|---|
| 1a | New page | `app/(authenticated)/skills/page.tsx` | `/skills` root route — renders the picker |
| 1b | New component | `components/skills/skill-root-picker.tsx` | 6-tile grid component |
| 2 | Edit | `components/layout/top-bar.tsx` | Adds Skills link to the left group |
| 3a | New component | `components/home/skills-card.tsx` | SkillsCard with dynamic copy |
| 3b | Edit | `app/(authenticated)/home/page.tsx` | Inserts `<SkillsCard />` between test-family cards and past tests |

No new Firestore queries. No new collections. No schema changes.

## Section 1 — `/skills` root picker

### Route
- `app/(authenticated)/skills/page.tsx` — client component (matches the pattern used by `app/(authenticated)/skills/[course]/page.tsx`, which delegates to a `*-page-client.tsx` wrapper). Renders `<SkillRootPicker />`.
- Does not collide with the existing `app/(authenticated)/skills/[course]/page.tsx` dynamic route (Next.js resolves static segments before dynamic ones)

### Component — `<SkillRootPicker />`
Client component. Fetches its own `adaptiveProfile` via `useAuth()` + `useEffect` → `getAdaptiveProfile(user.uid)`, identical to the pattern `/dashboard` and `/home` already use. No props — the page wrapper is empty shell that renders `<SkillRootPicker />` directly. Graceful loading state: render the 6 tiles immediately with static skill counts, lazily attach the adaptive-stat chip once `adaptiveProfile` resolves.

Layout:
- Page shell uses existing `<TopBar backHref="/home" backLabel="Home" />`
- Page title: **"Skill Library"**
- Subtitle: *"Browse concept explanations and practice questions by topic, independent of any test. Start with your weakest areas or explore anything that looks interesting."*
- Grid of 6 `<GlassCard>` tiles below, responsive:
  - Desktop (≥1024px): 2-column × 3-row grid
  - Tablet (768–1023px): 2-column × 3-row grid (same)
  - Mobile (<768px): 1-column × 6-row stack

### Tile contents
Static taxonomy — no runtime fetch:

| Tile | Title | Subtitle | Accent | Route |
|---|---|---|---|---|
| 1 | SAT Math | Algebra, advanced math, geometry | `#C8102E` (panther-red) | `/skills/sat-math` |
| 2 | SAT Reading & Writing | Craft, expression, conventions | `#C8102E` | `/skills/sat-rw` |
| 3 | PSAT/NMSQT Math | Same curriculum, NMSQT scoring | `#d4a017` (gold) | `/skills/nmsqt-math` |
| 4 | PSAT/NMSQT Reading & Writing | Same curriculum, NMSQT scoring | `#d4a017` | `/skills/nmsqt-rw` |
| 5 | PSAT 8/9 Math | Grades 8–9 baseline | `#06b6d4` (cyan) | `/skills/psat89-math` |
| 6 | PSAT 8/9 Reading & Writing | Grades 8–9 baseline | `#06b6d4` | `/skills/psat89-rw` |

Each tile shows:
- Accent-colored title
- Subtitle (text-muted)
- Static skill count — *"N skills"* — pulled from `lib/skill-mapping.ts` taxonomy at build time (counted per course via a small helper)
- **Optional adaptive stat** — if `adaptiveProfile` is provided and non-null, compute per-course recommendation count and render as a small second-line chip: *"{N} recommended to review"*. Empty-state (zero recommendations for that course) hides the chip entirely. Never shows for users without adaptive data.

### Accent colors
Extract the `TESTS` color map from `app/(authenticated)/home/page.tsx` lines 62–66 into `lib/test-types.ts` as a shared constant. Home page and the new picker both import from one source. This refactor IS part of the spec, not optional — without it, the picker duplicates a literal map, and a future color change has to edit two files.

## Section 2 — Top-bar Skills link

### Change
`components/layout/top-bar.tsx` — add one `<a>` element to the left group, positioned after the wordmark and before the right-side auth trio.

### Markup sketch
```tsx
<div className="flex min-w-0 items-center gap-3 sm:gap-4">
  {backHref && (<a href={backHref}>…existing back button…</a>)}
  <a href="/home" className="…wordmark…">
    Panther<span className="text-panther-red">Prep</span>
  </a>
  <span className="hidden h-4 w-px bg-white/15 sm:inline-block" aria-hidden />
  <a
    href="/skills"
    className={cn(
      "hidden text-sm font-medium transition-colors sm:inline-block",
      pathname.startsWith("/skills")
        ? "text-white"
        : "text-text-muted hover:text-text-secondary"
    )}
  >
    Skills
  </a>
</div>
```

### Behavior
- **Hidden below `sm` (<640px)** — same breakpoint the existing back-button label and role badge use. Mobile discovery relies on the home-page card (section 3).
- **Active state** — uses `usePathname` from `next/navigation`. When `pathname.startsWith("/skills")`, renders white; otherwise muted. Turning `TopBar` into a client component is a no-op because it already is (`"use client"` at line 1).
- **Thin vertical separator** — a 1px-wide `bg-white/15` span with `h-4` between the wordmark and the link. Keeps the header typographic; avoids an icon.
- **Role gating** — none. Universal visibility per the role-scope section.

### What does NOT change
- Right-side auth trio (role badge, name, sign-out button) — untouched
- Existing back-button behavior — untouched; if a page passes `backHref`, both the back button AND the Skills link render
- Mobile layout — still collapses via existing `sm:` breakpoints

## Section 3 — Home page SkillsCard

### Component — `<SkillsCard />`
New file: `components/home/skills-card.tsx`. Client component. Props:
```ts
interface SkillsCardProps {
  role: "student" | "teacher" | "admin" | null;
  adaptiveProfile: AdaptiveProfile | null;
}
```

### Layout
- Full-width `<GlassCard>` matching surrounding cards' visual language
- Horizontal flex on desktop, vertical stack on mobile
- Left side (`flex-1`):
  - Headline: **"Review by topic"** (text-xl, font-semibold)
  - Dynamic subtitle (see copy variants below)
- Right side (`shrink-0`):
  - Primary CTA button — red (`bg-panther-red`), text *"Open skill library →"*, links to `/skills`
  - Mobile: becomes full-width

### Copy variants (picked inside the component)

| Condition | Subtitle |
|---|---|
| `role === "teacher"` or `role === "admin"` | *"Browse the student skill library — preview the concept bundles and practice pools students see."* |
| `role === "student"` AND `adaptiveProfile.recommendations.length >= 1` | *"You have {N} skills that could use work — {top}, {second}, and more."* (shows up to 2 named skill labels from the top recommendations, rest folded into "and more") |
| `role === "student"` AND `adaptiveProfile.recommendations.length === 0` AND adaptive data exists | *"Every skill you've practiced is looking strong. Browse the full library to explore new areas."* |
| `role === "student"` AND no adaptive data yet (fresh account) | *"49 skills across SAT, PSAT/NMSQT, and PSAT 8/9. Start a topic without taking a full test."* |
| `adaptiveProfile` still loading | Same as the "no adaptive data yet" fallback — no skeleton. The card renders with the neutral copy until data arrives, then re-renders. |

Named skill labels come from the existing `skillLabel()` helper in `lib/adaptive/adaptive-engine.ts`. The card never fetches — it consumes whatever `adaptiveProfile` the home page already loads.

### Placement in `/home`
Current home layout for `view === "home"` branch:
1. Greeting + user info
2. Level / XP strip
3. Test-family cards (SAT / PSAT-NMSQT / PSAT 8/9)
4. Past tests section

New layout:
1. Greeting + user info
2. Level / XP strip
3. Test-family cards
4. **→ `<SkillsCard />` ← NEW, positioned here**
5. Past tests section

Rationale: test-family cards are "start something new," past tests are "review what you did." The skills card sits between them as the "review by topic, not by test" option. It answers *"what should I study tonight?"* without requiring a scroll past the test-family section.

### Data source
Reads `profile`, `role`, and `adaptiveProfile` from the existing state on `home/page.tsx`. The home page already calls `getStudentProfile` and `getAdaptiveProfile` in its initial `useEffect` — the SkillsCard is a pure consumer, no new fetch.

## Testing

### Unit (optional, skippable to move fast)
- `<SkillsCard />` copy selector: given `{role, adaptiveProfile}`, asserts correct subtitle string. Pure function, trivial.
- `<SkillRootPicker />` tile list: golden snapshot of the 6 tiles at their static counts.

### Build + type-check
- `npm run build` must succeed. `/skills` root must statically generate alongside the existing `/skills/[course]` and `/skills/[course]/[skill]` static params.

### Deploy-verify (the real verification)
`/deploy-verify pantherprep "skill catalog discoverability — /skills root + top-bar link + home SkillsCard"`

- **Link** confirms:
  - `/skills` root responds HTTP 200, renders under SSR
  - Existing `/skills/[course]` and `/skills/[course]/[skill]` routes unchanged
  - Home page `getStudentProfile` / `getAdaptiveProfile` data loading unchanged (no new Firestore reads, no timing regressions)
  - Top-bar link's `pathname.startsWith("/skills")` active state triggers correctly

- **Pixel** captures at 375 mobile, 768 tablet, 1280 desktop:
  - `/home` — SkillsCard visible between test-family cards and past tests, dynamic copy correct for qa-student's adaptive state
  - `/skills` — 6-tile picker, accent colors correct, grid collapses to 1 column at mobile
  - `/skills/sat-math` — top-bar link visible, active-state white, rest of page unchanged
  - `/home` top-bar — Skills link visible on desktop/tablet, hidden on mobile

## Rollback

Single-commit rollback is clean:
- 3 new files (picker page, picker component, SkillsCard) — delete
- 2 edited files (`top-bar.tsx`, `home/page.tsx`) — revert

Nothing in the adaptive pipeline, Firestore schema, or grade-integrity path is touched. No migration, no backfill, no user-visible state change beyond the three new UI surfaces.

## Dependencies

- Existing: `GlassCard`, `TopBar`, `lib/skill-mapping.ts` taxonomy, `lib/adaptive/performance-service.ts` types, `skillLabel()` helper
- No new npm packages
- No new Firestore indexes
- No new security rules

## Open decisions — none

All four clarifying questions were resolved in the brainstorming session:
1. Role scope: universal (B)
2. Course resolution: new `/skills` root route with 6-tile picker (B)
3. Home card shape: personalized with adaptive-aware copy (B)
4. Testing strategy: build + deploy-verify chain (standard)

## Next step

After user approval of this spec, invoke `superpowers:writing-plans` to produce the step-by-step implementation plan.
