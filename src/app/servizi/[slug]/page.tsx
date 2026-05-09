import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Check, X } from "lucide-react";
import { BuyButton } from "@/components/buy-button";
import { CalEmbed } from "@/components/cal-embed";
import { CalNextSlots } from "@/components/cal-next-slots";
import { SectionLabel } from "@/components/section-label";
import { SectionRule } from "@/components/section-rule";
import { SideLines } from "@/components/side-lines";
import {
    CAL_USERNAME,
    FAMILIES,
    formatEur,
    getBookHref,
    getServiceBySlug,
    services,
} from "@/data/services";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
    return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<Params>;
}): Promise<Metadata> {
    const { slug } = await params;
    const service = getServiceBySlug(slug);
    if (!service) return { title: "Servizio non trovato · Luca Perullo" };

    return {
        title: `${service.name} — ${formatEur(service.priceEur)} · Luca Perullo`,
        description: service.tagline,
        alternates: { canonical: `/servizi/${service.slug}` },
        openGraph: {
            title: service.name,
            description: service.tagline,
            type: "website",
        },
    };
}

export default async function ServiceDetailPage({
    params,
}: {
    params: Promise<Params>;
}) {
    const { slug } = await params;
    const service = getServiceBySlug(slug);
    if (!service) notFound();

    const Icon = service.icon;
    const family = FAMILIES[service.family];
    const isFree = service.priceEur === 0;

    // Scegli 3 servizi affini (stessa famiglia, escluso quello corrente)
    const related = services
        .filter((s) => s.family === service.family && s.slug !== service.slug)
        .slice(0, 3);

    return (
        <>
            <SideLines side="left" />
            <SideLines side="right" />

            <div className="mx-auto w-full max-w-[var(--container-prose)] px-4 sm:px-6">
                {/* Breadcrumb minimale */}
                <nav
                    aria-label="Briciole di pane"
                    className="pt-8 font-mono text-[11px] uppercase tracking-[0.12em] text-fg-soft"
                >
                    <Link
                        href="/servizi"
                        className="hover:text-fg"
                    >
                        Servizi
                    </Link>
                    <span aria-hidden className="mx-2">
                        /
                    </span>
                    <span className="text-fg-muted">{family.label}</span>
                </nav>

                <header className="pt-4 pb-8">
                    <div className="flex items-start gap-4">
                        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-md border border-border bg-bg-alt text-fg">
                            <Icon className="h-5 w-5" aria-hidden />
                        </span>
                        <div className="flex-1">
                            <h1 className="text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
                                {service.name}
                            </h1>
                            <p className="mt-2 text-[16px] leading-[1.6] text-fg-muted">
                                {service.tagline}
                            </p>
                        </div>
                    </div>

                    {/* Prezzo + timeline pillole */}
                    <div className="mt-6 flex flex-wrap items-center gap-3">
                        <span
                            className={`inline-flex items-center rounded-md border px-3 py-1.5 font-mono text-[13px] font-semibold ${
                                isFree
                                    ? "border-accent bg-accent/10 text-accent"
                                    : "border-fg bg-bg text-fg"
                            }`}
                        >
                            {formatEur(service.priceEur)}
                        </span>
                        <span className="inline-flex items-center rounded-md border border-border bg-bg-alt px-3 py-1.5 font-mono text-[12px] text-fg-muted">
                            {service.timeline}
                        </span>
                        <span className="inline-flex items-center rounded-md border border-border bg-bg-alt px-3 py-1.5 font-mono text-[12px] text-fg-muted">
                            IVA esclusa
                        </span>
                    </div>

                    {/* CTA principale — slot Cal o BuyButton */}
                    <div className="mt-6">
                        {service.cal ? (
                            <CalNextSlots
                                eventSlug={service.cal.eventSlug}
                                limit={6}
                                days={14}
                            />
                        ) : (
                            <>
                                <BuyButton
                                    slug={service.slug}
                                    label={
                                        service.bookOnly
                                            ? "Prenota lo slot"
                                            : isFree
                                              ? "Prenota gratis"
                                              : "Acquista ora"
                                    }
                                    bookHref={getBookHref(service)}
                                />
                                <p className="mt-2 font-mono text-[11px] text-fg-soft">
                                    Pagamento sicuro Stripe · Fatturazione
                                    disponibile su richiesta
                                </p>
                            </>
                        )}
                    </div>
                </header>

                <SectionRule />

                <section className="py-10">
                    <SectionLabel index={1}>Descrizione</SectionLabel>
                    <p className="mt-5 max-w-[60ch] text-[15px] leading-[1.75] text-fg">
                        {service.description}
                    </p>
                    <p className="mt-4 max-w-[60ch] text-[14px] leading-[1.7] text-fg-muted">
                        <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-fg-soft">
                            Ideale per
                        </span>
                        <br />
                        {service.idealFor}
                    </p>
                </section>

                <SectionRule />

                <section className="py-10">
                    <SectionLabel index={2}>Cosa è incluso</SectionLabel>
                    <ul className="mt-6 space-y-2.5">
                        {service.includes.map((item) => (
                            <li
                                key={item}
                                className="flex items-start gap-3 text-[14.5px] leading-[1.55] text-fg"
                            >
                                <Check
                                    className="mt-0.5 h-4 w-4 shrink-0 text-accent"
                                    aria-hidden
                                />
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </section>

                {service.excludes.length > 0 ? (
                    <>
                        <SectionRule />
                        <section className="py-10">
                            <SectionLabel index={3}>
                                Cosa NON è incluso
                            </SectionLabel>
                            <p className="mt-3 max-w-[60ch] text-[13px] text-fg-muted">
                                Trasparenza prima di firmare. Se ti serve
                                qualcosa di questa lista, te lo preventivo
                                separatamente.
                            </p>
                            <ul className="mt-5 space-y-2.5">
                                {service.excludes.map((item) => (
                                    <li
                                        key={item}
                                        className="flex items-start gap-3 text-[14px] leading-[1.55] text-fg-muted"
                                    >
                                        <X
                                            className="mt-0.5 h-4 w-4 shrink-0 text-fg-soft"
                                            aria-hidden
                                        />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    </>
                ) : null}

                <SectionRule />

                {/* CTA secondario in fondo / embed Cal */}
                <section className="py-10">
                    <SectionLabel index={service.excludes.length > 0 ? 4 : 3}>
                        {service.cal
                            ? "Scegli uno slot"
                            : "Pronto a partire?"}
                    </SectionLabel>
                    {service.cal ? (
                        <>
                            <p className="mt-4 max-w-[60ch] text-[14px] leading-[1.7] text-fg-muted">
                                Calendario live: vedi solo gli slot davvero
                                disponibili. Conferma sotto e riceverai
                                l&apos;invito su email.
                            </p>
                            <CalEmbed
                                username={CAL_USERNAME}
                                eventSlug={service.cal.eventSlug}
                                height={760}
                                className="mt-5"
                            />
                        </>
                    ) : (
                        <>
                            <p className="mt-4 max-w-[60ch] text-[14px] leading-[1.7] text-fg-muted">
                                Acquisti ora, ricevi entro 24 ore una email
                                con il link alla dashboard del progetto e la
                                data del kickoff. Se preferisci parlarne
                                prima:
                            </p>
                            <div className="mt-5 flex flex-wrap gap-3">
                                <BuyButton
                                    slug={service.slug}
                                    label={
                                        service.bookOnly
                                            ? "Prenota lo slot"
                                            : isFree
                                              ? "Prenota gratis"
                                              : "Acquista ora"
                                    }
                                    bookHref={getBookHref(service)}
                                />
                                {!service.bookOnly ? (
                                    <Link
                                        href="/servizi/call-strategia-15"
                                        className="press inline-flex items-center gap-2 rounded-md border border-border-strong bg-bg px-4 py-2.5 font-mono text-[12px] uppercase tracking-[0.08em] text-fg hover:bg-bg-alt"
                                    >
                                        Prima una call gratuita
                                        <ArrowUpRight
                                            className="h-3.5 w-3.5"
                                            aria-hidden
                                        />
                                    </Link>
                                ) : null}
                            </div>
                        </>
                    )}
                </section>

                {related.length > 0 ? (
                    <>
                        <SectionRule />
                        <section className="py-10">
                            <SectionLabel
                                index={service.excludes.length > 0 ? 5 : 4}
                            >
                                Servizi affini
                            </SectionLabel>
                            <ul className="-mx-4 mt-5 sm:-mx-6">
                                {related.map((s, i) => {
                                    const RelatedIcon = s.icon;
                                    return (
                                        <li
                                            key={s.slug}
                                            className={`row-rule${
                                                i === 0 ? " row-rule-top" : ""
                                            }`}
                                        >
                                            <Link
                                                href={`/servizi/${s.slug}`}
                                                className="group flex items-center gap-4 px-4 py-4 transition-colors hover:bg-bg-alt sm:px-6"
                                            >
                                                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-border bg-bg-alt text-fg">
                                                    <RelatedIcon
                                                        className="h-4 w-4"
                                                        aria-hidden
                                                    />
                                                </span>
                                                <span className="flex flex-1 flex-col gap-0.5">
                                                    <span className="text-[14px] font-medium text-fg">
                                                        {s.name}
                                                    </span>
                                                    <span className="text-[13px] text-fg-muted">
                                                        {s.tagline}
                                                    </span>
                                                </span>
                                                <span className="font-mono text-[12px] text-fg-muted">
                                                    {formatEur(s.priceEur)}
                                                </span>
                                                <ArrowUpRight
                                                    className="h-4 w-4 shrink-0 text-fg-soft transition-colors group-hover:text-fg"
                                                    aria-hidden
                                                />
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </section>
                    </>
                ) : null}
            </div>
        </>
    );
}
