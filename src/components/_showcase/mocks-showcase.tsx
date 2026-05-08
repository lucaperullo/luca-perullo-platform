"use client";

import { type ReactNode } from "react";
import {
    File as FileLucide,
    Folder as FolderLucide,
    FolderOpen as FolderOpenLucide,
    Globe,
    Mail,
    MessageSquare,
    Music,
    ScrollText,
    Settings,
    Hash,
} from "lucide-react";
import { SafariMock } from "@/components/safari-mock";
import { IphoneMock } from "@/components/iphone-mock";
import { AndroidMock } from "@/components/android-mock";
import {
    Terminal,
    TerminalCommand,
    TerminalOutput,
    TerminalTyping,
} from "@/components/terminal";
import { Dock, DockIcon } from "@/components/dock";
import { AvatarCircles } from "@/components/avatar-circles";
import { OrbitingCircles } from "@/components/orbiting-circles";
import { Tree, Folder, File } from "@/components/file-tree";

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

/* ─────────────────────────── 1. Safari Mock ────────────────────── */

export function SafariMockShowcase() {
    return (
        <div className="flex flex-col gap-5">
            <Frame number="001" title="Default · placeholder content">
                <SafariMock url="lucaperullo.it" className="w-full max-w-[420px]">
                    <div className="flex h-full items-center justify-center text-fg-muted">
                        Anteprima del sito
                    </div>
                </SafariMock>
            </Frame>
            <Frame number="002" title="Custom URL · marketing site">
                <SafariMock url="components.lucaperullo.it/animated-beam" className="w-full max-w-[460px]">
                    <div className="flex h-full flex-col gap-2 p-4">
                        <span className="caption-mono text-[10px] uppercase tracking-[0.18em] text-fg-soft">
                            Animated Beam · 001
                        </span>
                        <h3 className="text-sm font-semibold tracking-tight text-fg">
                            HTTP round-trip
                        </h3>
                    </div>
                </SafariMock>
            </Frame>
            <Frame number="003" title="Compact · narrow embed">
                <SafariMock url="claude.ai/new" className="w-full max-w-[300px]">
                    <div className="flex h-full items-center justify-center bg-zinc-950 text-zinc-300">
                        New chat
                    </div>
                </SafariMock>
            </Frame>
        </div>
    );
}

/* ─────────────────────────── 2. iPhone Mock ────────────────────── */

export function IphoneMockShowcase() {
    return (
        <div className="flex flex-col gap-5">
            <Frame number="001" title="Default · v2 · dynamic island">
                <div className="flex justify-center">
                    <IphoneMock className="w-full max-w-[180px]">
                        <div className="flex h-full items-center justify-center bg-zinc-900 text-zinc-300">
                            Demo
                        </div>
                    </IphoneMock>
                </div>
            </Frame>
            <Frame number="002" title="App preview · with content">
                <div className="flex justify-center">
                    <IphoneMock className="w-full max-w-[200px]">
                        <div className="flex h-full flex-col bg-zinc-900 px-4 pt-12">
                            <h4 className="text-sm font-semibold tracking-tight text-zinc-100">
                                Componenti
                            </h4>
                            <p className="mt-1 text-[11px] leading-[1.5] text-zinc-500">
                                36 brand-locked
                            </p>
                            <div className="mt-3 flex flex-col gap-2">
                                {["Animated Beam", "Magic Card", "Dock"].map((s) => (
                                    <div
                                        key={s}
                                        className="rounded-md bg-zinc-800/60 px-2 py-1.5 text-[11px] text-zinc-200"
                                    >
                                        {s}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </IphoneMock>
                </div>
            </Frame>
            <Frame number="003" title="Variant v1 · notch">
                <div className="flex justify-center">
                    <IphoneMock variant="v1" className="w-full max-w-[180px]">
                        <div className="flex h-full items-center justify-center bg-zinc-900 text-zinc-300">
                            Notch
                        </div>
                    </IphoneMock>
                </div>
            </Frame>
        </div>
    );
}

/* ─────────────────────────── 3. Android Mock ───────────────────── */

export function AndroidMockShowcase() {
    return (
        <div className="flex flex-col gap-5">
            <Frame number="001" title="Default · punch-hole">
                <div className="flex justify-center">
                    <AndroidMock className="w-full max-w-[180px]">
                        <div className="flex h-full items-center justify-center bg-zinc-900 text-zinc-300">
                            Demo
                        </div>
                    </AndroidMock>
                </div>
            </Frame>
            <Frame number="002" title="App preview · feed">
                <div className="flex justify-center">
                    <AndroidMock className="w-full max-w-[200px]">
                        <div className="flex h-full flex-col gap-2 bg-zinc-900 px-3 pt-9">
                            <span className="text-[10px] uppercase tracking-[0.16em] text-zinc-500">
                                Inbox · 12
                            </span>
                            {[
                                "Update merged",
                                "Build passed",
                                "New PR comment",
                            ].map((s) => (
                                <div
                                    key={s}
                                    className="rounded-md bg-zinc-800/60 px-2 py-1.5 text-[11px] text-zinc-200"
                                >
                                    {s}
                                </div>
                            ))}
                        </div>
                    </AndroidMock>
                </div>
            </Frame>
            <Frame number="003" title="Compact · narrow embed">
                <div className="flex justify-center">
                    <AndroidMock className="w-full max-w-[140px]">
                        <div className="flex h-full items-center justify-center bg-emerald-950 text-emerald-200">
                            ✓ live
                        </div>
                    </AndroidMock>
                </div>
            </Frame>
        </div>
    );
}

/* ─────────────────────────── 4. Terminal ───────────────────────── */

export function TerminalShowcase() {
    return (
        <div className="flex flex-col gap-5">
            <Frame number="001" title="Default · simple session">
                <Terminal title="zsh">
                    <TerminalCommand>npm run dev</TerminalCommand>
                    <TerminalOutput>{"› Ready in 1.2s"}</TerminalOutput>
                    <TerminalTyping text="git status --short" speed={32} />
                </Terminal>
            </Frame>
            <Frame number="002" title="Build output · multi-step">
                <Terminal title="build · production">
                    <TerminalCommand>pnpm build</TerminalCommand>
                    <TerminalOutput>{`› Compiling...
› Routes: 56 static · 8 dynamic
› Bundle: 142 kB shared
› Build complete · 8.4s`}</TerminalOutput>
                    <TerminalCommand>pnpm test</TerminalCommand>
                    <TerminalOutput>{`✓ 142 passed · 1.2s`}</TerminalOutput>
                </Terminal>
            </Frame>
            <Frame number="003" title="Onboarding · install flow">
                <Terminal title="install">
                    <TerminalCommand>
                        npx claude-mem init my-project
                    </TerminalCommand>
                    <TerminalOutput>{"› Creating new project..."}</TerminalOutput>
                    <TerminalOutput>{"› Done · cd my-project"}</TerminalOutput>
                    <TerminalTyping text="cd my-project && pnpm dev" speed={28} />
                </Terminal>
            </Frame>
        </div>
    );
}

/* ─────────────────────────── 5. Dock ──────────────────────────── */

export function DockShowcase() {
    return (
        <div className="flex flex-col gap-5">
            <Frame number="001" title="Default · 4 icons">
                <div className="flex justify-center">
                    <Dock>
                        <DockIcon>
                            <Globe className="size-5" />
                        </DockIcon>
                        <DockIcon>
                            <Mail className="size-5" />
                        </DockIcon>
                        <DockIcon>
                            <ScrollText className="size-5" />
                        </DockIcon>
                        <DockIcon>
                            <FolderLucide className="size-5" />
                        </DockIcon>
                    </Dock>
                </div>
            </Frame>
            <Frame number="002" title="App launcher · 6 icons">
                <div className="flex justify-center">
                    <Dock iconSize={48} iconMagnification={68}>
                        <DockIcon>
                            <MessageSquare className="size-5" />
                        </DockIcon>
                        <DockIcon>
                            <Mail className="size-5" />
                        </DockIcon>
                        <DockIcon>
                            <Music className="size-5" />
                        </DockIcon>
                        <DockIcon>
                            <Hash className="size-5" />
                        </DockIcon>
                        <DockIcon>
                            <ScrollText className="size-5" />
                        </DockIcon>
                        <DockIcon>
                            <Settings className="size-5" />
                        </DockIcon>
                    </Dock>
                </div>
            </Frame>
            <Frame number="003" title="Vertical · side rail">
                <div className="flex justify-center">
                    <Dock direction="vertical" iconSize={44}>
                        <DockIcon>
                            <Globe className="size-5" />
                        </DockIcon>
                        <DockIcon>
                            <Mail className="size-5" />
                        </DockIcon>
                        <DockIcon>
                            <Settings className="size-5" />
                        </DockIcon>
                    </Dock>
                </div>
            </Frame>
        </div>
    );
}

/* ─────────────────────────── 6. Avatar Circles ─────────────────── */

const AVATARS = [
    "https://i.pravatar.cc/80?img=12",
    "https://i.pravatar.cc/80?img=35",
    "https://i.pravatar.cc/80?img=23",
    "https://i.pravatar.cc/80?img=44",
    "https://i.pravatar.cc/80?img=14",
    "https://i.pravatar.cc/80?img=51",
];

export function AvatarCirclesShowcase() {
    return (
        <div className="flex flex-col gap-5">
            <Frame number="001" title="Default · 4 visible">
                <AvatarCircles numPeople={8} avatarUrls={AVATARS.slice(0, 4)} />
            </Frame>
            <Frame number="002" title="Team list · with overflow">
                <div className="flex flex-col gap-2">
                    <span className="caption-mono text-[10px] uppercase tracking-[0.18em] text-fg-soft">
                        Joined this week · 24 people
                    </span>
                    <AvatarCircles numPeople={24} avatarUrls={AVATARS} max={5} />
                </div>
            </Frame>
            <Frame number="003" title="Compact · max 3">
                <AvatarCircles numPeople={42} avatarUrls={AVATARS} max={3} />
            </Frame>
        </div>
    );
}

/* ─────────────────────────── 7. Orbiting Circles ───────────────── */

export function OrbitingCirclesShowcase() {
    return (
        <div className="flex flex-col gap-5">
            <Frame number="001" title="Default · single orbit">
                <div className="relative mx-auto h-44 w-44">
                    <span className="absolute left-1/2 top-1/2 inline-flex size-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-bg-alt">
                        <Globe className="size-4 text-fg-muted" />
                    </span>
                    <OrbitingCircles radius={70} duration={20}>
                        <span className="size-7 rounded-full bg-bg-alt border border-border flex items-center justify-center">
                            <Mail className="size-3.5 text-fg-muted" />
                        </span>
                    </OrbitingCircles>
                </div>
            </Frame>
            <Frame number="002" title="Multi-orbit · 2 rings">
                <div className="relative mx-auto h-52 w-52">
                    <span className="absolute left-1/2 top-1/2 inline-flex size-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-bg-alt">
                        <Settings className="size-4 text-fg-muted" />
                    </span>
                    <OrbitingCircles radius={80} duration={22}>
                        <span className="size-7 rounded-full bg-bg-alt border border-border flex items-center justify-center">
                            <Mail className="size-3.5 text-fg-muted" />
                        </span>
                    </OrbitingCircles>
                    <OrbitingCircles radius={80} duration={22} delay={11}>
                        <span className="size-7 rounded-full bg-bg-alt border border-border flex items-center justify-center">
                            <Hash className="size-3.5 text-fg-muted" />
                        </span>
                    </OrbitingCircles>
                    <OrbitingCircles radius={45} duration={14} reverse>
                        <span className="size-6 rounded-full bg-bg-alt border border-border flex items-center justify-center">
                            <MessageSquare className="size-3 text-fg-muted" />
                        </span>
                    </OrbitingCircles>
                </div>
            </Frame>
            <Frame number="003" title="Path off · invisible track">
                <div className="relative mx-auto h-44 w-44">
                    <span className="absolute left-1/2 top-1/2 inline-flex size-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-bg-alt">
                        <Music className="size-4 text-fg-muted" />
                    </span>
                    <OrbitingCircles radius={65} duration={18} path={false}>
                        <span className="size-6 rounded-full bg-fg" />
                    </OrbitingCircles>
                </div>
            </Frame>
        </div>
    );
}

/* ─────────────────────────── 8. File Tree ──────────────────────── */

export function FileTreeShowcase() {
    return (
        <div className="flex flex-col gap-5">
            <Frame number="001" title="Default · project root">
                <Tree initialExpandedItems={["src", "components"]} initialSelectedId="page.tsx">
                    <Folder value="src" element="src">
                        <Folder value="components" element="components">
                            <File value="button.tsx">button.tsx</File>
                            <File value="card.tsx">card.tsx</File>
                        </Folder>
                        <File value="page.tsx">page.tsx</File>
                    </Folder>
                    <File value="package.json">package.json</File>
                </Tree>
            </Frame>
            <Frame number="002" title="Deep nesting · monorepo">
                <Tree
                    initialExpandedItems={["apps", "platform", "src", "components"]}
                    initialSelectedId="animated-beam.tsx"
                >
                    <Folder value="apps" element="apps">
                        <Folder value="platform" element="platform">
                            <Folder value="src" element="src">
                                <Folder value="components" element="components">
                                    <File value="animated-beam.tsx">animated-beam.tsx</File>
                                    <File value="dock.tsx">dock.tsx</File>
                                    <File value="terminal.tsx">terminal.tsx</File>
                                </Folder>
                                <File value="layout.tsx">layout.tsx</File>
                            </Folder>
                            <File value="package.json">package.json</File>
                        </Folder>
                        <Folder value="docs" element="docs">
                            <File value="README.md">README.md</File>
                        </Folder>
                    </Folder>
                    <Folder value="packages" element="packages">
                        <File value="utils.ts">utils.ts</File>
                    </Folder>
                </Tree>
            </Frame>
            <Frame number="003" title="Selected leaf · file picker">
                <Tree
                    initialExpandedItems={["public", "brand"]}
                    initialSelectedId="logo.svg"
                >
                    <Folder value="public" element="public">
                        <Folder value="brand" element="brand">
                            <File value="logo.svg">logo.svg</File>
                            <File value="favicon.ico">favicon.ico</File>
                            <File value="og.png">og.png</File>
                        </Folder>
                    </Folder>
                </Tree>
            </Frame>
        </div>
    );
}

// Suppress unused-import warnings for icons referenced indirectly.
void FileLucide;
void FolderOpenLucide;
