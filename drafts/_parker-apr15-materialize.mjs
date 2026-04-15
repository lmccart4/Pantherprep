#!/usr/bin/env node
// Parker 2026-04-15 question materializer.
// Reads drafts/_parker-apr15-questions.json (a 13-skill catalog, each skill
// containing 3 per-test-type arrays of 20 MC questions) and writes the
// 39 per-course-per-skill *.reviewed.json batch files.
//
// Each source entry already carries the course/testType/section/domain/skill
// fields pre-filled. This script just splits the JSON blob into separate
// files and writes them out.

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";

const SRC = "drafts/_parker-apr15-questions.json";
const OUT_DIR = "drafts/question-batches";

const data = JSON.parse(readFileSync(SRC, "utf8"));

let fileCount = 0;
let qCount = 0;

for (const skill of Object.keys(data)) {
  for (const course of Object.keys(data[skill])) {
    const questions = data[skill][course];
    if (!Array.isArray(questions)) continue;
    const outPath = join(OUT_DIR, `${course}__${skill}.reviewed.json`);
    mkdirSync(dirname(outPath), { recursive: true });
    writeFileSync(outPath, JSON.stringify(questions, null, 2));
    fileCount += 1;
    qCount += questions.length;
  }
}

console.log(`Wrote ${fileCount} batch files, ${qCount} questions total.`);
