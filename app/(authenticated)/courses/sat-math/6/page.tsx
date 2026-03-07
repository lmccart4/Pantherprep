"use client";

import { ModuleShell } from "@/components/course/module-shell";
import type { ModuleConfig } from "@/types/module";
import { MatchingExercise, type MatchingItem } from "@/components/course/activities/matching-exercise";
import { FillInExercise, type FillInItem } from "@/components/course/activities/fill-in-exercise";
import { TrigCalculator } from "@/components/course/activities/trig-calculator";
import {
  AngleRelationshipsVisual,
  SpecialTrianglesVisual,
  CircleFormulasVisual,
  AreaVolumeVisual,
  TrigRatiosVisual,
  RadiansVisual,
  TrapTaxonomyVisual,
  DistanceMidpointVisual,
} from "./lesson-visuals";

export default function SATMathModule6() {
  return (
    <ModuleShell
      config={MODULE_CONFIG}
      nextModuleHref="/courses/sat-math/7"
      nextModuleLabel="Module 7: Desmos Mastery"
      visuals={{
        "angle-relationships": <AngleRelationshipsVisual />,
        "special-triangles": <SpecialTrianglesVisual />,
        "circle-formulas": <CircleFormulasVisual />,
        "area-volume": <AreaVolumeVisual />,
        "trig-ratios": <TrigRatiosVisual />,
        "radians": <RadiansVisual />,
        "trap-taxonomy": <TrapTaxonomyVisual />,
        "distance-midpoint": <DistanceMidpointVisual />,
      }}
      activities={{
        "exercise-angle-qs": (goNext: () => void) => (
          <MatchingExercise
            items={ANGLE_QS_EXERCISE_DATA}
            title="Angle & Triangle Solver"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "exercise-circle-qs": (goNext: () => void) => (
          <MatchingExercise
            items={CIRCLE_QS_EXERCISE_DATA}
            title="Circle Equation Workshop"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "exercise-formula-qs": (goNext: () => void) => (
          <MatchingExercise
            items={FORMULA_QS_EXERCISE_DATA}
            title="Which Formula Do I Need?"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "exercise-tri-qs": (goNext: () => void) => (
          <MatchingExercise
            items={TRI_QS_EXERCISE_DATA}
            title="Special Right Triangles Drill"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "exercise-cmp-qs": (goNext: () => void) => (
          <FillInExercise
            items={CMP_QS_EXERCISE_DATA}
            title="Composite Shape Calculator"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "calculator": (goNext: () => void) => (
          <TrigCalculator
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        )
      }}
    />
  );
}

/* ═══════════════════════════════════════════════════════
 * MODULE 6 — Geometry & Trigonometry
 * ═══════════════════════════════════════════════════════ */

const ANGLE_QS_EXERCISE_DATA: MatchingItem[] = [
  {
    "prompt": "Two angles are supplementary. One is 65°. What is the other?",
    "options": [
      "25°",
      "65°",
      "115°",
      "180°"
    ],
    "correct": 2,
    "explanation": "Supplementary = 180°. 180 − 65 = 115°."
  },
  {
    "prompt": "In a triangle, two angles are 45° and 70°. What is the third?",
    "options": [
      "45°",
      "115°",
      "75°",
      "65°"
    ],
    "correct": 3,
    "explanation": "Triangle sum = 180°. 180 − 45 − 70 = 65°."
  },
  {
    "prompt": "Parallel lines cut by a transversal. One angle is 130°. What is the alternate interior angle?",
    "options": [
      "130°",
      "180°",
      "90°",
      "50°"
    ],
    "correct": 0,
    "explanation": "Alternate interior angles are EQUAL. Both are 130°."
  },
  {
    "prompt": "An exterior angle of a triangle is 120°. The two remote interior angles are equal. What does each measure?",
    "options": [
      "60°",
      "120°",
      "40°",
      "30°"
    ],
    "correct": 0,
    "explanation": "Exterior angle = sum of remote interiors. 120 = 2x → x = 60°."
  },
  {
    "prompt": "Vertical angles: one is (3x + 10)° and the other is (5x − 20)°. Find x.",
    "options": [
      "20",
      "15",
      "30",
      "10"
    ],
    "correct": 1,
    "explanation": "Vertical angles equal: 3x + 10 = 5x − 20 → 30 = 2x → x = 15."
  },
  {
    "prompt": "30-60-90: side opposite 30° = 5. Hypotenuse = ?",
    "options": [
      "$5\\sqrt{2}$",
      "$5\\sqrt{3}$",
      "15",
      "10"
    ],
    "correct": 3,
    "explanation": "Ratio $1:\\sqrt{3}:2$. Short leg = 5, hyp = $5 \\times 2 = 10$."
  },
  {
    "prompt": "45-45-90: each leg = 7. Hypotenuse = ?",
    "options": [
      "$7\\sqrt{3}$",
      "14",
      "$7\\sqrt{2}$",
      "7"
    ],
    "correct": 2,
    "explanation": "Ratio $1:1:\\sqrt{2}$. Hyp = $7\\sqrt{2}$."
  },
  {
    "prompt": "Right triangle: legs 6 and 8. Hypotenuse = ?",
    "options": [
      "10",
      "12",
      "$\\sqrt{100}$",
      "14"
    ],
    "correct": 0,
    "explanation": "6-8-10 is 3-4-5 $\\times$ 2. Or: $\\sqrt{36+64} = \\sqrt{100} = 10$."
  }
];

const CIRCLE_QS_EXERCISE_DATA: MatchingItem[] = [
  {
    "prompt": "<code>(x − 3)² + (y + 2)² = 49</code>. Center?",
    "options": [
      "(3, 2)",
      "(−3, −2)",
      "(−3, 2)",
      "(3, −2)"
    ],
    "correct": 3,
    "explanation": "h=3, k=−2 (the +2 means k=−2). Center: (3, −2)."
  },
  {
    "prompt": "<code>(x − 3)² + (y + 2)² = 49</code>. Radius?",
    "options": [
      "7",
      "3.5",
      "49",
      "14"
    ],
    "correct": 0,
    "explanation": "r² = 49, so r = 7. Trap: equation gives r², not r!"
  },
  {
    "prompt": "Center (0, 5), radius 3. Equation?",
    "options": [
      "x² + (y+5)² = 9",
      "x² + (y−5)² = 9",
      "x² + (y−5)² = 3",
      "(x−5)² + y² = 9"
    ],
    "correct": 1,
    "explanation": "h=0, k=5, r²=9. Answer: x² + (y−5)² = 9."
  },
  {
    "prompt": "Radius 10, central angle 90°. Arc length?",
    "options": [
      "10π",
      "5π",
      "25π",
      "20π"
    ],
    "correct": 1,
    "explanation": "Arc = (90/360) × 2π(10) = ¼ × 20π = 5π."
  },
  {
    "prompt": "Radius 6. Area of a 60° sector?",
    "options": [
      "6π",
      "2π",
      "12π",
      "36π"
    ],
    "correct": 0,
    "explanation": "Sector = (60/360) × π(6²) = ⅙ × 36π = 6π."
  },
  {
    "prompt": "<code>x² + y² − 10x + 6y + 18 = 0</code>. Radius?",
    "options": [
      "√18",
      "16",
      "6",
      "4"
    ],
    "correct": 3,
    "explanation": "Complete the square: (x−5)²+(y+3)²=25+9−18=16. Radius = √16 = 4."
  }
];

const FORMULA_QS_EXERCISE_DATA: MatchingItem[] = [
  {
    "prompt": "Shaded region between a circle and inscribed square.",
    "options": [
      "A = 2πr + 4s",
      "A = \u03c0r\u00b2",
      "A = s² − πr²",
      "A = πr² − s²"
    ],
    "correct": 3,
    "explanation": "Circle minus square. Composite: subtract inner from outer."
  },
  {
    "prompt": "Hypotenuse of right triangle with legs 7 and 24.",
    "options": [
      "A = \u00bdbh",
      "(θ/360)×2πr",
      "SOH-CAH-TOA",
      "a² + b² = c²"
    ],
    "correct": 3,
    "explanation": "Pythagorean theorem: 7²+24²=625 → c=25."
  },
  {
    "prompt": "Arc length, central angle 120\u00b0, radius 9.",
    "options": [
      "(θ/360) × 2πr",
      "2πr",
      "(θ/360) × πr²",
      "\u03c0r\u00b2"
    ],
    "correct": 0,
    "explanation": "Arc LENGTH uses circumference: (120/360)×18π=6π."
  },
  {
    "prompt": "Volume of a cone, radius 5, height 12.",
    "options": [
      "V = ⅓Bh",
      "V = ⁴⁄₃πr³",
      "V = \u03c0r\u00b2h",
      "V = ⅓πr²h"
    ],
    "correct": 3,
    "explanation": "Cone=⅓ cylinder. V=⅓π(25)(12)=100π."
  },
  {
    "prompt": "Know angle and adjacent side. Find opposite.",
    "options": [
      "sin(\u03b8) = opp/hyp",
      "cos(θ) = adj/hyp",
      "tan(θ) = opp/adj",
      "a² + b² = c²"
    ],
    "correct": 2,
    "explanation": "Have angle+adjacent, need opposite → tangent."
  },
  {
    "prompt": "Area of sector, 45\u00b0, radius 8.",
    "options": [
      "πr²",
      "(θ/360) × πr²",
      "(\u03b8/360) \u00d7 2\u03c0r",
      "½r²θ"
    ],
    "correct": 1,
    "explanation": "Sector AREA: (45/360)×64π=8π."
  },
  {
    "prompt": "Square (side 3) cut from rectangle (12\u00d78). Remaining area?",
    "options": [
      "A = 2(l+w) − 4s",
      "A = lw − s²",
      "A = lw + s²",
      "A = lw"
    ],
    "correct": 1,
    "explanation": "Rectangle minus square = 96−9=87."
  },
  {
    "prompt": "sin(x\u00b0) = cos(32\u00b0). Find x.",
    "options": [
      "sin(x) = cos(90−x)",
      "a\u00b2 + b\u00b2 = c\u00b2",
      "sin²+cos²=1",
      "tan = sin/cos"
    ],
    "correct": 0,
    "explanation": "Complementary: x=90−32=58°."
  }
];

const TRI_QS_EXERCISE_DATA: MatchingItem[] = [
  {
    "prompt": "30-60-90: short leg = 4. Hyp = ?",
    "options": [
      "$4\\sqrt{3}$",
      "$4\\sqrt{2}$",
      "8",
      "12"
    ],
    "correct": 2,
    "explanation": "Ratio $1:\\sqrt{3}:2$. Hyp = $4 \\times 2 = 8$."
  },
  {
    "prompt": "30-60-90: hyp = 14. Long leg = ?",
    "options": [
      "$14\\sqrt{3}$",
      "$7\\sqrt{2}$",
      "7",
      "$7\\sqrt{3}$"
    ],
    "correct": 3,
    "explanation": "Short = 14/2 = 7. Long = $7\\sqrt{3}$."
  },
  {
    "prompt": "45-45-90: hyp = 10. Each leg = ?",
    "options": [
      "5",
      "10",
      "$10\\sqrt{2}$",
      "$5\\sqrt{2}$"
    ],
    "correct": 3,
    "explanation": "Leg = $\\text{hyp}/\\sqrt{2} = 10/\\sqrt{2} = 5\\sqrt{2}$."
  },
  {
    "prompt": "45-45-90: each leg = 3. Hyp = ?",
    "options": [
      "$3\\sqrt{3}$",
      "9",
      "$3\\sqrt{2}$",
      "6"
    ],
    "correct": 2,
    "explanation": "Ratio $1:1:\\sqrt{2}$. Hyp = $3\\sqrt{2}$."
  },
  {
    "prompt": "Right triangle: legs 5 and 12. Hyp = ?",
    "options": [
      "√17",
      "17",
      "13",
      "15"
    ],
    "correct": 2,
    "explanation": "5-12-13 is a Pythagorean triple!"
  },
  {
    "prompt": "Right triangle: leg = 9, hyp = 15. Other leg = ?",
    "options": [
      "6",
      "$\\sqrt{144}$",
      "12",
      "10"
    ],
    "correct": 2,
    "explanation": "$9^2 + x^2 = 15^2 \\to x^2 = 144 \\to x = 12$. (3-4-5 $\\times$ 3.)"
  },
  {
    "prompt": "30-60-90: long leg = $6\\sqrt{3}$. Short leg = ?",
    "options": [
      "12",
      "$6\\sqrt{2}$",
      "3",
      "6"
    ],
    "correct": 3,
    "explanation": "Long = short $\\times \\sqrt{3}$. Short = $6\\sqrt{3}/\\sqrt{3} = 6$."
  },
  {
    "prompt": "Right triangle: both legs = 1. Hyp = ?",
    "options": [
      "2",
      "$\\sqrt{3}$",
      "$\\sqrt{2}$",
      "1"
    ],
    "correct": 2,
    "explanation": "$1^2 + 1^2 = 2 \\to$ hyp = $\\sqrt{2}$. The 45-45-90 base case."
  }
];

const CMP_QS_EXERCISE_DATA: FillInItem[] = [
  {
    "prompt": "A square with side 10 has a circle of radius 5 inscribed inside it. Find the shaded area (square minus circle). Leave in terms of \u03c0.",
    "answer": "100-25\u03c0",
    "solution": "Square: 10\u00b2 = 100. Circle: \u03c0(5\u00b2) = 25\u03c0. Shaded: 100 \u2212 25\u03c0."
  },
  {
    "prompt": "A circle with radius 8 has a square inscribed inside it (corners touch the circle). The square diagonal = 16. Find the square's area.",
    "answer": "128",
    "solution": "Diagonal = 16. Side = 16/\u221a2 = 8\u221a2. Area = (8\u221a2)\u00b2 = 128. Or: \u00bdd\u00b2 = \u00bd(16\u00b2) = 128."
  },
  {
    "prompt": "A rectangle is 12 \u00d7 8. A semicircle with diameter 8 is cut from one end. Find the remaining area in terms of \u03c0.",
    "answer": "96-8\u03c0",
    "solution": "Rectangle: 96. Semicircle: \u00bd\u03c0(4\u00b2) = 8\u03c0. Remaining: 96 \u2212 8\u03c0."
  },
  {
    "prompt": "Two concentric circles have radii 10 and 6. Find the area of the ring (annulus) between them in terms of \u03c0.",
    "answer": "64\u03c0",
    "solution": "Outer: \u03c0(100). Inner: \u03c0(36). Ring: 100\u03c0 \u2212 36\u03c0 = 64\u03c0."
  },
  {
    "prompt": "An equilateral triangle with side 6 is inscribed in a circle. The circle has radius 2\u221a3. Find the area of the circle minus the triangle, in terms of \u03c0 and \u221a3.",
    "answer": "12\u03c0-9\u221a3",
    "solution": "Circle: \u03c0(2\u221a3)\u00b2 = 12\u03c0. Triangle: (\u221a3/4)(6\u00b2) = 9\u221a3. Shaded: 12\u03c0 \u2212 9\u221a3."
  }
];

const MODULE_CONFIG: ModuleConfig = {
  testType: "sat",
  section: "math",
  moduleNum: 6,
  title: "Geometry & Trigonometry",
  subtitle:
    "Angles, triangles, circles, and trig ratios",
  accentColor: "#C8102E",
  screens: [
    { id: "welcome", label: "Welcome", icon: "wave" },
    { id: "warmup", label: "Warm-Up", icon: "brain" },
    { id: "lesson", label: "Lesson", icon: "book" },
    { id: "exercise-angle-qs", label: "Angle & Triangle Solver", icon: "zap" },
    { id: "exercise-circle-qs", label: "Circle Equation Workshop", icon: "zap" },
    { id: "exercise-formula-qs", label: "Which Formula Do I Need?", icon: "zap" },
    { id: "exercise-tri-qs", label: "Special Right Triangles Drill", icon: "zap" },
    { id: "exercise-cmp-qs", label: "Composite Shape Calculator", icon: "zap" },
    { id: "calculator", label: "Calculator", icon: "chart" },
    { id: "quiz", label: "Practice", icon: "target" },
    { id: "complete", label: "Complete", icon: "trophy" },
  ],

  /* ──────── WARM-UP (Module 5 Retrieval) ──────── */
  warmup: [
    {
      source: "Module 5 \u2014 Percent Change",
      stem: "A price goes from $80 to $100. What is the percent increase?",
      choices: ["20%", "25%", "80%", "125%"],
      correct: 1,
      explanation:
        "Percent change = (new \u2212 old)/old \u00D7 100 = (100 \u2212 80)/80 \u00D7 100 = 25%. Always divide by the OLD value.",
    },
    {
      source: "Module 5 \u2014 Statistics",
      stem: "A data set {2, 5, 5, 8, 80} \u2014 which measure of center is more resistant to the outlier: mean or median?",
      choices: ["Neither", "Median", "Mean", "Both equally"],
      correct: 1,
      explanation:
        "The median is resistant to extreme values. The mean is pulled toward outliers.",
    },
    {
      source: "Module 5 \u2014 Scatterplots",
      stem: "A scatterplot has a line of best fit with slope 2.5. Each additional unit of x predicts what change in y?",
      choices: [
        "Decrease of 2.5",
        "Increase of 5",
        "No change",
        "Increase of 2.5"
      ],
      correct: 3,
      explanation:
        "The slope represents the rate of change \u2014 each additional unit of x predicts a 2.5-unit increase in y.",
    },
    {
      source: "Module 5 \u2014 Conditional Probability",
      stem: "P(A|B) means the probability of A given that ___?",
      choices: [
        "Neither has occurred",
        "B has occurred",
        "A has occurred",
        "A or B has occurred"
      ],
      correct: 1,
      explanation:
        "P(A|B) = \"given B, what is the probability of A?\" The condition (B) goes after the vertical bar.",
    },
    {
      source: "Module 5 \u2014 Study Design",
      stem: "A study uses random assignment to treatment groups. This allows what type of conclusion?",
      choices: [
        "Causal (cause and effect)",
        "Generalization to all populations",
        "No valid conclusion",
        "Correlation only"
      ],
      correct: 0,
      explanation:
        "Random assignment to groups allows causal conclusions (this is an experiment). Generalizability depends on random sampling.",
    },
  ],

  /* ──────── LESSONS ──────── */
  lessons: [
    /* ── Intro ── */
    {
      id: "intro",
      title: "Why Geometry & Trig Matters",
      subtitle: "Fewer questions (~15%), but highly formulaic",
      body: [
        "Geometry & Trig questions are the most formula-dependent on the SAT. If you memorize the formulas and recognize the patterns, these questions become nearly free points.",
      ],
    },

    /* ── Topic 6A: Lines, Angles & Triangles ── */
    {
      id: "topic-6a-angles",
      title: "Topic 6A \u2014 Angle Relationships",
      subtitle: "Vertical, supplementary, complementary, parallel lines",
      visual: "angle-relationships",
      body: [
        "\u2022 **Vertical angles** are equal (formed by intersecting lines, across from each other)",
        "\u2022 **Supplementary angles** add to 180\u00B0 (on a straight line)",
        "\u2022 **Complementary angles** add to 90\u00B0 (form a right angle)",
        "**Parallel Lines + Transversal:**",
        "\u2022 **Corresponding angles:** EQUAL (same position at each intersection)",
        "\u2022 **Alternate interior angles:** EQUAL (opposite sides, between the parallels)",
        "\u2022 **Co-interior (same-side interior):** SUPPLEMENTARY (add to 180\u00B0)",
      ],
    },
    {
      id: "topic-6a-triangles",
      title: "Triangle Facts",
      subtitle: "Angle sum, exterior angles, similarity, inequality",
      body: [
        "\u2022 **Angle sum:** Interior angles always add to 180\u00B0",
        "\u2022 **Exterior angle theorem:** Exterior angle = sum of two remote interior angles",
        "\u2022 **Similar triangles:** Same shape, proportional sides. Set up a proportion to find missing sides.",
        "\u2022 **Triangle inequality:** Any side < sum of the other two sides",
      ],
    },
    {
      id: "topic-6a-special",
      title: "Special Right Triangles & Pythagorean Theorem",
      subtitle: "The most frequently tested geometry facts on the SAT",
      visual: "special-triangles",
      body: [
        "**Pythagorean Theorem:** $a^2 + b^2 = c^2$ (c = hypotenuse, always the longest side, opposite the right angle)",
        "**30-60-90 Triangle:** Sides in ratio $1 : \\sqrt{3} : 2$ (short leg : long leg : hypotenuse)",
        "**45-45-90 Triangle:** Sides in ratio $1 : 1 : \\sqrt{2}$ (leg : leg : hypotenuse)",
        "**Common Pythagorean Triples (memorize!):**",
        "\u2022 3\u20134\u20135 (and multiples: 6\u20138\u201310, 9\u201312\u201315)",
        "\u2022 5\u201312\u201313",
        "\u2022 8\u201315\u201317",
        "\u2022 7\u201324\u201325",
        "Any multiple of a triple is also a triple!",
      ],
    },

    /* ── Topic 6B: Circles ── */
    {
      id: "topic-6b-circles",
      title: "Topic 6B \u2014 Circles",
      subtitle: "Standard form, area, circumference, arcs, sectors",
      visual: "circle-formulas",
      body: [
        "Key formulas:",
        "\u2022 **Standard form:** $(x - h)^2 + (y - k)^2 = r^2$ \u2014 Center (h, k), Radius r",
        "\u2022 **Area:** $A = \\pi r^2$",
        "\u2022 **Circumference:** $C = 2\\pi r$",
        "\u2022 **Arc length:** $(\\theta/360) \\times 2\\pi r$",
        "\u2022 **Sector area:** $(\\theta/360) \\times \\pi r^2$",
      ],
    },
    {
      id: "topic-6b-converting",
      title: "Converting General Form to Standard Form",
      subtitle: "Complete the square for x and y",
      body: [
        "Sometimes the SAT gives a circle in expanded/general form: x\u00B2 + y\u00B2 + Dx + Ey + F = 0",
        "**Strategy:** Complete the square for both x and y.",
        "**Example:** x\u00B2 + y\u00B2 \u2212 6x + 4y \u2212 12 = 0",
        "Group: (x\u00B2 \u2212 6x) + (y\u00B2 + 4y) = 12",
        "Complete: (x\u00B2 \u2212 6x + 9) + (y\u00B2 + 4y + 4) = 12 + 9 + 4",
        "Result: (x \u2212 3)\u00B2 + (y + 2)\u00B2 = 25 \u2192 Center (3, \u22122), Radius 5",
      ],
    },
    {
      id: "topic-6b-tangent",
      title: "Tangent Lines & Inscribed Angles",
      subtitle: "Special angle relationships in circles",
      body: [
        "\u2022 **Tangent line:** Touches circle at one point. Perpendicular to radius (90\u00B0).",
        "\u2022 **Central angle:** Vertex at center. Equal to intercepted arc.",
        "\u2022 **Inscribed angle:** Vertex on circle. Equals HALF the intercepted arc.",
        "**Desmos:** Type `(x\u22122)\u00B2+(y+3)\u00B2=25` directly to graph any circle.",
      ],
    },

    /* ── Topic 6C: Area & Volume ── */
    {
      id: "topic-6c",
      title: "Topic 6C \u2014 Area, Perimeter & Volume",
      subtitle: "These formulas are on the reference sheet but memorizing saves time",
      visual: "area-volume",
      body: [
        "Key formulas:",
        "\u2022 **Rectangle:** A = lw",
        "\u2022 **Triangle:** $A = \\frac{1}{2}bh$",
        "\u2022 **Trapezoid:** $A = \\frac{1}{2}(b_1 + b_2)h$",
        "\u2022 **Cylinder:** $V = \\pi r^2 h$",
        "\u2022 **Cone:** $V = \\frac{1}{3}\\pi r^2 h$",
        "\u2022 **Sphere:** $V = \\frac{4}{3}\\pi r^3$",
        "\u2022 **Pyramid:** $V = \\frac{1}{3}Bh$",
        "\u2022 **Rectangular Prism:** V = lwh",
        "**Pattern:** Cones and pyramids are always \u2153 of the corresponding \"full\" shape. Cone = \u2153 \u00D7 cylinder. Pyramid = \u2153 \u00D7 prism.",
      ],
    },

    /* ── Topic 6D: Coordinate Geometry & Trig ── */
    {
      id: "topic-6d-distance",
      title: "Topic 6D \u2014 Distance & Midpoint Formulas",
      subtitle: "Finding lengths and midpoints on the coordinate plane",
      visual: "distance-midpoint",
      body: [
        "**Distance:** $d = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}$ \u2014 This IS the Pythagorean theorem on the coordinate plane!",
        "**Midpoint:** $M = \\left(\\frac{x_1 + x_2}{2},\\, \\frac{y_1 + y_2}{2}\\right)$ \u2014 Average the x's and average the y's.",
        "**Example:** Distance from (1, 2) to (4, 6) = $\\sqrt{(4-1)^2 + (6-2)^2} = \\sqrt{9 + 16} = \\sqrt{25} = 5$. That's a 3-4-5 right triangle!",
        "**Don't memorize the distance formula separately.** Just draw a right triangle on the coordinate plane.",
      ],
    },
    {
      id: "topic-6d-trig",
      title: "SOH-CAH-TOA & Trig Ratios",
      subtitle: "Sine, cosine, tangent, and the complementary relationship",
      visual: "trig-ratios",
      body: [
        "**SOH-CAH-TOA:**",
        "\u2022 **S**in = **O**pp / **H**yp",
        "\u2022 **C**os = **A**dj / **H**yp",
        "\u2022 **T**an = **O**pp / **A**dj",
        "**Key Relationships:**",
        "\u2022 $\\sin(x) = \\cos(90° - x)$",
        "\u2022 $\\tan(x) = \\sin(x) / \\cos(x)$",
        "\u2022 $\\sin^2(x) + \\cos^2(x) = 1$",
        "\u2022 $180° = \\pi$ radians",
      ],
    },
    {
      id: "topic-6d-radians",
      title: "Radians \u2194 Degrees",
      subtitle: "Converting between angle units",
      visual: "radians",
      body: [
        "**Degrees \u2192 Radians:** multiply by \u03C0/180",
        "**Radians \u2192 Degrees:** multiply by 180/\u03C0",
        "**Common conversions:** 30\u00B0 = \u03C0/6 \u00B7 45\u00B0 = \u03C0/4 \u00B7 60\u00B0 = \u03C0/3 \u00B7 90\u00B0 = \u03C0/2 \u00B7 180\u00B0 = \u03C0 \u00B7 360\u00B0 = 2\u03C0",
        "**Desmos defaults to radians.** Click the wrench icon to switch to degrees if needed.",
      ],
    },
    {
      id: "topic-6d-complementary",
      title: "Complementary Angle Relationship",
      subtitle: "sin(x) = cos(90\u00B0 \u2212 x)",
      body: [
        "**sin(x) = cos(90\u00B0 \u2212 x)** and **cos(x) = sin(90\u00B0 \u2212 x)**.",
        "In a right triangle, the two acute angles add to 90\u00B0. The side opposite one angle is adjacent to the other.",
        "**SAT question type:** \"If sin(x) = cos(32\u00B0), what is x?\" \u2192 x = 90\u00B0 \u2212 32\u00B0 = 58\u00B0.",
      ],
    },

    /* ── Trap Taxonomy ── */
    {
      id: "traps",
      title: "Four Traps in Geometry & Trig",
      subtitle: "Learn them by name to spot them instantly",
      visual: "trap-taxonomy",
      body: [
        "**Trap 1: The Wrong Target** \u2014 Solved for the wrong measurement \u2014 found diameter when they asked for radius, found area when they asked for circumference. Diameter = 10 \u2192 Area = \u03C0(5\u00B2) = 25\u03C0 (not \u03C0(10\u00B2) = 100\u03C0).",
        "**Trap 2: The Phantom Height** \u2014 Used the slant height instead of the actual height in a volume or area formula. The height must be perpendicular to the base.",
        "**Trap 3: The Sign Flip** \u2014 In circle equations, (x+3)\u00B2 means h = \u22123, not h = 3. The sign inside the parentheses is opposite to the center coordinate.",
        "**Trap 4: The Unit Mismatch** \u2014 Mixed up degrees and radians, or used inches for one dimension and feet for another. sin(30) in Desmos = sin(30 radians) \u2260 sin(30\u00B0).",
      ],
    },
  ],

  /* ──────── QUIZ (Timed Practice) ──────── */
  quiz: [
    {
      stem: "What is the area of a circle with diameter 10?",
      choices: ["10\u03C0", "25\u03C0", "100\u03C0", "50\u03C0"],
      correct: 1,
      explanation:
        "Diameter = 10, radius = 5. Area = \u03C0(5\u00B2) = 25\u03C0. Trap: using diameter instead of radius.",
      difficulty: "easy",
      type: "6A",
      domain: "Geometry & Trig",
      skill: "circles",
      trap: "wrong_target",
      trapAnswer: 2,
      trapDesc: "Used diameter instead of radius \u2014 The Wrong Target",
    },
    {
      stem: "In a right triangle, sin(A) = 3/5. What is cos(A)?",
      choices: ["5/3", "3/4", "3/5", "4/5"],
      correct: 3,
      explanation:
        "$\\sin = \\text{opp}/\\text{hyp} = 3/5$. Adjacent = $\\sqrt{25 - 9} = 4$. $\\cos = \\text{adj}/\\text{hyp} = 4/5$.",
      difficulty: "easy",
      type: "6D",
      domain: "Geometry & Trig",
      skill: "right_triangle_trig",
    },
    {
      stem: "Triangle angles: 35\u00B0 and 75\u00B0. Third angle?",
      choices: ["80\u00B0", "70\u00B0", "90\u00B0", "110\u00B0"],
      correct: 1,
      explanation: "180 \u2212 35 \u2212 75 = 70\u00B0.",
      difficulty: "easy",
      type: "6A",
      domain: "Geometry & Trig",
      skill: "triangles",
    },
    {
      stem: "A cylinder has radius 4 and height 10. Volume?",
      choices: ["40\u03C0", "160\u03C0", "640\u03C0", "80\u03C0"],
      correct: 1,
      explanation:
        "V = \u03C0r\u00B2h = \u03C0(16)(10) = 160\u03C0.",
      difficulty: "medium",
      type: "6C",
      domain: "Geometry & Trig",
      skill: "volume",
      trap: "phantom_height",
      trapAnswer: 0,
      trapDesc:
        "Used diameter for radius or forgot to square \u2014 Phantom Height",
    },
    {
      stem: "If sin(x) = cos(40\u00B0), what is x?",
      choices: ["60\u00B0", "40\u00B0", "90\u00B0", "50\u00B0"],
      correct: 3,
      explanation:
        "sin(x) = cos(90\u00B0\u2212x). So cos(40\u00B0) = sin(50\u00B0). x = 50\u00B0.",
      difficulty: "medium",
      type: "6D",
      domain: "Geometry & Trig",
      skill: "right_triangle_trig",
      trap: "unit_mismatch",
      trapAnswer: 0,
      trapDesc:
        "Used the given angle directly \u2014 Unit Mismatch on complementary relationship",
    },
    {
      stem: "Circle equation: (x+1)\u00B2 + (y\u22124)\u00B2 = 36. Point (\u22121, y) is on the circle. Find the positive value of y.",
      choices: ["10", "4", "8", "6"],
      correct: 0,
      explanation:
        "Plug in x=\u22121: (0)\u00B2+(y\u22124)\u00B2=36 \u2192 y\u22124=\u00B16 \u2192 y=10 or y=\u22122. Positive: y=10.",
      difficulty: "medium",
      type: "6B",
      domain: "Geometry & Trig",
      skill: "circles",
      trap: "sign_flip",
      trapAnswer: 1,
      trapDesc:
        "Forgot the \u00B1, only found one solution \u2014 The Sign Flip",
    },
    {
      stem: "Convert 240\u00B0 to radians.",
      choices: [
        "2\u03C0/3",
        "4\u03C0/3",
        "4\u03C0",
        "3\u03C0/4"
      ],
      correct: 1,
      explanation:
        "240 \u00D7 \u03C0/180 = 240\u03C0/180 = 4\u03C0/3.",
      difficulty: "medium",
      type: "6D",
      domain: "Geometry & Trig",
      skill: "right_triangle_trig",
      trap: "unit_mismatch",
      trapAnswer: 1,
      trapDesc: "Inverted the fraction \u2014 Unit Mismatch",
    },
    {
      stem: "A cone and cylinder have the same radius and height. Cylinder volume = 90\u03C0. Cone volume = ?",
      choices: ["90\u03C0", "45\u03C0", "270\u03C0", "30\u03C0"],
      correct: 3,
      explanation:
        "Cone = \u2153 \u00D7 cylinder = \u2153 \u00D7 90\u03C0 = 30\u03C0.",
      difficulty: "hard",
      type: "6C",
      domain: "Geometry & Trig",
      skill: "volume",
      trap: "wrong_target",
      trapAnswer: 3,
      trapDesc:
        "Forgot the \u2153 relationship \u2014 The Wrong Target",
    },
    {
      stem: "Circle has center (2, \u22123) and passes through (6, 0). What is the equation?",
      choices: [
        "(x\u22126)\u00B2+y\u00B2=25",
        "(x\u22122)\u00B2+(y+3)\u00B2=25",
        "(x\u22122)\u00B2+(y+3)\u00B2=5",
        "(x+2)\u00B2+(y\u22123)\u00B2=25"
      ],
      correct: 1,
      explanation:
        "Radius = distance from (2,\u22123) to (6,0) = \u221A(4\u00B2+3\u00B2) = \u221A25 = 5. r\u00B2=25. Equation: (x\u22122)\u00B2+(y+3)\u00B2=25.",
      difficulty: "hard",
      type: "6B",
      domain: "Geometry & Trig",
      skill: "circles",
      trap: "sign_flip",
      trapAnswer: 1,
      trapDesc:
        "Flipped the signs in the equation \u2014 The Sign Flip",
    },
    {
      stem: "Square side 10 with inscribed circle. Shaded area outside circle, inside square?",
      choices: [
        "100\u2212100\u03C0",
        "25\u03C0\u2212100",
        "100\u221225\u03C0",
        "400\u2212100\u03C0"
      ],
      correct: 2,
      explanation:
        "Square = 100. Circle r=5, area = 25\u03C0. Shaded = 100 \u2212 25\u03C0. Composite shape!",
      difficulty: "hard",
      type: "6C",
      domain: "Geometry & Trig",
      skill: "area_perimeter",
      trap: "wrong_target",
      trapAnswer: 1,
      trapDesc:
        "Used diameter as radius for circle area \u2014 The Wrong Target",
    },
  ],
  takeaways: [
    "Triangle angles sum to 180\u00b0. Supplementary = 180\u00b0. Complementary = 90\u00b0.",
    "Memorize 30-60-90 ($1:\\sqrt{3}:2$) and 45-45-90 ($1:1:\\sqrt{2}$) ratios cold.",
    "Common Pythagorean triples: 3-4-5, 5-12-13, 8-15-17 and their multiples.",
    "Choose the right formula \u2014 on the real SAT, nobody tells you which to use.",
    "Circle standard form: $(x - h)^2 + (y - k)^2 = r^2$. Center = (h,k), Radius = r. Complete the square if needed.",
    "Arc and sector formulas: multiply by $\\theta/360$ (the fraction of the full circle).",
    "SOH-CAH-TOA. $\\sin(x) = \\cos(90° - x)$. $180° = \\pi$ radians.",
    "Cones and pyramids = 1/3 of the corresponding full shape. Composite shapes: add or subtract.",
  ],
};
