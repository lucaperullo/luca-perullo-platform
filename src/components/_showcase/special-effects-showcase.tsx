"use client";

import { type ReactNode } from "react";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { ShineBorder } from "@/components/shine-border";
import { MagicCard } from "@/components/magic-card";
import { GlareHover } from "@/components/glare-hover";
import { Meteors } from "@/components/meteors";
import { Particles } from "@/components/particles";
import { AnimatedThemeToggler } from "@/components/animated-theme-toggler";

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

/* ─────────────────────────── 1. Shine Border ───────────────────── */

export function ShineBorderShowcase() {
    return (
        <div className="flex flex-col gap-5">
            <Frame number="001" title="Default · accent ring">
                <ShineBorder borderRadius={12} className="rounded-xl p-6">
                    <p className="text-sm text-fg-muted">
                        Card con un anello luminoso che ruota lentamente.
                    </p>
                </ShineBorder>
            </Frame>
            <Frame number="002" title="Pricing card · with content">
                <ShineBorder borderRadius={14} duration={12} className="rounded-2xl p-6">
                    <div className="flex flex-col gap-3">
                        <span className="caption-mono text-[10px] uppercase tracking-[0.18em] text-fg-soft">
                            Pro · €19/mese
                        </span>
                        <h3 className="text-xl font-semibold tracking-tight text-fg">
                            Tutti i componenti
                        </h3>
                        <p className="text-[13px] leading-[1.55] text-fg-muted">
                            36 pezzi, prompt LLM, brand-prompt italiano,
                            update settimanali.
                        </p>
                        <button
                            type="button"
                            className="press mt-2 inline-flex h-9 w-fit items-center gap-1.5 rounded-md bg-fg px-3 text-[13px] font-medium text-bg"
                        >
                            Inizia il trial
                            <ArrowUpRight className="size-3.5" aria-hidden />
                        </button>
                    </div>
                </ShineBorder>
            </Frame>
            <Frame number="003" title="Custom colors · multi-stop">
                <ShineBorder
                    borderRadius={10}
                    duration={8}
                    color={["#5cd9ff", "#ff4dd1", "#ffb340", "transparent"]}
                    className="rounded-lg p-5"
                >
                    <p className="text-[13.5px] text-fg">Tre stop di colore.</p>
                </ShineBorder>
            </Frame>
        </div>
    );
}

/* ─────────────────────────── 2. Magic Card ─────────────────────── */

export function MagicCardShowcase() {
    return (
        <div className="flex flex-col gap-5">
            <Frame number="001" title="Default · spotlight follows cursor">
                <MagicCard className="p-6">
                    <p className="text-sm text-fg">
                        Passa il cursore sopra per vedere lo spotlight.
                    </p>
                    <p className="mt-1 text-xs text-fg-muted">
                        Su touch device la card è statica.
                    </p>
                </MagicCard>
            </Frame>
            <Frame number="002" title="Card grid · 2 columns">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <MagicCard className="p-5">
                        <h4 className="text-[14px] font-semibold tracking-tight text-fg">
                            Strategia
                        </h4>
                        <p className="mt-2 text-[12.5px] leading-[1.55] text-fg-muted">
                            Identifichiamo cosa va spedito e cosa no.
                        </p>
                    </MagicCard>
                    <MagicCard className="p-5">
                        <h4 className="text-[14px] font-semibold tracking-tight text-fg">
                            Esecuzione
                        </h4>
                        <p className="mt-2 text-[12.5px] leading-[1.55] text-fg-muted">
                            Ship in due settimane, no eccezioni.
                        </p>
                    </MagicCard>
                </div>
            </Frame>
            <Frame number="003" title="Custom color · warmer spotlight">
                <MagicCard
                    className="p-6"
                    gradientColor="#f59e0b"
                    gradientSize={260}
                    gradientOpacity={0.22}
                >
                    <p className="text-sm text-fg">Spotlight ambra anziché accento blu.</p>
                </MagicCard>
            </Frame>
        </div>
    );
}

/* ─────────────────────────── 3. Glare Hover ────────────────────── */

export function GlareHoverShowcase() {
    return (
        <div className="flex flex-col gap-5">
            <Frame number="001" title="Default · glare follows cursor">
                <GlareHover className="p-6">
                    <p className="text-sm text-fg">
                        Passa il cursore — il riflesso lo segue.
                    </p>
                </GlareHover>
            </Frame>
            <Frame number="002" title="Showcase card · with metadata">
                <GlareHover className="p-6">
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <span className="caption-mono text-[10px] uppercase tracking-[0.18em] text-fg-soft">
                                Project · 002
                            </span>
                            <h3 className="mt-1 text-[16px] font-semibold tracking-tight text-fg">
                                Easy Rent Pay
                            </h3>
                        </div>
                        <ArrowUpRight className="size-4 text-fg-muted" aria-hidden />
                    </div>
                    <p className="mt-3 text-[12.5px] leading-[1.55] text-fg-muted">
                        Pagamenti per affitti brevi. Stripe + Supabase.
                    </p>
                </GlareHover>
            </Frame>
            <Frame number="003" title="Play once · sweep on enter">
                <GlareHover className="p-6" playOnce glareOpacity={0.28}>
                    <p className="text-sm text-fg">
                        Single sweep on hover-enter.
                    </p>
                </GlareHover>
            </Frame>
        </div>
    );
}

/* ─────────────────────────── 4. Meteors ────────────────────────── */

export function MeteorsShowcase() {
    return (
        <div className="flex flex-col gap-5">
            <Frame number="001" title="Default · 20 meteors">
                <div className="relative h-32 overflow-hidden rounded-md border border-border bg-bg">
                    <Meteors number={20} />
                </div>
            </Frame>
            <Frame number="002" title="Hero card · meteor backdrop">
                <div className="relative overflow-hidden rounded-lg border border-border bg-bg p-8 text-center">
                    <Meteors number={26} />
                    <h3 className="relative text-2xl font-semibold tracking-tight text-fg">
                        Pronto a spedire?
                    </h3>
                    <p className="relative mx-auto mt-2 max-w-[320px] text-[13px] leading-[1.55] text-fg-muted">
                        Componenti già brand-locked, copy in italiano.
                    </p>
                </div>
            </Frame>
            <Frame number="003" title="Dense field · 40 meteors">
                <div className="relative h-32 overflow-hidden rounded-md border border-border bg-bg">
                    <Meteors number={40} />
                </div>
            </Frame>
        </div>
    );
}

/* ─────────────────────────── 5. Particles ──────────────────────── */

export function ParticlesShowcase() {
    return (
        <div className="flex flex-col gap-5">
            <Frame number="001" title="Default · drift + repel">
                <div className="relative h-32 overflow-hidden rounded-md border border-border bg-bg">
                    <Particles quantity={70} size={0.6} />
                </div>
            </Frame>
            <Frame number="002" title="Hero card · backdrop layer">
                <div className="relative overflow-hidden rounded-lg border border-border bg-bg p-8 text-center">
                    <Particles quantity={80} size={0.5} staticity={70} />
                    <span className="relative caption-mono text-[10px] uppercase tracking-[0.18em] text-fg-soft">
                        Field · live
                    </span>
                    <h3 className="relative mt-2 text-2xl font-semibold tracking-tight text-fg">
                        Sempre in movimento
                    </h3>
                </div>
            </Frame>
            <Frame number="003" title="Dense small · throughput feel">
                <div className="relative h-32 overflow-hidden rounded-md border border-border bg-bg">
                    <Particles quantity={140} size={0.35} ease={30} />
                </div>
            </Frame>
        </div>
    );
}

/* ─────────────────────────── 6. Animated Theme Toggler ─────────── */

export function AnimatedThemeTogglerShowcase() {
    return (
        <div className="flex flex-col gap-5">
            <Frame number="001" title="Default · click to wipe">
                <div className="flex items-center gap-3">
                    <AnimatedThemeToggler />
                    <span className="caption-mono text-[11px] text-fg-muted">
                        Cliccami per cambiare tema
                    </span>
                </div>
            </Frame>
            <Frame number="002" title="In navbar · with brand mark">
                <div className="flex h-12 items-center justify-between rounded-md border border-border bg-bg px-3">
                    <div className="flex items-center gap-2">
                        <span className="size-5 rounded-sm bg-fg" aria-hidden />
                        <span className="caption-mono text-[11px] uppercase tracking-[0.16em] text-fg">
                            LP / 2025
                        </span>
                    </div>
                    <div className="flex items-center gap-1">
                        <button
                            type="button"
                            className="press inline-flex h-9 items-center rounded-md px-3 text-[12.5px] font-medium text-fg-muted hover:text-fg"
                        >
                            Components
                        </button>
                        <AnimatedThemeToggler />
                    </div>
                </div>
            </Frame>
            <Frame number="003" title="Side rail · with hint">
                <div className="flex flex-col gap-2">
                    <span className="caption-mono text-[10px] uppercase tracking-[0.18em] text-fg-soft">
                        Theme
                    </span>
                    <div className="flex items-center gap-2 rounded-md border border-border bg-bg p-2">
                        <AnimatedThemeToggler />
                        <span className="text-[12.5px] text-fg-muted">
                            <Sparkles className="mb-px mr-1 inline size-3 text-fg-soft" aria-hidden />
                            View Transition API · circular wipe
                        </span>
                    </div>
                </div>
            </Frame>
        </div>
    );
}
