import Link from "next/link";
import type { CoachNote } from "@/types/coach";
import { formatRelative } from "@/lib/coach-chat";
import { cn } from "@/lib/utils";

const AUTHOR_LABEL: Record<string, string> = {
  parker: "Parker",
  luke: "Mr. McCarthy",
  student: "You",
};

function renderBody(note: CoachNote, inverted: boolean) {
  const { body, quotedPassage } = note;
  if (!quotedPassage || !body.includes(quotedPassage) || inverted) {
    return <>{body}</>;
  }
  const parts = body.split(quotedPassage);
  return (
    <>
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
    </>
  );
}

export function NoteCard({ note, fresh }: { note: CoachNote; fresh?: boolean }) {
  const isStudent = note.role === "student";
  const when = formatRelative(note.createdAt).toUpperCase();
  const authorLabel = AUTHOR_LABEL[note.author] ?? "Coach";

  return (
    <article
      className={cn(
        "border-2 p-5",
        isStudent
          ? "ml-auto max-w-[80%] border-ink bg-ink text-paper"
          : "max-w-[88%] border-ink bg-paper-card text-ink",
        fresh && !isStudent && "shadow-[5px_5px_0_var(--color-ink)]"
      )}
    >
      <div
        className={cn(
          "mb-2 font-mono text-[10px] font-bold uppercase tracking-[0.18em]",
          isStudent ? "text-paper/70" : "text-ink-3"
        )}
      >
        {authorLabel} &middot; {when}
      </div>
      <p
        className={cn(
          "font-body text-[15px] leading-[1.55]",
          isStudent && "text-paper"
        )}
      >
        {renderBody(note, isStudent)}
      </p>
      {note.linkedSkill && note.linkedCourse && !isStudent && (
        <Link
          href={`/skills/${note.linkedCourse}/${note.linkedSkill}`}
          className="mt-3 inline-block border border-ink px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-ink transition-colors hover:bg-ink hover:text-paper"
        >
          Open skill &rarr;
        </Link>
      )}
    </article>
  );
}
