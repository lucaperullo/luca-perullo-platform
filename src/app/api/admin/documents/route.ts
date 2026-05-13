import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const { supabase } = await requireAdmin();
  const body = await req.json().catch(() => ({})) as Record<string, unknown>;
  const kind = body.kind === "invoice" ? "invoice" : "quote";
  const client_id = typeof body.client_id === "string" ? body.client_id : null;
  if (!client_id) return NextResponse.json({ error: "missing-client_id" }, { status: 400 });
  const { data: client } = await supabase.from("clients").select("*").eq("id", client_id).maybeSingle();
  if (!client) return NextResponse.json({ error: "client-not-found" }, { status: 404 });

  const { data, error } = await supabase.from("documents").insert({
    kind,
    client_id,
    client_snapshot: client,
    issue_date: new Date().toISOString().slice(0, 10),
    status: "draft",
  }).select("id").single();
  if (error) return NextResponse.json({ error: String(error) }, { status: 500 });
  return NextResponse.json({ id: (data as { id: string }).id });
}
