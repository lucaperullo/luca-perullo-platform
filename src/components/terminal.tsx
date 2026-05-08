"use client";

import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export type TerminalProps = {
    children: ReactNode;
    /** Optional title displayed in the top bar. */
    title?: string;
    className?: string;
};

/**
 * <Terminal/> — terminal window mockup with traffic-light dots and a
 * monospace body. Pair with `<TerminalCommand/>`, `<TerminalOutput/>`,
 * and `<TerminalTyping/>` to compose a session.
 */
export function Terminal({ children, title = "zsh", className }: TerminalProps) {
    return (
        <div
            className={cn(
                "overflow-hidden rounded-md border border-border bg-zinc-950 text-zinc-100 shadow-sm",
                className,
            )}
        >
            <div className="flex h-8 items-center gap-2 border-b border-zinc-800 px-3">
                <span className="h-3 w-3 rounded-full bg-red-500" />
                <span className="h-3 w-3 rounded-full bg-amber-400" />
                <span className="h-3 w-3 rounded-full bg-emerald-500" />
                <span className="ml-2 font-mono text-[11px] text-zinc-500">{title}</span>
            </div>
            <div className="space-y-1 p-4 font-mono text-[12px] leading-relaxed">
                {children}
            </div>
        </div>
    );
}

export function TerminalCommand({ children }: { children: ReactNode }) {
    return (
        <p className="font-mono text-emerald-400">
            <span className="select-none text-zinc-500">$ </span>
            {children}
        </p>
    );
}

export function TerminalOutput({ children }: { children: ReactNode }) {
    return <p className="whitespace-pre-wrap font-mono text-zinc-400">{children}</p>;
}

export type TerminalTypingProps = {
    text: string;
    /** Delay before typing starts in ms. Default 0. */
    delay?: number;
    /** Milliseconds per character. Default 35. */
    speed?: number;
};

/**
 * <TerminalTyping/> — typewriter inside a Terminal body. Echoes a `$ `
 * prompt and types out `text` char by char.
 */
export function TerminalTyping({ text, delay = 0, speed = 35 }: TerminalTypingProps) {
    const [shown, setShown] = useState("");
    const [done, setDone] = useState(false);

    useEffect(() => {
        setShown("");
        setDone(false);
        let i = 0;
        let id: ReturnType<typeof setInterval> | undefined;
        const start = setTimeout(() => {
            id = setInterval(() => {
                i += 1;
                setShown(text.slice(0, i));
                if (i >= text.length) {
                    setDone(true);
                    if (id) clearInterval(id);
                }
            }, Math.max(8, speed));
        }, delay);
        return () => {
            clearTimeout(start);
            if (id) clearInterval(id);
        };
    }, [text, delay, speed]);

    return (
        <>
            <style>{`
                @keyframes terminal-caret-blink { 50% { opacity: 0; } }
            `}</style>
            <p className="font-mono text-emerald-400">
                <span className="select-none text-zinc-500">$ </span>
                {shown}
                <span
                    aria-hidden
                    className="ml-[2px] inline-block h-[1em] w-[1px] translate-y-[2px] bg-emerald-400 align-middle"
                    style={{
                        animation: done ? undefined : "terminal-caret-blink 1s steps(2) infinite",
                    }}
                />
            </p>
        </>
    );
}
