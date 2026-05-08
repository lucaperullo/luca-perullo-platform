import { useId } from "react";
import { cn } from "@/lib/utils";

export type DotPatternProps = {
    width?: number;
    height?: number;
    cx?: number;
    cy?: number;
    cr?: number;
    /** Mask the pattern with a soft radial fade. */
    glow?: boolean;
    className?: string;
};

/**
 * <DotPattern/> — crisp SVG dotted-grid background. Drop into any
 * `relative` parent. Use `glow` to mask the pattern with a soft radial
 * fade (matches chanhdai-style hero backgrounds).
 */
export function DotPattern({
    width = 16,
    height = 16,
    cx = 1,
    cy = 1,
    cr = 1,
    glow = false,
    className,
}: DotPatternProps) {
    const id = useId();
    return (
        <svg
            aria-hidden
            className={cn(
                "pointer-events-none absolute inset-0 h-full w-full text-fg-soft/40",
                glow && "[mask-image:radial-gradient(closest-side_at_center,black,transparent)]",
                className,
            )}
        >
            <defs>
                <pattern id={id} width={width} height={height} patternUnits="userSpaceOnUse">
                    <circle cx={cx} cy={cy} r={cr} fill="currentColor" />
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#${id})`} />
        </svg>
    );
}
