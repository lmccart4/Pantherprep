"use client";

import { ModuleShell } from "@/components/course/module-shell";
import type { ModuleConfig } from "@/types/module";
import { FillInExercise, type FillInItem } from "@/components/course/activities/fill-in-exercise";
import {
  AngleRelationshipsVisual,
  SpecialTrianglesVisual,
  FormulaGridVisual,
  CirclesVisual,
  GeometryTrapsVisual,
} from "./lesson-visuals";

export default function PSAT89MathModule5() {
  return (
    <ModuleShell
      config={MODULE_CONFIG}
      nextModuleHref="/courses/psat89-math/6"
      nextModuleLabel="Module 6: Desmos & Calculator Strategies"
      visuals={{
        "angles-triangles": <AngleRelationshipsVisual />,
        "special-triangles": <SpecialTrianglesVisual />,
        "area-volume": <FormulaGridVisual />,
        "circles": <CirclesVisual />,
        "geometry-traps": <GeometryTrapsVisual />,
      }}
      activities={{
        "exercise-frm": (goNext: () => void) => (
          <FillInExercise
            items={FRM_EXERCISE}
            title="Which Formula?"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "exercise-ang": (goNext: () => void) => (
          <FillInExercise
            items={ANG_EXERCISE}
            title="Angles & Triangles"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "exercise-tri": (goNext: () => void) => (
          <FillInExercise
            items={TRI_EXERCISE}
            title="Tri"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "exercise-cmp": (goNext: () => void) => (
          <FillInExercise
            items={CMP_EXERCISE}
            title="Composite Shapes"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        )
      }}
    />
  );
}

const ANG_EXERCISE: FillInItem[] = [
  {
    "prompt": "Two angles on a straight line. One is $65°$. What is the other?",
    "answer": 115,
    "solution": "Supplementary: $180° - 65° = 115°$.",
    "tier": 1
  },
  {
    "prompt": "Two vertical angles. One is $42°$. What is the other?",
    "answer": 42,
    "solution": "Vertical angles are equal: $42°$.",
    "tier": 1
  },
  {
    "prompt": "A triangle has angles $50°$ and $70°$. What is the third angle?",
    "answer": 60,
    "solution": "$180° - 50° - 70° = 60°$.",
    "tier": 1
  },
  {
    "prompt": "Parallel lines cut by a transversal. One angle is $130°$. What is the alternate interior angle?",
    "answer": 130,
    "solution": "Alternate interior angles are equal: $130°$.",
    "tier": 1
  },
  {
    "prompt": "An exterior angle of a triangle equals the sum of the two non-adjacent interior angles. If those are $45°$ and $55°$, what is the exterior angle?",
    "answer": 100,
    "solution": "$45° + 55° = 100°$.",
    "tier": 2
  },
  {
    "prompt": "Two angles are complementary. One is $3x$ and the other is $2x + 10$. Solve for $x$.",
    "answer": 16,
    "solution": "$3x + 2x + 10 = 90 \\Rightarrow 5x = 80 \\Rightarrow x = 16$.",
    "tier": 2
  },
  {
    "prompt": "In similar triangles, the sides of the smaller are 3, 4, 5. The longest side of the larger is 15. What is the shortest side of the larger?",
    "answer": 9,
    "solution": "Scale factor: $15/5 = 3$. Shortest $= 3 \\times 3 = 9$.",
    "tier": 2
  },
  {
    "prompt": "A triangle has sides 7, 10, and x. What is the largest possible integer value of x?",
    "answer": 16,
    "solution": "Triangle inequality: x < 7 + 10 = 17. Largest integer: 16.",
    "tier": 3
  }
];

const TRI_EXERCISE: FillInItem[] = [
  {
    "prompt": "<strong>45-45-90:</strong> Each leg = 5. Hypotenuse = ?",
    "answer": "$5\\sqrt{2}$",
    "solution": "45-45-90 ratio: hyp $= \\text{leg} \\times \\sqrt{2} = 5\\sqrt{2} \\approx 7.07$."
  },
  {
    "prompt": "<strong>30-60-90:</strong> Short leg = 4. Hypotenuse = ?",
    "answer": "8",
    "solution": "30-60-90: hyp $= 2 \\times$ short leg $= 2 \\times 4 = 8$."
  },
  {
    "prompt": "<strong>30-60-90:</strong> Short leg = 4. Long leg = ?",
    "answer": "$4\\sqrt{3}$",
    "solution": "30-60-90: long leg $= \\text{short} \\times \\sqrt{3} = 4\\sqrt{3} \\approx 6.93$."
  },
  {
    "prompt": "<strong>45-45-90:</strong> Hypotenuse = 10. Each leg = ?",
    "answer": "$5\\sqrt{2}$",
    "solution": "leg $= \\text{hyp}/\\sqrt{2} = 10/\\sqrt{2} = 5\\sqrt{2} \\approx 7.07$."
  },
  {
    "prompt": "<strong>30-60-90:</strong> Hypotenuse = 14. Short leg = ?",
    "answer": "7",
    "solution": "short $= \\text{hyp}/2 = 14/2 = 7$."
  },
  {
    "prompt": "Right triangle with legs 6 and 8. Hypotenuse = ?",
    "answer": "10",
    "solution": "$6^2 + 8^2 = 36 + 64 = 100$. $\\sqrt{100} = 10$. (3-4-5 triple $\\times 2$!)"
  }
];

const CMP_EXERCISE: FillInItem[] = [
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
  }
];

const FRM_EXERCISE: FillInItem[] = [
  {
    "prompt": "Find the area of a triangle with base 10 and height 6.",
    "answer": "$A = \\frac{1}{2}bh$",
    "solution": "$\\frac{1}{2} \\times 10 \\times 6 = 30$."
  },
  {
    "prompt": "Find the volume of a cylinder with radius 3 and height 10.",
    "answer": "$V = \\pi r^2 h$",
    "solution": "$\\pi(3^2)(10) = 90\\pi$."
  },
  {
    "prompt": "Find the circumference of a circle with radius 7.",
    "answer": "$C = 2\\pi r$",
    "solution": "$2\\pi(7) = 14\\pi$."
  },
  {
    "prompt": "Find the area of a sector with central angle 60° and radius 9.",
    "answer": "$\\frac{\\theta}{360}\\pi r^2$",
    "solution": "$\\frac{60}{360}\\pi(81) = 13.5\\pi$."
  },
  {
    "prompt": "Find the volume of a cone with radius 4 and height 9.",
    "answer": "$V = \\frac{1}{3}\\pi r^2 h$",
    "solution": "$\\frac{1}{3}\\pi(16)(9) = 48\\pi$."
  },
  {
    "prompt": "Find the area of a trapezoid with parallel sides 5 and 11, height 4.",
    "answer": "$A = \\frac{1}{2}(b_1+b_2)h$",
    "solution": "$\\frac{1}{2}(5+11)(4) = 32$."
  },
  {
    "prompt": "Find the area of a shaded region between a square (side 10) and an inscribed circle.",
    "answer": "$A(\\text{square})-A(\\text{circle})$",
    "solution": "$100 - \\pi(25) = 100 - 25\\pi$."
  },
  {
    "prompt": "Find the volume of a sphere with radius 6.",
    "answer": "$V = \\frac{4}{3}\\pi r^3$",
    "solution": "$\\frac{4}{3}\\pi(216) = 288\\pi$."
  }
];

const MODULE_CONFIG: ModuleConfig = {
  testType: "psat89",
  section: "math",
  moduleNum: 5,
  title: "Geometry",
  subtitle: "Angles, triangles, circles, and area/volume",
  accentColor: "#06b6d4",
  screens: [
    { id: "welcome", label: "Welcome", icon: "welcome" },
    { id: "warmup", label: "Warm-Up", icon: "warmup" },
    { id: "lesson", label: "Lesson", icon: "lesson" },
    { id: "quiz", label: "Practice", icon: "quiz" },
        { id: "exercise-frm", label: "Which Formula?", icon: "zap" },
    { id: "exercise-ang", label: "Angles & Triangles", icon: "zap" },
    { id: "exercise-tri", label: "Tri", icon: "zap" },
    { id: "exercise-cmp", label: "Composite Shapes", icon: "zap" },
    { id: "complete", label: "Complete", icon: "complete" },
  ],
  warmup: [
    {
      source: "Module 4 -- Ratios",
      stem: "A recipe uses 3 cups of flour for every 2 cups of sugar. If you use 12 cups of flour, how many cups of sugar do you need?",
      choices: ["8", "6", "9", "18"],
      correct: 0,
      explanation:
        "Set up a proportion: $3/2 = 12/x$. Cross-multiply: $3x = 24$, so $x = 8$ cups of sugar.",
    },
    {
      source: "Module 4 -- Percent Increase",
      stem: "A shirt originally costs \\$40 and is marked up 25%. What is the new price?",
      choices: ["\\$45", "\\$50", "\\$55", "\\$65"],
      correct: 1,
      explanation:
        "25% of \\$40 $=$ \\$10. New price $=$ \\$40 $+$ \\$10 $=$ \\$50. Or: \\$40 $\\times 1.25 =$ \\$50.",
    },
    {
      source: "Module 4 -- Probability",
      stem: "A bag has 3 red, 5 blue, and 2 green marbles. What is the probability of drawing a blue marble?",
      choices: ["$1/5$", "$1/2$", "$3/10$", "$5/10$"],
      correct: 1,
      explanation:
        "Total marbles $= 10$. $P(\\text{blue}) = 5/10 = 1/2$.",
    },
    {
      source: "Module 4 -- Two-Way Tables",
      stem: "In a class, 12 students play sports and get A's, 8 play sports but don't get A's. What fraction of athletes get A's?",
      choices: ["$8/20$", "$12/8$", "$20/12$", "$12/20$"],
      correct: 3,
      explanation:
        "Total athletes $= 12 + 8 = 20$. Fraction with A's $= 12/20 = 3/5$.",
    },
    {
      source: "Module 4 -- Correlation",
      stem: "A study finds that students who sleep more tend to score higher on tests. Can we conclude that sleeping more CAUSES higher test scores?",
      choices: [
        "Yes, if the sample is large",
        "Yes, the data proves it",
        "No -- correlation does not equal causation",
        "Only with a randomized experiment"
      ],
      correct: 2,
      explanation:
        "Observational studies show association, not causation. Lurking variables (like study habits) could explain both.",
    },
  ],
  lessons: [
    {
      id: "angles-triangles",
      title: "Lines, Angles & Triangles",
      subtitle: "Topic 5A",
      visual: "angles-triangles",
      body: [
        "The table above shows all the angle relationships you need. Tap through the key pairs and triangle properties.",
        "Isosceles triangle: Two equal sides and two equal base angles. Equilateral triangle: All sides and angles equal ($60°$ each).",
      ],
    },
    {
      id: "special-triangles",
      title: "Special Right Triangles",
      subtitle: "Topic 5B",
      visual: "special-triangles",
      body: [
        "Tap each triangle card above to see worked examples. Memorize the Pythagorean triples to save calculation time.",
        "The PSAT 8/9 tests these by ratio only -- no trigonometric functions (sin, cos, tan) are required on this test.",
      ],
    },
    {
      id: "area-volume",
      title: "Area & Volume",
      subtitle: "Topic 5C",
      visual: "area-volume",
      body: [
        "All formulas are shown above. The height must always be perpendicular to the base (The Phantom Height trap).",
        "Composite shapes: Break complex shapes into simpler ones. Add areas for combined shapes, subtract for cut-out regions.",
        "A square with diagonal $d$: Area $= \\frac{1}{2}d^2$. Side $= d/\\sqrt{2}$.",
      ],
    },
    {
      id: "circles",
      title: "Circles",
      subtitle: "Topic 5D",
      visual: "circles",
      body: [
        "Use the interactive tool above to practice reading circle equations. The sign flip is the #1 trap on circle problems.",
        "Tangent line to a circle: Perpendicular to the radius at the point of tangency. Creates a right angle.",
      ],
    },
    {
      id: "geometry-traps",
      title: "Common Geometry Traps",
      subtitle: "Topic 5E",
      visual: "geometry-traps",
      body: [
        "Tap each trap to see the fix. These are the most common ways students lose points on geometry questions.",
      ],
    },
  ],
  quiz: [
    {
      stem: "A right triangle has legs 5 and 12. What is the hypotenuse?",
      choices: ["15", "13", "10", "17"],
      correct: 1,
      explanation:
        "5-12-13 Pythagorean triple. Or: $\\sqrt{25 + 144} = \\sqrt{169} = 13$.",
      difficulty: "easy",
      type: "5A",
      trapAnswer: 0,
      trapDesc: "Guessed 10 -- may have confused with 6-8-10 triple",
      domain: "Geometry & Trig",
      skill: "triangles",
    },
    {
      stem: "A triangle has angles $35°$ and $80°$. What is the third angle?",
      choices: ["$65°$", "$75°$", "$85°$", "$55°$"],
      correct: 0,
      explanation: "$180° - 35° - 80° = 65°$.",
      difficulty: "easy",
      type: "5A",
      trap: "wrong_target",
      trapAnswer: 2,
      trapDesc: "Subtracted only one angle -- The Wrong Target",
      domain: "Geometry & Trig",
      skill: "triangles",
    },
    {
      stem: "What is the area of a triangle with base 14 and height 9?",
      choices: ["126", "63", "45", "56"],
      correct: 1,
      explanation: "$A = \\frac{1}{2}(14)(9) = 63$.",
      difficulty: "easy",
      type: "5C",
      trapAnswer: 1,
      trapDesc: "Forgot the $\\frac{1}{2}$ -- computed $14 \\times 9 = 126$",
      domain: "Geometry & Trig",
      skill: "triangles",
    },
    {
      stem: "A circle has radius 5. What is its area?",
      choices: ["$10\\pi$", "$50\\pi$", "$25\\pi$", "$5\\pi$"],
      correct: 2,
      explanation: "$A = \\pi r^2 = \\pi(25) = 25\\pi$.",
      difficulty: "easy",
      type: "5D",
      trapAnswer: 0,
      trapDesc: "Used circumference formula ($2\\pi r = 10\\pi$) instead of area",
      domain: "Geometry & Trig",
      skill: "triangles",
    },
    {
      stem: "In a 30-60-90 triangle, the hypotenuse is 20. What is the short leg?",
      choices: ["10", "$10\\sqrt{2}$", "$20\\sqrt{3}$", "$10\\sqrt{3}$"],
      correct: 0,
      explanation: "Short leg $=$ hyp$/2 = 20/2 = 10$.",
      difficulty: "medium",
      type: "5B",
      trapAnswer: 2,
      trapDesc: "Multiplied by $\\sqrt{3}$ instead of dividing by 2",
      domain: "Geometry & Trig",
      skill: "triangles",
    },
    {
      stem: "A cylinder has radius 3 and height 8. What is its volume?",
      choices: ["$96\\pi$", "$72\\pi$", "$24\\pi$", "$48\\pi$"],
      correct: 1,
      explanation: "$V = \\pi r^2 h = \\pi(9)(8) = 72\\pi$.",
      difficulty: "medium",
      type: "5C",
      trapAnswer: 0,
      trapDesc: "Used $2\\pi rh$ (surface area formula) instead of $\\pi r^2 h$",
      domain: "Geometry & Trig",
      skill: "triangles",
    },
    {
      stem: "The equation $(x + 4)^2 + (y - 1)^2 = 36$ represents a circle. What is its center?",
      choices: ["$(-4, -1)$", "$(4, 1)$", "$(4, -1)$", "$(-4, 1)$"],
      correct: 3,
      explanation:
        "$(x + 4) = (x - (-4)) \\Rightarrow h = -4$. $(y - 1) \\Rightarrow k = 1$. Center: $(-4, 1)$.",
      difficulty: "medium",
      type: "5D",
      trap: "sign_flip",
      trapAnswer: 0,
      trapDesc:
        "Read $(x + 4)$ as center $x = 4$ -- forgot the sign flip in $(x - h)^2$ form",
      domain: "Geometry & Trig",
      skill: "triangles",
    },
    {
      stem: "A $60°$ sector of a circle with radius 12. What is the arc length?",
      choices: ["$4\\pi$", "$12\\pi$", "$6\\pi$", "$2\\pi$"],
      correct: 0,
      explanation:
        "$\\frac{60}{360} \\times 2\\pi(12) = \\frac{1}{6}(24\\pi) = 4\\pi$.",
      difficulty: "medium",
      type: "5D",
      trapAnswer: 0,
      trapDesc: "Used area formula instead of circumference for arc length",
      domain: "Geometry & Trig",
      skill: "triangles",
    },
    {
      stem: "A square has a diagonal of 10. What is its area?",
      choices: ["50", "25", "$25\\sqrt{2}$", "100"],
      correct: 0,
      explanation:
        "Area $= \\frac{1}{2}d^2 = \\frac{1}{2}(100) = 50$.",
      difficulty: "hard",
      type: "5C",
      trap: "wrong_target",
      trapAnswer: 0,
      trapDesc: "Found side$^2 = 25$ but forgot 45-45-90 -- side $= 10/\\sqrt{2}$",
      domain: "Geometry & Trig",
      skill: "triangles",
    },
    {
      stem: "Two concentric circles have areas $100\\pi$ and $36\\pi$. A point is chosen randomly inside the larger circle. What is the probability it lands in the ring (not the smaller circle)?",
      choices: ["$6/10$", "$36/100$", "$64/100$", "$16/25$"],
      correct: 3,
      explanation:
        "Ring area $= 100\\pi - 36\\pi = 64\\pi$. $P = 64\\pi/100\\pi = 64/100 = 16/25$.",
      difficulty: "hard",
      type: "5D",
      trapAnswer: 0,
      trapDesc:
        "Used $36/100$ -- found probability of landing IN the small circle instead of the ring",
      domain: "Geometry & Trig",
      skill: "triangles",
    },
  ],
  takeaways: [
    "Geometry is ~15% of the PSAT 8/9 -- and there is NO trigonometry.",
    "Parallel lines + transversal: every angle is either x degrees or (180 - x) degrees.",
    "Triangle angles sum to 180 degrees. Exterior angle = sum of the two remote interior angles.",
    "Memorize Pythagorean triples: 3-4-5, 5-12-13, 8-15-17 (and their multiples).",
    "Special right triangles: 30-60-90 -> 1:sqrt(3):2 | 45-45-90 -> 1:1:sqrt(2).",
    "Cones and pyramids = 1/3 of the full shape. Shaded region = outer - inner.",
    "Circle equation: (x-h)^2+(y-k)^2=r^2. Center = (h,k), radius = sqrt(r^2). Watch the signs!",
    "Arc/sector: use the fraction (central angle / 360) x full circumference or area.",
    "Distance formula IS the Pythagorean theorem. Draw the right triangle on the coordinate plane.",
  ],
};
