import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";
import { deriveStatusFromInstallments } from "@/lib/admin/installments";

export const runtime = "nodejs";

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string; iid: string }> }) {
  const { supabase } = await requireAdmin();
  const { id, iid } = await ctx.params;
  const body = await req.json().catch(() => ({})) as { paid?: boolean; reference?: string };
  const paid_at = body.paid ? new Date().toISOString() : null;
  const payment_reference = typeof body.reference === "string" ? body.reference : null;
  const { error } = await supabase
    .from("document_installments")
    .update({ paid_at, payment_reference })
    .eq("id", iid).eq("document_id", id);
  if (error) return NextResponse.json({ error: String(error) }, { status: 500 });

  // Ricalcola lo status del documento
  const { data: rates } = await supabase
    .from("document_installments").select("paid_at").eq("document_id", id);
  const derived = deriveStatusFromInstallments((rates as unknown as { paid_at: string | null }[]) ?? []);
  if (derived) {
    await supabase.from("documents").update({ status: derived }).eq("id", id);
  }
  return NextResponse.json({ ok: true, status: derived });
}
