// Run: npx tsx scripts/tests/skill-aggregation.test.mjs
// Exits non-zero on assertion failure.
import assert from "node:assert/strict";
import { getAggregatedSkillData } from "../../lib/skill-mapping.ts";

// Synthetic profile builder — only fills what the aggregator reads.
function profile(skillMap) {
  return {
    uid: "test",
    skills: Object.fromEntries(
      Object.entries(skillMap).map(([label, [correct, total]]) => [
        label,
        { correct, total, ease: 2.5, interval: 0, nextReview: "", errorPatterns: {}, lastSeen: null },
      ])
    ),
    domains: {},
    recommendations: [],
    weeklyStats: {},
  };
}

const KEY = "linear_equations";

// Case 1: empty profiles array
{
  const agg = getAggregatedSkillData([], KEY);
  assert.equal(agg.total, 0);
  assert.equal(agg.correct, 0);
  assert.equal(agg.mastery, 0);
}

// Case 2: single profile
{
  const p = profile({ "Linear equations in 1 variable": [4, 5] });
  const agg = getAggregatedSkillData([p], KEY);
  assert.equal(agg.total, 5);
  assert.equal(agg.correct, 4);
  assert.equal(agg.mastery, 0.8);
}

// Case 3: multi-profile across source labels that collapse to the same key
{
  const p1 = profile({ "Linear equations in 1 variable": [3, 4] });
  const p2 = profile({ "Linear equations":                [7, 10] });
  const p3 = profile({ "Multi-step equations":            [5, 6] });
  const agg = getAggregatedSkillData([p1, p2, p3], KEY);
  assert.equal(agg.total, 20);
  assert.equal(agg.correct, 15);
  assert.equal(agg.mastery, 0.75);
}

// Case 4: profiles missing the skill entirely
{
  const p1 = profile({ "Linear equations": [2, 2] });
  const p2 = profile({ "Percentages":      [0, 3] });
  const agg = getAggregatedSkillData([p1, p2], KEY);
  assert.equal(agg.total, 2);
  assert.equal(agg.correct, 2);
  assert.equal(agg.mastery, 1);
}

// Case 5: unknown taxonomy key
{
  const p = profile({ "Linear equations": [1, 1] });
  const agg = getAggregatedSkillData([p], "nonexistent_key");
  assert.equal(agg.total, 0);
}

console.log("skill-aggregation.test.mjs OK");
