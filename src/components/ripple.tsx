import { cn } from "@/lib/utils";

export type RippleProps = {
    /** Diameter (px) of the innermost ring. Default 210. */
    mainCircleSize?: number;
    /** Peak opacity of the innermost ring. Default 0.24. */
    mainCircleOpacity?: number;
    /** How many concentric rings to render. Default 8. */
    numCircles?: number;
    className?: string;
};

/**
 * <Ripple/> — concentric expanding ring waves emanating outward from a
 * central point (sonar pulse). Pure CSS — N circles each animating
 * scale 0.5→3 + opacity, staggered by index.
 */
export function Ripple({
    mainCircleSize = 210,
    mainCircleOpacity = 0.24,
    numCircles = 8,
    className,
}: RippleProps) {
    return (
        <>
            <style>{`
                @keyframes ripple-expand {
                    0%   { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
                    20%  { opacity: var(--ripple-opacity, 0.24); }
                    100% { transform: translate(-50%, -50%) scale(3);   opacity: 0; }
                }
            `}</style>
            <div
                aria-hidden
                className={cn(
                    "pointer-events-none absolute inset-0 overflow-hidden",
                    className,
                )}
            >
                {Array.from({ length: numCircles }).map((_, i) => {
                    const opacity = mainCircleOpacity - i * (mainCircleOpacity / numCircles / 2);
                    const size = mainCircleSize + i * 60;
                    return (
                        <span
                            key={i}
                            className="absolute left-1/2 top-1/2 rounded-full border border-fg/20"
                            style={
                                {
                                    width: size,
                                    height: size,
                                    "--ripple-opacity": Math.max(0, opacity),
                                    animation: `ripple-expand 4s var(--ease-out) infinite`,
                                    animationDelay: `${i * 0.4}s`,
                                } as React.CSSProperties
                            }
                        />
                    );
                })}
            </div>
        </>
    );
}
