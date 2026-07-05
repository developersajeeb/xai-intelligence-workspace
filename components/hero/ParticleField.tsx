"use client";

import { useEffect, useMemo, useRef, type MutableRefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const COUNT = 140;
const GRID_COLS = 14;
const BOUNDS = { x: 6, yScattered: 2.1, yStructured: 1.5, z: 1 };
const ACCENT = "#5b8cff";
const GREEN = "#34d399";
const SURFACE = "#131316";
const NEIGHBOR_COUNT = 2;
const CURSOR_RADIUS = 2.2;
const CURSOR_PUSH = 0.55;

interface ParticleData {
  scattered: Float32Array;
  structured: Float32Array;
  colors: Float32Array;
  phases: Float32Array;
  freqs: Float32Array;
  connections: [number, number][];
}

function buildParticleData(): ParticleData {
  const scattered = new Float32Array(COUNT * 3);
  const structured = new Float32Array(COUNT * 3);
  const colors = new Float32Array(COUNT * 3);
  const phases = new Float32Array(COUNT * 3);
  const freqs = new Float32Array(COUNT * 3);
  const accent = new THREE.Color(ACCENT);
  const green = new THREE.Color(GREEN);
  const rows = Math.ceil(COUNT / GRID_COLS);

  for (let i = 0; i < COUNT; i++) {
    const ix = i * 3;
    scattered[ix] = (Math.random() - 0.5) * BOUNDS.x * 2;
    scattered[ix + 1] = (Math.random() - 0.5) * BOUNDS.yScattered * 2;
    scattered[ix + 2] = (Math.random() - 0.5) * BOUNDS.z * 2;

    const col = i % GRID_COLS;
    const row = Math.floor(i / GRID_COLS);
    structured[ix] = (col / (GRID_COLS - 1) - 0.5) * BOUNDS.x * 2;
    structured[ix + 1] = (row / (rows - 1) - 0.5) * BOUNDS.yStructured * 2;
    structured[ix + 2] = 0;

    // per-axis phase/frequency so idle drift feels organic, not synchronized
    phases[ix] = Math.random() * Math.PI * 2;
    phases[ix + 1] = Math.random() * Math.PI * 2;
    phases[ix + 2] = Math.random() * Math.PI * 2;
    freqs[ix] = 0.25 + Math.random() * 0.35;
    freqs[ix + 1] = 0.25 + Math.random() * 0.35;
    freqs[ix + 2] = 0.2 + Math.random() * 0.3;

    const color = Math.random() < 0.82 ? accent : green;
    colors[ix] = color.r;
    colors[ix + 1] = color.g;
    colors[ix + 2] = color.b;
  }

  // Connection topology is computed once on the scattered layout so lines
  // simply follow their two particles as they migrate toward the grid.
  const connections: [number, number][] = [];
  const seen = new Set<string>();
  for (let i = 0; i < COUNT; i++) {
    const distances: { j: number; d: number }[] = [];
    for (let j = 0; j < COUNT; j++) {
      if (i === j) continue;
      const dx = scattered[i * 3] - scattered[j * 3];
      const dy = scattered[i * 3 + 1] - scattered[j * 3 + 1];
      const dz = scattered[i * 3 + 2] - scattered[j * 3 + 2];
      distances.push({ j, d: dx * dx + dy * dy + dz * dz });
    }
    distances.sort((a, b) => a.d - b.d);
    for (const { j } of distances.slice(0, NEIGHBOR_COUNT)) {
      const a = Math.min(i, j);
      const b = Math.max(i, j);
      const key = `${a}-${b}`;
      if (!seen.has(key)) {
        seen.add(key);
        connections.push([a, b]);
      }
    }
  }

  return { scattered, structured, colors, phases, freqs, connections };
}

function useDotTexture() {
  return useMemo(() => {
    const size = 64;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    const gradient = ctx.createRadialGradient(
      size / 2,
      size / 2,
      0,
      size / 2,
      size / 2,
      size / 2,
    );
    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(0.4, "rgba(255,255,255,0.7)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    return new THREE.CanvasTexture(canvas);
  }, []);
}

function Scene({ progressRef }: { progressRef: MutableRefObject<number> }) {
  const { scattered, structured, colors, phases, freqs, connections } = useMemo(
    () => buildParticleData(),
    [],
  );
  const dotTexture = useDotTexture();
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const groupRef = useRef<THREE.Group>(null);
  const smoothedProgress = useRef(0);
  const cursorTilt = useRef({ x: 0, y: 0 });
  const autoRotation = useRef(0);
  const reducedMotion = useRef(false);
  const { pointer } = useThree();

  useEffect(() => {
    reducedMotion.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
  }, []);

  const positions = useMemo(() => scattered.slice(), [scattered]);
  const linePositions = useMemo(
    () => new Float32Array(connections.length * 2 * 3),
    [connections],
  );
  const lineColors = useMemo(() => {
    const arr = new Float32Array(connections.length * 2 * 3);
    connections.forEach(([a, b], idx) => {
      const li = idx * 6;
      arr[li] = colors[a * 3];
      arr[li + 1] = colors[a * 3 + 1];
      arr[li + 2] = colors[a * 3 + 2];
      arr[li + 3] = colors[b * 3];
      arr[li + 4] = colors[b * 3 + 1];
      arr[li + 5] = colors[b * 3 + 2];
    });
    return arr;
  }, [connections, colors]);

  useFrame((state) => {
    const elapsed = state.clock.elapsedTime;
    const target = reducedMotion.current ? 1 : progressRef.current;
    smoothedProgress.current +=
      (target - smoothedProgress.current) * (reducedMotion.current ? 1 : 0.06);
    const t = smoothedProgress.current;
    const eased = t * t * (3 - 2 * t);
    // data drifts more while scattered/"raw", settles as it resolves into structure
    const driftAmount = reducedMotion.current ? 0 : 0.12 * (1 - eased) + 0.02;

    // rough world-space cursor position on the particle plane, for proximity repel
    const cursorX = reducedMotion.current ? 999 : pointer.x * BOUNDS.x;
    const cursorY = reducedMotion.current ? 999 : pointer.y * BOUNDS.yScattered;

    const posArray = pointsRef.current?.geometry.attributes.position
      .array as Float32Array | undefined;
    if (posArray) {
      for (let i = 0; i < COUNT; i++) {
        const ix = i * 3;
        let x = THREE.MathUtils.lerp(scattered[ix], structured[ix], eased);
        let y = THREE.MathUtils.lerp(scattered[ix + 1], structured[ix + 1], eased);
        const z = THREE.MathUtils.lerp(scattered[ix + 2], structured[ix + 2], eased);

        x += Math.sin(elapsed * freqs[ix] + phases[ix]) * driftAmount;
        y += Math.cos(elapsed * freqs[ix + 1] + phases[ix + 1]) * driftAmount;

        if (!reducedMotion.current) {
          const dx = x - cursorX;
          const dy = y - cursorY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CURSOR_RADIUS && dist > 0.0001) {
            const push = 1 - dist / CURSOR_RADIUS;
            const force = push * push * CURSOR_PUSH;
            x += (dx / dist) * force;
            y += (dy / dist) * force;
          }
        }

        posArray[ix] = x;
        posArray[ix + 1] = y;
        posArray[ix + 2] = z;
      }
      pointsRef.current!.geometry.attributes.position.needsUpdate = true;

      const lineArray = linesRef.current?.geometry.attributes.position
        .array as Float32Array | undefined;
      if (lineArray) {
        connections.forEach(([a, b], idx) => {
          const li = idx * 6;
          lineArray[li] = posArray[a * 3];
          lineArray[li + 1] = posArray[a * 3 + 1];
          lineArray[li + 2] = posArray[a * 3 + 2];
          lineArray[li + 3] = posArray[b * 3];
          lineArray[li + 4] = posArray[b * 3 + 1];
          lineArray[li + 5] = posArray[b * 3 + 2];
        });
        linesRef.current!.geometry.attributes.position.needsUpdate = true;
      }
    }

    if (groupRef.current) {
      if (!reducedMotion.current) {
        autoRotation.current += 0.0009;
        cursorTilt.current.y += (pointer.x * 0.16 - cursorTilt.current.y) * 0.04;
        cursorTilt.current.x += (pointer.y * 0.05 - cursorTilt.current.x) * 0.04;
      }
      groupRef.current.rotation.y = autoRotation.current + cursorTilt.current.y;
      groupRef.current.rotation.x = -0.1 + cursorTilt.current.x;
    }
  });

  return (
    <>
      <fog attach="fog" args={[SURFACE, 6.5, 10]} />
      <group ref={groupRef} rotation={[-0.1, 0, 0]}>
        <lineSegments ref={linesRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[linePositions, 3]}
            />
            <bufferAttribute attach="attributes-color" args={[lineColors, 3]} />
          </bufferGeometry>
          <lineBasicMaterial vertexColors transparent opacity={0.22} />
        </lineSegments>
        <points ref={pointsRef}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[positions, 3]} />
            <bufferAttribute attach="attributes-color" args={[colors, 3]} />
          </bufferGeometry>
          <pointsMaterial
            size={0.2}
            vertexColors
            map={dotTexture ?? undefined}
            transparent
            opacity={0.95}
            depthWrite={false}
            sizeAttenuation
            blending={THREE.AdditiveBlending}
          />
        </points>
      </group>
    </>
  );
}

export function ParticleField({
  progressRef,
}: {
  progressRef: MutableRefObject<number>;
}) {
  return (
    <Canvas
      className="absolute inset-0"
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 8], fov: 35 }}
      gl={{ antialias: true, alpha: true }}
    >
      <Scene progressRef={progressRef} />
    </Canvas>
  );
}
