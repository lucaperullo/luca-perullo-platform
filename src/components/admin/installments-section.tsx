"use client";

import { useMemo, useState } from "react";
import { generateMonthlySchedule, validateInstallments, type InstallmentRow } from "@/lib/admin/installments";

type Props = {
  totalCents: number;
  minInstallmentCents: number;
  initial: InstallmentRow[];
  onChange: (rows: InstallmentRow[]) => void;
};

export function InstallmentsSection({ totalCents, minInstallmentCents, initial, onChange }: Props) {
  const [enabled, setEnabled] = useState(initial.length > 0);
  const [rows, setRows] = useState<InstallmentRow[]>(initial);
  const [n, setN] = useState(initial.length || 3);
  const [firstDate, setFirstDate] = useState(initial[0]?.due_date ?? new Date().toISOString().slice(0, 10));

  const validation = useMemo(
    () => validateInstallments(rows, totalCents, { min_installment_cents: minInstallmentCents }),
    [rows, totalCents, minInstallmentCents]
  );

  function regenerate() {
    const out = generateMonthlySchedule({ total_cents: totalCents, n, first_due_date: firstDate });
    setRows(out);
    onChange(out);
  }

  function setEnabledWith(v: boolean) {
    setEnabled(v);
    if (!v) { setRows([]); onChange([]); }
  }

  function updateRow(i: number, patch: Partial<InstallmentRow>) {
    const next = rows.map((r, idx) => idx === i ? { ...r, ...patch } : r);
    setRows(next); onChange(next);
  }

  return (
    <fieldset className="rounded-md border border-border p-4">
      <legend className="px-1 font-mono text-[10.5px] uppercase tracking-[0.12em] text-fg-soft">
        Pagamento
      </legend>

      <label className="inline-flex items-center gap-2 font-mono text-[12px]">
        <input type="checkbox" checked={enabled} onChange={e => setEnabledWith(e.target.checked)} />
        Rateizza il pagamento
      </label>

      {!enabled ? (
        <p className="mt-2 font-mono text-[11px] text-fg-soft">
          Soluzione unica: il cliente paga {(totalCents/100).toFixed(2)}€ entro la data di scadenza.
        </p>
      ) : (
        <div className="mt-4 space-y-3">
          <div className="flex flex-wrap items-end gap-3">
            <label className="block">
              <span className="font-mono text-[10.5px] text-fg-soft">N° rate</span>
              <input type="number" min={1} value={n} onChange={e => setN(parseInt(e.target.value, 10) || 1)}
                className="mt-1 block w-20 rounded-md border border-border bg-bg px-2 py-1 font-mono text-[12px]" />
            </label>
            <label className="block">
              <span className="font-mono text-[10.5px] text-fg-soft">Prima rata</span>
              <input type="date" value={firstDate} onChange={e => setFirstDate(e.target.value)}
                className="mt-1 block rounded-md border border-border bg-bg px-2 py-1 font-mono text-[12px]" />
            </label>
            <button type="button" onClick={regenerate}
              className="press rounded-md border border-border-strong bg-bg-alt px-3 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.08em]">
              Genera schedule
            </button>
          </div>

          {rows.length > 0 ? (
            <table className="w-full border-collapse text-[13px]">
              <thead>
                <tr className="border-b border-border text-left font-mono text-[10.5px] uppercase tracking-[0.12em] text-fg-soft">
                  <th className="py-1.5 w-8">#</th>
                  <th className="py-1.5">Scadenza</th>
                  <th className="py-1.5 text-right">Importo</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i} className="border-b border-border">
                    <td className="py-1.5 font-mono text-[11px] text-fg-muted">{r.position}</td>
                    <td className="py-1.5">
                      <input type="date" value={r.due_date}
                        onChange={e => updateRow(i, { due_date: e.target.value })}
                        className="rounded-md border border-border bg-bg px-2 py-1 font-mono text-[12px]" />
                    </td>
                    <td className="py-1.5 text-right">
                      <input type="number" min={0} step={1}
                        value={r.amount_cents}
                        onChange={e => updateRow(i, { amount_cents: parseInt(e.target.value, 10) || 0 })}
                        className="w-32 rounded-md border border-border bg-bg px-2 py-1 text-right font-mono text-[12px]" />
                      <span className="ml-1 font-mono text-[10.5px] text-fg-soft">cent</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : null}

          {!validation.ok && rows.length > 0 ? (
            <p className="font-mono text-[11px] text-red-600">
              {validation.errors.includes("sum_mismatch") && "Somma rate ≠ totale fattura. "}
              {validation.errors.includes("min_amount") && `Almeno una rata sotto il minimo (${(minInstallmentCents/100).toFixed(0)}€). `}
              {validation.errors.includes("date_order") && "Date non in ordine cronologico. "}
            </p>
          ) : null}
        </div>
      )}
    </fieldset>
  );
}
