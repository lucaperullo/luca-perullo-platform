"use client";

import { useState } from "react";
import { ArrowRight, Loader2, Mail } from "lucide-react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

export type LoginFormProps = {
    next?: string;
};

/**
 * Magic-link login: form email → invio email con link → atterraggio
 * su /auth/callback → scambio code → sessione.
 *
 * Niente password: registrazione+login unificati nello stesso flusso.
 */
export function LoginForm({ next = "/play" }: LoginFormProps) {
    const [email, setEmail] = useState("");
    const [state, setState] = useState<
        | { status: "idle" }
        | { status: "loading" }
        | { status: "sent" }
        | { status: "error"; message: string }
    >({ status: "idle" });

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        setState({ status: "loading" });
        try {
            const supabase = createBrowserSupabaseClient();
            // URL canonico per il magic link.
            // - Produzione: NEXT_PUBLIC_SITE_URL=https://lucaperullo.it
            //   (settato su Vercel). Importante che NON sia localhost,
            //   altrimenti l'utente apre la mail dal telefono e clicca
            //   un link a localhost che non risolve.
            // - Dev: fallback a window.location.origin (es. localhost:3000)
            //   così il flow è testabile in locale.
            // - Default extra: hardcoded lucaperullo.it se l'env non è
            //   settata in nessun posto, per non finire mai su un host
            //   sbagliato in produzione.
            const envBase = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(
                /\/$/,
                "",
            );
            const origin =
                envBase ||
                (typeof window !== "undefined"
                    ? window.location.origin
                    : "https://lucaperullo.it");
            const redirectTo = `${origin}/auth/callback?next=${encodeURIComponent(next)}`;
            const { error } = await supabase.auth.signInWithOtp({
                email,
                options: { emailRedirectTo: redirectTo },
            });
            if (error) throw error;
            setState({ status: "sent" });
        } catch (err) {
            setState({
                status: "error",
                message:
                    err instanceof Error ? err.message : "Errore. Riprova.",
            });
        }
    };

    if (state.status === "sent") {
        return (
            <div className="rounded-md border border-accent bg-accent/5 p-5 sm:p-6">
                <div className="flex items-start gap-3">
                    <Mail
                        className="mt-0.5 h-5 w-5 shrink-0 text-accent"
                        aria-hidden
                    />
                    <div>
                        <p className="text-[15px] font-medium text-fg">
                            Controlla la tua email
                        </p>
                        <p className="mt-1.5 text-[13.5px] leading-[1.6] text-fg-muted">
                            Ho mandato un link a{" "}
                            <span className="font-mono text-fg">{email}</span>.
                            Cliccalo per accedere — il link scade in 1 ora.
                            Controlla anche lo spam.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={onSubmit} className="flex flex-col gap-3">
            <label className="flex flex-col gap-1.5">
                <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-fg-soft">
                    Email
                </span>
                <input
                    type="email"
                    required
                    autoComplete="email"
                    inputMode="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@esempio.it"
                    className="w-full rounded-md border border-border bg-bg px-3 py-2.5 text-[15px] text-fg outline-none transition-colors focus:border-fg"
                    disabled={state.status === "loading"}
                />
            </label>
            <button
                type="submit"
                disabled={state.status === "loading" || !email}
                className="press inline-flex w-fit items-center gap-2 rounded-md border border-fg bg-fg px-4 py-2.5 font-mono text-[12px] uppercase tracking-[0.08em] text-bg hover:bg-fg/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
                {state.status === "loading" ? (
                    <>
                        <Loader2
                            className="h-3.5 w-3.5 animate-spin"
                            aria-hidden
                        />
                        Invio…
                    </>
                ) : (
                    <>
                        Mandami il link
                        <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                    </>
                )}
            </button>
            {state.status === "error" ? (
                <p className="text-[12px] text-fg-muted">{state.message}</p>
            ) : null}
        </form>
    );
}
