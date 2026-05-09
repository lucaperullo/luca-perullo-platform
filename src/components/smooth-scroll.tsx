"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
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
 * Routes where Lenis must NOT be active. The lesson runner is `fixed
 * inset-0` (full viewport, no body scroll), and Lenis hooked at `window`
 * level just confuses scroll bounds. Pattern matches strings — kept here
 * to avoid spreading per-route gating logic across the codebase.
 */
function isLenisDisabledFor(pathname: string): boolean {
    // /play/<slug>/<n> — the lesson page, full-viewport-fixed.
    // /play, /play/<slug>, /play/materia/<s> still use normal scroll, OK.
    return /^\/play\/[^/]+\/\d+/.test(pathname);
}

/**
 * Lenis-based smooth scrolling — desktop only, opt-out for touch + reduced
 * motion + lesson runner pages. Drop in once at the root of the layout.
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
 * Why the route-aware sync:
 *   - Lenis caches scroll bounds at init time. If the page below it
 *     resizes (e.g. App Router client nav swaps a tall catalog for a
 *     short page, or vice-versa), Lenis can refuse to scroll past the
 *     stale bound. We re-sync on every pathname change.
 *   - On lesson pages (full-viewport-fixed), Lenis adds zero value and
 *     can interfere with the iframe preview. We tear it down there and
 *     re-init on the next non-lesson page.
 */
export function SmoothScroll({
    duration = 1.2,
    wheelMultiplier = 1,
}: SmoothScrollProps = {}) {
    const pathname = usePathname();
    const lenisRef = useRef<Lenis | null>(null);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const isTouch = window.matchMedia(
            "(hover: none) and (pointer: coarse)",
        ).matches;
        const reducedMotion = prefersReducedMotion();
        if (isTouch || reducedMotion) return;

        // Don't init on lesson pages — full-viewport-fixed UI, no body scroll.
        if (isLenisDisabledFor(pathname)) return;

        const lenis = new Lenis({
            duration,
            // Strong ease-out — t=0 fast, t=1 settle. Matches our --ease-out.
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            wheelMultiplier,
            smoothWheel: true,
        });
        lenisRef.current = lenis;

        let frame = 0;
        const loop = (time: number) => {
            lenis.raf(time);
            frame = requestAnimationFrame(loop);
        };
        frame = requestAnimationFrame(loop);

        return () => {
            cancelAnimationFrame(frame);
            lenis.destroy();
            lenisRef.current = null;
        };
        // pathname is included so we tear-down/re-init when crossing the
        // lesson-runner boundary. Within a single non-lesson path, the
        // separate effect below just calls resize() instead of re-init.
    }, [duration, wheelMultiplier, pathname]);

    // Re-sync bounds on navigation within the smooth-scroll domain.
    // resize() recalcs scrollHeight/limit; scrollTo(0, immediate) makes
    // sure we don't carry over the previous page's scroll offset.
    useEffect(() => {
        const lenis = lenisRef.current;
        if (!lenis) return;
        // Wait one frame so the new layout has committed.
        const id = requestAnimationFrame(() => {
            lenis.resize();
            lenis.scrollTo(0, { immediate: true });
        });
        return () => cancelAnimationFrame(id);
    }, [pathname]);

    return null;
}
