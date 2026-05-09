import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SectionLabel } from "@/components/section-label";
import { SectionRule } from "@/components/section-rule";
import { ServiceCard } from "@/components/service-card";
import { SideLines } from "@/components/side-lines";
import {
    FAMILIES,
    services,
    type ServiceFamily,
} from "@/data/services";

export const metadata: Metadata = {
    title: "Servizi · Luca Perullo",
    description:
        "Pacchetti pronti all'acquisto: siti web a prezzo fisso, setup AI/Claude bot, automazioni n8n, consulenze. Trasparenza totale, niente preventivi infiniti.",
    alternates: { canonical: "/servizi" },
};

const FAMILY_ORDER: ServiceFamily[] = [
    "siti",
    "ai",
    "automazioni",
    "consulenze",
];

export default function ServiziPage() {
    return (
        <>
            <SideLines side="left" />
            <SideLines side="right" />

            <div className="mx-auto w-full max-w-[var(--container-prose)] px-4 sm:px-6">
                <header className="pt-10 pb-6 sm:pt-14">
                    <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-fg-muted">
                        Servizi · prezzo fisso
                    </p>
                    <h1 className="mt-3 text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
                        Pacchetti pronti, prezzi dichiarati,
                        <br className="hidden sm:block" />
                        consegna in giorni — non in mesi.
                    </h1>
                    <p className="mt-4 max-w-[60ch] text-[15px] leading-[1.7] text-fg-muted">
                        Niente preventivi infiniti, niente sorprese a metà
                        progetto. Scegli un pacchetto, paghi, ricevi il
                        kickoff entro 24 ore. Se hai un caso fuori dal
                        catalogo, partiamo da una{" "}
                        <Link
                            href="/servizi/call-strategia-15"
                            className="text-fg underline decoration-fg-soft underline-offset-4 hover:decoration-fg"
                        >
                            call gratuita di 15 minuti
                        </Link>
                        .
                    </p>
                </header>

                <SectionRule />

                {/* Anchor menu — porta direttamente alla famiglia */}
                <nav
                    aria-label="Famiglie di servizi"
                    className="-mx-4 flex flex-wrap gap-2 px-4 py-4 sm:-mx-6 sm:px-6"
                >
                    {FAMILY_ORDER.map((f) => {
                        const meta = FAMILIES[f];
                        return (
                            <a
                                key={f}
                                href={`#${f}`}
                                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-bg-alt px-3 py-1 font-mono text-[11.5px] text-fg-muted transition-colors hover:border-border-strong hover:text-fg"
                            >
                                {meta.label}
                            </a>
                        );
                    })}
                </nav>

                <SectionRule />

                {FAMILY_ORDER.map((family, familyIndex) => {
                    const meta = FAMILIES[family];
                    const list = services.filter((s) => s.family === family);
                    return (
                        <section
                            key={family}
                            id={family}
                            className="py-10 scroll-mt-20"
                        >
                            <SectionLabel index={familyIndex + 1}>
                                {meta.label}
                            </SectionLabel>
                            <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.1em] text-fg-soft">
                                {meta.kicker}
                            </p>
                            <p className="mt-3 max-w-[60ch] text-[14px] text-fg-muted">
                                {meta.description}
                            </p>

                            <ul className="-mx-4 mt-6 sm:-mx-6">
                                {list.map((service, i) => (
                                    <ServiceCard
                                        key={service.slug}
                                        service={service}
                                        isFirst={i === 0}
                                        isLast={i === list.length - 1}
                                    />
                                ))}
                            </ul>

                            {familyIndex < FAMILY_ORDER.length - 1 ? (
                                <SectionRule className="mt-10" />
                            ) : null}
                        </section>
                    );
                })}

                <SectionRule />

                {/* Garanzie — costruite per anticipare i dubbi del PMI italiano */}
                <section className="py-10">
                    <SectionLabel index={5}>Le mie garanzie</SectionLabel>
                    <ul className="-mx-4 mt-6 grid grid-cols-1 gap-px bg-border sm:-mx-6 sm:grid-cols-2">
                        {GUARANTEES.map((g) => (
                            <li
                                key={g.title}
                                className="bg-bg p-5 sm:p-6"
                            >
                                <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-fg-soft">
                                    {g.kicker}
                                </p>
                                <p className="mt-2 text-[14.5px] font-medium text-fg">
                                    {g.title}
                                </p>
                                <p className="mt-1.5 text-[13px] leading-[1.6] text-fg-muted">
                                    {g.body}
                                </p>
                            </li>
                        ))}
                    </ul>
                </section>

                <SectionRule />

                <section className="pt-10 pb-16">
                    <SectionLabel index={6}>Domande?</SectionLabel>
                    <p className="mt-4 max-w-[60ch] text-[14px] leading-[1.7] text-fg-muted">
                        Se non sei sicuro di quale pacchetto faccia per te,
                        prenota una{" "}
                        <Link
                            href="/servizi/call-strategia-15"
                            className="text-fg underline decoration-fg-soft underline-offset-4 hover:decoration-fg"
                        >
                            call gratuita di 15 minuti
                        </Link>
                        : capiamo insieme se c&apos;è fit. Senza impegno e
                        senza venderti niente che non ti serve.
                    </p>
                    <div className="mt-6 flex flex-wrap gap-3">
                        <Link
                            href="/servizi/call-strategia-15"
                            className="press inline-flex items-center gap-2 rounded-md border border-fg bg-fg px-4 py-2.5 font-mono text-[12px] uppercase tracking-[0.08em] text-bg hover:bg-fg/90"
                        >
                            Prenota la call
                            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                        </Link>
                        <a
                            href="https://wa.me/393445820014"
                            target="_blank"
                            rel="noreferrer"
                            className="press inline-flex items-center gap-2 rounded-md border border-border-strong bg-bg px-4 py-2.5 font-mono text-[12px] uppercase tracking-[0.08em] text-fg hover:bg-bg-alt"
                        >
                            Scrivimi su WhatsApp
                            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                        </a>
                    </div>
                </section>
            </div>
        </>
    );
}

const GUARANTEES = [
    {
        kicker: "01",
        title: "Prezzo fisso, davvero",
        body: "Quello che leggi è quello che paghi. Niente costi extra in corso d'opera, niente upsell forzati. Se serve qualcosa fuori scope te lo dico prima e decidi tu.",
    },
    {
        kicker: "02",
        title: "Consegna o rimborso",
        body: "Se non rispetto la timeline dichiarata per causa mia, ti rimborso il 20% del pacchetto. Non è una clausola di facciata: è scritto nel contratto.",
    },
    {
        kicker: "03",
        title: "Dashboard cliente in tempo reale",
        body: "Entri quando vuoi e vedi a che punto è il tuo progetto. Tutto tracciato. Niente call settimanali per chiedere 'a che punto siamo?'.",
    },
    {
        kicker: "04",
        title: "Sei tu il proprietario, non io",
        body: "Codice, account hosting, dominio, prompt AI: tutto intestato a te. Se un giorno vuoi cambiare fornitore, esporti tutto in un'ora.",
    },
];
