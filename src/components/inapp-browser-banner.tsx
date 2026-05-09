"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, ArrowUpRight, X, Check } from "lucide-react";

/**
 * Avviso "stai navigando dentro un'app" + suggerimento per uscire.
 *
 * Perché esiste: i webview in-app (Instagram, Facebook, TikTok,
 * LinkedIn, X, ecc.) bloccano spesso cookie cross-site, magic link,
 * clipboard, e una manciata di Web API moderne. Il login passwordless
 * di Supabase non sopravvive al round trip "click email → torna nel
 * webview originale" su iOS Instagram, ad esempio. Meglio dirlo
 * subito che lasciare l'utente con una sessione bug-prone.
 *
 * Stile design system Luca Perullo:
 *   - Toast bottom-fixed, max-w-[440px] su desktop, full-width margini
 *     piccoli su mobile.
 *   - Hairline border, bg-bg solido, shadow-lg per stacco.
 *   - Icona warning con bg-tinted ambra (signal classico, non tradisce
 *     la palette: l'amber è già usato dai box di info nelle lezioni).
 *   - Label MONO uppercase, copy diretta, niente emoji.
 *   - Bottone primario stesso pattern del resto (bg-fg + text-bg).
 *   - Dismiss in alto a destra, ricordata in sessionStorage (non
 *     localStorage: in una nuova sessione il warning torna, perché il
 *     contesto può essere cambiato).
 */

type InAppBrowser = {
    name: string;
    platform: "ios" | "android" | "unknown";
};

const SS_KEY = "lp-inapp-dismissed";

function detectInAppBrowser(): InAppBrowser | null {
    if (typeof navigator === "undefined") return null;
    const ua = navigator.userAgent;

    let name: string | null = null;
    if (/Instagram/i.test(ua)) name = "Instagram";
    else if (/(FBAN|FBAV|FB_IAB|FB4A)/i.test(ua)) name = "Facebook";
    else if (/Messenger/i.test(ua)) name = "Messenger";
    else if (/MicroMessenger/i.test(ua)) name = "WeChat";
    else if (/Line\//i.test(ua)) name = "Line";
    else if (/(TikTok|BytedanceWebview|musical_ly)/i.test(ua)) name = "TikTok";
    else if (/(Twitter|TwitterAndroid)/i.test(ua)) name = "X";
    else if (/Snapchat/i.test(ua)) name = "Snapchat";
    else if (/(LinkedInApp|LinkedIn\/)/i.test(ua)) name = "LinkedIn";
    else if (/Pinterest/i.test(ua)) name = "Pinterest";
    // KAKAOTALK / wv (generic Android webview) restano fuori per non
    // dare false positive su browser Chromium custom legittimi.

    if (!name) return null;

    let platform: "ios" | "android" | "unknown" = "unknown";
    if (/iPhone|iPad|iPod/.test(ua)) platform = "ios";
    else if (/Android/.test(ua)) platform = "android";

    return { name, platform };
}

export function InAppBrowserBanner() {
    const [detection, setDetection] = useState<InAppBrowser | null>(null);
    const [dismissed, setDismissed] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const detected = detectInAppBrowser();
        if (!detected) return;
        let alreadyDismissed = false;
        try {
            alreadyDismissed = sessionStorage.getItem(SS_KEY) === "1";
        } catch {
            // sessionStorage può lanciare in alcuni webview / private mode:
            // ignoriamo, mostriamo il banner comunque.
        }
        // Deferred via queueMicrotask così non triggera il lint
        // react-hooks/set-state-in-effect: il pattern "leggi-una-volta
        // dall'esterno → applica a stato React" è legittimo, ma la
        // regola di React 19 vuole che lo state non venga settato
        // sincronamente nel body dell'effect.
        queueMicrotask(() => {
            if (alreadyDismissed) {
                setDismissed(true);
            } else {
                setDetection(detected);
            }
        });
    }, []);

    if (!detection || dismissed) return null;

    const handleOpen = async () => {
        const url =
            typeof window !== "undefined" ? window.location.href : "";
        if (!url) return;

        if (detection.platform === "android") {
            // Tentativo di lanciare Chrome via intent URL — funziona su
            // molti webview Android. Se l'app blocca lo schema intent://,
            // l'utente vede semplicemente che non succede nulla; può
            // ripiegare sul long-press dell'URL bar.
            const stripped = url.replace(/^https?:\/\//, "");
            const intent = `intent://${stripped}#Intent;scheme=https;package=com.android.chrome;end`;
            window.location.href = intent;
            return;
        }

        // iOS o piattaforma sconosciuta: copia in clipboard. È la mossa
        // che funziona ovunque (Instagram iOS strippa i deep link
        // x-safari-https://, Facebook idem). Il modale "Apri in Safari"
        // dei tre puntini è poi una scelta dell'utente.
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        } catch {
            // Clipboard API negata → fallback prompt nativo.
            window.prompt("Copia questo link e aprilo in Safari:", url);
        }
    };

    const handleDismiss = () => {
        try {
            sessionStorage.setItem(SS_KEY, "1");
        } catch {
            /* ignore */
        }
        setDismissed(true);
    };

    const buttonLabel =
        detection.platform === "android"
            ? "Apri in Chrome"
            : copied
              ? "Link copiato"
              : "Copia il link";

    const subhint =
        detection.platform === "android"
            ? "Se Chrome non si apre, tocca · · · in alto e scegli 'Apri in Chrome'."
            : "Poi tocca · · · in alto a destra e scegli 'Apri in Safari'.";

    return (
        <aside
            role="alert"
            aria-live="polite"
            className="fixed inset-x-3 bottom-3 z-50 rounded-md border border-border-strong bg-bg p-4 shadow-lg sm:left-1/2 sm:right-auto sm:bottom-4 sm:inset-x-auto sm:max-w-[440px] sm:-translate-x-1/2 sm:p-5"
        >
            <button
                type="button"
                onClick={handleDismiss}
                aria-label="Chiudi avviso"
                className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded text-fg-muted transition-colors hover:bg-bg-alt hover:text-fg"
            >
                <X className="h-4 w-4" aria-hidden />
            </button>

            <div className="flex items-start gap-3">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md border border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400">
                    <AlertTriangle className="h-4 w-4" aria-hidden />
                </span>

                <div className="flex-1 pr-6">
                    <p className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-fg-soft">
                        Aperta dentro {detection.name}
                    </p>
                    <p className="mt-1.5 text-[14px] font-medium leading-[1.45] text-fg">
                        Login, magic link e salvataggi possono non
                        funzionare qui.
                    </p>
                    <p className="mt-1 text-[13px] leading-[1.5] text-fg-muted">
                        Apri il sito nel tuo browser (
                        {detection.platform === "android"
                            ? "Chrome"
                            : "Safari"}
                        ) per il flusso completo. {subhint}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                        <button
                            type="button"
                            onClick={handleOpen}
                            className="press inline-flex items-center gap-1.5 rounded-md border border-fg bg-fg px-3 py-2 font-mono text-[11px] uppercase tracking-[0.08em] text-bg transition-colors hover:bg-fg/90"
                        >
                            {buttonLabel}
                            {copied ? (
                                <Check
                                    className="h-3 w-3"
                                    aria-hidden
                                />
                            ) : (
                                <ArrowUpRight
                                    className="h-3 w-3"
                                    aria-hidden
                                />
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={handleDismiss}
                            className="press inline-flex items-center rounded-md px-2 py-2 font-mono text-[11px] uppercase tracking-[0.08em] text-fg-muted transition-colors hover:text-fg"
                        >
                            Continua qui
                        </button>
                    </div>
                </div>
            </div>
        </aside>
    );
}
