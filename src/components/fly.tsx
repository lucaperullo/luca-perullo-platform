"use client";

import { useEffect, useId, useRef, useState } from "react";
import { findEnclosingWeb } from "@/lib/insect-registry";
import { prefersReducedMotion } from "./use-reduced-motion";

/**
 * Species variants. Each one swaps the body gradient + eye colour
 * scheme; gait, anatomy, and behaviour are identical across variants.
 *   • housefly      — Musca domestica, classic dark grey-black body
 *   • blue-bottle   — Calliphora vomitoria, iridescent metallic blue
 *   • green-bottle  — Lucilia sericata, iridescent emerald
 *   • fruit-fly     — Drosophila melanogaster, amber-yellow body
 *   • pixel-gray    — chanhdai-aligned editorial: 4-shade grayscale,
 *                     crisp-edge rendering, no iridescence, hairline-
 *                     outlined wings. Preserves all gait + grooming
 *                     animations, just swaps the visual register.
 */
export type FlyVariant =
    | "housefly"
    | "blue-bottle"
    | "green-bottle"
    | "fruit-fly"
    | "pixel-gray";

const FLY_VARIANT_STORAGE_KEY = "lp-fly-variant";
const FLY_VARIANT_EVENT = "lp:fly-variant";

const VALID_VARIANTS: ReadonlySet<FlyVariant> = new Set([
    "housefly",
    "blue-bottle",
    "green-bottle",
    "fruit-fly",
    "pixel-gray",
]);

/**
 * Switch the variant of the live, mounted `<Fly />` from anywhere.
 * Persists to localStorage so a refresh keeps the chosen species.
 * Used by the component-library variant picker — but available
 * anywhere in the app (e.g. a settings panel, a debug toggle).
 */
export function setActiveFlyVariant(variant: FlyVariant) {
    if (typeof window === "undefined") return;
    if (!VALID_VARIANTS.has(variant)) return;
    try {
        localStorage.setItem(FLY_VARIANT_STORAGE_KEY, variant);
    } catch {
        /* localStorage unavailable — fall through, event still fires */
    }
    window.dispatchEvent(
        new CustomEvent<FlyVariant>(FLY_VARIANT_EVENT, { detail: variant }),
    );
}

/** Read whatever variant was last selected; null if none. */
export function getActiveFlyVariant(): FlyVariant | null {
    if (typeof window === "undefined") return null;
    try {
        const v = localStorage.getItem(FLY_VARIANT_STORAGE_KEY);
        if (v && VALID_VARIANTS.has(v as FlyVariant)) return v as FlyVariant;
    } catch {
        /* ignore */
    }
    return null;
}

/**
 * Realistic 2D simulated housefly — *walking* on the screen surface.
 *
 * Real flies on a wall walk almost continuously, pause every few seconds,
 * and groom. They never fly off unless seriously threatened. This sim
 * commits to that behaviour:
 *
 *   • **Walk** — slow Reynolds wander, ~35 px/s. Heading lerps smoothly,
 *     no saccades, no banking. Each walking step adds a tiny vertical
 *     bob via CSS keyframe (gait visualisation).
 *   • **Pause** — short stationary moments (~1 s) between walking
 *     stretches.
 *   • **Grooming** — 4 distinct routines, randomly chosen:
 *       - foreleg-rub (rubs the two front legs together at the head)
 *       - hindleg-rub (rubs the two rear legs together at the back)
 *       - head-clean (one foreleg sweeps over the eyes)
 *       - wing-clean (one hindleg sweeps along the folded wing)
 *     Each lasts 2-4.5 s with a per-mode CSS animation on specific legs.
 *   • **Scurry** — when the cursor enters the threat radius (110 px),
 *     interrupt grooming/pause and walk *fast* (130 px/s) directly away.
 *     Wings stay folded — the fly never flies. Returns to normal walk
 *     when the threat passes.
 *
 * Visual: anatomical SVG with body horizontal, wings folded back over
 * the abdomen (translucent overlay), 6 jointed legs always visible
 * splaying outward, two large dark compound eyes, antennae, thorax
 * stripes, abdominal segmentation. No motion blur, no fake bug detail.
 *
 * Disabled on touch and `prefers-reduced-motion: reduce`. Pauses on
 * `visibilitychange`. Refs hold all simulation state.
 */

// ─── Tuning ───────────────────────────────────────────────────────
const CRUISE_SPEED = 35;        // px/s — slow walking pace
const SCURRY_SPEED = 130;       // px/s — fled walking when threatened
const STEER_GAIN_WALK = 5;
const STEER_GAIN_SCURRY = 12;
const MAX_FORCE = 700;

const WANDER_RADIUS = 30;
const WANDER_DISTANCE = 28;
const WANDER_JITTER = 1.5;      // slow drift, smooth turns

const HEADING_LERP = 4;         // slow turn rate (walking, not flying)

const THREAT_RADIUS = 110;
const THREAT_REACTION_MS = 60;

const WALK_DURATION_MIN = 4000;
const WALK_DURATION_MAX = 8000;
const PAUSE_DURATION_MIN = 800;
const PAUSE_DURATION_MAX = 1800;
const GROOM_DURATION_MIN = 2200;
const GROOM_DURATION_MAX = 4500;

const POST_WALK_GROOM_PROB = 0.55;
const POST_WALK_PAUSE_PROB = 0.25;
// Remaining ~0.20 → continue walking another stretch.

const EDGE_MARGIN = 70;
const EDGE_FORCE = 600;

// Wings back-swept 65° — almost folded along body axis.
// After rotation, wings reach roughly:
//   x ≈ -22 (tip far back)  to  +8 (root)
//   y ≈ ±13 (only slightly past body width)
const FLY_W = 56;
const FLY_H = 32;

const GROOM_TYPES = [
    "groom-fore",
    "groom-hind",
    "groom-head",
    "groom-wings",
] as const;
type GroomType = (typeof GROOM_TYPES)[number];
type Mode = "walk" | "pause" | GroomType | "struggling";

// ─── Web-trap interaction ─────────────────────────────────────────
// When the fly enters a spider's armed web, its position is held
// near the snare point with a strong spring, while erratic flutter
// kicks each frame. Each frame the fly accumulates "escape energy";
// once it crosses the threshold, the spring releases and the fly
// shoots away from the web centre.
const STRUGGLE_HOLD_GAIN = 18;       // spring strength holding fly to snare point
const STRUGGLE_FLUTTER_AMP = 60;     // erratic flutter amplitude (px/s²)
const STRUGGLE_ESCAPE_PER_FRAME = 0.0018; // base escape probability per ms
const STRUGGLE_BURST_SPEED = 1100;   // px/s — fly's exit shot

/**
 * Gait config — six legs with their rest knee/foot positions in
 * body-local coords (origin at the leg root). At runtime the JS tick
 * cycles each leg through stance + swing phases by computing:
 *   • forward shift along body x-axis  (cos curve)
 *   • foreshortening when "lifted"     (sin² curve, only second half)
 * which together fakes a 3D leg cycle viewed from above. Knee scales
 * with the foot so the leg's natural curvature is preserved.
 */
type Tripod = "A" | "B";
type LegSpec = {
    name: string;
    tripod: Tripod;
    restKnee: readonly [number, number];
    restFoot: readonly [number, number];
};
const LEGS: readonly LegSpec[] = [
    { name: "fore-r", tripod: "A", restKnee: [3, 3], restFoot: [7, 4] },
    { name: "mid-r",  tripod: "B", restKnee: [2, 5], restFoot: [0, 10] },
    { name: "hind-r", tripod: "A", restKnee: [-4, 5], restFoot: [-9, 7] },
    { name: "fore-l", tripod: "B", restKnee: [3, -3], restFoot: [7, -4] },
    { name: "mid-l",  tripod: "A", restKnee: [2, -5], restFoot: [0, -10] },
    { name: "hind-l", tripod: "B", restKnee: [-4, -5], restFoot: [-9, -7] },
] as const;

const TWO_PI = Math.PI * 2;
const GAIT_PERIOD_WALK_MS = 360;
const GAIT_PERIOD_SCURRY_MS = 140;
const STEP_LENGTH = 2.6;          // forward/back foot travel (units)
const LIFT_AMOUNT = 0.34;         // retraction at swing peak (foreshortening)
const STANCE_FRACTION = 0.65;     // 65% stance / 35% swing — natural insect ratio

/**
 * Asymmetric gait curve. Real insect legs spend most of the cycle in
 * stance (foot planted, dragging slowly backward as the body advances),
 * then snap forward through a fast swing. Our `phase` is in [0, 1):
 *   • [0, STANCE_FRACTION):  stance — foot moves +STEP → -STEP, eased
 *   • [STANCE_FRACTION, 1):  swing — foot snaps -STEP → +STEP and lifts
 * The lift is sin-shaped over the swing window so the foot peaks
 * mid-swing (fully foreshortened) then lands again.
 */
function gaitForward(phase: number): number {
    const p = ((phase % 1) + 1) % 1;
    if (p < STANCE_FRACTION) {
        const t = p / STANCE_FRACTION;
        const eased = 0.5 - 0.5 * Math.cos(t * Math.PI);
        return STEP_LENGTH * (1 - 2 * eased);
    }
    const t = (p - STANCE_FRACTION) / (1 - STANCE_FRACTION);
    const eased = 0.5 - 0.5 * Math.cos(t * Math.PI);
    return STEP_LENGTH * (-1 + 2 * eased);
}
function gaitLift(phase: number): number {
    const p = ((phase % 1) + 1) % 1;
    if (p < STANCE_FRACTION) return 0;
    const t = (p - STANCE_FRACTION) / (1 - STANCE_FRACTION);
    return Math.sin(t * Math.PI) * LIFT_AMOUNT;
}

export function Fly({
    variant: variantProp = "pixel-gray",
    bounds,
}: {
    variant?: FlyVariant;
    /**
     * Optional ref to a container element. When provided, the fly walks
     * within that element's bounding box instead of the full viewport,
     * positions itself absolutely inside the container, and treats the
     * mouse as a threat only when the pointer is inside the rect.
     */
    bounds?: React.RefObject<HTMLElement | null>;
} = {}) {
    // Live variant — defaults to the prop, then upgrades from localStorage
    // on mount, and re-renders whenever a `lp:fly-variant` custom event
    // fires (so the library picker can switch the active fly in real time).
    const [variant, setVariant] = useState<FlyVariant>(variantProp);
    useEffect(() => {
        if (typeof window === "undefined") return;
        const stored = getActiveFlyVariant();
        if (stored) setVariant(stored);
        const onVariantChange = (e: Event) => {
            const detail = (e as CustomEvent<FlyVariant>).detail;
            if (detail && VALID_VARIANTS.has(detail)) setVariant(detail);
        };
        window.addEventListener(FLY_VARIANT_EVENT, onVariantChange);
        return () => window.removeEventListener(FLY_VARIANT_EVENT, onVariantChange);
    }, []);

    const elRef = useRef<HTMLDivElement | null>(null);
    const legPathRefs = useRef<Map<string, SVGPathElement>>(new Map());
    const wingFlapRefs = useRef<{ r: SVGGElement | null; l: SVGGElement | null }>({
        r: null,
        l: null,
    });
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        if (typeof window === "undefined") return;
        const isCoarse = window.matchMedia("(pointer: coarse)").matches;
        if (prefersReducedMotion() || isCoarse) return;
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;
        const el = elRef.current;
        if (!el) return;

        const now = performance.now();
        // Bounds resolver — returns the active rect (container or window).
        // Pointer coords coming from `mousemove` are viewport coords, so
        // we offset them by the container's top-left when bounded.
        const getBounds = (): { w: number; h: number; ox: number; oy: number } => {
            const node = bounds?.current;
            if (node) {
                const r = node.getBoundingClientRect();
                return { w: r.width, h: r.height, ox: r.left, oy: r.top };
            }
            return {
                w: window.innerWidth,
                h: window.innerHeight,
                ox: 0,
                oy: 0,
            };
        };
        const initial = getBounds();
        const w0 = initial.w;
        const h0 = initial.h;

        const s = {
            x: w0 * 0.66,
            y: h0 * 0.34,
            vx: CRUISE_SPEED,
            vy: 5,
            wanderAngle: Math.random() * Math.PI * 2,
            heading: 0,
            mode: "walk" as Mode,
            modeUntil: now + randomInRange(WALK_DURATION_MIN, WALK_DURATION_MAX),
            pointerX: -1e6,
            pointerY: -1e6,
            pointerSeenAt: 0,
            lastT: now,
            running: true,
            // ─── Web-trap state ──────────────────────────────
            // Position of the snare anchor (in viewport coords) the
            // fly is currently stuck to, plus accumulated escape
            // energy. While > 0, mode === "struggling".
            stuckToX: 0,
            stuckToY: 0,
            stuckRadius: 0,
            escapeEnergy: 0,
        };

        const onMove = (e: MouseEvent) => {
            s.pointerX = e.clientX;
            s.pointerY = e.clientY;
            s.pointerSeenAt = performance.now();
        };
        const onLeave = () => {
            s.pointerX = -1e6;
            s.pointerY = -1e6;
        };
        const onVisibility = () => {
            if (document.hidden) {
                s.running = false;
            } else {
                s.running = true;
                s.lastT = performance.now();
                raf = requestAnimationFrame(tick);
            }
        };

        window.addEventListener("mousemove", onMove, { passive: true });
        window.addEventListener("mouseout", onLeave);
        document.addEventListener("visibilitychange", onVisibility);

        const tick = (t: number) => {
            if (!s.running) return;
            const dt = Math.min(0.05, (t - s.lastT) / 1000);
            s.lastT = t;
            const tMs = t;

            const { w, h, ox, oy } = getBounds();

            // ─── Threat detection ───────────────────────────────
            // Pointer is reported in viewport coords; subtract bounds
            // origin so it becomes container-local. When bounded, only
            // react if the pointer is actually inside the rect.
            const localPointerX = s.pointerX - ox;
            const localPointerY = s.pointerY - oy;
            const pointerInside =
                !bounds?.current ||
                (localPointerX >= 0 && localPointerY >= 0 &&
                    localPointerX <= w && localPointerY <= h);
            const dx = pointerInside ? s.x - localPointerX : 1e6;
            const dy = pointerInside ? s.y - localPointerY : 1e6;
            const distToPointer = Math.hypot(dx, dy);
            const reactionElapsed =
                tMs - s.pointerSeenAt > THREAT_REACTION_MS;
            const scurry = reactionElapsed && distToPointer < THREAT_RADIUS;

            // While scurrying, force walk mode (cancel groom/pause).
            if (scurry && s.mode !== "walk") {
                s.mode = "walk";
                s.modeUntil =
                    tMs + randomInRange(WALK_DURATION_MIN, WALK_DURATION_MAX);
            }

            let fx = 0;
            let fy = 0;
            const inWalk = s.mode === "walk";

            // ─── Web-trap check ─────────────────────────────────
            // Webs in the registry are stored in DOCUMENT coords
            // (viewport + scroll) so they stay correct as the page
            // scrolls. Convert fly's bounds-local coords → viewport
            // → document, query, then convert the snare point back.
            if (s.mode !== "struggling") {
                const docX = s.x + ox + window.scrollX;
                const docY = s.y + oy + window.scrollY;
                const web = findEnclosingWeb(docX, docY);
                if (web) {
                    // Snap into struggling mode at the snare point.
                    s.mode = "struggling";
                    s.stuckToX = web.x - ox - window.scrollX;
                    s.stuckToY = web.y - oy - window.scrollY;
                    s.stuckRadius = web.radius;
                    s.escapeEnergy = 0;
                    s.modeUntil = tMs + 12000; // safety cap (12 s max stuck)
                }
            }

            if (s.mode === "struggling") {
                // Spring-hold the fly near the snare point with high
                // gain; overlay erratic flutter so the body shakes.
                // Each frame the escape energy creeps up; once it
                // reaches 1, fire the fly outward in a random direction
                // away from the snare and return to walking.
                const ddx = s.stuckToX - s.x;
                const ddy = s.stuckToY - s.y;
                fx = ddx * STRUGGLE_HOLD_GAIN
                    + (Math.random() - 0.5) * STRUGGLE_FLUTTER_AMP * 2;
                fy = ddy * STRUGGLE_HOLD_GAIN
                    + (Math.random() - 0.5) * STRUGGLE_FLUTTER_AMP * 2;
                s.escapeEnergy +=
                    STRUGGLE_ESCAPE_PER_FRAME * (dt * 1000) *
                    (0.6 + Math.random() * 0.8);
                if (s.escapeEnergy >= 1 || tMs >= s.modeUntil) {
                    // Burst out — direction = away from snare centre,
                    // randomised so each escape feels fresh.
                    const ang = Math.atan2(s.y - s.stuckToY, s.x - s.stuckToX);
                    const angJitter = ang + (Math.random() - 0.5) * 1.6;
                    s.vx = Math.cos(angJitter) * STRUGGLE_BURST_SPEED;
                    s.vy = Math.sin(angJitter) * STRUGGLE_BURST_SPEED;
                    s.escapeEnergy = 0;
                    s.mode = "walk";
                    s.modeUntil =
                        tMs + randomInRange(WALK_DURATION_MIN, WALK_DURATION_MAX);
                }
                // Skip the rest of the mode dispatch; the spring forces
                // are already applied to fx/fy.
            } else if (scurry) {
                // Walk fast, directly away from cursor.
                const inv = 1 / Math.max(distToPointer, 0.001);
                const ax = dx * inv;
                const ay = dy * inv;
                const desiredVx = ax * SCURRY_SPEED;
                const desiredVy = ay * SCURRY_SPEED;
                fx = (desiredVx - s.vx) * STEER_GAIN_SCURRY;
                fy = (desiredVy - s.vy) * STEER_GAIN_SCURRY;
            } else if (inWalk) {
                // ─── Wander steering — slow, smooth ───────────
                s.wanderAngle += (Math.random() - 0.5) * WANDER_JITTER * dt;
                const speed = Math.hypot(s.vx, s.vy) || 0.0001;
                const hx = s.vx / speed;
                const hy = s.vy / speed;
                const cx = s.x + hx * WANDER_DISTANCE;
                const cy = s.y + hy * WANDER_DISTANCE;
                const tx = cx + Math.cos(s.wanderAngle) * WANDER_RADIUS;
                const ty = cy + Math.sin(s.wanderAngle) * WANDER_RADIUS;
                const ddx = tx - s.x;
                const ddy = ty - s.y;
                const dlen = Math.hypot(ddx, ddy) || 0.0001;
                const desiredVx = (ddx / dlen) * CRUISE_SPEED;
                const desiredVy = (ddy / dlen) * CRUISE_SPEED;
                fx = (desiredVx - s.vx) * STEER_GAIN_WALK;
                fy = (desiredVy - s.vy) * STEER_GAIN_WALK;

                // ─── Mode transition ───────────────────────────
                if (tMs >= s.modeUntil) {
                    const r = Math.random();
                    if (r < POST_WALK_GROOM_PROB) {
                        s.mode = pickRandom(GROOM_TYPES);
                        s.modeUntil =
                            tMs +
                            randomInRange(GROOM_DURATION_MIN, GROOM_DURATION_MAX);
                        s.vx = 0;
                        s.vy = 0;
                    } else if (
                        r <
                        POST_WALK_GROOM_PROB + POST_WALK_PAUSE_PROB
                    ) {
                        s.mode = "pause";
                        s.modeUntil =
                            tMs +
                            randomInRange(PAUSE_DURATION_MIN, PAUSE_DURATION_MAX);
                        s.vx = 0;
                        s.vy = 0;
                    } else {
                        // Extend walk a bit more.
                        s.modeUntil =
                            tMs +
                            randomInRange(WALK_DURATION_MIN, WALK_DURATION_MAX);
                    }
                }

                // ─── Edge avoidance ───────────────────────────
                if (s.x < EDGE_MARGIN)
                    fx += EDGE_FORCE * (1 - s.x / EDGE_MARGIN);
                else if (s.x > w - EDGE_MARGIN)
                    fx -= EDGE_FORCE * (1 - (w - s.x) / EDGE_MARGIN);
                if (s.y < EDGE_MARGIN)
                    fy += EDGE_FORCE * (1 - s.y / EDGE_MARGIN);
                else if (s.y > h - EDGE_MARGIN)
                    fy -= EDGE_FORCE * (1 - (h - s.y) / EDGE_MARGIN);
            } else {
                // ─── Pause / groom: stationary ───────────────
                s.vx *= 0.4;
                s.vy *= 0.4;
                if (tMs >= s.modeUntil) {
                    s.mode = "walk";
                    s.modeUntil =
                        tMs + randomInRange(WALK_DURATION_MIN, WALK_DURATION_MAX);
                }
            }

            // ─── Force clamp + integrate ─────────────────────
            const fmag = Math.hypot(fx, fy);
            if (fmag > MAX_FORCE) {
                const k = MAX_FORCE / fmag;
                fx *= k;
                fy *= k;
            }
            s.vx += fx * dt;
            s.vy += fy * dt;

            const speedAfterAccel = Math.hypot(s.vx, s.vy);
            const maxSpeed = scurry ? SCURRY_SPEED : CRUISE_SPEED * 1.2;
            if (speedAfterAccel > maxSpeed) {
                const k = maxSpeed / speedAfterAccel;
                s.vx *= k;
                s.vy *= k;
            }

            s.x += s.vx * dt;
            s.y += s.vy * dt;
            s.x = Math.max(2, Math.min(w - 2, s.x));
            s.y = Math.max(2, Math.min(h - 2, s.y));

            // ─── Heading smoothing ───────────────────────────
            if (speedAfterAccel > 4) {
                const target = Math.atan2(s.vy, s.vx);
                let delta = target - s.heading;
                while (delta > Math.PI) delta -= Math.PI * 2;
                while (delta < -Math.PI) delta += Math.PI * 2;
                s.heading += delta * Math.min(1, HEADING_LERP * dt);
            }

            const headingDeg = (s.heading * 180) / Math.PI;
            el.style.transform =
                `translate3d(${s.x - FLY_W / 2}px, ${s.y - FLY_H / 2}px, 0) ` +
                `rotate(${headingDeg}deg)`;
            el.dataset.mode = scurry ? "scurry" : s.mode;

            // ─── Procedural leg gait ─────────────────────────
            // While walking/scurrying, recompute each leg's path
            // every frame: foot oscillates forward/back along body
            // x-axis, and shrinks toward root during the swing phase
            // (foreshortening fakes the 3D lift). Knee scales
            // proportionally so the natural curvature is preserved.
            // Grooming modes leave the leg at rest — CSS rotates the
            // leg group instead.
            const inGait = scurry || s.mode === "walk";
            if (inGait) {
                const period = scurry
                    ? GAIT_PERIOD_SCURRY_MS
                    : GAIT_PERIOD_WALK_MS;
                const t01 = tMs / period;
                for (const leg of LEGS) {
                    const phaseOffset = leg.tripod === "A" ? 0 : 0.5;
                    const phase = t01 + phaseOffset;
                    const forward = gaitForward(phase);
                    const lift = gaitLift(phase);
                    const retract = 1 - lift;
                    const fx = leg.restFoot[0] * retract + forward;
                    const fy = leg.restFoot[1] * retract;
                    const kx = leg.restKnee[0] * retract + forward * 0.55;
                    const ky = leg.restKnee[1] * retract;
                    const path = legPathRefs.current.get(leg.name);
                    if (path) {
                        path.setAttribute(
                            "d",
                            `M 0 0 L ${kx.toFixed(2)} ${ky.toFixed(2)} L ${fx.toFixed(2)} ${fy.toFixed(2)}`,
                        );
                    }
                }
            } else {
                // Reset legs to rest pose so grooming CSS rotation
                // operates on a clean baseline.
                for (const leg of LEGS) {
                    const path = legPathRefs.current.get(leg.name);
                    if (path) {
                        const [kx, ky] = leg.restKnee;
                        const [fx, fy] = leg.restFoot;
                        path.setAttribute(
                            "d",
                            `M 0 0 L ${kx} ${ky} L ${fx} ${fy}`,
                        );
                    }
                }
            }

            // ─── Wing lift during grooming ─────────────────────
            // Real flies don't move on metronomes — the wing-clean
            // pulse here has a low-freq amplitude envelope so the
            // sweep gets quieter and louder, with brief lulls. The
            // pulse itself stays a half-sin so each up-stroke peaks
            // smoothly and the down-stroke is symmetric.
            const wingR = wingFlapRefs.current.r;
            const wingL = wingFlapRefs.current.l;
            if (s.mode === "groom-wings") {
                const pulse = Math.abs(Math.sin((tMs / 580) * Math.PI));
                // Envelope: 0.5 → 1.0 → 0.5 over ~3.2 s — produces
                // slower / faster passages instead of constant pace.
                const envelope = 0.55 + 0.45 * (Math.sin(tMs / 510) * 0.5 + 0.5);
                const lift = pulse * envelope * 24;
                wingR?.setAttribute("transform", `rotate(${-lift} 3 3)`);
                wingL?.setAttribute("transform", `rotate(${lift} 3 -3)`);
            } else if (s.mode === "groom-hind") {
                // Mild flutter — rear legs working near the abdomen,
                // wings shimmer slightly out of the way. Slight phase
                // jitter so it doesn't loop perfectly.
                const pulse = Math.sin((tMs / 320) * Math.PI * 2);
                const jitter = Math.sin(tMs / 1100) * 1.2;
                const lift = pulse * 6 + jitter;
                wingR?.setAttribute("transform", `rotate(${-lift} 3 3)`);
                wingL?.setAttribute("transform", `rotate(${lift} 3 -3)`);
            } else {
                wingR?.setAttribute("transform", "rotate(0 3 3)");
                wingL?.setAttribute("transform", "rotate(0 3 -3)");
            }

            raf = requestAnimationFrame(tick);
        };

        let raf = requestAnimationFrame(tick);

        return () => {
            s.running = false;
            cancelAnimationFrame(raf);
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("mouseout", onLeave);
            document.removeEventListener("visibilitychange", onVisibility);
        };
    }, [mounted]);

    if (!mounted) return null;

    return (
        <div
            ref={elRef}
            className={
                bounds
                    ? "fly pointer-events-none absolute left-0 top-0"
                    : "fly pointer-events-none fixed left-0 top-0 z-50"
            }
            data-variant={variant}
            aria-hidden
            style={{
                width: FLY_W,
                height: FLY_H,
                transformOrigin: "center",
                willChange: "transform",
            }}
        >
            <FlyShape
                variant={variant}
                legPathRefs={legPathRefs}
                wingFlapRefs={wingFlapRefs}
            />
        </div>
    );
}

/**
 * Anatomical layout (SVG units, 5 units = 1 mm, body horizontal head→+x):
 *
 *   x: -16 .. -2  abdomen  (segmented bands visible)
 *   x: -2  ..  6  thorax   (4 longitudinal stripes)
 *   x:  6  ..  11 head     (two compound eyes ~2.5 across)
 *
 *   Wings folded back over the abdomen — translucent overlay covering
 *   most of the rear body. NEVER deployed (the fly only walks).
 *
 *   6 jointed legs splayed outward (foreleg + midleg + hindleg per side),
 *   each leg drawn as a 3-point path (body→knee→tarsus). Always visible.
 */
function FlyShape({
    variant = "pixel-gray",
    legPathRefs,
    wingFlapRefs,
}: {
    variant?: FlyVariant;
    legPathRefs: React.RefObject<Map<string, SVGPathElement>>;
    wingFlapRefs: React.RefObject<{ r: SVGGElement | null; l: SVGGElement | null }>;
}) {
    // Unique gradient IDs per instance — needed when multiple flies
    // render on the same page (e.g. component-library variant grid).
    const uid = useId().replace(/:/g, "_");
    const G = {
        bodyBlue:    `${uid}-body-blue`,
        bodyEmerald: `${uid}-body-emerald`,
        bodyAmber:   `${uid}-body-amber`,
        bodyHousefly: `${uid}-body-housefly`,
        shimmerGold: `${uid}-shimmer-gold`,
        shimmerLime: `${uid}-shimmer-lime`,
        shimmerDun:  `${uid}-shimmer-dun`,
        eye:         `${uid}-eye`,
        eyeAmber:    `${uid}-eye-amber`,
        eyeHousefly: `${uid}-eye-housefly`,
        wingHaze:    `${uid}-wing-haze`,
        wingGradR:   `${uid}-wing-grad-r`,
        wingGradL:   `${uid}-wing-grad-l`,
        wingGradRDark: `${uid}-wing-grad-r-dark`,
        wingGradLDark: `${uid}-wing-grad-l-dark`,
    } as const;

    // Body fill per variant. pixel-gray reuses housefly's gradient as
    // the underlying attribute value — CSS in globals.css overrides it
    // via `.fly[data-variant="pixel-gray"] .fly-body` (presentation
    // attributes have lower specificity than CSS rules) so the visible
    // fill ends up flat grayscale-foreground without touching JS shape.
    const bodyFill: string = {
        housefly:       `url(#${G.bodyHousefly})`,
        "blue-bottle":  `url(#${G.bodyBlue})`,
        "green-bottle": `url(#${G.bodyEmerald})`,
        "fruit-fly":    `url(#${G.bodyAmber})`,
        "pixel-gray":   `url(#${G.bodyHousefly})`,
    }[variant];

    // Eye colour. Each species gets its own gradient — Musca's eyes
    // are deep red-mahogany (NOT pitch black) when seen up close.
    // pixel-gray's CSS override turns these into bg-alt cutouts.
    const eyeFill: string = {
        housefly:       `url(#${G.eyeHousefly})`,
        "blue-bottle":  `url(#${G.eye})`,
        "green-bottle": `url(#${G.eye})`,
        "fruit-fly":    `url(#${G.eyeAmber})`,
        "pixel-gray":   `url(#${G.eyeHousefly})`,
    }[variant];

    // Shimmer overlay — every species has a subtle highlight catch on
    // the thorax. Only the colour temperature differs by species.
    // pixel-gray hides it via CSS (chan style: no metallic catches).
    const shimmerFill: string =
        variant === "blue-bottle"
            ? `url(#${G.shimmerGold})`
            : variant === "green-bottle"
                ? `url(#${G.shimmerLime})`
                : variant === "housefly"
                    ? `url(#${G.shimmerDun})`
                    : variant === "pixel-gray"
                        ? `url(#${G.shimmerDun})`
                        : `url(#${G.shimmerGold})`;

    return (
        <svg
            width={FLY_W}
            height={FLY_H}
            viewBox={`-${FLY_W / 2} -${FLY_H / 2} ${FLY_W} ${FLY_H}`}
            style={{ display: "block", overflow: "visible", color: "var(--color-fg)" }}
            aria-hidden
        >
            {/* ─── LEGS (under body in z-order) ───────────────
                Each leg uses a 2-level group:
                  outer <g transform="translate(root)">  positions the
                                                       leg at its body
                                                       attachment.
                  inner <g class="fly-leg-anim-…">       is what animates.
                Rotation on the inner g pivots around (0,0) of its own
                coordinate system — i.e. the leg's root — instead of the
                whole-body centre, which is what made every previous
                animation look broken. */}
            <g
                className="fly-legs"
                stroke="currentColor"
                strokeWidth="0.9"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                {/* Per-leg `transformOrigin` matches where (0,0) — the
                    leg's root — sits inside that path's bounding box.
                    Without this, CSS rotations default to the SVG
                    viewBox origin (the body's centre) and the leg
                    appears to swing from the body, not the joint. */}
                {/* Right side (+y) — root is bbox top-left of all legs */}
                <g transform="translate(6 3)">
                    <g
                        className="fly-leg-anim fly-leg-anim-fore-r"
                        style={{ transformBox: "fill-box", transformOrigin: "0% 0%" }}
                    >
                        <path
                            d="M 0 0 L 3 3 L 7 4"
                            ref={(el) => { if (el) legPathRefs.current.set("fore-r", el); }}
                        />
                    </g>
                </g>
                <g transform="translate(1 4)">
                    <g
                        className="fly-leg-anim fly-leg-anim-mid-r"
                        style={{ transformBox: "fill-box", transformOrigin: "0% 0%" }}
                    >
                        <path
                            d="M 0 0 L 2 5 L 0 10"
                            ref={(el) => { if (el) legPathRefs.current.set("mid-r", el); }}
                        />
                    </g>
                </g>
                <g transform="translate(-3 4)">
                    <g
                        className="fly-leg-anim fly-leg-anim-hind-r"
                        style={{ transformBox: "fill-box", transformOrigin: "100% 0%" }}
                    >
                        <path
                            d="M 0 0 L -4 5 L -9 7"
                            ref={(el) => { if (el) legPathRefs.current.set("hind-r", el); }}
                        />
                    </g>
                </g>
                {/* Left side (-y) */}
                <g transform="translate(6 -3)">
                    <g
                        className="fly-leg-anim fly-leg-anim-fore-l"
                        style={{ transformBox: "fill-box", transformOrigin: "0% 100%" }}
                    >
                        <path
                            d="M 0 0 L 3 -3 L 7 -4"
                            ref={(el) => { if (el) legPathRefs.current.set("fore-l", el); }}
                        />
                    </g>
                </g>
                <g transform="translate(1 -4)">
                    <g
                        className="fly-leg-anim fly-leg-anim-mid-l"
                        style={{ transformBox: "fill-box", transformOrigin: "0% 100%" }}
                    >
                        <path
                            d="M 0 0 L 2 -5 L 0 -10"
                            ref={(el) => { if (el) legPathRefs.current.set("mid-l", el); }}
                        />
                    </g>
                </g>
                <g transform="translate(-3 -4)">
                    <g
                        className="fly-leg-anim fly-leg-anim-hind-l"
                        style={{ transformBox: "fill-box", transformOrigin: "100% 100%" }}
                    >
                        <path
                            d="M 0 0 L -4 -5 L -9 -7"
                            ref={(el) => { if (el) legPathRefs.current.set("hind-l", el); }}
                        />
                    </g>
                </g>
            </g>

            {/* ─── BODY ─── */}
            {/* Continuous body silhouette: abdomen + thorax + head fused
                into one smooth path with a gentle waist at the
                thorax-abdomen junction. */}
            <path
                className="fly-body"
                fill={bodyFill}
                d="
                    M -16  0
                    C -16 -2.4, -12 -3.6, -7 -4.0
                    C -3 -4.4,  0 -4.6,  4 -4.5
                    C  7 -4.4,  9 -3.5,  10 -2.5
                    C 11 -1.2, 11.4  0,  11 1.2
                    C 10  2.5,  9  3.5,  7 4.4
                    C  4  4.5,  0  4.6, -3 4.4
                    C -7  4.0,-12  3.6, -16 2.4
                    C -16  0, -16  0,  -16 0
                    Z"
            />
            {/* Shimmer overlay — colour-tempered per variant for the
                species-appropriate thorax catch (gold / lime / dun). */}
            <ellipse
                className="fly-body-shimmer"
                cx="2"
                cy="-1.5"
                rx="6"
                ry="2.2"
                fill={shimmerFill}
            />

            {/* Thorax — 4 dark longitudinal stripes (signature housefly).
                Drawn as bg-coloured curves so they read as darker grooves. */}
            <g opacity="0.32">
                <path
                    d="M -2 -3.6 Q 2 -4.0, 7 -2.8"
                    stroke="var(--bg)" strokeWidth="0.55" fill="none"
                />
                <path
                    d="M -2 -1.2 Q 2 -1.4, 7 -1.0"
                    stroke="var(--bg)" strokeWidth="0.55" fill="none"
                />
                <path
                    d="M -2  1.2 Q 2  1.4, 7  1.0"
                    stroke="var(--bg)" strokeWidth="0.55" fill="none"
                />
                <path
                    d="M -2  3.6 Q 2  4.0, 7  2.8"
                    stroke="var(--bg)" strokeWidth="0.55" fill="none"
                />
            </g>

            {/* Abdomen segmentation — visible cross-bands beneath the
                folded wings. */}
            <g opacity="0.28">
                <path d="M -14 -2.5 L -14  2.5" stroke="var(--bg)" strokeWidth="0.6" />
                <path d="M -11 -3.4 L -11  3.4" stroke="var(--bg)" strokeWidth="0.6" />
                <path d="M  -8 -4.0 L  -8  4.0" stroke="var(--bg)" strokeWidth="0.6" />
                <path d="M  -5 -4.4 L  -5  4.4" stroke="var(--bg)" strokeWidth="0.6" />
            </g>

            {/* ─── WINGS — large, perpendicular to body ─────────
                The iconic fly silhouette has wings spread laterally
                from the thorax, with the wingspan ~2× the body length.
                We commit to that for visibility — at small screen size
                anything narrower fails to read as "fly".

                Each wing is built in 3 layers:
                  1. Haze     — Gaussian-blurred halo around the membrane
                  2. Membrane — gradient fill (curved-surface read) + outline
                  3. Veins    — 8 longitudinal + 4 cross-veins (housefly
                                anatomy), constrained inside the wing
                                shape via clipPath.

                Both wings have ~16° back-sweep so the tips trail behind
                the wing roots — what real flies do at rest. */}
            <defs>
                {/* Wing membrane gradients */}
                <radialGradient id={G.wingGradR} cx="35%" cy="40%" r="65%">
                    <stop offset="0%"   stopColor="#e2e8f0" stopOpacity="0.45" />
                    <stop offset="55%"  stopColor="#94a3b8" stopOpacity="0.32" />
                    <stop offset="100%" stopColor="#64748b" stopOpacity="0.38" />
                </radialGradient>
                <radialGradient id={G.wingGradL} cx="35%" cy="60%" r="65%">
                    <stop offset="0%"   stopColor="#e2e8f0" stopOpacity="0.45" />
                    <stop offset="55%"  stopColor="#94a3b8" stopOpacity="0.32" />
                    <stop offset="100%" stopColor="#64748b" stopOpacity="0.38" />
                </radialGradient>
                <radialGradient id={G.wingGradRDark} cx="35%" cy="40%" r="65%">
                    <stop offset="0%"   stopColor="#64748b" stopOpacity="0.5" />
                    <stop offset="55%"  stopColor="#475569" stopOpacity="0.38" />
                    <stop offset="100%" stopColor="#1e293b" stopOpacity="0.45" />
                </radialGradient>
                <radialGradient id={G.wingGradLDark} cx="35%" cy="60%" r="65%">
                    <stop offset="0%"   stopColor="#64748b" stopOpacity="0.5" />
                    <stop offset="55%"  stopColor="#475569" stopOpacity="0.38" />
                    <stop offset="100%" stopColor="#1e293b" stopOpacity="0.45" />
                </radialGradient>
                <filter id={G.wingHaze} x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="1.0" />
                </filter>
                {/* ── Body gradients per variant ── */}
                {/* Calliphora vomitoria — iridescent blue-bottle */}
                <radialGradient id={G.bodyBlue} cx="32%" cy="28%" r="80%">
                    <stop offset="0%"   stopColor="#67e8f9" />
                    <stop offset="18%"  stopColor="#22d3ee" />
                    <stop offset="42%"  stopColor="#0891b2" />
                    <stop offset="68%"  stopColor="#1e40af" />
                    <stop offset="88%"  stopColor="#1e1b4b" />
                    <stop offset="100%" stopColor="#020617" />
                </radialGradient>
                {/* Lucilia sericata — iridescent green-bottle */}
                <radialGradient id={G.bodyEmerald} cx="32%" cy="28%" r="80%">
                    <stop offset="0%"   stopColor="#bbf7d0" />
                    <stop offset="20%"  stopColor="#4ade80" />
                    <stop offset="50%"  stopColor="#16a34a" />
                    <stop offset="80%"  stopColor="#15803d" />
                    <stop offset="100%" stopColor="#052e16" />
                </radialGradient>
                {/* Drosophila melanogaster — amber fruit-fly */}
                <radialGradient id={G.bodyAmber} cx="32%" cy="28%" r="80%">
                    <stop offset="0%"   stopColor="#fde68a" />
                    <stop offset="22%"  stopColor="#f59e0b" />
                    <stop offset="55%"  stopColor="#b45309" />
                    <stop offset="85%"  stopColor="#7c2d12" />
                    <stop offset="100%" stopColor="#451a03" />
                </radialGradient>
                {/* Musca domestica — warm grey-brown housefly. Real
                    houseflies are NOT pure black — they have a dusty
                    fawn / khaki body with darker thorax stripes
                    (visible separately as bg-coloured curves). */}
                <radialGradient id={G.bodyHousefly} cx="38%" cy="28%" r="80%">
                    <stop offset="0%"   stopColor="#a89886" />
                    <stop offset="20%"  stopColor="#8a7a68" />
                    <stop offset="48%"  stopColor="#5e5246" />
                    <stop offset="78%"  stopColor="#3a322a" />
                    <stop offset="100%" stopColor="#1c1612" />
                </radialGradient>
                {/* Shimmer flares — gold for blue-bottle, lime for green */}
                <radialGradient id={G.shimmerGold} cx="55%" cy="22%" r="35%">
                    <stop offset="0%"   stopColor="#fef08a" stopOpacity="0.6" />
                    <stop offset="40%"  stopColor="#facc15" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#84cc16" stopOpacity="0" />
                </radialGradient>
                <radialGradient id={G.shimmerLime} cx="55%" cy="22%" r="35%">
                    <stop offset="0%"   stopColor="#fef9c3" stopOpacity="0.5" />
                    <stop offset="40%"  stopColor="#fde047" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#65a30d" stopOpacity="0" />
                </radialGradient>
                {/* Dun warm-grey shimmer for housefly thorax — the
                    yellow-tan catch you can see on real Musca domestica
                    when the light hits the dorsal scutellum. */}
                <radialGradient id={G.shimmerDun} cx="55%" cy="22%" r="38%">
                    <stop offset="0%"   stopColor="#fde68a" stopOpacity="0.35" />
                    <stop offset="45%"  stopColor="#d6a866" stopOpacity="0.18" />
                    <stop offset="100%" stopColor="#7c5e3a" stopOpacity="0" />
                </radialGradient>
                {/* Eye gradients */}
                <radialGradient id={G.eye} cx="60%" cy="35%" r="65%">
                    <stop offset="0%"  stopColor="#fca5a5" />
                    <stop offset="20%" stopColor="#dc2626" />
                    <stop offset="60%" stopColor="#7f1d1d" />
                    <stop offset="100%" stopColor="#1e0606" />
                </radialGradient>
                <radialGradient id={G.eyeAmber} cx="60%" cy="35%" r="65%">
                    <stop offset="0%"  stopColor="#fed7aa" />
                    <stop offset="22%" stopColor="#ea580c" />
                    <stop offset="65%" stopColor="#9a3412" />
                    <stop offset="100%" stopColor="#431407" />
                </radialGradient>
                {/* Musca domestica eye — deep mahogany red, less
                    saturated than the blue-bottle's gradient. */}
                <radialGradient id={G.eyeHousefly} cx="60%" cy="35%" r="65%">
                    <stop offset="0%"  stopColor="#b07060" />
                    <stop offset="25%" stopColor="#7a3528" />
                    <stop offset="65%" stopColor="#42180e" />
                    <stop offset="100%" stopColor="#1a0806" />
                </radialGradient>
                {/* Wing leaf clip paths */}
                <clipPath id={`${uid}-wing-clip-r`}>
                    <path d="
                        M  3  3
                        C  6  6,  7 12,  6 18
                        C  4 24,  0 26, -3 25
                        C -6 23, -7 16, -5 10
                        C -3  5,  0  3,  3  3
                        Z" />
                </clipPath>
                <clipPath id={`${uid}-wing-clip-l`}>
                    <path d="
                        M  3 -3
                        C  6 -6,  7 -12,  6 -18
                        C  4 -24,  0 -26, -3 -25
                        C -6 -23, -7 -16, -5 -10
                        C -3 -5,  0  -3,  3 -3
                        Z" />
                </clipPath>
            </defs>

            <g className="fly-wings">
                {/* ── RIGHT WING — back-swept 65° around the wing ROOT
                    (3, 3). Inner <g ref> receives a runtime rotation
                    during groom-wings/groom-hind so the wing tilts up
                    out of the way of the hindleg's brushing motion. ── */}
                <g transform="rotate(65 3 3)">
                    <g ref={(el) => { wingFlapRefs.current.r = el; }}>
                        <path
                            className="fly-wing-haze"
                            d="
                                M  3  3
                                C  6  6,  7 12,  6 18
                                C  4 24,  0 26, -3 25
                                C -6 23, -7 16, -5 10
                                C -3  5,  0  3,  3  3
                                Z"
                            filter={`url(#${G.wingHaze})`}
                        />
                        <path
                            className="fly-wing fly-wing-r"
                            fill={`url(#${G.wingGradR})`}
                            d="
                                M  3  3
                                C  6  6,  7 12,  6 18
                                C  4 24,  0 26, -3 25
                                C -6 23, -7 16, -5 10
                                C -3  5,  0  3,  3  3
                                Z"
                        />
                        {/* Veins — organic curves, no straight rules.
                            5 longitudinal fanning from root + 3 short
                            cross-veins drawn as gentle arcs. Real fly
                            cross-veins are tiny curved segments
                            connecting adjacent longitudinals, never
                            ruler lines. */}
                        <g className="fly-wing-veins">
                            <path d="M 3 3 Q 6.2 12, 4 22" className="fly-vein-costa" />
                            <path d="M 2 3 Q 5 11, 3 23" />
                            <path d="M 1 3 Q 2.8 13, 0 24" />
                            <path d="M 0 3 Q -1.2 11, -3 23" />
                            <path d="M -1 4 Q -3.8 10, -5 16" />
                            <path d="M  4 9   Q 2 8.2, 0.5 9.4" />
                            <path d="M  5 14  Q 1.5 13.4, -3 14.6" />
                            <path d="M  4 19  Q 0.5 18.5, -4 19.4" />
                        </g>
                    </g>
                </g>

                {/* ── LEFT WING — mirrored, pivot at root (3, -3) ── */}
                <g transform="rotate(-65 3 -3)">
                    <g ref={(el) => { wingFlapRefs.current.l = el; }}>
                        <path
                            className="fly-wing-haze"
                            d="
                                M  3 -3
                                C  6 -6,  7 -12,  6 -18
                                C  4 -24,  0 -26, -3 -25
                                C -6 -23, -7 -16, -5 -10
                                C -3 -5,  0  -3,  3 -3
                                Z"
                            filter={`url(#${G.wingHaze})`}
                        />
                        <path
                            className="fly-wing fly-wing-l"
                            fill={`url(#${G.wingGradL})`}
                            d="
                                M  3 -3
                                C  6 -6,  7 -12,  6 -18
                                C  4 -24,  0 -26, -3 -25
                                C -6 -23, -7 -16, -5 -10
                                C -3 -5,  0  -3,  3 -3
                                Z"
                        />
                        <g className="fly-wing-veins">
                            <path d="M 3 -3 Q 6.2 -12, 4 -22" className="fly-vein-costa" />
                            <path d="M 2 -3 Q 5 -11, 3 -23" />
                            <path d="M 1 -3 Q 2.8 -13, 0 -24" />
                            <path d="M 0 -3 Q -1.2 -11, -3 -23" />
                            <path d="M -1 -4 Q -3.8 -10, -5 -16" />
                            <path d="M  4 -9   Q 2 -8.2, 0.5 -9.4" />
                            <path d="M  5 -14  Q 1.5 -13.4, -3 -14.6" />
                            <path d="M  4 -19  Q 0.5 -18.5, -4 -19.4" />
                        </g>
                    </g>
                </g>
            </g>

            {/* ─── EYES ─── */}
            {/* Compound eyes — colour driven by variant. Housefly
                gets solid dark crimson; metallic + fruit-fly variants
                use a radial gradient with a bright catchlight near
                the front. */}
            <ellipse className="fly-eye" cx="9" cy="-2.2" rx="2.5" ry="2.7" fill={eyeFill} />
            <ellipse className="fly-eye" cx="9" cy="2.2"  rx="2.5" ry="2.7" fill={eyeFill} />
            <ellipse className="fly-eye-glint" cx="10.0" cy="-2.9" rx="0.45" ry="0.35"
                fill="#fef2f2" opacity="0.85" />
            <ellipse className="fly-eye-glint" cx="10.0" cy="1.5" rx="0.45" ry="0.35"
                fill="#fef2f2" opacity="0.85" />

            {/* ─── ANTENNAE ─── */}
            <path d="M 11.2 -1.2 L 13 -2"
                stroke="currentColor" strokeWidth="0.6"
                strokeLinecap="round" fill="none" />
            <path d="M 11.2  1.2 L 13  2"
                stroke="currentColor" strokeWidth="0.6"
                strokeLinecap="round" fill="none" />
        </svg>
    );
}

function randomInRange(min: number, max: number) {
    return min + Math.random() * (max - min);
}

function pickRandom<T>(items: readonly T[]): T {
    return items[Math.floor(Math.random() * items.length)];
}

/**
 * Static, non-animated rendering of the fly anatomy at a fixed
 * heading. Useful for documentation, hero illustrations, and the
 * component-library variant grid where a walking simulation would be
 * distracting. The animated `<Fly />` component is the same artwork
 * driven by the gait + grooming state machine.
 *
 * Props:
 *   • variant   — species (housefly · blue-bottle · green-bottle · fruit-fly)
 *   • heading   — degrees, default 0 (head pointing right)
 *   • size      — pixel scale (the artwork's natural size is FLY_W × FLY_H)
 */
export function FlyArtwork({
    variant = "pixel-gray",
    heading = 0,
    size = 64,
    className,
}: {
    variant?: FlyVariant;
    heading?: number;
    size?: number;
    className?: string;
}) {
    const legPathRefs = useRef<Map<string, SVGPathElement>>(new Map());
    const wingFlapRefs = useRef<{ r: SVGGElement | null; l: SVGGElement | null }>({
        r: null,
        l: null,
    });
    return (
        <span
            className={`fly fly-static inline-block ${className ?? ""}`}
            data-variant={variant}
            aria-hidden
            style={{
                width: size,
                height: size,
                transform: `rotate(${heading}deg)`,
                transformOrigin: "center",
                color: "var(--color-fg)",
                position: "relative",
            }}
        >
            <span
                style={{
                    position: "absolute",
                    inset: 0,
                    display: "grid",
                    placeItems: "center",
                }}
            >
                <FlyShape
                    variant={variant}
                    legPathRefs={legPathRefs}
                    wingFlapRefs={wingFlapRefs}
                />
            </span>
        </span>
    );
}
