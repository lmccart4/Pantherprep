#!/usr/bin/env node
// Backfill script: reads existing sessions, re-writes them as performanceLog
// answer rows with full question snapshots + updates session summaries in
// place. Rescues historical diagnostic data for the new Past Tests UI.
//
// Usage:
//   GOOGLE_APPLICATION_CREDENTIALS=/path/to/key.json npm run backfill:perflog -- --dry-run
//   GOOGLE_APPLICATION_CREDENTIALS=/path/to/key.json npm run backfill:perflog -- --uid=<firebaseUid>
//   GOOGLE_APPLICATION_CREDENTIALS=/path/to/key.json npm run backfill:perflog

import admin from "firebase-admin";

const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
const UID_ARG = args.find((a) => a.startsWith("--uid="))?.split("=")[1];

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});
const db = admin.firestore();

// Import question banks via tsx's TS-aware resolver.
const { QUESTIONS: SAT_MATH } = await import("../app/(authenticated)/diagnostics/sat-math/questions.ts");
const { QUESTIONS: SAT_RW } = await import("../app/(authenticated)/diagnostics/sat-rw/questions.ts");
const { QUESTIONS: NMSQT_MATH } = await import("../app/(authenticated)/diagnostics/nmsqt-math/questions.ts");
const { QUESTIONS: NMSQT_RW } = await import("../app/(authenticated)/diagnostics/nmsqt-rw/questions.ts");
const { QUESTIONS: PSAT89_MATH } = await import("../app/(authenticated)/diagnostics/psat89-math/questions.ts");
const { QUESTIONS: PSAT89_RW } = await import("../app/(authenticated)/diagnostics/psat89-rw/questions.ts");

const QUESTION_BANKS = {
  "sat-math-diagnostic": SAT_MATH,
  "sat-rw-diagnostic": SAT_RW,
  "nmsqt-math-diagnostic": NMSQT_MATH,
  "nmsqt-rw-diagnostic": NMSQT_RW,
  "psat89-math-diagnostic": PSAT89_MATH,
  "psat89-rw-diagnostic": PSAT89_RW,
};

// Pure helpers — same source as the client path, no Firebase imports.
const { mapDifficulty, normalizeChoices, isCorrect } = await import(
  "../lib/question-utils.ts"
);

async function main() {
  console.log(`Backfill starting. DRY_RUN=${DRY_RUN} UID=${UID_ARG ?? "(all)"}`);

  let sessionsQuery = db.collection("sessions");
  if (UID_ARG) sessionsQuery = sessionsQuery.where("uid", "==", UID_ARG);

  const snap = await sessionsQuery.get();
  console.log(`Found ${snap.size} session(s) to process.`);

  let ok = 0;
  let skipped = 0;
  const affectedUids = new Set();

  for (const sessionDoc of snap.docs) {
    const session = sessionDoc.data();
    const { uid, testType, answers: legacyAnswers, createdAt } = session;

    if (session.testSessionId) {
      skipped++;
      continue;
    }

    const bank = QUESTION_BANKS[testType];
    if (!bank) {
      console.warn(`skip ${sessionDoc.id} uid=${uid} reason=unknown-testType (${testType})`);
      skipped++;
      continue;
    }

    if (!Array.isArray(legacyAnswers) || legacyAnswers.length === 0) {
      console.warn(`skip ${sessionDoc.id} uid=${uid} reason=no-legacy-answers`);
      skipped++;
      continue;
    }

    const qIdToIdx = new Map(bank.map((q, i) => [q.id, i]));
    const answersByIdx = {};
    let unresolved = 0;
    for (const la of legacyAnswers) {
      const idx = qIdToIdx.get(la.questionId);
      if (idx == null) {
        unresolved++;
        continue;
      }
      answersByIdx[idx] = la.userAnswer ?? "";
    }
    if (unresolved > 0) {
      console.warn(
        `partial ${sessionDoc.id} uid=${uid}: ${unresolved}/${legacyAnswers.length} legacy answers could not be matched`
      );
    }

    const testSessionId = sessionDoc.id;
    const course = testType.replace(/-diagnostic$/, "");
    const rows = bank.map((q, i) => {
      const selected = answersByIdx[i] ?? "";
      return {
        uid,
        questionId: q.id,
        moduleId: q.module != null ? String(q.module) : "",
        course,
        domain: q.domain,
        skill: q.skill,
        difficulty: mapDifficulty(q.difficulty),
        correct: isCorrect(q, selected),
        selectedAnswer: selected,
        correctAnswer: q.correctAnswer,
        errorCode: null,
        errorCategory: null,
        timeSpent: 0,
        timestamp: createdAt,
        sessionId: testSessionId,
        stem: q.stem,
        choices: normalizeChoices(q),
        explanation: q.explanation,
        testSessionId,
      };
    });
    const score = rows.filter((r) => r.correct).length;

    if (DRY_RUN) {
      console.log(
        `DRY ok ${sessionDoc.id} uid=${uid} testType=${testType} score=${score}/${rows.length}`
      );
    } else {
      const batch = db.batch();
      const colRef = db.collection("performanceLog").doc(uid).collection("answers");
      for (const row of rows) {
        batch.set(colRef.doc(), row);
      }
      batch.set(
        db.collection("sessions").doc(sessionDoc.id),
        {
          ...session,
          testSessionId,
          answers: admin.firestore.FieldValue.delete(),
        },
        { merge: true }
      );
      await batch.commit();
      console.log(
        `ok ${sessionDoc.id} uid=${uid} testType=${testType} score=${score}/${rows.length}`
      );
    }

    ok++;
    affectedUids.add(uid);
  }

  // Note: adaptiveProfile recompute is client-SDK only. Affected users'
  // mastery will refresh next time they or a teacher click Refresh on the
  // dashboard, OR after the next normal answer write triggers recompute.

  console.log(
    `\nBackfill complete. ok=${ok} skipped=${skipped} affected_uids=${affectedUids.size}`
  );
}

main().catch((e) => {
  console.error("Backfill failed:", e);
  process.exit(1);
});
