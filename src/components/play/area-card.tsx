import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import {
    AREA_META,
    type PlayArea,
} from "@/data/play/types";
import { getCoursesByArea } from "@/data/play";

/**
 * Card grande per macro-area del curriculum (4 in totale: Frontend,
 * Backend, Full-stack, AI). Sostituiscono le 7 card piccole "materia"
 * sulla landing /play. Ogni card ha:
 *
 *   - sfondo gradient ad-hoc per area
 *   - illustrazione SVG inline disegnata per il tema
 *     (browser stack, db disks, layered architecture, neural mesh)
 *   - tagline + descrizione
 *   - conteggio corsi (live + soon)
 *   - link a /play/area/[area]
 *
 * Le illustrazioni SVG sono geometriche pure, niente raster — rendono
 * crisp su retina e si stampano bene su PDF/share. Niente animazioni
 * pesanti che farebbero janky scroll, solo un piccolo glow sull'hover.
 */
export function AreaCard({ area }: { area: PlayArea }) {
    const meta = AREA_META[area];
    const courses = getCoursesByArea(area);
    const liveCount = courses.filter((c) => c.status === "live").length;

    return (
        <Link
            href={`/play/area/${area}`}
            className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-border bg-bg-alt p-6 transition-[border-color,transform] hover:border-border-strong hover:-translate-y-0.5 sm:p-7"
            style={{
                // Subtle gradient overlay sull'angolo top-right.
                // L'illustrazione SVG sotto ha più contrasto.
                backgroundImage: `radial-gradient(ellipse at top right, ${meta.accentSoft}55 0%, transparent 55%)`,
            }}
        >
            {/* Illustrazione SVG ad-hoc per area, posizionata in alto a
                destra come un sigillo. Pointer-events-none così non
                interferisce col click sul Link wrapper. */}
            <div
                aria-hidden
                className="pointer-events-none absolute -right-2 -top-2 h-32 w-32 opacity-90 sm:h-40 sm:w-40"
            >
                <AreaIllustration area={area} />
            </div>

            {/* Header: kicker label */}
            <div className="relative flex items-center gap-2">
                <span
                    className="inline-block h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: meta.accent }}
                    aria-hidden
                />
                <span
                    className="font-mono text-[10.5px] uppercase tracking-[0.12em]"
                    style={{ color: meta.accent }}
                >
                    Area · {area}
                </span>
            </div>

            {/* Titolo + tagline */}
            <h3 className="relative mt-3 text-[22px] font-semibold leading-tight tracking-tight text-fg sm:text-[26px]">
                {meta.label}
            </h3>
            <p className="relative mt-1.5 text-[13.5px] font-medium text-fg-muted">
                {meta.tagline}
            </p>

            {/* Descrizione lunga */}
            <p className="relative mt-3 max-w-[42ch] text-[13.5px] leading-[1.6] text-fg-muted">
                {meta.description}
            </p>

            {/* Footer: conta corsi + arrow */}
            <div className="relative mt-auto flex items-center justify-between pt-6">
                <span className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-fg-soft">
                    {courses.length} corsi
                    {liveCount > 0 ? ` · ${liveCount} live` : ""}
                </span>
                <span
                    className="inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-[0.08em] transition-transform group-hover:translate-x-0.5"
                    style={{ color: meta.accent }}
                >
                    Esplora
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                </span>
            </div>
        </Link>
    );
}

/**
 * Illustrazione SVG per area. Geometrica, monocromatica nell'accent
 * dell'area (così cambia tono per Frontend orange / Backend blue /
 * Full-stack purple / AI green). 100x100 viewBox.
 */
function AreaIllustration({ area }: { area: PlayArea }) {
    const meta = AREA_META[area];
    switch (area) {
        case "frontend":
            return <FrontendIllustration accent={meta.accent} />;
        case "backend":
            return <BackendIllustration accent={meta.accent} />;
        case "fullstack":
            return <FullstackIllustration accent={meta.accent} />;
        case "ai":
            return <AiIllustration accent={meta.accent} />;
    }
}

/** Browser window mockup con header e content stripes — il "vestito" del frontend. */
function FrontendIllustration({ accent }: { accent: string }) {
    return (
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            {/* Browser frame */}
            <rect
                x="12"
                y="18"
                width="76"
                height="60"
                rx="4"
                fill="none"
                stroke={accent}
                strokeWidth="1.5"
            />
            {/* Top bar */}
            <line
                x1="12"
                y1="28"
                x2="88"
                y2="28"
                stroke={accent}
                strokeWidth="1.5"
            />
            {/* Traffic lights */}
            <circle cx="18" cy="23" r="1.4" fill={accent} />
            <circle cx="23" cy="23" r="1.4" fill={accent} opacity="0.5" />
            <circle cx="28" cy="23" r="1.4" fill={accent} opacity="0.3" />
            {/* Content stripes (paragraphs / heading mockup) */}
            <rect x="18" y="36" width="40" height="3" rx="1" fill={accent} />
            <rect
                x="18"
                y="44"
                width="58"
                height="2"
                rx="1"
                fill={accent}
                opacity="0.5"
            />
            <rect
                x="18"
                y="49"
                width="48"
                height="2"
                rx="1"
                fill={accent}
                opacity="0.5"
            />
            {/* Card mockup */}
            <rect
                x="18"
                y="58"
                width="28"
                height="14"
                rx="2"
                fill="none"
                stroke={accent}
                strokeWidth="1"
                opacity="0.7"
            />
            <rect
                x="50"
                y="58"
                width="28"
                height="14"
                rx="2"
                fill="none"
                stroke={accent}
                strokeWidth="1"
                opacity="0.7"
            />
        </svg>
    );
}

/** Stack di dischi/database + chiave. Server-side feel. */
function BackendIllustration({ accent }: { accent: string }) {
    return (
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            {/* 3 cilindri impilati (database disks) */}
            {[58, 42, 26].map((y, i) => (
                <g key={y} opacity={1 - i * 0.15}>
                    <ellipse
                        cx="40"
                        cy={y}
                        rx="20"
                        ry="5"
                        fill="none"
                        stroke={accent}
                        strokeWidth="1.5"
                    />
                    <line
                        x1="20"
                        y1={y}
                        x2="20"
                        y2={y + 12}
                        stroke={accent}
                        strokeWidth="1.5"
                    />
                    <line
                        x1="60"
                        y1={y}
                        x2="60"
                        y2={y + 12}
                        stroke={accent}
                        strokeWidth="1.5"
                    />
                    <ellipse
                        cx="40"
                        cy={y + 12}
                        rx="20"
                        ry="5"
                        fill="none"
                        stroke={accent}
                        strokeWidth="1.5"
                    />
                </g>
            ))}
            {/* Lock pendente sull'ultimo disco — RLS / sicurezza */}
            <g transform="translate(72 60)">
                <rect
                    x="0"
                    y="6"
                    width="14"
                    height="11"
                    rx="2"
                    fill="none"
                    stroke={accent}
                    strokeWidth="1.5"
                />
                <path
                    d="M 3 6 L 3 3 Q 3 -1 7 -1 Q 11 -1 11 3 L 11 6"
                    fill="none"
                    stroke={accent}
                    strokeWidth="1.5"
                />
                <circle cx="7" cy="11" r="1.2" fill={accent} />
            </g>
        </svg>
    );
}

/** 3 layer impilati con frecce — browser → server → database. */
function FullstackIllustration({ accent }: { accent: string }) {
    return (
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            {/* Layer 1 — browser */}
            <rect
                x="20"
                y="14"
                width="60"
                height="18"
                rx="3"
                fill="none"
                stroke={accent}
                strokeWidth="1.5"
            />
            <line
                x1="20"
                y1="20"
                x2="80"
                y2="20"
                stroke={accent}
                strokeWidth="1"
                opacity="0.6"
            />
            {/* Arrow down */}
            <path
                d="M 50 34 L 50 40 M 47 37 L 50 40 L 53 37"
                stroke={accent}
                strokeWidth="1.5"
                fill="none"
            />
            {/* Layer 2 — server (Next.js / API) */}
            <rect
                x="20"
                y="42"
                width="60"
                height="18"
                rx="3"
                fill="none"
                stroke={accent}
                strokeWidth="1.5"
            />
            <circle cx="28" cy="51" r="1.5" fill={accent} />
            <circle cx="34" cy="51" r="1.5" fill={accent} opacity="0.6" />
            <circle cx="40" cy="51" r="1.5" fill={accent} opacity="0.3" />
            {/* Arrow down */}
            <path
                d="M 50 62 L 50 68 M 47 65 L 50 68 L 53 65"
                stroke={accent}
                strokeWidth="1.5"
                fill="none"
            />
            {/* Layer 3 — database */}
            <ellipse
                cx="50"
                cy="72"
                rx="22"
                ry="4"
                fill="none"
                stroke={accent}
                strokeWidth="1.5"
            />
            <line
                x1="28"
                y1="72"
                x2="28"
                y2="82"
                stroke={accent}
                strokeWidth="1.5"
            />
            <line
                x1="72"
                y1="72"
                x2="72"
                y2="82"
                stroke={accent}
                strokeWidth="1.5"
            />
            <ellipse
                cx="50"
                cy="82"
                rx="22"
                ry="4"
                fill="none"
                stroke={accent}
                strokeWidth="1.5"
            />
        </svg>
    );
}

/** Mesh di nodi neurali (12 punti connessi) — feel agente AI / costellazione. */
function AiIllustration({ accent }: { accent: string }) {
    // Nodi distribuiti come una piccola rete neurale 4×3.
    const nodes = [
        { x: 22, y: 25 },
        { x: 22, y: 50 },
        { x: 22, y: 75 },
        { x: 45, y: 18 },
        { x: 45, y: 50 },
        { x: 45, y: 82 },
        { x: 68, y: 18 },
        { x: 68, y: 50 },
        { x: 68, y: 82 },
        { x: 85, y: 35 },
        { x: 85, y: 65 },
    ];
    // Connessioni tra layer (input→hidden→output style)
    const links: [number, number][] = [
        [0, 3], [0, 4], [1, 3], [1, 4], [1, 5], [2, 4], [2, 5],
        [3, 6], [3, 7], [4, 6], [4, 7], [4, 8], [5, 7], [5, 8],
        [6, 9], [7, 9], [7, 10], [8, 10],
    ];
    return (
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            {/* Connessioni — stroke sottile semi-trasparente */}
            {links.map(([a, b], i) => (
                <line
                    key={i}
                    x1={nodes[a].x}
                    y1={nodes[a].y}
                    x2={nodes[b].x}
                    y2={nodes[b].y}
                    stroke={accent}
                    strokeWidth="0.8"
                    opacity="0.45"
                />
            ))}
            {/* Nodi */}
            {nodes.map((n, i) => (
                <circle
                    key={i}
                    cx={n.x}
                    cy={n.y}
                    r={i === 4 || i === 7 ? 2.5 : 1.8}
                    fill={accent}
                />
            ))}
            {/* Sparkle in alto a sinistra — segnale di AI/magic */}
            <g transform="translate(8 12)">
                <path
                    d="M 0 4 L 8 4 M 4 0 L 4 8"
                    stroke={accent}
                    strokeWidth="1.2"
                />
                <path
                    d="M 1 1 L 7 7 M 7 1 L 1 7"
                    stroke={accent}
                    strokeWidth="0.8"
                    opacity="0.6"
                />
            </g>
        </svg>
    );
}
