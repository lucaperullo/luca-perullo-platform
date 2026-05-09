"use client";

import { useState, useTransition } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type BuyButtonProps = {
    slug: string;
    /** Etichetta del bottone. Default: "Acquista ora". */
    label?: string;
    className?: string;
    /** Variante visiva. */
    variant?: "primary" | "secondary";
    /** Se passato, sostituisce la chiamata a /api/checkout (es. Calendly). */
    bookHref?: string;
};

/**
 * Bottone "Acquista ora" → POST /api/checkout → redirect a Stripe.
 *
 * Per i servizi `bookOnly` (es. call gratuita) passa `bookHref` e il
 * componente fa un semplice redirect a Calendly/Cal.com invece di
 * chiamare Stripe.
 *
 * Stato di errore renderizzato inline sotto al bottone — non usa toast
 * per restare coerente con il register sobrio del sito.
 */
export function BuyButton({
    slug,
    label = "Acquista ora",
    className,
    variant = "primary",
    bookHref,
}: BuyButtonProps) {
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    const handleClick = () => {
        if (bookHref) {
            window.location.href = bookHref;
            return;
        }
        setError(null);
        startTransition(async () => {
            try {
                const res = await fetch("/api/checkout", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ slug }),
                });
                const data = await res.json();
                if (!res.ok) {
                    setError(
                        data?.message ??
                            "Checkout non disponibile. Riprova o scrivimi.",
                    );
                    return;
                }
                if (data.url) {
                    window.location.href = data.url;
                } else {
                    setError("Risposta inattesa dal server.");
                }
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : "Errore di rete. Riprova.",
                );
            }
        });
    };

    const base =
        "press inline-flex items-center justify-center gap-2 rounded-md border px-4 py-2.5 font-mono text-[12px] uppercase tracking-[0.08em] transition-colors disabled:cursor-not-allowed disabled:opacity-60";
    const variantClass =
        variant === "primary"
            ? "border-fg bg-fg text-bg hover:bg-fg/90"
            : "border-border-strong bg-bg text-fg hover:bg-bg-alt";

    return (
        <div className={cn("flex flex-col gap-1.5", className)}>
            <button
                type="button"
                onClick={handleClick}
                disabled={isPending}
                className={cn(base, variantClass)}
            >
                {isPending ? (
                    <>
                        <Loader2
                            className="h-3.5 w-3.5 animate-spin"
                            aria-hidden
                        />
                        Caricamento…
                    </>
                ) : (
                    <>
                        {label}
                        <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                    </>
                )}
            </button>
            {error ? (
                <p className="text-[12px] text-fg-muted">
                    {error}{" "}
                    <a
                        href="mailto:lucaperullo@outlook.it"
                        className="underline decoration-fg-soft underline-offset-2 hover:decoration-fg"
                    >
                        Scrivimi
                    </a>
                    .
                </p>
            ) : null}
        </div>
    );
}
