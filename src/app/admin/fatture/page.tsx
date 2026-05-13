import { listDocuments } from "@/lib/admin/documents";
import { DocumentsTable } from "@/components/admin/documents-table";
import Link from "next/link";

export const dynamic = "force-dynamic";
export default async function FattureListPage() {
  const docs = await listDocuments("invoice");
  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-fg-muted">Admin / Fatture</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-fg">Fatture</h1>
        </div>
        <Link href="/admin/fatture/nuovo" className="press rounded-md border border-fg bg-fg px-4 py-2 font-mono text-[11.5px] uppercase tracking-[0.08em] text-bg">+ Nuovo</Link>
      </div>
      <div className="mt-8"><DocumentsTable docs={docs} basePath="/admin/fatture" /></div>
    </>
  );
}
