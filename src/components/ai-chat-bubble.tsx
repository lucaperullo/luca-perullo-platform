"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Bot, User } from "lucide-react";
import { CopyButton } from "./copy-button";
import { cn } from "@/lib/utils";

export type AiChatBubbleRole = "user" | "assistant" | "system";

export type AiChatBubbleProps = {
    role: AiChatBubbleRole;
    /** Content. Can be plain string (markdown auto-rendered) or arbitrary nodes. */
    children: string | ReactNode;
    /** When true, shows a blinking caret + skips final-state styling. */
    streaming?: boolean;
    /** Optional avatar slot (overrides default Bot/User icon). */
    avatar?: ReactNode;
    /** Show timestamp under the bubble. */
    timestamp?: string;
    /** Show "Copy" button on hover for assistant messages. Default true. */
    showCopy?: boolean;
    className?: string;
};

/**
 * <AiChatBubble/> — production-grade chat message bubble for AI apps.
 *
 * Handles the streaming case correctly: while `streaming=true` it shows a
 * blinking caret AND defers code-block syntax styling until streaming ends
 * (avoids flashing as language detection settles mid-stream). Markdown is
 * rendered safely with `react-markdown` + `remark-gfm` (already installed).
 *
 * The `assistant` variant gets the prominent visual treatment (border, bg);
 * `user` is right-aligned, denser; `system` is a quiet pill.
 */
export function AiChatBubble({
    role,
    children,
    streaming = false,
    avatar,
    timestamp,
    showCopy = true,
    className,
}: AiChatBubbleProps) {
    const isUser = role === "user";
    const isAssistant = role === "assistant";
    const isSystem = role === "system";

    const isString = typeof children === "string";
    const text = isString ? (children as string) : "";

    if (isSystem) {
        return (
            <div
                className={cn(
                    "mx-auto max-w-prose rounded-full border border-dashed border-border bg-bg-alt px-3 py-1.5 text-center font-mono text-[11px] text-fg-soft",
                    className,
                )}
                role="status"
            >
                {children}
            </div>
        );
    }

    return (
        <article
            data-role={role}
            className={cn(
                "group flex w-full gap-3",
                isUser ? "flex-row-reverse" : "flex-row",
                className,
            )}
        >
            {/* avatar */}
            <div
                aria-hidden
                className={cn(
                    "grid h-8 w-8 shrink-0 place-items-center rounded-full border",
                    isAssistant ? "border-border bg-bg-alt text-fg" : "border-border bg-bg text-fg-muted",
                )}
            >
                {avatar ?? (isAssistant ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />)}
            </div>

            <div
                className={cn(
                    "flex min-w-0 max-w-[78%] flex-col gap-1",
                    isUser ? "items-end" : "items-start",
                )}
            >
                <div
                    className={cn(
                        "relative rounded-[12px] px-4 py-2.5 text-[14.5px] leading-[1.6]",
                        isAssistant
                            ? "border border-border bg-bg-alt text-fg"
                            : "bg-fg text-bg",
                        isUser ? "rounded-br-[4px]" : "rounded-bl-[4px]",
                    )}
                >
                    {isString ? (
                        <ChatMarkdown text={text} streaming={streaming} />
                    ) : (
                        children
                    )}
                    {streaming ? (
                        <span
                            aria-hidden
                            data-streaming-caret
                            className={cn(
                                "ml-[2px] inline-block h-[1em] w-[2px] -translate-y-[1px] align-middle",
                                isAssistant ? "bg-fg" : "bg-bg",
                            )}
                            style={{ animation: "ai-caret-blink 1s steps(1) infinite" }}
                        />
                    ) : null}

                    {isAssistant && showCopy && !streaming && isString ? (
                        <span
                            className={cn(
                                "absolute -right-2 -top-2 opacity-0 transition-opacity duration-200",
                                "[transition-timing-function:var(--ease-out)]",
                                "group-hover:opacity-100",
                            )}
                        >
                            <CopyButton value={text} icon="copy" tone="ghost" iconOnly />
                        </span>
                    ) : null}
                </div>
                {timestamp ? (
                    <time className="font-mono text-[10px] text-fg-soft">{timestamp}</time>
                ) : null}
            </div>

            <style>{`@keyframes ai-caret-blink { 50% { opacity: 0; } }`}</style>
        </article>
    );
}

/**
 * Streaming-aware markdown. While `streaming` is true, code blocks render
 * un-highlighted (a `<pre><code>`) so language detection mid-stream doesn't
 * cause flashing. After streaming ends, the same content re-renders normally.
 */
function ChatMarkdown({ text, streaming }: { text: string; streaming: boolean }) {
    const detectIncompleteFence = useMemo(() => {
        // Odd number of triple-backtick fences = stream ended mid-codeblock.
        const fences = (text.match(/```/g) ?? []).length;
        return fences % 2 === 1;
    }, [text]);

    const safeText = streaming && detectIncompleteFence ? text + "\n```" : text;

    return (
        <div className="prose prose-sm dark:prose-invert max-w-none [&_pre]:my-2 [&_pre]:overflow-x-auto [&_pre]:rounded-md [&_pre]:bg-black/55 [&_pre]:p-3 [&_pre]:font-mono [&_pre]:text-[12.5px] [&_code]:font-mono [&_code:not(pre_*)]:rounded-sm [&_code:not(pre_*)]:bg-black/30 [&_code:not(pre_*)]:px-1 [&_code:not(pre_*)]:py-0.5 [&_p]:my-1.5 [&_p:first-child]:mt-0 [&_p:last-child]:mb-0">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{safeText}</ReactMarkdown>
        </div>
    );
}

/** Convenience wrapper for stream-driven mounting (typewriter via setState). */
export function useTypewriter(target: string, charsPerSec = 60) {
    const [out, setOut] = useState("");
    const ref = useRef(0);
    useEffect(() => {
        ref.current = 0;
        setOut("");
        if (!target) return;
        const tick = () => {
            ref.current += 1;
            if (ref.current >= target.length) {
                setOut(target);
                return;
            }
            setOut(target.slice(0, ref.current));
            id = window.setTimeout(tick, 1000 / charsPerSec);
        };
        let id = window.setTimeout(tick, 1000 / charsPerSec);
        return () => clearTimeout(id);
    }, [target, charsPerSec]);
    return { text: out, streaming: out.length < target.length };
}
