import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { type Service, formatEur } from "@/data/services";
import { cn } from "@/lib/utils";

export type ServiceCardProps = {
    service: Service;
    /** Se true, rimuove il border-bottom (utile in fondo a una griglia). */
    isLast?: boolean;
    /** Se true, applica row-rule-top all'elemento. */
    isFirst?: boolean;
};

/**
 * Riga-card di un servizio. Stile coerente con l'item di Tools / Projects:
 * icona quadrata + nome + tagline + prezzo a destra.
 *
 * Click sull'intera riga → pagina di dettaglio /servizi/[slug].
 */
export function ServiceCard({ service, isFirst, isLast }: ServiceCardProps) {
    const Icon = service.icon;
    const isFree = service.priceEur === 0;

    return (
        <li
            data-spider-anchor="square"
            className={cn(
                "row-rule",
                isFirst && "row-rule-top",
                isLast && "border-b-0",
            )}
        >
            <Link
                href={`/servizi/${service.slug}`}
                className="group flex items-stretch gap-4 px-4 py-4 transition-colors hover:bg-bg-alt sm:px-6"
            >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md border border-border bg-bg-alt text-fg">
                    <Icon className="h-4 w-4" aria-hidden />
                </span>
                <span className="flex flex-1 flex-col gap-1">
                    <span className="flex items-center gap-2 text-[14.5px] font-medium text-fg">
                        {service.name}
                        {service.status === "soon" ? (
                            <span className="inline-flex items-center rounded-full border border-border bg-bg-alt px-1.5 py-0.5 font-mono text-[10px] uppercase text-fg-soft">
                                presto
                            </span>
                        ) : null}
                    </span>
                    <span className="text-[13px] text-fg-muted">
                        {service.tagline}
                    </span>
                    <span className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] text-fg-soft">
                        <span>{service.timeline}</span>
                        <span aria-hidden>·</span>
                        <span>{service.idealFor}</span>
                    </span>
                </span>
                <span className="flex shrink-0 flex-col items-end justify-between gap-1.5">
                    <span
                        className={cn(
                            "font-mono text-[13.5px] font-semibold",
                            isFree ? "text-accent" : "text-fg",
                        )}
                    >
                        {formatEur(service.priceEur)}
                    </span>
                    <ArrowUpRight
                        className="h-4 w-4 text-fg-soft transition-colors group-hover:text-fg"
                        aria-hidden
                    />
                </span>
            </Link>
        </li>
    );
}
