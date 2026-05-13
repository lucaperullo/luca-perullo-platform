import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "node:crypto";
import { createServiceRoleClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

// Map dello stato SDI di FiC al nostro status
const STATUS_MAP: Record<string, string> = {
  not_sent: "issued",
  sent: "sent_sdi",
  delivered: "delivered_sdi",
  rejected: "rejected_sdi",
  no_recipient: "delivered_sdi",  // SDI ha messo a disposizione senza recapito
};

export async function POST(req: Request) {
  const secret = process.env.FIC_WEBHOOK_SECRET;
  if (!secret) return new NextResponse("server misconfig", { status: 500 });
  const signature = req.headers.get("x-signature") ?? "";
  const raw = await req.text();
  const expected = createHmac("sha256", secret).update(raw).digest("hex");
  const sigBuf = Buffer.from(signature, "hex");
  const expBuf = Buffer.from(expected, "hex");
  if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) {
    return new NextResponse("invalid signature", { status: 401 });
  }

  let payload: { data?: { id?: number; ei_status?: string; ei_message?: string | null } };
  try { payload = JSON.parse(raw); }
  catch { return new NextResponse("invalid json", { status: 400 }); }

  const ficId = payload.data?.id;
  const eiStatus = payload.data?.ei_status;
  if (!ficId || !eiStatus) return NextResponse.json({ ok: true, skipped: true });

  const newStatus = STATUS_MAP[eiStatus];
  if (!newStatus) return NextResponse.json({ ok: true, ignored: eiStatus });

  // Service role: bypassa RLS perché FiC non è autenticato come utente
  const supabase = createServiceRoleClient();
  const { error } = await supabase
    .from("documents")
    .update({ status: newStatus, sdi_message: payload.data?.ei_message ?? null })
    .eq("sdi_id_fic", String(ficId));
  if (error) return NextResponse.json({ error: String(error) }, { status: 500 });
  return NextResponse.json({ ok: true });
}
