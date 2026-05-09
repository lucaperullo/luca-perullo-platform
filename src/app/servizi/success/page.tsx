import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import { SectionRule } from "@/components/section-rule";
import { SideLines } from "@/components/side-lines";
import { getServiceBySlug } from "@/data/services";

export const metadata: Metadata = {
    title: "Acquisto completato · Luca Perullo",
    description:
        "Grazie per l'acquisto. Riceverai un'email di conferma con i prossimi passi.",
    robots: { index: false, follow: false },
};

export default async function SuccessPage({
    searchParams,
}: {
    searchParams: Promise<{ slug?: string; session_id?: string }>;
}) {
    const { slug } = await searchParams;
    const service = slug ? getServiceBySlug(slug) : undefined;

    return (
        <>
            <SideLines side="left" />
            <SideLines side="right" />

            <div className="mx-auto w-full max-w-[var(--container-prose)] px-4 sm:px-6">
                <header className="pt-16 pb-8 text-center">
                    <span
                        className="inline-grid h-14 w-14 place-items-center rounded-full border border-accent bg-accent/10 text-accent"
                        aria-hidden
                    >
                        <Check className="h-6 w-6" />
                    </span>
                    <h1 className="mt-6 text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
                        Acquisto completato
                    </h1>
                    <p className="mt-4 max-w-[60ch] mx-auto text-[15px] leading-[1.7] text-fg-muted">
                        Grazie!{" "}
                        {service
                            ? `Hai acquistato ${service.name}.`
                            : "Il tuo ordine è stato registrato."}{" "}
                        Riceverai entro pochi minuti una email di conferma da
                        Stripe e una mia email personale entro 24 ore con
                        il piano di kickoff.
                    </p>
                </header>

                <SectionRule />

                <section className="py-10">
                    <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-fg-soft">
                        Prossimi passi
                    </p>
                    <ol className="mt-5 space-y-4 text-[14.5px] leading-[1.7] text-fg">
                        <li className="flex items-start gap-3">
                            <span className="font-mono text-[12px] text-fg-soft">
                                01
                            </span>
                            <span>
                                <strong className="font-medium">
                                    Email di conferma Stripe
                                </strong>{" "}
                                — già in arrivo nella tua casella, contiene
                                ricevuta e dettagli pagamento.
                            </span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="font-mono text-[12px] text-fg-soft">
                                02
                            </span>
                            <span>
                                <strong className="font-medium">
                                    Email di kickoff (entro 24h)
                                </strong>{" "}
                                — ti scrivo io personalmente con il
                                questionario di brief e una proposta di
                                slot per la prima call.
                            </span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="font-mono text-[12px] text-fg-soft">
                                03
                            </span>
                            <span>
                                <strong className="font-medium">
                                    Dashboard del progetto
                                </strong>{" "}
                                — ricevi un link privato per seguire
                                l&apos;avanzamento giorno per giorno.
                            </span>
                        </li>
                    </ol>
                </section>

                <SectionRule />

                <section className="py-10 text-center">
                    <p className="text-[14px] text-fg-muted">
                        Hai bisogno della fattura intestata? Rispondi alla mail
                        di conferma con i tuoi dati fiscali oppure{" "}
                        <a
                            href="mailto:lucaperullo@outlook.it"
                            className="text-fg underline decoration-fg-soft underline-offset-4 hover:decoration-fg"
                        >
                            scrivimi
                        </a>
                        .
                    </p>
                    <div className="mt-6">
                        <Link
                            href="/"
                            className="press inline-flex items-center gap-2 rounded-md border border-border-strong bg-bg px-4 py-2.5 font-mono text-[12px] uppercase tracking-[0.08em] text-fg hover:bg-bg-alt"
                        >
                            Torna alla home
                        </Link>
                    </div>
                </section>
            </div>
        </>
    );
}
