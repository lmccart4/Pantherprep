# PantherPrep Admin Users Tab — Design Spec

**Date:** 2026-04-13
**Author:** Lachlan + Luke
**Status:** Approved for planning
**Scope:** ~1 day of implementation work

---

## Context

PantherPrep uses a role-based auth system (`student`, `teacher`, `admin`). The `<3 digits in email → teacher` heuristic in `lib/auth-utils.ts` auto-classifies most PAPS users correctly on first login. A prior fix (same day, 2026-04-13) wired the heuristic into the live auth flow via `contexts/auth-context.tsx` and persists the resolved role to Firestore on first resolution.

For the handful of exceptions — teachers whose emails have 3+ digits, students whose emails have <3 digits, test accounts needing deletion, or accidental misclassifications — manual edits in Firebase Console are currently the only path. This spec covers a minimum viable admin UI that removes that dependency.

## Goal

Let Luke (and future admins) manage user accounts without touching Firebase Console:

1. See every signed-up user and their current role
2. Flip any user's role (student ↔ teacher ↔ admin)
3. Delete accounts (test users, duplicates, etc.)
4. Spot new signups quickly

## Non-Goals

Explicit, to prevent scope creep:

- Classes admin tab
- Sessions / activity feed across users
- Metrics / analytics dashboard
- Question bank editor
- Email notifications on role change
- Audit log of admin actions
- Bulk edit / CSV import/export
- Anything student-facing

All of these can be added as separate tabs later without redesigning this one.

## Architecture

**Route:** `/admin` (new Next.js route under the `(authenticated)` layout)

**Access control (two layers):**
- **Client:** An `AdminGuard` component reads `role` from `useAuth()`, redirects non-admins to `/home`
- **Server:** Firestore security rules enforce admin-only writes to other users' `students/` docs, and admin-only list access

**Existing data model — no schema changes:**
- Reads: `students/` collection (existing)
- Writes: `setDoc(doc(db, 'students', uid), { role, updatedAt }, { merge: true })` — same pattern already used in `lib/firestore.ts`
- Deletes: `deleteDoc(doc(db, 'students', uid))`

**Security rules changes (required):**

Current state of [firestore.rules](../../../firestore.rules):
```
match /students/{userId} {
  allow read, create, update, delete: if request.auth != null && request.auth.uid == userId;
}
```

New rules needed:

```
function isAdminCaller() {
  return request.auth != null &&
         get(/databases/$(database)/documents/students/$(request.auth.uid)).data.role == 'admin';
}

match /students/{userId} {
  // Read: self OR admin. Firestore grants collection `list` when the
  // predicate is provably satisfied for every matched doc — `isAdminCaller()`
  // doesn't depend on `userId`, so admin `listAllUsers()` queries are allowed.
  allow read: if request.auth != null && (request.auth.uid == userId || isAdminCaller());
  allow create: if request.auth != null && request.auth.uid == userId;
  allow update: if request.auth != null && (request.auth.uid == userId || isAdminCaller());
  allow delete: if isAdminCaller();
}
```

**Important wrinkle:** The `isAdminCaller()` helper does a Firestore `get` on every rule evaluation, adding 1 read per admin action. Acceptable at our scale. Cache or switch to custom claims if we grow beyond a few admins.

## Component Structure

```
app/(authenticated)/admin/
├── page.tsx              // top-level, wraps AdminGuard → UsersTable
├── users-table.tsx       // main table with search, filters, actions
├── role-dropdown.tsx     // inline cell editor
└── delete-user-modal.tsx // type-to-confirm delete
```

**AdminGuard** (probably inline in `page.tsx`):
- Reads `{ role, loading }` from `useAuth()`
- While loading → show skeleton
- If not admin → `router.replace('/home')`
- If admin → render children

**UsersTable:**
- On mount: fetches `listAllUsers()` → local state
- Client-side search + filter chips + "new this week" toggle
- Renders rows with `RoleDropdown` + delete button
- Handles optimistic updates + error rollback

**RoleDropdown:**
- Controlled `<select>` with student/teacher/admin options
- On change: optimistic state update, async write, revert on error
- Disabled while write is in flight

**DeleteUserModal:**
- Confirmation modal with an input the user must fill with the exact email before the Confirm button is enabled
- On confirm: calls `deleteUser(uid)`, closes modal, emits success toast

**New helpers in `lib/firestore.ts`:**

```typescript
// Fetch all users (admin only). Ordered by updatedAt desc so new signups are top.
export async function listAllUsers(): Promise<(StudentProfile & { id: string })[]>;

// Flip a user's role. Merge-only — does not touch other fields.
export async function updateUserRole(uid: string, role: UserRole): Promise<void>;

// Hard delete a user's student doc. Does NOT cascade to classes — see Edge Cases.
export async function deleteUser(uid: string): Promise<void>;
```

## UI / Interaction Design

**Page layout:**

```
┌──────────────────────────────────────────────────────┐
│ TopBar                                               │
├──────────────────────────────────────────────────────┤
│ Admin — Users                                        │
│ 5 total · 4 teachers · 1 admin · 0 students          │
│                                                      │
│ [Search email or name...]  [All][Students][Teachers] │
│ [Admins]  [☐ New this week]                          │
│                                                      │
│ ┌────────────────────────────────────────────────┐   │
│ │ Email              Role      Last active Acts │   │
│ │ ─────────────────  ────────  ─────────── ──── │   │
│ │ jkroposky@paps.net [teacher] 2 days ago   [X] │   │
│ │ Janice Kroposky                                │   │
│ │ …                                              │   │
│ └────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────┘
```

**Table columns:**

| Column        | Source                            | Notes                                    |
|---------------|-----------------------------------|------------------------------------------|
| Email + name  | `email`, `displayName`            | Two-line stacked cell                    |
| Role          | `role` (falls back to `student`)  | Inline `RoleDropdown`                    |
| Last active   | `updatedAt`                       | Relative time ("2 days ago")             |
| Actions       | —                                 | Delete button with confirm modal         |

**Filters (all client-side):**
- Search box: matches `email` or `displayName`, case-insensitive, substring
- Role chips: `All` (default), `Students`, `Teachers`, `Admins`
- "New this week" toggle: filters to `updatedAt >= now - 7 days`

## Error Handling

| Situation                          | Behavior                                                    |
|------------------------------------|-------------------------------------------------------------|
| Non-admin hits `/admin`            | Silent redirect to `/home` (no error, no flash)             |
| Firestore `permission-denied` on write | Toast: "You don't have permission"; revert optimistic UI |
| Network error on role update       | Toast: "Failed to update role, try again"; revert           |
| Network error on delete            | Toast: "Failed to delete, try again"; row stays             |
| Admin list fetch fails             | Full-page error state with Retry button                     |
| Empty collection                   | "No users yet. As people sign in, they'll appear here."     |

## Edge Cases

1. **Admin deleting themselves:** Blocked. Delete button is disabled on the admin's own row, with a tooltip: "Can't delete your own account."

2. **Admin demoting themselves to teacher or student:** Allowed, but with a confirmation modal: "Demoting yourself will log you out of this admin panel. Continue?" — click Confirm → write happens → `useAuth()` re-reads role → `AdminGuard` redirects to `/home`.

3. **Deleting a user who owns classes:** Classes have `teacherUid` field. Deleted user's classes become orphaned (teacher no longer exists). For MVP: **leave them orphaned**. After delete, show a toast: "Deleted. This user owned N classes that are now orphaned." Class cleanup is a separate future feature.

4. **Deleting a student who joined classes:** Class docs have `students: string[]`. UID remains in the array. For MVP: **leave it**. Teacher class detail view must gracefully handle "student profile not found" cases.

5. **Concurrent admin edits:** Two admin tabs editing the same user. Last write wins. Acceptable at current scale.

6. **Search / filter scale:** Client-side filtering is fine up to ~1000 users. Revisit at 10k.

7. **Luke's hardcoded admin status:** `auth-utils.ts` hardcodes `lucamccarthy@paps.net` as admin regardless of Firestore role. His Firestore doc currently has `role: "teacher"` — the UI will show that, but his effective role is admin because of the hardcode. The Users tab should display the **effective** role, not the Firestore field. Either update Luke's Firestore to `role: "admin"` (one-time write) OR compute effective role in the table. **Decision: one-time update Luke's Firestore doc** to `role: "admin"` during implementation, then the table reads `role` directly without special-casing.

## Testing

Manual QA (no automated tests for this MVP):

1. **Access control:**
   - Sign in as Luke (admin) → `/admin` renders ✓
   - Sign in as a teacher → `/admin` redirects to `/home` ✓
   - Directly write `students/{otherUid}.role` from a non-admin session → Firestore rule denies ✓

2. **Role change:**
   - Flip a teacher to student → verify in Firestore console → refresh, persists
   - Flip back → verify
   - Self-demote admin → confirmation modal → continue → redirected to /home

3. **Delete:**
   - Delete a test account → removed from Firestore + table
   - Attempt to delete self → button disabled
   - Delete a user with classes → orphan warning toast appears

4. **Filters:**
   - Search matches partial email and name
   - Role chips filter correctly and update the header count
   - "New this week" toggle filters by `updatedAt`

5. **Post-deploy:** Run `/deploy-verify pantherprep "Admin users tab"` — Link + Pixel run integration + visual QA in parallel.

## Deployment

```bash
cd ~/pantherprep
npm run build
firebase deploy --only hosting,firestore:rules
```

Followed by `/deploy-verify pantherprep "Admin users tab"` for automated QA.

## Open Questions / Future Work

- **Audit log of admin actions:** who changed what, when. Not MVP; add when a real need appears (probably never for a 5-user platform).
- **Class cleanup on user delete:** cascading delete of orphaned classes. Separate decision.
- **Usage metrics dashboard:** separate feature.
- **Question bank admin:** separate feature, significantly bigger.
- **Admin UI for other collections:** sessions, progress, etc. — separate tabs, each a separate feature decision.

---

## Appendix — Files Touched

New:
- `app/(authenticated)/admin/page.tsx`
- `app/(authenticated)/admin/users-table.tsx`
- `app/(authenticated)/admin/role-dropdown.tsx`
- `app/(authenticated)/admin/delete-user-modal.tsx`

Modified:
- `lib/firestore.ts` — add `listAllUsers`, `updateUserRole`, `deleteUser`
- `firestore.rules` — add `isAdminCaller()` helper + admin access clauses

Data:
- One-time Firestore write: set `lucamccarthy@paps.net` → `role: "admin"` (align stored role with effective role)
