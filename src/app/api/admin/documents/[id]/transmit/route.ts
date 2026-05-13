import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";
import { getDocumentBundle } from "@/lib/admin/documents";
import { getClient } from "@/lib/admin/clients";
import { loadSettings } from "@/lib/admin/settings";
import { buildFicInvoicePayload, createIssuedDocument, transmitToSdi } from "@/lib/admin/fic/client";

export const runtime = "nodejs";

export async function POST(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { supabase } = await requireAdmin();
  const { id } = await ctx.params;
  const bundle = await getDocumentBundle(id);
  if (!bundle) return NextResponse.json({ error: "not-found" }, { status: 404 });
  if (bundle.document.kind !== "invoice") {
    return NextResponse.json({ error: "only-invoices-go-to-sdi" }, { status: 400 });
  }
  if (bundle.document.status !== "issued" && bundle.document.status !== "rejected_sdi") {
    return NextResponse.json({ error: "wrong-status" }, { status: 409 });
  }
  const client = await getClient(bundle.document.client_id);
  if (!client) return NextResponse.json({ error: "client-missing" }, { status: 500 });
  const settings = await loadSettings();

  const payload = buildFicInvoicePayload({
    kind: "invoice",
    doc: {
      number: bundle.document.number ?? "",
      issue_date: bundle.document.issue_date,
      subtotal_cents: bundle.document.subtotal_cents,
      bollo_cents: bundle.document.bollo_cents,
      total_cents: bundle.document.total_cents,
      payment_terms: bundle.document.payment_terms,
      notes_to_client: bundle.document.notes_to_client,
    },
    cessionario: {
      legal_name: client.legal_name ?? client.display_name,
      vat_number: client.vat_number, tax_code: client.tax_code,
      address: client.address, zip: client.zip, city: client.city,
      province: client.province, country: client.country,
      sdi_code: client.sdi_code, pec_email: client.pec_email,
    },
    items: bundle.items.map(i => ({ description: i.description, quantity: i.quantity, unit_price_cents: i.unit_price_cents })),
    installments: bundle.installments.map(r => ({ due_date: r.due_date, amount_cents: r.amount_cents })),
  });

  try {
    const created = await createIssuedDocument(payload);
    await transmitToSdi(created.data.id);
    await supabase.from("documents").update({
      status: "sent_sdi",
      sdi_id_fic: String(created.data.id),
      sdi_message: null,
    }).eq("id", id);
    return NextResponse.json({ ok: true, fic_id: created.data.id });
  } catch (e) {
    await supabase.from("documents").update({
      sdi_message: String(e),
    }).eq("id", id);
    return NextResponse.json({ error: String(e) }, { status: 502 });
  }
}
