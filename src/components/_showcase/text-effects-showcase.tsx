"use client";

import { type ReactNode } from "react";
import { AuroraText } from "@/components/aurora-text";
import { TypingAnimation } from "@/components/typing-animation";
import { HyperText } from "@/components/hyper-text";
import { WordRotate } from "@/components/word-rotate";
import { SparklesText } from "@/components/sparkles-text";
import { MorphingText } from "@/components/morphing-text";
import { LineShadowText } from "@/components/line-shadow-text";
import { TextReveal } from "@/components/text-reveal";

/**
 * Showcases for the 8 text-effect components. Each export wraps three
 * frames in the editorial register: default, real-world use case
 * (hero / headline / paragraph), and a variant (timing, color, content).
 */

const Frame = ({
    number,
    title,
    children,
}: {
    number: string;
    title: string;
    children: ReactNode;
}) => (
    <figure className="m-0 flex flex-col gap-2">
        <figcaption className="flex items-baseline gap-3 caption-mono text-[10px] uppercase tracking-[0.18em] text-fg-soft">
            <span className="text-fg">{number}</span>
            <span className="h-px flex-1 bg-border" aria-hidden />
            <span>{title}</span>
        </figcaption>
        <div className="rounded-sm border border-border bg-bg-alt px-5 py-6">
            {children}
        </div>
    </figure>
);

/* ─────────────────────────── 1. Aurora Text ────────────────────── */

export function AuroraTextShowcase() {
    return (
        <div className="flex flex-col gap-5">
            <Frame number="001" title="Default heading">
                <div className="text-3xl font-semibold tracking-tight">
                    <AuroraText>Aurora effect</AuroraText>
                </div>
            </Frame>
            <Frame number="002" title="Hero · big display">
                <div className="flex flex-col gap-3 py-4 text-center">
                    <h2 className="text-4xl font-semibold tracking-tight text-fg">
                        Disegna come fosse <AuroraText>magia</AuroraText>
                    </h2>
                    <p className="mx-auto max-w-[360px] text-[13.5px] leading-[1.55] text-fg-muted">
                        Usa il gradient solo sulla parola che vuoi enfatizzare;
                        il resto resta solido per leggibilità.
                    </p>
                </div>
            </Frame>
            <Frame number="003" title="Inline · accent word in paragraph">
                <p className="text-[15px] leading-[1.7] text-fg-muted">
                    Costruito con cura sui tokens del progetto. Ogni interazione
                    è{" "}
                    <span className="text-xl font-semibold">
                        <AuroraText speed={4}>misurata</AuroraText>
                    </span>{" "}
                    al millisecondo, niente di lasciato al caso.
                </p>
            </Frame>
        </div>
    );
}

/* ─────────────────────────── 2. Typing Animation ───────────────── */

export function TypingAnimationShowcase() {
    return (
        <div className="flex flex-col gap-5">
            <Frame number="001" title="Default · phrase">
                <div className="text-2xl font-semibold tracking-tight text-fg">
                    <TypingAnimation text="Sviluppatore frontend." duration={45} />
                </div>
            </Frame>
            <Frame number="002" title="Hero · large headline">
                <div className="flex flex-col gap-2 py-2">
                    <span className="caption-mono text-[10px] uppercase tracking-[0.18em] text-fg-soft">
                        Now writing
                    </span>
                    <h2 className="text-3xl font-semibold tracking-tight text-fg">
                        <TypingAnimation
                            text="The library is the proof of work."
                            duration={36}
                            as="span"
                        />
                    </h2>
                </div>
            </Frame>
            <Frame number="003" title="Code · mono command">
                <div className="rounded-md border border-border bg-bg p-3 font-mono text-[13px] text-fg">
                    <span className="select-none text-fg-soft">$ </span>
                    <TypingAnimation
                        text="npx claude-mem import &amp;&amp; pnpm dev"
                        duration={32}
                        as="span"
                        delay={300}
                    />
                </div>
            </Frame>
        </div>
    );
}

/* ─────────────────────────── 3. Hyper Text ─────────────────────── */

export function HyperTextShowcase() {
    return (
        <div className="flex flex-col gap-5">
            <Frame number="001" title="Default · scrambles on mount">
                <div className="text-2xl font-semibold tracking-tight">
                    <HyperText>HYPER TEXT</HyperText>
                </div>
            </Frame>
            <Frame number="002" title="Hero · big mono display">
                <div className="flex flex-col items-start gap-3">
                    <span className="caption-mono text-[10px] uppercase tracking-[0.18em] text-fg-soft">
                        Hover to re-scramble
                    </span>
                    <div className="text-4xl font-semibold tracking-tight">
                        <HyperText duration={1100}>NEXT EXPERIMENT</HyperText>
                    </div>
                </div>
            </Frame>
            <Frame number="003" title="Brand · logotype">
                <div className="text-3xl font-semibold tracking-tight">
                    <HyperText animateOnHover={false} duration={700}>
                        LP / 2025
                    </HyperText>
                </div>
            </Frame>
        </div>
    );
}

/* ─────────────────────────── 4. Word Rotate ────────────────────── */

export function WordRotateShowcase() {
    return (
        <div className="flex flex-col gap-5">
            <Frame number="001" title="Default · 3 words">
                <div className="text-2xl font-semibold tracking-tight text-fg">
                    Sono uno{" "}
                    <WordRotate words={["sviluppatore", "designer", "freelance"]} />
                </div>
            </Frame>
            <Frame number="002" title="Hero · profession statement">
                <div className="flex flex-col gap-2 py-2">
                    <h2 className="text-3xl font-semibold tracking-tight text-fg">
                        Costruisco{" "}
                        <WordRotate
                            words={["interfacce", "componenti", "sistemi", "esperimenti"]}
                            duration={2200}
                        />
                    </h2>
                    <p className="text-[13.5px] leading-[1.55] text-fg-muted">
                        Niente template, niente kit. Tutto su misura.
                    </p>
                </div>
            </Frame>
            <Frame number="003" title="Faster · 4 words at 1.4s">
                <div className="text-xl font-medium tracking-tight text-fg">
                    Disponibile per{" "}
                    <WordRotate
                        words={["contratti", "sprint mirati", "audit UI", "side-quest"]}
                        duration={1400}
                    />
                </div>
            </Frame>
        </div>
    );
}

/* ─────────────────────────── 5. Sparkles Text ──────────────────── */

export function SparklesTextShowcase() {
    return (
        <div className="flex flex-col gap-5">
            <Frame number="001" title="Default · accent + amber">
                <div className="text-3xl font-semibold tracking-tight">
                    <SparklesText>Magic</SparklesText>
                </div>
            </Frame>
            <Frame number="002" title="Hero · launch badge">
                <div className="flex flex-col items-center gap-3 py-4">
                    <span className="caption-mono text-[10px] uppercase tracking-[0.18em] text-fg-soft">
                        Just launched
                    </span>
                    <h2 className="text-4xl font-semibold tracking-tight text-fg">
                        <SparklesText sparklesCount={10}>Components 2.0</SparklesText>
                    </h2>
                    <p className="text-[13px] leading-[1.55] text-fg-muted">
                        36 nuovi pezzi, brand-locked, copy in italiano.
                    </p>
                </div>
            </Frame>
            <Frame number="003" title="Custom palette · single accent">
                <div className="text-2xl font-semibold tracking-tight">
                    <SparklesText
                        sparklesCount={6}
                        colors={{ first: "var(--accent)", second: "var(--accent)" }}
                    >
                        Pro
                    </SparklesText>
                </div>
            </Frame>
        </div>
    );
}

/* ─────────────────────────── 6. Morphing Text ──────────────────── */

export function MorphingTextShowcase() {
    return (
        <div className="flex flex-col gap-5">
            <Frame number="001" title="Default · 3 phrases">
                <div className="text-2xl font-semibold tracking-tight">
                    <MorphingText texts={["Sviluppatore", "Designer", "Freelance"]} />
                </div>
            </Frame>
            <Frame number="002" title="Hero · use cases for the catalog">
                <div className="flex flex-col gap-3 py-2">
                    <span className="caption-mono text-[10px] uppercase tracking-[0.18em] text-fg-soft">
                        I componenti servono per
                    </span>
                    <div className="text-3xl font-semibold tracking-tight">
                        <MorphingText
                            texts={["Landing", "Dashboard", "Portfolio", "Documentazione"]}
                            duration={2400}
                        />
                    </div>
                </div>
            </Frame>
            <Frame number="003" title="Faster · 4 quick rotations">
                <div className="text-xl font-medium tracking-tight">
                    <MorphingText
                        texts={["Veloce.", "Solido.", "Tipato.", "Pronto."]}
                        duration={1500}
                    />
                </div>
            </Frame>
        </div>
    );
}

/* ─────────────────────────── 7. Line Shadow Text ───────────────── */

export function LineShadowTextShowcase() {
    return (
        <div className="flex flex-col gap-5">
            <Frame number="001" title="Default · h1">
                <div className="text-4xl font-bold tracking-tight">
                    <LineShadowText>Editorial</LineShadowText>
                </div>
            </Frame>
            <Frame number="002" title="Hero · paired display">
                <div className="flex flex-col items-start gap-3 py-2">
                    <span className="caption-mono text-[10px] uppercase tracking-[0.18em] text-fg-soft">
                        Issue · 001
                    </span>
                    <h2 className="text-5xl font-bold tracking-tight">
                        <LineShadowText>Catalogo</LineShadowText>
                    </h2>
                    <p className="max-w-[420px] text-[13.5px] leading-[1.55] text-fg-muted">
                        L&apos;ombra è una trama di striscioline diagonali, non
                        un blur. Vive sotto al titolo come una stampa offset.
                    </p>
                </div>
            </Frame>
            <Frame number="003" title="Subtle · accent shadow">
                <div className="text-3xl font-bold tracking-tight">
                    <LineShadowText shadowColor="var(--accent)">2025</LineShadowText>
                </div>
            </Frame>
        </div>
    );
}

/* ─────────────────────────── 8. Text Reveal ────────────────────── */

export function TextRevealShowcase() {
    return (
        <div className="flex flex-col gap-5">
            <Frame number="001" title="Default · scroll the page">
                <TextReveal>
                    Le parole si accendono una alla volta mentre scorri la
                    pagina, trasformando un blocco di testo lungo in un piccolo
                    viaggio editoriale.
                </TextReveal>
            </Frame>
            <Frame number="002" title="Quote · longer reveal">
                <TextReveal>
                    Il design è la cosa che si vede quando si toglie tutto il
                    superfluo, e ciò che resta deve guadagnarsi il proprio
                    posto. Ogni componente di questo catalogo prova a
                    rispettare questa regola.
                </TextReveal>
            </Frame>
            <Frame number="003" title="Brand statement · short">
                <TextReveal>
                    Niente librerie pesanti. Solo CSS, design tokens, e una
                    selezione attenta di animazioni motivate.
                </TextReveal>
            </Frame>
        </div>
    );
}
