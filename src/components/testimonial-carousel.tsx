"use client";

import { useEffect, useRef, useState } from "react";
import { Quote } from "lucide-react";
import { cn } from "@/lib/utils";

export type Testimonial = {
    quote: string;
    name: string;
    role?: string;
    avatar?: string;
};

export type TestimonialCarouselProps = {
    items: Testimonial[];
    /** Auto-advance interval in ms. Set to 0 to disable. Default 5500. */
    intervalMs?: number;
    className?: string;
};

/**
 * <TestimonialCarousel/> — auto-advancing testimonial slider with cross-fade
 * transitions, dot indicators, prev/next via keyboard, and pause-on-hover.
 *
 * Pure CSS opacity transitions — no JS animation library. Respects
 * `prefers-reduced-motion` (snaps instead of fading).
 */
export function TestimonialCarousel({
    items,
    intervalMs = 5500,
    className,
}: TestimonialCarouselProps) {
    const [idx, setIdx] = useState(0);
    const [paused, setPaused] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (intervalMs <= 0 || paused || items.length <= 1) return;
        const id = setInterval(() => setIdx((i) => (i + 1) % items.length), intervalMs);
        return () => clearInterval(id);
    }, [intervalMs, paused, items.length]);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const onKey = (e: KeyboardEvent) => {
            if (document.activeElement !== el && !el.contains(document.activeElement)) return;
            if (e.key === "ArrowLeft") setIdx((i) => (i - 1 + items.length) % items.length);
            if (e.key === "ArrowRight") setIdx((i) => (i + 1) % items.length);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [items.length]);

    if (items.length === 0) return null;

    return (
        <div
            ref={ref}
            tabIndex={0}
            role="region"
            aria-roledescription="carousel"
            aria-label="Testimonianze"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
            className={cn(
                "relative overflow-hidden rounded-[10px] border border-border bg-bg-alt p-6 sm:p-8",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-fg/40",
                className,
            )}
        >
            <Quote className="mb-3 h-5 w-5 text-fg-soft" aria-hidden />

            <div className="relative min-h-[140px]" aria-live="polite" aria-atomic="true">
                {items.map((t, i) => (
                    <article
                        key={i}
                        aria-hidden={i !== idx}
                        className={cn(
                            "absolute inset-0 transition-opacity duration-500",
                            "[transition-timing-function:var(--ease-out)]",
                            i === idx ? "opacity-100" : "pointer-events-none opacity-0",
                        )}
                    >
                        <p className="text-[15.5px] leading-[1.65] text-fg">
                            “{t.quote}”
                        </p>
                        <footer className="mt-4 flex items-center gap-3">
                            {t.avatar ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={t.avatar}
                                    alt=""
                                    className="h-9 w-9 rounded-full border border-border object-cover"
                                />
                            ) : (
                                <span className="grid h-9 w-9 place-items-center rounded-full border border-border bg-bg font-mono text-[12px] text-fg-muted">
                                    {t.name[0]}
                                </span>
                            )}
                            <div className="flex flex-col">
                                <span className="text-[13px] font-medium text-fg">{t.name}</span>
                                {t.role ? (
                                    <span className="font-mono text-[10.5px] uppercase tracking-[0.06em] text-fg-soft">
                                        {t.role}
                                    </span>
                                ) : null}
                            </div>
                        </footer>
                    </article>
                ))}
            </div>

            <div className="mt-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-1" role="tablist">
                    {items.map((_, i) => (
                        <button
                            key={i}
                            type="button"
                            role="tab"
                            aria-selected={i === idx}
                            aria-label={`Testimonianza ${i + 1}`}
                            onClick={() => setIdx(i)}
                            className={cn(
                                "press group relative grid h-11 w-11 place-items-center",
                                "before:absolute before:inset-1/2 before:-translate-x-1/2 before:-translate-y-1/2",
                                "before:h-1.5 before:rounded-full before:transition-all before:duration-300",
                                "before:[transition-timing-function:var(--ease-out)]",
                                i === idx
                                    ? "before:w-6 before:bg-fg"
                                    : "before:w-1.5 before:bg-border-strong hover:before:bg-fg-muted",
                            )}
                        />
                    ))}
                </div>
                <span className="font-mono text-[10.5px] text-fg-soft">
                    {idx + 1}/{items.length}
                </span>
            </div>
        </div>
    );
}
