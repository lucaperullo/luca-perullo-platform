"use client";

import { useEffect, useRef } from "react";
import { useScrollProgress } from "./use-scroll-progress";
import { cn } from "@/lib/utils";

export type SideLinesProps = {
    side: "left" | "right";
    /** Min viewport width for showing the line. Default 1024 (lg). */
    minViewportPx?: number;
    /** Width of the centred content column in px. Default 672. */
    contentColumnPx?: number;
    /** Inset from the inner content edge. Default 16. */
    contentInsetPx?: number;
    /** Pixels of scroll over which the progress fill goes 0 → 1. Default 3000. */
    scrollPatternRangePx?: number;
    /** Show a scroll-progress fill that grows from the top. Default true. */
    showProgress?: boolean;
    className?: string;
};

/**
 * Minimal vertical hairline per page gutter.
 *
 *   - Hidden below `lg` (no gutter to draw into).
 *   - One 1px line, centred in the gutter, with mask-fade at the top + bottom.
 *   - Optional scroll-progress overlay: a darker line that grows from the
 *     top as the user descends the page. Off by default — set `showProgress`
 *     to enable.
 *   - Theme-aware via `bg-border` / `bg-fg`.
 *   - Pure CSS for the static line; one tiny effect for the progress fill.
 */
export function SideLines({
    side,
    minViewportPx = 1024,
    contentColumnPx = 672,
    contentInsetPx = 16,
    scrollPatternRangePx = 3000,
    showProgress = true,
    className,
}: SideLinesProps) {
    const scrollProgress = useScrollProgress(scrollPatternRangePx);
    const fillRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!showProgress) return;
        if (typeof window === "undefined") return;
        let frame = 0;
        const tick = () => {
            const el = fillRef.current;
            if (el) el.style.transform = `scaleY(${scrollProgress.current})`;
            frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frame);
    }, [scrollProgress, showProgress]);

    const gutterWidthExpr =
        `max(0px, calc((100vw - ${contentColumnPx}px) / 2 - ${contentInsetPx}px))`;

    return (
        <aside
            aria-hidden
            data-spider-anchor="vertical-line"
            className={cn(
                "pointer-events-none fixed top-0 z-0 hidden h-screen select-none lg:block",
                side === "left" ? "left-0" : "right-0",
                className,
            )}
            style={{ width: gutterWidthExpr }}
        >
            {/* Single hairline, centred in the gutter, faded at the ends. */}
            <div
                className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-border"
                style={{
                    WebkitMaskImage:
                        "linear-gradient(to bottom, transparent, black 12%, black 88%, transparent)",
                    maskImage:
                        "linear-gradient(to bottom, transparent, black 12%, black 88%, transparent)",
                }}
            >
                {showProgress ? (
                    <div
                        ref={fillRef}
                        className="absolute inset-0 origin-top bg-fg/40"
                        style={{ transform: "scaleY(0)" }}
                    />
                ) : null}
            </div>
        </aside>
    );
}
