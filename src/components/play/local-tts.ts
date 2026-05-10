"use client";

/**
 * Local TTS — Piper TTS in browser via @mintplex-labs/piper-tts-web,
 * caricato a RUNTIME da CDN (esm.sh) per evitare problemi di bundling.
 *
 * Perché CDN runtime e non `npm install`:
 *   il pacchetto contiene un bundle Emscripten WASM che fa detection
 *   sincrona dell'env (Node vs Browser) con `require("fs")` dentro il
 *   ramo Node. Turbopack/webpack provano a risolvere fs staticamente
 *   anche se quel ramo non viene mai eseguito nel browser, e fallisce
 *   con "Module not found: fs". Caricarlo da esm.sh evita il bundling
 *   del codice — il codice arriva ESM-pulito al runtime e l'env
 *   detection funziona correttamente (browser → no Node branch).
 *
 * Il commento /* webpackIgnore: true *\/ + URL come variabile string
 * istruisce sia webpack che Turbopack a non toccare questo import:
 * resta letterale, eseguito solo nel browser quando l'utente clicca
 * "Modello AI locale".
 *
 * Ciclo:
 *   1. Prima volta: ensureLocalTtsReady scarica codice JS (~150 KB
 *      gzip da CDN) + modello ONNX italiano (~30 MB) + WASM runtime.
 *      Cache in OPFS (Origin Private File System) — automatica.
 *   2. Volte successive: cache hit, ready in <300ms.
 *   3. generateLocalAudio(text) → Blob WAV → HTMLAudioElement.
 *
 * Voce default: it_IT-paola-medium (femminile, qualità medium).
 * Real-time factor ~0.1-0.3 su CPU moderne, real-time su mobile
 * mid-range. Per script di 2 min: 6-30 secondi di generazione la
 * prima volta, poi cache.
 */

import type { VoiceId } from "@mintplex-labs/piper-tts-web";

const DEFAULT_VOICE: VoiceId = "it_IT-paola-medium";

// Pinned a major: piper-tts-web fa break solo su major bumps. esm.sh
// serve il bundle ESM browser-only del package, niente codice Node.
const CDN_URL = "https://esm.sh/@mintplex-labs/piper-tts-web@1";

// ONNX Runtime web — il bundle di piper-tts-web ne fa fetch ma usa
// path cdnjs broken. Lo pre-carichiamo da jsdelivr (working CDN) e
// configuriamo wasmPaths PRIMA che piper inizializzi, così quando
// piper crea la InferenceSession trova ORT già configurato.
const ORT_VERSION = "1.20.1";
const ORT_BASE = `https://cdn.jsdelivr.net/npm/onnxruntime-web@${ORT_VERSION}/dist/`;
const ORT_LOADER_URL = `${ORT_BASE}ort.min.mjs`;

// Tipo minimo per la configurazione globale di ORT.
type OrtModule = {
    env?: {
        wasm?: { wasmPaths?: string };
    };
};

// Tipi locali per il modulo caricato. Devono fare match con la
// dichiarazione in src/types/vits-web.d.ts ma il runtime non legge
// quel file — questi sono SOLO per cast TypeScript del risultato.
type PiperModule = {
    predict: (opts: { text: string; voiceId: VoiceId }) => Promise<Blob>;
    download: (
        voiceId: VoiceId,
        onProgress?: (progress: number) => void,
    ) => Promise<void>;
    stored: () => Promise<VoiceId[]>;
};

let cachedModule: PiperModule | null = null;
let modelReady = false;

/**
 * Carica @mintplex-labs/piper-tts-web da CDN (idempotente). Il
 * bundler non risolve questo import al build time grazie al commento
 * webpackIgnore + URL variabile.
 */
async function loadLib(): Promise<PiperModule> {
    if (cachedModule) return cachedModule;

    // 1) Pre-carica ONNX Runtime web da jsdelivr e setta wasmPaths.
    //    Se piper-tts-web bundla ORT internamente questa pre-load può
    //    essere ignorata — in quel caso fallback al fallback (la voce
    //    di sistema). Best-effort, non blocchiamo se fallisce.
    try {
        const ort = (await import(
            /* webpackIgnore: true */ ORT_LOADER_URL
        )) as OrtModule;
        if (ort?.env?.wasm) {
            ort.env.wasm.wasmPaths = ORT_BASE;
        }
    } catch {
        // ORT pre-load fallita: piper potrebbe comunque funzionare
        // se bundla la sua copia di ORT con path corretto. Si prova.
    }

    // 2) Carica piper-tts-web da esm.sh.
    const mod = (await import(/* webpackIgnore: true */ CDN_URL)) as PiperModule;
    cachedModule = mod;
    return mod;
}

/**
 * Carica libreria + scarica modello voce italiano. Idempotente: se
 * già pronto in memoria, ritorna subito.
 */
export async function ensureLocalTtsReady(
    onProgress: (percent: number, label: string) => void = () => {},
): Promise<void> {
    if (modelReady) {
        onProgress(100, "Pronto");
        return;
    }

    onProgress(0, "Carico libreria…");
    const mod = await loadLib();

    onProgress(10, "Scarico modello voce italiano…");
    await mod.download(DEFAULT_VOICE, (p) => {
        const overall = 10 + p * 90;
        onProgress(overall, `Download voce: ${Math.round(p * 100)}%`);
    });

    modelReady = true;
    onProgress(100, "Pronto");
}

/**
 * Genera audio WAV per il testo + ritorna HTMLAudioElement pronto
 * per .play(). Throws se ensureLocalTtsReady non è stato completato.
 */
export async function generateLocalAudio(text: string): Promise<HTMLAudioElement> {
    if (!modelReady || !cachedModule) {
        throw new Error("Local TTS non pronto. Chiama ensureLocalTtsReady prima.");
    }
    const wavBlob = await cachedModule.predict({
        text,
        voiceId: DEFAULT_VOICE,
    });
    const url = URL.createObjectURL(wavBlob);
    const audio = new Audio(url);
    audio.addEventListener("ended", () => URL.revokeObjectURL(url), {
        once: true,
    });
    audio.addEventListener("error", () => URL.revokeObjectURL(url), {
        once: true,
    });
    return audio;
}

/** Check sincrono: modello caricato in memoria di questa sessione? */
export function isLocalTtsReady(): boolean {
    return modelReady;
}

/**
 * Check asincrono: modello presente nella cache locale (OPFS)?
 * Utile per saltare la UI di download al ritorno dell'utente.
 */
export async function isLocalTtsCached(): Promise<boolean> {
    try {
        const mod = await loadLib();
        const stored = await mod.stored();
        return stored.includes(DEFAULT_VOICE);
    } catch {
        return false;
    }
}
