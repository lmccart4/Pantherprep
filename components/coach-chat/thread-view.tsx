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
    const unsubNotes = subscribeThreadNotes(user.uid, setNotes);
    const unsubThread = subscribeThread(user.uid, setThread);
    return () => {
      unsubNotes();
      unsubThread();
    };
  }, [user?.uid]);

  useEffect(() => {
    if (!user?.uid) return;
    if ((thread?.unreadCountStudent ?? 0) > 0) {
      resetStudentUnread(user.uid).catch(() => {});
    }
  }, [user?.uid, thread?.unreadCountStudent]);

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
          Messages with your{" "}
          <em className="text-accent" style={{ fontStyle: "italic" }}>
            coach
          </em>
          .
        </h1>
      </header>

      {thread?.wantsHumanCoach && (
        <div className="mb-6 border-2 border-accent bg-accent-soft p-4">
          <div className="flex items-start justify-between gap-4">
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
