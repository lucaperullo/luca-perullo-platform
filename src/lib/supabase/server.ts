/**
 * Supabase server client — usato in Server Components, Route Handlers,
 * Server Actions. Usa @supabase/ssr che gestisce i cookies.
 */
import "server-only";
import { cookies } from "next/headers";
import {
    createServerClient as createSSRClient,
    type CookieOptions,
} from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY;

function assertEnv(): { url: string; anon: string } {
    if (!URL || !ANON) {
        throw new Error(
            "[supabase] NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY mancanti.",
        );
    }
    return { url: URL, anon: ANON };
}

/** Client con sessione utente (RLS attive). */
export async function createServerClient() {
    const { url, anon } = assertEnv();
    const cookieStore = await cookies();

    return createSSRClient(url, anon, {
        cookies: {
            getAll() {
                return cookieStore.getAll();
            },
            setAll(
                cookiesToSet: {
                    name: string;
                    value: string;
                    options: CookieOptions;
                }[],
            ) {
                try {
                    cookiesToSet.forEach(({ name, value, options }) => {
                        cookieStore.set(name, value, options);
                    });
                } catch {
                    // Server components durante render non possono settare
                    // cookies — il proxy.ts si occupa del refresh.
                }
            },
        },
    });
}

/**
 * Service role client (bypass RLS). Solo per webhook / job privilegiati.
 * Mai esposto al browser.
 */
export function createServiceRoleClient() {
    if (!URL || !SERVICE_ROLE) {
        throw new Error(
            "[supabase] SUPABASE_SERVICE_ROLE_KEY mancante.",
        );
    }
    return createClient(URL, SERVICE_ROLE, {
        auth: { persistSession: false, autoRefreshToken: false },
    });
}
