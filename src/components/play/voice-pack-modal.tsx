"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import {
    ArrowRight,
    Mic,
    Sparkles,
    Volume2,
    VolumeX,
    X,
} from "lucide-react";
import {
    readVoicePreference,
    subscribeVoicePreference,
    writeVoicePreference,
    type VoicePreference,
} from "./voice-preference";
import { cn } from "@/lib/utils";

const WELCOME_KEY = "lp-play-welcome-seen-v1";

/**
 * Modale "Quale voce vuoi sentire?" — appare la PRIMA volta che
 * l'utente apre una lezione, dopo aver chiuso il WelcomeModal.
 * Una volta scelta una voce, il modale non riappare più.
 *
 * 3 opzioni attive in questa iterazione:
 *   1. Voce di Luca — quando MP3 pre-renderizzati saranno deployed
 *      (task #37 pending). Nel frattempo fallback su speechSynthesis.
 *   2. Voce del sistema — speechSynthesis nativa, sempre disponibile.
 *   3. Senza voce — testo only.
 *
 * "Modello AI locale" (Piper TTS) è temporaneamente disabilitato —
 * il bundle esm.sh della libreria ha riferimenti rotti agli asset
 * ONNX su cdnjs, serve self-hosting in /public/lib (task a parte).
 * Il codice in local-tts.ts resta dormiente fino a quel momento.
 */
export function VoicePackModal() {
    const ready = useSyncExternalStore<boolean>(
        subscribeBoth,
        () => {
            if (typeof window === "undefined") return false;
            const welcomeSeen =
                window.localStorage.getItem(WELCOME_KEY) === "1";
            const voiceSet = readVoicePreference() !== null;
            return welcomeSeen && !voiceSet;
        },
        () => false,
    );

    const [open, setOpen] = useState(false);

    // Auto-open SOLO alla prima visita (welcome chiuso + preferenza
    // ancora null). Niente "auto-close" su !ready: la chiusura è
    // governata da setOpen(false) in choose() e nel bottone X.
    useEffect(() => {
        if (!ready) return;
        const t = setTimeout(() => setOpen(true), 500);
        return () => clearTimeout(t);
    }, [ready]);

    // Manual-open via gear settings: ascolta l'evento dispatched dal
    // bottone rotellina nella lesson aside. Apre il modale anche se
    // la preferenza è già settata, permettendo di cambiarla.
    useEffect(() => {
        const handler = () => setOpen(true);
        window.addEventListener("lp-play-voice-pack-open", handler);
        return () =>
            window.removeEventListener("lp-play-voice-pack-open", handler);
    }, []);

    if (!open) return null;

    const choose = (pref: VoicePreference) => {
        writeVoicePreference(pref);
        setOpen(false);
    };

    return (
        <div
            role="dialog"
            aria-modal
            aria-label="Scegli la voce per le lezioni"
            className="fixed inset-0 z-[60] grid place-items-center bg-fg/30 p-4 backdrop-blur-sm"
        >
            <div className="relative w-full max-w-[520px] rounded-md border border-border-strong bg-bg p-6 shadow-xl sm:p-7">
                {/* X chiusura: utile quando il modale è aperto via
                    rotellina settings (la preferenza è già settata) e
                    l'utente vuole tornare alla lezione senza cambiare. */}
                <button
                    type="button"
                    onClick={() => setOpen(false)}
                    aria-label="Chiudi impostazioni voce"
                    className="press absolute right-3 top-3 grid h-7 w-7 place-items-center rounded text-fg-muted transition-colors hover:bg-bg-alt hover:text-fg"
                >
                    <X className="h-4 w-4" aria-hidden />
                </button>

                <div className="flex items-start gap-3 pr-8">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-border bg-bg-alt text-fg-muted">
                        <Sparkles className="h-4 w-4" aria-hidden />
                    </span>
                    <div className="flex-1">
                        <p className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-fg-soft">
                            Una scelta veloce
                        </p>
                        <h2 className="mt-1 text-[20px] font-semibold leading-tight tracking-tight text-fg sm:text-[22px]">
                            Quale voce vuoi sentire?
                        </h2>
                        <p className="mt-2 text-[14px] leading-[1.55] text-fg-muted">
                            Le lezioni hanno una traccia parlata. Scegli
                            come ascoltarle — puoi cambiare dopo.
                        </p>
                    </div>
                </div>

                <div className="mt-5 flex flex-col gap-2">
                    <Choice
                        icon={Mic}
                        label="Voce di Luca"
                        sub="Voce neural italiana clonata, pronuncia naturale di codice e termini tech. Streamata on-demand, ~150 KB per lezione."
                        badge="Consigliata"
                        primary
                        onClick={() => choose("luca")}
                    />
                    <Choice
                        icon={Volume2}
                        label="Voce del sistema"
                        sub="Voce italiana del browser. Zero download, qualità varia per dispositivo (ottima su iOS/macOS)."
                        onClick={() => choose("system")}
                    />
                    <Choice
                        icon={VolumeX}
                        label="Senza voce"
                        sub="Solo testo, nessun audio. L'avatar resta in idle."
                        onClick={() => choose("mute")}
                    />
                </div>

                <p className="mt-5 font-mono text-[10.5px] uppercase tracking-[0.08em] text-fg-soft">
                    Cambia idea: bottone audio nel pannello lezione →
                </p>
            </div>
        </div>
    );
}

function Choice({
    icon: Icon,
    label,
    sub,
    badge,
    primary,
    onClick,
}: {
    icon: typeof Mic;
    label: string;
    sub: string;
    badge?: string;
    primary?: boolean;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                "press group flex w-full items-start gap-3 rounded-md border bg-bg-alt px-4 py-3.5 text-left transition-colors",
                primary
                    ? "border-fg hover:bg-bg"
                    : "border-border hover:border-border-strong hover:bg-bg",
            )}
        >
            <span
                className={cn(
                    "mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-md border",
                    primary
                        ? "border-fg bg-fg text-bg"
                        : "border-border bg-bg text-fg-muted",
                )}
            >
                <Icon className="h-4 w-4" aria-hidden />
            </span>
            <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="text-[15px] font-semibold tracking-tight text-fg">
                        {label}
                    </span>
                    {badge ? (
                        <span
                            className={cn(
                                "inline-flex items-center rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.08em]",
                                primary
                                    ? "border-fg/30 bg-fg/5 text-fg"
                                    : "border-accent/40 bg-accent/5 text-accent",
                            )}
                        >
                            {badge}
                        </span>
                    ) : null}
                </span>
                <span className="mt-1 block text-[12.5px] leading-[1.5] text-fg-muted">
                    {sub}
                </span>
            </span>
            <ArrowRight
                className={cn(
                    "mt-2 h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5",
                    primary ? "text-fg" : "text-fg-soft",
                )}
                aria-hidden
            />
        </button>
    );
}

function subscribeBoth(cb: () => void): () => void {
    if (typeof window === "undefined") return () => {};
    const onStorage = () => cb();
    window.addEventListener("storage", onStorage);
    window.addEventListener("lp-play-welcome-update", cb);
    const unsubVoice = subscribeVoicePreference(cb);
    return () => {
        window.removeEventListener("storage", onStorage);
        window.removeEventListener("lp-play-welcome-update", cb);
        unsubVoice();
    };
}
