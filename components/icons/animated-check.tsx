"use client";

import { motion } from "framer-motion";

interface AnimatedCheckProps {
  size?: number;
  className?: string;
}

export function AnimatedCheck({ size = 20, className }: AnimatedCheckProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 15, duration: 0.3 }}
    >
      <motion.path
        d="M4 12.5L9.5 18L20 6"
        stroke="var(--color-accent-green)"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      />
    </motion.svg>
  );
}
