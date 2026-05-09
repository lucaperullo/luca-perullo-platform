"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, Calendar, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type CalNextSlotsProps = {
    eventSlug: string;
    /** Quanti slot mostrare. Default 6. */
    limit?: number;
    /** Finestra di ricerca in giorni. Default 14. */
    days?: number;
    className?: string;
};

type SlotsApiResponse = {
    eventSlug: string;
    eventTypeId: number;
    length: number;
    slots: { time: string }[];
    bookHref: string;
};

type ApiErrorResponse = {
    error: string;
    message?: string;
};

/**
 * Mostra i prossimi N slot disponibili per un event type Cal.com.
 * Ogni slot è un link che apre Cal.com con la data pre-selezionata.
 *
 * Failure mode degradato: se l'API non risponde, mostra solo il bottone
 * "Apri calendario" che porta alla pagina Cal generica. Mai pagina vuota.
 */
export function CalNextSlots({
    eventSlug,
    limit = 6,
    days = 14,
    className,
}: CalNextSlotsProps) {
    type State =
        | { status: "loading" }
        | { status: "ok"; data: SlotsApiResponse }
        | { status: "error"; message: string };

    const [state, setState] = useState<State>({ status: "loading" });

    useEffect(() => {
        const ctrl = new AbortController();
        // Singolo setState a fine corsa — niente cascading renders.
        // Lo stato "loading" è già il default e viene re-imposto se cambiano
        // le props grazie al fatto che useEffect non runna il body sincronamente.
        (async () => {
            try {
                const r = await fetch(
                    `/api/cal/availability?eventSlug=${encodeURIComponent(
                        eventSlug,
                    )}&days=${days}&limit=${limit}`,
                    { signal: ctrl.signal },
                );
                const j = (await r.json()) as
                    | SlotsApiResponse
                    | ApiErrorResponse;
                if (ctrl.signal.aborted) return;
                if (!r.ok || "error" in j) {
                    const msg =
                        ("message" in j && j.message) ||
                        ("error" in j && j.error) ||
                        "Errore";
                    setState({ status: "error", message: msg });
                    return;
                }
                setState({ status: "ok", data: j as SlotsApiResponse });
            } catch (e) {
                if (ctrl.signal.aborted) return;
                setState({
                    status: "error",
                    message: e instanceof Error ? e.message : "Errore",
                });
            }
        })();
        return () => ctrl.abort();
    }, [eventSlug, days, limit]);

    const loading = state.status === "loading";
    const error = state.status === "error" ? state.message : null;
    const data = state.status === "ok" ? state.data : null;

    const fallbackHref = `https://cal.com/lucaperullo/${eventSlug}`;
    const bookHref = data?.bookHref ?? fallbackHref;

    return (
        <div className={cn("flex flex-col gap-3", className)}>
            <div className="flex items-center gap-2">
                <Calendar
                    className="h-3.5 w-3.5 text-fg-muted"
                    aria-hidden
                />
                <span className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-fg-soft">
                    Prossimi slot disponibili
                </span>
            </div>

            {loading ? (
                <div className="flex items-center gap-2 font-mono text-[12px] text-fg-muted">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
                    Carico la disponibilità…
                </div>
            ) : error ? (
                <p className="font-mono text-[12px] text-fg-muted">
                    {error.toLowerCase().includes("not-configured")
                        ? "Il calendario non è ancora collegato. Apri Cal.com per vedere gli slot."
                        : "Non riesco a leggere la disponibilità adesso. Apri il calendario completo qui sotto."}
                </p>
            ) : data && data.slots.length > 0 ? (
                <ul className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
                    {data.slots.map((s) => (
                        <li key={s.time}>
                            <a
                                href={buildSlotHref(bookHref, s.time)}
                                target="_blank"
                                rel="noreferrer"
                                className="press flex flex-col items-start gap-0.5 rounded-md border border-border bg-bg-alt px-2.5 py-2 transition-colors hover:border-border-strong hover:bg-bg"
                            >
                                <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-fg-soft">
                                    {formatDate(s.time)}
                                </span>
                                <span className="font-mono text-[12.5px] font-medium text-fg">
                                    {formatTime(s.time)}
                                </span>
                            </a>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="font-mono text-[12px] text-fg-muted">
                    Nessuno slot nei prossimi {days} giorni — apri il
                    calendario per vedere oltre.
                </p>
            )}

            <a
                href={bookHref}
                target="_blank"
                rel="noreferrer"
                className="press inline-flex w-fit items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.08em] text-fg underline decoration-fg-soft underline-offset-4 hover:decoration-fg"
            >
                Apri il calendario completo
                <ArrowUpRight className="h-3 w-3" aria-hidden />
            </a>
        </div>
    );
}

/** Pre-popola la data nell'URL Cal.com (`?date=YYYY-MM-DD&month=YYYY-MM`). */
function buildSlotHref(base: string, iso: string): string {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return base;
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const url = new URL(base);
    url.searchParams.set("date", `${yyyy}-${mm}-${dd}`);
    url.searchParams.set("month", `${yyyy}-${mm}`);
    return url.toString();
}

const DAYS_IT = ["dom", "lun", "mar", "mer", "gio", "ven", "sab"];
const MONTHS_IT = [
    "gen",
    "feb",
    "mar",
    "apr",
    "mag",
    "giu",
    "lug",
    "ago",
    "set",
    "ott",
    "nov",
    "dic",
];

function formatDate(iso: string): string {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return `${DAYS_IT[d.getDay()]} ${d.getDate()} ${MONTHS_IT[d.getMonth()]}`;
}

function formatTime(iso: string): string {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return new Intl.DateTimeFormat("it-IT", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Europe/Rome",
    }).format(d);
}
