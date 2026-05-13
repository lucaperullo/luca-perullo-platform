import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";
import { validateClientPayload } from "../route";

export const runtime = "nodejs";

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { supabase } = await requireAdmin();
  const { id } = await ctx.params;
  const body = await req.json().catch(() => ({})) as Record<string, unknown>;
  const v = validateClientPayload(body);
  if (!v.ok) return NextResponse.json({ error: v.errors }, { status: 400 });
  const { error } = await supabase.from("clients").update(v.payload).eq("id", id);
  if (error) return NextResponse.json({ error: String(error) }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  // Soft delete = archive
  const { supabase } = await requireAdmin();
  const { id } = await ctx.params;
  const { error } = await supabase.from("clients").update({ archived_at: new Date().toISOString() }).eq("id", id);
  if (error) return NextResponse.json({ error: String(error) }, { status: 500 });
  return NextResponse.json({ ok: true });
}
