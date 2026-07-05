"use client";

import { Button } from "@/components/ui/Button";
import { AmbientGlow } from "@/components/ui/AmbientGlow";
import { CanvasLoader } from "@/components/ui/CanvasLoader";
import { ParticleField } from "@/components/hero/ParticleField";
import { useIsClient } from "@/lib/useIsClient";
import { useScrollProgress } from "@/lib/useScrollProgress";

export function Hero() {
  const { ref, progressRef } = useScrollProgress<HTMLElement>();
  // Three.js/WebGL must only run client-side; mount the canvas post-hydration
  // rather than via next/dynamic(ssr:false), which bails out through a
  // Suspense marker that can get stuck under Turbopack dev.
  const mounted = useIsClient();

  return (
    <section
      ref={ref}
      id="platform"
      className="relative flex min-h-screen min-w-0 flex-col items-center justify-center gap-6 overflow-hidden bg-background px-6 py-14 md:py-24 text-center"
    >
      <AmbientGlow variant="a" />

      <span className="inline-flex items-center gap-2 rounded-full border border-border-subtle bg-surface px-3 py-1 text-xs text-text-secondary">
        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
        Now with autonomous signal detection
      </span>

      <h1 className="max-w-3xl text-4xl font-semibold text-text-primary sm:text-5xl md:text-6xl">
        Turn raw data into decisive intelligence.
      </h1>

      <p className="max-w-xl text-base text-text-secondary sm:text-lg">
        Xai ingests scattered, unstructured data and resolves it into a living
        map of insight — so your team decides on signal, not noise.
      </p>

      <div className="flex items-center gap-3">
        <Button href="/sign-up" variant="primary">Start free</Button>
        <Button variant="secondary">Book a demo</Button>
      </div>

      <div className="relative mt-12 h-64 w-full max-w-4xl overflow-hidden rounded-2xl border border-border-subtle bg-surface sm:h-80 md:h-105">
        <div className="absolute right-4 top-4 z-10 flex items-center gap-2 text-[10px] font-medium uppercase tracking-wide">
          <span className="rounded-full border border-border-subtle bg-background/60 px-2 py-1 text-text-muted">
            Raw
          </span>
          <span className="rounded-full border border-accent/30 bg-accent/10 px-2 py-1 text-accent">
            + Structured
          </span>
        </div>

        {mounted ? <ParticleField progressRef={progressRef} /> : <CanvasLoader />}
      </div>
    </section>
  );
}
