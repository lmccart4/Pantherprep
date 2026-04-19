"use client";

import { Suspense } from "react";
import { TopBar } from "@/components/layout/top-bar";
import { ThreadView } from "@/components/coach-chat/thread-view";

export default function CoachChatPage() {
  return (
    <div className="min-h-screen bg-paper">
      <TopBar backHref="/home" backLabel="Home" />
      <Suspense fallback={null}>
        <ThreadView />
      </Suspense>
    </div>
  );
}
