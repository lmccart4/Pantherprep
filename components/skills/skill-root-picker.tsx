"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { TopBar } from "@/components/layout/top-bar";
import { GlassCard } from "@/components/ui/glass-card";
import { useAuth } from "@/hooks/use-auth";
import { getAdaptiveProfile } from "@/lib/adaptive/performance-service";
import type { AdaptiveProfile } from "@/lib/adaptive/performance-service";
import { getSkillCountForCourse } from "@/lib/skill-mapping";
import { TEST_COURSES } from "@/lib/test-types";

export function SkillRootPicker() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<AdaptiveProfile | null>(null);

  useEffect(() => {
    if (!user?.uid) return;
    getAdaptiveProfile(user.uid)
      .then(setProfile)
      .catch(() => setProfile(null));
  }, [user?.uid]);

  if (!user) return null;

  const totalRecs = profile?.recommendations?.length ?? 0;

  return (
    <div className="min-h-screen">
      <TopBar backHref="/home" backLabel="Home" />
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <h1 className="mb-2 font-display text-3xl tracking-[0.02em] text-ink sm:text-4xl">
          Skill Library
        </h1>
        <p className="mb-6 max-w-2xl text-sm text-text-muted sm:text-base">
          Browse concept explanations and practice questions by topic, independent of any test.
          Start with your weakest areas or explore anything that looks interesting.
        </p>

        {totalRecs > 0 && (
          <div className="mb-6 inline-block rounded-full border border-panther-red/40 bg-panther-red/10 px-4 py-2 text-sm text-panther-light-red">
            {totalRecs} skill{totalRecs === 1 ? "" : "s"} recommended to review
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {TEST_COURSES.map((tile) => {
            const count = getSkillCountForCourse(tile.course);
            return (
              <Link key={tile.course} href={`/skills/${tile.course}`} className="group block">
                <GlassCard
                  className="h-full p-6 transition-all hover:-translate-y-0.5"
                  style={{
                    borderColor: `${tile.color}40`,
                    boxShadow: `0 0 24px ${tile.color}15`,
                  }}
                >
                  <div
                    className="mb-1 text-xs font-bold uppercase tracking-[2px]"
                    style={{ color: tile.color }}
                  >
                    {tile.title}
                  </div>
                  <div className="text-sm text-text-muted">{tile.subtitle}</div>
                  <div className="mt-4 text-xs text-text-secondary">{count} skills</div>
                </GlassCard>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
