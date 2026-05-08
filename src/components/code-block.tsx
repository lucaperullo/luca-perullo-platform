import { CopyButton } from "@/components/copy-button";
import { cn } from "@/lib/utils";

export type CodeBlockProps = {
    code: string;
    /** Filename or label shown in the toolbar (e.g. "src/components/section-label.tsx"). */
    filename?: string;
    /** Language label shown in the toolbar (e.g. "tsx"). */
    language?: string;
    className?: string;
    /** Cap the visible height; user can scroll for the rest. */
    maxHeight?: number;
    /** When true, the copy button only appears on hover (chanhdai-style). */
    floatingCopy?: boolean;
};

export function CodeBlock({
    code,
    filename,
    language = "tsx",
    className,
    maxHeight = 480,
    floatingCopy = false,
}: CodeBlockProps) {
    return (
        <div
            className={cn(
                "group/pre relative overflow-hidden rounded-[9px] border border-border bg-bg",
                className,
            )}
        >
            {(filename || !floatingCopy) ? (
                <div className="flex items-center justify-between gap-3 border-b border-border bg-bg-alt px-3 py-2">
                    <div className="flex min-w-0 items-center gap-2 font-mono text-[11px] uppercase tracking-[0.06em] text-fg-muted">
                        <span className="rounded-sm border border-border bg-bg px-1.5 py-0.5 text-fg-soft">
                            {language}
                        </span>
                        {filename ? (
                            <span className="truncate text-[11px] normal-case tracking-normal text-fg-muted">
                                {filename}
                            </span>
                        ) : null}
                    </div>
                    {!floatingCopy ? (
                        <CopyButton value={code} label="Copy" tone="ghost" />
                    ) : null}
                </div>
            ) : null}

            {floatingCopy ? (
                <div className="absolute right-2 top-2 z-10 opacity-0 transition-opacity group-hover/pre:opacity-100 focus-within:opacity-100">
                    <CopyButton
                        value={code}
                        label="Copy"
                        tone="secondary"
                        iconOnly
                        ariaLabel="Copia il codice"
                    />
                </div>
            ) : null}

            <div
                className="relative overflow-auto"
                style={{ maxHeight: `${maxHeight}px` }}
            >
                <pre className="m-0 px-4 py-4 font-mono text-[12.5px] leading-[1.65] text-fg">
                    <code>{code}</code>
                </pre>
            </div>
        </div>
    );
}
