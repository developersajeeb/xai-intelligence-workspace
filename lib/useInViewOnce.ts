"use client";

import { useEffect, useState, type RefObject } from "react";

/**
 * True once the observed element has scrolled near the viewport, then stays
 * true (never flips back). Used to defer mounting expensive below-the-fold
 * client components (WebGL canvases, chart libraries) so their setup cost
 * doesn't compete with initial page load — same static import as always, just
 * a later mount, so it doesn't touch the next/dynamic(ssr:false) Suspense
 * bailout issue documented in CONTEXT-FOR-AI.md.
 */
export function useInViewOnce<T extends HTMLElement>(
  ref: RefObject<T | null>,
  rootMargin = "600px",
): boolean {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (inView) return;
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { rootMargin },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [ref, rootMargin, inView]);

  return inView;
}
