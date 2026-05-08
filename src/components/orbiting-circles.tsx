import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type OrbitingCirclesProps = {
    children: ReactNode;
    className?: string;
    iconClassName?: string;
    /** Orbit radius in px. Default 80. */
    radius?: number;
    /** Seconds per revolution. Default 20. */
    duration?: number;
    /** Delay in seconds before the orbit begins. Default 0. */
    delay?: number;
    /** Reverse rotation direction. */
    reverse?: boolean;
    /** Render an SVG ring underneath the orbiting items. Default true. */
    path?: boolean;
};

/**
 * <OrbitingCircles/> — children orbit a shared center on a circular path.
 * Pure CSS — outer wrapper rotates, inner counter-rotates so the child
 * stays upright. Renders an optional SVG circle as the visible orbit
 * ring. Drop into a `relative` parent of any size; the orbit is centered
 * on the parent's middle.
 */
export function OrbitingCircles({
    children,
    className,
    iconClassName,
    radius = 80,
    duration = 20,
    delay = 0,
    reverse = false,
    path = true,
}: OrbitingCirclesProps) {
    const style = {
        "--orbit-radius": `${radius}px`,
        "--orbit-duration": `${duration}s`,
        "--orbit-delay": `${delay}s`,
    } as CSSProperties;

    const orbitName = reverse ? "orbit-rotate-reverse" : "orbit-rotate";

    return (
        <>
            <style>{`
                @keyframes orbit-rotate {
                    from { transform: rotate(0deg); }
                    to   { transform: rotate(360deg); }
                }
                @keyframes orbit-rotate-reverse {
                    from { transform: rotate(0deg); }
                    to   { transform: rotate(-360deg); }
                }
                @keyframes orbit-counter-rotate {
                    from { transform: rotate(0deg); }
                    to   { transform: rotate(-360deg); }
                }
                @keyframes orbit-counter-rotate-reverse {
                    from { transform: rotate(0deg); }
                    to   { transform: rotate(360deg); }
                }
            `}</style>
            <span
                aria-hidden
                style={style}
                className={cn(
                    "pointer-events-none absolute left-1/2 top-1/2 inline-block h-0 w-0",
                    className,
                )}
            >
                <span
                    className="absolute left-0 top-0 inline-block"
                    style={{
                        animation: `${orbitName} var(--orbit-duration) linear var(--orbit-delay) infinite`,
                    }}
                >
                    <span
                        className={cn(
                            "absolute -translate-x-1/2 -translate-y-1/2 inline-flex items-center justify-center",
                            iconClassName,
                        )}
                        style={{
                            top: `calc(var(--orbit-radius) * -1)`,
                            left: 0,
                            animation: `${reverse ? "orbit-counter-rotate-reverse" : "orbit-counter-rotate"} var(--orbit-duration) linear var(--orbit-delay) infinite`,
                        }}
                    >
                        {children}
                    </span>
                </span>
            </span>
            {path && (
                <svg
                    aria-hidden
                    className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-border"
                    width={radius * 2}
                    height={radius * 2}
                >
                    <circle
                        cx={radius}
                        cy={radius}
                        r={radius - 1}
                        fill="none"
                        stroke="currentColor"
                        strokeDasharray="3 4"
                    />
                </svg>
            )}
        </>
    );
}
