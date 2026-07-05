"use client";

import { motion } from "framer-motion";
import { FOCUS_RING } from "@/lib/focusRing";

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
}

export function Switch({ checked, onChange, label }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-5 w-9 shrink-0 rounded-full border transition-colors duration-200 ${
        checked ? "border-accent bg-accent" : "border-border-subtle bg-surface-2"
      } ${FOCUS_RING}`}
    >
      {/* Spring physics (not the shared MOTION_EASE_OUT curve) — a toggle thumb
          reads as a physical object snapping into place, not a decelerating fade. */}
      <motion.span
        className="absolute top-0.5 left-0.5 h-3.5 w-3.5 rounded-full bg-white"
        animate={{ x: checked ? 16 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </button>
  );
}
