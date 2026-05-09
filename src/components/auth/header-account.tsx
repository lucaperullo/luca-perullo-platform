"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LogIn } from "lucide-react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

type AuthState =
    | { status: "loading" }
    | { status: "anon" }
    | { status: "auth"; name: string };

/**
 * Widget account per l'header globale. Compatto: 32×32.
 *
 * Anonimo  → link "Accedi" minimal con icona LogIn.
 * Loggato  → cerchio nero con iniziale bianca → click a /profilo.
 *           Stile Linear / Notion / Vercel: pulito, identifica l'utente,
 *           niente immagini da caricare, niente broken image.
 *
 * Note implementative:
 *   - Lo state si determina via `auth.getSession()` (cookie locali, zero
 *     rete, niente da bloccare per gli antitracker browser).
 *   - L'iniziale è ricavata dal display name (full_name dal profilo se
 *     presente, altrimenti dalla parte prima di @ dell'email).
 */
export function HeaderAccount() {
    const [state, setState] = useState<AuthState>({ status: "loading" });

    useEffect(() => {
        const supabase = createBrowserSupabaseClient();
        let cancelled = false;

        type SessionLike = {
            user?: {
                email?: string | null;
                user_metadata?: { full_name?: string | null } | null;
            } | null;
        } | null;

        const apply = (session: SessionLike) => {
            if (cancelled) return;
            if (!session?.user) {
                setState({ status: "anon" });
                return;
            }
            // user_metadata.full_name se settato durante onboarding;
            // fallback su prefisso email così abbiamo sempre qualcosa.
            const metadataName =
                session.user.user_metadata?.full_name?.trim() ?? "";
            const emailPrefix = session.user.email?.split("@")[0] ?? "";
            setState({
                status: "auth",
                name: metadataName || emailPrefix || "Profilo",
            });
        };

        supabase.auth
            .getSession()
            .then(({ data }) => apply(data.session as SessionLike))
            .catch(() => {
                if (!cancelled) setState({ status: "anon" });
            });

        const { data: sub } = supabase.auth.onAuthStateChange(
            (_evt, session) => apply(session as SessionLike),
        );
        return () => {
            cancelled = true;
            sub.subscription.unsubscribe();
        };
    }, []);

    if (state.status === "loading") {
        return (
            <span
                aria-hidden
                className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-border bg-bg-alt"
            />
        );
    }

    if (state.status === "anon") {
        return (
            <Link
                href="/accedi"
                className="press inline-flex h-8 shrink-0 items-center gap-1.5 rounded-md px-2 font-mono text-[11.5px] uppercase tracking-[0.06em] text-fg-muted hover:text-fg"
                title="Accedi"
            >
                <LogIn className="h-3.5 w-3.5" aria-hidden />
                <span className="hidden sm:inline">Accedi</span>
            </Link>
        );
    }

    const initial = getInitial(state.name);

    return (
        <Link
            href="/profilo"
            title={`Profilo di ${state.name}`}
            aria-label={`Vai al profilo di ${state.name}`}
            className="press relative z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-fg text-bg shadow-sm transition-all hover:scale-105 hover:opacity-90"
        >
            <span
                aria-hidden
                className="text-[12.5px] font-semibold leading-none tracking-tight"
            >
                {initial}
            </span>
        </Link>
    );
}

/**
 * Estrae l'iniziale da mostrare nell'avatar.
 *
 *   "Luca Perullo"            → "L"
 *   "luca.perullo@gmail.com"  → "L"  (chiamato col solo prefisso email)
 *   "marco rossi"             → "M"
 *   stringa vuota / strane    → "?"
 *
 * Niente bicolore o pattern: 1 lettera è quello che usano i product
 * professionali (Notion, Linear, Vercel) — più leggibile a 32×32.
 */
function getInitial(name: string): string {
    const cleaned = name.trim();
    if (!cleaned) return "?";
    const firstChar = cleaned.charAt(0);
    // Se non è alfanumerico (es. simbolo iniziale strano), fallback "?"
    if (!/[a-zA-Z0-9]/.test(firstChar)) return "?";
    return firstChar.toUpperCase();
}
