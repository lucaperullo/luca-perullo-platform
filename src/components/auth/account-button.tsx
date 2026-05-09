"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CircleUserRound, Cloud, CloudOff, LogIn, LogOut } from "lucide-react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

type AuthState =
    | { status: "loading" }
    | { status: "anon" }
    | {
          status: "auth";
          email: string;
          name: string;
          avatarUrl: string | null;
      };

/**
 * Widget account nella top bar di /play.
 *
 * - Anonimo: bottone "Salva i progressi" + link a /accedi.
 * - Loggato: link composto con avatar icon + nome + indicatore Cloud,
 *   click → /profilo. Bottone logout separato a fianco.
 *
 * Si aggiorna su onAuthStateChange.
 */
export function AccountButton({
    nextOnLogin = "/play",
}: {
    nextOnLogin?: string;
}) {
    const [state, setState] = useState<AuthState>({ status: "loading" });

    useEffect(() => {
        const supabase = createBrowserSupabaseClient();
        let cancelled = false;

        const sync = async () => {
            const { data } = await supabase.auth.getUser();
            if (cancelled) return;
            if (data.user) {
                const { data: profileRow } = await supabase
                    .from("profiles")
                    .select("full_name, avatar_url")
                    .eq("id", data.user.id)
                    .maybeSingle();
                if (cancelled) return;
                const profile = profileRow as
                    | {
                          full_name?: string | null;
                          avatar_url?: string | null;
                      }
                    | null;
                setState({
                    status: "auth",
                    email: data.user.email ?? "",
                    name: profile?.full_name ?? null
                        ? (profile?.full_name as string)
                        : data.user.email?.split("@")[0] ?? "",
                    avatarUrl: profile?.avatar_url ?? null,
                });
            } else {
                setState({ status: "anon" });
            }
        };
        sync();

        const { data: sub } = supabase.auth.onAuthStateChange(() => sync());
        return () => {
            cancelled = true;
            sub.subscription.unsubscribe();
        };
    }, []);

    if (state.status === "loading") {
        return (
            <div className="flex h-10 items-center gap-2 rounded-md border border-border bg-bg-alt px-3 font-mono text-[10.5px] uppercase tracking-[0.1em] text-fg-soft">
                …
            </div>
        );
    }

    if (state.status === "anon") {
        return (
            <Link
                href={`/accedi?next=${encodeURIComponent(nextOnLogin)}`}
                className="press inline-flex items-center gap-2 rounded-md border border-fg bg-fg px-3 py-2 font-mono text-[10.5px] uppercase tracking-[0.08em] text-bg hover:bg-fg/90"
                title="Accedi per salvare i progressi sul cloud"
            >
                <CloudOff className="h-3.5 w-3.5" aria-hidden />
                <span className="hidden sm:inline">Salva i progressi</span>
                <span className="sm:hidden">
                    <LogIn className="h-3.5 w-3.5" aria-hidden />
                </span>
            </Link>
        );
    }

    // auth — il blocco principale è cliccabile e va a /profilo
    return (
        <div className="flex items-center gap-1">
            <Link
                href="/profilo"
                className="press flex items-center gap-2 rounded-md border border-border bg-bg-alt px-2 py-1.5 transition-colors hover:border-border-strong hover:bg-bg"
                title={`Profilo di ${state.name}`}
            >
                <span
                    className="relative grid h-7 w-7 shrink-0 place-items-center overflow-hidden rounded-full border border-border bg-bg text-fg-muted"
                    aria-hidden
                >
                    {state.avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={state.avatarUrl}
                            alt=""
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <CircleUserRound className="h-4 w-4" aria-hidden />
                    )}
                </span>
                <div className="flex min-w-0 flex-col">
                    <span className="max-w-[110px] truncate text-[12px] font-medium text-fg">
                        {state.name}
                    </span>
                    <span className="inline-flex items-center gap-1 font-mono text-[9.5px] uppercase tracking-[0.1em] text-fg-soft">
                        <Cloud className="h-2.5 w-2.5" aria-hidden />
                        Cloud
                    </span>
                </div>
            </Link>
            <form action="/auth/logout" method="post">
                <button
                    type="submit"
                    className="press grid h-8 w-8 place-items-center rounded-md border border-border bg-bg-alt text-fg-soft hover:border-border-strong hover:text-fg"
                    title="Esci"
                    aria-label="Esci"
                >
                    <LogOut className="h-3.5 w-3.5" aria-hidden />
                </button>
            </form>
        </div>
    );
}

// Alternativa: bottone "Accedi" singolo per la home/header generale
export function HeaderLoginButton() {
    return (
        <Link
            href="/accedi"
            className="press inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.08em] text-fg-muted hover:text-fg"
        >
            <LogIn className="h-3.5 w-3.5" aria-hidden />
            Accedi
        </Link>
    );
}
