import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";
import {
  isValidPartitaIva, isValidCodiceFiscale, isValidCap, isValidCodiceDestinatario,
} from "@/lib/admin/validators";

export const runtime = "nodejs";

const KINDS = ["individual", "business", "pa"] as const;

export async function POST(req: Request) {
  const { supabase } = await requireAdmin();
  const body = await req.json().catch(() => ({})) as Record<string, unknown>;
  const validation = validateClientPayload(body);
  if (!validation.ok) return NextResponse.json({ error: validation.errors }, { status: 400 });
  const { data, error } = await supabase.from("clients").insert(validation.payload).select("id").single();
  if (error) return NextResponse.json({ error: String(error) }, { status: 500 });
  return NextResponse.json({ id: (data as { id: string }).id });
}

export function validateClientPayload(body: Record<string, unknown>) {
  const errors: string[] = [];
  const kind = String(body.kind ?? "");
  if (!(KINDS as readonly string[]).includes(kind)) errors.push("invalid-kind");
  const str = (k: string) => typeof body[k] === "string" ? (body[k] as string).trim() : "";
  const display_name = str("display_name");
  if (!display_name) errors.push("missing-display_name");
  const address = str("address");
  const city = str("city");
  const zip = str("zip");
  const province = str("province").toUpperCase().slice(0, 2);
  if (!address || !city || !zip || !province) errors.push("missing-address");
  if (zip && !isValidCap(zip)) errors.push("invalid-cap");
  const vat_number = str("vat_number") || null;
  const tax_code = str("tax_code") || null;
  if (kind === "individual" && !tax_code) errors.push("missing-tax_code");
  if (kind === "business" && !vat_number) errors.push("missing-vat_number");
  if (vat_number && !isValidPartitaIva(vat_number)) errors.push("invalid-vat");
  if (tax_code && !isValidCodiceFiscale(tax_code)) errors.push("invalid-tax_code");
  const sdi_code = str("sdi_code") || "0000000";
  if (!isValidCodiceDestinatario(sdi_code)) errors.push("invalid-sdi_code");
  if (errors.length) return { ok: false as const, errors };
  return {
    ok: true as const,
    payload: {
      kind, display_name,
      legal_name: str("legal_name") || null,
      vat_number, tax_code,
      address, city, zip, province,
      country: str("country") || "IT",
      pec_email: str("pec_email") || null,
      sdi_code,
      contact_email: str("contact_email") || null,
      contact_phone: str("contact_phone") || null,
      notes: str("notes") || null,
    },
  };
}
