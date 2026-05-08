"use client";

import { cn } from "@/lib/utils";

export type ShinyTextProps = {
    children: React.ReactNode;
    /** Sweep duration in seconds. Default 3. */
    speed?: number;
    /** Base text color. Default uses --fg-muted. */
    baseColor?: string;
    /** Sweep color. Default uses --fg. */
    shineColor?: string;
    className?: string;
};

/**
 * <ShinyText/> — a metallic shine sweeps across the text on a loop.
 *
 * Pure CSS — `background-clip: text` + animated `background-position`.
 * Used everywhere on premium SaaS CTAs ("Start Now →"). Lightweight, no JS.
 */
export function ShinyText({
    children,
    speed = 3,
    baseColor = "var(--fg-muted)",
    shineColor = "var(--fg)",
    className,
}: ShinyTextProps) {
    const style: React.CSSProperties = {
        backgroundImage: `linear-gradient(110deg, ${baseColor} 0%, ${baseColor} 40%, ${shineColor} 50%, ${baseColor} 60%, ${baseColor} 100%)`,
        backgroundSize: "200% auto",
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        color: "transparent",
        WebkitTextFillColor: "transparent",
        animation: `shiny-sweep ${speed}s linear infinite`,
    };

    return (
        <>
            <style>{`
                @keyframes shiny-sweep {
                    from { background-position: 200% center; }
                    to   { background-position: -200% center; }
                }
            `}</style>
            <span className={cn("inline-block", className)} style={style}>
                {children}
            </span>
        </>
    );
}
