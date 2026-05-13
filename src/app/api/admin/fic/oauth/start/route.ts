import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";
import { buildAuthUrl } from "@/lib/admin/fic/oauth";
import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";

export const runtime = "nodejs";

export async function GET() {
  await requireAdmin();
  const state = randomBytes(16).toString("hex");
  const c = await cookies();
  c.set("fic_oauth_state", state, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 600,
    path: "/",
  });
  return NextResponse.redirect(buildAuthUrl(state));
}
