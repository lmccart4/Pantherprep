"use client";

import { DiagnosticTest } from "@/components/test/diagnostic-test";
import { QUESTIONS } from "./questions";

export default function PSAT89MathDiagnostic() {
  return (
    <DiagnosticTest
      testType="psat89"
      section="math"
      title="PSAT 8/9 Math Diagnostic"
      timeMinutes={35}
      domains={["Algebra", "Advanced Math", "Problem-Solving & Data Analysis", "Geometry"]}
      questions={QUESTIONS}
    />
  );
}


