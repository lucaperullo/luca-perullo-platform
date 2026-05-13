import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";
import {
  isValidPartitaIva,
  isValidCodiceFiscale,
  isValidCap,
  isValidIban,
  isValidCodiceDestinatario,
} from "@/lib/admin/validators";

export const runtime = "nodejs";

const STR_FIELDS = [
  "business_name","legal_name","vat_number","tax_code","address","city","zip",
  "province","country","iban","swift","bank_name","pec_email","sdi_code",
] as const;
const NUM_FIELDS = [
  "bollo_threshold_cents","bollo_amount_cents","min_installment_cents",
] as const;

export async function PATCH(req: Request) {
  const { supabase } = await requireAdmin();
  let body: Record<string, unknown>;
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "invalid-json" }, { status: 400 }); }

  const patch: Record<string, unknown> = {};
  for (const k of STR_FIELDS) {
    if (typeof body[k] === "string") patch[k] = (body[k] as string).trim() || null;
  }
  for (const k of NUM_FIELDS) {
    if (typeof body[k] === "number" && Number.isInteger(body[k]) && (body[k] as number) >= 0) {
      patch[k] = body[k];
    }
  }

  // Validazioni autoritative
  if (patch.vat_number && !isValidPartitaIva(String(patch.vat_number))) {
    return NextResponse.json({ error: "invalid-vat" }, { status: 400 });
  }
  if (patch.tax_code && !isValidCodiceFiscale(String(patch.tax_code))) {
    return NextResponse.json({ error: "invalid-tax-code" }, { status: 400 });
  }
  if (patch.zip && !isValidCap(String(patch.zip))) {
    return NextResponse.json({ error: "invalid-cap" }, { status: 400 });
  }
  if (patch.iban && !isValidIban(String(patch.iban))) {
    return NextResponse.json({ error: "invalid-iban" }, { status: 400 });
  }
  if (patch.sdi_code && !isValidCodiceDestinatario(String(patch.sdi_code))) {
    return NextResponse.json({ error: "invalid-sdi-code" }, { status: 400 });
  }

  const { data: row } = await supabase.from("admin_settings").select("id").maybeSingle();
  if (!row) {
    return NextResponse.json({ error: "no-singleton" }, { status: 500 });
  }
  const { error } = await supabase
    .from("admin_settings")
    .update(patch)
    .eq("id", (row as { id: string }).id);
  if (error) return NextResponse.json({ error: String(error) }, { status: 500 });
  return NextResponse.json({ ok: true });
}
