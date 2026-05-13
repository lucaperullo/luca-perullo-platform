import { notFound } from "next/navigation";
import { getClient } from "@/lib/admin/clients";
import { ClientForm } from "@/components/admin/client-form";

export const dynamic = "force-dynamic";

export default async function EditClientPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const client = await getClient(id);
  if (!client) notFound();
  return (
    <>
      <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-fg-muted">Admin / Clienti / {client.display_name}</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-fg">{client.display_name}</h1>
      <div className="mt-8"><ClientForm initial={client} /></div>
    </>
  );
}
