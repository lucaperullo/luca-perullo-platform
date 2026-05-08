"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
    Environment,
    ContactShadows,
    Float,
    useGLTF,
    PerspectiveCamera,
} from "@react-three/drei";
import * as THREE from "three";
import { usePointerTracker } from "./use-pointer-tracker";
import { useScrollProgress } from "./use-scroll-progress";
import { useReducedMotion } from "./use-reduced-motion";
import { useThemeClass } from "./use-theme-class";
import { cn } from "@/lib/utils";

export type SideSceneProps = {
    side: "left" | "right";
    /** Path to a .gltf or .glb relative to /public. */
    modelUrl: string;
    /** Uniform scale applied to the model. Default 5.5 — sized to fill the
     *  gutter visibly, since the gutter is narrow and a small object reads
     *  as decoration noise. */
    scale?: number;
    /** Y offset applied to the model. Most Poly Haven CC0 assets are anchored
     *  with their base at y=0, so a slight negative offset (-1.2 to -1.6)
     *  lifts them into the centre of the gutter. */
    yOffset?: number;
    /** drei HDRI preset for environment lighting. */
    environmentPreset?:
        | "apartment"
        | "city"
        | "dawn"
        | "forest"
        | "lobby"
        | "night"
        | "park"
        | "studio"
        | "sunset"
        | "warehouse";
    minViewportPx?: number;
    contentColumnPx?: number;
    contentInsetPx?: number;
    scrollPatternRangePx?: number;
    /** Camera FOV. Default 30 — relatively narrow so the model "fills" the
     *  frame without distorted edge perspective. */
    fov?: number;
    /** Camera Z. Default 5 — closer than the previous multi-item layout
     *  so a single asset reads big in the gutter. */
    cameraZ?: number;
    className?: string;
};

/**
 * One CC0 GLTF asset, centred in the gutter, big enough to actually read.
 *
 *   - Single asset, no swapping. The scroll motion is the rotation, not a
 *     carousel between items — that crossfade had no narrative weight and
 *     made the gutter feel busy.
 *   - drei <Environment preset="studio"> for HDR-based lighting (no asset
 *     download — built into drei).
 *   - drei <ContactShadows> for grounding without a ground plane.
 *   - drei <Float> for a slow bob (skipped under prefers-reduced-motion).
 *   - Pointer = soft column tilt (~8° max), lerped slowly.
 *   - Scroll progress = primary Y rotation, 1 full revolution per pageScroll.
 *   - prefers-reduced-motion → Float speed 0, scroll rotation still active.
 */
export function SideScene({
    side,
    modelUrl,
    scale = 5.5,
    yOffset = -1.4,
    environmentPreset = "studio",
    minViewportPx = 1024,
    contentColumnPx = 672,
    contentInsetPx = 16,
    scrollPatternRangePx = 2400,
    fov = 30,
    cameraZ = 5,
    className,
}: SideSceneProps) {
    const pointer = usePointerTracker();
    const scrollProgress = useScrollProgress(scrollPatternRangePx);
    const theme = useThemeClass();
    const [shouldRender, setShouldRender] = useState(false);
    const reducedMotion = useReducedMotion();

    useEffect(() => {
        if (typeof window === "undefined") return;
        const wideMq = window.matchMedia(`(min-width: ${minViewportPx}px)`);
        const update = () => {
            setShouldRender(wideMq.matches);
        };
        update();
        wideMq.addEventListener("change", update);
        return () => {
            wideMq.removeEventListener("change", update);
        };
    }, [minViewportPx]);

    if (!shouldRender) return null;

    const gutterWidthExpr =
        `max(0px, calc((100vw - ${contentColumnPx}px) / 2 - ${contentInsetPx}px))`;

    return (
        <aside
            aria-hidden
            className={cn(
                "pointer-events-none fixed top-0 z-0 hidden h-screen select-none lg:block",
                side === "left" ? "left-0" : "right-0",
                className,
            )}
            style={{ width: gutterWidthExpr }}
        >
            <Canvas
                dpr={[1, 2]}
                gl={{
                    antialias: true,
                    alpha: true,
                    powerPreference: "high-performance",
                    toneMapping: THREE.ACESFilmicToneMapping,
                    toneMappingExposure: theme === "dark" ? 0.85 : 1,
                }}
                style={{ background: "transparent" }}
            >
                <PerspectiveCamera makeDefault fov={fov} position={[0, 0, cameraZ]} near={0.1} far={50} />
                <Suspense fallback={null}>
                    <Environment preset={environmentPreset} />

                    <PointerTilt pointer={pointer} mirror={side === "right"}>
                        <Float
                            speed={reducedMotion ? 0 : 0.9}
                            rotationIntensity={0.18}
                            floatIntensity={0.4}
                        >
                            <ScrollRotated
                                scrollProgress={scrollProgress}
                                mirror={side === "right"}
                            >
                                <Model url={modelUrl} scale={scale} yOffset={yOffset} />
                            </ScrollRotated>
                        </Float>
                    </PointerTilt>

                    <ContactShadows
                        position={[0, -1.7 + yOffset, 0]}
                        opacity={theme === "dark" ? 0.55 : 0.4}
                        scale={5}
                        blur={2.6}
                        far={3}
                    />
                </Suspense>
            </Canvas>
        </aside>
    );
}

function ScrollRotated({
    scrollProgress,
    mirror,
    children,
}: {
    scrollProgress: ReturnType<typeof useScrollProgress>;
    mirror: boolean;
    children: React.ReactNode;
}) {
    const ref = useRef<THREE.Group | null>(null);
    const sign = mirror ? -1 : 1;
    useFrame((state) => {
        if (!ref.current) return;
        const t = state.clock.getElapsedTime();
        const sp = scrollProgress.current;
        // 1 full revolution per pageScroll + a sliver of time-based drift
        // so the asset never freezes when scroll is stationary.
        const target = sp * Math.PI * 2 * sign + t * 0.05 * sign;
        ref.current.rotation.y += (target - ref.current.rotation.y) * 0.06;
    });
    return <group ref={ref}>{children}</group>;
}

function PointerTilt({
    pointer,
    mirror,
    children,
}: {
    pointer: ReturnType<typeof usePointerTracker>;
    mirror: boolean;
    children: React.ReactNode;
}) {
    const ref = useRef<THREE.Group | null>(null);
    const sign = mirror ? -1 : 1;
    useFrame(() => {
        if (!ref.current) return;
        const p = pointer.current;
        const targetY = p.active ? p.x * 0.16 * sign : 0;
        const targetX = p.active ? -p.y * 0.10 : 0;
        ref.current.rotation.y += (targetY - ref.current.rotation.y) * 0.05;
        ref.current.rotation.x += (targetX - ref.current.rotation.x) * 0.05;
    });
    return <group ref={ref}>{children}</group>;
}

function Model({ url, scale, yOffset }: { url: string; scale: number; yOffset: number }) {
    const { scene } = useGLTF(url);
    return <primitive object={scene} scale={scale} position={[0, yOffset, 0]} />;
}

SideScene.preload = (url: string) => useGLTF.preload(url);
