"use client";

import Link from "next/link";
import Image from "next/image";
import { Search } from "lucide-react";
import { Github } from "./brand-icons";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";

const NAV = [
    { href: "/tools", label: "Tools" },
    { href: "/components", label: "Components" },
    { href: "/blog", label: "Blog" },
];

export function SiteHeader() {
    return (
        <header className="sticky top-0 z-30 w-full border-b border-border bg-bg/80 backdrop-blur supports-[backdrop-filter]:bg-bg/60">
            <div className="mx-auto flex h-14 max-w-[var(--container-frame)] items-center gap-4 px-4 sm:px-6">
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

                <nav className="ml-auto flex items-center gap-1 text-[13.5px]">
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

                <div className="flex items-center gap-1.5 border-l border-border pl-3">
                    <button
                        type="button"
                        aria-label="Cerca (⌘K)"
                        className="hidden h-8 items-center gap-2 rounded-md border border-border bg-bg-alt px-2 text-[12px] text-fg-muted transition-colors hover:text-fg sm:inline-flex"
                    >
                        <Search className="h-3.5 w-3.5" aria-hidden />
                        <span className="font-mono">⌘K</span>
                    </button>
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
