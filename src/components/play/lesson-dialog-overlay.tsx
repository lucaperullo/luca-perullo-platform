/* eslint-disable react-hooks/set-state-in-effect --
   Componente con typewriter effect: setState dentro effect è il
   pattern corretto qui (pilotare un'animazione progressiva di
   stringa). Riscriverlo con useSyncExternalStore aggiungerebbe
   complessità senza valore. */
"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Dialog overlay stile video-game (Pokemon / Final Fantasy box) che
 * mostra il testo dello script durante la riproduzione TTS — ma solo
 * quando l'utente è SU UN ALTRO TAB rispetto a "Lezione" (cioè è su
 * Codice o Anteprima e perderebbe il contesto altrimenti).
 *
 * Triggers d'uso:
 *   - mobile only (hidden lg:hidden — desktop ha già il pannello aside)
 *   - mostrato quando isSpeaking + tab attivo != "lesson"
 *   - typewriter effect della frase corrente con ritmo da video-game
 *   - dismissable con X (l'utente può silenziare il box)
 *
 * Stile: piccolo riferimento al cookie banner ma più ridotto/in-line:
 *   - bordo doppio (outer + inner) per look retro
 *   - sfondo scuro semi-opaco con backdrop-blur
 *   - font-mono per il testo (mood pixel-art)
 *   - cursore lampeggiante alla fine del typewriter
 *   - transition smooth on mount/unmount
 */
export function LessonDialogOverlay({
    text,
    visible,
    speakerName = "LUCA",
}: {
    text: string;
    visible: boolean;
    speakerName?: string;
}) {
    const [typed, setTyped] = useState("");
    const [dismissed, setDismissed] = useState(false);
    const cancelRef = useRef<(() => void) | null>(null);

    // Reset dismissed quando cambia il testo (nuova lezione/parte)
    useEffect(() => {
        setDismissed(false);
    }, [text]);

    // Typewriter effect: digita una lettera ogni ~25ms (ritmo veloce
    // ma percepibile, come i dialog Pokemon). Si interrompe se
    // visible diventa false.
    useEffect(() => {
        cancelRef.current?.();

        if (!visible || dismissed) {
            setTyped("");
            return;
        }

        let cancelled = false;
        let i = 0;
        const tick = () => {
            if (cancelled) return;
            if (i >= text.length) return;
            i++;
            setTyped(text.slice(0, i));
            timer = window.setTimeout(tick, 25);
        };

        let timer = window.setTimeout(tick, 100); // small initial delay
        cancelRef.current = () => {
            cancelled = true;
            window.clearTimeout(timer);
        };
        return () => {
            cancelled = true;
            window.clearTimeout(timer);
        };
    }, [text, visible, dismissed]);

    if (!visible || dismissed) return null;

    const isFullyTyped = typed.length >= text.length;

    return (
        <div
            role="status"
            aria-live="polite"
            className={cn(
                "fixed inset-x-3 bottom-3 z-40 lg:hidden",
                "animate-[lp-dialog-up_220ms_var(--ease-out,ease-out)]",
            )}
        >
            {/* Box outer — bordo doppio per look retro pixel-art */}
            <div className="relative rounded-md border-2 border-fg bg-bg shadow-[0_0_0_2px_var(--bg),0_8px_24px_rgba(0,0,0,0.25)]">
                <div className="rounded-[2px] border border-fg/20 px-4 py-3 sm:px-5 sm:py-4">
                    {/* Header riga: speaker name + close button */}
                    <div className="flex items-center justify-between gap-3">
                        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-fg-muted">
                            ▸ {speakerName}
                        </span>
                        <button
                            type="button"
                            onClick={() => setDismissed(true)}
                            aria-label="Chiudi dialog"
                            className="press grid h-6 w-6 place-items-center rounded text-fg-soft transition-colors hover:bg-bg-alt hover:text-fg"
                        >
                            <X className="h-3.5 w-3.5" aria-hidden />
                        </button>
                    </div>

                    {/* Testo typewriter */}
                    <p className="mt-2 text-[14px] leading-[1.5] text-fg">
                        {typed}
                        {/* Cursore lampeggiante alla fine, sparisce
                            quando il testo è completo */}
                        {!isFullyTyped ? (
                            <span
                                aria-hidden
                                className="ml-0.5 inline-block h-[1em] w-[2px] -translate-y-[2px] animate-[lp-dialog-blink_700ms_steps(2)_infinite] bg-fg align-middle"
                            />
                        ) : null}
                    </p>
                </div>

                {/* Animazioni inline: slide-up al mount + blink cursore.
                    Inline perché usate solo qui, niente da spostare in
                    globals.css. */}
                <style>{`
                    @keyframes lp-dialog-up {
                        from { transform: translateY(8px); opacity: 0; }
                        to   { transform: translateY(0);   opacity: 1; }
                    }
                    @keyframes lp-dialog-blink {
                        0%, 49%   { opacity: 1; }
                        50%, 100% { opacity: 0; }
                    }
                `}</style>
            </div>
        </div>
    );
}
