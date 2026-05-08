"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, useGLTF } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

/**
 * Spider hanging from a silk thread on the right column.
 *
 *   • Thread          — static, vertical.
 *   • Spider          — climbs up and down the thread driven by
 *                        scroll position + a tiny idle bob, with a
 *                        subtle yaw drift so it never feels frozen.
 *   • Camera          — fixed near-front three-quarter view. No
 *                        orbiting; the spider stays composed and
 *                        readable as "hanging" at every scroll
 *                        position.
 */

const SPIDER_GLB = "/3d/spider/spider.glb";
useGLTF.preload(SPIDER_GLB);

export function HangingSpider() {
    const [enabled, setEnabled] = useState(false);
    useEffect(() => {
        if (typeof window === "undefined") return;
        const isCoarse = window.matchMedia("(pointer: coarse)").matches;
        const reduce = window.matchMedia(
            "(prefers-reduced-motion: reduce)",
        ).matches;
        if (!isCoarse && !reduce) setEnabled(true);
    }, []);
    if (!enabled) return null;

    return (
        <aside
            aria-hidden
            className="pointer-events-none fixed right-0 top-0 z-30 hidden lg:block"
            style={{
                width: "min(280px, 20vw)",
                height: "100vh",
            }}
        >
            <Canvas
                gl={{
                    antialias: true,
                    alpha: true,
                    toneMapping: THREE.ACESFilmicToneMapping,
                    toneMappingExposure: 1.0,
                }}
                style={{ background: "transparent" }}
                dpr={[1, 2]}
                camera={{ position: [0, 0, 5.5], fov: 38, near: 0.1, far: 50 }}
            >
                <Environment preset="apartment" environmentIntensity={0.65} />
                <ambientLight intensity={0.25} />
                <directionalLight
                    position={[3, 4, 5]}
                    intensity={1.4}
                    color="#fff5e0"
                />
                <pointLight
                    position={[-2, 2, 3]}
                    intensity={0.5}
                    color="#bbd0ff"
                />
                <pointLight
                    position={[1, -2, 4]}
                    intensity={0.3}
                    color="#fde4b8"
                />
                <Suspense fallback={null}>
                    <SpiderOnThread />
                </Suspense>
            </Canvas>
        </aside>
    );
}

// ─── Helpers ─────────────────────────────────────────────────────

function getScrollT(): number {
    if (typeof window === "undefined") return 0;
    const docH = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight,
    );
    return Math.max(0, Math.min(1, window.scrollY / docH));
}

// ─── Static thread + climbing spider ─────────────────────────────

const THREAD_TOP_Y = 2.4;
const THREAD_BOTTOM_Y = -2.4;
const SPIDER_TRAVEL_AMP = 1.4;        // ± half-range the spider climbs

// Idle vertical bob (breathing on the silk).
const SPIDER_IDLE_AMP = 0.12;
const SPIDER_IDLE_FREQ = 0.45;

// Pendulum swing — rocks left/right around the silk anchor.
// Two slightly-detuned harmonics combine so the motion never feels
// like a metronome.
const SWING_AMP = 0.32;               // ± rad of body tilt
const SWING_FREQ_PRIMARY = 0.22;
const SWING_FREQ_SECONDARY = 0.31;
const SWING_X_TRANSLATION = 0.55;     // how far the body drifts on X

// Yaw spin — the spider slowly rotates on its silk axis. Not a full
// metronome: a wandering combination of two waves keeps the angle
// shifting through every facet of the model over a long cycle.
const YAW_AMP_FAST = 0.45;
const YAW_FREQ_FAST = 0.13;
const YAW_DRIFT_RATE = 0.08;          // continuous slow rotation (rad/s)

function SpiderOnThread() {
    const spiderGroupRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (!spiderGroupRef.current) return;
        const t = getScrollT();
        const time = state.clock.elapsedTime;
        const g = spiderGroupRef.current;

        // ── Y position: scroll-driven climb + tiny idle bob ────
        const scrollY = (0.5 - t) * 2 * SPIDER_TRAVEL_AMP;
        const idleY = Math.sin(time * SPIDER_IDLE_FREQ) * SPIDER_IDLE_AMP;
        g.position.y = scrollY + idleY;

        // ── Pendulum swing on the silk ─────────────────────────
        // The two-frequency sum gives an organic, non-repeating arc.
        // X translation and Z rotation are phase-locked so the body
        // tilts INTO the swing direction, like a real pendulum.
        const swingPhase =
            Math.sin(time * SWING_FREQ_PRIMARY * Math.PI * 2) * 0.7 +
            Math.sin(time * SWING_FREQ_SECONDARY * Math.PI * 2) * 0.3;
        g.position.x = swingPhase * SWING_X_TRANSLATION;
        g.rotation.z = swingPhase * SWING_AMP;

        // ── Yaw spin (rotation around the silk axis) ───────────
        // Continuous drift + an oscillating wave so we see all sides.
        g.rotation.y =
            time * YAW_DRIFT_RATE +
            Math.sin(time * YAW_FREQ_FAST * Math.PI * 2) * YAW_AMP_FAST;
    });

    return (
        <group>
            <SilkThread />
            <group ref={spiderGroupRef}>
                <SpiderModel />
            </group>
        </group>
    );
}

function SilkThread() {
    const geometry = useMemo(() => {
        const curve = new THREE.CatmullRomCurve3(
            [
                new THREE.Vector3(0, THREAD_TOP_Y, 0),
                new THREE.Vector3(0, 0, -0.005),
                new THREE.Vector3(0, THREAD_BOTTOM_Y, 0),
            ],
            false,
            "catmullrom",
            0.18,
        );
        return new THREE.TubeGeometry(curve, 12, 0.0045, 5, false);
    }, []);
    return (
        <mesh geometry={geometry}>
            <meshPhysicalMaterial
                color="#eef3f8"
                roughness={0.06}
                metalness={0.0}
                transmission={0.5}
                thickness={0.05}
                ior={1.45}
                iridescence={1}
                iridescenceIOR={1.33}
                iridescenceThicknessRange={[100, 500]}
                clearcoat={1}
                clearcoatRoughness={0.04}
                sheen={1}
                sheenColor={new THREE.Color("#cfe0ff")}
                sheenRoughness={0.4}
                emissive={new THREE.Color("#1c2530")}
                emissiveIntensity={0.04}
            />
        </mesh>
    );
}

function SpiderModel() {
    const { scene } = useGLTF(SPIDER_GLB);
    const cloned = useMemo(() => scene.clone(true), [scene]);
    // Natural hanging pose. The GLB authors the spider with its body
    // axis along X (head at +X, abdomen at -X), back along +Y. We
    // want abdomen UP (toward the navbar) and head DOWN with the
    // eyes tilted forward toward the viewer (looking at the keyboard).
    //
    //   rotation.x — pitches the head/cephalothorax toward the camera
    //                (>0 tilts the face forward).
    //   rotation.z — −π/2 puts the body axis vertical: −X (abdomen)
    //                rotates up to +Y, +X (head) rotates down to −Y.
    //
    // Tuning constants below are kept named so they're easy to nudge
    // without touching the rest of the scene.
    const HEAD_FORWARD_TILT = 0.55;
    return (
        <primitive
            object={cloned}
            scale={0.5}
            rotation={[HEAD_FORWARD_TILT, 0, -Math.PI / 2]}
            position={[0, 0, 0]}
        />
    );
}
