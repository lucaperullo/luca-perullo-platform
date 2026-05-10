"use client";

/**
 * TTS player: routing della voce in base alla preferenza utente.
 *
 *   "luca"   → cerca prima il file MP3 pre-renderizzato; se 404 o
 *              non disponibile, fallback a speechSynthesis. Default
 *              quando preferenza null.
 *   "local"  → modello AI Piper italiano nel browser. Se non pronto
 *              ancora (modello non caricato in memoria), fa fallback
 *              su speechSynthesis per non bloccare l'utente.
 *   "system" → salta direttamente speechSynthesis (zero round-trip).
 *   "mute"   → non parla. Esegue subito onEnd così la UI prosegue.
 */

import { generateLocalAudio, isLocalTtsReady } from "./local-tts";
import { readVoicePreference } from "./voice-preference";

export type TTSHandle = {
    play: () => Promise<void>;
    stop: () => void;
};

/**
 * Cache di disponibilità degli MP3 pre-renderizzati. Una volta che
 * un audioPath ritorna 404, lo registriamo come "non esiste" e nelle
 * call successive saltiamo direttamente la HEAD request (niente più
 * 404 noise nei log del browser ad ogni cambio di lezione).
 *
 * In-memory only: si svuota a refresh, così se nel frattempo il file
 * viene aggiunto al server (es. dopo il task generate-play-tts) la
 * prossima sessione lo trova. Per cache cross-session servirebbe
 * sessionStorage, ma è eccessivo qui.
 */
const audioPathCache = new Map<string, boolean>();

/**
 * Tenta di riprodurre l'audio in audioPath. Se il fetch fallisce (404)
 * o l'utente ha scelto "system", fa fallback su speechSynthesis col
 * testo `script`. Se ha scelto "mute", non riproduce nulla.
 */
export async function playTts(opts: {
    audioPath?: string;
    script: string;
    onStart?: () => void;
    onEnd?: () => void;
}): Promise<TTSHandle> {
    const { audioPath, script, onStart, onEnd } = opts;
    const preference = readVoicePreference(); // null = default Luca

    let audioEl: HTMLAudioElement | null = null;
    let utterance: SpeechSynthesisUtterance | null = null;
    let active = true;
    // Flag per distinguere errori "veri" (404, codec rotto) da errori
    // "indotti dal cleanup" (audioEl.src = "" triggera un error event,
    // quel signal non significa che l'MP3 sia broken).
    let intentionallyStopped = false;

    const stop = () => {
        active = false;
        intentionallyStopped = true;
        if (audioEl) {
            audioEl.pause();
            audioEl.src = "";
            audioEl = null;
        }
        if (utterance && typeof window !== "undefined") {
            window.speechSynthesis.cancel();
            utterance = null;
        }
        onEnd?.();
    };

    const play = async () => {
        // Mute: niente audio, ma chiudiamo il ciclo coerentemente.
        if (preference === "mute") {
            onStart?.();
            // micro-delay per dare tempo al sync di altri stati visivi.
            setTimeout(() => onEnd?.(), 50);
            return;
        }

        // Local Piper: usa il modello in-browser se è già pronto in
        // memoria. Se non lo è (utente ha scelto "local" ma sta ancora
        // scaricando, o ha cambiato tab e il modulo non è inizializzato),
        // fallback al browser TTS — non blocchiamo la lezione.
        if (preference === "local") {
            if (!isLocalTtsReady()) {
                speakWithBrowser();
                return;
            }
            try {
                audioEl = await generateLocalAudio(script);
                if (!active) return;
                audioEl.addEventListener("play", () => onStart?.());
                audioEl.addEventListener("ended", () => onEnd?.());
                audioEl.addEventListener("error", () => {
                    if (intentionallyStopped) return;
                    speakWithBrowser();
                });
                await audioEl.play();
                return;
            } catch {
                speakWithBrowser();
                return;
            }
        }

        // System: salta direttamente al fallback browser, niente fetch
        // sul file MP3 (che probabilmente non esiste comunque).
        if (preference === "system") {
            speakWithBrowser();
            return;
        }

        // luca o null (default): tenta file pre-renderizzato.
        // POLICY: se l'MP3 NON esiste e preference è "luca", NON
        // facciamo fallback su speechSynthesis. L'utente ha scelto
        // la voce di Luca esplicitamente — meglio silenzio che voce
        // di sistema sgradevole. Solo preference="system" attiva
        // speechSynthesis.
        if (audioPath) {
            const cached = audioPathCache.get(audioPath);
            if (cached === false) {
                // MP3 confermato mancante → silenzio coerente.
                onStart?.();
                setTimeout(() => onEnd?.(), 50);
                return;
            }
            try {
                if (cached === undefined) {
                    const head = await fetch(audioPath, {
                        method: "HEAD",
                        cache: "no-cache",
                    });
                    audioPathCache.set(audioPath, head.ok);
                    if (!head.ok) {
                        // MP3 missing al primo check: silenzio
                        // (NON speechSynthesis fallback come prima).
                        onStart?.();
                        setTimeout(() => onEnd?.(), 50);
                        return;
                    }
                    if (!active) return;
                }
                if (!active) return;
                audioEl = new Audio(audioPath);
                audioEl.addEventListener("play", () => onStart?.());
                audioEl.addEventListener("ended", () => onEnd?.());
                audioEl.addEventListener("error", () => {
                    // CRITICO: se l'errore è stato indotto da stop()
                    // (utente naviga via, audioEl.src="" triggera
                    // error event), NON marcare il path come 404. Era
                    // un cleanup intenzionale, l'MP3 esiste ed è valido.
                    if (intentionallyStopped) return;
                    audioPathCache.set(audioPath, false);
                    // Niente speechSynthesis fallback: silenzio coerente.
                    onEnd?.();
                });
                try {
                    await audioEl.play();
                    return;
                } catch (err) {
                    // Browser autoplay policy: dopo refresh senza
                    // user gesture, play() rejecta con NotAllowedError.
                    // L'MP3 esiste ed è valido — il problema è solo
                    // che il browser non permette di farlo partire
                    // automaticamente.
                    //
                    // Strategia: NON corrompere la cache, attendi il
                    // primo gesture utente sulla pagina (click/key)
                    // e riparti l'audio. La prossima lezione (l'utente
                    // ha cliccato "Avanti" → gesture recente) parte
                    // senza problemi.
                    const isAutoplayBlock =
                        err instanceof DOMException &&
                        (err.name === "NotAllowedError" ||
                            err.name === "AbortError");
                    if (isAutoplayBlock) {
                        onEnd?.(); // avatar torna idle
                        const startOnGesture = () => {
                            document.removeEventListener("click", startOnGesture);
                            document.removeEventListener("keydown", startOnGesture);
                            if (active && audioEl && !intentionallyStopped) {
                                audioEl.play().catch(() => {
                                    /* still blocked, give up silently */
                                });
                            }
                        };
                        document.addEventListener("click", startOnGesture, {
                            once: true,
                        });
                        document.addEventListener("keydown", startOnGesture, {
                            once: true,
                        });
                        return;
                    }
                    // Errori veri (codec, decode fail) → registra 404.
                    if (!intentionallyStopped) {
                        audioPathCache.set(audioPath, false);
                    }
                }
            } catch {
                // Network/CORS error sul HEAD fetch precedente.
                if (!intentionallyStopped) {
                    audioPathCache.set(audioPath, false);
                }
            }
        }
        // Fallback browser TTS
        speakWithBrowser();
    };

    const speakWithBrowser = () => {
        if (typeof window === "undefined" || !active) return;
        if (!("speechSynthesis" in window)) {
            onEnd?.();
            return;
        }
        utterance = new SpeechSynthesisUtterance(script);
        utterance.lang = "it-IT";
        utterance.rate = 1.05;
        utterance.pitch = 1.0;
        utterance.onstart = () => onStart?.();
        utterance.onend = () => onEnd?.();
        utterance.onerror = () => onEnd?.();
        // Prova a selezionare una voce italiana se disponibile
        const voices = window.speechSynthesis.getVoices();
        const itVoice =
            voices.find((v) => v.lang === "it-IT") ??
            voices.find((v) => v.lang.startsWith("it"));
        if (itVoice) utterance.voice = itVoice;
        window.speechSynthesis.speak(utterance);
    };

    return { play, stop };
}
