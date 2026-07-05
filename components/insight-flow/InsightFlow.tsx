"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Database, Sparkles, Lightbulb } from "lucide-react";
import { AmbientGlow } from "@/components/ui/AmbientGlow";
import { GSAP_EASE } from "@/lib/easing";
import { FOCUS_RING } from "@/lib/focusRing";

const STAGES = [
  {
    title: "Ingest Data",
    description: "Connect raw, unstructured sources into a single stream.",
    icon: Database,
  },
  {
    title: "Analyze with AI",
    description: "Xai models find structure, patterns, and signal.",
    icon: Sparkles,
  },
  {
    title: "Generate Insight",
    description: "Structured intelligence surfaces as clear, actionable output.",
    icon: Lightbulb,
  },
];

const ACCENT = "#5b8cff";
const ACCENT_SOFT = "rgba(91, 140, 255, 0.15)";
const BORDER_SUBTLE = "#232327";
const SURFACE_2 = "#1b1b1f";
const TEXT_SECONDARY = "#a1a1aa";

const TRACK_WIDTH = 1200;
const TRACK_HEIGHT = 60;
const NODE_R = 18;
const NODE_Y = TRACK_HEIGHT / 2;
const NODE_X = [80, 600, 1120];

function withoutNulls<T>(items: (T | null)[]): T[] {
  return items.filter((item): item is T => item !== null);
}

export function InsightFlow() {
  // Tall scroll-through wrapper; the actual visible content sits in a
  // `position: sticky` inner div. CSS sticky handles the "stay in place while
  // scrolling through" behavior natively (no spacer math), and GSAP just
  // scrubs the timeline off this wrapper's scroll progress — this sidesteps a
  // GSAP `pin: true` pin-spacer sizing quirk we hit where the spacer wasn't
  // reliably sized to the configured `end` distance, letting the next section
  // scroll up underneath the still-transitioning pinned content.
  const wrapperRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const glowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const iconRefs = useRef<(HTMLDivElement | null)[]>([]);
  const nodeRefs = useRef<(SVGCircleElement | null)[]>([]);
  const connectorRefs = useRef<(SVGLineElement | null)[]>([]);

  // Size the wrapper to (sticky content's own height + one viewport of scroll
  // budget for the 2 stage transitions) instead of a flat vh multiplier. A
  // flat multiplier (e.g. 2x viewport) leaves a large gap of empty page below
  // the pinned card whenever the content is shorter than the viewport — sizing
  // off the content's real height keeps that gap to a normal amount on any
  // screen. Measured in pixels (not raw vh) since large vh values are also
  // fragile on real mobile browsers (address-bar show/hide) and under
  // automated full-page-screenshot viewport resizing.
  const [wrapperHeight, setWrapperHeight] = useState<number | null>(null);
  useEffect(() => {
    const node = stickyRef.current;
    if (!node) return;
    const SCROLL_BUDGET_VH = 1;
    const measure = () => {
      setWrapperHeight(node.offsetHeight + window.innerHeight * SCROLL_BUDGET_VH);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(node);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const cards = withoutNulls(cardRefs.current);
      const glows = withoutNulls(glowRefs.current);
      const icons = withoutNulls(iconRefs.current);
      const nodes = withoutNulls(nodeRefs.current);
      const connectors = withoutNulls(connectorRefs.current);
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      connectors.forEach((line) => {
        const length = Math.abs(
          Number(line.getAttribute("x2")) - Number(line.getAttribute("x1")),
        );
        gsap.set(line, { strokeDasharray: length });
      });

      if (reducedMotion) {
        gsap.set(cards, { scale: 1, opacity: 1, borderColor: ACCENT });
        gsap.set(glows, { opacity: 0.4 });
        gsap.set(icons, { backgroundColor: ACCENT_SOFT, color: ACCENT });
        gsap.set(nodes, { fill: ACCENT, stroke: ACCENT });
        gsap.set(connectors, { strokeDashoffset: 0 });
        return;
      }

      // initial "pending" state: only the first stage is active
      gsap.set(cards[0], { scale: 1.04, opacity: 1, borderColor: ACCENT });
      gsap.set(cards.slice(1), {
        scale: 0.94,
        opacity: 0.4,
        borderColor: BORDER_SUBTLE,
      });
      gsap.set(glows[0], { opacity: 0.6 });
      gsap.set(glows.slice(1), { opacity: 0 });
      gsap.set(icons[0], { backgroundColor: ACCENT_SOFT, color: ACCENT });
      gsap.set(icons.slice(1), {
        backgroundColor: SURFACE_2,
        color: TEXT_SECONDARY,
      });
      gsap.set(nodes[0], { fill: ACCENT, stroke: ACCENT });
      gsap.set(nodes.slice(1), { fill: SURFACE_2, stroke: BORDER_SUBTLE });
      gsap.set(connectors, {
        strokeDashoffset: (i, target: SVGLineElement) =>
          Math.abs(
            Number(target.getAttribute("x2")) -
              Number(target.getAttribute("x1")),
          ),
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.6,
        },
      });

      for (let i = 1; i < STAGES.length; i++) {
        const pos = i - 1;
        const connector = connectors[i - 1];
        if (connector) {
          tl.to(connector, { strokeDashoffset: 0, duration: 1, ease: "none" }, pos);
        }
        tl.to(
          cards[i],
          { scale: 1.04, opacity: 1, borderColor: ACCENT, duration: 1, ease: GSAP_EASE.out },
          pos,
        );
        tl.to(glows[i], { opacity: 0.6, duration: 1, ease: GSAP_EASE.out }, pos);
        tl.to(
          icons[i],
          { backgroundColor: ACCENT_SOFT, color: ACCENT, duration: 1, ease: GSAP_EASE.out },
          pos,
        );
        tl.to(nodes[i], { fill: ACCENT, stroke: ACCENT, duration: 1, ease: GSAP_EASE.out }, pos);

        tl.to(
          cards[i - 1],
          { scale: 1, opacity: 1, borderColor: BORDER_SUBTLE, duration: 1, ease: GSAP_EASE.out },
          pos,
        );
        tl.to(glows[i - 1], { opacity: 0.15, duration: 1, ease: GSAP_EASE.out }, pos);
      }
    }, wrapperRef);

    // Web font swap (next/font) can shift layout height after ScrollTrigger's
    // initial measurement. Re-measure once fonts settle.
    document.fonts.ready.then(() => ScrollTrigger.refresh());

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={wrapperRef}
      id="how-it-works"
      className="relative min-w-0 h-[180vh]"
      style={wrapperHeight ? { height: wrapperHeight } : undefined}
    >
      <div
        ref={stickyRef}
        className="sticky top-0 flex flex-col justify-center overflow-hidden bg-background px-6 py-24 sm:py-32"
      >
        <AmbientGlow variant="b" />

        <div className="mx-auto flex w-full max-w-6xl flex-col gap-12">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold text-text-primary">
              Ingest → Analyze → Generate
            </h2>
            <p className="max-w-2xl text-text-secondary">
              A single pipeline. Each stage animates into focus as you scroll —
              the active stage brightens and lifts while the others recede.
            </p>
          </div>

          {/* connecting line/node track — geometry expressing the 3-stage flow */}
          <svg
            viewBox={`0 0 ${TRACK_WIDTH} ${TRACK_HEIGHT}`}
            className="hidden w-full md:block"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {NODE_X.slice(0, -1).map((x, i) => (
              <line
                key={`connector-${i}`}
                ref={(el) => {
                  connectorRefs.current[i] = el;
                }}
                x1={x + NODE_R}
                y1={NODE_Y}
                x2={NODE_X[i + 1] - NODE_R}
                y2={NODE_Y}
                stroke={BORDER_SUBTLE}
                strokeWidth={2}
              />
            ))}
            {NODE_X.map((x, i) => (
              <g key={`node-${i}`}>
                <circle
                  ref={(el) => {
                    nodeRefs.current[i] = el;
                  }}
                  cx={x}
                  cy={NODE_Y}
                  r={NODE_R}
                  fill={SURFACE_2}
                  stroke={BORDER_SUBTLE}
                  strokeWidth={1.5}
                />
                <text
                  x={x}
                  y={NODE_Y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={12}
                  fill="var(--text-primary)"
                >
                  {`0${i + 1}`}
                </text>
              </g>
            ))}
          </svg>

          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {STAGES.map((stage, i) => (
              <div
                key={stage.title}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                tabIndex={0}
                className={`group relative rounded-xl border border-border-subtle bg-surface p-6 transition-transform duration-200 hover:-translate-y-1 hover:border-accent/50 focus-visible:-translate-y-1 focus-visible:border-accent/50 ${FOCUS_RING}`}
              >
                <div
                  ref={(el) => {
                    glowRefs.current[i] = el;
                  }}
                  className="pointer-events-none absolute -inset-px rounded-xl opacity-0"
                  style={{ boxShadow: "0 0 40px 6px rgba(91,140,255,0.35)" }}
                />
                <div
                  ref={(el) => {
                    iconRefs.current[i] = el;
                  }}
                  className="relative mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-surface-2 text-text-secondary"
                >
                  <stage.icon className="h-5 w-5" strokeWidth={1.75} />
                </div>
                <h3 className="relative mb-2 text-lg font-medium text-text-primary">
                  {stage.title}
                </h3>
                <p className="relative text-sm text-text-secondary">
                  {stage.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
