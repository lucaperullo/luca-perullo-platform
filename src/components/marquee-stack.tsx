import { Children, type ReactNode } from "react";
import { Marquee } from "@/components/marquee";
import { cn } from "@/lib/utils";

export type MarqueeStackProps = {
    children: ReactNode;
    /** Number of rows. Default 2. Min 1, max 4. */
    rows?: 1 | 2 | 3 | 4;
    /** Loop time in seconds for the first row; subsequent rows offset to feel parallax. */
    durationSec?: number;
    /** Gap between items horizontally. Default "0.5rem". */
    gap?: string;
    /** Vertical gap between rows. Default "0.5rem". */
    rowGap?: string;
    /** Pause on hover. Default true. */
    pauseOnHover?: boolean;
    /** Fade the strip edges with a mask. Default true. */
    fade?: boolean;
    className?: string;
};

/**
 * Multi-row marquee with alternating directions and slight per-row speed
 * offset so the rows don't tick in sync — feels like depth.
 *
 * Round-robins the children across rows so each row has visual variety
 * without you having to pre-split the list.
 *
 * Motion notes (Emil playbook):
 *  - Each row uses the base <Marquee/> internally, so the same easing
 *    contract applies (linear, transform-only, prefers-reduced-motion).
 *  - Per-row durationSec offset (+4s per row) creates parallax. Offsets
 *    stay below the perceptual sync threshold so it reads as one
 *    cohesive system, not random rows.
 */
export function MarqueeStack({
    children,
    rows = 2,
    durationSec = 32,
    gap = "0.5rem",
    rowGap = "0.5rem",
    pauseOnHover = true,
    fade = true,
    className,
}: MarqueeStackProps) {
    const all = Children.toArray(children).filter(Boolean);
    if (all.length === 0) return null;

    const buckets: ReactNode[][] = Array.from({ length: rows }, () => []);
    all.forEach((child, i) => {
        buckets[i % rows].push(child);
    });
    // Ensure each bucket has at least 4 items by repeating if the user passed
    // fewer items than rows — keeps the loop visually full.
    buckets.forEach((bucket, idx) => {
        while (bucket.length < 4 && all.length > 0) {
            buckets[idx] = [...bucket, ...all];
            return;
        }
    });

    return (
        <div
            className={cn("flex w-full flex-col", className)}
            style={{ gap: rowGap }}
        >
            {buckets.map((bucket, i) => (
                <Marquee
                    key={i}
                    direction={i % 2 === 0 ? "left" : "right"}
                    durationSec={durationSec + i * 4}
                    gap={gap}
                    pauseOnHover={pauseOnHover}
                    fade={fade}
                >
                    {bucket}
                </Marquee>
            ))}
        </div>
    );
}
