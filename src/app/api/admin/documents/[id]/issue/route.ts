import { NextResponse } from "next/server";
import React from "react";
import { requireAdmin } from "@/lib/admin/auth";
import { getDocumentBundle } from "@/lib/admin/documents";
import { getClient } from "@/lib/admin/clients";
import { loadSettings } from "@/lib/admin/settings";
import { reserveNextNumber, fiscalYearOf } from "@/lib/admin/numbering";
import { InvoicePdf } from "@/lib/admin/pdf/invoice-template";
import { pdfBuffer } from "@/lib/admin/pdf/render";
import { buildFatturaPAXml } from "@/lib/admin/fattura-pa-xml";

export const runtime = "nodejs";

export async function POST(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { supabase } = await requireAdmin();
  const { id } = await ctx.params;
  const bundle = await getDocumentBundle(id);
  if (!bundle) return NextResponse.json({ error: "not-found" }, { status: 404 });
  if (bundle.document.status !== "draft") {
    return NextResponse.json({ error: "already-issued" }, { status: 409 });
  }
  const client = await getClient(bundle.document.client_id);
  if (!client) return NextResponse.json({ error: "client-missing" }, { status: 500 });
  const settings = await loadSettings();

  const fy = fiscalYearOf(bundle.document.issue_date);
  const { sequence, number } = await reserveNextNumber(bundle.document.kind, fy);

  // Snapshot cliente al momento dell'emissione
  const snapshot = { ...client };

  // Genera PDF
  const pdfBuf = await pdfBuffer(
    React.createElement(InvoicePdf, {
      doc: { ...bundle.document, number, fiscal_year: fy, sequence },
      items: bundle.items, installments: bundle.installments,
      settings, clientSnapshot: snapshot as unknown as Record<string, string | null>,
    })
  );
  const slug = number.replace(/\//g, "-");
  const pdfPath = `${fy}/${bundle.document.kind}/${slug}.pdf`;
  const { error: upPdf } = await (supabase as unknown as {
    storage: { from(b: string): { upload(p: string, body: Blob | Buffer | Uint8Array, opts?: { contentType?: string; upsert?: boolean }): Promise<{ error: unknown }> } };
  }).storage.from("fiscal-documents").upload(pdfPath, new Uint8Array(pdfBuf), { contentType: "application/pdf", upsert: true });
  if (upPdf) return NextResponse.json({ error: `pdf-upload: ${String(upPdf)}` }, { status: 500 });

  // Genera XML solo per fatture
  let xmlPath: string | null = null;
  if (bundle.document.kind === "invoice") {
    const xml = buildFatturaPAXml({
      doc: { number, issue_date: bundle.document.issue_date, total_cents: bundle.document.total_cents, bollo_cents: bundle.document.bollo_cents, currency: bundle.document.currency, payment_terms: bundle.document.payment_terms },
      cedente: { business_name: settings.business_name, vat_number: settings.vat_number, tax_code: settings.tax_code, address: settings.address, zip: settings.zip, city: settings.city, province: settings.province, country: settings.country, regime_fiscale: settings.regime_fiscale },
      cessionario: { legal_name: client.legal_name ?? client.display_name, vat_number: client.vat_number, tax_code: client.tax_code, address: client.address, zip: client.zip, city: client.city, province: client.province, country: client.country, sdi_code: client.sdi_code, pec_email: client.pec_email },
      items: bundle.items.map(i => ({ position: i.position, description: i.description, quantity: i.quantity, unit_price_cents: i.unit_price_cents, line_total_cents: i.line_total_cents, vat_code: i.vat_code })),
      installments: bundle.installments.map(r => ({ position: r.position, due_date: r.due_date, amount_cents: r.amount_cents })),
      iban: settings.iban,
    });
    xmlPath = `${fy}/${bundle.document.kind}/${slug}.xml`;
    const { error: upXml } = await (supabase as unknown as {
      storage: { from(b: string): { upload(p: string, body: Blob | Buffer | Uint8Array, opts?: { contentType?: string; upsert?: boolean }): Promise<{ error: unknown }> } };
    }).storage.from("fiscal-documents").upload(xmlPath, new TextEncoder().encode(xml), { contentType: "application/xml", upsert: true });
    if (upXml) return NextResponse.json({ error: `xml-upload: ${String(upXml)}` }, { status: 500 });
  }

  // Update documento
  const { error } = await supabase.from("documents").update({
    status: "issued",
    number, fiscal_year: fy, sequence,
    issued_at: new Date().toISOString(),
    client_snapshot: snapshot,
    pdf_storage_path: pdfPath,
    xml_storage_path: xmlPath,
  }).eq("id", id);
  if (error) return NextResponse.json({ error: String(error) }, { status: 500 });

  return NextResponse.json({ ok: true, number });
}
