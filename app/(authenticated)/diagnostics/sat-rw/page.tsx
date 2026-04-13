"use client";

import { DiagnosticTest } from "@/components/test/diagnostic-test";
import { QUESTIONS } from "./questions";

export default function SATRWDiagnostic() {
  return (
    <DiagnosticTest
      testType="sat"
      section="rw"
      title="SAT Reading & Writing Diagnostic"
      timeMinutes={32}
      domains={["Craft and Structure", "Information and Ideas", "Standard English Conventions", "Expression of Ideas"]}
      questions={QUESTIONS}
    />
  );
}


