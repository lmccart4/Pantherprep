"use client";

import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/use-auth";
import { TopBar } from "@/components/layout/top-bar";
import { WeekStrip } from "@/components/study-plan/week-strip";
import { NarrativeCard } from "@/components/study-plan/narrative-card";
import { SkillProgress } from "@/components/study-plan/skill-progress";
import { OnboardingModal } from "@/components/study-plan/onboarding-modal";
import { WrapUpView } from "@/components/study-plan/wrap-up-view";
import {
  regenerateStudyPlan,
  skipCurrentWeek,
} from "@/lib/study-plan/client-regen";
import { getAdaptiveProfile } from "@/lib/adaptive/performance-service";
import type { StudyPlan } from "@/types/study-plan";
import type { AdaptiveProfile } from "@/lib/adaptive/performance-service";

export default function StudyPlanPage() {
  const { user } = useAuth();
  const [plans, setPlans] = useState<(StudyPlan & { id: string })[]>([]);
  const [archived, setArchived] = useState<(StudyPlan & { id: string })[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [profile, setProfile] = useState<AdaptiveProfile | null>(null);

  useEffect(() => {
    if (!user?.uid) return;
    const q = query(collection(db, "studyPlans"), where("uid", "==", user.uid));
    return onSnapshot(q, (snap) => {
      const all = snap.docs.map(
        (d) => ({ id: d.id, ...d.data() }) as StudyPlan & { id: string }
      );
      setPlans(all.filter((p) => p.status === "active"));
      setArchived(all.filter((p) => p.status === "archived"));
      if (!selectedId && all.length > 0) setSelectedId(all[0].id);
    });
  }, [user?.uid, selectedId]);

  useEffect(() => {
    if (!user?.uid) return;
    getAdaptiveProfile(user.uid).then(setProfile);
  }, [user?.uid]);

  useEffect(() => {
    if (selectedId) {
      regenerateStudyPlan(selectedId).catch(() => {});
    }
  }, [selectedId]);

  if (!user) return null;

  const showWelcome = plans.length === 0 && archived.length === 0;
  const selected =
    plans.find((p) => p.id === selectedId) ??
    archived.find((p) => p.id === selectedId) ??
    plans[0] ??
    archived[0];

  async function handleSkip() {
    if (!selected) return;
    if (
      !confirm(
        "Skip this week? Your skills will redistribute into remaining weeks."
      )
    )
      return;
    await skipCurrentWeek(selected.id);
  }

  return (
    <div className="min-h-screen bg-paper">
      <TopBar backHref="/home" backLabel="Home" />
      <main className="mx-auto max-w-[1000px] px-6 py-10">
        <header className="mb-8 border-b-2 border-ink pb-4">
          <div className="kicker mb-2">Your study plan</div>
          {selected ? (
            <h1 className="font-display text-[clamp(36px,4vw,56px)] leading-[0.95] text-ink">
              {selected.status === "archived" ? (
                <>
                  Plan{" "}
                  <em className="text-accent" style={{ fontStyle: "italic" }}>
                    archived
                  </em>
                  .
                </>
              ) : (
                <>
                  {Math.max(
                    0,
                    Math.floor(
                      (selected.testDate.toMillis() - Date.now()) /
                        (1000 * 60 * 60 * 24)
                    )
                  )}{" "}
                  days to{" "}
                  <em className="text-accent" style={{ fontStyle: "italic" }}>
                    {selected.course.split("-")[0].toUpperCase()}
                  </em>
                  .
                </>
              )}
            </h1>
          ) : (
            <h1 className="font-display text-[clamp(36px,4vw,56px)] leading-[0.95] text-ink">
              Let&rsquo;s{" "}
              <em className="text-accent" style={{ fontStyle: "italic" }}>
                start
              </em>
              .
            </h1>
          )}
        </header>

        {showWelcome && (
          <div className="mx-auto max-w-xl border-2 border-ink bg-paper-card p-6 text-center shadow-[5px_5px_0_var(--color-ink)]">
            <div className="kicker mb-2">Nothing scheduled</div>
            <p className="mb-4 font-body text-[15px] italic text-ink-2">
              Build a plan from today to your test date. Takes 30 seconds.
            </p>
            <button
              onClick={() => setShowOnboarding(true)}
              className="border-2 border-ink bg-accent px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-accent-fg hover:bg-ink"
            >
              Build my plan
            </button>
          </div>
        )}

        {plans.length + archived.length > 1 && (
          <div className="mb-6 flex flex-wrap gap-2">
            {[...plans, ...archived].map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedId(p.id)}
                className={`border-2 border-ink px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em] ${
                  selectedId === p.id
                    ? "bg-ink text-paper"
                    : "bg-paper-card text-ink"
                }`}
              >
                {p.course} {p.status === "archived" && "(archived)"}
              </button>
            ))}
          </div>
        )}

        {selected && selected.status === "archived" && (
          <WrapUpView plan={selected} profile={profile} />
        )}

        {selected && selected.status === "active" && (
          <div className="flex flex-col gap-8">
            <WeekStrip plan={selected} />
            <NarrativeCard plan={selected} />
            <SkillProgress plan={selected} profile={profile} />
            <div className="flex flex-wrap gap-3 border-t-2 border-ink pt-4">
              <button
                onClick={handleSkip}
                className="border border-ink px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-ink-3 hover:text-accent"
              >
                Skip this week
              </button>
            </div>
          </div>
        )}

        {showOnboarding && <OnboardingModal onDone={() => setShowOnboarding(false)} />}
      </main>
    </div>
  );
}
