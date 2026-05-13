"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Client, ClientKind } from "@/lib/admin/clients";

type Props = { initial?: Client };

const EMPTY: Client = {
  id: "", kind: "business", display_name: "", legal_name: null,
  vat_number: null, tax_code: null, address: "", city: "", zip: "",
  province: "", country: "IT", pec_email: null, sdi_code: "0000000",
  contact_email: null, contact_phone: null, notes: null, archived_at: null,
};

export function ClientForm({ initial }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<Client>(initial ?? EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof Client>(k: K, v: Client[K]) {
    setForm(f => ({ ...f, [k]: v }));
  }
  const f = (k: keyof Client) => String(form[k] ?? "");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setError(null);
    const url = initial ? `/api/admin/clients/${initial.id}` : "/api/admin/clients";
    const method = initial ? "PATCH" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "content-type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setError(Array.isArray(j.error) ? j.error.join(", ") : (j.error ?? "save-failed"));
      return;
    }
    router.push("/admin/clienti");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <fieldset className="space-y-3">
        <legend className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-fg-soft">Tipo</legend>
        {(["individual","business","pa"] as ClientKind[]).map(k => (
          <label key={k} className="mr-4 inline-flex items-center gap-2 font-mono text-[12px]">
            <input type="radio" name="kind" value={k} checked={form.kind === k} onChange={() => set("kind", k)} />
            {k === "individual" ? "Privato" : k === "business" ? "Azienda" : "Pubblica Amministrazione"}
          </label>
        ))}
      </fieldset>

      <Field label="Nome interno (come lo cerchi)" value={f("display_name")} onChange={v => set("display_name", v)} required />
      <Field label="Denominazione legale" value={f("legal_name")} onChange={v => set("legal_name", v as never)} />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {form.kind !== "individual" ? (
          <Field label="P.IVA" value={f("vat_number")} onChange={v => set("vat_number", v as never)} required mono />
        ) : null}
        <Field label="Codice fiscale" value={f("tax_code")} onChange={v => set("tax_code", v.toUpperCase() as never)} required={form.kind === "individual"} mono />
      </div>

      <fieldset className="space-y-3">
        <legend className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-fg-soft">Sede</legend>
        <Field label="Indirizzo" value={f("address")} onChange={v => set("address", v)} required />
        <div className="grid grid-cols-3 gap-3">
          <Field label="CAP" value={f("zip")} onChange={v => set("zip", v)} required mono />
          <Field label="Città" value={f("city")} onChange={v => set("city", v)} required />
          <Field label="Prov." value={f("province")} onChange={v => set("province", v.toUpperCase().slice(0,2))} required mono />
        </div>
      </fieldset>

      <fieldset className="space-y-3">
        <legend className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-fg-soft">SDI</legend>
        <Field label="PEC" value={f("pec_email")} onChange={v => set("pec_email", v as never)} />
        <Field label="Codice destinatario (7 char, '0000000' se nessuno)" value={f("sdi_code")} onChange={v => set("sdi_code", v.toUpperCase().slice(0,7) as never)} mono />
      </fieldset>

      <fieldset className="space-y-3">
        <legend className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-fg-soft">Contatti</legend>
        <Field label="Email" value={f("contact_email")} onChange={v => set("contact_email", v as never)} />
        <Field label="Telefono" value={f("contact_phone")} onChange={v => set("contact_phone", v as never)} />
      </fieldset>

      <label className="block">
        <span className="font-mono text-[11px] text-fg-muted">Note interne</span>
        <textarea
          value={f("notes")}
          onChange={e => set("notes", e.target.value as never)}
          rows={3}
          className="mt-1 block w-full rounded-md border border-border bg-bg px-3 py-2 text-[14px] text-fg outline-none focus:border-fg"
        />
      </label>

      <div className="flex items-center gap-3">
        <button type="submit" disabled={saving}
          className="press inline-flex items-center rounded-md border border-fg bg-fg px-4 py-2 font-mono text-[11.5px] uppercase tracking-[0.08em] text-bg disabled:opacity-50">
          {saving ? "Salvataggio…" : initial ? "Salva modifiche" : "Crea cliente"}
        </button>
        {error ? <span className="font-mono text-[11.5px] text-red-600">{error}</span> : null}
      </div>
    </form>
  );
}

function Field({ label, value, onChange, required, mono }: {
  label: string; value: string; onChange: (v: string) => void; required?: boolean; mono?: boolean;
}) {
  return (
    <label className="block">
      <span className="font-mono text-[11px] text-fg-muted">{label}{required ? " *" : ""}</span>
      <input type="text" value={value} onChange={e => onChange(e.target.value)} required={required}
        className={`mt-1 block w-full rounded-md border border-border bg-bg px-3 py-2 text-[14px] text-fg outline-none focus:border-fg ${mono ? "font-mono text-[13px]" : ""}`} />
    </label>
  );
}
