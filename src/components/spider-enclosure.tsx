"use client";

import { useRef } from "react";
import { Spider, type SpiderVariant } from "@/components/spider";
import { Fly, type FlyVariant } from "@/components/fly";
import { cn } from "@/lib/utils";

/**
 * Enclosure that hosts a *live* spider walking inside the box. By
 * default also mounts a fly inside, so visitors can watch the
 * predator-prey loop play out: spider walks → spins web → waits;
 * fly wanders → enters web → struggles → escapes.
 */
export function SpiderEnclosure({
    variant,
    flyVariant,
    withFly = true,
    height = 280,
    label,
    className,
}: {
    variant?: SpiderVariant;
    flyVariant?: FlyVariant;
    /** Mount a Fly inside the same box (default true). */
    withFly?: boolean;
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
            <div
                aria-hidden
                className="grid-dots absolute inset-0 opacity-40"
            />
            {label ? (
                <span className="pointer-events-none absolute left-3 top-3 z-10 font-mono text-[10px] uppercase tracking-[0.1em] text-fg-soft">
                    {label}
                </span>
            ) : null}
            <Spider variant={variant} bounds={containerRef} />
            {withFly ? <Fly variant={flyVariant} bounds={containerRef} /> : null}
        </div>
    );
}
