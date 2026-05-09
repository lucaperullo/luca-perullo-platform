"use client";

import dynamic from "next/dynamic";
import type { EditorProps } from "@monaco-editor/react";

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

export function CodeEditor({
    value,
    onChange,
    height = "100%",
    language = "html",
}: CodeEditorProps) {
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
