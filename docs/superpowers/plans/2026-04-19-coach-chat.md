# Coach Chat Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the Coach Chat feature described in `docs/superpowers/specs/2026-04-19-coach-chat-design.md`: AI-first coaching notes with Luke approval queue, delivered via a newspaper-styled student UI, dispatched through Discord + dashboard, executed on Mac mini infrastructure with no paid API.

**Architecture:** Firestore stores threads/notes/drafts. A new Claude Code skill (`coach-draft`) drafts notes into `coachDrafts`. A Mac mini trigger engine invokes the skill on three schedules (weekly, weak-skill, post-session). Luke approves via Discord buttons or the dashboard Drafts tab; unapproved drafts auto-send at 24h. Student surfaces: home-page Coach's Note block, `/coach-chat` thread route, nav entry.

**Tech stack:** Next.js 15 + React 19 (static export), Tailwind v4 Campus Press theme, Firestore + Firebase Auth, `firebase-admin` for scripts, Node.js cron via launchd on Mac mini, Discord webhook + interaction endpoint over Tailscale.

**No automated test suite exists in this project.** Verification uses: `npm run build` for type safety, `preview_start` + screenshots for UI, `qa-student` Playwright flow for end-to-end, and seed scripts for Firestore inspection. Each task includes its own verification step.

---

## File Structure

### New files

```
types/coach.ts                                        — shared TS types for threads/notes/drafts
lib/coach-chat.ts                                     — client-side Firestore helpers (subscribe, post, mark-read)
components/home/coachs-note-block.tsx                 — home-page Coach's Note surface
components/coach-chat/thread-view.tsx                 — main thread UI for /coach-chat
components/coach-chat/composer.tsx                    — reply composer
components/coach-chat/note-card.tsx                   — individual note paper-card
components/coach-chat/human-coach-toggle.tsx          — escape-hatch control
components/dashboard/drafts-tab.tsx                   — teacher Drafts tab component (pending + sent subtabs)
components/dashboard/draft-card.tsx                   — single draft row with edit/approve/reject
app/(authenticated)/coach-chat/page.tsx               — thread route
~/Lachlan/.claude/skills/coach-draft/SKILL.md         — Claude Code skill invoked by triggers
~/Lachlan/.claude/skills/coach-draft/parker-coach-voice.md  — voice guide for Parker
~/Lachlan/scripts/coach-chat-trigger.cjs              — trigger engine (weekly + weak-skill + post-session)
~/Lachlan/scripts/coach-chat-autosend.cjs             — 24h auto-send cron
~/Lachlan/scripts/coach-chat-action-endpoint.cjs      — Discord button HTTP endpoint (port 8710)
~/Lachlan/scripts/coach-chat-seed.cjs                 — dev helper to seed a draft for local UI work
~/Library/LaunchAgents/com.luke.coach-chat-weekly.plist
~/Library/LaunchAgents/com.luke.coach-chat-weak-skill.plist
~/Library/LaunchAgents/com.luke.coach-chat-autosend.plist
~/Library/LaunchAgents/com.luke.coach-chat-action-endpoint.plist
```

### Modified files

```
firestore.rules                                       — add rules for coachThreads/coachNotes/coachDrafts
firestore.indexes.json                                — composite indexes for (threadUid, createdAt) and (status, expiresAt)
components/layout/top-bar.tsx                         — add Coach Chat nav entry with unread badge
app/(authenticated)/home/page.tsx                     — mount CoachsNoteBlock
app/(authenticated)/dashboard/page.tsx                — add Drafts tab to TeacherView
```

---

## Task 1: Shared types

**Files:**
- Create: `types/coach.ts`

- [ ] **Step 1: Write types file**

```ts
// types/coach.ts
import type { Timestamp } from "firebase/firestore";

export type CoachTrigger =
  | "weekly"
  | "weak_skill"
  | "post_session"
  | "student_reply"
  | "luke_initiated";

export type CoachAuthor = "parker" | "luke" | "student";
export type CoachRole = "coach" | "student";
export type DraftStatus = "pending" | "approved" | "rejected" | "sent" | "expired";

export interface CoachThread {
  studentUid: string;
  lastActivityAt: Timestamp;
  unreadCountStudent: number;
  unreadCountCoach: number;
  wantsHumanCoach: boolean;
}

export interface CoachNote {
  id: string;
  threadUid: string;
  role: CoachRole;
  author: CoachAuthor;
  body: string;
  quotedPassage?: string;
  linkedSkill?: string;
  linkedCourse?: string;
  trigger: CoachTrigger;
  createdAt: Timestamp;
  readBy: { student?: Timestamp; luke?: Timestamp };
  status: "sent";
  lukeEdited: boolean;
}

export interface CoachDraft {
  id: string;
  threadUid: string;
  body: string;
  quotedPassage?: string;
  linkedSkill?: string;
  linkedCourse?: string;
  trigger: CoachTrigger;
  author: "parker";
  draftedAt: Timestamp;
  expiresAt: Timestamp;
  status: DraftStatus;
  approvedBy?: "luke" | "auto";
  rejectedReason?: string;
  lukeEdited: boolean;
}
```

- [ ] **Step 2: Verify it type-checks**

Run: `cd ~/pantherprep && npx tsc --noEmit -p tsconfig.json 2>&1 | grep "types/coach" || echo OK`
Expected: `OK`

- [ ] **Step 3: Commit**

```bash
git add types/coach.ts
git commit -m "feat(coach): add shared types for threads/notes/drafts"
```

---

## Task 2: Firestore security rules

**Files:**
- Modify: `firestore.rules`

- [ ] **Step 1: Read current rules to find the right place to insert**

Run: `grep -n "match /" firestore.rules | head`
Note the structure so the new match blocks are at the top level, not nested inside another `match /databases/{database}`.

- [ ] **Step 2: Append the three new match blocks inside the existing `match /databases/{database}/documents` block**

```
    match /coachThreads/{uid} {
      allow read: if request.auth != null && (request.auth.uid == uid || isTeacher());
      allow write: if false; // functions/scripts only via admin SDK
    }

    match /coachNotes/{noteId} {
      allow read: if request.auth != null && (resource.data.threadUid == request.auth.uid || isTeacher());
      allow create: if request.auth != null
        && request.resource.data.threadUid == request.auth.uid
        && request.resource.data.role == "student"
        && request.resource.data.author == "student"
        && request.resource.data.status == "sent";
      allow update, delete: if false;
    }

    match /coachDrafts/{draftId} {
      allow read: if request.auth != null && isTeacher();
      allow write: if request.auth != null && isTeacher();
    }
```

Insert after the existing `users`/`classes` rules, before the closing `}` of the outer match.

- [ ] **Step 3: Verify `isTeacher()` helper exists**

Run: `grep -n "function isTeacher" firestore.rules`

If it doesn't exist, add this helper at the top of the `match /databases/{database}/documents` block:

```
function isTeacher() {
  return request.auth != null
    && (request.auth.token.role == "teacher" || request.auth.token.role == "admin");
}
```

If role is not on the auth token, fall back to `get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ["teacher","admin"]` — check the existing rules for the pattern used elsewhere and match it.

- [ ] **Step 4: Deploy rules to Firestore**

Run: `firebase deploy --only firestore:rules`
Expected: `✔ firestore: released rules firestore.rules to cloud.firestore`

- [ ] **Step 5: Commit**

```bash
git add firestore.rules
git commit -m "feat(coach): firestore rules for threads/notes/drafts"
```

---

## Task 3: Firestore indexes

**Files:**
- Modify: `firestore.indexes.json`

- [ ] **Step 1: Read current index shape**

Run: `cat firestore.indexes.json | head -40`

Note top-level shape (`{ "indexes": [...], "fieldOverrides": [...] }`).

- [ ] **Step 2: Append two composite indexes**

```json
{
  "collectionGroup": "coachNotes",
  "queryScope": "COLLECTION",
  "fields": [
    { "fieldPath": "threadUid", "order": "ASCENDING" },
    { "fieldPath": "createdAt", "order": "DESCENDING" }
  ]
},
{
  "collectionGroup": "coachDrafts",
  "queryScope": "COLLECTION",
  "fields": [
    { "fieldPath": "status", "order": "ASCENDING" },
    { "fieldPath": "expiresAt", "order": "ASCENDING" }
  ]
}
```

- [ ] **Step 3: Deploy indexes**

Run: `firebase deploy --only firestore:indexes`
Expected: `✔ firestore: released indexes firestore.indexes.json to cloud.firestore`

Note: Firestore may take a few minutes to build indexes. Queries that need them will error until they're ready.

- [ ] **Step 4: Commit**

```bash
git add firestore.indexes.json
git commit -m "feat(coach): add composite indexes for notes + drafts"
```

---

## Task 4: Firestore client helpers

**Files:**
- Create: `lib/coach-chat.ts`

- [ ] **Step 1: Write the helper module**

```ts
// lib/coach-chat.ts
import {
  collection, doc, query, where, orderBy, limit as limitTo,
  onSnapshot, addDoc, getDoc, updateDoc, increment, serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { CoachNote, CoachThread } from "@/types/coach";

export function subscribeLatestNote(
  uid: string,
  onChange: (note: CoachNote | null) => void
): () => void {
  const q = query(
    collection(db, "coachNotes"),
    where("threadUid", "==", uid),
    orderBy("createdAt", "desc"),
    limitTo(1)
  );
  return onSnapshot(q, (snap) => {
    const docSnap = snap.docs[0];
    onChange(docSnap ? ({ id: docSnap.id, ...docSnap.data() } as CoachNote) : null);
  });
}

export function subscribeThreadNotes(
  uid: string,
  onChange: (notes: CoachNote[]) => void
): () => void {
  const q = query(
    collection(db, "coachNotes"),
    where("threadUid", "==", uid),
    orderBy("createdAt", "desc"),
    limitTo(50)
  );
  return onSnapshot(q, (snap) => {
    onChange(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as CoachNote));
  });
}

export function subscribeThread(
  uid: string,
  onChange: (thread: CoachThread | null) => void
): () => void {
  return onSnapshot(doc(db, "coachThreads", uid), (snap) => {
    onChange(snap.exists() ? (snap.data() as CoachThread) : null);
  });
}

export async function postStudentReply(
  uid: string,
  body: string
): Promise<void> {
  if (!body.trim()) return;
  await addDoc(collection(db, "coachNotes"), {
    threadUid: uid,
    role: "student",
    author: "student",
    body: body.trim(),
    trigger: "student_reply",
    createdAt: serverTimestamp(),
    readBy: {},
    status: "sent",
    lukeEdited: false,
  });
  await updateDoc(doc(db, "coachThreads", uid), {
    unreadCountCoach: increment(1),
    lastActivityAt: serverTimestamp(),
  }).catch(async () => {
    // thread doc doesn't exist yet; create it
    const { setDoc } = await import("firebase/firestore");
    await setDoc(doc(db, "coachThreads", uid), {
      studentUid: uid,
      lastActivityAt: serverTimestamp(),
      unreadCountStudent: 0,
      unreadCountCoach: 1,
      wantsHumanCoach: false,
    });
  });
}

export async function markNoteReadByStudent(noteId: string): Promise<void> {
  await updateDoc(doc(db, "coachNotes", noteId), {
    "readBy.student": serverTimestamp(),
  });
}

export async function resetStudentUnread(uid: string): Promise<void> {
  await updateDoc(doc(db, "coachThreads", uid), { unreadCountStudent: 0 }).catch(() => {});
}

export async function setWantsHumanCoach(uid: string, value: boolean): Promise<void> {
  await updateDoc(doc(db, "coachThreads", uid), { wantsHumanCoach: value }).catch(async () => {
    const { setDoc } = await import("firebase/firestore");
    await setDoc(doc(db, "coachThreads", uid), {
      studentUid: uid,
      lastActivityAt: serverTimestamp(),
      unreadCountStudent: 0,
      unreadCountCoach: 0,
      wantsHumanCoach: value,
    });
  });
}

export function formatRelative(ts: Timestamp | null | undefined): string {
  if (!ts) return "just now";
  const ms = Date.now() - ts.toMillis();
  const m = Math.floor(ms / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m} MINUTE${m === 1 ? "" : "S"} AGO`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} HOUR${h === 1 ? "" : "S"} AGO`;
  const d = Math.floor(h / 24);
  return `${d} DAY${d === 1 ? "" : "S"} AGO`;
}
```

- [ ] **Step 2: Build to confirm it compiles**

Run: `cd ~/pantherprep && npm run build 2>&1 | tail -5`
Expected: build passes, static export generates `out/`.

- [ ] **Step 3: Commit**

```bash
git add lib/coach-chat.ts
git commit -m "feat(coach): Firestore client helpers for coach chat"
```

---

## Task 5: Seed script for dev

**Files:**
- Create: `~/Lachlan/scripts/coach-chat-seed.cjs`

- [ ] **Step 1: Write the script**

```js
// ~/Lachlan/scripts/coach-chat-seed.cjs
// Usage: node ~/Lachlan/scripts/coach-chat-seed.cjs <studentUid>
// Seeds one sent note + one pending draft for UI development.

const path = require("path");
const os = require("os");
const admin = require(path.join(os.homedir(), "pantherlearn", "node_modules", "firebase-admin"));
if (!admin.apps.length) admin.initializeApp({ projectId: "pantherprep-a5a73" });
const db = admin.firestore();
const { FieldValue, Timestamp } = admin.firestore;

const uid = process.argv[2];
if (!uid) {
  console.error("Usage: node coach-chat-seed.cjs <studentUid>");
  process.exit(1);
}

async function main() {
  const now = Timestamp.now();
  const in24h = Timestamp.fromMillis(Date.now() + 24 * 3600 * 1000);

  // Thread
  await db.collection("coachThreads").doc(uid).set({
    studentUid: uid,
    lastActivityAt: now,
    unreadCountStudent: 1,
    unreadCountCoach: 0,
    wantsHumanCoach: false,
  }, { merge: true });

  // One sent note
  const note = await db.collection("coachNotes").add({
    threadUid: uid,
    role: "coach",
    author: "parker",
    body: "Watch your second-pass sign errors in multi-step algebra — the engine flagged four in a row. A five-second re-read drops that rate from 30% to 8%.",
    quotedPassage: "second-pass sign errors",
    linkedSkill: "linear_equations",
    linkedCourse: "sat-math",
    trigger: "weak_skill",
    createdAt: now,
    readBy: {},
    status: "sent",
    lukeEdited: false,
  });

  // One pending draft
  const draft = await db.collection("coachDrafts").add({
    threadUid: uid,
    body: "Nice work closing the gap on linear equations this week — accuracy jumped from 58% to 74%. Try a quick pass on systems next; those are where the next point-bump lives.",
    linkedSkill: "systems_of_equations",
    linkedCourse: "sat-math",
    trigger: "weekly",
    author: "parker",
    draftedAt: now,
    expiresAt: in24h,
    status: "pending",
    lukeEdited: false,
  });

  console.log(`seeded: thread=${uid} note=${note.id} draft=${draft.id}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
```

- [ ] **Step 2: Test it with qa-student**

Run: `node ~/Lachlan/scripts/coach-chat-seed.cjs $(node -e "console.log(require('fs').readFileSync(require('os').homedir()+'/Lachlan/memory/pantherlearn_qa_student.md','utf8').match(/uid[:\s]+([a-zA-Z0-9]+)/)[1])")`
Expected: `seeded: thread=... note=... draft=...` (if the uid is in memory; otherwise pass a known uid manually)

If the uid can't be extracted, run manually with any known test uid from Firebase Auth console.

- [ ] **Step 3: Inspect the seeded data**

Use Firebase console (https://console.firebase.google.com/project/pantherprep-a5a73/firestore) to verify the three docs exist with the expected fields.

- [ ] **Step 4: Commit**

```bash
# Seed script lives in Lachlan, not pantherprep
cd ~/Lachlan
git add scripts/coach-chat-seed.cjs
git commit -m "feat(coach): dev seed script for pantherprep coach chat"
```

---

## Task 6: CoachsNoteBlock component

**Files:**
- Create: `components/home/coachs-note-block.tsx`
- Modify: `app/(authenticated)/home/page.tsx`

- [ ] **Step 1: Write the component**

```tsx
// components/home/coachs-note-block.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import {
  subscribeLatestNote,
  markNoteReadByStudent,
  formatRelative,
} from "@/lib/coach-chat";
import type { CoachNote } from "@/types/coach";

const AUTHOR_LABEL: Record<string, string> = {
  parker: "Parker",
  luke: "Mr. McCarthy",
  student: "You",
};

export function CoachsNoteBlock() {
  const { user } = useAuth();
  const [note, setNote] = useState<CoachNote | null>(null);

  useEffect(() => {
    if (!user?.uid) return;
    return subscribeLatestNote(user.uid, setNote);
  }, [user?.uid]);

  useEffect(() => {
    if (note && !note.readBy?.student && note.role === "coach") {
      markNoteReadByStudent(note.id).catch(() => {});
    }
  }, [note?.id]);

  if (!note) return null;
  if (note.role !== "coach") return null; // only surface coach notes on home

  const when = formatRelative(note.createdAt);
  const authorLabel = AUTHOR_LABEL[note.author] ?? "Coach";

  return (
    <div className="relative border-2 border-ink bg-paper-card p-6 shadow-[5px_5px_0_var(--color-ink)]">
      <div className="absolute -top-[2px] left-0 right-0 h-1 bg-accent" />
      <div className="kicker mb-3">Coach&rsquo;s note</div>
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center border-2 border-ink bg-paper-card font-display text-sm font-bold text-ink">
          {note.author === "luke" ? "LM" : note.author === "parker" ? "P" : "–"}
        </div>
        <div className="flex-1">
          <p className="font-body text-[16px] leading-[1.6] text-ink">
            {note.quotedPassage ? (
              <>
                {"\u201C"}
                {note.body.split(note.quotedPassage).map((chunk, i, arr) => (
                  <span key={i}>
                    {chunk}
                    {i < arr.length - 1 && (
                      <em
                        className="text-accent"
                        style={{ fontStyle: "italic" }}
                      >
                        {note.quotedPassage}
                      </em>
                    )}
                  </span>
                ))}
                {"\u201D"}
              </>
            ) : (
              note.body
            )}
          </p>
          <div className="mt-3 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-ink-3">
            By {authorLabel} &middot; Lead coach &middot; {when}
          </div>
        </div>
        <div className="flex shrink-0 flex-col gap-2">
          <Link
            href="/coach-chat?focus=composer"
            className="border-2 border-ink bg-accent px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-accent-fg transition-colors hover:bg-ink"
          >
            Reply
          </Link>
          {note.linkedSkill && note.linkedCourse && (
            <Link
              href={`/skills/${note.linkedCourse}/${note.linkedSkill}`}
              className="border border-ink px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-ink transition-colors hover:bg-ink hover:text-paper"
            >
              Open skill
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Mount on home page**

Find the right location in `app/(authenticated)/home/page.tsx`. Look for where other home sections render (scoreboard, recent activity) and insert `<CoachsNoteBlock />` between scoreboard and recent activity.

Exact edit:

```tsx
// Near top of file, add import:
import { CoachsNoteBlock } from "@/components/home/coachs-note-block";

// In JSX, after the hero/scoreboard row, before "Recent activity":
<section className="mb-12">
  <CoachsNoteBlock />
</section>
```

(If the page has a different structure, place it wherever "Coach's note" appears in `design_handoff_campus_press/screens/01-home.png` — below the choose-a-test grid, above Recent activity.)

- [ ] **Step 3: Build + preview**

```bash
cd ~/pantherprep && npm run build 2>&1 | tail -5
```

Expected: build passes.

- [ ] **Step 4: Live smoke test (optional, requires seeded data)**

Start preview, log in as qa-student, visit `/home`, verify the Coach's Note block renders with the seeded note and reply button works.

- [ ] **Step 5: Commit**

```bash
git add components/home/coachs-note-block.tsx app/\(authenticated\)/home/page.tsx
git commit -m "feat(coach): home-page Coach's Note block"
```

---

## Task 7: Note card + thread view + composer

**Files:**
- Create: `components/coach-chat/note-card.tsx`
- Create: `components/coach-chat/composer.tsx`
- Create: `components/coach-chat/thread-view.tsx`

- [ ] **Step 1: Write the note-card component**

```tsx
// components/coach-chat/note-card.tsx
import Link from "next/link";
import type { CoachNote } from "@/types/coach";
import { formatRelative } from "@/lib/coach-chat";
import { cn } from "@/lib/utils";

const AUTHOR_LABEL: Record<string, string> = {
  parker: "Parker",
  luke: "Mr. McCarthy",
  student: "You",
};

export function NoteCard({ note, fresh }: { note: CoachNote; fresh?: boolean }) {
  const isStudent = note.role === "student";
  const when = formatRelative(note.createdAt);
  const authorLabel = AUTHOR_LABEL[note.author] ?? "Coach";

  return (
    <article
      className={cn(
        "border-2 p-5",
        isStudent
          ? "border-ink bg-ink text-paper ml-auto max-w-[80%]"
          : "border-ink bg-paper-card text-ink max-w-[85%]",
        fresh && !isStudent && "shadow-[5px_5px_0_var(--color-ink)]"
      )}
    >
      <div
        className={cn(
          "mb-2 font-mono text-[10px] font-bold uppercase tracking-[0.18em]",
          isStudent ? "text-paper/70" : "text-ink-3"
        )}
      >
        {authorLabel} &middot; {when}
      </div>
      <p className={cn("font-body text-[15px] leading-[1.55]", isStudent && "text-paper")}>
        {note.quotedPassage && !isStudent ? (
          <>
            {note.body.split(note.quotedPassage).map((chunk, i, arr) => (
              <span key={i}>
                {chunk}
                {i < arr.length - 1 && (
                  <em className="text-accent" style={{ fontStyle: "italic" }}>
                    {note.quotedPassage}
                  </em>
                )}
              </span>
            ))}
          </>
        ) : (
          note.body
        )}
      </p>
      {note.linkedSkill && note.linkedCourse && !isStudent && (
        <Link
          href={`/skills/${note.linkedCourse}/${note.linkedSkill}`}
          className="mt-3 inline-block border border-ink px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-ink transition-colors hover:bg-ink hover:text-paper"
        >
          Open skill &rarr;
        </Link>
      )}
    </article>
  );
}
```

- [ ] **Step 2: Write the composer component**

```tsx
// components/coach-chat/composer.tsx
"use client";

import { useState, forwardRef } from "react";
import { postStudentReply } from "@/lib/coach-chat";

export const Composer = forwardRef<HTMLTextAreaElement, { uid: string }>(
  function Composer({ uid }, ref) {
    const [body, setBody] = useState("");
    const [sending, setSending] = useState(false);

    async function submit() {
      if (!body.trim() || sending) return;
      setSending(true);
      try {
        await postStudentReply(uid, body);
        setBody("");
      } finally {
        setSending(false);
      }
    }

    return (
      <div className="border-2 border-ink bg-paper-card p-4">
        <textarea
          ref={ref}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Write back to your coach..."
          rows={3}
          className="w-full resize-none border-0 bg-transparent font-body text-[15px] leading-[1.5] text-ink placeholder:italic placeholder:text-ink-3 focus:outline-none"
          disabled={sending}
        />
        <div className="mt-3 flex items-center justify-end">
          <button
            onClick={submit}
            disabled={!body.trim() || sending}
            className="border-2 border-ink bg-accent px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-accent-fg transition-colors hover:bg-ink disabled:opacity-40"
          >
            {sending ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    );
  }
);
```

- [ ] **Step 3: Write the thread view**

```tsx
// components/coach-chat/thread-view.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import {
  subscribeThreadNotes,
  subscribeThread,
  resetStudentUnread,
} from "@/lib/coach-chat";
import { NoteCard } from "./note-card";
import { Composer } from "./composer";
import { HumanCoachToggle } from "./human-coach-toggle";
import type { CoachNote, CoachThread } from "@/types/coach";

export function ThreadView() {
  const { user } = useAuth();
  const [notes, setNotes] = useState<CoachNote[]>([]);
  const [thread, setThread] = useState<CoachThread | null>(null);
  const composerRef = useRef<HTMLTextAreaElement>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!user?.uid) return;
    const a = subscribeThreadNotes(user.uid, setNotes);
    const b = subscribeThread(user.uid, setThread);
    return () => { a(); b(); };
  }, [user?.uid]);

  useEffect(() => {
    if (user?.uid) resetStudentUnread(user.uid).catch(() => {});
  }, [user?.uid, notes.length]);

  useEffect(() => {
    if (searchParams?.get("focus") === "composer") {
      composerRef.current?.focus();
    }
  }, [searchParams]);

  if (!user?.uid) return null;

  return (
    <div className="mx-auto max-w-[720px] px-6 py-10">
      <header className="mb-8 border-b-2 border-ink pb-4">
        <div className="kicker mb-2">Coach&rsquo;s desk</div>
        <h1 className="font-display text-[clamp(40px,5vw,64px)] leading-[0.95] text-ink">
          Messages with your <em className="text-accent" style={{ fontStyle: "italic" }}>coach</em>.
        </h1>
      </header>

      {thread?.wantsHumanCoach && (
        <div className="mb-6 border-2 border-accent bg-accent-soft p-4">
          <div className="flex items-baseline justify-between">
            <div>
              <div className="kicker mb-1">Routed to Mr. McCarthy</div>
              <p className="font-body text-[14px] italic text-ink-2">
                Your replies will reach Mr. McCarthy directly. Parker won&rsquo;t auto-answer.
              </p>
            </div>
            <HumanCoachToggle uid={user.uid} value={true} />
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4">
        {notes.length === 0 && (
          <div className="border-2 border-rule-hair p-8 text-center">
            <div className="kicker mb-2">Quiet for now</div>
            <p className="font-body text-[14px] italic text-ink-2">
              Your coach will reach out after your next session. You can also write first.
            </p>
          </div>
        )}
        {notes.map((n, i) => (
          <NoteCard key={n.id} note={n} fresh={i === 0} />
        ))}
      </div>

      <div className="mt-8">
        <Composer ref={composerRef} uid={user.uid} />
        {!thread?.wantsHumanCoach && (
          <div className="mt-3 text-right">
            <HumanCoachToggle uid={user.uid} value={false} />
          </div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Build**

```bash
cd ~/pantherprep && npm run build 2>&1 | tail -5
```

Expected: passes (HumanCoachToggle will be missing — next task adds it; for this step, temporarily stub the import at the top: `const HumanCoachToggle = ({}: { uid: string; value: boolean }) => null;` and remove `from "./human-coach-toggle"`. Or just skip this verification and rely on the next task's build.)

- [ ] **Step 5: Commit (stub HumanCoachToggle inline if needed)**

```bash
git add components/coach-chat/
git commit -m "feat(coach): thread view, note card, composer"
```

---

## Task 8: Human coach toggle

**Files:**
- Create: `components/coach-chat/human-coach-toggle.tsx`
- Modify: `components/coach-chat/thread-view.tsx` (remove any stub)

- [ ] **Step 1: Write toggle component**

```tsx
// components/coach-chat/human-coach-toggle.tsx
"use client";

import { useState } from "react";
import { setWantsHumanCoach } from "@/lib/coach-chat";

export function HumanCoachToggle({ uid, value }: { uid: string; value: boolean }) {
  const [busy, setBusy] = useState(false);

  async function toggle() {
    if (busy) return;
    setBusy(true);
    try {
      await setWantsHumanCoach(uid, !value);
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={busy}
      className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-ink-3 underline decoration-dashed underline-offset-4 transition-colors hover:text-accent disabled:opacity-50"
    >
      {value ? "Cancel — let Parker answer" : "Want to talk to Mr. McCarthy directly? \u2192"}
    </button>
  );
}
```

- [ ] **Step 2: Build**

```bash
cd ~/pantherprep && npm run build 2>&1 | tail -5
```

Expected: passes.

- [ ] **Step 3: Commit**

```bash
git add components/coach-chat/human-coach-toggle.tsx
git commit -m "feat(coach): wantsHumanCoach toggle"
```

---

## Task 9: /coach-chat route

**Files:**
- Create: `app/(authenticated)/coach-chat/page.tsx`

- [ ] **Step 1: Write the route**

```tsx
// app/(authenticated)/coach-chat/page.tsx
"use client";

import { Suspense } from "react";
import { TopBar } from "@/components/layout/top-bar";
import { ThreadView } from "@/components/coach-chat/thread-view";

export default function CoachChatPage() {
  return (
    <div className="min-h-screen bg-paper">
      <TopBar backHref="/home" backLabel="Home" />
      <Suspense fallback={null}>
        <ThreadView />
      </Suspense>
    </div>
  );
}
```

- [ ] **Step 2: Build and verify the route was exported**

```bash
cd ~/pantherprep && npm run build 2>&1 | tail -5 && ls out/coach-chat/
```

Expected: `out/coach-chat/index.html` exists.

- [ ] **Step 3: Commit**

```bash
git add app/\(authenticated\)/coach-chat/page.tsx
git commit -m "feat(coach): /coach-chat route"
```

---

## Task 10: Nav update (Coach Chat entry + unread badge)

**Files:**
- Modify: `components/layout/top-bar.tsx`

- [ ] **Step 1: Add a hook for unread count**

Inside the TopBar component, add:

```tsx
import { useEffect, useState } from "react";
import { subscribeThread } from "@/lib/coach-chat";

// ... inside TopBar component body, after existing useAuth/usePathname:
const [unreadCoach, setUnreadCoach] = useState(0);
useEffect(() => {
  if (!user?.uid) return;
  return subscribeThread(user.uid, (t) => setUnreadCoach(t?.unreadCountStudent ?? 0));
}, [user?.uid]);
```

- [ ] **Step 2: Add the nav entry**

In the NavLink cluster (after `Progress`, before `Practice Test`), insert:

```tsx
<NavLink href="/coach-chat" active={pathname?.startsWith("/coach-chat")}>
  Coach Chat
  {unreadCoach > 0 && (
    <span className="ml-1 inline-block bg-accent px-1.5 text-[9px] text-accent-fg">
      {unreadCoach}
    </span>
  )}
</NavLink>
```

- [ ] **Step 3: Build + live smoke test**

```bash
cd ~/pantherprep && npm run build 2>&1 | tail -5
```

Expected: passes. Visit `/home` in preview → Coach Chat link visible with `(1)` badge if a note is unread.

- [ ] **Step 4: Commit**

```bash
git add components/layout/top-bar.tsx
git commit -m "feat(coach): Coach Chat nav entry with unread badge"
```

---

## Task 11: Teacher Drafts tab — pending subtab

**Files:**
- Create: `components/dashboard/draft-card.tsx`
- Create: `components/dashboard/drafts-tab.tsx`
- Modify: `app/(authenticated)/dashboard/page.tsx`

- [ ] **Step 1: Write the draft card component**

```tsx
// components/dashboard/draft-card.tsx
"use client";

import { useState, useEffect } from "react";
import { doc, updateDoc, addDoc, collection, deleteDoc, serverTimestamp, Timestamp, increment } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { CoachDraft } from "@/types/coach";
import { formatRelative } from "@/lib/coach-chat";

function countdown(expiresAt: Timestamp | null | undefined): string {
  if (!expiresAt) return "";
  const ms = expiresAt.toMillis() - Date.now();
  if (ms <= 0) return "AUTO-SEND NOW";
  const h = Math.floor(ms / 3600_000);
  const m = Math.floor((ms % 3600_000) / 60000);
  return `${h}h ${m}m to auto-send`;
}

export function DraftCard({ draft, studentName }: { draft: CoachDraft; studentName: string }) {
  const [body, setBody] = useState(draft.body);
  const [edited, setEdited] = useState(draft.lukeEdited);
  const [busy, setBusy] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState("");
  const [_, tick] = useState(0);

  useEffect(() => {
    const t = setInterval(() => tick((n) => n + 1), 60_000);
    return () => clearInterval(t);
  }, []);

  async function saveEdit() {
    if (body === draft.body && !edited) return;
    await updateDoc(doc(db, "coachDrafts", draft.id), {
      body,
      lukeEdited: true,
    });
    setEdited(true);
  }

  async function send(approvedBy: "luke" | "auto" = "luke") {
    if (busy) return;
    setBusy(true);
    try {
      if (body !== draft.body) await saveEdit();
      // Copy to coachNotes
      await addDoc(collection(db, "coachNotes"), {
        threadUid: draft.threadUid,
        role: "coach",
        author: edited || body !== draft.body ? "luke" : "parker",
        body,
        quotedPassage: draft.quotedPassage ?? null,
        linkedSkill: draft.linkedSkill ?? null,
        linkedCourse: draft.linkedCourse ?? null,
        trigger: draft.trigger,
        createdAt: serverTimestamp(),
        readBy: {},
        status: "sent",
        lukeEdited: edited || body !== draft.body,
      });
      // Update thread
      await updateDoc(doc(db, "coachThreads", draft.threadUid), {
        lastActivityAt: serverTimestamp(),
        unreadCountStudent: increment(1),
      }).catch(() => {});
      // Mark draft sent
      await updateDoc(doc(db, "coachDrafts", draft.id), {
        status: "sent",
        approvedBy,
      });
    } finally {
      setBusy(false);
    }
  }

  async function reject() {
    if (!reason.trim()) return;
    setBusy(true);
    try {
      await updateDoc(doc(db, "coachDrafts", draft.id), {
        status: "rejected",
        rejectedReason: reason.trim(),
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="border-2 border-ink bg-paper-card p-5 shadow-[5px_5px_0_var(--color-ink)]">
      <div className="mb-3 flex items-baseline justify-between border-b border-rule-hair pb-3">
        <div>
          <div className="kicker">{draft.trigger.replace("_", " ")}</div>
          <h3 className="mt-1 font-display text-[22px] leading-tight text-ink">{studentName}</h3>
        </div>
        <div className="text-right">
          <div className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-ink-3">
            Drafted {formatRelative(draft.draftedAt)}
          </div>
          <div className="mt-1 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-accent">
            {countdown(draft.expiresAt)}
          </div>
        </div>
      </div>

      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        onBlur={saveEdit}
        rows={4}
        className="w-full border border-rule-hair bg-paper p-3 font-body text-[15px] leading-[1.55] text-ink focus:border-ink focus:outline-none"
      />

      {draft.linkedSkill && (
        <div className="mt-2 inline-block border border-ink px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-ink">
          {draft.linkedCourse} &middot; {draft.linkedSkill}
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={() => send("luke")}
          disabled={busy}
          className="border-2 border-ink bg-accent px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-accent-fg transition-colors hover:bg-ink disabled:opacity-40"
        >
          Approve &amp; send
        </button>
        <button
          onClick={() => send("luke")}
          disabled={busy}
          className="border-2 border-ink bg-paper-card px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-ink transition-colors hover:bg-ink hover:text-paper disabled:opacity-40"
        >
          Send now
        </button>
        <button
          onClick={() => setRejecting(!rejecting)}
          disabled={busy}
          className="border border-ink px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-ink-3 hover:text-accent"
        >
          Reject
        </button>
      </div>

      {rejecting && (
        <div className="mt-3 border-t border-rule-hair pt-3">
          <input
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Reason..."
            className="w-full border border-ink bg-paper px-2 py-1 font-body text-[13px] text-ink focus:outline-none"
          />
          <button
            onClick={reject}
            disabled={!reason.trim() || busy}
            className="mt-2 border border-ink bg-ink px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-paper disabled:opacity-40"
          >
            Confirm reject
          </button>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Write the drafts tab**

```tsx
// components/dashboard/drafts-tab.tsx
"use client";

import { useEffect, useState } from "react";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { CoachDraft, CoachNote } from "@/types/coach";
import { DraftCard } from "./draft-card";

export function DraftsTab({ studentLookup }: { studentLookup: Record<string, string> }) {
  const [pending, setPending] = useState<CoachDraft[]>([]);
  const [sent, setSent] = useState<CoachNote[]>([]);
  const [sub, setSub] = useState<"pending" | "sent">("pending");

  useEffect(() => {
    const q = query(
      collection(db, "coachDrafts"),
      where("status", "==", "pending"),
      orderBy("expiresAt", "asc")
    );
    return onSnapshot(q, (snap) => {
      setPending(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as CoachDraft));
    });
  }, []);

  useEffect(() => {
    const q = query(
      collection(db, "coachNotes"),
      where("role", "==", "coach"),
      orderBy("createdAt", "desc")
    );
    return onSnapshot(q, (snap) => {
      setSent(snap.docs.slice(0, 30).map((d) => ({ id: d.id, ...d.data() }) as CoachNote));
    });
  }, []);

  return (
    <div>
      <div className="mb-6 flex gap-4 border-b-2 border-ink pb-2 font-mono text-[11px] font-bold uppercase tracking-[0.14em]">
        <button
          onClick={() => setSub("pending")}
          className={sub === "pending" ? "bg-ink px-2 py-1 text-paper" : "text-ink-2 hover:text-accent"}
        >
          Pending ({pending.length})
        </button>
        <button
          onClick={() => setSub("sent")}
          className={sub === "sent" ? "bg-ink px-2 py-1 text-paper" : "text-ink-2 hover:text-accent"}
        >
          Sent log
        </button>
      </div>

      {sub === "pending" && (
        <div className="flex flex-col gap-6">
          {pending.length === 0 && (
            <div className="border-2 border-rule-hair p-8 text-center font-body italic text-ink-3">
              No pending drafts. Parker is quiet.
            </div>
          )}
          {pending.map((d) => (
            <DraftCard
              key={d.id}
              draft={d}
              studentName={studentLookup[d.threadUid] ?? d.threadUid.slice(0, 8)}
            />
          ))}
        </div>
      )}

      {sub === "sent" && (
        <div className="border-2 border-ink bg-paper-card">
          <div className="divide-y divide-rule-hair">
            {sent.map((n) => (
              <div key={n.id} className="grid grid-cols-[1fr_auto] items-baseline gap-4 p-4">
                <div>
                  <div className="kicker mb-1">
                    {studentLookup[n.threadUid] ?? n.threadUid.slice(0, 8)} &middot; {n.author}
                    {n.lukeEdited && " (edited)"}
                  </div>
                  <p className="font-body text-[14px] leading-[1.5] text-ink">{n.body.slice(0, 200)}</p>
                </div>
                <div className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-ink-3">
                  {n.createdAt.toDate().toLocaleDateString()}
                </div>
              </div>
            ))}
            {sent.length === 0 && (
              <div className="p-8 text-center font-body italic text-ink-3">Nothing sent yet.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Wire into TeacherView**

In `app/(authenticated)/dashboard/page.tsx`, find the `TeacherView` component's tab handling. Add a new tab:

```tsx
// At top of file:
import { DraftsTab } from "@/components/dashboard/drafts-tab";

// In the TeacherView component, add "drafts" to the tab union type:
type TeacherTab = "overview" | "roster" | "drafts";

// In the tab nav:
<button onClick={() => setTab("drafts")} className={...}>Drafts</button>

// In the tab body:
{tab === "drafts" && (
  <DraftsTab studentLookup={Object.fromEntries(profiles.map((p) => [p.uid, p.displayName ?? p.uid]))} />
)}
```

Adjust the exact variable names to match the existing TeacherView structure.

- [ ] **Step 4: Build**

```bash
cd ~/pantherprep && npm run build 2>&1 | tail -5
```

Expected: passes.

- [ ] **Step 5: Deploy + smoke test**

```bash
firebase deploy --only hosting
```

Log in as Luke, visit `/dashboard`, click the Drafts tab. Confirm the seeded draft from Task 5 appears. Test: edit the body, approve it, verify it appears in Sent log and the student sees it.

- [ ] **Step 6: Commit**

```bash
git add components/dashboard/drafts-tab.tsx components/dashboard/draft-card.tsx app/\(authenticated\)/dashboard/page.tsx
git commit -m "feat(coach): teacher Drafts tab with approve/edit/reject/send"
```

---

## Task 12: Parker coach-draft skill

**Files:**
- Create: `~/Lachlan/.claude/skills/coach-draft/SKILL.md`
- Create: `~/Lachlan/.claude/skills/coach-draft/parker-coach-voice.md`

- [ ] **Step 1: Write the voice guide**

```markdown
# Parker — Coach Voice Guide

You are Parker, the AI coach for pantherprep students. Your job is to write short, direct, useful coaching notes to high school students preparing for the SAT, PSAT/NMSQT, or PSAT 8/9.

## Voice
- Warm but direct. No flattery, no "great job!" openers. Respect them.
- Dry, occasional wit. Never snarky.
- Specific over general. "Your second-pass sign errors in multi-step algebra" beats "work on algebra."
- Short. 2-3 sentences for routine notes, 4 max. Students don't read long messages.
- Never apologetic. Never "I hope this helps" or "Let me know if..."
- No emoji.

## Structure of a good note
1. Name the pattern (pull-quote worthy — that phrase becomes the italic red callout)
2. Say what the data shows
3. Give one concrete next action

## Examples

Good: "Watch your second-pass sign errors in multi-step algebra — the engine flagged four in a row. A five-second re-read drops that rate from 30% to 8%."

Good: "You closed the gap on linear equations this week — accuracy jumped from 58% to 74%. Systems of equations is the next point-bump."

Bad: "Great work this week! I noticed you've been working on algebra and wanted to check in..."

Bad: "Have you considered practicing more?"

## Escalation
If the student context suggests they are upset, confused about a life situation, demoralized, or asking for non-academic support, DO NOT draft. Return JSON: `{ "escalate": true, "reason": "..." }`. Luke will handle it.

Signs to escalate:
- Student reply mentions family, home, stress unrelated to test prep
- Performance drop that looks like disengagement rather than a skill gap (zero answers for 14+ days followed by sudden activity)
- Student reply is emotional or ambiguous
```

- [ ] **Step 2: Write the skill**

```markdown
---
name: coach-draft
description: Draft a pantherprep coach note for a specific student based on their recent activity. Writes the draft directly to Firestore coachDrafts collection.
---

# coach-draft

Draft one coach note for a pantherprep student and write it to Firestore as a pending draft.

## Arguments

- `--uid <studentUid>` — required
- `--trigger <weekly|weak_skill|post_session|student_reply>` — required
- `--skill <taxonomyKey>` — for weak_skill trigger
- `--course <courseId>` — paired with skill
- `--session <sessionId>` — for post_session

## Process

1. Read student context via firebase-admin:
   - `users/{uid}` — for first name (displayName)
   - `adaptiveProfile/{uid}` — for mastery snapshot
   - `performanceLog` last 10 answers filtered by skill when provided
   - `coachNotes` last 5 notes for voice continuity (don't repeat patterns)

2. Check dedupe: if any `coachDrafts` or `coachNotes` exist for `(uid, linkedSkill)` in last 5 days, skip (exit 0, log "skipped: duplicate").

3. Read voice guide: `~/Lachlan/.claude/skills/coach-draft/parker-coach-voice.md`.

4. Draft body + pull-quote. Decide if escalation is warranted; if so return without writing.

5. Write to `coachDrafts`:

```js
{
  threadUid: uid,
  body,
  quotedPassage,        // short phrase from body, 2-6 words
  linkedSkill,
  linkedCourse,
  trigger,
  author: "parker",
  draftedAt: now,
  expiresAt: now + 24h,
  status: "pending",
  lukeEdited: false
}
```

6. Log the draft id to stdout in JSON: `{ "draftId": "...", "skipped": false }` or `{ "skipped": true, "reason": "dedupe" }` or `{ "escalated": true, "reason": "..." }`.

## Firestore connection

Use firebase-admin from `~/pantherlearn/node_modules/firebase-admin`. Project: `pantherprep-a5a73`.

```js
const admin = require(path.join(os.homedir(), "pantherlearn", "node_modules", "firebase-admin"));
if (!admin.apps.length) admin.initializeApp({ projectId: "pantherprep-a5a73" });
```

## Constraints

- No paid API. All drafting happens in this Claude Code session.
- One draft per invocation.
- Never write to `coachNotes` directly — only to `coachDrafts`.
```

- [ ] **Step 3: Commit (in Lachlan repo)**

```bash
cd ~/Lachlan
git add .claude/skills/coach-draft/
git commit -m "feat(coach-draft): skill + voice guide for pantherprep coach chat"
```

---

## Task 13: Trigger engine

**Files:**
- Create: `~/Lachlan/scripts/coach-chat-trigger.cjs`

- [ ] **Step 1: Write the trigger engine**

```js
// ~/Lachlan/scripts/coach-chat-trigger.cjs
// Usage:
//   node coach-chat-trigger.cjs --mode weekly
//   node coach-chat-trigger.cjs --mode weak-skill
//   node coach-chat-trigger.cjs --mode post-session --uid U --session S
// The first two are cron-driven; post-session is invoked by a Firestore listener
// process or by the client writing to a queue doc (see autosend notes).
// For v1 we poll sessions every 5 min in weak-skill mode too, as a simpler
// substitute for a Firestore onWrite listener (which requires Cloud Functions).

const path = require("path");
const os = require("os");
const { execFileSync } = require("child_process");
const admin = require(path.join(os.homedir(), "pantherlearn", "node_modules", "firebase-admin"));
if (!admin.apps.length) admin.initializeApp({ projectId: "pantherprep-a5a73" });
const db = admin.firestore();
const { Timestamp } = admin.firestore;

const args = process.argv.slice(2);
const mode = args[args.indexOf("--mode") + 1];

const FIVE_DAYS_MS = 5 * 24 * 3600 * 1000;

async function invokeCoachDraft(uid, trigger, { skill, course, session } = {}) {
  // Invoke Claude Code in headless mode with the coach-draft skill.
  // `claude` CLI is on PATH (via the Claude Code app). We call it with a
  // one-shot prompt that instructs it to run the skill.
  const prompt = [
    `Run the coach-draft skill with:`,
    `- uid=${uid}`,
    `- trigger=${trigger}`,
    skill ? `- skill=${skill}` : null,
    course ? `- course=${course}` : null,
    session ? `- session=${session}` : null,
    `Write the draft and exit. No commentary.`,
  ].filter(Boolean).join("\n");

  try {
    const out = execFileSync("claude", ["--print", prompt], {
      timeout: 120_000,
      encoding: "utf8",
    });
    console.log(`[coach-draft] ${trigger} ${uid}:`, out.trim().slice(0, 200));
  } catch (e) {
    console.warn(`[coach-draft] failed for ${uid} (${trigger}):`, e.message);
  }
}

async function recentActivityUids(daysBack = 14) {
  const since = Timestamp.fromMillis(Date.now() - daysBack * 24 * 3600 * 1000);
  const snap = await db.collection("performanceLog")
    .where("timestamp", ">=", since)
    .select("uid")
    .get();
  const uids = new Set();
  snap.forEach((d) => uids.add(d.get("uid")));
  return [...uids].filter(Boolean);
}

async function recentStrugglingSkills(uid) {
  // Return list of {skill, course} pairs for skills where the last 5 answers
  // include at least 3 incorrect.
  const snap = await db.collection("performanceLog")
    .where("uid", "==", uid)
    .orderBy("timestamp", "desc")
    .limit(100)
    .get();
  const bySkill = {};
  snap.forEach((d) => {
    const { skill, course, correct } = d.data();
    if (!skill) return;
    const key = `${course}::${skill}`;
    if (!bySkill[key]) bySkill[key] = { skill, course, answers: [] };
    if (bySkill[key].answers.length < 5) bySkill[key].answers.push(correct);
  });
  return Object.values(bySkill).filter(
    (g) => g.answers.length === 5 && g.answers.filter((c) => !c).length >= 3
  );
}

async function isDuplicate(uid, skill) {
  const cutoff = Timestamp.fromMillis(Date.now() - FIVE_DAYS_MS);
  const notes = await db.collection("coachNotes")
    .where("threadUid", "==", uid)
    .where("linkedSkill", "==", skill)
    .where("createdAt", ">=", cutoff)
    .limit(1)
    .get();
  if (!notes.empty) return true;
  const drafts = await db.collection("coachDrafts")
    .where("threadUid", "==", uid)
    .where("linkedSkill", "==", skill)
    .where("status", "in", ["pending", "approved", "sent"])
    .where("draftedAt", ">=", cutoff)
    .limit(1)
    .get();
  return !drafts.empty;
}

async function runWeekly() {
  const uids = await recentActivityUids(14);
  console.log(`[weekly] ${uids.length} active students`);
  for (const uid of uids) {
    const thread = await db.collection("coachThreads").doc(uid).get();
    if (thread.data()?.wantsHumanCoach) continue;
    await invokeCoachDraft(uid, "weekly");
  }
}

async function runWeakSkill() {
  const uids = await recentActivityUids(3);
  console.log(`[weak-skill] scanning ${uids.length} recently active students`);
  for (const uid of uids) {
    const thread = await db.collection("coachThreads").doc(uid).get();
    if (thread.data()?.wantsHumanCoach) continue;
    const struggling = await recentStrugglingSkills(uid);
    for (const { skill, course } of struggling) {
      if (await isDuplicate(uid, skill)) continue;
      await invokeCoachDraft(uid, "weak_skill", { skill, course });
    }
  }
}

async function main() {
  if (mode === "weekly") await runWeekly();
  else if (mode === "weak-skill") await runWeakSkill();
  else if (mode === "post-session") {
    const uid = args[args.indexOf("--uid") + 1];
    const session = args[args.indexOf("--session") + 1];
    await invokeCoachDraft(uid, "post_session", { session });
  } else {
    console.error("Usage: --mode weekly|weak-skill|post-session");
    process.exit(1);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
```

- [ ] **Step 2: Test weekly mode with the seeded student**

Run: `node ~/Lachlan/scripts/coach-chat-trigger.cjs --mode weekly 2>&1 | head -30`

Expected: Claude CLI invoked, a new `coachDrafts` doc appears in Firestore.

If `claude` CLI isn't on PATH, find it via `which claude` or `ls ~/.claude-code/` and adjust the `execFileSync` call.

- [ ] **Step 3: Commit**

```bash
cd ~/Lachlan
git add scripts/coach-chat-trigger.cjs
git commit -m "feat(coach-trigger): weekly + weak-skill + post-session engine"
```

---

## Task 14: Post-session trigger (client-side dispatch)

**Files:**
- Modify: `lib/test-persistence.ts`

- [ ] **Step 1: Find the session write location**

Run: `grep -n "saveSession\|sessionId" lib/test-persistence.ts | head`

Note the line where `saveSession` or equivalent writes the session summary to Firestore.

- [ ] **Step 2: Add a queue write right after**

After the session doc is written, add a write to a `coachTriggerQueue` collection. The trigger engine polls this queue every 5 min (via launchd) and invokes coach-draft for each entry.

```ts
// After saveSession in completeTestSession:
try {
  const { db } = await import("@/lib/firebase");
  const { collection, addDoc, serverTimestamp } = await import("firebase/firestore");
  await addDoc(collection(db, "coachTriggerQueue"), {
    uid,
    trigger: "post_session",
    sessionId: testSessionId,
    queuedAt: serverTimestamp(),
    processed: false,
  });
} catch (e) {
  console.warn("coachTriggerQueue write failed:", e);
}
```

- [ ] **Step 3: Extend trigger engine to drain the queue**

Add a new mode `--mode drain-queue` in `coach-chat-trigger.cjs`:

```js
async function runDrainQueue() {
  const snap = await db.collection("coachTriggerQueue")
    .where("processed", "==", false)
    .orderBy("queuedAt", "asc")
    .limit(20)
    .get();
  for (const d of snap.docs) {
    const { uid, trigger, sessionId } = d.data();
    const thread = await db.collection("coachThreads").doc(uid).get();
    if (thread.data()?.wantsHumanCoach && trigger !== "student_reply") {
      await d.ref.update({ processed: true, skipped: "wantsHuman" });
      continue;
    }
    await invokeCoachDraft(uid, trigger, { session: sessionId });
    await d.ref.update({ processed: true });
  }
}
// Add to main():
else if (mode === "drain-queue") await runDrainQueue();
```

- [ ] **Step 4: Add Firestore rule for queue**

In `firestore.rules`, add:

```
match /coachTriggerQueue/{id} {
  allow create: if request.auth != null && request.resource.data.uid == request.auth.uid;
  allow read, update, delete: if false;
}
```

- [ ] **Step 5: Deploy rules + build**

```bash
cd ~/pantherprep && firebase deploy --only firestore:rules && npm run build 2>&1 | tail -5
```

- [ ] **Step 6: Commit**

```bash
cd ~/pantherprep
git add lib/test-persistence.ts firestore.rules
git commit -m "feat(coach): post-session trigger queue"

cd ~/Lachlan
git add scripts/coach-chat-trigger.cjs
git commit -m "feat(coach-trigger): drain-queue mode for post-session events"
```

---

## Task 15: Auto-send cron

**Files:**
- Create: `~/Lachlan/scripts/coach-chat-autosend.cjs`

- [ ] **Step 1: Write the auto-send script**

```js
// ~/Lachlan/scripts/coach-chat-autosend.cjs
const path = require("path");
const os = require("os");
const admin = require(path.join(os.homedir(), "pantherlearn", "node_modules", "firebase-admin"));
if (!admin.apps.length) admin.initializeApp({ projectId: "pantherprep-a5a73" });
const db = admin.firestore();
const { Timestamp, FieldValue } = admin.firestore;

async function main() {
  const now = Timestamp.now();
  const snap = await db.collection("coachDrafts")
    .where("status", "==", "pending")
    .where("expiresAt", "<=", now)
    .limit(50)
    .get();

  console.log(`[autosend] ${snap.size} drafts expired`);

  for (const d of snap.docs) {
    const draft = d.data();
    try {
      await db.collection("coachNotes").add({
        threadUid: draft.threadUid,
        role: "coach",
        author: draft.lukeEdited ? "luke" : "parker",
        body: draft.body,
        quotedPassage: draft.quotedPassage ?? null,
        linkedSkill: draft.linkedSkill ?? null,
        linkedCourse: draft.linkedCourse ?? null,
        trigger: draft.trigger,
        createdAt: now,
        readBy: {},
        status: "sent",
        lukeEdited: draft.lukeEdited,
      });
      await db.collection("coachThreads").doc(draft.threadUid).set({
        lastActivityAt: now,
        unreadCountStudent: FieldValue.increment(1),
      }, { merge: true });
      await d.ref.update({ status: "sent", approvedBy: "auto" });
      console.log(`[autosend] sent ${d.id} for ${draft.threadUid}`);
    } catch (e) {
      console.warn(`[autosend] failed ${d.id}:`, e.message);
    }
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
```

- [ ] **Step 2: Test with a backdated draft**

```bash
# Seed a draft that's already expired
node -e "
const admin = require(require('path').join(require('os').homedir(),'pantherlearn','node_modules','firebase-admin'));
if (!admin.apps.length) admin.initializeApp({projectId:'pantherprep-a5a73'});
const {Timestamp} = admin.firestore;
admin.firestore().collection('coachDrafts').add({
  threadUid: 'TEST_UID',
  body: 'test autosend',
  trigger: 'weekly',
  author: 'parker',
  draftedAt: Timestamp.now(),
  expiresAt: Timestamp.fromMillis(Date.now()-1000),
  status: 'pending',
  lukeEdited: false,
}).then(r=>console.log('seeded expired draft:',r.id));
"

# Run autosend
node ~/Lachlan/scripts/coach-chat-autosend.cjs
```

Expected: `[autosend] 1 drafts expired` then `[autosend] sent ...`. Verify the draft status flipped to `sent` and a `coachNotes` row exists.

- [ ] **Step 3: Clean up the test note**

```bash
# Optionally delete the test artifacts in Firebase console, or leave them since TEST_UID won't match any real student.
```

- [ ] **Step 4: Commit**

```bash
cd ~/Lachlan
git add scripts/coach-chat-autosend.cjs
git commit -m "feat(coach-autosend): 24h auto-send for expired drafts"
```

---

## Task 16: Discord webhook + action endpoint

**Files:**
- Create: `~/Lachlan/scripts/coach-chat-action-endpoint.cjs`
- Modify: `~/Lachlan/scripts/coach-chat-trigger.cjs` (add Discord post-draft hook)

- [ ] **Step 1: Create `#coach-chat` Discord channel (manual)**

Luke: create the channel in the Discord server, add a webhook via channel settings → Integrations → Webhooks, copy URL.

Store in `~/Lachlan/.env` as `DISCORD_COACH_CHAT_WEBHOOK=https://discord.com/api/webhooks/...`.

- [ ] **Step 2: Add Discord post in trigger engine**

In `coach-chat-trigger.cjs`, after a successful `invokeCoachDraft`, find the newly-written draft and post to Discord:

```js
async function postToDiscord(draftId, studentUid, body) {
  const url = process.env.DISCORD_COACH_CHAT_WEBHOOK;
  if (!url) return;
  const studentName = (await db.collection("users").doc(studentUid).get()).data()?.displayName ?? studentUid.slice(0, 8);
  const endpointBase = "http://localhost:8710";
  const msg = {
    embeds: [{
      title: `New coach draft for ${studentName}`,
      description: body.slice(0, 800),
      color: 0xbb4430,
      fields: [
        { name: "Actions", value: `[Approve](${endpointBase}/approve?id=${draftId}) · [Edit](https://pantherprep.web.app/dashboard?tab=drafts&draft=${draftId}) · [Reject](${endpointBase}/reject?id=${draftId}) · [Send now](${endpointBase}/send?id=${draftId})` },
      ],
    }],
  };
  await fetch(url, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(msg) });
}
```

Update `invokeCoachDraft` to read back the most-recent draft for that uid and call `postToDiscord`:

```js
async function invokeCoachDraft(uid, trigger, opts = {}) {
  // ... existing claude CLI invocation ...
  // After successful invocation, look up the draft:
  const snap = await db.collection("coachDrafts")
    .where("threadUid", "==", uid)
    .where("status", "==", "pending")
    .orderBy("draftedAt", "desc")
    .limit(1)
    .get();
  if (!snap.empty) {
    const d = snap.docs[0];
    await postToDiscord(d.id, uid, d.get("body"));
  }
}
```

- [ ] **Step 3: Write the action endpoint**

```js
// ~/Lachlan/scripts/coach-chat-action-endpoint.cjs
// A tiny HTTP server on localhost:8710 (Tailscale-accessible) that
// handles Discord button clicks. It updates Firestore; no auth because
// this is Tailscale-only + inbound from Luke's devices.

const http = require("http");
const url = require("url");
const path = require("path");
const os = require("os");
const admin = require(path.join(os.homedir(), "pantherlearn", "node_modules", "firebase-admin"));
if (!admin.apps.length) admin.initializeApp({ projectId: "pantherprep-a5a73" });
const db = admin.firestore();
const { Timestamp, FieldValue } = admin.firestore;

async function approveDraft(id, approvedBy = "luke") {
  const ref = db.collection("coachDrafts").doc(id);
  const snap = await ref.get();
  if (!snap.exists) return { ok: false, reason: "not found" };
  const draft = snap.data();
  if (draft.status !== "pending") return { ok: false, reason: `status=${draft.status}` };

  const now = Timestamp.now();
  await db.collection("coachNotes").add({
    threadUid: draft.threadUid,
    role: "coach",
    author: draft.lukeEdited ? "luke" : "parker",
    body: draft.body,
    quotedPassage: draft.quotedPassage ?? null,
    linkedSkill: draft.linkedSkill ?? null,
    linkedCourse: draft.linkedCourse ?? null,
    trigger: draft.trigger,
    createdAt: now,
    readBy: {},
    status: "sent",
    lukeEdited: draft.lukeEdited,
  });
  await db.collection("coachThreads").doc(draft.threadUid).set({
    lastActivityAt: now,
    unreadCountStudent: FieldValue.increment(1),
  }, { merge: true });
  await ref.update({ status: "sent", approvedBy });
  return { ok: true };
}

async function rejectDraft(id, reason = "no reason") {
  await db.collection("coachDrafts").doc(id).update({
    status: "rejected",
    rejectedReason: reason,
  });
  return { ok: true };
}

const server = http.createServer(async (req, res) => {
  const parsed = url.parse(req.url, true);
  const id = parsed.query.id;
  if (!id) {
    res.writeHead(400); res.end("missing id"); return;
  }
  try {
    if (parsed.pathname === "/approve" || parsed.pathname === "/send") {
      const r = await approveDraft(id, parsed.pathname === "/send" ? "luke" : "luke");
      res.writeHead(r.ok ? 200 : 400);
      res.end(r.ok ? "Approved. You can close this tab." : `Failed: ${r.reason}`);
    } else if (parsed.pathname === "/reject") {
      const r = await rejectDraft(id, parsed.query.reason ?? "rejected via discord");
      res.writeHead(200);
      res.end("Rejected. You can close this tab.");
    } else {
      res.writeHead(404); res.end("not found");
    }
  } catch (e) {
    console.error(e);
    res.writeHead(500); res.end("error");
  }
});

server.listen(8710, () => console.log("coach-chat-action-endpoint listening on :8710"));
```

- [ ] **Step 4: Smoke test the endpoint**

Start the server: `node ~/Lachlan/scripts/coach-chat-action-endpoint.cjs &`
Seed a draft with `coach-chat-seed.cjs` and capture its ID.
Visit: `curl 'http://localhost:8710/approve?id=<DRAFT_ID>'`
Expected: `Approved. You can close this tab.`
Verify Firestore shows the draft as `sent` and a `coachNotes` row exists.
Stop the server: `kill %1`.

- [ ] **Step 5: Commit**

```bash
cd ~/Lachlan
git add scripts/coach-chat-action-endpoint.cjs scripts/coach-chat-trigger.cjs
git commit -m "feat(coach): Discord webhook + action endpoint for approval"
```

---

## Task 17: launchd plists

**Files:**
- Create: `~/Library/LaunchAgents/com.luke.coach-chat-weekly.plist`
- Create: `~/Library/LaunchAgents/com.luke.coach-chat-weak-skill.plist`
- Create: `~/Library/LaunchAgents/com.luke.coach-chat-drain-queue.plist`
- Create: `~/Library/LaunchAgents/com.luke.coach-chat-autosend.plist`
- Create: `~/Library/LaunchAgents/com.luke.coach-chat-action-endpoint.plist`

- [ ] **Step 1: Write the weekly plist**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key><string>com.luke.coach-chat-weekly</string>
  <key>ProgramArguments</key>
  <array>
    <string>/usr/local/bin/node</string>
    <string>/Users/lukemccarthy/Lachlan/scripts/coach-chat-trigger.cjs</string>
    <string>--mode</string><string>weekly</string>
  </array>
  <key>StartCalendarInterval</key>
  <dict>
    <key>Weekday</key><integer>1</integer>
    <key>Hour</key><integer>9</integer>
    <key>Minute</key><integer>0</integer>
  </dict>
  <key>EnvironmentVariables</key>
  <dict><key>PATH</key><string>/usr/local/bin:/usr/bin:/bin</string></dict>
  <key>StandardOutPath</key><string>/tmp/coach-chat-weekly.log</string>
  <key>StandardErrorPath</key><string>/tmp/coach-chat-weekly.err</string>
</dict>
</plist>
```

- [ ] **Step 2: Write the weak-skill plist (every 10 min)**

Same shape as Step 1, with:
- Label: `com.luke.coach-chat-weak-skill`
- Args: `--mode weak-skill`
- Schedule: replace `StartCalendarInterval` with `<key>StartInterval</key><integer>600</integer>` (600 seconds = 10 min)
- Log paths: `/tmp/coach-chat-weak-skill.{log,err}`

- [ ] **Step 3: Write the drain-queue plist (every 5 min)**

Same shape:
- Label: `com.luke.coach-chat-drain-queue`
- Args: `--mode drain-queue`
- `StartInterval`: `300`
- Log paths: `/tmp/coach-chat-drain-queue.{log,err}`

- [ ] **Step 4: Write the autosend plist (every 5 min)**

- Label: `com.luke.coach-chat-autosend`
- Program: `coach-chat-autosend.cjs`
- `StartInterval`: `300`
- Log paths: `/tmp/coach-chat-autosend.{log,err}`

- [ ] **Step 5: Write the action endpoint plist (long-running)**

- Label: `com.luke.coach-chat-action-endpoint`
- Program: `coach-chat-action-endpoint.cjs`
- `KeepAlive`: `<true/>`
- `RunAtLoad`: `<true/>`
- No `StartInterval` (long-running process)

- [ ] **Step 6: Load each plist**

```bash
for f in com.luke.coach-chat-weekly com.luke.coach-chat-weak-skill com.luke.coach-chat-drain-queue com.luke.coach-chat-autosend com.luke.coach-chat-action-endpoint; do
  launchctl unload ~/Library/LaunchAgents/$f.plist 2>/dev/null
  launchctl load ~/Library/LaunchAgents/$f.plist
  echo "loaded $f"
done
launchctl list | grep coach-chat
```

Expected: all five listed with PID (or `-` for scheduled ones not yet fired) and no exit code.

- [ ] **Step 7: Verify logs stay clean**

Wait 10 minutes, then:

```bash
tail /tmp/coach-chat-*.err
```

Expected: empty or only `[info]` lines.

- [ ] **Step 8: Commit**

```bash
cd ~/Lachlan
# plist files aren't in the repo; tracked via docs
echo "Loaded 5 launchd agents on $(date)" >> references/infrastructure.md
git add references/infrastructure.md
git commit -m "docs(infra): coach-chat launchd agents loaded"
```

---

## Task 18: Skill registration

**Files:**
- Modify: `~/Lachlan/CLAUDE.md`
- Modify: `~/Lachlan/context/team.md`

- [ ] **Step 1: Add to CLAUDE.md Active Skills**

In the "Active Skills" section of `~/Lachlan/CLAUDE.md`, add:

```
- `coach-draft` — Drafts a pantherprep coach note for a student and writes it to Firestore coachDrafts. Invoked by the Mac mini trigger engine (weekly, weak-skill, post-session, student_reply).
```

- [ ] **Step 2: Add scheduled tasks to the Mac Mini table**

```
| Coach Chat — Weekly   | Mon 9:00 AM  | n/a (Discord #coach-chat)  | Red (#bb4430) |
| Coach Chat — Weak Skill | every 10 min | n/a (Discord #coach-chat) | Red (#bb4430) |
| Coach Chat — Drain Queue | every 5 min | n/a (Discord #coach-chat) | Red (#bb4430) |
| Coach Chat — Auto-send | every 5 min  | n/a (Discord #coach-chat)  | Red (#bb4430) |
```

- [ ] **Step 3: Add to team.md Skill Ownership**

```
| `coach-draft` (via trigger engine) | Kit (infra) + Parker (voice) |
```

- [ ] **Step 4: Commit**

```bash
cd ~/Lachlan
git add CLAUDE.md context/team.md
git commit -m "docs(coach): register coach-draft skill + scheduled tasks"
```

---

## Task 19: End-to-end smoke test

- [ ] **Step 1: Deploy pantherprep**

```bash
cd ~/pantherprep && firebase deploy --only hosting
```

- [ ] **Step 2: Log in as qa-student on pantherprep.web.app**

- Verify the home page shows the seeded Coach's Note block.
- Click **Reply** → lands on `/coach-chat` with composer focused.
- Type a reply, submit. Verify it appears inline as an inverted note.
- Verify `coachThreads/{qa-student-uid}.unreadCountCoach` incremented in Firestore.

- [ ] **Step 3: Log in as Luke**

- Visit `/dashboard` → Drafts tab.
- Verify the drain-queue cron invokes `coach-draft` for the qa-student reply within 5 min and a new draft appears.
- Edit the draft body, click **Approve & send**.
- Verify it ships, appears in Sent log, and qa-student sees it on next home visit.

- [ ] **Step 4: Toggle wantsHumanCoach**

- As qa-student, click the "Want to talk to Mr. McCarthy directly?" link.
- Verify `coachThreads/{uid}.wantsHumanCoach = true`.
- Submit another reply. Verify no auto-draft appears within 5 min. Discord `#coach-chat` should get a "Reply from qa-student — needs you" message.

- [ ] **Step 5: Test the 24h auto-send**

- Manually set a pending draft's `expiresAt` to a past timestamp.
- Wait for the next `coach-chat-autosend` cron fire (≤5 min).
- Verify it flips to `sent` and the student sees the note.

- [ ] **Step 6: Commit a CHANGELOG entry**

```bash
cd ~/pantherprep
echo -e "\n## 2026-04-19\n- Coach Chat v1 shipped: AI-first drafts with Luke approval queue, Discord + dashboard dispatch, 24h auto-send.\n" >> CHANGELOG.md 2>/dev/null || true
git add CHANGELOG.md 2>/dev/null || true
git commit -m "docs: Coach Chat v1 shipped" 2>/dev/null || true
```

---

## Self-review notes

- Every spec section (§1–§10) has at least one task implementing it. §2 user stories map to Tasks 6–11 (student surfaces) and 11, 16 (Luke surfaces). §3 architecture realized across all tasks. §4 data model in Task 1. §5 trigger engine in Tasks 13–14. §6 UI in Tasks 6–11. §7 approval in Tasks 11 and 16. §8 reply flow in Tasks 7, 14. §9 notifications in Tasks 10 (nav badge), 16 (Discord).
- §11 open questions: none at spec time.
- Dedupe (§5.1) implemented in `isDuplicate` (Task 13).
- Escalation (§5.3) called out in the skill prompt (Task 12).
- No placeholders flagged. The one deferred choice (Cloud Function vs Node listener for post-session) was resolved by going client-side queue (Task 14) — noted in spec §5, consistent with "simpler option" fallback.

