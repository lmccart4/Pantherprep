"use client";

import { useState } from "react";
import { setWantsHumanCoach } from "@/lib/coach-chat";

export function HumanCoachToggle({ uid, value }: { uid: string; value: boolean }) {
  const [busy, setBusy] = useState(false);

  async function toggle() {
    if (busy) return;
    setBusy(true);
    try {
      await setWantsHumanCoach(uid, !value);
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={busy}
      className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-ink-3 underline decoration-dashed underline-offset-4 transition-colors hover:text-accent disabled:opacity-50"
    >
      {value
        ? "Cancel \u2014 let Parker answer"
        : "Want to talk to Mr. McCarthy directly? \u2192"}
    </button>
  );
}
