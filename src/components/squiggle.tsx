"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export type SquiggleProps = {
    children: ReactNode;
    /** Tone of the underline. Defaults to "accent" (uses --accent). */
    tone?: "accent" | "fg" | "soft";
    /** Stroke width in SVG units (viewBox 200x14). Default 2. */
    weight?: number;
    /** Offset between text and squiggle in px. Default 0. */
    offset?: number;
    /** When true, animation runs once it enters the viewport (default).
     *  When false, draws immediately on mount. */
    onView?: boolean;
    /** Animation duration in ms. Default 900. */
    durationMs?: number;
    className?: string;
};

const TONE: Record<NonNullable<SquiggleProps["tone"]>, string> = {
    accent: "text-accent",
    fg: "text-fg",
    soft: "text-fg-soft",
};

/**
 * Hand-drawn underline — emphasises a word in a sentence.
 *
 * Motion notes (Emil playbook):
 *  - The path is revealed by animating stroke-dashoffset → 0.
 *  - We trigger on first view (IntersectionObserver) so it feels intentional,
 *    not gratuitous on every render.
 *  - Easing: --ease-out (strong cubic-bezier).
 *  - prefers-reduced-motion → globals collapses duration; users still see
 *    the final drawn state without the draw motion.
 */
export function Squiggle({
    children,
    tone = "accent",
    weight = 2,
    offset = 0,
    onView = true,
    durationMs = 900,
    className,
}: SquiggleProps) {
    const ref = useRef<SVGPathElement | null>(null);
    const [drawn, setDrawn] = useState(!onView);

    useEffect(() => {
        if (!onView || drawn || !ref.current) return;
        const node = ref.current;
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
            { threshold: 0.5 },
        );
        io.observe(node);
        return () => io.disconnect();
    }, [onView, drawn]);

    return (
        <span
            className={cn("relative inline-block whitespace-nowrap", TONE[tone], className)}
        >
            <span className="relative z-10 text-fg">{children}</span>
            <svg
                aria-hidden
                viewBox="0 0 200 14"
                preserveAspectRatio="none"
                className="absolute left-0 right-0 top-full block w-full"
                style={{ marginTop: offset, height: "0.5em", overflow: "visible" }}
            >
                <path
                    ref={ref}
                    d="M2 8 C 22 3, 48 12, 70 6 S 118 13, 145 7 S 188 11, 198 5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={weight}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    pathLength={1}
                    strokeDasharray={1}
                    strokeDashoffset={drawn ? 0 : 1}
                    style={{
                        transition: `stroke-dashoffset ${durationMs}ms var(--ease-out)`,
                    }}
                />
            </svg>
        </span>
    );
}
