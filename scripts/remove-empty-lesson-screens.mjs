#!/usr/bin/env node
/**
 * Removes the lesson screen entry from modules that have no lesson content.
 * Only keeps it for modules that will have actual lessons.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const COURSES_DIR = path.join(ROOT, "app", "(authenticated)", "courses");

// Modules that HAVE lesson content (keep lesson screen for these)
const HAS_LESSONS = new Set([
  "psat89-rw/1",
  "psat89-rw/6",
  "sat-rw/1",
  "sat-rw/3",
  "sat-rw/9",
  "sat-rw/10",
  "sat-rw/11",
  "sat-rw/13",
  "sat-rw/14",
  "nmsqt-rw/2",
  "nmsqt-rw/6",
  "nmsqt-rw/7",
]);

let removed = 0;
let kept = 0;

const courses = fs.readdirSync(COURSES_DIR).filter((d) => {
  return fs.statSync(path.join(COURSES_DIR, d)).isDirectory() && !d.startsWith(".");
});

for (const course of courses) {
  const courseDir = path.join(COURSES_DIR, course);
  const modules = fs.readdirSync(courseDir).filter((d) => /^\d+$/.test(d));

  for (const modNum of modules) {
    const key = `${course}/${modNum}`;
    if (HAS_LESSONS.has(key)) {
      kept++;
      continue;
    }

    const pagePath = path.join(courseDir, modNum, "page.tsx");
    if (!fs.existsSync(pagePath)) continue;

    let content = fs.readFileSync(pagePath, "utf8");

    // Remove lesson screen line if present
    const lessonLine = /\s*\{ id: "lesson", label: "Lesson", icon: "book" \},?\s*\n/;
    if (lessonLine.test(content)) {
      content = content.replace(lessonLine, "\n");
      fs.writeFileSync(pagePath, content);
      console.log(`  Removed lesson screen: ${key}`);
      removed++;
    }
  }
}

console.log(`\nDone: ${removed} removed, ${kept} kept`);
