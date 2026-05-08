"use client";

import { cn } from "@/lib/utils";

export type BorderBeamProps = {
    /** Beam length as % of perimeter. Default 18. */
    size?: number;
    /** Loop duration in seconds. Default 8. */
    duration?: number;
    /** Starting offset 0–1 (so two beams can be 0.5 apart). Default 0. */
    delay?: number;
    /** Beam gradient stops. Default uses --accent fading to transparent. */
    colorFrom?: string;
    colorTo?: string;
    /** Border radius. Match the parent for clean tracking. Default 10. */
    borderRadius?: number;
    className?: string;
};

/**
 * <BorderBeam/> — a glowing comet sweeps continuously around the parent's
 * border. Drop inside a `relative overflow-hidden rounded-[10px]` container.
 *
 * Implementation: a thin rotating element placed via CSS `offset-path` along
 * the border rectangle. Pure CSS animation, no JS per frame.
 *
 * Add a second `<BorderBeam delay={0.5}/>` for the dual-beam look used on
 * Magic UI hero cards.
 */
export function BorderBeam({
    size = 18,
    duration = 8,
    delay = 0,
    colorFrom = "var(--accent)",
    colorTo = "transparent",
    borderRadius = 10,
    className,
}: BorderBeamProps) {
    return (
        <>
            <style>{`
                @keyframes border-beam {
                    to { offset-distance: 100%; }
                }
            `}</style>
            <div
                aria-hidden
                className={cn(
                    "pointer-events-none absolute inset-0",
                    className,
                )}
                style={{
                    borderRadius,
                    // Use CSS Motion Path along the rectangle border. Modern
                    // browsers (Chrome 116+, Safari 16+, Firefox 122+) handle this.
                    offsetPath: `rect(0 100% 100% 0 round ${borderRadius}px)`,
                    offsetDistance: "0%",
                    animation: `border-beam ${duration}s linear infinite`,
                    animationDelay: `${-delay * duration}s`,
                    width: `${size}%`,
                    aspectRatio: "1",
                    background: `linear-gradient(90deg, ${colorTo}, ${colorFrom}, ${colorTo})`,
                    filter: "blur(6px)",
                    opacity: 0.85,
                }}
            />
        </>
    );
}
