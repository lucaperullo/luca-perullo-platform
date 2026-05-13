import Link from "next/link";
import { loadDashboard } from "@/lib/admin/dashboard";

export const dynamic = "force-dynamic";

const fmt = (c: number) => (c/100).toLocaleString("it-IT", { style: "currency", currency: "EUR" });

export default async function AdminDashboardPage() {
  const d = await loadDashboard();
  return (
    <>
      <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-fg-muted">Admin / Dashboard</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-fg">Anno {d.year}</h1>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card label="Fatturato emesso" value={fmt(d.fatturatoYTD)} />
        <Card label="Incassato" value={fmt(d.incassatoYTD)} />
        <Card label="N° fatture" value={String(d.invoiceCount)} />
      </div>

      {d.overdue.length > 0 ? (
        <section className="mt-10">
          <h2 className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-red-600">Rate scadute non pagate ({d.overdue.length})</h2>
          <ul className="mt-3 divide-y divide-border rounded-md border border-border">
            {d.overdue.map(r => (
              <li key={r.id} className="flex items-center justify-between px-4 py-2 text-[13px]">
                <span className="font-mono text-[12px]">{r.due_date}</span>
                <span className="font-mono text-[12px]">{fmt(r.amount_cents)}</span>
                <Link href={`/admin/fatture/${r.document_id}`} className="font-mono text-[11px] text-fg-muted hover:text-fg">Apri →</Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="mt-10">
        <h2 className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-fg-soft">Prossime rate in scadenza</h2>
        {d.upcoming.length === 0 ? (
          <p className="mt-2 font-mono text-[11px] text-fg-soft">Nessuna in scadenza.</p>
        ) : (
          <ul className="mt-3 divide-y divide-border rounded-md border border-border">
            {d.upcoming.map(r => (
              <li key={r.id} className="flex items-center justify-between px-4 py-2 text-[13px]">
                <span className="font-mono text-[12px]">{r.due_date}</span>
                <span className="font-mono text-[12px]">{fmt(r.amount_cents)}</span>
                <Link href={`/admin/fatture/${r.document_id}`} className="font-mono text-[11px] text-fg-muted hover:text-fg">Apri →</Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {d.toTransmit.length > 0 ? (
        <section className="mt-10">
          <h2 className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-fg-soft">Da trasmettere a SDI</h2>
          <ul className="mt-3 divide-y divide-border rounded-md border border-border">
            {d.toTransmit.map(r => (
              <li key={r.id} className="flex items-center justify-between px-4 py-2 text-[13px]">
                <span className="font-mono text-[12px]">{r.number}</span>
                <span className="font-mono text-[12px]">{fmt(r.total_cents)}</span>
                <Link href={`/admin/fatture/${r.id}`} className="font-mono text-[11px] text-fg-muted hover:text-fg">Apri →</Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {d.drafts.length > 0 ? (
        <section className="mt-10">
          <h2 className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-fg-soft">Bozze</h2>
          <ul className="mt-3 divide-y divide-border rounded-md border border-border">
            {d.drafts.map(r => (
              <li key={r.id} className="flex items-center justify-between px-4 py-2 text-[13px]">
                <span className="font-mono text-[12px]">{r.kind === "invoice" ? "Fattura" : "Preventivo"} bozza · {r.created_at.slice(0, 10)}</span>
                <span className="font-mono text-[12px]">{fmt(r.total_cents)}</span>
                <Link href={`/admin/${r.kind === "invoice" ? "fatture" : "preventivi"}/${r.id}`} className="font-mono text-[11px] text-fg-muted hover:text-fg">Apri →</Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </>
  );
}

function Card({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border p-4">
      <p className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-fg-soft">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
    </div>
  );
}
