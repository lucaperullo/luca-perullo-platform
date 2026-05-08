"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { prefersReducedMotion } from "./use-reduced-motion";

export type ParallaxLaneProps = {
    /**
     * Multiplier applied to scrollY (px) to produce the lane's translateY.
     * Use small values (~0.02–0.07). Negative values move opposite to scroll.
     */
    multiplier?: number;
    /**
     * Maximum absolute translation in pixels — clamped so we never exceed
     * the slack space wrapping the lane. Default 110.
     */
    maxOffsetPx?: number;
    /**
     * Vertical slack as a percentage of the lane height. The inner translates
     * within this slack — set on both sides of the wrapper as `inset-y` extra
     * space. Default 20 (so inner = 140% of outer height).
     */
    slackPct?: number;
    children: ReactNode;
    className?: string;
};

/**
 * Wraps a marquee lane with a small scroll-tied parallax translation.
 *
 * Motion notes (Emil playbook):
 *  - Scroll is rAF-throttled with a single requestAnimationFrame cycle —
 *    no work happens between frames if the user isn't scrolling.
 *  - We write `transform` directly to the element (not a CSS variable) so
 *    siblings don't recompute styles. Only this node's compositor layer
 *    moves — true GPU work.
 *  - The lane has slack (default 20%) above and below it, so the parallax
 *    translation never exposes empty space at the gutter edges.
 *  - The translation uses a tanh asymptote, not a clamp: linear-ish at
 *    small scrollY, smoothly approaching ±maxOffsetPx as scrollY grows.
 *    No snap at the boundary, no "stuck" feel on very long pages.
 *  - `prefers-reduced-motion` users get no parallax — the marquee itself
 *    is also collapsed by the global rule.
 */
export function ParallaxLane({
    multiplier = 0.04,
    maxOffsetPx = 110,
    slackPct = 20,
    children,
    className,
}: ParallaxLaneProps) {
    const innerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (typeof window === "undefined") return;

        if (prefersReducedMotion()) {
            return;
        }

        let frame = 0;
        let scheduled = false;

        const apply = () => {
            scheduled = false;
            const el = innerRef.current;
            if (!el) return;
            // tanh asymptote: linear-ish at small scrollY, smoothly approaches
            // ±maxOffsetPx as scrollY grows. No snap at the boundary.
            const raw = window.scrollY * multiplier;
            const y = Math.tanh(raw / maxOffsetPx) * maxOffsetPx;
            el.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0)`;
        };

        const onScroll = () => {
            if (scheduled) return;
            scheduled = true;
            frame = requestAnimationFrame(apply);
        };

        // Apply once on mount in case the page loaded already-scrolled.
        apply();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => {
            window.removeEventListener("scroll", onScroll);
            if (frame) cancelAnimationFrame(frame);
        };
    }, [multiplier, maxOffsetPx]);

    // The outer crops slack; the inner is taller than outer by 2× slackPct
    // and centred (inset-y: -slackPct%).
    const insetY = `-${slackPct}%`;

    return (
        <div className={cn("relative h-full overflow-hidden", className)}>
            <div
                ref={innerRef}
                className="absolute inset-x-0 will-change-transform"
                style={{
                    top: insetY,
                    bottom: insetY,
                    transform: "translate3d(0, 0, 0)",
                }}
            >
                {children}
            </div>
        </div>
    );
}
