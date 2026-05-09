"use client";

import { useEffect, useState } from "react";
import type { AvatarMood } from "@/data/play-courses";
import { cn } from "@/lib/utils";

export type LottieAvatarProps = {
    mood: AvatarMood;
    /** True quando l'avatar sta "parlando" (audio/TTS in playback). Anima la bocca. */
    isSpeaking?: boolean;
    className?: string;
    size?: number;
};

/**
 * Avatar di Luca — placeholder SVG animato.
 *
 * Quando avrai il file Lottie definitivo (~50-150kb di JSON), basta:
 *   1. Salvarlo in /public/play-avatar/luca.json
 *   2. Sostituire questo file con un import di lottie-react che carica il
 *      JSON dinamicamente e mappa `mood` → segmenti dell'animazione.
 *
 * Per ora: composizione SVG con animazioni CSS che reagiscono a `mood`
 * e `isSpeaking`. Pesa <2kb.
 */
export function LottieAvatar({
    mood,
    isSpeaking = false,
    className,
    size = 120,
}: LottieAvatarProps) {
    const [blinkKey, setBlinkKey] = useState(0);

    // Blink ogni 3-5 secondi (random)
    useEffect(() => {
        const tick = () => {
            setBlinkKey((k) => k + 1);
        };
        const id = setInterval(tick, 3000 + Math.random() * 2000);
        return () => clearInterval(id);
    }, []);

    return (
        <div
            className={cn("relative shrink-0", className)}
            style={{ width: size, height: size }}
            data-mood={mood}
            data-speaking={isSpeaking}
        >
            <svg
                viewBox="0 0 120 120"
                width={size}
                height={size}
                xmlns="http://www.w3.org/2000/svg"
                className="block"
                aria-hidden
            >
                {/* Cerchio sfondo */}
                <circle
                    cx="60"
                    cy="60"
                    r="56"
                    fill="var(--bg-alt)"
                    stroke="var(--border-strong)"
                    strokeWidth="2"
                />

                {/* Capelli (semi-cerchio sopra) */}
                <path
                    d="M 22 50 Q 60 18 98 50 L 98 38 Q 60 8 22 38 Z"
                    fill="var(--fg)"
                />

                {/* Faccia base */}
                <ellipse
                    cx="60"
                    cy="68"
                    rx="32"
                    ry="34"
                    fill="#f5d8b4"
                />

                {/* Sopracciglia — cambiano in base al mood */}
                <Eyebrows mood={mood} />

                {/* Occhi — con blink */}
                <Eyes mood={mood} blinkKey={blinkKey} />

                {/* Naso */}
                <path
                    d="M 60 68 L 58 78 L 62 78 Z"
                    fill="#e0bd95"
                />

                {/* Bocca — anima quando isSpeaking */}
                <Mouth mood={mood} isSpeaking={isSpeaking} />
            </svg>
        </div>
    );
}

function Eyebrows({ mood }: { mood: AvatarMood }) {
    // Sopracciglia: pensoso = inclinate a V, happy = arcate verso l'alto
    if (mood === "thinking") {
        return (
            <>
                <path
                    d="M 38 56 L 50 58"
                    stroke="var(--fg)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    fill="none"
                />
                <path
                    d="M 70 58 L 82 56"
                    stroke="var(--fg)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    fill="none"
                />
            </>
        );
    }
    if (mood === "happy" || mood === "encouraging") {
        return (
            <>
                <path
                    d="M 38 54 Q 44 50 50 54"
                    stroke="var(--fg)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    fill="none"
                />
                <path
                    d="M 70 54 Q 76 50 82 54"
                    stroke="var(--fg)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    fill="none"
                />
            </>
        );
    }
    // idle / talking: dritte
    return (
        <>
            <path
                d="M 38 55 L 50 55"
                stroke="var(--fg)"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
            />
            <path
                d="M 70 55 L 82 55"
                stroke="var(--fg)"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
            />
        </>
    );
}

function Eyes({ mood, blinkKey }: { mood: AvatarMood; blinkKey: number }) {
    // Occhi happy → diventano archi (sorriso degli occhi)
    if (mood === "happy") {
        return (
            <>
                <path
                    d="M 40 65 Q 46 70 52 65"
                    stroke="var(--fg)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    fill="none"
                />
                <path
                    d="M 68 65 Q 74 70 80 65"
                    stroke="var(--fg)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    fill="none"
                />
            </>
        );
    }
    // Pallini con blink. Il blink è un re-render con ellipse rx 1
    // per ~120ms via CSS.
    return (
        <g key={blinkKey} className="play-eye-group">
            <ellipse cx="46" cy="65" rx="3" ry="4" fill="var(--fg)" />
            <ellipse cx="74" cy="65" rx="3" ry="4" fill="var(--fg)" />
            <style>{`
                .play-eye-group { animation: play-blink 120ms ease-in 1; transform-origin: center; }
                @keyframes play-blink {
                    0%, 100% { transform: scaleY(1); }
                    50% { transform: scaleY(0.1); }
                }
            `}</style>
        </g>
    );
}

function Mouth({
    mood,
    isSpeaking,
}: {
    mood: AvatarMood;
    isSpeaking: boolean;
}) {
    // Bocca animata: se sta parlando, si apre/chiude in loop
    if (isSpeaking) {
        return (
            <g>
                <ellipse
                    cx="60"
                    cy="88"
                    rx="6"
                    ry="3"
                    fill="#aa3a3a"
                    className="play-mouth-talking"
                />
                <style>{`
                    .play-mouth-talking {
                        animation: play-talk 240ms ease-in-out infinite alternate;
                        transform-origin: 60px 88px;
                    }
                    @keyframes play-talk {
                        from { transform: scaleY(0.3); }
                        to { transform: scaleY(1.2); }
                    }
                `}</style>
            </g>
        );
    }
    if (mood === "happy" || mood === "encouraging") {
        // Sorriso ampio
        return (
            <path
                d="M 48 86 Q 60 96 72 86"
                stroke="#aa3a3a"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
            />
        );
    }
    if (mood === "thinking") {
        // Bocca leggermente di lato
        return (
            <path
                d="M 50 88 L 66 90"
                stroke="#aa3a3a"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
            />
        );
    }
    // idle / talking inattivo: linea neutra
    return (
        <path
            d="M 50 88 Q 60 91 70 88"
            stroke="#aa3a3a"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
        />
    );
}
