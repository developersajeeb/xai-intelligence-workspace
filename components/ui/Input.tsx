import type { InputHTMLAttributes } from "react";
import { FOCUS_RING } from "@/lib/focusRing";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function Input({ label, id, className = "", ...props }: InputProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-1.5 text-left">
      <label htmlFor={inputId} className="text-xs font-medium text-text-secondary">
        {label}
      </label>
      <input
        id={inputId}
        className={`rounded-md border border-border-subtle bg-surface-2 px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-accent/50 focus:outline-none ${FOCUS_RING} ${className}`}
        {...props}
      />
    </div>
  );
}
