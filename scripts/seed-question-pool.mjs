#!/usr/bin/env node
// Seed script: reads hardcoded questions.ts banks, transforms each question
// into a PoolQuestion via the skill-mapping table, writes to Firestore
// questionPool via admin SDK batched sets. Deterministic doc ids make
// re-runs idempotent.
//
// Usage:
//   GOOGLE_CLOUD_PROJECT=pantherprep-a5a73 npm run seed:pool -- --dry-run
//   GOOGLE_CLOUD_PROJECT=pantherprep-a5a73 npm run seed:pool -- --test-type=sat-math --dry-run
//   GOOGLE_CLOUD_PROJECT=pantherprep-a5a73 npm run seed:pool -- --test-type=sat-math
//   GOOGLE_CLOUD_PROJECT=pantherprep-a5a73 npm run seed:pool

import admin from "firebase-admin";

const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
const TEST_TYPE_ARG = args.find((a) => a.startsWith("--test-type="))?.split("=")[1];

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});
const db = admin.firestore();

// --- Import source question banks via tsx's TS-aware resolver ---
const diagnostics = {
  "sat-math":     { module: await import("../app/(authenticated)/diagnostics/sat-math/questions.ts"),     key: "QUESTIONS" },
  "sat-rw":       { module: await import("../app/(authenticated)/diagnostics/sat-rw/questions.ts"),       key: "QUESTIONS" },
  "nmsqt-math":   { module: await import("../app/(authenticated)/diagnostics/nmsqt-math/questions.ts"),   key: "QUESTIONS" },
  "nmsqt-rw":     { module: await import("../app/(authenticated)/diagnostics/nmsqt-rw/questions.ts"),     key: "QUESTIONS" },
  "psat89-math":  { module: await import("../app/(authenticated)/diagnostics/psat89-math/questions.ts"),  key: "QUESTIONS" },
  "psat89-rw":    { module: await import("../app/(authenticated)/diagnostics/psat89-rw/questions.ts"),    key: "QUESTIONS" },
};

const practiceBanks = {
  "sat":    await import("../app/(authenticated)/practice-tests/sat/questions.ts"),
  "nmsqt":  await import("../app/(authenticated)/practice-tests/nmsqt/questions.ts"),
  "psat89": await import("../app/(authenticated)/practice-tests/psat89/questions.ts"),
};

const { SKILL_MAP } = await import("./skill-mapping.ts");

// --- Transform helpers ---
function mapDifficulty(d) {
  if (d === "easy") return "F";
  if (d === "hard") return "C";
  return "M";
}

function normalizeChoices(q) {
  if (q.type === "spr") return [];
  if (!q.options) return [];
  const keys = ["A", "B", "C", "D", "E", "F"];
  return q.options
    .map((text, i) => ({ key: keys[i] ?? String(i), text }))
    .filter((c) => c.text !== "");
}

function detectKatex(q) {
  const haystack = [
    q.stem ?? "",
    q.explanation ?? "",
    ...Object.values(q.explanations ?? {}),
    q.passage ?? "",
  ].join(" ");
  return /\$[^$\n]+\$/.test(haystack);
}

function makeDocId(sourceTestType, sourceId) {
  return `${sourceTestType}__${sourceId}`;
}

function transformQuestion(q, sourceTestType) {
  const mapping = SKILL_MAP[q.skill];
  if (!mapping) {
    return { skipped: true, reason: "unmapped-skill", q };
  }

  const course = `${q.testType}-${q.section}`;
  const doc = {
    sourceTestType,
    sourceId: q.id,
    course,
    testType: q.testType,
    section: q.section,
    domain: mapping.domain,
    skill: mapping.taxonomyKey,
    sourceSkill: q.skill,
    difficulty: mapDifficulty(q.difficulty),
    type: q.type,
    stem: q.stem,
    choices: normalizeChoices(q),
    correctAnswer: q.correctAnswer,
    explanation: q.explanation,
    katex: detectKatex(q),
    tags: q.tags ?? [],
  };
  if (q.module != null) doc.module = q.module;
  if (q.passage) doc.passage = q.passage;
  if (q.explanations) doc.explanations = q.explanations;
  return { skipped: false, doc };
}

// --- Build the list of questions to process ---
function gatherQuestions() {
  const list = [];

  // Diagnostics
  for (const [courseKey, { module, key }] of Object.entries(diagnostics)) {
    if (TEST_TYPE_ARG && TEST_TYPE_ARG !== courseKey) continue;
    const sourceTestType = `${courseKey}-diagnostic`;
    const questions = module[key];
    for (const q of questions) list.push({ q, sourceTestType });
  }

  // Practice tests — RW_QUESTIONS and MATH_QUESTIONS exported as named arrays
  for (const [testType, mod] of Object.entries(practiceBanks)) {
    for (const [section, arrName] of [["rw", "RW_QUESTIONS"], ["math", "MATH_QUESTIONS"]]) {
      const courseKey = `${testType}-${section}`;
      if (TEST_TYPE_ARG && TEST_TYPE_ARG !== courseKey && TEST_TYPE_ARG !== `${testType}-practice`) continue;
      const sourceTestType = `${testType}-practice`;
      const questions = mod[arrName];
      if (!questions) continue;
      for (const q of questions) list.push({ q, sourceTestType });
    }
  }

  return list;
}

async function fetchExistingCreatedAt(docIds) {
  if (docIds.length === 0) return new Map();
  const map = new Map();
  const colRef = db.collection("questionPool");
  // Firestore getAll has a 500-doc limit per call
  const chunkSize = 500;
  for (let i = 0; i < docIds.length; i += chunkSize) {
    const chunk = docIds.slice(i, i + chunkSize);
    const refs = chunk.map((id) => colRef.doc(id));
    const snaps = await db.getAll(...refs);
    for (const snap of snaps) {
      if (snap.exists) {
        const data = snap.data();
        if (data.createdAt) map.set(snap.id, data.createdAt);
      }
    }
  }
  return map;
}

// --- Main ---
async function main() {
  console.log(`Seed starting. DRY_RUN=${DRY_RUN} TEST_TYPE=${TEST_TYPE_ARG ?? "(all)"}`);

  const all = gatherQuestions();
  console.log(`Gathered ${all.length} question(s) from source files.`);

  const transformed = [];
  const skipped = { unmappedSkill: [] };

  for (const { q, sourceTestType } of all) {
    const result = transformQuestion(q, sourceTestType);
    if (result.skipped) {
      skipped.unmappedSkill.push({ sourceTestType, id: q.id, skillString: q.skill });
      continue;
    }
    transformed.push({
      id: makeDocId(result.doc.sourceTestType, result.doc.sourceId),
      doc: result.doc,
    });
  }

  console.log(`Transformed: ${transformed.length}`);
  console.log(`Skipped (unmapped skill): ${skipped.unmappedSkill.length}`);
  if (skipped.unmappedSkill.length > 0) {
    console.log(`First 10 unmapped skills:`);
    skipped.unmappedSkill.slice(0, 10).forEach((s) => {
      console.log(`  ${s.sourceTestType}/${s.id}: "${s.skillString}"`);
    });
  }

  // Print a 3-doc sample for sanity
  console.log(`\n--- Sample (first 3 transformed docs) ---`);
  transformed.slice(0, 3).forEach((t) => {
    console.log(JSON.stringify({ id: t.id, ...t.doc }, null, 2));
  });
  console.log(`--- End sample ---\n`);

  if (DRY_RUN) {
    console.log(`DRY_RUN — no writes. Done.`);
    return;
  }

  // Fetch existing createdAt values so we don't clobber them
  const docIds = transformed.map((t) => t.id);
  console.log(`Fetching existing createdAt values for ${docIds.length} docs...`);
  const existingCreatedAt = await fetchExistingCreatedAt(docIds);
  console.log(`Found ${existingCreatedAt.size} existing docs; rest will be fresh creates.`);

  // Batch writes (500 per batch — Firestore limit)
  const now = admin.firestore.FieldValue.serverTimestamp();
  const colRef = db.collection("questionPool");
  const batchSize = 500;
  let written = 0;

  for (let i = 0; i < transformed.length; i += batchSize) {
    const batch = db.batch();
    const slice = transformed.slice(i, i + batchSize);
    for (const { id, doc } of slice) {
      const payload = {
        ...doc,
        createdAt: existingCreatedAt.get(id) ?? now,
        updatedAt: now,
      };
      batch.set(colRef.doc(id), payload);
    }
    await batch.commit();
    written += slice.length;
    console.log(`  Wrote ${written}/${transformed.length}`);
  }

  // Per-skill / per-course inventory summary
  const perCourse = {};
  const perSkill = {};
  for (const { doc } of transformed) {
    perCourse[doc.course] = (perCourse[doc.course] || 0) + 1;
    const key = `${doc.course}/${doc.skill}`;
    perSkill[key] = (perSkill[key] || 0) + 1;
  }

  console.log(`\nSeed complete.`);
  console.log(`  Total written: ${written}`);
  console.log(`  Per course:`);
  for (const [c, n] of Object.entries(perCourse).sort()) {
    console.log(`    ${c}: ${n}`);
  }
  console.log(`  Skills with < 3 questions (thin — flag for spec C):`);
  for (const [k, n] of Object.entries(perSkill).sort()) {
    if (n < 3) console.log(`    ⚠  ${k}: ${n}`);
  }
}

main().catch((e) => {
  console.error("Seed failed:", e);
  process.exit(1);
});
