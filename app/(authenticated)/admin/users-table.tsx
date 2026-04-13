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
