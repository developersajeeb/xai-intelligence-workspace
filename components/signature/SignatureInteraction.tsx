"use client";

import { DataCluster } from "@/components/signature/DataCluster";
import { AmbientGlow } from "@/components/ui/AmbientGlow";
import { CanvasLoader } from "@/components/ui/CanvasLoader";
import { useInViewOnce } from "@/lib/useInViewOnce";
import { useIsClient } from "@/lib/useIsClient";
import { useScrollProgress } from "@/lib/useScrollProgress";

export function SignatureInteraction() {
  const { ref, progressRef } = useScrollProgress<HTMLElement>();
  const mounted = useIsClient();
  // Below-the-fold: defer the WebGL canvas's mount (context creation, shader
  // compile, instanced-mesh build) until the section is close to the
  // viewport instead of paying that cost during initial page load.
  const nearView = useInViewOnce(ref);

  return (
    <section
      ref={ref}
      id="insights"
      className="relative flex min-h-screen min-w-0 flex-col items-center justify-center gap-6 overflow-hidden bg-background px-6 text-center"
    >
      <AmbientGlow variant="b" />

      <h2 className="max-w-2xl text-3xl font-semibold text-text-primary">
        Insights that reorganize themselves
      </h2>
      <p className="max-w-xl text-text-secondary">
        Watch structure emerge as data resolves into intelligence.
      </p>
      <div className="relative mt-8 h-72 w-full max-w-4xl overflow-hidden rounded-2xl border border-border-subtle bg-surface sm:h-96 md:h-120">
        {mounted && nearView ? (
          <DataCluster progressRef={progressRef} />
        ) : (
          <CanvasLoader />
        )}
      </div>
    </section>
  );
}
