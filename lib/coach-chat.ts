// Client-side Firestore helpers for Coach Chat.
// Reads go through real-time subscriptions; writes are fire-and-forget.
// Admin SDK (Mac mini scripts) owns draft creation and auto-send.

import {
  collection,
  doc,
  query,
  where,
  orderBy,
  limit as limitTo,
  onSnapshot,
  addDoc,
  updateDoc,
  setDoc,
  increment,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { CoachNote, CoachThread } from "@/types/coach";

export function subscribeLatestNote(
  uid: string,
  onChange: (note: CoachNote | null) => void
): () => void {
  const q = query(
    collection(db, "coachNotes"),
    where("threadUid", "==", uid),
    orderBy("createdAt", "desc"),
    limitTo(1)
  );
  return onSnapshot(q, (snap) => {
    const docSnap = snap.docs[0];
    onChange(docSnap ? ({ id: docSnap.id, ...docSnap.data() } as CoachNote) : null);
  });
}

export function subscribeThreadNotes(
  uid: string,
  onChange: (notes: CoachNote[]) => void
): () => void {
  const q = query(
    collection(db, "coachNotes"),
    where("threadUid", "==", uid),
    orderBy("createdAt", "desc"),
    limitTo(50)
  );
  return onSnapshot(q, (snap) => {
    onChange(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as CoachNote));
  });
}

export function subscribeThread(
  uid: string,
  onChange: (thread: CoachThread | null) => void
): () => void {
  return onSnapshot(doc(db, "coachThreads", uid), (snap) => {
    onChange(snap.exists() ? (snap.data() as CoachThread) : null);
  });
}

export async function postStudentReply(uid: string, body: string): Promise<void> {
  const trimmed = body.trim();
  if (!trimmed) return;
  await addDoc(collection(db, "coachNotes"), {
    threadUid: uid,
    role: "student",
    author: "student",
    body: trimmed,
    trigger: "student_reply",
    createdAt: serverTimestamp(),
    readBy: {},
    status: "sent",
    lukeEdited: false,
  });
  try {
    await updateDoc(doc(db, "coachThreads", uid), {
      unreadCountCoach: increment(1),
      lastActivityAt: serverTimestamp(),
    });
  } catch {
    await setDoc(doc(db, "coachThreads", uid), {
      studentUid: uid,
      lastActivityAt: serverTimestamp(),
      unreadCountStudent: 0,
      unreadCountCoach: 1,
      wantsHumanCoach: false,
    });
  }
  // Queue a post_reply trigger for the Parker pipeline.
  try {
    await addDoc(collection(db, "coachTriggerQueue"), {
      uid,
      trigger: "student_reply",
      queuedAt: serverTimestamp(),
      processed: false,
    });
  } catch (e) {
    console.warn("coachTriggerQueue write failed:", e);
  }
}

export async function markNoteReadByStudent(noteId: string): Promise<void> {
  try {
    await updateDoc(doc(db, "coachNotes", noteId), {
      "readBy.student": serverTimestamp(),
    });
  } catch {
    // silently ignore; rules disallow update for non-owners
  }
}

export async function resetStudentUnread(uid: string): Promise<void> {
  try {
    await updateDoc(doc(db, "coachThreads", uid), { unreadCountStudent: 0 });
  } catch {
    // no-op if thread doc hasn't been created yet
  }
}

export async function setWantsHumanCoach(uid: string, value: boolean): Promise<void> {
  try {
    await updateDoc(doc(db, "coachThreads", uid), { wantsHumanCoach: value });
  } catch {
    await setDoc(doc(db, "coachThreads", uid), {
      studentUid: uid,
      lastActivityAt: serverTimestamp(),
      unreadCountStudent: 0,
      unreadCountCoach: 0,
      wantsHumanCoach: value,
    });
  }
}

export function formatRelative(ts: Timestamp | null | undefined): string {
  if (!ts) return "just now";
  const ms = Date.now() - ts.toMillis();
  const m = Math.floor(ms / 60_000);
  if (m < 1) return "just now";
  if (m < 60) return `${m} minute${m === 1 ? "" : "s"} ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} hour${h === 1 ? "" : "s"} ago`;
  const d = Math.floor(h / 24);
  return `${d} day${d === 1 ? "" : "s"} ago`;
}
