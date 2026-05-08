"use client";

import { useId, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export type TabKey = "preview" | "code";

export type PreviewTabsProps = {
    /** Live preview content. */
    preview: ReactNode;
    /** Code panel content (typically a CodeBlock). */
    code?: ReactNode;
    defaultTab?: TabKey;
    /** Optional aside rendered to the right of the tab list (e.g. a small mono caption). */
    aside?: ReactNode;
    /** When true, the preview escapes the 480px content cap and fills the available width. */
    bleed?: boolean;
    className?: string;
};

const TABS: { key: TabKey; label: string }[] = [
    { key: "preview", label: "Anteprima" },
    { key: "code", label: "Codice" },
];

export function PreviewTabs({
    preview,
    code,
    defaultTab = "preview",
    aside,
    bleed = false,
    className,
}: PreviewTabsProps) {
    const [active, setActive] = useState<TabKey>(defaultTab);
    const id = useId();
    const items = code ? TABS : TABS.filter((t) => t.key === "preview");

    return (
        <div className={cn("overflow-hidden rounded-[9px] border border-border bg-bg", className)}>
            <div
                role="tablist"
                aria-orientation="horizontal"
                className="flex items-center justify-between gap-3 border-b border-border bg-bg-alt pl-1 pr-3"
            >
                <div className="flex">
                    {items.map((tab) => {
                        const isActive = tab.key === active;
                        return (
                            <button
                                key={tab.key}
                                id={`${id}-tab-${tab.key}`}
                                role="tab"
                                type="button"
                                aria-selected={isActive}
                                aria-controls={`${id}-panel-${tab.key}`}
                                onClick={() => setActive(tab.key)}
                                className={cn(
                                    "relative px-3 py-2 font-mono text-[11px] uppercase tracking-[0.06em] transition-colors",
                                    isActive
                                        ? "text-fg"
                                        : "text-fg-muted hover:text-fg",
                                )}
                            >
                                {tab.label}
                                <span
                                    aria-hidden
                                    className={cn(
                                        "absolute inset-x-2 -bottom-px h-0.5 rounded-none transition-colors",
                                        isActive ? "bg-fg" : "bg-transparent",
                                    )}
                                />
                            </button>
                        );
                    })}
                </div>
                {aside ? (
                    <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-fg-soft">
                        {aside}
                    </span>
                ) : null}
            </div>

            {items.map((tab) => {
                const isActive = tab.key === active;
                return (
                    <div
                        key={tab.key}
                        id={`${id}-panel-${tab.key}`}
                        role="tabpanel"
                        aria-labelledby={`${id}-tab-${tab.key}`}
                        hidden={!isActive}
                    >
                        {tab.key === "preview" ? (
                            <div
                                className={cn(
                                    "grid-dots flex min-h-[180px] w-full items-center justify-center",
                                    bleed ? "p-0" : "px-5 py-8 sm:px-8",
                                )}
                            >
                                <div
                                    className={cn(
                                        "w-full",
                                        !bleed && "max-w-[480px]",
                                    )}
                                >
                                    {preview}
                                </div>
                            </div>
                        ) : (
                            <div>{code}</div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
