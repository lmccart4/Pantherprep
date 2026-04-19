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
    <div className="min-h-screen bg-paper">
      <TopBar backHref="/home" backLabel="Home" />
      <main className="mx-auto max-w-[1240px] px-6 py-10">
        <header className="mb-10 flex items-end justify-between border-b-2 border-ink pb-6">
          <div className="max-w-2xl">
            <div className="kicker mb-3">Skills Library</div>
            <h1 className="font-display text-[clamp(44px,5vw,72px)] leading-[0.95] text-ink">
              Browse by{" "}
              <em className="text-accent" style={{ fontStyle: "italic" }}>
                topic
              </em>
              .
            </h1>
            <p className="mt-4 font-body text-[15px] italic leading-[1.55] text-ink-2">
              Concept explanations and practice questions by topic, independent of any test.
              Start with your weakest areas or explore anything that looks interesting.
            </p>
          </div>
          {totalRecs > 0 && (
            <div className="hidden border-2 border-accent bg-accent-soft px-4 py-3 text-right sm:block">
              <div className="font-display text-[28px] leading-none text-accent">
                {totalRecs}
              </div>
              <div className="mt-1 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-ink-3">
                recommended
              </div>
            </div>
          )}
        </header>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {TEST_COURSES.map((tile, i) => {
            const count = getSkillCountForCourse(tile.course);
            return (
              <Link key={tile.course} href={`/skills/${tile.course}`} className="group block">
                <GlassCard className="h-full p-6 transition-transform hover:-translate-y-0.5 hover:shadow-[5px_5px_0_var(--color-ink)]">
                  <div className="mb-3 flex items-baseline justify-between">
                    <div className="kicker">{tile.title}</div>
                    <div className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-ink-4">
                      {String(i + 1).padStart(2, "0")} / {String(TEST_COURSES.length).padStart(2, "0")}
                    </div>
                  </div>
                  <h2 className="mb-2 font-display text-[26px] leading-tight text-ink">
                    {tile.subtitle}
                  </h2>
                  <div className="flex items-baseline justify-between border-t border-rule-hair pt-3">
                    <div className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-ink-3">
                      {count} skills
                    </div>
                    <div className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-accent transition-transform group-hover:translate-x-0.5">
                      Browse →
                    </div>
                  </div>
                </GlassCard>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
