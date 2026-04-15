#!/usr/bin/env node
// Parker 2026-04-15 question generator.
// Reads 13 skill data modules from drafts/_parker-apr15-data/*.mjs and writes
// 39 per-course batch files with shuffled answer positions.
//
// Each skill module exports:
//   {
//     skill, skillLabel, domain, section ('math'|'rw'),
//     batches: {
//       'sat-<section>': [ { stem, options: [4 strings], correct: 0-3, explanation, difficulty }, ... 20 ],
//       'nmsqt-<section>': [ ... 20 ],
//       'psat89-<section>': [ ... 20 ]
//     }
//   }
//
// The generator applies a deterministic Fisher-Yates shuffle to the 4 options
// of each question so answer positions come out balanced. Seeded per-file so
// rebuilds are stable.

import { writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";

const OUT_DIR = "drafts/question-batches";
const SOURCE_TAG = "parker-gen-2026-04-15";

function mulberry32(seed) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashString(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function shuffleChoices(optionsText, correctIdx, rnd) {
  const indices = [0, 1, 2, 3];
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  const newChoices = indices.map((oldIdx, newIdx) => ({
    key: ["A", "B", "C", "D"][newIdx],
    text: optionsText[oldIdx],
  }));
  const newCorrectIdx = indices.indexOf(correctIdx);
  return { choices: newChoices, correctAnswer: ["A", "B", "C", "D"][newCorrectIdx] };
}

import UNIT_CONVERSION from "./_parker-apr15-data/unit_conversion.mjs";
import EXPECTED_VALUE from "./_parker-apr15-data/expected_value.mjs";
import UNIT_CIRCLE from "./_parker-apr15-data/unit_circle.mjs";
import TEXT_STRUCTURE from "./_parker-apr15-data/text_structure.mjs";
import POINT_OF_VIEW from "./_parker-apr15-data/point_of_view.mjs";
import ORGANIZATION from "./_parker-apr15-data/organization.mjs";
import SUBJECT_VERB from "./_parker-apr15-data/subject_verb.mjs";
import PRONOUN_CLARITY from "./_parker-apr15-data/pronoun_clarity.mjs";
import PARALLELISM from "./_parker-apr15-data/parallelism.mjs";
import VERB_TENSE from "./_parker-apr15-data/verb_tense.mjs";
import COMMA_USAGE from "./_parker-apr15-data/comma_usage.mjs";
import COLON_USAGE from "./_parker-apr15-data/colon_usage.mjs";
import POSSESSIVES from "./_parker-apr15-data/possessives.mjs";

const SKILLS = [
  UNIT_CONVERSION,
  EXPECTED_VALUE,
  UNIT_CIRCLE,
  TEXT_STRUCTURE,
  POINT_OF_VIEW,
  ORGANIZATION,
  SUBJECT_VERB,
  PRONOUN_CLARITY,
  PARALLELISM,
  VERB_TENSE,
  COMMA_USAGE,
  COLON_USAGE,
  POSSESSIVES,
];

let fileCount = 0;
let qCount = 0;

for (const skill of SKILLS) {
  for (const course of Object.keys(skill.batches)) {
    const questions = skill.batches[course];
    if (questions.length !== 20) {
      console.warn(`WARN: ${skill.skill}/${course} has ${questions.length} questions (expected 20)`);
    }
    // Skill-specific seed suffix: some skills needed a rebalance pass to
    // get A/B/C/D within 15-35% on the full 60-question sample.
    const SEED_OVERRIDES = { unit_circle: "-v140", comma_usage: "-v33" };
    const seedSuffix = SEED_OVERRIDES[skill.skill] || "";
    const rnd = mulberry32(hashString(`${skill.skill}-${course}${seedSuffix}`));
    const testType = course.split("-")[0];
    const section = skill.section;
    const out = questions.map((q) => {
      const { choices, correctAnswer } = shuffleChoices(q.options, q.correct, rnd);
      return {
        course,
        testType,
        section,
        domain: skill.domain,
        skill: skill.skill,
        sourceSkill: skill.skillLabel,
        difficulty: q.difficulty,
        type: "mc",
        stem: q.stem,
        choices,
        correctAnswer,
        explanation: q.explanation,
        katex: q.katex ?? section === "math",
        tags: [SOURCE_TAG],
      };
    });
    const outPath = join(OUT_DIR, `${course}__${skill.skill}.reviewed.json`);
    mkdirSync(dirname(outPath), { recursive: true });
    writeFileSync(outPath, JSON.stringify(out, null, 2));
    fileCount += 1;
    qCount += out.length;
  }
}

console.log(`Parker 2026-04-15 generator wrote ${fileCount} files, ${qCount} questions total.`);
