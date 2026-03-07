#!/usr/bin/env node
// Seed the Firestore questionPool collection from annotated module page.tsx files.
// Extracts quiz/challenge questions with domain/skill metadata.
//
// Usage: node scripts/seed-question-pool.mjs [--dry-run]
//
// Requires: GOOGLE_APPLICATION_CREDENTIALS or firebase-admin default credentials

import { readFileSync, readdirSync, statSync } from "fs";
import { join } from "path";

const DRY_RUN = process.argv.includes("--dry-run");
const BASE = join(import.meta.dirname, "../app/(authenticated)/courses");

// ---- Firebase Admin Init (lazy, only when writing) ----

let db;
async function initFirebase() {
  const { initializeApp, cert, applicationDefault } = await import("firebase-admin/app");
  const { getFirestore } = await import("firebase-admin/firestore");
  const credPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (credPath) {
    const cred = JSON.parse(readFileSync(credPath, "utf-8"));
    initializeApp({ credential: cert(cred) });
  } else {
    // Use Application Default Credentials or just project ID
    initializeApp({ projectId: "pantherprep-a5a73" });
  }
  db = getFirestore();
}

// ---- Find all module page.tsx files ----

function findPages(dir) {
  const results = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      results.push(...findPages(full));
    } else if (entry === "page.tsx") {
      results.push(full);
    }
  }
  return results;
}

// ---- Difficulty mapping ----

function mapDifficulty(d) {
  if (!d) return "M";
  const lower = d.toLowerCase();
  if (lower === "easy" || lower === "f") return "F";
  if (lower === "hard" || lower === "c") return "C";
  return "M";
}

// ---- Extract questions from a module file ----

function extractQuestions(filePath) {
  const content = readFileSync(filePath, "utf-8");
  const rel = filePath.replace(BASE + "/", "").replace("/page.tsx", "");
  const [course, moduleNum] = rel.split("/");
  const moduleId = `${course}/${moduleNum}`;

  // Find quiz: [ ... ] and challenge: [ ... ] arrays
  const questions = [];
  const lines = content.split("\n");

  let inArray = false;
  let arrayType = "";
  let braceDepth = 0;
  let bracketDepth = 0;
  let currentObj = "";
  let objDepth = 0;

  for (const line of lines) {
    // Detect quiz/challenge array start
    if (!inArray && /^\s*(quiz|challenge):\s*\[/.test(line)) {
      inArray = true;
      arrayType = line.match(/(quiz|challenge)/)[1];
      bracketDepth = 0;
      braceDepth = 0;
      currentObj = "";
      objDepth = 0;

      // Count brackets on this line
      for (const ch of line) {
        if (ch === "[") bracketDepth++;
        if (ch === "]") bracketDepth--;
      }
      continue;
    }

    if (!inArray) continue;

    // Track brackets
    for (const ch of line) {
      if (ch === "[") bracketDepth++;
      if (ch === "]") {
        bracketDepth--;
        if (bracketDepth <= 0) {
          inArray = false;
        }
      }
      if (ch === "{") {
        braceDepth++;
        if (braceDepth === 1) {
          currentObj = "";
          objDepth = 0;
        }
      }
      if (ch === "}") {
        braceDepth--;
      }
    }

    if (braceDepth >= 1 || line.trim().startsWith("}")) {
      currentObj += line + "\n";
    }

    // End of top-level object
    if (braceDepth === 0 && currentObj.trim()) {
      const obj = parseQuestionObject(currentObj);
      if (obj && obj.domain && obj.skill) {
        questions.push({
          course,
          moduleId,
          domain: obj.domain,
          skill: obj.skill,
          difficulty: mapDifficulty(obj.difficulty),
          questionText: obj.stem || obj.passage || "",
          choices: (obj.choices || []).map((c, i) => ({
            key: String.fromCharCode(65 + i),
            text: c,
          })),
          correctAnswer: String.fromCharCode(65 + (obj.correct ?? 0)),
          explanation: obj.explanation || "",
          trapType: obj.trap || null,
          katex: /\$/.test(obj.stem || "") || (obj.choices || []).some((c) => /\$/.test(c)),
        });
      }
      currentObj = "";
    }

    if (!inArray) break;
  }

  return questions;
}

// ---- Parse a question object string to extract fields ----

function parseQuestionObject(objStr) {
  const result = {};

  // Extract simple string fields
  const simpleFields = ["stem", "explanation", "difficulty", "type", "trap", "domain", "skill"];
  for (const field of simpleFields) {
    // Match: field: "value" or field: 'value' (possibly multiline with continuation)
    const regex = new RegExp(`${field}:\\s*(?:"([^"]*(?:\\\\.[^"]*)*)"|'([^']*(?:\\\\.[^']*)*)')`, "s");
    const match = objStr.match(regex);
    if (match) {
      result[field] = match[1] ?? match[2];
    }

    // Also try multiline: field:\n "value" or field:\n 'value'
    if (!result[field]) {
      const multiRegex = new RegExp(`${field}:\\s*\\n\\s*(?:"([^"]*(?:\\\\.[^"]*)*)"|'([^']*(?:\\\\.[^']*)*)')`, "s");
      const multiMatch = objStr.match(multiRegex);
      if (multiMatch) {
        result[field] = multiMatch[1] ?? multiMatch[2];
      }
    }
  }

  // Extract passage (may be very long, multiline)
  const passageMatch = objStr.match(/passage:\s*\n?\s*(?:"([\s\S]*?)(?<!\\)"|'([\s\S]*?)(?<!\\)')/);
  if (passageMatch) {
    result.passage = passageMatch[1] ?? passageMatch[2];
  }

  // Extract correct: N
  const correctMatch = objStr.match(/correct:\s*(\d+)/);
  if (correctMatch) {
    result.correct = parseInt(correctMatch[1]);
  }

  // Extract choices array
  const choicesMatch = objStr.match(/choices:\s*\[([\s\S]*?)\]/);
  if (choicesMatch) {
    const choicesStr = choicesMatch[1];
    const choices = [];
    // Match quoted strings within the choices array
    const quoteRegex = /(?:"([^"]*(?:\\.[^"]*)*)"|'([^']*(?:\\.[^']*)*)')/g;
    let m;
    while ((m = quoteRegex.exec(choicesStr)) !== null) {
      choices.push(m[1] ?? m[2]);
    }
    result.choices = choices;
  }

  return result;
}

// ---- Main ----

async function main() {
  console.log(`Extracting questions from module files...\n`);

  const pages = findPages(BASE);
  let allQuestions = [];

  for (const page of pages) {
    const questions = extractQuestions(page);
    if (questions.length > 0) {
      const rel = page.replace(BASE + "/", "").replace("/page.tsx", "");
      console.log(`  ${rel}: ${questions.length} questions`);
      allQuestions.push(...questions);
    }
  }

  console.log(`\nTotal: ${allQuestions.length} questions extracted.`);

  if (DRY_RUN) {
    console.log("\n[DRY RUN] No data written. Sample:");
    console.log(JSON.stringify(allQuestions.slice(0, 3), null, 2));
    return;
  }

  await initFirebase();

  // Write to Firestore in batches of 500
  console.log("\nWriting to Firestore questionPool collection...");
  const BATCH_SIZE = 500;
  let written = 0;

  for (let i = 0; i < allQuestions.length; i += BATCH_SIZE) {
    const batch = db.batch();
    const slice = allQuestions.slice(i, i + BATCH_SIZE);

    for (const q of slice) {
      const ref = db.collection("questionPool").doc();
      batch.set(ref, q);
    }

    await batch.commit();
    written += slice.length;
    console.log(`  Written ${written}/${allQuestions.length}`);
  }

  console.log(`\nDone! Seeded ${written} questions to questionPool.`);
}

main().catch(console.error);
