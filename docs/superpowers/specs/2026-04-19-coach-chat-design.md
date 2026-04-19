# Coach Chat — Design Spec

**Date:** 2026-04-19
**Author:** Lachlan (brainstorm with Luke)
**Status:** Approved, ready for implementation plan
**Target:** pantherprep.web.app

---

## 1. Purpose

An in-app coaching channel between each student and their coach. AI-first (Parker) drafts proactive notes and reactive replies; Luke approves, edits, or overrides via a dashboard queue. Student-facing surface is a newspaper-styled Coach's Note block on home + a dedicated thread page.

Shipped as a v1 feature; excludes parent CC, multi-coach, analytics, and attachments (see §10 YAGNI).

---

## 2. User stories

- **As a student,** I see a Coach's Note on my home page when Parker or Luke has something to say about my recent practice. I can tap REPLY to ask a question or OPEN SKILL to jump into the skill the note is about.
- **As a student,** I can open `/coach-chat` to see the full thread of notes between me and my coach, and write back in the composer.
- **As a student who wants a real person,** I can toggle "Route to Mr. McCarthy" and my replies stop getting AI-drafted answers.
- **As Luke,** I get a Discord ping when Parker drafts a note, with approve/edit/reject/send-now buttons inline.
- **As Luke,** I see a Drafts tab on the teacher dashboard with all pending drafts, editable in place, with a countdown to auto-send at the 24-hour mark.
- **As Luke,** notes I haven't touched in 24 hours auto-send so the channel stays alive even when I'm busy.
- **As Parker,** I draft notes triggered by the weekly cadence, weak-skill thresholds, and post-session completions, deduped against recently-sent notes on the same skill.

---

## 3. Architecture

```
Student activity (Firestore: answers, session completions, mastery changes)
    ↓
Trigger engine (Mac mini launchd + Firestore listener)
  · Mon 9:00 weekly cadence
  · Every 10 min weak-skill sweep (mastery <0.4 OR 3-in-a-row wrong)
  · Post-session listener (on session doc write)
    ↓
coach-draft skill (Claude Code subscription; NO paid API)
  · Pulls student context (profile, recent answers, skill mastery)
  · Drafts note body + pull-quote + linkedSkill
  · Writes coachDrafts/{id} with status=pending, expiresAt=now+24h
    ↓
Dispatcher
  · Discord webhook → #coach-chat (approve/edit/reject/send-now buttons)
  · Dashboard Drafts tab (polled, badge count live)
    ↓
Luke approves → coachNotes/{id} (status=sent)
Luke ignores 24h → cron promotes draft → coachNotes (auto-send)
    ↓
Student surfaces
  · Home Coach's Note block (latest unread)
  · /coach-chat full thread
  · Reply composer → writes student note immediately
    ↓
Student reply → trigger engine → coach-draft(trigger=student_reply)
  UNLESS coachThreads.wantsHumanCoach == true, in which case Discord-ping Luke only
```

All AI generation runs through Claude Code's subscription session on the Mac mini. No Anthropic API calls.

---

## 4. Data model (Firestore)

### 4.1 `coachThreads/{uid}`

One doc per student. Header row for rendering inboxes.

| Field | Type | Notes |
|---|---|---|
| `studentUid` | string | == doc id |
| `lastActivityAt` | timestamp | last note sent by either side |
| `unreadCountStudent` | number | notes the student hasn't opened yet |
| `unreadCountCoach` | number | student replies Luke hasn't seen |
| `wantsHumanCoach` | boolean | student escape hatch; if true, AI replies are skipped and Luke is pinged |

### 4.2 `coachNotes/{noteId}`

Immutable sent-log. One doc per sent note.

| Field | Type | Notes |
|---|---|---|
| `threadUid` | string | == studentUid; index for per-thread queries |
| `role` | "coach" \| "student" | render direction |
| `author` | "parker" \| "luke" \| "student" | drives the byline |
| `body` | string | rendered as serif body copy |
| `quotedPassage` | string? | optional pull-quote, italic accent red in UI |
| `linkedSkill` | string? | taxonomy key; powers "Open Skill" |
| `linkedCourse` | string? | e.g. `sat-math`; required when `linkedSkill` is set |
| `trigger` | enum | `weekly` \| `weak_skill` \| `post_session` \| `student_reply` \| `luke_initiated` |
| `createdAt` | timestamp | write time |
| `readBy` | map | `{ student?: ts, luke?: ts }` |
| `status` | "sent" | always "sent" here; drafts live elsewhere |
| `lukeEdited` | boolean | true if Luke edited before approving |

### 4.3 `coachDrafts/{draftId}`

Mutable staging area for pending Parker drafts.

| Field | Type | Notes |
|---|---|---|
| `threadUid` | string | == studentUid |
| `body` | string | Luke-editable |
| `quotedPassage` | string? | |
| `linkedSkill` | string? | |
| `linkedCourse` | string? | |
| `trigger` | enum | same as §4.2 |
| `author` | "parker" | always Parker; Luke-initiated notes skip drafts |
| `draftedAt` | timestamp | write time |
| `expiresAt` | timestamp | `draftedAt + 24h`; cron promotes on expiry |
| `status` | enum | `pending` \| `approved` \| `rejected` \| `sent` \| `expired` |
| `approvedBy` | "luke" \| "auto" \| null | |
| `rejectedReason` | string? | |
| `lukeEdited` | boolean | mirrored to `coachNotes` on send |

### 4.4 Security rules (sketch)

```
coachThreads/{uid}:
  read: request.auth.uid == uid OR request.auth.token.role in ['teacher','admin']
  write: functions only

coachNotes/{id}:
  read: resource.data.threadUid == request.auth.uid OR teacher/admin
  create: request.auth.uid == resource.data.threadUid AND role == 'student'
          (students can only create student-authored notes in their own thread)
  create: teacher/admin for luke_initiated
  update/delete: functions only

coachDrafts/{id}:
  read/write: teacher/admin only
```

---

## 5. Trigger engine

One script: `scripts/coach-chat-trigger.cjs`. Invoked three ways:

1. **Weekly cadence** — launchd Mon 9:00 AM. Queries students with ≥1 answer in last 14 days; for each, invokes `coach-draft` skill with `trigger: "weekly"`.
2. **Weak-skill sweep** — launchd every 10 min. Queries `performanceLog` for students whose last 5 answers on a given skill include ≥3 incorrect, OR whose `adaptiveProfile.skills[k].mastery` crossed below 0.4 since last run (tracked via a `lastSweepAt` timestamp on a system doc). Invokes `coach-draft` with `trigger: "weak_skill"`.
3. **Post-session** — Firestore listener on `sessions` collection (via onWrite Cloud Function OR local Node watcher; choice deferred to plan). On new session doc, invokes `coach-draft` with `trigger: "post_session"`.

### 5.1 Dedupe rules

Before invoking Parker, check:

- Skip if any `coachDrafts` with status in ['pending','approved','sent'] OR `coachNotes` exist for `(threadUid, linkedSkill)` in the last 5 days. Prevents weekly + weak-skill notes doubling on the same topic.
- Skip if `coachThreads.wantsHumanCoach == true` AND trigger is `student_reply`. Those route Discord-ping-only, no draft.

### 5.2 coach-draft skill contract

Lives at `.claude/skills/coach-draft/SKILL.md`. Input (CLI args):

```
coach-draft --uid <studentUid> --trigger <enum> [--skill <key>] [--course <id>] [--session <id>]
```

Reads:
- `users/{uid}` for first name
- `adaptiveProfile/{uid}` for mastery snapshot
- last 10 rows from `performanceLog` filtered by skill when provided
- last 5 notes from `coachNotes` for voice continuity

Writes: one doc to `coachDrafts` with schema §4.3.

Output voice: direct, warm, dry, no glazing (from `context/lachlan-identity.md`) + specific `parker-coach-voice.md` guide bundled in the skill folder.

### 5.3 Escalation

If Parker concludes from the context that the student is upset, confused about a non-academic situation, or asking for emotional support, the skill returns `{ escalate: true, reason: string }` instead of writing a draft. The trigger engine then:

1. Sets `coachThreads.wantsHumanCoach = true`
2. Discord-pings `#coach-chat` with the escalation reason, no draft body
3. Waits for Luke to reply manually

---

## 6. UI surfaces

### 6.1 Home page — Coach's Note block

Already represented in `design_handoff_campus_press/screens/01-home.png`. Implementation:

- New React component `components/home/coachs-note-block.tsx`
- Fetches latest note from `coachNotes where threadUid == user.uid order by createdAt desc limit 1`
- Hides entire block when no notes exist
- Layout: paper-card with kicker "COACH'S NOTE", italic red pull-quote rendering `quotedPassage` inline with the body, footer byline with `BY {author} · LEAD COACH · {relative time}`
- Buttons: REPLY (accent red) → router.push(`/coach-chat?focus=composer`); OPEN SKILL (outlined) → router.push(`/skills/{linkedCourse}/{linkedSkill}`), hidden if `linkedSkill` is null
- On mount, if `note.readBy.student` is null, update it to now

### 6.2 `/coach-chat` — thread page

New route `app/(authenticated)/coach-chat/page.tsx`.

Layout: masthead ("Coach's Desk" — serif wordmark), dateline, triple-rule under masthead, single column of paper-cards.

Each note:
- Paper-card, 2px ink border, stamp shadow on the newest unread
- Coach notes = default orientation
- Student notes = inverted (`bg-ink text-paper`), mimicking the question-card "selected" state, right-aligned kicker
- Pull-quote renders italic accent red inline
- Footer: byline + relative timestamp + OPEN SKILL chip if linked

Composer at bottom:
- 2px ink border, square, serif placeholder
- Submit button = accent red primary
- Below composer: small link "Want to talk to Mr. McCarthy directly? →" toggles `wantsHumanCoach` with confirmation
- If `wantsHumanCoach == true`, show a paper banner above the composer: "Routed to Mr. McCarthy" with "Cancel" link

Thread ordering: most-recent first (newspaper convention). Older notes load on scroll.

On mount, mark all unread coach notes as read (`readBy.student = now`), reset `coachThreads.unreadCountStudent = 0`.

### 6.3 Teacher dashboard — Drafts tab

New tab in `TeacherView` (see `app/(authenticated)/dashboard/page.tsx`). Two subtabs:

**Pending:**
- Query `coachDrafts where status == 'pending' order by draftedAt asc`
- Each draft = paper-card: student name (serif), editable-in-place body (textarea, saves on blur with `lukeEdited = true`), linkedSkill chip, trigger kicker, countdown to auto-send
- Actions: APPROVE (accent primary) · SEND NOW (accent primary, skips the countdown) · EDIT inline · REJECT (secondary, opens reason textarea)

**Sent log:**
- Query `coachNotes where role == 'coach' order by createdAt desc limit 30`
- Table-like rows: timestamp, student, author badge (parker/luke), body preview, linkedSkill chip
- Read-only

Live count badge on the tab = `coachDrafts where status == 'pending'` count.

### 6.4 Nav

Add `Coach Chat` link in `top-bar.tsx` between `Progress` and `Practice Test`, href=`/coach-chat`. Matches `screens/01-home.png`.

---

## 7. Approval flow

### 7.1 Discord webhook

- New Discord channel `#coach-chat` in Luke's server
- Webhook URL stored in `~/Lachlan/.env` as `DISCORD_COACH_CHAT_WEBHOOK`
- On `coachDrafts` write with status=pending, trigger engine posts an embed:
  - Title: `New draft for {studentName}`
  - Description: body preview (first 300 chars)
  - Fields: trigger, linkedSkill, countdown
  - Buttons: Approve · Edit in dashboard · Reject · Send now
- Buttons call a local HTTP endpoint on the Mac mini (`scripts/coach-chat-action-endpoint.cjs`, port 8710, Tailscale-only) which updates Firestore
- Tailscale requirement gates button use to Luke's devices; out-of-network clicks show a fallback "open dashboard" link

### 7.2 Dashboard approval

As specified in §6.3. State transitions:

- `pending → approved → sent` (Luke click Approve)
- `pending → sent` (Luke click Send Now — skips 24h wait, equivalent to approved)
- `pending → rejected` (Luke click Reject; writes `rejectedReason`)
- `pending → expired → sent` (auto-send cron at 24h)

All terminal states write a corresponding doc to `coachNotes` (except `rejected` which doesn't send).

### 7.3 Auto-send cron

`scripts/coach-chat-autosend.cjs` runs every 5 minutes via launchd:

```
for draft in coachDrafts where status == 'pending' AND expiresAt <= now():
  - write to coachNotes with author = draft.lukeEdited ? 'luke' : 'parker'
  - update draft status = 'sent', approvedBy = 'auto'
  - update coachThreads: lastActivityAt, unreadCountStudent++
```

---

## 8. Student reply flow

1. Student submits reply in `/coach-chat` composer
2. Client writes directly to `coachNotes` with `role=student`, `author=student`, `status=sent`, `createdAt=now()`
3. Client updates `coachThreads.unreadCountCoach++`, `lastActivityAt=now`
4. Firestore listener in the trigger engine fires:
   - If `coachThreads.wantsHumanCoach == true`: Discord-ping `#coach-chat` with "Reply from {studentName} — needs you". No draft generated.
   - Else: invoke `coach-draft --trigger student_reply --uid {uid}` with last 10 notes in the thread as context. Parker drafts reply → goes through standard approval flow.

Student replies are never drafted; they ship immediately. Only coach-authored notes go through the draft queue.

---

## 9. Notifications

**Luke:**
- Discord `#coach-chat` ping on draft write (§7.1)
- Discord `#coach-chat` ping on student reply when `wantsHumanCoach` is true (§8)
- Discord `#coach-chat` ping on escalation (§5.3)
- Dashboard badge count on the Drafts tab (polled every 60s while dashboard is open)

**Student:**
- In-app only for v1 — home page Coach's Note block + /coach-chat unread indicator
- Email / push notifications deferred to v2

---

## 10. Out of scope (YAGNI)

- Group threads (multi-student coach classes)
- Attachments / file uploads
- Voice / audio notes
- Push notifications to student device
- Email notifications to student
- Parent CC on coach notes
- Analytics dashboard (approval rate, response time)
- Coach-initiated voice/video sessions
- Coach-visible student read receipts in-thread (Luke sees `readBy.student` on admin draft view; students don't get reverse)
- Multi-coach support (Luke is the only human coach; Parker the only AI voice)
- In-Discord direct reply composer from Luke (edit requires dashboard in v1)
- Thread search / filtering / archiving

---

## 11. Open questions (none at spec time)

All design choices resolved in brainstorm. If ambiguity surfaces during implementation, fall back to:
- Scale choice → pick the simpler option
- UI ambiguity → match `design_handoff_campus_press/screens/01-home.png` + `/coach-chat` conventions (newspaper column, paper cards, ink rules)
- Voice ambiguity → defer to Parker's existing AGENT.md + `parker-coach-voice.md` (to be authored during implementation)

---

## 12. Dependencies

- Existing: Firestore, Firebase Auth, Next.js app, Tailwind v4 Campus Press theme, `TopBar`/`GlassCard` primitives, Discord webhook infra on Mac mini
- New: `#coach-chat` Discord channel (Luke to create), `DISCORD_COACH_CHAT_WEBHOOK` env var, three new launchd plist entries (weekly trigger, weak-skill sweep, auto-send cron), one HTTP endpoint for Discord button callbacks
- No new npm packages expected; uses existing `firebase-admin` already installed on Mac mini
