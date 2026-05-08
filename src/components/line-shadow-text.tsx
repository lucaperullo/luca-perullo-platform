import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type LineShadowTextProps = {
    children: string;
    /** Tag the headline renders as. Default `"h1"`. */
    as?: "h1" | "h2" | "h3" | "span";
    /** Color of the diagonal-stripe shadow. Default `var(--fg-muted)`. */
    shadowColor?: string;
    className?: string;
};

/**
 * <LineShadowText/> — headline with a diagonal-stripe-pattern offset shadow
 * (editorial "letterpress with hatch fill" treatment). The shadow is a
 * `::before` rendered via `data-text` and clipped to text using
 * `background-clip: text` over a repeating-linear-gradient.
 */
export function LineShadowText({
    children,
    as: Tag = "h1",
    shadowColor = "var(--fg-muted)",
    className,
}: LineShadowTextProps) {
    const cssVars = { "--lst-shadow": shadowColor } as CSSProperties;
    return (
        <>
            <style>{`
                .line-shadow-text { position: relative; isolation: isolate; }
                .line-shadow-text::before {
                    content: attr(data-text);
                    position: absolute;
                    inset: 0;
                    transform: translate(2px, 4px);
                    background-image: repeating-linear-gradient(
                        -45deg,
                        var(--lst-shadow, currentColor) 0,
                        var(--lst-shadow, currentColor) 1px,
                        transparent 1px,
                        transparent 4px
                    );
                    background-clip: text;
                    -webkit-background-clip: text;
                    color: transparent;
                    -webkit-text-fill-color: transparent;
                    z-index: -1;
                    pointer-events: none;
                }
            `}</style>
            <Tag
                data-text={children}
                className={cn("line-shadow-text", className)}
                style={cssVars}
            >
                {children}
            </Tag>
        </>
    );
}
