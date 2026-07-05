// Shared keyboard-focus indicator — every interactive element uses this so
// focus states are visually consistent across buttons, links, inputs, and
// custom controls (Switch, table sort headers, etc). Only shows on
// keyboard/`:focus-visible`, not on mouse click.
export const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background";

// For elements flush against an `overflow-hidden` container edge (e.g. a
// dropdown menu item) — an offset ring would get clipped there, so draw it
// inside the element's own bounds instead.
export const FOCUS_RING_INSET =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent";
