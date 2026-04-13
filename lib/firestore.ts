import {
  doc,
  getDoc,
  setDoc,
  getDocs,
  collection,
  query,
  where,
  orderBy,
  limit,
  updateDoc,
  serverTimestamp,
  increment,
  deleteDoc,
  arrayUnion,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Timestamp } from "firebase/firestore";
import type {
  StudentProfile,
  Session,
  ProgressDoc,
  ClassDoc,
  CustomQuestion,
} from "@/types/firestore";
import type { UserRole } from "@/types/auth";

// ── Student Profiles ──

export async function getStudentProfile(uid: string): Promise<StudentProfile | null> {
  const snap = await getDoc(doc(db, "students", uid));
  return snap.exists() ? (snap.data() as StudentProfile) : null;
}

export async function updateStudentProfile(
  uid: string,
  data: Partial<Omit<StudentProfile, "uid" | "createdAt">>
): Promise<void> {
  await setDoc(doc(db, "students", uid), { ...data, updatedAt: serverTimestamp() }, { merge: true });
}

// ── Admin helpers ──

export async function listAllUsers(): Promise<(StudentProfile & { id: string })[]> {
  const snap = await getDocs(
    query(collection(db, "students"), orderBy("updatedAt", "desc"))
  );
  return snap.docs.map((d) => ({ ...(d.data() as StudentProfile), id: d.id }));
}

export async function updateUserRole(uid: string, role: UserRole): Promise<void> {
  await setDoc(
    doc(db, "students", uid),
    { role, updatedAt: serverTimestamp() },
    { merge: true }
  );
}

export async function deleteUser(uid: string): Promise<void> {
  await deleteDoc(doc(db, "students", uid));
}

// ── Sessions ──

export async function saveSession(
  data: Omit<Session, "createdAt">,
  opts: { existingSessionId?: string; existingCreatedAt?: Timestamp } = {}
): Promise<string> {
  if (opts.existingSessionId) {
    const ref = doc(db, "sessions", opts.existingSessionId);
    await setDoc(ref, {
      ...data,
      createdAt: opts.existingCreatedAt ?? serverTimestamp(),
    });
    return opts.existingSessionId;
  }
  const ref = doc(collection(db, "sessions"));
  await setDoc(ref, { ...data, createdAt: serverTimestamp() });
  return ref.id;
}

export async function getSessions(
  uid: string,
  maxResults = 50
): Promise<(Session & { id: string })[]> {
  const q = query(
    collection(db, "sessions"),
    where("uid", "==", uid),
    orderBy("createdAt", "desc"),
    limit(maxResults)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ ...(d.data() as Session), id: d.id }));
}

// ── Question Stats ──

export async function updateQuestionStats(
  questionId: string,
  correct: boolean
): Promise<void> {
  const ref = doc(db, "questionStats", questionId);
  await setDoc(
    ref,
    {
      questionId,
      totalAttempts: increment(1),
      correctCount: correct ? increment(1) : increment(0),
      incorrectCount: correct ? increment(0) : increment(1),
      lastAttempted: serverTimestamp(),
    },
    { merge: true }
  );
}

// ── Progress (auto-save) ──

export async function saveProgress(
  uid: string,
  key: string,
  state: Record<string, unknown>
): Promise<void> {
  const progressId = `${uid}_${key}`;
  await setDoc(doc(db, "progress", progressId), {
    uid,
    key,
    state,
    updatedAt: serverTimestamp(),
  });
}

export async function loadProgress(
  uid: string,
  key: string
): Promise<ProgressDoc | null> {
  const progressId = `${uid}_${key}`;
  const snap = await getDoc(doc(db, "progress", progressId));
  return snap.exists() ? (snap.data() as ProgressDoc) : null;
}

// ── Classes ──

export async function createClass(
  data: Omit<ClassDoc, "createdAt" | "students">
): Promise<string> {
  const ref = doc(collection(db, "classes"));
  await setDoc(ref, { ...data, students: [], createdAt: serverTimestamp() });
  return ref.id;
}

export async function joinClass(classId: string, uid: string): Promise<void> {
  await updateDoc(doc(db, "classes", classId), {
    students: arrayUnion(uid),
  });
}

export async function deleteClass(classId: string): Promise<void> {
  await deleteDoc(doc(db, "classes", classId));
}

export async function getClassByCode(code: string): Promise<(ClassDoc & { id: string }) | null> {
  const q = query(collection(db, "classes"), where("code", "==", code.toUpperCase()), limit(1));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { ...(d.data() as ClassDoc), id: d.id };
}

export async function getTeacherClasses(
  teacherUid: string
): Promise<(ClassDoc & { id: string })[]> {
  const q = query(
    collection(db, "classes"),
    where("teacherUid", "==", teacherUid),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ ...(d.data() as ClassDoc), id: d.id }));
}

// ── Custom Questions ──

export async function saveCustomQuestion(
  data: Omit<CustomQuestion, "id" | "createdAt">
): Promise<string> {
  const ref = doc(collection(db, "customQuestions"));
  await setDoc(ref, { ...data, createdAt: serverTimestamp() });
  return ref.id;
}

export async function getCustomQuestions(
  testType?: string
): Promise<(CustomQuestion & { id: string })[]> {
  let q;
  if (testType) {
    q = query(collection(db, "customQuestions"), where("testType", "==", testType));
  } else {
    q = query(collection(db, "customQuestions"));
  }
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ ...(d.data() as CustomQuestion), id: d.id }));
}
