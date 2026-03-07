"use client";

import { motion } from "framer-motion";

const orbs = [
  {
    className: "w-[700px] h-[500px] -top-[10%] -left-[5%]",
    gradient: "radial-gradient(ellipse at center, rgba(214,40,40,0.10), transparent 70%)",
    move: {
      x: [0, 60, 20, -40, 0],
      y: [0, 40, 80, 30, 0],
    },
    moveDuration: 55,
    pulseDuration: 8,
  },
  {
    className: "w-[550px] h-[400px] -bottom-[8%] -right-[5%]",
    gradient: "radial-gradient(ellipse at center, rgba(168,85,247,0.08), transparent 70%)",
    move: {
      x: [0, -50, -20, 40, 0],
      y: [0, -30, -70, -25, 0],
    },
    moveDuration: 48,
    pulseDuration: 10,
  },
  {
    className: "w-[400px] h-[350px] top-[40%] left-[50%]",
    gradient: "radial-gradient(ellipse at center, rgba(59,130,246,0.05), transparent 70%)",
    move: {
      x: [0, 35, -30, -50, 0],
      y: [0, -45, 25, -35, 0],
    },
    moveDuration: 62,
    pulseDuration: 12,
  },
];

export function BackgroundOrbs({ intensifyForLogin = false }: { intensifyForLogin?: boolean }) {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full blur-[80px] ${orb.className}`}
          style={{
            background: intensifyForLogin
              ? orb.gradient.replace(/0\.10/, "0.22").replace(/0\.08/, "0.16").replace(/0\.05/, "0.10")
              : orb.gradient,
          }}
          animate={{
            x: orb.move.x,
            y: orb.move.y,
            opacity: [1, 0.55, 1],
          }}
          transition={{
            x: { duration: orb.moveDuration, ease: "easeInOut", repeat: Infinity },
            y: { duration: orb.moveDuration, ease: "easeInOut", repeat: Infinity },
            opacity: { duration: orb.pulseDuration, ease: "easeInOut", repeat: Infinity },
          }}
        />
      ))}
    </div>
  );
}
