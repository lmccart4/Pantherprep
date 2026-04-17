"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { useAuth } from "@/hooks/use-auth";
import { getAdaptiveProfile } from "@/lib/adaptive/performance-service";
import type { AdaptiveProfile } from "@/lib/adaptive/performance-service";
import { skillLabel } from "@/lib/adaptive/adaptive-engine";

interface SkillsCardProps {
  role: "student" | "teacher" | "admin" | null;
}

function pickSubtitle(
  role: SkillsCardProps["role"],
  profile: AdaptiveProfile | null,
  loaded: boolean
): string {
  if (role === "admin") {
    return "Platform-wide skill distribution across all students.";
  }
  if (role === "teacher") {
    return "See how your class is doing on every skill. Click any skill for a breakdown.";
  }
  if (!loaded || !profile) {
    return "49 skills across SAT, PSAT/NMSQT, and PSAT 8/9. Start a topic without taking a full test.";
  }
  const recs = profile.recommendations ?? [];
  if (recs.length === 0) {
    return "Every skill you've practiced is looking strong. Browse the full library to explore new areas.";
  }
  const named = recs
    .slice(0, 2)
    .map((r) => (r.skill ? skillLabel(r.skill) : ""))
    .filter(Boolean);
  if (named.length === 0) {
    return `You have ${recs.length} skills that could use work. Start with your weakest areas.`;
  }
  const tail = recs.length > named.length ? ", and more" : "";
  return `You have ${recs.length} skills that could use work — ${named.join(", ")}${tail}.`;
}

export function SkillsCard({ role }: SkillsCardProps) {
  const { user } = useAuth();
  const [profile, setProfile] = useState<AdaptiveProfile | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!user?.uid) {
      setLoaded(true);
      return;
    }
    getAdaptiveProfile(user.uid)
      .then(setProfile)
      .catch(() => setProfile(null))
      .finally(() => setLoaded(true));
  }, [user?.uid]);

  const subtitle = pickSubtitle(role, profile, loaded);

  return (
    <GlassCard className="mb-8 p-6">
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="mb-1 text-xs font-bold uppercase tracking-[2px] text-panther-red">
            Review by topic
          </div>
          <p className="text-sm text-text-secondary sm:text-base">{subtitle}</p>
        </div>
        <Link
          href="/skills"
          className="w-full shrink-0 rounded-lg bg-panther-red px-5 py-3 text-center text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-panther-red/90 sm:w-auto"
        >
          Open skill library →
        </Link>
      </div>
    </GlassCard>
  );
}
