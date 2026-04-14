#!/usr/bin/env node
// Seed script: reads drafts/skill-content/*.json, validates each, writes to
// Firestore skillContent/{taxonomyKey}. Strictly additive in the sense that
// skillContent is a new collection — no existing hand-authored docs exist
// to overwrite. Idempotent on re-run: a fresh write replaces the previous
// one only if the source tag matches.
//
// Usage:
//   GOOGLE_CLOUD_PROJECT=pantherprep-a5a73 node scripts/seed-skill-content.mjs --dry-run
//   GOOGLE_CLOUD_PROJECT=pantherprep-a5a73 node scripts/seed-skill-content.mjs --dry-run --source parker-gen-2026-04-14
//   GOOGLE_CLOUD_PROJECT=pantherprep-a5a73 node scripts/seed-skill-content.mjs --source parker-gen-2026-04-14

import admin from "firebase-admin";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
const SOURCE_TAG =
  args.find((a) => a.startsWith("--source="))?.split("=")[1] ??
  args[args.indexOf("--source") + 1] ??
  "parker-gen-2026-04-14";

const DRAFTS_DIR = "drafts/skill-content";

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});
const db = admin.firestore();

// --- Schema validation ---
function validateSkillContent(data, filename) {
  const errors = [];
  const required = [
    "taxonomyKey",
    "skillLabel",
    "domain",
    "conceptBlurb",
    "conceptExplanation",
    "workedExamples",
    "hintTemplates",
  ];
  for (const field of required) {
    if (data[field] === undefined || data[field] === null) {
      errors.push(`missing field: ${field}`);
    }
  }

  if (typeof data.conceptBlurb === "string") {
    const sentences = data.conceptBlurb.split(/[.!?]+\s/).filter(Boolean);
    if (sentences.length < 2 || sentences.length > 7) {
      errors.push(
        `conceptBlurb should be 3-5 sentences (got ~${sentences.length})`
      );
    }
  }

  if (Array.isArray(data.workedExamples)) {
    if (data.workedExamples.length < 2 || data.workedExamples.length > 3) {
      errors.push(
        `workedExamples should have 2-3 entries (got ${data.workedExamples.length})`
      );
    }
    data.workedExamples.forEach((ex, i) => {
      if (!ex.prompt || !ex.steps || !ex.answer || !ex.takeaway) {
        errors.push(`workedExamples[${i}] missing required sub-field`);
      }
      if (Array.isArray(ex.steps) && (ex.steps.length < 2 || ex.steps.length > 5)) {
        errors.push(
          `workedExamples[${i}].steps should have 2-5 entries (got ${ex.steps.length})`
        );
      }
    });
  }

  if (Array.isArray(data.hintTemplates) && data.hintTemplates.length !== 3) {
    errors.push(`hintTemplates should have exactly 3 entries (got ${data.hintTemplates.length})`);
  }

  return errors;
}

// --- Main ---
async function main() {
  console.log(`seed-skill-content starting. DRY_RUN=${DRY_RUN} SOURCE=${SOURCE_TAG}`);

  let files;
  try {
    files = readdirSync(DRAFTS_DIR).filter(
      (f) => f.endsWith(".json") && !f.startsWith("_")
    );
  } catch (e) {
    console.error(`Cannot read ${DRAFTS_DIR}:`, e.message);
    process.exit(1);
  }

  console.log(`Found ${files.length} draft file(s) in ${DRAFTS_DIR}`);

  const validDocs = [];
  const invalidFiles = [];

  for (const file of files) {
    const path = join(DRAFTS_DIR, file);
    let data;
    try {
      data = JSON.parse(readFileSync(path, "utf8"));
    } catch (e) {
      invalidFiles.push({ file, error: `JSON parse error: ${e.message}` });
      continue;
    }

    const errors = validateSkillContent(data, file);
    if (errors.length > 0) {
      invalidFiles.push({ file, error: errors.join("; ") });
      continue;
    }

    validDocs.push({ file, data });
  }

  console.log(`\nValid: ${validDocs.length}`);
  console.log(`Invalid: ${invalidFiles.length}`);
  if (invalidFiles.length > 0) {
    console.log(`\nInvalid files:`);
    for (const { file, error } of invalidFiles) {
      console.log(`  ${file}: ${error}`);
    }
  }

  if (validDocs.length === 0) {
    console.log(`\nNothing to write. Done.`);
    return;
  }

  // Print sample
  console.log(`\n--- Sample (first valid doc) ---`);
  console.log(JSON.stringify(validDocs[0].data, null, 2).slice(0, 800));
  console.log(`--- End sample ---\n`);

  if (DRY_RUN) {
    console.log(`DRY_RUN — no writes. Would write ${validDocs.length} docs to skillContent/.`);
    return;
  }

  const now = admin.firestore.FieldValue.serverTimestamp();
  const colRef = db.collection("skillContent");
  let written = 0;

  for (const { data } of validDocs) {
    const payload = {
      ...data,
      source: SOURCE_TAG,
      generatedAt: now,
      updatedAt: now,
    };
    await colRef.doc(data.taxonomyKey).set(payload, { merge: false });
    written += 1;
    console.log(`  Wrote skillContent/${data.taxonomyKey}`);
  }

  console.log(`\nseed-skill-content complete. Written: ${written}`);
}

main().catch((e) => {
  console.error("seed-skill-content failed:", e);
  process.exit(1);
});
