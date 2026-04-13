# Admin Users Tab Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a minimum viable admin UI at `/admin` so Luke can manage user roles and delete accounts without touching Firebase Console.

**Architecture:** Single Next.js App Router page with a client-side AdminGuard, one users table fetched from the existing `students/` Firestore collection, inline role dropdown with optimistic updates, and a type-to-confirm delete modal. No new collections, no new types. Admin authority is enforced both client-side (redirect) and server-side (Firestore rules via an `isAdmin()` helper).

**Tech Stack:** Next.js 15 (App Router), React 19, Firebase Auth + Firestore, Tailwind CSS v4. Existing `GlassCard`, `TopBar`, `useAuth()` primitives.

**Source spec:** [2026-04-13-admin-users-tab-design.md](../specs/2026-04-13-admin-users-tab-design.md)

---

## Pre-flight

There are uncommitted changes from the 2026-04-13 auth heuristic fix (`contexts/auth-context.tsx`). Commit or stash those before starting Task 1. They are prerequisites — the admin UI relies on `resolveUserRole` using the heuristic.

**Verification substrate:** PantherPrep has no test framework (only `lint` and `build`). This plan uses:

- `npx tsc --noEmit` for type safety
- `npm run lint` for style / correctness
- `npm run build` for full Next.js compile
- Manual browser verification for interactive flows
- `/deploy-verify pantherprep` post-deploy QA via Link + Pixel

Where a step says "verify", run the appropriate command and confirm exit 0 / expected UI state before moving on.

---

## File Structure

**Created:**

```
app/(authenticated)/admin/
├── page.tsx              // AdminGuard + page shell (default export)
├── users-table.tsx       // Main table, data fetch, filters, actions
├── role-dropdown.tsx     // Inline role editor with optimistic update
└── delete-user-modal.tsx // Type-to-confirm deletion
```

**Modified:**

- `lib/firestore.ts` — add `listAllUsers()`, `updateUserRole()`, `deleteUser()`
- `firestore.rules` — add `isAdmin()` helper, grant admin write to `students/{uid}`

**Scripts (one-off, not committed to `app/`):**

- `scripts/backfill-admin-role.cjs` — one-time write to align Luke's Firestore `role` field with his effective admin status

---

## Task 1: Update and deploy Firestore rules

**Why first:** Admin writes to other users' `students/` docs will fail until the rules allow them. Deploying rules is idempotent and only adds permissions (never tightens), so it's safe to ship before any code.

**Files:**
- Modify: `firestore.rules`

- [ ] **Step 1: Add `isAdmin()` helper beneath the existing `isTeacher()` helper**

Edit `firestore.rules`. After the existing `isTeacher()` function (around line 81), add:

```
    // Helper: check if user has admin role via students collection
    function isAdmin(uid) {
      return exists(/databases/$(database)/documents/students/$(uid)) &&
        get(/databases/$(database)/documents/students/$(uid)).data.role == "admin";
    }
```

- [ ] **Step 2: Extend `students/{uid}` write access to admins**

Replace the existing `match /students/{uid}` block (lines 10-13):

```
    match /students/{uid} {
      allow read: if isPapsUser();
      allow write: if request.auth != null && request.auth.uid == uid;
    }
```

with:

```
    match /students/{uid} {
      allow read: if isPapsUser();
      // Self-access OR admin access. `write` covers create/update/delete.
      allow write: if request.auth != null && (
        request.auth.uid == uid || isAdmin(request.auth.uid)
      );
    }
```

- [ ] **Step 3: Verify rules file compiles locally**

Run: `cd ~/pantherprep && cat firestore.rules | head -20 && cat firestore.rules | tail -20`
Expected: file has the new `isAdmin` function and updated `match /students/{uid}` block. No other changes.

- [ ] **Step 4: Deploy rules**

Run: `cd ~/pantherprep && firebase deploy --only firestore:rules`
Expected: `✔ Deploy complete!`

- [ ] **Step 5: Commit**

```bash
cd ~/pantherprep
git add firestore.rules
git commit -m "chore(rules): allow admin writes to students/{uid}"
```

---

## Task 2: Backfill Luke's admin role in Firestore

**Why:** `auth-utils.ts` hardcodes `lucamccarthy@paps.net` as admin regardless of Firestore value, but his stored `role` is `"teacher"`. The admin UI reads the Firestore value directly — without this backfill, the table would show him as "teacher" and the delete/demote logic would treat him as one.

**Files:**
- Create: `scripts/backfill-admin-role.cjs`

- [ ] **Step 1: Create the backfill script**

Write this file at `scripts/backfill-admin-role.cjs`:

```javascript
// One-time script: set lucamccarthy@paps.net's role field to "admin".
// Idempotent — safe to re-run.
const admin = require('firebase-admin');
if (!admin.apps.length) admin.initializeApp({ projectId: 'pantherprep-a5a73' });
const db = admin.firestore();

(async () => {
  const snap = await db.collection('students')
    .where('email', '==', 'lucamccarthy@paps.net')
    .get();

  if (snap.empty) {
    console.error('No student doc found for lucamccarthy@paps.net');
    process.exit(1);
  }

  for (const doc of snap.docs) {
    const before = doc.data().role;
    await doc.ref.set({ role: 'admin' }, { merge: true });
    const after = (await doc.ref.get()).data().role;
    console.log(`${doc.data().email}: role ${JSON.stringify(before)} → ${JSON.stringify(after)}`);
  }

  process.exit(0);
})().catch((e) => { console.error(e.message); process.exit(1); });
```

- [ ] **Step 2: Run the backfill**

Run: `cd ~/pantherprep && node scripts/backfill-admin-role.cjs`
Expected:
```
lucamccarthy@paps.net: role "teacher" → "admin"
```

- [ ] **Step 3: Verify in Firestore**

Run:
```bash
cd ~/pantherprep && node -e "
const admin = require('firebase-admin');
if (!admin.apps.length) admin.initializeApp({ projectId: 'pantherprep-a5a73' });
admin.firestore().collection('students')
  .where('email', '==', 'lucamccarthy@paps.net')
  .get()
  .then(s => { s.docs.forEach(d => console.log(d.data().email, '=>', d.data().role)); process.exit(0); });
"
```
Expected: `lucamccarthy@paps.net => admin`

- [ ] **Step 4: Commit**

```bash
cd ~/pantherprep
git add scripts/backfill-admin-role.cjs
git commit -m "chore(data): backfill admin role for lucamccarthy@paps.net"
```

---

## Task 3: Add Firestore helpers

**Files:**
- Modify: `lib/firestore.ts` (add exports at the end of the "Student Profiles" section)

- [ ] **Step 1: Add the three helpers**

Open `lib/firestore.ts`. Find the end of the `updateStudentProfile` function (around line 38). Immediately after it, add:

```typescript
// ── Admin helpers ──

import type { UserRole } from "@/types/auth";

export async function listAllUsers(): Promise<(StudentProfile & { id: string })[]> {
  const snap = await getDocs(
    query(collection(db, "students"), orderBy("updatedAt", "desc"))
  );
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as StudentProfile) }));
}

export async function updateUserRole(uid: string, role: UserRole): Promise<void> {
  await setDoc(
    doc(db, "students", uid),
    { role, updatedAt: serverTimestamp() },
    { merge: true }
  );
}

export async function deleteUser(uid: string): Promise<void> {
  await deleteDoc(doc(db, "students", uid));
}
```

**Note:** The `UserRole` import should go at the top with the other imports. Move the import line to join the existing imports rather than leaving it inline. The finished top-of-file import block should include:

```typescript
import type {
  StudentProfile,
  Session,
  ProgressDoc,
  ClassDoc,
  CustomQuestion,
} from "@/types/firestore";
import type { UserRole } from "@/types/auth";
```

- [ ] **Step 2: Typecheck**

Run: `cd ~/pantherprep && npx tsc --noEmit`
Expected: exit 0.

- [ ] **Step 3: Lint**

Run: `cd ~/pantherprep && npm run lint`
Expected: no errors in `lib/firestore.ts`.

- [ ] **Step 4: Commit**

```bash
cd ~/pantherprep
git add lib/firestore.ts
git commit -m "feat(firestore): add listAllUsers, updateUserRole, deleteUser helpers"
```

---

## Task 4: Admin route shell with AdminGuard

**Files:**
- Create: `app/(authenticated)/admin/page.tsx`

- [ ] **Step 1: Create the page shell**

Write `app/(authenticated)/admin/page.tsx`:

```tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { TopBar } from "@/components/layout/top-bar";
import { GlassCard } from "@/components/ui/glass-card";

export default function AdminPage() {
  const { role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && role !== "admin") {
      router.replace("/home");
    }
  }, [loading, role, router]);

  if (loading || role !== "admin") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-[72px] w-[72px] animate-[pulse-opacity_1.5s_infinite]">
          <img
            src="/apple-touch-icon.png"
            alt="Loading..."
            className="h-full w-full rounded-xl object-contain"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <TopBar />
      <main className="mx-auto max-w-6xl px-6 pb-16 pt-24">
        <h1 className="mb-2 text-3xl font-bold text-white">Admin — Users</h1>
        <p className="mb-8 text-sm text-text-muted">Manage user roles and accounts.</p>
        <GlassCard>
          <p className="text-text-muted">Users table loads here…</p>
        </GlassCard>
      </main>
    </div>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `cd ~/pantherprep && npx tsc --noEmit`
Expected: exit 0.

- [ ] **Step 3: Dev test**

Run: `cd ~/pantherprep && npm run dev` (background) — navigate to `http://localhost:3000/admin` signed in as Luke.
Expected: see "Admin — Users" heading and placeholder card.
Also test: sign out, sign in as a non-admin (or temporarily flip Luke's role to teacher in Firestore), navigate to `/admin` → redirected to `/home`.
Kill the dev server.

- [ ] **Step 4: Commit**

```bash
cd ~/pantherprep
git add app/\(authenticated\)/admin/page.tsx
git commit -m "feat(admin): route shell + AdminGuard redirect"
```

---

## Task 5: Users table — fetch and render read-only

**Files:**
- Create: `app/(authenticated)/admin/users-table.tsx`
- Modify: `app/(authenticated)/admin/page.tsx`

- [ ] **Step 1: Create users-table.tsx (read-only)**

Write `app/(authenticated)/admin/users-table.tsx`:

```tsx
"use client";

import { useEffect, useState } from "react";
import { listAllUsers } from "@/lib/firestore";
import { GlassCard } from "@/components/ui/glass-card";
import type { StudentProfile } from "@/types/firestore";

type UserRow = StudentProfile & { id: string };

function formatRelative(ts: unknown): string {
  if (!ts || typeof ts !== "object" || !("toDate" in ts)) return "—";
  const date = (ts as { toDate: () => Date }).toDate();
  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay > 0) return `${diffDay}d ago`;
  if (diffHr > 0) return `${diffHr}h ago`;
  if (diffMin > 0) return `${diffMin}m ago`;
  return "just now";
}

export function UsersTable() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listAllUsers()
      .then((rows) => setUsers(rows))
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <GlassCard><p className="text-text-muted">Loading users…</p></GlassCard>;
  if (error) return <GlassCard><p className="text-accent-red">Error: {error}</p></GlassCard>;
  if (users.length === 0) {
    return <GlassCard><p className="text-text-muted">No users yet. As people sign in, they&apos;ll appear here.</p></GlassCard>;
  }

  const counts = {
    total: users.length,
    students: users.filter((u) => (u.role ?? "student") === "student").length,
    teachers: users.filter((u) => u.role === "teacher").length,
    admins: users.filter((u) => u.role === "admin").length,
  };

  return (
    <div>
      <p className="mb-4 text-sm text-text-muted">
        {counts.total} total · {counts.teachers} teachers · {counts.admins} admins · {counts.students} students
      </p>
      <GlassCard className="overflow-x-auto p-0">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border-default text-xs uppercase tracking-wider text-text-muted">
            <tr>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Last active</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-border-default/50 last:border-0">
                <td className="px-4 py-3">
                  <div className="text-white">{u.email}</div>
                  <div className="text-xs text-text-muted">{u.displayName || "—"}</div>
                </td>
                <td className="px-4 py-3 text-text-secondary">{u.role ?? "student"}</td>
                <td className="px-4 py-3 text-text-muted">{formatRelative(u.updatedAt)}</td>
                <td className="px-4 py-3 text-right text-text-muted">—</td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>
    </div>
  );
}
```

- [ ] **Step 2: Wire UsersTable into page.tsx**

Edit `app/(authenticated)/admin/page.tsx`. Replace:

```tsx
        <GlassCard>
          <p className="text-text-muted">Users table loads here…</p>
        </GlassCard>
```

with:

```tsx
        <UsersTable />
```

And add the import at the top:

```tsx
import { UsersTable } from "./users-table";
```

- [ ] **Step 3: Typecheck + lint**

Run: `cd ~/pantherprep && npx tsc --noEmit && npm run lint`
Expected: exit 0 on both.

- [ ] **Step 4: Dev test**

Run: `cd ~/pantherprep && npm run dev` — navigate to `/admin` as Luke.
Expected: table renders with 4 rows (jkroposky, lucamccarthy, elizalvarado, lucischnetzer), counts header shows "4 total · 3 teachers · 1 admin · 0 students".
Kill the dev server.

- [ ] **Step 5: Commit**

```bash
cd ~/pantherprep
git add app/\(authenticated\)/admin/users-table.tsx app/\(authenticated\)/admin/page.tsx
git commit -m "feat(admin): render users table (read-only)"
```

---

## Task 6: Search and filter controls

**Files:**
- Modify: `app/(authenticated)/admin/users-table.tsx`

- [ ] **Step 1: Add filter state and derived list**

In `users-table.tsx`, replace the entire `UsersTable` component body with:

```tsx
export function UsersTable() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "student" | "teacher" | "admin">("all");
  const [newThisWeek, setNewThisWeek] = useState(false);

  useEffect(() => {
    listAllUsers()
      .then((rows) => setUsers(rows))
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <GlassCard><p className="text-text-muted">Loading users…</p></GlassCard>;
  if (error) return <GlassCard><p className="text-accent-red">Error: {error}</p></GlassCard>;

  const counts = {
    total: users.length,
    students: users.filter((u) => (u.role ?? "student") === "student").length,
    teachers: users.filter((u) => u.role === "teacher").length,
    admins: users.filter((u) => u.role === "admin").length,
  };

  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const filtered = users.filter((u) => {
    if (roleFilter !== "all" && (u.role ?? "student") !== roleFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      const match =
        u.email?.toLowerCase().includes(q) ||
        (u.displayName ?? "").toLowerCase().includes(q);
      if (!match) return false;
    }
    if (newThisWeek) {
      const ts = u.updatedAt as unknown as { toDate?: () => Date } | undefined;
      if (!ts?.toDate) return false;
      if (ts.toDate().getTime() < weekAgo) return false;
    }
    return true;
  });

  const chipClass = (active: boolean) =>
    `rounded-radius-sm px-3 py-1.5 text-xs transition-colors ${
      active
        ? "bg-panther-red text-white"
        : "border border-border-default text-text-secondary hover:border-border-light"
    }`;

  return (
    <div>
      <p className="mb-4 text-sm text-text-muted">
        {counts.total} total · {counts.teachers} teachers · {counts.admins} admins · {counts.students} students
      </p>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search email or name…"
          className="flex-1 min-w-[200px] rounded-radius-sm border border-border-default bg-bg-surface px-3 py-2 text-sm text-white outline-none focus:border-panther-red"
        />
        <button onClick={() => setRoleFilter("all")} className={chipClass(roleFilter === "all")}>All</button>
        <button onClick={() => setRoleFilter("student")} className={chipClass(roleFilter === "student")}>Students</button>
        <button onClick={() => setRoleFilter("teacher")} className={chipClass(roleFilter === "teacher")}>Teachers</button>
        <button onClick={() => setRoleFilter("admin")} className={chipClass(roleFilter === "admin")}>Admins</button>
        <label className="flex items-center gap-2 text-xs text-text-secondary">
          <input type="checkbox" checked={newThisWeek} onChange={(e) => setNewThisWeek(e.target.checked)} />
          New this week
        </label>
      </div>

      {filtered.length === 0 ? (
        <GlassCard><p className="text-text-muted">No users match your filters.</p></GlassCard>
      ) : (
        <GlassCard className="overflow-x-auto p-0">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border-default text-xs uppercase tracking-wider text-text-muted">
              <tr>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Last active</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id} className="border-b border-border-default/50 last:border-0">
                  <td className="px-4 py-3">
                    <div className="text-white">{u.email}</div>
                    <div className="text-xs text-text-muted">{u.displayName || "—"}</div>
                  </td>
                  <td className="px-4 py-3 text-text-secondary">{u.role ?? "student"}</td>
                  <td className="px-4 py-3 text-text-muted">{formatRelative(u.updatedAt)}</td>
                  <td className="px-4 py-3 text-right text-text-muted">—</td>
                </tr>
              ))}
            </tbody>
          </table>
        </GlassCard>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Typecheck + lint**

Run: `cd ~/pantherprep && npx tsc --noEmit && npm run lint`
Expected: exit 0 on both.

- [ ] **Step 3: Dev test**

Run: `cd ~/pantherprep && npm run dev` — navigate to `/admin`.
Expected:
- Typing "luca" in the search filters to 2 rows (lucamccarthy, lucischnetzer)
- Clicking "Admins" chip shows 1 row (Luke)
- Clicking "Teachers" shows 3 rows
- "New this week" checkbox narrows based on `updatedAt`
Kill the dev server.

- [ ] **Step 4: Commit**

```bash
cd ~/pantherprep
git add app/\(authenticated\)/admin/users-table.tsx
git commit -m "feat(admin): search + role filter chips + new-this-week toggle"
```

---

## Task 7: Role dropdown with optimistic updates and self-demote guard

**Files:**
- Create: `app/(authenticated)/admin/role-dropdown.tsx`
- Modify: `app/(authenticated)/admin/users-table.tsx`

- [ ] **Step 1: Create role-dropdown.tsx**

Write `app/(authenticated)/admin/role-dropdown.tsx`:

```tsx
"use client";

import { useState } from "react";
import { updateUserRole } from "@/lib/firestore";
import type { UserRole } from "@/types/auth";

interface RoleDropdownProps {
  uid: string;
  currentRole: UserRole;
  isSelf: boolean;
  onChange: (newRole: UserRole) => void;
}

export function RoleDropdown({ uid, currentRole, isSelf, onChange }: RoleDropdownProps) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(false);

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value as UserRole;
    if (next === currentRole) return;

    // Self-demote guard: admin flipping themselves to non-admin
    if (isSelf && currentRole === "admin" && next !== "admin") {
      const ok = window.confirm(
        "Demoting yourself will log you out of this admin panel. Continue?"
      );
      if (!ok) {
        e.target.value = currentRole;
        return;
      }
    }

    setSaving(true);
    setError(false);
    const previous = currentRole;
    onChange(next); // optimistic
    try {
      await updateUserRole(uid, next);
    } catch {
      setError(true);
      onChange(previous); // revert
      setTimeout(() => setError(false), 3000);
    } finally {
      setSaving(false);
    }
  }

  return (
    <select
      value={currentRole}
      onChange={handleChange}
      disabled={saving}
      className={`rounded-radius-sm border bg-bg-surface px-2 py-1 text-xs text-white outline-none focus:border-panther-red ${
        error ? "border-accent-red" : "border-border-default"
      } ${saving ? "opacity-50" : ""}`}
    >
      <option value="student">student</option>
      <option value="teacher">teacher</option>
      <option value="admin">admin</option>
    </select>
  );
}
```

- [ ] **Step 2: Wire dropdown into users-table.tsx**

In `users-table.tsx`:

1. Add the import at the top:

```tsx
import { RoleDropdown } from "./role-dropdown";
import { useAuth } from "@/hooks/use-auth";
import type { UserRole } from "@/types/auth";
```

2. Inside `UsersTable()`, below the existing state, add:

```tsx
  const { user: currentUser } = useAuth();
```

3. Add a handler that updates the local `users` array when a row's role changes:

```tsx
  function applyRoleChange(uid: string, newRole: UserRole) {
    setUsers((prev) => prev.map((u) => (u.id === uid ? { ...u, role: newRole } : u)));
  }
```

4. Replace the role cell in the table row:

```tsx
<td className="px-4 py-3 text-text-secondary">{u.role ?? "student"}</td>
```

with:

```tsx
                  <td className="px-4 py-3">
                    <RoleDropdown
                      uid={u.id}
                      currentRole={(u.role ?? "student") as UserRole}
                      isSelf={currentUser?.uid === u.id}
                      onChange={(next) => applyRoleChange(u.id, next)}
                    />
                  </td>
```

- [ ] **Step 3: Typecheck + lint**

Run: `cd ~/pantherprep && npx tsc --noEmit && npm run lint`
Expected: exit 0.

- [ ] **Step 4: Dev test**

Run: `cd ~/pantherprep && npm run dev` — navigate to `/admin`.
Expected:
- Each row has a role dropdown
- Change one teacher (NOT yourself) to student → dropdown flashes, persists on refresh
- Change it back → persists
- Try to change your own role from admin → confirmation modal appears; Cancel reverts; Confirm saves + redirects you off /admin
- If you test the self-demote happy path, restore yourself via: `node scripts/backfill-admin-role.cjs`
Kill the dev server.

- [ ] **Step 5: Commit**

```bash
cd ~/pantherprep
git add app/\(authenticated\)/admin/role-dropdown.tsx app/\(authenticated\)/admin/users-table.tsx
git commit -m "feat(admin): inline role dropdown with optimistic updates + self-demote guard"
```

---

## Task 8: Delete user modal

**Files:**
- Create: `app/(authenticated)/admin/delete-user-modal.tsx`
- Modify: `app/(authenticated)/admin/users-table.tsx`

- [ ] **Step 1: Create delete-user-modal.tsx**

Write `app/(authenticated)/admin/delete-user-modal.tsx`:

```tsx
"use client";

import { useState } from "react";
import { deleteUser } from "@/lib/firestore";

interface DeleteUserModalProps {
  uid: string;
  email: string;
  onClose: () => void;
  onDeleted: (uid: string) => void;
}

export function DeleteUserModal({ uid, email, onClose, onDeleted }: DeleteUserModalProps) {
  const [typed, setTyped] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const confirmed = typed.trim().toLowerCase() === email.toLowerCase();

  async function handleDelete() {
    if (!confirmed) return;
    setDeleting(true);
    setError(null);
    try {
      await deleteUser(uid);
      onDeleted(uid);
      onClose();
    } catch (e) {
      setError((e as Error).message);
      setDeleting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={onClose}
    >
      <div
        className="glass-card w-full max-w-md p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-2 text-lg font-semibold text-white">Delete user</h2>
        <p className="mb-4 text-sm text-text-secondary">
          This permanently deletes the student profile for <span className="font-mono text-white">{email}</span>.
          Any classes this user owns will become orphaned.
        </p>
        <p className="mb-2 text-xs text-text-muted">Type the email to confirm:</p>
        <input
          type="text"
          value={typed}
          onChange={(e) => setTyped(e.target.value)}
          placeholder={email}
          className="mb-4 w-full rounded-radius-sm border border-border-default bg-bg-surface px-3 py-2 text-sm text-white outline-none focus:border-panther-red"
          autoFocus
        />
        {error && <p className="mb-3 text-xs text-accent-red">{error}</p>}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            disabled={deleting}
            className="rounded-radius-sm border border-border-default px-4 py-2 text-xs text-text-secondary hover:border-border-light"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={!confirmed || deleting}
            className={`rounded-radius-sm px-4 py-2 text-xs font-semibold text-white transition-colors ${
              confirmed && !deleting
                ? "bg-accent-red hover:bg-accent-red/90"
                : "bg-accent-red/30 cursor-not-allowed"
            }`}
          >
            {deleting ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Wire delete button and modal into users-table.tsx**

In `users-table.tsx`:

1. Add import at the top:

```tsx
import { DeleteUserModal } from "./delete-user-modal";
```

2. Inside `UsersTable()`, add state for the modal:

```tsx
  const [deleteTarget, setDeleteTarget] = useState<UserRow | null>(null);
```

3. Add a handler for removing the row after successful delete:

```tsx
  function handleDeleted(uid: string) {
    setUsers((prev) => prev.filter((u) => u.id !== uid));
  }
```

4. Replace the actions cell:

```tsx
<td className="px-4 py-3 text-right text-text-muted">—</td>
```

with:

```tsx
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => setDeleteTarget(u)}
                      disabled={currentUser?.uid === u.id}
                      title={currentUser?.uid === u.id ? "Can't delete your own account" : "Delete user"}
                      className={`rounded-radius-sm px-2 py-1 text-xs transition-colors ${
                        currentUser?.uid === u.id
                          ? "text-text-muted/40 cursor-not-allowed"
                          : "text-accent-red hover:bg-accent-red/10"
                      }`}
                    >
                      Delete
                    </button>
                  </td>
```

5. At the very end of the returned JSX (just before the closing `</div>` of the outer wrapper), add:

```tsx
      {deleteTarget && (
        <DeleteUserModal
          uid={deleteTarget.id}
          email={deleteTarget.email}
          onClose={() => setDeleteTarget(null)}
          onDeleted={handleDeleted}
        />
      )}
```

- [ ] **Step 3: Typecheck + lint**

Run: `cd ~/pantherprep && npx tsc --noEmit && npm run lint`
Expected: exit 0 on both.

- [ ] **Step 4: Dev test**

Run: `cd ~/pantherprep && npm run dev` — navigate to `/admin`.
Expected:
- Each row has a Delete button; your own row's button is disabled with a tooltip
- Click Delete on a non-self row → modal appears
- Confirm button is disabled until you type the full email
- Type the email → Confirm enables → click → row disappears + doc is gone from Firestore
- If you accidentally delete a real user, recreate them by signing in as them again (they'll get a fresh student doc via home/page.tsx)
- For safe testing: create a throwaway test doc manually, then delete via the UI
Kill the dev server.

- [ ] **Step 5: Commit**

```bash
cd ~/pantherprep
git add app/\(authenticated\)/admin/delete-user-modal.tsx app/\(authenticated\)/admin/users-table.tsx
git commit -m "feat(admin): delete user modal with type-to-confirm + self-delete block"
```

---

## Task 9: Build, deploy, verify

**Files:**
- None modified (deployment only)

- [ ] **Step 1: Clean typecheck and lint**

Run: `cd ~/pantherprep && npx tsc --noEmit && npm run lint`
Expected: exit 0 on both.

- [ ] **Step 2: Production build**

Run: `cd ~/pantherprep && npm run build`
Expected: `Compiled successfully` and a `/admin` route appearing in the Next.js build output.

- [ ] **Step 3: Deploy hosting (rules already deployed in Task 1)**

Run: `cd ~/pantherprep && firebase deploy --only hosting`
Expected: `✔ Deploy complete!` and the live hosting URL.

- [ ] **Step 4: Smoke test production**

Visit `https://pantherprep.web.app/admin` signed in as Luke.
Expected: the users table loads with 4 rows, role dropdown works, delete is disabled for Luke's row, all filters work.
Also verify: sign in as a non-admin (or use a private window with a teacher account) — `/admin` redirects to `/home`.

- [ ] **Step 5: Run /deploy-verify**

Run (from Lachlan): `/deploy-verify pantherprep "Admin users tab — role management, delete, filters"`
Expected: Link integration check + Pixel visual QA both PASS. If either fails, read the report, fix, redeploy, re-verify.

- [ ] **Step 6: Log to Mission Control + mark task complete**

Run:
```bash
node ~/Lachlan/projects/mission-control/log-activity.cjs lachlan "PantherPrep admin users tab shipped — role edit + delete + filters at /admin"
```

---

## Appendix — Rollback

If anything goes wrong after deploy:

1. **Rules regression:** `git checkout HEAD~N firestore.rules && firebase deploy --only firestore:rules` (where N is commits since Task 1).
2. **UI regression:** `git revert <commit-sha>` for each task commit, in reverse order, then `npm run build && firebase deploy --only hosting`.
3. **Admin doc lost:** Re-run `node scripts/backfill-admin-role.cjs`.
4. **Accidentally deleted real user:** They'll re-create their profile on next sign-in via `home/page.tsx:96`. No data loss unless they have session/progress records keyed to their old uid (which they do not — Firebase Auth keeps the same uid on re-sign-in).
