"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Sparkle = {
    id: number;
    x: number;
    y: number;
    size: number;
    color: string;
    delay: number;
    lifetime: number;
};

export type SparklesTextProps = {
    children: ReactNode;
    /** Active sparkles maintained at any given time. Default 8. */
    sparklesCount?: number;
    /** Two-color palette for the sparkles. */
    colors?: { first?: string; second?: string };
    className?: string;
};

const STAR_PATH =
    "M12 0 L13.5 9.5 L22.5 12 L13.5 14.5 L12 24 L10.5 14.5 L1.5 12 L10.5 9.5 Z";

/**
 * <SparklesText/> — children rendered with a fixed pool of 4-pointed
 * sparkles twinkling around the bounding box. Pure CSS scale + opacity.
 */
export function SparklesText({
    children,
    sparklesCount = 8,
    colors,
    className,
}: SparklesTextProps) {
    const idRef = useRef(0);
    const [sparkles, setSparkles] = useState<Sparkle[]>([]);
    const colorA = colors?.first ?? "var(--accent)";
    const colorB = colors?.second ?? "#f59e0b";

    useEffect(() => {
        const create = (): Sparkle => ({
            id: idRef.current++,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: 6 + Math.random() * 10,
            color: Math.random() > 0.5 ? colorA : colorB,
            delay: Math.random() * 1.2,
            lifetime: 1100 + Math.random() * 600,
        });

        setSparkles(Array.from({ length: sparklesCount }, create));

        const id = setInterval(() => {
            setSparkles((prev) => {
                const next = [...prev];
                const idx = Math.floor(Math.random() * next.length);
                next[idx] = create();
                return next;
            });
        }, 600);
        return () => clearInterval(id);
    }, [sparklesCount, colorA, colorB]);

    return (
        <>
            <style>{`
                @keyframes sparkles-text-pop {
                    0%   { transform: scale(0.05) rotate(0deg);   opacity: 0; }
                    50%  { transform: scale(1)    rotate(120deg); opacity: 1; }
                    100% { transform: scale(0.05) rotate(180deg); opacity: 0; }
                }
            `}</style>
            <span className={cn("relative inline-block", className)}>
                <span className="relative z-10">{children}</span>
                <span aria-hidden className="pointer-events-none absolute inset-0">
                    {sparkles.map((s) => (
                        <svg
                            key={s.id}
                            className="absolute"
                            width={s.size}
                            height={s.size}
                            viewBox="0 0 24 24"
                            style={{
                                left: `${s.x}%`,
                                top: `${s.y}%`,
                                fill: s.color,
                                animation: `sparkles-text-pop ${s.lifetime}ms var(--ease-in-out) ${s.delay}s infinite`,
                            }}
                        >
                            <path d={STAR_PATH} />
                        </svg>
                    ))}
                </span>
            </span>
        </>
    );
}
