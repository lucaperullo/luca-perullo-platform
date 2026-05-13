import "server-only";
import { createServerClient } from "@/lib/supabase/server";

export async function loadDashboard() {
  const supabase = await createServerClient();
  const year = new Date().getUTCFullYear();
  const todayISO = new Date().toISOString().slice(0, 10);

  const { data: invoices } = await supabase.from("documents")
    .select("total_cents, status, kind, fiscal_year")
    .eq("kind", "invoice").eq("fiscal_year", year);
  const list = (invoices as unknown as { total_cents: number; status: string }[] | null) ?? [];
  const fatturatoYTD = list.reduce((s, d) => s + d.total_cents, 0);
  const incassatoYTD = list.filter(d => d.status === "paid").reduce((s, d) => s + d.total_cents, 0);

  const { data: dueRates } = await supabase.from("document_installments")
    .select("id, due_date, amount_cents, document_id")
    .is("paid_at", null).order("due_date", { ascending: true });
  const allDue = (dueRates as unknown as { id: string; due_date: string; amount_cents: number; document_id: string }[] | null) ?? [];
  const overdue = allDue.filter(r => r.due_date < todayISO);
  const upcoming = allDue.filter(r => r.due_date >= todayISO).slice(0, 10);

  const { data: drafts } = await supabase.from("documents")
    .select("id, kind, total_cents, created_at").eq("status", "draft").order("created_at", { ascending: false }).limit(5);
  const { data: toTransmit } = await supabase.from("documents")
    .select("id, number, total_cents").eq("kind", "invoice").eq("status", "issued").order("issued_at", { ascending: false });

  return {
    year, fatturatoYTD, incassatoYTD,
    invoiceCount: list.length,
    overdue, upcoming,
    drafts: (drafts as unknown[] ?? []) as { id: string; kind: string; total_cents: number; created_at: string }[],
    toTransmit: (toTransmit as unknown[] ?? []) as { id: string; number: string | null; total_cents: number }[],
  };
}
