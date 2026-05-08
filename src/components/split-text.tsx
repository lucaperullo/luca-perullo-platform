"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { prefersReducedMotion } from "./use-reduced-motion";

export type SplitTextProps = {
    text: string;
    /** "char" reads heroic; "word" is faster. Default "char". */
    split?: "char" | "word";
    stagger?: number;
    duration?: number;
    trigger?: "view" | "mount";
    /** Reveal direction. Default "up". */
    direction?: "up" | "down" | "left" | "right";
    as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
    className?: string;
};

const TRANSFORMS = {
    up: "translateY(0.6em)",
    down: "translateY(-0.6em)",
    left: "translateX(0.6em)",
    right: "translateX(-0.6em)",
};

/**
 * <SplitText/> — per-character (or per-word) reveal that slides into place
 * with overflow-clip on the wrapper so each token wipes in from below.
 *
 * Pure CSS, no Framer Motion. Honours prefers-reduced-motion.
 */
export function SplitText({
    text,
    split = "char",
    stagger = 35,
    duration = 700,
    trigger = "view",
    direction = "up",
    as: Tag = "p",
    className,
}: SplitTextProps) {
    const ref = useRef<HTMLElement | null>(null);
    const [shown, setShown] = useState(trigger === "mount");

    useEffect(() => {
        if (trigger !== "view" || shown) return;
        const reduced = prefersReducedMotion();
        if (reduced) {
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
            { threshold: 0.25 },
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, [trigger, shown]);

    const tokens =
        split === "char"
            ? Array.from(text).map((c) => (c === " " ? " " : c))
            : text.split(/(\s+)/);

    return (
        <Tag
            ref={ref as React.RefObject<never>}
            className={cn("inline-block leading-[1.05]", className)}
            aria-label={text}
        >
            {tokens.map((tok, i) => {
                const isSpace = /^\s+$/.test(tok);
                if (isSpace) return <span key={i}>{tok}</span>;
                return (
                    <span
                        key={i}
                        aria-hidden
                        className="inline-block overflow-hidden align-bottom"
                    >
                        <span
                            className="inline-block will-change-transform"
                            style={{
                                transition: `transform ${duration}ms var(--ease-out), opacity ${duration / 2}ms var(--ease-out)`,
                                transitionDelay: `${i * stagger}ms`,
                                transform: shown ? "translate(0,0)" : TRANSFORMS[direction],
                                opacity: shown ? 1 : 0,
                            }}
                        >
                            {tok}
                        </span>
                    </span>
                );
            })}
        </Tag>
    );
}
