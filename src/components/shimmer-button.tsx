import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type ShimmerButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    children: ReactNode;
    /** Color of the rotating shimmer halo. Default `var(--accent)`. */
    shimmerColor?: string;
    /** Spin duration. Default 4s. */
    shimmerDuration?: string;
    /** Button face background. Default `var(--fg)`. */
    background?: string;
    /** Border radius in px. Default 999 (pill). */
    borderRadius?: number;
    className?: string;
};

/**
 * <ShimmerButton/> — pill button with a rotating conic-gradient halo
 * masked behind a 1px ring. Pure CSS — no JS, no offset-path quirks.
 */
export function ShimmerButton({
    children,
    shimmerColor = "var(--accent)",
    shimmerDuration = "4s",
    background = "var(--fg)",
    borderRadius = 999,
    className,
    ...rest
}: ShimmerButtonProps) {
    const shellStyle = {
        "--shimmer-color": shimmerColor,
        "--shimmer-duration": shimmerDuration,
        "--shimmer-radius": `${borderRadius}px`,
        "--shimmer-bg": background,
    } as CSSProperties;

    return (
        <>
            <style>{`
                @keyframes shimmer-button-spin {
                    from { transform: translate(-50%, -50%) rotate(0deg); }
                    to   { transform: translate(-50%, -50%) rotate(360deg); }
                }
            `}</style>
            <button
                type="button"
                {...rest}
                style={shellStyle}
                className={cn(
                    "press relative isolate inline-flex items-center justify-center gap-2",
                    "min-h-[44px] px-5 py-2",
                    "font-sans text-sm font-medium",
                    "overflow-hidden",
                    className,
                )}
            >
                <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
                    style={{ borderRadius: "var(--shimmer-radius)" }}
                >
                    <span
                        className="absolute left-1/2 top-1/2 aspect-square w-[200%]"
                        style={{
                            background: `conic-gradient(from 0deg, transparent 0deg, var(--shimmer-color) 60deg, transparent 120deg)`,
                            animation:
                                "shimmer-button-spin var(--shimmer-duration) linear infinite",
                        }}
                    />
                </span>
                <span
                    aria-hidden
                    className="pointer-events-none absolute -z-10"
                    style={{
                        inset: 1,
                        borderRadius: `calc(var(--shimmer-radius) - 1px)`,
                        background: "var(--shimmer-bg)",
                    }}
                />
                <span
                    className="relative"
                    style={{ color: "var(--bg)" }}
                >
                    {children}
                </span>
            </button>
        </>
    );
}
