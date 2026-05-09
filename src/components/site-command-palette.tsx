"use client";

import { useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Briefcase, Component, FileText, Home, Sparkles } from "lucide-react";
import { CommandPalette, type CommandItem } from "./command-palette";
import { tools } from "@/data/tools";

/**
 * Site-wide cmd+K palette.
 *
 * Mounted once in the root layout so the keystroke and the header search
 * button both open the same palette. Uses next/navigation's router for
 * client-side jumps so the SPA feel is preserved.
 *
 * Hash-aware navigation: items can use `/route#anchor-id` URLs. After
 * routing (or immediately, if already on the page), the palette scrolls
 * to the element with that id, with a small offset for the sticky header.
 * Targets that don't exist yet (e.g. dynamic content not yet hydrated)
 * are polled briefly so route-then-scroll works without race conditions.
 *
 * Item set (v1):
 *   - 4 main routes (Home, Tools, Components, Blog)
 *   - One entry per item in `tools` data; entries that point at the
 *     `/tools` listing page get a `#tool-${slug}` hash so cmd+K scrolls
 *     to the card. Entries that have a dedicated subpage navigate there
 *     and don't need a hash (the whole page IS the destination).
 */

const HEADER_OFFSET_PX = 64;

/** Smooth-scroll to an element with id `hash` (with or without `#`). */
function scrollToHash(hash: string) {
    if (!hash) return;
    const id = hash.startsWith("#") ? hash.slice(1) : hash;
    const el = document.getElementById(id);
    if (!el) return false;
    const top = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET_PX;
    window.scrollTo({ top, behavior: "smooth" });
    return true;
}

/**
 * Try to scroll to `hash` now, retrying briefly if the element isn't in
 * the DOM yet (covers route-change cases where the new page is still
 * mounting). Caps at ~600ms total so we don't leak timers.
 */
function scheduleHashScroll(hash: string) {
    if (!hash) return;
    let attempts = 0;
    const tryScroll = () => {
        if (scrollToHash(hash)) return;
        attempts++;
        if (attempts < 12) setTimeout(tryScroll, 50);
    };
    requestAnimationFrame(tryScroll);
}

export function SiteCommandPalette() {
    const router = useRouter();
    const pathname = usePathname();

    const items: CommandItem[] = useMemo(() => {
        /**
         * Resolve a target href into an action.
         *
         * - Same path + hash → just scroll (no route change).
         * - Different path + hash → push, then scroll once the target
         *   element appears.
         * - Different path, no hash → push.
         * - Same path, no hash → scroll to top.
         */
        const navigate = (href: string) => () => {
            const url = new URL(href, "http://placeholder");
            const targetPath = url.pathname;
            const hash = url.hash;

            if (targetPath === pathname) {
                if (hash) {
                    scrollToHash(hash);
                } else {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                }
                return;
            }

            router.push(href);
            if (hash) scheduleHashScroll(hash);
        };

        return [
            {
                id: "nav:home",
                label: "Home",
                hint: "/",
                group: "Navigazione",
                icon: <Home className="h-3.5 w-3.5" />,
                keywords: ["home", "casa", "inizio", "/"],
                onSelect: navigate("/"),
            },
            {
                id: "nav:tools",
                label: "Tools",
                hint: "/tools",
                group: "Navigazione",
                icon: <Briefcase className="h-3.5 w-3.5" />,
                keywords: ["tools", "strumenti", "utility"],
                onSelect: navigate("/tools"),
            },
            {
                id: "nav:components",
                label: "Components",
                hint: "/components",
                group: "Navigazione",
                icon: <Component className="h-3.5 w-3.5" />,
                keywords: ["components", "componenti", "ui", "react"],
                onSelect: navigate("/components"),
            },
            {
                id: "nav:blog",
                label: "Blog",
                hint: "/blog",
                group: "Navigazione",
                icon: <FileText className="h-3.5 w-3.5" />,
                keywords: ["blog", "note", "articoli", "post"],
                onSelect: navigate("/blog"),
            },
            ...tools.map<CommandItem>((t) => {
                // Anchor-on-listing only when the tool's href is the
                // /tools listing itself (that's where the cards with
                // `id="tool-${slug}"` actually render). Tools with their
                // own subpage (/tools/preventivo, /blog/<post>) navigate
                // straight there — no hash needed, the page IS the
                // destination. Tools that point at OTHER listing pages
                // (/components, /blog) just route there without a hash.
                const targetHref =
                    t.href === "/tools" ? `${t.href}#tool-${t.slug}` : t.href;
                return {
                    id: `tool:${t.slug}`,
                    label: t.name,
                    hint:
                        t.status === "live"
                            ? "Live"
                            : t.status === "wip"
                              ? "In sviluppo"
                              : "In arrivo",
                    group: "Tools",
                    icon: <Sparkles className="h-3.5 w-3.5" />,
                    keywords: [t.slug, ...(t.tags ?? []), t.summary],
                    onSelect: navigate(targetHref),
                };
            }),
        ];
    }, [router, pathname]);

    return (
        <CommandPalette
            items={items}
            triggerKey="k"
            placeholder="Cerca pagine, tools, articoli…"
            showTrigger={false}
        />
    );
}
