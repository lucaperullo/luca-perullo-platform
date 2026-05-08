"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export type TypingAnimationProps = {
    text: string;
    /** Milliseconds per character. Default 50. */
    duration?: number;
    /** Delay before typing starts in ms. Default 0. */
    delay?: number;
    /** Wrapper element. Default `"p"`. */
    as?: "h1" | "h2" | "h3" | "p" | "span";
    className?: string;
};

/**
 * <TypingAnimation/> — typewriter that reveals `text` character-by-character
 * with a blinking caret. Caret stops blinking once the string is complete.
 */
export function TypingAnimation({
    text,
    duration = 50,
    delay = 0,
    as: Tag = "p",
    className,
}: TypingAnimationProps) {
    const [shown, setShown] = useState("");
    const [done, setDone] = useState(false);

    useEffect(() => {
        setShown("");
        setDone(false);
        let i = 0;
        let intervalId: ReturnType<typeof setInterval> | undefined;
        const startId = setTimeout(() => {
            intervalId = setInterval(() => {
                i += 1;
                setShown(text.slice(0, i));
                if (i >= text.length) {
                    setDone(true);
                    if (intervalId) clearInterval(intervalId);
                }
            }, Math.max(8, duration));
        }, delay);
        return () => {
            clearTimeout(startId);
            if (intervalId) clearInterval(intervalId);
        };
    }, [text, duration, delay]);

    return (
        <>
            <style>{`
                @keyframes typing-caret-blink { 50% { opacity: 0; } }
            `}</style>
            <Tag className={cn("inline-flex items-baseline", className)}>
                <span>{shown}</span>
                <span
                    aria-hidden
                    className="ml-[2px] inline-block w-[1px] self-stretch bg-current"
                    style={{
                        animation: done
                            ? undefined
                            : "typing-caret-blink 1s steps(2) infinite",
                    }}
                />
            </Tag>
        </>
    );
}
