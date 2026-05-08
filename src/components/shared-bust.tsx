"use client";

import { useEffect, useRef, useState } from "react";
import { BustAvatar } from "./bust-avatar";

/**
 * Shared marble-bust renderer.
 *
 * Why this exists: drei's `useGLTF` returns a SHARED `scene` object across
 * every consumer of the same URL. Mounting <BustAvatar/> in two places at
 * once causes the second instance to steal the scene out of the first
 * renderer (Three.js scenes can only live in one renderer at a time), so
 * one of the two ends up blank. Rendering the bust ONCE here and letting
 * it physically relocate to whichever <div data-bust-anchor /> is active
 * is both the bug fix and the "morph" the user asked for: the same
 * element travels between profile and cookie-banner contexts, animating
 * position/scale/border-radius. Spatial consistency, single source.
 *
 * Coordination strategy: dead-simple rAF poll that queries the DOM every
 * frame for the active anchor. This sidesteps every React lifecycle race
 * (callback refs vs effects vs SSR vs conditional rendering) that earlier
 * event-driven attempts kept tripping on. 60 attribute-selector lookups
 * per second is essentially free, and the cached-write guard means the
 * style is only mutated when the value actually changes — so the CSS
 * transition isn't restarted on every frame, and the bust morphs smoothly.
 *
 * Morph between anchors uses CSS `transition: transform / border-radius`.
 * Scroll tracking just retargets the same transition each frame, which
 * the browser handles by snapping the target — visually equivalent to
 * the bust sticking to the anchor as the page scrolls.
 */

const PRIORITY = ["cookie", "profile"] as const;
type AnchorId = (typeof PRIORITY)[number];

const FIXED_SIZE = 112; // px — the bust's intrinsic canvas size before CSS scaling
const TICK_INTERVAL_MS = 0; // rAF frequency (one per frame)

/**
 * Tag a sized div as an anchor for the SharedBust:
 *
 *   <div {...bustAnchor("profile")} className="size-24 rounded-full" />
 *
 * The attribute is set directly in JSX (not via a callback ref), so the
 * anchor appears in the SSR HTML, survives hydration unchanged, and is
 * findable by the rAF poll on the very first frame after mount. This
 * removes every React-lifecycle race that earlier ref/effect-based
 * implementations kept tripping on.
 */
export function bustAnchor(id: AnchorId): { "data-bust-anchor": AnchorId } {
    return { "data-bust-anchor": id };
}

export function SharedBust() {
    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    useEffect(() => {
        if (!mounted) return;
        const wrapper = wrapperRef.current;
        if (!wrapper) return;

        let lastTransform = "";
        let lastBorderRadius = "";
        let lastAnchorId: AnchorId | null = null;
        let firstPlacement = true;
        let rafId = 0;
        let lastVisible = false;

        const tick = () => {
            let active: { id: AnchorId; el: HTMLElement } | null = null;
            for (const id of PRIORITY) {
                const el = document.querySelector<HTMLElement>(`[data-bust-anchor="${id}"]`);
                if (el && el.isConnected) {
                    active = { id, el };
                    break;
                }
            }

            if (!active) {
                if (lastVisible) {
                    wrapper.style.visibility = "hidden";
                    lastVisible = false;
                }
                rafId = requestAnimationFrame(tick);
                return;
            }

            const rect = active.el.getBoundingClientRect();
            if (rect.width === 0 || rect.height === 0) {
                rafId = requestAnimationFrame(tick);
                return;
            }

            const cs = getComputedStyle(active.el);
            const radiusFromStyle = parseFloat(cs.borderRadius) || 0;
            const scale = rect.width / FIXED_SIZE;

            const nextTransform = `translate(${rect.left}px, ${rect.top}px) scale(${scale})`;
            // Wrapper is being scaled, so border-radius is visually multiplied
            // by `scale`. Divide to keep apparent radius matching the anchor.
            const nextBorderRadius = `${radiusFromStyle / Math.max(scale, 0.0001)}px`;

            if (firstPlacement) {
                // Snap into place on first placement so the bust doesn't
                // visibly fly in from translate(-9999px, -9999px).
                const previousTransition = wrapper.style.transition;
                wrapper.style.transition = "none";
                wrapper.style.transform = nextTransform;
                wrapper.style.borderRadius = nextBorderRadius;
                wrapper.style.visibility = "visible";
                wrapper.dataset.anchor = active.id;
                // Force reflow before re-enabling transitions.
                void wrapper.offsetWidth;
                wrapper.style.transition = previousTransition;
                firstPlacement = false;
                lastTransform = nextTransform;
                lastBorderRadius = nextBorderRadius;
                lastAnchorId = active.id;
                lastVisible = true;
            } else {
                // CRITICAL: only write to style if the value actually changed.
                // Re-writing the same transform string restarts the transition.
                if (nextTransform !== lastTransform) {
                    wrapper.style.transform = nextTransform;
                    lastTransform = nextTransform;
                }
                if (nextBorderRadius !== lastBorderRadius) {
                    wrapper.style.borderRadius = nextBorderRadius;
                    lastBorderRadius = nextBorderRadius;
                }
                if (active.id !== lastAnchorId) {
                    wrapper.dataset.anchor = active.id;
                    lastAnchorId = active.id;
                }
                if (!lastVisible) {
                    wrapper.style.visibility = "visible";
                    lastVisible = true;
                }
            }

            rafId = requestAnimationFrame(tick);
        };

        // Kick off the poll. Slight delay so the initial DOM has time
        // to lay out (Tailwind classes computed, sm: breakpoints applied).
        rafId = requestAnimationFrame(tick);

        return () => {
            if (rafId) cancelAnimationFrame(rafId);
        };
    }, [mounted]);

    if (!mounted) return null;

    return (
        <div
            ref={wrapperRef}
            aria-hidden
            // All positioning/sizing/transition is inline-style so we
            // don't depend on Tailwind v4's arbitrary-value parser
            // handling commas inside `[transition:...]` correctly.
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: FIXED_SIZE,
                height: FIXED_SIZE,
                transform: "translate(-9999px, -9999px) scale(1)",
                transformOrigin: "0 0",
                pointerEvents: "none",
                overflow: "hidden",
                zIndex: 30,
                visibility: "hidden",
                // Emil-tuned drawer ease, deliberate ~420ms. Reduced-motion
                // is honored via the @media block below the component.
                transition:
                    "transform 420ms var(--ease-drawer), border-radius 420ms var(--ease-drawer)",
            }}
            className="shared-bust"
        >
            <BustAvatar
                className={[
                    // Override BustAvatar's intrinsic sizing — let the
                    // wrapper dimension and transform-scale govern.
                    "h-full w-full",
                    // Ditch its own border + radius; the shared wrapper
                    // owns those (and animates them).
                    "rounded-none border-0",
                ].join(" ")}
            />
            <style>{`
                @media (prefers-reduced-motion: reduce) {
                    .shared-bust { transition: none !important; }
                }
            `}</style>
        </div>
    );
}
