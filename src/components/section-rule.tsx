"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { prefersReducedMotion } from "./use-reduced-motion";

export type SectionRuleProps = {
    className?: string;
    /** Where the line is "complete" relative to viewport height (0 = top, 1 = bottom). Default 0.35. */
    completeAt?: number;
    /** Where the line "starts" forming relative to viewport height. Default 0.85. */
    startAt?: number;
};

/**
 * Horizontal hairline that "closes" each section as the user scrolls.
 *
 *   - 1px line, full container width.
 *   - `transform-origin: center` — grows symmetrically from the middle outward.
 *   - scaleX is driven by scroll position relative to the rule's own rect:
 *     0 when rect is near bottom of viewport (`startAt`), 1 when it crosses
 *     `completeAt`. Mapping uses ease-out so the closing has weight at the end.
 *   - rAF loop is gated by IntersectionObserver — only ticks while the rule
 *     (plus a generous viewport-sized rootMargin) is on screen.
 *   - Theme-aware via `bg-border-strong`. No layout cost: uses `transform` only.
 *
 * The section "closes" because the line is a divider — by the time you're
 * past it, the line is fully drawn, sealing the section above.
 */
export function SectionRule({
    className,
    completeAt = 0.35,
    startAt = 0.85,
}: SectionRuleProps) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const fillRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const container = containerRef.current;
        const fill = fillRef.current;
        if (!container || !fill) return;

        if (prefersReducedMotion()) {
            fill.style.transform = "scaleX(1)";
            return;
        }

        let rafId = 0;
        let running = false;

        const tick = () => {
            const rect = container.getBoundingClientRect();
            const vh = window.innerHeight || 1;
            const startY = vh * startAt;
            const endY = vh * completeAt;
            const range = startY - endY;
            const raw = range > 0 ? (startY - rect.top) / range : 1;
            const clamped = Math.max(0, Math.min(1, raw));
            // Strong ease-out — the closing has weight at the end.
            const eased = 1 - Math.pow(1 - clamped, 3);
            fill.style.transform = `scaleX(${eased})`;
            rafId = requestAnimationFrame(tick);
        };

        const start = () => {
            if (running) return;
            running = true;
            rafId = requestAnimationFrame(tick);
        };
        const stop = () => {
            running = false;
            if (rafId) cancelAnimationFrame(rafId);
            rafId = 0;
        };

        const io = new IntersectionObserver(
            (entries) => {
                for (const e of entries) {
                    if (e.isIntersecting) start();
                    else stop();
                }
            },
            { rootMargin: "100% 0px 100% 0px" },
        );
        io.observe(container);

        return () => {
            io.disconnect();
            stop();
        };
    }, [completeAt, startAt]);

    return (
        <div
            ref={containerRef}
            role="separator"
            aria-hidden
            data-spider-anchor="horizontal-line"
            className={cn("relative my-2 h-px w-full", className)}
        >
            {/* Full-viewport-width track — centred via left-1/2 + translate-x-1/2,
                so the line meets the vertical SideLines on both gutters. */}
            <div
                className="pointer-events-none absolute left-1/2 top-0 h-px -translate-x-1/2"
                style={{ width: "100vw" }}
            >
                <div
                    ref={fillRef}
                    className="h-full w-full origin-center bg-border-strong"
                    style={{ transform: "scaleX(0)" }}
                />
            </div>
        </div>
    );
}
