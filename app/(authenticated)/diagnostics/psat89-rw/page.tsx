"use client";

import { DiagnosticTest } from "@/components/test/diagnostic-test";
import { QUESTIONS } from "./questions";

export default function PSAT89RWDiagnostic() {
  return (
    <DiagnosticTest
      testType="psat89"
      section="rw"
      title="PSAT 8/9 Reading & Writing Diagnostic"
      timeMinutes={32}
      domains={["Craft and Structure", "Information and Ideas", "Standard English Conventions", "Expression of Ideas"]}
      questions={QUESTIONS}
    />
  );
}


