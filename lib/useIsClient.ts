"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/** True only once mounted on the client — for gating browser/WebGL-only UI. */
export function useIsClient(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
