import "server-only";
import { createServerClient } from "@/lib/supabase/server";
import type { DocumentKind } from "./numbering";

export type DocumentStatus =
  | "draft" | "issued" | "sent_sdi" | "delivered_sdi" | "rejected_sdi"
  | "partially_paid" | "paid" | "cancelled";

export type Document = {
  id: string; kind: DocumentKind; number: string | null;
  fiscal_year: number | null; sequence: number | null;
  issue_date: string; due_date: string | null;
  client_id: string; client_snapshot: unknown;
  status: DocumentStatus;
  sdi_id_fic: string | null; sdi_message: string | null;
  subtotal_cents: number; bollo_cents: number; total_cents: number;
  currency: string;
  payment_method: string | null; payment_terms: string | null;
  notes_to_client: string | null; internal_notes: string | null;
  pdf_storage_path: string | null; xml_storage_path: string | null;
  converted_from_id: string | null;
  issued_at: string | null;
};
export type DocumentItem = {
  id: string; document_id: string; position: number;
  description: string; quantity: number; unit_price_cents: number;
  line_total_cents: number; vat_code: string;
};
export type Installment = {
  id: string; document_id: string; position: number;
  due_date: string; amount_cents: number;
  paid_at: string | null; payment_reference: string | null;
};

export async function listDocuments(kind: DocumentKind): Promise<Document[]> {
  const supabase = await createServerClient();
  const { data } = await supabase.from("documents").select("*").eq("kind", kind).order("created_at", { ascending: false });
  return (data as unknown as Document[] | null) ?? [];
}
export async function getDocumentBundle(id: string) {
  const supabase = await createServerClient();
  const { data: doc } = await supabase.from("documents").select("*").eq("id", id).maybeSingle();
  if (!doc) return null;
  const { data: items } = await supabase.from("document_items").select("*").eq("document_id", id).order("position");
  const { data: rates } = await supabase.from("document_installments").select("*").eq("document_id", id).order("position");
  return {
    document: doc as unknown as Document,
    items: (items as unknown as DocumentItem[] | null) ?? [],
    installments: (rates as unknown as Installment[] | null) ?? [],
  };
}
