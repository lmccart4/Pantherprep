"use client";

import { ModuleShell } from "@/components/course/module-shell";
import type { ModuleConfig, QuizQuestion } from "@/types/module";
import { MatchingExercise, type MatchingItem } from "@/components/course/activities/matching-exercise";
import { FillInExercise, type FillInItem } from "@/components/course/activities/fill-in-exercise";
import { TrigCalculator } from "@/components/course/activities/trig-calculator";
import {
  AngleRelationshipsVisual,
  SpecialTrianglesVisual,
  CircleFormulasVisual,
  AreaVolumeVisual,
  TrigVisual,
  TrapTaxonomyVisual,
  CoordinateGeometryVisual,
} from "./lesson-visuals";

const ANGLE_QS_EXERCISE: MatchingItem[] = [
  {
    "prompt": "Two angles are supplementary. One is $65°$. What is the other?",
    "options": [
      "$65°$",
      "$115°$",
      "$25°$",
      "$180°$"
    ],
    "correct": 1,
    "explanation": "Supplementary $= 180°$. $180 - 65 = 115°$."
  },
  {
    "prompt": "In a triangle, two angles are $45°$ and $70°$. What is the third?",
    "options": [
      "$45°$",
      "$75°$",
      "$115°$",
      "$65°$"
    ],
    "correct": 3,
    "explanation": "Triangle sum $= 180°$. $180 - 45 - 70 = 65°$."
  },
  {
    "prompt": "Parallel lines cut by a transversal. One angle is $130°$. What is the alternate interior angle?",
    "options": [
      "$180°$",
      "$90°$",
      "$130°$",
      "$50°$"
    ],
    "correct": 2,
    "explanation": "Alternate interior angles are EQUAL. Both are $130°$."
  },
  {
    "prompt": "An exterior angle of a triangle is $120°$. The two remote interior angles are equal. What does each measure?",
    "options": [
      "$120°$",
      "$40°$",
      "$30°$",
      "$60°$"
    ],
    "correct": 3,
    "explanation": "Exterior angle = sum of remote interiors. $120 = 2x \\Rightarrow x = 60°$."
  },
  {
    "prompt": "Vertical angles: one is $(3x + 10)°$ and the other is $(5x - 20)°$. Find $x$.",
    "options": [
      "$30$",
      "$15$",
      "$10$",
      "$20$"
    ],
    "correct": 1,
    "explanation": "Vertical angles equal: $3x + 10 = 5x - 20 \\Rightarrow 30 = 2x \\Rightarrow x = 15$."
  },
  {
    "prompt": "30-60-90: side opposite $30°$ = 5. Hypotenuse = ?",
    "options": [
      "$5\\sqrt{3}$",
      "$5\\sqrt{2}$",
      "$10$",
      "$15$"
    ],
    "correct": 2,
    "explanation": "Ratio $1:\\sqrt{3}:2$. Short leg $= 5$, hyp $= 5 \\times 2 = 10$."
  },
  {
    "prompt": "45-45-90: each leg = 7. Hypotenuse = ?",
    "options": [
      "$7\\sqrt{3}$",
      "$14$",
      "$7\\sqrt{2}$",
      "$7$"
    ],
    "correct": 2,
    "explanation": "Ratio $1:1:\\sqrt{2}$. Hyp $= 7\\sqrt{2}$."
  },
  {
    "prompt": "Right triangle: legs 6 and 8. Hypotenuse = ?",
    "options": [
      "$12$",
      "$10$",
      "$14$",
      "$\\sqrt{100}$"
    ],
    "correct": 1,
    "explanation": "$6$-$8$-$10$ is $3$-$4$-$5 \\times 2$. Or: $\\sqrt{36+64} = \\sqrt{100} = 10$."
  }
];

const CIRCLE_QS_EXERCISE: MatchingItem[] = [
  {
    "prompt": "<code>(x − 3)² + (y + 2)² = 49</code>. Center?",
    "options": [
      "(3, 2)",
      "(−3, −2)",
      "(−3, 2)",
      "(3, −2)"
    ],
    "correct": 3,
    "explanation": "$h=3$, $k=-2$ (the $+2$ means $k=-2$). Center: $(3, -2)$."
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
    "explanation": "$r^2 = 49$, so $r = 7$. Trap: equation gives $r^2$, not $r$!"
  },
  {
    "prompt": "Center $(0, 5)$, radius $3$. Equation?",
    "options": [
      "$x^2 + (y-5)^2 = 3$",
      "$(x-5)^2 + y^2 = 9$",
      "$x^2 + (y+5)^2 = 9$",
      "$x^2 + (y-5)^2 = 9$"
    ],
    "correct": 3,
    "explanation": "$h=0$, $k=5$, $r^2=9$. Answer: $x^2 + (y-5)^2 = 9$."
  },
  {
    "prompt": "Radius $10$, central angle $90°$. Arc length?",
    "options": [
      "$5\\pi$",
      "$10\\pi$",
      "$20\\pi$",
      "$25\\pi$"
    ],
    "correct": 0,
    "explanation": "Arc $= (90/360) \\times 2\\pi(10) = \\frac{1}{4} \\times 20\\pi = 5\\pi$."
  },
  {
    "prompt": "Radius $6$. Area of a $60°$ sector?",
    "options": [
      "$6\\pi$",
      "$12\\pi$",
      "$2\\pi$",
      "$36\\pi$"
    ],
    "correct": 0,
    "explanation": "Sector $= (60/360) \\times \\pi(6^2) = \\frac{1}{6} \\times 36\\pi = 6\\pi$."
  },
  {
    "prompt": "<code>x² + y² − 10x + 6y + 18 = 0</code>. Radius?",
    "options": [
      "$\\sqrt{18}$",
      "16",
      "6",
      "4"
    ],
    "correct": 3,
    "explanation": "Complete the square: $(x-5)^2+(y+3)^2=25+9-18=16$. Radius $= \\sqrt{16} = 4$."
  }
];

const FORMULA_QS_EXERCISE: MatchingItem[] = [
  {
    "prompt": "You need to find the distance around a circular track.",
    "options": [
      "$(\\theta/360) \\times 2\\pi r$",
      "$C = 2\\pi r$",
      "$V = \\pi r^2 h$",
      "$A = \\pi r^2$"
    ],
    "correct": 1,
    "explanation": "Distance around = circumference $= 2\\pi r$."
  },
  {
    "prompt": "You need to find how much paint to cover a circular wall.",
    "options": [
      "$C = 2\\pi r$",
      "$A = lw$",
      "$A = \\pi r^2$",
      "$V = \\frac{4}{3}\\pi r^3$"
    ],
    "correct": 2,
    "explanation": "Covering a surface = area $= \\pi r^2$."
  },
  {
    "prompt": "A pizza has a $120°$ slice cut from it. You want the crust length of that slice.",
    "options": [
      "$(\\theta/360) \\times 2\\pi r$",
      "$C = 2\\pi r$",
      "$(\\theta/360) \\times \\pi r^2$",
      "$A = \\pi r^2$"
    ],
    "correct": 0,
    "explanation": "Crust length of a slice = arc length $= (\\theta/360) \\times 2\\pi r$."
  },
  {
    "prompt": "You're filling a cylindrical water tank.",
    "options": [
      "$V = \\frac{1}{3}\\pi r^2 h$",
      "$A = \\pi r^2$",
      "$C = 2\\pi r$",
      "$V = \\pi r^2 h$"
    ],
    "correct": 3,
    "explanation": "Filling a 3D shape = volume. Cylinder: $V = \\pi r^2 h$."
  },
  {
    "prompt": "An ice cream cone's capacity.",
    "options": [
      "$V = \\frac{1}{3}\\pi r^2 h$",
      "$A = \\frac{1}{2}bh$",
      "$V = \\frac{4}{3}\\pi r^3$",
      "$V = \\pi r^2 h$"
    ],
    "correct": 0,
    "explanation": "Cone volume $= \\frac{1}{3}\\pi r^2 h$ (one-third of a cylinder)."
  },
  {
    "prompt": "You need the area of a triangular garden bed with base 8m and height 5m.",
    "options": [
      "$A = bh$",
      "$A = \\frac{1}{2}(b_1+b_2)h$",
      "$A = \\frac{1}{2}bh$",
      "$P = 3s$"
    ],
    "correct": 2,
    "explanation": "Triangle area $= \\frac{1}{2} \\times$ base $\\times$ height $= \\frac{1}{2}(8)(5) = 20\\text{m}^2$."
  },
  {
    "prompt": "Finding the distance between two points on a coordinate plane.",
    "options": [
      "$a^2+b^2=c^2$",
      "$m = \\frac{y_2-y_1}{x_2-x_1}$",
      "$d = \\sqrt{(x_2-x_1)^2+(y_2-y_1)^2}$",
      "$M = \\left(\\frac{x_1+x_2}{2}, \\frac{y_1+y_2}{2}\\right)$"
    ],
    "correct": 2,
    "explanation": "Distance formula — which is just the Pythagorean theorem on coordinates."
  },
  {
    "prompt": "A basketball (sphere) needs to be inflated. How much air does it hold?",
    "options": [
      "$V = \\pi r^2 h$",
      "$V = \\frac{1}{3}\\pi r^2 h$",
      "$A = 4\\pi r^2$",
      "$V = \\frac{4}{3}\\pi r^3$"
    ],
    "correct": 3,
    "explanation": "Sphere volume $= \\frac{4}{3}\\pi r^3$."
  }
];

const TRI_QS_EXERCISE: MatchingItem[] = [
  {
    "prompt": "30-60-90: short leg = 4. Hyp = ?",
    "options": [
      "$12$",
      "$4\\sqrt{2}$",
      "$4\\sqrt{3}$",
      "$8$"
    ],
    "correct": 3,
    "explanation": "Ratio $1:\\sqrt{3}:2$. Hyp $= 4 \\times 2 = 8$."
  },
  {
    "prompt": "30-60-90: hyp = 14. Long leg = ?",
    "options": [
      "$14\\sqrt{3}$",
      "$7\\sqrt{2}$",
      "$7$",
      "$7\\sqrt{3}$"
    ],
    "correct": 3,
    "explanation": "Short $= 14/2 = 7$. Long $= 7\\sqrt{3}$."
  },
  {
    "prompt": "45-45-90: hyp = 10. Each leg = ?",
    "options": [
      "$5$",
      "$10$",
      "$10\\sqrt{2}$",
      "$5\\sqrt{2}$"
    ],
    "correct": 3,
    "explanation": "Leg $= \\text{hyp}/\\sqrt{2} = 10/\\sqrt{2} = 5\\sqrt{2}$."
  },
  {
    "prompt": "45-45-90: each leg = 3. Hyp = ?",
    "options": [
      "$3\\sqrt{3}$",
      "$9$",
      "$3\\sqrt{2}$",
      "$6$"
    ],
    "correct": 2,
    "explanation": "Ratio $1:1:\\sqrt{2}$. Hyp $= 3\\sqrt{2}$."
  },
  {
    "prompt": "Right triangle: legs 5 and 12. Hyp = ?",
    "options": [
      "$\\sqrt{17}$",
      "$13$",
      "$15$",
      "$17$"
    ],
    "correct": 1,
    "explanation": "$5$-$12$-$13$ is a Pythagorean triple!"
  },
  {
    "prompt": "Right triangle: leg = 9, hyp = 15. Other leg = ?",
    "options": [
      "$12$",
      "$10$",
      "$\\sqrt{144}$",
      "$6$"
    ],
    "correct": 0,
    "explanation": "$9^2 + x^2 = 15^2 \\Rightarrow x^2 = 144 \\Rightarrow x = 12$. ($3$-$4$-$5 \\times 3$.)"
  },
  {
    "prompt": "30-60-90: long leg $= 6\\sqrt{3}$. Short leg = ?",
    "options": [
      "$6\\sqrt{2}$",
      "$3$",
      "$6$",
      "$12$"
    ],
    "correct": 2,
    "explanation": "Long $=$ short $\\times \\sqrt{3}$. Short $= 6\\sqrt{3}/\\sqrt{3} = 6$."
  },
  {
    "prompt": "Right triangle: both legs = 1. Hyp = ?",
    "options": [
      "$2$",
      "$\\sqrt{3}$",
      "$\\sqrt{2}$",
      "$1$"
    ],
    "correct": 2,
    "explanation": "$1^2 + 1^2 = 2 \\Rightarrow$ hyp $= \\sqrt{2}$. The 45-45-90 base case."
  }
];

const CMP_QS_EXERCISE: FillInItem[] = [
  {
    "prompt": "A square with side 10 has a circle of radius 5 inscribed inside it. Find the shaded area (square minus circle). Leave in terms of $\\pi$.",
    "answer": "$100-25\\pi$",
    "solution": "Square: $10^2 = 100$. Circle: $\\pi(5^2) = 25\\pi$. Shaded: $100 - 25\\pi$."
  },
  {
    "prompt": "A circle with radius 8 has a square inscribed inside it (corners touch the circle). The square diagonal = 16. Find the square's area.",
    "answer": "128",
    "solution": "Diagonal $= 16$. Side $= 16/\\sqrt{2} = 8\\sqrt{2}$. Area $= (8\\sqrt{2})^2 = 128$. Or: $\\frac{1}{2}d^2 = \\frac{1}{2}(16^2) = 128$."
  },
  {
    "prompt": "A rectangle is $12 \\times 8$. A semicircle with diameter 8 is cut from one end. Find the remaining area in terms of $\\pi$.",
    "answer": "$96-8\\pi$",
    "solution": "Rectangle: $96$. Semicircle: $\\frac{1}{2}\\pi(4^2) = 8\\pi$. Remaining: $96 - 8\\pi$."
  },
  {
    "prompt": "Two concentric circles have radii 10 and 6. Find the area of the ring (annulus) between them in terms of $\\pi$.",
    "answer": "$64\\pi$",
    "solution": "Outer: $\\pi(100)$. Inner: $\\pi(36)$. Ring: $100\\pi - 36\\pi = 64\\pi$."
  },
  {
    "prompt": "An equilateral triangle with side 6 is inscribed in a circle. The circle has radius $2\\sqrt{3}$. Find the area of the circle minus the triangle, in terms of $\\pi$ and $\\sqrt{3}$.",
    "answer": "$12\\pi-9\\sqrt{3}$",
    "solution": "Circle: $\\pi(2\\sqrt{3})^2 = 12\\pi$. Triangle: $(\\sqrt{3}/4)(6^2) = 9\\sqrt{3}$. Shaded: $12\\pi - 9\\sqrt{3}$."
  }
];

export default function NMSQTMathModule5() {
  return (
    <ModuleShell
      config={MODULE_CONFIG}
      visuals={{
        "angle-relationships": <AngleRelationshipsVisual />,
        "special-triangles": <SpecialTrianglesVisual />,
        "circle-formulas": <CircleFormulasVisual />,
        "area-volume": <AreaVolumeVisual />,
        "trig": <TrigVisual />,
        "trap-taxonomy": <TrapTaxonomyVisual />,
        "coordinate-geometry": <CoordinateGeometryVisual />,
      }}
      activities={{
        "exercise-angle-qs": (goNext: () => void) => (
          <MatchingExercise
            items={ANGLE_QS_EXERCISE}
            title="Angle & Triangle Solver"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "exercise-circle-qs": (goNext: () => void) => (
          <MatchingExercise
            items={CIRCLE_QS_EXERCISE}
            title="Circle Equation Workshop"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "exercise-formula-qs": (goNext: () => void) => (
          <MatchingExercise
            items={FORMULA_QS_EXERCISE}
            title="Which Formula Do I Need?"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "exercise-tri-qs": (goNext: () => void) => (
          <MatchingExercise
            items={TRI_QS_EXERCISE}
            title="Special Right Triangles Drill"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "exercise-cmp-qs": (goNext: () => void) => (
          <FillInExercise
            items={CMP_QS_EXERCISE}
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

      nextModuleHref="/courses/nmsqt-math/6"
      nextModuleLabel="Module 6: Desmos Mastery"
    />
  );
}

const MODULE_CONFIG: ModuleConfig = {
  testType: "nmsqt",
  section: "math",
  moduleNum: 5,
  title: "Geometry & Trigonometry",
  subtitle:
    "Fewer questions (~15%), but highly formulaic \u2014 memorize the key facts and these become free points.",
  accentColor: "#d4a017",
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
    { id: "quiz", label: "Practice Quiz", icon: "target" },
    { id: "complete", label: "Complete", icon: "trophy" },
  ],

  /* ──────── LESSONS ──────── */
  lessons: [
    {
      id: "angle-relationships",
      title: "Lines, Angles & Triangles",
      subtitle: "Topic 5A",
      visual: "angle-relationships",
      body: [
        "Geometry questions on the PSAT are highly formulaic. If you memorize the key angle relationships and triangle facts, these 5\u20137 questions become nearly free points.",
        "Parallel lines cut by a transversal create corresponding, alternate interior, and co-interior angle pairs. Tap the table above to review all the relationships.",
      ],
    },
    {
      id: "special-triangles",
      title: "Special Right Triangles & Pythagorean Theorem",
      subtitle: "Topic 5A (continued)",
      visual: "special-triangles",
      body: [
        "These special triangles appear on nearly every PSAT. Memorize the ratios cold. Any multiple of a Pythagorean triple is also a triple (e.g., $6$-$8$-$10$ is $3$-$4$-$5 \\times 2$).",
      ],
    },
    {
      id: "circle-formulas",
      title: "Circles: Equations, Arcs & Sectors",
      subtitle: "Topic 5B",
      visual: "circle-formulas",
      body: [
        "Circle questions test standard form equations, arc length, and sector area. The key trap: the equation gives $r^2$, not $r$. Always take the square root.",
        "Tangent lines are perpendicular to the radius at the point of tangency ($90°$). Central angle $=$ arc. Inscribed angle $=$ half the arc.",
      ],
    },
    {
      id: "area-volume",
      title: "Area, Perimeter & Volume",
      subtitle: "Topic 5C",
      visual: "area-volume",
      body: [
        "These formulas are on the reference sheet, but memorizing them saves valuable time. The key pattern: cones and pyramids are always one-third of their corresponding full shape.",
      ],
    },
    {
      id: "trig",
      title: "Trigonometry & Radians",
      subtitle: "Topic 5D",
      visual: "trig",
      body: [
        "SOH-CAH-TOA is the foundation. The complementary angle relationship ($\\sin(x) = \\cos(90° - x)$) appears on almost every PSAT. Use the converter above to build intuition for radians.",
      ],
    },
    {
      id: "trap-taxonomy",
      title: "Geometry Trap Taxonomy",
      subtitle: "Common Mistakes",
      visual: "trap-taxonomy",
      body: [
        "These four traps recur in geometry problems across every PSAT. Recognizing them before you fall in is worth 2\u20133 extra correct answers per test.",
      ],
    },
    {
      id: "coordinate-geometry",
      title: "Coordinate Geometry",
      subtitle: "Topic 5D (continued)",
      visual: "coordinate-geometry",
      body: [
        "Distance and midpoint formulas combine algebra with geometry. The distance formula is just the Pythagorean theorem applied to coordinates.",
      ],
    },
  ],

  /* ──────── WARMUP ──────── */
  warmup: [
    {
      source: "Module 4 — Percent Change",
      stem: "A price goes from $80 to $100. What is the percent increase?",
      choices: ["20%", "25%", "80%", "125%"],
      correct: 1,
      explanation: "Percent change = (new − old)/old × 100 = (100 − 80)/80 × 100 = 25%. Always divide by the OLD value.",
    },
    {
      source: "Module 4 — Statistics",
      stem: "A data set has a few extremely high outliers. Which measure of center is more affected?",
      choices: ["Mode", "Mean", "Range", "Median"],
      correct: 1,
      explanation: "The mean is pulled toward outliers. The median is resistant to extreme values.",
    },
    {
      source: "Module 4 — Scatterplots",
      stem: "In a line of best fit y = 2.5x + 15 (x = hours studied, y = test score), what does 2.5 represent?",
      choices: ["The minimum score", "Total hours studied", "The starting score", "The predicted increase per hour"],
      correct: 3,
      explanation: "The slope (2.5) represents the rate of change — each additional hour predicts a 2.5-point increase.",
    },
    {
      source: "Module 4 — Conditional Probability",
      stem: "P(A|B) means:",
      choices: ["Probability of B given A has occurred", "Probability of A given B has occurred", "Probability of A and B", "Probability of A or B"],
      correct: 1,
      explanation: "P(A|B) = \"given B, what is the probability of A?\" The denominator is the total count of B.",
    },
    {
      source: "Module 4 — Study Design",
      stem: "A study randomly assigns participants to groups and finds a difference. What can you conclude?",
      choices: ["Generalize to all populations", "Nothing — need larger sample", "Causation is possible", "Correlation only"],
      correct: 2,
      explanation: "Random assignment to groups allows causal conclusions (this is an experiment). Generalizability depends on random sampling.",
    },
  ],

  /* ──────── PRACTICE QUIZ ──────── */
  quiz: [
    {
      stem: "What is the area of a circle with diameter 10?",
      choices: ["$25\\pi$", "$100\\pi$", "$50\\pi$", "$10\\pi$"],
      correct: 0,
      explanation: "Diameter $= 10$, radius $= 5$. Area $= \\pi(5^2) = 25\\pi$. Trap: using diameter instead of radius.",
      trap: "wrong_target",
      trapAnswer: 2,
      trapDesc: "Used diameter instead of radius — The Wrong Target",
    },
    {
      stem: "In a right triangle, sin(A) = 3/5. What is cos(A)?",
      choices: ["5/3", "3/4", "3/5", "4/5"],
      correct: 3,
      explanation: "$\\sin = \\text{opp}/\\text{hyp} = 3/5$. Adjacent $= \\sqrt{25-9} = 4$. $\\cos = \\text{adj}/\\text{hyp} = 4/5$.",
      trapAnswer: 0,
      trapDesc: "Confused sin and cos ratios",
    },
    {
      stem: "A cylinder has radius 4 and height 10. Volume?",
      choices: ["$40\\pi$", "$80\\pi$", "$640\\pi$", "$160\\pi$"],
      correct: 3,
      explanation: "$V = \\pi r^2 h = \\pi(16)(10) = 160\\pi$.",
      trap: "phantom_height",
      trapAnswer: 0,
      trapDesc: "Used diameter for radius or forgot to square — Phantom Height",
    },
    {
      stem: "If sin(x) = cos(40°), what is x?",
      choices: ["40°", "60°", "90°", "50°"],
      correct: 3,
      explanation: "$\\sin(x) = \\cos(90° - x)$. So $\\cos(40°) = \\sin(50°)$. $x = 50°$.",
      trap: "unit_mismatch",
      trapAnswer: 0,
      trapDesc: "Used the given angle directly — Unit Mismatch on complementary relationship",
    },
    {
      stem: "Circle equation: <code>(x+1)² + (y−4)² = 36</code>. Point (−1, y) is on the circle. Find the positive value of y.",
      choices: ["10", "4", "8", "6"],
      correct: 0,
      explanation: "Plug in $x=-1$: $(0)^2+(y-4)^2=36 \\Rightarrow y-4=\\pm 6 \\Rightarrow y=10$ or $y=-2$. Positive: $y=10$.",
      trap: "sign_flip",
      trapAnswer: 1,
      trapDesc: "Forgot the ±, only found one solution — The Sign Flip",
    },
    {
      stem: "Convert 240° to radians.",
      choices: ["$4\\pi/3$", "$3\\pi/4$", "$2\\pi/3$", "$4\\pi$"],
      correct: 0,
      explanation: "$240 \\times \\pi/180 = 240\\pi/180 = 4\\pi/3$.",
      trap: "unit_mismatch",
      trapAnswer: 1,
      trapDesc: "Inverted the fraction — Unit Mismatch",
    },
    {
      stem: "A cone and cylinder have the same radius and height. Cylinder volume = 90π. Cone volume = ?",
      choices: ["$90\\pi$", "$30\\pi$", "$270\\pi$", "$45\\pi$"],
      correct: 1,
      explanation: "Cone $= \\frac{1}{3} \\times$ cylinder $= \\frac{1}{3} \\times 90\\pi = 30\\pi$.",
      trap: "wrong_target",
      trapAnswer: 3,
      trapDesc: "Forgot the 1/3 relationship — The Wrong Target",
    },
    {
      stem: "Circle has center (2, −3) and passes through (6, 0). What is the equation?",
      choices: ["$(x-2)^2+(y+3)^2=5$", "$(x-6)^2+y^2=25$", "$(x-2)^2+(y+3)^2=25$", "$(x+2)^2+(y-3)^2=25$"],
      correct: 2,
      explanation: "Radius = distance from $(2,-3)$ to $(6,0)$ $= \\sqrt{4^2+3^2} = \\sqrt{25} = 5$. $r^2=25$. Equation: $(x-2)^2+(y+3)^2=25$.",
      trap: "sign_flip",
      trapAnswer: 1,
      trapDesc: "Flipped the signs in the equation — The Sign Flip",
    },
  ],

  takeaways: [
    "Triangle angles sum to 180 degrees. Supplementary = 180 degrees. Complementary = 90 degrees.",
    "Memorize 30-60-90 (1:sqrt(3):2) and 45-45-90 (1:1:sqrt(2)) ratios cold.",
    "Common Pythagorean triples: 3-4-5, 5-12-13, 8-15-17 and their multiples.",
    "Circle standard form: (x-h)^2 + (y-k)^2 = r^2. Center = (h,k), Radius = r. Complete the square if needed.",
    "Arc and sector formulas: multiply by theta/360 (the fraction of the full circle).",
    "SOH-CAH-TOA. sin(x) = cos(90 degrees - x). 180 degrees = pi radians.",
    "Cones and pyramids = 1/3 of the corresponding full shape.",
    "Distance formula = Pythagorean theorem on coordinates. Midpoint = average the coordinates.",
  ],
};
