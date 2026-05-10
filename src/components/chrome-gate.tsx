"use client";

import { usePathname } from "next/navigation";

/**
 * Gate per il chrome globale (SiteHeader, SiteFooter) sulle route che
 * vogliono prendersi tutta la viewport.
 *
 * Solo il LESSON RUNNER è full-viewport — il path è
 * `/play/<courseSlug>/<lessonOrder>` (3+ segmenti dopo la radice). Lì
 * la navbar globale crea doppio chrome con la top bar della lezione
 * (Indice / breadcrumb / progress / Salva).
 *
 * Le altre pagine /play tengono il chrome:
 *   /play                        → catalogo corsi
 *   /play/animazioni-avanzate    → landing del corso (intro + outline)
 *
 * Pattern: server-component children passati attraverso un client wrapper
 * che li monta o li scarta in base al pathname. Compatibile con Next.js
 * App Router.
 */
export function ChromeGate({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    if (isLessonRunner(pathname)) return null;
    return <>{children}</>;
}

/**
 * True se il path è una lezione interattiva: /play/<corso>/<lezione>.
 * Splittando "/play/animazioni-avanzate/1" → ["", "play", "animazioni-avanzate", "1"]
 * → length 4 → true.
 * Splittando "/play/animazioni-avanzate" → length 3 → false.
 */
function isLessonRunner(pathname: string | null): boolean {
    if (!pathname) return false;
    const parts = pathname.split("/").filter(Boolean);
    return parts[0] === "play" && parts.length >= 3;
}
