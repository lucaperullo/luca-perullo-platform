/**
 * Brand reveal — two paired portrait compositions, one per page side.
 *
 * Same timing, same chrome, different content:
 *
 *   LEFT  (scroll-video-left)  → identity card  — "01 — IDENTITÀ"
 *                                                  "LUCA / PERULLO ✓"
 *                                                  "SOFTWARE ARCHITECT / AI ENGINEER"
 *                                                  "Studio indipendente"
 *
 *   RIGHT (scroll-video-right) → practice card  — "02 — PRATICA"
 *                                                  "WEB / MOBILE · AI"
 *                                                  "BRIEF · DESIGN / BUILD · SHIP"
 *                                                  "Remote-first"
 *
 * The two play in lockstep so the user reads one editorial reveal: WHO on
 * the left, WHAT on the right, simultaneously.
 *
 * Authored at portrait 1080×2160 (1:2). Resolution-independent via `usePx()`.
 */

import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont as loadGeist } from "@remotion/google-fonts/Geist";
import { loadFont as loadGeistMono } from "@remotion/google-fonts/GeistMono";
import { BASE_WIDTH } from "../Root";

const { fontFamily: GEIST } = loadGeist("normal", {
    weights: ["400", "500", "600", "700"],
    subsets: ["latin"],
    ignoreTooManyRequestsWarning: true,
});
const { fontFamily: GEIST_MONO } = loadGeistMono("normal", {
    weights: ["400", "500"],
    subsets: ["latin"],
    ignoreTooManyRequestsWarning: true,
});

const BRAND = {
    bg: "#ffffff",
    bgAlt: "#fafafa",
    fg: "#09090b",
    fgMuted: "#71717a",
    fgSoft: "#a1a1aa",
    border: "#e4e4e7",
    borderStrong: "#d4d4d8",
    accent: "#2b7fff",
} as const;

type SideContent = {
    /** Top corner kicker (left composition uses tl, right uses tr). */
    kicker: string;
    /** Stacked name lines — line1 above, line2 below. */
    line1: string;
    line2: string;
    /** Show the verified blue badge after line2. Identity-side only. */
    showBadge: boolean;
    /** Two-line caption typed character by character. */
    caption1: string;
    caption2: string;
    /** Bottom corner two-line label (mono small caps). */
    bottomMain: string;
    bottomSub: string;
};

const LEFT_CONTENT: SideContent = {
    kicker: "01 — IDENTITÀ",
    line1: "LUCA",
    line2: "PERULLO",
    showBadge: true,
    caption1: "SOFTWARE ARCHITECT",
    caption2: "AI ENGINEER",
    bottomMain: "Studio indipendente",
    bottomSub: "Lavoro su misura",
};

const RIGHT_CONTENT: SideContent = {
    kicker: "02 — PRATICA",
    line1: "WEB",
    line2: "MOBILE · AI",
    showBadge: false,
    caption1: "BRIEF · DESIGN",
    caption2: "BUILD · SHIP",
    bottomMain: "Remote-first",
    bottomSub: "Italia → mondo",
};

const easeOut = (input: number, range: [number, number]) =>
    interpolate(input, range, [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.bezier(0.23, 1, 0.32, 1),
    });

function usePx() {
    const { width } = useVideoConfig();
    const s = width / BASE_WIDTH;
    return (n: number) => n * s;
}

/** Public — register two of these in Root.tsx (left + right). */
export function ScrollVideoLeft() {
    return <SideComposition content={LEFT_CONTENT} side="left" />;
}
export function ScrollVideoRight() {
    return <SideComposition content={RIGHT_CONTENT} side="right" />;
}

function SideComposition({ content, side }: { content: SideContent; side: "left" | "right" }) {
    const frame = useCurrentFrame();
    const px = usePx();

    const kickerIn = easeOut(frame, [0, 18]);
    const hairlineTop = easeOut(frame, [15, 42]);
    const hairlineBottom = easeOut(frame, [22, 50]);
    const stripeIn = easeOut(frame, [30, 58]);
    const badgeIn = easeOut(frame, [95, 118]);
    const captionIn = easeOut(frame, [105, 130]);
    const cornerIn = easeOut(frame, [115, 138]);
    const settleScale = interpolate(frame, [132, 150], [1, 1.015], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.bezier(0.32, 0.72, 0, 1),
    });

    return (
        <AbsoluteFill
            style={{
                backgroundColor: BRAND.bg,
                color: BRAND.fg,
                fontFamily: GEIST,
                overflow: "hidden",
            }}
        >
            <StripeBackground opacity={stripeIn * 0.4} />

            <AbsoluteFill
                style={{
                    padding: px(64),
                    transform: `scale(${settleScale})`,
                    transformOrigin: "center center",
                }}
            >
                {/* Kicker pinned to the side that faces the *outer* edge of
                    the page — left comp puts it top-left; right comp top-right. */}
                <CornerLabel
                    pos={side === "left" ? "tl" : "tr"}
                    progress={kickerIn}
                    text={content.kicker}
                    fontFamily={GEIST_MONO}
                />

                <Hairline progress={hairlineTop} y="20%" />
                <Hairline progress={hairlineBottom} y="80%" />

                {/* Centre stage */}
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: px(24),
                    }}
                >
                    <NameLine
                        frame={frame}
                        text={content.line1}
                        startFrame={40}
                        stagger={3}
                        fontFamily={GEIST}
                        fontSize={px(160)}
                    />
                    <NameLine
                        frame={frame}
                        text={content.line2}
                        startFrame={60}
                        stagger={3}
                        fontFamily={GEIST}
                        fontSize={px(160)}
                    >
                        {content.showBadge ? (
                            <BadgeSlide progress={badgeIn} sizePx={px(72)} />
                        ) : null}
                    </NameLine>

                    <Caption
                        line1={content.caption1}
                        line2={content.caption2}
                        progress={captionIn}
                        fontFamily={GEIST_MONO}
                    />
                </div>

                {/* Bottom label pinned to the same outer-edge side as the kicker. */}
                <BottomCornerLabel
                    pos={side === "left" ? "bl" : "br"}
                    progress={cornerIn}
                    main={content.bottomMain}
                    sub={content.bottomSub}
                    fontFamily={GEIST_MONO}
                />
            </AbsoluteFill>
        </AbsoluteFill>
    );
}

function StripeBackground({ opacity }: { opacity: number }) {
    const px = usePx();
    const stripe = `${px(1)}px`;
    const period = `${px(8)}px`;
    return (
        <AbsoluteFill
            style={{
                opacity,
                backgroundImage: `repeating-linear-gradient(-45deg, rgba(0,0,0,0.06) 0, rgba(0,0,0,0.06) ${stripe}, transparent ${stripe}, transparent ${period})`,
            }}
        />
    );
}

function CornerLabel({
    pos,
    progress,
    text,
    fontFamily,
}: {
    pos: "tl" | "tr";
    progress: number;
    text: string;
    fontFamily: string;
}) {
    const px = usePx();
    return (
        <div
            style={{
                position: "absolute",
                top: px(64),
                left: pos === "tl" ? px(64) : undefined,
                right: pos === "tr" ? px(64) : undefined,
                opacity: progress,
                transform: `translateY(${(1 - progress) * px(8)}px)`,
                fontFamily,
                fontSize: px(18),
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: BRAND.fgSoft,
            }}
        >
            {text}
        </div>
    );
}

function Hairline({ progress, y }: { progress: number; y: string }) {
    const px = usePx();
    const widthPct = progress * 100;
    return (
        <div
            style={{
                position: "absolute",
                top: y,
                left: 0,
                right: 0,
                height: px(1.5),
                pointerEvents: "none",
            }}
        >
            <div
                style={{
                    position: "absolute",
                    left: "50%",
                    top: 0,
                    width: `${widthPct}%`,
                    height: px(1.5),
                    background: BRAND.borderStrong,
                    transform: "translateX(-50%)",
                }}
            />
        </div>
    );
}

function NameLine({
    frame,
    text,
    startFrame,
    stagger,
    fontFamily,
    fontSize,
    children,
}: {
    frame: number;
    text: string;
    startFrame: number;
    stagger: number;
    fontFamily: string;
    fontSize: number;
    children?: React.ReactNode;
}) {
    const px = usePx();
    return (
        <div
            style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                gap: px(20),
                fontFamily,
                fontWeight: 700,
                fontSize,
                letterSpacing: "-0.035em",
                lineHeight: 0.9,
                color: BRAND.fg,
                whiteSpace: "nowrap",
            }}
        >
            <span style={{ display: "inline-flex" }}>
                {[...text].map((letter, i) => {
                    const start = startFrame + i * stagger;
                    const opacity = interpolate(
                        frame,
                        [start, start + 14],
                        [0, 1],
                        {
                            extrapolateLeft: "clamp",
                            extrapolateRight: "clamp",
                            easing: Easing.bezier(0.23, 1, 0.32, 1),
                        },
                    );
                    const y = interpolate(
                        frame,
                        [start, start + 14],
                        [22, 0],
                        {
                            extrapolateLeft: "clamp",
                            extrapolateRight: "clamp",
                            easing: Easing.bezier(0.23, 1, 0.32, 1),
                        },
                    );
                    const blur = interpolate(
                        frame,
                        [start, start + 14],
                        [6, 0],
                        {
                            extrapolateLeft: "clamp",
                            extrapolateRight: "clamp",
                        },
                    );
                    return (
                        <span
                            key={`${letter}-${i}`}
                            style={{
                                display: "inline-block",
                                opacity,
                                transform: `translateY(${px(y)}px)`,
                                filter: `blur(${px(blur)}px)`,
                                whiteSpace: "pre",
                            }}
                        >
                            {letter === " " ? " " : letter}
                        </span>
                    );
                })}
            </span>
            {children}
        </div>
    );
}

function BadgeSlide({ progress, sizePx }: { progress: number; sizePx: number }) {
    const px = usePx();
    const x = (1 - progress) * px(32);
    return (
        <span
            style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: progress,
                transform: `translateX(${-x}px) scale(${0.8 + progress * 0.2})`,
                color: BRAND.accent,
            }}
        >
            <svg
                width={sizePx}
                height={sizePx}
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden
            >
                <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.99-.92-4.11s-2.72-1.38-4.11-.92C14.37 2.32 13.13 1.44 11.7 1.44c-1.43 0-2.67.88-3.34 2.19-1.39-.46-2.99-.2-4.11.92C3.13 5.67 2.86 7.27 3.32 8.66 2.01 9.33 1.13 10.57 1.13 12s.88 2.67 2.19 3.34c-.46 1.39-.2 2.99.92 4.11s2.72 1.38 4.11.92c.67 1.31 1.91 2.19 3.34 2.19s2.67-.88 3.34-2.19c1.39.46 2.99.2 4.11-.92s1.38-2.72.92-4.11c1.31-.67 2.19-1.91 2.19-3.34zM10.71 16.46l-3.75-3.75 1.41-1.41 2.34 2.34 5.59-5.59 1.41 1.41-7 7z" />
            </svg>
        </span>
    );
}

function Caption({
    line1,
    line2,
    progress,
    fontFamily,
}: {
    line1: string;
    line2: string;
    progress: number;
    fontFamily: string;
}) {
    const px = usePx();
    const total = line1.length + line2.length;
    const visibleChars = Math.floor(progress * total);
    const showLine1 = line1.slice(0, Math.min(visibleChars, line1.length));
    const showLine2 = line2.slice(0, Math.max(0, visibleChars - line1.length));

    return (
        <div
            style={{
                opacity: progress,
                fontFamily,
                fontSize: px(22),
                letterSpacing: "0.16em",
                color: BRAND.fgMuted,
                textTransform: "uppercase",
                textAlign: "center",
                lineHeight: 1.6,
                marginTop: px(8),
            }}
        >
            <div>{showLine1 || " "}</div>
            <div>{showLine2 || " "}</div>
        </div>
    );
}

/** Bottom corner — two-line label (main + sub), pinned to outer-edge side. */
function BottomCornerLabel({
    pos,
    progress,
    main,
    sub,
    fontFamily,
}: {
    pos: "bl" | "br";
    progress: number;
    main: string;
    sub: string;
    fontFamily: string;
}) {
    const px = usePx();
    return (
        <div
            style={{
                position: "absolute",
                bottom: px(64),
                left: pos === "bl" ? px(64) : undefined,
                right: pos === "br" ? px(64) : undefined,
                opacity: progress,
                transform: `translateY(${(1 - progress) * px(8)}px)`,
                display: "flex",
                flexDirection: "column",
                alignItems: pos === "bl" ? "flex-start" : "flex-end",
                gap: px(4),
                fontFamily,
                fontSize: px(16),
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: BRAND.fgMuted,
                lineHeight: 1.4,
                textAlign: pos === "bl" ? "left" : "right",
            }}
        >
            <span style={{ color: BRAND.fg }}>{main}</span>
            <span>{sub}</span>
        </div>
    );
}
