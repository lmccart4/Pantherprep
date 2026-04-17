"use client";

import { useEffect, useMemo, useState } from "react";
import { TopBar } from "@/components/layout/top-bar";
import { SkillCatalog } from "@/components/skills/skill-catalog";
import { useAuth } from "@/hooks/use-auth";
import {
  getAdaptiveProfile,
  getAllAdaptiveProfiles,
  type AdaptiveProfile,
} from "@/lib/adaptive/performance-service";
import { getTeacherClasses } from "@/lib/firestore";
import type { ClassDoc } from "@/types/firestore";

interface SkillCatalogPageClientProps {
  course: string;
}

const CLASS_ID_STORAGE_KEY = "pp.skills.classId";

export function SkillCatalogPageClient({ course }: SkillCatalogPageClientProps) {
  const { user, role } = useAuth();
  const [profiles, setProfiles] = useState<AdaptiveProfile[]>([]);
  const [classes, setClasses] = useState<(ClassDoc & { id: string })[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>("__all__");
  const [loading, setLoading] = useState(true);

  // On mount for teachers: read persisted class selection.
  useEffect(() => {
    if (role !== "teacher") return;
    try {
      const stored = localStorage.getItem(CLASS_ID_STORAGE_KEY);
      if (stored) setSelectedClassId(stored);
    } catch {
      // localStorage unavailable — fine, keep default.
    }
  }, [role]);

  // Persist teacher class selection.
  useEffect(() => {
    if (role !== "teacher") return;
    try {
      localStorage.setItem(CLASS_ID_STORAGE_KEY, selectedClassId);
    } catch {
      // ignore
    }
  }, [role, selectedClassId]);

  // Load classes for teachers.
  useEffect(() => {
    if (role !== "teacher" || !user?.uid) return;
    getTeacherClasses(user.uid)
      .then(setClasses)
      .catch(() => setClasses([]));
  }, [role, user?.uid]);

  // Compute the uid list to fetch profiles for.
  const targetUids = useMemo<string[] | null>(() => {
    if (role === "student") return user?.uid ? [user.uid] : [];
    if (role === "teacher") {
      if (classes.length === 0) return [];
      if (selectedClassId === "__all__") {
        const set = new Set<string>();
        for (const c of classes) for (const uid of c.students ?? []) set.add(uid);
        return Array.from(set);
      }
      const chosen = classes.find((c) => c.id === selectedClassId);
      return chosen?.students ?? [];
    }
    // admin → null signals "fetch all platform-wide (bounded)"
    if (role === "admin") return null;
    return [];
  }, [role, user?.uid, classes, selectedClassId]);

  // Fetch profiles whenever targetUids changes.
  useEffect(() => {
    if (!user?.uid) return;
    setLoading(true);

    // Student: use the single-profile fetch to avoid a fan-out Promise.all of size 1.
    if (role === "student") {
      getAdaptiveProfile(user.uid)
        .then((p) => setProfiles(p ? [p] : []))
        .finally(() => setLoading(false));
      return;
    }

    // Teacher with no classes loaded yet, or empty target set.
    if (Array.isArray(targetUids)) {
      if (targetUids.length === 0) {
        setProfiles([]);
        setLoading(false);
        return;
      }
      getAllAdaptiveProfiles(targetUids)
        .then(setProfiles)
        .finally(() => setLoading(false));
      return;
    }

    // Admin (targetUids === null): platform-wide.
    getAllAdaptiveProfiles()
      .then((all) => {
        if (all.length >= 200) {
          console.warn(
            "[skills] Admin view hit the 200-profile cap; some students are not included."
          );
        }
        setProfiles(all);
      })
      .finally(() => setLoading(false));
  }, [role, user?.uid, targetUids]);

  return (
    <div className="min-h-screen">
      <TopBar />
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {loading ? (
          <p className="text-sm text-text-muted">Loading catalog…</p>
        ) : (
          <SkillCatalog
            course={course}
            profiles={profiles}
            role={role}
            classes={role === "teacher" ? classes : undefined}
            selectedClassId={role === "teacher" ? selectedClassId : undefined}
            onClassChange={role === "teacher" ? setSelectedClassId : undefined}
          />
        )}
      </div>
    </div>
  );
}
