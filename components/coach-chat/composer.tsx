"use client";

import { forwardRef, useState } from "react";
import { postStudentReply } from "@/lib/coach-chat";

interface ComposerProps {
  uid: string;
}

export const Composer = forwardRef<HTMLTextAreaElement, ComposerProps>(
  function Composer({ uid }, ref) {
    const [body, setBody] = useState("");
    const [sending, setSending] = useState(false);

    async function submit() {
      if (!body.trim() || sending) return;
      setSending(true);
      try {
        await postStudentReply(uid, body);
        setBody("");
      } finally {
        setSending(false);
      }
    }

    function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        submit();
      }
    }

    return (
      <div className="border-2 border-ink bg-paper-card p-4">
        <textarea
          ref={ref}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Write back to your coach..."
          rows={3}
          disabled={sending}
          className="w-full resize-none border-0 bg-transparent font-body text-[15px] leading-[1.5] text-ink placeholder:italic placeholder:text-ink-3 focus:outline-none"
        />
        <div className="mt-3 flex items-center justify-between">
          <div className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-ink-4">
            &#8984; Enter to send
          </div>
          <button
            onClick={submit}
            disabled={!body.trim() || sending}
            className="border-2 border-ink bg-accent px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-accent-fg transition-colors hover:bg-ink disabled:opacity-40"
          >
            {sending ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    );
  }
);
