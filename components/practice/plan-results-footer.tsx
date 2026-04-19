"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { StudyPlan } from "@/types/study-plan";
import { skillLabel } from "@/lib/adaptive/adaptive-engine";
import { toISODate } from "@/lib/study-plan/dates";

export function PlanResultsFooter({ planId: propPlanId }: { planId?: string | null }) {
  const searchParams = useSearchParams();
  const planId = propPlanId ?? searchParams?.get("plan") ?? null;
  const [plan, setPlan] = useState<StudyPlan | null>(null);

  useEffect(() => {
    if (!planId) return;
    getDoc(doc(db, "studyPlans", planId)).then((s) =>
      setPlan(s.exists() ? (s.data() as StudyPlan) : null)
    );
  }, [planId]);

  if (!planId || !plan) return null;

  const todayIso = toISODate(new Date());
  const completedToday = !!plan.completedDays?.[todayIso];
  const remainingThisWeek = plan.currentWeekSkills.slice(1);
  const next = remainingThisWeek[0];
  const nextWeekFirst = plan.skillQueue.find(
    (q) => q.assignedWeek === plan.currentWeekIndex + 1
  )?.skill;

  const msg = completedToday
    ? next
      ? `Today's set complete. Next up this week: ${skillLabel(next)}.`
      : nextWeekFirst
        ? `Week complete. Next week kicks off with ${skillLabel(nextWeekFirst)}.`
        : "Week complete. See your plan for what's next."
    : `Plan progress saved. See your full ramp.`;

  return (
    <div className="mt-6 border-2 border-ink bg-paper-card p-5">
      <div className="kicker mb-2">Study plan</div>
      <p className="font-body text-[14px] italic text-ink-2">{msg}</p>
      <Link
        href="/study-plan"
        className="mt-3 inline-block font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-accent hover:text-ink"
      >
        See plan &rarr;
      </Link>
    </div>
  );
}
