import { cn } from "@/lib/utils";

export type LightRaysProps = {
    /** How many ray beams to render. Default 6. */
    rayCount?: number;
    /** Base color of the rays. Default `var(--accent)`. */
    rayColor?: string;
    /** Opacity peak. Default 0.4. */
    intensity?: number;
    className?: string;
};

/**
 * <LightRays/> — handful of thin angled "god ray" beams crossing the
 * surface from a top-center origin. Each ray is a CSS gradient strip
 * with `transform-origin: top center`, drifting ±5° on a long loop.
 */
export function LightRays({
    rayCount = 6,
    rayColor = "var(--accent)",
    intensity = 0.4,
    className,
}: LightRaysProps) {
    return (
        <>
            <style>{`
                @keyframes light-rays-drift {
                    0%, 100% { transform: translateX(-50%) rotate(var(--lr-base)); }
                    50%      { transform: translateX(-50%) rotate(calc(var(--lr-base) + var(--lr-amp))); }
                }
            `}</style>
            <div
                aria-hidden
                className={cn(
                    "pointer-events-none absolute inset-0 overflow-hidden",
                    className,
                )}
            >
                {Array.from({ length: rayCount }).map((_, i) => {
                    const baseAngle = -30 + (60 / Math.max(rayCount - 1, 1)) * i;
                    const amp = i % 2 === 0 ? 5 : -4;
                    const dur = 9 + (i % 4);
                    return (
                        <span
                            key={i}
                            className="absolute left-1/2 top-0 h-[150%] w-[2px]"
                            style={
                                {
                                    transformOrigin: "top center",
                                    background: `linear-gradient(to bottom, ${rayColor} 0%, transparent 80%)`,
                                    opacity: intensity,
                                    filter: "blur(8px)",
                                    "--lr-base": `${baseAngle}deg`,
                                    "--lr-amp": `${amp}deg`,
                                    animation: `light-rays-drift ${dur}s var(--ease-in-out) infinite`,
                                } as React.CSSProperties
                            }
                        />
                    );
                })}
            </div>
        </>
    );
}
