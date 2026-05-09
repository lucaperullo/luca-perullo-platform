/**
 * GET /auth/callback?code=...&next=/play
 *
 * Endpoint a cui atterra l'utente dopo aver cliccato il magic link
 * dall'email. Scambia il code con una sessione e redirige.
 *
 * Se l'utente non ha mai completato l'onboarding, lo manda a /benvenuto
 * con next preservato.
 */
import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function GET(req: Request) {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    const nextRaw = url.searchParams.get("next") ?? "/play";
    const safeNext =
        nextRaw.startsWith("/") && !nextRaw.startsWith("//")
            ? nextRaw
            : "/play";

    if (!code) {
        return NextResponse.redirect(
            new URL("/accedi?err=missing-code", url),
        );
    }

    const supabase = await createServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
        const msg = error instanceof Error ? error.message : "auth-error";
        return NextResponse.redirect(
            new URL(`/accedi?err=${encodeURIComponent(msg)}`, url),
        );
    }

    // Verifica onboarding completato
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (user) {
        const { data: profile } = await supabase
            .from("profiles")
            .select("onboarding_completed_at")
            .eq("id", user.id)
            .maybeSingle();
        if (!profile?.onboarding_completed_at) {
            return NextResponse.redirect(
                new URL(
                    `/benvenuto?next=${encodeURIComponent(safeNext)}`,
                    url,
                ),
            );
        }
    }

    return NextResponse.redirect(new URL(safeNext, url));
}
