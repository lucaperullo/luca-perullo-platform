import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { requireAdmin } from "@/lib/admin/auth";
import { exchangeCode } from "@/lib/admin/fic/oauth";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const { supabase } = await requireAdmin();
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const c = await cookies();
  const expectedState = c.get("fic_oauth_state")?.value;
  if (!code || !state || state !== expectedState) {
    return NextResponse.redirect(new URL("/admin/impostazioni?fic=state-mismatch", url));
  }
  try {
    const tok = await exchangeCode(code);
    const expires = new Date(Date.now() + tok.expires_in * 1000).toISOString();
    const { data: row } = await supabase.from("admin_settings").select("id").maybeSingle();
    await supabase
      .from("admin_settings")
      .update({
        fic_access_token: tok.access_token,
        fic_refresh_token: tok.refresh_token,
        fic_token_expires_at: expires,
      })
      .eq("id", (row as { id: string }).id);
    return NextResponse.redirect(new URL("/admin/impostazioni?fic=connected", url));
  } catch (e) {
    return NextResponse.redirect(
      new URL(`/admin/impostazioni?fic=error&msg=${encodeURIComponent(String(e))}`, url)
    );
  }
}
