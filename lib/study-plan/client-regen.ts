// Client-side helpers that read/write studyPlans docs. The algorithm is the
// source of truth for skillQueue + currentWeek state; admin SDK scripts also
// write weeklyNarrative + pullQuote + lastRegeneratedAt on Sunday.

import {
  doc,
  getDoc,
  updateDoc,
  setDoc,
  serverTimestamp,
  Timestamp,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getAdaptiveProfile } from "@/lib/adaptive/performance-service";
import { buildPlan } from "./algorithm";
import { toISODate } from "./dates";
import type { StudyPlan } from "@/types/study-plan";

export async function regenerateStudyPlan(planId: string): Promise<void> {
  const ref = doc(db, "studyPlans", planId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;
  const plan = snap.data() as StudyPlan;
  if (plan.status !== "active") return;

  const profile = await getAdaptiveProfile(plan.uid);

  const output = buildPlan({
    profile,
    testDate: plan.testDate.toDate(),
    today: new Date(),
    course: plan.course,
    completedDays: plan.completedDays ?? {},
  });

  await updateDoc(ref, {
    skillQueue: output.skillQueue,
    currentWeekIndex: output.currentWeekIndex,
    currentWeekSkills: output.currentWeekSkills,
    targetSessionsThisWeek: output.targetSessionsThisWeek,
    mode: output.mode,
    lastAlgorithmRunAt: serverTimestamp(),
  });
}

export async function listPlansForUser(uid: string): Promise<(StudyPlan & { id: string })[]> {
  const q = query(collection(db, "studyPlans"), where("uid", "==", uid));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as unknown as StudyPlan & { id: string });
}

export async function markDayCompletedIfMatches(
  uid: string,
  course: string,
  skillsInSession: string[]
): Promise<void> {
  const planId = `${uid}_${course}`;
  const ref = doc(db, "studyPlans", planId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;
  const plan = snap.data() as StudyPlan;
  if (plan.status !== "active") return;
  const overlap = skillsInSession.some((s) => plan.currentWeekSkills.includes(s));
  if (!overlap) return;
  const iso = toISODate(new Date());
  const completedDays = { ...(plan.completedDays ?? {}), [iso]: true };
  await updateDoc(ref, { completedDays });
  await regenerateStudyPlan(planId);
}

export async function createPlan(args: {
  uid: string;
  course: string;
  testDate: Date;
}): Promise<string> {
  const planId = `${args.uid}_${args.course}`;
  const ref = doc(db, "studyPlans", planId);
  await setDoc(ref, {
    uid: args.uid,
    course: args.course,
    testDate: Timestamp.fromDate(args.testDate),
    createdAt: serverTimestamp(),
    status: "active",
    mode: "normal",
    skillQueue: [],
    currentWeekIndex: 0,
    currentWeekSkills: [],
    targetSessionsThisWeek: 3,
    completedDays: {},
    skippedWeeks: [],
  });
  await regenerateStudyPlan(planId);
  return planId;
}

export async function skipCurrentWeek(planId: string): Promise<void> {
  const ref = doc(db, "studyPlans", planId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;
  const plan = snap.data() as StudyPlan;
  const next = [...(plan.skippedWeeks ?? []), plan.currentWeekIndex];
  await updateDoc(ref, { skippedWeeks: next });
  await regenerateStudyPlan(planId);
}
