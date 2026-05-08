"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type TextRevealProps = {
    children: string;
    className?: string;
};

/**
 * <TextReveal/> — splits `children` into words and lerps each one's color
 * from `--fg-soft` to `--fg` based on scroll progress through the container.
 * Word-by-word reveal driven by `scroll` listener (passive) — no IntersectionObserver
 * is necessary because the math is purely about viewport overlap.
 */
export function TextReveal({ children, className }: TextRevealProps) {
    const ref = useRef<HTMLParagraphElement | null>(null);
    const [progress, setProgress] = useState(0);
    const words = children.split(/\s+/).filter(Boolean);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const update = () => {
            const rect = el.getBoundingClientRect();
            const viewport = window.innerHeight || 1;
            const start = viewport;
            const end = -rect.height;
            const t = (rect.top - end) / (start - end);
            const clamped = Math.min(1, Math.max(0, 1 - t));
            setProgress(clamped);
        };

        update();
        window.addEventListener("scroll", update, { passive: true });
        window.addEventListener("resize", update);
        return () => {
            window.removeEventListener("scroll", update);
            window.removeEventListener("resize", update);
        };
    }, []);

    const reachedIndex = Math.floor(progress * words.length);

    return (
        <p
            ref={ref}
            className={cn(
                "text-2xl leading-relaxed font-medium tracking-tight",
                className,
            )}
        >
            {words.map((word, i) => {
                const lit = i < reachedIndex;
                return (
                    <span
                        key={`${word}-${i}`}
                        className="inline-block transition-colors duration-300 [transition-timing-function:var(--ease-out)]"
                        style={{ color: lit ? "var(--fg)" : "var(--fg-soft)" }}
                    >
                        {word}
                        {i < words.length - 1 ? " " : ""}
                    </span>
                );
            })}
        </p>
    );
}
