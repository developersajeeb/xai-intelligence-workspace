// Shared easing/timing tokens — keep GSAP and Framer Motion animations visually
// consistent. See DESIGN-SYSTEM.md "Animation Conventions".

export const GSAP_EASE = {
  out: "power3.out",
  inOut: "power2.inOut",
} as const;

// Framer Motion cubic-bezier equivalent to a calm, non-bouncy "power3.out" feel.
export const MOTION_EASE_OUT = [0.16, 1, 0.3, 1] as const;

export const DURATION = {
  fast: 0.3,
  base: 0.6,
  slow: 1,
} as const;
