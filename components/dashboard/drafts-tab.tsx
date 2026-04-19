"use client";

import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  limit as limitTo,
  onSnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { CoachDraft, CoachNote } from "@/types/coach";
import { DraftCard } from "./draft-card";

interface DraftsTabProps {
  studentLookup: Record<string, string>;
}

export function DraftsTab({ studentLookup }: DraftsTabProps) {
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
      setPending(snap.docs.map((d) => ({ id: d.id, ...d.data() } as CoachDraft)));
    });
  }, []);

  useEffect(() => {
    const q = query(
      collection(db, "coachNotes"),
      where("role", "==", "coach"),
      orderBy("createdAt", "desc"),
      limitTo(30)
    );
    return onSnapshot(q, (snap) => {
      setSent(snap.docs.map((d) => ({ id: d.id, ...d.data() } as CoachNote)));
    });
  }, []);

  function nameFor(uid: string) {
    return studentLookup[uid] ?? uid.slice(0, 8);
  }

  return (
    <div>
      <div className="mb-6 flex gap-4 border-b-2 border-ink pb-2 font-mono text-[11px] font-bold uppercase tracking-[0.14em]">
        <button
          onClick={() => setSub("pending")}
          className={
            sub === "pending" ? "bg-ink px-3 py-1.5 text-paper" : "px-3 py-1.5 text-ink-2 hover:text-accent"
          }
        >
          Pending ({pending.length})
        </button>
        <button
          onClick={() => setSub("sent")}
          className={
            sub === "sent" ? "bg-ink px-3 py-1.5 text-paper" : "px-3 py-1.5 text-ink-2 hover:text-accent"
          }
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
            <DraftCard key={d.id} draft={d} studentName={nameFor(d.threadUid)} />
          ))}
        </div>
      )}

      {sub === "sent" && (
        <div className="border-2 border-ink bg-paper-card">
          <div className="divide-y divide-rule-hair">
            {sent.length === 0 && (
              <div className="p-8 text-center font-body italic text-ink-3">Nothing sent yet.</div>
            )}
            {sent.map((n) => (
              <div key={n.id} className="grid grid-cols-[1fr_auto] items-baseline gap-4 p-4">
                <div className="min-w-0">
                  <div className="kicker mb-1">
                    {nameFor(n.threadUid)} &middot; {n.author}
                    {n.lukeEdited && " (edited)"}
                  </div>
                  <p className="font-body text-[14px] leading-[1.5] text-ink">
                    {n.body.length > 200 ? `${n.body.slice(0, 200)}...` : n.body}
                  </p>
                </div>
                <div className="shrink-0 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-ink-3">
                  {n.createdAt?.toDate ? n.createdAt.toDate().toLocaleDateString() : ""}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
