"use client";

import { CommandPalette } from "./command-palette";

/**
 * Catalog-only preview wrapper for <CommandPalette/>. The handlers below run
 * client-side; this exists because the registry (data/components-library.tsx)
 * is a server module and can't pass function props directly to client components.
 */
export function CommandPalettePreview() {
    return (
        <CommandPalette
            showTrigger
            placeholder="Apri… (⌘K)"
            items={[
                { id: "home", label: "Home", group: "Pagine", hint: "/", onSelect: () => {} },
                { id: "components", label: "Components", group: "Pagine", hint: "/components", onSelect: () => {} },
                { id: "blog", label: "Blog", group: "Pagine", hint: "/blog", onSelect: () => {} },
                { id: "tools", label: "Tools", group: "Pagine", hint: "/tools", onSelect: () => {} },
                { id: "theme", label: "Toggle theme", group: "Azioni", hint: "⌘D", onSelect: () => {} },
                { id: "copy", label: "Copy current URL", group: "Azioni", hint: "⌘L", onSelect: () => {} },
            ]}
        />
    );
}
