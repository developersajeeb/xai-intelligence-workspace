# Xai — Build TODO / Progress Tracker

> **How to use this file:** this is the single source of truth for build progress.
> Check off `[x]` items as they are completed. At the start of every new AI chat
> session, tell the assistant: *"Read CONTEXT-FOR-AI.md, PROJECT-BRIEF.md,
> DESIGN-SYSTEM.md and TODO.md in this folder, then continue from the first
> unchecked item in TODO.md."*

**Current phase:** Phase 6 complete — easing/timing, loading fallback, focus states,
Lighthouse, and cross-browser are all done; see the Phase 6 section below for the
color-token accessibility fix and the performance findings before touching `Button`,
`--accent`, or the Signature Interaction's mount timing. See the Phase 4 notes below
(`w-full`/`min-w-0` layout rules, never `overflow-x: hidden` on `html`/`body` — it
breaks `position: sticky`, sticky wrapper heights must be content-measured not a flat
viewport multiplier) before touching any section wrapper or scroll animation. Next up:
Phase 7 (Deliverables).

---

## Phase 0 — Project Setup
- [x] `create-next-app` with App Router + TypeScript + Tailwind (Tailwind v4, CSS-first
      `@theme` config — no `tailwind.config.js`)
- [x] Install: `framer-motion`, `gsap`, `three`, `@react-three/fiber`, `@react-three/drei`
- [x] Install a chart lib if needed (e.g. `recharts`) for the dashboard mock charts
- [x] Configure Tailwind theme (colors/typography/spacing) from `DESIGN-SYSTEM.md` —
      tokens added to `app/globals.css` `@theme inline` block (background, surface,
      surface-2, border-subtle, text-primary/secondary/muted, accent)
- [x] Folder structure:
  ```
  /app
  /components
    /hero
    /insight-flow
    /dashboard
    /signature
    /ui        (Button, Card, Tab, Badge, NavItem, etc.)
  /lib         (scroll-progress hook, animation constants/easings)
  /public
  ```
- [x] ESLint configured (Prettier not added — not required by the brief)
- [ ] Push to GitHub (public repo)
- [ ] Connect repo to Vercel for auto-deploy on push

## Phase 1 — Static Layout (no animation yet)
- [x] Top nav bar (logo, links, CTA button) — `components/ui/NavBar.tsx` +
      `components/ui/NavItem.tsx`, sticky at top, links hidden below `md`
- [x] Hero section static layout: headline, subtext, CTA, empty canvas placeholder div
      for the Three.js scene (`components/hero/Hero.tsx`)
- [x] Insight Flow: static 3-card row (Ingest / Analyze / Generate) with a
      numbered-node connecting-line track above the cards (hidden below `md`)
      (`components/insight-flow/InsightFlow.tsx`)
- [x] Dashboard Preview: sidebar + KPI cards + 2 chart placeholder panels + data
      table with status `Badge`s (`components/dashboard/DashboardPreview.tsx`,
      `components/ui/Badge.tsx`)
- [x] Signature Interaction section: static full-width dark section with placeholder
      canvas + headline/subtext (`components/signature/SignatureInteraction.tsx`)
- [x] Responsive sanity check at 1440 / 768 (Playwright screenshots) — dashboard
      sidebar stacks full-width below `lg`, KPI/chart grids collapse, data table
      scrolls horizontally within its own container when needed

_Verified: `npx tsc --noEmit` clean, `npx eslint .` clean, `npm run dev` boots and
serves 200 on `/`, visually checked via Playwright screenshots at 1440px and 768px
(no console errors other than expected dev-only HMR websocket noise)._

## Phase 2 — Hero: Particle → Grid Transformation (Three.js / R3F)
- [x] R3F `<Canvas>` mounted in Hero, capped `dpr={[1, 1.5]}`
      (`components/hero/ParticleField.tsx`)
- [x] Particle system: 140 `THREE.Points` at randomized "scattered" positions
      representing raw data, with a soft canvas-generated glow sprite + accent/green
      vertex colors
- [x] Target "structured" positions: 14-column grid layout
- [x] Shared scroll-progress value (0–1) driving `lerp` (smoothstep-eased, damped)
      between scattered and structured positions per-particle (via `useFrame`),
      sourced from `lib/useScrollProgress.ts`'s `progressRef` (no React re-renders
      on scroll)
- [x] Cursor-driven subtle rotation/parallax on the whole group (`useThree().pointer`,
      damped lerp)
- [x] Connecting lines between nearest neighbors (topology computed once on the
      scattered layout, endpoints follow particles every frame)
- [x] Fallback: `prefers-reduced-motion` skips scroll/cursor animation and renders
      the resolved structured grid directly, no rotation drift

_Hero redesigned to match the approved reference (badge pill, headline/subtext copy,
Start free / Book a demo CTAs, Raw/Structured indicator chips); NavBar updated to
match (logo mark, Platform/Solutions/Docs/Pricing links, Sign in + Start free). The
canvas caption bar ("Particle canvas · Three.js — ...") from the first pass was
removed per feedback — keep the canvas free of explanatory captions._

_Polish pass after first review — feedback was the scene felt static/flat. Added:
per-particle idle drift (unique sine phase/frequency per axis, damped to near-zero as
the grid resolves so "raw" data feels alive and "structured" data feels calm/settled),
cursor-proximity repel (particles within `CURSOR_RADIUS` push away from the pointer,
quadratic falloff), continuous slow auto-rotation so the scene isn't inert when the
cursor is idle, per-connection vertex-colored lines (was a flat single color), and a
`THREE.Fog` matching the `--surface` token for depth cueing. All of this reads
`progressRef`/`pointer` inside one `useFrame`, no extra render loops._

_Gotcha hit: `next/dynamic(..., { ssr: false })` for the Canvas got stuck on the
`BAILOUT_TO_CLIENT_SIDE_RENDERING` Suspense marker under Turbopack dev and never
hydrated (canvas silently never appeared, no console error). Fixed by importing
`ParticleField` directly and gating it behind `lib/useIsClient.ts`
(`useSyncExternalStore`-based, avoids the "setState in effect" lint rule too) instead
of `next/dynamic`'s ssr:false path. If a stale/long-running dev server ever shows a
hydration mismatch after several hot-reloads, kill it, delete `.next/`, and restart
clean before debugging further — that alone resolved one false-alarm mismatch here._

_Verified: `npx tsc --noEmit` and `npx eslint .` clean; visually confirmed via
Playwright screenshots (1440px + 768px) that particles render, scroll from top of
Hero to ~90% down produces a resolved grid, and no console errors are thrown._

## Phase 3 — Insight Flow Scroll Animation
- [x] ~~GSAP ScrollTrigger `pin: true`~~ — replaced with CSS `position: sticky` (see
      bug note below) driving the same 3-stage sequence
      (`components/insight-flow/InsightFlow.tsx`)
- [x] Active/inactive visual states per stage (scale 1.04↔0.94, opacity, border color,
      a `box-shadow` glow layer) driven by scroll progress through the pinned section —
      stage 1 is active on entry, each next stage activates while the previous one
      settles (stays lit, glow fades), last stage stays glowing as the "resolved" state
- [x] Connecting line "draws in" between stages via SVG `stroke-dashoffset` (track
      rebuilt as one SVG with `<circle>` nodes + `<line>` connectors instead of HTML
      divs, so node fill/stroke and line dash can be tweened directly)
- [x] Hover/focus micro-interactions on each stage card (Tailwind `hover:`/
      `focus-visible:` translate + border, independent of the GSAP scroll timeline;
      cards are `tabIndex={0}` for keyboard focus)
- [x] `prefers-reduced-motion` fallback: skips the ScrollTrigger/pin entirely and sets
      all stages/lines to their fully-resolved end state

_Verified: `npx tsc --noEmit` and `npx eslint .` clean. Visually stepped through the
pinned scroll range via Playwright (0%, 25%, 50%, 75%, 100%, 130% of the pin distance)
at 1440px and spot-checked 768px — stage 1 highlighted at entry, connector 1 draws and
stage 2 highlights at the midpoint, connector 2 draws and stage 3 highlights at the
end, pin releases cleanly into the Dashboard section afterward, 0 console errors at
every step._

_Follow-up polish per feedback: replaced the "From data to decision" heading with
"Ingest → Analyze → Generate" + a one-line description under it, and added a per-stage
icon (`lucide-react` — `Database` / `Sparkles` / `Lightbulb`) to each card, wired into
the same GSAP timeline as the border/glow (icon background/color tween to the accent
color when its stage activates, then stay lit as a "visited" marker like the track
nodes do). `lucide-react` is now a project dependency — use it for any future icon
needs instead of hand-rolled SVGs or a second icon library._

_**Bug found while building Phase 4**: scrolling into the Dashboard section showed it
overlapping the still-visible Insight Flow cards. Root cause: GSAP's `pin: true`
pin-spacer was not sized to the configured `end` distance — verified via
`ScrollTrigger.getAll()` that `start`/`end` were numerically correct (1600px pin
duration) but the actual `.pin-spacer` DOM element's height matched only the
trigger's own natural height, reserving ~1000px too little document space. Confirmed
this was NOT a dev-only React Strict Mode artifact (reproduced in `next build` +
`next start` too) and NOT an `end` syntax issue (`"+=160%"`, a plain `"+=1600"`
string, and a `() => "+=" + window.innerHeight * 1.6` function all produced the same
undersized spacer). Fix: dropped `pin: true` entirely — the section is now a tall
wrapper (`h-[260vh]`) containing a `position: sticky; top: 0` inner content div (pure
CSS, no spacer math), with the GSAP timeline's `scrollTrigger` just scrubbing off that
wrapper's `start: "top top"` → `end: "bottom bottom"` scroll range (no `pin` option at
all). This is more robust than `pin:true` in general — prefer sticky+scrub over
GSAP pin for any future scroll-pinned section (Phase 5 Signature Interaction included)
unless there's a specific reason `pin:true` is required._

## Phase 4 — Dashboard Preview Interactivity
- [x] Framer Motion staggered entrance for KPI cards/charts/table on section enter
      (`whileInView` + `staggerChildren`, `components/dashboard/DashboardPreview.tsx`)
- [x] Tab group (Overview / Reports / Automations) with shared-element active
      indicator via `layoutId="dashboard-tab-underline"`; each tab shows distinct
      content (Overview = full dashboard, Reports = mock report list, Automations =
      toggleable automation list via `components/ui/Switch.tsx`)
- [x] Hover feedback on table rows, KPI/chart cards, and sidebar/tab items
- [x] Chart components render mock data with animated draw-in
      (`components/dashboard/charts.tsx` — `Sparkline`, `IntelligenceOutputChart`
      area chart, `SignalMixChart` donut, all via `recharts`)

_Rebuilt to match an approved reference screenshot: icon sidebar (`lucide-react`) with
active-nav state + user profile footer, functional top bar (search input and a status
filter dropdown that actually filter `SignalsTable`, plus decorative date-range
button and a primary "New report" button), and a `SignalsTable`
(`components/dashboard/SignalsTable.tsx`) with click-to-sort columns and
`AnimatePresence`-animated row filtering. Added `--data-2/3/4` color tokens
(green/violet/amber) to `DESIGN-SYSTEM.md` and `globals.css` for the chart series._

_Verified: `npx tsc --noEmit` and `npx eslint .` clean; full `npm run build` succeeds.
Visually exercised every interaction via Playwright — tab switching, automation
toggle, search filter, status filter dropdown, sort — at 1440px and 768px, 0 console
errors throughout._

_**Responsive audit pass (375 / 414 / 768 / 1024 / 1440px)** — found and fixed a real
horizontal-overflow bug that only showed up below ~1024px: `DashboardPreview.tsx`'s
outer `<section>` used `mx-auto max-w-6xl` **without** `w-full`. Since that section is
a flex item inside `<main>`'s column flex layout, the missing `w-full` let the
browser's default flex behavior fall back to shrink-to-fit sizing based on the
section's own content — and since the sidebar nav's 6 non-shrinking buttons have a
combined min-content width of ~720px, the whole section (and everything in it,
including unrelated text like the dashboard description paragraph) rendered at
~800px wide regardless of viewport, causing text to run off-screen on phones/tablets
instead of wrapping. Every other section already had `w-full` on its equivalent
wrapper, which is why only the Dashboard was affected. Fix: added `w-full` to that
section, plus defense-in-depth `min-w-0` on `<main>` and down through
`DashboardPreview`'s sidebar/nav/content flex chain.
**Rule of thumb going forward**: any top-level section root that uses
`mx-auto` + `max-w-*` for centering MUST also have `w-full`, since it's a flex item of
`<main>` — verified this pattern is now consistent across Hero, Insight Flow,
Dashboard, and Signature.
Verified via Playwright at 375/414/768/1024/1440px: `document.documentElement.
scrollWidth` checked at every ~1 viewport-height scroll increment (not just page load)
matches `clientWidth` everywhere, and a scroll-and-screenshot pass (avoiding
Playwright's native `fullPage` capture, which was itself misleading here) confirms
text wraps correctly and nothing is clipped at any breakpoint. `npm run build` still
succeeds._

_**Follow-up fix — this audit briefly broke Insight Flow's `position: sticky`, and
separately left a real "too much blank space" complaint from review**: the
`overflow-x: hidden` on `html, body` added as a safety net above turned out to
**break `position: sticky`** for `InsightFlow`'s pinned content — Chromium stops
honoring `sticky` on a descendant when an ancestor between it and the viewport has
`overflow` set to anything but `visible`, even just `overflow-x`. Confirmed via a
Playwright script sampling the sticky element's `getBoundingClientRect().top` across
scroll positions: it was decreasing linearly (i.e. scrolling normally, not pinning) —
removed the `overflow-x: hidden` rule entirely (the `w-full` root-cause fix above was
already sufficient on its own; re-ran the full breakpoint audit with it removed and
overflow is still clean everywhere). Separately, the fixed `260vh`→`window.innerHeight
* 2.6` wrapper height was itself the source of the "too much blank space before
Intelligence dashboard" complaint: the sticky inner content used `h-screen` +
`justify-center`, so on any screen where the actual card content is shorter than one
viewport (nearly always), centering it in a full-viewport-tall sticky box left a large
empty gap below the cards, compounding with the wrapper's flat 2.6x multiplier and the
next section's own top padding. Fixed by (1) dropping `h-screen`/`justify-center` from
the sticky div in favor of normal content-flow padding (`py-24 sm:py-32`, matching
every other section), and (2) sizing the wrapper off the sticky content's **measured
own height** (`ResizeObserver` on the sticky `<div>`) plus a fixed 1-viewport scroll
budget for the two stage transitions, instead of a flat viewport multiplier — this
keeps the gap after the pinned section proportional to actual content on any screen
size, while still guaranteeing the stack/scrub scroll effect happens regardless of
screen size (mandatory per this feedback: it's fine for large screens to peek at the
next section during the pinned scroll, but the pin/scrub itself must not be skipped).
Re-verified sticky is genuinely pinning (`top` stays at `0` across a scroll range,
not decreasing) and the full breakpoint overflow audit is still clean after this
change; `npm run build` succeeds._

## Phase 5 — Signature Interaction ("WOW" moment)
- [x] Finalize concept: data-cluster morph — 420 lit 3D spheres reorganize from a
      random volumetric "chaotic cloud" into a fibonacci-distributed sphere shell
      ("resolved structure") (`components/signature/DataCluster.tsx`)
- [x] Geometry group with defined start (`chaotic`) / end (`resolved`) position
      states, eased `lerp` per-instance (no mid-state needed — matches the Hero
      particle field's 2-state pattern for consistency)
- [x] Driven by `lib/useScrollProgress.ts`'s `progressRef` attached to the
      `SignatureInteraction` section — same hook Hero uses, no duplicated scroll logic
- [x] Performance pass: real GPU instancing via `THREE.InstancedMesh` (1 draw call for
      all 420 spheres, vs. Hero's `Points`) with per-instance color; a single reused
      `THREE.Object3D` dummy for matrix updates in `useFrame` (no per-frame
      allocations); `dpr={[1, 1.5]}` capped pixel ratio
- [x] `prefers-reduced-motion`: skips drift/rotation, snaps straight to the resolved
      sphere shell with no cursor/auto-rotation drift

_Visually distinct from Hero's flat particle-to-grid moment on purpose: real lit 3D
geometry (`MeshStandardMaterial` + two colored point lights + fog) instead of flat
glow sprites, giving actual depth/shading — a deliberate "second, different 3D
moment" rather than a re-skin of Phase 2. Added `ambientLight` + two `pointLight`s
(accent blue, green) for shading; ambient+point light setup is unique to this scene
(Hero's particle field is intentionally unlit/flat by contrast)._

_Verified: `npx tsc --noEmit` and `npx eslint .` clean; `npm run build` succeeds.
Visually confirmed via Playwright — chaotic cloud at scroll entry, morphs to a clean
sphere shell by scroll exit (confirmed unambiguously in the `prefers-reduced-motion`
screenshot, which removes the auto-rotation that otherwise makes the shell's exact
silhouette harder to read at a glance), works at 375/768/1440px, 0 console errors._

## Phase 6 — Polish & Performance
- [x] Global easing/timing audit — consistent curves across GSAP + Framer Motion
- [x] Lighthouse pass (performance + accessibility) on the deployed build
- [x] Cross-browser check (Chrome, Firefox, Safari) and at least one lower-end device
- [x] Loading/suspense fallback for the 3D canvas (avoid layout shift)
- [x] Keyboard focus states on all interactive elements

_**Easing/timing audit**: `InsightFlow.tsx`'s GSAP tweens (card scale/opacity/border,
glow, icon, node color) had no `ease` set, silently defaulting to GSAP's `power1.out`
instead of the project's `power3.out` convention (`lib/easing.ts`'s `GSAP_EASE.out`) —
now explicit on every tween (the connector draw-in intentionally keeps `ease: "none"`
for a linear scrub). On the Framer Motion side, `DashboardPreview.tsx`'s
`itemVariants`, the status-filter dropdown, `ReportsPanel`/`AutomationsPanel`, and
`SignalsTable.tsx`'s row fade all had either a hardcoded bezier array or no `ease` at
all (falling back to Motion's default curve) — all now import `MOTION_EASE_OUT` /
`DURATION` from `lib/easing.ts` instead. `Switch.tsx`'s thumb keeps its spring
transition on purpose (a toggle should snap like a physical object, not decelerate
like a fade) — left as a documented exception, not an oversight._

_**Loading fallback**: added `components/ui/CanvasLoader.tsx` (a small pulsing accent
dot, no caption text per the earlier "keep the canvas free of captions" feedback) —
both Hero and Signature Interaction show it in place of the canvas until
`useIsClient()` resolves. No actual layout shift either way since both canvas
containers are already fixed-height regardless of mount state; this just avoids a
blank flash._

_**Keyboard focus states**: added `lib/focusRing.ts` (`FOCUS_RING` / `FOCUS_RING_INSET`
— the inset variant is for controls flush against an `overflow-hidden` edge, e.g. a
dropdown menu item, where an offset ring would get clipped) and applied it to every
interactive element that had none: `Button`, `NavItem`, `Switch`, the dashboard
sidebar/tab/calendar/search/status-filter controls, and the Insight Flow stage cards
(which had `focus-visible:outline-none` with no replacement — a genuinely invisible
focus state before this). Also found and fixed a real keyboard-operability bug in
`SignalsTable.tsx`: the sortable "Signal"/"Confidence" column headers were `onClick`
handlers on a bare `<th>`, which is not focusable or activatable from the keyboard at
all — converted to real `<button type="button">` elements inside the `<th>` with
`aria-sort`, verified Tab reaches them and Enter triggers the sort._

_**Lighthouse pass** (production build, `next build` + `next start`): mobile
(default/simulated throttling) performance **37 → 51**, desktop performance **76**,
accessibility **96** (both), best-practices **100**, SEO **100**. Two kinds of fixes:_
_1. Accessibility — `color-contrast` was failing on white text over `--accent`
(`#5B8CFF`, 3.16:1) and on `--text-muted` (`#6B6B70`, ~3.5:1) against both background
tokens. Since `DESIGN-SYSTEM.md` already marked these hex values as placeholders
pending Figma finalization, fixed the tokens directly: `--text-muted` lightened to
`#86868C` (≥4.7:1 everywhere it's used), and a new `--accent-strong` (`#3D6FE0`) added
specifically for white-text-on-filled-accent (`Button` primary variant) — `--accent`
itself is unchanged everywhere else (borders, links, chart series) since those
combinations already passed. One **known, deliberate exception** remains: Insight
Flow's inactive-stage cards render at `opacity: 0.4` (intentional "future step is
dimmed" hierarchy, the whole point of that pinned-scroll section), which drops their
text below 4.5:1 while inactive — every card returns to full contrast once its stage
activates, so this was left as-is rather than blunting the effect. See the
"Color Token Update" section in `DESIGN-SYSTEM.md` for the full writeup — sync these
two hex values into Figma "Foundations" before finalizing._
_2. Performance — bootup-time/main-thread work was dominated by both WebGL canvases
(Hero's `ParticleField` + Signature's `DataCluster`) mounting immediately on
hydration, regardless of scroll position. Hero must stay eager (it's above the fold),
but Signature Interaction is 3+ sections down, so added `lib/useInViewOnce.ts` (a
plain `IntersectionObserver` hook, not `next/dynamic`/`React.lazy` — deliberately
avoids the Turbopack dev Suspense-bailout bug already documented in
`CONTEXT-FOR-AI.md`) and gated `DataCluster`'s mount on it. This alone moved mobile
FCP from 3.3s→1.4s (score 0.41→0.97) and Speed Index 6.7s→3.8s. Total Blocking Time is
still high under Lighthouse's mobile 4x-CPU-throttle simulation (the two R3F scenes +
GSAP + Framer Motion + recharts genuinely is a heavy client bundle, and the brief
requires all of that stack "each used meaningfully") — this project is explicitly
desktop-first per `PROJECT-BRIEF.md`, and the desktop-preset run (76, no heavy
throttling) is a more representative number for how this will actually be evaluated.
Going further would mean real code-splitting (`next/dynamic` or `React.lazy` per
section), which is a bigger change deserving its own dev-mode verification pass given
the documented Turbopack gotcha — flagged here rather than attempted under Phase 6's
polish scope._

_**Cross-browser check**: verified via Playwright (Chromium, Firefox, WebKit — the
closest available proxy for Safari on this Windows machine, no real Safari/macOS
available) at 1440px, plus a 375px viewport with 4x CPU throttling as the "lower-end
device" stand-in. Scrolled through every section (Hero particles, Insight Flow sticky
pin, Dashboard, Signature data cluster) on each engine: 0 console errors anywhere, the
sticky-pin `top: 0` behavior holds on all three engines, and both WebGL scenes render
correctly on all three (Firefox and the throttled low-end pass both just take longer
to hydrate/compile shaders — up to ~2s under 4x throttle — not a functional bug, only
a timing difference confirmed by polling `canvas.getContext()` until ready)._

_Verified: `npx tsc --noEmit` and `npx eslint .` clean; `npm run build` succeeds._

_**Post-Phase-6 addition**: added a standard site footer (`components/ui/Footer.tsx`,
mounted in `app/page.tsx` as a sibling after `<main>`, same placement pattern as
`NavBar` before it) — logo mark + one-line tagline + "All systems operational" status
chip (reinforcing the same monitoring/intelligence motif as the Hero badge), three
link columns (Product mirrors the NavBar anchors, Company/Legal are decorative `#`
placeholders since this is a single-page app with no other routes), and a bottom
copyright row. Reuses `NavItem` for every link (inherits `FOCUS_RING` for free) and
the same logo SVG/color tokens as `NavBar` for visual consistency. Verified
responsive at 375px (0px horizontal overflow) and 1440px, keyboard focus visible on
footer links, 0 console errors._

_**Post-Phase-6 addition**: made the Dashboard Preview's "static-feeling" surfaces
actually interactive, per feedback that it needed to feel alive rather than mocked:_
- _AI-live badge next to the "Intelligence dashboard" heading (pulsing `Sparkles`,
  same visual language as the Hero's status pill)._
- _`components/dashboard/DashboardPreview.tsx`'s sidebar nav and the Overview/Reports/
  Automations tab bar are now two-way synced for the items they share (clicking
  "Automations" in either place activates both) — previously `activeNav` was purely
  cosmetic and never touched tab content._
- _the "Last 30 days" button is now a real `FilterDropdown` (7/30/90 days, generic
  component shared with the existing status filter — was two near-identical dropdown
  implementations, now one parameterized by icon/options) and the selected range
  flows into both header subtitles, not just its own label._
- _"New report" is wired up: switches to the Reports tab and prepends a new report row
  with a `Loader2`-spinner "Generating" badge that flips to "Draft" after ~1.8s
  (`setTimeout` cleaned up via a ref'd `Set` on unmount). Reports state lives in
  `DashboardPreview` now, not a stray module-level constant, since the header button
  needs to mutate it._
- _Automations panel (`AutomationRow`): each enabled automation shows a live
  `animate-ping` dot + "Running · triggered {time}"; toggling one on plays a brief
  "Activating…" (spinner, ~900ms) before settling to "Running · triggered just now" —
  toggling off is instant ("Paused"). Per-row timeout is cleaned up on unmount._
- _`components/dashboard/charts.tsx`: the Intelligence Output chart's Insights/Signals
  legend dots are now click-to-toggle (recharts `Area`'s `hide` prop, keeps the axis
  scale stable rather than unmounting the series), and the Signal Mix donut highlights
  its matching legend row on hover/focus (`Cell` `fillOpacity` + a synced `activeIndex`)
  with a `Tooltip` added to the pie itself._

_Verified via Playwright: date-range dropdown updates both subtitles, legend toggle
actually hides/shows the chart series, sidebar↔tab sync confirmed both directions,
automation toggle shows Activating→Running with the correct "just now" label (not the
stale mock timestamp — caught and fixed a real bug where a freshly-activated row still
showed its old mock `lastRun`), New Report flow shows Generating→Draft, and keyboard-
only Tab navigation (not a scripted `.focus()`, which Chromium's `:focus-visible`
heuristic can suppress right after a preceding click — confirmed that distinction
directly) reaches the automation switch with a visible focus ring. 0 console errors.
`npx tsc --noEmit`, `npx eslint .`, and `npm run build` all clean._

_**Post-Phase-6 addition**: `components/ui/NavBar.tsx` — nav links are now always
truly centered regardless of how wide the logo vs. right-side (Sign in/Start free/
hamburger) content is: `<nav>` is `absolute left-1/2 -translate-x-1/2` inside a
`relative` header row, instead of relying on `justify-between`'s middle flex slot
(which only looks centered when both siblings happen to be equal width). Also added
the missing mobile nav: below `md` the 4 links were previously in a `hidden md:flex`
block with **no way to reach them at all** on mobile — added a `Menu`/`X` hamburger
button that opens a dropdown (links + a `sm:hidden` "Sign in" duplicate, since Sign in
itself is hidden below `sm`), closes on link click or outside-click, `aria-expanded`/
`aria-controls` wired._

_**Bug hit while building this**: the overlay/panel were first nested inside
`<header>`, and `position: fixed` on them was sizing to the header's own box (a ~250px
tall strip) instead of the full viewport below it — `overlay-click-to-close` silently
never worked because the click landed on page content, not the overlay. Root cause:
`<header>` has `backdrop-blur` (a `backdrop-filter`), and per spec `backdrop-filter` —
like `filter`, `perspective`, or `will-change: transform` — makes that element the
containing block for any `position: fixed` descendants, so the overlay was fixed
relative to the header, not the viewport. Fixed by moving the mobile
overlay+dropdown to be siblings of `<header>` (`NavBar` now returns a fragment)
instead of children of it. **Rule of thumb for later**: don't nest a `fixed`
overlay/modal inside any ancestor with `backdrop-blur`/`blur`/`filter`/`transform` —
render it as a sibling instead, same class of bug as the `overflow-x: hidden` /
`position: sticky` interaction already documented in `DESIGN-SYSTEM.md`._

_Verified via Playwright at 1440/834/375/320px: nav is pixel-exact centered relative
to the header row at desktop/tablet widths (0px measured diff), mobile menu opens/
closes correctly at both 375 and 320px (link click and outside-click both close it,
confirmed only after the containing-block fix — outside-click silently failed
before), 0 console errors. `npx tsc --noEmit`, `npx eslint .`, `npm run build` clean._

_**Post-Phase-6 addition**: nav links now scroll to their section instead of being
decorative. Each of the 4 sections got an `id` matching its nav slug (Hero=`platform`,
InsightFlow=`solutions`, DashboardPreview=`docs`, SignatureInteraction=`pricing` —
1:1 with page order, not a literal semantic match since this is a single-page app
with no dedicated docs/pricing content). Added `lib/scrollToSection.ts`
(`scrollIntoView`, `prefers-reduced-motion`-aware) and wired every `NavItem` that
points at a section (`NavBar` desktop nav, `NavBar` mobile drawer, `Footer`'s Product
column) to `e.preventDefault()` + call it — so the URL never picks up a `#platform`
etc. hash. The decorative `Sign in` link and Footer's Company/Legal `#` placeholders
also now `preventDefault()` (they used to add a bare `#` to the URL on click, which
is the same class of unwanted-hash issue). Verified via Playwright: clicking each of
the 4 nav links scrolls the matching section to the top of the viewport and
`page.url()` stays exactly `/` (no hash) every time._

_Also added `components/ui/AmbientGlow.tsx` — a decorative, `-z-10`, per-section
background: two soft blurred blobs (accent blue / emerald) that slowly drift and
pulse via Framer Motion (`useReducedMotion()`-aware, freezes under reduced motion),
layered over a faint panning dot-grid (`.ambient-grid` in `globals.css`, plain CSS
`@keyframes` so it costs nothing on the main thread — disabled via
`prefers-reduced-motion` media query). Verified the blob's computed `transform`
actually changes over time (not just present in markup) and that
`prefers-reduced-motion: reduce` freezes both the grid's CSS animation and the blobs'
Framer Motion transform._

_**Follow-up per feedback — removed from `DashboardPreview`**: the glow was
originally added to both Insight Flow and Dashboard (the two sections with a flat,
static background — Hero/Signature already have their own WebGL scenes for visual
richness). Feedback was to drop it specifically from the "Intelligence dashboard"
section — a dense data-table/chart UI reads better on a flat surface than with a
moving glow behind it. Removed the `<AmbientGlow>` + its now-unneeded `relative
overflow-hidden` from `DashboardPreview.tsx`'s root section (back to its original
plain className); Insight Flow keeps `variant="b"` as the only section using it now._

_**Also per feedback**: standardized section-heading sizes. `SignatureInteraction`'s
`<h2>` had a stray `sm:text-4xl` bump that Insight Flow's and Dashboard's `<h2>`s
didn't have — removed it so all three non-hero section headings render at the same
`text-3xl` (30px) regardless of viewport width. Hero's `<h1>` intentionally keeps its
own larger, responsive scale (`text-4xl sm:text-5xl md:text-6xl`) since it's the
page's main headline, not a section heading._

_**Gotcha hit while wiring Footer's click handler**: `Footer.tsx` had no `"use client"`
directive (it was a plain Server Component) — passing an inline `onClick` to `NavItem`
from a Server Component fails the build ("Event handlers cannot be passed to Client
Component props"). Added `"use client"` to the top of the file. If a future section
adds interactivity to what's currently a Server Component, this is the first thing to
check._

_Verified: `npx tsc --noEmit`, `npx eslint .`, `npm run build` all clean, 0 console
errors across the click-to-scroll + ambient-glow Playwright checks._

_**Post-Phase-6 addition — nav labels + Sign in/Sign up pages (explicit bonus scope,
breaks the "single-page app" rule on purpose)**: renamed the 4 nav/footer links so
they actually describe what each section shows, instead of generic marketing-site
placeholders — `Platform` (Hero, unchanged, already fit), `Solutions`→**`How it
works`** (Insight Flow's Ingest→Analyze→Generate), `Docs`→**`Dashboard`** (literally
the "Intelligence dashboard" section), `Pricing`→**`Insights`** (Signature
Interaction's "Insights that reorganize themselves"). Section `id`s renamed to match
(`how-it-works`, `dashboard`, `insights`; `platform` unchanged) — `NavBar.tsx` and
`Footer.tsx`'s link arrays are now `{ label, id }[]` instead of plain strings, since
slugs no longer trivially derive via `.toLowerCase()` on a multi-word label.

Also added real `/sign-in` and `/sign-up` pages — the project is otherwise
deliberately single-page (see `CONTEXT-FOR-AI.md`/`PROJECT-BRIEF.md`), but this was
explicitly requested as bonus/extra scope, not part of the core 4-section deliverable.
New: `components/ui/Input.tsx` (reusable labeled input, same focus-ring/token
conventions as everything else), `components/auth/AuthShell.tsx` (shared minimal
centered-card layout — no site nav/footer, matching how Stripe/Linear/Vercel do auth
pages), `components/auth/SignInForm.tsx` / `SignUpForm.tsx` (the actual `<form>`s,
`onSubmit` is a deliberate no-op — no backend per the brief). The header's "Sign in"
link and "Start free" button (both instances — header and Hero) now go to real pages
instead of being decorative:_
- _`NavItem` was switched from a plain `<a>` to `next/link`'s `Link` —
  needed so `href="/sign-in"` gets real Next.js client-side routing. The existing
  section-scroll usages (`href="#platform"` + `preventDefault()` + manual scroll)
  still work unchanged since `Link` still renders an `<a>` under the hood._
- _`Button` became polymorphic — pass `href` and it renders as a styled `Link`
  instead of a `<button>`, so "Start free" can navigate without nesting a `<button>`
  inside an `<a>` (invalid HTML / accessibility footgun). Existing callers that don't
  pass `href` are unaffected._

_**Gotcha hit while testing this**: a Playwright check that clicked a link then
immediately called `page.waitForLoadState("networkidle")` reported the URL hadn't
changed — looked like Sign in was broken. It wasn't: since the page was already
network-idle before the click, `waitForLoadState("networkidle")` resolved instantly,
before Next's client-side route transition had actually committed the new URL a
frame later. Swapping to a real `waitForTimeout` showed every link navigating
correctly. Worth remembering next time a same-page-already-idle Playwright check
"fails" right after a client-side-routed click — check with a real delay before
concluding it's an app bug._

_Verified: all 4 nav links navigate/scroll correctly (section links still add no URL
hash), Sign in ↔ Sign up cross-links work, header and Hero's "Start free" both reach
`/sign-up`, "Back to home" works, 0px mobile horizontal overflow on both auth pages,
keyboard Tab reaches form fields with a visible focus ring, 0 console errors.
`npx tsc --noEmit`, `npx eslint .`, `npm run build` all clean (4 static routes:
`/`, `/sign-in`, `/sign-up`, `/_not-found`)._

_**Post-Phase-6 addition — auth pages redesigned as a split panel**: per feedback,
`AuthShell` is no longer a single centered card; it's a 50/50 split (`lg:` and up) —
left half is a colored/gradient panel (`bg-linear-to-br` accent-blue gradient) with
`components/auth/AuthGlassScene.tsx` (a handful of frosted-glass icon chips —
`bg-white/10 backdrop-blur-md border border-white/20` — that slowly float via Framer
Motion, plus two soft blurred glow blobs for depth) and the page's marketing heading/
paragraph; right half is the form with **no card/border/background box** — it sits
directly on the plain `bg-background`, just like the rest of the site. Below `lg` the
left panel is hidden entirely and the form becomes a normal full-width centered
column (with its own small logo, since the left panel's logo goes with it) — same
responsive pattern as any split-screen auth design. `AuthShell` now takes `heading`/
`description` (left panel copy) in addition to the existing `title`/`subtitle` (form
heading) — Sign In and Sign Up each pass their own copy so the two pages read as
related but distinct moments, not a copy-pasted template._

_Verified: glass shapes' computed `transform` changes over time (real motion, not
just present in markup) and freezes under `prefers-reduced-motion` (confirmed both
ways, same pattern as `AmbientGlow`); 0px horizontal overflow at 1440/900/375px;
keyboard Tab reaches the email field directly (1 tab from page load) with a visible
focus ring; 0 console errors. `npx tsc --noEmit`, `npx eslint .`, `npm run build`
all clean._

## Phase 7 — Deliverables
- [ ] Verify live deployment on Vercel (or Netlify) end-to-end
- [ ] Write `README.md` in the actual code repo (not this planning folder): overview,
      tech stack, local run instructions, animation/interaction decisions
- [ ] Record 2–4 min walkthrough video (screen + voice) explaining key motion/
      interaction decisions → upload unlisted YouTube or public Google Drive link
      (script ready: `VIDEO-SCRIPT.md` in this folder — timestamped, ~3:30–3:45,
      covers all 4 required sections plus the sticky-vs-pin bug as the one
      "engineering judgment" beat)
- [ ] Finalize Figma file, set link sharing to public/anyone-with-link
- [ ] Write product documentation PDF/DOCX (concept → structure → decisions)
- [ ] Final pass against `PROJECT-BRIEF.md` evaluation criteria before submitting

---
See also: [PROJECT-BRIEF.md](./PROJECT-BRIEF.md) · [DESIGN-SYSTEM.md](./DESIGN-SYSTEM.md) ·
[CONTEXT-FOR-AI.md](./CONTEXT-FOR-AI.md)
