import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

export type RetroGridProps = {
    /** RotateX angle in degrees. Default 65. */
    angle?: number;
    /** Cell side in px. Default 60. */
    cellSize?: number;
    /** Surface opacity 0–1. Default 0.5. */
    opacity?: number;
    lightLineColor?: string;
    darkLineColor?: string;
    className?: string;
};

/**
 * <RetroGrid/> — synthwave perspective grid receding to a horizon. Pure CSS
 * — perspective + rotateX + animated `background-position` to scroll the
 * grid forward. Light/dark variants share the same component via tokens.
 */
export function RetroGrid({
    angle = 65,
    cellSize = 60,
    opacity = 0.5,
    lightLineColor = "var(--border-strong)",
    darkLineColor = "var(--border)",
    className,
}: RetroGridProps) {
    const style = {
        "--retro-angle": `${angle}deg`,
        "--retro-cell": `${cellSize}px`,
        "--retro-opacity": `${opacity}`,
        "--retro-line-light": lightLineColor,
        "--retro-line-dark": darkLineColor,
    } as CSSProperties;
    return (
        <>
            <style>{`
                @keyframes retro-grid-scroll {
                    from { transform: translateZ(0); background-position: 0 0; }
                    to   { transform: translateZ(0); background-position: 0 calc(var(--retro-cell) * 24); }
                }
            `}</style>
            <div
                aria-hidden
                style={style}
                className={cn(
                    "pointer-events-none absolute inset-0 overflow-hidden [perspective:200px]",
                    className,
                )}
            >
                <div
                    className="absolute inset-0 [transform-style:preserve-3d]"
                    style={{
                        opacity: "var(--retro-opacity)",
                        transform:
                            "rotateX(var(--retro-angle))",
                    }}
                >
                    <div
                        className="absolute inset-x-0 -inset-y-[100%] [background-image:linear-gradient(to_right,var(--retro-line-light)_1px,transparent_0),linear-gradient(to_bottom,var(--retro-line-dark)_1px,transparent_0)]"
                        style={{
                            backgroundSize:
                                "var(--retro-cell) var(--retro-cell)",
                            animation: "retro-grid-scroll 20s linear infinite",
                        }}
                    />
                </div>
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-bg to-transparent" />
            </div>
        </>
    );
}
