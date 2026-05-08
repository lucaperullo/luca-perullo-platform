"use client";

import { useEffect, useState } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Reactive `prefers-reduced-motion` state.
 *
 * Returns `true` when the OS-level reduced-motion preference is on, and
 * re-renders if the user toggles the preference at runtime. SSR-safe —
 * starts as `false` on the server, hydrates to the real value on mount.
 *
 * Pair with the global CSS rule in `globals.css`: this hook is for the
 * cases where JS needs to *branch* on the preference (skip rAF loops,
 * collapse to a static frame, opt out of subscribing to scroll events,
 * etc.). For pure CSS animation throttling, the global rule is enough.
 */
export function useReducedMotion(): boolean {
    const [reduced, setReduced] = useState(false);

    useEffect(() => {
        if (typeof window === "undefined") return;
        const mq = window.matchMedia(QUERY);
        const sync = () => setReduced(mq.matches);
        sync();
        mq.addEventListener("change", sync);
        return () => mq.removeEventListener("change", sync);
    }, []);

    return reduced;
}

/**
 * One-shot read of `prefers-reduced-motion` — no subscription, no state.
 *
 * Use inside an effect when you only need the value at a single decision
 * point (e.g. "if reduced, snap to final state and bail"). For anything
 * that should react to the user toggling the preference mid-session,
 * use `useReducedMotion()` instead.
 *
 * SSR-safe: returns `false` when `window` is undefined.
 */
export function prefersReducedMotion(): boolean {
    if (typeof window === "undefined") return false;
    return window.matchMedia(QUERY).matches;
}
