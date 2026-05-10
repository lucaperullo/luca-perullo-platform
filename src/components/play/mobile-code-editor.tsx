"use client";

import { useEffect, useRef } from "react";

/**
 * Editor di codice mobile-first basato su <textarea> nativo.
 *
 * Perché non Monaco su mobile:
 *   1. Monaco usa una textarea hidden (1x1 px) per catturare gli eventi
 *      tastiera. iOS spesso NON apre il software keyboard su tap perché
 *      la textarea non è visibile/focusable in modo affidabile.
 *   2. Anche quando il keyboard si apre, iOS auto-zoomma su input con
 *      font-size < 16px. Monaco usa 13.5px → la pagina si zoomma e il
 *      layout esplode.
 *   3. Tutte le features di Monaco (autocomplete, format on paste,
 *      bracket pair colorization) sono inutili a uno studente che sta
 *      digitando su una tastiera virtuale dello smartphone.
 *
 * Cosa fa questa textarea:
 *   - font-size 16px ESATTI → niente auto-zoom iOS
 *   - tap sul textarea apre il keyboard nativo
 *   - tasto Tab inserisce 2 spazi (non sposta il focus fuori dall'editor)
 *   - autocapitalize/correct/complete spenti — non serve correzione
 *     grammaticale sul codice HTML
 *   - inputMode="text" → keyboard generico, non quello numerico/email
 *   - spellCheck off — niente sottolineature rosse sui tag HTML
 *
 * Niente line numbers, niente sintassi colorata: per il mobile è ok,
 * lo studente sta principalmente VEDENDO il preview, non scrivendo
 * grandi blocchi di codice. Quando deve digitare lo fa con poche
 * battute alla volta. Sul desktop torna Monaco completo.
 */
export type MobileCodeEditorProps = {
    value: string;
    onChange: (value: string) => void;
    height?: string | number;
};

export function MobileCodeEditor({
    value,
    onChange,
    height = "100%",
}: MobileCodeEditorProps) {
    const ref = useRef<HTMLTextAreaElement>(null);

    // Tab → 2 spazi. Senza questo handler, il tasto Tab di una tastiera
    // bluetooth sposterebbe il focus fuori dal textarea (inutile per
    // chi sta scrivendo HTML annidato).
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key !== "Tab") return;
            e.preventDefault();
            const start = el.selectionStart;
            const end = el.selectionEnd;
            const before = el.value.slice(0, start);
            const after = el.value.slice(end);
            const next = `${before}  ${after}`;
            onChange(next);
            // Risposiziona il cursore dopo i 2 spazi inseriti.
            requestAnimationFrame(() => {
                el.selectionStart = el.selectionEnd = start + 2;
            });
        };
        el.addEventListener("keydown", onKeyDown);
        return () => el.removeEventListener("keydown", onKeyDown);
    }, [onChange]);

    return (
        <textarea
            ref={ref}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            autoComplete="off"
            inputMode="text"
            // Non readonly, non disabled: il tap deve aprire il keyboard.
            className="block w-full resize-none border-0 bg-[#1e1e1e] p-4 font-mono text-[16px] leading-[1.55] text-zinc-100 outline-none placeholder:text-zinc-500"
            style={{
                // height come prop per matchare l'altezza del pannello
                // sul lesson runner. Default 100% prende tutto il flex
                // parent.
                height,
                // Niente WebkitTextSizeAdjust: lasciamo che iOS rispetti
                // il 16px. È esattamente quello che vogliamo.
                tabSize: 2,
            }}
            aria-label="Editor codice"
        />
    );
}
