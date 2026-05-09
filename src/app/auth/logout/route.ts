import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
    const supabase = await createServerClient();
    await supabase.auth.signOut();
    return NextResponse.redirect(new URL("/", req.url), { status: 303 });
}
