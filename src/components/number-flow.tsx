"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type NumberFlowProps = {
    /** Final value. */
    value: number;
    /** Starting value. Default 0. */
    from?: number;
    /** Animation duration in ms. Default 1100. */
    durationMs?: number;
    /** Optional formatter for the displayed value (e.g. percentage, locale). */
    format?: (n: number) => string;
    /** Render eagerly (skip the IntersectionObserver). */
    eager?: boolean;
    className?: string;
};

const easeOut = (t: number) => 1 - Math.pow(1 - t, 4);

/**
 * Animated number that counts up the first time it enters the viewport.
 *
 * Motion notes (Emil playbook):
 *  - Easing: custom ease-out (1 - (1-t)^4) — strong, responsive.
 *  - Combined with a `count-rise` enter (translateY + blur) so the number
 *    feels like it appears, then settles. Single decoration, single playback.
 *  - prefers-reduced-motion: skips animation entirely, renders final value.
 *  - We never animate width — only the inner numeric text — so layout
 *    doesn't reflow neighbours mid-animation.
 */
export function NumberFlow({
    value,
    from = 0,
    durationMs = 1100,
    format = (n) => Math.round(n).toLocaleString("it-IT"),
    eager = false,
    className,
}: NumberFlowProps) {
    const ref = useRef<HTMLSpanElement | null>(null);
    const rafRef = useRef<number | null>(null);
    const [display, setDisplay] = useState(eager ? value : from);
    const [started, setStarted] = useState(eager);

    useEffect(() => {
        if (eager || started || !ref.current) return;
        const node = ref.current;
        const io = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        setStarted(true);
                        io.disconnect();
                        break;
                    }
                }
            },
            { threshold: 0.4 },
        );
        io.observe(node);
        return () => io.disconnect();
    }, [eager, started]);

    useEffect(() => {
        if (!started) return;

        if (typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
            setDisplay(value);
            return;
        }

        const start = performance.now();
        const a = from;
        const b = value;

        const tick = (now: number) => {
            const t = Math.min(1, (now - start) / durationMs);
            const eased = easeOut(t);
            setDisplay(a + (b - a) * eased);
            if (t < 1) rafRef.current = requestAnimationFrame(tick);
        };
        rafRef.current = requestAnimationFrame(tick);
        return () => {
            if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
        };
    }, [started, from, value, durationMs]);

    return (
        <span
            ref={ref}
            className={cn(
                "inline-block tabular-nums",
                started ? "[animation:count-rise_600ms_var(--ease-out)_both]" : "opacity-0",
                className,
            )}
        >
            {format(display)}
        </span>
    );
}
