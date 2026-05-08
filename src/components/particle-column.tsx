"use client";

import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { BrutalistTower } from "./brutalist-tower";
import { usePointerTracker } from "./use-pointer-tracker";
import { useScrollProgress } from "./use-scroll-progress";
import { useReducedMotion } from "./use-reduced-motion";
import { useThemeClass } from "./use-theme-class";
import { cn } from "@/lib/utils";

export type ParticleColumnProps = {
    /** Which side of the centred content column the tower lives in. */
    side: "left" | "right";
    /** Min viewport width for showing the column. Default 1024 (lg). */
    minViewportPx?: number;
    /** Width of the centred content column in px. Default 672. */
    contentColumnPx?: number;
    /** Inset from the inner content edge. Default 16. */
    contentInsetPx?: number;
    /** Pixels of scroll over which scrollProgress goes 0 → 1. Default 3000. */
    scrollPatternRangePx?: number;
    className?: string;
};

/**
 * Side-column 3D scene host. Mounts a BrutalistTower inside an R3F canvas
 * pinned to the page gutter. Decorative — `aria-hidden`, `pointer-events: none`.
 *
 *   - Hidden below `lg` (no room).
 *   - Hidden under `prefers-reduced-motion`.
 *   - Tracks `.dark` class on <html> via MutationObserver; passes `theme`
 *     into the tower so its materials swap immediately on toggle.
 */
export function ParticleColumn({
    side,
    minViewportPx = 1024,
    contentColumnPx = 672,
    contentInsetPx = 16,
    scrollPatternRangePx = 3000,
    className,
}: ParticleColumnProps) {
    const pointer = usePointerTracker();
    const scrollProgress = useScrollProgress(scrollPatternRangePx);
    const theme = useThemeClass();
    const [wideEnough, setWideEnough] = useState(false);
    const reducedMotion = useReducedMotion();

    /** Gate: viewport width. */
    useEffect(() => {
        if (typeof window === "undefined") return;
        const wideMq = window.matchMedia(`(min-width: ${minViewportPx}px)`);
        const update = () => {
            setWideEnough(wideMq.matches);
        };
        update();
        wideMq.addEventListener("change", update);
        return () => {
            wideMq.removeEventListener("change", update);
        };
    }, [minViewportPx]);

    if (!wideEnough || reducedMotion) return null;

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
                camera={{ fov: 35, position: [0, 0, 22], near: 0.1, far: 100 }}
                dpr={[1, 2]}
                gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
                style={{ background: "transparent" }}
            >
                <BrutalistTower
                    pointer={pointer}
                    scrollProgress={scrollProgress}
                    theme={theme}
                    mirror={side === "right"}
                />
            </Canvas>
        </aside>
    );
}
