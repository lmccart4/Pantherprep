#!/usr/bin/env node
// Seed script: reads drafts/question-batches/*.reviewed.json, validates each
// question, appends to questionPool via batched auto-ID writes. Idempotent on
// re-run: pre-fetches existing docs scoped to SOURCE_TAG, then skips any
// (course, skill, stem) tuple already present in that source. Partial-failure
// safe: committed batches are detected on rerun via the source-scoped dedup.
//
// This script is STRICTLY ADDITIVE. It never touches existing questions.
// It never uses setDoc. It only adds new docs with Firestore-generated IDs.
//
// Usage:
//   GOOGLE_CLOUD_PROJECT=pantherprep-a5a73 node scripts/seed-generated-questions.mjs --dry-run
//   GOOGLE_CLOUD_PROJECT=pantherprep-a5a73 node scripts/seed-generated-questions.mjs --dry-run --course sat-math
//   GOOGLE_CLOUD_PROJECT=pantherprep-a5a73 node scripts/seed-generated-questions.mjs --source parker-gen-2026-04-14

import admin from "firebase-admin";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
const SOURCE_TAG = (() => {
  const eqForm = args.find((a) => a.startsWith("--source="))?.split("=")[1];
  if (eqForm) return eqForm;
  const idx = args.indexOf("--source");
  if (idx >= 0 && idx + 1 < args.length) return args[idx + 1];
  return "parker-gen-2026-04-14";
})();
const COURSE_FILTER =
  args.find((a) => a.startsWith("--course="))?.split("=")[1] ??
  (args.indexOf("--course") >= 0 ? args[args.indexOf("--course") + 1] : null);

const DRAFTS_DIR = "drafts/question-batches";
const VALID_COURSES = new Set([
  "sat-math", "sat-rw", "nmsqt-math", "nmsqt-rw", "psat89-math", "psat89-rw",
]);
const VALID_DIFFICULTIES = new Set(["F", "M", "C"]);
const VALID_TYPES = new Set(["mc", "spr"]);

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});
const db = admin.firestore();

// --- Validation ---
function validateQuestion(q, filename, idx) {
  const errors = [];
  const required = [
    "course", "testType", "section", "domain", "skill", "sourceSkill",
    "difficulty", "type", "stem", "correctAnswer", "explanation",
  ];
  for (const field of required) {
    if (q[field] === undefined || q[field] === null || q[field] === "") {
      errors.push(`missing field: ${field}`);
    }
  }
  if (!VALID_COURSES.has(q.course)) errors.push(`invalid course: ${q.course}`);
  if (!VALID_DIFFICULTIES.has(q.difficulty)) errors.push(`invalid difficulty: ${q.difficulty} (expected F|M|C)`);
  if (!VALID_TYPES.has(q.type)) errors.push(`invalid type: ${q.type} (expected mc|spr)`);

  if (q.type === "mc") {
    if (!Array.isArray(q.choices) || q.choices.length !== 4) {
      errors.push(`mc question must have exactly 4 choices (got ${q.choices?.length})`);
    } else {
      const keys = q.choices.map((c) => c.key);
      if (JSON.stringify(keys) !== JSON.stringify(["A", "B", "C", "D"])) {
        errors.push(`mc choice keys must be [A,B,C,D] in order`);
      }
      q.choices.forEach((c, i) => {
        if (typeof c.text !== "string" || c.text.trim() === "") {
          errors.push(`choices[${i}] missing or empty text`);
        }
      });
      if (!["A", "B", "C", "D"].includes(q.correctAnswer)) {
        errors.push(`mc correctAnswer must be A|B|C|D (got "${q.correctAnswer}")`);
      }
    }
  }

  return errors;
}

// --- Main ---
async function main() {
  console.log(
    `seed-generated-questions starting. DRY_RUN=${DRY_RUN} SOURCE=${SOURCE_TAG} COURSE=${COURSE_FILTER ?? "(all)"}`
  );

  let files;
  try {
    files = readdirSync(DRAFTS_DIR).filter(
      (f) => f.endsWith(".reviewed.json") && !f.startsWith("_")
    );
  } catch (e) {
    console.error(`Cannot read ${DRAFTS_DIR}:`, e.message);
    process.exit(1);
  }

  // Filter by --course flag if provided
  if (COURSE_FILTER) {
    files = files.filter((f) => f.startsWith(`${COURSE_FILTER}__`));
  }

  console.log(`Found ${files.length} batch file(s) in ${DRAFTS_DIR}`);

  const validQuestions = [];
  const invalidQuestions = [];

  for (const file of files) {
    const path = join(DRAFTS_DIR, file);
    let arr;
    try {
      arr = JSON.parse(readFileSync(path, "utf8"));
    } catch (e) {
      invalidQuestions.push({ file, idx: null, error: `JSON parse error: ${e.message}` });
      continue;
    }
    if (!Array.isArray(arr)) {
      invalidQuestions.push({ file, idx: null, error: `expected top-level array` });
      continue;
    }
    arr.forEach((q, idx) => {
      const errors = validateQuestion(q, file, idx);
      if (errors.length > 0) {
        invalidQuestions.push({ file, idx, error: errors.join("; ") });
      } else {
        validQuestions.push({ file, q });
      }
    });
  }

  console.log(`\nValid questions: ${validQuestions.length}`);
  console.log(`Invalid questions: ${invalidQuestions.length}`);
  if (invalidQuestions.length > 0) {
    console.log(`\nFirst 10 invalid:`);
    for (const { file, idx, error } of invalidQuestions.slice(0, 10)) {
      console.log(`  ${file}[${idx}]: ${error}`);
    }
  }

  if (validQuestions.length === 0) {
    console.log(`\nNothing to write. Done.`);
    return;
  }

  // Print sample
  console.log(`\n--- Sample (first valid question) ---`);
  console.log(JSON.stringify(validQuestions[0].q, null, 2).slice(0, 600));
  console.log(`--- End sample ---\n`);

  if (DRY_RUN) {
    console.log(
      `DRY_RUN — no writes. Would append ${validQuestions.length} docs to questionPool/.`
    );
    return;
  }

  // Idempotency: fetch existing (course, skill, source, stem) tuples for this source
  console.log(`Fetching existing questionPool docs with source=${SOURCE_TAG}...`);
  const existingSnap = await db
    .collection("questionPool")
    .where("source", "==", SOURCE_TAG)
    .get();
  const existingKeys = new Set();
  for (const doc of existingSnap.docs) {
    const d = doc.data();
    existingKeys.add(`${d.course}|${d.skill}|${d.stem}`);
  }
  console.log(`Found ${existingKeys.size} existing docs with this source tag.`);

  const now = admin.firestore.FieldValue.serverTimestamp();
  const colRef = db.collection("questionPool");
  const BATCH_SIZE = 500;
  let written = 0;
  let skipped = 0;

  // Filter out already-existing first, then batch the remainder.
  // Also dedup within this run — parallel subagents can produce duplicate
  // (course, skill, stem) tuples that aren't yet in Firestore.
  const toWrite = [];
  const seenThisRun = new Set();
  let intraRunDupes = 0;
  for (const { q } of validQuestions) {
    const key = `${q.course}|${q.skill}|${q.stem}`;
    if (existingKeys.has(key)) {
      skipped += 1;
      continue;
    }
    if (seenThisRun.has(key)) {
      intraRunDupes += 1;
      continue;
    }
    seenThisRun.add(key);
    toWrite.push(q);
  }
  if (intraRunDupes > 0) {
    console.log(`Skipped ${intraRunDupes} intra-run duplicates.`);
  }

  for (let i = 0; i < toWrite.length; i += BATCH_SIZE) {
    const batch = db.batch();
    const slice = toWrite.slice(i, i + BATCH_SIZE);
    for (const q of slice) {
      const payload = {
        ...q,
        source: SOURCE_TAG,
        reviewedBy: "parker-critic",
        generatedAt: now,
        createdAt: now,
        updatedAt: now,
      };
      const docRef = colRef.doc(); // auto-generated id
      batch.set(docRef, payload);
    }
    await batch.commit();
    written += slice.length;
    console.log(`  Wrote ${written}/${toWrite.length}`);
  }

  console.log(`\nseed-generated-questions complete.`);
  console.log(`  Written: ${written}`);
  console.log(`  Skipped (already existed): ${skipped}`);
}

main().catch((e) => {
  console.error("seed-generated-questions failed:", e);
  process.exit(1);
});
