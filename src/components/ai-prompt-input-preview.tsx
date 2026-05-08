"use client";

import { AiPromptInput } from "./ai-prompt-input";

/** Catalog-only preview — owns the onSubmit closure on the client. */
export function AiPromptInputPreview() {
    return (
        <AiPromptInput
            placeholder="Chiedimi qualcosa…"
            slashCommands={[
                { id: "summarize", label: "/summarize", insert: "/summarize", hint: "Riassumi un testo" },
                { id: "translate", label: "/translate", insert: "/translate", hint: "Traduci in EN/IT" },
                { id: "code", label: "/code", insert: "/code", hint: "Genera snippet" },
            ]}
            onSubmit={() => {}}
        />
    );
}
