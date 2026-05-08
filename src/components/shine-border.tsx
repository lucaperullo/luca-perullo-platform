import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type ShineBorderProps = {
    children: ReactNode;
    /** Border radius in px. Default 8. */
    borderRadius?: number;
    /** Border thickness in px. Default 1. */
    borderWidth?: number;
    /** Cycle duration in seconds. Default 14. */
    duration?: number;
    /** Single color or array of stops. Default `["var(--accent)", "transparent"]`. */
    color?: string | string[];
    className?: string;
};

/**
 * <ShineBorder/> — wrapper that renders a rotating conic-gradient border
 * around its children. Pure CSS via a spinning conic-gradient layer below
 * an inset bg-bg child that masks everything but the ring.
 */
export function ShineBorder({
    children,
    borderRadius = 8,
    borderWidth = 1,
    duration = 14,
    color = ["var(--accent)", "transparent"],
    className,
}: ShineBorderProps) {
    const stops = Array.isArray(color) ? color : [color, "transparent"];
    const conic = `conic-gradient(from 0deg, ${stops.join(", ")}, ${stops[0]})`;

    const style = {
        "--shine-radius": `${borderRadius}px`,
        "--shine-width": `${borderWidth}px`,
        "--shine-duration": `${duration}s`,
        "--shine-conic": conic,
    } as CSSProperties;

    return (
        <>
            <style>{`
                @keyframes shine-border-spin {
                    from { transform: translate(-50%, -50%) rotate(0deg); }
                    to   { transform: translate(-50%, -50%) rotate(360deg); }
                }
            `}</style>
            <div
                style={style}
                className={cn(
                    "relative isolate",
                    className,
                )}
            >
                <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
                    style={{ borderRadius: "var(--shine-radius)" }}
                >
                    <span
                        className="absolute left-1/2 top-1/2 aspect-square w-[200%]"
                        style={{
                            background: "var(--shine-conic)",
                            animation:
                                "shine-border-spin var(--shine-duration) linear infinite",
                        }}
                    />
                </span>
                <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 -z-10 bg-bg-alt"
                    style={{
                        borderRadius:
                            "calc(var(--shine-radius) - var(--shine-width))",
                        margin: "var(--shine-width)",
                    }}
                />
                {children}
            </div>
        </>
    );
}
