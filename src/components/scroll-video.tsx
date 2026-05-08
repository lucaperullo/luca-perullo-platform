"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "./use-reduced-motion";

export type ScrollVideoProps = {
    /**
     * Base URL up to (but not including) the zero-padded index.
     * Final frame URL = `${baseUrl}${pad(i, framePadding)}.${extension}`
     * where i goes from 1..frameCount.
     */
    baseUrl: string;
    /** Number of frames in the sequence. */
    frameCount: number;
    /** Index zero-padding, e.g. 4 → 0001. Default 4. */
    framePadding?: number;
    /** File extension without the dot. Default "webp". */
    extension?: string;
    /**
     * Total scroll distance the section consumes, in CSS units. The longer
     * this is, the slower the scrub. Default "250vh".
     */
    scrollHeight?: string;
    /** Aspect ratio of the canvas (CSS aspect-ratio). Default "16 / 9". */
    aspectRatio?: string;
    /** Max width of the canvas. Default "1200px". */
    maxWidth?: string;
    /**
     * Frames loaded eagerly before the component is considered "ready".
     * The rest are loaded in the background after the eager batch settles.
     * Default 12.
     */
    eagerFrameCount?: number;
    /**
     * Custom content rendered while the eager batch is loading. Ideally a
     * static placeholder representing roughly the same visual as frame 0.
     */
    loadingFallback?: ReactNode;
    /** Show a hairline progress bar at the bottom of the canvas while loading. Default true. */
    showProgressBar?: boolean;
    /** Optional className applied to the outer section. */
    className?: string;
    /** Optional className applied to the sticky canvas frame. */
    frameClassName?: string;
};

/**
 * Scroll-driven image-sequence player.
 *
 * Pattern:
 *  - The `<section>` is `scrollHeight` tall (e.g. 250vh) — the user must
 *    scroll through that much page to see the whole sequence.
 *  - Inside, a `position: sticky; top: 0` frame pins to the viewport while
 *    the section scrolls past, holding the canvas at the same place.
 *  - As the section's top crosses upward past the viewport, scroll progress
 *    goes 0 → 1, mapping to frame 0 → frameCount-1.
 *
 * Performance notes:
 *  - Frames preload as `Image` objects (no DOM mounts). First `eagerFrameCount`
 *    frames are loaded immediately; the rest after the eager batch settles,
 *    so the page becomes interactive fast and the rest stream in.
 *  - rAF-throttled scroll handler — at most one frame draw per animation tick.
 *  - We only redraw when `frameIndex` changes — no wasted GPU work.
 *  - Canvas is sized to the natural frame dimensions on first paint, then
 *    scaled by CSS — keeps drawImage fast.
 *  - prefers-reduced-motion: shows the first frame static, no scroll-pinning,
 *    no progress bar.
 */
export function ScrollVideo({
    baseUrl,
    frameCount,
    framePadding = 4,
    extension = "webp",
    scrollHeight = "250vh",
    aspectRatio = "16 / 9",
    maxWidth = "1200px",
    eagerFrameCount = 12,
    loadingFallback,
    showProgressBar = true,
    className,
    frameClassName,
}: ScrollVideoProps) {
    const sectionRef = useRef<HTMLElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const framesRef = useRef<HTMLImageElement[]>([]);
    const lastDrawnRef = useRef<number>(-1);
    const [eagerLoaded, setEagerLoaded] = useState(0);
    const reducedMotion = useReducedMotion();

    const frameUrl = useCallback(
        (i: number) => `${baseUrl}${String(i + 1).padStart(framePadding, "0")}.${extension}`,
        [baseUrl, framePadding, extension],
    );

    /** Preload frames: eager batch first (counted), then deferred batch. */
    useEffect(() => {
        if (frameCount <= 0) return;
        const eager = Math.min(eagerFrameCount, frameCount);
        const frames: HTMLImageElement[] = new Array(frameCount);
        let mounted = true;
        let eagerDoneCount = 0;

        const loadOne = (index: number, isEager: boolean) =>
            new Promise<HTMLImageElement>((resolve) => {
                const img = new Image();
                img.decoding = "async";
                if (isEager) {
                    // Hint the browser this batch is high-priority.
                    img.setAttribute("fetchpriority", "high");
                }
                img.onload = () => resolve(img);
                img.onerror = () => resolve(img); // resolve anyway so progress moves
                img.src = frameUrl(index);
                frames[index] = img;
            });

        const drawFirstWhenReady = () => {
            // Once frame 0 is decoded, draw it so the user sees something
            // even before the scroll listener has fired.
            const first = frames[0];
            if (first && first.complete && first.naturalWidth > 0) {
                drawFrame(0);
            }
        };

        const eagerPromises = Array.from({ length: eager }, async (_, i) => {
            const img = await loadOne(i, true);
            if (!mounted) return img;
            eagerDoneCount += 1;
            setEagerLoaded(eagerDoneCount);
            if (i === 0) drawFirstWhenReady();
            return img;
        });

        Promise.all(eagerPromises).then(() => {
            if (!mounted) return;
            // Defer the rest with `requestIdleCallback` if available, else
            // setTimeout — gives the eager batch room to render first.
            const startDeferred = () => {
                for (let i = eager; i < frameCount; i++) {
                    void loadOne(i, false);
                }
            };
            if (typeof window.requestIdleCallback === "function") {
                window.requestIdleCallback(startDeferred, { timeout: 1500 });
            } else {
                setTimeout(startDeferred, 250);
            }
        });

        framesRef.current = frames;
        return () => {
            mounted = false;
        };
    }, [frameCount, eagerFrameCount, frameUrl]);

    /** Draw a single frame to the canvas. No-op if the image isn't ready. */
    const drawFrame = useCallback((index: number) => {
        const canvas = canvasRef.current;
        const img = framesRef.current[index];
        if (!canvas || !img || !img.complete || img.naturalWidth === 0) return;

        // Resize the canvas to match the image natural size only once —
        // CSS handles the visible scaling.
        if (canvas.width !== img.naturalWidth || canvas.height !== img.naturalHeight) {
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
        }
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.drawImage(img, 0, 0);
        lastDrawnRef.current = index;
    }, []);

    /** Scroll → frame mapping. */
    useEffect(() => {
        if (reducedMotion) {
            // Show the first frame and stop.
            drawFrame(0);
            return;
        }
        if (typeof window === "undefined") return;

        let frame = 0;
        let scheduled = false;

        const update = () => {
            scheduled = false;
            const section = sectionRef.current;
            if (!section) return;
            const rect = section.getBoundingClientRect();
            const sectionHeight = section.offsetHeight;
            const viewportHeight = window.innerHeight;
            const scrollable = Math.max(1, sectionHeight - viewportHeight);
            const progress = Math.max(0, Math.min(1, -rect.top / scrollable));
            const targetIndex = Math.min(
                frameCount - 1,
                Math.floor(progress * frameCount),
            );
            // Walk towards target — if the target frame isn't loaded yet, use
            // the nearest loaded frame so we don't show empty canvas.
            let drawIndex = targetIndex;
            while (drawIndex > 0) {
                const img = framesRef.current[drawIndex];
                if (img && img.complete && img.naturalWidth > 0) break;
                drawIndex -= 1;
            }
            if (drawIndex !== lastDrawnRef.current) {
                drawFrame(drawIndex);
            }
        };

        const onScroll = () => {
            if (scheduled) return;
            scheduled = true;
            frame = requestAnimationFrame(update);
        };

        update();
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll);
        return () => {
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
            if (frame) cancelAnimationFrame(frame);
        };
    }, [drawFrame, frameCount, reducedMotion]);

    const eagerThreshold = Math.min(eagerFrameCount, frameCount);
    const ready = eagerLoaded >= Math.max(1, Math.min(2, eagerThreshold));
    const eagerProgress = eagerThreshold > 0 ? eagerLoaded / eagerThreshold : 1;

    return (
        <section
            ref={sectionRef}
            className={cn("relative w-full", className)}
            style={{
                height: reducedMotion ? "auto" : scrollHeight,
            }}
        >
            <div
                className={cn(
                    "sticky top-0 flex h-screen w-full items-center justify-center px-4 sm:px-6",
                    reducedMotion ? "static h-auto py-12" : null,
                    frameClassName,
                )}
            >
                <div
                    className="relative w-full overflow-hidden rounded-[12px] border border-border bg-bg-alt"
                    style={{ aspectRatio, maxWidth }}
                >
                    <canvas
                        ref={canvasRef}
                        aria-hidden
                        className={cn(
                            "block h-full w-full transition-opacity duration-300 ease-[var(--ease-out)]",
                            ready ? "opacity-100" : "opacity-0",
                        )}
                    />
                    {!ready ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                            {loadingFallback ?? (
                                <div className="flex flex-col items-center gap-3 text-center">
                                    <span className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-fg-soft">
                                        Loading frames
                                    </span>
                                    <span className="font-mono text-[12.5px] tabular-nums text-fg">
                                        {eagerLoaded} / {eagerThreshold}
                                    </span>
                                </div>
                            )}
                        </div>
                    ) : null}
                    {showProgressBar && !reducedMotion ? (
                        <div
                            aria-hidden
                            className={cn(
                                "pointer-events-none absolute inset-x-0 bottom-0 h-px bg-fg origin-left transition-opacity duration-500",
                                eagerProgress >= 1 ? "opacity-0" : "opacity-100",
                            )}
                            style={{ transform: `scaleX(${eagerProgress})` }}
                        />
                    ) : null}
                </div>
            </div>
        </section>
    );
}
