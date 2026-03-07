"use client";

import { motion } from "framer-motion";

interface AnimatedPartyProps {
  size?: number;
  className?: string;
}

export function AnimatedParty({ size = 48, className }: AnimatedPartyProps) {
  const confettiColors = ["#ef4444", "#f59e0b", "#22c55e", "#3b82f6", "#a855f7"];
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      initial={{ scale: 0, rotate: -15 }}
      animate={{ scale: [0, 1.15, 1], rotate: [-15, 5, 0] }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Cone */}
      <path d="M10 40L20 14L28 38Z" fill="#f59e0b" />
      <path d="M10 40L20 14L16 30Z" fill="#d97706" />
      {/* Top burst */}
      <motion.ellipse
        cx={22}
        cy={13}
        rx={8}
        ry={5}
        fill="#ef4444"
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.2, 1] }}
        transition={{ delay: 0.2, duration: 0.3 }}
      />
      {/* Confetti pieces */}
      {confettiColors.map((color, i) => {
        const angle = (i / confettiColors.length) * Math.PI * 2 - Math.PI / 2;
        const radius = 14;
        const cx = 22 + Math.cos(angle) * radius;
        const cy = 13 + Math.sin(angle) * radius;
        return (
          <motion.circle
            key={i}
            cx={22}
            cy={13}
            r={2.5}
            fill={color}
            initial={{ x: 0, y: 0, opacity: 0 }}
            animate={{ x: cx - 22, y: cy - 13, opacity: [0, 1, 0] }}
            transition={{ duration: 0.5, delay: 0.25 + i * 0.05 }}
          />
        );
      })}
    </motion.svg>
  );
}
