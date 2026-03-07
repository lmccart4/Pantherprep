"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  getAdaptiveProfile,
  logAnswerBatch,
  getRecentAnswers,
  type AnswerData,
  type AdaptiveProfile,
  type StoredAnswer,
} from "@/lib/adaptive/performance-service";
import { recomputeProfile } from "@/lib/adaptive/adaptive-engine";

/**
 * Hook: useAdaptiveProfile
 * Loads and manages a student's adaptive profile.
 */
export function useAdaptiveProfile(uid: string | undefined) {
  const [profile, setProfile] = useState<AdaptiveProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = useCallback(async () => {
    if (!uid) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const p = await getAdaptiveProfile(uid);
      setProfile(p);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [uid]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const refresh = useCallback(async () => {
    if (!uid) return;
    setLoading(true);
    try {
      const updated = await recomputeProfile(uid);
      setProfile(updated);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [uid]);

  return { profile, loading, error, refresh };
}

/**
 * Hook: useAnswerLogger
 * Provides methods for logging answers and triggering profile updates.
 */
export function useAnswerLogger(uid: string | undefined) {
  const pendingRef = useRef<AnswerData[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const logBatch = useCallback(
    async (answers: AnswerData[]) => {
      if (!uid || !answers.length) return 0;
      const count = await logAnswerBatch(uid, answers);
      if (count > 0) await recomputeProfile(uid);
      return count;
    },
    [uid]
  );

  const queueAnswer = useCallback(
    (answer: AnswerData) => {
      pendingRef.current.push(answer);
      if (timerRef.current) clearTimeout(timerRef.current);

      if (pendingRef.current.length >= 10) {
        const batch = [...pendingRef.current];
        pendingRef.current = [];
        logAnswerBatch(uid!, batch).then(() => recomputeProfile(uid!));
        return;
      }

      timerRef.current = setTimeout(() => {
        if (pendingRef.current.length > 0) {
          const batch = [...pendingRef.current];
          pendingRef.current = [];
          logAnswerBatch(uid!, batch).then(() => recomputeProfile(uid!));
        }
      }, 5000);
    },
    [uid]
  );

  const flush = useCallback(async () => {
    if (pendingRef.current.length > 0 && uid) {
      const batch = [...pendingRef.current];
      pendingRef.current = [];
      if (timerRef.current) clearTimeout(timerRef.current);
      await logAnswerBatch(uid, batch);
      await recomputeProfile(uid);
    }
  }, [uid]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (pendingRef.current.length > 0 && uid) {
        logAnswerBatch(uid, [...pendingRef.current]);
        pendingRef.current = [];
      }
    };
  }, [uid]);

  return { logBatch, queueAnswer, flush };
}

/**
 * Hook: useRecentAnswers
 * Loads a student's recent answer history.
 */
export function useRecentAnswers(uid: string | undefined, limitN = 50) {
  const [answers, setAnswers] = useState<StoredAnswer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) {
      setLoading(false);
      return;
    }
    setLoading(true);
    getRecentAnswers(uid, limitN)
      .then(setAnswers)
      .finally(() => setLoading(false));
  }, [uid, limitN]);

  return { answers, loading };
}
