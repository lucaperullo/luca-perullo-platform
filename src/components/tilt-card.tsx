"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";

export type TiltCardProps = {
    children: React.ReactNode;
    /** Max tilt in degrees. Default 8 — restrained, never seasick. */
    maxTilt?: number;
    /** Lift/scale on hover. Default 1.02. */
    scale?: number;
    /** Show a moving glare highlight. Default true. */
    glare?: boolean;
    className?: string;
};

/**
 * <TiltCard/> — Perplexity/Apple-style 3D parallax tilt that follows the
 * cursor's position over the card. Releases back to flat with a soft spring.
 *
 * Pure CSS transforms updated via CSS custom properties — React state is
 * untouched on pointer move (no re-renders).
 */
export function TiltCard({
    children,
    maxTilt = 8,
    scale = 1.02,
    glare = true,
    className,
}: TiltCardProps) {
    const ref = useRef<HTMLDivElement>(null);

    // Gate pointer-driven tilt to fine pointers — touch devices fire hover-on-tap
    // and would leave the card stuck mid-rotation.
    const fineHover =
        typeof window !== "undefined" &&
        window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    function onMove(e: React.PointerEvent<HTMLDivElement>) {
        if (!fineHover) return;
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width;
        const py = (e.clientY - rect.top) / rect.height;
        const rx = (0.5 - py) * maxTilt * 2;
        const ry = (px - 0.5) * maxTilt * 2;
        el.style.setProperty("--rx", `${rx}deg`);
        el.style.setProperty("--ry", `${ry}deg`);
        el.style.setProperty("--gx", `${px * 100}%`);
        el.style.setProperty("--gy", `${py * 100}%`);
    }

    function onLeave() {
        const el = ref.current;
        if (!el) return;
        el.style.setProperty("--rx", `0deg`);
        el.style.setProperty("--ry", `0deg`);
    }

    return (
        <div
            ref={ref}
            onPointerMove={onMove}
            onPointerLeave={onLeave}
            className={cn("group [perspective:1000px]", className)}
        >
            <div
                className="relative h-full w-full transition-transform duration-300 [transform-style:preserve-3d] [transition-timing-function:var(--ease-out)]"
                style={{
                    transform: `rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg)) scale(var(--s,1))`,
                    ["--s" as string]: 1,
                }}
                onPointerEnter={(e) => {
                    if (!fineHover) return;
                    e.currentTarget.style.setProperty("--s", String(scale));
                }}
                onPointerLeave={(e) => {
                    e.currentTarget.style.setProperty("--s", "1");
                }}
            >
                {children}
                {glare ? (
                    <div
                        aria-hidden
                        className={cn(
                            "pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 mix-blend-overlay transition-opacity duration-300",
                            "[transition-timing-function:var(--ease-out)]",
                            "group-hover:opacity-100",
                        )}
                        style={{
                            background:
                                "radial-gradient(280px circle at var(--gx,50%) var(--gy,50%), rgba(255,255,255,0.55), transparent 60%)",
                        }}
                    />
                ) : null}
            </div>
        </div>
    );
}
