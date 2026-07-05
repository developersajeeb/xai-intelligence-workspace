/**
 * Smoothly scrolls to a section by id without touching the URL hash — the
 * caller must `preventDefault()` the click so the browser's native anchor
 * navigation (which would append `#id` to the URL) never runs. Respects
 * `prefers-reduced-motion` by jumping instantly instead of animating.
 */
export function scrollToSection(id: string) {
  const target = document.getElementById(id);
  if (!target) return;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  target.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
}
