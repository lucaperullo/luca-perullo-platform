"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export type WordRotateProps = {
    words: string[];
    /** Milliseconds each word stays visible. Default 2500. */
    duration?: number;
    className?: string;
};

/**
 * <WordRotate/> — cycles through `words`, swapping each with a translateY +
 * opacity transition. Inherits font sizing from the caller.
 */
export function WordRotate({ words, duration = 2500, className }: WordRotateProps) {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (words.length < 2) return;
        const id = setInterval(() => {
            setIndex((i) => (i + 1) % words.length);
        }, Math.max(800, duration));
        return () => clearInterval(id);
    }, [words.length, duration]);

    return (
        <>
            <style>{`
                @keyframes word-rotate-in {
                    from { transform: translate3d(0, 0.6em, 0); opacity: 0; filter: blur(2px); }
                    to   { transform: translate3d(0, 0, 0);    opacity: 1; filter: blur(0);   }
                }
            `}</style>
            <span className={cn("relative inline-block overflow-hidden align-baseline", className)}>
                <span
                    key={index}
                    className="inline-block"
                    style={{ animation: "word-rotate-in 380ms var(--ease-out) both" }}
                >
                    {words[index]}
                </span>
            </span>
        </>
    );
}
