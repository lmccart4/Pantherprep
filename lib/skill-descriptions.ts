// Short one-line skill descriptions used by the skill catalog and detail pages.
// These are placeholders until spec C (Parker authoring pipeline) replaces
// them with rich concept content. If a skill key isn't present here, the
// detail page renders a generic "No description yet" fallback.

export const SKILL_DESCRIPTIONS: Record<string, string> = {
  // ==== MATH — Algebra ====
  linear_equations: "Solve and graph linear equations in one or two variables, including word-problem setups and special-case identity/no-solution forms.",
  linear_functions: "Interpret slope, intercepts, and rate of change. Write equations from points or graphs. Identify parallel and perpendicular lines.",
  linear_inequalities: "Solve and graph inequalities in one or two variables, including system constraints and feasible regions.",
  systems_of_equations: "Solve systems of two linear equations by substitution, elimination, or graphing. Recognize no-solution and infinite-solution cases.",
  absolute_value: "Solve absolute value equations and inequalities. Understand the geometric interpretation of distance from a point.",

  // ==== MATH — Advanced Math ====
  quadratic_equations: "Factor, use the quadratic formula, and complete the square. Recognize vertex, factored, and standard forms. Work with the discriminant to predict root behavior.",
  quadratic_formula: "Apply the quadratic formula to non-factorable quadratics. Interpret the discriminant.",
  polynomial_operations: "Add, subtract, multiply, factor, and divide polynomials. Work with FOIL, difference of squares, and polynomial long division.",
  exponential_functions: "Work with exponential growth and decay. Interpret base, growth rate, and initial value in context. Solve equations with exponents.",
  radical_equations: "Solve equations with square roots and other radicals. Identify extraneous solutions introduced by squaring.",
  rational_expressions: "Simplify, multiply, divide, add, and subtract rational expressions. Solve rational equations and interpret domain restrictions.",

  // ==== MATH — Problem Solving & Data ====
  ratios_rates: "Work with ratios, unit rates, proportions, and scaling. Apply to mixture, speed, and word-problem setups.",
  percentages: "Calculate percent change, percent of a whole, and sequential percent operations. Interpret percent in real-world contexts.",
  unit_conversion: "Convert between units using conversion factors and dimensional analysis. Common SAT contexts include distance, time, and rates.",
  scatterplots: "Interpret scatterplots, identify trends, estimate lines of best fit, and read off specific data points.",
  linear_regression: "Read and interpret linear regression output. Use r² to assess fit. Distinguish correlation from causation.",
  probability: "Calculate simple and compound probabilities. Work with independent and mutually exclusive events. Interpret two-way tables.",
  statistics_central_tendency: "Compute and interpret mean, median, and mode. Understand how outliers affect each measure.",
  statistics_spread: "Work with range, standard deviation, margin of error, and confidence intervals. Interpret spread in real-world contexts.",
  two_way_tables: "Read two-way frequency tables. Calculate conditional and joint probabilities from table data.",
  expected_value: "Calculate expected value for discrete random variables in game and decision-making contexts.",

  // ==== MATH — Geometry & Trig ====
  area_perimeter: "Calculate area and perimeter of polygons and composite figures. Apply to real-world measurement problems.",
  volume: "Calculate the volume of prisms, cylinders, cones, pyramids, and spheres. Work with composite solids.",
  triangles: "Apply triangle angle-sum, similarity, and congruence. Work with special right triangles (30-60-90, 45-45-90). Includes area ratios of similar figures.",
  circles: "Work with circumference, arc length, sector area, and the standard form of a circle's equation. Complete the square to rewrite general forms.",
  coordinate_geometry: "Apply the distance, midpoint, and slope formulas. Interpret linear equations on the coordinate plane. Recognize parallel and perpendicular relationships.",
  right_triangle_trig: "Apply SOH-CAH-TOA. Use the Pythagorean theorem. Work with angles of elevation and depression.",
  unit_circle: "Understand radian measure and the unit circle. Evaluate trig functions at standard angles.",

  // ==== R&W — Information & Ideas ====
  central_ideas: "Identify main ideas and supporting details in a passage. Distinguish claims from evidence.",
  details_evidence: "Find specific details that support or weaken a claim. Choose the quote that best supports a given argument.",
  inferences: "Draw logical inferences from text. Recognize what the passage implies without stating directly.",
  quantitative_evidence: "Interpret data presented in tables, charts, or graphs embedded in a passage. Connect quantitative claims to textual arguments.",
  text_structure: "Recognize how a passage is organized: chronological, compare-contrast, cause-effect, problem-solution, and others.",

  // ==== R&W — Craft & Structure ====
  vocabulary_in_context: "Determine the precise meaning of a word as used in context. Distinguish connotation from denotation.",
  purpose_function: "Identify the author's purpose for a specific sentence, paragraph, or passage. Recognize rhetorical function.",
  cross_text_connections: "Compare claims, evidence, or reasoning across two related passages.",
  point_of_view: "Identify the perspective or stance of an author or character. Recognize how perspective shapes argument.",

  // ==== R&W — Expression of Ideas ====
  transitions: "Choose transition words and phrases that clarify the relationship between sentences or paragraphs.",
  rhetorical_synthesis: "Combine evidence from multiple sources into a coherent summary that serves a specified rhetorical goal.",
  organization: "Recognize and improve the organization of a passage. Rearrange sentences or paragraphs for logical flow.",

  // ==== R&W — Standard English Conventions ====
  subject_verb_agreement: "Match subjects to verbs in number, even with intervening phrases or unusual word order.",
  pronoun_clarity: "Choose pronouns that agree with their antecedents in number and have unambiguous references.",
  modifiers: "Place modifiers near the words they modify. Fix dangling and misplaced modifiers.",
  parallelism: "Maintain parallel grammatical structures in lists, comparisons, and correlative conjunctions.",
  verb_tense: "Choose verb tenses that are consistent and appropriate to the context.",
  punctuation_boundaries: "Use periods, semicolons, colons, and commas correctly to separate independent clauses and set off nonessential elements.",
  comma_usage: "Use commas correctly in series, after introductory elements, around nonrestrictive clauses, and in complex sentences.",
  colon_usage: "Use colons to introduce lists, explanations, or quotations after an independent clause.",
  possessives: "Form possessive nouns and pronouns correctly. Distinguish possessives from contractions.",
};

/**
 * Get the description for a taxonomy key. Falls back to a generic message
 * if the skill isn't in the descriptions table. Used by the catalog and
 * detail pages.
 */
export function getSkillDescription(taxonomyKey: string): string {
  return (
    SKILL_DESCRIPTIONS[taxonomyKey] ??
    "No description yet — more content coming soon."
  );
}
