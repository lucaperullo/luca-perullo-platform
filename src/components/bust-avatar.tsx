"use client";

import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
    Environment,
    Float,
    useGLTF,
    PerspectiveCamera,
} from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import { usePointerTracker } from "./use-pointer-tracker";
import { useScrollProgress } from "./use-scroll-progress";
import { useReducedMotion } from "./use-reduced-motion";
import { useThemeClass } from "./use-theme-class";
import { cn } from "@/lib/utils";

export type BustAvatarProps = {
    modelUrl?: string;
    /** Path to a real .hdr file for ultra-HD reflections. Default uses
     *  Poly Haven's `studio_small_09` 1K HDR (1.5 MB). */
    hdriUrl?: string;
    /** envMapIntensity multiplier applied to the bust's marble material.
     *  Default 1.7 — reflections sing without blowing out. */
    envIntensity?: number;
    className?: string;
};

/**
 * Marble bust avatar with photo-studio HDR lighting + ultra-HD reflections.
 *
 * Pipeline:
 *   1. drei <Environment files={hdriUrl}> loads a real Poly Haven HDR
 *      (vs the lower-res baked drei presets) — sharper highlights, more
 *      accurate reflections on the marble surface.
 *   2. After GLTF load, traverse and bump every MeshStandardMaterial's
 *      envMapIntensity. The HDR's contribution to the diffuse + specular
 *      goes 1.7× louder, which is what makes marble feel like *marble*.
 *   3. Add a soft key-light directional + a cool fill, on top of the HDR.
 *      Sculpts the form a bit more than the HDR alone.
 *   4. <EffectComposer><Bloom/></EffectComposer> for glow on the bright
 *      reflective spots — only kicks above luminanceThreshold so it
 *      doesn't wash out the rest.
 *   5. ACES filmic tone mapping (already on canvas) gives that cinematic
 *      contrast curve photo studios shoot for.
 *
 * The bust stays *contained* in the circular avatar frame — overflow
 * hidden + rounded full + 4-px border, all unchanged.
 */
export function BustAvatar({
    modelUrl = "/3d/marble_bust_01/marble_bust_01_1k.gltf",
    hdriUrl = "/3d/hdri/studio_small_09_1k.hdr",
    envIntensity = 1.7,
    className,
}: BustAvatarProps) {
    const pointer = usePointerTracker();
    const scrollProgress = useScrollProgress(2400);
    const theme = useThemeClass();
    const reducedMotion = useReducedMotion();

    return (
        <div
            className={cn(
                "relative h-24 w-24 overflow-hidden rounded-full border-4 border-bg bg-bg-alt sm:h-28 sm:w-28",
                className,
            )}
        >
            <Canvas
                dpr={[1, 2]}
                gl={{
                    antialias: true,
                    alpha: true,
                    powerPreference: "high-performance",
                    toneMapping: THREE.ACESFilmicToneMapping,
                    toneMappingExposure: theme === "dark" ? 0.95 : 1.05,
                }}
                style={{ background: "transparent" }}
            >
                <PerspectiveCamera
                    makeDefault
                    fov={25}
                    position={[0, 0, 4.4]}
                    near={0.1}
                    far={50}
                />
                <Suspense fallback={null}>
                    {/* Real Poly Haven HDR — sharp reflections vs preset. */}
                    <Environment
                        files={hdriUrl}
                        background={false}
                        environmentIntensity={1}
                    />

                    {/* Soft key-light from upper-left + cool fill below.
                        Sculpts depth on top of the HDR contribution. */}
                    <directionalLight
                        position={[-2.5, 3, 4]}
                        intensity={theme === "dark" ? 0.55 : 0.7}
                        color="#ffffff"
                    />
                    <directionalLight
                        position={[2, -1.2, 2.5]}
                        intensity={theme === "dark" ? 0.18 : 0.25}
                        color="#cbd5e1"
                    />

                    <PointerTilt pointer={pointer}>
                        <Float
                            speed={reducedMotion ? 0 : 0.85}
                            rotationIntensity={0.18}
                            floatIntensity={0.3}
                        >
                            <ScrollRotated scrollProgress={scrollProgress}>
                                <Bust url={modelUrl} envIntensity={envIntensity} />
                            </ScrollRotated>
                        </Float>
                    </PointerTilt>

                    {/* Bloom on the brightest reflection peaks only. */}
                    <EffectComposer multisampling={0}>
                        <Bloom
                            intensity={0.45}
                            luminanceThreshold={0.78}
                            luminanceSmoothing={0.4}
                            mipmapBlur
                        />
                    </EffectComposer>
                </Suspense>
            </Canvas>
        </div>
    );
}

function ScrollRotated({
    scrollProgress,
    children,
}: {
    scrollProgress: ReturnType<typeof useScrollProgress>;
    children: React.ReactNode;
}) {
    const ref = useRef<THREE.Group | null>(null);
    useFrame((state) => {
        if (!ref.current) return;
        const sp = scrollProgress.current;
        const t = state.clock.getElapsedTime();
        const target = sp * Math.PI + t * 0.04;
        ref.current.rotation.y += (target - ref.current.rotation.y) * 0.05;
    });
    return <group ref={ref}>{children}</group>;
}

function PointerTilt({
    pointer,
    children,
}: {
    pointer: ReturnType<typeof usePointerTracker>;
    children: React.ReactNode;
}) {
    const ref = useRef<THREE.Group | null>(null);
    useFrame(() => {
        if (!ref.current) return;
        const p = pointer.current;
        const targetY = p.active ? p.x * 0.18 : 0;
        const targetX = p.active ? -p.y * 0.10 : 0;
        ref.current.rotation.y += (targetY - ref.current.rotation.y) * 0.06;
        ref.current.rotation.x += (targetX - ref.current.rotation.x) * 0.06;
    });
    return <group ref={ref}>{children}</group>;
}

/**
 * Loads the GLTF and bumps every material's envMapIntensity, so the
 * HDR's contribution to specular highlights and diffuse colour bleed
 * is amplified — what makes the marble actually look like marble.
 */
function Bust({ url, envIntensity }: { url: string; envIntensity: number }) {
    const { scene } = useGLTF(url);

    // Apply envMapIntensity bump once per scene/material change.
    useMemo(() => {
        scene.traverse((obj) => {
            const mesh = obj as THREE.Mesh;
            if (!mesh.isMesh || !mesh.material) return;
            const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
            for (const m of mats) {
                const std = m as THREE.MeshStandardMaterial;
                if ("envMapIntensity" in std) {
                    std.envMapIntensity = envIntensity;
                    std.needsUpdate = true;
                }
            }
        });
    }, [scene, envIntensity]);

    return <primitive object={scene} scale={6.2} position={[0, -1.9, 0]} />;
}

BustAvatar.preload = (url: string) => useGLTF.preload(url);
