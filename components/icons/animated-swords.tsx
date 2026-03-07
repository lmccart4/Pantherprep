"use client";

import { motion } from "framer-motion";

interface AnimatedSwordsProps {
  size?: number;
  className?: string;
}

export function AnimatedSwords({ size = 28, className }: AnimatedSwordsProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      initial={{ scale: 0 }}
      animate={{ scale: [0, 1.2, 1] }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* Left sword */}
      <motion.g
        initial={{ rotate: -30, x: -4 }}
        animate={{ rotate: 0, x: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        style={{ transformOrigin: "16px 16px" }}
      >
        <path d="M6 26L22 4" stroke="#9898a8" strokeWidth={2.5} strokeLinecap="round" />
        <path d="M4 22L10 24L8 28Z" fill="#6b7280" />
        <path d="M19 8L23 6" stroke="#d1d5db" strokeWidth={1.5} strokeLinecap="round" />
      </motion.g>
      {/* Right sword */}
      <motion.g
        initial={{ rotate: 30, x: 4 }}
        animate={{ rotate: 0, x: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        style={{ transformOrigin: "16px 16px" }}
      >
        <path d="M26 26L10 4" stroke="#9898a8" strokeWidth={2.5} strokeLinecap="round" />
        <path d="M28 22L22 24L24 28Z" fill="#6b7280" />
        <path d="M13 8L9 6" stroke="#d1d5db" strokeWidth={1.5} strokeLinecap="round" />
      </motion.g>
      {/* Clash spark */}
      <motion.circle
        cx={16}
        cy={12}
        r={3}
        fill="rgba(245,158,11,0.8)"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 1.5, 0], opacity: [0, 1, 0] }}
        transition={{ duration: 0.4, delay: 0.2 }}
      />
    </motion.svg>
  );
}
