"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { ArrowUpRight, BookmarkX } from "lucide-react";
import { playCourses } from "@/data/play";
import { SUBJECT_META } from "@/data/play/types";
import {
    readBookmarks,
    removeBookmark,
    subscribeBookmarks,
} from "@/lib/play-bookmarks";
import { cn } from "@/lib/utils";

/**
 * Sezione "I miei corsi salvati" — usata nella pagina profilo.
 * Legge i bookmark da localStorage tramite useSyncExternalStore (sync
 * UI quando l'utente toggla un bookmark altrove nel sito).
 *
 * Mostra:
 *   - Lista dei corsi salvati con titolo, livello, materie
 *   - Bottone "Rimuovi" per ognuno (oltre alla star nelle card del catalogo)
 *   - Stato vuoto con CTA al catalogo se nessun bookmark
 */
export function BookmarkedCoursesList() {
    const slugs = useSyncExternalStore<string[]>(
        subscribeBookmarks,
        readBookmarks,
        () => [], // SSR: niente bookmark fino a hydration
    );

    if (slugs.length === 0) {
        return (
            <div className="rounded-md border border-border bg-bg-alt p-5">
                <p className="text-[14px] text-fg">
                    Non hai ancora salvato nessun corso.
                </p>
                <p className="mt-1 text-[13px] leading-[1.55] text-fg-muted">
                    Quando esplori il catalogo, click sulla stella di un
                    corso per metterlo qui — così resta a portata di mano
                    quando torni.
                </p>
                <Link
                    href="/play"
                    className="press mt-4 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.08em] text-fg-muted underline decoration-fg-soft underline-offset-3 hover:text-fg"
                >
                    Esplora il catalogo
                    <ArrowUpRight className="h-3 w-3" aria-hidden />
                </Link>
            </div>
        );
    }

    // Ordina secondo l'ordine del catalogo (mantiene coerenza visiva).
    const ordered = playCourses.filter((c) => slugs.includes(c.slug));

    return (
        <ul className="-mx-4 sm:-mx-6">
            {ordered.map((course, i) => (
                <li
                    key={course.slug}
                    className={cn(
                        "row-rule",
                        i === 0 ? "row-rule-top" : undefined,
                    )}
                >
                    <div className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-bg-alt sm:px-6">
                        <Link
                            href={
                                course.status === "live"
                                    ? `/play/${course.slug}`
                                    : "/play"
                            }
                            className="flex flex-1 flex-col gap-1.5"
                        >
                            <span className="flex flex-wrap items-center gap-2">
                                <span className="text-[14.5px] font-medium text-fg">
                                    {course.title}
                                </span>
                                <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-fg-soft">
                                    {course.level}
                                </span>
                                {course.status === "soon" ? (
                                    <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-fg-soft">
                                        · in arrivo
                                    </span>
                                ) : null}
                            </span>
                            <span className="text-[12.5px] text-fg-muted">
                                {course.subjects
                                    .map((s) => SUBJECT_META[s].label)
                                    .join(" · ")}
                            </span>
                        </Link>
                        <button
                            type="button"
                            onClick={() => removeBookmark(course.slug)}
                            aria-label={`Rimuovi ${course.title} dai salvati`}
                            title="Rimuovi dai salvati"
                            className="press grid h-8 w-8 shrink-0 place-items-center rounded-md text-fg-soft transition-colors hover:bg-bg hover:text-fg"
                        >
                            <BookmarkX className="h-4 w-4" aria-hidden />
                        </button>
                    </div>
                </li>
            ))}
        </ul>
    );
}
