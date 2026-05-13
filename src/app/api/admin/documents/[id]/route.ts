import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";
import { computeLineTotal, computeTotals } from "@/lib/admin/totals";
import { validateInstallments } from "@/lib/admin/installments";
import { loadSettings } from "@/lib/admin/settings";

export const runtime = "nodejs";

type ItemIn = { description: string; quantity: number; unit_price_cents: number };
type InstIn = { due_date: string; amount_cents: number };

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { supabase } = await requireAdmin();
  const { id } = await ctx.params;
  const body = await req.json().catch(() => ({})) as Record<string, unknown>;

  const { data: existing } = await supabase.from("documents").select("status").eq("id", id).maybeSingle();
  if (!existing) return NextResponse.json({ error: "not-found" }, { status: 404 });
  if ((existing as { status: string }).status !== "draft") {
    return NextResponse.json({ error: "not-editable-after-issue" }, { status: 409 });
  }

  const settings = await loadSettings();

  const itemsRaw = Array.isArray(body.items) ? body.items as ItemIn[] : [];
  const items = itemsRaw
    .filter(i => typeof i.description === "string" && Number.isFinite(i.quantity) && Number.isInteger(i.unit_price_cents))
    .map((i, idx) => ({
      position: idx + 1,
      description: i.description.slice(0, 500),
      quantity: i.quantity,
      unit_price_cents: i.unit_price_cents,
      line_total_cents: computeLineTotal({ quantity: i.quantity, unit_price_cents: i.unit_price_cents }),
      vat_code: "N2.2",
    }));

  const forceBollo = typeof body.force_bollo === "boolean" ? body.force_bollo : undefined;
  const totals = computeTotals(items, settings, { forceBollo });

  const instRaw = Array.isArray(body.installments) ? body.installments as InstIn[] : [];
  const installments = instRaw
    .filter(r => typeof r.due_date === "string" && Number.isInteger(r.amount_cents))
    .map((r, idx) => ({ position: idx + 1, due_date: r.due_date, amount_cents: r.amount_cents }));
  const v = validateInstallments(installments, totals.total_cents, settings);
  if (!v.ok) return NextResponse.json({ error: "invalid-installments", details: v.errors }, { status: 400 });

  const docPatch: Record<string, unknown> = {
    issue_date: typeof body.issue_date === "string" ? body.issue_date : undefined,
    due_date: typeof body.due_date === "string" ? body.due_date : null,
    payment_method: typeof body.payment_method === "string" ? body.payment_method : null,
    payment_terms: typeof body.payment_terms === "string" ? body.payment_terms : null,
    notes_to_client: typeof body.notes_to_client === "string" ? body.notes_to_client : null,
    internal_notes: typeof body.internal_notes === "string" ? body.internal_notes : null,
    subtotal_cents: totals.subtotal_cents,
    bollo_cents: totals.bollo_cents,
    total_cents: totals.total_cents,
  };
  Object.keys(docPatch).forEach(k => docPatch[k] === undefined && delete docPatch[k]);

  const { error: e1 } = await supabase.from("documents").update(docPatch).eq("id", id);
  if (e1) return NextResponse.json({ error: String(e1) }, { status: 500 });

  await supabase.from("document_items").delete().eq("document_id", id);
  if (items.length > 0) {
    const { error: e2 } = await supabase.from("document_items").insert(items.map(i => ({ ...i, document_id: id })));
    if (e2) return NextResponse.json({ error: String(e2) }, { status: 500 });
  }

  await supabase.from("document_installments").delete().eq("document_id", id);
  if (installments.length > 0) {
    const { error: e3 } = await supabase.from("document_installments").insert(installments.map(r => ({ ...r, document_id: id })));
    if (e3) return NextResponse.json({ error: String(e3) }, { status: 500 });
  }

  return NextResponse.json({ ok: true, totals });
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { supabase } = await requireAdmin();
  const { id } = await ctx.params;
  const { data: doc } = await supabase.from("documents").select("status").eq("id", id).maybeSingle();
  if (!doc) return NextResponse.json({ error: "not-found" }, { status: 404 });
  if ((doc as { status: string }).status !== "draft") {
    return NextResponse.json({ error: "cannot-delete-issued" }, { status: 409 });
  }
  const { error } = await supabase.from("documents").delete().eq("id", id);
  if (error) return NextResponse.json({ error: String(error) }, { status: 500 });
  return NextResponse.json({ ok: true });
}
