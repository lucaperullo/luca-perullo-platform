"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export type FlickeringGridProps = {
    /** Side of each cell in px. Default 4. */
    squareSize?: number;
    /** Gap between cells in px. Default 6. */
    gridGap?: number;
    /** Per-frame chance any individual cell changes opacity. Default 0.3. */
    flickerChance?: number;
    /** Cell color. Default `var(--fg-soft)`. */
    color?: string;
    /** Cap on opacity. Default 0.5. */
    maxOpacity?: number;
    /** Override canvas width / height. Defaults to ResizeObserver auto-fit. */
    width?: number;
    height?: number;
    className?: string;
};

/**
 * <FlickeringGrid/> — canvas-based grid where each cell randomly flickers
 * between transparent and `maxOpacity`. Cheap (one canvas, requestAnimationFrame),
 * resize-aware via ResizeObserver. Reads global `prefers-reduced-motion`
 * to skip the animation when the user opted out.
 */
export function FlickeringGrid({
    squareSize = 4,
    gridGap = 6,
    flickerChance = 0.3,
    color = "var(--fg-soft)",
    maxOpacity = 0.5,
    width,
    height,
    className,
}: FlickeringGridProps) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const wrapperRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const wrapper = wrapperRef.current;
        if (!canvas || !wrapper) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const reduced =
            typeof window !== "undefined" &&
            window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

        const tmp = document.createElement("div");
        tmp.style.color = color;
        document.body.appendChild(tmp);
        const rgb = getComputedStyle(tmp).color;
        document.body.removeChild(tmp);

        let cols = 0;
        let rows = 0;
        let opacities: number[] = [];
        let dpr = window.devicePixelRatio || 1;

        const resize = () => {
            const rect = wrapper.getBoundingClientRect();
            const w = width ?? rect.width;
            const h = height ?? rect.height;
            canvas.width = w * dpr;
            canvas.height = h * dpr;
            canvas.style.width = `${w}px`;
            canvas.style.height = `${h}px`;
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.scale(dpr, dpr);
            cols = Math.floor(w / (squareSize + gridGap));
            rows = Math.floor(h / (squareSize + gridGap));
            opacities = new Array(cols * rows).fill(0).map(() => Math.random() * maxOpacity);
        };

        resize();
        const ro = new ResizeObserver(resize);
        ro.observe(wrapper);

        let raf = 0;
        const draw = () => {
            const w = canvas.width / dpr;
            const h = canvas.height / dpr;
            ctx.clearRect(0, 0, w, h);
            for (let y = 0; y < rows; y++) {
                for (let x = 0; x < cols; x++) {
                    const i = y * cols + x;
                    if (!reduced && Math.random() < flickerChance / 60) {
                        opacities[i] = Math.random() * maxOpacity;
                    }
                    const op = opacities[i] ?? 0;
                    ctx.fillStyle = rgb.startsWith("rgb")
                        ? rgb.replace(")", `, ${op})`).replace("rgb", "rgba")
                        : color;
                    ctx.globalAlpha = op;
                    ctx.fillRect(
                        x * (squareSize + gridGap),
                        y * (squareSize + gridGap),
                        squareSize,
                        squareSize,
                    );
                }
            }
            ctx.globalAlpha = 1;
            if (!reduced) raf = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            cancelAnimationFrame(raf);
            ro.disconnect();
        };
    }, [squareSize, gridGap, flickerChance, color, maxOpacity, width, height]);

    return (
        <div
            ref={wrapperRef}
            aria-hidden
            className={cn("pointer-events-none absolute inset-0", className)}
        >
            <canvas ref={canvasRef} className="block" />
        </div>
    );
}
