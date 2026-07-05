# Xai — Intelligence Workspace

A single-page, high-fidelity interactive product experience built for the RacoAI
frontend hiring challenge. Xai is a fictional AI product; the page's job is to
*show*, through motion and geometry rather than copy, how it turns raw data into
structured intelligence and actionable insight.

---

## Overview & technical approach

The brief asked for four specific sections, each demonstrating a different motion
technique, tied together by one narrative: **raw data → structured intelligence →
actionable insight → AI automations.**

| Section | What it shows | Primary tech |
|---|---|---|
| **Hero** | 140 scattered particles resolve into a 14-column grid as you scroll, with cursor-reactive drift | Three.js / React Three Fiber |
| **Insight Flow** | Ingest → Analyze → Generate, scroll-scrubbed stage transitions with a draw-in connector line | GSAP + ScrollTrigger |
| **Intelligence Dashboard Preview** | A mock, fully-interactive product surface — sidebar, tabs, charts, table, live-feeling automations | Framer Motion + Recharts |
| **Signature Interaction** | 420 instanced spheres morph from a chaotic cloud into a lit, fibonacci-distributed sphere shell | Three.js / React Three Fiber |

Two extra pages (`/sign-in`, `/sign-up`) were built beyond the core single-page
brief as bonus scope — see [Bonus scope](#bonus-scope-beyond-the-core-brief) below.

The approach throughout was to treat motion as **infrastructure, not decoration**:
one shared scroll-progress hook drives both 3D scenes, one set of easing/duration
tokens is shared between GSAP and Framer Motion so nothing feels like it's
animating on a different clock, and every animated section has a
`prefers-reduced-motion` fallback rather than motion being bolted on afterward.

---

## Tech stack

- **[Next.js 16](https://nextjs.org/)** — App Router, Turbopack dev/build
- **[React 19](https://react.dev/)** + **TypeScript**
- **[Tailwind CSS v4](https://tailwindcss.com/)** — CSS-first config (`@theme inline` in `app/globals.css`, no `tailwind.config.js`)
- **[Framer Motion](https://www.framer.com/motion/)** — UI choreography, layout animations, entrance/exit transitions
- **[GSAP](https://gsap.com/) + ScrollTrigger** — scroll-scrubbed timelines (Insight Flow)
- **[Three.js](https://threejs.org/)** via **[React Three Fiber](https://r3f.docs.pmnd.rs/)** + **drei** — the two 3D scenes (Hero, Signature Interaction)
- **[Recharts](https://recharts.org/)** — dashboard charts (area, donut, sparkline)
- **[lucide-react](https://lucide.dev/)** — icon set (used exclusively, no second icon system)

No backend — all data in the Dashboard/Reports/Automations views is static mock
data, per the brief.

---

## Getting started

### Prerequisites
- Node.js 20+ and npm

### Install & run locally
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

### Production build
```bash
npm run build
npm run start
```
`npm run build` runs a full TypeScript check as part of the build; `npm run lint`
runs ESLint on its own if you want to check that separately.

---

## Project structure

```
app/                  Next.js App Router — routes: / , /sign-in , /sign-up
components/
  hero/                Hero section + ParticleField (R3F)
  insight-flow/         Ingest → Analyze → Generate (GSAP ScrollTrigger)
  dashboard/            Dashboard preview, charts, signals table
  signature/            Signature Interaction + DataCluster (R3F)
  auth/                 Shared sign-in/up layout, forms, glass-panel scene
  ui/                   Reusable primitives — Button, Input, NavBar, Footer,
                         Badge, Switch, AmbientGlow, CanvasLoader, etc.
lib/                   Shared hooks/utilities — useScrollProgress, useIsClient,
                         useInViewOnce, scrollToSection, easing tokens, focus-ring
                         tokens
```

---

## Key animation & interaction decisions

### Hero — particle → grid
140 particles (`THREE.Points`) start at randomized "scattered" positions and
interpolate toward a 14-column grid using a **smoothstep-eased** scroll-progress
value — so the motion decelerates naturally rather than tracking scroll linearly.
Layered on top of that core transform: per-particle idle drift that damps to near-
zero as the grid resolves (raw data reads as "alive," structured data reads as
"calm"), a cursor-proximity repel force, and a connecting-line mesh between
nearest neighbors that follows the particles as they move. Everything reads a
single scroll-progress **ref** (not React state) inside one `useFrame` loop, so
scrolling never triggers a re-render.

### Insight Flow — Ingest → Analyze → Generate
Scroll-scrubbed via a GSAP timeline, with an SVG connector line that draws itself
in via `stroke-dashoffset` between stages. **Deliberately not** built with GSAP
ScrollTrigger's `pin: true`: an early version hit a real bug where the pin-spacer
wasn't reliably sized to the configured scroll distance, letting the next section
creep up and overlap the still-pinned one. The fix — and the pattern reused for
every subsequent pinned/sticky section — is a plain CSS `position: sticky` wrapper,
with GSAP just scrubbing the timeline off that element's own scroll range instead
of managing pin/unpin itself.

### Intelligence Dashboard Preview
A mock product surface (sidebar, KPI cards, charts, a sortable/filterable table),
not a marketing card grid — and genuinely interactive rather than static:
- Framer Motion staggered entrance the first time it scrolls into view
- Tabs share one animated underline via `layoutId`
- Automations show a live "Running" pulse indicator and an "Activating…" transition
  state when toggled on
- Chart legends are clickable (toggle a series / highlight a donut segment)
- "New report" switches to the Reports tab and shows a generating → draft transition

### Signature Interaction — the data cluster
420 spheres rendered as a single `THREE.InstancedMesh` (one draw call regardless
of instance count), morphing from a chaotic volumetric cloud into a
fibonacci-distributed sphere shell as you scroll. Given real lighting
(`MeshStandardMaterial` + two point lights) rather than the Hero's flat glow
sprites, on purpose — a second, visually distinct 3D moment rather than a re-skin
of the first. The canvas mount is deferred via an `IntersectionObserver`-based hook
so it doesn't compete with the rest of the page for load time before it's needed.

### Cross-cutting decisions
- **Shared scroll-progress hook** (`lib/useScrollProgress.ts`) drives both 3D
  scenes — no duplicated scroll-tracking logic between them.
- **Shared easing tokens** (`lib/easing.ts`) — GSAP and Framer Motion pull from
  the same `power3.out`-equivalent curve and duration scale, so the two animation
  systems read as one.
- **Accessibility**: keyboard focus states audited and added across every
  interactive element (`lib/focusRing.ts`), a Lighthouse pass, color-contrast
  token fixes, and `prefers-reduced-motion` respected in every animated
  component — the 3D scenes, the ambient section backgrounds, and the CSS
  keyframe animations alike.
- **Performance**: the Signature Interaction's WebGL canvas mounts lazily
  (`lib/useInViewOnce.ts`) instead of on initial page load; both 3D canvases show
  a lightweight loading placeholder instead of a blank flash.

---

## Bonus scope beyond the core brief

A few additions past the required 4 sections, added as extra polish:
- Fully responsive nav (true-centered links, a mobile hamburger menu)
- Ambient, slowly-drifting section backgrounds (Insight Flow) — a decorative
  glow + panning dot-grid layer, `prefers-reduced-motion`-aware
- Real `/sign-in` and `/sign-up` pages with a split-panel layout (colored,
  animated glass-panel brand side + an unboxed form side)

---

## Verification

`npx tsc --noEmit`, `npx eslint .`, and `npm run build` all pass clean. Cross-
browser checked on Chromium, Firefox, and WebKit, plus a CPU-throttled low-end
mobile viewport, with zero console errors.
