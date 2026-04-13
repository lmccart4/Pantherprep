// Read-only helpers for the Past Tests UI.
// getTestHistory → list of session summaries for a user
// getTestSessionDetail → reconstruct one test's question-by-question answers

import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Session } from "@/types/firestore";
import type { StoredAnswer } from "@/lib/adaptive/performance-service";

export interface SessionSummary extends Session {
  id: string;
}

export async function getTestHistory(
  uid: string,
  maxResults = 100
): Promise<SessionSummary[]> {
  if (!uid) return [];
  const q = query(
    collection(db, "sessions"),
    where("uid", "==", uid),
    orderBy("createdAt", "desc"),
    limit(maxResults)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Session) }));
}

export async function getTestSessionDetail(
  uid: string,
  testSessionId: string
): Promise<{
  session: SessionSummary | null;
  answers: StoredAnswer[];
}> {
  if (!uid || !testSessionId) return { session: null, answers: [] };

  // Fetch the summary. We search by testSessionId rather than Firestore doc id
  // because backfilled sessions preserve their original doc id but we prefer a
  // stable, self-describing join key.
  const sessionsQuery = query(
    collection(db, "sessions"),
    where("uid", "==", uid),
    where("testSessionId", "==", testSessionId),
    limit(1)
  );
  const sessionSnap = await getDocs(sessionsQuery);
  const session = sessionSnap.empty
    ? null
    : ({
        id: sessionSnap.docs[0].id,
        ...(sessionSnap.docs[0].data() as Session),
      } as SessionSummary);

  // Fetch all answers for this session
  const answersQuery = query(
    collection(db, "performanceLog", uid, "answers"),
    where("testSessionId", "==", testSessionId),
    orderBy("timestamp", "asc")
  );
  const answersSnap = await getDocs(answersQuery);
  const answers: StoredAnswer[] = answersSnap.docs.map(
    (d) => ({ id: d.id, ...d.data() } as StoredAnswer)
  );

  return { session, answers };
}
