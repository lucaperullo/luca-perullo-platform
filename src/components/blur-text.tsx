"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { prefersReducedMotion } from "./use-reduced-motion";

export type BlurTextProps = {
    text: string;
    /** Split granularity. "word" reads better; "char" is more dramatic. Default "word". */
    split?: "word" | "char";
    /** Per-token stagger (ms). Default 60. */
    stagger?: number;
    /** Total animation duration per token (ms). Default 700. */
    duration?: number;
    /** Trigger on view (IntersectionObserver) or immediately on mount. Default "view". */
    trigger?: "view" | "mount";
    /** Tag rendered. Default "p". */
    as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
    className?: string;
};

/**
 * <BlurText/> — word/char tokens animate from blurred-and-offset to focused.
 * Triggered when the element scrolls into view (or immediately).
 *
 * Pure CSS keyframes + IntersectionObserver — no Framer Motion needed.
 * Honours `prefers-reduced-motion` automatically (renders static).
 */
export function BlurText({
    text,
    split = "word",
    stagger = 60,
    duration = 700,
    trigger = "view",
    as: Tag = "p",
    className,
}: BlurTextProps) {
    const ref = useRef<HTMLElement | null>(null);
    const [shown, setShown] = useState(trigger === "mount");

    useEffect(() => {
        if (trigger !== "view" || shown) return;
        // Reduced-motion is handled globally in globals.css; we still snap shown
        // to true here so the text is visible immediately, not held in the
        // pre-reveal state with a 0ms transition.
        if (prefersReducedMotion()) {
            setShown(true);
            return;
        }
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            (entries) => {
                if (entries.some((e) => e.isIntersecting)) {
                    setShown(true);
                    obs.disconnect();
                }
            },
            { threshold: 0.2 },
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, [trigger, shown]);

    const tokens =
        split === "char"
            ? Array.from(text).map((c) => (c === " " ? " " : c))
            : text.split(/(\s+)/); // keep spaces as own tokens so layout stays intact

    return (
        <Tag
            ref={ref as React.RefObject<never>}
            className={cn("inline-block leading-[1.15]", className)}
            aria-label={text}
        >
            {tokens.map((tok, i) => {
                const isSpace = /^\s+$/.test(tok);
                if (isSpace) return <span key={i}>{tok}</span>;
                return (
                    <span
                        key={i}
                        aria-hidden
                        className="inline-block will-change-[filter,transform,opacity]"
                        style={{
                            transition: `filter ${duration}ms var(--ease-out), transform ${duration}ms var(--ease-out), opacity ${duration}ms var(--ease-out)`,
                            transitionDelay: `${i * stagger}ms`,
                            filter: shown ? "blur(0)" : "blur(10px)",
                            transform: shown ? "translateY(0)" : "translateY(0.4em)",
                            opacity: shown ? 1 : 0,
                        }}
                    >
                        {tok}
                    </span>
                );
            })}
        </Tag>
    );
}
