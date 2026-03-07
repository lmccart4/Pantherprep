#!/usr/bin/env node
/**
 * Adds a "lesson" screen entry to MODULE_CONFIG.screens for all modules
 * that have htmlSrc but no lesson screen.
 * Inserts it after "welcome" and before warmup/exercises/quiz/challenge/complete.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const COURSES_DIR = path.join(ROOT, "app", "(authenticated)", "courses");

let updated = 0;
let skipped = 0;

const courses = fs.readdirSync(COURSES_DIR).filter((d) => {
  const stat = fs.statSync(path.join(COURSES_DIR, d));
  return stat.isDirectory() && !d.startsWith(".");
});

for (const course of courses) {
  const courseDir = path.join(COURSES_DIR, course);
  const modules = fs.readdirSync(courseDir).filter((d) => /^\d+$/.test(d));

  for (const modNum of modules) {
    const pagePath = path.join(courseDir, modNum, "page.tsx");
    if (!fs.existsSync(pagePath)) continue;

    let content = fs.readFileSync(pagePath, "utf8");

    // Skip if already has lesson screen
    if (content.includes('id: "lesson"')) {
      skipped++;
      continue;
    }

    // Skip if no htmlSrc
    if (!content.includes("htmlSrc:")) {
      skipped++;
      continue;
    }

    // Find the screens array and insert lesson after welcome
    // Pattern: after { id: "welcome", ... },
    const welcomePattern = /(\{ id: "welcome",\s*label: "[^"]+",\s*icon: "[^"]+" \},?\s*\n)/;
    const match = content.match(welcomePattern);

    if (match) {
      // Check if there's a warmup screen — if so, insert after warmup
      const warmupPattern = /(\{ id: "warmup",\s*label: "[^"]+",\s*icon: "[^"]+" \},?\s*\n)/;
      const warmupMatch = content.match(warmupPattern);

      if (warmupMatch) {
        // Insert lesson after warmup
        content = content.replace(warmupPattern, `$1    { id: "lesson", label: "Lesson", icon: "book" },\n`);
      } else {
        // Insert lesson after welcome
        content = content.replace(welcomePattern, `$1    { id: "lesson", label: "Lesson", icon: "book" },\n`);
      }

      fs.writeFileSync(pagePath, content);
      console.log(`  UPDATED: ${course}/${modNum}`);
      updated++;
    } else {
      console.log(`  SKIP (no welcome pattern): ${course}/${modNum}`);
      skipped++;
    }
  }
}

console.log(`\nDone: ${updated} updated, ${skipped} skipped`);
