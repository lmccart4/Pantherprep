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

    // Self-demote: admin flipping themselves to non-admin. Confirm, then full
    // reload on success so the auth context re-reads role from Firestore and
    // AdminGuard redirects us away from /admin instead of holding stale state.
    const isSelfDemote = isSelf && currentRole === "admin" && next !== "admin";
    if (isSelfDemote) {
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
      if (isSelfDemote) {
        // Full reload forces auth-context to re-resolve role from Firestore.
        window.location.href = "/home";
        return;
      }
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
      aria-label={`Role for ${uid}`}
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
