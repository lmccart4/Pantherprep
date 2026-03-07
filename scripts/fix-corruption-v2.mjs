#!/usr/bin/env node
// V2: Fix remaining corruption - broken strings and stray commas
import { readFileSync, writeFileSync } from 'fs';

const BASE = '/Users/lukemccarthy/pantherprep/app/(authenticated)/courses';

const BROKEN_FILES = [
  'nmsqt-math/3', 'nmsqt-rw/2', 'nmsqt-rw/3', 'nmsqt-rw/9',
  'nmsqt-rw/10', 'nmsqt-rw/11', 'nmsqt-rw/12',
  'psat89-math/3', 'psat89-math/5', 'psat89-math/6', 'psat89-math/7', 'psat89-math/8',
  'sat-math/9', 'sat-rw/9', 'sat-rw/10',
];

function fixFile(filePath) {
  const content = readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const result = [];
  let fixes = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Pattern 1: Unterminated string - line has opening " but no closing "
    // e.g.: explanation: "$x^{3-1,
    //        followed by: }/y^{4-2} = x^2/y^2$.",
    if (i + 1 < lines.length) {
      // Count unescaped quotes on this line
      const quoteCount = (trimmed.match(/(?<!\\)"/g) || []).length;
      const singleQuoteStart = trimmed.match(/(?<!\\)'/g);

      // Check if line has an odd number of double quotes (unterminated)
      if (quoteCount % 2 === 1 && trimmed.endsWith(',')) {
        const nextTrimmed = lines[i + 1].trim();
        // Next line starts with } which is LaTeX continuation
        if (/^\}/.test(nextTrimmed)) {
          // Join: remove trailing comma from current, prepend next
          const fixed = line.trimEnd().slice(0, -1) + lines[i + 1].trim();
          result.push(fixed);
          fixes++;
          i++; // skip next line
          continue;
        }
      }
    }

    // Pattern 2: explanation:, (stray comma, value on next line)
    if (/^\s*(explanation)\s*:\s*,\s*$/.test(line) && i + 1 < lines.length) {
      // Remove the stray comma
      result.push(line.replace(/:\s*,/, ':'));
      fixes++;
      continue;
    }

    result.push(line);
  }

  if (fixes > 0) {
    writeFileSync(filePath, result.join('\n'));
    console.log(`  Fixed ${filePath.replace(BASE + '/', '')}: ${fixes} repairs`);
  }
  return fixes;
}

console.log('V2: Repairing broken strings and stray commas...\n');
let total = 0;
for (const mod of BROKEN_FILES) {
  const fp = `${BASE}/${mod}/page.tsx`;
  total += fixFile(fp);
}
console.log(`\nDone! ${total} repairs.`);
