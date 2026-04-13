"use client";

import { useEffect, useState } from "react";
import { listAllUsers } from "@/lib/firestore";
import { GlassCard } from "@/components/ui/glass-card";
import type { StudentProfile } from "@/types/firestore";
import { RoleDropdown } from "./role-dropdown";
import { DeleteUserModal } from "./delete-user-modal";
import { useAuth } from "@/hooks/use-auth";
import type { UserRole } from "@/types/auth";

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
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "student" | "teacher" | "admin">("all");
  const [newThisWeek, setNewThisWeek] = useState(false);
  const { user: currentUser } = useAuth();
  const [deleteTarget, setDeleteTarget] = useState<UserRow | null>(null);

  useEffect(() => {
    listAllUsers()
      .then((rows) => setUsers(rows))
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  function applyRoleChange(uid: string, newRole: UserRole) {
    setUsers((prev) => prev.map((u) => (u.id === uid ? { ...u, role: newRole } : u)));
  }

  function handleDeleted(uid: string) {
    setUsers((prev) => prev.filter((u) => u.id !== uid));
  }

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
          aria-label="Search users"
          className="flex-1 min-w-[200px] rounded-radius-sm border border-border-default bg-bg-surface px-3 py-2 text-sm text-white outline-none focus:border-panther-red"
        />
        <button type="button" onClick={() => setRoleFilter("all")} className={chipClass(roleFilter === "all")}>All</button>
        <button type="button" onClick={() => setRoleFilter("student")} className={chipClass(roleFilter === "student")}>Students</button>
        <button type="button" onClick={() => setRoleFilter("teacher")} className={chipClass(roleFilter === "teacher")}>Teachers</button>
        <button type="button" onClick={() => setRoleFilter("admin")} className={chipClass(roleFilter === "admin")}>Admins</button>
        <label className="flex items-center gap-2 text-xs text-text-secondary">
          <input type="checkbox" checked={newThisWeek} onChange={(e) => setNewThisWeek(e.target.checked)} />
          New this week
        </label>
      </div>

      {filtered.length === 0 ? (
        <GlassCard>
          <p className="text-text-muted">
            {users.length === 0
              ? "No users yet. As people sign in, they\u2019ll appear here."
              : "No users match your filters."}
          </p>
        </GlassCard>
      ) : (
        <GlassCard className="overflow-x-auto p-0">
          <table className="w-full text-left text-sm" aria-label="Users">
            <thead className="border-b border-border-default text-xs uppercase tracking-wider text-text-muted">
              <tr>
                <th scope="col" className="px-4 py-3">User</th>
                <th scope="col" className="px-4 py-3">Role</th>
                <th scope="col" className="px-4 py-3">Last active</th>
                <th scope="col" className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id} className="border-b border-border-default/50 last:border-0">
                  <td className="px-4 py-3">
                    <div className="text-white">{u.email}</div>
                    <div className="text-xs text-text-muted">{u.displayName || "—"}</div>
                  </td>
                  <td className="px-4 py-3">
                    <RoleDropdown
                      uid={u.id}
                      currentRole={(u.role ?? "student") as UserRole}
                      isSelf={currentUser?.uid === u.id}
                      onChange={(next) => applyRoleChange(u.id, next)}
                    />
                  </td>
                  <td className="px-4 py-3 text-text-muted">{formatRelative(u.updatedAt)}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
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
                </tr>
              ))}
            </tbody>
          </table>
        </GlassCard>
      )}
      {deleteTarget && (
        <DeleteUserModal
          uid={deleteTarget.id}
          email={deleteTarget.email}
          onClose={() => setDeleteTarget(null)}
          onDeleted={handleDeleted}
        />
      )}
    </div>
  );
}
