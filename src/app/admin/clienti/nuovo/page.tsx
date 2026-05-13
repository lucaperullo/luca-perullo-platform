import { ClientForm } from "@/components/admin/client-form";
export const dynamic = "force-dynamic";
export default function NuovoClientePage() {
  return (
    <>
      <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-fg-muted">Admin / Clienti / Nuovo</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-fg">Nuovo cliente</h1>
      <div className="mt-8"><ClientForm /></div>
    </>
  );
}
