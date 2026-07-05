# Walkthrough Video Script — Xai Intelligence Workspace

> **Target length:** ~3:30–3:45 (brief asks for 2–4 min). Record screen + voice
> (OBS / Loom / QuickTime are all fine). Practice once un-recorded first so the
> clicks/scrolls feel natural — you don't need to hit every timestamp exactly,
> they're pacing guides, not a hard cue sheet.
>
> **If you're running long**, cut in this order: (1) the "Bonus" section at the
> end first, (2) shorten the Engineering section to just the sticky-vs-pin bug,
> (3) trim one KPI/automation click in the Dashboard section. Don't cut the Hero,
> Insight Flow, or Signature Interaction walkthroughs — those are the 3 required
> "advanced motion & 3D" sections the brief is actually evaluating.
>
> Read the narration in your own words — this is a script to work from, not a
> word-for-word teleprompter. Sound like yourself.

---

## 0:00–0:20 — Cold open (on the Hero, page just loaded, don't scroll yet)

**[SCREEN: home page, top of page, particle field idle/scattered]**

> "Hi, I'm [name], and this is my submission for the Xai Intelligence Workspace
> challenge — a single-page product experience built with Next.js, Three.js by
> way of React Three Fiber, GSAP, and Framer Motion. The whole thing walks
> through one narrative: raw data becoming structured intelligence — and I
> tried to make the motion itself *tell* that story, not just decorate it.
> Let me walk through the four required sections and a few of the engineering
> decisions behind them."

---

## 0:20–1:05 — Hero: particle → grid

**[SCREEN: slowly scroll through the Hero canvas box; move the mouse over it]**

> "The hero canvas starts as 140 scattered particles — that's the 'raw data.'
> As you scroll, they interpolate into a 14-column grid using a smoothstep-eased
> progress value, so the motion decelerates naturally instead of feeling linear.
> Notice a few things layered on top of that core transform: each particle has
> its own idle drift that calms down as the grid resolves — so 'raw' data feels
> alive and 'structured' data feels settled — and the particles near the cursor
> get a subtle repel force. There's also a connecting-line mesh between nearest
> neighbors that follows the particles as they move. Everything reads a single
> scroll-progress ref inside one `useFrame` loop, so it's driving real position
> data every frame, not a CSS trick."

**[SCREEN: scroll back up to show it reset to scattered]**

> "And if you have reduced-motion turned on at the OS level, this skips straight
> to the resolved grid with no drift or rotation — same for every animated
> section in this build."

---

## 1:05–1:50 — Insight Flow: Ingest → Analyze → Generate

**[SCREEN: scroll into the Insight Flow section slowly, pause on each stage]**

> "This section explains the three-stage pipeline — Ingest, Analyze, Generate —
> and it's pinned in place while you scroll through it, with a GSAP timeline
> scrubbing the active state between cards, plus an SVG connector line that
> draws itself in with `stroke-dashoffset` between each stage."

**[Optional but recommended — shows engineering judgment, a real evaluation criterion]**

> "One decision worth calling out: this isn't using GSAP ScrollTrigger's
> `pin: true`. I actually built it that way first, and hit a real bug — the
> pin-spacer wasn't sized correctly to the scroll distance, so the next section
> would creep up and overlap the still-pinned one. Instead this uses a plain
> CSS `position: sticky` wrapper and lets GSAP just scrub the timeline off that
> element's own scroll range. It's simpler and it doesn't have that failure
> mode — so I used the same pattern for every pinned section after that."

**[SCREEN: hover/click-focus a stage card to show the micro-interaction]**

> "Each card also has its own hover and keyboard-focus state, independent of
> the scroll timeline."

---

## 1:50–2:35 — Intelligence Dashboard Preview

**[SCREEN: scroll to Dashboard, let the entrance stagger play]**

> "This is a mock product surface, not a marketing card grid — sidebar nav,
> KPI cards, charts, a sortable table — and everything animates in with a
> staggered Framer Motion entrance the first time it scrolls into view."

**[SCREEN: click a tab, e.g. Automations]**

> "Tabs share a single animated underline via `layoutId`, and —"

**[SCREEN: toggle an automation switch]**

> "— toggling an automation plays a quick 'Activating…' state before it
> settles into a live 'Running' indicator, so it actually feels like something
> is happening in the background, not just a static mock."

**[SCREEN: click a chart legend dot to toggle a series, then hover the donut chart]**

> "The chart legend is clickable — it toggles that series on the chart — and
> hovering a Signal Mix row highlights the matching donut segment."

**[SCREEN: click "New report"]**

> "And this 'New report' button actually does something: it switches to the
> Reports tab and shows a generating state before settling into a draft."

---

## 2:35–3:15 — Signature Interaction: the data cluster

**[SCREEN: scroll to the final section, let it come into view]**

> "This is the signature moment — 420 spheres rendered as a single
> `InstancedMesh`, so it's one draw call no matter how many instances there
> are. They start as a chaotic volumetric cloud and resolve into a
> fibonacci-distributed sphere shell as you scroll — same scroll-progress
> pattern as the hero, but I deliberately gave this one real lighting instead
> of the hero's flat glow sprites, so it reads as a distinct second 3D moment,
> not a re-skin of the first one."

**[Optional]**

> "It's also mounted lazily — the canvas doesn't initialize until you're about
> to scroll to it, so it's not competing with the rest of the page for load
> time."

---

## 3:15–3:35 — Engineering / architecture (quick recap)

**[SCREEN: can stay on the last section, or show the file tree briefly]**

> "A few things tie the whole build together: both 3D scenes share one
> scroll-progress hook so there's no duplicated scroll logic; GSAP and Framer
> Motion pull from the same easing and duration tokens so nothing feels like
> it's animating on a different clock; and I did a full accessibility pass —
> keyboard focus states on every interactive element, a Lighthouse audit, and
> color-contrast fixes — on top of `prefers-reduced-motion` support everywhere,
> not just the hero."

---

## 3:35–3:45 — Close

**[SCREEN: back to top of the page, or the live URL in the address bar]**

> "That's the walkthrough — thanks for watching. The repo link and live
> deployment are in the submission, and the README has the local run
> instructions if you want to dig into the code."

---

## (Cuttable) Bonus mention — only if you have time left

**[SCREEN: open the mobile menu, or show /sign-up]**

> "A couple of extras beyond the core brief: a responsive mobile nav with a
> proper hamburger menu, and fully designed sign-in / sign-up pages with a
> split-panel layout, since I had a bit of extra time."

---

## Recording checklist
- [ ] Close other tabs/notifications (Slack, email) before recording
- [ ] Use the **production build** (`npm run build && npm run start`), not `next dev`
  — smoother animation, no HMR/dev overlay in the recording
- [ ] Full-screen the browser window, hide the bookmarks bar
- [ ] Do one silent dry run of the scroll/click choreography first
- [ ] Check your mic levels on a 10-second test clip before the real take
- [ ] Trim dead air at the start/end before uploading
- [ ] Upload **unlisted** on YouTube (not private — reviewers need the link to
  work without requesting access) or a Google Drive link set to
  "anyone with the link can view"
