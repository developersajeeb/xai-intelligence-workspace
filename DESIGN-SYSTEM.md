# Xai — Design System / Tokens

> Source of truth for both the Figma file and the Next.js/Tailwind implementation.
> Update the hex values below once the Figma design is finalized — keep this file and
> the Figma "Foundations" page in sync.

## Color
| Token | Purpose | Placeholder value |
|---|---|---|
| `--bg-base` | App background | `#0A0A0B` |
| `--bg-surface` | Card/panel surface | `#131316` |
| `--bg-surface-2` | Elevated surface (hover/modal) | `#1B1B1F` |
| `--border-subtle` | Hairline borders | `#232327` |
| `--text-primary` | Headlines, primary text | `#F5F5F7` |
| `--text-secondary` | Body/supporting text | `#A1A1AA` |
| `--text-muted` | Captions, disabled | `#86868C` |
| `--accent` | Primary accent (borders, links, active states, chart series) | `#5B8CFF` (electric blue — placeholder) |
| `--accent-strong` | Accent for filled surfaces carrying white text (`Button` primary) | `#3D6FE0` |
| `--accent-soft` | Accent at low opacity for glows/fills | `#5B8CFF` @ 12–20% opacity |
| `--data-1` | Chart series 1 (= accent) | `#5B8CFF` |
| `--data-2` | Chart series 2 | `#34D399` (emerald) |
| `--data-3` | Chart series 3 | `#A78BFA` (violet) |
| `--data-4` | Chart series 4 | `#F59E0B` (amber) |

## Typography
- Font: Inter / Geist / similar geometric grotesk (confirm in Figma)
- Scale: Display 56–64px / H1 40px / H2 28px / H3 20px / Body 16px / Small 13–14px / Caption 12px
- Weights: 400 body, 500 emphasis, 600 headings/buttons
- Line-height: ~1.1–1.2 for display/headings, ~1.5 for body

## Spacing (8px base grid)
`4, 8, 12, 16, 24, 32, 48, 64, 96, 128`

## Radius
- Small: 6px (badges, inputs)
- Medium: 12px (cards, buttons)
- Large: 20px (panels, hero containers)

## Grid
- Desktop canvas: 1440px
- 12-column grid, 24px gutter, 96px outer margin
- Breakpoints (implementation, "responsive is a plus"): 1440 / 1280 / 1024 / 768

## Component Inventory (must exist as reusable code components, mirroring Figma components)
- `Button` — primary / secondary / ghost × default / hover / disabled
- `NavItem` — default / active / hover
- `Card` / `Panel` — optional header + icon slot
- `Tab` — default / active
- `Badge` / `Tag`
- `DataTableRow`
- `ChartLine`, `ChartBar`, `ChartDonut` (mock data, e.g. via `recharts` or custom SVG)
- `SidebarNavItem` — icon + label + active state
- Icons: `lucide-react` — use this for all icon needs (line-style, matches the calm/
  minimal tone); don't mix in a second icon set or hand-drawn SVGs

## Animation Conventions
- **Framer Motion**: page/section entrance choreography, layout transitions
  (`layoutId` for tab switches), hover/focus micro-interactions on 2D UI elements
  (buttons, cards, nav).
- **GSAP + ScrollTrigger**: scroll-scrubbed timelines — Insight Flow stage transitions,
  any scroll-linked progress driving the Hero/Signature 3D scenes. For "stay in place
  while scrolling" sections, use CSS `position: sticky` (tall wrapper + sticky inner
  div, `scrollTrigger` scrubbing `start:"top top"`→`end:"bottom bottom"`) rather than
  ScrollTrigger's `pin: true` — see CONTEXT-FOR-AI.md for why.
- **React Three Fiber / Three.js**: Hero particle-to-grid transformation, Signature
  Interaction geometry. Drive scene state from a shared scroll-progress value (0–1)
  rather than duplicating scroll logic inside the canvas.
- Default easing: `power3.out` / `power2.inOut` (GSAP) or `[0.16, 1, 0.3, 1]` (Framer
  Motion custom cubic-bezier) for a calm, non-bouncy feel matching the brand tone.
- Respect `prefers-reduced-motion`: provide a reduced/static fallback for all
  scroll-driven and 3D animation.

## Layout Rule: Section Wrappers
Every top-level section (`app/page.tsx`'s direct children — Hero, Insight Flow,
Dashboard, Signature, and any future one) is a flex item of `<main className="flex
min-w-0 flex-1 flex-col">`. If a section's root element centers its content with
`mx-auto` + `max-w-*`, it **must** also have `w-full` on that same root element.
Without `w-full`, a flex item with auto margins falls back to shrink-to-fit sizing
based on its own content instead of stretching to the container width — if anything
inside has a wide non-shrinking child (e.g. a nav row of `shrink-0` buttons), the
*entire section* renders at that content width regardless of viewport, breaking
text-wrap and causing horizontal overflow on narrow screens. This bit us once in
`DashboardPreview.tsx` — see the Phase 4 note in `TODO.md` for the full diagnosis.

**Do not** "fix" a horizontal-overflow bug by adding `overflow-x: hidden` to
`html`/`body` — we tried that and it silently broke `position: sticky` for Insight
Flow's pinned scroll section (any ancestor with `overflow` set to anything but
`visible` stops Chromium from honoring `sticky` on a descendant). Find and fix the
actual element that's too wide instead (usually a missing `w-full`, see above, or a
flex/grid child that needs `min-w-0`).

## Layout Pattern: Sticky Scroll-Through Sections
For a "pin while scrolling through N stages" section (see `InsightFlow.tsx`): use a
tall wrapper (`position: relative`) containing a `position: sticky; top: 0` inner div
— not GSAP ScrollTrigger's `pin: true` (its pin-spacer sizing didn't reliably match
the configured `end` distance in testing, see the Phase 3 note in `TODO.md`). Size the
wrapper's height off the sticky content's **own measured height** (`ResizeObserver`)
plus a fixed scroll budget (e.g. one viewport height per stage transition) — not a
flat viewport multiplier (`vh` or a fixed px-per-viewport ratio). A flat multiplier
leaves a large empty gap below the pinned content on any screen where the content is
shorter than the multiplier assumes, and raw large `vh` values are also fragile on
real mobile browsers (address-bar show/hide) — see the Phase 4 follow-up note in
`TODO.md`.

## Color Token Update — Phase 6 Accessibility Pass
A Lighthouse accessibility audit flagged `color-contrast` failures against the
original placeholder values: white button text on `--accent` (`#5B8CFF`) measured
3.16:1 (needs 4.5:1), and `--text-muted` (`#6B6B70`) measured ~3.5:1 against both
`--bg-base` and `--bg-surface`. Fixed by (1) lightening `--text-muted` to `#86868C`
(now ≥4.7:1 against every surface it's used on), and (2) adding a separate
`--accent-strong` (`#3D6FE0`) token used only where white text sits on a filled
accent background (`Button` primary variant) — `--accent` itself is unchanged
everywhere else (borders, links, chart series, icon/text-on-tinted-bg), since those
usages already pass contrast at the original hex. If the Figma file predates this
fix, sync these two hex values back into "Foundations" before finalizing.

**Known, deliberate exception**: Insight Flow's inactive-stage cards render at
`opacity: 0.4` (see `InsightFlow.tsx`), which drops their text below 4.5:1 while
inactive — this is intentional visual hierarchy (spotlighting the active stage
during the pinned scroll), the same "future step is dimmed" pattern used in most
stepper/progress UIs, and every card returns to full-opacity/full-contrast once its
stage activates. Left as-is rather than raising the inactive opacity, which would
blunt the effect this section was specifically built and reviewed for — flag if a
stricter accessibility bar is required for this section.

---
See also: [PROJECT-BRIEF.md](./PROJECT-BRIEF.md) · [TODO.md](./TODO.md)
