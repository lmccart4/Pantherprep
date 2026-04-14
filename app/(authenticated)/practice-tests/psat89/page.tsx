"use client";

import { PracticeTest } from "@/components/test/practice-test";
import { RW_QUESTIONS, MATH_QUESTIONS } from "./questions";

export default function PSAT89PracticeTest() {
  return (
    <PracticeTest
      rwQuestions={RW_QUESTIONS}
      mathQuestions={MATH_QUESTIONS}
      testType="psat89"
      title="PSAT 8/9 Practice Test"
      rwTime={[32, 32]}
      mathTime={[35, 35]}
    />
  );
}
