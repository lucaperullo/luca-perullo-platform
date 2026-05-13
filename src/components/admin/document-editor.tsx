"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Client } from "@/lib/admin/clients";
import type { Document, DocumentItem, Installment } from "@/lib/admin/documents";
import { computeLineTotal, computeTotals } from "@/lib/admin/totals";
import { InstallmentsSection } from "./installments-section";
import { InstallmentsPaidList } from "./installments-paid-list";
import type { InstallmentRow } from "@/lib/admin/installments";

type Props = {
  document: Document;
  items: DocumentItem[];
  installments: Installment[];
  client: Client;
  settings: { bollo_threshold_cents: number; bollo_amount_cents: number; min_installment_cents: number };
};

type EditorItem = { description: string; quantity: number; unit_price_cents: number };

export function DocumentEditor({ document, items: initialItems, installments: initialInstallments, client, settings }: Props) {
  const router = useRouter();
  const [items, setItems] = useState<EditorItem[]>(
    initialItems.length > 0
      ? initialItems.map(i => ({ description: i.description, quantity: i.quantity, unit_price_cents: i.unit_price_cents }))
      : [{ description: "", quantity: 1, unit_price_cents: 0 }]
  );
  const [issueDate, setIssueDate] = useState(document.issue_date);
  const [dueDate, setDueDate] = useState(document.due_date ?? "");
  const [paymentTerms, setPaymentTerms] = useState(document.payment_terms ?? "Bonifico bancario");
  const [notesToClient, setNotesToClient] = useState(document.notes_to_client ?? "");
  const [forceBollo, setForceBollo] = useState<boolean | null>(null);
  const [installments, setInstallments] = useState<InstallmentRow[]>(
    initialInstallments.map(r => ({ position: r.position, due_date: r.due_date, amount_cents: r.amount_cents }))
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lineRows = useMemo(() => items.map(i => ({
    line_total_cents: computeLineTotal({ quantity: i.quantity, unit_price_cents: i.unit_price_cents }),
  })), [items]);

  const totals = useMemo(
    () => computeTotals(lineRows, settings, forceBollo === null ? {} : { forceBollo }),
    [lineRows, settings, forceBollo]
  );

  function updateItem(i: number, patch: Partial<EditorItem>) {
    setItems(items.map((it, idx) => idx === i ? { ...it, ...patch } : it));
  }
  function addItem() { setItems([...items, { description: "", quantity: 1, unit_price_cents: 0 }]); }
  function removeItem(i: number) { setItems(items.filter((_, idx) => idx !== i)); }
  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = items.slice();
    [next[i], next[j]] = [next[j]!, next[i]!];
    setItems(next);
  }

  async function save() {
    setSaving(true); setError(null);
    const res = await fetch(`/api/admin/documents/${document.id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        issue_date: issueDate,
        due_date: dueDate || null,
        payment_terms: paymentTerms,
        notes_to_client: notesToClient,
        force_bollo: forceBollo,
        items,
        installments,
      }),
    });
    setSaving(false);
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setError(j.error ?? "save-failed");
      return;
    }
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <section className="rounded-md border border-border p-4">
        <h2 className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-fg-soft">Cliente</h2>
        <p className="mt-2 text-[14px] text-fg">{client.display_name}</p>
        <p className="font-mono text-[11px] text-fg-muted">{client.address}, {client.zip} {client.city} ({client.province})</p>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label><span className="font-mono text-[10.5px] text-fg-soft">Data emissione</span>
            <input type="date" value={issueDate} onChange={e => setIssueDate(e.target.value)}
              className="mt-1 block w-full rounded-md border border-border bg-bg px-2 py-1.5 font-mono text-[12px]" />
          </label>
          <label><span className="font-mono text-[10.5px] text-fg-soft">Scadenza (se senza rate)</span>
            <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)}
              className="mt-1 block w-full rounded-md border border-border bg-bg px-2 py-1.5 font-mono text-[12px]" />
          </label>
        </div>
      </section>

      <section className="rounded-md border border-border p-4">
        <h2 className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-fg-soft">Righe</h2>
        <ul className="mt-3 space-y-3">
          {items.map((it, i) => (
            <li key={i} className="grid grid-cols-12 items-end gap-2 border-b border-border pb-3">
              <div className="col-span-12 sm:col-span-6">
                <span className="font-mono text-[10px] text-fg-soft">Descrizione</span>
                <input value={it.description} onChange={e => updateItem(i, { description: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-border bg-bg px-2 py-1.5 text-[13px]" />
              </div>
              <div className="col-span-4 sm:col-span-2">
                <span className="font-mono text-[10px] text-fg-soft">Q.tà</span>
                <input type="number" step="0.01" value={it.quantity}
                  onChange={e => updateItem(i, { quantity: parseFloat(e.target.value) || 0 })}
                  className="mt-1 block w-full rounded-md border border-border bg-bg px-2 py-1.5 text-right font-mono text-[12px]" />
              </div>
              <div className="col-span-5 sm:col-span-3">
                <span className="font-mono text-[10px] text-fg-soft">Prezzo (cent)</span>
                <input type="number" step="1" value={it.unit_price_cents}
                  onChange={e => updateItem(i, { unit_price_cents: parseInt(e.target.value, 10) || 0 })}
                  className="mt-1 block w-full rounded-md border border-border bg-bg px-2 py-1.5 text-right font-mono text-[12px]" />
              </div>
              <div className="col-span-3 sm:col-span-1 flex items-end justify-end gap-1">
                <button type="button" onClick={() => move(i, -1)} aria-label="Sposta su" className="press rounded border border-border px-1.5 py-1 font-mono text-[10px]">↑</button>
                <button type="button" onClick={() => move(i, 1)} aria-label="Sposta giù" className="press rounded border border-border px-1.5 py-1 font-mono text-[10px]">↓</button>
                <button type="button" onClick={() => removeItem(i)} aria-label="Rimuovi" className="press rounded border border-border px-1.5 py-1 font-mono text-[10px]">×</button>
              </div>
            </li>
          ))}
        </ul>
        <button type="button" onClick={addItem}
          className="press mt-3 rounded-md border border-border-strong bg-bg-alt px-3 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.08em]">
          + Aggiungi riga
        </button>
      </section>

      <section className="rounded-md border border-border p-4">
        <h2 className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-fg-soft">Totali</h2>
        <dl className="mt-3 space-y-1 text-[14px]">
          <div className="flex justify-between"><dt>Subtotale</dt><dd className="font-mono">{(totals.subtotal_cents/100).toFixed(2)}€</dd></div>
          <div className="flex justify-between"><dt>Bollo</dt><dd className="font-mono">{(totals.bollo_cents/100).toFixed(2)}€</dd></div>
          <div className="flex justify-between border-t border-border pt-1 text-[16px] font-semibold"><dt>Totale</dt><dd className="font-mono">{(totals.total_cents/100).toFixed(2)}€</dd></div>
        </dl>
        <label className="mt-3 inline-flex items-center gap-2 font-mono text-[11px]">
          <input type="checkbox"
            checked={forceBollo ?? totals.bollo_cents > 0}
            onChange={e => setForceBollo(e.target.checked)} />
          Forza bollo (auto: {totals.subtotal_cents > settings.bollo_threshold_cents ? "sì" : "no"})
        </label>
      </section>

      {document.status === "draft" ? (
        <InstallmentsSection
          totalCents={totals.total_cents}
          minInstallmentCents={settings.min_installment_cents}
          initial={installments}
          onChange={setInstallments}
        />
      ) : initialInstallments.length > 0 ? (
        <section className="rounded-md border border-border p-4">
          <h2 className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-fg-soft">Piano rate</h2>
          <div className="mt-3"><InstallmentsPaidList docId={document.id} installments={initialInstallments} /></div>
        </section>
      ) : null}

      <section className="rounded-md border border-border p-4">
        <h2 className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-fg-soft">Note al cliente</h2>
        <textarea value={notesToClient} onChange={e => setNotesToClient(e.target.value)} rows={3}
          className="mt-2 block w-full rounded-md border border-border bg-bg px-3 py-2 text-[13px]" />
        <label className="mt-3 block"><span className="font-mono text-[10.5px] text-fg-soft">Termini di pagamento</span>
          <input value={paymentTerms} onChange={e => setPaymentTerms(e.target.value)}
            className="mt-1 block w-full rounded-md border border-border bg-bg px-3 py-2 text-[13px]" /></label>
      </section>

      <div className="sticky bottom-0 -mx-4 mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-border bg-bg/95 px-4 py-3 backdrop-blur sm:-mx-8 sm:px-8">
        {error ? <span className="font-mono text-[11px] text-red-600">{error}</span> : <span />}
        <div className="flex items-center gap-2">
          <a href={`/api/admin/documents/${document.id}/pdf`} target="_blank" rel="noreferrer"
            className="press rounded-md border border-border-strong bg-bg-alt px-4 py-2 font-mono text-[11.5px] uppercase tracking-[0.08em]">
            Anteprima PDF
          </a>
          {document.status === "draft" ? (
            <button type="button" onClick={save} disabled={saving}
              className="press rounded-md border border-fg bg-fg px-4 py-2 font-mono text-[11.5px] uppercase tracking-[0.08em] text-bg disabled:opacity-50">
              {saving ? "Salvataggio…" : "Salva bozza"}
            </button>
          ) : null}
          {document.status === "draft" ? (
            <button type="button" onClick={async () => {
              if (!confirm("Confermi l'emissione? Il numero verrà assegnato e il documento non sarà più editabile.")) return;
              const r = await fetch(`/api/admin/documents/${document.id}/issue`, { method: "POST" });
              if (!r.ok) { const j = await r.json().catch(() => ({})); setError(j.error ?? "issue-failed"); return; }
              router.refresh();
            }}
              className="press rounded-md border border-fg bg-fg px-4 py-2 font-mono text-[11.5px] uppercase tracking-[0.08em] text-bg">
              Emetti
            </button>
          ) : null}
          {document.kind === "invoice" && (document.status === "issued" || document.status === "rejected_sdi") ? (
            <button type="button" onClick={async () => {
              const r = await fetch(`/api/admin/documents/${document.id}/transmit`, { method: "POST" });
              if (!r.ok) { const j = await r.json().catch(() => ({})); setError(j.error ?? "transmit-failed"); return; }
              router.refresh();
            }}
              className="press rounded-md border border-fg bg-fg px-4 py-2 font-mono text-[11.5px] uppercase tracking-[0.08em] text-bg">
              Trasmetti a SDI
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
