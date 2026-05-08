"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { MutableRefObject } from "react";
import type { PointerNDC } from "./use-pointer-tracker";

export type BrutalistTowerProps = {
    pointer: MutableRefObject<PointerNDC>;
    /** Position-based scroll 0..1 — drives the tower's rotation & parallax. */
    scrollProgress: MutableRefObject<number>;
    theme: "light" | "dark";
    /** Mirror the tower across X for the right-column instance. */
    mirror?: boolean;
};

/**
 * Vertical tower of brutalist concrete blocks — one per page side gutter.
 *
 *  - Real geometry, real lighting, real shadows. Not point sprites.
 *  - Nine boxes stacked along Y with varied proportions (Donald Judd's
 *    serial sculpture, not a uniform pattern).
 *  - Each block rotates on its own Y axis at a unique rate. Scroll
 *    progress feeds an additional shared rotation, so the whole tower
 *    *turns* as you scroll.
 *  - Per-block parallax: alternating direction Y-drift on scroll, so the
 *    column "breaks formation" subtly at extremes of scroll.
 *  - One accent block per tower (the brand's signal colour, desaturated).
 *  - Pointer = tower group leans gently toward cursor (~3°). Soft.
 *  - Single key directional light + cool fill from below + low ambient.
 *    MeshStandardMaterial with high roughness for a matte concrete read.
 */
export function BrutalistTower({
    pointer,
    scrollProgress,
    theme,
    mirror = false,
}: BrutalistTowerProps) {
    const groupRef = useRef<THREE.Group | null>(null);
    const blockRefs = useRef<(THREE.Mesh | null)[]>([]);

    /** Block layout — built once. Each entry is a discrete sculpture
     *  decision: dimensions, base position, base rotation rate, accent flag,
     *  scroll parallax direction. Total 9 blocks per tower. */
    const blocks = useMemo<BlockSpec[]>(() => {
        return [
            // Top → bottom. Mixed proportions, accent near the upper-mid.
            { y: 12,  size: [1.0, 1.0, 1.0], rotRate: 0.07, parallax:  1.2, accent: false },
            { y: 9,   size: [1.6, 0.45, 1.2], rotRate: 0.10, parallax: -0.8, accent: false },
            { y: 6,   size: [0.55, 1.8, 0.55], rotRate: 0.05, parallax:  1.0, accent: false },
            { y: 3,   size: [1.1, 1.1, 1.1], rotRate: 0.13, parallax: -1.4, accent: true  },
            { y: 0,   size: [1.8, 0.55, 1.4], rotRate: 0.06, parallax:  0.9, accent: false },
            { y: -3,  size: [0.6, 1.4, 0.6], rotRate: 0.11, parallax: -1.1, accent: false },
            { y: -6,  size: [1.2, 0.7, 1.0], rotRate: 0.08, parallax:  1.3, accent: false },
            { y: -9,  size: [0.7, 0.7, 0.7], rotRate: 0.14, parallax: -0.7, accent: false },
            { y: -12, size: [1.4, 0.5, 1.0], rotRate: 0.09, parallax:  1.0, accent: false },
        ];
    }, []);

    /** Theme-aware materials — recreated only when theme flips. */
    const materials = useMemo(() => {
        const concrete = new THREE.MeshStandardMaterial({
            color: theme === "dark" ? "#27272a" : "#52525b",  // zinc-800 / zinc-600
            roughness: 0.95,
            metalness: 0,
            flatShading: false,
        });
        const accent = new THREE.MeshStandardMaterial({
            color: theme === "dark" ? "#0ea5e9" : "#0284c7",  // sky-500 / sky-600
            roughness: 0.65,
            metalness: 0.05,
            flatShading: false,
        });
        return { concrete, accent };
    }, [theme]);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        const sp = scrollProgress.current;
        const p = pointer.current;

        // Scroll-driven shared rotation amount.
        const scrollRot = sp * Math.PI * 1.5 * (mirror ? -1 : 1);

        // Per-block updates.
        for (let i = 0; i < blocks.length; i++) {
            const block = blocks[i];
            const mesh = blockRefs.current[i];
            if (!mesh) continue;
            // Each block has its own rotation rate on Y, plus the shared
            // scroll-driven offset, plus a tiny phase from index for
            // per-block tilt on X (subtle, gives the tower personality).
            mesh.rotation.y = t * block.rotRate + scrollRot;
            mesh.rotation.x = Math.sin(t * 0.15 + i * 0.4) * 0.08;
            mesh.position.y = block.y + sp * block.parallax;
        }

        // Soft pointer tilt of the whole group — max ~5° on each axis.
        if (groupRef.current) {
            const targetY = p.active ? p.x * 0.18 * (mirror ? -1 : 1) : 0;
            const targetX = p.active ? -p.y * 0.12 : 0;
            // Lerp toward target — slow, premium feel.
            groupRef.current.rotation.y += (targetY - groupRef.current.rotation.y) * 0.04;
            groupRef.current.rotation.x += (targetX - groupRef.current.rotation.x) * 0.04;
        }
    });

    return (
        <>
            {/* Lighting: one strong key from upper-left, cool fill from below. */}
            <ambientLight intensity={theme === "dark" ? 0.25 : 0.55} />
            <directionalLight
                position={[-4, 6, 5]}
                intensity={theme === "dark" ? 1.1 : 1.6}
                color={theme === "dark" ? "#fafafa" : "#ffffff"}
            />
            <directionalLight
                position={[3, -2, 3]}
                intensity={theme === "dark" ? 0.25 : 0.45}
                color={theme === "dark" ? "#94a3b8" : "#dbeafe"}
            />

            <group ref={groupRef}>
                {blocks.map((block, i) => (
                    <mesh
                        key={i}
                        ref={(el) => {
                            blockRefs.current[i] = el;
                        }}
                        position={[0, block.y, 0]}
                        material={block.accent ? materials.accent : materials.concrete}
                    >
                        <boxGeometry args={block.size} />
                    </mesh>
                ))}
            </group>
        </>
    );
}

type BlockSpec = {
    y: number;
    size: [number, number, number];
    rotRate: number;
    parallax: number;
    accent: boolean;
};
