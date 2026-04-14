#!/usr/bin/env node
// Post-processing shuffle for Parker-generated question batches. LLMs are
// notoriously bad at picking "random" answer positions — they cluster on A.
// This script reads each drafts/question-batches/*.json (not .reviewed.json —
// runs BEFORE critic), and for every MC question, mechanically shuffles the
// choices array so the correct answer lands in a uniformly random position.
// Choice bodies travel with their correctness — only position changes.
//
// Usage:
//   node scripts/shuffle-answer-positions.mjs
//   node scripts/shuffle-answer-positions.mjs --file drafts/question-batches/sat-math__linear_equations.json
//   node scripts/shuffle-answer-positions.mjs --dry-run

import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
const SINGLE_FILE = (() => {
  const eqForm = args.find((a) => a.startsWith("--file="))?.split("=")[1];
  if (eqForm) return eqForm;
  const idx = args.indexOf("--file");
  if (idx >= 0 && idx + 1 < args.length) return args[idx + 1];
  return null;
})();

const DRAFTS_DIR = "drafts/question-batches";
const KEYS = ["A", "B", "C", "D"];

function shuffleQuestion(q) {
  if (q.type !== "mc") return q;
  if (!Array.isArray(q.choices) || q.choices.length !== 4) return q;
  if (!KEYS.includes(q.correctAnswer)) return q;

  // Find the current correct-answer index and its text
  const currentCorrectIdx = KEYS.indexOf(q.correctAnswer);
  const correctText = q.choices[currentCorrectIdx].text;
  const distractors = q.choices
    .filter((_, i) => i !== currentCorrectIdx)
    .map((c) => c.text);

  // Pick a new random position for the correct answer (0-3 uniform)
  const newCorrectIdx = Math.floor(Math.random() * 4);

  // Place the correct answer at newCorrectIdx, fill the rest with distractors
  // in their original relative order.
  const newChoices = [];
  let dIdx = 0;
  for (let i = 0; i < 4; i++) {
    if (i === newCorrectIdx) {
      newChoices.push({ key: KEYS[i], text: correctText });
    } else {
      newChoices.push({ key: KEYS[i], text: distractors[dIdx++] });
    }
  }

  return {
    ...q,
    choices: newChoices,
    correctAnswer: KEYS[newCorrectIdx],
  };
}

function processFile(path) {
  const before = JSON.parse(readFileSync(path, "utf8"));
  if (!Array.isArray(before)) {
    return { path, error: "not an array" };
  }

  const mcBefore = before.filter((q) => q.type === "mc");
  const beforeDist = { A: 0, B: 0, C: 0, D: 0 };
  for (const q of mcBefore) {
    if (KEYS.includes(q.correctAnswer)) beforeDist[q.correctAnswer]++;
  }

  const after = before.map(shuffleQuestion);
  const mcAfter = after.filter((q) => q.type === "mc");
  const afterDist = { A: 0, B: 0, C: 0, D: 0 };
  for (const q of mcAfter) {
    if (KEYS.includes(q.correctAnswer)) afterDist[q.correctAnswer]++;
  }

  if (!DRY_RUN) {
    writeFileSync(path, JSON.stringify(after, null, 2));
  }

  return {
    path,
    total: before.length,
    mc: mcBefore.length,
    beforeDist,
    afterDist,
  };
}

function main() {
  let files;
  if (SINGLE_FILE) {
    files = [SINGLE_FILE.replace(/^.*drafts\/question-batches\//, "")];
  } else {
    try {
      files = readdirSync(DRAFTS_DIR).filter(
        (f) => f.endsWith(".json") && !f.endsWith(".reviewed.json") && !f.endsWith(".rejected.json") && !f.startsWith("_")
      );
    } catch (e) {
      console.error(`Cannot read ${DRAFTS_DIR}:`, e.message);
      process.exit(1);
    }
  }

  console.log(`shuffle-answer-positions: ${files.length} file(s), DRY_RUN=${DRY_RUN}`);

  const results = [];
  for (const file of files) {
    const path = SINGLE_FILE ?? join(DRAFTS_DIR, file);
    const r = processFile(path);
    results.push(r);
    if (r.error) {
      console.log(`  ERROR ${file}: ${r.error}`);
      continue;
    }
    console.log(
      `  ${file}  mc=${r.mc}  before=${JSON.stringify(r.beforeDist)}  after=${JSON.stringify(r.afterDist)}`
    );
  }

  // Aggregate distribution
  const agg = { A: 0, B: 0, C: 0, D: 0 };
  for (const r of results) {
    if (r.afterDist) {
      agg.A += r.afterDist.A;
      agg.B += r.afterDist.B;
      agg.C += r.afterDist.C;
      agg.D += r.afterDist.D;
    }
  }
  const totalMc = agg.A + agg.B + agg.C + agg.D;
  console.log(
    `\nAggregate post-shuffle distribution: ${JSON.stringify(agg)} (n=${totalMc})`
  );
  if (totalMc > 0) {
    const pct = {
      A: ((agg.A / totalMc) * 100).toFixed(1),
      B: ((agg.B / totalMc) * 100).toFixed(1),
      C: ((agg.C / totalMc) * 100).toFixed(1),
      D: ((agg.D / totalMc) * 100).toFixed(1),
    };
    console.log(`  Percentages: A=${pct.A}% B=${pct.B}% C=${pct.C}% D=${pct.D}%`);
  }
}

main();
