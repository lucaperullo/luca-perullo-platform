"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";

export type SpotlightCardProps = {
    children: React.ReactNode;
    /** Spotlight diameter in px. Default 320. */
    radius?: number;
    /** Spotlight tint. Default --accent. */
    color?: string;
    /** Spotlight intensity 0–1. Default 0.18. */
    intensity?: number;
    className?: string;
};

/**
 * <SpotlightCard/> — a card with a soft radial-gradient spotlight that follows
 * the user's pointer. Aceternity's most-screenshot pattern; reads "premium SaaS".
 *
 * The spotlight is implemented via two CSS custom properties (--mx, --my)
 * updated on pointer-move. Pure CSS rendering — no React state churn per frame.
 */
export function SpotlightCard({
    children,
    radius = 320,
    color = "var(--accent)",
    intensity = 0.18,
    className,
}: SpotlightCardProps) {
    const ref = useRef<HTMLDivElement>(null);

    function onMove(e: React.PointerEvent<HTMLDivElement>) {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
        el.style.setProperty("--my", `${e.clientY - rect.top}px`);
    }

    function onLeave() {
        const el = ref.current;
        if (!el) return;
        el.style.setProperty("--mx", `-9999px`);
        el.style.setProperty("--my", `-9999px`);
    }

    return (
        <div
            ref={ref}
            onPointerMove={onMove}
            onPointerLeave={onLeave}
            className={cn(
                "group relative overflow-hidden rounded-[10px] border border-border bg-bg-alt p-5",
                className,
            )}
            style={
                {
                    "--mx": "-9999px",
                    "--my": "-9999px",
                } as React.CSSProperties
            }
        >
            {/* spotlight overlay — non-interactive, hover-only on fine pointer */}
            <div
                aria-hidden
                className={cn(
                    "pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300",
                    "[transition-timing-function:var(--ease-out)]",
                    "group-hover:opacity-100",
                )}
                style={{
                    background: `radial-gradient(${radius}px circle at var(--mx) var(--my), color-mix(in oklch, ${color} ${
                        intensity * 100
                    }%, transparent), transparent 60%)`,
                }}
            />
            {/* hairline border that brightens with pointer */}
            <div
                aria-hidden
                className={cn(
                    "pointer-events-none absolute inset-0 rounded-[10px] opacity-0 transition-opacity duration-300",
                    "[transition-timing-function:var(--ease-out)]",
                    "group-hover:opacity-100",
                )}
                style={{
                    background: `radial-gradient(${
                        radius * 1.4
                    }px circle at var(--mx) var(--my), color-mix(in oklch, ${color} 40%, transparent), transparent 50%)`,
                    WebkitMask:
                        "linear-gradient(#000 0 0) padding-box, linear-gradient(#000 0 0)",
                    WebkitMaskComposite: "xor",
                    mask: "linear-gradient(#000 0 0) padding-box, linear-gradient(#000 0 0)",
                    maskComposite: "exclude",
                    padding: 1,
                    borderRadius: 10,
                }}
            />
            <div className="relative">{children}</div>
        </div>
    );
}
