# Context Primer — paste/reference this at the start of every new AI chat session

Copy the block below into a new Claude/Copilot chat (or just tell the assistant to
read this file) before asking it to continue the build.

---

```
I'm building "Xai – Intelligence Workspace" — a single-page, high-fidelity interactive
product experience for a frontend hiring challenge (RacoAI). Full context lives in this
project folder. Before doing anything, read these files in order:

1. PROJECT-BRIEF.md   — full requirements, deliverables, evaluation criteria
2. DESIGN-SYSTEM.md   — color/type/spacing tokens, component inventory, animation conventions
3. TODO.md            — phase-by-phase build checklist with checkboxes; "Current phase"
                         line at the top tells you where I left off

Tech stack: Next.js 16 (App Router, TypeScript, Turbopack dev server), React 19,
Tailwind CSS v4 (CSS-first config — there is NO tailwind.config.js; design tokens are
defined as CSS variables in app/globals.css inside the @theme inline block), Framer
Motion, GSAP + ScrollTrigger, Three.js via React Three Fiber + drei, recharts for
dashboard charts.

Rules:
- Continue from the first unchecked [ ] item in TODO.md unless I say otherwise.
- Follow the component structure and naming conventions already in /components and /app
  (don't invent a new structure).
- Use the design tokens from DESIGN-SYSTEM.md instead of hardcoding colors/spacing.
- Keep animation logic reusable: the Hero particle system and the Signature Interaction
  both need a scroll-progress (0-1) value — reuse one hook/util for that, don't duplicate.
- After completing each checklist item, update TODO.md: check the box and update
  "Current phase" if it changed.
- Respect prefers-reduced-motion for all scroll/3D animation.
- This is a single-page app — no extra routes/pages beyond what's needed.
- Don't add features or polish beyond what the current phase in TODO.md asks for; we're
  time-boxed to 5 days total.
- For any client-only/WebGL component, don't use `next/dynamic(..., { ssr: false })` —
  under Turbopack dev it can get stuck on a bailout Suspense marker and silently never
  hydrate. Import the component directly and gate it with `lib/useIsClient.ts` instead.
- `lib/useScrollProgress.ts` returns `{ ref, progressRef }` (a ref, not React state) so
  scroll doesn't trigger re-renders — read `progressRef.current` inside `useFrame`, don't
  pass `progress` as a prop that changes every scroll pixel.
- For any scroll-pinned section (a section that should stay fixed while its internal
  animation plays out), don't use GSAP ScrollTrigger's `pin: true` — its pin-spacer
  wasn't reliably sized to the configured `end` distance in this project (verified in
  both dev and a production build), which let the next section overlap the still-
  pinned one. Use the sticky+scrub pattern instead: a tall wrapper
  (`h-[NNvh]`, e.g. 260vh for ~1.6x-viewport of scroll) containing a
  `position: sticky; top: 0` inner content div, with the GSAP `scrollTrigger` set to
  `start: "top top", end: "bottom bottom"` and no `pin` option at all. See
  `components/insight-flow/InsightFlow.tsx` for the reference implementation.
```

---

## Notes for me (human) on keeping context across sessions
- Always update `TODO.md` checkboxes yourself too — don't only rely on the AI to do it,
  in case a session ends mid-task.
- If a session made a design/architecture decision not already captured in
  `DESIGN-SYSTEM.md` or `PROJECT-BRIEF.md` (e.g. "we're using `recharts` not custom SVG
  for charts", "particle count = 800 for perf"), add a one-line note into
  `DESIGN-SYSTEM.md` so future sessions don't re-litigate it.
- The Next.js app now lives directly in this same `xai-intelligence-workspace` folder
  (package.json/app/components/lib alongside these planning docs) — this folder is no
  longer docs-only.
- If a long-running dev server has been through many hot-reloads and something looks
  wrong that code review doesn't explain (e.g. a hydration mismatch that shouldn't be
  possible), kill it, delete `.next/`, and restart clean before spending time debugging —
  this resolved a false-alarm hydration issue during the Hero particle field build.

---
See also: [PROJECT-BRIEF.md](./PROJECT-BRIEF.md) · [DESIGN-SYSTEM.md](./DESIGN-SYSTEM.md) ·
[TODO.md](./TODO.md)
