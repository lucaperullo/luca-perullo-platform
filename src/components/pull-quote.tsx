import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type PullQuoteProps = {
    children: ReactNode;
    /** Author name. */
    by?: string;
    /** Role / source line, shown after the author name. */
    role?: string;
    /** Mono kicker label (e.g. "Note · 03"). Defaults to "Quote". */
    kicker?: string;
    /** Numeric index — paddato a 02 — rendered as the kicker suffix. */
    index?: number;
    className?: string;
};

export function PullQuote({
    children,
    by,
    role,
    kicker = "Quote",
    index,
    className,
}: PullQuoteProps) {
    const padded = typeof index === "number" ? String(index).padStart(2, "0") : null;

    return (
        <figure
            className={cn(
                "relative grid grid-cols-[1px_minmax(0,1fr)] gap-x-4 sm:gap-x-5",
                className,
            )}
        >
            <span aria-hidden className="row-span-2 self-stretch bg-border" />
            <header className="flex items-baseline gap-2 font-mono text-[10.5px] uppercase tracking-[0.1em] text-fg-soft">
                <span>{kicker}</span>
                {padded ? (
                    <>
                        <span aria-hidden>·</span>
                        <span className="text-fg-muted">{padded}</span>
                    </>
                ) : null}
            </header>
            <blockquote className="mt-2 text-balance text-[18px] font-medium leading-[1.45] tracking-[-0.005em] text-fg sm:text-[20px]">
                <span aria-hidden className="mr-1 select-none text-fg-soft">«</span>
                {children}
                <span aria-hidden className="ml-1 select-none text-fg-soft">»</span>
            </blockquote>
            {by || role ? (
                <figcaption className="col-start-2 mt-3 flex flex-wrap items-baseline gap-x-2 text-[12.5px] text-fg-muted">
                    {by ? <span className="font-medium text-fg">{by}</span> : null}
                    {by && role ? <span aria-hidden>·</span> : null}
                    {role ? <span>{role}</span> : null}
                </figcaption>
            ) : null}
        </figure>
    );
}
