import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type MarqueeProps = {
    children: ReactNode;
    /** Direction of motion. Default "left". */
    direction?: "left" | "right";
    /** Loop time in seconds. Default 36 (slow, editorial). */
    durationSec?: number;
    /** Gap between children in CSS length units. Default "1.5rem". */
    gap?: string;
    /** When true, motion pauses on hover. Default true. */
    pauseOnHover?: boolean;
    /** When true, fades the strip edges with a mask. Default true. */
    fade?: boolean;
    /** Optional explicit fade width (default "8%"). */
    fadeWidth?: string;
    className?: string;
};

/**
 * Hardware-accelerated, CSS-only marquee.
 *
 * Motion notes (Emil playbook):
 *  - Easing: linear (constant motion); never ease-* on infinite loops.
 *  - Properties animated: only `transform` (skips layout + paint, runs on GPU).
 *  - Reduced-motion: globals.css collapses animation-duration to 0.01ms,
 *    so the marquee is effectively static for users who opt out.
 */
export function Marquee({
    children,
    direction = "left",
    durationSec = 36,
    gap = "1.5rem",
    pauseOnHover = true,
    fade = true,
    fadeWidth = "8%",
    className,
}: MarqueeProps) {
    const reverse = direction === "right";

    const fadeStyle: React.CSSProperties = fade
        ? {
            WebkitMaskImage: `linear-gradient(to right, transparent, black ${fadeWidth}, black calc(100% - ${fadeWidth}), transparent)`,
            maskImage: `linear-gradient(to right, transparent, black ${fadeWidth}, black calc(100% - ${fadeWidth}), transparent)`,
        }
        : {};

    return (
        <div
            className={cn(
                "group/marquee relative flex w-full overflow-hidden",
                className,
            )}
            style={{
                ...fadeStyle,
                ["--marquee-duration" as string]: `${durationSec}s`,
                ["--marquee-gap" as string]: gap,
            }}
            role="presentation"
        >
            <div
                aria-hidden={false}
                className={cn(
                    "flex shrink-0 will-change-transform",
                    pauseOnHover ? "group-hover/marquee:[animation-play-state:paused]" : null,
                )}
                style={{
                    gap,
                    paddingRight: gap,
                    animation: `marquee-x var(--marquee-duration, 36s) linear infinite ${reverse ? "reverse" : "normal"}`,
                }}
            >
                {children}
            </div>
            <div
                aria-hidden
                className={cn(
                    "flex shrink-0 will-change-transform",
                    pauseOnHover ? "group-hover/marquee:[animation-play-state:paused]" : null,
                )}
                style={{
                    gap,
                    paddingRight: gap,
                    animation: `marquee-x var(--marquee-duration, 36s) linear infinite ${reverse ? "reverse" : "normal"}`,
                }}
            >
                {children}
            </div>
        </div>
    );
}
