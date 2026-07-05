"use client";

import { useEffect, useMemo, useRef, type MutableRefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const COUNT = 420;
const CLOUD_RADIUS = 3.6;
const SPHERE_RADIUS = 2.3;
const ACCENT = "#5b8cff";
const GREEN = "#34d399";
const SURFACE = "#131316";

interface ClusterData {
  chaotic: Float32Array;
  resolved: Float32Array;
  colors: Float32Array;
  scales: Float32Array;
  phases: Float32Array;
}

function buildClusterData(): ClusterData {
  const chaotic = new Float32Array(COUNT * 3);
  const resolved = new Float32Array(COUNT * 3);
  const colors = new Float32Array(COUNT * 3);
  const scales = new Float32Array(COUNT);
  const phases = new Float32Array(COUNT);
  const accent = new THREE.Color(ACCENT);
  const green = new THREE.Color(GREEN);

  // golden-angle spiral for an even "resolved" distribution across a sphere shell
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < COUNT; i++) {
    const ix = i * 3;

    // chaotic: random point inside a sphere volume (rejection-free via cube root)
    const r = CLOUD_RADIUS * Math.cbrt(Math.random());
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    chaotic[ix] = r * Math.sin(phi) * Math.cos(theta);
    chaotic[ix + 1] = r * Math.sin(phi) * Math.sin(theta);
    chaotic[ix + 2] = r * Math.cos(phi);

    // resolved: fibonacci sphere — evenly spaced points on the shell surface
    const y = 1 - (i / (COUNT - 1)) * 2;
    const radiusAtY = Math.sqrt(1 - y * y);
    const sphereTheta = goldenAngle * i;
    resolved[ix] = Math.cos(sphereTheta) * radiusAtY * SPHERE_RADIUS;
    resolved[ix + 1] = y * SPHERE_RADIUS;
    resolved[ix + 2] = Math.sin(sphereTheta) * radiusAtY * SPHERE_RADIUS;

    const color = Math.random() < 0.82 ? accent : green;
    colors[ix] = color.r;
    colors[ix + 1] = color.g;
    colors[ix + 2] = color.b;

    scales[i] = 0.5 + Math.random() * 0.5;
    phases[i] = Math.random() * Math.PI * 2;
  }

  return { chaotic, resolved, colors, scales, phases };
}

function Scene({ progressRef }: { progressRef: MutableRefObject<number> }) {
  const { chaotic, resolved, colors, scales, phases } = useMemo(
    () => buildClusterData(),
    [],
  );
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const smoothedProgress = useRef(0);
  const autoRotation = useRef(0);
  const cursorTilt = useRef({ x: 0, y: 0 });
  const reducedMotion = useRef(false);
  const { pointer } = useThree();

  // reused per-frame to avoid allocating a new matrix/vector 420 times/frame
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useEffect(() => {
    reducedMotion.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
  }, []);

  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    for (let i = 0; i < COUNT; i++) {
      mesh.setColorAt(i, new THREE.Color(colors[i * 3], colors[i * 3 + 1], colors[i * 3 + 2]));
    }
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [colors]);

  useFrame((state) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const elapsed = state.clock.elapsedTime;
    const target = reducedMotion.current ? 1 : progressRef.current;
    smoothedProgress.current +=
      (target - smoothedProgress.current) * (reducedMotion.current ? 1 : 0.07);
    const t = smoothedProgress.current;
    const eased = t * t * (3 - 2 * t);
    const driftAmount = reducedMotion.current ? 0 : 0.1 * (1 - eased);

    for (let i = 0; i < COUNT; i++) {
      const ix = i * 3;
      let x = THREE.MathUtils.lerp(chaotic[ix], resolved[ix], eased);
      let y = THREE.MathUtils.lerp(chaotic[ix + 1], resolved[ix + 1], eased);
      let z = THREE.MathUtils.lerp(chaotic[ix + 2], resolved[ix + 2], eased);

      if (driftAmount > 0) {
        x += Math.sin(elapsed * 0.4 + phases[i]) * driftAmount;
        y += Math.cos(elapsed * 0.35 + phases[i]) * driftAmount;
        z += Math.sin(elapsed * 0.3 + phases[i] * 1.3) * driftAmount;
      }

      dummy.position.set(x, y, z);
      dummy.scale.setScalar(scales[i] * (0.85 + eased * 0.3));
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;

    if (groupRef.current && !reducedMotion.current) {
      autoRotation.current += 0.0011;
      cursorTilt.current.y += (pointer.x * 0.2 - cursorTilt.current.y) * 0.04;
      cursorTilt.current.x += (pointer.y * 0.12 - cursorTilt.current.x) * 0.04;
      groupRef.current.rotation.y = autoRotation.current + cursorTilt.current.y;
      groupRef.current.rotation.x = cursorTilt.current.x;
    }
  });

  return (
    <>
      <fog attach="fog" args={[SURFACE, 6, 11]} />
      <ambientLight intensity={0.4} />
      <pointLight position={[4, 3, 5]} intensity={40} color={ACCENT} />
      <pointLight position={[-4, -2, -3]} intensity={20} color={GREEN} />
      <group ref={groupRef}>
        <instancedMesh ref={meshRef} args={[undefined, undefined, COUNT]}>
          <sphereGeometry args={[0.045, 8, 8]} />
          <meshStandardMaterial roughness={0.4} metalness={0.2} />
        </instancedMesh>
      </group>
    </>
  );
}

export function DataCluster({
  progressRef,
}: {
  progressRef: MutableRefObject<number>;
}) {
  return (
    <Canvas
      className="absolute inset-0"
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 7], fov: 40 }}
      gl={{ antialias: true, alpha: true }}
    >
      <Scene progressRef={progressRef} />
    </Canvas>
  );
}
