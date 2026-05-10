"use client";

import { usePathname } from "next/navigation";

/**
 * Gate per il chrome globale (SiteHeader, SiteFooter) sulle route che
 * vogliono prendersi tutta la viewport. Le pagine /play sono full-viewport
 * — il lesson runner ha già una sua top bar (Indice / breadcrumb / progress
 * / Salva) e i pannelli code+preview riempiono lo schermo. Aggiungere
 * sopra il SiteHeader globale crea un doppio chrome inutile e rubava
 * verticale al codice.
 *
 * Pattern: server-component children passati attraverso un client wrapper
 * che li monta o li scarta in base al pathname. Compatibile con Next.js
 * App Router (i server components sono renderizzati lato server e poi
 * "passati" come props già stringificate al client wrapper).
 */
export function ChromeGate({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    if (pathname?.startsWith("/play")) return null;
    return <>{children}</>;
}
