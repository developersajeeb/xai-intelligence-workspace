"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Database, Network, Sparkles, TrendingUp } from "lucide-react";

const SHAPES = [
  { Icon: Database, top: "14%", left: "12%", size: 46, duration: 10, delay: 0 },
  { Icon: Sparkles, top: "58%", left: "68%", size: 54, duration: 12, delay: 0.6 },
  { Icon: TrendingUp, top: "76%", left: "18%", size: 42, duration: 11, delay: 1.2 },
  { Icon: Network, top: "22%", left: "72%", size: 40, duration: 9, delay: 1.8 },
];

/**
 * Decorative "glass" scene for the auth split-panel: a couple of soft
 * blurred glows for depth plus a few frosted-glass icon chips that slowly
 * float — a calmer, colored-background twin of `AmbientGlow`. Purely
 * decorative (aria-hidden, pointer-events-none); freezes under
 * `prefers-reduced-motion`.
 */
export function AuthGlassScene() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -bottom-32 -right-16 h-80 w-80 rounded-full bg-white/10 blur-3xl" />

      {SHAPES.map(({ Icon, top, left, size, duration, delay }, i) => (
        <motion.div
          key={i}
          className="absolute flex items-center justify-center rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md"
          style={{ top, left, width: size + 28, height: size + 28 }}
          animate={
            reduceMotion
              ? undefined
              : {
                  y: [0, -18, 0, 14, 0],
                  x: [0, 10, 0, -10, 0],
                  rotate: [0, 4, 0, -4, 0],
                }
          }
          transition={{
            duration,
            repeat: reduceMotion ? 0 : Infinity,
            ease: "easeInOut",
            delay,
          }}
        >
          <Icon
            className="text-white/80"
            style={{ width: size * 0.45, height: size * 0.45 }}
            strokeWidth={1.5}
          />
        </motion.div>
      ))}
    </div>
  );
}
