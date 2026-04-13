"use client";

import { DiagnosticTest } from "@/components/test/diagnostic-test";
import { QUESTIONS } from "./questions";

export default function NMSQTMathDiagnostic() {
  return (
    <DiagnosticTest
      testType="nmsqt"
      section="math"
      title="PSAT/NMSQT Math Diagnostic"
      timeMinutes={35}
      domains={["Algebra", "Advanced Math", "Problem-Solving & Data Analysis", "Geometry & Trigonometry"]}
      questions={QUESTIONS}
    />
  );
}


