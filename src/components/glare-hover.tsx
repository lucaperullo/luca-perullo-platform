"use client";

import {
    useCallback,
    useRef,
    type CSSProperties,
    type PointerEvent,
    type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

export type GlareHoverProps = {
    children: ReactNode;
    className?: string;
    /** Peak opacity of the glare highlight. Default 0.18. */
    glareOpacity?: number;
    /** Glare highlight color. Default white. */
    glareColor?: string;
    /** Glare diameter in px. Default 250. */
    glareSize?: number;
    /** If true, glare sweeps once on enter then waits for re-entry. */
    playOnce?: boolean;
};

/**
 * <GlareHover/> — card whose surface shows a glossy diagonal highlight
 * tracking the cursor. Hover-only, gated to fine pointers, so touch
 * devices stay still.
 */
export function GlareHover({
    children,
    className,
    glareOpacity = 0.18,
    glareColor = "rgba(255,255,255,1)",
    glareSize = 250,
    playOnce = false,
}: GlareHoverProps) {
    const ref = useRef<HTMLDivElement | null>(null);

    const onMove = useCallback((event: PointerEvent<HTMLDivElement>) => {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        el.style.setProperty("--gx", `${event.clientX - rect.left}px`);
        el.style.setProperty("--gy", `${event.clientY - rect.top}px`);
    }, []);

    const onEnter = useCallback(() => {
        const el = ref.current;
        if (!el || !playOnce) return;
        el.classList.remove("glare-once-played");
        // restart animation
        void el.offsetWidth;
        el.classList.add("glare-once-played");
    }, [playOnce]);

    const onLeave = useCallback(() => {
        const el = ref.current;
        if (!el) return;
        el.style.setProperty("--gx", `-9999px`);
        el.style.setProperty("--gy", `-9999px`);
    }, []);

    const baseStyle = {
        "--glare-size": `${glareSize}px`,
        "--glare-opacity": glareOpacity,
        "--glare-color": glareColor,
    } as CSSProperties;

    return (
        <>
            <style>{`
                @media (hover: hover) and (pointer: fine) {
                    .glare-hover-shell:hover .glare-hover-spot { opacity: var(--glare-opacity); }
                    .glare-hover-shell.glare-once-played .glare-hover-spot {
                        animation: glare-sweep 900ms var(--ease-out) 1;
                    }
                }
                @keyframes glare-sweep {
                    0%   { opacity: 0; }
                    50%  { opacity: var(--glare-opacity); }
                    100% { opacity: 0; }
                }
            `}</style>
            <div
                ref={ref}
                style={baseStyle}
                onPointerMove={onMove}
                onPointerEnter={onEnter}
                onPointerLeave={onLeave}
                className={cn(
                    "glare-hover-shell relative isolate overflow-hidden rounded-md border border-border bg-bg-alt",
                    className,
                )}
            >
                <span
                    aria-hidden
                    className="glare-hover-spot pointer-events-none absolute inset-0 transition-opacity duration-200"
                    style={{
                        background:
                            "radial-gradient(var(--glare-size) circle at var(--gx, -9999px) var(--gy, -9999px), var(--glare-color), transparent 60%)",
                        opacity: 0,
                        mixBlendMode: "overlay",
                    }}
                />
                <div className="relative">{children}</div>
            </div>
        </>
    );
}
