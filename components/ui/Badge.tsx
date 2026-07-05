import type { HTMLAttributes } from "react";

type BadgeTone = "positive" | "neutral" | "warning";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
}

const toneClasses: Record<BadgeTone, string> = {
  positive: "bg-emerald-500/10 text-emerald-400",
  neutral: "bg-surface-2 text-text-secondary",
  warning: "bg-amber-500/10 text-amber-400",
};

export function Badge({ tone = "neutral", className = "", ...props }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${toneClasses[tone]} ${className}`}
      {...props}
    />
  );
}
