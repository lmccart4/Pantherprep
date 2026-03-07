"use client";

import { useEffect, useRef, useCallback } from "react";

interface NeuralParticlesProps {
  /** Number of particles (default 110) */
  count?: number;
  /** Max connection distance in px (default 140) */
  connectionDist?: number;
  /** Base movement speed (default 0.4) */
  speed?: number;
  /** Brownian entropy factor (default 0.015) */
  entropy?: number;
  /** Chance per frame a node spontaneously fires (default 0.003) */
  fireChance?: number;
  /** Enable neural firing propagation (default true) */
  firingEnabled?: boolean;
  /** Additional className for the canvas container */
  className?: string;
}

interface Particle {
  x: number;
  y: number;
  baseRadius: number;
  radius: number;
  vx: number;
  vy: number;
  opacity: number;
  fireIntensity: number;
  fireDecay: number;
}

export function NeuralParticles({
  count = 110,
  connectionDist = 140,
  speed = 0.4,
  entropy = 0.015,
  fireChance = 0.003,
  firingEnabled = true,
  className,
}: NeuralParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const animRef = useRef<number>(0);
  const sizeRef = useRef({ w: 0, h: 0 });

  const createParticle = useCallback(
    (w: number, h: number): Particle => ({
      x: Math.random() * w,
      y: Math.random() * h,
      baseRadius: 1.2 + Math.random() * 1.8,
      radius: 1.2 + Math.random() * 1.8,
      vx: (Math.random() - 0.5) * speed * 2,
      vy: (Math.random() - 0.5) * speed * 2,
      opacity: 0.15 + Math.random() * 0.35,
      fireIntensity: 0,
      fireDecay: 0.015 + Math.random() * 0.01,
    }),
    [speed],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      sizeRef.current = { w, h };

      // Reinit particles on resize
      particlesRef.current = [];
      for (let i = 0; i < count; i++) {
        particlesRef.current.push(createParticle(w, h));
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    const onMouseLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 };
    };

    const maxDistSq = connectionDist * connectionDist;

    const loop = () => {
      const { w, h } = sizeRef.current;
      const particles = particlesRef.current;
      const mouse = mouseRef.current;
      ctx.clearRect(0, 0, w, h);

      // Spontaneous firing
      if (firingEnabled) {
        for (const p of particles) {
          if (p.fireIntensity === 0 && Math.random() < fireChance) {
            p.fireIntensity = 1;
          }
        }
      }

      // Update particles
      for (const p of particles) {
        p.vx += (Math.random() - 0.5) * entropy;
        p.vy += (Math.random() - 0.5) * entropy;

        const spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (spd > speed * 2.5) {
          p.vx *= 0.98;
          p.vy *= 0.98;
        }

        p.x += p.vx;
        p.y += p.vy;

        const pad = 20;
        if (p.x < -pad) p.x = w + pad;
        if (p.x > w + pad) p.x = -pad;
        if (p.y < -pad) p.y = h + pad;
        if (p.y > h + pad) p.y = -pad;

        // Mouse repulsion
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const force = ((120 - dist) / 120) * 0.8;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }

        if (p.fireIntensity > 0) {
          p.fireIntensity -= p.fireDecay;
          if (p.fireIntensity < 0) p.fireIntensity = 0;
        }
        p.radius = p.baseRadius + p.fireIntensity * 3;
      }

      // Connections
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dSq = dx * dx + dy * dy;
          if (dSq > maxDistSq) continue;

          const d = Math.sqrt(dSq);
          const t = 1 - d / connectionDist;

          // Fire propagation
          if (firingEnabled) {
            if (a.fireIntensity > 0.5 && b.fireIntensity < 0.1 && t > 0.3) {
              b.fireIntensity = 1;
            } else if (b.fireIntensity > 0.5 && a.fireIntensity < 0.1 && t > 0.3) {
              a.fireIntensity = 1;
            }
          }

          const fireBlend = Math.max(a.fireIntensity, b.fireIntensity);

          // White baseline connection
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(255,255,255,${t * 0.08})`;
          ctx.lineWidth = 0.5 + t * 0.5;
          ctx.stroke();

          // Red overlay during firing
          if (fireBlend > 0.05) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(200,16,46,${fireBlend * t * 0.25})`;
            ctx.lineWidth = 0.8 + t * 1.5;
            ctx.stroke();
          }
        }
      }

      // Draw particles
      for (const p of particles) {
        const r = p.fireIntensity;
        const red = Math.floor(200 + r * 55);
        const green = Math.floor(255 - r * 240);
        const blue = Math.floor(255 - r * 220);
        const alpha = p.opacity + r * 0.25;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${red},${green},${blue},${alpha})`;
        ctx.fill();

        if (r > 0.1) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius + 6 * r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(230,57,70,${r * 0.15})`;
          ctx.fill();
        }
      }

      animRef.current = requestAnimationFrame(loop);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseleave", onMouseLeave);
    animRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [count, connectionDist, speed, entropy, fireChance, firingEnabled, createParticle]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={`pointer-events-none fixed inset-0 z-0 ${className ?? ""}`}
    />
  );
}
