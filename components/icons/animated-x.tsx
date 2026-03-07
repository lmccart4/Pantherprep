"use client";

import { motion } from "framer-motion";

interface AnimatedXProps {
  size?: number;
  className?: string;
}

export function AnimatedX({ size = 20, className }: AnimatedXProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      initial={{ scale: 0, rotate: -45 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 12, duration: 0.3 }}
    >
      <motion.path
        d="M6 6L18 18"
        stroke="var(--color-accent-red)"
        strokeWidth={3}
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      />
      <motion.path
        d="M18 6L6 18"
        stroke="var(--color-accent-red)"
        strokeWidth={3}
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.25, ease: "easeOut", delay: 0.1 }}
      />
    </motion.svg>
  );
}
