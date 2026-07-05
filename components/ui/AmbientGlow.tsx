"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Decorative, slow-drifting ambient background — a soft blurred glow plus a
 * faint panning dot-grid, giving a section a subtle "always alive" electric/
 * AI feel without competing with foreground content. Purely decorative
 * (aria-hidden, pointer-events-none) and sits at `-z-10`, so the parent
 * section only needs `position: relative` (or `sticky`/`absolute`) — no
 * other markup has to change. Freezes in place under `prefers-reduced-motion`.
 */
export function AmbientGlow({ variant = "a" }: { variant?: "a" | "b" }) {
  const reduceMotion = useReducedMotion();
  const mirrored = variant === "b";

  return (
    <div
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      aria-hidden="true"
    >
      <div
        className={`ambient-grid absolute inset-0 opacity-40 ${
          mirrored ? "ambient-grid-reverse" : ""
        }`}
      />
      <motion.div
        className={`absolute h-[32rem] w-[32rem] rounded-full blur-3xl ${
          mirrored
            ? "-right-1/4 top-0 bg-emerald-400/15"
            : "-left-1/4 top-0 bg-accent/20"
        }`}
        animate={
          reduceMotion
            ? undefined
            : {
                x: mirrored ? [0, -50, 20, 0] : [0, 60, -20, 0],
                y: [0, 40, 80, 0],
                opacity: [0.25, 0.4, 0.25],
              }
        }
        transition={{ duration: 20, repeat: reduceMotion ? 0 : Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className={`absolute h-[26rem] w-[26rem] rounded-full blur-3xl ${
          mirrored
            ? "-left-1/4 bottom-0 bg-accent/15"
            : "-right-1/4 bottom-0 bg-emerald-400/15"
        }`}
        animate={
          reduceMotion
            ? undefined
            : {
                x: mirrored ? [0, 40, -30, 0] : [0, -50, 30, 0],
                y: [0, -30, -60, 0],
                opacity: [0.2, 0.35, 0.2],
              }
        }
        transition={{ duration: 24, repeat: reduceMotion ? 0 : Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
