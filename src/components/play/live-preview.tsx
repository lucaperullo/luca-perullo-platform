"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

export type LivePreviewHandle = {
    /** Restituisce il document dell'iframe (per validation queries). */
    getDoc: () => Document | null;
};

export type LivePreviewProps = {
    /** Codice HTML completo da renderizzare (incluso head/style). */
    code: string;
    className?: string;
};

/**
 * Iframe sandbox che renderizza il codice utente live.
 *
 * Sicurezza: usiamo `sandbox` con i permessi minimi necessari (allow-scripts
 * per gestire interazioni hover/click ma niente top-navigation, popups,
 * forms). srcdoc rende il document same-origin → possiamo leggere
 * iframe.contentDocument dal parent per validation.
 *
 * Hash links (`<a href="#qualcosa">`) intercettati e gestiti via
 * scrollIntoView interno per evitare conflitti col routing del parent
 * Next.js (in srcdoc, il browser tratta about:srcdoc#qualcosa in modo
 * inconsistente tra browser e talvolta naviga il parent).
 */
export const LivePreview = forwardRef<LivePreviewHandle, LivePreviewProps>(
    function LivePreview({ code, className }, ref) {
        const iframeRef = useRef<HTMLIFrameElement>(null);

        useImperativeHandle(
            ref,
            () => ({
                getDoc: () => iframeRef.current?.contentDocument ?? null,
            }),
            [],
        );

        // Intercetta i click su hash links per fare scrollIntoView
        // programmatico invece di lasciare al browser la navigazione hash
        // (che in iframe srcdoc è inconsistente).
        useEffect(() => {
            const iframe = iframeRef.current;
            if (!iframe) return;

            const onClick = (e: Event) => {
                const target = e.target as Element | null;
                if (!target) return;
                const link = (target as HTMLElement).closest?.("a") as
                    | HTMLAnchorElement
                    | null;
                if (!link) return;
                const href = link.getAttribute("href");
                if (!href) return;

                // Hash link interno: fai scrollIntoView programmatico
                if (href.startsWith("#") && href.length > 1) {
                    e.preventDefault();
                    const doc = iframe.contentDocument;
                    if (!doc) return;
                    const id = href.slice(1);
                    const dest = doc.getElementById(id);
                    if (dest) {
                        // Cerchiamo lo scroll-behavior dichiarato dall'html
                        // dell'utente; se è smooth, usiamo "smooth", sennò "auto".
                        const html = doc.documentElement;
                        const smooth =
                            doc.defaultView?.getComputedStyle(html)
                                .scrollBehavior === "smooth";
                        dest.scrollIntoView({
                            behavior: smooth ? "smooth" : "auto",
                            block: "start",
                        });
                    }
                    return;
                }

                // Link esterni o assoluti: blocca la navigazione,
                // l'iframe sandbox non deve cambiare srcdoc.
                if (href !== "#") {
                    e.preventDefault();
                }
            };

            const attach = () => {
                const doc = iframe.contentDocument;
                if (!doc) return;
                doc.addEventListener("click", onClick, true);
            };

            // Allega al load (e re-allega quando srcdoc cambia → load si rifà).
            iframe.addEventListener("load", attach);
            // Alcuni browser non rilanciano "load" su srcdoc update;
            // proviamo un attach immediato se il document è già pronto.
            if (iframe.contentDocument?.readyState === "complete") {
                attach();
            }

            return () => {
                iframe.removeEventListener("load", attach);
                const doc = iframe.contentDocument;
                if (doc) doc.removeEventListener("click", onClick, true);
            };
        }, [code]);

        return (
            <iframe
                ref={iframeRef}
                srcDoc={code}
                title="Anteprima live"
                sandbox="allow-scripts allow-same-origin"
                className={className}
                style={{
                    width: "100%",
                    height: "100%",
                    border: 0,
                    backgroundColor: "white",
                }}
            />
        );
    },
);
