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

function renderBody(note: CoachNote) {
  const { body, quotedPassage } = note;
  if (!quotedPassage || !body.includes(quotedPassage)) {
    return <>&ldquo;{body}&rdquo;</>;
  }
  const parts = body.split(quotedPassage);
  return (
    <>
      &ldquo;
      {parts.map((chunk, i) => (
        <span key={i}>
          {chunk}
          {i < parts.length - 1 && (
            <em className="text-accent" style={{ fontStyle: "italic" }}>
              {quotedPassage}
            </em>
          )}
        </span>
      ))}
      &rdquo;
    </>
  );
}

export function CoachsNoteBlock() {
  const { user } = useAuth();
  const [note, setNote] = useState<CoachNote | null>(null);

  useEffect(() => {
    if (!user?.uid) return;
    return subscribeLatestNote(user.uid, setNote);
  }, [user?.uid]);

  useEffect(() => {
    if (note && note.role === "coach" && !note.readBy?.student) {
      markNoteReadByStudent(note.id).catch(() => {});
    }
  }, [note?.id, note?.role, note?.readBy?.student]);

  if (!note || note.role !== "coach") return null;

  const when = formatRelative(note.createdAt).toUpperCase();
  const authorLabel = AUTHOR_LABEL[note.author] ?? "Coach";
  const initials =
    note.author === "luke" ? "LM" : note.author === "parker" ? "P" : "—";

  return (
    <div className="relative border-2 border-ink bg-paper-card p-6 shadow-[5px_5px_0_var(--color-ink)]">
      <div className="absolute -top-[2px] left-0 right-0 h-1 bg-accent" />
      <div className="kicker mb-4">Coach&rsquo;s note</div>
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center border-2 border-ink bg-paper-card font-display text-sm font-bold text-ink">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-body text-[16px] leading-[1.6] text-ink">{renderBody(note)}</p>
          <div className="mt-3 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-ink-3">
            By {authorLabel} &middot; Lead coach &middot; {when}
          </div>
        </div>
        <div className="flex shrink-0 flex-col gap-2">
          <Link
            href="/coach-chat?focus=composer"
            className="border-2 border-ink bg-accent px-3 py-1.5 text-center font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-accent-fg transition-colors hover:bg-ink"
          >
            Reply
          </Link>
          {note.linkedSkill && note.linkedCourse && (
            <Link
              href={`/skills/${note.linkedCourse}/${note.linkedSkill}`}
              className="border border-ink px-3 py-1.5 text-center font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-ink transition-colors hover:bg-ink hover:text-paper"
            >
              Open skill
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
