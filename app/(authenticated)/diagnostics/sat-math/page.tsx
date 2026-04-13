"use client";

import { DiagnosticTest } from "@/components/test/diagnostic-test";
import { QUESTIONS } from "./questions";


export default function SATMathDiagnostic() {
  return (
    <DiagnosticTest
      testType="sat"
      section="math"
      title="SAT Math Diagnostic"
      timeMinutes={35}
      domains={["Algebra", "Advanced Math", "Problem-Solving & Data Analysis", "Geometry & Trigonometry"]}
      questions={QUESTIONS}
    />
  );
}


