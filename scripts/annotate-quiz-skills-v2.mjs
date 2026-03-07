#!/usr/bin/env node
// V2: Line-based annotation - more robust for multiline question blocks
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const BASE = '/Users/lukemccarthy/pantherprep/app/(authenticated)/courses';

// ============================================================
// MODULE MAPPING
// ============================================================

const MODULE_MAP = {
  // SAT MATH
  'sat-math/2': { domain: 'Algebra', skills: { default: 'linear_equations', '2A': 'linear_equations', '2B': 'linear_functions', '2C': 'systems_of_equations', '2D': 'linear_inequalities' } },
  'sat-math/3': { domain: 'Advanced Math', skills: { default: 'quadratic_equations', '3A': 'quadratic_equations', '3B': 'polynomial_operations', '3C': 'quadratic_formula' } },
  'sat-math/4': { domain: 'Advanced Math', skills: { default: 'exponential_functions', '4A': 'exponential_functions', '4B': 'radical_equations', '4C': 'rational_expressions' } },
  'sat-math/5': { domain: 'Problem Solving & Data', skills: { default: 'ratios_rates', '5A': 'ratios_rates', '5B': 'percentages', '5C': 'statistics_central_tendency', '5D': 'scatterplots', '5E': 'probability' } },
  'sat-math/7': { domain: 'Problem Solving & Data', skills: { default: 'scatterplots' } },
  'sat-math/8': { domain: 'Algebra', skills: { default: 'linear_equations' } },
  'sat-math/9': { domain: 'Algebra', skills: { default: 'linear_equations' } },
  'sat-math/10': { domain: 'Algebra', skills: { default: 'linear_equations' } },
  // SAT R&W
  'sat-rw/0': { domain: 'Information & Ideas', skills: { default: 'central_ideas' } },
  'sat-rw/1': { domain: 'Standard English Conventions', skills: { default: 'punctuation_boundaries', 'Comma Splice': 'punctuation_boundaries', 'Semicolon': 'punctuation_boundaries', 'Colon': 'colon_usage', 'Comma': 'comma_usage', 'Run-On': 'punctuation_boundaries', 'Fragment': 'punctuation_boundaries', 'Dash': 'punctuation_boundaries' } },
  'sat-rw/2': { domain: 'Standard English Conventions', skills: { default: 'subject_verb_agreement', 'SVA': 'subject_verb_agreement', 'Tense': 'verb_tense', 'Pronoun': 'pronoun_clarity' } },
  'sat-rw/3': { domain: 'Standard English Conventions', skills: { default: 'modifiers', 'Modifier': 'modifiers', 'Dangling': 'modifiers', 'Parallelism': 'parallelism', 'Possessive': 'possessives' } },
  'sat-rw/5': { domain: 'Craft & Structure', skills: { default: 'vocabulary_in_context' } },
  'sat-rw/6': { domain: 'Craft & Structure', skills: { default: 'vocabulary_in_context' } },
  'sat-rw/7': { domain: 'Craft & Structure', skills: { default: 'text_structure', 'Structure': 'text_structure', 'Purpose': 'purpose_function', 'Cross-Text': 'cross_text_connections' } },
  'sat-rw/9': { domain: 'Information & Ideas', skills: { default: 'central_ideas', 'Central': 'central_ideas', 'Detail': 'details_evidence' } },
  'sat-rw/10': { domain: 'Information & Ideas', skills: { default: 'inferences' } },
  'sat-rw/11': { domain: 'Information & Ideas', skills: { default: 'quantitative_evidence' } },
  'sat-rw/13': { domain: 'Expression of Ideas', skills: { default: 'transitions' } },
  'sat-rw/14': { domain: 'Expression of Ideas', skills: { default: 'rhetorical_synthesis' } },
  'sat-rw/15': { domain: 'Expression of Ideas', skills: { default: 'organization' } },
  'sat-rw/17': { domain: 'Information & Ideas', skills: { default: 'central_ideas' } },
  'sat-rw/18': { domain: 'Information & Ideas', skills: { default: 'central_ideas' } },
  // NMSQT MATH
  'nmsqt-math/2': { domain: 'Algebra', skills: { default: 'linear_equations' } },
  'nmsqt-math/3': { domain: 'Advanced Math', skills: { default: 'quadratic_equations' } },
  'nmsqt-math/4': { domain: 'Problem Solving & Data', skills: { default: 'ratios_rates' } },
  'nmsqt-math/5': { domain: 'Geometry & Trig', skills: { default: 'triangles' } },
  'nmsqt-math/6': { domain: 'Problem Solving & Data', skills: { default: 'scatterplots' } },
  'nmsqt-math/7': { domain: 'Algebra', skills: { default: 'linear_equations' } },
  'nmsqt-math/8': { domain: 'Algebra', skills: { default: 'linear_equations' } },
  // NMSQT R&W
  'nmsqt-rw/2': { domain: 'Standard English Conventions', skills: { default: 'punctuation_boundaries' } },
  'nmsqt-rw/3': { domain: 'Standard English Conventions', skills: { default: 'subject_verb_agreement' } },
  'nmsqt-rw/4': { domain: 'Craft & Structure', skills: { default: 'vocabulary_in_context' } },
  'nmsqt-rw/5': { domain: 'Information & Ideas', skills: { default: 'central_ideas' } },
  'nmsqt-rw/6': { domain: 'Information & Ideas', skills: { default: 'details_evidence' } },
  'nmsqt-rw/7': { domain: 'Craft & Structure', skills: { default: 'text_structure' } },
  'nmsqt-rw/8': { domain: 'Expression of Ideas', skills: { default: 'transitions' } },
  'nmsqt-rw/9': { domain: 'Expression of Ideas', skills: { default: 'organization' } },
  'nmsqt-rw/10': { domain: 'Information & Ideas', skills: { default: 'central_ideas' } },
  'nmsqt-rw/11': { domain: 'Information & Ideas', skills: { default: 'central_ideas' } },
  'nmsqt-rw/12': { domain: 'Information & Ideas', skills: { default: 'central_ideas' } },
  // PSAT89 MATH
  'psat89-math/2': { domain: 'Algebra', skills: { default: 'linear_equations' } },
  'psat89-math/3': { domain: 'Advanced Math', skills: { default: 'quadratic_equations' } },
  'psat89-math/4': { domain: 'Problem Solving & Data', skills: { default: 'ratios_rates' } },
  'psat89-math/5': { domain: 'Geometry & Trig', skills: { default: 'triangles' } },
  'psat89-math/6': { domain: 'Problem Solving & Data', skills: { default: 'scatterplots' } },
  'psat89-math/7': { domain: 'Algebra', skills: { default: 'linear_equations' } },
  'psat89-math/8': { domain: 'Algebra', skills: { default: 'linear_equations' } },
  // PSAT89 R&W
  'psat89-rw/2': { domain: 'Standard English Conventions', skills: { default: 'punctuation_boundaries' } },
  'psat89-rw/3': { domain: 'Standard English Conventions', skills: { default: 'subject_verb_agreement' } },
  'psat89-rw/4': { domain: 'Craft & Structure', skills: { default: 'vocabulary_in_context' } },
  'psat89-rw/5': { domain: 'Information & Ideas', skills: { default: 'central_ideas' } },
  'psat89-rw/6': { domain: 'Standard English Conventions', skills: { default: 'comma_usage' } },
  'psat89-rw/7': { domain: 'Craft & Structure', skills: { default: 'text_structure' } },
  'psat89-rw/8': { domain: 'Expression of Ideas', skills: { default: 'transitions' } },
  'psat89-rw/9': { domain: 'Information & Ideas', skills: { default: 'central_ideas' } },
  'psat89-rw/10': { domain: 'Information & Ideas', skills: { default: 'central_ideas' } },
};

// Content-based skill inference for mixed/review modules
const MATH_PATTERNS = [
  [/linear|slope|y\s*=\s*mx|intercept/i, 'linear_equations', 'Algebra'],
  [/system|simultaneous/i, 'systems_of_equations', 'Algebra'],
  [/inequalit/i, 'linear_inequalities', 'Algebra'],
  [/quadratic|parabola|x²|factor|vertex/i, 'quadratic_equations', 'Advanced Math'],
  [/polynom/i, 'polynomial_operations', 'Advanced Math'],
  [/exponential|growth.*decay|compound/i, 'exponential_functions', 'Advanced Math'],
  [/radical|√|square root/i, 'radical_equations', 'Advanced Math'],
  [/rational/i, 'rational_expressions', 'Advanced Math'],
  [/ratio|rate|proportion/i, 'ratios_rates', 'Problem Solving & Data'],
  [/percent/i, 'percentages', 'Problem Solving & Data'],
  [/scatter/i, 'scatterplots', 'Problem Solving & Data'],
  [/probab/i, 'probability', 'Problem Solving & Data'],
  [/mean|median|average|standard dev/i, 'statistics_central_tendency', 'Problem Solving & Data'],
  [/triangle|angle.*sum/i, 'triangles', 'Geometry & Trig'],
  [/circle|radius|diameter|circumfer/i, 'circles', 'Geometry & Trig'],
  [/area|perimeter/i, 'area_perimeter', 'Geometry & Trig'],
  [/volume|cylinder|cone|sphere/i, 'volume', 'Geometry & Trig'],
  [/sin|cos|tan|trig|radian/i, 'right_triangle_trig', 'Geometry & Trig'],
];

const RW_PATTERNS = [
  [/punctuat|semicolon|comma splice|run.on|fragment|boundary/i, 'punctuation_boundaries', 'Standard English Conventions'],
  [/comma/i, 'comma_usage', 'Standard English Conventions'],
  [/colon/i, 'colon_usage', 'Standard English Conventions'],
  [/subject.*verb|verb.*agree/i, 'subject_verb_agreement', 'Standard English Conventions'],
  [/tense/i, 'verb_tense', 'Standard English Conventions'],
  [/pronoun/i, 'pronoun_clarity', 'Standard English Conventions'],
  [/modifier|dangling|misplaced/i, 'modifiers', 'Standard English Conventions'],
  [/parallel/i, 'parallelism', 'Standard English Conventions'],
  [/possessive|apostrophe/i, 'possessives', 'Standard English Conventions'],
  [/vocab|word.*context|most.*means/i, 'vocabulary_in_context', 'Craft & Structure'],
  [/purpose|function/i, 'purpose_function', 'Craft & Structure'],
  [/text.*structure/i, 'text_structure', 'Craft & Structure'],
  [/cross.*text|passage.*1.*passage.*2/i, 'cross_text_connections', 'Craft & Structure'],
  [/central.*idea|main.*idea|primarily/i, 'central_ideas', 'Information & Ideas'],
  [/evidence|support|according/i, 'details_evidence', 'Information & Ideas'],
  [/infer|imply|suggest/i, 'inferences', 'Information & Ideas'],
  [/transition|however|moreover/i, 'transitions', 'Expression of Ideas'],
  [/rhetorical|synth/i, 'rhetorical_synthesis', 'Expression of Ideas'],
];

function inferSkill(stem, passage, isRW) {
  const text = (stem || '') + ' ' + (passage || '');
  const patterns = isRW ? RW_PATTERNS : MATH_PATTERNS;
  for (const [re, skill, domain] of patterns) {
    if (re.test(text)) return { skill, domain };
  }
  return null;
}

// ============================================================
// PROCESSING
// ============================================================

function processFile(moduleKey, filePath) {
  const content = readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const isRW = moduleKey.includes('-rw');
  const mapping = MODULE_MAP[moduleKey];
  if (!mapping) return 0;

  // Track whether we're inside quiz: or challenge: arrays
  let inQuizArray = false;
  let inWarmupArray = false;
  let braceDepth = 0;
  let inQuestionBlock = false;
  let questionHasDomain = false;
  let questionType = null;
  let questionStem = '';
  let questionPassage = '';
  let questionBlockEnd = -1;
  let changeCount = 0;

  const newLines = [...lines];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Detect entering warmup array
    if (/^\s*warmup:\s*\[/.test(line)) {
      inWarmupArray = true;
    }
    // Detect leaving warmup array
    if (inWarmupArray && trimmed === '],') {
      inWarmupArray = false;
    }

    // Detect entering quiz/challenge array
    if (/^\s*(quiz|challenge):\s*\[/.test(line)) {
      inQuizArray = true;
      continue;
    }

    if (!inQuizArray) continue;

    // Detect end of quiz/challenge array
    if (trimmed === '],' || trimmed === '],') {
      if (braceDepth === 0) {
        inQuizArray = false;
        continue;
      }
    }

    // Track braces
    for (const ch of trimmed) {
      if (ch === '{') {
        if (braceDepth === 0) {
          inQuestionBlock = true;
          questionHasDomain = false;
          questionType = null;
          questionStem = '';
          questionPassage = '';
        }
        braceDepth++;
      }
      if (ch === '}') {
        braceDepth--;
        if (braceDepth === 0 && inQuestionBlock) {
          questionBlockEnd = i;
          inQuestionBlock = false;

          // This is the closing brace of a question block
          if (!questionHasDomain) {
            // Determine skill
            let skill = mapping.skills.default;
            let domain = mapping.domain;

            // Try type-based lookup
            if (questionType) {
              for (const [key, val] of Object.entries(mapping.skills)) {
                if (key !== 'default' && questionType.includes(key)) {
                  skill = val;
                  break;
                }
              }
            }

            // Try content-based inference for mixed modules
            const inferred = inferSkill(questionStem, questionPassage, isRW);
            if (inferred && (skill === mapping.skills.default)) {
              skill = inferred.skill;
              domain = inferred.domain;
            }

            // Insert domain and skill before the closing brace
            const indent = line.match(/^(\s*)/)?.[1] || '    ';
            const prevLine = newLines[i - 1]?.trimEnd() || '';
            const needsComma = !prevLine.endsWith(',');

            // Add comma to previous line if needed
            if (needsComma && i > 0) {
              newLines[i - 1] = newLines[i - 1].trimEnd() + ',';
            }

            // Insert domain and skill lines before the closing brace
            const insertLines = [
              `${indent}  domain: "${domain}",`,
              `${indent}  skill: "${skill}",`,
            ];
            newLines.splice(i, 0, ...insertLines);
            i += insertLines.length; // Skip past inserted lines
            changeCount++;
          }
        }
      }
    }

    if (inQuestionBlock) {
      // Check for existing domain/skill
      if (/domain:/.test(trimmed)) questionHasDomain = true;
      if (/skill:/.test(trimmed)) questionHasDomain = true;

      // Extract type
      const typeMatch = trimmed.match(/type:\s*"([^"]*)"/);
      if (typeMatch) questionType = typeMatch[1];

      // Extract stem
      const stemMatch = trimmed.match(/stem:\s*"(.*)"/);
      if (stemMatch) questionStem += stemMatch[1];

      // Extract passage
      const passageMatch = trimmed.match(/passage:\s*"(.*)"/);
      if (passageMatch) questionPassage += passageMatch[1];
      // Also capture continuation strings for multiline passages
      if (questionPassage && /^\s*"/.test(trimmed) && !stemMatch && !passageMatch) {
        questionPassage += trimmed.replace(/"/g, '');
      }
    }
  }

  if (changeCount > 0) {
    writeFileSync(filePath, newLines.join('\n'));
    console.log(`  ✓ ${moduleKey}: annotated ${changeCount} questions`);
  } else {
    console.log(`  - ${moduleKey}: no unannotated questions found`);
  }
  return changeCount;
}

// ============================================================
// MAIN
// ============================================================

console.log('V2: Annotating remaining quiz questions...\n');
let total = 0;

for (const moduleKey of Object.keys(MODULE_MAP)) {
  const filePath = join(BASE, moduleKey, 'page.tsx');
  try {
    readFileSync(filePath);
    total += processFile(moduleKey, filePath);
  } catch {
    // file not found, skip
  }
}

console.log(`\nDone! Annotated ${total} additional questions.`);
