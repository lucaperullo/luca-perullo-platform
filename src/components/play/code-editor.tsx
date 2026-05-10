"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import type { EditorProps } from "@monaco-editor/react";
import { MobileCodeEditor } from "./mobile-code-editor";

/**
 * Wrapper Monaco editor — caricato dynamic per evitare SSR (Monaco
 * dipende da `window`).
 *
 * Configurazione mirata a un principiante:
 * - autoClosingBrackets/Quotes/Tags: sempre attivi (l'utente non deve
 *   ricordarsi di chiudere)
 * - format on paste: per HTML incollato
 * - suggestion + parameter hints visibili
 * - line numbers e indentation guides per orientamento visivo
 *
 * Su mobile (coarse pointer o viewport < lg) Monaco viene SOSTITUITO
 * dal MobileCodeEditor — Monaco non apre la tastiera iOS in modo
 * affidabile e con font 13.5px iOS auto-zoomma il viewport rompendo
 * il layout. La textarea nativa con font-size 16px risolve entrambe.
 */
const Editor = dynamic<EditorProps>(
    () => import("@monaco-editor/react").then((m) => m.default),
    {
        ssr: false,
        loading: () => (
            <div className="flex h-full items-center justify-center font-mono text-[11px] uppercase tracking-[0.12em] text-fg-soft">
                Carico l&apos;editor…
            </div>
        ),
    },
);

export type CodeEditorProps = {
    value: string;
    onChange: (value: string) => void;
    height?: string | number;
    language?: string;
};

/**
 * Hook che ritorna `true` quando il device è mobile-style: coarse pointer
 * (touch) OPPURE viewport < 1024px (lg breakpoint Tailwind).
 *
 * Reattivo: si aggiorna se l'utente ruota il device o ridimensiona la
 * finestra. Server-side ritorna `false` per evitare hydration mismatch
 * (iOS-specific behavior viene determinato lato client).
 */
function useIsMobile(): boolean {
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        if (typeof window === "undefined") return;
        const coarse = window.matchMedia("(pointer: coarse)");
        const narrow = window.matchMedia("(max-width: 1023px)");
        const update = () => setIsMobile(coarse.matches || narrow.matches);
        update();
        coarse.addEventListener("change", update);
        narrow.addEventListener("change", update);
        return () => {
            coarse.removeEventListener("change", update);
            narrow.removeEventListener("change", update);
        };
    }, []);
    return isMobile;
}

export function CodeEditor({
    value,
    onChange,
    height = "100%",
    language = "html",
}: CodeEditorProps) {
    const isMobile = useIsMobile();

    if (isMobile) {
        return (
            <MobileCodeEditor
                value={value}
                onChange={onChange}
                height={height}
            />
        );
    }

    return (
        <Editor
            height={height}
            defaultLanguage={language}
            language={language}
            value={value}
            onChange={(v: string | undefined) => onChange(v ?? "")}
            theme="vs-dark"
            options={{
                fontFamily: "var(--font-geist-mono), monospace",
                fontSize: 13.5,
                lineHeight: 1.65,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                wordWrap: "on",
                tabSize: 2,
                automaticLayout: true,
                padding: { top: 14, bottom: 14 },
                renderLineHighlight: "line",
                folding: true,
                lineNumbersMinChars: 3,
                bracketPairColorization: { enabled: true },
                guides: { indentation: true, bracketPairs: true },

                // Auto-close tutto quello che si può chiudere
                autoClosingBrackets: "always",
                autoClosingQuotes: "always",
                autoClosingOvertype: "always",
                autoClosingDelete: "always",
                autoSurround: "languageDefined",

                // Suggerimenti generosi (l'utente vede le opzioni mentre scrive)
                quickSuggestions: {
                    other: true,
                    comments: false,
                    strings: true,
                },
                suggestOnTriggerCharacters: true,
                acceptSuggestionOnEnter: "on",
                tabCompletion: "on",
                wordBasedSuggestions: "currentDocument",
                snippetSuggestions: "top",

                // Format & paste
                formatOnPaste: true,
                formatOnType: true,

                // Mouse comportamento più "office-like"
                mouseWheelZoom: false,
                smoothScrolling: true,
                cursorBlinking: "smooth",
                cursorSmoothCaretAnimation: "on",

                // Niente sticky scroll che ruba spazio
                stickyScroll: { enabled: false },

                // Hint visivo quando ci sono parentesi non bilanciate
                renderValidationDecorations: "on",
            }}
        />
    );
}
