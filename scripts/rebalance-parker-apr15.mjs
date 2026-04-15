#!/usr/bin/env node
// Per-skill rebalance of correct-answer positions for the 19 (course, skill)
// groups in source=parker-gen-2026-04-15 that fail the per-position 15–35%
// rule. This is a correction pass for Parker's Spec C run on 2026-04-15.
//
// Sister script: scripts/rebalance-answer-positions.mjs (Apr 14 run, same trick).
//
// Algorithm:
//   1. Fetch all questionPool docs where source=parker-gen-2026-04-15 and type=mc
//      AND (course, skill) is in the 19-group allowlist below.
//   2. Group by (course, skill).
//   3. Sort each group's docs deterministically by doc.id.
//   4. Assign target positions round-robin: A, B, C, D, A, B, C, D, ... This
//      guarantees 5/5/5/5 at n=20 — every letter exactly 25%, all within
//      [15, 35]%.
//   5. For every question whose current correctAnswer != target, swap the text
//      of choices[current] and choices[target], update correctAnswer. Other
//      fields untouched.
//   6. Batched updateDoc writes (not set) — preserves all other fields + doc
//      IDs (critical for performanceLog integrity).
//
// Grade integrity safety rails:
//   - Source filter (parker-gen-2026-04-15) excludes parker-gen-2026-04-14 (2149
//     docs) and legacy (none) docs (588) — both read-only for this task.
//   - Allowlist filter excludes the 20 parker-gen-2026-04-15 groups that already
//     pass the rule — they are not touched.
//   - No doc deletions, no doc ID changes. updateDoc only.
//   - Stems, explanations, tags, course, skill — all untouched.
//
// Usage:
//   GOOGLE_CLOUD_PROJECT=pantherprep-a5a73 node scripts/rebalance-parker-apr15.mjs --dry-run
//   GOOGLE_CLOUD_PROJECT=pantherprep-a5a73 node scripts/rebalance-parker-apr15.mjs

import admin from "firebase-admin";

const SOURCE_TAG = "parker-gen-2026-04-15";
const KEYS = ["A", "B", "C", "D"];
const BATCH_SIZE = 400;

// The 19 failing (course, skill) groups from the Apr 15 audit.
// Every other parker-gen-2026-04-15 group is intentionally excluded.
const TARGET_GROUPS = [
  ["sat-rw", "point_of_view"],
  ["psat89-rw", "verb_tense"],
  ["psat89-rw", "parallelism"],
  ["sat-math", "expected_value"],
  ["sat-rw", "text_structure"],
  ["psat89-rw", "point_of_view"],
  ["nmsqt-rw", "text_structure"],
  ["nmsqt-rw", "organization"],
  ["nmsqt-math", "unit_conversion"],
  ["psat89-rw", "colon_usage"],
  ["nmsqt-rw", "subject_verb_agreement"],
  ["sat-rw", "organization"],
  ["psat89-rw", "subject_verb_agreement"],
  ["nmsqt-rw", "verb_tense"],
  ["psat89-rw", "possessives"],
  ["psat89-math", "unit_conversion"],
  ["psat89-math", "expected_value"],
  ["sat-rw", "subject_verb_agreement"],
  ["psat89-rw", "organization"],
];
const TARGET_SET = new Set(TARGET_GROUPS.map(([c, s]) => `${c}|${s}`));

const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");

if (!process.env.GOOGLE_CLOUD_PROJECT) {
  console.error("Set GOOGLE_CLOUD_PROJECT (e.g. pantherprep-a5a73)");
  process.exit(1);
}

admin.initializeApp({ credential: admin.credential.applicationDefault() });
const db = admin.firestore();

function rebuildChoices(choices, fromLetter, toLetter) {
  const fromIdx = KEYS.indexOf(fromLetter);
  const toIdx = KEYS.indexOf(toLetter);
  if (fromIdx === -1 || toIdx === -1) return null;
  if (fromIdx === toIdx) return choices;

  const next = choices.map((c) => ({ ...c }));
  const temp = next[fromIdx].text;
  next[fromIdx].text = next[toIdx].text;
  next[toIdx].text = temp;
  next.forEach((c, i) => {
    c.key = KEYS[i];
  });
  return next;
}

function validateChoices(choices) {
  if (!Array.isArray(choices) || choices.length !== 4) return false;
  for (let i = 0; i < 4; i++) {
    const c = choices[i];
    if (!c || typeof c.text !== "string" || c.text.length === 0) return false;
  }
  return true;
}

function formatDist(d) {
  return `A=${d.A} B=${d.B} C=${d.C} D=${d.D}`;
}

function inBounds(d, total) {
  const lo = Math.ceil(0.15 * total);
  const hi = Math.floor(0.35 * total);
  return KEYS.every((k) => d[k] >= lo && d[k] <= hi);
}

async function main() {
  console.log(
    `rebalance-parker-apr15  DRY_RUN=${DRY_RUN}  source=${SOURCE_TAG}  targets=${TARGET_GROUPS.length}`
  );

  const snap = await db
    .collection("questionPool")
    .where("source", "==", SOURCE_TAG)
    .get();

  console.log(`Fetched ${snap.size} docs tagged source=${SOURCE_TAG}`);

  const groups = new Map();
  let excludedByAllowlist = 0;
  let excludedByType = 0;
  let excludedByShape = 0;

  for (const doc of snap.docs) {
    const d = doc.data();
    if (d.type !== "mc") {
      excludedByType += 1;
      continue;
    }
    if (!KEYS.includes(d.correctAnswer)) {
      excludedByShape += 1;
      continue;
    }
    if (!validateChoices(d.choices)) {
      excludedByShape += 1;
      continue;
    }
    const key = `${d.course}|${d.skill}`;
    if (!TARGET_SET.has(key)) {
      excludedByAllowlist += 1;
      continue;
    }
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push({ id: doc.id, data: d });
  }

  console.log(
    `  excluded by allowlist: ${excludedByAllowlist}  by type: ${excludedByType}  by shape: ${excludedByShape}`
  );
  console.log(`  grouped into ${groups.size} target (course, skill) buckets`);

  if (groups.size !== TARGET_GROUPS.length) {
    console.error(
      `ERROR: expected ${TARGET_GROUPS.length} groups, got ${groups.size}. Aborting.`
    );
    for (const [c, s] of TARGET_GROUPS) {
      if (!groups.has(`${c}|${s}`)) console.error(`  missing: ${c}|${s}`);
    }
    process.exit(2);
  }

  // Compute plan + before/after distributions
  const plannedUpdates = [];
  let unchanged = 0;
  const perGroup = [];

  for (const [key, rows] of groups) {
    rows.sort((a, b) => a.id.localeCompare(b.id));
    const before = { A: 0, B: 0, C: 0, D: 0 };
    const after = { A: 0, B: 0, C: 0, D: 0 };
    for (const r of rows) before[r.data.correctAnswer] += 1;

    for (let i = 0; i < rows.length; i++) {
      const target = KEYS[i % 4];
      after[target] += 1;
      const current = rows[i].data.correctAnswer;
      if (current === target) {
        unchanged += 1;
        continue;
      }
      const newChoices = rebuildChoices(rows[i].data.choices, current, target);
      if (!newChoices) continue;
      // Sanity: the text that was at `current` should now be at `target`
      const originalCorrectText = rows[i].data.choices[KEYS.indexOf(current)].text;
      const newCorrectText = newChoices[KEYS.indexOf(target)].text;
      if (originalCorrectText !== newCorrectText) {
        console.error(
          `ERROR: rebuildChoices mangled doc ${rows[i].id} — correct text lost`
        );
        process.exit(3);
      }
      plannedUpdates.push({
        id: rows[i].id,
        key,
        from: current,
        to: target,
        newChoices,
      });
    }
    perGroup.push({ key, n: rows.length, before, after });
  }

  console.log(
    `\nPlanned: ${plannedUpdates.length} updates, ${unchanged} unchanged across ${groups.size} groups`
  );

  console.log(`\nPer-group before -> after:`);
  for (const g of perGroup) {
    const bOk = inBounds(g.before, g.n) ? "ok " : "BAD";
    const aOk = inBounds(g.after, g.n) ? "ok " : "BAD";
    console.log(
      `  ${g.key.padEnd(38)} n=${g.n}  before[${bOk}] ${formatDist(g.before)}   after[${aOk}] ${formatDist(g.after)}`
    );
    if (!inBounds(g.after, g.n)) {
      console.error(`ERROR: group ${g.key} still out of bounds after rebalance`);
      process.exit(4);
    }
  }

  if (DRY_RUN) {
    console.log("\nDRY RUN — no writes.");
    return;
  }

  if (plannedUpdates.length === 0) {
    console.log("\nNothing to write.");
    return;
  }

  const col = db.collection("questionPool");
  const now = admin.firestore.FieldValue.serverTimestamp();
  let written = 0;
  for (let i = 0; i < plannedUpdates.length; i += BATCH_SIZE) {
    const batch = db.batch();
    const slice = plannedUpdates.slice(i, i + BATCH_SIZE);
    for (const u of slice) {
      batch.update(col.doc(u.id), {
        choices: u.newChoices,
        correctAnswer: u.to,
        rebalancedAt: now,
        rebalancePass: "parker-apr15-correction",
        updatedAt: now,
      });
    }
    await batch.commit();
    written += slice.length;
    console.log(`  Wrote ${written}/${plannedUpdates.length}`);
  }
  console.log("\nrebalance-parker-apr15 complete.");
}

main().catch((e) => {
  console.error("rebalance failed:", e);
  process.exit(1);
});
