"use client";

import { motion } from "framer-motion";

interface AnimatedFireProps {
  size?: number;
  className?: string;
}

export function AnimatedFire({ size = 20, className }: AnimatedFireProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      initial={{ scale: 0 }}
      animate={{ scale: 1, scaleY: [1, 1.08, 0.95, 1.05, 1] }}
      transition={{ duration: 0.5, ease: "easeOut", scaleY: { repeat: Infinity, duration: 0.8, ease: "easeInOut" } }}
    >
      <motion.path
        d="M12 2C12 2 4 10 4 15C4 19.418 7.582 22 12 22C16.418 22 20 19.418 20 15C20 10 12 2 12 2Z"
        fill="#f59e0b"
      />
      <motion.path
        d="M12 8C12 8 8 13 8 16C8 18.761 9.791 20 12 20C14.209 20 16 18.761 16 16C16 13 12 8 12 8Z"
        fill="#ef4444"
      />
      <motion.path
        d="M12 13C12 13 10 15.5 10 17C10 18.105 10.895 19 12 19C13.105 19 14 18.105 14 17C14 15.5 12 13 12 13Z"
        fill="#fbbf24"
      />
    </motion.svg>
  );
}
