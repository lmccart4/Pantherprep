"use client";

import { useEffect, useState } from "react";
import {
  doc,
  updateDoc,
  addDoc,
  collection,
  setDoc,
  serverTimestamp,
  Timestamp,
  increment,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { CoachDraft } from "@/types/coach";
import { formatRelative } from "@/lib/coach-chat";

function countdown(expiresAt: Timestamp | null | undefined): string {
  if (!expiresAt) return "";
  const ms = expiresAt.toMillis() - Date.now();
  if (ms <= 0) return "AUTO-SEND IMMINENT";
  const h = Math.floor(ms / 3600_000);
  const m = Math.floor((ms % 3600_000) / 60000);
  return `${h}h ${m}m to auto-send`;
}

interface DraftCardProps {
  draft: CoachDraft;
  studentName: string;
}

export function DraftCard({ draft, studentName }: DraftCardProps) {
  const [body, setBody] = useState(draft.body);
  const [edited, setEdited] = useState(draft.lukeEdited);
  const [busy, setBusy] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState("");
  const [, tick] = useState(0);

  useEffect(() => {
    const t = setInterval(() => tick((n) => n + 1), 60_000);
    return () => clearInterval(t);
  }, []);

  async function saveEdit() {
    if (body === draft.body) return;
    await updateDoc(doc(db, "coachDrafts", draft.id), {
      body,
      lukeEdited: true,
    });
    setEdited(true);
  }

  async function send() {
    if (busy) return;
    setBusy(true);
    try {
      if (body !== draft.body) await saveEdit();
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
      await setDoc(
        doc(db, "coachThreads", draft.threadUid),
        {
          lastActivityAt: serverTimestamp(),
          unreadCountStudent: increment(1),
        },
        { merge: true }
      );
      await updateDoc(doc(db, "coachDrafts", draft.id), {
        status: "sent",
        approvedBy: "luke",
      });
    } finally {
      setBusy(false);
    }
  }

  async function reject() {
    if (!reason.trim() || busy) return;
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
      <div className="mb-3 flex items-baseline justify-between gap-4 border-b border-rule-hair pb-3">
        <div className="min-w-0">
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
          onClick={send}
          disabled={busy}
          className="border-2 border-ink bg-accent px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-accent-fg transition-colors hover:bg-ink disabled:opacity-40"
        >
          Approve &amp; send
        </button>
        <button
          onClick={() => setRejecting((v) => !v)}
          disabled={busy}
          className="border border-ink px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-ink-3 hover:text-accent disabled:opacity-40"
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
