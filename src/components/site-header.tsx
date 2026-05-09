"use client";

import Link from "next/link";
import Image from "next/image";
import { Search } from "lucide-react";
import { Github } from "./brand-icons";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";
import { HeaderAccount } from "./auth/header-account";

const NAV = [
    { href: "/tools", label: "Tools" },
    { href: "/components", label: "Components" },
    { href: "/blog", label: "Blog" },
];

export function SiteHeader() {
    return (
        <header className="sticky top-0 z-30 w-full border-b border-border bg-bg/80 backdrop-blur supports-[backdrop-filter]:bg-bg/60">
            <div className="mx-auto flex h-14 max-w-[var(--container-frame)] items-center gap-3 px-4 sm:px-6">
                <Link
                    href="/"
                    aria-label="Luca Perullo — home"
                    className="flex shrink-0 items-center gap-2"
                >
                    <Monogram className="h-6 w-6" />
                    <span className="hidden text-[14px] font-semibold tracking-tight text-fg sm:inline">
                        Luca Perullo
                    </span>
                </Link>

                {/*
                  Cerca — barra estesa subito dopo il logo. Visivamente è
                  un input, funzionalmente è un button: al click apre la
                  CommandPalette via window event (vedi command-palette.tsx).
                  Questo evita di duplicare lo state della palette qui e
                  mantiene il sub-tree del header puro/SSR-friendly.
                */}
                <button
                    type="button"
                    aria-label="Cerca tools, componenti, articoli (⌘K)"
                    onClick={() => {
                        window.dispatchEvent(new Event("cmdk:open"));
                    }}
                    className="press hidden h-9 max-w-[420px] flex-1 items-center gap-2 rounded-md border border-border bg-bg-alt px-3 text-[12.5px] text-fg-muted transition-colors hover:border-border-strong hover:text-fg sm:inline-flex"
                >
                    <Search className="h-3.5 w-3.5 shrink-0" aria-hidden />
                    <span className="truncate text-left">
                        Cerca tools, componenti, articoli…
                    </span>
                    <span className="ml-auto shrink-0 font-mono text-[10.5px] uppercase tracking-[0.06em] text-fg-soft">
                        ⌘K
                    </span>
                </button>

                <nav className="ml-auto hidden items-center gap-1 text-[13.5px] sm:flex">
                    {NAV.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "rounded-md px-2.5 py-1.5 font-medium text-fg-muted transition-colors hover:text-fg",
                            )}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="ml-auto flex items-center gap-1.5 border-l border-border pl-3 sm:ml-0">
                    <a
                        href="https://github.com/lucaperullo"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="GitHub"
                        className="grid h-8 w-8 place-items-center rounded-md text-fg-muted transition-colors hover:text-fg"
                    >
                        <Github className="h-4 w-4" aria-hidden />
                    </a>
                    <ThemeToggle />
                    <HeaderAccount />
                </div>
            </div>
        </header>
    );
}

function Monogram({ className }: { className?: string }) {
    return (
        <span className={cn("relative block h-6 w-6", className)}>
            <Image
                src="/brand/monogram.jpg"
                alt="Luca Perullo"
                fill
                sizes="24px"
                className="object-contain mix-blend-multiply dark:mix-blend-normal dark:invert"
                priority
            />
        </span>
    );
}
