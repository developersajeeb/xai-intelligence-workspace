"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { NavItem } from "@/components/ui/NavItem";
import { DURATION, MOTION_EASE_OUT } from "@/lib/easing";
import { FOCUS_RING } from "@/lib/focusRing";
import { scrollToSection } from "@/lib/scrollToSection";

const LINKS = [
  { label: "Platform", id: "platform" },
  { label: "How it works", id: "how-it-works" },
  { label: "Dashboard", id: "dashboard" },
  { label: "Insights", id: "insights" },
];

export function NavBar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border-subtle bg-background/80 backdrop-blur">
        <div className="relative mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              aria-hidden="true"
            >
              <circle cx="9" cy="9" r="8" stroke="var(--accent)" strokeWidth="1.5" />
              <circle cx="9" cy="9" r="2.5" fill="var(--accent)" />
            </svg>
            <span className="text-sm font-semibold tracking-wide text-text-primary">
              Xai
            </span>
          </div>

          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 md:flex">
            {LINKS.map((link, i) => (
              <NavItem
                key={link.id}
                href={`#${link.id}`}
                active={i === 0}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(link.id);
                }}
              >
                {link.label}
              </NavItem>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <NavItem href="/sign-in" className="hidden sm:inline">
              Sign in
            </NavItem>
            <Button href="/sign-up" variant="primary" className="text-xs md:text-sm">
              Start free
            </Button>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? "Close menu" : "Open menu"}
              className={`inline-flex items-center justify-center rounded-md p-1.5 text-text-secondary hover:text-text-primary md:hidden ${FOCUS_RING}`}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Rendered outside <header> on purpose: `header` has `backdrop-blur`
          (a `backdrop-filter`), which — like `filter` — makes an element the
          containing block for any `position: fixed` descendants. A fixed
          overlay nested inside it sizes itself to the header's own box
          instead of the viewport, not the whole page below it. */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 top-14.25 z-40 bg-background/60 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: DURATION.fast, ease: MOTION_EASE_OUT }}
              onClick={() => setOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              id="mobile-nav"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: DURATION.fast, ease: MOTION_EASE_OUT }}
              className="fixed inset-x-0 top-14.25 z-40 max-h-[calc(100vh-3.5625rem)] overflow-y-auto border-b border-border-subtle bg-background shadow-lg md:hidden"
            >
              <nav className="flex flex-col gap-1 px-6 py-4">
                {LINKS.map((link, i) => (
                  <NavItem
                    key={link.id}
                    href={`#${link.id}`}
                    active={i === 0}
                    onClick={(e) => {
                      e.preventDefault();
                      setOpen(false);
                      scrollToSection(link.id);
                    }}
                    className="rounded-md px-2 py-2.5"
                  >
                    {link.label}
                  </NavItem>
                ))}
                <NavItem
                  href="/sign-in"
                  onClick={() => setOpen(false)}
                  className="rounded-md px-2 py-2.5 sm:hidden"
                >
                  Sign in
                </NavItem>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
