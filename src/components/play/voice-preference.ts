"use client";

/**
 * Preferenza voce dello studente per il playback delle lezioni.
 *
 *   "luca"   → cerca prima il file MP3 pre-renderizzato con la voce
 *              clonata di Luca; fallback su speechSynthesis se 404 o
 *              il file non esiste ancora.
 *   "local"  → modello AI italiano (Piper via vits-web) eseguito
 *              interamente nel browser. Scaricato una volta (~30-75 MB),
 *              poi offline. Genera audio in tempo reale per qualunque
 *              testo, senza chiamate di rete dopo il download.
 *   "system" → salta direttamente speechSynthesis (voce italiana del
 *              sistema operativo). Nessuna chiamata di rete extra.
 *   "mute"   → niente audio. L'avatar resta fermo, l'utente legge
 *              il testo della lezione.
 *   null     → ancora non chiesto: il modale di scelta apparirà al
 *              prossimo paint.
 */
export type VoicePreference = "luca" | "local" | "system" | "mute";

const KEY = "lp-play-voice-preference";
const EVENT = "lp-play-voice-preference-update";

export function readVoicePreference(): VoicePreference | null {
    if (typeof window === "undefined") return null;
    try {
        const v = window.localStorage.getItem(KEY);
        if (
            v === "luca" ||
            v === "local" ||
            v === "system" ||
            v === "mute"
        )
            return v;
    } catch {
        // localStorage può fallire in private mode / webview blindati.
    }
    return null;
}

export function writeVoicePreference(pref: VoicePreference): void {
    if (typeof window === "undefined") return;
    try {
        window.localStorage.setItem(KEY, pref);
        window.dispatchEvent(new Event(EVENT));
    } catch {
        /* ignore */
    }
}

/**
 * Subscribe per useSyncExternalStore. Si triggera sia su storage event
 * cross-tab sia sull'evento custom dispatched da writeVoicePreference.
 */
export function subscribeVoicePreference(cb: () => void): () => void {
    if (typeof window === "undefined") return () => {};
    window.addEventListener("storage", cb);
    window.addEventListener(EVENT, cb);
    return () => {
        window.removeEventListener("storage", cb);
        window.removeEventListener(EVENT, cb);
    };
}
