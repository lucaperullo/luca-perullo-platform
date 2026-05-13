"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Installment } from "@/lib/admin/documents";

export function InstallmentsPaidList({ docId, installments }: { docId: string; installments: Installment[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);

  async function toggle(iid: string, paid: boolean, reference: string) {
    setBusy(iid);
    await fetch(`/api/admin/documents/${docId}/installments/${iid}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ paid, reference }),
    });
    setBusy(null);
    router.refresh();
  }

  return (
    <table className="w-full border-collapse text-[13px]">
      <thead>
        <tr className="border-b border-border text-left font-mono text-[10.5px] uppercase tracking-[0.12em] text-fg-soft">
          <th className="py-2">#</th><th>Scadenza</th><th className="text-right">Importo</th><th>CRO</th><th className="text-right">Pagata</th>
        </tr>
      </thead>
      <tbody>
        {installments.map(r => (
          <tr key={r.id} className="border-b border-border">
            <td className="py-2 font-mono text-[11px] text-fg-muted">{r.position}</td>
            <td className="py-2 font-mono text-[12px]">{r.due_date}</td>
            <td className="py-2 text-right font-mono text-[12px]">{(r.amount_cents/100).toFixed(2)}€</td>
            <td className="py-2">
              <input
                defaultValue={r.payment_reference ?? ""}
                placeholder="rif. bonifico"
                onBlur={e => toggle(r.id, !!r.paid_at, e.target.value)}
                disabled={busy === r.id}
                className="w-full rounded border border-border bg-bg px-2 py-1 font-mono text-[11px]"
              />
            </td>
            <td className="py-2 text-right">
              <input type="checkbox" checked={!!r.paid_at}
                onChange={e => toggle(r.id, e.target.checked, r.payment_reference ?? "")}
                disabled={busy === r.id} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
