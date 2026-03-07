#!/usr/bin/env node
/**
 * Removes htmlSrc lines from all module page configs.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const COURSES_DIR = path.join(ROOT, "app", "(authenticated)", "courses");

let updated = 0;

const courses = fs.readdirSync(COURSES_DIR).filter((d) => {
  return fs.statSync(path.join(COURSES_DIR, d)).isDirectory() && !d.startsWith(".");
});

for (const course of courses) {
  const courseDir = path.join(COURSES_DIR, course);
  const modules = fs.readdirSync(courseDir).filter((d) => /^\d+$/.test(d));

  for (const modNum of modules) {
    const pagePath = path.join(courseDir, modNum, "page.tsx");
    if (!fs.existsSync(pagePath)) continue;

    let content = fs.readFileSync(pagePath, "utf8");
    if (!content.includes("htmlSrc:")) continue;

    // Remove the htmlSrc line
    content = content.replace(/\s*htmlSrc:\s*"[^"]+",?\s*\n/, "\n");
    fs.writeFileSync(pagePath, content);
    console.log(`  Cleaned: ${course}/${modNum}`);
    updated++;
  }
}

console.log(`\nDone: ${updated} files cleaned`);
