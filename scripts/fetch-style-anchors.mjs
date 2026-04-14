#!/usr/bin/env node
// One-off helper: fetches 3 mid-difficulty questions per (course, skill) combo
// from questionPool, writes to drafts/_style-anchors.json for wave 2 subagents
// to inline into their prompts. Sibling-course fallback if < 3 exist.

import admin from "firebase-admin";
import { writeFileSync } from "node:fs";

admin.initializeApp({ credential: admin.credential.applicationDefault() });
const db = admin.firestore();

async function main() {
  const snap = await db.collection("questionPool").get();

  // Group by (course, skill)
  const byCourseSkill = new Map();
  for (const doc of snap.docs) {
    const d = doc.data();
    const key = `${d.course}|${d.skill}`;
    if (!byCourseSkill.has(key)) byCourseSkill.set(key, []);
    byCourseSkill.get(key).push({
      course: d.course,
      skill: d.skill,
      difficulty: d.difficulty,
      type: d.type,
      stem: d.stem,
      choices: d.choices,
      correctAnswer: d.correctAnswer,
      explanation: d.explanation,
    });
  }

  // Sibling-course map: each math course falls back to any other math course;
  // each rw course falls back to any other rw course.
  const mathCourses = ["sat-math", "nmsqt-math", "psat89-math"];
  const rwCourses = ["sat-rw", "nmsqt-rw", "psat89-rw"];
  function siblings(course) {
    if (mathCourses.includes(course)) return mathCourses.filter((c) => c !== course);
    if (rwCourses.includes(course)) return rwCourses.filter((c) => c !== course);
    return [];
  }

  const taxonomyKeys = [
    "absolute_value","area_perimeter","circles","coordinate_geometry","exponential_functions",
    "linear_equations","linear_functions","linear_inequalities","linear_regression","percentages",
    "polynomial_operations","probability","quadratic_equations","quadratic_formula","radical_equations",
    "rational_expressions","ratios_rates","right_triangle_trig","scatterplots","statistics_central_tendency",
    "statistics_spread","systems_of_equations","triangles","two_way_tables","volume",
    "central_ideas","cross_text_connections","details_evidence","inferences","modifiers",
    "punctuation_boundaries","purpose_function","quantitative_evidence","rhetorical_synthesis",
    "transitions","vocabulary_in_context",
  ];
  const mathSkills = new Set(taxonomyKeys.slice(0, 25));

  const out = {};
  for (const course of [...mathCourses, ...rwCourses]) {
    for (const skill of taxonomyKeys) {
      const isMathCourse = mathCourses.includes(course);
      const isMathSkill = mathSkills.has(skill);
      if (isMathCourse !== isMathSkill) continue;

      const key = `${course}|${skill}`;
      const ownPool = byCourseSkill.get(key) ?? [];
      const medium = ownPool.filter((q) => q.difficulty === "M");
      let anchors = medium.slice(0, 3);
      if (anchors.length < 3) {
        const extras = ownPool.filter((q) => !anchors.includes(q)).slice(0, 3 - anchors.length);
        anchors = anchors.concat(extras);
      }
      if (anchors.length < 3) {
        for (const sib of siblings(course)) {
          const sibPool = byCourseSkill.get(`${sib}|${skill}`) ?? [];
          const sibMedium = sibPool.filter((q) => q.difficulty === "M");
          anchors = anchors.concat(sibMedium.slice(0, 3 - anchors.length));
          if (anchors.length >= 3) break;
        }
      }
      out[key] = anchors;
    }
  }

  writeFileSync("drafts/_style-anchors.json", JSON.stringify(out, null, 2));
  console.log(`Wrote style anchors for ${Object.keys(out).length} (course, skill) combos`);
  const thin = Object.entries(out).filter(([_, v]) => v.length < 3);
  console.log(`Combos with < 3 anchors (will generate from sibling-course-only context): ${thin.length}`);
  for (const [k, v] of thin.slice(0, 15)) console.log(`  ${k}: ${v.length}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
