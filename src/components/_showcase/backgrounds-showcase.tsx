"use client";

import { type ReactNode } from "react";
import { DotPattern } from "@/components/dot-pattern";
import { GridPattern } from "@/components/grid-pattern";
import { AnimatedGridPattern } from "@/components/animated-grid-pattern";
import { RetroGrid } from "@/components/retro-grid";
import { FlickeringGrid } from "@/components/flickering-grid";
import { Ripple } from "@/components/ripple";
import { LightRays } from "@/components/light-rays";
import { WarpBackground } from "@/components/warp-background";

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
        <div className="rounded-sm border border-border bg-bg-alt p-4">
            {children}
        </div>
    </figure>
);

const Stage = ({
    children,
    height = "h-32",
    bg = "bg-bg",
}: {
    children: ReactNode;
    height?: string;
    bg?: string;
}) => (
    <div className={`relative ${height} overflow-hidden rounded-md border border-border ${bg}`}>
        {children}
    </div>
);

const HeroStage = ({ children }: { children: ReactNode }) => (
    <div className="relative h-44 overflow-hidden rounded-lg border border-border bg-bg">
        {children}
        <div className="relative flex h-full flex-col items-center justify-center gap-1 text-center">
            <span className="caption-mono text-[10px] uppercase tracking-[0.18em] text-fg-soft">
                section · 001
            </span>
            <h3 className="text-xl font-semibold tracking-tight text-fg">
                Pronto a spedire?
            </h3>
        </div>
    </div>
);

/* ─────────────────────────── 1. Dot Pattern ────────────────────── */

export function DotPatternShowcase() {
    return (
        <div className="flex flex-col gap-5">
            <Frame number="001" title="Default · static dots">
                <Stage>
                    <DotPattern className="opacity-60" />
                </Stage>
            </Frame>
            <Frame number="002" title="Glow mask · radial fade">
                <Stage>
                    <DotPattern glow className="opacity-80" />
                </Stage>
            </Frame>
            <Frame number="003" title="Hero backdrop · with content">
                <HeroStage>
                    <DotPattern glow />
                </HeroStage>
            </Frame>
        </div>
    );
}

/* ─────────────────────────── 2. Grid Pattern ───────────────────── */

export function GridPatternShowcase() {
    return (
        <div className="flex flex-col gap-5">
            <Frame number="001" title="Default · simple grid">
                <Stage>
                    <GridPattern />
                </Stage>
            </Frame>
            <Frame number="002" title="Highlighted · selected cells">
                <Stage>
                    <GridPattern
                        squares={[
                            [3, 1],
                            [6, 2],
                            [10, 0],
                            [14, 1],
                        ]}
                    />
                </Stage>
            </Frame>
            <Frame number="003" title="Dashed stroke · sketch feel">
                <Stage>
                    <GridPattern strokeDasharray="3 3" />
                </Stage>
            </Frame>
        </div>
    );
}

/* ─────────────────────────── 3. Animated Grid Pattern ──────────── */

export function AnimatedGridPatternShowcase() {
    return (
        <div className="flex flex-col gap-5">
            <Frame number="001" title="Default · subtle flicker">
                <Stage>
                    <AnimatedGridPattern numSquares={20} maxOpacity={0.4} duration={3} width={28} height={28} />
                </Stage>
            </Frame>
            <Frame number="002" title="Hero · roomier cells">
                <HeroStage>
                    <AnimatedGridPattern
                        numSquares={30}
                        maxOpacity={0.35}
                        duration={4}
                        width={48}
                        height={48}
                    />
                </HeroStage>
            </Frame>
            <Frame number="003" title="Dense small · 60 cells lit">
                <Stage>
                    <AnimatedGridPattern numSquares={60} maxOpacity={0.5} duration={2.5} width={20} height={20} />
                </Stage>
            </Frame>
        </div>
    );
}

/* ─────────────────────────── 4. Retro Grid ─────────────────────── */

export function RetroGridShowcase() {
    return (
        <div className="flex flex-col gap-5">
            <Frame number="001" title="Default · synthwave">
                <Stage>
                    <RetroGrid />
                </Stage>
            </Frame>
            <Frame number="002" title="Hero · with title">
                <HeroStage>
                    <RetroGrid />
                </HeroStage>
            </Frame>
            <Frame number="003" title="Steeper · custom angle">
                <Stage>
                    <RetroGrid angle={75} cellSize={45} opacity={0.6} />
                </Stage>
            </Frame>
        </div>
    );
}

/* ─────────────────────────── 5. Flickering Grid ────────────────── */

export function FlickeringGridShowcase() {
    return (
        <div className="flex flex-col gap-5">
            <Frame number="001" title="Default · small + slow">
                <Stage>
                    <FlickeringGrid squareSize={3} gridGap={4} maxOpacity={0.4} />
                </Stage>
            </Frame>
            <Frame number="002" title="Hero · larger cells">
                <HeroStage>
                    <FlickeringGrid squareSize={6} gridGap={8} maxOpacity={0.45} flickerChance={0.18} />
                </HeroStage>
            </Frame>
            <Frame number="003" title="Dense small · busy field">
                <Stage>
                    <FlickeringGrid squareSize={2} gridGap={3} maxOpacity={0.55} flickerChance={0.4} />
                </Stage>
            </Frame>
        </div>
    );
}

/* ─────────────────────────── 6. Ripple ────────────────────────── */

export function RippleShowcase() {
    return (
        <div className="flex flex-col gap-5">
            <Frame number="001" title="Default · 8 rings">
                <Stage>
                    <Ripple mainCircleSize={120} numCircles={6} />
                </Stage>
            </Frame>
            <Frame number="002" title="Hero · with focal element">
                <HeroStage>
                    <Ripple mainCircleSize={120} numCircles={8} mainCircleOpacity={0.3} />
                </HeroStage>
            </Frame>
            <Frame number="003" title="Tighter · denser sonar">
                <Stage>
                    <Ripple mainCircleSize={80} numCircles={12} mainCircleOpacity={0.32} />
                </Stage>
            </Frame>
        </div>
    );
}

/* ─────────────────────────── 7. Light Rays ─────────────────────── */

export function LightRaysShowcase() {
    return (
        <div className="flex flex-col gap-5">
            <Frame number="001" title="Default · 6 rays accent">
                <Stage>
                    <LightRays rayCount={5} rayColor="var(--accent)" intensity={0.55} />
                </Stage>
            </Frame>
            <Frame number="002" title="Hero · soft halo from above">
                <HeroStage>
                    <LightRays rayCount={7} rayColor="var(--accent)" intensity={0.5} />
                </HeroStage>
            </Frame>
            <Frame number="003" title="Dense · 12 rays warm">
                <Stage>
                    <LightRays rayCount={12} rayColor="#f59e0b" intensity={0.4} />
                </Stage>
            </Frame>
        </div>
    );
}

/* ─────────────────────────── 8. Warp Background ───────────────── */

export function WarpBackgroundShowcase() {
    return (
        <div className="flex flex-col gap-5">
            <Frame number="001" title="Default · 18 beams">
                <Stage>
                    <WarpBackground beamCount={18} beamDuration={2.4} />
                </Stage>
            </Frame>
            <Frame number="002" title="Hero · launching">
                <HeroStage>
                    <WarpBackground beamCount={24} beamDuration={2.0} />
                </HeroStage>
            </Frame>
            <Frame number="003" title="Slow warp · 12 beams">
                <Stage>
                    <WarpBackground beamCount={12} beamDuration={4.0} beamSize={3} />
                </Stage>
            </Frame>
        </div>
    );
}
