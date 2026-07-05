"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { AuthGlassScene } from "@/components/auth/AuthGlassScene";
import { DURATION, MOTION_EASE_OUT } from "@/lib/easing";
import { FOCUS_RING } from "@/lib/focusRing";

function Logo() {
  return (
    <svg width="20" height="20" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <circle cx="9" cy="9" r="8" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="9" cy="9" r="2.5" fill="currentColor" />
    </svg>
  );
}

/**
 * Split-panel layout shared by /sign-in and /sign-up: a colored, animated
 * left half (brand moment) and a plain, un-boxed form on the right — no
 * site nav/footer, matching the calm, distraction-free auth pages of
 * Stripe/Linear/Vercel rather than the marketing shell. The left panel is
 * hidden below `lg`; the form is always full-width there.
 */
export function AuthShell({
  heading,
  description,
  title,
  subtitle,
  children,
  footer,
}: {
  heading: string;
  description: string;
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <div className="flex min-h-screen min-w-0">
      <div className="relative hidden w-1/2 flex-col justify-center overflow-hidden bg-linear-to-br from-[#2b4fc4] via-[#3d6fe0] to-[#17265c] px-16 lg:flex">
        <AuthGlassScene />

        <div className="relative z-10 max-w-md">
          <Link href="/" className={`mb-10 flex items-center gap-2 rounded-sm text-white ${FOCUS_RING}`}>
            <Logo />
            <span className="text-sm font-semibold tracking-wide">Xai</span>
          </Link>
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">{heading}</h2>
          <p className="mt-4 text-base text-white/80">{description}</p>
        </div>
      </div>

      <main className="flex w-full flex-col items-center justify-center bg-background px-6 py-16 lg:w-1/2">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DURATION.base, ease: MOTION_EASE_OUT }}
          className="w-full max-w-sm"
        >
          <Link
            href="/"
            className={`mb-8 flex items-center gap-2 rounded-sm text-text-primary lg:hidden ${FOCUS_RING}`}
          >
            <Logo />
            <span className="text-sm font-semibold tracking-wide">Xai</span>
          </Link>

          <h1 className="text-2xl font-semibold text-text-primary">{title}</h1>
          <p className="mt-2 text-sm text-text-secondary">{subtitle}</p>

          <div className="mt-8 flex flex-col gap-4">{children}</div>

          <div className="mt-6 text-sm text-text-secondary">{footer}</div>

          <Link
            href="/"
            className={`mt-10 inline-block rounded-sm text-xs text-text-muted hover:text-text-secondary ${FOCUS_RING}`}
          >
            ← Back to home
          </Link>
        </motion.div>
      </main>
    </div>
  );
}
