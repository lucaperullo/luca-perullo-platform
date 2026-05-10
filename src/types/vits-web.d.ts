/**
 * Stub di tipi per @mintplex-labs/piper-tts-web (Piper TTS in browser).
 *
 * @mintplex-labs/piper-tts-web è un fork attivamente mantenuto di
 * @diffusion-studio/vits-web. Identica API public, manutenzione viva.
 *
 * Esiste per il typecheck prima che `npm install` venga eseguito sul
 * Mac di Luca. Quando il pacchetto è installato davvero, i suoi tipi
 * reali (se ci sono) sostituiscono questo via TypeScript module
 * resolution.
 *
 * Riferimenti API:
 *   https://github.com/Mintplex-Labs/piper-tts-web
 *   https://www.npmjs.com/package/@mintplex-labs/piper-tts-web
 */
declare module "@mintplex-labs/piper-tts-web" {
    export type VoiceId = string;

    export type VoiceMeta = {
        key: VoiceId;
        name: string;
        language: { name_english: string; code: string };
        quality: "x_low" | "low" | "medium" | "high";
        files: Record<string, { size_bytes: number }>;
    };

    /**
     * Genera audio WAV per il testo + voiceId. La prima call con un
     * voiceId nuovo scarica il modello ONNX (~30-75 MB per IT) e lo
     * memorizza in Origin Private File System; le call successive
     * sono sincrone-ish.
     */
    export function predict(opts: {
        text: string;
        voiceId: VoiceId;
    }): Promise<Blob>;

    /**
     * Scarica esplicitamente il modello senza generare audio. Usato
     * per pre-cache in background con UI di progresso.
     */
    export function download(
        voiceId: VoiceId,
        onProgress?: (progress: number) => void,
    ): Promise<void>;

    /** Elenco voci disponibili dal manifest Piper. */
    export function voices(): Promise<VoiceMeta[]>;

    /** Voci già scaricate e presenti in cache locale. */
    export function stored(): Promise<VoiceId[]>;

    /** Rimuove un modello dalla cache locale. */
    export function remove(voiceId: VoiceId): Promise<void>;

    /** Default export con tutte le funzioni (per `import tts from`). */
    const tts: {
        predict: typeof predict;
        download: typeof download;
        voices: typeof voices;
        stored: typeof stored;
        remove: typeof remove;
    };
    export default tts;
}
