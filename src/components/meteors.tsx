"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";

export type MeteorsProps = {
    /** How many meteors to render. Default 20. */
    number?: number;
    className?: string;
};

/**
 * <Meteors/> — falling diagonal meteor streaks (dot + tapered tail).
 * Each meteor sits at a random x with a random delay, falling
 * top-right → bottom-left over 5–8 seconds. Pure CSS keyframes.
 */
export function Meteors({ number = 20, className }: MeteorsProps) {
    const meteors = useMemo(
        () =>
            Array.from({ length: number }).map((_, i) => ({
                id: i,
                top: -10 + Math.random() * 20,
                left: Math.random() * 100,
                duration: 5 + Math.random() * 3,
                delay: Math.random() * 4,
            })),
        [number],
    );

    return (
        <>
            <style>{`
                @keyframes meteors-fall {
                    from { transform: translate(0, 0) rotate(135deg);          opacity: 1; }
                    to   { transform: translate(-450px, 450px) rotate(135deg); opacity: 0; }
                }
            `}</style>
            <div
                aria-hidden
                className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
            >
                {meteors.map((m) => (
                    <span
                        key={m.id}
                        className="absolute h-[2px] w-[2px] rounded-full bg-fg before:absolute before:right-full before:top-1/2 before:h-[1px] before:w-[80px] before:-translate-y-1/2 before:bg-gradient-to-l before:from-fg before:to-transparent"
                        style={{
                            top: `${m.top}%`,
                            left: `${m.left}%`,
                            animation: `meteors-fall ${m.duration}s linear ${m.delay}s infinite`,
                        }}
                    />
                ))}
            </div>
        </>
    );
}
