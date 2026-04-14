"use client";

import { PracticeTest } from "@/components/test/practice-test";
import { RW_QUESTIONS, MATH_QUESTIONS } from "./questions";

export default function NMSQTPracticeTest() {
  return (
    <PracticeTest
      rwQuestions={RW_QUESTIONS}
      mathQuestions={MATH_QUESTIONS}
      testType="nmsqt"
      title="NMSQT Practice Test"
      rwTime={[32, 32]}
      mathTime={[35, 35]}
    />
  );
}
