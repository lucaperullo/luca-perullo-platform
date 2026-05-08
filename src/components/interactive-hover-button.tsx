import type { ButtonHTMLAttributes, ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type InteractiveHoverButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    children: ReactNode;
    /** Label shown on hover. Defaults to repeating `children`. */
    hoverText?: ReactNode;
    className?: string;
};

/**
 * <InteractiveHoverButton/> — at rest: dot + label. On fine-pointer hover:
 * the accent dot expands rightward to fill the button, the rest label
 * slides off to the right, and a new label slides in from the left
 * with an arrow. CSS-only, gated to `hover: hover` so touch devices stay
 * still.
 */
export function InteractiveHoverButton({
    children,
    hoverText,
    className,
    ...rest
}: InteractiveHoverButtonProps) {
    return (
        <>
            <style>{`
                @media (hover: hover) and (pointer: fine) {
                    .ihb-shell:hover .ihb-fill   { transform: scaleX(1); }
                    .ihb-shell:hover .ihb-rest   { transform: translateX(140%); opacity: 0; }
                    .ihb-shell:hover .ihb-hover  { transform: translateX(0);    opacity: 1; }
                }
            `}</style>
            <button
                type="button"
                {...rest}
                className={cn(
                    "ihb-shell press group relative isolate inline-flex items-center justify-center",
                    "min-h-[44px] rounded-full pl-9 pr-5 py-2",
                    "border border-border-strong bg-bg-alt text-fg",
                    "font-sans text-sm font-medium",
                    "overflow-hidden",
                    className,
                )}
            >
                <span
                    aria-hidden
                    className="ihb-fill pointer-events-none absolute inset-0 origin-left -z-10 rounded-full bg-accent"
                    style={{
                        transform: "scaleX(0)",
                        transition: "transform 480ms var(--ease-out)",
                    }}
                />
                <span
                    aria-hidden
                    className="absolute left-3.5 top-1/2 size-1.5 -translate-y-1/2 rounded-full bg-accent"
                />
                <span
                    className="ihb-rest relative inline-flex items-center"
                    style={{
                        transition:
                            "transform 380ms var(--ease-out), opacity 240ms var(--ease-out)",
                    }}
                >
                    {children}
                </span>
                <span
                    className="ihb-hover absolute inset-0 inline-flex items-center justify-center gap-2 text-accent-fg"
                    style={{
                        transform: "translateX(-100%)",
                        opacity: 0,
                        transition:
                            "transform 380ms var(--ease-out), opacity 240ms var(--ease-out)",
                    }}
                >
                    <span>{hoverText ?? children}</span>
                    <ArrowRight className="size-4" aria-hidden />
                </span>
            </button>
        </>
    );
}
