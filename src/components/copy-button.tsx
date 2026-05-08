"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Check, Copy, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "primary" | "secondary" | "ghost";

export type CopyButtonProps = {
    value: string;
    label?: string;
    copiedLabel?: string;
    /** Visual variant. */
    tone?: Tone;
    /** Replace the leading icon. Default is Copy → Check on success. */
    icon?: "copy" | "prompt";
    className?: string;
    /** Render as a small icon-only button (square 32px). Hides the label visually but keeps it for screen readers. */
    iconOnly?: boolean;
    /** Optional aria-label override. */
    ariaLabel?: string;
};

const TONE_CLASSES: Record<Tone, string> = {
    primary:
        "border border-fg bg-fg text-bg hover:bg-fg/90",
    secondary:
        "border border-border bg-bg text-fg hover:bg-bg-alt",
    ghost:
        "border border-transparent bg-transparent text-fg-muted hover:bg-bg-alt hover:text-fg",
};

/**
 * Motion notes (Emil playbook):
 *  - :active applies scale(0.97) for tactile press feedback (160ms ease-out).
 *  - The icon and the label crossfade with a short blur during state change.
 *    Blur masks the visual gap between two distinct icons (Copy → Check),
 *    which would otherwise read as two objects swapping rather than one
 *    morphing.
 *  - Width is intentionally NOT animated — the label is the same length
 *    in IT ("Copy" vs "Copiato" — close enough). Animating width would
 *    reflow neighbours mid-press.
 *  - prefers-reduced-motion: globals.css collapses transitions, so the
 *    state change becomes instant for users who opt out.
 */
export function CopyButton({
    value,
    label = "Copy",
    copiedLabel = "Copiato",
    tone = "secondary",
    icon = "copy",
    className,
    iconOnly = false,
    ariaLabel,
}: CopyButtonProps) {
    const [copied, setCopied] = useState(false);
    const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        return () => {
            if (timeout.current) clearTimeout(timeout.current);
        };
    }, []);

    const handle = useCallback(async () => {
        try {
            if (typeof navigator !== "undefined" && navigator.clipboard) {
                await navigator.clipboard.writeText(value);
            } else {
                const ta = document.createElement("textarea");
                ta.value = value;
                ta.style.position = "fixed";
                ta.style.opacity = "0";
                document.body.appendChild(ta);
                ta.select();
                document.execCommand("copy");
                document.body.removeChild(ta);
            }
            setCopied(true);
            if (timeout.current) clearTimeout(timeout.current);
            timeout.current = setTimeout(() => setCopied(false), 1600);
        } catch {
            /* swallow — UI stays in default state */
        }
    }, [value]);

    const PromptIcon = icon === "prompt" ? Sparkles : Copy;

    return (
        <button
            type="button"
            onClick={handle}
            aria-label={ariaLabel ?? (copied ? copiedLabel : label)}
            aria-live="polite"
            data-copied={copied || undefined}
            className={cn(
                "group/copy inline-flex shrink-0 items-center gap-1.5 rounded-md font-medium",
                "transition-[transform,background-color,border-color,color] duration-[160ms] ease-[var(--ease-out)] active:scale-[0.97]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fg/30",
                iconOnly ? "h-8 w-8 justify-center" : "px-3 py-1.5 text-[13px]",
                TONE_CLASSES[tone],
                className,
            )}
        >
            {/* Icon stack — both icons live in the same slot; we crossfade
                with a small blur so it reads as a morph, not a swap. */}
            <span className="relative inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center">
                <PromptIcon
                    className={cn(
                        "absolute h-3.5 w-3.5 transition-[opacity,transform,filter] duration-200 ease-[var(--ease-out)]",
                        copied
                            ? "opacity-0 scale-75 blur-[2px]"
                            : "opacity-100 scale-100 blur-0",
                    )}
                    aria-hidden
                />
                <Check
                    className={cn(
                        "absolute h-3.5 w-3.5 text-emerald-500 transition-[opacity,transform,filter] duration-200 ease-[var(--ease-out)]",
                        copied
                            ? "opacity-100 scale-100 blur-0"
                            : "opacity-0 scale-75 blur-[2px]",
                    )}
                    aria-hidden
                />
            </span>

            {iconOnly ? (
                <span className="sr-only">{copied ? copiedLabel : label}</span>
            ) : (
                <span className="relative inline-block">
                    {/* Both labels stack — crossfade between them with blur.
                        Width takes the longer of the two so layout never reflows. */}
                    <span aria-hidden className="invisible whitespace-nowrap">
                        {label.length >= copiedLabel.length ? label : copiedLabel}
                    </span>
                    <span
                        className={cn(
                            "absolute inset-0 flex items-center justify-center whitespace-nowrap transition-[opacity,filter] duration-200 ease-[var(--ease-out)]",
                            copied ? "opacity-0 blur-[2px]" : "opacity-100 blur-0",
                        )}
                    >
                        {label}
                    </span>
                    <span
                        className={cn(
                            "absolute inset-0 flex items-center justify-center whitespace-nowrap transition-[opacity,filter] duration-200 ease-[var(--ease-out)]",
                            copied ? "opacity-100 blur-0" : "opacity-0 blur-[2px]",
                        )}
                    >
                        {copiedLabel}
                    </span>
                </span>
            )}
        </button>
    );
}
