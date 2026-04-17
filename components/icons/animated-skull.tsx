"use client";

import { motion } from "framer-motion";

interface AnimatedSkullProps {
  size?: number;
  className?: string;
}

export function AnimatedSkull({ size = 48, className }: AnimatedSkullProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1, x: [0, -3, 3, -2, 2, 0] }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Cranium */}
      <path
        d="M24 6C15.163 6 8 13.163 8 22C8 28.5 12 33 14 35V40C14 41.1 14.9 42 16 42H32C33.1 42 34 41.1 34 40V35C36 33 40 28.5 40 22C40 13.163 32.837 6 24 6Z"
        fill="#9898a8"
      />
      {/* Left eye */}
      <motion.ellipse
        cx={18}
        cy={22}
        rx={4}
        ry={4.5}
        fill="var(--color-paper)"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, duration: 0.2 }}
      />
      {/* Right eye */}
      <motion.ellipse
        cx={30}
        cy={22}
        rx={4}
        ry={4.5}
        fill="var(--color-paper)"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.25, duration: 0.2 }}
      />
      {/* Nose */}
      <path d="M22 28L24 31L26 28" fill="var(--color-paper)" />
      {/* Teeth */}
      <path d="M18 36V40M22 36V40M26 36V40M30 36V40" stroke="var(--color-paper)" strokeWidth={2} />
    </motion.svg>
  );
}
