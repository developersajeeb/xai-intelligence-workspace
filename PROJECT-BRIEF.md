# Xai — Intelligence Workspace (RacoAI Frontend Challenge)

## Challenge Context
- Client/Source: RacoAI frontend hiring challenge
- Duration: 5 days from the day the challenge email was received
- Goal: build a single-page, high-fidelity interactive product experience for a fictional
  product called **Xai — Intelligence Workspace**, demonstrating UI/UX clarity,
  design-to-code execution, advanced motion & 3D interaction, and engineering discipline.

## Product Concept
**Name:** Xai – Intelligence Workspace

**Core narrative:** "From raw data → structured intelligence → actionable insight → AI Automations"

The UI must visually walk the user through this transformation using animation, geometry,
and motion — not text explanations. Tone: calm but powerful, technically confident,
designed for decision-makers, clearly an "AI product" (not marketing fluff).
Reference bar: Stripe + Linear + Vercel–level polish, with custom motion & 3D depth.

## Required Sections (single page)

### 1. Hero Section — Data → Intelligence
- Minimal headline + subtext
- Centerpiece animated visual: abstract geometry/particles (raw data) that smoothly
  transform into a structured form (grid, nodes, panels)
- Motion responds to scroll or cursor
- Stack: Three.js (preferred) or advanced SVG + GSAP, choreographed with Framer Motion
- No stock illustrations, no Lottie files

### 2. Interactive Insight Flow
- Horizontally or vertically animated section explaining 3 stages:
  1. Ingest Data
  2. Analyze with AI
  3. Generate Insight
- Each stage animates in/out based on scroll, has micro-interactions (hover, focus,
  transitions), and uses geometry-based animation (lines, masks, transforms)
- Built with GSAP + ScrollTrigger and/or Framer Motion layout animations

### 3. Intelligence Dashboard Preview
- A mock **product** UI (not marketing cards): sidebar navigation, main content panel,
  charts/cards/tables with static mock data
- Subtle entrance animations, hover feedback, state transitions (e.g. tab switching)
- Priority: visual hierarchy, spacing, calm professional typography

### 4. Signature Interaction (the "WOW" moment)
Exactly one deliberate, impressive interaction — examples given in the brief:
- A 3D object that reacts to scroll
- A geometry morph triggered by user action
- A data cluster that reorganizes itself
- A depth-based parallax system

Must communicate: "this person understands motion, math, and intent."

## What NOT to Do
- No templates, no UI kits, no copied Dribbble shots
- No excessive pages (this is a single page)
- No shallow/decorative-only animation
- No stock illustrations, no Lottie

## Design Requirements (Figma)
- High-fidelity Figma file
- Proper Auto Layout, Components & Variants, consistent spacing system
- Desktop-first (responsive thinking is a plus, not required)
- Do not overdesign every screen — prioritize clarity and quality over coverage

## Engineering Requirements
- Next.js (App Router preferred)
- Clean component structure, reusable UI components, thoughtful animation architecture
- No backend needed — mock data is fine
- Animation stack (all required, each used meaningfully):
  - Framer Motion (required)
  - GSAP (for advanced timelines / scroll-triggered animation)
  - Three.js or React Three Fiber (at least one meaningful use)

## Deliverables
1. **Product documentation + Figma file**
   - PDF/DOCX articulating the product idea and page structure — how the high-level
     concept became a concrete interface
   - Publicly accessible Figma file link, well-organized pages/frames, proper
     components/variants and layout system
2. **GitHub repository**
   - Public repo
   - README: project overview, technical approach, tech stack, local run instructions
   - Short video (public Google Drive or YouTube) explaining key animation/interaction
     decisions
3. **Live deployment**
   - Live URL on Vercel or Netlify
   - Smooth interactions, reliable performance

## Evaluation Criteria
- **UI/UX:** visual hierarchy, typography & spacing, professional restraint
- **Motion & Interaction:** purposeful animation, smoothness & performance,
  understanding of timing & easing
- **Engineering Quality:** code structure, component reuse, animation architecture
- **Product Thinking:** does the UI explain the product? is there clarity of intent?

---
See also: [DESIGN-SYSTEM.md](./DESIGN-SYSTEM.md) · [TODO.md](./TODO.md) ·
[CONTEXT-FOR-AI.md](./CONTEXT-FOR-AI.md)
