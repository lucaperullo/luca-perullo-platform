"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type RainbowButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    children: ReactNode;
    className?: string;
};

/**
 * <RainbowButton/> — neutral button face floating above an animated rainbow
 * conic-gradient halo. The halo lives on a blurred pseudo-layer and rotates
 * 360° on a 6s loop. Touch-target is 44×44 minimum, press feedback is the
 * shared `press` utility.
 */
export function RainbowButton({ children, className, ...rest }: RainbowButtonProps) {
    return (
        <>
            <style>{`
                @keyframes rainbow-rotate {
                    to { transform: rotate(360deg); }
                }
            `}</style>
            <button
                type="button"
                {...rest}
                className={cn(
                    "press relative inline-flex items-center justify-center gap-2",
                    "min-h-[44px] rounded-full px-5 py-2",
                    "border border-border-strong bg-bg-alt text-fg",
                    "font-sans text-sm font-medium",
                    "isolate",
                    "transition-[box-shadow,border-color] duration-200",
                    "[transition-timing-function:var(--ease-out)]",
                    "hover:border-fg-soft",
                    className,
                )}
            >
                <span
                    aria-hidden
                    className="pointer-events-none absolute -inset-[2px] -z-10 rounded-full"
                    style={{
                        background:
                            "conic-gradient(from 0deg, #ef4444, #f59e0b, #10b981, #2b7fff, #8b5cf6, #ef4444)",
                        animation: "rainbow-rotate 6s linear infinite",
                        filter: "blur(10px)",
                        opacity: 0.55,
                    }}
                />
                <span aria-hidden className="absolute inset-0 -z-10 rounded-full bg-bg-alt" />
                <span className="relative">{children}</span>
            </button>
        </>
    );
}
