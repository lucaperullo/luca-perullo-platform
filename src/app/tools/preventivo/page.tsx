import { PreventivoCalculator } from "@/components/preventivo-calculator";
import { SectionLabel } from "@/components/section-label";
import { StripeRule } from "@/components/stripe-rule";

export const metadata = {
    title: "Preventivo gratuito",
    description:
        "Stima trasparente per il tuo progetto digitale in 60 secondi. Nessun account, nessuna email obbligatoria, nessun lead-gen.",
};

export default function PreventivoPage() {
    return (
        <div className="mx-auto w-full max-w-[var(--container-prose)] border-x border-border px-4 py-12 sm:px-6">
            <p className="font-mono text-[12px] text-fg-muted">Tool · Preventivo</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
                Stima trasparente,
                <br />
                in 60 secondi.
            </h1>
            <p className="mt-3 max-w-prose text-[15px] leading-[1.7] text-fg-muted">
                Rispondi a poche domande e ottieni un range di costo realistico per il tuo progetto.
                Nessuna email obbligatoria — se vuoi parlarne, ti chiedo io di scrivermi.
            </p>

            <StripeRule className="mt-10" />

            <SectionLabel index={1} className="mt-10 mb-5">
                Calcolatore
            </SectionLabel>

            <PreventivoCalculator />

            <StripeRule className="mt-10" />

            <SectionLabel index={2} className="mt-10 mb-5">
                Cosa è incluso nel range
            </SectionLabel>
            <ul className="space-y-2 text-[14px] text-fg-muted">
                <li>· Discovery iniziale (call + brief scritto)</li>
                <li>· Design UI essenziale, sistema di componenti riutilizzabile</li>
                <li>· Sviluppo full-stack (frontend, backend, integrazioni)</li>
                <li>· Test, deploy in produzione, supporto post-lancio (30 giorni)</li>
            </ul>
            <p className="mt-5 text-[13.5px] text-fg-muted">
                <span className="font-medium text-fg">Non incluso:</span> contenuti, fotografie,
                advertising, integrazioni custom con sistemi legacy, hosting (lo gestisci tu o lo
                gestisco io con costi a parte). Tutto sempre dichiarato in preventivo.
            </p>
        </div>
    );
}
