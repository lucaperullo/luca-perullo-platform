import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type PulsatingButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    children: ReactNode;
    /** Color of the pulse rings. Default `var(--accent)`. */
    pulseColor?: string;
    /** Pulse cycle. Default 1.6s. */
    duration?: string;
    className?: string;
};

/**
 * <PulsatingButton/> — solid CTA emitting two staggered concentric pulses
 * outward like a beacon. Pure CSS keyframe animation, no JS.
 */
export function PulsatingButton({
    children,
    pulseColor = "var(--accent)",
    duration = "1.6s",
    className,
    ...rest
}: PulsatingButtonProps) {
    return (
        <>
            <style>{`
                @keyframes pulsating-button-ring {
                    0%   { transform: scale(1);   opacity: 0.55; }
                    80%  { transform: scale(1.6); opacity: 0;    }
                    100% { transform: scale(1.6); opacity: 0;    }
                }
            `}</style>
            <button
                type="button"
                {...rest}
                className={cn(
                    "press relative isolate inline-flex items-center justify-center gap-2",
                    "min-h-[44px] rounded-full px-6 py-2",
                    "bg-accent text-accent-fg",
                    "font-sans text-sm font-medium",
                    className,
                )}
                style={{ background: pulseColor === "var(--accent)" ? undefined : pulseColor }}
            >
                <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 -z-10 rounded-full"
                    style={{
                        background: pulseColor,
                        animation: `pulsating-button-ring ${duration} var(--ease-out) infinite`,
                    }}
                />
                <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 -z-10 rounded-full"
                    style={{
                        background: pulseColor,
                        animation: `pulsating-button-ring ${duration} var(--ease-out) infinite`,
                        animationDelay: `calc(${duration} / -2)`,
                    }}
                />
                <span className="relative">{children}</span>
            </button>
        </>
    );
}
