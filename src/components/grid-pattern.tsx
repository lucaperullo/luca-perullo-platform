import { useId } from "react";
import { cn } from "@/lib/utils";

export type GridPatternProps = {
    width?: number;
    height?: number;
    x?: number;
    y?: number;
    /** Stroke dash like `"4 2"`. */
    strokeDasharray?: string;
    /** Highlight individual cells: each `[col, row]` gets a soft tint. */
    squares?: [number, number][];
    className?: string;
};

/**
 * <GridPattern/> — crisp SVG line-grid background. Optional `squares`
 * highlights individual cells with a soft tint to draw the eye.
 */
export function GridPattern({
    width = 40,
    height = 40,
    x = -1,
    y = -1,
    strokeDasharray,
    squares,
    className,
}: GridPatternProps) {
    const id = useId();
    return (
        <svg
            aria-hidden
            className={cn(
                "pointer-events-none absolute inset-0 h-full w-full text-border",
                className,
            )}
        >
            <defs>
                <pattern id={id} width={width} height={height} x={x} y={y} patternUnits="userSpaceOnUse">
                    <path
                        d={`M.5 ${height}V.5H${width}`}
                        fill="none"
                        stroke="currentColor"
                        strokeDasharray={strokeDasharray}
                    />
                </pattern>
            </defs>
            <rect width="100%" height="100%" strokeWidth={0} fill={`url(#${id})`} />
            {squares?.map(([col, row], i) => (
                <rect
                    key={`${col}-${row}-${i}`}
                    width={width - 1}
                    height={height - 1}
                    x={col * width + 1}
                    y={row * height + 1}
                    fill="currentColor"
                    opacity={0.12}
                    strokeWidth={0}
                />
            ))}
        </svg>
    );
}
