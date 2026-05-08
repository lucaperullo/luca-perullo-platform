"use client";

import { useRef } from "react";
import { Fly, type FlyVariant } from "@/components/fly";
import { cn } from "@/lib/utils";

/**
 * Bordered viewport that hosts a *live* `<Fly />` confined to the
 * container's rect. The fly walks, grooms, and reacts to the cursor
 * only while the cursor is inside the box. Useful as a demo surface
 * in docs/library pages where mounting a viewport-wide fly would be
 * intrusive.
 *
 * Picks up the global variant by default (so the library picker
 * controls it too); pass an explicit `variant` to lock a species.
 */
export function FlyEnclosure({
    variant,
    height = 240,
    label,
    className,
}: {
    variant?: FlyVariant;
    height?: number;
    label?: string;
    className?: string;
}) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    return (
        <div
            ref={containerRef}
            className={cn(
                "relative overflow-hidden rounded-md border border-border bg-bg-alt",
                className,
            )}
            style={{ height }}
        >
            {/* Subtle grid backdrop — gives the fly a "surface" to walk on */}
            <div
                aria-hidden
                className="grid-dots absolute inset-0 opacity-40"
            />
            {label ? (
                <span className="pointer-events-none absolute left-3 top-3 z-10 font-mono text-[10px] uppercase tracking-[0.1em] text-fg-soft">
                    {label}
                </span>
            ) : null}
            {/* The walking fly — picks up the global variant unless
                a `variant` prop is passed to lock it. */}
            <Fly variant={variant} bounds={containerRef} />
        </div>
    );
}
