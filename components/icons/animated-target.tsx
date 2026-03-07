"use client";

import { motion } from "framer-motion";

interface AnimatedTargetProps {
  size?: number;
  className?: string;
}

export function AnimatedTarget({ size = 28, className }: AnimatedTargetProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      initial={{ scale: 0 }}
      animate={{ scale: [0, 1.1, 1] }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <motion.circle
        cx={12}
        cy={12}
        r={10}
        stroke="#ef4444"
        strokeWidth={2}
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.4 }}
      />
      <motion.circle
        cx={12}
        cy={12}
        r={6}
        stroke="#ef4444"
        strokeWidth={2}
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.35, delay: 0.1 }}
      />
      <motion.circle
        cx={12}
        cy={12}
        r={2.5}
        fill="#ef4444"
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.3, 1] }}
        transition={{ delay: 0.25, duration: 0.3 }}
      />
    </motion.svg>
  );
}
