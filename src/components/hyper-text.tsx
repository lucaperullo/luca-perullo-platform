"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export type HyperTextProps = {
    children: string;
    /** Total scramble duration in ms. Default 800. */
    duration?: number;
    /** Wrapper element. Default `"p"`. */
    as?: "h1" | "h2" | "h3" | "p" | "span";
    /** Trigger scramble when the user hovers. Default true. */
    animateOnHover?: boolean;
    className?: string;
};

/**
 * <HyperText/> — characters flicker through random uppercase glyphs before
 * settling left-to-right on the final word. Mr Robot–style scramble.
 */
export function HyperText({
    children,
    duration = 800,
    as: Tag = "p",
    animateOnHover = true,
    className,
}: HyperTextProps) {
    const target = children;
    const [display, setDisplay] = useState(() => target.split(""));
    const rafRef = useRef<number | null>(null);
    const startRef = useRef<number>(0);

    const run = () => {
        if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
        startRef.current = performance.now();
        const tick = (now: number) => {
            const elapsed = now - startRef.current;
            const progress = Math.min(1, elapsed / duration);
            const settled = Math.floor(progress * target.length);
            const next = target.split("").map((ch, idx) => {
                if (idx < settled || ch === " ") return ch;
                return ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
            });
            setDisplay(next);
            if (progress < 1) {
                rafRef.current = requestAnimationFrame(tick);
            } else {
                setDisplay(target.split(""));
                rafRef.current = null;
            }
        };
        rafRef.current = requestAnimationFrame(tick);
    };

    useEffect(() => {
        run();
        return () => {
            if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [target, duration]);

    return (
        <Tag
            className={cn("inline-flex font-mono", className)}
            onPointerEnter={animateOnHover ? run : undefined}
        >
            {display.map((ch, i) => (
                <span key={i} className="inline-block">
                    {ch === " " ? " " : ch}
                </span>
            ))}
        </Tag>
    );
}
