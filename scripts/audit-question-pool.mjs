#!/usr/bin/env node
// Audit script: queries Firestore questionPool and prints an inventory
// grouped by course + skill + domain. Flags skills with < 3 questions so
// spec C (Parker content authoring) knows where to direct attention.
//
// Usage:
//   GOOGLE_CLOUD_PROJECT=pantherprep-a5a73 npm run audit:pool

import admin from "firebase-admin";

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});
const db = admin.firestore();

async function main() {
  const snap = await db.collection("questionPool").get();
  console.log(`=== questionPool inventory (pantherprep) ===`);
  console.log(`Total: ${snap.size} questions\n`);

  const byCourse = {};
  const byCourseSkill = {};
  const bySourceSkillPerCourse = {};

  for (const doc of snap.docs) {
    const d = doc.data();
    byCourse[d.course] = (byCourse[d.course] || 0) + 1;

    const cs = `${d.course}|${d.skill}`;
    if (!byCourseSkill[cs]) {
      byCourseSkill[cs] = { course: d.course, skill: d.skill, domain: d.domain, count: 0 };
    }
    byCourseSkill[cs].count += 1;

    const ss = `${d.course}|${d.sourceSkill}`;
    bySourceSkillPerCourse[ss] = (bySourceSkillPerCourse[ss] || 0) + 1;
  }

  console.log(`Per course:`);
  for (const [c, n] of Object.entries(byCourse).sort()) {
    console.log(`  ${c}: ${n}`);
  }

  console.log(`\nPer skill (weakest first per course):`);
  const courses = [...new Set(Object.values(byCourseSkill).map((r) => r.course))].sort();
  for (const course of courses) {
    const rows = Object.values(byCourseSkill)
      .filter((r) => r.course === course)
      .sort((a, b) => a.count - b.count);
    console.log(`  [${course}]`);
    for (const r of rows) {
      const flag = r.count < 3 ? "⚠  " : "   ";
      console.log(`    ${flag}${r.domain.padEnd(30)} ${r.skill.padEnd(30)} ${r.count}`);
    }
  }

  // Source-skill spread per course (detect undertagging)
  console.log(`\nSource-skill spread per course (low numbers = under-tagged):`);
  const sourceSpread = {};
  for (const key of Object.keys(bySourceSkillPerCourse)) {
    const [course] = key.split("|");
    sourceSpread[course] = (sourceSpread[course] || 0) + 1;
  }
  for (const [c, n] of Object.entries(sourceSpread).sort()) {
    console.log(`  ${c}: ${n} unique source-skill strings`);
  }

  // --- Answer-position distribution per (course, skill) with n >= 20 MC ---
  const distByCourseSkill = {};
  for (const doc of snap.docs) {
    const d = doc.data();
    if (d.type !== "mc") continue;
    if (!["A", "B", "C", "D"].includes(d.correctAnswer)) continue;
    const key = `${d.course}|${d.skill}`;
    if (!distByCourseSkill[key]) {
      distByCourseSkill[key] = { course: d.course, skill: d.skill, A: 0, B: 0, C: 0, D: 0, total: 0 };
    }
    distByCourseSkill[key][d.correctAnswer] += 1;
    distByCourseSkill[key].total += 1;
  }

  console.log(`\nAnswer-position distribution (groups with n >= 20 MC questions):`);
  console.log(`  Flagged if any letter > 35% or < 15% of total`);
  const flagged = [];
  const ok = [];
  for (const row of Object.values(distByCourseSkill)) {
    if (row.total < 20) continue;
    const pct = {
      A: row.A / row.total,
      B: row.B / row.total,
      C: row.C / row.total,
      D: row.D / row.total,
    };
    const suspicious =
      pct.A > 0.35 || pct.A < 0.15 ||
      pct.B > 0.35 || pct.B < 0.15 ||
      pct.C > 0.35 || pct.C < 0.15 ||
      pct.D > 0.35 || pct.D < 0.15;
    const line = `    ${row.course.padEnd(12)} ${row.skill.padEnd(30)} n=${row.total.toString().padStart(3)}  A=${row.A} B=${row.B} C=${row.C} D=${row.D}`;
    if (suspicious) flagged.push(line);
    else ok.push(line);
  }
  console.log(`  Flagged: ${flagged.length}`);
  console.log(`  OK:      ${ok.length}`);
  if (flagged.length > 0) {
    console.log(`\n  Flagged groups:`);
    for (const line of flagged) console.log(line);
  }
}

main().catch((e) => {
  console.error("Audit failed:", e);
  process.exit(1);
});
