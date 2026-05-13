"use client";

import { useState } from "react";
import type { AdminSettings } from "@/lib/admin/settings";

type Props = { initial: AdminSettings };

export function SettingsForm({ initial }: Props) {
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  function set<K extends keyof AdminSettings>(k: K, v: AdminSettings[K]) {
    setForm(f => ({ ...f, [k]: v }));
    setSaved(false);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setError(null); setSaved(false);
    const res = await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        ...form,
        bollo_threshold_cents: form.bollo_threshold_cents,
        bollo_amount_cents: form.bollo_amount_cents,
        min_installment_cents: form.min_installment_cents,
      }),
    });
    setSaving(false);
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setError(j.error ?? "save-failed");
      return;
    }
    setSaved(true);
  }

  const f = (k: keyof AdminSettings) => String(form[k] ?? "");

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <Section title="Anagrafica">
        <Field label="Ragione sociale / Nome" value={f("business_name")} onChange={v => set("business_name", v)} required />
        <Field label="Denominazione legale (se diversa)" value={f("legal_name")} onChange={v => set("legal_name", v)} />
        <Field label="P.IVA" value={f("vat_number")} onChange={v => set("vat_number", v)} required mono />
        <Field label="Codice fiscale" value={f("tax_code")} onChange={v => set("tax_code", v)} required mono />
      </Section>

      <Section title="Sede legale">
        <Field label="Indirizzo" value={f("address")} onChange={v => set("address", v)} required />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Field label="CAP" value={f("zip")} onChange={v => set("zip", v)} required mono />
          <Field label="Città" value={f("city")} onChange={v => set("city", v)} required />
          <Field label="Prov. (sigla)" value={f("province")} onChange={v => set("province", v.toUpperCase().slice(0,2))} required mono />
        </div>
      </Section>

      <Section title="Pagamento (IBAN per bonifico)">
        <Field label="IBAN" value={f("iban")} onChange={v => set("iban", v)} required mono />
        <Field label="Banca" value={f("bank_name")} onChange={v => set("bank_name", v)} />
        <Field label="SWIFT/BIC (opzionale)" value={f("swift")} onChange={v => set("swift", v)} mono />
      </Section>

      <Section title="Contatti SDI (di solito vuoti per privati)">
        <Field label="PEC" value={f("pec_email")} onChange={v => set("pec_email", v)} />
        <Field label="Codice destinatario tuo (7 char)" value={f("sdi_code")} onChange={v => set("sdi_code", v)} mono />
      </Section>

      <Section title="Parametri fiscali (forfettario)">
        <FieldNum label="Soglia bollo (centesimi)" value={form.bollo_threshold_cents} onChange={v => set("bollo_threshold_cents", v)} />
        <FieldNum label="Importo bollo (centesimi)" value={form.bollo_amount_cents} onChange={v => set("bollo_amount_cents", v)} />
        <FieldNum label="Rata minima mensile (centesimi)" value={form.min_installment_cents} onChange={v => set("min_installment_cents", v)} />
        <p className="font-mono text-[11px] text-fg-soft">
          Default: bollo €2,00 sopra €77,47; rata minima €500,00. Cambia solo se la legge cambia o se decidi un minimo diverso.
        </p>
      </Section>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="press inline-flex items-center rounded-md border border-fg bg-fg px-4 py-2 font-mono text-[11.5px] uppercase tracking-[0.08em] text-bg disabled:opacity-50"
        >
          {saving ? "Salvataggio…" : "Salva"}
        </button>
        {saved ? <span className="font-mono text-[11.5px] text-fg-muted">Salvato.</span> : null}
        {error ? <span className="font-mono text-[11.5px] text-red-600">{error}</span> : null}
      </div>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="space-y-3">
      <legend className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-fg-soft">{title}</legend>
      {children}
    </fieldset>
  );
}

function Field({ label, value, onChange, required, mono }: {
  label: string; value: string; onChange: (v: string) => void; required?: boolean; mono?: boolean;
}) {
  return (
    <label className="block">
      <span className="font-mono text-[11px] text-fg-muted">{label}{required ? " *" : ""}</span>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        required={required}
        className={`mt-1 block w-full rounded-md border border-border bg-bg px-3 py-2 text-[14px] text-fg outline-none focus:border-fg ${mono ? "font-mono text-[13px]" : ""}`}
      />
    </label>
  );
}

function FieldNum({ label, value, onChange }: {
  label: string; value: number; onChange: (v: number) => void;
}) {
  return (
    <label className="block">
      <span className="font-mono text-[11px] text-fg-muted">{label}</span>
      <input
        type="number"
        min={0}
        step={1}
        value={value}
        onChange={e => onChange(parseInt(e.target.value, 10) || 0)}
        className="mt-1 block w-full rounded-md border border-border bg-bg px-3 py-2 font-mono text-[13px] text-fg outline-none focus:border-fg"
      />
    </label>
  );
}
