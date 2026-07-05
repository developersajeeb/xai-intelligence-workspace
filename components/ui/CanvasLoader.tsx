/** Placeholder shown inside a 3D canvas's fixed-size container before it mounts
 * client-side, so there's no blank flash while avoiding any layout shift (the
 * container is already sized by its parent regardless of mount state). */
export function CanvasLoader() {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      aria-hidden="true"
    >
      <span className="h-2 w-2 animate-pulse rounded-full bg-accent/50" />
    </div>
  );
}
