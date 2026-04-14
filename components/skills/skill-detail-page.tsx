"use client";

import { useEffect, useState } from "react";
import { TopBar } from "@/components/layout/top-bar";
import { SkillDetail } from "@/components/skills/skill-detail";
import { useAuth } from "@/hooks/use-auth";
import { getAdaptiveProfile } from "@/lib/adaptive/performance-service";
import type { AdaptiveProfile } from "@/lib/adaptive/performance-service";

interface SkillDetailPageProps {
  course: string;
  skill: string;
}

export function SkillDetailPageClient({ course, skill }: SkillDetailPageProps) {
  const { user } = useAuth();
  const [profile, setProfile] = useState<AdaptiveProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) return;
    getAdaptiveProfile(user.uid)
      .then(setProfile)
      .finally(() => setLoading(false));
  }, [user?.uid]);

  if (!user) return null;

  return (
    <div className="min-h-screen">
      <TopBar />
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {loading ? (
          <p className="text-sm text-text-muted">Loading skill details…</p>
        ) : (
          <SkillDetail
            uid={user.uid}
            email={user.email ?? ""}
            course={course}
            taxonomyKey={skill}
            profile={profile}
          />
        )}
      </div>
    </div>
  );
}
