// Static map from skill → list of skills it directly depends on.
// Used by the algorithm to keep a skill from being scheduled before its
// prerequisites. Conservative — only include dependencies strong enough
// that the pedagogy genuinely breaks without them.

export const PREREQUISITES: Record<string, string[]> = {
  // Algebra
  linear_inequalities: ["linear_equations"],
  systems_of_equations: ["linear_equations"],
  linear_functions: ["linear_equations"],

  // Advanced Math
  completing_the_square: ["quadratic_equations", "equivalent_expressions"],
  quadratic_formula: ["quadratic_equations"],
  polynomial_operations: ["equivalent_expressions"],
  function_notation: ["linear_functions"],
  exponential_functions: ["equivalent_expressions"],
  radical_equations: ["quadratic_equations"],
  rational_expressions: ["equivalent_expressions"],

  // PSDA
  margin_of_error: ["statistics_spread"],
  evaluating_statistical_claims: ["margin_of_error"],
  scatterplots: ["linear_functions"],
  linear_regression: ["scatterplots"],

  // Geometry & Trig
  right_triangle_trig: ["triangles"],
  unit_circle: ["right_triangle_trig"],
  circle_equations_xy: ["circles", "completing_the_square"],
};

export function prerequisitesOf(skill: string): string[] {
  return PREREQUISITES[skill] ?? [];
}
