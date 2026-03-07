"use client";

import { motion } from "framer-motion";

interface AnimatedTrophyProps {
  size?: number;
  className?: string;
}

export function AnimatedTrophy({ size = 48, className }: AnimatedTrophyProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      initial={{ scale: 0, rotate: -10 }}
      animate={{ scale: [0, 1.15, 1], rotate: [-10, 5, 0] }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Cup */}
      <motion.path
        d="M14 8H34V20C34 26.627 29.523 32 24 32C18.477 32 14 26.627 14 20V8Z"
        fill="#f59e0b"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
      {/* Left handle */}
      <motion.path
        d="M14 12H10C10 12 8 12 8 16C8 20 10 20 10 20H14"
        stroke="#f59e0b"
        strokeWidth={2.5}
        fill="none"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      />
      {/* Right handle */}
      <motion.path
        d="M34 12H38C38 12 40 12 40 16C40 20 38 20 38 20H34"
        stroke="#f59e0b"
        strokeWidth={2.5}
        fill="none"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      />
      {/* Stem + base */}
      <path d="M22 32H26V36H22V32Z" fill="#d97706" />
      <path d="M18 36H30V40H18V36Z" fill="#d97706" />
      {/* Shimmer */}
      <motion.rect
        x={18}
        y={10}
        width={4}
        height={14}
        rx={2}
        fill="rgba(255,255,255,0.3)"
        initial={{ opacity: 0, y: 2 }}
        animate={{ opacity: [0, 0.6, 0], y: [2, -1, -4] }}
        transition={{ duration: 0.6, delay: 0.3 }}
      />
    </motion.svg>
  );
}
