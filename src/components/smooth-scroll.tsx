"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { prefersReducedMotion } from "./use-reduced-motion";

export type SmoothScrollProps = {
    /** Scroll smoothing time constant. Higher = slower, more inertia. Default 1.2. */
    duration?: number;
    /**
     * Multiplier applied to wheel deltas. <1 dampens fast wheel inputs;
     * >1 amplifies. Default 1.
     */
    wheelMultiplier?: number;
};

/**
 * Lenis-based smooth scrolling — desktop only, opt-out for touch + reduced
 * motion. Drop in once at the root of the layout.
 *
 * Why a client component:
 *   - Lenis hooks `wheel` events and drives a custom rAF scroll loop that
 *     dispatches synthetic `scroll` events the browser would have fired
 *     natively. Native scroll listeners (e.g. our ScrollVideoSides) just
 *     keep working — they receive scroll events at higher fidelity.
 *   - Touch devices already have buttery momentum scrolling — Lenis on
 *     touch is worse, not better. Skip on `(hover: none) and (pointer: coarse)`.
 *   - Reduced-motion users opt out of all decorative motion; Lenis is
 *     decorative, so we honour the preference.
 *
 * Renders nothing. Initialises Lenis on mount, tears it down on unmount.
 */
export function SmoothScroll({
    duration = 1.2,
    wheelMultiplier = 1,
}: SmoothScrollProps = {}) {
    useEffect(() => {
        if (typeof window === "undefined") return;

        const isTouch = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
        const reducedMotion = prefersReducedMotion();
        if (isTouch || reducedMotion) return;

        const lenis = new Lenis({
            duration,
            // Strong ease-out — t=0 fast, t=1 settle. Matches our --ease-out.
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            wheelMultiplier,
            smoothWheel: true,
        });

        let frame = 0;
        const loop = (time: number) => {
            lenis.raf(time);
            frame = requestAnimationFrame(loop);
        };
        frame = requestAnimationFrame(loop);

        return () => {
            cancelAnimationFrame(frame);
            lenis.destroy();
        };
    }, [duration, wheelMultiplier]);

    return null;
}
