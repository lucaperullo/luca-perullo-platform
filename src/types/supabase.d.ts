/**
 * Stub di tipi per @supabase/ssr e @supabase/supabase-js.
 *
 * Esiste solo per far passare il typecheck prima che `npm install` venga
 * lanciato sul Mac di Luca (mount FUSE non permette install via Claude).
 *
 * Quando i pacchetti saranno davvero installati, i loro tipi reali
 * (più completi) sostituiranno questi tramite TypeScript module
 * resolution.
 */

declare module "@supabase/ssr" {
    export type CookieOptions = {
        domain?: string;
        path?: string;
        maxAge?: number;
        expires?: Date;
        httpOnly?: boolean;
        secure?: boolean;
        sameSite?: "lax" | "strict" | "none" | boolean;
    };

    type Cookie = { name: string; value: string };
    type CookieToSet = { name: string; value: string; options: CookieOptions };

    interface CookieMethods {
        getAll(): Cookie[] | Promise<Cookie[]>;
        setAll(cookiesToSet: CookieToSet[]): void | Promise<void>;
    }

    export function createServerClient(
        url: string,
        anonKey: string,
        options: { cookies: CookieMethods },
    ): import("@supabase/supabase-js").SupabaseClient;

    export function createBrowserClient(
        url: string,
        anonKey: string,
    ): import("@supabase/supabase-js").SupabaseClient;
}

declare module "@supabase/supabase-js" {
    export type SupabaseClient = {
        auth: {
            getUser(): Promise<{
                data: { user: { id: string; email?: string } | null };
                error: unknown;
            }>;
            getSession(): Promise<{
                data: {
                    session: {
                        access_token: string;
                        user: {
                            id: string;
                            email?: string;
                            user_metadata?: {
                                full_name?: string | null;
                            } | null;
                        };
                    } | null;
                };
                error: unknown;
            }>;
            signInWithOtp(opts: {
                email: string;
                options?: { emailRedirectTo?: string };
            }): Promise<{ error: unknown | null }>;
            exchangeCodeForSession(
                code: string,
            ): Promise<{ error: unknown | null }>;
            signOut(): Promise<{ error: unknown | null }>;
            onAuthStateChange(
                cb: (event: string, session: unknown) => void,
            ): { data: { subscription: { unsubscribe(): void } } };
        };
        from(table: string): SupabaseQueryBuilder;
        storage: {
            from(bucket: string): {
                createSignedUrl(
                    path: string,
                    expiresIn: number,
                ): Promise<{ data: { signedUrl: string } | null; error: unknown }>;
            };
        };
    };

    type SupabaseQueryBuilder = {
        select(columns?: string, opts?: { count?: string; head?: boolean }): SupabaseQueryBuilder;
        insert(values: unknown): SupabaseQueryBuilder;
        update(values: unknown): SupabaseQueryBuilder;
        upsert(
            values: unknown,
            opts?: { onConflict?: string; ignoreDuplicates?: boolean },
        ): SupabaseQueryBuilder;
        delete(): SupabaseQueryBuilder;
        eq(column: string, value: unknown): SupabaseQueryBuilder;
        order(
            column: string,
            opts?: { ascending?: boolean; nullsFirst?: boolean },
        ): SupabaseQueryBuilder;
        maybeSingle(): Promise<{
            data: Record<string, unknown> | null;
            error: unknown;
        }>;
        single(): Promise<{
            data: Record<string, unknown> | null;
            error: unknown;
        }>;
        // Permette `await query` come Promise normale
        then<TResult1 = unknown, TResult2 = never>(
            onfulfilled?:
                | ((value: {
                      data: unknown;
                      error: unknown;
                      count?: number;
                  }) => TResult1 | Promise<TResult1>)
                | null,
            onrejected?:
                | ((reason: unknown) => TResult2 | Promise<TResult2>)
                | null,
        ): Promise<TResult1 | TResult2>;
    };

    export function createClient(
        url: string,
        key: string,
        options?: {
            auth?: { persistSession?: boolean; autoRefreshToken?: boolean };
        },
    ): SupabaseClient;
}
