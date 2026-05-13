import { NextResponse } from "next/server";
import React from "react";
import { requireAdmin } from "@/lib/admin/auth";
import { getDocumentBundle } from "@/lib/admin/documents";
import { loadSettings } from "@/lib/admin/settings";
import { InvoicePdf } from "@/lib/admin/pdf/invoice-template";
import { pdfBuffer } from "@/lib/admin/pdf/render";

export const runtime = "nodejs";

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await ctx.params;
  const bundle = await getDocumentBundle(id);
  if (!bundle) return new NextResponse("not-found", { status: 404 });
  const settings = await loadSettings();
  const buf = await pdfBuffer(
    React.createElement(InvoicePdf, {
      doc: bundle.document,
      items: bundle.items,
      installments: bundle.installments,
      settings,
      clientSnapshot: bundle.document.client_snapshot as Record<string, string | null>,
    })
  );
  return new NextResponse(new Uint8Array(buf), {
    headers: {
      "content-type": "application/pdf",
      "content-disposition": `inline; filename="${bundle.document.number ?? "bozza"}.pdf"`,
      "cache-control": "no-store",
    },
  });
}
