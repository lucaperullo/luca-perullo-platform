import { loadSettings } from "@/lib/admin/settings";
import { SettingsForm } from "@/components/admin/settings-form";

export const dynamic = "force-dynamic";

export default async function ImpostazioniPage() {
  const settings = await loadSettings();
  return (
    <>
      <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-fg-muted">Admin / Impostazioni</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-fg">Anagrafica e parametri</h1>
      <p className="mt-2 max-w-[60ch] text-[14px] text-fg-muted">
        Dati che vanno in cima a ogni preventivo e fattura emessa, e nei campi obbligatori dell'XML FatturaPA.
      </p>
      <div className="mt-8">
        <SettingsForm initial={settings} />
      </div>
      <div className="mt-12 rounded-md border border-border bg-bg-alt p-4">
        <p className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-fg-soft">Fatture in Cloud</p>
        <p className="mt-2 text-[13.5px] text-fg-muted">
          Connessione SDI: arriverà nel Task 12 del piano. Per ora: niente trasmissione.
        </p>
      </div>
    </>
  );
}
