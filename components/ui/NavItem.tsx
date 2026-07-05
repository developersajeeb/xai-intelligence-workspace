import Link, { type LinkProps } from "next/link";
import type { AnchorHTMLAttributes } from "react";
import { FOCUS_RING } from "@/lib/focusRing";

interface NavItemProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href">,
    LinkProps {
  active?: boolean;
}

export function NavItem({ active = false, className = "", ...props }: NavItemProps) {
  return (
    <Link
      className={`rounded-sm text-sm transition-colors duration-200 ${
        active ? "text-text-primary" : "text-text-secondary hover:text-text-primary"
      } ${FOCUS_RING} ${className}`}
      {...props}
    />
  );
}
