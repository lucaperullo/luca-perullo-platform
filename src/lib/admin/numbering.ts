import "server-only";
import { createServerClient } from "@/lib/supabase/server";

export type DocumentKind = "quote" | "invoice";

export function formatDocumentNumber(p: {
  kind: DocumentKind;
  year: number;
  seq: number;
}): string {
  const padded = String(p.seq).padStart(4, "0");
  return p.kind === "invoice" ? `${p.year}/${padded}` : `P-${p.year}-${padded}`;
}

/**
 * Prenota atomicamente il prossimo numero per (kind, year). Da chiamare
 * SOLO al passaggio draft → issued.
 */
export async function reserveNextNumber(
  kind: DocumentKind,
  fiscalYear: number,
): Promise<{ sequence: number; number: string }> {
  const supabase = await createServerClient();
  const { data, error } = await (supabase as any).rpc("next_document_number", {
    p_kind: kind,
    p_year: fiscalYear,
  });
  if (error) throw new Error(`[numbering] rpc failed: ${String(error)}`);
  const seq = data as unknown as number;
  return { sequence: seq, number: formatDocumentNumber({ kind, year: fiscalYear, seq }) };
}

export function fiscalYearOf(date: Date | string): number {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.getUTCFullYear();
}
