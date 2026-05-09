"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type CalEmbedProps = {
    /** Cal.com username (es. "lucaperullo"). */
    username: string;
    /** Slug dell'event type (es. "15min"). */
    eventSlug: string;
    /** Altezza dell'iframe in px. Default 720. */
    height?: number;
    className?: string;
    /** Layout calendario Cal: "month_view" o "column_view". */
    layout?: "month_view" | "column_view";
};

/**
 * Inline embed di Cal.com tramite iframe semplice.
 *
 * Scelta: iframe + querystring `embed=true` invece dello script ufficiale
 * `embed.js` perché:
 *   - zero dependency aggiuntiva
 *   - lazy loading nativo
 *   - SSR-safe
 *   - resize è gestito dall'iframe Cal in autonomia (postMessage interno)
 *
 * Si potrà swap-in `@calcom/embed-react` in futuro per ottenere
 * dimensionamento dinamico (auto-altezza) senza cambiare API.
 */
export function CalEmbed({
    username,
    eventSlug,
    height = 720,
    className,
    layout = "month_view",
}: CalEmbedProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);

    // Lazy mount: l'iframe parte solo quando il container entra in viewport.
    // Evita di caricare 200kb di JS Cal su pagine con embed che l'utente
    // potrebbe non vedere mai.
    useEffect(() => {
        if (!ref.current) return;
        const io = new IntersectionObserver(
            (entries) => {
                for (const e of entries) {
                    if (e.isIntersecting) {
                        setVisible(true);
                        io.disconnect();
                    }
                }
            },
            { rootMargin: "200px 0px" },
        );
        io.observe(ref.current);
        return () => io.disconnect();
    }, []);

    const src = `https://cal.com/${username}/${eventSlug}?embed=true&theme=auto&layout=${layout}`;

    return (
        <div
            ref={ref}
            className={cn(
                "overflow-hidden rounded-md border border-border bg-bg-alt",
                className,
            )}
            style={{ height }}
        >
            {visible ? (
                <iframe
                    src={src}
                    title={`Prenota ${eventSlug} con ${username}`}
                    loading="lazy"
                    style={{
                        width: "100%",
                        height: "100%",
                        border: 0,
                        display: "block",
                    }}
                />
            ) : (
                <div className="flex h-full items-center justify-center font-mono text-[11px] uppercase tracking-[0.12em] text-fg-soft">
                    Caricamento calendario…
                </div>
            )}
        </div>
    );
}
