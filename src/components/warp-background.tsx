import { cn } from "@/lib/utils";

export type WarpBackgroundProps = {
    /** Beams emitted around 360°. Default 18. */
    beamCount?: number;
    /** Beam length as % of half the smaller dimension. Default 70. */
    beamLength?: number;
    /** Beam thickness in px. Default 2. */
    beamSize?: number;
    /** Travel duration in seconds. Default 2.4. */
    beamDuration?: number;
    /** Beam color. Default `var(--fg)`. */
    beamColor?: string;
    /** Optional grid stroke for the floor. Default `var(--border)`. */
    gridColor?: string;
    /** Render the floor grid behind the beams. Default true. */
    showGrid?: boolean;
    className?: string;
};

/**
 * <WarpBackground/> — radial hyperspace streaks emanating from the center.
 * Each beam is a thin rotated strip with an inner gradient that streams
 * outward on a stagger. Pure CSS, no per-frame JS, no 3D perspective traps.
 */
export function WarpBackground({
    beamCount = 18,
    beamLength = 70,
    beamSize = 2,
    beamDuration = 2.4,
    beamColor = "var(--fg)",
    gridColor = "var(--border)",
    showGrid = true,
    className,
}: WarpBackgroundProps) {
    return (
        <>
            <style>{`
                @keyframes warp-beam-travel {
                    0%   { transform: translateY(0%);   opacity: 0; }
                    25%  { opacity: 0.9; }
                    100% { transform: translateY(-110%); opacity: 0; }
                }
            `}</style>
            <div
                aria-hidden
                className={cn(
                    "pointer-events-none absolute inset-0 overflow-hidden",
                    className,
                )}
            >
                {showGrid && (
                    <div
                        className="absolute inset-0"
                        style={{
                            backgroundImage: `linear-gradient(${gridColor} 1px, transparent 1px), linear-gradient(90deg, ${gridColor} 1px, transparent 1px)`,
                            backgroundSize: "40px 40px",
                            opacity: 0.18,
                            maskImage:
                                "radial-gradient(circle at center, black 0%, transparent 80%)",
                        }}
                    />
                )}
                <div className="absolute left-1/2 top-1/2 h-0 w-0">
                    {Array.from({ length: beamCount }).map((_, i) => {
                        const angle = (360 / beamCount) * i;
                        const delay = (beamDuration / beamCount) * i;
                        return (
                            <span
                                key={i}
                                className="absolute left-0 top-0 origin-top overflow-hidden"
                                style={{
                                    width: `${beamSize}px`,
                                    height: `${beamLength}%`,
                                    transform: `translate(-50%, 0) rotate(${angle}deg)`,
                                }}
                            >
                                <span
                                    className="absolute inset-0 block"
                                    style={{
                                        background: `linear-gradient(to top, transparent 0%, ${beamColor} 50%, transparent 100%)`,
                                        animation: `warp-beam-travel ${beamDuration}s linear infinite`,
                                        animationDelay: `${delay}s`,
                                    }}
                                />
                            </span>
                        );
                    })}
                </div>
            </div>
        </>
    );
}
