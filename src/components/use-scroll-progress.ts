"use client";

import { useEffect, useRef } from "react";

/**
 * Exposes a ref containing scroll progress in 0..1, where 0 = top of page
 * and 1 = scrolled `rangePx` (or more). Read inside `useFrame()` for shader
 * uniforms — never causes re-renders.
 *
 * Pairs with `useScrollVelocity()`:
 *   - Velocity = how *fast* you scroll (instantaneous reaction)
 *   - Progress = *where* you are along the scroll (drives the pattern itself)
 */
export function useScrollProgress(rangePx = 3000) {
    const ref = useRef<number>(0);

    useEffect(() => {
        if (typeof window === "undefined") return;

        let scheduled = false;
        let frame = 0;

        const update = () => {
            scheduled = false;
            ref.current = Math.max(0, Math.min(1, window.scrollY / Math.max(1, rangePx)));
        };

        const onScroll = () => {
            if (scheduled) return;
            scheduled = true;
            frame = requestAnimationFrame(update);
        };

        update(); // initial
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => {
            window.removeEventListener("scroll", onScroll);
            if (frame) cancelAnimationFrame(frame);
        };
    }, [rangePx]);

    return ref;
}
