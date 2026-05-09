"use client";

/**
 * TTS player: prova a riprodurre un file MP3 pre-renderizzato (OpenAI),
 * altrimenti usa speechSynthesis del browser come fallback.
 */

export type TTSHandle = {
    play: () => Promise<void>;
    stop: () => void;
};

/**
 * Tenta di riprodurre l'audio in audioPath. Se il fetch fallisce (404),
 * fa fallback su speechSynthesis con il testo `script`.
 */
export async function playTts(opts: {
    audioPath?: string;
    script: string;
    onStart?: () => void;
    onEnd?: () => void;
}): Promise<TTSHandle> {
    const { audioPath, script, onStart, onEnd } = opts;

    let audioEl: HTMLAudioElement | null = null;
    let utterance: SpeechSynthesisUtterance | null = null;
    let active = true;

    const stop = () => {
        active = false;
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
        // Tentativo audio file
        if (audioPath) {
            try {
                const head = await fetch(audioPath, { method: "HEAD" });
                if (head.ok && active) {
                    audioEl = new Audio(audioPath);
                    audioEl.addEventListener("play", () => onStart?.());
                    audioEl.addEventListener("ended", () => onEnd?.());
                    audioEl.addEventListener("error", () => {
                        // fallback a speechSynthesis
                        speakWithBrowser();
                    });
                    await audioEl.play();
                    return;
                }
            } catch {
                // continua con fallback
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
