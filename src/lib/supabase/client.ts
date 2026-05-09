"use client";

import { createBrowserClient } from "@supabase/ssr";

/**
 * Supabase client per Client Components (browser).
 * Mai chiamato in Server Components — usa createServerClient da
 * @/lib/supabase/server invece.
 */
export function createBrowserSupabaseClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !anon) {
        throw new Error(
            "[supabase] NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY mancanti.",
        );
    }
    return createBrowserClient(url, anon);
}
