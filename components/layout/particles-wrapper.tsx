"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

// Lazy-load the particle background so it doesn't block initial render (LCP optimization)
const NeuralParticles = dynamic(
  () => import("./neural-particles").then((m) => ({ default: m.NeuralParticles })),
  { ssr: false }
);

// Content-heavy routes where the background competes with the page content —
// dim the particles there so the UI stays the hero.
const DIM_ROUTES = ["/home", "/dashboard"];

export function ParticlesWrapper() {
  const pathname = usePathname();
  const dim = DIM_ROUTES.some((r) => pathname?.startsWith(r));
  return (
    <div style={{ opacity: dim ? 0.35 : 1 }} className="transition-opacity duration-500">
      <NeuralParticles count={70} connectionDist={120} speed={0.15} entropy={0.005} fireChance={0.0003} />
    </div>
  );
}
