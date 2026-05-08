"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export type MorphingTextProps = {
    texts: string[];
    /** Total cycle per word in ms (steady + transition). Default 2500. */
    duration?: number;
    className?: string;
};

/**
 * <MorphingText/> — two stacked layers cross-fade with a blur+opacity morph
 * between strings. Overlays each `text` in turn; the parent reserves space
 * via the longest string rendered as an invisible spacer.
 */
export function MorphingText({ texts, duration = 2500, className }: MorphingTextProps) {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (texts.length < 2) return;
        const id = setInterval(() => {
            setIndex((i) => (i + 1) % texts.length);
        }, Math.max(900, duration));
        return () => clearInterval(id);
    }, [texts.length, duration]);

    const longest = texts.reduce((a, b) => (b.length > a.length ? b : a), "");

    return (
        <>
            <style>{`
                @keyframes morphing-text-in {
                    0%   { opacity: 0; filter: blur(8px); transform: translateY(6px) scale(0.98); }
                    100% { opacity: 1; filter: blur(0);   transform: translateY(0)  scale(1);    }
                }
            `}</style>
            <span className={cn("relative inline-block align-baseline", className)}>
                <span aria-hidden className="invisible inline-block">
                    {longest}
                </span>
                <span
                    key={index}
                    className="absolute inset-0 inline-flex items-center justify-center"
                    style={{
                        animation: "morphing-text-in 700ms var(--ease-in-out) both",
                    }}
                >
                    {texts[index]}
                </span>
            </span>
        </>
    );
}
