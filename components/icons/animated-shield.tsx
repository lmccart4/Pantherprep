"use client";

import { motion } from "framer-motion";

interface AnimatedShieldProps {
  size?: number;
  className?: string;
}

export function AnimatedShield({ size = 20, className }: AnimatedShieldProps) {
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
      <motion.path
        d="M12 2L3 7V12C3 17.523 6.838 22.074 12 23C17.162 22.074 21 17.523 21 12V7L12 2Z"
        fill="var(--color-accent-green)"
        initial={{ opacity: 0.5 }}
        animate={{ opacity: [0.5, 1, 0.7, 1] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.path
        d="M12 2L3 7V12C3 17.523 6.838 22.074 12 23C17.162 22.074 21 17.523 21 12V7L12 2Z"
        stroke="rgba(255,255,255,0.2)"
        strokeWidth={1}
        fill="none"
      />
    </motion.svg>
  );
}
