"use client";

import { useState } from "react";
import { renderMath } from "@/lib/katex-render";

const FORMULAS = [
  { label: "Area of a Circle", formula: "$A = \\pi r^2$" },
  { label: "Circumference", formula: "$C = 2\\pi r$" },
  { label: "Area of a Rectangle", formula: "$A = lw$" },
  { label: "Area of a Triangle", formula: "$A = \\frac{1}{2}bh$" },
  { label: "Pythagorean Theorem", formula: "$a^2 + b^2 = c^2$" },
  { label: "Slope", formula: "$m = \\frac{y_2 - y_1}{x_2 - x_1}$" },
  { label: "Slope-Intercept Form", formula: "$y = mx + b$" },
  { label: "Quadratic Formula", formula: "$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$" },
  { label: "Volume of a Cylinder", formula: "$V = \\pi r^2 h$" },
  { label: "Volume of a Sphere", formula: "$V = \\frac{4}{3}\\pi r^3$" },
  { label: "Volume of a Cone", formula: "$V = \\frac{1}{3}\\pi r^2 h$" },
  { label: "Volume of a Rectangular Prism", formula: "$V = lwh$" },
  { label: "Special Right Triangles", formula: "$30\\text{-}60\\text{-}90: x, x\\sqrt{3}, 2x$ and $45\\text{-}45\\text{-}90: x, x, x\\sqrt{2}$" },
  { label: "Radians ↔ Degrees", formula: "$\\text{Radians} = \\text{Degrees} \\times \\frac{\\pi}{180}$" },
];

interface ReferenceSheetProps {
  className?: string;
}

export function ReferenceSheet({ className }: ReferenceSheetProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className={className}>
      <button
        onClick={() => setOpen(!open)}
        className=" border border-border-default px-3 py-1.5 text-xs font-medium text-text-muted transition-colors hover:border-border-light hover:text-text-secondary"
      >
        {open ? "Hide" : "Show"} Reference
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-80  border border-border-default bg-bg-card p-4 shadow-md">
          <h4 className="mb-3 kicker">
            Math Reference Sheet
          </h4>
          <div className="flex flex-col gap-2">
            {FORMULAS.map((f) => (
              <div key={f.label} className="flex items-baseline justify-between gap-3">
                <span className="shrink-0 text-xs text-text-muted">{f.label}</span>
                <span className="text-sm text-text-secondary">{renderMath(f.formula)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
