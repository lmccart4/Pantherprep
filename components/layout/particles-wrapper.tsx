"use client";

import dynamic from "next/dynamic";

// Lazy-load the particle background so it doesn't block initial render (LCP optimization)
const NeuralParticles = dynamic(
  () => import("./neural-particles").then((m) => ({ default: m.NeuralParticles })),
  { ssr: false }
);

export function ParticlesWrapper() {
  return <NeuralParticles count={70} connectionDist={120} speed={0.15} entropy={0.005} fireChance={0.0003} />;
}
