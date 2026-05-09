"use client";

import { useState } from "react";
import { ChevronDown, Keyboard } from "lucide-react";
import { cn } from "@/lib/utils";

export type KeyboardHelpProps = {
    /** Lezione corrente. Usata per default-aperto nelle prime lezioni HTML. */
    lessonOrder?: number;
};

/**
 * Pannellino "Tasti per HTML" nella sidebar della lezione.
 *
 * - Lezioni 1-4 (HTML basics): aperto di default.
 * - Lezioni 5+ (CSS in poi): chiuso di default — i tip contestuali
 *   prendono il sopravvento, ma chi ha bisogno della tastiera può
 *   espanderlo con un click.
 *
 * Stato persistito (per-utente, una volta) in localStorage: l'utente
 * decide e ricordiamo la sua preferenza.
 */
export function KeyboardHelp({ lessonOrder }: KeyboardHelpProps = {}) {
    const [open, setOpen] = useState(() => {
        if (typeof window === "undefined") return false;
        const stored = window.localStorage.getItem("lp-play-kbd-help-open");
        if (stored === "1") return true;
        if (stored === "0") return false;
        // Nessuna preferenza salvata: aperto solo nelle prime 4 lezioni HTML.
        return (lessonOrder ?? 1) <= 4;
    });

    const toggle = () => {
        const next = !open;
        setOpen(next);
        if (typeof window !== "undefined") {
            window.localStorage.setItem(
                "lp-play-kbd-help-open",
                next ? "1" : "0",
            );
        }
    };

    return (
        <div className="rounded-md border border-border bg-bg">
            <button
                type="button"
                onClick={toggle}
                aria-expanded={open}
                className="press flex w-full items-center justify-between gap-2 px-3 py-2 font-mono text-[10.5px] uppercase tracking-[0.12em] text-fg-muted hover:text-fg"
            >
                <span className="inline-flex items-center gap-1.5">
                    <Keyboard className="h-3 w-3" aria-hidden />
                    Tasti per HTML
                </span>
                <ChevronDown
                    className={cn(
                        "h-3 w-3 transition-transform",
                        open && "rotate-180",
                    )}
                    aria-hidden
                />
            </button>
            {open ? (
                <ul className="space-y-2 border-t border-border px-3 py-3 text-[12px] leading-[1.5]">
                    <KeyRow
                        label="Apri tag"
                        chars="<"
                        mac="il tasto a sinistra dello Z"
                        win="Shift + ,  (la virgola)"
                    />
                    <KeyRow
                        label="Chiudi tag"
                        chars=">"
                        mac="Shift + il tasto a sinistra dello Z"
                        win="Shift + .  (il punto)"
                    />
                    <KeyRow
                        label="Slash (per chiusura tag)"
                        chars="/"
                        mac="Shift + 7"
                        win="Shift + 7"
                    />
                    <KeyRow
                        label="Graffe (per CSS)"
                        chars="{ }"
                        mac="Shift + Alt + è  e  Shift + Alt + +"
                        win="Alt Gr + Shift + è  e  Alt Gr + Shift + +"
                    />
                </ul>
            ) : null}
        </div>
    );
}

function KeyRow({
    label,
    chars,
    mac,
    win,
}: {
    label: string;
    chars: string;
    mac: string;
    win: string;
}) {
    return (
        <li className="flex flex-col gap-0.5">
            <div className="flex items-baseline gap-2">
                <code className="rounded-sm border border-border bg-bg-alt px-1 font-mono text-[12px] text-fg">
                    {chars}
                </code>
                <span className="font-mono text-[10.5px] uppercase tracking-[0.08em] text-fg-soft">
                    {label}
                </span>
            </div>
            <div className="pl-1 text-[11.5px] text-fg-muted">
                <span className="font-mono text-fg-soft">Mac:</span> {mac}
            </div>
            <div className="pl-1 text-[11.5px] text-fg-muted">
                <span className="font-mono text-fg-soft">Win:</span> {win}
            </div>
        </li>
    );
}
