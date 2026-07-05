"use client";

import { useEffect, useRef, type MutableRefObject, type RefObject } from "react";

function computeProgress(node: HTMLElement): number {
  const rect = node.getBoundingClientRect();
  const viewportHeight = window.innerHeight;
  const total = rect.height + viewportHeight;
  const scrolled = viewportHeight - rect.top;
  return Math.min(1, Math.max(0, scrolled / total));
}

/**
 * Tracks scroll progress (0-1) of an element through the viewport into a ref
 * instead of React state, so consumers (R3F `useFrame` loops) can read the
 * latest value every animation frame without triggering a React re-render on
 * every scroll pixel. Shared by the Hero particle scene and the Signature
 * Interaction scene so both 3D moments drive off one scroll-progress source.
 */
export function useScrollProgress<T extends HTMLElement>(): {
  ref: RefObject<T | null>;
  progressRef: MutableRefObject<number>;
} {
  const ref = useRef<T | null>(null);
  const progressRef = useRef(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const update = () => {
      progressRef.current = computeProgress(node);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return { ref, progressRef };
}
