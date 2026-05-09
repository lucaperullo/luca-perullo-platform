import type { Metadata } from "next";
import Link from "next/link";
import { SectionRule } from "@/components/section-rule";
import { SideLines } from "@/components/side-lines";

export const metadata: Metadata = {
    title: "Acquisto annullato · Luca Perullo",
    robots: { index: false, follow: false },
};

export default function CancelPage() {
    return (
        <>
            <SideLines side="left" />
            <SideLines side="right" />
            <div className="mx-auto w-full max-w-[var(--container-prose)] px-4 sm:px-6">
                <header className="pt-16 pb-8 text-center">
                    <h1 className="text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
                        Nessun problema
                    </h1>
                    <p className="mt-4 max-w-[60ch] mx-auto text-[15px] leading-[1.7] text-fg-muted">
                        Hai annullato il pagamento, niente è stato addebitato.
                        Se hai dubbi sul pacchetto, prenota una{" "}
                        <Link
                            href="/servizi/call-strategia-15"
                            className="text-fg underline decoration-fg-soft underline-offset-4 hover:decoration-fg"
                        >
                            call gratuita di 15 minuti
                        </Link>{" "}
                        — chiariamo tutto prima di procedere.
                    </p>
                </header>
                <SectionRule />
                <section className="py-10 text-center">
                    <Link
                        href="/servizi"
                        className="press inline-flex items-center gap-2 rounded-md border border-fg bg-fg px-4 py-2.5 font-mono text-[12px] uppercase tracking-[0.08em] text-bg hover:bg-fg/90"
                    >
                        Torna ai servizi
                    </Link>
                </section>
            </div>
        </>
    );
}
