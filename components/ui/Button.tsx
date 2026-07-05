import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";
import { FOCUS_RING } from "@/lib/focusRing";

type ButtonVariant = "primary" | "secondary" | "ghost";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-accent-strong text-white hover:bg-accent-strong/90 disabled:bg-accent-strong/40",
  secondary:
    "border border-border-subtle bg-surface-2/60 text-text-primary hover:bg-surface-2 disabled:opacity-40",
  ghost:
    "bg-transparent text-text-secondary hover:text-text-primary disabled:opacity-40",
};

type ButtonAsButton = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  href?: undefined;
};

type ButtonAsLink = AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: ButtonVariant;
  href: string;
};

type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button({ variant = "primary", className = "", href, ...props }: ButtonProps) {
  const classes = `rounded-md px-4 py-2 text-sm font-medium transition-colors duration-200 disabled:cursor-not-allowed ${variantClasses[variant]} ${FOCUS_RING} ${className}`;

  if (href) {
    return (
      <Link
        href={href}
        className={classes}
        {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}
      />
    );
  }

  return (
    <button
      className={classes}
      {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}
    />
  );
}
