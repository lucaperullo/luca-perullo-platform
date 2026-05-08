"use client";

import {
    useEffect,
    useId,
    useMemo,
    useRef,
    useState,
    type RefObject,
} from "react";
import { cn } from "@/lib/utils";

/* ────────────────────────────────────────────────────────────────────
   Routing helpers — convert a list of points into an SVG `d` string.
   ──────────────────────────────────────────────────────────────────── */

type Point = { x: number; y: number };

/** Resolve a Waypoint (point or ref) into a container-local Point. */
function resolveWaypoint(
    wp: Waypoint,
    containerRect: DOMRect,
): Point | null {
    if ("current" in wp) {
        const el = wp.current;
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return {
            x: r.left + r.width / 2 - containerRect.left,
            y: r.top + r.height / 2 - containerRect.top,
        };
    }
    return { x: wp.x, y: wp.y };
}

/** Catmull-Rom-style smooth path through points. Single segment uses a
 *  symmetric quadratic curve perpendicular to the chord (legacy curvature). */
function smoothCurvePath(points: Point[], curvature: number): string {
    if (points.length < 2) return "";
    if (points.length === 2) {
        const [a, b] = points;
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const len = Math.hypot(dx, dy) || 1;
        const mx = (a.x + b.x) / 2;
        const my = (a.y + b.y) / 2;
        const ox = (-dy / len) * len * curvature * 0.4;
        const oy = (dx / len) * len * curvature * 0.4;
        return `M ${a.x} ${a.y} Q ${mx + ox} ${my + oy} ${b.x} ${b.y}`;
    }
    // Catmull-Rom → cubic Bézier conversion. Tension = 1 - curvature.
    let d = `M ${points[0].x} ${points[0].y}`;
    const t = curvature;
    for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[i - 1] ?? points[i];
        const p1 = points[i];
        const p2 = points[i + 1];
        const p3 = points[i + 2] ?? points[i + 1];
        const c1x = p1.x + ((p2.x - p0.x) * t) / 3;
        const c1y = p1.y + ((p2.y - p0.y) * t) / 3;
        const c2x = p2.x - ((p3.x - p1.x) * t) / 3;
        const c2y = p2.y - ((p3.y - p1.y) * t) / 3;
        d += ` C ${c1x} ${c1y} ${c2x} ${c2y} ${p2.x} ${p2.y}`;
    }
    return d;
}

/** Polyline through points with rounded corners. Each interior point becomes
 *  a quarter-arc of `radius`. Works with axis-aligned (PCB-style) and
 *  arbitrary-angle bends. */
function roundedPolylinePath(points: Point[], radius: number): string {
    if (points.length < 2) return "";
    if (points.length === 2 || radius <= 0) {
        return points
            .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
            .join(" ");
    }
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length - 1; i++) {
        const prev = points[i - 1];
        const curr = points[i];
        const next = points[i + 1];
        const vIn = { x: prev.x - curr.x, y: prev.y - curr.y };
        const vOut = { x: next.x - curr.x, y: next.y - curr.y };
        const lIn = Math.hypot(vIn.x, vIn.y) || 1;
        const lOut = Math.hypot(vOut.x, vOut.y) || 1;
        const r = Math.min(radius, lIn / 2, lOut / 2);
        const inX = curr.x + (vIn.x / lIn) * r;
        const inY = curr.y + (vIn.y / lIn) * r;
        const outX = curr.x + (vOut.x / lOut) * r;
        const outY = curr.y + (vOut.y / lOut) * r;
        d += ` L ${inX} ${inY}`;
        d += ` Q ${curr.x} ${curr.y} ${outX} ${outY}`;
    }
    const last = points[points.length - 1];
    d += ` L ${last.x} ${last.y}`;
    return d;
}

/* ────────────────────────────────────────────────────────────────────
   Public API
   ──────────────────────────────────────────────────────────────────── */

export type Waypoint =
    | Point
    | RefObject<HTMLElement | null>;

export type AnimatedBeamRouting = "smooth" | "rounded" | "linear";

export type AnimatedBeamAnimation =
    | "comet"
    | "pulse"
    | "flow"
    | "particles";

export type AnimatedBeamProps = {
    /** Element whose bounding rect defines the SVG viewport. */
    containerRef: RefObject<HTMLElement | null>;
    /** Start anchor — a DOM ref. The path begins at this element's center. */
    fromRef: RefObject<HTMLElement | null>;
    /** End anchor — a DOM ref. The path ends at this element's center. */
    toRef: RefObject<HTMLElement | null>;
    /**
     * Optional waypoints between `fromRef` and `toRef`. Each entry can be
     * a `{ x, y }` point in container-local coordinates **or** a ref to a
     * DOM element (we use its center). With waypoints, the path traces
     * exactly through them — perfect for PCB-style routes, hub-and-spoke
     * diagrams, or any custom layout.
     */
    waypoints?: Waypoint[];
    /**
     * How segments are joined.
     * - `"smooth"` — Catmull-Rom curves through all points (default for
     *   no-waypoint case; flowing organic feel).
     * - `"rounded"` — straight segments with rounded corners at each
     *   waypoint (PCB / circuit-board feel; pairs with `cornerRadius`).
     * - `"linear"` — straight segments with sharp corners.
     *
     * Default `"smooth"`.
     */
    routing?: AnimatedBeamRouting;
    /** Single-segment curve depth (0 = straight, 1 = strong arc). Used when
     *  there are no waypoints and routing = `"smooth"`. Default `0.4`. */
    curvature?: number;
    /** Corner arc radius in px for `routing="rounded"`. Default `12`. */
    cornerRadius?: number;
    /** Animation duration in seconds. Default `3.2`. */
    duration?: number;
    /** Stroke width in px. Default `1.5`. */
    strokeWidth?: number;
    /** Idle path color. Default `var(--border)`. */
    pathColor?: string;
    /** Comet head + glow color. Default `var(--accent)`. */
    accentColor?: string;
    /** Gaussian blur radius used for the glow. Default `3`. */
    glow?: number;
    /** Reverse direction. Default `false`. */
    reverse?: boolean;
    /** Animation start delay in seconds. Default `0`. */
    delay?: number;
    /**
     * Animation style.
     * - `"comet"` (default) — single bright head + fading trail traveling
     *   end-to-end. Best for discrete events: requests, transitions.
     * - `"pulse"` — entire path lights up briefly then dims. Best for
     *   heartbeat / health-check / "alive" indicators.
     * - `"flow"` — continuous marching dashes along the path. Best for
     *   steady streams: pipelines, replication, sync.
     * - `"particles"` — N small dots on a stagger, each riding the path.
     *   Best for data packets, distributed events, throughput.
     */
    animation?: AnimatedBeamAnimation;
    /** Particle count for `animation="particles"`. Default `5`. */
    particleCount?: number;
    /** Dash period in px for `animation="flow"`. Default `14`. */
    dashSize?: number;
    className?: string;
};

/**
 * <AnimatedBeam/> — a glowing comet that travels a custom path between
 * two DOM anchors. Drop in a `containerRef` plus `fromRef`/`toRef` and
 * you're done; pass `waypoints` to route through any series of points
 * (or refs to other elements) for PCB-style traces, U-shapes, or any
 * custom topology.
 *
 * Visual model:
 *   - A faint hairline path is always rendered so the route reads even
 *     between cycles.
 *   - A bright comet head rides the path via CSS `offset-path`.
 *   - A short glowing trail sits BEHIND the head — its leading edge is
 *     mathematically locked to the head's position, so head + trail
 *     read as a single particle, not two desynced things.
 *   - Opacity fades in/out at the loop seams so the cycle restart is
 *     invisible.
 */
export function AnimatedBeam({
    containerRef,
    fromRef,
    toRef,
    waypoints,
    routing = "smooth",
    curvature = 0.4,
    cornerRadius = 12,
    duration = 3.2,
    strokeWidth = 1.5,
    pathColor = "var(--border)",
    accentColor = "var(--accent)",
    glow = 3,
    reverse = false,
    delay = 0,
    animation = "comet",
    particleCount = 5,
    dashSize = 14,
    className,
}: AnimatedBeamProps) {
    const reactId = useId();
    const id = `beam-${reactId.replace(/[:#]/g, "_")}`;

    const [d, setD] = useState("");
    const [pathLen, setPathLen] = useState(0);
    const [size, setSize] = useState({ w: 0, h: 0 });
    const measureRef = useRef<SVGPathElement>(null);

    // Stabilise the waypoints reference so the resize effect doesn't fire
    // on every render of the parent.
    const wpKey = useMemo(
        () =>
            JSON.stringify(
                (waypoints ?? []).map((w) =>
                    "current" in w
                        ? // we can't serialise a ref; use a counter index instead
                          "ref"
                        : { x: w.x, y: w.y },
                ),
            ),
        [waypoints],
    );

    useEffect(() => {
        const update = () => {
            const c = containerRef.current;
            const a = fromRef.current;
            const b = toRef.current;
            if (!c || !a || !b) return;
            const cb = c.getBoundingClientRect();
            const ab = a.getBoundingClientRect();
            const bb = b.getBoundingClientRect();

            const start: Point = {
                x: ab.left + ab.width / 2 - cb.left,
                y: ab.top + ab.height / 2 - cb.top,
            };
            const end: Point = {
                x: bb.left + bb.width / 2 - cb.left,
                y: bb.top + bb.height / 2 - cb.top,
            };
            const mid: Point[] = (waypoints ?? [])
                .map((w) => resolveWaypoint(w, cb))
                .filter((p): p is Point => p !== null);

            const points = [start, ...mid, end];
            let nextD: string;
            if (routing === "rounded") {
                nextD = roundedPolylinePath(points, cornerRadius);
            } else if (routing === "linear") {
                nextD = roundedPolylinePath(points, 0);
            } else {
                nextD = smoothCurvePath(points, curvature);
            }
            setD(nextD);
            setSize({ w: cb.width, h: cb.height });
        };

        update();
        const ro = new ResizeObserver(update);
        if (containerRef.current) ro.observe(containerRef.current);
        window.addEventListener("resize", update);
        return () => {
            ro.disconnect();
            window.removeEventListener("resize", update);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [containerRef, fromRef, toRef, routing, curvature, cornerRadius, wpKey]);

    useEffect(() => {
        if (measureRef.current && d) {
            try {
                setPathLen(measureRef.current.getTotalLength());
            } catch {
                setPathLen(0);
            }
        }
    }, [d]);

    // 18% of the path is lit at any time. Shorter than a streak, longer
    // than a dot — reads as a punctuated comet with a clear leading edge.
    const trail = pathLen * 0.18;

    // Don't render the animated layers until we have real geometry —
    // prevents the ghost beam at the origin on first paint.
    const ready = pathLen > 0 && size.w > 0 && d.length > 0;

    const cometKeyframes = `
        @keyframes ${id}-trail {
            0%   { stroke-dashoffset: ${trail};            opacity: 0; }
            7%   {                                          opacity: 1; }
            93%  {                                          opacity: 1; }
            100% { stroke-dashoffset: ${trail - pathLen};  opacity: 0; }
        }
        @keyframes ${id}-comet {
            0%   { offset-distance: 0%;   opacity: 0; }
            7%   {                        opacity: 1; }
            93%  {                        opacity: 1; }
            100% { offset-distance: 100%; opacity: 0; }
        }
    `;
    const pulseKeyframes = `
        @keyframes ${id}-pulse-stroke {
            0%, 100% { stroke-opacity: 0.0; }
            22%      { stroke-opacity: 1;   }
            55%      { stroke-opacity: 0.35;}
        }
        @keyframes ${id}-pulse-halo {
            0%, 100% { stroke-opacity: 0;   }
            22%      { stroke-opacity: 0.45;}
            55%      { stroke-opacity: 0;   }
        }
    `;
    const flowKeyframes = `
        @keyframes ${id}-flow {
            from { stroke-dashoffset: 0; }
            to   { stroke-dashoffset: ${reverse ? dashSize : -dashSize}; }
        }
    `;
    const particlesKeyframes = `
        @keyframes ${id}-particle {
            0%   { offset-distance: 0%;   opacity: 0; }
            8%   {                        opacity: 1; }
            92%  {                        opacity: 1; }
            100% { offset-distance: 100%; opacity: 0; }
        }
    `;
    const keyframes =
        animation === "comet"
            ? cometKeyframes
            : animation === "pulse"
              ? pulseKeyframes
              : animation === "flow"
                ? flowKeyframes
                : particlesKeyframes;

    return (
        <>
            <style>{keyframes}</style>
            <svg
                aria-hidden
                width={size.w || 1}
                height={size.h || 1}
                viewBox={`0 0 ${size.w || 1} ${size.h || 1}`}
                className={cn(
                    "pointer-events-none absolute inset-0",
                    className,
                )}
            >
                <defs>
                    <filter
                        id={`${id}-glow`}
                        x="-50%"
                        y="-50%"
                        width="200%"
                        height="200%"
                    >
                        <feGaussianBlur stdDeviation={glow} result="b" />
                        <feMerge>
                            <feMergeNode in="b" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Hairline idle path — always visible so the route reads
                    even between cycles. Measure target. */}
                <path
                    ref={measureRef}
                    d={d}
                    fill="none"
                    stroke={pathColor}
                    strokeWidth={strokeWidth}
                    strokeOpacity={0.4}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />

                {/* ─── COMET variant — 3-layer trail ─── */}
                {ready && animation === "comet" && (
                    <>
                        <path
                            d={d}
                            fill="none"
                            stroke={accentColor}
                            strokeWidth={strokeWidth + 6}
                            strokeOpacity={0.22}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{
                                strokeDasharray: `${trail} ${pathLen}`,
                                animation: `${id}-trail ${duration}s linear ${delay}s infinite`,
                                animationDirection: reverse ? "reverse" : "normal",
                                filter: `blur(${glow * 1.6}px)`,
                            }}
                        />
                        <path
                            d={d}
                            fill="none"
                            stroke={accentColor}
                            strokeWidth={strokeWidth + 2}
                            strokeOpacity={0.55}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{
                                strokeDasharray: `${trail} ${pathLen}`,
                                animation: `${id}-trail ${duration}s linear ${delay}s infinite`,
                                animationDirection: reverse ? "reverse" : "normal",
                                filter: `blur(${glow * 0.4}px)`,
                            }}
                        />
                        <path
                            d={d}
                            fill="none"
                            stroke={accentColor}
                            strokeWidth={strokeWidth}
                            strokeOpacity={1}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{
                                strokeDasharray: `${trail} ${pathLen}`,
                                animation: `${id}-trail ${duration}s linear ${delay}s infinite`,
                                animationDirection: reverse ? "reverse" : "normal",
                            }}
                        />
                    </>
                )}

                {/* ─── PULSE variant — entire path lights up + dims ─── */}
                {ready && animation === "pulse" && (
                    <>
                        <path
                            d={d}
                            fill="none"
                            stroke={accentColor}
                            strokeWidth={strokeWidth + 5}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{
                                strokeOpacity: 0,
                                animation: `${id}-pulse-halo ${duration}s var(--ease-in-out) ${delay}s infinite`,
                                filter: `blur(${glow * 1.3}px)`,
                            }}
                        />
                        <path
                            d={d}
                            fill="none"
                            stroke={accentColor}
                            strokeWidth={strokeWidth + 0.4}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{
                                strokeOpacity: 0,
                                animation: `${id}-pulse-stroke ${duration}s var(--ease-in-out) ${delay}s infinite`,
                            }}
                        />
                    </>
                )}

                {/* ─── FLOW variant — marching dashes ─── */}
                {ready && animation === "flow" && (
                    <>
                        <path
                            d={d}
                            fill="none"
                            stroke={accentColor}
                            strokeWidth={strokeWidth + 3}
                            strokeOpacity={0.32}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeDasharray={`${dashSize * 0.5} ${dashSize * 0.5}`}
                            style={{
                                animation: `${id}-flow ${duration}s linear ${delay}s infinite`,
                                filter: `blur(${glow * 0.8}px)`,
                            }}
                        />
                        <path
                            d={d}
                            fill="none"
                            stroke={accentColor}
                            strokeWidth={strokeWidth}
                            strokeOpacity={1}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeDasharray={`${dashSize * 0.5} ${dashSize * 0.5}`}
                            style={{
                                animation: `${id}-flow ${duration}s linear ${delay}s infinite`,
                            }}
                        />
                    </>
                )}

                {/* ─── PARTICLES variant — only the hairline path is
                     drawn here; particles are HTML siblings outside the
                     SVG so they can use offset-path natively. ─── */}
            </svg>

            {/* ─── COMET head — three concentric radial layers ─── */}
            {ready && animation === "comet" && (
                <div
                    aria-hidden
                    className="pointer-events-none absolute left-0 top-0"
                    style={{
                        offsetPath: `path("${d}")`,
                        offsetRotate: "0deg",
                        animation: `${id}-comet ${duration}s linear ${delay}s infinite`,
                        animationDirection: reverse ? "reverse" : "normal",
                        width: 0,
                        height: 0,
                    }}
                >
                    <span
                        style={{
                            position: "absolute",
                            left: -14,
                            top: -14,
                            width: 28,
                            height: 28,
                            borderRadius: "50%",
                            background: `radial-gradient(circle, ${accentColor} 0%, ${accentColor}66 30%, transparent 70%)`,
                            filter: "blur(3px)",
                            opacity: 0.85,
                        }}
                    />
                    <span
                        style={{
                            position: "absolute",
                            left: -7,
                            top: -7,
                            width: 14,
                            height: 14,
                            borderRadius: "50%",
                            background: `radial-gradient(circle, ${accentColor} 0%, ${accentColor}aa 45%, transparent 75%)`,
                            filter: "blur(0.5px)",
                        }}
                    />
                    <span
                        style={{
                            position: "absolute",
                            left: -3,
                            top: -3,
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            background: `radial-gradient(circle, white 0%, color-mix(in oklch, ${accentColor} 50%, white) 35%, ${accentColor} 75%)`,
                        }}
                    />
                </div>
            )}

            {/* ─── PARTICLES — N small dots staggered along the path ─── */}
            {ready && animation === "particles" &&
                Array.from({ length: particleCount }).map((_, i) => {
                    const offset = (i / particleCount) * duration;
                    return (
                        <div
                            key={i}
                            aria-hidden
                            className="pointer-events-none absolute left-0 top-0"
                            style={{
                                offsetPath: `path("${d}")`,
                                offsetRotate: "0deg",
                                animation: `${id}-particle ${duration}s linear ${delay - offset}s infinite`,
                                animationDirection: reverse ? "reverse" : "normal",
                                width: 0,
                                height: 0,
                            }}
                        >
                            <span
                                style={{
                                    position: "absolute",
                                    left: -5,
                                    top: -5,
                                    width: 10,
                                    height: 10,
                                    borderRadius: "50%",
                                    background: `radial-gradient(circle, ${accentColor} 0%, ${accentColor}77 35%, transparent 75%)`,
                                    filter: "blur(1.5px)",
                                }}
                            />
                            <span
                                style={{
                                    position: "absolute",
                                    left: -2,
                                    top: -2,
                                    width: 4,
                                    height: 4,
                                    borderRadius: "50%",
                                    background: `radial-gradient(circle, white 0%, ${accentColor} 70%)`,
                                }}
                            />
                        </div>
                    );
                })}
        </>
    );
}
