#!/usr/bin/env node
// Script to annotate all quiz/challenge questions with domain + skill metadata
// for the adaptive engine integration.

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const BASE = '/Users/lukemccarthy/pantherprep/app/(authenticated)/courses';

// ============================================================
// MODULE → DEFAULT DOMAIN/SKILL MAPPING
// ============================================================
// Each module maps to a default domain and a set of skills.
// The script will use the question's `type` field (if present) to refine the skill,
// falling back to the module's primary skill.

const MODULE_MAP = {
  // ── SAT MATH ──
  'sat-math/2': { domain: 'Algebra', skills: { default: 'linear_equations', '2A': 'linear_equations', '2B': 'linear_functions', '2C': 'systems_of_equations', '2D': 'linear_inequalities' } },
  'sat-math/3': { domain: 'Advanced Math', skills: { default: 'quadratic_equations', '3A': 'quadratic_equations', '3B': 'polynomial_operations', '3C': 'quadratic_formula' } },
  'sat-math/4': { domain: 'Advanced Math', skills: { default: 'exponential_functions', '4A': 'exponential_functions', '4B': 'radical_equations', '4C': 'rational_expressions' } },
  'sat-math/5': { domain: 'Problem Solving & Data', skills: { default: 'ratios_rates', '5A': 'ratios_rates', '5B': 'percentages', '5C': 'statistics_central_tendency', '5D': 'scatterplots', '5E': 'probability' } },
  // sat-math/6 already done
  'sat-math/7': { domain: 'Problem Solving & Data', skills: { default: 'scatterplots', '7A': 'linear_equations', '7B': 'quadratic_equations', '7C': 'scatterplots', '7D': 'linear_regression' } },
  'sat-math/8': { domain: 'Algebra', skills: { default: 'linear_equations' } },
  'sat-math/9': { domain: 'Algebra', skills: { default: 'linear_equations' } },
  'sat-math/10': { domain: 'Algebra', skills: { default: 'linear_equations' } },

  // ── SAT R&W ──
  'sat-rw/0': { domain: 'Information & Ideas', skills: { default: 'central_ideas' } },
  'sat-rw/1': { domain: 'Standard English Conventions', skills: { default: 'punctuation_boundaries', '1A': 'punctuation_boundaries', '1B': 'comma_usage', '1C': 'colon_usage' } },
  'sat-rw/2': { domain: 'Standard English Conventions', skills: { default: 'subject_verb_agreement', '2A': 'subject_verb_agreement', '2B': 'verb_tense', '2C': 'pronoun_clarity' } },
  'sat-rw/3': { domain: 'Standard English Conventions', skills: { default: 'modifiers', '3A': 'modifiers', '3B': 'parallelism', '3C': 'possessives' } },
  'sat-rw/5': { domain: 'Craft & Structure', skills: { default: 'vocabulary_in_context' } },
  'sat-rw/6': { domain: 'Craft & Structure', skills: { default: 'vocabulary_in_context' } },
  'sat-rw/7': { domain: 'Craft & Structure', skills: { default: 'text_structure', '7A': 'text_structure', '7B': 'purpose_function', '7C': 'cross_text_connections' } },
  'sat-rw/9': { domain: 'Information & Ideas', skills: { default: 'central_ideas', '9A': 'central_ideas', '9B': 'details_evidence' } },
  'sat-rw/10': { domain: 'Information & Ideas', skills: { default: 'inferences', '10A': 'inferences', '10B': 'details_evidence' } },
  'sat-rw/11': { domain: 'Information & Ideas', skills: { default: 'quantitative_evidence' } },
  'sat-rw/13': { domain: 'Expression of Ideas', skills: { default: 'transitions' } },
  'sat-rw/14': { domain: 'Expression of Ideas', skills: { default: 'rhetorical_synthesis' } },
  'sat-rw/15': { domain: 'Expression of Ideas', skills: { default: 'organization' } },
  'sat-rw/17': { domain: 'Information & Ideas', skills: { default: 'central_ideas' } },
  'sat-rw/18': { domain: 'Information & Ideas', skills: { default: 'central_ideas' } },

  // ── NMSQT MATH ──
  'nmsqt-math/2': { domain: 'Algebra', skills: { default: 'linear_equations', '2A': 'linear_equations', '2B': 'systems_of_equations', '2C': 'linear_inequalities' } },
  'nmsqt-math/3': { domain: 'Advanced Math', skills: { default: 'quadratic_equations', '3A': 'quadratic_equations', '3B': 'polynomial_operations', '3C': 'exponential_functions' } },
  'nmsqt-math/4': { domain: 'Problem Solving & Data', skills: { default: 'ratios_rates', '4A': 'ratios_rates', '4B': 'percentages', '4C': 'statistics_central_tendency', '4D': 'probability' } },
  'nmsqt-math/5': { domain: 'Geometry & Trig', skills: { default: 'triangles', '5A': 'triangles', '5B': 'circles', '5C': 'area_perimeter', '5D': 'right_triangle_trig' } },
  'nmsqt-math/6': { domain: 'Problem Solving & Data', skills: { default: 'scatterplots' } },
  'nmsqt-math/7': { domain: 'Algebra', skills: { default: 'linear_equations' } },
  'nmsqt-math/8': { domain: 'Algebra', skills: { default: 'linear_equations' } },

  // ── NMSQT R&W ──
  'nmsqt-rw/2': { domain: 'Standard English Conventions', skills: { default: 'punctuation_boundaries' } },
  'nmsqt-rw/3': { domain: 'Standard English Conventions', skills: { default: 'subject_verb_agreement', '3A': 'subject_verb_agreement', '3B': 'modifiers' } },
  'nmsqt-rw/4': { domain: 'Craft & Structure', skills: { default: 'vocabulary_in_context' } },
  'nmsqt-rw/5': { domain: 'Information & Ideas', skills: { default: 'central_ideas', '5A': 'central_ideas', '5B': 'inferences' } },
  'nmsqt-rw/6': { domain: 'Information & Ideas', skills: { default: 'details_evidence' } },
  'nmsqt-rw/7': { domain: 'Craft & Structure', skills: { default: 'text_structure', '7A': 'text_structure', '7B': 'purpose_function' } },
  'nmsqt-rw/8': { domain: 'Expression of Ideas', skills: { default: 'transitions', '8A': 'transitions', '8B': 'rhetorical_synthesis' } },
  'nmsqt-rw/9': { domain: 'Expression of Ideas', skills: { default: 'organization' } },
  'nmsqt-rw/10': { domain: 'Information & Ideas', skills: { default: 'central_ideas' } },
  'nmsqt-rw/11': { domain: 'Information & Ideas', skills: { default: 'central_ideas' } },
  'nmsqt-rw/12': { domain: 'Information & Ideas', skills: { default: 'central_ideas' } },

  // ── PSAT89 MATH ──
  'psat89-math/2': { domain: 'Algebra', skills: { default: 'linear_equations', '2A': 'linear_equations', '2B': 'systems_of_equations', '2C': 'linear_inequalities' } },
  'psat89-math/3': { domain: 'Advanced Math', skills: { default: 'quadratic_equations', '3A': 'quadratic_equations', '3B': 'exponential_functions' } },
  'psat89-math/4': { domain: 'Problem Solving & Data', skills: { default: 'ratios_rates', '4A': 'ratios_rates', '4B': 'percentages', '4C': 'statistics_central_tendency', '4D': 'probability' } },
  'psat89-math/5': { domain: 'Geometry & Trig', skills: { default: 'triangles', '5A': 'triangles', '5B': 'circles', '5C': 'area_perimeter' } },
  'psat89-math/6': { domain: 'Problem Solving & Data', skills: { default: 'scatterplots' } },
  'psat89-math/7': { domain: 'Algebra', skills: { default: 'linear_equations' } },
  'psat89-math/8': { domain: 'Algebra', skills: { default: 'linear_equations' } },

  // ── PSAT89 R&W ──
  'psat89-rw/2': { domain: 'Standard English Conventions', skills: { default: 'punctuation_boundaries' } },
  'psat89-rw/3': { domain: 'Standard English Conventions', skills: { default: 'subject_verb_agreement', '3A': 'subject_verb_agreement', '3B': 'verb_tense' } },
  'psat89-rw/4': { domain: 'Craft & Structure', skills: { default: 'vocabulary_in_context' } },
  'psat89-rw/5': { domain: 'Information & Ideas', skills: { default: 'central_ideas', '5A': 'central_ideas', '5B': 'details_evidence' } },
  'psat89-rw/6': { domain: 'Standard English Conventions', skills: { default: 'comma_usage' } },
  'psat89-rw/7': { domain: 'Craft & Structure', skills: { default: 'text_structure', '7A': 'text_structure', '7B': 'purpose_function' } },
  'psat89-rw/8': { domain: 'Expression of Ideas', skills: { default: 'transitions', '8A': 'transitions', '8B': 'rhetorical_synthesis' } },
  'psat89-rw/9': { domain: 'Information & Ideas', skills: { default: 'central_ideas' } },
  'psat89-rw/10': { domain: 'Information & Ideas', skills: { default: 'central_ideas' } },
};

// ============================================================
// CONTENT-BASED SKILL INFERENCE
// ============================================================
// For mixed/review/practice-test modules, infer skill from question stem content

const MATH_KEYWORD_SKILLS = [
  [/linear|slope|y\s*=\s*mx|intercept/i, 'linear_equations', 'Algebra'],
  [/system|simultaneous|two equations/i, 'systems_of_equations', 'Algebra'],
  [/inequalit/i, 'linear_inequalities', 'Algebra'],
  [/quadratic|parabola|x²|factor.*equation|vertex/i, 'quadratic_equations', 'Advanced Math'],
  [/polynom/i, 'polynomial_operations', 'Advanced Math'],
  [/exponential|growth.*decay|compound/i, 'exponential_functions', 'Advanced Math'],
  [/radical|√|square root/i, 'radical_equations', 'Advanced Math'],
  [/rational.*express|fraction.*variable/i, 'rational_expressions', 'Advanced Math'],
  [/ratio|rate|proportion|per\b/i, 'ratios_rates', 'Problem Solving & Data'],
  [/percent/i, 'percentages', 'Problem Solving & Data'],
  [/scatter/i, 'scatterplots', 'Problem Solving & Data'],
  [/regression|best fit|line of fit/i, 'linear_regression', 'Problem Solving & Data'],
  [/probab/i, 'probability', 'Problem Solving & Data'],
  [/mean|median|mode|average|standard deviation/i, 'statistics_central_tendency', 'Problem Solving & Data'],
  [/range|spread|quartile|IQR/i, 'statistics_spread', 'Problem Solving & Data'],
  [/two.way|contingency|table.*row.*column/i, 'two_way_tables', 'Problem Solving & Data'],
  [/triangle|angle.*sum|exterior angle|similar triangle/i, 'triangles', 'Geometry & Trig'],
  [/circle|radius|diameter|circumference|arc|sector/i, 'circles', 'Geometry & Trig'],
  [/area|perimeter/i, 'area_perimeter', 'Geometry & Trig'],
  [/volume|cylinder|cone|sphere|prism/i, 'volume', 'Geometry & Trig'],
  [/sin|cos|tan|SOH.*CAH|trig|radian/i, 'right_triangle_trig', 'Geometry & Trig'],
  [/coordinate.*geometry|distance.*formula|midpoint/i, 'coordinate_geometry', 'Geometry & Trig'],
  [/desmos|calculator|graph/i, 'scatterplots', 'Problem Solving & Data'],
];

const RW_KEYWORD_SKILLS = [
  [/punctuat|semicolon|colon|dash|boundary|run.on|comma splice|fragment/i, 'punctuation_boundaries', 'Standard English Conventions'],
  [/comma/i, 'comma_usage', 'Standard English Conventions'],
  [/colon/i, 'colon_usage', 'Standard English Conventions'],
  [/subject.*verb|verb.*agree|singular.*plural/i, 'subject_verb_agreement', 'Standard English Conventions'],
  [/verb.*tense|tense.*shift|past.*present/i, 'verb_tense', 'Standard English Conventions'],
  [/pronoun|antecedent|ambiguous.*reference/i, 'pronoun_clarity', 'Standard English Conventions'],
  [/modifier|dangling|misplaced/i, 'modifiers', 'Standard English Conventions'],
  [/parallel/i, 'parallelism', 'Standard English Conventions'],
  [/possessive|apostrophe|its.*it's/i, 'possessives', 'Standard English Conventions'],
  [/vocab|word.*context|most.*means|closest.*meaning|best.*replaces/i, 'vocabulary_in_context', 'Craft & Structure'],
  [/purpose|function|serves.*to|role.*of/i, 'purpose_function', 'Craft & Structure'],
  [/text.*structure|organiz.*passage/i, 'text_structure', 'Craft & Structure'],
  [/cross.*text|both.*passage|passage.*1.*passage.*2/i, 'cross_text_connections', 'Craft & Structure'],
  [/point.*view/i, 'point_of_view', 'Craft & Structure'],
  [/central.*idea|main.*idea|primarily|passage.*about/i, 'central_ideas', 'Information & Ideas'],
  [/detail|evidence|support|according.*passage/i, 'details_evidence', 'Information & Ideas'],
  [/infer|imply|suggest|most.*likely/i, 'inferences', 'Information & Ideas'],
  [/quantitative|graph.*data|chart|figure|table.*shows/i, 'quantitative_evidence', 'Information & Ideas'],
  [/transition|however|moreover|nevertheless|furthermore/i, 'transitions', 'Expression of Ideas'],
  [/rhetorical.*synth|combine|introduction.*paragraph|conclusion/i, 'rhetorical_synthesis', 'Expression of Ideas'],
];

function inferSkillFromContent(stem, isRW) {
  const keywords = isRW ? RW_KEYWORD_SKILLS : MATH_KEYWORD_SKILLS;
  for (const [pattern, skill, domain] of keywords) {
    if (pattern.test(stem)) {
      return { skill, domain };
    }
  }
  return null;
}

// ============================================================
// FILE PROCESSING
// ============================================================

function processFile(moduleKey, filePath) {
  let content = readFileSync(filePath, 'utf-8');
  const isRW = moduleKey.includes('-rw');
  const mapping = MODULE_MAP[moduleKey];

  if (!mapping) {
    console.log(`  SKIP: No mapping for ${moduleKey}`);
    return false;
  }

  let changeCount = 0;

  // Match quiz question objects that DON'T already have a domain field
  // We look for the pattern: { stem: "...", ... correct: N, ... }
  // and add domain + skill before the closing }

  // Strategy: find each question block in quiz: [...] and challenge: [...]
  // A question block starts with { and ends with },
  // We add domain/skill if not already present

  const questionBlockRegex = /\{\s*(?:passage\s*:.*?,\s*)?stem\s*:\s*(?:"[^"]*"|`[^`]*`)\s*,[\s\S]*?correct\s*:\s*\d+[\s\S]*?\}/g;

  content = content.replace(questionBlockRegex, (block) => {
    // Skip if already annotated
    if (block.includes('domain:') || block.includes('skill:')) {
      return block;
    }

    // Only process blocks that are inside quiz: or challenge: arrays
    // (Don't touch warmup questions)
    // We'll check this by looking at what comes before the match in the full content
    // Actually, since warmup questions have `source:` and no `type:`, we can check for that
    if (block.includes('source:')) {
      return block; // warmup question, skip
    }

    // Extract the type field if present
    const typeMatch = block.match(/type:\s*"([^"]*)"/);
    const typeVal = typeMatch ? typeMatch[1] : null;

    // Extract stem for content-based inference
    const stemMatch = block.match(/stem:\s*"([^"]*)"/);
    const stem = stemMatch ? stemMatch[1] : '';

    // Determine skill
    let skill = mapping.skills.default;
    let domain = mapping.domain;

    // Try type-based lookup first
    if (typeVal && mapping.skills[typeVal]) {
      skill = mapping.skills[typeVal];
    } else if (typeVal) {
      // Try with just the letter prefix (e.g., "6A" → "6A")
      const prefix = typeVal.replace(/[^A-Za-z0-9]/g, '');
      if (mapping.skills[prefix]) {
        skill = mapping.skills[prefix];
      }
    }

    // For mixed/review modules, try content-based inference
    if (skill === mapping.skills.default && stem) {
      const inferred = inferSkillFromContent(stem, isRW);
      if (inferred) {
        skill = inferred.skill;
        domain = inferred.domain;
      }
    }

    // Insert domain and skill before the last closing brace
    // Find where to insert - before the last }
    const lastBrace = block.lastIndexOf('}');
    const beforeBrace = block.substring(0, lastBrace).trimEnd();

    // Add comma if needed
    const needsComma = !beforeBrace.endsWith(',');
    const insertion = `${needsComma ? ',' : ''}\n      domain: "${domain}",\n      skill: "${skill}",`;

    changeCount++;
    return beforeBrace + insertion + '\n    }';
  });

  if (changeCount > 0) {
    writeFileSync(filePath, content);
    console.log(`  ✓ ${moduleKey}: annotated ${changeCount} questions`);
    return true;
  } else {
    console.log(`  - ${moduleKey}: no unannotated questions found`);
    return false;
  }
}

// ============================================================
// MAIN
// ============================================================

console.log('Annotating quiz questions with adaptive skill/domain metadata...\n');

let totalFiles = 0;
let totalAnnotated = 0;

for (const [moduleKey, mapping] of Object.entries(MODULE_MAP)) {
  const filePath = join(BASE, moduleKey, 'page.tsx');
  try {
    readFileSync(filePath);
    totalFiles++;
    if (processFile(moduleKey, filePath)) {
      totalAnnotated++;
    }
  } catch (e) {
    console.log(`  SKIP: ${moduleKey} (file not found)`);
  }
}

console.log(`\nDone! Annotated ${totalAnnotated} / ${totalFiles} module files.`);
