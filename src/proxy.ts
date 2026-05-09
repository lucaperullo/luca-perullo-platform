/**
 * Proxy (ex-middleware) — refresh sessione Supabase su ogni request.
 *
 * Senza questo, le sessioni utente non vengono renewed automaticamente
 * sui server components, e l'utente sembra "loggato out" dopo qualche
 * ora di inattività.
 *
 * Vedi: https://supabase.com/docs/guides/auth/server-side/nextjs
 */
import { type NextRequest, NextResponse } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

export async function proxy(request: NextRequest) {
    let response = NextResponse.next({ request });

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // Se Supabase non è configurato, salta silenziosamente.
    if (!url || !anon) return response;

    const supabase = createServerClient(url, anon, {
        cookies: {
            getAll() {
                return request.cookies.getAll();
            },
            setAll(
                cookiesToSet: {
                    name: string;
                    value: string;
                    options: CookieOptions;
                }[],
            ) {
                cookiesToSet.forEach(({ name, value }) =>
                    request.cookies.set(name, value),
                );
                response = NextResponse.next({ request });
                cookiesToSet.forEach(({ name, value, options }) =>
                    response.cookies.set(name, value, options),
                );
            },
        },
    });

    // Trigger refresh: solo se c'è un cookie Supabase (utente loggato).
    await supabase.auth.getUser();

    return response;
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp4|woff2?)$).*)",
    ],
};
