import Link from "next/link";
import type { Document } from "@/lib/admin/documents";

const STATUS_LABELS: Record<string, string> = {
  draft: "Bozza", issued: "Emesso", sent_sdi: "Inviato SDI",
  delivered_sdi: "Consegnato SDI", rejected_sdi: "Scartato SDI",
  partially_paid: "Pagato parz.", paid: "Pagato", cancelled: "Annullato",
};

export function DocumentsTable({ docs, basePath }: { docs: Document[]; basePath: string }) {
  if (docs.length === 0) return <p className="text-[14px] text-fg-muted">Nessun documento.</p>;
  return (
    <table className="w-full border-collapse text-[14px]">
      <thead><tr className="border-b border-border text-left font-mono text-[10.5px] uppercase tracking-[0.12em] text-fg-soft">
        <th className="py-2">Numero</th><th>Data</th><th>Stato</th><th className="text-right">Totale</th><th></th>
      </tr></thead>
      <tbody>
        {docs.map(d => (
          <tr key={d.id} className="border-b border-border">
            <td className="py-3 font-mono text-[12px]">{d.number ?? `(bozza ${d.id.slice(0,6)})`}</td>
            <td className="py-3 font-mono text-[12px] text-fg-muted">{d.issue_date}</td>
            <td className="py-3 font-mono text-[12px]">{STATUS_LABELS[d.status] ?? d.status}</td>
            <td className="py-3 text-right font-mono text-[12px]">{(d.total_cents/100).toFixed(2)}€</td>
            <td className="py-3 text-right"><Link href={`${basePath}/${d.id}`} className="font-mono text-[11px] text-fg-muted hover:text-fg">Apri →</Link></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
