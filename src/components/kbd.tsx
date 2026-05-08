import { Fragment, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export type KbdProps = {
    /** Single key or array of keys to be joined with `+`. */
    keys: string | string[];
    /** Glyph used between keys. Defaults to "+". */
    separator?: string;
    /** Inline `code`-like sizing variant. */
    size?: "sm" | "md";
    className?: string;
};

const KEY_GLYPHS: Record<string, string> = {
    cmd: "⌘",
    meta: "⌘",
    shift: "⇧",
    alt: "⌥",
    option: "⌥",
    ctrl: "⌃",
    control: "⌃",
    enter: "↵",
    return: "↵",
    esc: "⎋",
    escape: "⎋",
    tab: "⇥",
    space: "␣",
    up: "↑",
    down: "↓",
    left: "←",
    right: "→",
    backspace: "⌫",
    delete: "⌦",
};

function formatKey(k: string): ReactNode {
    const glyph = KEY_GLYPHS[k.toLowerCase()];
    if (glyph) {
        return (
            <>
                <span aria-hidden>{glyph}</span>
                <span className="sr-only">{k}</span>
            </>
        );
    }
    return k.length === 1 ? k.toUpperCase() : k;
}

export function Kbd({ keys, separator = "+", size = "md", className }: KbdProps) {
    const list = Array.isArray(keys) ? keys : [keys];
    const sizeClasses =
        size === "sm"
            ? "min-h-5 min-w-5 px-1 text-[10px]"
            : "min-h-[22px] min-w-[22px] px-1.5 text-[11px]";

    return (
        <span className={cn("inline-flex items-center gap-1 align-middle", className)}>
            {list.map((k, i) => (
                <Fragment key={`${k}-${i}`}>
                    {i > 0 ? (
                        <span aria-hidden className="font-mono text-[11px] text-fg-soft">
                            {separator}
                        </span>
                    ) : null}
                    <kbd
                        className={cn(
                            "inline-flex items-center justify-center rounded-[5px] border border-border bg-bg-alt font-mono uppercase tracking-[0.05em] text-fg shadow-[0_1px_0_0_var(--border-strong)]",
                            sizeClasses,
                        )}
                    >
                        {formatKey(k)}
                    </kbd>
                </Fragment>
            ))}
        </span>
    );
}
