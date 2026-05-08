import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type PreviewFrameProps = {
    children: ReactNode;
    /** Visual label shown in the toolbar (e.g. "Anteprima"). */
    label?: string;
    /** Right-rail label, defaults to a faint "live · server" stamp. */
    aside?: string;
    /** When true, paints a subtle dotted-grid backdrop instead of the flat alt surface. */
    grid?: boolean;
    /** When true, paints a chanhdai-style 315° diagonal hatch. Mutually exclusive with `grid`. */
    hatch?: boolean;
    className?: string;
    /** Min height in px so empty / tiny components still feel framed. */
    minHeight?: number;
    /** Hide the toolbar entirely. */
    bare?: boolean;
};

export function PreviewFrame({
    children,
    label = "Anteprima",
    aside = "live · server",
    grid = false,
    hatch = false,
    className,
    minHeight = 160,
    bare = false,
}: PreviewFrameProps) {
    return (
        <div
            className={cn(
                "overflow-hidden rounded-[9px] border border-border bg-bg",
                className,
            )}
        >
            {!bare ? (
                <div className="flex items-center justify-between gap-3 border-b border-border bg-bg-alt px-3 py-2">
                    <span className="font-mono text-[11px] uppercase tracking-[0.06em] text-fg-muted">
                        {label}
                    </span>
                    {aside ? (
                        <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-fg-soft">
                            {aside}
                        </span>
                    ) : null}
                </div>
            ) : null}
            <div
                className={cn(
                    "relative flex w-full items-center justify-center px-5 py-8 sm:px-8",
                    !grid && !hatch ? "bg-bg-alt" : null,
                    grid ? "grid-dots" : null,
                    hatch ? "stripe-rule" : null,
                )}
                style={{ minHeight }}
            >
                <div className="w-full max-w-[480px]">{children}</div>
            </div>
        </div>
    );
}
