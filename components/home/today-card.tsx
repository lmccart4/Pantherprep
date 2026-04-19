"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/use-auth";
import type { StudyPlan } from "@/types/study-plan";
import { buildPlan } from "@/lib/study-plan/algorithm";
import { skillLabel } from "@/lib/adaptive/adaptive-engine";
import { getAdaptiveProfile } from "@/lib/adaptive/performance-service";

interface TodayRender {
  planId: string;
  weekIndex: number;
  totalWeeks: number;
  skill: string;
  course: string;
  targetCount: number;
  estMinutes: number;
}

export function TodayCard() {
  const { user } = useAuth();
  const [render, setRender] = useState<TodayRender | null>(null);

  useEffect(() => {
    if (!user?.uid) return;
    const q = query(
      collection(db, "studyPlans"),
      where("uid", "==", user.uid),
      where("status", "==", "active")
    );
    return onSnapshot(q, async (snap) => {
      if (snap.empty) {
        setRender(null);
        return;
      }
      const plans = snap.docs.map(
        (d) => ({ id: d.id, ...d.data() }) as StudyPlan & { id: string }
      );
      plans.sort((a, b) => {
        const am = a.lastAlgorithmRunAt?.toMillis?.() ?? 0;
        const bm = b.lastAlgorithmRunAt?.toMillis?.() ?? 0;
        return am - bm;
      });
      for (const plan of plans) {
        const profile = await getAdaptiveProfile(plan.uid);
        const out = buildPlan({
          profile,
          testDate: plan.testDate.toDate(),
          today: new Date(),
          course: plan.course,
          completedDays: plan.completedDays ?? {},
        });
        if (out.today) {
          const totalWeeks = Math.max(
            1,
            (plan.skillQueue?.at(-1)?.assignedWeek ?? 0) + 1
          );
          setRender({
            planId: plan.id,
            weekIndex: out.currentWeekIndex,
            totalWeeks,
            skill: out.today.skill,
            course: out.today.course,
            targetCount: out.today.targetCount,
            estMinutes: out.today.estMinutes,
          });
          return;
        }
      }
      setRender(null);
    });
  }, [user?.uid]);

  if (!render) return null;

  return (
    <div className="relative border-2 border-ink bg-paper-card p-6 shadow-[5px_5px_0_var(--color-ink)]">
      <div className="absolute -top-[2px] left-0 right-0 h-1 bg-accent" />
      <div className="kicker mb-3">
        Today&rsquo;s set &middot; Week {render.weekIndex + 1} of {render.totalWeeks}
      </div>
      <h2 className="mb-2 font-display text-[clamp(32px,3.5vw,44px)] leading-[1.05] text-ink">
        {skillLabel(render.skill)}
      </h2>
      <div className="mb-5 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-ink-3">
        {render.targetCount} questions &middot; ~{render.estMinutes} min
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Link
          href={`/dashboard?tab=practice&skill=${render.skill}&count=${render.targetCount}&plan=${render.planId}`}
          className="border-2 border-ink bg-accent px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-accent-fg transition-colors hover:bg-ink"
        >
          Start today&rsquo;s set
        </Link>
        <Link
          href="/study-plan"
          className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-ink-3 underline decoration-dashed underline-offset-4 hover:text-accent"
        >
          See full study plan &rarr;
        </Link>
      </div>
    </div>
  );
}
