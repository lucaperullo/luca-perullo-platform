"use client";

import { type ReactNode } from "react";
import { ArrowRight, Check, Download, Sparkles } from "lucide-react";
import { RainbowButton } from "@/components/rainbow-button";
import { ShimmerButton } from "@/components/shimmer-button";
import { RippleButton } from "@/components/ripple-button";
import { ShinyButton } from "@/components/shiny-button";
import { PulsatingButton } from "@/components/pulsating-button";
import { InteractiveHoverButton } from "@/components/interactive-hover-button";

/**
 * Showcase wrappers for the 6 button components. Each export is a
 * multi-example layout (default + use-case + variants) wrapped in the
 * editorial register's `<Frame>` with a numbered mono caption.
 *
 * Used by `src/data/components-library.tsx` as the live preview for
 * each button entry. Co-located so the registry stays a single
 * source-of-truth list of metadata.
 */

/* ─────────────────────────── shared layout ─────────────────────────── */

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

const Row = ({ children, className }: { children: ReactNode; className?: string }) => (
    <div className={`flex flex-wrap items-center gap-3 ${className ?? ""}`}>{children}</div>
);

/* ───────────────────────────── 1. Rainbow ─────────────────────────── */

export function RainbowButtonShowcase() {
    return (
        <div className="flex flex-col gap-5">
            <Frame number="001" title="Default">
                <Row>
                    <RainbowButton>Inizia ora</RainbowButton>
                    <RainbowButton>Sottoscrivi</RainbowButton>
                </Row>
            </Frame>
            <Frame number="002" title="Pricing CTA · in context">
                <div className="mx-auto flex max-w-[320px] flex-col items-center gap-3 rounded-md border border-border bg-bg p-5 text-center">
                    <span className="caption-mono text-[10px] uppercase tracking-[0.18em] text-fg-soft">
                        Pro · €19/mese
                    </span>
                    <p className="text-[13.5px] leading-[1.55] text-fg-muted">
                        Tutti i componenti, brand prompts, aggiornamenti settimanali.
                    </p>
                    <RainbowButton className="mt-1">
                        <Sparkles className="size-3.5" aria-hidden />
                        Inizia il trial
                    </RainbowButton>
                </div>
            </Frame>
            <Frame number="003" title="With icon">
                <Row>
                    <RainbowButton>
                        <Download className="size-3.5" aria-hidden />
                        Scarica preset
                    </RainbowButton>
                </Row>
            </Frame>
        </div>
    );
}

/* ───────────────────────────── 2. Shimmer ─────────────────────────── */

export function ShimmerButtonShowcase() {
    return (
        <div className="flex flex-col gap-5">
            <Frame number="001" title="Default">
                <Row>
                    <ShimmerButton>Get started</ShimmerButton>
                    <ShimmerButton shimmerDuration="6s">Slower shimmer</ShimmerButton>
                </Row>
            </Frame>
            <Frame number="002" title="Hero CTA · paired with secondary">
                <div className="flex flex-col items-center gap-3 py-4">
                    <h3 className="text-2xl font-semibold tracking-tight text-fg">
                        Pronto a spedire?
                    </h3>
                    <p className="max-w-[320px] text-center text-[13px] leading-[1.55] text-fg-muted">
                        Componenti già brand-locked, copy in italiano, prompt LLM
                        pronti per Claude.
                    </p>
                    <Row className="mt-2 justify-center">
                        <ShimmerButton>Inizia gratis</ShimmerButton>
                        <button
                            type="button"
                            className="press inline-flex min-h-[44px] items-center gap-2 rounded-full border border-border-strong bg-transparent px-5 py-2 text-sm font-medium text-fg [transition:border-color_180ms_var(--ease-out)] hover:border-fg-soft"
                        >
                            Vedi demo
                        </button>
                    </Row>
                </div>
            </Frame>
            <Frame number="003" title="Custom color · accent override">
                <Row>
                    <ShimmerButton shimmerColor="#10b981">Approva</ShimmerButton>
                    <ShimmerButton shimmerColor="#ef4444" background="#1a1a20">
                        Stop deploy
                    </ShimmerButton>
                </Row>
            </Frame>
        </div>
    );
}

/* ───────────────────────────── 3. Ripple ──────────────────────────── */

export function RippleButtonShowcase() {
    return (
        <div className="flex flex-col gap-5">
            <Frame number="001" title="Default · click to ripple">
                <Row>
                    <RippleButton>Conferma</RippleButton>
                    <RippleButton rippleColor="var(--accent)">Salva</RippleButton>
                </Row>
            </Frame>
            <Frame number="002" title="Form action · with primary tone">
                <form
                    onSubmit={(e) => e.preventDefault()}
                    className="mx-auto flex max-w-[320px] flex-col gap-3"
                >
                    <label className="caption-mono text-[10px] uppercase tracking-[0.18em] text-fg-soft">
                        Email
                    </label>
                    <input
                        type="email"
                        placeholder="ciao@esempio.it"
                        className="rounded-md border border-border bg-bg px-3 py-2 text-sm text-fg outline-none focus:border-border-strong"
                    />
                    <Row className="mt-1">
                        <RippleButton
                            className="bg-fg text-bg hover:border-border-strong"
                            rippleColor="rgba(255,255,255,0.4)"
                        >
                            Iscrivimi
                        </RippleButton>
                        <RippleButton>Annulla</RippleButton>
                    </Row>
                </form>
            </Frame>
            <Frame number="003" title="Destructive · red ripple">
                <Row>
                    <RippleButton
                        className="border-red-500/40 text-red-600 hover:border-red-500 dark:text-red-400"
                        rippleColor="rgba(239,68,68,0.5)"
                    >
                        Elimina account
                    </RippleButton>
                </Row>
            </Frame>
        </div>
    );
}

/* ───────────────────────────── 4. Shiny ───────────────────────────── */

export function ShinyButtonShowcase() {
    return (
        <div className="flex flex-col gap-5">
            <Frame number="001" title="Default · hover to sweep">
                <Row>
                    <ShinyButton>Open dashboard</ShinyButton>
                    <ShinyButton>Vedi progetto</ShinyButton>
                </Row>
            </Frame>
            <Frame number="002" title="Card CTA · paired with description">
                <div className="mx-auto flex max-w-[360px] flex-col gap-3 rounded-md border border-border bg-bg p-5">
                    <h3 className="text-[15px] font-semibold tracking-tight text-fg">
                        Esperimenti settimanali
                    </h3>
                    <p className="text-[13px] leading-[1.55] text-fg-muted">
                        Apri un browser side-channel, prova un componente nuovo
                        e copia il prompt nel tuo flusso.
                    </p>
                    <Row className="mt-1">
                        <ShinyButton>
                            Apri sandbox
                            <ArrowRight className="size-3.5" aria-hidden />
                        </ShinyButton>
                    </Row>
                </div>
            </Frame>
            <Frame number="003" title="Toolbar · multiple buttons">
                <Row>
                    <ShinyButton>Save</ShinyButton>
                    <ShinyButton>Publish</ShinyButton>
                    <ShinyButton>Export</ShinyButton>
                </Row>
            </Frame>
        </div>
    );
}

/* ───────────────────────────── 5. Pulsating ───────────────────────── */

export function PulsatingButtonShowcase() {
    return (
        <div className="flex flex-col gap-5">
            <Frame number="001" title="Default · accent pulse">
                <Row>
                    <PulsatingButton>Live · join now</PulsatingButton>
                </Row>
            </Frame>
            <Frame number="002" title="Live event · with status pill">
                <div className="mx-auto flex max-w-[340px] flex-col items-center gap-3 rounded-md border border-border bg-bg p-5 text-center">
                    <span className="inline-flex items-center gap-2 caption-mono text-[10px] uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400">
                        <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
                        Live · in 24m
                    </span>
                    <h3 className="text-[15px] font-semibold tracking-tight text-fg">
                        Q&amp;A su tooling 2026
                    </h3>
                    <p className="text-[12.5px] leading-[1.5] text-fg-muted">
                        Mostriamo tutto il workflow Claude Code → Vercel.
                    </p>
                    <PulsatingButton className="mt-1">
                        Prendi posto
                    </PulsatingButton>
                </div>
            </Frame>
            <Frame number="003" title="Custom color · destructive pulse">
                <Row>
                    <PulsatingButton pulseColor="#ef4444">
                        <Check className="size-3.5" aria-hidden />
                        Conferma rollback
                    </PulsatingButton>
                </Row>
            </Frame>
        </div>
    );
}

/* ───────────────────────────── 6. Interactive Hover ───────────────── */

export function InteractiveHoverButtonShowcase() {
    return (
        <div className="flex flex-col gap-5">
            <Frame number="001" title="Default · hover to morph">
                <Row>
                    <InteractiveHoverButton hoverText="Avvia">
                        Get Started
                    </InteractiveHoverButton>
                </Row>
            </Frame>
            <Frame number="002" title="Hero · same label, no morph">
                <div className="flex flex-col items-center gap-3 py-3">
                    <h3 className="text-2xl font-semibold tracking-tight text-fg">
                        Tutto il catalogo, gratis
                    </h3>
                    <p className="max-w-[320px] text-center text-[13px] leading-[1.55] text-fg-muted">
                        36 componenti, prompt LLM, codice copia-e-incolla.
                    </p>
                    <InteractiveHoverButton className="mt-2">
                        Esplora ora
                    </InteractiveHoverButton>
                </div>
            </Frame>
            <Frame number="003" title="Discovery CTA · alt label reveals action">
                <Row>
                    <InteractiveHoverButton hoverText="Scarica .zip">
                        Tutti i componenti
                    </InteractiveHoverButton>
                    <InteractiveHoverButton hoverText="Copia prompt">
                        Pronto per Claude
                    </InteractiveHoverButton>
                </Row>
            </Frame>
        </div>
    );
}
