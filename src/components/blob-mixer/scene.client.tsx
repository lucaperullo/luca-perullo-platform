"use client";

import { Suspense, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import {
    EffectComposer,
    Bloom,
    ChromaticAberration,
    Vignette,
    ToneMapping,
} from "@react-three/postprocessing";
import { ToneMappingMode, BlendFunction } from "postprocessing";
import * as THREE from "three";
import { Blob } from "./blob";
import { Background } from "./background";
import { DarkStudioEnv } from "./env";
import { BLOB_PRESETS, BLOB_PRESET_BY_ID } from "./presets";
import { cn } from "@/lib/utils";

type BlobMixerSceneProps = {
    /** Compact mode = smaller geometry, no UI overlay, no postprocessing.
     *  Designed for catalog tiles. Default false (full experience). */
    compact?: boolean;
    /** Initial preset id. Default "chrome". */
    initialPreset?: string;
    /** Override container className (height etc.). */
    className?: string;
    /** Disable interaction — hides the rail and stops pointer-driven dent. */
    readOnly?: boolean;
};

/**
 * BlobMixerScene — full R3F port of the blobmixer.14islands experience,
 * adapted for this portfolio's design tokens.
 *
 * Stack:
 *   - <Canvas> + drei <PerspectiveCamera>
 *   - <DarkStudioEnv> bakes a custom PMREM with three accent area lights
 *   - <Background> tinted backdrop sphere that lerps colour per preset
 *   - <Blob> 96/128-subdivision icosphere with onBeforeCompile-injected
 *     simplex noise displacement + analytic normal recomputation, riding
 *     on top of MeshPhysicalMaterial so PBR features (transmission,
 *     iridescence, clearcoat, sheen) all stay correct on the displaced
 *     surface.
 *   - <EffectComposer> with Bloom + ChromaticAberration + Vignette +
 *     ACES tone-mapping. Skipped in compact mode.
 *
 * State model: the active preset id lives in React state. The <Blob> reads
 * the target each frame and lerps every numeric/colour property at
 * ~250 ms half-life — same easing as the original site, no GSAP needed.
 */
export function BlobMixerScene({
    compact = false,
    initialPreset = "chrome",
    className,
    readOnly = false,
}: BlobMixerSceneProps) {
    const [presetId, setPresetId] = useState(initialPreset);
    const active = BLOB_PRESET_BY_ID[presetId] ?? BLOB_PRESETS[0];

    return (
        <div
            className={cn(
                "relative isolate w-full overflow-hidden rounded-[10px]",
                "bg-[#0a0a0c]",
                className,
            )}
        >
            <Canvas
                dpr={[1, compact ? 1.5 : 2]}
                gl={{
                    antialias: true,
                    alpha: false,
                    powerPreference: "high-performance",
                    toneMapping: THREE.ACESFilmicToneMapping,
                    toneMappingExposure: 0.85,
                }}
                style={{ background: "transparent" }}
            >
                <PerspectiveCamera
                    makeDefault
                    fov={compact ? 28 : 32}
                    position={[0, 0, compact ? 4.6 : 4.2]}
                    near={0.1}
                    far={100}
                />
                <Suspense fallback={null}>
                    <DarkStudioEnv />
                    <Background presetId={presetId} />

                    {/* directional fill so reflections still read on flat sides */}
                    <directionalLight position={[3, 4, 2]} intensity={0.45} color="#fff1d6" />
                    <directionalLight position={[-3, -2, -2]} intensity={0.18} color="#8aa6ff" />
                    <directionalLight position={[-2, 3, -4]} intensity={0.25} color="#ff7ad9" />

                    <Blob presetId={presetId} detail={compact ? 64 : 128} />

                    {!compact ? (
                        <EffectComposer multisampling={0}>
                            <BloomTween presetId={presetId} />
                            <ChromaticAberration
                                offset={[0.0008, 0.0008] as unknown as THREE.Vector2}
                                radialModulation={false}
                                modulationOffset={0}
                                blendFunction={BlendFunction.NORMAL}
                            />
                            <Vignette darkness={0.55} offset={0.18} />
                            <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
                        </EffectComposer>
                    ) : null}
                </Suspense>
            </Canvas>

            {!readOnly ? (
                <PresetRail
                    activeId={presetId}
                    onChange={setPresetId}
                    compact={compact}
                />
            ) : null}

            {!compact ? (
                <div className="pointer-events-none absolute bottom-3 left-1/2 z-10 -translate-x-1/2">
                    <div className="rounded-full border border-white/10 bg-black/55 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-white/80 backdrop-blur-md">
                        <span className="text-white/45">preset · </span>
                        {active.name}
                    </div>
                </div>
            ) : null}

            {compact ? (
                <div className="pointer-events-none absolute bottom-2 left-2 z-10">
                    <span className="rounded-sm bg-black/60 px-1.5 py-0.5 font-mono text-[9.5px] uppercase tracking-[0.1em] text-white/85 backdrop-blur-sm">
                        {active.name}
                    </span>
                </div>
            ) : null}
        </div>
    );
}

/* ------------------------------------------------------------------------ */
/*  PresetRail — vertical floating swatch column                            */
/* ------------------------------------------------------------------------ */

function PresetRail({
    activeId,
    onChange,
    compact,
}: {
    activeId: string;
    onChange: (id: string) => void;
    compact: boolean;
}) {
    return (
        <div
            className={cn(
                "absolute z-10 flex flex-col items-stretch overflow-y-auto",
                "rounded-[14px] border border-white/10 bg-black/45 backdrop-blur-md",
                "scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none]",
                compact
                    ? "right-2 top-1/2 -translate-y-1/2 gap-1 p-1.5"
                    : "left-3 top-1/2 -translate-y-1/2 gap-1.5 p-2",
            )}
            style={{ maxHeight: "78%" }}
        >
            {BLOB_PRESETS.map((p) => {
                const isActive = p.id === activeId;
                return (
                    <button
                        key={p.id}
                        type="button"
                        aria-label={p.name}
                        title={p.name}
                        onClick={() => onChange(p.id)}
                        className={cn(
                            "group relative shrink-0 rounded-[10px] border transition-transform duration-300",
                            "hover:scale-110",
                            compact ? "h-6 w-6" : "h-9 w-9",
                            isActive
                                ? "border-white shadow-[0_0_0_1px_rgba(255,255,255,0.6),0_8px_24px_rgba(255,255,255,0.18)]"
                                : "border-white/15",
                        )}
                        style={{ background: p.swatch }}
                    >
                        {!compact ? (
                            <span
                                className={cn(
                                    "pointer-events-none absolute left-[calc(100%+10px)] top-1/2 -translate-y-1/2 -translate-x-1.5",
                                    "whitespace-nowrap rounded-md border border-white/10 bg-black/85 px-2 py-1",
                                    "font-mono text-[10px] uppercase tracking-[0.08em] text-white",
                                    "opacity-0 transition-all duration-200",
                                    "group-hover:translate-x-0 group-hover:opacity-100",
                                )}
                            >
                                {p.name}
                            </span>
                        ) : null}
                    </button>
                );
            })}
        </div>
    );
}

/* ------------------------------------------------------------------------ */
/*  BloomTween — animates UnrealBloom strength toward the active preset's   */
/*  target value each frame, with the same easing as Blob's other lerps.    */
/* ------------------------------------------------------------------------ */

function BloomTween({ presetId }: { presetId: string }) {
    const effectRef = useRef<{ intensity: number } | null>(null);

    useFrame((_state, dt) => {
        if (!effectRef.current) return;
        const target = BLOB_PRESET_BY_ID[presetId]?.bloom ?? 0.32;
        const k = 1 - Math.exp(-dt * 4.5);
        effectRef.current.intensity =
            effectRef.current.intensity + (target - effectRef.current.intensity) * k;
    });

    return (
        <Bloom
            ref={effectRef as unknown as React.Ref<unknown>}
            intensity={0.32}
            luminanceThreshold={0.55}
            luminanceSmoothing={0.45}
            mipmapBlur
        />
    );
}

