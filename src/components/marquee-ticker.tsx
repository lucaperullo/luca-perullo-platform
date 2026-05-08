import { Children, Fragment, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export type MarqueeTickerProps = {
    children: ReactNode;
    /** Optional fixed kicker pill on the left, doesn't scroll. */
    kicker?: string;
    /** Tone — "muted" sits on bg-alt; "invert" inverts to fg/bg-fg (newspaper feel). */
    tone?: "muted" | "invert";
    /** Loop time in seconds. Default 22 (faster than the base marquee). */
    durationSec?: number;
    /** Gap between items in CSS units. Default "1.25rem". */
    gap?: string;
    /** Glyph used between items. Default "•". */
    separator?: string;
    /** Pause on hover. Default true. */
    pauseOnHover?: boolean;
    /** Direction. Default "left". */
    direction?: "left" | "right";
    className?: string;
};

/**
 * Newscaster-style ticker — single thin row, mono small-caps, bullet separators.
 *
 * Motion notes (Emil playbook):
 *  - Faster than the base Marquee because the strip is thinner: at 22s it
 *    feels lively without being distracting.
 *  - Uses the same marquee-x keyframe as the base — only chrome differs.
 *  - Pause on hover so a reader can land on a specific bullet.
 */
export function MarqueeTicker({
    children,
    kicker,
    tone = "muted",
    durationSec = 22,
    gap = "1.25rem",
    separator = "•",
    pauseOnHover = true,
    direction = "left",
    className,
}: MarqueeTickerProps) {
    const items = Children.toArray(children).filter(Boolean);
    if (items.length === 0) return null;

    const reverse = direction === "right";

    const wrapTone =
        tone === "invert"
            ? "border-fg bg-fg text-bg"
            : "border-border bg-bg-alt text-fg-muted";
    const kickerTone =
        tone === "invert"
            ? "bg-bg text-fg"
            : "bg-fg text-bg";
    const sepTone = tone === "invert" ? "text-bg/40" : "text-fg-soft";

    const renderRow = (key: string) => (
        <div
            key={key}
            className={cn(
                "flex shrink-0 items-center will-change-transform",
                pauseOnHover ? "group-hover/ticker:[animation-play-state:paused]" : null,
            )}
            style={{
                gap,
                paddingRight: gap,
                animation: `marquee-x var(--marquee-duration, ${durationSec}s) linear infinite ${reverse ? "reverse" : "normal"}`,
            }}
        >
            {items.map((node, i) => (
                <Fragment key={`${key}-${i}`}>
                    <span className="inline-flex items-center font-mono text-[11px] uppercase tracking-[0.06em] whitespace-nowrap">
                        {node}
                    </span>
                    <span aria-hidden className={cn("font-mono text-[11px]", sepTone)}>
                        {separator}
                    </span>
                </Fragment>
            ))}
        </div>
    );

    return (
        <div
            role="presentation"
            className={cn(
                "group/ticker flex w-full items-stretch overflow-hidden rounded-md border",
                wrapTone,
                className,
            )}
            style={{
                ["--marquee-duration" as string]: `${durationSec}s`,
                ["--marquee-gap" as string]: gap,
            }}
        >
            {kicker ? (
                <span
                    className={cn(
                        "inline-flex shrink-0 items-center px-3 font-mono text-[10px] uppercase tracking-[0.12em]",
                        kickerTone,
                    )}
                >
                    {kicker}
                </span>
            ) : null}
            <div
                className="relative flex min-w-0 flex-1 overflow-hidden py-1.5"
                style={{
                    WebkitMaskImage:
                        "linear-gradient(to right, transparent, black 5%, black 95%, transparent)",
                    maskImage:
                        "linear-gradient(to right, transparent, black 5%, black 95%, transparent)",
                }}
            >
                {renderRow("a")}
                {renderRow("b")}
            </div>
        </div>
    );
}
