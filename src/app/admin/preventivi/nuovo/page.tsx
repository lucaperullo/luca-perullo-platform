import { listClients } from "@/lib/admin/clients";
import { NewDocumentForm } from "@/components/admin/new-document-form";

export const dynamic = "force-dynamic";
export default async function NuovoPreventivoPage() {
  const clients = await listClients();
  return (
    <>
      <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-fg-muted">Admin / Preventivi / Nuovo</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-fg">Nuovo preventivo</h1>
      <div className="mt-8"><NewDocumentForm kind="quote" clients={clients} /></div>
    </>
  );
}
