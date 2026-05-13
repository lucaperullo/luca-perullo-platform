import Link from "next/link";
import { listClients } from "@/lib/admin/clients";

export const dynamic = "force-dynamic";

export default async function ClientiPage() {
  const clients = await listClients();
  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-fg-muted">Admin / Clienti</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-fg">Clienti</h1>
        </div>
        <Link href="/admin/clienti/nuovo"
          className="press rounded-md border border-fg bg-fg px-4 py-2 font-mono text-[11.5px] uppercase tracking-[0.08em] text-bg">
          + Nuovo
        </Link>
      </div>
      {clients.length === 0 ? (
        <p className="mt-12 text-[14px] text-fg-muted">Nessun cliente. Aggiungine uno.</p>
      ) : (
        <table className="mt-8 w-full border-collapse text-[14px]">
          <thead>
            <tr className="border-b border-border text-left font-mono text-[10.5px] uppercase tracking-[0.12em] text-fg-soft">
              <th className="py-2">Nome</th>
              <th className="py-2">Tipo</th>
              <th className="py-2">P.IVA / CF</th>
              <th className="py-2"></th>
            </tr>
          </thead>
          <tbody>
            {clients.map(c => (
              <tr key={c.id} className="border-b border-border">
                <td className="py-3"><Link href={`/admin/clienti/${c.id}`} className="text-fg hover:underline">{c.display_name}</Link></td>
                <td className="py-3 font-mono text-[12px] text-fg-muted">{c.kind}</td>
                <td className="py-3 font-mono text-[12px] text-fg-muted">{c.vat_number ?? c.tax_code ?? "—"}</td>
                <td className="py-3 text-right"><Link href={`/admin/clienti/${c.id}`} className="font-mono text-[11px] text-fg-muted hover:text-fg">Modifica →</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
