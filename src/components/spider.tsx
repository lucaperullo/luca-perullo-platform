"use client";

import { useEffect, useId, useRef, useState } from "react";
import { setActiveWeb } from "@/lib/insect-registry";
import { SpiderWeb } from "@/components/spider-web";
import { prefersReducedMotion } from "./use-reduced-motion";

/**
 * Realistic 2D simulated spider — *walks* on the screen surface.
 *
 * Spiders aren't insects (they're arachnids — 8 legs, no wings, two
 * body segments), so this is a sibling component to `<Fly />`, not a
 * variant. Same simulation primitives (Reynolds wander, edge avoidance,
 * threat-driven scurry, mode state machine) but with arachnid-specific
 * anatomy and an 8-leg *alternating tetrapod* gait — at any moment
 * 4 legs are planted (forming a stable rectangle) while 4 swing.
 *
 * Behaviour:
 *   • walk         — slow Reynolds wander, ~28 px/s
 *   • pause        — short stationary moments between walks
 *   • groom-palp   — front legs / pedipalps clean the chelicerae
 *   • groom-rear   — rear legs reach back toward spinnerets
 *   • scurry       — cursor-driven faster walk away (no flight)
 *
 * Variants:
 *   • house-spider   (Tegenaria domestica) — neutral brown
 *   • wolf-spider    (Lycosa)              — dark brown with stripes
 *   • garden-spider  (Araneus diadematus)  — orange-yellow + white cross
 *   • black-widow    (Latrodectus)         — gloss black + red abdomen
 */
export type SpiderVariant =
    | "house-spider"
    | "wolf-spider"
    | "garden-spider"
    | "black-widow";

const SPIDER_VARIANT_STORAGE_KEY = "lp-spider-variant";
const SPIDER_VARIANT_EVENT = "lp:spider-variant";
const VALID_VARIANTS: ReadonlySet<SpiderVariant> = new Set([
    "house-spider",
    "wolf-spider",
    "garden-spider",
    "black-widow",
]);

export function setActiveSpiderVariant(variant: SpiderVariant) {
    if (typeof window === "undefined") return;
    if (!VALID_VARIANTS.has(variant)) return;
    try {
        localStorage.setItem(SPIDER_VARIANT_STORAGE_KEY, variant);
    } catch {
        /* localStorage unavailable */
    }
    window.dispatchEvent(
        new CustomEvent<SpiderVariant>(SPIDER_VARIANT_EVENT, {
            detail: variant,
        }),
    );
}
export function getActiveSpiderVariant(): SpiderVariant | null {
    if (typeof window === "undefined") return null;
    try {
        const v = localStorage.getItem(SPIDER_VARIANT_STORAGE_KEY);
        if (v && VALID_VARIANTS.has(v as SpiderVariant)) return v as SpiderVariant;
    } catch {
        /* ignore */
    }
    return null;
}

// ─── Tuning ────────────────────────────────────────────────────────
const CRUISE_SPEED = 28;        // px/s — spiders walk slowly + deliberately
const SCURRY_SPEED = 110;
const STEER_GAIN_WALK = 5;
const STEER_GAIN_SCURRY = 13;
const MAX_FORCE = 700;

const WANDER_RADIUS = 28;
const WANDER_DISTANCE = 24;
const WANDER_JITTER = 1.4;

const HEADING_LERP = 3.5;       // slower turn — long-legged

const THREAT_RADIUS = 130;
const THREAT_REACTION_MS = 50;

const WALK_DURATION_MIN = 4500;
const WALK_DURATION_MAX = 9000;
const PAUSE_DURATION_MIN = 1100;
const PAUSE_DURATION_MAX = 2400;
const GROOM_DURATION_MIN = 2400;
const GROOM_DURATION_MAX = 5000;

const POST_WALK_GROOM_PROB = 0.45;
const POST_WALK_PAUSE_PROB = 0.30;

const EDGE_MARGIN = 80;
const EDGE_FORCE = 700;

const SPIDER_W = 44;
const SPIDER_H = 38;

const GROOM_TYPES = ["groom-palp", "groom-rear"] as const;
type GroomType = (typeof GROOM_TYPES)[number];
type Mode =
    | "walk"
    | "pause"
    | GroomType
    | "web-travel"   // walking toward a chosen corner to start spinning
    | "web-spin"     // stationary at the corner, building the web
    | "web-wait";    // sitting at the centre of the finished web

// Web-cycle tuning
const WEB_BUILD_MS = 9000;          // 9 s to spin one orb web
const WEB_WAIT_MIN_MS = 22000;       // 22-50 s of waiting at a finished web
const WEB_WAIT_MAX_MS = 50000;
const WEB_RADIUS_MIN = 60;
const WEB_RADIUS_MAX = 95;
const WEB_CYCLE_PROBABILITY = 0.30;  // 30% of post-walk transitions launch a web build

// 8 legs in **alternating tetrapod** groups. Tetrapod A planted while
// Tetrapod B swings, then they alternate. Each leg's `restFoot` /
// `restKnee` are in body-local coords (origin at leg root = where it
// attaches to the cephalothorax).
type Tetrapod = "A" | "B";
type LegSpec = {
    name: string;
    tetrapod: Tetrapod;
    /** Where the leg root attaches to the cephalothorax. */
    rootX: number;
    rootY: number;
    /** Knee + foot in body-local coords *relative to the root*. */
    restKnee: readonly [number, number];
    restFoot: readonly [number, number];
};

const LEGS: readonly LegSpec[] = [
    // Right side (positive y) — leg I (foreleg) → leg IV (hindleg)
    { name: "1-r", tetrapod: "A", rootX:  6, rootY:  3, restKnee: [3, 4], restFoot: [10, 6] },
    { name: "2-r", tetrapod: "B", rootX:  4, rootY:  4, restKnee: [3, 6], restFoot: [8, 11] },
    { name: "3-r", tetrapod: "A", rootX:  1, rootY:  4, restKnee: [-2, 6], restFoot: [-4, 12] },
    { name: "4-r", tetrapod: "B", rootX: -2, rootY:  4, restKnee: [-5, 5], restFoot: [-11, 9] },
    // Left side (negative y) — mirror
    { name: "1-l", tetrapod: "B", rootX:  6, rootY: -3, restKnee: [3, -4], restFoot: [10, -6] },
    { name: "2-l", tetrapod: "A", rootX:  4, rootY: -4, restKnee: [3, -6], restFoot: [8, -11] },
    { name: "3-l", tetrapod: "B", rootX:  1, rootY: -4, restKnee: [-2, -6], restFoot: [-4, -12] },
    { name: "4-l", tetrapod: "A", rootX: -2, rootY: -4, restKnee: [-5, -5], restFoot: [-11, -9] },
] as const;

const GAIT_PERIOD_WALK_MS = 480;
const GAIT_PERIOD_SCURRY_MS = 180;
const STEP_LENGTH = 2.2;

// Anatomical timing — *real* spider duty factor is 60-75% on hard
// ground (JEB 2011 + PMC 2019). 70% is the documented mid value.
const STANCE_FRACTION = 0.70;
const LIFT_AMOUNT = 0.22;            // less foreshortening since swing is short

/**
 * Stance phase (foot planted, dragged backward) — eased cosine so the
 * foot doesn't move at constant velocity (gives it the slight pause at
 * the extremes that real spiders show).
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
/**
 * Swing phase lift — *front-loaded* curve modelling the spider's
 * hydraulic leg extension (Springer 2021): hemolymph pressure release
 * snaps the leg up fast, then it settles back down more slowly. We
 * approximate with t^0.6 * (1 - t^1.8) — peaks around t≈0.4 and
 * decays smoothly toward 0 at t=1. The *4 normalises peak amplitude.
 */
function gaitLift(phase: number): number {
    const p = ((phase % 1) + 1) % 1;
    if (p < STANCE_FRACTION) return 0;
    const t = (p - STANCE_FRACTION) / (1 - STANCE_FRACTION);
    return Math.pow(t, 0.6) * (1 - Math.pow(t, 1.8)) * 4 * LIFT_AMOUNT;
}

function randomInRange(min: number, max: number) {
    return min + Math.random() * (max - min);
}
function pickRandom<T>(items: readonly T[]): T {
    return items[Math.floor(Math.random() * items.length)];
}

/**
 * Scan the DOM for `[data-spider-anchor]` elements and pick a real
 * spider-realistic web placement.
 *
 * Real orb-weavers anchor webs at *corners* — the angle between two
 * surfaces (a wall + a windowsill, or two adjacent leaves). We model
 * that with two strategies:
 *
 *   • For SQUARE-ISH anchors (social tiles, showcase figures), pick
 *     one of the 4 corners and offset the web centre slightly OUTWARD
 *     from the rect's centre. The web sits in the empty space
 *     adjacent to the corner, which is exactly where a real spider
 *     would build between adjacent surfaces.
 *   • For LINE-LIKE anchors (vertical SideLines, horizontal
 *     SectionRules), pick a random point along the middle 60% of the
 *     long axis — there's no "corner" on a line, so this is the best
 *     approximation.
 *
 * Returns a point in *bounds-local* coordinates.
 */
function pickWebAnchorPoint(
    boundsEl: HTMLElement | null,
    webRadius: number,
): { x: number; y: number } | null {
    if (typeof document === "undefined") return null;
    const els = document.querySelectorAll<HTMLElement>("[data-spider-anchor]");
    if (els.length === 0) return null;

    const boundsRect = boundsEl ? boundsEl.getBoundingClientRect() : null;
    const w = boundsRect ? boundsRect.width : window.innerWidth;
    const h = boundsRect ? boundsRect.height : window.innerHeight;
    const ox = boundsRect ? boundsRect.left : 0;
    const oy = boundsRect ? boundsRect.top : 0;

    const candidates: { x: number; y: number }[] = [];
    els.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.width === 0 && rect.height === 0) return;
        if (rect.right < ox || rect.bottom < oy) return;
        if (rect.left > ox + w || rect.top > oy + h) return;

        let vx: number;
        let vy: number;
        if (rect.width > rect.height * 1.6) {
            // Horizontal line — sample mid-60% of width.
            vx = rect.left + (0.2 + Math.random() * 0.6) * rect.width;
            vy = rect.top + rect.height / 2;
        } else if (rect.height > rect.width * 1.6) {
            // Vertical line — sample mid-60% of height.
            vx = rect.left + rect.width / 2;
            vy = rect.top + (0.2 + Math.random() * 0.6) * rect.height;
        } else {
            // Square-ish — pick a corner with outward offset.
            const corner = Math.floor(Math.random() * 4);
            const cornerX = corner === 0 || corner === 3 ? rect.left : rect.right;
            const cornerY = corner === 0 || corner === 1 ? rect.top : rect.bottom;
            // Offset outward (away from rect centre) by ~0.7 web radius,
            // so the web sits in the angular space adjacent to the corner.
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const dx = cornerX - cx;
            const dy = cornerY - cy;
            const dlen = Math.hypot(dx, dy) || 1;
            const offset = webRadius * 0.7;
            vx = cornerX + (dx / dlen) * offset;
            vy = cornerY + (dy / dlen) * offset;
        }

        const localX = vx - ox;
        const localY = vy - oy;
        const margin = webRadius + 16;
        if (localX < margin || localX > w - margin) return;
        if (localY < margin || localY > h - margin) return;

        candidates.push({ x: localX, y: localY });
    });

    if (candidates.length === 0) return null;
    return candidates[Math.floor(Math.random() * candidates.length)];
}

/**
 * Pick a point on the *perimeter edge* of an anchor element. Real
 * spiders walk on surfaces, not through empty space, so we constrain
 * the patrol targets to actual element borders. Each call returns:
 *   • the target point in bounds-local coords
 *   • the host element it sits on (so subsequent calls can prefer
 *     the same host → spider walks the perimeter of one element for
 *     a while before jumping to a new one)
 *
 * Bias: 75% chance to stay on the previous host (with the target on
 * a different edge / different t along the same edge), 25% chance to
 * jump to a fresh host. Produces "patrolling on this box for a while,
 * then crossing to the next box" motion instead of constant teleporting.
 */
function pickEdgePointOnRect(rect: DOMRect): { x: number; y: number } {
    const edge = Math.floor(Math.random() * 4);
    switch (edge) {
        case 0: // top
            return { x: rect.left + Math.random() * rect.width, y: rect.top };
        case 1: // right
            return { x: rect.right, y: rect.top + Math.random() * rect.height };
        case 2: // bottom
            return {
                x: rect.left + Math.random() * rect.width,
                y: rect.bottom,
            };
        default: // left
            return { x: rect.left, y: rect.top + Math.random() * rect.height };
    }
}

/**
 * Given a starting point near a rect's perimeter, take a step of
 * `stepDist` *along* the perimeter (clamping at corners). The
 * starting point is projected onto the closest edge first, so the
 * walk is always rect-tangential. Used while the spider is
 * patrolling a single host's border.
 */
function nextPerimeterStep(
    rect: DOMRect,
    fromX: number,
    fromY: number,
    stepDist: number,
): { x: number; y: number } {
    const dTop = Math.abs(fromY - rect.top);
    const dBottom = Math.abs(fromY - rect.bottom);
    const dLeft = Math.abs(fromX - rect.left);
    const dRight = Math.abs(fromX - rect.right);
    const minD = Math.min(dTop, dBottom, dLeft, dRight);
    const dir = Math.random() < 0.5 ? -1 : 1;
    let nx = fromX;
    let ny = fromY;
    if (minD === dTop) {
        ny = rect.top;
        nx = clamp(fromX + dir * stepDist, rect.left, rect.right);
    } else if (minD === dBottom) {
        ny = rect.bottom;
        nx = clamp(fromX + dir * stepDist, rect.left, rect.right);
    } else if (minD === dLeft) {
        nx = rect.left;
        ny = clamp(fromY + dir * stepDist, rect.top, rect.bottom);
    } else {
        nx = rect.right;
        ny = clamp(fromY + dir * stepDist, rect.top, rect.bottom);
    }
    return { x: nx, y: ny };
}

function clamp(v: number, lo: number, hi: number) {
    return v < lo ? lo : v > hi ? hi : v;
}

function pickPatrolTarget(
    boundsEl: HTMLElement | null,
    preferredHost: HTMLElement | null,
    /** Spider's current viewport position — used to compute small
     *  perimeter steps when staying on the same host. */
    fromVX: number,
    fromVY: number,
): { x: number; y: number; host: HTMLElement | null } | null {
    if (typeof document === "undefined") return null;
    const boundsRect = boundsEl ? boundsEl.getBoundingClientRect() : null;
    const w = boundsRect ? boundsRect.width : window.innerWidth;
    const h = boundsRect ? boundsRect.height : window.innerHeight;
    const ox = boundsRect ? boundsRect.left : 0;
    const oy = boundsRect ? boundsRect.top : 0;

    const inBoundsRect = (vx: number, vy: number, margin = 8): boolean => {
        const lx = vx - ox;
        const ly = vy - oy;
        return lx >= margin && lx <= w - margin && ly >= margin && ly <= h - margin;
    };

    // 1. Stay on the previous host — take a 30-60 px STEP along the
    //    perimeter from the spider's current point. The spider literally
    //    walks the box's border instead of jumping to a random edge point.
    if (
        preferredHost &&
        document.body.contains(preferredHost) &&
        Math.random() < 0.85
    ) {
        const rect = preferredHost.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
            const stepDist = 26 + Math.random() * 30;
            const next = nextPerimeterStep(rect, fromVX, fromVY, stepDist);
            if (inBoundsRect(next.x, next.y)) {
                return {
                    x: next.x - ox,
                    y: next.y - oy,
                    host: preferredHost,
                };
            }
        }
    }

    // 2. Pick a fresh host whose perimeter falls inside the bounds.
    //    First step on the new host = nearest perimeter point to the
    //    current spider position, so the transit is the shortest
    //    possible "cross the gap" jump.
    const els = document.querySelectorAll<HTMLElement>("[data-spider-anchor]");
    const candidates: HTMLElement[] = [];
    els.forEach((el) => {
        if (el === preferredHost) return;
        const rect = el.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;
        if (rect.right < ox || rect.bottom < oy) return;
        if (rect.left > ox + w || rect.top > oy + h) return;
        candidates.push(el);
    });
    if (candidates.length > 0) {
        for (let attempt = 0; attempt < 6; attempt++) {
            const el = candidates[Math.floor(Math.random() * candidates.length)];
            const rect = el.getBoundingClientRect();
            const p = pickEdgePointOnRect(rect);
            if (inBoundsRect(p.x, p.y)) {
                return { x: p.x - ox, y: p.y - oy, host: el };
            }
        }
    }

    // 3. No reachable anchor — random interior fallback.
    return {
        x: 40 + Math.random() * Math.max(0, w - 80),
        y: 40 + Math.random() * Math.max(0, h - 80),
        host: null,
    };
}

export function Spider({
    variant: variantProp = "house-spider",
    bounds,
}: {
    variant?: SpiderVariant;
    bounds?: React.RefObject<HTMLElement | null>;
} = {}) {
    const [variant, setVariant] = useState<SpiderVariant>(variantProp);
    useEffect(() => {
        if (typeof window === "undefined") return;
        const stored = getActiveSpiderVariant();
        if (stored) setVariant(stored);
        const onVariantChange = (e: Event) => {
            const detail = (e as CustomEvent<SpiderVariant>).detail;
            if (detail && VALID_VARIANTS.has(detail)) setVariant(detail);
        };
        window.addEventListener(SPIDER_VARIANT_EVENT, onVariantChange);
        return () =>
            window.removeEventListener(SPIDER_VARIANT_EVENT, onVariantChange);
    }, []);

    const elRef = useRef<HTMLDivElement | null>(null);
    const legPathRefs = useRef<Map<string, SVGPathElement>>(new Map());
    const [mounted, setMounted] = useState(false);
    // Unique id for the web registry (each <Spider/> has its own).
    const spiderId = useId();
    // Live web state pushed to React when it changes — drives the
    // <SpiderWeb> render. Refs in `s` are still the source of truth
    // for the simulation, this just mirrors what's worth rendering.
    const [activeWeb, setActiveWebState] = useState<{
        x: number;
        y: number;
        radius: number;
        seed: number;
        progress: number;
    } | null>(null);

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
        const init = getBounds();

        const s = {
            x: init.w * 0.5,
            y: init.h * 0.5,
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
            // ─── Web cycle ──────────────────────────────────
            webX: 0,
            webY: 0,
            webRadius: 0,
            webSeed: 0,
            webBuildStart: 0,
            // ─── Patrol target (edge-walking) ───────────────
            // The spider's targets are points on the *perimeter edges*
            // of `[data-spider-anchor]` elements — it walks ON box
            // borders, not through empty space. `patrolHost` is the
            // element it's currently traversing; subsequent targets
            // bias back to the same host, so the spider walks one
            // box's perimeter for a while before jumping.
            patrolTargetX: 0,
            patrolTargetY: 0,
            patrolHasTarget: false,
            patrolHost: null as HTMLElement | null,
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

            const localPointerX = s.pointerX - ox;
            const localPointerY = s.pointerY - oy;
            const pointerInside =
                !bounds?.current ||
                (localPointerX >= 0 && localPointerY >= 0 &&
                    localPointerX <= w && localPointerY <= h);
            const dx = pointerInside ? s.x - localPointerX : 1e6;
            const dy = pointerInside ? s.y - localPointerY : 1e6;
            const distToPointer = Math.hypot(dx, dy);
            const reactionElapsed = tMs - s.pointerSeenAt > THREAT_REACTION_MS;
            const scurry = reactionElapsed && distToPointer < THREAT_RADIUS;

            if (scurry && s.mode !== "walk") {
                s.mode = "walk";
                s.modeUntil =
                    tMs + randomInRange(WALK_DURATION_MIN, WALK_DURATION_MAX);
            }

            let fx = 0;
            let fy = 0;
            const inWalk = s.mode === "walk";

            if (scurry) {
                const inv = 1 / Math.max(distToPointer, 0.001);
                const ax = dx * inv;
                const ay = dy * inv;
                const proximity = 1 - distToPointer / THREAT_RADIUS;
                const strength = proximity * proximity;
                fx = (ax * SCURRY_SPEED - s.vx) * STEER_GAIN_SCURRY * (0.65 + strength);
                fy = (ay * SCURRY_SPEED - s.vy) * STEER_GAIN_SCURRY * (0.65 + strength);
            } else if (inWalk) {
                // ─── Patrol movement (edge-walking) ──────────
                // Targets are points on the perimeter edges of
                // `[data-spider-anchor]` elements. Reaching one
                // triggers picking the next, biased toward the same
                // host element so the spider walks the perimeter of
                // one box for a while before jumping.
                const distToTarget = s.patrolHasTarget
                    ? Math.hypot(s.patrolTargetX - s.x, s.patrolTargetY - s.y)
                    : Infinity;
                if (!s.patrolHasTarget || distToTarget < 5) {
                    const target = pickPatrolTarget(
                        bounds?.current ?? null,
                        s.patrolHost,
                        s.x + ox,
                        s.y + oy,
                    );
                    if (target) {
                        s.patrolTargetX = target.x;
                        s.patrolTargetY = target.y;
                        s.patrolHost = target.host;
                        s.patrolHasTarget = true;
                    }
                }
                if (s.patrolHasTarget) {
                    const ddx = s.patrolTargetX - s.x;
                    const ddy = s.patrolTargetY - s.y;
                    const dlen = Math.hypot(ddx, ddy) || 0.0001;
                    // Gentle organic jitter on the desired-direction
                    // perpendicular — keeps the path from looking
                    // ruler-straight without making it chaotic.
                    const jx = -ddy / dlen;
                    const jy = ddx / dlen;
                    const noise = (Math.random() - 0.5) * 0.18;
                    const desiredVx =
                        ((ddx / dlen) + jx * noise) * CRUISE_SPEED;
                    const desiredVy =
                        ((ddy / dlen) + jy * noise) * CRUISE_SPEED;
                    fx = (desiredVx - s.vx) * STEER_GAIN_WALK;
                    fy = (desiredVy - s.vy) * STEER_GAIN_WALK;
                }

                if (tMs >= s.modeUntil) {
                    const r = Math.random();
                    if (r < WEB_CYCLE_PROBABILITY) {
                        // ─── Pick where to spin the web ───
                        // Preference order:
                        //   1. A DOM element marked data-spider-anchor
                        //      (vertical UI hairlines, section rules,
                        //      element borders the page author opted in).
                        //   2. Fallback: a random corner of the bounds.
                        s.webRadius = randomInRange(WEB_RADIUS_MIN, WEB_RADIUS_MAX);
                        const anchor = pickWebAnchorPoint(
                            bounds?.current ?? null,
                            s.webRadius,
                        );
                        if (anchor) {
                            s.webX = anchor.x;
                            s.webY = anchor.y;
                        } else {
                            const margin = s.webRadius + 12;
                            const horizPick = Math.random() < 0.5 ? "L" : "R";
                            const vertPick = Math.random() < 0.5 ? "T" : "B";
                            s.webX =
                                horizPick === "L"
                                    ? randomInRange(margin, margin + 30)
                                    : randomInRange(w - margin - 30, w - margin);
                            s.webY =
                                vertPick === "T"
                                    ? randomInRange(margin, margin + 30)
                                    : randomInRange(h - margin - 30, h - margin);
                        }
                        s.webSeed = Math.floor(Math.random() * 1_000_000);
                        s.mode = "web-travel";
                        s.modeUntil = tMs + 30000; // safety cap
                    } else if (r < WEB_CYCLE_PROBABILITY + POST_WALK_GROOM_PROB) {
                        s.mode = pickRandom(GROOM_TYPES);
                        s.modeUntil =
                            tMs +
                            randomInRange(GROOM_DURATION_MIN, GROOM_DURATION_MAX);
                        s.vx = 0;
                        s.vy = 0;
                    } else if (r < WEB_CYCLE_PROBABILITY + POST_WALK_GROOM_PROB + POST_WALK_PAUSE_PROB) {
                        s.mode = "pause";
                        s.modeUntil =
                            tMs +
                            randomInRange(PAUSE_DURATION_MIN, PAUSE_DURATION_MAX);
                        s.vx = 0;
                        s.vy = 0;
                    } else {
                        s.modeUntil =
                            tMs +
                            randomInRange(WALK_DURATION_MIN, WALK_DURATION_MAX);
                    }
                }

                if (s.x < EDGE_MARGIN)
                    fx += EDGE_FORCE * (1 - s.x / EDGE_MARGIN);
                else if (s.x > w - EDGE_MARGIN)
                    fx -= EDGE_FORCE * (1 - (w - s.x) / EDGE_MARGIN);
                if (s.y < EDGE_MARGIN)
                    fy += EDGE_FORCE * (1 - s.y / EDGE_MARGIN);
                else if (s.y > h - EDGE_MARGIN)
                    fy -= EDGE_FORCE * (1 - (h - s.y) / EDGE_MARGIN);
            } else if (s.mode === "web-travel") {
                // Walk straight toward the chosen anchor at scurry pace.
                // When close enough, plant + start spinning.
                const ddx = s.webX - s.x;
                const ddy = s.webY - s.y;
                const dist = Math.hypot(ddx, ddy);
                if (dist < 4) {
                    s.x = s.webX;
                    s.y = s.webY;
                    s.vx = 0;
                    s.vy = 0;
                    s.mode = "web-spin";
                    s.webBuildStart = tMs;
                    s.modeUntil = tMs + WEB_BUILD_MS;
                    // Register the web in *document* coords (viewport
                    // + scroll), so the entry stays correct as the
                    // user scrolls the page. Both spider (which
                    // scrolls with page) and fly (which doesn't, but
                    // can convert) use the same frame.
                    setActiveWeb(spiderId, {
                        id: spiderId,
                        x: s.webX + ox + window.scrollX,
                        y: s.webY + oy + window.scrollY,
                        radius: s.webRadius,
                        state: "building",
                    });
                    setActiveWebState({
                        x: s.webX,
                        y: s.webY,
                        radius: s.webRadius,
                        seed: s.webSeed,
                        progress: 0,
                    });
                } else {
                    const desiredVx = (ddx / dist) * SCURRY_SPEED * 0.7;
                    const desiredVy = (ddy / dist) * SCURRY_SPEED * 0.7;
                    fx = (desiredVx - s.vx) * STEER_GAIN_WALK;
                    fy = (desiredVy - s.vy) * STEER_GAIN_WALK;
                }
                if (tMs >= s.modeUntil) {
                    // Safety: reset to walk after 30 s if travel stalls.
                    s.mode = "walk";
                    s.modeUntil =
                        tMs + randomInRange(WALK_DURATION_MIN, WALK_DURATION_MAX);
                }
            } else if (s.mode === "web-spin") {
                // The spider physically weaves: it walks the spiral
                // from the outside in while silk extrudes from the
                // spinnerets at the rear. The visible web reveal
                // (progressive stroke-dashoffset) is gated by build
                // progress, so the threads "appear" precisely where
                // the spider has just been.
                const elapsed = tMs - s.webBuildStart;
                const progress = Math.min(1, elapsed / WEB_BUILD_MS);

                // Spiral target: 2.5 turns from edge (t=0) to centre
                // (t=1). Speed adjusted to match the build duration.
                const turns = 2.5;
                const spiralAngle = progress * turns * Math.PI * 2;
                const spiralR = (1 - progress) * s.webRadius * 0.85;
                const targetX = s.webX + Math.cos(spiralAngle) * spiralR;
                const targetY = s.webY + Math.sin(spiralAngle) * spiralR;

                const ddx = targetX - s.x;
                const ddy = targetY - s.y;
                const dist = Math.hypot(ddx, ddy);
                if (dist > 0.4) {
                    const speedTarget = 30; // px/s — deliberate weaving pace
                    const desiredVx = (ddx / dist) * speedTarget;
                    const desiredVy = (ddy / dist) * speedTarget;
                    fx = (desiredVx - s.vx) * STEER_GAIN_WALK;
                    fy = (desiredVy - s.vy) * STEER_GAIN_WALK;
                } else {
                    s.vx = 0;
                    s.vy = 0;
                }

                setActiveWebState((cur) =>
                    cur && Math.abs(cur.progress - progress) > 0.005
                        ? { ...cur, progress }
                        : cur,
                );
                if (progress >= 1) {
                    // Snap to web centre when finished.
                    s.x = s.webX;
                    s.y = s.webY;
                    s.vx = 0;
                    s.vy = 0;
                    s.mode = "web-wait";
                    s.modeUntil =
                        tMs + randomInRange(WEB_WAIT_MIN_MS, WEB_WAIT_MAX_MS);
                    // Web armed — promote in registry (document coords).
                    setActiveWeb(spiderId, {
                        id: spiderId,
                        x: s.webX + ox + window.scrollX,
                        y: s.webY + oy + window.scrollY,
                        radius: s.webRadius,
                        state: "ready",
                    });
                }
            } else if (s.mode === "web-wait") {
                // Sit dead-still at the centre of the web.
                s.vx = 0;
                s.vy = 0;
                if (tMs >= s.modeUntil) {
                    s.mode = "walk";
                    s.modeUntil =
                        tMs + randomInRange(WALK_DURATION_MIN, WALK_DURATION_MAX);
                    // Tear down the web — registry + React state.
                    setActiveWeb(spiderId, null);
                    setActiveWebState(null);
                }
            } else {
                // pause + groom modes: stationary
                s.vx *= 0.4;
                s.vy *= 0.4;
                if (tMs >= s.modeUntil) {
                    s.mode = "walk";
                    s.modeUntil =
                        tMs + randomInRange(WALK_DURATION_MIN, WALK_DURATION_MAX);
                }
            }

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

            if (speedAfterAccel > 4) {
                const target = Math.atan2(s.vy, s.vx);
                let delta = target - s.heading;
                while (delta > Math.PI) delta -= Math.PI * 2;
                while (delta < -Math.PI) delta += Math.PI * 2;
                s.heading += delta * Math.min(1, HEADING_LERP * dt);
            }

            const headingDeg = (s.heading * 180) / Math.PI;
            el.style.transform =
                `translate3d(${s.x - SPIDER_W / 2}px, ${s.y - SPIDER_H / 2}px, 0) ` +
                `rotate(${headingDeg}deg)`;
            el.dataset.mode = scurry ? "scurry" : s.mode;

            // Procedural leg gait — same primitive as fly but for 8 legs
            // grouped in alternating tetrapods.
            const inGait = scurry || s.mode === "walk";
            if (inGait) {
                const period = scurry ? GAIT_PERIOD_SCURRY_MS : GAIT_PERIOD_WALK_MS;
                const t01 = tMs / period;
                // ─── Phase jitter (metachronal degradation under scurry) ──
                // Real spiders, at slow speeds, hold a tight tetrapod
                // (Hololena 2014). Above ~5 body-lengths/s the
                // ipsilateral pairs lose phase lock and slide into a
                // wave-like (metachronal) pattern. We approximate with
                // a small per-leg sinusoidal phase shift, only active
                // when scurrying.
                LEGS.forEach((leg, i) => {
                    const phaseOffset = leg.tetrapod === "A" ? 0 : 0.5;
                    const jitter = scurry
                        ? Math.sin(tMs * 0.0017 + i * 1.7) * 0.06
                        : 0;
                    const phase = t01 + phaseOffset + jitter;
                    const forward = gaitForward(phase);
                    const lift = gaitLift(phase);
                    const retract = 1 - lift;
                    const fxL = leg.restFoot[0] * retract + forward;
                    const fyL = leg.restFoot[1] * retract;
                    const kxL = leg.restKnee[0] * retract + forward * 0.55;
                    const kyL = leg.restKnee[1] * retract;

                    // Bow-curve segment from knee to foot — adds the
                    // 3-segment bow shape real spider legs have
                    // (Springer 2021 — compliant bow vs zig-zag).
                    // Control point sits 25% of the way past the
                    // midpoint, offset perpendicular to the segment.
                    const midX = (kxL + fxL) / 2;
                    const midY = (kyL + fyL) / 2;
                    const segDx = fxL - kxL;
                    const segDy = fyL - kyL;
                    const segLen = Math.hypot(segDx, segDy) || 1;
                    // Perpendicular direction (outward = away from body
                    // centre). Sign chosen by which side the leg lives on.
                    const sideSign = leg.rootY > 0 ? 1 : -1;
                    const perpX = (-segDy / segLen) * sideSign;
                    const perpY = (segDx / segLen) * sideSign;
                    const bow = 0.18 * segLen;
                    const cpX = midX + perpX * bow;
                    const cpY = midY + perpY * bow;

                    const path = legPathRefs.current.get(leg.name);
                    if (path) {
                        path.setAttribute(
                            "d",
                            `M 0 0 L ${kxL.toFixed(2)} ${kyL.toFixed(2)} Q ${cpX.toFixed(2)} ${cpY.toFixed(2)}, ${fxL.toFixed(2)} ${fyL.toFixed(2)}`,
                        );
                    }
                });
            } else {
                for (const leg of LEGS) {
                    const path = legPathRefs.current.get(leg.name);
                    if (path) {
                        const [kx, ky] = leg.restKnee;
                        const [fxR, fyR] = leg.restFoot;
                        // Same bow geometry as the gait branch.
                        const midX = (kx + fxR) / 2;
                        const midY = (ky + fyR) / 2;
                        const segDx = fxR - kx;
                        const segDy = fyR - ky;
                        const segLen = Math.hypot(segDx, segDy) || 1;
                        const sideSign = leg.rootY > 0 ? 1 : -1;
                        const perpX = (-segDy / segLen) * sideSign;
                        const perpY = (segDx / segLen) * sideSign;
                        const bow = 0.18 * segLen;
                        const cpX = midX + perpX * bow;
                        const cpY = midY + perpY * bow;
                        path.setAttribute(
                            "d",
                            `M 0 0 L ${kx} ${ky} Q ${cpX.toFixed(2)} ${cpY.toFixed(2)}, ${fxR} ${fyR}`,
                        );
                    }
                }
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
            // Always clean up our web entry — otherwise unmounting a
            // spider while waiting would leave a "ghost" web armed.
            setActiveWeb(spiderId, null);
        };
    }, [mounted, bounds, spiderId]);

    if (!mounted) return null;

    return (
        <>
            {/* Active web (if any) — rendered as a sibling so it stays
                in place after the spider walks off, and so its z-order
                sits *under* the spider when it returns to wait. */}
            {activeWeb ? (
                <SpiderWeb
                    x={activeWeb.x}
                    y={activeWeb.y}
                    radius={activeWeb.radius}
                    seed={activeWeb.seed}
                    progress={activeWeb.progress}
                    bounded={!!bounds}
                />
            ) : null}
            <div
                ref={elRef}
                className={
                    bounds
                        ? "spider pointer-events-none absolute left-0 top-0"
                        : "spider pointer-events-none fixed left-0 top-0 z-50"
                }
                data-variant={variant}
                aria-hidden
                style={{
                    width: SPIDER_W,
                    height: SPIDER_H,
                    transformOrigin: "center",
                    willChange: "transform",
                }}
            >
                <SpiderShape variant={variant} legPathRefs={legPathRefs} />
            </div>
        </>
    );
}

/**
 * Anatomical layout (SVG units, body horizontal head→+x):
 *
 *   x: -10 ..  -1  abdomen  (rounded oval, larger than cephalothorax)
 *   x:  -1 ..   1  petiole  (narrow waist)
 *   x:   1 ..   8  cephalothorax  (smaller front body, holds eyes + legs)
 *
 *   8 legs attach around the cephalothorax (x: 1..8, y: ±3..4) with
 *   long extensions outward (~14-16 unit reach). Eye cluster sits on
 *   top of the cephalothorax around (6, ±1).
 */
function SpiderShape({
    variant = "house-spider",
    legPathRefs,
}: {
    variant?: SpiderVariant;
    legPathRefs: React.RefObject<Map<string, SVGPathElement>>;
}) {
    const uid = useId().replace(/:/g, "_");
    const G = {
        bodyHouse:  `${uid}-body-house`,
        bodyWolf:   `${uid}-body-wolf`,
        bodyGarden: `${uid}-body-garden`,
        bodyWidow:  `${uid}-body-widow`,
        abdomenHouse:  `${uid}-abd-house`,
        abdomenWolf:   `${uid}-abd-wolf`,
        abdomenGarden: `${uid}-abd-garden`,
        abdomenWidow:  `${uid}-abd-widow`,
        widowAccent: `${uid}-widow-accent`,
    } as const;

    const cephFill: string = {
        "house-spider":  `url(#${G.bodyHouse})`,
        "wolf-spider":   `url(#${G.bodyWolf})`,
        "garden-spider": `url(#${G.bodyGarden})`,
        "black-widow":   `url(#${G.bodyWidow})`,
    }[variant];

    const abdomenFill: string = {
        "house-spider":  `url(#${G.abdomenHouse})`,
        "wolf-spider":   `url(#${G.abdomenWolf})`,
        "garden-spider": `url(#${G.abdomenGarden})`,
        "black-widow":   `url(#${G.abdomenWidow})`,
    }[variant];

    return (
        <svg
            width={SPIDER_W}
            height={SPIDER_H}
            viewBox={`-${SPIDER_W / 2} -${SPIDER_H / 2} ${SPIDER_W} ${SPIDER_H}`}
            style={{ display: "block", overflow: "visible", color: "var(--color-fg)" }}
            aria-hidden
        >
            <defs>
                {/* House spider — neutral grey-brown */}
                <radialGradient id={G.bodyHouse} cx="40%" cy="30%" r="80%">
                    <stop offset="0%"   stopColor="#9a8472" />
                    <stop offset="40%"  stopColor="#5e4c3c" />
                    <stop offset="100%" stopColor="#251a12" />
                </radialGradient>
                <radialGradient id={G.abdomenHouse} cx="40%" cy="30%" r="80%">
                    <stop offset="0%"   stopColor="#a89280" />
                    <stop offset="40%"  stopColor="#6e5a48" />
                    <stop offset="100%" stopColor="#2c1f15" />
                </radialGradient>
                {/* Wolf spider — dark brown, tall contrast */}
                <radialGradient id={G.bodyWolf} cx="40%" cy="30%" r="80%">
                    <stop offset="0%"   stopColor="#8a6a48" />
                    <stop offset="40%"  stopColor="#4a3320" />
                    <stop offset="100%" stopColor="#1a0e06" />
                </radialGradient>
                <radialGradient id={G.abdomenWolf} cx="40%" cy="30%" r="80%">
                    <stop offset="0%"   stopColor="#7a5e40" />
                    <stop offset="45%"  stopColor="#3e2818" />
                    <stop offset="100%" stopColor="#120904" />
                </radialGradient>
                {/* Garden spider — orange-yellow base, abdomen brighter */}
                <radialGradient id={G.bodyGarden} cx="40%" cy="30%" r="80%">
                    <stop offset="0%"   stopColor="#f9c97a" />
                    <stop offset="40%"  stopColor="#b87528" />
                    <stop offset="100%" stopColor="#3f1d05" />
                </radialGradient>
                <radialGradient id={G.abdomenGarden} cx="40%" cy="30%" r="80%">
                    <stop offset="0%"   stopColor="#fed98e" />
                    <stop offset="40%"  stopColor="#d4862c" />
                    <stop offset="100%" stopColor="#5b290a" />
                </radialGradient>
                {/* Black widow — gloss black with cyan highlight */}
                <radialGradient id={G.bodyWidow} cx="40%" cy="25%" r="75%">
                    <stop offset="0%"   stopColor="#4a4f57" />
                    <stop offset="35%"  stopColor="#1a1d22" />
                    <stop offset="100%" stopColor="#020203" />
                </radialGradient>
                <radialGradient id={G.abdomenWidow} cx="40%" cy="25%" r="80%">
                    <stop offset="0%"   stopColor="#5a5f68" />
                    <stop offset="35%"  stopColor="#1f2228" />
                    <stop offset="100%" stopColor="#040405" />
                </radialGradient>
                {/* Widow's red hourglass accent */}
                <radialGradient id={G.widowAccent} cx="50%" cy="50%" r="55%">
                    <stop offset="0%"   stopColor="#ef4444" />
                    <stop offset="60%"  stopColor="#b91c1c" />
                    <stop offset="100%" stopColor="#450a0a" />
                </radialGradient>
            </defs>

            {/* ─── LEGS — 8 jointed paths, 2 levels (translate + animatable) ── */}
            <g
                className="spider-legs"
                stroke="currentColor"
                strokeWidth="0.85"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                {LEGS.map((leg) => {
                    // Initial leg path uses the same bow geometry the
                    // gait loop applies each frame, so SSR / pre-mount
                    // and the static <SpiderArtwork> match the running
                    // simulation exactly.
                    const [kx, ky] = leg.restKnee;
                    const [fx, fy] = leg.restFoot;
                    const midX = (kx + fx) / 2;
                    const midY = (ky + fy) / 2;
                    const segLen =
                        Math.hypot(fx - kx, fy - ky) || 1;
                    const sideSign = leg.rootY > 0 ? 1 : -1;
                    const perpX = (-(fy - ky) / segLen) * sideSign;
                    const perpY = ((fx - kx) / segLen) * sideSign;
                    const bow = 0.18 * segLen;
                    const cpX = (midX + perpX * bow).toFixed(2);
                    const cpY = (midY + perpY * bow).toFixed(2);
                    return (
                        <g
                            key={leg.name}
                            transform={`translate(${leg.rootX} ${leg.rootY})`}
                        >
                            <g
                                className={`spider-leg-anim spider-leg-anim-${leg.name}`}
                            >
                                <path
                                    d={`M 0 0 L ${kx} ${ky} Q ${cpX} ${cpY}, ${fx} ${fy}`}
                                    ref={(el) => {
                                        if (el) legPathRefs.current.set(leg.name, el);
                                    }}
                                />
                            </g>
                        </g>
                    );
                })}
            </g>

            {/* ─── ABDOMEN (drawn first, behind cephalothorax) ── */}
            <ellipse
                className="spider-abdomen"
                cx="-5"
                cy="0"
                rx="6"
                ry="5"
                fill={abdomenFill}
            />

            {/* Variant-specific abdomen markings */}
            {variant === "garden-spider" && (
                <g className="spider-mark-cross" fill="#fef9c3" opacity="0.85">
                    {/* Iconic Araneus cross — small dot pattern on dorsum */}
                    <circle cx="-5" cy="-2.4" r="0.55" />
                    <circle cx="-5" cy="2.4" r="0.55" />
                    <circle cx="-3" cy="0" r="0.55" />
                    <circle cx="-7" cy="0" r="0.55" />
                    <circle cx="-5" cy="0" r="0.45" />
                </g>
            )}
            {variant === "wolf-spider" && (
                <g className="spider-mark-stripes" stroke="#fbbf24" strokeOpacity="0.5"
                   strokeWidth="0.5" strokeLinecap="round" fill="none">
                    {/* Pale dorsal stripe */}
                    <path d="M -10 -1 L 0 -1" />
                    <path d="M -10 1 L 0 1" />
                </g>
            )}
            {variant === "black-widow" && (
                <ellipse
                    className="spider-mark-hourglass"
                    cx="-5"
                    cy="0"
                    rx="1.7"
                    ry="2.5"
                    fill={`url(#${G.widowAccent})`}
                />
            )}

            {/* ─── PETIOLE waist ── */}
            <ellipse cx="0.5" cy="0" rx="1.4" ry="1.1" fill={cephFill} />

            {/* ─── CEPHALOTHORAX (front body) ── */}
            <ellipse
                className="spider-cephalothorax"
                cx="4"
                cy="0"
                rx="4.2"
                ry="3.5"
                fill={cephFill}
            />

            {/* ─── EYE CLUSTER ──
                8 simple eyes arranged in 2 rows. Front-row eyes (anterior
                median + lateral) are the most prominent; rear row (posterior
                median + lateral) sit further back on the cephalothorax. */}
            <g className="spider-eyes" fill="#0a0608">
                {/* Anterior row — 4 eyes */}
                <circle cx="7.2" cy="-1.6" r="0.55" />
                <circle cx="7.2" cy="-0.5" r="0.4" />
                <circle cx="7.2" cy="0.5" r="0.4" />
                <circle cx="7.2" cy="1.6" r="0.55" />
                {/* Posterior row — 4 eyes set further back */}
                <circle cx="5.8" cy="-1.7" r="0.45" />
                <circle cx="5.8" cy="-0.6" r="0.35" />
                <circle cx="5.8" cy="0.6" r="0.35" />
                <circle cx="5.8" cy="1.7" r="0.45" />
                {/* Subtle catchlights on the largest pair */}
            </g>
            <g fill="#9ca3af" opacity="0.6">
                <circle cx="7.4" cy="-1.8" r="0.18" />
                <circle cx="7.4" cy="1.4" r="0.18" />
            </g>

            {/* ─── PEDIPALPS — small leg-like appendages near the chelicerae ── */}
            <g
                className="spider-palps"
                stroke="currentColor"
                strokeWidth="0.7"
                fill="none"
                strokeLinecap="round"
                strokeOpacity="0.95"
            >
                <path d="M 8 -1.4 L 9.5 -2.6" />
                <path d="M 8  1.4 L 9.5  2.6" />
            </g>

            {/* ─── SPINNERETS at rear ── */}
            <g
                className="spider-spinnerets"
                fill={cephFill}
            >
                <ellipse cx="-10.6" cy="-0.5" rx="0.6" ry="0.5" />
                <ellipse cx="-10.6" cy="0.5" rx="0.6" ry="0.5" />
            </g>
        </svg>
    );
}

/**
 * Static wrapper for component-library / icon use.
 */
export function SpiderArtwork({
    variant = "house-spider",
    heading = 0,
    size = 64,
    className,
}: {
    variant?: SpiderVariant;
    heading?: number;
    size?: number;
    className?: string;
}) {
    const legPathRefs = useRef<Map<string, SVGPathElement>>(new Map());
    return (
        <span
            className={`spider spider-static inline-block ${className ?? ""}`}
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
                <SpiderShape variant={variant} legPathRefs={legPathRefs} />
            </span>
        </span>
    );
}
