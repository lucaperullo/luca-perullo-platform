"use client";

import { useEffect, useRef } from "react";

/** Pointer position in normalised device coordinates (-1..1 on both axes). */
export type PointerNDC = { x: number; y: number; active: boolean };

/**
 * Tracks mouse / single-touch in NDC space and exposes the current value
 * via a ref (no re-renders on movement). Pair with `useFrame()` inside
 * R3F to read the latest position 60×/sec without React overhead.
 *
 *   - Re-renders never fire on pointer move.
 *   - Idle (`active: false`) when pointer leaves the window.
 *   - Touch: tracks first finger only; releases on touchend.
 */
export function usePointerTracker() {
    const ref = useRef<PointerNDC>({ x: 0, y: 0, active: false });

    useEffect(() => {
        if (typeof window === "undefined") return;

        const toNdc = (x: number, y: number) => ({
            x: (x / window.innerWidth) * 2 - 1,
            y: -((y / window.innerHeight) * 2 - 1),
        });

        const onMove = (ev: MouseEvent) => {
            const n = toNdc(ev.clientX, ev.clientY);
            ref.current = { x: n.x, y: n.y, active: true };
        };
        const onLeave = () => {
            ref.current = { ...ref.current, active: false };
        };
        const onTouchMove = (ev: TouchEvent) => {
            const t = ev.touches[0];
            if (!t) return;
            const n = toNdc(t.clientX, t.clientY);
            ref.current = { x: n.x, y: n.y, active: true };
        };
        const onTouchEnd = () => {
            ref.current = { ...ref.current, active: false };
        };

        window.addEventListener("mousemove", onMove, { passive: true });
        window.addEventListener("mouseleave", onLeave);
        window.addEventListener("touchmove", onTouchMove, { passive: true });
        window.addEventListener("touchend", onTouchEnd);
        window.addEventListener("touchcancel", onTouchEnd);
        return () => {
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("mouseleave", onLeave);
            window.removeEventListener("touchmove", onTouchMove);
            window.removeEventListener("touchend", onTouchEnd);
            window.removeEventListener("touchcancel", onTouchEnd);
        };
    }, []);

    return ref;
}
