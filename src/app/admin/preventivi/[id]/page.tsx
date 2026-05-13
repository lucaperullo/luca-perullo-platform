import { notFound } from "next/navigation";
import { getDocumentBundle } from "@/lib/admin/documents";
import { getClient } from "@/lib/admin/clients";
import { loadSettings } from "@/lib/admin/settings";
import { DocumentEditor } from "@/components/admin/document-editor";

export const dynamic = "force-dynamic";

export default async function PreventivoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const bundle = await getDocumentBundle(id);
  if (!bundle || bundle.document.kind !== "quote") notFound();
  const client = await getClient(bundle.document.client_id);
  if (!client) notFound();
  const settings = await loadSettings();
  return (
    <>
      <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-fg-muted">Admin / Preventivi / {bundle.document.number ?? "Bozza"}</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-fg">{bundle.document.number ?? "Bozza preventivo"}</h1>
      <div className="mt-8">
        <DocumentEditor document={bundle.document} items={bundle.items} installments={bundle.installments} client={client} settings={settings} />
      </div>
    </>
  );
}
