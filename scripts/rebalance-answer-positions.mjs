#!/usr/bin/env node
// Per-skill rebalance of correct-answer positions in questionPool for Parker-
// generated questions. The initial shuffle script used Math.random() which
// balanced A/B/C/D in aggregate but left per-skill groups clustered (e.g.
// sat-rw/modifiers had B=42.5% out of 20). This script fixes that in place.
//
// Algorithm:
//   1. Fetch all questionPool docs where source=parker-gen-2026-04-14 and type=mc
//   2. Group by (course, skill)
//   3. For each group, sort deterministically by doc.id and assign target
//      positions round-robin: A, B, C, D, A, B, C, D, ... This guarantees
//      each letter gets floor(n/4) or ceil(n/4) questions — as balanced as
//      possible.
//   4. For every question whose current correctAnswer ≠ target, swap the text
//      of choices[current] and choices[target], update correctAnswer.
//   5. Batched update() writes (not set) — preserves all other fields.
//
// Grade integrity: only choices[].text rearranged and correctAnswer updated.
// No doc IDs change, no docs deleted, stems untouched. All changes reversible
// by re-running a different algorithm (audit tags every change in a report).
//
// Usage:
//   GOOGLE_CLOUD_PROJECT=pantherprep-a5a73 node scripts/rebalance-answer-positions.mjs --dry-run
//   GOOGLE_CLOUD_PROJECT=pantherprep-a5a73 node scripts/rebalance-answer-positions.mjs

import admin from "firebase-admin";

const SOURCE_TAG = "parker-gen-2026-04-14";
const KEYS = ["A", "B", "C", "D"];
const BATCH_SIZE = 400;

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

async function main() {
  console.log(`rebalance-answer-positions  DRY_RUN=${DRY_RUN}  source=${SOURCE_TAG}`);

  const snap = await db
    .collection("questionPool")
    .where("source", "==", SOURCE_TAG)
    .get();

  console.log(`Fetched ${snap.size} docs tagged source=${SOURCE_TAG}`);

  const groups = new Map();
  for (const doc of snap.docs) {
    const d = doc.data();
    if (d.type !== "mc") continue;
    if (!KEYS.includes(d.correctAnswer)) continue;
    if (!validateChoices(d.choices)) continue;
    const key = `${d.course}|${d.skill}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push({ id: doc.id, data: d });
  }

  console.log(`Grouped into ${groups.size} (course, skill) buckets`);

  const plannedUpdates = [];
  let unchanged = 0;

  for (const [key, rows] of groups) {
    rows.sort((a, b) => a.id.localeCompare(b.id));
    for (let i = 0; i < rows.length; i++) {
      const target = KEYS[i % 4];
      const current = rows[i].data.correctAnswer;
      if (current === target) {
        unchanged += 1;
        continue;
      }
      const newChoices = rebuildChoices(rows[i].data.choices, current, target);
      if (!newChoices) continue;
      plannedUpdates.push({
        id: rows[i].id,
        key,
        from: current,
        to: target,
        newChoices,
      });
    }
  }

  console.log(`Planned: ${plannedUpdates.length} updates, ${unchanged} unchanged`);

  const beforeDist = { A: 0, B: 0, C: 0, D: 0 };
  const afterDist = { A: 0, B: 0, C: 0, D: 0 };
  for (const rows of groups.values()) {
    for (const r of rows) beforeDist[r.data.correctAnswer] += 1;
  }
  for (const rows of groups.values()) {
    for (let i = 0; i < rows.length; i++) afterDist[KEYS[i % 4]] += 1;
  }
  const total = beforeDist.A + beforeDist.B + beforeDist.C + beforeDist.D;
  const pct = (d) => ((d / total) * 100).toFixed(1);
  console.log(
    `\nAggregate before: A=${pct(beforeDist.A)}% B=${pct(beforeDist.B)}% C=${pct(beforeDist.C)}% D=${pct(beforeDist.D)}%`
  );
  console.log(
    `Aggregate after:  A=${pct(afterDist.A)}% B=${pct(afterDist.B)}% C=${pct(afterDist.C)}% D=${pct(afterDist.D)}%`
  );

  // Per-group worst case
  let worstGroup = null;
  let worstPct = 0;
  for (const [key, rows] of groups) {
    const dist = { A: 0, B: 0, C: 0, D: 0 };
    for (let i = 0; i < rows.length; i++) dist[KEYS[i % 4]] += 1;
    const mx = Math.max(...KEYS.map((k) => dist[k] / rows.length));
    if (mx > worstPct) {
      worstPct = mx;
      worstGroup = { key, n: rows.length, dist };
    }
  }
  if (worstGroup) {
    console.log(
      `Worst post-rebalance group: ${worstGroup.key}  n=${worstGroup.n}  ${JSON.stringify(worstGroup.dist)}  max=${(worstPct * 100).toFixed(1)}%`
    );
  }

  if (DRY_RUN) {
    console.log("\nDRY RUN — no writes.");
    return;
  }

  if (plannedUpdates.length === 0) {
    console.log("Nothing to do.");
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
        updatedAt: now,
      });
    }
    await batch.commit();
    written += slice.length;
    console.log(`  Wrote ${written}/${plannedUpdates.length}`);
  }
  console.log("\nrebalance-answer-positions complete.");
}

main().catch((e) => {
  console.error("rebalance failed:", e);
  process.exit(1);
});
