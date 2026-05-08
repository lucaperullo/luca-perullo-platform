import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type AuroraTextProps = {
    children: ReactNode;
    /** Gradient stops cycling under the text. Default 4 cool/warm hues. */
    colors?: string[];
    /** Cycle duration in seconds. Default 6. */
    speed?: number;
    className?: string;
};

/**
 * <AuroraText/> — iridescent flowing aurora gradient on text via
 * `background-clip: text` + animated `background-position`. Pure CSS, zero JS.
 */
export function AuroraText({
    children,
    colors = ["#8b5cf6", "#22d3ee", "#2b7fff", "#ec4899"],
    speed = 6,
    className,
}: AuroraTextProps) {
    const gradient = `linear-gradient(110deg, ${colors.join(", ")}, ${colors[0]})`;
    return (
        <>
            <style>{`
                @keyframes aurora-text-shift {
                    from { background-position: 0% center; }
                    to   { background-position: 200% center; }
                }
            `}</style>
            <span
                className={cn("inline-block", className)}
                style={{
                    backgroundImage: gradient,
                    backgroundSize: "200% auto",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    color: "transparent",
                    WebkitTextFillColor: "transparent",
                    animation: `aurora-text-shift ${speed}s linear infinite`,
                }}
            >
                {children}
            </span>
        </>
    );
}
