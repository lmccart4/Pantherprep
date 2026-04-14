"use client";

import { PracticeTest } from "@/components/test/practice-test";
import { RW_QUESTIONS, MATH_QUESTIONS } from "./questions";

export default function SATPracticeTest() {
  return (
    <PracticeTest
      rwQuestions={RW_QUESTIONS}
      mathQuestions={MATH_QUESTIONS}
      testType="sat"
      title="SAT Practice Test"
      rwTime={[32, 32]}
      mathTime={[35, 35]}
    />
  );
}
