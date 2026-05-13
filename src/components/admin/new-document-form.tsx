"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Client } from "@/lib/admin/clients";
import type { DocumentKind } from "@/lib/admin/numbering";

export function NewDocumentForm({ kind, clients }: { kind: DocumentKind; clients: Client[] }) {
  const router = useRouter();
  const [clientId, setClientId] = useState(clients[0]?.id ?? "");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function create() {
    if (!clientId) { setError("Seleziona un cliente"); return; }
    setCreating(true); setError(null);
    const res = await fetch("/api/admin/documents", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ kind, client_id: clientId }),
    });
    setCreating(false);
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setError(j.error ?? "create-failed");
      return;
    }
    const { id } = await res.json() as { id: string };
    const path = kind === "invoice" ? "/admin/fatture" : "/admin/preventivi";
    router.push(`${path}/${id}`);
    router.refresh();
  }

  if (clients.length === 0) {
    return <p className="text-[14px] text-fg-muted">Nessun cliente. <a href="/admin/clienti/nuovo" className="underline">Aggiungine uno prima</a>.</p>;
  }

  return (
    <div className="space-y-4">
      <label className="block">
        <span className="font-mono text-[11px] text-fg-muted">Cliente</span>
        <select value={clientId} onChange={e => setClientId(e.target.value)}
          className="mt-1 block w-full rounded-md border border-border bg-bg px-3 py-2 text-[14px] text-fg outline-none focus:border-fg">
          {clients.map(c => <option key={c.id} value={c.id}>{c.display_name}</option>)}
        </select>
      </label>
      <button type="button" onClick={create} disabled={creating}
        className="press rounded-md border border-fg bg-fg px-4 py-2 font-mono text-[11.5px] uppercase tracking-[0.08em] text-bg disabled:opacity-50">
        {creating ? "Creazione…" : "Crea bozza"}
      </button>
      {error ? <p className="font-mono text-[11.5px] text-red-600">{error}</p> : null}
    </div>
  );
}
