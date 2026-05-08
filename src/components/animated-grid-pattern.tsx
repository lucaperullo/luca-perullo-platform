"use client";

import { useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Square = { id: number; pos: [number, number]; delay: number };

export type AnimatedGridPatternProps = {
    width?: number;
    height?: number;
    /** How many cells are lit at any given moment. Default 50. */
    numSquares?: number;
    /** Peak opacity of a lit square. Default 0.3. */
    maxOpacity?: number;
    /** Seconds per fade-in/out cycle. Default 4. */
    duration?: number;
    className?: string;
};

/**
 * <AnimatedGridPattern/> — same SVG line grid as `GridPattern` but with
 * random cells lighting up + fading every `duration` seconds. Pure CSS
 * `@keyframes` opacity, JS only schedules cell positions.
 */
export function AnimatedGridPattern({
    width = 40,
    height = 40,
    numSquares = 50,
    maxOpacity = 0.3,
    duration = 4,
    className,
}: AnimatedGridPatternProps) {
    const id = useId();
    const idRef = useRef(0);
    const [size, setSize] = useState<{ w: number; h: number }>({ w: 0, h: 0 });
    const [squares, setSquares] = useState<Square[]>([]);
    const containerRef = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const ro = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const { width: w, height: h } = entry.contentRect;
                setSize({ w, h });
            }
        });
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    useEffect(() => {
        if (size.w === 0 || size.h === 0) return;
        const cols = Math.ceil(size.w / width);
        const rows = Math.ceil(size.h / height);
        if (cols === 0 || rows === 0) return;
        const create = (): Square => ({
            id: idRef.current++,
            pos: [Math.floor(Math.random() * cols), Math.floor(Math.random() * rows)],
            delay: Math.random() * duration,
        });
        setSquares(Array.from({ length: numSquares }, create));
        const refresh = setInterval(() => {
            setSquares((prev) =>
                prev.map((s) =>
                    Math.random() > 0.7 ? create() : s,
                ),
            );
        }, duration * 1000);
        return () => clearInterval(refresh);
    }, [size.w, size.h, width, height, numSquares, duration]);

    return (
        <>
            <style>{`
                @keyframes animated-grid-pattern-fade {
                    0%, 100% { opacity: 0; }
                    50%      { opacity: var(--agp-max, 0.3); }
                }
            `}</style>
            <svg
                ref={containerRef}
                aria-hidden
                className={cn(
                    "pointer-events-none absolute inset-0 h-full w-full text-border",
                    className,
                )}
                style={{ "--agp-max": maxOpacity } as React.CSSProperties}
            >
                <defs>
                    <pattern id={id} width={width} height={height} patternUnits="userSpaceOnUse">
                        <path d={`M.5 ${height}V.5H${width}`} fill="none" stroke="currentColor" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill={`url(#${id})`} />
                {squares.map((s) => (
                    <rect
                        key={s.id}
                        width={width - 1}
                        height={height - 1}
                        x={s.pos[0] * width + 1}
                        y={s.pos[1] * height + 1}
                        fill="currentColor"
                        strokeWidth={0}
                        style={{
                            animation: `animated-grid-pattern-fade ${duration}s linear ${s.delay}s infinite`,
                        }}
                    />
                ))}
            </svg>
        </>
    );
}
