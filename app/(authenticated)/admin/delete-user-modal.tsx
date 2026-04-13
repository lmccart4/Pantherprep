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
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-user-modal-title"
    >
      <div
        className="glass-card w-full max-w-md p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="delete-user-modal-title" className="mb-2 text-lg font-semibold text-white">
          Delete user
        </h2>
        <p className="mb-4 text-sm text-text-secondary">
          This permanently deletes the student profile for{" "}
          <span className="font-mono text-white">{email}</span>.
          Any classes this user owns will become orphaned.
        </p>
        <p className="mb-2 text-xs text-text-muted">Type the email to confirm:</p>
        <input
          type="text"
          value={typed}
          onChange={(e) => setTyped(e.target.value)}
          placeholder={email}
          aria-label="Confirm email"
          className="mb-4 w-full rounded-radius-sm border border-border-default bg-bg-surface px-3 py-2 text-sm text-white outline-none focus:border-panther-red"
          autoFocus
        />
        {error && <p className="mb-3 text-xs text-accent-red">{error}</p>}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            className="rounded-radius-sm border border-border-default px-4 py-2 text-xs text-text-secondary hover:border-border-light"
          >
            Cancel
          </button>
          <button
            type="button"
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
