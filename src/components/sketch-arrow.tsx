"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type SketchArrowDirection =
    | "right"
    | "down"
    | "left"
    | "up"
    | "down-right"
    | "down-left"
    | "up-right"
    | "up-left";

export type SketchArrowProps = {
    /** Where the arrow points. Default "right". */
    direction?: SketchArrowDirection;
    /** Tone of the stroke. Defaults to "fg". */
    tone?: "fg" | "muted" | "accent";
    /** Width of the box in px. Height auto-derives from the viewBox. */
    width?: number;
    /** Animation duration in ms. Default 700. */
    durationMs?: number;
    /** When true (default), animates only when in view. */
    onView?: boolean;
    className?: string;
};

const TONE: Record<NonNullable<SketchArrowProps["tone"]>, string> = {
    fg: "text-fg",
    muted: "text-fg-muted",
    accent: "text-accent",
};

const ROT: Record<SketchArrowDirection, number> = {
    right: 0,
    "down-right": 35,
    down: 90,
    "down-left": 145,
    left: 180,
    "up-left": 215,
    up: 270,
    "up-right": 325,
};

/**
 * Hand-drawn arrow used as an editorial pointer.
 *
 * Motion notes (Emil playbook):
 *  - Two paths (shaft + head) animate sequentially so it reads as a
 *    real drawing being made, not a single solid stroke appearing.
 *  - Easing: --ease-out for the shaft (responsive feel), then a tiny
 *    delay before the head — asymmetric timing keeps it feeling alive.
 *  - prefers-reduced-motion: collapses to instant via globals.css.
 */
export function SketchArrow({
    direction = "right",
    tone = "fg",
    width = 88,
    durationMs = 700,
    onView = true,
    className,
}: SketchArrowProps) {
    const containerRef = useRef<HTMLSpanElement | null>(null);
    const [drawn, setDrawn] = useState(!onView);

    useEffect(() => {
        if (!onView || drawn || !containerRef.current) return;
        const node = containerRef.current;
        const io = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        setDrawn(true);
                        io.disconnect();
                        break;
                    }
                }
            },
            { threshold: 0.6 },
        );
        io.observe(node);
        return () => io.disconnect();
    }, [onView, drawn]);

    return (
        <span
            ref={containerRef}
            aria-hidden
            className={cn("inline-block leading-none", TONE[tone], className)}
            style={{
                width,
                transform: `rotate(${ROT[direction]}deg)`,
                transformOrigin: "50% 50%",
            }}
        >
            <svg
                viewBox="0 0 200 100"
                preserveAspectRatio="xMidYMid meet"
                className="block h-auto w-full overflow-visible"
            >
                {/* Shaft — slight curve for hand-drawn feel. */}
                <path
                    d="M8 64 C 60 50, 110 56, 178 36"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.4}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    pathLength={1}
                    strokeDasharray={1}
                    strokeDashoffset={drawn ? 0 : 1}
                    style={{
                        transition: `stroke-dashoffset ${Math.round(durationMs * 0.6)}ms var(--ease-out)`,
                    }}
                />
                {/* Arrowhead — drawn slightly after the shaft. */}
                <path
                    d="M152 16 C 162 22, 172 30, 178 36 C 174 44, 169 52, 162 60"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.4}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    pathLength={1}
                    strokeDasharray={1}
                    strokeDashoffset={drawn ? 0 : 1}
                    style={{
                        transition: `stroke-dashoffset ${Math.round(durationMs * 0.45)}ms var(--ease-out) ${Math.round(durationMs * 0.5)}ms`,
                    }}
                />
            </svg>
        </span>
    );
}
