"use client";

import { useMemo } from "react";

/**
 * Procedurally generated orb-web SVG (think Araneus).
 *
 * Real orb webs are built in 3 stages: bridge thread → frame +
 * radials → spiral. We model the visual gestalt:
 *   • Anchor / frame strands — the outermost polygon shape
 *   • 9-12 radial threads from centre to frame
 *   • A spiral that crosses the radials inward, with slight
 *     irregularity per ring so it doesn't look like graph paper
 *
 * Each path is stroked with a thin silver line. The whole web
 * fades in via stroke-dashoffset as `progress` rises (0 → 1).
 */
export function SpiderWeb({
    x,
    y,
    radius,
    progress = 1,
    seed = 1,
    bounded = false,
}: {
    x: number;
    y: number;
    radius: number;
    /** 0..1 — fraction of the web that's been spun (drives reveal). */
    progress?: number;
    /** Stable seed so the same web always looks the same. */
    seed?: number;
    /** When true, render with absolute positioning (inside an
     *  enclosure container); otherwise position fixed to viewport. */
    bounded?: boolean;
}) {
    const { paths, totalLen } = useMemo(
        () => generateWeb(radius, seed),
        [radius, seed],
    );
    const rev = clamp01(progress);

    const size = radius * 2;
    return (
        <svg
            aria-hidden
            className="spider-web pointer-events-none"
            width={size}
            height={size}
            viewBox={`-${radius} -${radius} ${size} ${size}`}
            style={{
                position: bounded ? "absolute" : "fixed",
                left: x - radius,
                top: y - radius,
                overflow: "visible",
                zIndex: bounded ? 1 : 40,
                opacity: 0.3 + rev * 0.55,
                transition: "opacity 240ms linear",
                filter:
                    "drop-shadow(0 0 1px rgba(255,255,255,0.35)) drop-shadow(0 0 2px rgba(0,0,0,0.25))",
            }}
        >
            {paths.map((p, i) => {
                // Each path appears in sequence as `rev` grows.
                // i / paths.length is the start, (i+1)/n is the end.
                const a = i / paths.length;
                const b = (i + 1) / paths.length;
                const pathRev = clamp01((rev - a) / (b - a));
                const len = totalLen[i];
                const dashOffset = len * (1 - pathRev);
                return (
                    <path
                        key={i}
                        d={p}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={i < 12 ? 0.7 : 0.4}     // radials slightly thicker
                        strokeOpacity={i < 12 ? 0.65 : 0.5}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeDasharray={len}
                        strokeDashoffset={dashOffset}
                        style={{
                            color: "var(--color-fg-soft, #b4b4b4)",
                            transition: "stroke-dashoffset 220ms linear",
                        }}
                    />
                );
            })}
            {/* Centre anchor — the spider's hub */}
            {rev > 0.95 ? (
                <circle
                    cx="0"
                    cy="0"
                    r="0.6"
                    fill="var(--color-fg-soft, #b4b4b4)"
                    fillOpacity="0.6"
                />
            ) : null}
        </svg>
    );
}

// ─── Web geometry ─────────────────────────────────────────────────

type WebGeometry = { paths: string[]; totalLen: number[] };

/** Cheap deterministic pseudo-random in [0, 1) given an integer seed. */
function rng(seed: number): () => number {
    let s = (seed * 9301 + 49297) % 233280;
    return () => {
        s = (s * 9301 + 49297) % 233280;
        return s / 233280;
    };
}

function generateWeb(radius: number, seed: number): WebGeometry {
    const r = rng(seed);
    const numRadials = 10 + Math.floor(r() * 3);    // 10-12 radials
    const numRings = 7 + Math.floor(r() * 2);       // 7-8 spiral rings

    // Compute radial endpoints with per-radial length jitter.
    type Radial = { angle: number; length: number };
    const radials: Radial[] = [];
    for (let i = 0; i < numRadials; i++) {
        const baseAngle = (i / numRadials) * Math.PI * 2;
        const jitter = (r() - 0.5) * 0.18;
        const angle = baseAngle + jitter;
        const len = radius * (0.82 + r() * 0.28);
        radials.push({ angle, length: len });
    }

    const paths: string[] = [];
    const totalLen: number[] = [];

    // ─── Anchor stays (frame threads / bridge threads) ───
    // Real orb webs are suspended by 3-5 long anchor threads attaching
    // the frame to surrounding surfaces. We pick 3-4 random radials
    // and extend an additional thread BEYOND their endpoint, suggesting
    // the web is moored to something off-frame. Drawn first so they
    // reveal early in the build sequence (matches real construction:
    // anchor → frame → radials → spiral).
    const numAnchors = 3 + Math.floor(r() * 2);
    const anchorRadialIdxs: number[] = [];
    while (anchorRadialIdxs.length < numAnchors) {
        const idx = Math.floor(r() * numRadials);
        if (!anchorRadialIdxs.includes(idx)) anchorRadialIdxs.push(idx);
    }
    for (const idx of anchorRadialIdxs) {
        const rad = radials[idx];
        const stayLen = rad.length * (1.15 + r() * 0.35);   // 15-50% past edge
        const ex = Math.cos(rad.angle) * stayLen;
        const ey = Math.sin(rad.angle) * stayLen;
        paths.push(`M 0 0 L ${ex.toFixed(1)} ${ey.toFixed(1)}`);
        totalLen.push(stayLen);
    }

    // Radials proper.
    for (const rad of radials) {
        const ex = Math.cos(rad.angle) * rad.length;
        const ey = Math.sin(rad.angle) * rad.length;
        paths.push(`M 0 0 L ${ex.toFixed(1)} ${ey.toFixed(1)}`);
        totalLen.push(rad.length);
    }

    // ─── Spirals ──────────────────────────────────────────
    // One open polyline per ring; segments between adjacent radials
    // are drawn as Q-curves with the control point pushed slightly
    // OUTWARD, so each chord bows away from the centre — the way real
    // sticky spiral threads sag under tension instead of forming
    // straight chords.
    //
    // Ring radii follow an exponential schedule (denser inside,
    // sparser outside) — matches photographs of Araneus diadematus
    // capture spirals.
    for (let ring = 1; ring <= numRings; ring++) {
        // Power < 1 → outer rings further apart, inner rings tighter.
        const ringT = Math.pow(ring / (numRings + 0.5), 0.85);
        let path = "";
        let len = 0;
        let prevX = 0;
        let prevY = 0;
        for (let i = 0; i <= numRadials; i++) {
            const idx = i % numRadials;
            const rad = radials[idx];
            const ringR =
                ringT * rad.length * (0.9 + r() * 0.18);
            const x = Math.cos(rad.angle) * ringR;
            const y = Math.sin(rad.angle) * ringR;
            if (i === 0) {
                path = `M ${x.toFixed(1)} ${y.toFixed(1)}`;
            } else {
                // Bow the chord outward by ~6% of its span — gives
                // each spiral arc a soft curve rather than a kink.
                const midX = (prevX + x) / 2;
                const midY = (prevY + y) / 2;
                const cpDist = Math.hypot(midX, midY);
                const bowK = 1 + 0.06;
                const cpX = (midX / Math.max(cpDist, 0.001)) * cpDist * bowK;
                const cpY = (midY / Math.max(cpDist, 0.001)) * cpDist * bowK;
                path += ` Q ${cpX.toFixed(1)} ${cpY.toFixed(1)}, ${x.toFixed(1)} ${y.toFixed(1)}`;
                // Approximate Q-curve length by chord length (cheap;
                // overshoots ~5% but stroke-dash math doesn't need
                // sub-pixel accuracy).
                len += Math.hypot(x - prevX, y - prevY) * 1.05;
            }
            prevX = x;
            prevY = y;
        }
        paths.push(path);
        totalLen.push(len);
    }

    return { paths, totalLen };
}

function clamp01(v: number): number {
    return v < 0 ? 0 : v > 1 ? 1 : v;
}
