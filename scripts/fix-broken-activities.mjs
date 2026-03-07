/**
 * Fix broken activities JSX caused by the bad merge in generate-remaining.mjs.
 *
 * Problems:
 * 1. Double commas: ),,
 * 2. Broken onComplete: onComplete={() => {,
 * 3. Misplaced }} closings
 * 4. Import line collisions
 *
 * Strategy: Find the activities={{ block, extract all entries,
 * reconstruct proper JSX.
 */

import { readFileSync, writeFileSync, existsSync } from "fs";

const brokenFiles = [
  "nmsqt-math/2", "nmsqt-math/3", "nmsqt-math/4", "nmsqt-math/5",
  "nmsqt-math/6", "nmsqt-math/7",
  "nmsqt-rw/2", "nmsqt-rw/3", "nmsqt-rw/4", "nmsqt-rw/7",
  "psat89-math/2", "psat89-math/3", "psat89-math/4", "psat89-math/6",
  "psat89-rw/1", "psat89-rw/3", "psat89-rw/4", "psat89-rw/5",
  "psat89-rw/6", "psat89-rw/7", "psat89-rw/8", "psat89-rw/9",
  "sat-math/2", "sat-math/3", "sat-math/7",
  "sat-rw/1", "sat-rw/4", "sat-rw/5", "sat-rw/6", "sat-rw/8",
];

let fixed = 0;

for (const rel of brokenFiles) {
  const filePath = `app/(authenticated)/courses/${rel}/page.tsx`;
  if (!existsSync(filePath)) continue;

  let content = readFileSync(filePath, "utf8");
  const orig = content;

  // Fix 1: Fix broken import lines (import on same line as another import)
  // Pattern: "import { X } from "path";\nimport { Y..." inserted inside existing multi-line import
  content = content.replace(
    /^(import\s+\{)\s*\n(import\s+\{[^}]+\}\s+from\s+"[^"]+";)\s*\n\s*([^}]+\}\s+from)/gm,
    "$2\n$1\n  $3"
  );

  // Fix 2: Fix broken onComplete={() => {, (missing closing })
  // This happens when new entries are inserted after onComplete={() => {}
  content = content.replace(/onComplete=\{[^}]*\{,\s*\n/g, "onComplete={() => {}}\n          />\n        ),\n");

  // Fix 3: Fix double commas "),,"
  content = content.replace(/\),\s*,/g, "),");

  // Fix 4: Fix misplaced }} after activities — find activities block and reconstruct
  // Look for broken patterns like:
  //   />
  //   )
  // }}
  //   />
  // These indicate the }} from the old activities was left behind after the new entries
  content = content.replace(
    /\n\s*\)\s*\n\}\}\s*\n\s*\/>\s*\n\s*\)\s*,?\s*\n/g,
    "\n        )\n      }}\n"
  );

  // Fix 5: Fix orphaned /> and ) after }}
  content = content.replace(
    /\}\}\s*\n\s*\/>\s*\n\s*\)\s*,?\s*\n\s*(nextModuleHref|nextModuleLabel|\/\>)/g,
    "}}\n      $1"
  );

  // Fix 6: Clean up extra blank lines
  content = content.replace(/\n{3,}/g, "\n\n");

  if (content !== orig) {
    writeFileSync(filePath, content);
    console.log("Fixed:", rel);
    fixed++;
  } else {
    console.log("No changes:", rel);
  }
}

console.log(`\nFixed ${fixed} files`);
