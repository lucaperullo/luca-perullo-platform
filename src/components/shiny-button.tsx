import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type ShinyButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    children: ReactNode;
    className?: string;
};

/**
 * <ShinyButton/> — solid inverted button with a glossy diagonal sweep that
 * appears only on fine-pointer hover. Pure CSS, no JS. The sweep is a
 * `::before`-equivalent absolutely-positioned span with a gradient, hidden
 * off-screen and translated across on hover.
 */
export function ShinyButton({ children, className, ...rest }: ShinyButtonProps) {
    return (
        <>
            <style>{`
                @media (hover: hover) and (pointer: fine) {
                    .shiny-button-shell:hover .shiny-button-sweep {
                        transform: translateX(150%);
                    }
                }
            `}</style>
            <button
                type="button"
                {...rest}
                className={cn(
                    "shiny-button-shell press relative isolate inline-flex items-center justify-center gap-2",
                    "min-h-[44px] rounded-md px-5 py-2",
                    "border border-border-strong bg-fg text-bg",
                    "font-sans text-sm font-medium",
                    "overflow-hidden",
                    className,
                )}
            >
                <span
                    aria-hidden
                    className="shiny-button-sweep pointer-events-none absolute inset-y-0 -left-[60%] w-[60%]"
                    style={{
                        background:
                            "linear-gradient(115deg, transparent 0%, rgba(255,255,255,0.18) 45%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0.18) 55%, transparent 100%)",
                        transform: "translateX(0)",
                        transition: "transform 1200ms var(--ease-in-out)",
                    }}
                />
                <span className="relative">{children}</span>
            </button>
        </>
    );
}
